"""Shared loaders for the Cin7 <-> Xero master recon.

Every Cin7 / Xero export is identified by SNIFFING its header row, never by
filename, so the team can drop files into the inputs folder named however the
systems exported them. Each loader returns a pandas DataFrame with the header
row applied and the report-period metadata attached in df.attrs.
"""

import re
import unicodedata
from datetime import datetime, date
from pathlib import Path

import pandas as pd
from openpyxl import load_workbook

# ---------------------------------------------------------------------------
# Report registry: key -> (label, source system, signature columns)
# A file matches a report when ONE row in its first 15 rows contains every
# signature column (case-insensitive, trimmed). Signatures are chosen to be
# unique across the registry.
# ---------------------------------------------------------------------------
REGISTRY = {
    # --- Cin7 Core exports (export "Excel (without totals)", default layout) ---
    "sale_invoices_cn": {
        "label": "Sale Invoices & Credit Notes",
        "source": "Cin7",
        "signature": ["document #", "customer", "date", "sku", "quantity", "total", "tax"],
    },
    "sale_overview": {
        "label": "Sale Overview",
        "source": "Cin7",
        "signature": ["customer", "order date", "status", "invoice #", "invoice",
                       "sale", "paid", "due", "cogs", "journals", "profit"],
    },
    "outstanding_quotes": {
        "label": "Sale Outstanding Quotes",
        "source": "Cin7",
        "signature": ["order #", "customer", "sales representative", "sku", "quantity", "total"],
    },
    "pending_so": {
        "label": "Pending Sale Orders",
        "source": "Cin7",
        # Cin7 merges the last header cell into "Quantity required Total"
        "signature": ["order #", "customer", "sales representative", "sku", "quantity required*"],
    },
    "pending_po": {
        "label": "Pending Purchase Orders",
        "source": "Cin7",
        "signature": ["sku", "product", "po #", "status", "supplier", "ordered",
                       "to invoice", "to receive"],
    },
    "stock_received_vs_invoiced": {
        "label": "Stock Received vs Invoiced",
        "source": "Cin7",
        # "status" not required: no check consumes it and some tenants'
        # layouts omit it (Kiko, Sep 2026).
        "signature": ["sku", "po #", "invoice #", "supplier", "received", "invoiced"],
    },
    "txn_vs_soh": {
        "label": "Transactions vs Stock on Hand Difference",
        "source": "Cin7",
        "signature": ["task #", "account", "transaction type", "stock amount", "document amount"],
    },
    "inv_movement_summary": {
        "label": "Inventory Movement Summary",
        "source": "Cin7",
        "signature": ["location", "sku", "quantity on hand", "in", "out", "stock on hand"],
    },
    "inv_movement_details": {
        "label": "Inventory Movement Details",
        "source": "Cin7",
        "signature": ["sku", "location", "reference type", "type", "quantity in",
                       "quantity out", "cost in", "cost out"],
    },
    "xero_sync": {
        "label": "Xero Synchronisation Report",
        "source": "Cin7",
        "signature": ["sync date", "status", "type", "message"],
    },
    "pl_by_product": {
        "label": "Profit & Loss by Product",
        "source": "Cin7",
        "signature": ["location", "sku", "product", "cogs", "sale proceeds", "profit"],
    },
    "cin7_tb": {
        "label": "Trial Balance (Cin7)",
        "source": "Cin7",
        "signature": ["account class", "account code", "description", "debit", "credit"],
    },
    # --- Xero exports ---
    "account_transactions": {
        "label": "Account Transactions (Xero)",
        "source": "Xero",
        # "tax" is deliberately not required: multi-currency tenants export
        # without it and no check computes from it. "number" is satisfied by
        # the "Invoice Number" alias (see canon_header).
        "signature": ["date", "account code", "source", "net", "number"],
    },
    "xero_tb": {
        "label": "Trial Balance (Xero)",
        "source": "Xero",
        # Xero TB columns look like "31-May-2026 Debit"; the sniffer handles
        # this report specially (see sniff_report).
        "signature": None,
    },
    # Optional context reports (not gated, used when present)
    "xero_bs": {"label": "Balance Sheet (Xero)", "source": "Xero", "signature": None},
    "xero_pl": {"label": "Profit and Loss (Xero)", "source": "Xero", "signature": None},
    "cin7_bs": {"label": "Balance Sheet (Cin7)", "source": "Cin7", "signature": None},
    "cin7_pl": {"label": "Profit & Loss (Cin7)", "source": "Cin7", "signature": None},
}

REQUIRED = [
    "sale_invoices_cn", "sale_overview", "outstanding_quotes", "pending_so",
    "pending_po", "stock_received_vs_invoiced", "txn_vs_soh",
    "inv_movement_summary", "inv_movement_details", "xero_sync",
    "pl_by_product", "cin7_tb", "account_transactions", "xero_tb",
]


def norm(s):
    """Normalise a header cell for comparison."""
    if s is None:
        return ""
    s = unicodedata.normalize("NFKC", str(s)).strip().lower()
    return re.sub(r"\s+", " ", s)


# Header aliases: alternate spellings some tenants' exports use for a column
# the checks consume. Applied after norm(), before signature matching.
HEADER_ALIASES = {
    "invoice number": "number",
}

_CCY_COL = re.compile(r"^(debit|credit|net|total|tax|running balance)\s*\(([a-z]{3})\)$")


def canon_headers(cells):
    """Normalise a header row: aliases, and multi-currency column collapse.

    Multi-currency Xero exports suffix every amount column with a currency:
    "Debit (Source)" carries the foreign amount and "Debit (ZAR)" the base
    amount. The base-currency column collapses to its bare name ("debit") so
    the checks read base-currency amounts; "(source)" columns are NEVER
    collapsed, because source-currency amounts entered against a base-currency
    ledger invent mismatches (a USD 12,290 invoice is not R12,290).
    """
    normed = [norm(c) for c in cells]
    out = []
    for h in normed:
        h = HEADER_ALIASES.get(h, h)
        m = _CCY_COL.match(h)
        if m:  # "(source)" is 6 letters so it can never match the 3-letter code
            base = m.group(1)
            # Collapse only when the bare name is not already a column, so a
            # standard-layout file is never altered.
            if base not in normed and f"{base} (source)" in normed:
                h = base
            elif base not in normed and f"{base} (source)" not in normed:
                # Base-currency-only export (no source twin): still collapse.
                h = base
        out.append(h)
    # A collision (two headers collapsing to one name) keeps the first and
    # leaves later ones untouched, so nothing is silently overwritten.
    seen, final = set(), []
    for orig, h in zip(normed, out):
        if h in seen and h != orig:
            final.append(orig)
        else:
            final.append(h)
            seen.add(h)
    return final


def _grid(path_or_ws, max_rows=20):
    """First max_rows rows of a sheet as lists of values."""
    if isinstance(path_or_ws, (str, Path)):
        wb = load_workbook(path_or_ws, read_only=True, data_only=True)
        ws = wb[wb.sheetnames[0]]
    else:
        ws = path_or_ws
    rows = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        rows.append(list(row))
        if i >= max_rows - 1:
            break
    return rows


def _row_matches(cells, signature):
    normed = canon_headers(cells)
    for sig in signature:
        if sig.endswith("*"):
            if not any(c.startswith(sig[:-1]) for c in normed):
                return False
        elif sig not in normed:
            return False
    return True


def sniff_report(path):
    """Return (report_key, header_row_index) for a file, or (None, None)."""
    rows = _grid(path)
    joined = " ".join(norm(c) for r in rows[:6] for c in r if c)

    # Xero statement-style reports: identified by their title lines.
    first_cells = [norm(r[0]) for r in rows[:4] if r and r[0]]
    title = first_cells[0] if first_cells else ""
    if title == "trial balance":
        return "xero_tb", None
    if title == "balance sheet":
        return "xero_bs", None
    if title in ("profit and loss", "profit & loss") and "account code" not in joined:
        # Cin7's P&L export titles itself "Profit & Loss"; Xero uses
        # "Profit and Loss". Fall through to signature matching otherwise.
        return ("xero_pl" if title == "profit and loss" else "cin7_pl"), None
    if title == "trial balance sheet":
        pass  # Cin7 TB - caught by signature below
    if title == "balance sheet by periods":
        return "cin7_bs", None

    for i, cells in enumerate(rows):
        if not any(cells):
            continue
        for key, spec in REGISTRY.items():
            if not spec["signature"]:
                continue
            if _row_matches(cells, spec["signature"]):
                # Disambiguate quotes vs pending SO (near-identical headers)
                if key == "outstanding_quotes" and any(
                        norm(c).startswith("quantity required") for c in cells):
                    key = "pending_so"
                return key, i
    return None, None


def parse_period(path):
    """Pull From/To dates out of a Cin7 export's banner rows."""
    rows = _grid(path, max_rows=8)
    frm = to = None
    for r in rows:
        for c in r:
            if c is None:
                continue
            m = re.match(r"\s*from:\s*(.+)", str(c), re.I)
            if m:
                frm = _parse_date(m.group(1))
            m = re.match(r"\s*to:\s*(.+)", str(c), re.I)
            if m:
                to = _parse_date(m.group(1))
    return frm, to


def _parse_date(s):
    s = str(s).strip()
    for fmt in ("%d-%b-%Y", "%d %B %Y", "%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return None


def load_report(path, key=None, header_row=None):
    """Load an export into a DataFrame with proper headers.

    Statement-style Xero reports (TB/BS/P&L) are returned raw (no header
    promotion) because their layout is positional; the checks that use them
    parse them directly.
    """
    if key is None:
        key, header_row = sniff_report(path)
    if key is None:
        raise ValueError(f"Unrecognised report: {path}")

    raw = pd.read_excel(path, header=None)
    frm, to = parse_period(path)

    if key in ("xero_tb", "xero_bs", "xero_pl", "cin7_bs", "cin7_pl"):
        df = raw
    else:
        if header_row is None:
            _, header_row = sniff_report(path)
        header = canon_headers(list(raw.iloc[header_row]))
        df = raw.iloc[header_row + 1:].copy()
        df.columns = [h if h else f"col{i}" for i, h in enumerate(header)]
        df = df.reset_index(drop=True)
        # Drop fully-empty rows and Cin7 "Grand Total" footer rows
        df = df.dropna(how="all")
        first_col = df.columns[0]
        df = df[df[first_col].astype(str).str.strip().str.lower() != "grand total"]

    df.attrs["report_key"] = key
    df.attrs["period_from"] = frm
    df.attrs["period_to"] = to
    df.attrs["path"] = str(path)
    return df


def discover(folder):
    """Map every xlsx in a folder to a report key.

    Returns (found: dict key->path, unrecognised: list of paths).
    """
    candidates, unknown = {}, []
    for p in sorted(Path(folder).glob("*.xls*")):
        if p.name.startswith("~$"):
            continue
        try:
            key, _ = sniff_report(p)
        except Exception:
            key = None
        if key:
            candidates.setdefault(key, []).append(p)
        else:
            unknown.append((p, "unrecognised layout"))

    # Duplicate resolution prefers the file whose banner From/To matches the
    # audit period (the modal period across every dated file in the folder),
    # not the first filename alphabetically - an alphabetical pick once chose
    # a wrong-period export (Kiko, Jul 2026 quotes).
    periods = []
    period_of = {}
    for paths in candidates.values():
        for p in paths:
            frm, to = parse_period(p)
            period_of[p] = (frm, to)
            if frm and to:
                periods.append((frm, to))
    modal = max(set(periods), key=periods.count) if periods else None

    found = {}
    for key, paths in candidates.items():
        if len(paths) > 1 and modal:
            paths = sorted(paths, key=lambda p: (period_of[p] != modal, str(p)))
        found[key] = paths[0]
        for extra in paths[1:]:
            note = f"duplicate of {REGISTRY[key]['label']}"
            if modal and period_of[extra] not in (modal, (None, None)):
                note += " (different period)"
            unknown.append((extra, note))
    return found, unknown


def to_num(series):
    return pd.to_numeric(series, errors="coerce").fillna(0.0)


def xero_tb_movements(df_raw):
    """Parse a Xero Trial Balance into
    {account_code: {"name": str, "movement": debit-credit}} for the period,
    plus a string describing which basis was used.

    Handles BOTH layouts Xero produces:

    1. Month columns ("31 Jul 2026 Debit" / "31 Jul 2026 Credit" pairs): the
       first (most recent) pair is read as the period movement. Basis:
       "month Debit/Credit columns".
    2. Year-to-date columns ("Debit - Year to date" / "Credit - Year to date"
       plus signed comparison columns per prior month end): the period
       movement is DERIVED as (YTD debit - YTD credit) minus the first
       (most recent) prior-month-end signed column. Exact for P&L accounts
       (both dates inside one financial year) and for balance sheet accounts
       (balance difference). Basis: "derived: YTD minus <prior column>".
       A YTD export WITHOUT a prior-month comparison column cannot yield the
       month and raises, naming the re-export that fixes it.

    Returns (movements_dict, basis).
    """
    # Find the header row for either layout within the first 10 rows.
    header_idx = kind = None
    for i in range(min(10, len(df_raw))):
        cells = [norm(c) for c in df_raw.iloc[i]]
        if any(c.endswith(" debit") for c in cells) and any(c.endswith(" credit") for c in cells):
            header_idx, kind = i, "pairs"
            break
        if "debit - year to date" in cells and "credit - year to date" in cells:
            header_idx, kind = i, "ytd"
            break
    if header_idx is None:
        raise ValueError("Xero Trial Balance: could not find a Debit/Credit or "
                         "Year-to-date header row")
    cells = [norm(c) for c in df_raw.iloc[header_idx]]

    if kind == "pairs":
        debit_col = next(j for j, c in enumerate(cells) if c.endswith(" debit") and "ytd" not in c)
        credit_col = next(j for j, c in enumerate(cells) if c.endswith(" credit") and "ytd" not in c)
        out = {}
        pat = re.compile(r"^(.*)\((?P<code>[^()]+)\)\s*$")
        for i in range(header_idx + 1, len(df_raw)):
            name = df_raw.iat[i, 0]
            if name is None or str(name).strip() == "":
                continue
            m = pat.match(str(name).strip())
            if not m:
                continue  # section headings like "Revenue", "Total"
            code = m.group("code").strip()
            d = pd.to_numeric(df_raw.iat[i, debit_col], errors="coerce")
            c = pd.to_numeric(df_raw.iat[i, credit_col], errors="coerce")
            d = 0.0 if pd.isna(d) else float(d)
            c = 0.0 if pd.isna(c) else float(c)
            out[code] = {"name": m.group(1).strip(), "movement": d - c}
        return out, "month Debit/Credit columns"

    # YTD layout: needs Account Code column and at least one dated
    # comparison column (the first one is the most recent prior month end).
    def col(name):
        return cells.index(name) if name in cells else None
    code_col, name_col = col("account code"), col("account")
    ytd_d, ytd_c = col("debit - year to date"), col("credit - year to date")
    prior_col = None
    for j, c in enumerate(cells):
        if j in (code_col, name_col, ytd_d, ytd_c) or not c:
            continue
        if _parse_date(str(df_raw.iat[header_idx, j]).strip()) or re.match(
                r"^\d{1,2}\s+\w{3,9}\s+\d{4}$", c):
            prior_col = j
            break
    if code_col is None or prior_col is None:
        raise ValueError(
            "Xero Trial Balance is on Year-to-date columns with no prior "
            "month-end comparison column, so the month's movement cannot be "
            "derived. Re-export as at the period end either with 'Year to "
            "date' unticked, or with comparison periods so the prior month "
            "end is a column.")
    prior_label = str(df_raw.iat[header_idx, prior_col]).strip()
    out = {}
    for i in range(header_idx + 1, len(df_raw)):
        code = df_raw.iat[i, code_col]
        if code is None or str(code).strip() == "":
            continue
        d = pd.to_numeric(df_raw.iat[i, ytd_d], errors="coerce")
        c = pd.to_numeric(df_raw.iat[i, ytd_c], errors="coerce")
        p = pd.to_numeric(df_raw.iat[i, prior_col], errors="coerce")
        d = 0.0 if pd.isna(d) else float(d)
        c = 0.0 if pd.isna(c) else float(c)
        p = 0.0 if pd.isna(p) else float(p)
        name = "" if name_col is None else str(df_raw.iat[i, name_col] or "").strip()
        out[str(code).strip()] = {"name": name, "movement": round((d - c) - p, 2)}
    # Double entry must survive the derivation; a non-zero net means the
    # export is not what this parser thinks it is.
    net = sum(v["movement"] for v in out.values())
    if abs(net) > 1.0:
        raise ValueError(f"Xero Trial Balance YTD derivation does not net to "
                         f"zero (got {net:.2f}); check the export's columns")
    return out, f"derived: YTD minus {prior_label} comparison column"
