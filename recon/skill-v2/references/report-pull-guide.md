# Report pull guide - what to export, from where, with which settings

Fourteen exports are required per run: **12 from Cin7 Core, 2 from Xero**, plus 2 optional
Xero statements for context. Drop them all into one inputs folder. Filenames do not matter -
the gate identifies every file by its header row - but keep the folder to one run's worth of
files (one file per report; duplicates are flagged).

**The one rule for every Cin7 export:** run it for the audit period (custom From/To for weekly
or dynamic ranges), keep the DEFAULT column layout, and export **"Excel (without totals)"**.
Adding, removing or reordering columns breaks the automated matching; grand-total rows are
stripped automatically but a customised layout cannot be.

## Cin7 Core exports (Reports module unless stated)

| # | Report | Period to run | Feeds |
|---|--------|---------------|-------|
| 1 | **Sale Invoices & Credit Notes** | Audit period | Sales recon, CN restock check |
| 2 | **Sale Overview** | Audit period | Unallocated CNs, COGS recon, account values |
| 3 | **Sale Outstanding Quotes** | This year (so nothing pending slips the window) | Quotes review |
| 4 | **Pending Sale Orders** | Audit period | Pending SO analysis |
| 5 | **Pending Purchase Orders** | This year | Pending PO review |
| 6 | **Stock Received vs Invoiced** | Audit period | GRNI / stock-invoice match |
| 7 | **Transactions vs Stock on Hand Difference** | Effective date = period end | GL-vs-stock integrity |
| 8 | **Inventory Movement Summary** | Audit period | Stock on hand, account values |
| 9 | **Inventory Movement Details** | Audit period, Mode: Stock movement date | COGS recon, CN restock |
| 10 | **Xero Synchronisation Report** (Integrations -> Xero -> Sync History, or Reports) | Audit period, Type: All, Status: All | Sync analysis |
| 11 | **Profit & Loss by Product** | Audit period | GP per product |
| 12 | **Trial Balance** (Cin7's own TB) | Audit period (From = period start, To = period end) | TB Cin7-vs-Xero |

Quirks worth telling the person pulling:

- **Product Availability is live-only** (no date filter). It is deliberately NOT on this list -
  stock on hand as at a date comes from the Inventory Movement Summary run to that date.
- The Pending Sale Orders export has no order value or order date column; the check works
  without them, but if the customer's layout can add them, the review gets richer.
- The Xero Synchronisation Report must be pulled with **Status: All**, not just Failed - the
  completed count is part of the health story.

## Xero exports

| # | Report | Settings | Feeds |
|---|--------|----------|-------|
| 13 | **Account Transactions** | All accounts, audit period, include Source / Number / Net / Tax columns (tick them in the column picker if unticked) | Sales recon (Receivable Invoice / Receivable Credit Note rows) |
| 14 | **Trial Balance** | As at the period END, "Compare with: previous months" is fine - the engine reads the most recent Debit/Credit pair as the period movement | TB Cin7-vs-Xero |
| 15 | *(optional)* Balance Sheet | Month columns | Context only |
| 16 | *(optional)* Profit and Loss | Month columns | Context only |

Export all Xero reports to **Excel** (not PDF, not Google Sheets links).

## Weekly and custom ranges

Every dated Cin7 export must be run for the SAME From/To window - the gate cross-checks the
banners and blocks on a mismatch. For the Xero Account Transactions, use the same window. For
the Xero TB on a mid-month cut, run it as at the custom end date; Cin7's TB takes the same
custom From/To. Pass `--cadence custom` (engine) and `--weekly` (gate) so calendar-month
assertions stay quiet.

## Export pitfalls seen in the field (Kiko Jul-Sep 2026, Hoi P'loy Jul 2026)

Every one of these cost a re-export round. The engine now tolerates the ones
marked "handled", but pulling it right first time is still faster.

| What arrived | Why it failed | The fix |
|---|---|---|
| Goods Received Not Invoiced report | Different report - has Quantity/Cost, not Received/Invoiced | Pull **Stock Received vs Invoiced** |
| Purchase Invoices & Credit Notes | No check consumes it | Pull **Sale** Invoices & Credit Notes |
| Sale Overview without Status | Customised column layout | Default layout |
| Sale Outstanding Quotes on "Last month" | Hides quotes raised earlier and still open | Run on **This year** |
| Xero TB on year-to-date columns | Carries movement since the year end, not the month | Handled: the engine derives the month when a prior month-end comparison column is present - so pull it **as at period end with comparison periods**. Without that column it still blocks |
| Account Transactions, source-currency only | USD/GBP amounts against a ZAR ledger invent mismatches | Tick the **base-currency** amount columns. Base-currency "(ZAR)"-style columns and the "Invoice Number" header are handled; source-currency-only exports are not adaptable and never will be |
| Stock Received vs Invoiced without Status | - | Handled: Status is no longer required (no check consumes it) |
| Two exports of the same report in the folder | Engine used to keep the first alphabetically, which once picked a wrong-period file | Handled: the file matching the audit period wins; the other is reported as a duplicate |

The single most useful prevention: **save the Xero report settings as custom
layouts** so the exports stop drifting between pulls.
