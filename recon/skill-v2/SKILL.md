---
name: cin7-xero-master-recon
description: >-
  Run Creative CFO's Cin7 Core ↔ Xero master audit reconciliation for any customer, weekly,
  monthly or over any custom date range: gate the source exports, run all 13 integrity checks
  (Xero sync failures, sales doc-level recon, unallocated credit notes, COGS, trial balance
  Cin7-vs-Xero, stock received vs invoiced, GL-vs-stock integrity, credit-note restocks, pending
  POs/SOs, quotes, account values, GP per product), track every previous run in a history file,
  and publish a Creative CFO dashboard with a period slider to step through each previously
  reconciled period. Use whenever someone asks for a Cin7-Xero recon, systems integrity audit,
  month-end or week-end Cin7 check, "does Cin7 tie to Xero", a sync-error review, an inventory
  systems audit, or mentions the Cin7 Xero integrity dashboard. Also use to roll an existing
  customer's recon forward a period, or to tell a team member exactly which Cin7 and Xero reports
  to pull. Reusable across every customer; each customer keeps a config, history and dashboard.
---

# Cin7 <-> Xero Master Audit Recon

You are running Creative CFO's standard systems-integrity audit for a customer that runs
inventory in Cin7 Core synced to Xero. The output is three artefacts in the customer's folder:
a **run JSON** (the machine-readable audit record), an **Excel audit pack** (working papers),
and one **self-contained HTML dashboard** whose period slider steps through every previously
reconciled period. The bar: **every number is computed from the period's exports and every
exception names the system it must be fixed in.** Do not invent findings; flag only what is in
the data.

The engine reproduces, check for check, the logic of the CCFO SYSTEMS CIN7 <-> XERO INTEGRITY
DASHBOARD workbook (the v1 Excel this skill replaces), verified against it to the cent.

**This is the v2 engine** (November 2026): it additionally drops balance-sheet legs from the
sales recon, reads both Xero Trial Balance layouts (deriving the month from a YTD export with
a prior month-end column), collapses multi-currency base-currency columns, excludes service
lines from the credit-note restock check, and resolves duplicate files by audit period. The
field knowledge behind each change is in `CHANGELOG.md`; `tests/selftest.py` asserts all of it
end to end - run it after any engine change. The export pitfalls learned at Kiko and Hoi P'loy
are at the end of `references/report-pull-guide.md`.

## Start here: ask these before anything else

1. **Which customer?** The customer name goes on the dashboard and keys the folder. Each
   customer gets a durable folder (their client folder) holding `recon_config.json`,
   `recon_history.json`, the run JSONs, audit packs and `dashboard.html`.
2. **First run for this customer, or a roll-forward?**
   - **First run:** create the folder, run the calibration step (below), and expect a longer
     review - many "exceptions" on a first run are standing config, not new breaks.
   - **Roll-forward:** the history file already exists. Only the new period's exports are
     needed; prior runs are never recomputed and never lost - the merge is idempotent and
     re-running the same period replaces that period's entry only.
3. **Cadence: weekly, monthly, or a custom range?** Someone can arrive with any dynamic
   From/To range - a fortnight, a quarter-to-date catch-up, a 10-day cutover window. Pass
   `--cadence custom` for anything that is not a calendar week or month; the period is read
   from the exports' own From/To banners, so the range never has to be typed twice.
4. **Where are the exports?** One inputs folder per run. Files are identified by content, not
   filename, so the team can drop them in exactly as Cin7 and Xero exported them.

If the person has not pulled the reports yet, walk them through the export list below (the
fuller version with quirks is `references/report-pull-guide.md`). Quote the relevant pull
instructions to them rather than pointing at a file.

### The 14 required exports (12 Cin7 + 2 Xero)

Every Cin7 export: default column layout, **"Excel (without totals)"**, run for the audit
period unless stated. Xero exports to Excel, not PDF.

| Source | Report | Period / settings |
|--------|--------|-------------------|
| Cin7 | Sale Invoices & Credit Notes | Audit period |
| Cin7 | Sale Overview | Audit period |
| Cin7 | Sale Outstanding Quotes | This year |
| Cin7 | Pending Sale Orders | Audit period |
| Cin7 | Pending Purchase Orders | This year |
| Cin7 | Stock Received vs Invoiced | Audit period |
| Cin7 | Transactions vs Stock on Hand Difference | Effective date = period end |
| Cin7 | Inventory Movement Summary | Audit period (this IS the stock-on-hand-at-a-date source; Product Availability has no date filter) |
| Cin7 | Inventory Movement Details | Audit period, Mode: Stock movement date |
| Cin7 | Xero Synchronisation Report | Audit period, Type: All, **Status: All** |
| Cin7 | Profit & Loss by Product | Audit period |
| Cin7 | Trial Balance | Audit period From/To |
| Xero | Account Transactions | All accounts, audit period, Source/Number/Net/Tax columns ticked |
| Xero | Trial Balance | As at period end (compare-with-previous-months is fine) |

Optional context: Xero Balance Sheet and Profit and Loss (month columns).

### If this skill was installed instructions-only

Some install paths (the Save-skill card, some org syncs) strip the bundled `scripts/`,
`references/` and `assets/` files. If they are missing in this environment, say so up front,
then degrade gracefully: the table above replaces the pull guide, and the check logic summary
in this file plus `references/check-catalogue.md` content you can request from the maintainer
replace the engine - run the 13 checks manually with your own analysis tools (pandas or
in-context) following the same logic, statuses and ex-VAT conventions, and keep the run JSON
shape from the "history" section so the history and dashboard stay compatible when the full
skill is used next. The complete package lives with Aidan (abouah@creativecfo.com):
`~/Desktop/cin7-xero-master-recon/`.

## Gate 0 - the exports must be complete (HARD GATE)

```
python3 scripts/check_reports.py "<inputs folder>" [--period YYYY-MM] [--weekly]
```

It sniffs every file, reports which of the 14 required reports are present / missing /
duplicated, and asserts the dated exports all cover the SAME From/To window. **If it blocks,
stop and get the missing or mismatched report re-exported - do not work around a gap.** A recon
on partial exports ties to the wrong thing, which is worse than no recon. `--weekly` silences
the same-calendar-month note for weekly and custom ranges.

## Run the engine

```
python3 scripts/run_recon.py "<inputs folder>" \
    --client "Acme (Pty) Ltd" --cadence monthly \
    --config "<client folder>/recon_config.json" \
    --out "<client folder>/run_<period>.json" \
    --xlsx "<client folder>/audit_pack_<period>.xlsx"
```

It runs all 13 checks and prints a status line per check. Statuses: **action** (a break
someone must fix), **watch** (operational housekeeping), **clear**, **info** (investigation
views that are never pass/fail, like the COGS recon), **not_run**. Overall health = clear and
info score 1, watch scores 0.5, action scores 0, averaged. Every check carries a **system
tag** - Cin7, Xero, "Cin7 -> Xero sync", "Cin7 GL" or "Both systems" - so the fixer knows
where to go without opening the detail.

Check-by-check logic, thresholds and resolution playbooks live in
`references/check-catalogue.md`. Read it before reviewing results the first time, and whenever
a check's meaning is in doubt - the COGS recon and Trial Balance checks in particular are
difference maps with expected gaps, not tie-outs, and calling an expected gap a break destroys
the team's trust in the audit.

Compressed logic (enough to reproduce the checks by hand in an instructions-only install):

1. **Xero sync** - count Failed/Warning in the sync report, classify messages; any -> action.
2. **Sales doc recon** - Xero Account Transactions (Source = Receivable Invoice / Receivable
   Credit Note), **Net ex-VAT** summed per Number, vs Cin7 Sale Invoices & Credit Notes
   **Amount ex-VAT** per Document #. CNs by CR-/CN- prefix. Five sections: on-Xero-only inv /
   on-Cin7-only inv / on-Xero-only CN / on-Cin7-only CN / amount differs >= R1. Any -> action.
3. **Unallocated CNs** - Sale Overview rows with CR-/CN- in Invoice # and Due != 0 -> action.
4. **COGS recon** - Sale Overview COGS vs Inventory Movement Details cost-out (Out,
   Sale+SaleMultiple). Investigation only; watch if |variance| > 10%. NEVER a tie-out
   (bundles/assembly land in FinishedGoods; channel locations and status timing differ).
5. **Pending POs** - each line: receive < invoice -> input invoice; receive > invoice ->
   receive stock; all equal -> void-or-progress. Any -> watch.
6. **CNs not restocked** - per SKU: credited qty (CR*/CN* stock lines) vs restocked qty
   (Movement Details, In, Sale/SaleMultiple); mismatch -> watch. Service lines ignored.
7. **TB Cin7 vs Xero** - period movement (Debit-Credit) by account code both sides. Tie <= R1
   ok; no Cin7 movement or finance-pattern name -> expected, not flagged; <= R1,000 small diff
   (watch); bigger -> action. Difference map, not a tie-out.
8. **Stock received vs invoiced** - Received > Invoiced = Need Invoice (GRNI) -> action;
   Invoiced > Received = Awaiting stock -> watch.
9. **Txn vs stock on hand** - Document Amount != Stock Amount rows -> action (GL vs stock
   ledger break: WIP assemblies, in-transit transfers, GRNI timing).
10. **Outstanding quotes** - any open -> watch.
11. **Pending SOs** - any pending -> watch (unfulfilled demand across the cut).
12. **Account values** - SOH value/units + sales totals + two row identities: Profit =
    Sale - COGS + Journals and Invoice = Paid + Due; identity break -> action, else info.
13. **GP per product** - per-SKU GP% = GP / sale proceeds; loss-making -> watch, GP% <= -20%
    -> action (usually a costing error, not real below-cost selling).

### First-run calibration (once per customer)

Generic pattern-matching cannot know a customer's bank account names. On the first run, open
the Trial Balance check's flagged rows: any account that is genuinely finance-only (bank
accounts, gateway control accounts) belongs in the customer's `recon_config.json` under
`tb_expected_extra`, e.g. `{"tb_expected_extra": ["fnb"]}`. Tolerances (`tb_small_diff`,
`cogs_watch_pct`, `gp_loss_deep`, `tie_tolerance`) and credit-note prefixes (`cn_prefixes`)
are also per-customer overrides - defaults are in `run_recon.py` `DEFAULT_CONFIG`. Re-run the
engine after calibrating; the config persists for every future period.

## Review, write findings, then publish

Review each action/watch check and write the audit findings INTO the run JSON's `findings`
array before building the dashboard - the dashboard renders them as the "Audit findings &
actions" register:

```json
{"severity": "action", "finding": "39 sync entries blocked - Cin7 re-pushing paid invoices",
 "action": "Bulk-set Failed/Warning entries to Skipped in Cin7 Xero Sync History",
 "owner": "AB", "due": "2026-08-15", "carried_over": false}
```

Set `"carried_over": true` on any finding that already appeared in the previous run's JSON and
is still open - carried-over findings render with an orange edge so repeat offenders are
impossible to miss. Keep findings factual and traceable to a check; severity mirrors the check
status it comes from.

## Build the dashboard (history + slider)

```
python3 scripts/build_dashboard.py "<client folder>/run_<period>.json" \
    --history "<client folder>/recon_history.json" \
    --out "<client folder>/dashboard.html"
```

This merges the run into the history (replacing only a re-run of the same period) and renders
ONE self-contained HTML file: Creative CFO design, an overall-health gauge, action/watch/clear
tiles with deltas vs the prior run, a health/exceptions trend chart, the 13 checks worst-first
with expandable exception tables and resolution guidance, the findings register, and a
**period slider** that steps through every reconciled period on record. It embeds all history,
so it works offline and is safe to email. Send the dashboard and the audit pack to whoever
owns the fixes.

## Standing rules

- **Amounts in the customer's base currency** (ZAR for most CCFO customers).
- **The sales recon compares ex-VAT** (Xero Net vs Cin7 Amount) by document number, so a VAT
  difference can never hide or fake a document difference.
- **Never edit the run JSON's computed numbers.** Findings and config are the only human
  inputs.
- **Expected differences are not breaks.** The TB and COGS checks document why; say so in the
  findings rather than flagging noise.
- **History is append-and-replace, never rewrite.** Prior periods are the audit trail.
- **Voice:** Creative CFO's - direct, factual, no em dashes. Say "customer", not "client".

## Reference files

- `references/report-pull-guide.md` - the 14 required exports: where each lives in Cin7/Xero,
  export settings ("Excel without totals", default layout, custom period), and the
  quirks (Product Availability has no date filter; use Inventory Movement Summary to a date).
- `references/check-catalogue.md` - all 13 checks: source reports, exact logic, status
  thresholds, and the resolution playbook for each.
- `references/history-and-dashboard.md` - the run JSON and history schemas, the findings
  register, carry-over rules, and how the dashboard consumes them.
- `references/shopify-recon-roadmap.md` - the planned Shopify <-> Cin7 <-> Xero variant
  (payouts, fees, orders-to-sales). Read it if someone asks for a Shopify recon: it defines
  what to build on this same engine/history/dashboard chassis rather than starting over.
- `scripts/check_reports.py` - Gate 0. `scripts/run_recon.py` - the 13-check engine.
  `scripts/build_dashboard.py` - history merge + dashboard. `scripts/audit_pack.py` - Excel
  working papers. `scripts/common.py` - report sniffing/loading (content-based, never
  filename-based). `assets/dashboard_template.html` - the dashboard shell.
