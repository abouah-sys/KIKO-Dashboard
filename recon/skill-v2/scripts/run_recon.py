#!/usr/bin/env python3
"""The Cin7 <-> Xero master recon engine.

Runs all 13 integrity checks off the exports in the inputs folder and writes
a single run JSON (the machine-readable audit record consumed by
build_dashboard.py) plus, with --xlsx, an Excel audit pack.

Usage:
    python3 run_recon.py <inputs folder> --client "Kiko Vitamins (Pty) Ltd" \
        --cadence monthly --out run.json [--config recon_config.json] [--xlsx pack.xlsx]

Every number in the output is computed from the exports; nothing is invented.
Check logic and status thresholds are documented in
references/check-catalogue.md - keep the two in sync.
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from common import (REGISTRY, REQUIRED, discover, load_report, to_num,
                    xero_tb_movements, norm)

DEFAULT_CONFIG = {
    "currency": "R",
    "tie_tolerance": 1.00,          # cents-level noise allowed on doc matching
    "tb_small_diff": 1000.00,       # TB: below this a mismatch is "small diff"
    "cogs_watch_pct": 0.10,         # COGS recon: |variance| above this -> watch
    "gp_loss_deep": -0.20,          # GP%: at/below this -> deep loss (action)
    "cn_prefixes": ["CR-", "CN-"],  # credit note number prefixes
    # Accounts where Cin7-vs-Xero TB differences are EXPECTED because Xero
    # carries finance activity Cin7 never sees. Matched on account name.
    "tb_expected_patterns": [
        "bank", "vat", "control account", "supplier credit", "payroll",
        "paystack", "payfast", "stripe", "shopify", "clearing", "suspense",
        "loan", "tax", "wages", "salaries", "accounts payable",
        "accounts receivable", "debtors", "creditors", "rounding",
        "historical adjustment",
    ],
    # Client-specific finance accounts (bank names etc.) that the generic
    # patterns cannot know - add on first-run calibration, e.g. ["fnb"].
    "tb_expected_extra": [],
}

S_CLEAR, S_WATCH, S_ACTION, S_INFO, S_NOTRUN = "clear", "watch", "action", "info", "not_run"


def _rows(df, cols, limit=200):
    """DataFrame -> list of dicts, JSON-safe, capped."""
    out = []
    for _, r in df.head(limit).iterrows():
        d = {}
        for c in cols:
            v = r.get(c)
            if pd.isna(v):
                d[c] = None
            elif isinstance(v, (pd.Timestamp, datetime)):
                d[c] = v.strftime("%Y-%m-%d")
            elif isinstance(v, float):
                d[c] = round(v, 2)
            else:
                d[c] = v
        out.append(d)
    return out


# Which system each check's exceptions live in - shown on the dashboard so
# the fixer knows where to go without reading the detail.
SYSTEM = {
    "xero_sync": "Cin7 → Xero sync", "sales_recon": "Both systems",
    "unallocated_cn": "Cin7", "cogs_recon": "Cin7",
    "pending_po": "Cin7", "cn_restock": "Cin7", "tb": "Both systems",
    "stock_inv_match": "Cin7", "txn_vs_soh": "Cin7 GL",
    "quotes": "Cin7", "pending_so": "Cin7",
    "account_values": "Cin7", "gp_product": "Cin7",
}


def check(key, title, status, exceptions, value, headline, columns=None,
          rows=None, detail=None, resolution=""):
    return {
        "key": key, "title": title, "status": status,
        "system": SYSTEM.get(key, "Cin7"),
        "exceptions": int(exceptions), "value": None if value is None else round(float(value), 2),
        "headline": headline, "columns": columns or [],
        "rows": rows or [], "detail": detail or {}, "resolution": resolution,
    }


def not_run(key, title, reason):
    return check(key, title, S_NOTRUN, 0, None, f"Not run - {reason}")


# ---------------------------------------------------------------------------
# The 13 checks
# ---------------------------------------------------------------------------

def chk_xero_sync(R, cfg):
    t = "Xero sync analysis"
    if "xero_sync" not in R:
        return not_run("xero_sync", t, "Xero Synchronisation Report missing")
    df = R["xero_sync"]
    status_col = df["status"].astype(str).str.strip()
    counts = {s: int((status_col == s).sum()) for s in ("Completed", "Failed", "Warning")}
    issues = df[status_col.isin(["Failed", "Warning"])].copy()

    def classify(msg):
        m = str(msg).lower()
        if "credit note status is paid" in m and "void" in m:
            return "Void blocked - credit note paid"
        if "invoice status is paid" in m and "void" in m:
            return "Void blocked - invoice paid"
        if "already paid" in m or ("payment" in m and "paid" in m):
            return "Payment blocked - invoice already paid"
        if "paid" in m:
            return "Invoice paid in Xero - update blocked"
        return "Other sync failure"

    issues["issue type"] = issues["message"].apply(classify)
    by_type = issues["issue type"].value_counts().to_dict()
    n = len(issues)
    cols = ["cin7 core number", "type", "status", "issue type", "message"]
    keep = issues[[c for c in cols if c in issues.columns]].drop_duplicates(
        subset=["cin7 core number", "status"], keep="first")
    return check(
        "xero_sync", t,
        S_ACTION if n else S_CLEAR, n, None,
        (f"{n} sync entries Failed or Warning ({counts['Failed']} failed, "
         f"{counts['Warning']} warning) out of {counts['Completed'] + n} synced")
        if n else f"All {counts['Completed']} sync entries completed clean",
        columns=[c for c in cols if c in issues.columns],
        rows=_rows(keep, [c for c in cols if c in issues.columns]),
        detail={"status_counts": counts, "by_issue_type": by_type},
        resolution=("Most errors mean Cin7 re-pushed a document already PAID in Xero. "
                    "If Xero is correct: Cin7 -> Xero Sync History -> set entry to Skipped "
                    "(bulk-select Failed/Warning works). If the Cin7 change must reach Xero: "
                    "remove the payment in Xero, re-sync, re-apply the payment."),
    )


def chk_sales_recon(R, cfg):
    t = "Sales - Xero vs Cin7 (document level)"
    if "account_transactions" not in R or "sale_invoices_cn" not in R:
        return not_run("sales_recon", t, "Account Transactions or Sale Invoices & Credit Notes missing")
    tol = cfg["tie_tolerance"]
    ax = R["account_transactions"]
    c7 = R["sale_invoices_cn"]

    # Compare EX-VAT (Xero Net vs Cin7 Amount) so VAT-rate noise never masks
    # or fakes a difference; documents are matched by number.
    xr = ax[ax["source"].astype(str).str.strip().isin(
        ["Receivable Invoice", "Receivable Credit Note"])].copy()

    # Drop balance-sheet legs. Some tenants' Account Transactions exports
    # populate Net on the AR-control and VAT-control legs of every document,
    # which counts each invoice up to three times (Kiko Jul 2026: 1,089
    # phantom mismatches, R4.9m vs a true R2.2m). Only the P&L legs carry the
    # ex-VAT document amount this check compares. Balance-sheet accounts are
    # identified from the export's own Account Type column when present,
    # otherwise from the Xero Trial Balance's Account Type column; a tenant
    # offering neither keeps the old behaviour unchanged.
    bs_pat = re.compile(
        r"asset|liabilit|equity|bank|receivable|payable|inventory|prepayment|"
        r"fixed|current|accounts rec|accounts pay", re.I)
    dropped, bs_basis = 0, None
    if "account type" in xr.columns:
        is_bs = xr["account type"].astype(str).str.strip().str.match(bs_pat)
        dropped, bs_basis = int(is_bs.sum()), "Account Type column in the export"
        xr = xr[~is_bs.fillna(False)]
    elif "xero_tb" in R:
        try:
            tb_raw = R["xero_tb"]
            hdr = None
            for i in range(min(10, len(tb_raw))):
                cells = [norm(c) for c in tb_raw.iloc[i]]
                if "account code" in cells and "account type" in cells:
                    hdr, cc, tc = i, cells.index("account code"), cells.index("account type")
                    break
            if hdr is not None:
                bs_codes = {str(tb_raw.iat[i, cc]).strip()
                            for i in range(hdr + 1, len(tb_raw))
                            if tb_raw.iat[i, cc] is not None
                            and bs_pat.search(str(tb_raw.iat[i, tc] or ""))}
                is_bs = xr["account code"].astype(str).str.strip().isin(bs_codes)
                dropped, bs_basis = int(is_bs.sum()), "Account Types from the Xero Trial Balance"
                xr = xr[~is_bs]
        except Exception:
            pass  # no classification available; old behaviour

    xr["amt"] = to_num(xr["net"])
    xero = xr.groupby(xr["number"].astype(str).str.strip())["amt"].sum().round(2)
    xero = xero[xero.index != ""]

    c7d = c7.copy()
    c7d["amt"] = to_num(c7d["amount"])
    cin7 = c7d.groupby(c7d["document #"].astype(str).str.strip())["amt"].sum().round(2)
    cin7 = cin7[cin7.index != ""]

    prefixes = tuple(cfg["cn_prefixes"])
    is_cn = lambda k: k.upper().startswith(prefixes)

    only_x = [(k, v) for k, v in xero.items() if k not in cin7.index and abs(v) >= tol]
    only_c = [(k, v) for k, v in cin7.items() if k not in xero.index and abs(v) >= tol]
    both = xero.index.intersection(cin7.index)
    diffs = [(k, xero[k], cin7[k], round(xero[k] - cin7[k], 2))
             for k in both if abs(xero[k] - cin7[k]) >= tol]

    s1 = [(k, v) for k, v in only_x if not is_cn(k)]   # invoices on Xero only
    s2 = [(k, v) for k, v in only_c if not is_cn(k)]   # invoices on Cin7 only
    s3 = [(k, v) for k, v in only_x if is_cn(k)]       # CNs on Xero only
    s4 = [(k, v) for k, v in only_c if is_cn(k)]       # CNs on Cin7 only
    total_x, total_c = float(xero.sum()), float(cin7.sum())
    reconciled = (total_x - sum(v for _, v in s1) - sum(v for _, v in s3)
                  + sum(v for _, v in s2) + sum(v for _, v in s4)
                  - sum(d for *_, d in diffs))
    final_diff = round(reconciled - total_c, 2)

    n = len(s1) + len(s2) + len(s3) + len(s4) + len(diffs)
    rows = ([{"document": k, "section": "1) Invoice on Xero not Cin7", "xero": round(v, 2),
              "cin7": None, "difference": None} for k, v in s1]
            + [{"document": k, "section": "2) Invoice on Cin7 not Xero", "xero": None,
                "cin7": round(v, 2), "difference": None} for k, v in s2]
            + [{"document": k, "section": "3) Credit note on Xero not Cin7", "xero": round(v, 2),
                "cin7": None, "difference": None} for k, v in s3]
            + [{"document": k, "section": "4) Credit note on Cin7 not Xero", "xero": None,
                "cin7": round(v, 2), "difference": None} for k, v in s4]
            + [{"document": k, "section": "5) Amount differs", "xero": round(x, 2),
                "cin7": round(c, 2), "difference": d} for k, x, c, d in diffs])
    impact = sum(abs(v) for _, v in only_x) + sum(abs(v) for _, v in only_c) \
        + sum(abs(d) for *_, d in diffs)
    return check(
        "sales_recon", t,
        S_ACTION if n else S_CLEAR, n, impact,
        (f"{n} documents do not match between systems "
         f"(Xero total {cfg['currency']}{total_x:,.2f} vs Cin7 {cfg['currency']}{total_c:,.2f}; "
         f"bridge closes to {cfg['currency']}{final_diff:,.2f})")
        if n else
        f"Every invoice and credit note matches (Xero {cfg['currency']}{total_x:,.2f} = Cin7)",
        columns=["document", "section", "xero", "cin7", "difference"],
        rows=rows,
        detail={"total_xero": round(total_x, 2), "total_cin7": round(total_c, 2),
                "final_difference": final_diff,
                "bs_legs_dropped": dropped,
                "bs_leg_basis": bs_basis or "none available (no Account Type source)",
                "sections": {"xero_only_inv": len(s1), "cin7_only_inv": len(s2),
                             "xero_only_cn": len(s3), "cin7_only_cn": len(s4),
                             "amount_diffs": len(diffs)}},
        resolution=("Sections 1/3: document exists in Xero only - usually manual Xero entries "
                    "or consolidated Cin7 pushes; confirm intent, then create or sync the Cin7 side "
                    "or accept as Xero-manual. Sections 2/4: Cin7 document never reached Xero - "
                    "check Xero Sync History and re-sync. Section 5: line-level edits in one "
                    "system only - open both documents and align."),
    )


def chk_unallocated_cn(R, cfg):
    t = "Unallocated credit notes (Cin7)"
    if "sale_overview" not in R:
        return not_run("unallocated_cn", t, "Sale Overview missing")
    so = R["sale_overview"].copy()
    pat = "|".join(re.escape(p) for p in cfg["cn_prefixes"])
    mask = so["invoice #"].astype(str).str.contains(pat, na=False) & \
        (to_num(so["due"]).abs() >= 0.01)
    ex = so[mask].copy()
    ex["due"] = to_num(ex["due"])
    value = float(ex["due"].sum())
    cols = ["invoice #", "customer", "order date", "status", "invoice", "due"]
    return check(
        "unallocated_cn", t,
        S_ACTION if len(ex) else S_CLEAR, len(ex), value,
        (f"{len(ex)} credit note lines carry an unsettled balance "
         f"({cfg['currency']}{value:,.2f} due)") if len(ex)
        else "No credit notes carrying an unsettled balance",
        columns=cols, rows=_rows(ex, cols),
        detail={},
        resolution=("A credited sale should net to zero due. Open each credit note in Cin7, "
                    "allocate it against its invoice (or refund it), and confirm the pair "
                    "washes to nil in Xero AR."),
    )


def chk_cogs_recon(R, cfg):
    t = "COGS reconciliation (investigation)"
    if "sale_overview" not in R or "inv_movement_details" not in R:
        return not_run("cogs_recon", t, "Sale Overview or Inventory Movement Details missing")
    so, imd = R["sale_overview"], R["inv_movement_details"]
    sales_cogs = float(to_num(so["cogs"]).sum())
    out = imd[imd["type"].astype(str).str.strip() == "Out"].copy()
    out["cost out"] = to_num(out["cost out"])
    by_ref = out.groupby(out["reference type"].astype(str).str.strip())["cost out"].sum()
    stock_cogs = float(by_ref.get("Sale", 0) + by_ref.get("SaleMultiple", 0))
    var = stock_cogs - sales_cogs
    var_pct = var / sales_cogs if sales_cogs else 0.0
    sale_mask = out["reference type"].astype(str).str.strip().isin(["Sale", "SaleMultiple"])
    by_loc = out[sale_mask].groupby(out["location"].astype(str))["cost out"].sum()
    revenue = float(to_num(so["sale"]).sum())
    status = S_WATCH if abs(var_pct) > cfg["cogs_watch_pct"] else S_INFO
    return check(
        "cogs_recon", t, status, 0, var,
        (f"Stock cost-out {cfg['currency']}{stock_cogs:,.2f} vs sales COGS "
         f"{cfg['currency']}{sales_cogs:,.2f}: variance {cfg['currency']}{var:,.2f} "
         f"({var_pct:+.1%}). Not a pass/fail tie - the two measure cost of sales "
         "differently; investigate if the gap is large or growing."),
        columns=["measure", "value"],
        rows=[{"measure": "Sale Overview COGS (sales side)", "value": round(sales_cogs, 2)},
              {"measure": "Inventory cost-out: Sale + SaleMultiple", "value": round(stock_cogs, 2)},
              {"measure": "Variance (stock - sales)", "value": round(var, 2)},
              {"measure": "Implied GM% (sales COGS)",
               "value": round(1 - sales_cogs / revenue, 4) if revenue else None},
              {"measure": "Implied GM% (stock cost-out)",
               "value": round(1 - stock_cogs / revenue, 4) if revenue else None}]
        + [{"measure": f"Cost-out by type: {k}", "value": round(float(v), 2)}
           for k, v in by_ref.items()]
        + [{"measure": f"Sale cost-out by location: {k}", "value": round(float(v), 2)}
           for k, v in by_loc.items()],
        detail={"variance_pct": round(var_pct, 4)},
        resolution=("Differences come from bundles/kits (assembly cost-out lands in "
                    "FinishedGoods), consignment/channel locations, and order status timing. "
                    "A large or growing gap can mean COGS is misstated in one system - "
                    "trace the by-type and by-location breakdown."),
    )


def chk_pending_po(R, cfg):
    t = "Pending purchase orders review"
    if "pending_po" not in R:
        return not_run("pending_po", t, "Pending Purchase Orders report missing")
    po = R["pending_po"].copy()
    po["ordered"], po["to invoice"], po["to receive"] = (
        to_num(po["ordered"]), to_num(po["to invoice"]), to_num(po["to receive"]))
    def action(r):
        acts = []
        if r["to receive"] < r["to invoice"]:
            acts.append("Input invoice")
        if r["to receive"] > r["to invoice"]:
            acts.append("Receive stock")
        if r["ordered"] == r["to invoice"] == r["to receive"]:
            acts.append("Void if order not valid, else progress it")
        return " / ".join(acts) if acts else "Complete order"
    po["action needed"] = po.apply(action, axis=1)
    n = len(po)
    cols = ["po #", "po date", "sku", "product", "status", "supplier",
            "ordered", "to invoice", "to receive", "action needed"]
    cols = [c for c in cols if c in po.columns]
    return check(
        "pending_po", t,
        S_WATCH if n else S_CLEAR, n, None,
        f"{n} PO lines still pending across {po['po #'].nunique()} orders" if n
        else "No pending purchase orders",
        columns=cols, rows=_rows(po, cols),
        detail={"orders": int(po["po #"].nunique()) if n else 0},
        resolution=("Work each line: enter the supplier invoice where stock is received but "
                    "uninvoiced, receive stock where invoiced but not received, and void "
                    "stale orders that will never be fulfilled."),
    )


def chk_cn_restock(R, cfg):
    t = "Sale credit notes not restocked"
    if "sale_invoices_cn" not in R or "inv_movement_details" not in R:
        return not_run("cn_restock", t, "Sale Invoices & Credit Notes or Inventory Movement Details missing")
    inv, imd = R["sale_invoices_cn"], R["inv_movement_details"]
    prefixes = tuple(cfg["cn_prefixes"])
    cn = inv[inv["document #"].astype(str).str.upper().str.startswith(prefixes)].copy()
    cn = cn[cn["sku"].notna() & (cn["sku"].astype(str).str.strip() != "")]

    # Exclude service lines (shipping, fees, collection charges): a SKU that
    # never appears in the inventory ledger is not stock and can never be
    # restocked, so flagging it is noise (Kiko Jul 2026: six of ten flags
    # were shipping lines). Stock SKUs = everything the Inventory Movement
    # Details or Summary has ever seen.
    stock_skus = set(R["inv_movement_details"]["sku"].astype(str).str.strip())
    if "inv_movement_summary" in R:
        stock_skus |= set(R["inv_movement_summary"]["sku"].astype(str).str.strip())
    stock_skus.discard("")
    is_service = ~cn["sku"].astype(str).str.strip().isin(stock_skus)
    service_excluded = int(is_service.sum())
    cn = cn[~is_service]
    if cn.empty:
        return check("cn_restock", t, S_CLEAR, 0, None,
                     "No credit notes with stock lines in the period",
                     resolution="")
    cn["qty"] = to_num(cn["quantity"]).abs()
    cn_by_sku = cn.groupby(cn["sku"].astype(str).str.strip()).agg(
        cn_docs=("document #", lambda s: ", ".join(sorted(set(map(str, s))))),
        cn_lines=("document #", "size"), qty_credited=("qty", "sum"),
        cn_value=("total", lambda s: to_num(s).sum()))
    ins = imd[(imd["type"].astype(str).str.strip() == "In")
              & imd["reference type"].astype(str).str.strip().isin(["Sale", "SaleMultiple"])].copy()
    restock = ins.groupby(ins["sku"].astype(str).str.strip()).agg(
        qty_restocked=("quantity in", lambda s: to_num(s).sum()),
        restock_cost=("cost in", lambda s: to_num(s).sum()))
    m = cn_by_sku.join(restock, how="left").fillna({"qty_restocked": 0, "restock_cost": 0})
    m["shortfall"] = m["qty_credited"] - m["qty_restocked"]
    m["restock status"] = m["shortfall"].apply(
        lambda x: "Not restocked" if x > 0 else ("Over-restocked" if x < 0 else "Restocked"))
    ex = m[m["shortfall"] != 0].reset_index().rename(columns={"index": "sku"})
    n = len(ex)
    ex["cn_value"] = ex["cn_value"].round(2)
    cols = ["sku", "cn_docs", "qty_credited", "qty_restocked", "shortfall",
            "cn_value", "restock status"]
    return check(
        "cn_restock", t,
        S_WATCH if n else S_CLEAR, n, float(ex["cn_value"].sum()) if n else 0,
        (f"{n} SKUs where credit-note quantity does not equal restocked quantity")
        if n else "Every credited stock line was restocked",
        columns=cols, rows=_rows(ex, cols),
        detail={"skus_checked": len(m), "service_lines_excluded": service_excluded},
        resolution=("Per SKU, credited units should re-enter stock (Sale/SaleMultiple, Type=In) "
                    "unless genuinely not returned (damaged/kept). Restock the missing units in "
                    "Cin7, or record why not (write-off) so inventory and COGS stay true. "
                    "Service-only credit lines (shipping, fees) are excluded."),
    )


def chk_tb(R, cfg):
    t = "Trial Balance - Cin7 vs Xero"
    if "cin7_tb" not in R or "xero_tb" not in R:
        return not_run("tb", t, "Cin7 Trial Balance or Xero Trial Balance missing")
    c7 = R["cin7_tb"].copy()
    c7 = c7[c7["account code"].notna()]
    c7["movement"] = to_num(c7["debit"]) - to_num(c7["credit"])
    xero, tb_basis = xero_tb_movements(R["xero_tb"])

    tol, small = cfg["tie_tolerance"], cfg["tb_small_diff"]
    patterns = [p.lower() for p in
                cfg["tb_expected_patterns"] + cfg.get("tb_expected_extra", [])]
    rows, n_action, n_small, n_ok, n_expected, unmatched_c7 = [], 0, 0, 0, 0, 0
    for _, r in c7.iterrows():
        code = str(r["account code"]).strip()
        name = str(r.get("description", "")).strip()
        mv = float(r["movement"])
        x = xero.get(code)
        if x is None:
            if abs(mv) <= tol:
                n_expected += 1
                rows.append({"account": f"{code} {name}",
                             "class": str(r.get("account class", "")),
                             "cin7": round(mv, 2), "xero": None, "difference": None,
                             "status": "Dormant in Cin7 - no Xero match (not flagged)"})
            else:
                unmatched_c7 += 1
                rows.append({"account": f"{code} {name}",
                             "class": str(r.get("account class", "")),
                             "cin7": round(mv, 2), "xero": None, "difference": None,
                             "status": "No Xero match (check account mapping)"})
            continue
        diff = mv - x["movement"]
        finance = any(p in name.lower() for p in patterns)
        if abs(diff) <= tol:
            n_ok += 1
            status = "OK (tie)"
        elif abs(mv) < 0.01 or finance:
            n_expected += 1
            status = ("Xero-only activity (no Cin7 movement)" if abs(mv) < 0.01
                      else "Expected - finance/non-inventory")
        elif abs(diff) <= small:
            n_small += 1
            status = "Small diff"
        else:
            n_action += 1
            status = "REVIEW - large gap (possible sync issue)"
        rows.append({"account": f"{code} {name}", "class": str(r.get("account class", "")),
                     "cin7": round(mv, 2), "xero": round(x["movement"], 2),
                     "difference": round(diff, 2), "status": status})
    order = {"REVIEW - large gap (possible sync issue)": 0,
             "No Xero match (check account mapping)": 1, "Small diff": 2,
             "Expected - finance/non-inventory": 3,
             "Xero-only activity (no Cin7 movement)": 4,
             "Dormant in Cin7 - no Xero match (not flagged)": 5, "OK (tie)": 6}
    rows.sort(key=lambda r: (order.get(r["status"], 9), -(abs(r["difference"] or 0))))
    xero_only = len(xero) - (len(c7) - unmatched_c7)
    status = S_ACTION if n_action else (S_WATCH if n_small or unmatched_c7 else S_CLEAR)
    review_value = sum(abs(r["difference"]) for r in rows
                       if r["status"].startswith("REVIEW") and r["difference"])
    return check(
        "tb", t, status, n_action + n_small + unmatched_c7, review_value,
        (f"{n_action} accounts with large Cin7-vs-Xero gaps"
         f"{f', {n_small} small diffs' if n_small else ''}"
         f"{f', {unmatched_c7} Cin7 accounts unmatched in Xero' if unmatched_c7 else ''} "
         f"({n_ok} tie clean; {n_expected} expected finance/Xero-only)")
        if (n_action or n_small or unmatched_c7) else
        f"All matched accounts tie ({n_ok} clean, {n_expected} expected finance-only)",
        columns=["account", "class", "cin7", "xero", "difference", "status"],
        rows=rows,
        detail={"cin7_accounts": len(c7), "review_large": n_action, "small_diff": n_small,
                "ok": n_ok, "expected": n_expected, "cin7_unmatched": unmatched_c7,
                "xero_only_accounts": max(xero_only, 0),
                "xero_movement_basis": tb_basis},
        resolution=("This is a difference map, not a tie-out: Xero carries finance activity "
                    "(bank, VAT, payroll, journals) Cin7 never sees - those are tagged Expected "
                    "and not flagged. A REVIEW gap means Cin7 posted movement that never landed "
                    "in Xero (or vice versa): cross-check the account against the Xero sync "
                    "failures and the sales recon, and fix the sync, not the ledger."),
    )


def chk_stock_inv_match(R, cfg):
    t = "Stock received vs invoiced"
    if "stock_received_vs_invoiced" not in R:
        return not_run("stock_inv_match", t, "Stock Received vs Invoiced report missing")
    df = R["stock_received_vs_invoiced"].copy()
    df["received"], df["invoiced"] = to_num(df["received"]), to_num(df["invoiced"])
    df["difference"] = df["received"] - df["invoiced"]
    ex = df[df["difference"].abs() >= 0.01].copy()
    need_inv = int((ex["difference"] > 0).sum())
    awaiting = int((ex["difference"] < 0).sum())
    po_value = float(to_num(ex.get("po total", pd.Series(dtype=float))).sum())
    cols = ["po #", "invoice #", "sku", "product", "supplier", "received",
            "invoiced", "difference", "po total", "status"]
    cols = [c for c in cols if c in ex.columns]
    status = S_ACTION if need_inv else (S_WATCH if awaiting else S_CLEAR)
    return check(
        "stock_inv_match", t, status, len(ex), po_value,
        (f"{need_inv} lines received but not invoiced (GRNI exposure), "
         f"{awaiting} lines invoiced but stock not yet received")
        if len(ex) else "Every receipt matches its supplier invoice",
        columns=cols, rows=_rows(ex, cols),
        detail={"need_invoice": need_inv, "awaiting_stock": awaiting,
                "matched": int(len(df) - len(ex))},
        resolution=("Received > invoiced: chase and capture the supplier invoice - until then "
                    "the value sits in GRNI and creditors are understated. Invoiced > received: "
                    "confirm the stock is genuinely in transit, or the invoice was over-captured."),
    )


def chk_txn_vs_soh(R, cfg):
    t = "Transactions vs stock on hand (GL integrity)"
    if "txn_vs_soh" not in R:
        return not_run("txn_vs_soh", t, "Transactions vs Stock on Hand Difference report missing")
    df = R["txn_vs_soh"].copy()
    df["stock amount"], df["document amount"] = (
        to_num(df["stock amount"]), to_num(df["document amount"]))
    df["difference"] = df["document amount"] - df["stock amount"]
    ex = df[df["difference"].abs() >= 0.01].copy()
    net = float(ex["difference"].sum())
    by_type = ex.groupby(ex["transaction type"].astype(str)).agg(
        lines=("difference", "size"), net=("difference", "sum"))
    cols = ["task #", "account", "transaction type", "stock amount",
            "document amount", "difference"]
    return check(
        "txn_vs_soh", t,
        S_ACTION if len(ex) else S_CLEAR, len(ex), net,
        (f"{len(ex)} transactions where the posted journal does not equal the "
         f"inventory ledger (net {cfg['currency']}{net:,.2f})")
        if len(ex) else "Every posted journal ties to the inventory ledger",
        columns=cols, rows=_rows(ex, cols),
        detail={"by_type": {k: {"lines": int(v["lines"]), "net": round(float(v["net"]), 2)}
                            for k, v in by_type.iterrows()}},
        resolution=("Each line is a document whose GL posting disagrees with the stock ledger - "
                    "classic causes: assemblies posted before completion (WIP), in-transit "
                    "transfers straddling the period end, and purchases with GRNI timing. "
                    "Open each task in Cin7, confirm which side is right, and re-post/complete."),
    )


def chk_quotes(R, cfg):
    t = "Outstanding quotes review"
    if "outstanding_quotes" not in R:
        return not_run("quotes", t, "Sale Outstanding Quotes report missing")
    q = R["outstanding_quotes"].copy()
    q = q[q["order #"].notna() & (q["order #"].astype(str).str.strip() != "")]
    if q.empty:
        return check("quotes", t, S_CLEAR, 0, 0, "No outstanding quotes")
    q["total"] = to_num(q["total"])
    agg = q.groupby(q["order #"].astype(str)).agg(
        customer=("customer", "first"),
        rep=("sales representative", "first") if "sales representative" in q.columns else ("customer", "first"),
        lines=("order #", "size"), qty=("quantity", lambda s: to_num(s).sum()),
        value=("total", "sum")).reset_index()
    val = float(agg["value"].sum())
    cols = ["order #", "customer", "rep", "lines", "qty", "value"]
    return check(
        "quotes", t, S_WATCH, len(agg), val,
        f"{len(agg)} quotes still open worth {cfg['currency']}{val:,.2f}",
        columns=cols, rows=_rows(agg.round(2), cols),
        resolution=("Follow up or void: quotes left open clutter the pipeline and can be "
                    "converted twice. Convert to sale, or void with a reason."),
    )


def chk_pending_so(R, cfg):
    t = "Pending sales orders analysis"
    if "pending_so" not in R:
        return not_run("pending_so", t, "Pending Sale Orders report missing")
    so = R["pending_so"].copy()
    so = so[so["order #"].notna() & (so["order #"].astype(str).str.strip() != "")]
    if so.empty:
        return check("pending_so", t, S_CLEAR, 0, 0, "No pending sales orders")
    qty_col = next((c for c in so.columns if str(c).startswith("quantity required")), None)
    so["qty"] = to_num(so[qty_col]) if qty_col else 0
    agg = so.groupby(so["order #"].astype(str)).agg(
        customer=("customer", "first"),
        channel=("sales representative", "first") if "sales representative" in so.columns else ("customer", "first"),
        lines=("order #", "size"), qty=("qty", "sum")).reset_index()
    cols = ["order #", "customer", "channel", "lines", "qty"]
    return check(
        "pending_so", t, S_WATCH, len(agg), None,
        f"{len(agg)} sales orders pending fulfilment ({int(agg['qty'].sum())} units)",
        columns=cols, rows=_rows(agg, cols),
        resolution=("Pending orders are unfulfilled demand: pick/pack/invoice them, or void "
                    "if the customer cancelled. Anything pending across a month-end understates "
                    "revenue in the period the customer expected."),
    )


def chk_account_values(R, cfg):
    t = "Cin7 account values overview & integrity"
    if "inv_movement_summary" not in R or "sale_overview" not in R:
        return not_run("account_values", t, "Inventory Movement Summary or Sale Overview missing")
    ims, so = R["inv_movement_summary"], R["sale_overview"]
    soh_value = float(to_num(ims["stock on hand"]).sum())
    qty = float(to_num(ims["quantity on hand"]).sum())
    by_loc = ims.groupby(ims["location"].astype(str)).agg(
        value=("stock on hand", lambda s: to_num(s).sum())).round(2)
    inv_incl = float(to_num(so["invoice"]).sum())
    sale_ex = float(to_num(so["sale"]).sum())
    paid, due = float(to_num(so["paid"]).sum()), float(to_num(so["due"]).sum())
    cogs, journals = float(to_num(so["cogs"]).sum()), float(to_num(so["journals"]).sum())
    profit = float(to_num(so["profit"]).sum())
    # Row-level identities
    p_fail = int((abs(to_num(so["sale"]) - to_num(so["cogs"]) + to_num(so["journals"])
                   - to_num(so["profit"])) > 0.01).sum())
    i_fail = int((abs(to_num(so["paid"]) + to_num(so["due"]) - to_num(so["invoice"])) > 0.01).sum())
    n = p_fail + i_fail
    gm = profit / sale_ex if sale_ex else 0
    return check(
        "account_values", t,
        S_ACTION if n else S_INFO, n, soh_value,
        (f"Stock on hand {cfg['currency']}{soh_value:,.2f} ({qty:,.0f} units); revenue "
         f"{cfg['currency']}{sale_ex:,.2f} at {gm:.1%} GM"
         + (f". {n} sale rows break their arithmetic identities - investigate" if n
            else ". Row-level identities (Profit = Sale - COGS + Journals; Invoice = Paid + Due) all hold")),
        columns=["measure", "value"],
        rows=[{"measure": "Stock on hand (value)", "value": round(soh_value, 2)},
              {"measure": "Quantity on hand (units)", "value": round(qty, 0)},
              {"measure": "Invoice (incl VAT)", "value": round(inv_incl, 2)},
              {"measure": "Sale (revenue, ex VAT)", "value": round(sale_ex, 2)},
              {"measure": "Paid", "value": round(paid, 2)},
              {"measure": "Due (debtors outstanding)", "value": round(due, 2)},
              {"measure": "COGS", "value": round(cogs, 2)},
              {"measure": "Journals", "value": round(journals, 2)},
              {"measure": "Profit", "value": round(profit, 2)},
              {"measure": "Gross margin %", "value": round(gm, 4)},
              {"measure": "Implied VAT (Invoice - Sale)", "value": round(inv_incl - sale_ex, 2)},
              {"measure": "Rows failing Profit identity", "value": p_fail},
              {"measure": "Rows failing Invoice = Paid + Due", "value": i_fail}]
        + [{"measure": f"SOH by location: {k}", "value": float(v["value"])}
           for k, v in by_loc.iterrows()],
        detail={"profit_identity_fails": p_fail, "invoice_identity_fails": i_fail},
        resolution=("The stock-on-hand value should tie to the inventory control accounts on "
                    "the Balance Sheet; Due should tie to AR. Identity failures mean a sale row "
                    "was edited inconsistently - open the failing invoices in Cin7."),
    )


def chk_gp_product(R, cfg):
    t = "Gross profit per product"
    if "pl_by_product" not in R:
        return not_run("gp_product", t, "Profit & Loss by Product report missing")
    pl = R["pl_by_product"].copy()
    pl = pl[pl["sku"].notna() & (pl["sku"].astype(str).str.strip().str.lower()
                                  .isin(["", "grand total"]) == False)]
    agg = pl.groupby(pl["sku"].astype(str)).agg(
        product=("product", "first"),
        sales=("sale proceeds", lambda s: to_num(s).sum()),
        cogs=("cogs", lambda s: to_num(s).sum()),
        gp=("profit", lambda s: to_num(s).sum())).reset_index()
    agg["gp_pct"] = agg.apply(lambda r: r["gp"] / r["sales"] if r["sales"] else None, axis=1)
    losers = agg[(agg["gp"] < 0) & (agg["sales"].abs() > 0.01)].copy()
    deep = losers[losers["gp_pct"] <= cfg["gp_loss_deep"]]
    n = len(losers)
    total_gp = float(agg["gp"].sum())
    total_sales = float(agg["sales"].sum())
    show = pd.concat([losers.sort_values("gp"),
                      agg.sort_values("gp", ascending=False).head(10)])
    show = show.drop_duplicates(subset="sku").round({"sales": 2, "cogs": 2, "gp": 2, "gp_pct": 4})
    cols = ["sku", "product", "sales", "cogs", "gp", "gp_pct"]
    status = S_ACTION if len(deep) else (S_WATCH if n else S_CLEAR)
    return check(
        "gp_product", t, status, n, float(losers["gp"].sum()) if n else None,
        (f"{n} SKUs sold at a loss ({len(deep)} at GP% <= {cfg['gp_loss_deep']:.0%}); "
         f"overall GP {cfg['currency']}{total_gp:,.2f} on {cfg['currency']}{total_sales:,.2f}")
        if n else
        f"No loss-making SKUs; overall GP {cfg['currency']}{total_gp:,.2f} "
        f"({(total_gp / total_sales if total_sales else 0):.1%})",
        columns=cols, rows=_rows(show, cols),
        detail={"skus": len(agg), "loss_making": n, "deep_loss": len(deep),
                "overall_gp_pct": round(total_gp / total_sales, 4) if total_sales else None},
        resolution=("A negative GP% often means a costing error (wrong unit cost, missing "
                    "assembly cost) rather than genuine below-cost selling - verify the SKU's "
                    "cost before repricing. Deep-loss SKUs (<= -20%) first."),
    )


CHECKS = [
    chk_xero_sync, chk_sales_recon, chk_unallocated_cn, chk_cogs_recon,
    chk_pending_po, chk_cn_restock, chk_tb, chk_stock_inv_match,
    chk_txn_vs_soh, chk_quotes, chk_pending_so, chk_account_values,
    chk_gp_product,
]

# Weights: how much each check status contributes to overall health.
SCORE = {S_CLEAR: 1.0, S_INFO: 1.0, S_WATCH: 0.5, S_ACTION: 0.0}


def overall_health(checks):
    scored = [c for c in checks if c["status"] in SCORE]
    if not scored:
        return 0.0
    return round(100 * sum(SCORE[c["status"]] for c in scored) / len(scored), 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--client", required=True)
    ap.add_argument("--cadence", choices=["weekly", "monthly", "custom"], default="monthly",
                    help="custom = any dynamic From/To range the exports were pulled for")
    ap.add_argument("--out", default=None, help="Run JSON path (default: run_<period>.json in folder)")
    ap.add_argument("--config", default=None)
    ap.add_argument("--xlsx", default=None, help="Also write an Excel audit pack here")
    args = ap.parse_args()

    cfg = dict(DEFAULT_CONFIG)
    if args.config and Path(args.config).exists():
        cfg.update(json.loads(Path(args.config).read_text()))

    found, _ = discover(args.folder)
    missing = [k for k in REQUIRED if k not in found]
    if missing:
        print("Gate not passed - missing reports (run check_reports.py first):")
        for k in missing:
            print(f"  - {REGISTRY[k]['label']}")
        sys.exit(1)

    R = {}
    for key, path in found.items():
        try:
            R[key] = load_report(path, key=key)
        except Exception as e:
            print(f"WARNING: could not load {REGISTRY[key]['label']}: {e}")

    frm = next((R[k].attrs.get("period_from") for k in
                ("sale_overview", "sale_invoices_cn") if k in R and R[k].attrs.get("period_from")), None)
    to = next((R[k].attrs.get("period_to") for k in
               ("sale_overview", "sale_invoices_cn") if k in R and R[k].attrs.get("period_to")), None)

    results = []
    for fn in CHECKS:
        try:
            results.append(fn(R, cfg))
        except Exception as e:
            name = fn.__name__.replace("chk_", "")
            results.append(not_run(name, name, f"engine error: {e}"))
            print(f"WARNING: {fn.__name__} failed: {e}")

    health = overall_health(results)
    counts = {s: sum(1 for c in results if c["status"] == s)
              for s in (S_ACTION, S_WATCH, S_CLEAR, S_INFO, S_NOTRUN)}

    if args.cadence == "weekly" and frm and to:
        label = f"Week {frm:%d %b} - {to:%d %b %Y}"
    elif args.cadence == "custom" and frm and to:
        label = f"{frm:%d %b} - {to:%d %b %Y}"
    elif frm:
        label = f"{frm:%B %Y}"
    else:
        label = "Unknown period"

    run = {
        "schema": 1,
        "client": args.client,
        "cadence": args.cadence,
        "period_label": label,
        "period_from": str(frm) if frm else None,
        "period_to": str(to) if to else None,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "overall_health": health,
        "status_counts": counts,
        "reports_loaded": {k: Path(str(p)).name for k, p in found.items()},
        "checks": results,
        "findings": [],   # populated during review (see SKILL.md step 5)
    }

    out = Path(args.out) if args.out else Path(args.folder) / f"run_{frm or 'unknown'}.json"
    out.write_text(json.dumps(run, indent=1, default=str))
    print(f"\n{'='*70}\n{args.client} - {label}  |  Overall health {health}%")
    print(f"Action {counts['action']} / Watch {counts['watch']} / Clear {counts['clear']} "
          f"/ Info {counts['info']} / Not run {counts['not_run']}\n{'='*70}")
    for c in results:
        print(f"  [{c['status'].upper():7}] {c['title']}: {c['headline']}")
    print(f"\nRun JSON written to {out}")

    if args.xlsx:
        from audit_pack import build_pack
        build_pack(run, args.xlsx)
        print(f"Excel audit pack written to {args.xlsx}")


if __name__ == "__main__":
    main()
