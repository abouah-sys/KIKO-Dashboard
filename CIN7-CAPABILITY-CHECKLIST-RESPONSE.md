# Kiko Vitals: Cin7 Capability Checklist, Answered

**Creative CFO response to the Kiko Vitals Operations "Cin7 Capability Checklist" (August
2026) and to Zoey's (Cin7 Support) summary.** Every checkbox answered: current status at
Kiko, how to achieve it, and an honest flag where the capability is not native Cin7.

**Status legend:**

- **YES** — configured and in active use today
- **PARTLY** — exists but incomplete or not yet trustworthy
- **NO** — not configured; achievable in Cin7
- **NOT CIN7** — not a native Cin7 Core capability; needs a pairing or a different owner
- **VERIFY** — plan- or region-dependent; confirm with Zoey before promising it

Cross-references like (Playbook B3) point to CIN7-OVERHAUL-PLAYBOOK.md, which has the
step-by-step for each fix.

---

## The four goals up front

| Goal | Straight answer |
|------|-----------------|
| Easily track inventory and identify stock status | Cin7 does this natively (Availability + reports), but the numbers are only as good as the discipline behind them. Today availability shows negatives and unconsumed components, so the display is right and the data is wrong. Achieved by the overhaul workstreams D (document cleanup) and E (stock take), then kept true by the house rules |
| Revenue + profit by channel, ideally against targets | Revenue by channel: native, once channel identification is standardised (Section 2 below). Profit by channel: native, but meaningless until costing is repaired (Playbook F). Against targets: not native; that is the Creative CFO monthly reporting layer |
| Stockist health scores, all stockists not just top | Not a native Cin7 report. The ingredients live in Cin7 (sales per customer, payment behaviour, order frequency); the score is built outside it. Creative CFO builds this from Cin7 + Xero exports as part of the monthly pack |
| Insights without manually extracting data | Partly achievable natively (saved report views, favourites). The full answer is the reporting layer Creative CFO already runs (master recon dashboard, monthly pack); automating the feed is Phase 4 work |

---

## 1. B2B Stockist Portal

| Item | Status | Answer |
|------|--------|--------|
| Branded portal live (logo, colours, styling) | PARTLY | Portal is rolling out (B2B orders still parallel-tracked on Monday.com). Branding is a settings task in the B2B Portal configuration: upload logo, set the Kiko palette. One sitting |
| Stockist accounts with correct access level | PARTLY | Customer records exist; portal invitations need to go out per account stockist. Do AFTER terms and tiers are complete (Playbook B7), or stockists see wrong prices on day one |
| Real-time stock visibility accurate for stockists | NO, blocked | The portal shows Cin7 availability, which today includes negative available positions (minus 489 on Hydration Electrolytes). Showing stockists this data would embarrass us. Unblocked by document cleanup (Playbook D1) + the stock take (E1). Do not confirm this box until the master recon health score says stock is trustworthy |
| Custom price lists / tiers per stockist or group | PARTLY | Tiers exist but many sellable products carry R0 on every tier (all 30C variants, several bundles). Fill tiers in bulk (Playbook B3), assign tier per customer (B7), cross-check against the Stockist Framework margins |
| Order minimums and quantity multiples | NO | Configure in portal settings once accounts are live. VERIFY with Zoey exactly which minimum options the current plan supports (minimum order value vs per-line quantity multiples) |
| Stockist-specific catalogues (approved products only) | NO | Achievable: control which products publish to the portal, and where different stockists need genuinely different ranges, Cin7 supports separate portal setups per group. VERIFY with Zoey whether one portal with visibility rules or multiple portals fits the plan Kiko is on |
| Order history and one-click reorder | YES, once live | Native portal behaviour; works as soon as accounts are invited. No configuration beyond that |
| Recurring/resupply order scheduling | NOT CIN7 (VERIFY) | We do not believe the Core B2B portal schedules recurring orders natively. Reorder-from-history covers most of the need. Ask Zoey directly; if not native, the honest answer is "reorder in one click, no auto-scheduling" |
| In-portal invoice viewing | VERIFY | Portal shows order documents; confirm with Zoey that authorised invoices render for stockist logins on the current plan, then switch it on |
| Payment methods (card, ACH, BNPL via Cin7 Pay) | NOT CIN7 for ZA (VERIFY) | Cin7 Pay's card/ACH/BNPL stack is aimed at US/AU markets; South Africa availability is doubtful. Kiko's reality: account stockists pay EFT on terms against statements, small stockists cash on invoice. Ask Zoey whether any Cin7 Pay method supports ZAR; do not build the rollout around it. If online card payment for small stockists matters, that is a Paystack invoice-link workflow outside the portal |

**Bottom line for Section 1:** the portal succeeds or fails on B3 + B7 (tiers and terms) and
on stock accuracy (D + E). Branding and invites are the easy 10%.

---

## 2. Revenue & Channel Insights

| Item | Status | Answer |
|------|--------|--------|
| Multi-channel reporting: B2B, DTC, reseller Takealot, separate + consolidated | PARTLY | The data is all in Cin7; what is missing is standardised channel identification. The fix: (1) D2C = sales arriving via the Shopify integration, already self-identifying; (2) B2B = portal orders + manual stockist invoices, identified by customer tag "B2B-Account" or "B2B-Cash" (Playbook B7 adds tags); (3) Reseller/consignment = month-end sales invoiced from consignment locations, identified by customer tag "Consignment". Then Sale Overview and P&L by Product filter cleanly per channel, and saved report views give one-click separate views. The consolidated view with all three side by side is the Creative CFO monthly pack (native Cin7 shows one filter at a time) |
| Channel-level profitability (margin, not just revenue) | NO, blocked | Mechanically identical to the row above (P&L by Product filtered by channel tag), but the margin numbers are wrong until the costing repair lands: three production runs were adjusted in without consuming components, so COGS is understated and GP overstated today. Playbook F fixes it; do not show anyone margin-by-channel before F4 verification |
| Sales-channel integrations connected so revenue is unified | PARTLY | Shopify: connected (settings review in Playbook G1). Takealot: there is no Takealot-Cin7 integration; Takealot revenue enters via the month-end consignment invoicing process, which is correct and deliberate. 3PL: none in use today (see Section 5). "Unified" is achieved by process + tags, not by more connectors |

---

## 3. Finance & Reporting

| Item | Status | Answer |
|------|--------|--------|
| Xero sync active and reconciling automatically | PARTLY | The sync is active but the log carries Failed/Warning entries, and "reconciling automatically" overstates what any Cin7-Xero sync does: it pushes documents; reconciliation is a control someone runs. Fix the log to zero (Playbook D5), then Creative CFO's monthly 13-check master recon IS the automatic reconciliation discipline, with a dashboard and health score |
| Landed cost, margin, cash flow visibility accurate | PARTLY | Landed cost: in place by design (transport lines on POs roll into FIFO cost, per SOP v2.1). Margin: blocked until costing repair (Playbook F). Cash flow: not a Cin7 capability beyond open POs/SOs; Kiko's cash flow lives in the Creative CFO model (Kiko_Cash_Flow_V1) fed by Xero. Correct owners, no change needed |
| Custom dashboards/reports for leadership metrics | NOT CIN7 | Cin7's native dashboard is basic. The leadership layer is the Creative CFO monthly pack + the master recon dashboard (health score, exceptions, trends). If Kiko wants self-serve dashboards, that is a BI build on Cin7/Xero exports, scoped separately. Do not buy a Cin7 add-on for this before seeing the monthly pack |
| Automated report scheduling (emailed on cadence) | VERIFY | Cin7 Core can schedule report emails via its Automation module, which is plan-dependent. Ask Zoey whether Kiko's subscription includes Automation; if yes, schedule the 4 or 5 operational reports (pending POs, low stock, unfulfilled orders) to the right owners. Leadership reporting stays with the monthly pack regardless |
| Sales KPI dashboards (team performance, growth trends) | NOT CIN7 | Native sale dashboards show activity, not KPIs vs target. Targets, trends and team performance belong in the monthly pack. The one native piece worth using: sales rep assigned per account (Section 6) makes rep-level sales filterable in every report |

---

## 4. CAC & MER

The checklist already states the truth: Cin7 has no ad-spend or attribution data. Confirmed.

| Item | Status | Answer |
|------|--------|--------|
| Cin7 revenue/margin exported to where ad spend lives | NO | The blend needs three feeds: revenue (Shopify/Cin7), margin (Cin7, post costing-repair), ad spend (Meta, Google, TikTok, per the marketing accounts 3610/300 split). Creative CFO builds the blended sheet monthly; automation into a BI feed is Phase 4 optional |
| FM explicitly owning the CAC/MER blend | NO | Name the owner: this is Creative CFO's monthly reporting job, using the marketing expense split Kerri asked for (online vs B2B marketing, accounts 3610/xxx). Agree it in one line at the next management meeting |
| Regular cadence for reviewing blended CAC/MER | NO | Monthly, in the management pack, alongside revenue and margin by channel. Starts the first month after costing repair (F4), because MER on wrong margins misleads |

---

## 5. Logistics & Inventory

| Item | Status | Answer |
|------|--------|--------|
| Real-time multichannel stock sync across stores and warehouses | PARTLY, deliberate | Cin7-to-Shopify stock push is OFF on purpose, because pushing today's unverified quantities to the storefront would oversell. The stock take (Playbook E1) unlocks it; switching it on is Playbook G2, with the house rule that nobody ever adjusts stock in Shopify afterwards |
| Multi-warehouse/multi-location with bin and batch tracking | PARTLY | Locations exist but need surgery: trailing spaces break exact-name matching, Dischem location must wind down, stale locations retired (Playbook C1 to C6). Batch tracking: only 48% of assembly lines carried batch numbers at audit; mandatory going forward (house rule), backfilled at the stock take (B5 + E1). Bins: not needed at Kiko's scale; skip |
| AI demand forecasting on, reorder points per SKU | NO / VERIFY | Two different things. Reorder points: native, free, do it now — set minimum-before-reorder and reorder quantity per SKU (product record), then the low-stock report drives purchasing. Forecasting: Cin7's forecasting (ForesightAI) is a plan-dependent add-on; ask Zoey what Kiko's plan includes and what it costs. Honest sequencing: forecasting trained on today's corrupted movement history would learn garbage. Reorder points now, revisit forecasting two clean quarters after the overhaul |
| 3PL Connect configured if fulfilment outsourced | N/A today | Fulfilment is in-house (Main Warehouse). A 3PL move is under separate evaluation (the 3PL deck from July). If that decision lands, 3PL scoping becomes its own project: location per 3PL, transfer flows, and possibly 3PL Connect. Do not configure anything now |
| Shipping integrations so order → pick/pack/ship is manual-step-free | PARTLY, different shape | Kiko's shipping stack is Bobgo (Shopify D2C), Courier Guy (B2B/stockists), DHL (international). Bobgo hangs off Shopify, not Cin7, and that works. The Cin7-side requirement is only that pick/pack/ship steps are completed in Cin7 so stock and COGS post correctly. ShipStation is a US-centric answer; do not add it. If label-printing from Cin7 ever matters, evaluate a ZA-courier connector then |

---

## 6. Customer / Account Management (CRM-lite)

This section doubles as the fix for Zoey's "inconsistent sales rep tagging, duplicate
customer profiles, difficulty separating B2B stockists from Shopify customers".

| Item | Status | Answer |
|------|--------|--------|
| Full customer profile fields in use | PARTLY | Account stockists are set up; completeness varies. One pass over every stockist record while doing terms (Playbook B7) completes this |
| Customer hierarchy (parent → child locations) | NO, selective | Worth doing only where a stockist genuinely has branches billed separately (TFG, Dischem if store-level ever needed). Do not build hierarchy for single-location stockists; it adds admin for nothing |
| Multiple addresses with correct defaults | PARTLY | Set billing vs shipping per account during the B7 pass |
| Contacts current, default contact set | PARTLY | The accounting contacts are already documented (statements go to named creditors clerks: Dischem's Roshilla, TFG's Mandy/Lucritia, etc.). Load them onto the customer records so statements and invoices leave Cin7/Xero to the right inbox without a lookup |
| Tags/custom attributes to segment stockists | NO, high value | THE fix for channel reporting and for separating B2B from Shopify customers. Tag set: B2B-Account, B2B-Cash, Consignment, Agent, Export. Shopify-created customers stay untagged (that is their identifier). Fifteen minutes of tagging unlocks every channel filter in Section 2 |
| Signed T&Cs attached to account record | NO | Attach the signed trading-term agreements to each customer record (attachments tab). The "no dispatch without signed T&Cs" rule then becomes checkable at order time. Missing signed agreements surface here; chase them as found |
| Payment terms | PARTLY | Load per the stockist framework: Dischem 90 days month-end, Wellness Warehouse 60, Mkem 60, Superbalist/FTN/TFG 30, small stockists cash on invoice (Playbook B7). This also makes aged AR honest |
| Credit limit behaviour (warn vs hard stop) | NO | Native: set credit limit per account and choose enforcement. Recommendation: warn, not hard stop, for the big retailers (their POs cannot bounce); hard stop for small stockists with history of slow payment. Set Bonpak-style limits on the customer side only where real risk exists |
| Standing discounts / negotiated pricing per stockist | PARTLY | Two native mechanisms: price tier per customer (preferred, already the plan) and customer discount %. The rebate/allowance structures (settlement discount, distribution allowance etc.) deliberately live in Xero accounts 1011/xxx and 2011/xxx, NOT as Cin7 line discounts; keep it that way so trade terms stay auditable |
| Sales rep assigned to each account | NO | Native field on the customer record. Assign once, then every sale inherits the rep and rep-level reporting works. Fixes Zoey's "inconsistent sales rep tagging" at the root: the rep comes from the record, not from memory at order entry |

**On duplicate customer profiles (Zoey's challenge):** Cin7 cannot merge customers cleanly.
The fix: pick the surviving record, move open documents to it, deprecate the duplicate, and
tag it "DO NOT USE". Shopify-created duplicates of B2B stockists are the usual cause;
stockists must always be invoiced on their B2B record, never their Shopify guest record.

**On CRM/lead management (Zoey's challenge):** honest answer: Cin7 is not a CRM and
pretending otherwise creates a mess. Leads from Google Sheets or cold calling stay outside
Cin7 until they become a trading stockist; only then does a customer record get created,
tagged, and invited to the portal. If Kiko wants real pipeline management, that is a CRM
conversation, not a Cin7 configuration.

---

## Answers to Zoey's remaining challenges

| Zoey's challenge | Our answer |
|------------------|-----------|
| Inventory accuracy: bottles/caps at Neutralab show zero despite existing physically | Two causes, both understood. (1) The one-warehouse model is deliberate: stock physically at Nutralab is booked at Main Warehouse, so looking up the Nutra Lab location shows zero by design. (2) Genuine record damage: three production runs were adjusted in without consuming components, so component quantities are wrong. Cause 1 needs no fix (or the planned migration when Kerri/Luke want per-site visibility: one count + one opening transfer, already documented in SOP v2.1). Cause 2 is the overhaul's costing repair (Playbook E1 + F) |
| Location configuration unclear; suppliers/stockists may be miscoded as locations | Partly true and already mapped: supplier locations (Bottle Printers, Joypak) exist but deliberately hold nothing; Dischem is miscoded (buying stockist as location) and winds down; consignment stockists as locations is CORRECT for consignment. Trailing-space renames and stale-location retirement are Playbook C. We do not need Cin7 to redesign the location structure; we need two hours of cleanup |
| Assembly movements at Neutralab not recorded correctly | Agreed; this is house rule number one (every production run is an Assembly, never an adjustment) plus the live assembly training video (Playbook H2). Auto-assembly stays OFF deliberately because Nutralab manufactures and runs must be confirmed against lab production data |
| Process/data entry inconsistency driving inaccuracies | Agreed, and it is the root cause of nearly everything above. The fix is already built: SOP v2.1, the training programme (sessions running through August), the knowledge base site (live to the team 24 Aug), the six house rules, and the monthly master recon that catches drift within 30 days |
| Revenue + profit by channel (D2C, B2B, Reseller) | Section 2 above: customer tags + standardised channel identification give the separate views natively; the consolidated view with targets is the Creative CFO monthly pack; profit by channel waits for the costing repair |

---

## What to actually ask Zoey (the vendor's real to-do list)

1. Which B2B portal minimum-order options, catalogue-visibility options, and invoice-viewing
   options are included in Kiko's current plan?
2. Does any Cin7 Pay method support South Africa / ZAR? (Expected answer: no. Get it in
   writing so nobody plans around it)
3. Does the Core B2B portal support recurring/scheduled orders natively?
4. Is the Automation module (scheduled report emails) on Kiko's plan, and what does
   ForesightAI forecasting cost if added later?
5. Back-end assistance during the overhaul: bulk handling of the sync log, and support
   cover on the stock take day.

Everything else on the capability checklist is configuration and discipline, not vendor
work, and is sequenced in CIN7-ACCOUNT-OVERHAUL.md with the how-to in
CIN7-OVERHAUL-PLAYBOOK.md.

---

**CREATIVE CFO · SYSTEMS · PREPARED FOR KIKO VITALS · VERSION 1.0 · AUGUST 2026**
