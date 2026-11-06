"""Excel audit pack for a recon run: a Summary tab plus one tab per check
with its exception rows. This is the working paper that sits in the client
folder; the HTML dashboard is the presentation layer.
"""

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

NAVY, ORANGE, GREEN = "2D3741", "DD7353", "A4C594"
GREY, SAND = "607A80", "DADACF"
STATUS_FILL = {"action": ORANGE, "watch": "E4C46A", "clear": GREEN,
               "info": SAND, "not_run": "C8CFD4"}
FONT = "Arial"


def _title(ws, text, sub=None):
    ws["A1"] = text
    ws["A1"].font = Font(name=FONT, size=14, bold=True, color=NAVY)
    if sub:
        ws["A2"] = sub
        ws["A2"].font = Font(name=FONT, size=9, color=GREY)


def _sheet_name(title):
    bad = set('[]:*?/\\')
    s = "".join(c for c in title if c not in bad)
    return s[:31]


def build_pack(run, out_path):
    wb = Workbook()
    ws = wb.active
    ws.title = "Summary"
    _title(ws, f"Cin7 - Xero Master Audit Recon - {run['client']}",
           f"{run['period_label']}  |  generated {run['generated_at']}  |  cadence: {run['cadence']}")
    ws["A4"] = "Overall health"
    ws["B4"] = run["overall_health"] / 100
    ws["B4"].number_format = "0.0%"
    ws["B4"].font = Font(name=FONT, size=12, bold=True, color=NAVY)
    ws["A5"] = "Action / Watch / Clear"
    sc = run["status_counts"]
    ws["B5"] = f"{sc['action']} / {sc['watch']} / {sc['clear']}"

    hdr = ["Check", "System", "Status", "Exceptions", "Value (R)", "Headline"]
    row0 = 7
    for j, h in enumerate(hdr, start=1):
        c = ws.cell(row0, j, h)
        c.font = Font(name=FONT, bold=True, color="FFFFFF")
        c.fill = PatternFill("solid", fgColor=NAVY)
    for i, chk in enumerate(run["checks"], start=1):
        r = row0 + i
        ws.cell(r, 1, chk["title"]).font = Font(name=FONT)
        ws.cell(r, 2, chk.get("system", "")).font = Font(name=FONT, color=GREY)
        s = ws.cell(r, 3, chk["status"].upper())
        s.font = Font(name=FONT, bold=True, color=NAVY)
        s.fill = PatternFill("solid", fgColor=STATUS_FILL.get(chk["status"], "FFFFFF"))
        ws.cell(r, 4, chk["exceptions"])
        if chk["value"] is not None:
            v = ws.cell(r, 5, chk["value"])
            v.number_format = "#,##0.00;(#,##0.00);-"
        ws.cell(r, 6, chk["headline"]).alignment = Alignment(wrap_text=True)
    last = row0 + len(run["checks"])
    tr = ws.cell(last + 1, 1, "Total exceptions")
    tr.font = Font(name=FONT, bold=True)
    # Written as a value, not a formula: the pack is a computed audit snapshot
    # (nothing in it is user-editable), and a value renders in every viewer
    # without a recalc step.
    total_ex = sum(c["exceptions"] for c in run["checks"])
    ws.cell(last + 1, 4, total_ex).font = Font(name=FONT, bold=True)
    for col, w in zip("ABCDEF", (42, 16, 10, 12, 16, 90)):
        ws.column_dimensions[col].width = w

    for chk in run["checks"]:
        wsc = wb.create_sheet(_sheet_name(chk["title"]))
        _title(wsc, chk["title"], chk["headline"])
        wsc["A3"] = f"Status: {chk['status'].upper()}   Exceptions: {chk['exceptions']}"
        wsc["A3"].font = Font(name=FONT, size=10, bold=True,
                              color=STATUS_FILL.get(chk["status"], NAVY))
        if chk.get("resolution"):
            wsc["A4"] = "How to resolve: " + chk["resolution"]
            wsc["A4"].font = Font(name=FONT, size=9, italic=True, color=GREY)
            wsc["A4"].alignment = Alignment(wrap_text=True)
        cols = chk.get("columns") or []
        rows = chk.get("rows") or []
        if cols and rows:
            r0 = 6
            for j, h in enumerate(cols, start=1):
                c = wsc.cell(r0, j, str(h).title())
                c.font = Font(name=FONT, bold=True, color="FFFFFF")
                c.fill = PatternFill("solid", fgColor=GREY)
            for i, row in enumerate(rows, start=1):
                for j, h in enumerate(cols, start=1):
                    v = row.get(h)
                    c = wsc.cell(r0 + i, j, v)
                    if isinstance(v, float):
                        c.number_format = "#,##0.00;(#,##0.00);-"
            for j, h in enumerate(cols, start=1):
                wsc.column_dimensions[get_column_letter(j)].width = max(14, min(40, len(str(h)) + 8))
        else:
            wsc["A6"] = "No exception rows."
    wb.save(out_path)
