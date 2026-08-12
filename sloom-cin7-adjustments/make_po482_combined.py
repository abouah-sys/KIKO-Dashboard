#!/usr/bin/env python3
"""PO482 (Unifoam, Cape Town) — ONE combined adjustment covering all five post-cutoff delivery notes."""
import csv
from collections import OrderedDict
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from make_po482_pdfs import DNS, CSV_HEADER

REF = ("SHOPIFY-RECEIPTS-JUL-AUG26-CPT | PO482 DN I348784/I349056/I349293/I349485/I349828 (Unifoam) | "
       "Goods received in Shopify 20 Jul - 7 Aug 2026, not processed in Cin7")

# aggregate per SKU, keeping DN breakdown and earliest received date
agg = OrderedDict()
for d in DNS:
    for code, desc, sku, sku_name, qty, cost in d["lines"]:
        e = agg.setdefault(sku, {"code": code, "name": sku_name, "cost": cost, "qty": 0,
                                 "rec": d["rec_yyyymmdd"], "parts": []})
        e["qty"] += qty
        e["rec"] = min(e["rec"], d["rec_yyyymmdd"])
        e["parts"].append(f"{qty} x {d['doc']} ({d['rec_h']})")

with open("sloom_stock_adjustment_PO482_combined.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(CSV_HEADER)
    for sku, e in agg.items():
        comment = f"{REF} | {' + '.join(e['parts'])}" if len(e["parts"]) > 1 else REF
        w.writerow(['Zero', 'Cape Town Warehouse', sku, e["name"], '', '', '',
                    e["qty"], f"{e['cost']:.2f}", comment, e["rec"]])
print("sloom_stock_adjustment_PO482_combined.csv")

styles = getSampleStyleSheet()
h1 = ParagraphStyle("h1x", parent=styles["Title"], fontSize=15, spaceAfter=2)
h2 = ParagraphStyle("h2x", parent=styles["Heading2"], fontSize=11, spaceAfter=2)
small = ParagraphStyle("smallx", parent=styles["Normal"], fontSize=8.5, textColor=colors.HexColor("#444444"))
body = ParagraphStyle("bodyx", parent=styles["Normal"], fontSize=9)
tiny = ParagraphStyle("tinyx", parent=styles["Normal"], fontSize=7.5, textColor=colors.HexColor("#666666"))
mono = ParagraphStyle("monox", parent=styles["Normal"], fontSize=8.5, fontName="Courier")
metasty = ParagraphStyle("metax", parent=styles["Normal"], fontSize=8.5)

doc = SimpleDocTemplate("sloom_PO482_combined_attachment.pdf", pagesize=A4,
                        leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
story = [
    Paragraph("Unifoam PO482 — Combined Receipt Adjustment — Sloom (Pty) Ltd", h1),
    Paragraph("Cin7 Core stock adjustment supporting document — Shopify PO482 (#PO0482 - CPT / Unifoam SO229111) — "
              "one adjustment covering all five post-cutoff delivery notes", small),
    Spacer(1, 6*mm),
]
meta = [
    ["Covers", Paragraph("Unifoam DN I348784 (20/07), I349056 (24/07), I349293 (29/07), I349485 (31/07), I349828 (07/08)", metasty),
     "Received", "20 Jul – 7 Aug 2026"],
    ["Supplier", "Unifoam (Pty) Ltd", "Purchase order", Paragraph("#PO0482 - CPT (Shopify) / SO229111 (Unifoam)", metasty)],
    ["Deliver to", Paragraph("Sloom, 9A Kariga Street, Stikland Industrial, Cape Town", metasty), "Cin7 location", "Cape Town Warehouse"],
    ["Adjustment date", Paragraph("<b>07/08/2026</b> (effective date = last receipt)", metasty), "Adjustment type", "Upward stock adjustment"],
]
t = Table(meta, colWidths=[26*mm, 72*mm, 28*mm, 54*mm])
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
story += [t, Spacer(1, 5*mm), Paragraph("Cin7 Reference / Comment", h2), Paragraph(REF, mono), Spacer(1, 5*mm),
          Paragraph("Adjustment lines (aggregated per SKU across the five delivery notes)", h2)]

rows = [["Cin7 SKU", "Product", "DN breakdown (qty x DN, received)", "Qty", "Unit cost\n(ex VAT)", "Line total\n(ex VAT)"]]
tq, tv = 0, 0.0
for sku, e in agg.items():
    rows.append([sku, Paragraph(e["name"], body), Paragraph("; ".join(e["parts"]), tiny),
                 str(e["qty"]), f"{e['cost']:,.2f}", f"{e['qty']*e['cost']:,.2f}"])
    tq += e["qty"]; tv += e["qty"] * e["cost"]
rows.append(["", "Total", "", str(tq), "", f"{tv:,.2f}"])
lt = Table(rows, colWidths=[22*mm, 42*mm, 57*mm, 11*mm, 21*mm, 25*mm], repeatRows=1)
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
story += [lt, Spacer(1, 4*mm),
          Paragraph("<b>Damaged-box notes on the signed DNs:</b> I348784 - \"1 x KXL box damaged\"; "
                    "I349293 - \"1 box damaged 1880*1370*250\" (Double). If either unit was rejected/returned rather "
                    "than accepted, reduce MA-OM-KXL and/or MA-OM-D by 1 before completing.", body),
          Spacer(1, 3*mm),
          Paragraph("Unit costs are ex-VAT supplier costs per Shopify PO482. Cin7 take-on cutoff was 19 Jul 2026; the "
                    "five deliveries above were received after the cutoff (Shopify only), hence this upward stock "
                    "adjustment. DN 13.07 (received 16 Jul, pre-cutoff: pillow singles/doubles and toppers) is excluded "
                    "- it forms part of the opening stock take-on. Signed DN copies are on the PO482 Shopify timeline.", small)]
doc.build(story)
print("sloom_PO482_combined_attachment.pdf")
