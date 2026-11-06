# Check catalogue - logic, thresholds, resolution playbooks

The 13 checks, in the order the engine runs them. "System" is where the fix happens. Status
rules reference the config keys in `run_recon.py` `DEFAULT_CONFIG` (per-customer overrides in
`recon_config.json`).

## 1. Xero sync analysis — system: Cin7 -> Xero sync

Counts Completed / Failed / Warning in the Xero Synchronisation Report and classifies every
Failed/Warning message (paid-invoice update blocked, payment blocked, void blocked, other).
**Action** when any Failed/Warning exists. Resolution: these almost always mean Cin7 re-pushed
a document already PAID in Xero. If Xero is correct, bulk-set the entries to **Skipped** in
Cin7 -> Xero Sync History; if the Cin7 change must land, remove the Xero payment, re-sync,
re-apply. Needs the Xero Accounting/Financial Reporting permission.

## 2. Sales - Xero vs Cin7, document level — system: Both

Xero side: Account Transactions rows where Source is "Receivable Invoice" or "Receivable
Credit Note", **Net (ex VAT)** summed per document Number. Cin7 side: Sale Invoices & Credit
Notes, **Amount (ex VAT)** summed per Document #. Ex-VAT on both sides so a VAT-rate issue
cannot hide or fake a document gap. Credit notes are recognised by prefix (`cn_prefixes`,
default CR-/CN-). Five sections: (1) invoices on Xero only, (2) invoices on Cin7 only,
(3) credit notes on Xero only, (4) credit notes on Cin7 only, (5) same document, amount
differs by >= `tie_tolerance` (default R1). The bridge Xero - S1 - S3 + S2 + S4 - S5 must
close to Cin7's total (it does by construction; a residual means data loading broke - stop and
investigate the exports). **Action** when any section has rows. Resolution: sections 1/3 are
usually manual Xero entries or consolidated pushes - confirm intent; sections 2/4 mean the
Cin7 document never synced - check Sync History; section 5 means one side was edited - open
both documents.

## 3. Unallocated credit notes (Cin7) — system: Cin7

Sale Overview rows whose Invoice # contains a credit-note reference and Due != 0. A credited
sale should net to zero. **Action** when any exist. Resolution: allocate the credit note
against its invoice (or refund), then confirm the pair washes in Xero AR.

## 4. COGS reconciliation — system: Cin7 — INVESTIGATION, never pass/fail

Sale Overview COGS (sales-side, all order statuses) vs Inventory Movement Details cost-out
(Type=Out, Reference type Sale + SaleMultiple, stock-movement-date basis). These measure cost
of sales differently and are NOT expected to tie: bundles/kits put assembly cost-out in
FinishedGoods, consignment/channel locations and status timing shift the rest. **Info** by
default, **watch** when |variance| > `cogs_watch_pct` (default 10%) as a prompt to trace the
by-type and by-location breakdown the check emits. A large or GROWING gap can mean COGS is
misstated in one system. Never report the raw variance as an error without that context.

## 5. Pending purchase orders review — system: Cin7

Every pending PO line with the v1 action logic: To receive < To invoice -> "Input invoice";
To receive > To invoice -> "Receive stock"; Ordered = To invoice = To receive -> "Void if
order not valid, else progress it". **Watch** when any lines exist.

## 6. Sale credit notes not restocked — system: Cin7

Per stock SKU: credit-note quantity (Sale Invoices & Credit Notes, CR*/CN* rows, SKU present)
vs quantity restocked (Inventory Movement Details, Type=In, Reference Sale/SaleMultiple).
Service-only lines (shipping, refunds, fees - no SKU) are ignored. **Watch** when any SKU's
credited quantity != restocked quantity. Resolution: restock the missing units, or record the
write-off so inventory and COGS stay true; over-restocks are also flagged (stock created
without a credit).

## 7. Trial Balance - Cin7 vs Xero — system: Both — DIFFERENCE MAP, not a tie-out

Cin7 TB period movement (Debit - Credit) per account code vs Xero TB movement (most recent
Debit/Credit pair; account codes parsed from "Name (code)"). Classification per account:
- |diff| <= `tie_tolerance` -> **OK (tie)**
- No Cin7 movement -> **Xero-only activity** (not flagged; Xero carries bank/VAT/payroll/
  journals Cin7 never sees)
- Name matches `tb_expected_patterns` + `tb_expected_extra` -> **Expected finance/non-inventory**
  (not flagged)
- |diff| <= `tb_small_diff` (default R1,000) -> **Small diff** (watch)
- else -> **REVIEW - large gap** (action): Cin7 posted movement that never landed in Xero or
  vice versa. Cross-check against the sync failures and sales recon; fix the sync, not the GL.
Cin7 accounts with movement but no Xero code match are flagged (mapping issue); dormant
unmatched accounts (zero movement) are noted, not flagged. **First-run calibration:** move the
customer's bank/gateway accounts into `tb_expected_extra`.

## 8. Stock received vs invoiced — system: Cin7

Lines where Received != Invoiced. Received > invoiced = **Need Invoice** (GRNI exposure:
creditors understated until the supplier invoice is captured) -> **action**. Invoiced >
received = **Awaiting stock** -> watch. Value shown is the affected PO total.

## 9. Transactions vs stock on hand — system: Cin7 GL

Transactions vs Stock on Hand Difference report: rows where Document Amount != Stock Amount -
the posted journal disagrees with the inventory ledger. **Action** when any exist. Classic
causes: assemblies posted before completion (WIP), in-transit transfers straddling the cut,
GRNI purchase timing. Open each task in Cin7 and complete/re-post the right side.

## 10. Outstanding quotes review — system: Cin7

One row per open quote (lines, quantity, value). **Watch** when any exist - stale quotes
clutter the pipeline and can be converted twice.

## 11. Pending sales orders analysis — system: Cin7

One row per pending order plus channel/customer aggregation. **Watch** when any exist -
pending orders across a period end are unfulfilled demand and understate the period's revenue.

## 12. Cin7 account values overview & integrity — system: Cin7

The context panel: stock on hand value/units (total and by location), invoice/sale/paid/due/
COGS/journals/profit totals, GM%, implied VAT (Invoice - Sale). Plus two row-level identities
across the Sale Overview: **Profit = Sale - COGS + Journals** and **Invoice = Paid + Due**.
**Info** normally; **action** if any row breaks an identity (an inconsistently edited sale).
Stock on hand should tie to the inventory control accounts on the Balance Sheet; Due to AR.

## 13. Gross profit per product — system: Cin7

P&L by Product aggregated per SKU across locations; GP% = GP / sale proceeds. Loss-making SKUs
-> **watch**; any SKU at GP% <= `gp_loss_deep` (default -20%) -> **action**. A deep-negative
GP% is usually a COSTING error (wrong unit cost, missing assembly cost), not genuine
below-cost selling - verify the SKU's cost before anyone reprices.

## Overall health

clear/info = 1.0, watch = 0.5, action = 0.0, averaged over checks that ran. It is a trend
metric for the slider, not a pass mark - a customer with heavy sync traffic will sit lower
than a quiet one at identical discipline.
