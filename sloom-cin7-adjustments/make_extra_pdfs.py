#!/usr/bin/env python3
"""Supporting PDFs for the PO491 July true-up adjustment and the next-DN template."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

styles = getSampleStyleSheet()
h1 = ParagraphStyle("h1x", parent=styles["Title"], fontSize=15, spaceAfter=2)
h2 = ParagraphStyle("h2x", parent=styles["Heading2"], fontSize=11, spaceAfter=2)
small = ParagraphStyle("smallx", parent=styles["Normal"], fontSize=8.5, textColor=colors.HexColor("#444444"))
body = ParagraphStyle("bodyx", parent=styles["Normal"], fontSize=9)
mono = ParagraphStyle("monox", parent=styles["Normal"], fontSize=8.5, fontName="Courier")

GRID = TableStyle([
    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8e8e8")),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
])


def meta_table(rows, widths):
    t = Table(rows, colWidths=widths)
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
    return t


# ---------------------------------------------------------------- true-up PDF
doc = SimpleDocTemplate("sloom_PO491_TRUEUP_JUL26_attachment.pdf", pagesize=A4,
                        leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
story = [
    Paragraph("PO491 July True-Up — Sloom (Pty) Ltd", h1),
    Paragraph("Cin7 Core stock adjustment supporting document — Shopify PO491 (#PO491 - JHB / Unifoam SO229526)", small),
    Spacer(1, 6*mm),
    meta_table([
        ["Covers", "Unifoam DN I348706, I349198, I349504", "Received", "21–30 Jul 2026"],
        ["Supplier", "Unifoam (Pty) Ltd", "Cin7 location", "Johannesburg Warehouse"],
        ["Adjustment date", Paragraph("<b>31/07/2026</b> (effective date — covers all July receipts)", small), "Adjustment type", "Upward stock adjustment"],
        ["Reason", Paragraph("Quantities on the signed delivery notes exceed the quantities captured in the earlier Cin7 "
                             "adjustments (“PO 491 (Not On Cin7)” and DN I349198). This adjustment catches up the difference.", small),
         "Verify first", Paragraph("Confirm each SKU against Shopify on-hand before posting; remove any line where Cin7 already agrees.", small)],
    ], [24*mm, 70*mm, 24*mm, 62*mm]),
    Spacer(1, 5*mm),
    Paragraph("Cin7 Reference / Comment", h2),
    Paragraph("SHOPIFY-RECEIPTS-JUL26-JHB | PO491 Jul true-up (Unifoam) | DN I348706/I349198/I349504 quantities "
              "under-captured vs delivery notes, not processed in Cin7", mono),
    Spacer(1, 5*mm),
    Paragraph("Under-captured quantities (delivery notes vs Cin7 adjustments)", h2),
]
lines = [
    ("MA-OM-Q", "Sloom Original Mattress Queen", "I348706 (21 Jul) + I349504 (30 Jul)", 70, 57, 13, 5235.73),
    ("MA-OM-K", "Sloom Original Mattress King", "I348706 (21 Jul)", 5, 0, 5, 6078.62),
    ("AC-MT-D", "Sloom Mattress Topper Double", "I349198 (28 Jul)", 4, 1, 3, 1628.46),
    ("AC-MT-Q", "Sloom Mattress Topper Queen", "I349198 (28 Jul)", 9, 7, 2, 1750.85),
    ("AC-MT-KXL", "Sloom Mattress Topper King Extra Length", "I349198 (28 Jul)", 4, 2, 2, 2189.93),
]
rows = [["Cin7 SKU", "Product", "Source DN (received)", "DN qty", "Captured", "True-up\nqty", "Unit cost\n(ex VAT)", "Line total\n(ex VAT)"]]
tq = tv = 0
for sku, name, src, rec, cap, adj, cost in lines:
    rows.append([sku, Paragraph(name, body), Paragraph(src, body), str(rec), str(cap), str(adj), f"{cost:,.2f}", f"{adj*cost:,.2f}"])
    tq += adj; tv += adj * cost
rows.append(["", "Total", "", "", "", str(tq), "", f"{tv:,.2f}"])
lt = Table(rows, colWidths=[20*mm, 42*mm, 42*mm, 13*mm, 15*mm, 14*mm, 17*mm, 20*mm], repeatRows=1)
lt.setStyle(GRID)
lt.setStyle(TableStyle([("ALIGN", (3, 1), (-1, -1), "RIGHT"),
                        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                        ("LINEABOVE", (0, -1), (-1, -1), 0.8, colors.black)]))
story += [lt, Spacer(1, 4*mm),
          Paragraph("<b>Queen detail:</b> DNs delivered 70 (10 on I348706 + 60 on I349504); the “PO 491 (Not On Cin7)” "
                    "adjustment captured +57 (3 → 60) in Cape Town Warehouse. Confirm both the 13-unit gap and whether the "
                    "queens belong in JHB or CPT.", body),
          Spacer(1, 3*mm),
          Paragraph("Unit costs are ex-VAT supplier costs per Shopify PO491. Signed delivery note copies are attached to the "
                    "individual DN adjustments and on the PO491 Shopify timeline.", small)]
doc.build(story)
print("sloom_PO491_TRUEUP_JUL26_attachment.pdf")

# ---------------------------------------------------------------- template PDF
doc = SimpleDocTemplate("sloom_PO491_TEMPLATE_next_DN_attachment.pdf", pagesize=A4,
                        leftMargin=15*mm, rightMargin=15*mm, topMargin=14*mm, bottomMargin=14*mm)
story = [
    Paragraph("Unifoam Delivery Note I3______ — Sloom (Pty) Ltd", h1),
    Paragraph("TEMPLATE — next PO491 delivery · Cin7 Core stock adjustment supporting document — Shopify PO491 (#PO491 - JHB / Unifoam SO229526)", small),
    Spacer(1, 6*mm),
    meta_table([
        ["Delivery note no.", "I3______", "Internal label", "DN __.__"],
        ["Delivery note date", "__/__/2026", "Received (signed)", "__/__/2026 by ________"],
        ["Supplier", "Unifoam (Pty) Ltd", "Purchase order", Paragraph("#PO491 - JHB (Shopify) / SO229526 (Unifoam)", small)],
        ["Deliver to", Paragraph("Building 5 Unit 15 Riversand Outlet Park, Century Blvd, Knopjeslaagte, Johannesburg", small),
         "Cin7 location", "Johannesburg Warehouse"],
        ["Adjustment date", Paragraph("<b>__/__/2026</b> (effective date = received date)", small), "Adjustment type", "Upward stock adjustment"],
    ], [32*mm, 62*mm, 32*mm, 54*mm]),
    Spacer(1, 5*mm),
    Paragraph("Cin7 Reference / Comment (fill in DN number and date)", h2),
    Paragraph("SHOPIFY-RECEIPTS-AUG26-JHB | PO491 DN I3______ (Unifoam) | Goods received in Shopify __ Aug 2026, "
              "not processed in Cin7", mono),
    Spacer(1, 5*mm),
    Paragraph("Goods expected — outstanding balance on PO491", h2),
]
rows = [["Unifoam code", "Description", "Cin7 SKU", "Still open\non PO", "Qty this\ndelivery", "Unit cost\n(ex VAT)"],
        ["SLOOM/K250XL", Paragraph("2000*1830*250 Sloom Laminated Mattress<br/><font size=7.5 color='#666666'>Sloom Original Mattress King Extra Length</font>", body),
         "MA-OM-KXL", "30", "____", "6,686.49"],
        ["SLOOM/K250SP", Paragraph("Sloom Laminated Mattress Cape Town King<br/><font size=7.5 color='#666666'>Sloom Original Mattress Cape Town King</font>", body),
         "MA-OM-CTK", "7", "____", "8,940.84"]]
lt = Table(rows, colWidths=[28*mm, 66*mm, 25*mm, 20*mm, 20*mm, 21*mm], repeatRows=1)
lt.setStyle(GRID)
lt.setStyle(TableStyle([("ALIGN", (3, 1), (-1, -1), "RIGHT")]))
story += [lt, Spacer(1, 4*mm),
          Paragraph("Fill in the delivery quantities from the signed note, drop any line not on the delivery, and add lines "
                    "for anything unexpected. Update the same details in sloom_stock_adjustment_TEMPLATE_next_DN.csv before "
                    "importing, and use the received date as the adjustment's effective date.", body),
          Spacer(1, 3*mm),
          Paragraph("Unit costs are ex-VAT supplier costs per Shopify PO491. Attach the signed delivery note photo alongside "
                    "this sheet.", small)]
doc.build(story)
print("sloom_PO491_TEMPLATE_next_DN_attachment.pdf")
