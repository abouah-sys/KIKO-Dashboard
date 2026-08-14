# Kiko Vitals: Cin7 Overhaul Execution Playbook

**Creative CFO working paper. Version 1.0, August 2026.**
Companion to CIN7-ACCOUNT-OVERHAUL.md. That document says WHAT to fix; this one says HOW,
item by item, in the same workstream order (A to I). Menu paths are Cin7 Core; where a label
differs slightly in the current UI, the function name is what to search for.

**Who does what, throughout:**

- **Kiko team (Victoria, Aisha, Taylor):** counts, transfers, document cleanup they created,
  consignment recons. Day-to-day hands.
- **Creative CFO (Aidan, Bin):** baseline recon, master data surgery, costing repair, Xero
  journals, integration settings, sign-offs. Anything that touches accounting.
- **Cin7 vendor:** back-end interventions only, on our request (bulk voids beyond UI limits,
  sync re-pushes, settings confirmation). Never let them make unsupervised changes.

---

## A. Baseline

**A1. Pull the 14 exports.** Kiko or CCFO, one hour. Every Cin7 report: Reports menu, set
the period, export as "Excel (without totals)", default column layout. The Xero Sync report
must be Type: All, Status: All (the default hides Skipped). Xero: Accounting > Reports >
Account Transactions (tick Source, Number, Net, Tax columns) and Trial Balance as at period
end, both exported to Excel. Drop everything in one folder, filenames as exported.

**A2. Run the master recon.** CCFO. We run the 13-check engine on the folder, produce the
audit pack and dashboard, and write the findings register. This is the before photo; the
health score becomes the overhaul's progress metric.

**A3. Archive the snapshot.** CCFO. Same day as A1: product list with BOMs (Inventory >
Products > Export, include Bill of Materials export), Product Availability all locations,
open sales list, pending PO list, quotes list. Zip and file in the customer folder.

**A4. Enforce house rules from day one.** Kiko, standing. The six rules are in SOP v2.1
section 8. Every new transaction follows them from today; the overhaul only ever fixes the
past, never chases a moving target.

---

## B. Master data

**B1. SKU renames.** CCFO drives, small catalogue makes this a UI job, not an import job.

1. From the A3 product export, build a three-column map: current SKU, new SKU, reason.
   Convention: RM- prefix for raw materials, FG- for finished goods, SERVICE for services.
   Kill typos (MEDUIM), spaces (MOON BALM), parentheticals ("(Not Limited Edition)" moves
   to the product NAME, never the SKU).
2. Get the map signed off by Kerri/Luke and shared with Shepherd (he creates future
   products in Shopify; he needs the convention).
3. **The one big gotcha:** Shopify matches on SKU. For any FG that is live on Shopify, the
   SKU must be changed in BOTH systems in the same sitting, Shopify first (product created
   there, synced to Cin7), then verify the Cin7 product still maps (Integrations > Shopify >
   product catalogue). Rename RM and component SKUs freely; they never touch Shopify.
4. Rename in Cin7: Inventory > Products > open product > edit SKU > Save. History follows
   the product record; old documents keep working.
5. After each Shopify-visible rename, place a R0 test or check the next real order flows.

**B2. Deactivate dead SKUs.** CCFO. For each candidate (Hydration OLD etc.): check
availability is zero everywhere, check no open documents reference it (search the SKU in
Sales and Purchases lists), then product > Status > Deprecated. Never delete; deprecate.

**B3. Price tiers.** Kiko (Victoria knows the trade prices), CCFO reviews.

1. Confirm tier names: Settings > Reference Books > Price Tiers (e.g. Tier 1 retail,
   Tier 2 trade, Tier 3 distributor). Rename tiers to meaningful labels while there.
2. Fill the gaps in bulk: Inventory > Products > Export, fill the PriceTier columns in the
   sheet for every sellable FG, re-import via Inventory > Products > Import (update mode).
   The July data shows all 30C variants and several bundles at R0 on every tier.
3. Cross-check against the Stockist Framework doc (margins per stockist) so tier prices
   reproduce the agreed stockist margins.

**B4. BOM review.** CCFO with Taylor.

1. Export all BOMs (product export includes a BOM sheet).
2. Check each FG: components match the real recipe (printed bottle + box + capsules), and
   each printed-bottle BOM consumes plain bottle + lid.
3. Check every labour/service line against the current fee: Bottle Printing Fee per bottle
   (R2.19 today; confirm with Bottle Printers), Lab Filling and Assembly Fee (confirm
   against Nutralab's latest invoice). Stale fees are the number one cause of wrong FG cost.
4. Fix in the product > Bill of Materials tab. Changes apply to future assemblies only;
   historical cost is repaired in workstream F, not here.

**B5. Batch and expiry tracking on every FG and capsule SKU.** CCFO plans, because there is
a hard constraint: **Cin7 will not let you switch a product to batch tracking while it has
stock on hand.** So:

1. List SKUs that should be batch-tracked but are not (compare product export "Costing
   method / batch" column to the FG + capsule list).
2. For each: this flip happens during the stock take window (E1). Adjust the stock out
   (reference "batch tracking enable"), flip the product to batch tracking, adjust back in
   WITH batch numbers and expiries from the physical count and the lab's records.
3. Do not attempt this outside the count window; you would be inventing batch numbers.

**B6. Supplier records.** Kiko (Aisha), one afternoon. Purchases > Suppliers: set payment
terms per the supplier list (Nutralab: instalments, note in comments; Bonpak 30 days, note
R100k credit limit; Trident 30 days; the rest cash on invoice), accounts contact email,
default currency. This makes the pending-PO report and cash flow planning honest.

**B7. Customer records.** Kiko (Victoria) with CCFO. Sales > Customers: payment terms per
the stockist framework (Dischem 90 days month-end, Wellness Warehouse 60, Superbalist/FTN/
TFG 30, Mkem 60, small stockists cash on invoice), price tier per customer, and tag or
naming convention separating consignment stockists from buying stockists. The B2B Portal
reads terms and tiers from here; G4 depends on this being complete.

---

## C. Locations

**C1. Strip trailing spaces.** CCFO, 30 minutes, FIRST location task.

1. Settings > Reference Books > Locations. Edit each name, delete the trailing space, save:
   "Nutra Lab ", "Takealot JHB ", "Takealot Durban " (re-check the full list; copy each
   name into a text editor to see the spaces).
2. Immediately after: Integrations > Shopify > location mapping. Re-verify every mapping,
   because Shopify-to-Cin7 matching is exact-name and a rename can silently unmap.
3. Also check any saved report filters and the B2B Portal fulfilment location.

**C2. Wind down the Dischem location.** Kiko executes, CCFO supervises.

1. Resolve the negatives first: the minus 9 available on FG-HORMONE-60C means open
   documents allocate more than is there. Sales > list, filter location Dischem, deal with
   each open order (complete it from Main Warehouse or void it).
2. Deal with the 455 "on order" to Dischem: that is a PO or transfer inbound to a location
   being closed; redirect it to Main Warehouse (edit the document's location before
   receipt).
3. Physically nothing moves; in Cin7, Inventory > New Transfer, From: Dischem, To: Main
   Warehouse, all remaining stock, reference "Dischem location wind-down".
4. When availability at Dischem is zero and no open documents remain: Settings > Reference
   Books > Locations > deactivate.
5. From now on Dischem sales are ordinary B2B invoices shipped from Main Warehouse.

**C3. Retire stale locations.** Same recipe as C2 for The Lot CMT and (pending Victoria's
confirmation) merge "Olio Store local pick ups" into "The Olio Store": transfer stock to
the surviving location, zero it, deactivate.

**C4. Move stray raw materials off consignment locations.** Kiko. From availability filtered
by each consignment location, any RM- line gets a transfer back to Main Warehouse (e.g. the
2 RM-BOX-STD-HB at The Lot Sea Point). Consignment locations hold FG only, ever.

**C5. Supplier locations.** Nothing to click; Bottle Printers and Joypak locations stay
empty by convention. Add one line to the SOP house rules: never receive stock into a
supplier location. Deactivate them if the team prefers zero temptation.

**C6. Final location list.** Victoria confirms which stockists are live (she expects the
list to shrink). Each departing stockist follows the C2 recipe: invoice final sales, pull
back remaining stock (physical transfer this time), zero, deactivate.

---

## D. Open document cleanup

Sequence matters: sales orders first (they hold allocations), then POs, then credit notes,
then the sync log. Everything in D happens BEFORE the stock take, so the count runs against
a true open position.

**D1. Stale sales orders.** Kiko (Victoria) with CCFO on the first pass.

1. Sales > list, filter Status = Ordered/Backordered, sort oldest first. Export it.
2. For each order, one of three moves:
   - Real future order: keep, note expected fulfilment date.
   - Was only ever a quote: open it, undo the authorisation and revert to quote (if it has
     no fulfilment or invoice attached, Undo then save as quote; otherwise void and re-raise
     as a quote).
   - Dead: Void. If picking/packing has started, undo pick/pack/ship steps first (the void
     option stays greyed out until fulfilment is undone).
3. Success check: Product Availability shows no negative Available anywhere. The minus 489
   on Hydration Electrolytes at Main Warehouse unwinds here.

**D2. Pending purchase orders.** Kiko (Aisha) with CCFO.

1. Pull Pending Purchase Orders (This year). Every line lands in one of three buckets:
   - Received but not invoiced: open the PO > Invoice tab > Copy from stock received >
     enter the supplier's invoice number and date > Authorise. (This is also D3.)
   - Invoiced but not received: goods genuinely in transit is fine (GINR asset). If the
     goods landed long ago, do the Stock Received tab now with the real arrival date.
   - Dead PO (e.g. the June capsule POs if superseded): Void, or edit quantities down to
     what actually arrived and close it out.
2. Success check: Stock Received vs Invoiced report is empty of "Need Invoice" rows and
   GRNI/GINR in Xero trend to zero over the cycle.

**D3. GRNI clearance.** Covered by D2 bucket one; the report to drive it is Stock Received
vs Invoiced for the period.

**D4. Unallocated credit notes.** CCFO (this is accounting).

1. Sale Overview report: rows with CR-/CN- in the invoice number and Due not 0.
2. Open each credit note: allocate it against the customer's open invoices (Sales >
   Customer > allocate), or process the refund if money went back.
3. The WeAreEGG credit notes flagged in the handover get done here.
4. If credited stock was physically returned, verify the restock happened (Inventory
   Movement Details, In, Sale type); if not, restock or write off explicitly.

**D5. Xero sync log to zero.** CCFO.

1. Integrations > Xero > sync log/history. Filter Failed and Warning.
2. Three classes: (a) genuinely missing in Xero: fix the cause (bad account mapping, tax
   rate, archived account) and re-push; (b) already correct in Xero (Cin7 re-pushing paid
   invoices): mark Skipped; (c) mapping errors: fix mapping (G3) first, then re-push.
3. Success check: the next Xero Synchronisation Report (Status: All) shows zero Failed and
   zero unexplained Warning.

---

## E. Stock accuracy

**E1. The full costed stock take at Main Warehouse.** Kiko counts, CCFO runs the system
side. This is the anchor event of the whole overhaul; B5 (batch flips) and F (costing
repair) both hang off its effective date. Runbook:

1. Pick a quiet day (weekend or lowest-order weekday). Announce a fulfilment cut-off:
   everything shipping that day is picked and set aside BEFORE the count starts, counted
   separately as "to ship".
2. Pre-count: finish D1/D2 first; print count sheets or prep the CSV (see E2) from Product
   Availability run that morning.
3. In Cin7: Inventory > New Stock Take. Effective date = count day. Location = Main
   Warehouse. Variance account = the dedicated stock discrepancy expense account (never
   COGS). Reference = "Full count YYYY-MM-DD".
4. **The lockdown is real:** while the stock take is open, no receipts, fulfilments,
   transfers or adjustments at that location. That is why the cut-off exists. Do not start
   it until the team is ready to finish it the same day.
5. Count blind (hide system quantities on the sheet). Capture batch and expiry per line
   while counting; short-dated or expired stock goes on a write-off list, not back into
   sellable count.
6. Enter counts (manual, or CSV import into the stock take), review variances. Investigate
   anything material before authorising: is it a miscount, an unentered assembly, a missed
   transfer? Fix root documents where they exist rather than absorbing everything into
   variance.
7. Authorise (one-way door), Complete. Cin7 posts the variance and syncs to Xero.
8. Same day, after completion: run the B5 batch-tracking flips while quantities are fresh
   and verified.

**E2. The weekly cycle-count CSV process.** Aidan is building this (action from 13 Aug).
The shape: export Product Availability for the location on count day > sheet with system
qty next to a Count column > team fills counts > variance column computes > rows with
variance format into the Stock Adjustment import template > Inventory > New Stock
Adjustment > Import > review > every adjustment carries the reason and reference >
Complete. Cycle counts use adjustments precisely because they do NOT lock the location.

**E3. Consignment reconciliation, monthly.** Victoria owns.

1. Collect each stockist's month-end report (contacts and quirks are tabled in SOP v2.1
   section 12 and the handover).
2. Invoice what sold FIRST (sale per stockist, location = their location, ship from their
   location; that posts COGS and removes sold units).
3. THEN compare their reported SOH to Cin7 availability at their location. After invoicing
   they should match.
4. Gaps: query the stockist before touching Cin7. Confirmed losses become adjustments
   (damaged/discrepancy account, comment mandatory); missed drops become backdated
   transfers (the real record), never adjustments.

**E4. Nutralab count tie-in.** Taylor's existing weekly routine, formalised: lab sends the
count, Taylor compares to Cin7 (today against Main Warehouse; post-migration against Nutra
Lab location), differences investigated the same week. Keep the weekly emails filed.

**E5. Write-offs.** Kiko executes from the E1/E3 flag lists: Inventory > Inventory
Write-Off > New, location, expense account matched to reason (expired, damaged, marketing
for seeding/PR), the SPECIFIC batch, complete. Large write-offs get flagged to CCFO before
posting (VAT: input VAT claimed on stock later written off can need an adjustment; we
check each material case).

---

## F. Costing repair

CCFO only. Do not start until E1 is authorised; corrections need verified quantities.

**F1. Quantify the damage.**

1. Inventory Movement Details for the affected periods, filter Adjustment type, isolate the
   adjusted-in FG runs (the audit found 1,920 Meno, 1,522 Debloat, 1,112 Hormone).
2. For each run: unit cost the FGs entered at (often zero or a guess) vs true rolled-up
   cost (BOM components at their FIFO cost on that date plus labour lines).
3. Identify the orphaned components: what SHOULD have been consumed and is still sitting in
   stock on paper. The E1 count already told us what is physically there; the gap between
   book and count on components largely IS this damage, which the stock take variance has
   now partly absorbed. Reconcile the two so nothing is corrected twice.

**F2. Correct in place.** Preferred route (no reopening closed periods):

1. Components: the stock take already trued up quantities. Whatever component overhang the
   count absorbed into the variance account gets reclassified by journal (F3) from
   discrepancy to COGS/production, so the P&L tells the truth about WHY.
2. FG cost: Inventory > Stock Revaluation on the affected FG batches, from booked cost to
   true rolled-up cost, effective the stock take date, reference "Overhaul costing repair".
3. Where a run is recent and its period still open: cleaner to void the adjustment and
   process the real Assembly instead (Production > New Assembly, correct date, batch,
   quantities). Prefer this whenever the period allows.

**F3. The Xero journal.** One manual journal (or a small set) so Xero inventory and COGS
agree with corrected Cin7: move the misstated amounts between inventory, COGS and the
discrepancy account. Draft it, walk Kerri and Luke through the P&L impact, get sign-off in
writing, post, and keep the working paper.

**F4. Verify.** Re-run P&L by Product and the TB tie-out (recon checks 12, 13 and 7). FIFO
layers spot-checked on the top five SKUs. Only now does the GP-per-product review mean
anything; schedule it as the follow-on piece.

---

## G. Integrations

**G1. Shopify settings review.** CCFO, against the standard in the KB SOP: Integrations >
Shopify: capture mode = Paid; master data source = Cin7 Core; location mappings verified
post-C1 (exact names); each payment method mapped to its clearing account (Paystack,
Payfast, PayJustNow per gateway); price tier per store correct; import-duplicate-SKUs off.
Screenshot every settings page into the customer folder as the configuration record.

**G2. Turn on the stock push.** Only after E1. Pick a low-traffic hour. Integrations >
Shopify > enable "Update Stock Levels (Cin7 to Shopify)". Immediately spot-check ten SKUs
Cin7-vs-storefront. From that moment the house rule applies: nobody adjusts stock in
Shopify, ever; Cin7 overwrites it on the next push.

**G3. Xero mapping review.** CCFO: Integrations > Xero > account and tax mapping. Confirm
inventory asset, COGS, GRNI, GINR, the discrepancy account, and that credit note postings
hit the rebate/discount accounts (1011/xxx, 2011/xxx) where the trading terms require.
Fix mappings BEFORE re-pushing sync failures (D5 class c).

**G4. B2B Portal cutover.** Depends on B3 + B7 (tiers and terms complete).

1. Confirm every account stockist can log in, sees their tier prices and their terms.
2. Parallel-run one full month: portal orders flow to Cin7, finance marks paid on POP as
   today, Monday.com board still updated.
3. Cutover criteria (agree with Kerri/Luke up front): one calendar month where every B2B
   order arrived via the portal, priced correctly, with zero manual corrections. Criteria
   met: retire the Monday.com B2B board.

**G5. Gateway clearing accounts.** CCFO monthly: Paystack, Payfast, PayJustNow clearing
accounts in Xero reconcile to the payout cycle (PayJustNow pays out 3rd business day of
the following month; Payfast releases are manual by Shep/Kerri, chase them monthly).

---

## H. Process, people and access

**H1. KB live 24 Aug.** Already in motion: site deploys, Victoria and Aisha confirm access
(their action from 13 Aug), SOPs editable by the team.

**H2. Record the live assembly session.** Aisha gives Aidan a heads-up on the next Nutralab
delivery; Aidan joins, they process the real Assembly on camera; video goes into the KB
production module. Locks in the single most error-prone process.

**H3. Name the consignment invoicing owner.** One conversation: Kerri decides between
Victoria (SOP's current owner), Kristal, Bardene. The name goes into SOP v2.1 section 12
and the monthly cadence calendar. Done in one edit.

**H4. Write the Free Stock SOP.** CCFO drafts (we have the handover's category breakdown):
categories (influencer/ambassador campaigns, sponsorships online and B2B, samples, staff
replenishments, Trish), each with its route: 100% discount sale (current method, per Mark)
or write-off to the right marketing/samples account, reason mandatory in reference. Include
the approval step (finance approves free stock movements on Monday.com). One page. Publish
to the KB.

**H5. Access review.** CCFO with Kerri: Settings > Users & Roles. List every user, confirm
role fits the job (warehouse users cannot void sales or edit BOMs; finance roles for
finance), grant Bardene the role her H3 outcome requires, remove leavers. Screenshot the
final user list into the customer folder.

**H6. The cadence calendar.** One page in the KB: Dischem statement by the 7th; all
statements 10th/15th; consignment recon on receipt of stockist reports; master recon after
month-end close; sync log check weekly; cycle counts weekly; full count quarterly. Each
line has an owner from H3/H5.

---

## I. Controls that keep it fixed

**I1. Monthly master recon.** CCFO runs the 13-check engine every month-end from the same
14 exports; the dashboard's period slider builds the history. Health score is reported to
Kerri and Luke with the findings register: what broke, who fixes it, in which system.

**I2. Findings register discipline.** Every action/watch finding carries owner and due
date; anything unresolved carries over visibly (orange edge on the dashboard) until closed.

**I3. Count rhythm.** Weekly cycle counts (E2), quarterly full count (E1 runbook), annual
count with the Stock Take function and a specialist on the call.

**I4. Onboarding.** Every new starter gets the KB, SOP v2.1, and the house rules before
Cin7 access. Access granted at the correct role from day one (H5).

---

## Sequence at a glance

```
Week 1      A1-A4 baseline + freeze
Weeks 1-2   B1-B4, B6-B7 master data   |   C1-C6 locations
Weeks 2-3   D1-D5 document cleanup
Week 3-4    E1 stock take day (+ B5 batch flips same day) -> E5 write-offs
Weeks 4-5   F1-F4 costing repair + Xero journal + sign-off
Weeks 5-6   G1-G3 integrations, G2 stock push ON
Weeks 6-7   G4 B2B portal parallel month begins
From week 7 H + I standing routine; Nutra Lab migration optional later
```

Dependencies to respect: C1 before any mapping work. D before E. E before F and G2.
B3 + B7 before G4. Everything before the Nutra Lab migration.

---

**CREATIVE CFO · SYSTEMS · INTERNAL WORKING PAPER · VERSION 1.0 · AUGUST 2026**
