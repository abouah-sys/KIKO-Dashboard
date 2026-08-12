#!/usr/bin/env python3
"""PO482 (Unifoam, Cape Town) — attachment PDFs + Cin7 import CSVs, one per delivery note."""
import csv
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

DNS = [
    {
        "doc": "I348784", "label": "DN 20.07", "dn_date": "17/07/2026", "received": "20/07/2026",
        "received_by": "Unathi", "rec_yyyymmdd": "20260720", "rec_h": "20 Jul 2026", "month": "JUL26",
        "extra": "Handwritten on the DN: \"1 x KXL box damaged\". If that unit was rejected/returned rather than "
                 "accepted, reduce MA-OM-KXL to 19 before completing.",
        "lines": [
            ("SLOOM/S250XL", "2000*910*250 Sloom Laminated Mattress", "MA-OM-SXL", "Sloom Original Mattress Single Extra Length", 10, 3970.21),
            ("SLOOM/Q250", "1880*1520*250 Sloom Laminated Mattress", "MA-OM-Q", "Sloom Original Mattress Queen", 25, 5235.73),
            ("SLOOM/K250", "1880*1830*250 Sloom Laminated Mattress", "MA-OM-K", "Sloom Original Mattress King", 10, 6078.62),
            ("SLOOM/K250XL", "2000*1830*250 Sloom Laminated Mattress", "MA-OM-KXL", "Sloom Original Mattress King Extra Length", 20, 6686.49),
        ],
    },
    {
        "doc": "I349056", "label": "DN 24.07", "dn_date": "22/07/2026", "received": "24/07/2026",
        "received_by": "Unathi", "rec_yyyymmdd": "20260724", "rec_h": "24 Jul 2026", "month": "JUL26",
        "extra": "Pillow conversion: Unifoam ships 6-pack boxes (6 pillows) of King double packs. "
                 "15 boxes = 90 pillows = 45 x AC-PL-K2.",
        "lines": [
            ("SLOOM/S250", "1880*910*250 Sloom Laminated Mattress", "MA-OM-S", "Sloom Original Mattress Single", 7, 3138.51),
            ("SLOOM/T250", "1880*1070*250 Sloom Laminated Mattress", "MA-OM-TQ", "Sloom Original Mattress Three Quarter", 10, 3533.93),
            ("SLOOM/T250XL", "2000*1070*250 Sloom Laminated Mattress", "MA-OM-TQXL", "Sloom Original Mattress Three Quarter Extra Length", 5, 4470.42),
            ("SLOOM/D250", "1880*1370*250 Sloom Laminated Mattress", "MA-OM-D", "Sloom Original Mattress Double", 6, 4829.80),
            ("SLOOM/Q250", "1880*1520*250 Sloom Laminated Mattress", "MA-OM-Q", "Sloom Original Mattress Queen", 15, 5235.73),
            ("SLOOM/Q250XL", "2000*1520*250 Sloom Laminated Mattress", "MA-OM-QXL", "Sloom Original Mattress Queen Extra Length", 10, 5721.35),
            ("SLOOM/K250", "1880*1830*250 Sloom Laminated Mattress", "MA-OM-K", "Sloom Original Mattress King", 5, 6078.62),
            ("SLOOM/K250XL", "2000*1830*250 Sloom Laminated Mattress", "MA-OM-KXL", "Sloom Original Mattress King Extra Length", 5, 6686.49),
            ("SLOOM/K250SP", "2000*2140*250 Sloom CPT King Laminated Mattress", "MA-OM-CTK", "Sloom Original Mattress Cape Town King", 3, 8940.84),
            ("PILL/6PKDBSLMKING", "Pillows Memory Foam Chip (2.8kg) King Sloom 6PK DBL x 15 boxes = 90 pillows", "AC-PL-K2", "Sloom Adjustable Memory Foam Pillow King Double Pack", 45, 1035.00),
        ],
    },
    {
        "doc": "I349293", "label": "DN 29.07", "dn_date": "27/07/2026", "received": "29/07/2026",
        "received_by": "Unathi", "rec_yyyymmdd": "20260729", "rec_h": "29 Jul 2026", "month": "JUL26",
        "extra": "Handwritten on the DN: \"1 box damaged 1880*1370*250\" (Double). If that unit was rejected/returned "
                 "rather than accepted, reduce MA-OM-D to 1 before completing.",
        "lines": [
            ("SLOOM/S250", "1880*910*250 Sloom Laminated Mattress", "MA-OM-S", "Sloom Original Mattress Single", 8, 3138.51),
            ("SLOOM/D250", "1880*1370*250 Sloom Laminated Mattress", "MA-OM-D", "Sloom Original Mattress Double", 2, 4829.80),
            ("SLOOM/K250SP", "2000*2140*250 Sloom CPT King Laminated Mattress", "MA-OM-CTK", "Sloom Original Mattress Cape Town King", 2, 8940.84),
        ],
    },
    {
        "doc": "I349485", "label": "DN 31.07", "dn_date": "29/07/2026", "received": "31/07/2026",
        "received_by": "Unathi", "rec_yyyymmdd": "20260731", "rec_h": "31 Jul 2026", "month": "JUL26",
        "extra": None,
        "lines": [
            ("SLOOM/D250", "1880*1370*250 Sloom Laminated Mattress", "MA-OM-D", "Sloom Original Mattress Double", 2, 4829.80),
        ],
    },
    {
        "doc": "I349828", "label": "DN 07.08", "dn_date": "04/08/2026", "received": "07/08/2026",
        "received_by": "Nathan", "rec_yyyymmdd": "20260807", "rec_h": "7 Aug 2026", "month": "AUG26",
        "extra": None,
        "lines": [
            ("SLOOM/K250XL", "2000*1830*250 Sloom Laminated Mattress", "MA-OM-KXL", "Sloom Original Mattress King Extra Length", 5, 6686.49),
            ("SLOOM/K250SP", "2000*2140*250 Sloom CPT King Laminated Mattress", "MA-OM-CTK", "Sloom Original Mattress Cape Town King", 3, 8940.84),
        ],
    },
]

CSV_HEADER = ['Zero/NonZero', 'Location', 'SKU', 'Name', 'Bin', 'BatchSerialNumber',
              'ExpiryDate_YYYYMMDD', 'Quantity', 'UnitCost', 'Comments', 'ReceivedDate_YYYYMMDD']


def ref_string(d):
    return (f"SHOPIFY-RECEIPTS-{d['month']}-CPT | PO482 DN {d['doc']} (Unifoam) | "
            f"Goods received in Shopify {d['rec_h']}, not processed in Cin7")


def build_csv(d):
    fn = f"sloom_stock_adjustment_PO482_DN_{d['doc']}.csv"
    with open(fn, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(CSV_HEADER)
        for code, desc, sku, sku_name, qty, cost in d["lines"]:
            w.writerow(['Zero', 'Cape Town Warehouse', sku, sku_name, '', '', '',
                        qty, f"{cost:.2f}", ref_string(d), d['rec_yyyymmdd']])
    return fn


def build_pdf(d):
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1x", parent=styles["Title"], fontSize=15, spaceAfter=2)
    h2 = ParagraphStyle("h2x", parent=styles["Heading2"], fontSize=11, spaceAfter=2)
    small = ParagraphStyle("smallx", parent=styles["Normal"], fontSize=8.5, textColor=colors.HexColor("#444444"))
    body = ParagraphStyle("bodyx", parent=styles["Normal"], fontSize=9)
    mono = ParagraphStyle("monox", parent=styles["Normal"], fontSize=8.5, fontName="Courier")
    metasty = ParagraphStyle("metax", parent=styles["Normal"], fontSize=8.5)

    fn = f"sloom_PO482_DN_{d['doc']}_attachment.pdf"
    doc = SimpleDocTemplate(fn, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
    story = [
        Paragraph(f"Unifoam Delivery Note {d['doc']} ({d['label']}) — Sloom (Pty) Ltd", h1),
        Paragraph("Cin7 Core stock adjustment supporting document — Shopify PO482 (#PO0482 - CPT / Unifoam SO229111)", small),
        Spacer(1, 6*mm),
    ]
    meta = [
        ["Delivery note no.", d["doc"], "Internal label", d["label"]],
        ["Delivery note date", d["dn_date"], "Received (signed)", f"{d['received']} by {d['received_by']}"],
        ["Supplier", "Unifoam (Pty) Ltd", "Purchase order", Paragraph("#PO0482 - CPT (Shopify) / SO229111 (Unifoam)", metasty)],
        ["Deliver to", Paragraph("Sloom, 9A Kariga Street, Stikland Industrial, Cape Town", metasty), "Cin7 location", "Cape Town Warehouse"],
        ["Adjustment date", Paragraph(f"<b>{d['received']}</b> (effective date = received date)", metasty), "Adjustment type", "Upward stock adjustment"],
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
    story += [t, Spacer(1, 5*mm),
              Paragraph("Cin7 Reference / Comment", h2), Paragraph(ref_string(d), mono), Spacer(1, 5*mm),
              Paragraph("Goods received per delivery note", h2)]

    rows = [["Unifoam code", "Description", "Cin7 SKU", "Qty", "Unit cost\n(ex VAT)", "Line total\n(ex VAT)"]]
    tq, tv = 0, 0.0
    for code, desc, sku, sku_name, qty, cost in d["lines"]:
        rows.append([code, Paragraph(f"{desc}<br/><font size=7.5 color='#666666'>{sku_name}</font>", body),
                     sku, str(qty), f"{cost:,.2f}", f"{qty*cost:,.2f}"])
        tq += qty; tv += qty * cost
    rows.append(["", "Total", "", str(tq), "", f"{tv:,.2f}"])
    lt = Table(rows, colWidths=[30*mm, 64*mm, 25*mm, 12*mm, 22*mm, 25*mm], repeatRows=1)
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
    story += [lt, Spacer(1, 4*mm)]
    if d["extra"]:
        story += [Paragraph(f"<b>Note:</b> {d['extra']}", body), Spacer(1, 3*mm)]
    story.append(Paragraph(
        "Unit costs are ex-VAT supplier costs per Shopify PO482. Stock received on Shopify but not processed in Cin7 "
        "(Cin7 take-on cutoff 19 Jul 2026 - deliveries received after the cutoff are captured as upward stock "
        "adjustments). Source: signed Unifoam delivery note (copy on the PO482 Shopify timeline).", small))
    doc.build(story)
    return fn


if __name__ == "__main__":
    for d in DNS:
        print(build_csv(d))
        print(build_pdf(d))
        print("  REF:", ref_string(d))
