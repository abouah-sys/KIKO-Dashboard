#!/usr/bin/env python3
"""PO484 (Sheraton Textiles) — attachment PDFs + Cin7 import CSVs, one per delivery."""
import csv
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

DELIVERIES = [
    {
        "key": "DN2407bal_INV0023902", "label": "DN 24.07 balance", "inv": "INV0023902", "inv_date": "23/07/2026",
        "waybill": "257481", "received": "24/07/2026", "rec_yyyymmdd": "20260724", "rec_h": "24 Jul 2026",
        "month": "JUL26", "packed": "Terrin, 17 cartons",
        "ref_tail": "6 x Cooling KXL received in Shopify 24 Jul 2026, not processed in Cin7 - balance of INV0023902 captured in ST-00047",
        "extra": "This adjustment covers ONLY the 6 x Cooling Pad KING XL line of INV0023902. The other two lines "
                 "(20 x Quilted King, 8 x Quilted Cape Town King) are already captured in adjustment ST-00047 "
                 "(SHOPIFY-RECEIPTS-JUL26-CPT | PO484 INV0023902 + T0654).",
        "lines": [
            ("6004202943923", "Sloom 1st Mattress Protector With Cooling Pad Pongee 70g Quilted KING XL White", "AC-BD-MC-KXL", "Cooling Mattress Protector King Extra Length", 6, 404.00),
        ],
    },
    {
        "key": "DN0408_INV0024107", "label": "DN 04.08", "inv": "INV0024107", "inv_date": "04/08/2026",
        "waybill": "259892", "received": "04/08/2026", "rec_yyyymmdd": "20260804", "rec_h": "4 Aug 2026",
        "month": "AUG26", "packed": "Danny, 2 cartons",
        "ref_tail": "Goods received in Shopify 4 Aug 2026, not processed in Cin7",
        "extra": None,
        "lines": [
            ("6004202943794", "Sloom 1st Mattress Protector With Grip Elastic Pongee 70g Quilted QUEEN White", "AC-BD-MP-Q", "Quilted Mattress Protector Queen", 6, 192.00),
        ],
    },
    {
        "key": "DN0408p2_INV0024088", "label": "DN 04.08 part 2", "inv": "INV0024088", "inv_date": "31/07/2026",
        "waybill": "259047", "received": "04/08/2026", "rec_yyyymmdd": "20260804", "rec_h": "4 Aug 2026",
        "month": "AUG26", "packed": "-",
        "ref_tail": "14 x Cooling KXL received in Shopify 4 Aug 2026, not processed in Cin7 - balance of INV0024088 captured as DN 03.08",
        "extra": "This adjustment covers ONLY the 14 x Cooling KXL line of INV0024088 (delivered later, 4 Aug). The other five lines of INV0024088 (20 x D, 31 x Q, 20 x QXL, 20 x KXL, 12 x CTK) were received 3 Aug and are captured in the existing DN 03.08 adjustment.",
        "lines": [
            ("6004202943923", "Sloom 1st Mattress Protector With Cooling Pad Pongee 70g Quilted KING XL White", "AC-BD-MC-KXL", "Cooling Mattress Protector King Extra Length", 14, 404.00),
        ],
    },
    {
        "key": "DN0608_INV0024114", "label": "DN 06.08", "inv": "INV0024114", "inv_date": "04/08/2026",
        "waybill": "260320", "received": "06/08/2026", "rec_yyyymmdd": "20260806", "rec_h": "6 Aug 2026",
        "month": "AUG26", "packed": "Terrin, 1 carton",
        "ref_tail": "Goods received in Shopify 6 Aug 2026, not processed in Cin7",
        "extra": "Assumed to be the DN 06.08 delivery on the PO484 timeline (invoice dated 4 Aug, waybill 260320) - confirm against the signed copy.",
        "lines": [
            ("6004202943794", "Sloom 1st Mattress Protector With Grip Elastic Pongee 70g Quilted QUEEN White", "AC-BD-MP-Q", "Quilted Mattress Protector Queen", 3, 192.00),
        ],
    },
]

CSV_HEADER = ['Zero/NonZero', 'Location', 'SKU', 'Name', 'Bin', 'BatchSerialNumber',
              'ExpiryDate_YYYYMMDD', 'Quantity', 'UnitCost', 'Comments', 'ReceivedDate_YYYYMMDD']


def ref_string(d):
    return f"SHOPIFY-RECEIPTS-{d['month']}-CPT | PO484 {d['label']} {d['inv']} (Sheraton) | {d['ref_tail']}"


def build_csv(d):
    fn = f"sloom_stock_adjustment_PO484_{d['key']}.csv"
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

    fn = f"sloom_PO484_{d['key']}_attachment.pdf"
    doc = SimpleDocTemplate(fn, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
    story = [
        Paragraph(f"Sheraton Tax Invoice {d['inv']} ({d['label']}) — Sloom (Pty) Ltd", h1),
        Paragraph("Cin7 Core stock adjustment supporting document — Shopify PO484 (Sheraton order CS0021793)", small),
        Spacer(1, 6*mm),
    ]
    meta = [
        ["Tax invoice no.", d["inv"], "Internal label", d["label"]],
        ["Invoice date", d["inv_date"], "Waybill", d["waybill"]],
        ["Received", d["received"], "Packed / cartons", d["packed"]],
        ["Supplier", Paragraph("Sheraton Textiles Holdings (Pty) Ltd, 134 Princess Vlei Road, Southfield", metasty),
         "Purchase order", Paragraph("#PO484 (Shopify) / CS0021793 (Sheraton)", metasty)],
        ["Deliver to", Paragraph("Sloom, 9A Kariga Street, Stikland, Cape Town", metasty), "Cin7 location", "Cape Town Warehouse"],
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
              Paragraph("Goods received per tax invoice", h2)]

    rows = [["Item code", "Description", "Cin7 SKU", "Qty", "Unit cost\n(ex VAT)", "Line total\n(ex VAT)"]]
    tq, tv = 0, 0.0
    for code, desc, sku, sku_name, qty, cost in d["lines"]:
        rows.append([code, Paragraph(f"{desc}<br/><font size=7.5 color='#666666'>{sku_name}</font>", body),
                     sku, str(qty), f"{cost:,.2f}", f"{qty*cost:,.2f}"])
        tq += qty; tv += qty * cost
    rows.append(["", "Total", "", str(tq), "", f"{tv:,.2f}"])
    lt = Table(rows, colWidths=[28*mm, 64*mm, 27*mm, 12*mm, 22*mm, 25*mm], repeatRows=1)
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
        "Unit costs are ex-VAT supplier costs per the Sheraton tax invoice (matching Shopify PO484). Stock received on "
        "Shopify but not processed in Cin7, hence captured as an upward stock adjustment. Source: signed Sheraton tax "
        "invoice (copy on the PO484 Shopify timeline).", small))
    doc.build(story)
    return fn


if __name__ == "__main__":
    for d in DELIVERIES:
        print(build_csv(d))
        print(build_pdf(d))
        print("  REF:", ref_string(d))
