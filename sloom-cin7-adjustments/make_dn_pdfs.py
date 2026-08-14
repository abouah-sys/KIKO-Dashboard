#!/usr/bin/env python3
"""Generate one attachment PDF per Unifoam PO491 delivery note for Cin7 stock adjustments."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

DNS = [
    {
        "doc": "I348706", "label": "DN 21.07", "dn_date": "17/07/2026", "received": "21/07/2026",
        "received_by": "Sandra", "month": "JUL26", "shopify_rec": "21 Jul 2026",
        "lines": [
            ("SLOOM/Q250", "1880*1520*250 Sloom Laminated Mattress", "MA-OM-Q", "Sloom Original Mattress Queen", 10, 5235.73),
            ("SLOOM/K250", "1880*1830*250 Sloom Laminated Mattress", "MA-OM-K", "Sloom Original Mattress King", 5, 6078.62),
        ],
        "note": None,
    },
    {
        "doc": "I349198", "label": "DN 28.07", "dn_date": "24/07/2026", "received": "28/07/2026",
        "received_by": "Sandra", "month": "JUL26", "shopify_rec": "28 Jul 2026",
        "lines": [
            ("PILL/6PACKSLOOM", "Pillows Memory Foam Chip (1.3kg) Sloom 6 pack x 5 boxes = 30 pillows", "AC-PL-SD", "Sloom Adjustable Memory Foam Pillow Standard Single Pack", 30, 339.25),
            ("TOPSLOOM/S50", "1880*910*50 Sloom Topper VE55 Zip Cover", "AC-MT-S", "Sloom Mattress Topper Single", 3, 1267.15),
            ("TOPSLOOM/T50", "1880*1070*50 Sloom Topper VE55 Zip Cover", "AC-MT-TQ", "Sloom Mattress Topper Three Quarter", 4, 1204.74),
            ("TOPSLOOM/D50", "1880*1370*50 Sloom Topper VE55 Zip Cover", "AC-MT-D", "Sloom Mattress Topper Double", 4, 1628.46),
            ("TOPSLOOM/Q50", "1880*1520*50 Sloom Topper VE55 Zip Cover", "AC-MT-Q", "Sloom Mattress Topper Queen", 9, 1750.85),
            ("TOPSLOOM/Q50XL", "2000*1520*50 Sloom Topper VE55 Zip Cover", "AC-MT-QXL", "Sloom Mattress Topper Queen Extra Length", 8, 1908.43),
            ("TOPSLOOM/K50", "1880*1830*50 Sloom Topper VE55 Zip Cover", "AC-MT-K", "Sloom Mattress Topper King", 6, 2009.12),
            ("TOPSLOOM/K50XL", "2000*1830*50 Sloom Topper VE55 Zip Cover", "AC-MT-KXL", "Sloom Mattress Topper King Extra Length", 4, 2189.93),
        ],
        "note": "Pillow conversion: Unifoam ships 6-pack boxes (6 pillows). 5 boxes = 30 pillows = 30 x single pack (AC-PL-SD).",
    },
    {
        "doc": "I349504", "label": "DN 30.07", "dn_date": "29/07/2026", "received": "30/07/2026",
        "received_by": "Sandra", "month": "JUL26", "shopify_rec": "30 Jul 2026",
        "lines": [
            ("SLOOM/Q250", "1880*1520*250 Sloom Laminated Mattress", "MA-OM-Q", "Sloom Original Mattress Queen", 60, 5235.73),
        ],
        "note": None,
    },
    {
        "doc": "I349699", "label": "DN 04.08", "dn_date": "31/07/2026", "received": "04/08/2026",
        "received_by": "Sandra", "month": "AUG26", "shopify_rec": "4 Aug 2026",
        "lines": [
            ("SLOOM/S250XL", "2000*810*250 Sloom Laminated Mattress", "MA-OM-SXL", "Sloom Original Mattress Single Extra Length", 3, 3970.21),
            ("SLOOM/K250", "1880*1830*250 Sloom Laminated Mattress", "MA-OM-K", "Sloom Original Mattress King", 45, 6078.62),
            ("SLOOM/K250XL", "2000*1830*250 Sloom Laminated Mattress", "MA-OM-KXL", "Sloom Original Mattress King Extra Length", 20, 6686.49),
            ("PILL/6PKDBSLOOM", "Pillows Memory Foam Chip (1.3kg) Sloom 6PK DBL x 20 boxes = 120 pillows", "AC-PL-SD2", "Sloom Adjustable Memory Foam Pillow Standard Double Pack", 60, 667.00),
            ("PILL/6PKDBSLMKING", "Pillows Memory Foam Chip (2.8kg) King Sloom 6PK DBL x 10 boxes = 60 pillows", "AC-PL-K2", "Sloom Adjustable Memory Foam Pillow King Double Pack", 30, 1035.00),
        ],
        "note": "Pillow conversion: Unifoam ships 6-pack boxes (6 pillows) of double packs. 1 box = 3 double packs. 20 boxes = 60 x AC-PL-SD2; 10 boxes = 30 x AC-PL-K2.",
    },
    {
        "doc": "I349982", "label": "DN 07.08", "dn_date": "05/08/2026", "received": "07/08/2026",
        "received_by": "Tshepo", "month": "AUG26", "shopify_rec": "7 Aug 2026",
        "lines": [
            ("SLOOM/S250", "1880*910*250 Sloom Laminated Mattress", "MA-OM-S", "Sloom Original Mattress Single", 12, 3138.51),
            ("SLOOM/T250", "1880*1070*250 Sloom Laminated Mattress", "MA-OM-TQ", "Sloom Original Mattress Three Quarter", 10, 3533.93),
            ("SLOOM/T250XL", "2000*1070*250 Sloom Laminated Mattress", "MA-OM-TQXL", "Sloom Original Mattress Three Quarter Extra Length", 3, 4470.42),
            ("SLOOM/Q250XL", "2000*1520*250 Sloom Laminated Mattress", "MA-OM-QXL", "Sloom Original Mattress Queen Extra Length", 20, 5721.35),
        ],
        "note": None,
    },
    {
        "doc": "I350165", "label": "DN 13.08", "dn_date": "07/08/2026", "received": "13/08/2026",
        "received_by": "Sandra", "month": "AUG26", "shopify_rec": "13 Aug 2026",
        "lines": [
            ("SLOOM/K250XL", "2000*1830*250 Sloom Laminated Mattress", "MA-OM-KXL", "Sloom Original Mattress King Extra Length", 19, 6686.49),
            ("SLOOM/K250SP", "2000*2140*250 Sloom CPT King Laminated Mattress", "MA-OM-CTK", "Sloom Original Mattress Cape Town King", 4, 8940.84),
        ],
        "note": "After this delivery the remaining open balance on PO491 is 11 x MA-OM-KXL and 3 x MA-OM-CTK.",
    },
]


def ref_string(dn):
    return (f"SHOPIFY-RECEIPTS-{dn['month']}-JHB | PO491 DN {dn['doc']} (Unifoam) | "
            f"Goods received in Shopify {dn['shopify_rec']}, not processed in Cin7")


def money(x):
    return f"R {x:,.2f}"


def build(dn):
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1x", parent=styles["Title"], fontSize=15, spaceAfter=2)
    small = ParagraphStyle("smallx", parent=styles["Normal"], fontSize=8.5, textColor=colors.HexColor("#444444"))
    body = ParagraphStyle("bodyx", parent=styles["Normal"], fontSize=9)
    mono = ParagraphStyle("monox", parent=styles["Normal"], fontSize=8.5, fontName="Courier")

    fn = f"sloom_PO491_DN_{dn['doc']}_attachment.pdf"
    doc = SimpleDocTemplate(fn, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
    story = []
    story.append(Paragraph(f"Unifoam Delivery Note {dn['doc']} — Sloom (Pty) Ltd", h1))
    story.append(Paragraph("Cin7 Core stock adjustment supporting document — Shopify PO491 (#PO491 - JHB / Unifoam SO229526)", small))
    story.append(Spacer(1, 6*mm))

    metasty = ParagraphStyle("metax", parent=styles["Normal"], fontSize=8.5)
    meta = [
        ["Delivery note no.", dn["doc"], "Internal label", dn["label"]],
        ["Delivery note date", dn["dn_date"], "Received (signed)", f"{dn['received']} by {dn['received_by']}"],
        ["Supplier", "Unifoam (Pty) Ltd", "Purchase order", Paragraph("#PO491 - JHB (Shopify) / SO229526 (Unifoam)", metasty)],
        ["Deliver to", Paragraph("Building 5 Unit 15 Riversand Outlet Park, Century Blvd, Knopjeslaagte, Johannesburg", metasty), "Cin7 location", "Johannesburg Warehouse"],
        ["Adjustment date", Paragraph(f"<b>{dn['received']}</b> (effective date = received date)", metasty), "Adjustment type", "Upward stock adjustment"],
    ]
    t = Table(meta, colWidths=[32*mm, 62*mm, 32*mm, 54*mm])
    t.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f2f2f2")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#f2f2f2")),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(t)
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph("Cin7 Reference / Comment", ParagraphStyle("h2x", parent=styles["Heading2"], fontSize=11, spaceAfter=2)))
    story.append(Paragraph(ref_string(dn), mono))
    story.append(Spacer(1, 5*mm))

    story.append(Paragraph("Goods received per delivery note", ParagraphStyle("h2y", parent=styles["Heading2"], fontSize=11, spaceAfter=2)))
    rows = [["Unifoam code", "Description", "Cin7 SKU", "Qty", "Unit cost\n(ex VAT)", "Line total\n(ex VAT)"]]
    total_qty, total_val = 0, 0.0
    for code, desc, sku, sku_name, qty, cost in dn["lines"]:
        rows.append([code, Paragraph(f"{desc}<br/><font size=7.5 color='#666666'>{sku_name}</font>", body),
                     sku, str(qty), f"{cost:,.2f}", f"{qty*cost:,.2f}"])
        total_qty += qty
        total_val += qty * cost
    rows.append(["", "Total", "", str(total_qty), "", f"{total_val:,.2f}"])
    lt = Table(rows, colWidths=[30*mm, 66*mm, 25*mm, 12*mm, 22*mm, 25*mm], repeatRows=1)
    lt.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8e8e8")),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
        ("ALIGN", (3, 1), (-1, -1), "RIGHT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEABOVE", (0, -1), (-1, -1), 0.8, colors.black),
    ]))
    story.append(lt)
    story.append(Spacer(1, 4*mm))
    if dn["note"]:
        story.append(Paragraph(f"<b>Note:</b> {dn['note']}", body))
        story.append(Spacer(1, 3*mm))
    story.append(Paragraph(
        "Unit costs are ex-VAT supplier costs per Shopify PO491. Stock physically received at the JHB warehouse on the "
        "delivery note date above; received on Shopify but not processed in Cin7, hence captured as an upward stock "
        "adjustment. Source: Unifoam delivery note (signed copy on the PO491 Shopify timeline).", small))
    doc.build(story)
    return fn


if __name__ == "__main__":
    for dn in DNS:
        print(build(dn))
        print("  REF:", ref_string(dn))
