# Shopify recon variant - roadmap

A Shopify <-> Cin7 <-> Xero recon is planned on the SAME chassis this skill already provides:
content-sniffed report registry, gated inputs folder, check engine emitting the standard run
JSON, per-customer history, and the slider dashboard. When someone asks for a Shopify recon,
build it as an extension here - do not start a new architecture.

## What it adds (design sketch)

**New inputs (registry entries in `common.py`):**
- Shopify **Orders export** (or Transactions export) per store - customers commonly run 2-3
  stores (e.g. main B2C, B2B trade portal, second-hand/returns store) sharing or splitting
  inventory pools.
- Shopify **Payouts export** (Settings -> Payments -> Payouts) - gross, fees, refunds, net per
  payout.
- Xero **bank/clearing account transactions** for the Shopify clearing/control account.

**New checks (same check() shape, so the dashboard needs zero changes):**
1. **Orders -> Cin7 sales** - every Shopify order number lands in Cin7 as a sale (by order
   reference), amounts ex-tax match; flags orders missing in Cin7 and Cin7 Shopify-channel
   sales with no Shopify order. System: Shopify -> Cin7 sync.
2. **Payouts -> Xero bank** - each payout (net) hits the bank/clearing account on date and
   amount; unswept clearing balance flagged. System: Shopify -> Xero.
3. **Fees completeness** - payout fees vs the fees expense account movement. System: Xero.
4. **Refunds path** - Shopify refunds vs Cin7 credit notes (feeds the existing CN checks) -
   for returns-heavy customers (e.g. 100-night trials) reuse the MAT-style returns metric:
   units credited, restock destination, second-hand store flow.
5. **Multi-store split** - per-store revenue recon so stores sharing one Cin7 org still
   reconcile individually.

**Cadence:** identical (weekly/monthly/custom); payout timing straddles period ends, so the
check must carry an in-transit bridge like the TB check's expected classification.

**Config additions:** store list with channel names as they appear in Cin7 (sales rep /
channel column), clearing account code(s), fee account code(s).

Until built: if asked, run the standard Cin7 <-> Xero recon and note the Shopify legs as a
manual addendum in the findings register.
