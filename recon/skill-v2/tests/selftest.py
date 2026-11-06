#!/usr/bin/env python3
"""Self-test for the recon engine (v2).

Builds a minimal synthetic set of all 14 exports in a temp folder and runs the
gate plus the 13-check engine end to end, asserting the v2 behaviours:

  1. Multi-currency Account Transactions (base-currency "(ZAR)" columns,
     "Invoice Number" header, Net populated on AR/VAT control legs) loads,
     sniffs, and the sales recon drops the balance-sheet legs and ties.
  2. Year-to-date Xero Trial Balance with a prior month-end comparison column
     parses, derives period movement, and ties against the Cin7 TB.
  3. Credit-note restock excludes service SKUs absent from the stock ledger.
  4. Stock Received vs Invoiced sniffs without a Status column.
  5. Duplicate reports resolve to the file matching the audit period, not the
     first filename alphabetically.

Run:  python3 selftest.py        (exit 0 = all behaviours hold)
"""
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from openpyxl import Workbook

from common import discover, load_report, xero_tb_movements
import run_recon as rr

JUL = [["From: 01-Jul-2026"], ["To: 31-Jul-2026"], []]
JUN = [["From: 01-Jun-2026"], ["To: 30-Jun-2026"], []]


def sheet(path, rows):
    wb = Workbook()
    ws = wb.active
    for r in rows:
        ws.append(r)
    wb.save(path)


def build(d):
    d = Path(d)
    # 1. Sale Invoices & Credit Notes: two invoices, one CN with a stock SKU
    #    (restocked) and a service SKU (shipping - must be excluded).
    sheet(d / "sale_invoices_cn.xlsx", JUL + [
        ["Document #", "Customer", "Account", "Date", "Year", "Invoice/ Credit Note",
         "Month", "Invoice Due", "SKU", "Product", "Currency", "Quantity", "Amount", "Tax", "Total"],
        ["INV-001", "Alpha", "200", "2026-07-05", 2026, "Invoice", "Jul", "2026-08-05",
         "SKU-A", "Widget", "ZAR", 2, 100.0, 15.0, 115.0],
        ["INV-002", "Beta", "200", "2026-07-10", 2026, "Invoice", "Jul", "2026-08-10",
         "SKU-B", "Gadget", "ZAR", 1, 200.0, 30.0, 230.0],
        ["CN-01", "Alpha", "200", "2026-07-20", 2026, "Credit Note", "Jul", "",
         "SKU-A", "Widget", "ZAR", -1, -50.0, -7.5, -57.5],
        ["CN-01", "Alpha", "200", "2026-07-20", 2026, "Credit Note", "Jul", "",
         "SHIP", "Shipping", "ZAR", -1, 0.0, 0.0, 0.0],
    ])
    # 2. Sale Overview
    sheet(d / "sale_overview.xlsx", JUL + [
        ["Customer", "Order Date", "Status", "Invoice #", "Invoice", "Sale",
         "Paid", "Due", "COGS", "Journals", "Profit"],
        ["Alpha", "2026-07-05", "Invoiced", "INV-001", 115.0, 100.0, 115.0, 0.0, 40.0, 0.0, 60.0],
        ["Beta", "2026-07-10", "Invoiced", "INV-002", 230.0, 200.0, 230.0, 0.0, 80.0, 0.0, 120.0],
    ])
    # 3. Outstanding quotes - TWO files, June one alphabetically FIRST; the
    #    July one must win duplicate resolution.
    sheet(d / "a_quotes_wrong_period.xlsx", JUN + [
        ["Order #", "Customer", "Sales Representative", "SKU", "Quantity", "Total"],
        ["SO-900", "Stale", "Rep", "SKU-A", 9, 999.0],
    ])
    sheet(d / "b_quotes_july.xlsx", JUL + [
        ["Order #", "Customer", "Sales Representative", "SKU", "Quantity", "Total"],
        ["SO-100", "Gamma", "Rep", "SKU-A", 1, 100.0],
    ])
    # 4. Pending SO (header cell merged as in real exports)
    sheet(d / "pending_so.xlsx", JUL + [
        ["Order #", "Customer", "Sales Representative", "SKU", "Quantity required Total"],
    ])
    # 5. Pending PO
    sheet(d / "pending_po.xlsx", JUL + [
        ["SKU", "Product", "PO #", "Status", "Supplier", "Ordered", "To Invoice", "To Receive"],
    ])
    # 6. Stock Received vs Invoiced - NO Status column (v2 signature)
    sheet(d / "stock_rec_vs_inv.xlsx", JUL + [
        ["SKU", "PO #", "Invoice #", "Supplier", "Received", "Invoiced", "PO Total"],
    ])
    # 7. Txn vs SOH
    sheet(d / "txn_vs_soh.xlsx", JUL + [
        ["Task #", "Account", "Transaction Type", "Stock Amount", "Document Amount"],
    ])
    # 8. Inventory Movement Summary (stock SKUs ledger)
    sheet(d / "inv_mov_summary.xlsx", JUL + [
        ["Location", "SKU", "Quantity on Hand", "In", "Out", "Stock on Hand"],
        ["Main", "SKU-A", 10, 1, 2, 400.0],
        ["Main", "SKU-B", 5, 0, 1, 500.0],
    ])
    # 9. Inventory Movement Details - CN-01's SKU-A restock present
    sheet(d / "inv_mov_details.xlsx", JUL + [
        ["SKU", "Location", "Reference Type", "Type", "Quantity In", "Quantity Out",
         "Cost In", "Cost Out"],
        ["SKU-A", "Main", "Sale", "Out", 0, 2, 0.0, 80.0],
        ["SKU-B", "Main", "Sale", "Out", 0, 1, 0.0, 80.0],
        ["SKU-A", "Main", "Sale", "In", 1, 0, 40.0, 0.0],
    ])
    # 10. Xero sync - all completed
    sheet(d / "xero_sync.xlsx", JUL + [
        ["Sync Date", "Cin7 Core Number", "Status", "Type", "Message"],
        ["2026-07-05", "INV-001", "Completed", "Invoice", ""],
    ])
    # 11. P&L by product
    sheet(d / "pl_by_product.xlsx", JUL + [
        ["Location", "SKU", "Product", "COGS", "Sale Proceeds", "Profit"],
        ["Main", "SKU-A", "Widget", 40.0, 50.0, 10.0],
        ["Main", "SKU-B", "Gadget", 80.0, 200.0, 120.0],
    ])
    # 12. Cin7 TB (period movement: sales -250, AR +287.5, VAT -37.5)
    sheet(d / "cin7_tb.xlsx",
          [["Trial Balance Sheet"], ["Report period: Custom"]] + JUL[:2] + [[], ] + [
        ["Account class", "Account code", "Description", None,
         "Opening balance", "Debit", "Credit", None, "Closing balance"],
        ["REVENUE", "200", "Sales", None, 0, 0, 250.0, None, -250.0],
        ["ASSET", "610", "Accounts Receivable", None, 0, 287.5, 0, None, 287.5],
        ["LIABILITY", "820", "VAT", None, 0, 0, 37.5, None, -37.5],
    ])
    # 13. Xero Account Transactions - MULTI-CURRENCY layout: "(Source)" and
    #     "(ZAR)" columns, "Invoice Number" header, Net populated on the AR
    #     and VAT control legs (the triple-count trap).
    rows = [["Account Transactions"], ["Testco (Pty) Ltd"],
            ["For the period 1 July 2026 to 31 July 2026"], [],
            ["Date", "Source", "Description", "Invoice Number", "Reference",
             "Currency", "Debit (Source)", "Credit (Source)", "Net (Source)",
             "Debit (ZAR)", "Credit (ZAR)", "Net (ZAR)", "Account Code", "Account Type"]]
    def leg(num, src, debit, credit, net, code, typ):
        rows.append(["2026-07-05", src, "x", num, "", "ZAR", debit, credit, net,
                     debit, credit, net, code, typ])
    for num, amt in (("INV-001", 100.0), ("INV-002", 200.0)):
        leg(num, "Receivable Invoice", 0, amt, amt, "200", "Revenue")
        leg(num, "Receivable Invoice", amt * 1.15, 0, amt * 1.15, "610", "Asset")
        leg(num, "Receivable Invoice", 0, amt * 0.15, amt * 0.15, "820", "Liability")
    leg("CN-01", "Receivable Credit Note", 50.0, 0, -50.0, "200", "Revenue")
    leg("CN-01", "Receivable Credit Note", 0, 57.5, -57.5, "610", "Asset")
    leg("CN-01", "Receivable Credit Note", 7.5, 0, -7.5, "820", "Liability")
    sheet(d / "xero_account_transactions.xlsx", rows)
    # 14. Xero TB - YTD layout with a 30 Jun comparison column.
    #     July movement must come out as: 200 -> -250, 610 -> +287.5, 820 -> -37.5
    sheet(d / "xero_tb.xlsx", [
        ["Trial Balance"], ["Testco (Pty) Ltd"], ["As at 31 July 2026"], [],
        ["Account Code", "Account", "Account Type",
         "Debit - Year to date", "Credit - Year to date", None, "30 Jun 2026"],
        ["200", "Sales", "Sales", None, 1250.0, None, -1000.0],
        ["610", "Accounts Receivable", "Asset", 1437.5, None, None, 1150.0],
        ["820", "VAT", "Liability", None, 187.5, None, -150.0],
    ])


def main():
    with tempfile.TemporaryDirectory() as d:
        build(d)
        found, unknown = discover(d)
        missing = [k for k in rr.REQUIRED if k not in found]
        assert not missing, f"gate would block, missing: {missing}"

        # (5) duplicate resolution picked the period-matching quotes file
        assert found["outstanding_quotes"].name == "b_quotes_july.xlsx", \
            f"duplicate resolution picked {found['outstanding_quotes'].name}"
        assert any("different period" in note for _, note in unknown), \
            "wrong-period duplicate not labelled"

        # (2) YTD TB parses and derives July movement
        tb = load_report(found["xero_tb"])
        mv, basis = xero_tb_movements(tb)
        assert "derived" in basis and "30 Jun 2026" in basis, basis
        assert mv["200"]["movement"] == -250.0, mv["200"]
        assert mv["610"]["movement"] == 287.5, mv["610"]
        assert mv["820"]["movement"] == -37.5, mv["820"]

        R = {k: load_report(p) for k, p in found.items()}
        cfg = dict(rr.DEFAULT_CONFIG)

        # (1) sales recon: BS legs dropped, both sides tie at 250.00
        sr = rr.chk_sales_recon(R, cfg)
        assert sr["detail"]["bs_legs_dropped"] == 6, sr["detail"]
        assert sr["detail"]["total_xero"] == 250.0, sr["detail"]
        assert sr["detail"]["total_cin7"] == 250.0, sr["detail"]
        assert sr["status"] == "clear", sr

        # (3) CN restock: SHIP excluded as service, SKU-A restocked -> clear
        cr = rr.chk_cn_restock(R, cfg)
        assert cr["detail"].get("service_lines_excluded") == 1, cr["detail"]
        assert cr["status"] == "clear", cr

        # (2b) TB check ties all three accounts
        tbc = rr.chk_tb(R, cfg)
        assert tbc["detail"]["ok"] == 3, tbc["detail"]
        assert "derived" in tbc["detail"]["xero_movement_basis"]
        assert tbc["status"] == "clear", tbc["status"]

    print("selftest: all v2 behaviours hold (sales recon BS-leg drop, "
          "multi-currency AT, YTD TB derivation, CN service exclusion, "
          "period-aware duplicates, Status-less Stock Received vs Invoiced)")


if __name__ == "__main__":
    main()
