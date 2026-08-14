# Kiko Vitals: Cin7 Core Account Overhaul

**Creative CFO working paper. Version 1.0, August 2026.**
Prepared ahead of Kiko's engagement with Cin7 on an account overhaul. This is the deep dive,
the checklist, and the proposed route. Internal working document, not customer-facing yet.

---

## 1. Why now

Kiko approached Cin7 wanting an overhaul of their account. Before anyone (Cin7 included)
starts changing things, we need to agree what "overhaul" means, because two very different
projects hide behind that word:

1. **Re-implementation:** a fresh account or a rebuilt configuration, new opening balances,
   history left behind.
2. **Fix-in-place:** repair the master data, clean the open documents, correct the stock and
   costing, tighten the integrations, and keep the history.

**Our recommendation is fix-in-place.** The reasons:

- The breaks found in the July 2026 audit are process breaks, not platform breaks. The
  account structure (locations, BOMs, integrations) is fundamentally sound.
- The groundwork is already done: SOP v2.1 is written, house rules are agreed, the team is
  trained (Inventory module session 13 Aug), the knowledge base site goes live to the team
  on Monday 24 Aug.
- A fresh account loses the audit trail, the batch history that does exist, the Shopify and
  Xero connection history, and every lesson embedded in the current data.
- The one genuine argument for a fresh start is corrupted costing history. That is repairable
  in place with a costed stock take plus targeted corrections (Section 5, workstream F).

A re-implementation would only make sense if Cin7 finds structural damage we have not seen.
If Cin7's proposal is a rebuild, ask them to name the specific damage that cannot be
repaired in place.

---

## 2. Current state: what we know

**The business.** Kiko Vitals sells supplements D2C via Shopify, B2B to stockists on account
(Wellness Warehouse, Dischem, Superbalist, Faithful to Nature, TFG, Mkem/Clicks and smaller
stores), and on consignment (Takealot CPT/JHB/Durban, The Lot, The Olio Store, WeAreEGG).
Manufacturing is outsourced: suppliers deliver components directly to Nutralab, which
manufactures, fills and assembles. Kiko never touches raw materials.

**The systems.** Cin7 Core is the inventory master, synced to Xero. Shopify is connected
with Cin7 as master data source. The B2B Portal is rolling out (orders still tracked in
parallel on Monday.com during transition). Finance ops run through Monday.com boards
(Orders & Quotes, Invoices, B2B Orders) plus Hubdoc for non-stock bills.

**The setup decisions already made (deliberate, not defects):**

- One-warehouse model: everything is booked at Main Warehouse, including stock physically at
  Nutralab. Nutra Lab location exists, mapped, dormant by choice. A migration path to
  per-site visibility is defined in SOP v2.1 (one count + one opening transfer).
- Auto-assembly is off. Assemblies are manual because Nutralab does the manufacturing and
  runs must be confirmed against the lab's production data.
- Consignment stockists are Cin7 locations. Transfer out at drop, invoice only what sold at
  month-end from their location.

---

## 3. The issues register

From the July 2026 audit, the August training session, and the July stock data.

### Confirmed breaks (from the July audit)

| # | Issue | Impact |
|---|-------|--------|
| 1 | Production runs adjusted in instead of assembled: 1,920 Meno, 1,522 Debloat, 1,112 Hormone units | Components never consumed, finished goods carry no rolled-up cost. Costing and GP wrong downstream |
| 2 | Only 48% of FG assembly lines carried batch numbers at audit | Traceability broken for a supplements business. Recalls and FEFO impossible on untracked stock |
| 3 | 400-unit production run booked at the Dischem location (reversed) | Location discipline failing; stock sold from wrong locations too |
| 4 | Printed-bottle SKUs bought as stock from the printer at the print fee | Plain bottles and lids double-counted, printed bottles under-costed |
| 5 | Stock adjustments used to correct missed transfers, without comments or references | Unauditable movements; the training session confirmed this happened at WeAreEGG |
| 6 | Quotes completed as orders to park stock | Stock allocated, batches blocked from selling FIFO/FEFO |

### Symptoms visible in the July stock data

| # | Symptom | What it points to |
|---|---------|-------------------|
| 7 | Hydration Electrolytes at Main Warehouse: 555 on hand, 1,044 allocated, available **minus 489** | Stale open sales orders parking stock (issue 6 in action) |
| 8 | Dischem location holds FG stock with available **minus 9** and 455 on order | Dischem is a buying stockist (normal B2B sale), not consignment. Location should wind down; SOP already flags this |
| 9 | Raw material (RM-BOX-STD-HB) sitting at The Lot Sea Point | Consignment locations should only ever hold finished goods |
| 10 | Trailing spaces in live location names: "Takealot JHB ", "Takealot Durban ", "Nutra Lab " | Integrations and transfers match names exactly; this breaks syncs silently |
| 11 | Stale or duplicate locations: "The Lot CMT" alongside The Lot Sea Point/Cavendish; "Olio Store local pick ups" alongside "The Olio Store" | Location list no longer matches the live stockist list (which Victoria says will shrink further) |
| 12 | SKU hygiene: "FG-BUN-HEAL-GUT (Not Limited Edition)", "RM-MOON BALM-50g", "RM-TFG-MEDUIM-BOX" (typo), OLD vs NEW Hydration Electrolytes SKUs, mixed casing | Naming convention (RM / FG / Service) agreed but not yet enforced across the catalogue |
| 13 | Price tiers blank (R0) on sellable FGs, e.g. all 30C variants | B2B Portal and tiered pricing cannot work with empty tiers |
| 14 | Capsule SKUs at zero on hand with POs on order dated June 2026 | Stale or half-finished purchase orders |

### Process and ownership gaps (from the finance handover)

| # | Gap | Detail |
|---|-----|--------|
| 15 | Consignment invoicing ownership unclear | Handover: "Not sure who is invoicing consignment sales? Kristal and Bardene to work together." SOP names Victoria as owner. One owner must be named |
| 16 | No Free Stock SOP | Influencer seeding, samples, staff replenishments currently run as 100% discount sales. Needs a documented SOP with the write-off routes per category (marketing vs samples vs staff) |
| 17 | B2B running in two systems | Monday.com boards and the B2B Portal in parallel. Fine for transition, but the overhaul should set the cutover criteria |
| 18 | POS items (shelf talkers, card inserts) expensed outside Cin7 | Deliberate, but should be documented so nobody "fixes" it into stock |
| 19 | Access control unreviewed | Bardene's Cin7 access pending; no recent review of who holds which role |

---

## 4. The overhaul checklist

Nine workstreams, sequenced. Every item names the system it gets fixed in.

### A. Baseline (do first, before anything is changed)

- [ ] Pull the 14 recon exports (12 Cin7 + 2 Xero, list in Section 6) for July 2026
- [ ] Run the Creative CFO Cin7 × Xero master recon (13 checks) as the baseline health score
- [ ] Snapshot exports archived: product list with BOMs, full availability by location, open SOs/POs/quotes, Xero sync report (status All)
- [ ] Enforce the six house rules from today; the overhaul is pointless if new breaks accumulate behind it

### B. Master data (Cin7, no stock impact)

- [ ] Rename every SKU to convention: RM- / FG- / Service. Fix typos and strip parentheticals ("(Not Limited Edition)") into the product name, not the SKU
- [ ] Deactivate dead SKUs (Hydration Electrolytes OLD and similar) after confirming zero stock and no open documents
- [ ] Complete price tiers 1 to 3 on every sellable FG (retail, and the trade tiers the stockist framework defines). Blank tiers block the B2B Portal
- [ ] Review every BOM: components match reality; printed-bottle BOMs consume plain bottle + lid; labour lines match current fees (printing R2.19 per bottle, lab filling and assembly fee at the lab's current rate)
- [ ] Confirm batch and expiry tracking is switched on for every FG and capsule SKU
- [ ] Supplier records match the supplier list (terms, contacts): Nutralab instalment terms, Bonpak 30 days / R100k limit, Trident 30 days, rest cash on invoice
- [ ] Customer records match the stockist framework: terms (Dischem 90 days, Wellness Warehouse 60, Superbalist/FTN/TFG 30, Mkem 60), price tier per customer, consignment vs buying flag

### C. Locations (Cin7)

- [ ] Strip trailing spaces from every location name (Nutra Lab, Takealot JHB, Takealot Durban) BEFORE any integration mapping work
- [ ] Wind down the Dischem location: transfer or sell out remaining stock, then deactivate. Dischem is invoice-on-dispatch from Main Warehouse
- [ ] Retire stale locations (The Lot CMT; merge or clarify "Olio Store local pick ups" vs "The Olio Store")
- [ ] Move the stray raw materials off consignment locations (issue 9)
- [ ] Confirm supplier locations (Bottle Printers, Joypak) hold zero and stay receive-blocked by convention
- [ ] Match the final location list to the live stockist list with Victoria (it is shrinking)

### D. Open document cleanup (Cin7)

- [ ] Work the open sales order list: unallocate and void stale orders (starts with the minus 489 Hydration Electrolytes position)
- [ ] Convert parked "orders" back to quotes where they were quotes all along
- [ ] Work the pending PO list: receive, invoice, or void every line (capsule POs from June first)
- [ ] Clear GRNI: every stock receipt gets its invoice tab authorised or the receipt corrected
- [ ] Allocate or void unallocated credit notes; process the WeAreEGG credit notes the handover flags
- [ ] Clear the Xero sync report: fix or skip every Failed/Warning entry, then keep it at zero

### E. Stock accuracy (physical + Cin7)

- [ ] Full costed stock take at Main Warehouse. Use the Stock Take function deliberately: planned quiet day, fulfilment cut-off, specialist on hand (it locks the location; Aisha has been burned by this before)
- [ ] Weekly cycle counts continue via Stock Adjustment + CSV import (Aidan building the import process; action from 13 Aug session)
- [ ] Consignment reconciliation: SOH report from every stockist, tie to Cin7 location quantities, invoice gaps investigated before adjusting (Victoria owns, monthly)
- [ ] Nutralab count: lab's weekly count tied to Cin7 (Taylor's routine, formalised)
- [ ] Batch and expiry captured on all counted stock during the take; short-dated and expired batches flagged for write-off, not counted back in
- [ ] Write off expired/damaged/seeded stock to the correct expense accounts (marketing for influencer seeding, per the Free Stock categories)

### F. Costing repair (Cin7 + Xero, do with Creative CFO)

- [ ] Quantify the damage from the adjusted-in runs (1,920 + 1,522 + 1,112 units): what did those FGs enter stock at, and what components were left unconsumed
- [ ] Correct in place: consume the orphaned components (adjustment out at cost, referenced to this project) and revalue the affected FG batches to true rolled-up cost, or reverse and re-run assemblies where the period is still open
- [ ] Post the matching Xero journal so inventory and COGS agree with the corrected Cin7 position; agree the P&L impact with Kerri and Luke before posting
- [ ] Verify FIFO layers on the top SKUs after correction
- [ ] Only after this: the GP-per-product review (flagged in SOP v2.1 as the next piece of work). Until costing holds, GP by product cannot be trusted

### G. Integrations (Cin7 ↔ Shopify, Cin7 ↔ Xero, B2B Portal)

- [ ] Shopify settings review against the standard: capture mode Paid, master data source Cin7 Core, location mapping exact-name-match (after C), payment methods mapped to the right accounts, price tier per store
- [ ] "Update Stock Levels (Cin7 to Shopify)" stays OFF until the stock take has verified quantities; switching it on is the prize for finishing workstream E
- [ ] Xero mapping review: chart of accounts sync, tax rules, the rebates/discounts accounts (1011/xxx, 2011/xxx) and marketing splits (3610/xxx) mapped where Cin7 posts touch them
- [ ] B2B Portal: tiers and terms live per customer, then set the cutover date to retire the Monday.com B2B board (management wants parallel running until trust is earned; define what earns it)
- [ ] Payment gateway clearing accounts (Paystack, Payfast, PayJustNow) reconcile to zero monthly

### H. Process, people and access

- [ ] SOPs live on the knowledge base site 24 Aug; team confirms access (Victoria + Aisha, action from 13 Aug)
- [ ] Record the live production assembly session with Nutralab stock receipt (Aidan joins, action from 13 Aug) and publish to the KB
- [ ] Name one owner for consignment invoicing (resolve Kristal/Bardene/Victoria) and put it in the SOP
- [ ] Write the Free Stock SOP: categories (influencer/ambassador, sponsorship, B2B samples, staff, Trish), each with its stock movement route and expense account
- [ ] Access review: every Cin7 user, role-appropriate permissions; grant Bardene the right role; remove leavers
- [ ] Monthly cadence calendar: consignment recon, statements (Dischem by 7th, rest 10th/15th), master recon, Xero sync check

### I. Controls that keep it fixed

- [ ] Monthly Cin7 × Xero master recon (13 checks) with the dashboard; health score tracked period over period
- [ ] Findings register maintained; carried-over findings visible until closed
- [ ] Quarterly full count + monthly cycle counts on fast movers
- [ ] House rules poster/reference in the KB; every new starter trained against SOP v2.1

---

## 5. Proposed route: five phases

**Phase 0. Baseline and freeze (week 1).**
Run the master recon on July. Archive the snapshot exports. House rules enforced from day
one. Nothing is changed yet; we need the before picture, because the overhaul's success is
measured as after minus before.

**Phase 1. Configuration hygiene (weeks 1 to 2).**
Workstreams B and C. No stock impact, no downtime, immediately reduces sync risk. Trailing
spaces first; they silently break everything else.

**Phase 2. Documents, stock and costing (weeks 2 to 5).**
Workstreams D, E, F in that order: clean the open documents so the stock take counts against
a true open position, take the count, then repair costing on top of verified quantities. The
stock take needs a planned quiet day and a specialist on the call. Costing corrections are
agreed with Kerri and Luke before posting.

**Phase 3. Integrations and B2B (weeks 5 to 7).**
Workstream G. The reward structure is deliberate: verified stock unlocks the Cin7-to-Shopify
stock push; complete tiers and terms unlock the B2B Portal cutover; both retire manual
workarounds (Monday.com B2B board, manual stock checks).

**Phase 4. Lock it in (from week 7).**
Workstreams H and I as standing routine. Monthly master recon becomes the heartbeat. The
Nutra Lab location migration (one count + one opening transfer, per SOP v2.1) is scheduled
here as an optional, cleanly-scoped step once the basics hold, if Kerri and Luke still want
per-site visibility.

### What to use Cin7 (the vendor) for

Scope their involvement to what only they can do, and keep the rest in-house where the
context lives:

1. Account-level settings review and anything requiring back-end intervention (bulk
   void/undo beyond UI limits, template issues, sync re-pushes)
2. Confirmation of the Shopify connector settings against their current best practice
3. A named support contact for the stock take day and the costing-repair window
4. If they propose a re-implementation: require the specific irreparable damage in writing
   before agreeing. History, integrations and training all argue for fix-in-place

### Decision points for Kerri and Luke

| Decision | Options | Our recommendation |
|----------|---------|--------------------|
| Overhaul shape | Fix-in-place vs re-implementation | Fix-in-place (Section 1) |
| Costing repair | Reverse and re-run vs correct-and-revalue | Correct-and-revalue at the stock take date; cleaner audit trail, no period reopening |
| Nutra Lab migration | Now, with the overhaul, or later | Later (Phase 4). One change programme at a time; the SOP already documents the path |
| Dischem location | Wind down now vs keep | Wind down in Phase 1 to 2; it is a buying stockist |
| B2B Portal cutover | Date-based vs criteria-based | Criteria-based: tiers complete, terms loaded, one clean month of portal orders |

---

## 6. What we need from Kiko (and Cin7) to start

### The 14 recon exports for the baseline (July 2026, or latest full month)

Every Cin7 export: default column layout, "Excel (without totals)", run for the audit period
unless stated. Xero exports to Excel, not PDF.

| # | Source | Report | Period / settings |
|---|--------|--------|-------------------|
| 1 | Cin7 | Sale Invoices & Credit Notes | Audit period |
| 2 | Cin7 | Sale Overview | Audit period |
| 3 | Cin7 | Sale Outstanding Quotes | This year |
| 4 | Cin7 | Pending Sale Orders | Audit period |
| 5 | Cin7 | Pending Purchase Orders | This year |
| 6 | Cin7 | Stock Received vs Invoiced | Audit period |
| 7 | Cin7 | Transactions vs Stock on Hand Difference | Effective date = period end |
| 8 | Cin7 | Inventory Movement Summary | Audit period |
| 9 | Cin7 | Inventory Movement Details | Audit period, Mode: Stock movement date |
| 10 | Cin7 | Xero Synchronisation Report | Audit period, Type: All, Status: All |
| 11 | Cin7 | Profit & Loss by Product | Audit period |
| 12 | Cin7 | Trial Balance | Audit period From/To |
| 13 | Xero | Account Transactions | All accounts, audit period, Source/Number/Net/Tax columns ticked |
| 14 | Xero | Trial Balance | As at period end |

### Overhaul-specific extras

| # | What | Why |
|---|------|-----|
| 15 | Cin7 product list export, all products, with BOM detail | Workstream B: SKU renames, BOM review, tier gaps |
| 16 | Product Availability, all locations, current | Workstream C/E: location cleanup and count planning |
| 17 | Cin7 users list with roles | Workstream H: access review |
| 18 | Screenshots of Integrations > Shopify settings pages | Workstream G: settings review |
| 19 | Screenshots of Integrations > Xero mapping (accounts + tax) | Workstream G |
| 20 | B2B Portal settings and customer tier assignments | Workstream G |
| 21 | Whatever Cin7 (the vendor) has proposed or quoted so far | Scope control, Section 5 |
| 22 | Latest SOH reports from each consignment stockist | Workstream E recon |

Read-only Cin7 access for Creative CFO covers items 15 to 20 in one step if easier.

---

## 7. What success looks like

- Master recon health score at or near 1.0 for two consecutive months, zero action items
- Every FG batch traceable to a lab batch and expiry (from 48% to 100% on new runs)
- GP per product trusted and reviewed monthly
- Cin7-to-Shopify stock push ON, safely
- B2B Portal is the single B2B order channel; Monday.com B2B board retired
- One SOP set, live on the KB, with named owners for every routine

---

**CREATIVE CFO · SYSTEMS · INTERNAL WORKING PAPER · VERSION 1.0 · AUGUST 2026**
