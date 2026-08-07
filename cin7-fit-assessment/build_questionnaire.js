const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, VerticalAlign,
} = require('docx');
const fs = require('fs');

const NAVY = '2d3741';
const ORANGE = 'dd7353';
const BLUEGREY = '607a80';
const MUTED = '97aaaa';
const NOTEBG = 'faeeea';   // light orange, house note fill
const ANSBG = 'fbf7ec';    // light sand, house fill
const GREENBG = 'f4f7f2';  // light green, house fill
const BORDER = 'e0dfdd';

const BODY = 'Arial';
const HEAD = 'Montserrat';

const W = 9640;            // usable width in DXA
const NUMW = 700;
const QW = W - NUMW;

const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const thin = { style: BorderStyle.SINGLE, size: 4, color: BORDER };
const allThin = { top: thin, bottom: thin, left: thin, right: thin };

function para(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: opts.line ?? 264 },
    children: runs.map(r => new TextRun({ font: BODY, size: 20, color: NAVY, ...r })),
  });
}

function sectionLabel(text) {
  return para([{ text: text.toUpperCase(), font: HEAD, size: 19, color: ORANGE, bold: true, characterSpacing: 40 }],
    { before: 240, after: 120 });
}

// Person banner: initial avatar + name/role, matching the Sloom person tables
function personBanner(initial, name, roleLine, fill) {
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [NUMW, QW],
    borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: NUMW, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 120, bottom: 120 },
          children: [new Paragraph({
            alignment: 'center',
            children: [new TextRun({ text: initial, font: HEAD, size: 40, color: 'FFFFFF', bold: true })],
          })],
        }),
        new TableCell({
          width: { size: QW, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          margins: { left: 200, top: 80, bottom: 80 },
          children: [
            para([{ text: name, font: HEAD, size: 24, bold: true }], { after: 40 }),
            para([{ text: roleLine.toUpperCase(), size: 16, color: BLUEGREY, bold: true, characterSpacing: 30 }], { after: 0 }),
          ],
        }),
      ],
    })],
  });
}

// One question: numbered row, optional WHY row, pre-filled ANSWER row with space
function question(num, qText, why, prefill) {
  const rows = [];

  rows.push(new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: NUMW, type: WidthType.DXA },
        borders: allThin,
        shading: { type: ShadingType.CLEAR, fill: NAVY },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: 'center',
          children: [new TextRun({ text: String(num), font: HEAD, size: 26, color: 'FFFFFF', bold: true })],
        })],
      }),
      new TableCell({
        width: { size: QW, type: WidthType.DXA },
        borders: allThin,
        margins: { left: 200, right: 200, top: 120, bottom: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [para([{ text: qText, size: 21, bold: true }], { after: 0 })],
      }),
    ],
  }));

  if (why) {
    rows.push(new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: NUMW, type: WidthType.DXA },
          borders: allThin,
          shading: { type: ShadingType.CLEAR, fill: NOTEBG },
          children: [new Paragraph({
            alignment: 'center',
            children: [new TextRun({ text: 'WHY', font: HEAD, size: 13, color: ORANGE, bold: true })],
          })],
        }),
        new TableCell({
          width: { size: QW, type: WidthType.DXA },
          borders: allThin,
          shading: { type: ShadingType.CLEAR, fill: NOTEBG },
          margins: { left: 200, right: 200, top: 100, bottom: 100 },
          children: [para([{ text: why, size: 19, color: BLUEGREY }], { after: 0 })],
        }),
      ],
    }));
  }

  rows.push(new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: NUMW, type: WidthType.DXA },
        borders: allThin,
        shading: { type: ShadingType.CLEAR, fill: ANSBG },
        children: [new Paragraph({
          alignment: 'center',
          children: [new TextRun({ text: 'A', font: HEAD, size: 13, color: BLUEGREY, bold: true })],
        })],
      }),
      new TableCell({
        width: { size: QW, type: WidthType.DXA },
        borders: allThin,
        shading: { type: ShadingType.CLEAR, fill: ANSBG },
        margins: { left: 200, right: 200, top: 100, bottom: 100 },
        children: [
          para([{ text: 'PRE-FILLED FROM OUR CALLS. PLEASE CORRECT ANYTHING THAT IS OFF:', font: HEAD, size: 13, color: BLUEGREY, bold: true, characterSpacing: 20 }], { after: 60 }),
          para([{ text: prefill, size: 20 }], { after: 120 }),
          para([{ text: 'Your answer / corrections:', size: 19, color: MUTED, italics: true }], { after: 0 }),
          para([{ text: ' ' }], { after: 0 }),
          para([{ text: ' ' }], { after: 0 }),
          para([{ text: ' ' }], { after: 0 }),
        ],
      }),
    ],
  }));

  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [NUMW, QW],
    borders: { ...allThin, insideHorizontal: thin, insideVertical: thin },
    rows,
  });
}

const gap = (after = 240) => new Paragraph({ spacing: { after }, children: [] });

const children = [
  // ---------- Header ----------
  para([{ text: 'CREATIVE CFO   .   TURNKEY INSTRUMENTS SA (PTY) LTD   .   AUGUST 2026', font: HEAD, size: 16, color: BLUEGREY, bold: true, characterSpacing: 30 }], { after: 160 }),
  para([{ text: 'Cin7 Fit Check', font: HEAD, size: 52, bold: true }], { after: 40, line: 640 }),
  para([{ text: 'Ten Questions Before We Build', font: HEAD, size: 52, bold: true, color: ORANGE }], { after: 160, line: 640 }),
  para([{ text: 'Please scan the pre-populated answers below, correct anything that is off, and fill in the gaps. Rough numbers and plain language are perfect. If anything needs a call to talk through, we can do 30 minutes on the questions and take it from there.', size: 20, color: BLUEGREY }], { after: 120 }),
  para([{ text: 'Prepared by Aidan Bouah   .   Creative CFO (Pty) Ltd   .   Confidential', size: 17, color: MUTED }], { after: 240 }),

  // ---------- Why this sheet ----------
  new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [W],
    borders: { top: none, bottom: none, left: none, right: none },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GREENBG },
        borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 24, color: 'a4c594' } },
        margins: { left: 240, right: 240, top: 160, bottom: 160 },
        children: [
          para([{ text: 'WHY WE ARE ASKING', font: HEAD, size: 15, color: BLUEGREY, bold: true, characterSpacing: 30 }], { after: 80 }),
          para([{ text: 'Cin7 Core carries a real monthly subscription plus its own setup and training effort. It earns that fee in businesses moving serious stock volume. From our calls, Turnkey holds a focused stock list in a single warehouse, stock stays at head office for repairs and calibrations, and most revenue is recurring on-site service billing. Before we configure anything, we want to test Cin7 against how you actually operate. If a simpler build on Xero, with your CRM handling the sales side, covers your needs, we will recommend that and you keep the fee.', size: 20 }], { after: 0 }),
        ],
      })],
    })],
  }),
  gap(180),

  // ---------- Context ----------
  para([{ text: 'TURNKEY CONTEXT, AS WE UNDERSTAND IT', font: HEAD, size: 15, color: BLUEGREY, bold: true, characterSpacing: 30 }], { after: 80 }),
  para([{ text: 'Independent African distributor and agent for UK-based Turnkey Instruments. Sells brake testers, dust monitors and related instrumentation to mines across Africa, and services around 100 mines a month through on-site contracts and around 30 to 50 field technicians. All physical stock lives in one warehouse at head office and is used for office-based repairs, calibrations and sales. The SAP item master holds around 629 lines, of which roughly 50 to 80 are physical stock; the rest are per-mine service pricing lines. Migrating from SAP Business One to Xero, Dext and SimplePay, with Cin7 Core scoped on top. This sheet decides that last piece.', size: 20, color: BLUEGREY }], { after: 240 }),

  // ---------- Claire section ----------
  personBanner('C', 'Claire Burgess', 'Accounts  .  Stock, purchasing and day-to-day operations', ORANGE),
  gap(160),

  question(1,
    'The physical stock list: how many of the ~629 SAP item lines are actual physical stock you buy, hold and sell, and do you expect that list to grow much over the next two years?',
    'Cin7 pricing and setup effort scale with the product list. 50 to 80 slow-moving lines is comfortably inside what Xero inventory can handle; a fast-growing list points to Cin7.',
    'Around 50 to 80 physical lines (Simret units and spares, paper rolls, ink ribbons, batteries, dust monitors, TAM QR tags, some PPE like the navy bunny jackets). Customer-specific codes such as the Sibanye items are variants of existing products, not genuinely new stock. New SKUs are added ad hoc when new stock arrives, so the list grows slowly.'),
  gap(),

  question(2,
    'In a typical month, roughly how many stock movements happen across everything: goods received, parts used in repairs, and items sold and shipped? And what is the approximate total value of stock on hand?',
    'This is the single biggest number in the fee decision. Cin7 pays for itself on volume. A few hundred movements a month or less is manageable in Xero.',
    'Low volume. A handful of instruments and parts leave the building per day, stock is one in, one out, and nothing travels to site with technicians. Parts used in office repairs are written out of stock to a cost account. We estimate well under 200 movements a month. Stock value: we do not have a number yet, please give us a rough figure.'),
  gap(),

  question(3,
    'Do you need the new system to track individual instruments by serial number, either your own stock or customer instruments in for calibration and repair?',
    'Xero cannot track serial numbers. Cin7 can. If serials matter for warranty, calibration certificates or recalls, this question alone can settle the decision.',
    'SAP does not track serial numbers today. Customer instruments in for calibration are managed by Sam outside the accounting system, and your own stock is counted by quantity only. Calibration certificates are issued per instrument but not driven from SAP.'),
  gap(),

  question(4,
    'When a customer instrument arrives for calibration or repair, how do you track the job between arrival and invoicing, and does that need to live in a system (status, due dates, who has it)?',
    'Neither Cin7 nor Xero is a job card system. If job tracking is the real need, we solve it with the CRM or a simple register, and it should not drive the Cin7 decision.',
    'Sam manages the workshop flow informally, Michelle raises the invoice once Sam confirms dispatch, and the invoice is the only system touchpoint. Job cards and codes are typed into text boxes on the invoice. This works at current volumes.'),
  gap(),

  question(5,
    'Quotes and sales orders: roughly how many quotes and sales orders do you raise a month, how often do orders part-ship or go on back order, and how important is future-dating quotes for the November annual cycle?',
    'Xero has quotes and invoices but no sales order step and no back orders. Cin7 has the full quote to sales order to shipment flow. Real volumes tell us whether that flow is worth paying for.',
    'Mines ask for quotes for the whole year ahead, starting around November, and SAP cannot future-date them, which causes pain. Sales orders are raised on acceptance, with quarterly or monthly testing schedules. Part-shipments and back orders are rare at your volumes. Monthly quote and order counts: please fill in.'),
  gap(),

  question(6,
    'When stock arrives from the UK, do you need freight, duty and clearing built into each item’s unit cost (landed cost), or is the supplier’s GBP invoice price a good enough cost for margin decisions?',
    'You asked for a landed cost view on the 10 June call. Cin7 does landed costing properly; Xero does not do it natively. If this is a hard requirement, it is a strong point for Cin7.',
    'You raise POs on the UK parent (GBP, 30-day terms) and Gavin handles local procurement. Selling prices are checked manually against a target margin of roughly 40%. Today freight and duty are not loaded into item costs, but on 10 June the team confirmed wanting shipping and import costs captured against stock in the new setup.'),
  gap(),

  question(7,
    'Reordering and stock-takes: do you want the system to hold minimum stock levels and flag reorders, and should it run your stock counts (count sheets, variances, adjustments), or is a quarterly spreadsheet count with one adjustment acceptable?',
    'Reorder points and guided stock-takes are Cin7 strengths that Xero mostly lacks. If reordering stays on experience and counts stay simple, this drops out of the decision.',
    'Claire reorders from experience, with no reorder points or low-stock alerts in SAP. One full count a year today, moving to quarterly on our recommendation. With 50 to 80 lines in one warehouse, a spreadsheet count is very manageable either way.'),
  gap(),

  // ---------- Patrick section ----------
  personBanner('P', 'Patrick Freeme, with Gavin', 'MD and Contracts  .  Contract billing, pricing and CRM', NAVY),
  gap(160),

  question(8,
    'Contract billing: how many invoices go out in a typical month across the ~100 mine contracts, and should contract pricing (baseline plus annual inflation adjustments) live inside the new system per mine, or stay on Gavin’s records with prices entered on each quote?',
    'If most revenue is recurring service billing with no stock movement, Xero repeating invoices cover it without Cin7. If contract pricing must live in the system per customer, Cin7 price tiers do that and Xero does not.',
    'Around 100 mines are billed monthly, mostly fixed fees set in the annual quote, with South Deep billed by working days excluding public holidays. Large mining contracts run on decades-old baselines with annual inflation adjustments, tracked by Gavin from history rather than in SAP. One price list applies to everyone else, with ad hoc manual adjustments on quotes.'),
  gap(),

  question(9,
    'Labour on repairs: do you plan to start charging labour on calibrations and repairs, and if so, as a flat bench fee or a daily rate?',
    'This changes the service item setup and margins on the repairs side. Both Xero and Cin7 handle it, so it shapes the design rather than the system choice, but we need the answer before building.',
    'Today no labour is charged on repairs and costs are not assigned to jobs. On 10 June there was interest in tracking how long tasks take, and the team noted a daily rate fits site work better than hourly. Claire was going to raise repair labour charges with management. Where did that land?'),
  gap(),

  question(10,
    'The CRM: what does your CRM actually need to do (pipeline only, or quotes and orders too), and if Cin7 goes ahead, would you consider HubSpot, since Pipedrive does not integrate with Cin7?',
    'This is a hidden cost in the Cin7 route. Pipedrive talks to Xero but not to Cin7. Keeping Cin7 and Pipedrive means re-keying between systems; moving to HubSpot adds subscription cost. A Xero-only build keeps Pipedrive as is.',
    'You chose Pipedrive over HubSpot on cost, mainly for the new business pipeline. Quoting for calibrations and repairs happens at the workshop and invoicing stays in the finance system, so we assume the CRM does not need to raise quotes or orders. Please confirm.'),
  gap(300),

  // ---------- Close ----------
  para([{ text: 'WHAT HAPPENS NEXT', font: HEAD, size: 15, color: BLUEGREY, bold: true, characterSpacing: 30 }], { after: 80 }),
  para([{ text: 'Once we have your answers, we will come back with a clear recommendation and the numbers behind it: either Cin7 Core with a scoped setup plan, or a simpler build on Xero inventory with the subscription saving quantified. Either way, the Xero, Dext and SimplePay work continues exactly as planned and nothing here moves the go-live timeline.', size: 20 }], { after: 120 }),
  para([{ text: 'Questions while filling this in? Email abouah@creativecfo.com. Rough answers now beat perfect answers next week.', size: 20, color: BLUEGREY, italics: true }], { after: 0 }),
];

const doc = new Document({
  styles: { default: { document: { run: { font: BODY, size: 20, color: NAVY } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 1000, left: 1160, right: 1160 } } },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(process.argv[2] || 'Turnkey_Cin7_Fit_Check_Questions_CCFO.docx', buf);
  console.log('written');
});
