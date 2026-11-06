# Engine changelog - v2 (November 2026)

All changes are generic, not customer-specific. Provenance: the Kiko Vitamins
July-September 2026 recon sessions (session log, 6 Nov 2026) and the Hoi P'loy
July 2026 run (session "Cin 7 Audit Skill for July"). Every behaviour below is
asserted by `tests/selftest.py`, which builds synthetic exports and runs the
gate and checks end to end. Run it after any engine change.

## 1. Sales recon drops balance-sheet legs (highest impact)

Xero's Account Transactions export returns every leg of a sales document.
Where a tenant populates Net on the AR-control and VAT-control legs, each
invoice was counted up to three times: on Kiko July this produced 1,089
phantom mismatches and a Xero total of R4,945,111 against a true R2,182,894.
The check now classifies accounts as balance-sheet from the export's own
Account Type column when present, else from the Xero Trial Balance's Account
Type column, and drops those legs. A tenant offering neither keeps the old
behaviour. The rows dropped and the classification basis are recorded in the
check's detail (`bs_legs_dropped`, `bs_leg_basis`).

## 2. Trial Balance parser handles both Xero layouts

The classic month-columns layout ("31 Jul 2026 Debit/Credit") parses as
before. The year-to-date layout ("Debit - Year to date" plus signed
month-end comparison columns) is now detected and the period movement derived
as (YTD debit - YTD credit) minus the most recent prior-month-end column -
exact for P&L accounts (same financial year) and balance sheet accounts
(balance difference) alike. The derivation self-checks that movements net to
zero and the basis used is recorded in the TB check's detail
(`xero_movement_basis`). A YTD export without a comparison column still
blocks, with the re-export instruction in the error. This replaces the
hand-built per-customer TB adapters (see `recon/hoi-ploy/adapt_xero_exports.py`,
now redundant).

## 3. Multi-currency column collapse and header aliases

Base-currency amount columns ("Net (ZAR)" style) collapse to their bare names
on load; "(Source)" columns are never touched, because source-currency
amounts against a base-currency ledger invent mismatches (a USD 12,290
invoice is not R12,290 - Kiko had 20 such rows in September). "Invoice
Number" aliases to "Number". The Account Transactions signature no longer
requires a Tax column (multi-currency tenants export without one; nothing
computes from it) and Stock Received vs Invoiced no longer requires Status.

## 4. Credit-note restock excludes service lines (bug fix)

The check's resolution text always claimed service lines were excluded; the
code never excluded them, so shipping/fee SKUs flagged as "Not restocked"
every month (six of ten Kiko July flags; Hoi P'loy's DELWC/COLLCUS likewise).
A credited SKU that the Inventory Movement Details/Summary has never seen is
not stock and is now excluded, with the count in the check's detail
(`service_lines_excluded`).

## 5. Period-aware duplicate resolution (bug fix)

When the inputs folder holds two exports of the same report, the engine used
to keep the first alphabetically - which once selected a wrong-period file
(Kiko July quotes). Duplicates now resolve to the file whose banner From/To
matches the audit period (the modal period across all dated files), and a
wrong-period loser is labelled "duplicate ... (different period)".

## Deliberately unchanged

- Check logic, statuses, tolerances, config schema, run JSON schema, history
  merge and dashboard: untouched, so prior-period history files render
  unchanged.
- The COGS check remains an investigation view, never a tie-out.

## Note on comparability

Fix 1 changes the sales recon's totals for any tenant whose export populates
Net on control legs. If a prior period for such a tenant was run on the old
engine and showed an implausibly large sales recon, that was the bug, not the
books - re-run that period from its raw exports before reading a trend.
