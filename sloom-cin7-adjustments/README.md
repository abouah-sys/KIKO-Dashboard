# Sloom — Cin7 Core stock adjustment imports (Unifoam PO491 take-on)

Context: Sloom's Cin7 Core implementation had partially received stock on open POs
(Unifoam #PO491 - JHB / SO229526). To bring the received stock into Cin7, each
Unifoam delivery note is loaded as its own upward stock adjustment.

One CSV = one delivery note = one stock adjustment in Cin7.

## Files

| File | Delivery note | DN date | Received | Lines |
|---|---|---|---|---|
| `sloom_stock_adjustment_DN_I349982.csv` | I349982 | 05/08/2026 | 07/08/2026 (Tshepo) | 4 |
| `sloom_stock_adjustment_DN_I349699.csv` | I349699 | 31/07/2026 | 04/08/2026 (Sandra) | 5 |

## SKU + cost mapping (Unifoam code → Sloom SKU, unit cost ex VAT per PO491)

| Unifoam code | Sloom SKU | Unit cost (ex VAT) |
|---|---|---|
| SLOOM/S250 | MA-OM-S | 3,138.51 |
| SLOOM/S250XL | MA-OM-SXL | 3,970.21 |
| SLOOM/T250 | MA-OM-TQ | 3,533.93 |
| SLOOM/T250XL | MA-OM-TQXL | 4,470.42 |
| SLOOM/Q250XL | MA-OM-QXL | 5,721.35 |
| SLOOM/K250 | MA-OM-K | 6,078.62 |
| SLOOM/K250XL | MA-OM-KXL | 6,686.49 |
| PILL/6PKDBSLOOM (6-pack box) | AC-PL-SD2 (×3 double packs per box) | 667.00 |
| PILL/6PKDBSLMKING (6-pack box) | AC-PL-K2 (×3 double packs per box) | 1,035.00 |

Pillow conversion: Unifoam ships 6-pack boxes (6 pillows). Sloom sells double
packs (2 pillows), so 1 box = 3 double packs. DN I349699: 20 boxes = 60 × AC-PL-SD2,
10 boxes = 30 × AC-PL-K2 — which matches the PO491 ordered quantities exactly.

## How to import

1. Cin7 Core → Inventory → New Stock Adjustment.
2. Set Effective Date to the date the stock was received (07/08/2026 for I349982,
   04/08/2026 for I349699), set the adjustment Account and Reference (e.g. the DN number).
3. Import → download Cin7's own template if the column headers differ from these
   files, and paste the columns across — the values are template-ready
   (Zero/NonZero = "Zero" because these lines add new stock at a stated unit cost).
4. Verify before importing:
   - **Location**: files use "Johannesburg Warehouse" — must match the Cin7 location name exactly.
   - **SKUs**: MA-OM-* / AC-PL-* taken from PO491; confirm they match the Cin7 product SKUs.
5. Complete the adjustment.

## PO491 receipt reconciliation (all five DNs seen to date)

| SKU | Ordered | I348706 (17/07) | I349198 (24/07) | I349504 (29/07) | I349699 (31/07) | I349982 (05/08) | Received | Open |
|---|---|---|---|---|---|---|---|---|
| MA-OM-S | 12 | | | | | 12 | 12 | 0 |
| MA-OM-SXL | 3 | | | | 3 | | 3 | 0 |
| MA-OM-TQ | 10 | | | | | 10 | 10 | 0 |
| MA-OM-TQXL | 3 | | | | | 3 | 3 | 0 |
| MA-OM-Q | 70 | 10 | | 60 | | | 70 | 0 |
| MA-OM-QXL | 20 | | | | | 20 | 20 | 0 |
| MA-OM-K | 50 | 5 | | | 45 | | 50 | 0 |
| MA-OM-KXL | 50 | | | | 20 | | 20 | 30 |
| MA-OM-CTK | 7 | | | | | | 0 | 7 |
| AC-PL-SD | 30 | | 30 | | | | 30 | 0 |
| AC-PL-SD2 | 60 | | | | 60 | | 60 | 0 |
| AC-PL-K2 | 30 | | | | 30 | | 30 | 0 |
| Toppers (all 7 SKUs) | 38 | | 38 | | | | 38 | 0 |

Still outstanding on PO491 after these five DNs: 30 × MA-OM-KXL and 7 × MA-OM-CTK.
