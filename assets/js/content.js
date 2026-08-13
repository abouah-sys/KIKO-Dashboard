/* ============================================================================
   KIKO VITALS KNOWLEDGE BASE — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to add or change content.
   No coding experience required — follow the patterns below.

   STRUCTURE
     System  ->  Module  ->  Category (dropdown)  ->  Lesson (video or SOP)
     Plus a Products catalogue and a Guides section further down.

   VIDEOS
     Paste a normal YouTube / Vimeo / Loom link, or a Google Drive link.
     IMPORTANT for Google Drive videos: set the file's sharing to
     "Anyone with the link — Viewer", or employees won't be able to play it.
     If a video isn't linked yet, leave videoUrl: "" and the site shows a
     tidy "to be added" note. Use videoFile to record the source file name.

   SOPs WITH TWO VERSIONS (Standard + KIKO tailored)
     Use "variants" instead of "body":
       variants: [
         { label: "Standard (Cin7)", body: [ ...blocks... ] },
         { label: "KIKO tailored",   body: [ ...blocks... ] }
       ]
     For a single version, just use "body".

   BODY BLOCK TYPES
     { type: "heading",   text: "..." }
     { type: "paragraph", text: "..." }
     { type: "steps",     items: ["step 1", "step 2"] }   // numbered
     { type: "list",      items: ["point 1", "point 2"] } // bulleted
     { type: "callout",   style: "tip" | "warning" | "info", text: "..." }
     { type: "video",     videoUrl: "https://..." }
   Attach files with:  resources: [ { label: "...", url: "https://..." } ]
   ========================================================================== */

/* Placeholder for KIKO-tailored tabs you haven't filled in yet. */
const KIKO_TODO = [
  { type: "callout", style: "info", text: "This is KIKO's own way of doing this task. Replace the steps below with the exact process your team follows — locations, approvers, naming conventions and anything specific to Kiko Vitals." },
  { type: "steps", items: ["Add KIKO-specific step 1…", "Add KIKO-specific step 2…", "Add KIKO-specific step 3…"] }
];

const KB_CONTENT = {
  systems: [
    {
      id: "cin7",
      name: "Cin7",
      tagline: "Inventory & order management",
      description:
        "Cin7 Core is Kiko Vitals' inventory and order management system. Each module below follows the Cin7 Academy courses, with short SOPs for the everyday tasks. New starters should begin with the Sales module.",
      modules: [
        /* ========================= SALES ========================= */
        {
          id: "sales",
          name: "Sales Module",
          icon: "sales",
          summary: "Customers, quotes, simple and advanced sales, returns and credit notes.",
          categories: ["Getting Started", "Making a Sale", "Returns & Credit Notes", "Deposits & Giveaways"],
          lessons: [
            {
              id: "sales-create-customer",
              title: "SOP: Create a new customer",
              type: "article",
              category: "Getting Started",
              duration: "4 min read",
              summary: "Set up a clean customer record so every sale inherits the right defaults.",
              tags: ["customer", "setup"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "Customers carry the defaults every sale relies on, so a clean record saves work on every order. Set them up under Sale > New Customer, or from the Customers list." },
                  { type: "heading", text: "What to fill in" },
                  { type: "list", items: [
                    "General details: name, default sales account, status, default tax rule (you can override per sale), optional discount, credit limit with a hold toggle, currency, and a default sales rep.",
                    "Payment terms: 15, 30 or 60 days, or a custom term (days from invoice or end of month).",
                    "Pricing: pick the customer's price tier. Cin7 holds up to ten tiers and they can be renamed — this is how a wholesale/trade partner gets their tier instead of retail.",
                    "Addresses & contacts: add as many as needed, tag each address and set defaults, set the default contact, who is on emails, and marketing opt-in."
                  ]},
                  { type: "callout", style: "tip", text: "Getting the price tier right here means the correct pricing pulls through automatically on every future sale." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-simple",
              title: "Simple Sales",
              type: "video",
              category: "Making a Sale",
              duration: "video",
              videoFile: "Cin 7 Core Simple Sales.mp4",
              videoUrl: "",
              summary: "The straight-line sale: one order, fulfil it all, invoice it all.",
              tags: ["simple sale", "core task"]
            },
            {
              id: "sales-simple-sop",
              title: "SOP: Process a simple sale",
              type: "article",
              category: "Making a Sale",
              duration: "4 min read",
              summary: "One order, fulfil the whole thing, invoice the whole thing.",
              tags: ["simple sale", "core task"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "The straight-line sale. The moment you need to split a fulfilment or an invoice, switch to an Advanced Sale instead." },
                  { type: "steps", items: [
                    "Start with the header: customer, sales rep and every red-asterisk field. Get the Location right — it decides which warehouse the stock pulls from.",
                    "Work through the stages: quote, then order, then pick, pack, ship, then invoice.",
                    "Saving keeps a draft; authorising makes it valid. Authorising the order is what reserves stock.",
                    "Ship is the moment stock actually leaves the system.",
                    "Raise and send the invoice to finish the sale."
                  ]},
                  { type: "callout", style: "info", text: "Stock logic: a quote does nothing, an order reserves stock, pick and pack keep it reserved, and ship removes it." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-service",
              title: "SOP: Service sale (no stock)",
              type: "article",
              category: "Making a Sale",
              duration: "2 min read",
              summary: "A sale with service lines only — no products, no stock to reserve.",
              tags: ["service sale"],
              body: [
                { type: "paragraph", text: "Create it under Sale > New Service Sale. It feels like a simple sale with two differences: only service line items are available, and there is no order step — it goes straight from quote to invoice, because there is no stock to reserve." },
                { type: "steps", items: [
                  "Quote the service lines.",
                  "Authorise, then invoice (the due date fills from the payment terms).",
                  "If the customer has credit, Cin7 prompts you to allocate it.",
                  "Raise a credit note later if needed."
                ]}
              ]
            },
            {
              id: "sales-advanced",
              title: "Advanced Sales",
              type: "video",
              category: "Making a Sale",
              duration: "video",
              videoFile: "Cin 7 Core Advanced Sales.mp4",
              videoUrl: "",
              summary: "Part-ship and part-invoice with multiple fulfilments and invoices.",
              tags: ["advanced sale", "part-ship"]
            },
            {
              id: "sales-advanced-sop",
              title: "SOP: Process an advanced sale (part-ship / part-invoice)",
              type: "article",
              category: "Making a Sale",
              duration: "4 min read",
              summary: "Same as a simple sale, but carries multiple fulfilments and invoices.",
              tags: ["advanced sale"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "You can promote a simple sale to advanced, but not back. It lets you part-ship and part-invoice." },
                  { type: "steps", items: [
                    "Quote, authorise, order, authorise (authorising the order reserves stock). This opens the fulfilment and invoice panels.",
                    "Invoicing is independent of fulfilment — invoice everything now even if you ship the rest later, or invoice in parts and link each invoice to a fulfilment.",
                    "Worked example: invoice all fifty units but ship thirty now, then add a second fulfilment for the remaining twenty and link it to the invoice."
                  ]},
                  { type: "callout", style: "tip", text: "Use advanced sales whenever a customer order won't ship or bill in one clean piece." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-return",
              title: "How to Log a Return",
              type: "video",
              category: "Returns & Credit Notes",
              duration: "video",
              videoFile: "Cin 7 Core Logging Returns and Credit Notes.mp4",
              videoUrl: "",
              summary: "Restocking returned goods and raising the credit note.",
              tags: ["returns", "credit note"]
            },
            {
              id: "sales-return-sop",
              title: "SOP: Log a return & raise a credit note",
              type: "article",
              category: "Returns & Credit Notes",
              duration: "4 min read",
              summary: "Check returned goods back in, then credit the customer.",
              tags: ["returns", "credit note", "core task"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "The rule of thumb: restock first to check the goods back in, then raise the credit note against the invoice." },
                  { type: "heading", text: "Steps" },
                  { type: "steps", items: [
                    "Open the original sale in the Sales module.",
                    "Restock the goods: enter the quantities coming back and set the restock Location, so the units are checked back into stock.",
                    "Authorise the restock.",
                    "Raise the credit note against the invoice.",
                    "Drop the shipping line from the credit note unless you are also refunding shipping.",
                    "Choose how to settle it: refund to a bank account, or add it to the customer's credit.",
                    "Authorise the credit note."
                  ]},
                  { type: "callout", style: "tip", text: "Restock returns into a separate 'Returns / assessment' location rather than straight back into sellable stock — that keeps goods still under review apart from stock you can sell." },
                  { type: "callout", style: "warning", text: "Only move a returned item back into sellable stock once it has been checked and graded as resalable. Damaged or unsaleable items should be written off, not restocked (see the Inventory module)." }
                ]},
                { label: "KIKO tailored", body: [
                  { type: "callout", style: "info", text: "Document KIKO's own returns policy here: which location returned stock goes to, how it's graded, what counts as resalable vs write-off, and who signs off refunds vs store credit." },
                  { type: "steps", items: [
                    "Set the restock location to KIKO's returns/assessment location…",
                    "Grade the item (resalable / damaged)…",
                    "Refund method per KIKO policy (bank refund or customer credit)…"
                  ]}
                ]}
              ]
            },
            {
              id: "sales-deposits",
              title: "SOP: Apply a customer deposit to a sales order",
              type: "article",
              category: "Deposits & Giveaways",
              duration: "3 min read",
              summary: "Take a deposit against an order and settle it correctly at invoice.",
              tags: ["deposits", "prepayment"],
              body: [
                { type: "steps", items: [
                  "Create and authorise the sales order first. The deposit posts to the customer prepayments control account (set in Reference Books > account mapping).",
                  "Record the deposit: bank account, reference, date and amount.",
                  "On invoice, Cin7 prompts you to allocate the unused deposit; the payment shows as coming from the prepayments account, not the bank.",
                  "Take the balance against the bank, fully pay the invoice, then pick, pack and ship.",
                  "On sync, the credit and the bank payment reconcile against the invoice."
                ]}
              ]
            },
            {
              id: "sales-giveaways",
              title: "SOP: Giveaways — write-offs, free sales & discounts",
              type: "article",
              category: "Deposits & Giveaways",
              duration: "3 min read",
              summary: "Three clean ways to give stock away without breaking your cost or revenue numbers.",
              tags: ["giveaway", "discount", "write-off"],
              body: [
                { type: "list", items: [
                  "Inventory write-off — for trade shows and general giveaways. Inventory > Write-Off, choose the warehouse and an expense account, note the reason, add product and quantity. Posts debit expense, credit inventory.",
                  "100% discount sale — when you want to track who got the stock. Set the discount to 100% so the total is zero, but cost of goods is still recorded and revenue is not inflated.",
                  "Discount rules & deals — for promotions like buy-one-get-one, built in Reference Books. If Shopify is connected, set it in Shopify and it pulls through to Cin7."
                ]},
                { type: "callout", style: "warning", text: "Never set the same promotion in both Shopify and Cin7 — pick one place, or the discount doubles up." }
              ]
            }
          ]
        },

        /* ========================= PURCHASES ========================= */
        {
          id: "purchases",
          name: "Purchases Module",
          icon: "purchases",
          summary: "Suppliers, purchase orders, receiving, supplier bills, imports and landed costs.",
          categories: ["Getting Started", "Buying", "Imports & Landed Costs", "GRNI & GINR"],
          lessons: [
            {
              id: "purch-add-supplier",
              title: "How to Add a New Supplier Account",
              type: "video",
              category: "Getting Started",
              duration: "video",
              videoFile: "How to Add a New Supplier Account.mp4",
              videoUrl: "",
              summary: "Set up a supplier so purchase orders inherit the right defaults.",
              tags: ["supplier", "setup"]
            },
            {
              id: "purch-simple",
              title: "How to Process a Simple Purchase",
              type: "video",
              category: "Buying",
              duration: "video",
              videoFile: "How to Process a Simple Purchase.mp4",
              videoUrl: "",
              summary: "The everyday buying workflow, start to finish.",
              tags: ["purchase order", "core task"]
            },
            {
              id: "purch-stock-first",
              title: "SOP: Stock-first purchase (goods arrive, then the bill)",
              type: "article",
              category: "Buying",
              duration: "4 min read",
              summary: "The everyday workflow — use it when the goods land before the invoice.",
              tags: ["purchase order", "stock-first", "GRNI"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "Cin7 splits every purchase into two authorisations on one PO: a Stock Received tab and an Invoice tab. In stock-first buying the goods arrive first, so you authorise the Stock Received tab before the Invoice tab." },
                  { type: "steps", items: [
                    "Create the PO from Purchases > New > Standard. Add the supplier, currency, expected delivery date and lines. Add expected freight as a service line if the supplier charges it.",
                    "Authorise the PO — stock on order rises at the destination. No accounting entry yet.",
                    "When stock arrives: open the Stock Received tab, enter the quantities actually received (may be short of the order) and authorise. Posts Debit Inventory, Credit GRNI.",
                    "When the supplier invoice arrives: open the Invoice tab, enter the number, date and confirmed line costs, and authorise. Posts Debit GRNI, Credit Accounts Payable, and GRNI clears. The bill flows to Xero.",
                    "Pay the supplier in Xero or Cin7. Debit Accounts Payable, Credit Bank."
                  ]},
                  { type: "callout", style: "info", text: "GRNI (Goods Received Not Invoiced) is a temporary holding account that bridges the gap between the goods landing and the bill arriving. It clears the moment the invoice is entered." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "purch-advanced",
              title: "Advanced Purchase Orders — split receiving & invoicing",
              type: "video",
              category: "Buying",
              duration: "video",
              videoFile: "Advanced Purchase Orders with Split Receiving and Invoicing.mp4",
              videoUrl: "",
              summary: "Receiving and invoicing a PO in parts.",
              tags: ["advanced po", "partial"]
            },
            {
              id: "purch-partials",
              title: "SOP: Same-day, partial receipts & Mark as Received",
              type: "article",
              category: "Buying",
              duration: "3 min read",
              summary: "Handle deliveries that don't arrive in one clean piece.",
              tags: ["partial", "receiving"],
              body: [
                { type: "list", items: [
                  "Same day: authorise the Stock Received and Invoice tabs back to back, both dated today. GRNI is created and cleared in one go.",
                  "Partial receipts: the Stock Received tab takes multiple authorisations — receive 50 now, 30 next week, each on its own date. Cin7 tracks the outstanding quantity.",
                  "Partial invoices: the Invoice tab works the same way if the supplier bills in stages.",
                  "Short-shipped orders: when a supplier closes an order under quantity, use Mark as Received to close the PO without further receipts."
                ]}
              ]
            },
            {
              id: "purch-invoice-first",
              title: "SOP: Invoice-first purchase (imports / stock in transit)",
              type: "article",
              category: "Imports & Landed Costs",
              duration: "4 min read",
              summary: "Use it when you're billed or pay before the goods land.",
              tags: ["imports", "invoice-first", "GINR"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "The import workflow — the norm for sea freight or payment on order. Because you're billed before the stock arrives, the value parks in Stock in Transit (GINR) instead of overstating stock on hand." },
                  { type: "steps", items: [
                    "Create and authorise the PO as usual. Set the correct foreign currency if the supplier invoices in one.",
                    "Supplier invoice arrives first: open the Invoice tab and authorise the bill before any stock is received. Posts Debit GINR (Stock in Transit), Credit Accounts Payable.",
                    "Pay the supplier if terms require it up front. The value stays parked in GINR as an asset.",
                    "Stock lands: open the Stock Received tab and authorise on the real arrival date. Posts Debit Inventory, Credit GINR — GINR clears and the stock becomes on-hand inventory."
                  ]},
                  { type: "callout", style: "warning", text: "On an advanced purchase, GINR only clears when the quantity received matches the quantity invoiced. If you invoice 100 but receive 25, nothing moves until all 100 are received — so receive in full, or split the invoice to match each delivery." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "purch-landed-costs",
              title: "SOP: Landed costs on imports",
              type: "article",
              category: "Imports & Landed Costs",
              duration: "2 min read",
              summary: "Put freight, duty and clearing into stock value, not a general expense.",
              tags: ["landed costs", "freight", "duty"],
              body: [
                { type: "paragraph", text: "Freight, duty and clearing are part of what imported stock costs, so they belong in inventory value." },
                { type: "steps", items: [
                  "Add them as a service line on the original PO with an allocation method (by weight, price or quantity), or",
                  "Add them after the fact under Purchases > Landed Costs, against the freight supplier's invoice.",
                  "Cin7 spreads the cost across the SKUs in the consignment so each unit carries its true landed cost in the FIFO layers."
                ]}
              ]
            },
            {
              id: "purch-grni-ginr",
              title: "GRNI & GINR explained",
              type: "article",
              category: "GRNI & GINR",
              duration: "5 min read",
              summary: "The two holding accounts that keep stock and invoices honest — in plain English.",
              tags: ["GRNI", "GINR", "finance", "month-end"],
              body: [
                { type: "paragraph", text: "With Inventory Accrual switched on, Cin7 uses two temporary accounts to hold the gap between stock and invoice. Each nets to zero once both sides of a purchase are complete." },
                { type: "list", items: [
                  "GRNI — Goods Received Not Invoiced. Holds the value of stock that has landed but hasn't been billed yet. A liability: you owe for goods you already hold. Used in stock-first buying; clears on every partial receipt.",
                  "GINR — Goods Invoiced Not Received (a.k.a. Stock in Transit). Holds the value of stock you've been billed for but that hasn't arrived. An asset: money committed to goods still on their way. Used in invoice-first buying; waits for the full receipt."
                ]},
                { type: "heading", text: "The decision: which way do I run this purchase?" },
                { type: "paragraph", text: "Ask one question: did the stock arrive before or after the supplier billed us? Arrived first → stock-first (GRNI). Billed first → invoice-first (GINR)." },
                { type: "heading", text: "The 60-second month-end check" },
                { type: "list", items: [
                  "A balance in GRNI means stock was received but the bill hasn't been entered — chase or enter it.",
                  "A balance in GINR is fine for goods genuinely in transit, but a red flag if the shipment landed weeks ago and nobody authorised the Stock Received tab.",
                  "Anything stuck beyond a normal shipping cycle is a purchase that never got finished on one side — clear it before signing off the month."
                ]},
                { type: "callout", style: "info", text: "Run the Transactions vs Stock on Hand report each month to catch part-received tabs left hanging (see the Reporting module)." }
              ]
            }
          ]
        },

        /* ========================= INVENTORY ========================= */
        {
          id: "inventory",
          name: "Inventory Module",
          icon: "inventory",
          summary: "Setting up products and keeping stock accurate — write-offs, adjustments, stocktakes, transfers.",
          categories: ["Getting Started", "Setting Up Products", "Keeping Stock Accurate", "Integrations"],
          lessons: [
            {
              id: "inv-overview",
              title: "Inventory Module — Overview",
              type: "video",
              category: "Getting Started",
              duration: "video",
              videoFile: "Cin 7 Core Inventory Module Overview.mp4",
              videoUrl: "",
              summary: "How inventory works in Cin7 and what this module covers.",
              tags: ["overview"]
            },
            {
              id: "inv-stock-item",
              title: "SOP: Create a stock item",
              type: "article",
              category: "Setting Up Products",
              duration: "4 min read",
              summary: "The standard product type — the one most Kiko Vitals lines will be.",
              tags: ["product setup", "SKU"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "Create it from the plus icon, the Inventory module, or the product listing." },
                  { type: "list", items: [
                    "The SKU is your internal code — keep it meaningful and never start it with a zero (that breaks integrations). The product name is customer-facing and shows on Shopify and the POS.",
                    "Set the type to Stock, pick a category and brand, and choose the costing method (FIFO is the usual default). Set the unit of measure and a default location.",
                    "Leave the inventory, revenue, COGS and tax accounts blank to inherit the global settings. Add a barcode if the item is scanned at POS.",
                    "Set a minimum-before-reorder and a reorder quantity so Cin7 prompts the reorder. You can also set location-specific reorder levels.",
                    "Tick 'I sell this product' for anything sellable, set the price per tier, add suppliers and any customer-specific prices. Clone to spin up a similar product."
                  ]}
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "inv-other-types",
              title: "SOP: Non-inventory, service, product family & gift card items",
              type: "article",
              category: "Setting Up Products",
              duration: "4 min read",
              summary: "The other four product types and when to use each.",
              tags: ["product setup", "variants", "gift card"],
              body: [
                { type: "heading", text: "Non-inventory item" },
                { type: "paragraph", text: "For things you buy and track but don't manage as full stock (office or packaging supplies). Switch the type to Non-Inventory and the settings panel shrinks. It can still be sellable." },
                { type: "heading", text: "Service item" },
                { type: "paragraph", text: "A service with no physical stock, like a delivery or assembly charge. No dimensions, supplier or reorder levels. Turn 'charge for this service' to yes if you bill for it." },
                { type: "heading", text: "Product family" },
                { type: "paragraph", text: "The fast way to create many variants at once (a line that comes in several sizes or options). Set a family SKU, name and mandatory default location, define the options and values, then click Generate to create every combination." },
                { type: "callout", style: "warning", text: "When prompted 'update variation prices with family prices', say No if you've priced variants individually — otherwise it overwrites them." },
                { type: "heading", text: "Gift card" },
                { type: "paragraph", text: "First enable it in Settings > General > Gift Card settings (liability account, expiry and refund rules). You can only ever create one gift card product, and you cannot change its type after saving." }
              ]
            },
            {
              id: "inv-write-off",
              title: "SOP: Inventory write-off",
              type: "article",
              category: "Keeping Stock Accurate",
              duration: "2 min read",
              summary: "Remove stock from the books when it's lost, damaged, obsolete or used internally.",
              tags: ["write-off"],
              body: [
                { type: "steps", items: [
                  "Go to Inventory > Inventory Write-Off > New.",
                  "Choose the location, the expense account that fits the reason (lost, damaged, obsolete, internal use), the effective date and a note.",
                  "Add the item and quantity to write off — it pulls the cost. Bulk write-offs can use the export/import template.",
                  "Save as a draft, then complete it. It posts a debit to the expense and a credit to inventory."
                ]}
              ]
            },
            {
              id: "inv-adjustment",
              title: "SOP: Stock adjustment",
              type: "article",
              category: "Keeping Stock Accurate",
              duration: "2 min read",
              summary: "Correct what Cin7 thinks you hold — counting errors, found stock, or moving between SKUs.",
              tags: ["adjustment"],
              body: [
                { type: "steps", items: [
                  "Use the plus icon > Stock Adjustment, or Inventory > New.",
                  "Set the effective date and the expense account (e.g. cost of goods, or a damaged-goods/discrepancy account).",
                  "Non-zero adjustment (item already shows stock): enter the counted figure and Cin7 shows the variance.",
                  "Zero adjustment (item shows zero): add the stock you have found.",
                  "Save, then complete — Cin7 matches your real on-hand."
                ]},
                { type: "callout", style: "tip", text: "A stock adjustment is also the tool for moving a unit between SKUs (e.g. reduce the original SKU and increase a second-hand/graded SKU) without inventing a sale." }
              ]
            },
            {
              id: "inv-stocktake",
              title: "SOP: Stock take",
              type: "article",
              category: "Keeping Stock Accurate",
              duration: "3 min read",
              summary: "A full physical count that locks the location while you count.",
              tags: ["stocktake", "counting"],
              body: [
                { type: "callout", style: "warning", text: "While a stock take is open you cannot complete purchases, transfers, write-offs, sales fulfilment or stock adjustments at that location. Be ready to count before you start." },
                { type: "steps", items: [
                  "Open it from the plus icon or Inventory > New > Stock Take.",
                  "Set the effective date, the location, an expense account for the variance (a dedicated stock-take/discrepancy account is tidier than cost of goods) and a reference.",
                  "Choose to show quantity on hand on the count sheet, or hide it for a blind count. Filter by category or brand to count part of a location.",
                  "Count by manual entry, barcode scan, or the export/import spreadsheet. Shortfalls show in red, overages show a positive variance.",
                  "Completing posts the variance cost to the expense account and frees the location for normal work again."
                ]}
              ]
            },
            {
              id: "inv-transfer",
              title: "SOP: Stock transfer between locations",
              type: "article",
              category: "Keeping Stock Accurate",
              duration: "2 min read",
              summary: "Move stock through an in-transit stage so value is never lost in the gap.",
              tags: ["transfer", "locations"],
              body: [
                { type: "steps", items: [
                  "Open it from Inventory > New > Transfer. Pick the From and To locations, then set the required-by, sent and received dates (all can be today for a same-day move).",
                  "Add the products and quantities. The sending location marks the stock sent into an in-transit account, and the status becomes In Transit.",
                  "The receiving location marks the stock received and completes the transfer — the value moves out of in-transit and lands at the destination.",
                  "One person can run both ends, or two people can handle their own side."
                ]}
              ]
            },
            {
              id: "inv-shopify",
              title: "SOP: Cin7 & Shopify integration setup",
              type: "article",
              category: "Integrations",
              duration: "4 min read",
              summary: "Connect Shopify to Cin7 with Cin7 as the single source of truth. Set it up deliberately.",
              tags: ["shopify", "integration"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "Connect each Shopify store to Cin7 so orders flow in and stock flows out, with Cin7 as the master for products and quantities. One switch in particular has no undo." },
                  { type: "steps", items: [
                    "Connect from Integrations > eCommerce > Shopify > Add, and authorise through Shopify. Before you start, the chart of accounts and tax rules must already be synced from Xero, and every Cin7 location must exist.",
                    "Load locations from Shopify and map each Shopify location to a Cin7 warehouse. Names must match exactly — no trailing spaces or case differences — or order sync fails. Map each Shopify payment method to the right account.",
                    "Set capture mode to Paid, so only paid orders pull into Cin7 for fulfilment. Set the master data source to Cin7 Core, so products are managed in Cin7 and pushed out to Shopify.",
                    "Pick the price tier for each store so each storefront pulls the right pricing. Keep SKUs unique in Cin7 and leave import-duplicate-SKUs off.",
                    "Leave 'Update Stock Levels (Cin7 to Shopify)' OFF until a full stock take has verified Cin7 quantities at every location."
                  ]},
                  { type: "callout", style: "warning", text: "Once 'Update Stock Levels' is on, never adjust stock directly in Shopify — Cin7 overwrites it on the next push." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            }
          ]
        },

        /* ========================= REPORTING ========================= */
        {
          id: "reporting",
          name: "Reporting Module",
          icon: "report",
          summary: "The monthly Cin7 × Xero integrity audit — the method, the key reports, and the health checks.",
          categories: ["Monthly Audit", "Key Reports", "Health Checks"],
          lessons: [
            {
              id: "rep-method",
              title: "SOP: The monthly system audit (run-book)",
              type: "article",
              category: "Monthly Audit",
              duration: "4 min read",
              summary: "The repeatable run-book for the monthly Cin7 × Xero integrity check.",
              tags: ["audit", "month-end", "run-book"],
              body: [
                { type: "paragraph", text: "Work top to bottom each month, ticking each step as you go." },
                { type: "steps", items: [
                  "Copy the workbook (File > Make a copy). Never work in the master template.",
                  "Download ALL Cin7 reports listed on the Reports Checklist for the period.",
                  "Download the 4 Xero reports: Balance Sheet, Profit & Loss, Trial Balance, Account Transactions for the same period.",
                  "Paste each report into its matching tab — clear old data first, then paste from cell A1.",
                  "Tick off the checklist so coverage reads 100%.",
                  "Let the script/output tabs recalculate off the pasted data — don't edit numbers in output tabs.",
                  "Review each check, sanity-check it, record the exception count and mark it reviewed.",
                  "Read the overall health on the dashboard and deep-link to anything red.",
                  "Write up findings & owners: log action, impact, owner and due date for each item that isn't Clear.",
                  "Send & file: share the dashboard and audit report with the finance team and save to the client folder."
                ]},
                { type: "callout", style: "tip", text: "GRNI and GINR balances are timing accounts — over a full purchase cycle they return to zero. Reading them each month is a fast health check." }
              ]
            },
            {
              id: "rep-key-reports",
              title: "Key reports to pull each month",
              type: "article",
              category: "Key Reports",
              duration: "3 min read",
              summary: "The Cin7 and Xero reports that feed the monthly integrity audit.",
              tags: ["reports", "checklist"],
              body: [
                { type: "heading", text: "Cin7 reports" },
                { type: "list", items: [
                  "Sale Invoices & Credit Notes Report",
                  "Sale Overview Report",
                  "Sale Outstanding Quotes Report",
                  "Pending Sale Orders Report",
                  "Pending Purchase Orders Report",
                  "Stock Received vs Invoiced",
                  "Transactions vs Stock on Hand Detail",
                  "Inventory Movement Summary Report",
                  "Inventory Movement Details Report",
                  "Xero Synchronisation Report",
                  "Profit & Loss by Product Report",
                  "Trial Balance Report",
                  "Balance Sheet Report",
                  "Profit & Loss Report"
                ]},
                { type: "heading", text: "Xero reports" },
                { type: "list", items: [
                  "Balance Sheet",
                  "Profit & Loss",
                  "Trial Balance",
                  "Account Transactions"
                ]},
                { type: "callout", style: "info", text: "Pull all reports for the same period so the Cin7 and Xero figures line up when they're compared." }
              ]
            },
            {
              id: "rep-health-checks",
              title: "The 13 health checks (what each one flags)",
              type: "article",
              category: "Health Checks",
              duration: "5 min read",
              summary: "The integrity checks the dashboard runs and what a flag means for each.",
              tags: ["health checks", "reconciliation", "integrity"],
              body: [
                { type: "paragraph", text: "Each check rolls up into an overall Health %. Review them monthly and log any exceptions with an owner and due date." },
                { type: "list", items: [
                  "Sale credit notes not restocked — returns credited to the customer but never checked back into stock.",
                  "Pending SO analysis — sales orders sitting open that should have shipped or been closed.",
                  "Outstanding quotes review — quotes that have gone stale and need chasing or clearing.",
                  "Pending PO review — purchase orders left open past their expected dates.",
                  "Unallocated CN check (Cin7) — credit notes not yet allocated against an invoice or refund.",
                  "Stock invoice match check — stock received vs invoiced mismatches (part-received/part-invoiced tabs).",
                  "Txn vs Stock-on-hand check — transaction history that doesn't tie to current stock on hand.",
                  "Xero sync analysis — records that failed or are pending sync between Cin7 and Xero.",
                  "Sales Xero v Cin7 — sales totals in Xero compared against Cin7.",
                  "COGS reconciliation — cost of goods sold agreeing between the two systems.",
                  "Cin7 account values overview — key Cin7 control-account balances at a glance.",
                  "TB Cin7 vs Xero — trial balance comparison between Cin7 and Xero.",
                  "GP per product — gross profit by product, to spot mispriced or miscosted lines."
                ]},
                { type: "callout", style: "warning", text: "GRNI/GINR and 'stock invoice match' flags usually mean a purchase was only finished on one side. Clear anything stuck beyond a normal shipping cycle before signing off the month." }
              ]
            }
          ]
        }
      ]
    },

    /* ============================================================
       B2B PORTAL — the wholesale / trade ordering portal.
       ============================================================ */
    {
      id: "b2b",
      name: "B2B Portal",
      tagline: "Wholesale & trade ordering",
      description:
        "Guides for the Kiko Vitals B2B (wholesale) portal — how stockists set up their account, place and track orders, and manage pricing and payments.",
      modules: [
        {
          id: "b2b-getting-started",
          name: "Getting Started",
          icon: "portal",
          summary: "Accessing the portal, logging in and finding your way around.",
          categories: ["Overview", "Access"],
          lessons: [
            {
              id: "b2b-overview",
              title: "B2B Portal — Overview & navigation",
              type: "video",
              category: "Overview",
              duration: "video",
              videoUrl: "",
              summary: "A quick tour of the wholesale portal and what you can do in it.",
              tags: ["overview", "getting started"]
            },
            {
              id: "b2b-login",
              title: "SOP: Log in and set up your account",
              type: "article",
              category: "Access",
              duration: "3 min read",
              summary: "First-time login and account setup for a new stockist.",
              tags: ["login", "account"],
              body: [
                { type: "steps", items: [
                  "Open the B2B portal link supplied by the Kiko Vitals team.",
                  "Enter your registered trade email address and the temporary password.",
                  "Set a new password when prompted.",
                  "Complete your business profile (trading name, VAT number, delivery address).",
                  "Save — you're ready to place your first order."
                ]},
                { type: "callout", style: "info", text: "Don't have login details yet? Contact your Kiko Vitals account manager to be set up as an approved stockist." }
              ]
            }
          ]
        },
        {
          id: "b2b-ordering",
          name: "Placing Orders",
          icon: "sales",
          summary: "Building an order, minimums, and reordering from past purchases.",
          categories: ["Ordering", "Reordering"],
          lessons: [
            {
              id: "b2b-place-order",
              title: "SOP: Place a wholesale order",
              type: "article",
              category: "Ordering",
              duration: "4 min read",
              summary: "Build and submit a new wholesale order.",
              tags: ["orders", "core task"],
              body: [
                { type: "steps", items: [
                  "Log in to the B2B portal.",
                  "Browse the catalogue or search for products by name.",
                  "Enter the quantity (cases/units) for each product you want.",
                  "Check you've met any minimum order value or quantity.",
                  "Review your cart, delivery address and requested delivery date.",
                  "Submit the order for processing."
                ]},
                { type: "callout", style: "tip", text: "Wholesale prices show automatically once you're logged in — you don't see retail pricing." }
              ]
            },
            {
              id: "b2b-order-walkthrough",
              title: "Placing an order (video walkthrough)",
              type: "video",
              category: "Ordering",
              duration: "video",
              videoUrl: "",
              summary: "Watch a full order being built and submitted.",
              tags: ["orders", "walkthrough"]
            },
            {
              id: "b2b-reorder",
              title: "SOP: Quick reorder from a previous order",
              type: "article",
              category: "Reordering",
              duration: "2 min read",
              summary: "Repeat a past order in a couple of clicks.",
              tags: ["reorder"],
              body: [
                { type: "steps", items: [
                  "Go to Order History in the portal.",
                  "Find the order you want to repeat.",
                  "Click Reorder to copy those items into a new cart.",
                  "Adjust quantities as needed and submit."
                ]}
              ]
            }
          ]
        },
        {
          id: "b2b-pricing-payments",
          name: "Pricing & Payments",
          icon: "purchases",
          summary: "Trade pricing, discounts, payment terms and invoices.",
          categories: ["Pricing", "Payments"],
          lessons: [
            {
              id: "b2b-pricing",
              title: "SOP: View your trade pricing & discounts",
              type: "article",
              category: "Pricing",
              duration: "3 min read",
              summary: "Where to see your wholesale prices and any tier discounts.",
              tags: ["pricing", "discounts"],
              body: [
                { type: "list", items: [
                  "Prices shown in the portal are your wholesale (trade) prices.",
                  "Volume or tier discounts, if any, apply automatically at checkout.",
                  "Download a current price list from the Documents area."
                ]},
                { type: "callout", style: "info", text: "Replace this with Kiko Vitals' actual pricing tiers and discount rules." }
              ]
            },
            {
              id: "b2b-payment",
              title: "SOP: Payment terms & paying an invoice",
              type: "article",
              category: "Payments",
              duration: "3 min read",
              summary: "How and when to pay for wholesale orders.",
              tags: ["payments", "invoices"],
              body: [
                { type: "steps", items: [
                  "Find your invoice under Orders / Invoices in the portal.",
                  "Note the payment terms shown on the invoice.",
                  "Pay by the method agreed with Kiko Vitals (EFT / card).",
                  "Use your invoice number as the payment reference."
                ]},
                { type: "callout", style: "warning", text: "Confirm KIKO's real payment terms and banking details before publishing this SOP." }
              ]
            }
          ]
        },
        {
          id: "b2b-account-support",
          name: "Account & Support",
          icon: "inventory",
          summary: "Update your details, track deliveries and get help.",
          categories: ["Account", "Help"],
          lessons: [
            {
              id: "b2b-account",
              title: "SOP: Update account & delivery details",
              type: "article",
              category: "Account",
              duration: "2 min read",
              summary: "Keep your business and delivery information current.",
              tags: ["account"],
              body: [
                { type: "steps", items: [
                  "Go to Account Settings in the portal.",
                  "Update your trading name, contact person or VAT details.",
                  "Add or edit delivery addresses.",
                  "Save your changes."
                ]}
              ]
            },
            {
              id: "b2b-support",
              title: "SOP: Track a delivery & get help",
              type: "article",
              category: "Help",
              duration: "2 min read",
              summary: "Check where your order is and how to reach support.",
              tags: ["support", "delivery"],
              body: [
                { type: "steps", items: [
                  "Open Order History and select the order.",
                  "Check the status and any tracking link provided.",
                  "For anything else, contact your Kiko Vitals account manager."
                ]},
                { type: "callout", style: "tip", text: "Add KIKO's support email / WhatsApp and delivery-partner tracking links here." }
              ]
            }
          ]
        }
      ]
    }
  ],

  /* ========================================================================
     PRODUCTS — the Kiko Vitals catalogue (for staff reference & training).
     "concerns" become the Products dropdown groups. Each item links to the
     live product page for up-to-date price & stock. Add a "price" field to
     any item if you want it shown on the card.
     ======================================================================== */
  products: {
    storeUrl: "https://kikovitals.com",
    concerns: ["Hormones", "Gut Health", "Menopause", "Period Care", "Hydration", "Bundles & Kits"],
    items: [
      { id: "hormone-balance", name: "Hormone Balance", concern: "Hormones",
        blurb: "Daily support for hormonal balance, PMS and radiant feminine wellbeing.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Hormone_Balance_bottle_-_Edited_400x400.png",
        url: "https://kikovitals.com/products/hormone-balance" },
      { id: "prebiotic-probiotic", name: "Prebiotic + Probiotic", concern: "Gut Health",
        blurb: "Advanced gut therapy to nourish, repair and support healthy digestion.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Prebiotic_Probiotic1_400x400.png",
        url: "https://kikovitals.com/products/prebiotic-probiotic" },
      { id: "kiko-bloat", name: "Kiko Bloat", concern: "Gut Health",
        blurb: "Targeted relief for bloating and everyday digestive comfort.",
        image: "", url: "https://kikovitals.com/products/kiko-bloat" },
      { id: "heal-your-gut-duo", name: "Heal Your Gut Duo", concern: "Gut Health",
        blurb: "A pairing designed to debloat and restore gut balance.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/heal-your-gut_8f7d30ef-0f27-438a-b2b0-1ac575166769_400x400.png",
        url: "https://kikovitals.com/products/heal-your-gut-duo" },
      { id: "menopause-balance", name: "Menopause Balance", concern: "Menopause",
        blurb: "Support through perimenopause and menopause symptoms.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Meno_d1d07fe4-7240-46a1-b979-c244f02521e7_400x400.png",
        url: "https://kikovitals.com/products/menopause-balance" },
      { id: "meno-radiance-trio", name: "Meno Radiance Trio", concern: "Menopause",
        blurb: "A three-step routine for radiance and balance through menopause.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/meno-trio_c50ffc25-0d2f-4835-8f54-0959ed1e4b79_400x400.png",
        url: "https://kikovitals.com/products/meno-radiance-trio" },
      { id: "moon-balm-period-pain-relief", name: "Moon Balm — Period Pain Relief", concern: "Period Care",
        blurb: "A soothing balm for natural period pain relief.",
        image: "", url: "https://kikovitals.com/products/moon-balm-period-pain-relief" },
      { id: "hydration-electrolytes", name: "Litchi Salt Hydration Electrolytes", concern: "Hydration",
        blurb: "Hydrate your way to hormonal balance with everyday electrolytes.",
        image: "", url: "https://kikovitals.com/products/hydration-electrolytes" },
      { id: "kiko-synergy-duo", name: "Kiko Synergy Duo", concern: "Bundles & Kits",
        blurb: "The core gut + hormone pairing for whole-body balance.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Synergy-Duo_412c0dd4-d0bf-41a8-8ce7-9768f9f0e261_400x400.png",
        url: "https://kikovitals.com/products/kiko-synergy-duo" },
      { id: "kiko-trilogy", name: "Kiko Trilogy", concern: "Bundles & Kits",
        blurb: "A three-product set covering gut, hormones and daily wellness.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/trio_15d31fc4-508e-4f0c-b447-ff9b6faddef6_400x400.png",
        url: "https://kikovitals.com/products/kiko-trilogy" },
      { id: "mother-daughter-duo", name: "Mother + Daughter Duo", concern: "Bundles & Kits",
        blurb: "A thoughtful pairing to support wellness across generations.",
        image: "", url: "https://kikovitals.com/products/mother-daughter-duo" },
      { id: "essentials-duo", name: "Essentials Duo", concern: "Bundles & Kits",
        blurb: "The everyday essentials pairing to get started with Kiko Vitals.",
        image: "", url: "https://kikovitals.com/products/essentials-duo" }
    ]
  },

  /* ========================================================================
     GUIDES — big reference documents (shown as their own sidebar section).
     Provide content via "sections" (written) and/or "embedUrl" (embed a
     Google Doc "Publish to web" link, or a Drive/PDF preview link).
     ======================================================================== */
  guides: [
    {
      id: "kv-procurement",
      name: "KIKO Procurement Cycle",
      icon: "book",
      subtitle: "End-to-end: raw materials → Nutralab → finished goods in your warehouse",
      description:
        "The complete Kiko Vitals procurement and manufacturing lifecycle in Cin7 — who the players are, what a BOM and an assembly actually are, and the exact clicks for every phase from buying plain bottles to receiving sellable finished goods.",
      embedUrl: "",
      sections: [
        {
          id: "flow",
          title: "How the supply chain actually works",
          body: [
            { type: "paragraph", text: "Before any Cin7 clicks, get the physical picture straight — most of the confusion in this process comes from the fact that Kiko almost never touches the raw materials." },
            { type: "steps", items: [
              "Kiko orders raw materials (plain bottles from Bonpak, printing from Bottle Printers, labels and boxes from packaging suppliers). These suppliers deliver everything DIRECTLY to Nutralab — the components never physically arrive at Kiko.",
              "Nutralab is the main manufacturer. It sources its own raw ingredients, manufactures the capsules, fills the bottles, and assembles the complete finished product using the components Kiko's suppliers delivered.",
              "Nutralab ships the complete, sellable finished goods to Kiko.",
              "Kiko receives the finished goods into its own warehouse, and only then can they be sold on Shopify or B2B."
            ]},
            { type: "callout", style: "warning", text: "Key point: even though the bottles, labels and boxes are sitting at Nutralab, Kiko OWNS them — Kiko paid for them. Cin7 must carry that stock as Kiko's inventory regardless of which location it's booked at." },
            { type: "heading", text: "Today vs target: the one-warehouse setup" },
            { type: "paragraph", text: "TODAY (deliberate): everything runs through Main Warehouse — including stock physically sitting at Nutralab. This was an intentional setup decision (agreed on the original implementation call) for operational ease: one warehouse, no transfer needed every time the lab sends stock. Nutralab does a physical count every week and sends it to Taylor, who records raw materials at Main Warehouse. The 'Nutra Lab' location exists in Cin7 with the right SKUs mapped — it's dormant by choice, not a failure." },
            { type: "paragraph", text: "TARGET (planned soon): move to true per-site visibility. Migration = one count at the lab + one opening stock transfer of those quantities from Main Warehouse to Nutra Lab. From then on: receive lab-bound POs into Nutra Lab, run assemblies at Nutra Lab, and transfer finished goods to Main Warehouse on each delivery (Phase 4). The trade-off is a layer of extra weekly steps in exchange for Cin7 showing exactly what sits at the lab vs at Kiko." },
            { type: "callout", style: "info", text: "This SOP is written for the TARGET state. Until the migration happens, read every 'Location: Nutra Lab' instruction as 'Location: Main Warehouse', and skip the Phase 4 transfer (goods are already booked at Main Warehouse)." }
          ]
        },
        {
          id: "concepts",
          title: "The concepts: BOM, assembly, locations & transfers",
          body: [
            { type: "heading", text: "What is a BOM (Bill of Materials)?" },
            { type: "paragraph", text: "A BOM is simply a recipe. It lists exactly what goes into making one unit of a product — the component items and their quantities, plus any labour or service costs. Example: one FG-HORMONE-60C = 1 printed bottle + 1 lid + 1 box + 1 unit of capsules + the lab's filling & assembly fee." },
            { type: "heading", text: "How a BOM works in Cin7" },
            { type: "list", items: [
              "The BOM lives on the product record: open the product (e.g. FG-HORMONE-60C), go to the Bill of Materials tab, and switch 'I make/assemble this product' on.",
              "Add each component SKU and the quantity needed per ONE unit of the finished product.",
              "Add labour/overhead lines for services — e.g. the 'Bottle Printing Fee' at R2.00 per bottle, or the 'Lab Filling & Assembly Fee'. These add cost without consuming stock.",
              "The BOM does nothing on its own — it's just the saved recipe. It only takes effect when you run an Assembly, which loads the BOM automatically.",
              "Costing rolls up automatically: the finished product's cost = the real (FIFO) cost of every component consumed + the labour/overhead lines. That's how a printed bottle 'knows' it cost bottle + printing, and how the finished good carries the full landed cost."
            ]},
            { type: "callout", style: "tip", text: "One BOM per sellable product. Because each product uses its own printed bottle, printed-bottle SKUs are product-specific (e.g. RM-HB-BTL-AMBER-125ML LABEL/PRINTED for Hormone Balance) — never a generic 'printed bottle'." },
            { type: "heading", text: "What is an assembly?" },
            { type: "paragraph", text: "An assembly is the Cin7 transaction that executes a BOM. You tell it which product to make and how many; it consumes the components out of stock and adds the finished units into stock, carrying the cost across. Assembly = 'we made this'. It's found under Production > New > Assembly." },
            { type: "list", items: [
              "Stock effect: components go DOWN, finished product goes UP — in one authorised transaction.",
              "Cost effect: the finished units absorb the components' FIFO cost plus the BOM's labour/overhead lines.",
              "Kiko uses assemblies twice: once to turn plain bottles into printed bottles (Phase 2), and once when Nutralab produces the finished goods (Phase 3).",
              "Run the assembly at the location where the work physically happens — for Kiko that's the Nutralab location."
            ]},
            { type: "heading", text: "Locations & stock transfers" },
            { type: "paragraph", text: "A location in Cin7 is a place stock can sit — a warehouse, a store, or a third party like Nutralab holding your goods. Quantities are tracked per location, so Cin7 can tell you '5 000 printed bottles at Nutralab, 800 finished units at Main Warehouse'." },
            { type: "paragraph", text: "A stock transfer moves stock between locations without buying or selling anything. Cin7 routes the value through an in-transit stage so nothing is lost in the gap between sending and receiving:" },
            { type: "steps", items: [
              "Go to Inventory > New > Transfer.",
              "Pick the From location (e.g. Nutralab) and the To location (e.g. Main Warehouse), and set the required-by / sent / received dates (all can be today for a same-day move).",
              "Add the products and quantities being moved.",
              "Mark as sent — stock leaves the From location and shows as In Transit.",
              "Mark as received when the goods land — the transfer completes and the stock (and its value) arrives at the To location."
            ]},
            { type: "callout", style: "info", text: "Transfers move stock; assemblies transform it; purchases create it; sales remove it. If goods changed place but nothing was made, bought or sold — it's a transfer." }
          ]
        },
        {
          id: "stock-vs-invoice",
          title: "Stock-first vs invoice-first — which way to run each PO",
          body: [
            { type: "paragraph", text: "Cin7 splits every purchase into two authorisations on one PO: a Stock Received tab and an Invoice tab. You authorise each on the date it actually happens. The one rule: follow the goods, not the paperwork. If the stock lands first, receive first. If you're billed or pay before the stock arrives, invoice first." },
            { type: "table",
              headers: ["If…", "Run it", "Because"],
              rows: [
                ["Stock arrives before (or with) the supplier invoice — typical for local suppliers and courier deliveries", "Stock-first: receive, then invoice", "The goods are physically on hand, so recognise them as stock on arrival. GRNI holds the value until the bill comes in."],
                ["You're invoiced or pay a deposit before the stock arrives — typical for imports and long lead times", "Invoice-first: invoice, then receive", "You've committed the money but hold no stock yet. GINR carries it as stock in transit (an asset) until the goods land."],
                ["Stock and invoice land on the same day — small local top-ups", "Same-day: both tabs in one sitting", "Net effect is identical to a plain purchase; GRNI is created and cleared in one go with a clean audit trail."]
              ]
            },
            { type: "heading", text: "For Kiko in practice" },
            { type: "list", items: [
              "Local suppliers who deliver then bill run STOCK-FIRST: Bonpak bottles, Bottle Printers, Joypak sachets, and the packaging and label suppliers.",
              "Nutralab: follow the goods. The lab's invoice is often authorised before the finished goods are collected — when the bill lands first, run the purchase INVOICE-FIRST so the value sits in stock in transit (GINR) until receipt.",
              "Any imported line paid or invoiced before the shipment arrives also runs invoice-first — never book an import invoice straight to an expense while the goods are in transit."
            ]},
            { type: "callout", style: "warning", text: "Match the Stock Received date to the real arrival date, or inventory and COGS land in the wrong period. And at month-end: a GRNI balance means stock arrived but the bill was never entered; a GINR balance is fine for goods genuinely in transit but a red flag if the shipment landed weeks ago." }
          ]
        },
        {
          id: "phase-1",
          title: "Phase 1 — System setup (products & locations)",
          body: [
            { type: "paragraph", text: "Before any workflows can run, the products and locations must exist. Per Kiko's process, sellable products are created in Shopify first and synced to Cin7; components and service items are created directly in Cin7. Share this naming structure with Shepherd for future product creation in Shopify." },
            { type: "heading", text: "Locations" },
            { type: "list", items: [
              "Nutra Lab — where supplier deliveries physically land and where all assemblies will be recorded after the migration. Exists in Cin7 with the right SKUs mapped; dormant by choice until then.",
              "Main Warehouse — Kiko's own warehouse, and (today, deliberately) the single logical location for everything including stock physically at the lab. Finished goods are sold from here.",
              "Consignment stockist locations — Takealot CPT/JHB/Durban, The Lot, The Olio Store, WeAreEGG — hold finished goods sitting at stockists that sell on Kiko's behalf. Stock moves to them by transfer, and out of them by sale at month-end.",
              "Buying stockists — e.g. Dischem Wellness — BUY the stock outright. That's a normal B2B sale invoiced on dispatch and shipped from Main Warehouse, not a consignment transfer. (A Dischem location exists in Cin7 and currently holds stock — confirm whether it should be wound down now that Dischem buys.)",
              "Supplier locations (Bottle Printers, Joypack) exist on the account but hold nothing — don't receive stock into them."
            ]},
            { type: "callout", style: "warning", text: "Several live location names carry trailing spaces ('Nutra Lab ', 'Takealot JHB ', 'Takealot Durban '). Clean these up — integrations and transfers match location names exactly." },
            { type: "heading", text: "Products" },
            { type: "table",
              headers: ["Product category", "Live SKU example", "Cin7 type", "Key settings"],
              rows: [
                ["Raw material — plain bottle", "RM-BTL-PLAIN-AMBER-125ML", "Stock 📦", "Costing method: FIFO; bought from Bonpak"],
                ["Raw material — lid", "RM-LID-BLACK-STD", "Stock 📦", "Consumed in the printed-bottle BOM"],
                ["Raw material — box", "RM-BOX-STD-HB", "Stock 📦", "Component for the final good"],
                ["Raw material — capsules", "RM-CAPSULE-HORMONE-60", "Stock 📦", "Bought from Nutra Lab; batch & expiry tracked"],
                ["Intermediate good", "RM-HB-BTL-AMBER-125ML LABEL/PRINTED", "Stock 📦", "Bill of Materials: Yes — product-specific printed bottle (plain bottle + lid + printing fee)"],
                ["Service (non-stock)", "PRINTING SERVICE", "Non-stock 🤝", "Used on printing supplier POs"],
                ["Service (non-stock)", "TRANSPORT SERVICE", "Non-stock 🤝", "Used for transport costs on supplier invoices"],
                ["Service (non-stock)", "LAB MFG SERVICE", "Non-stock 🤝", "Used on lab POs"],
                ["Final finished good", "FG-HORMONE-60C", "Stock 📦", "Bill of Materials: Yes; batch & expiry tracked; created in Shopify, synced to Cin7"],
                ["Fulfilment box", "RM-100-PACK-BOX", "Stock 📦", "Sales price: R0.00"]
              ]
            },
            { type: "callout", style: "tip", text: "Printed-bottle SKUs are product-specific (RM-HB-BTL-AMBER-125ML LABEL/PRINTED for Hormone Balance, RM-MB-… for Menopause Balance, RM-PREPRO-… for Prebiotic + Probiotic), not a generic 'printed bottle' — each sellable product's BOM points at its own printed bottle." }
          ]
        },
        {
          id: "phase-2",
          title: "Phase 2 — Procurement & component assembly (external printing)",
          body: [
            { type: "paragraph", text: "This workflow converts a plain bottle into a printed bottle, which becomes a component for the final product. Remember: physically, the bottles go from Bonpak to the printers and on to Nutralab — they never come to Kiko. In Cin7, receive them into the Nutralab location." },
            { type: "heading", text: "Step 1 — Order & receive plain bottles (from Bonpak)" },
            { type: "paragraph", text: "A standard stock purchase." },
            { type: "steps", items: [
              "Navigate to Purchases → New → Purchase Order.",
              "Supplier: select your bottle supplier (e.g. Bonpak). Location: Nutralab — that's where the bottles are physically delivered.",
              "Order tab: add the PLAIN BOTTLE item, quantity and price, then Authorise the PO.",
              "Invoice tab: when the invoice arrives, enter the supplier invoice number, click + Copy from Order, add any shipping costs using the TRANSPORT SERVICE SKU, and Authorise.",
              "Stock Received tab: when the bottles arrive at the lab, click + Copy from Invoice and Authorise."
            ]},
            { type: "callout", style: "info", text: "Outcome: plain bottle units are in stock at the Nutralab location, at their landed cost (bottle price + transport)." },
            { type: "heading", text: "Step 2 — Pay the printing supplier (Bottle Printers)" },
            { type: "paragraph", text: "A Service Purchase to pay the printer's invoice. This correctly records the expense without touching physical stock — the printing cost gets attached to the bottles in Step 3 via the BOM." },
            { type: "steps", items: [
              "Navigate to Purchases → New → Service Purchase.",
              "Supplier: select your Bottle Printers.",
              "Order tab: add the non-stock PRINTING SERVICE item. Quantity = the number of bottles being printed (e.g. 100); price = the per-item print cost (e.g. R2.00). Authorise the PO.",
              "Invoice tab: enter the printer's invoice number, click + Copy from Order, add any transport costs with the TRANSPORT SERVICE SKU if applicable, and Authorise."
            ]},
            { type: "callout", style: "info", text: "Outcome: the R200.00 printing expense is recorded and paid." },
            { type: "heading", text: "Step 3 — Assemble the printed bottles" },
            { type: "paragraph", text: "This assembly 'converts' plain bottles into the product-specific printed bottle, folding the printing cost into the item's value." },
            { type: "steps", items: [
              "Navigate to Production → New → Assembly. Location: Nutralab.",
              "Product: select the product-specific printed bottle SKU (e.g. RM-HB-BTL-AMBER-125ML LABEL/PRINTED).",
              "Quantity to assemble: enter the quantity (e.g. 100).",
              "Review the BOM tab — Cin7 loads the recipe from Phase 1: components 100 × plain bottle (e.g. RM-BTL-PLAIN-AMBER-125ML) and 100 × lid (RM-LID-BLACK-STD — per the live BOMs the lid is consumed here, at the printed-bottle stage), and labour & overheads 100 × 'Bottle Printing Fee' @ R2.00.",
              "Click Authorise."
            ]},
            { type: "callout", style: "info", text: "Outcome: 100 plain bottles (and 100 lids) leave stock; 100 product-specific printed bottles enter stock at Nutralab. Their cost now correctly includes the bottle cost AND the printing fee." }
          ]
        },
        {
          id: "phase-3",
          title: "Phase 3 — Final manufacturing (at Nutralab)",
          body: [
            { type: "paragraph", text: "By now the packaging suppliers have delivered all components — printed bottles, lids, labels, boxes — to Nutralab. Nutralab sources its own raw ingredients, manufactures the capsules, fills the bottles and assembles the complete product. In Cin7 this is two steps: buy the capsules from Nutralab, then run the final assembly." },
            { type: "heading", text: "Step 1 — Pay Nutralab for the capsules (raw material PO)" },
            { type: "steps", items: [
              "Navigate to Purchases → New → Purchase Order.",
              "Supplier: Nutralab. Location: Nutralab.",
              "Order tab: add the capsules SKU (RM-CAPSULE-HORMONE-60). Quantity: units bought (e.g. 1 000). Price: the lab's all-inclusive per-item fee. Authorise the PO.",
              "Invoice tab: enter the lab's invoice number, + Copy from Order, and Authorise.",
              "Stock Received tab: you MUST enter the batch number and expiry date provided by the lab — this drives batch tracking on the finished goods."
            ]},
            { type: "callout", style: "info", text: "Outcome: the capsule cost is recorded and paid, and the capsules are in stock at Nutralab with a batch number and expiry date." },
            { type: "heading", text: "Step 2 — Assemble the final finished goods" },
            { type: "paragraph", text: "This assembly consumes all the components and adds the lab's assembly cost, producing the sellable product." },
            { type: "steps", items: [
              "Navigate to Production → New → Assembly. Location: Nutralab.",
              "Product: select the final sellable product (e.g. FG-HORMONE-60C).",
              "Quantity to assemble: the quantity from the lab's production run (e.g. 1 000).",
              "Review the BOM tab — components (matching the live BOM for FG-HORMONE-60C): 1 000 × RM-HB-BTL-AMBER-125ML LABEL/PRINTED (the printed bottle, which already carries its lid and printing), 1 000 × RM-BOX-STD-HB, 1 000 × RM-CAPSULE-HORMONE-60.",
              "Labour & overheads: 1 000 × 'Lab Filling & Assembly Fee' — this comes from the BOM setup and should match the per-item service fee agreed with the lab.",
              "Batch tracking: enter the batch number and expiry date from the lab for this production run.",
              "Click Authorise."
            ]},
            { type: "callout", style: "info", text: "Outcome: all components are consumed; 1 000 units of FG-HORMONE-60C are added to stock at Nutralab, with an accurate rolled-up cost and proper batch tracking." }
          ]
        },
        {
          id: "phase-4",
          title: "Phase 4 — Nutralab ships finished goods to Kiko (stock transfer)",
          body: [
            { type: "paragraph", text: "When Nutralab dispatches the completed production run to Kiko, no purchase or sale happens — Kiko already owns the goods. It's a stock transfer between locations." },
            { type: "steps", items: [
              "Navigate to Inventory → New → Transfer.",
              "From: Nutralab. To: Main Warehouse.",
              "Add the finished goods and quantities being shipped (e.g. 1 000 × FG-HORMONE-60C).",
              "Mark as sent when Nutralab dispatches — the stock shows In Transit.",
              "Mark as received when the delivery lands at Kiko — the transfer completes."
            ]},
            { type: "callout", style: "warning", text: "Only stock at Main Warehouse should feed Shopify availability. Until the transfer is received, the units are in transit — don't sell what hasn't arrived." },
            { type: "callout", style: "info", text: "Outcome: finished goods (and their full cost) now sit at Main Warehouse, ready for Shopify and B2B orders. The procurement cycle is complete." }
          ]
        },
        {
          id: "house-rules",
          title: "House rules — agreed July 2026",
          body: [
            { type: "paragraph", text: "These rules came out of the July 2026 Cin7 audit review and are non-negotiable from here on. They exist because each one was being broken, and each break corrupts costing or traceability." },
            { type: "list", items: [
              "Every production run must be an ASSEMBLY — never adjust finished goods in. (Runs totalling 1 920 Meno, 1 522 Debloat and 1 112 Hormone units were adjusted in: the components were never consumed and the costing is wrong.)",
              "Stock adjustments are reserved for genuine count differences only, and EVERY adjustment needs a comment or reference so it can be traced later. Unexplained adjustments are unauditable.",
              "Batch number + expiry date are mandatory on every production run — no exceptions. (Only 48% of FG assembly lines carried batch numbers at the audit.)",
              "Never complete a quote as an order to 'park' it — that allocates stock and blocks batches from selling FIFO/FEFO.",
              "Book every transaction at the correct location. A 400-unit production run was booked at the Dischem location and had to be reversed; stock also gets sold out of the wrong locations. Slow down and check the Location field.",
              "Printed bottles follow the SOP: the plain-to-printed assembly step must be used. Buying printed-bottle SKUs directly from the printer at the print fee leaves plain bottles and lids unconsumed and under-costs everything downstream (see Phase 2)."
            ]},
            { type: "callout", style: "info", text: "Downstream of all of this: gross profit in Xero. Until assemblies, batches and locations are done right in Cin7, GP per product in Xero can't be trusted — that's the next piece of work once these rules hold." }
          ]
        },
        {
          id: "stock-takes",
          title: "Stock takes at Kiko",
          body: [
            { type: "paragraph", text: "A stock take is a controlled count of physical inventory reconciled against what Cin7 says is there. For Kiko that means two very different counts: the Main Warehouse (your own finished goods — count it yourself) and the Nutralab location (your components sitting at the lab — count it against the lab's records)." },
            { type: "heading", text: "How often" },
            { type: "list", items: [
              "Main Warehouse: full count quarterly at minimum; cycle-count the fast-moving finished goods (e.g. Hormone Balance, Prebiotic + Probiotic) monthly.",
              "Stock at Nutralab: the lab does a physical count every week and sends it to Taylor, who reconciles it against Cin7 (today against Main Warehouse; after the migration against the Nutra Lab location). A drift means an assembly was authorised for the wrong quantity, or components were used without a matching assembly.",
              "Consignment stockists (Takealot, The Lot, Olio, WeAreEGG): reconcile monthly against the stockist's stock-on-hand report as part of the month-end consignment routine (see the consignment section) — you can't walk their floor, so their report is the count."
            ]},
            { type: "heading", text: "Running the count in Cin7" },
            { type: "steps", items: [
              "Go to Inventory → New → Stock Take.",
              "Set the effective date, the Location (Main Warehouse or Nutralab), an expense account for the variance (use a dedicated stock-take/discrepancy account, not COGS) and a reference.",
              "Choose the scope: the whole location for the quarterly count, or filter by category/brand for a cycle count.",
              "Choose whether the count sheet shows the system quantity, or hide it for a blind count (blind counts are more honest).",
              "Count physically — manual entry, barcode scan, or the export/import spreadsheet. Check batch numbers and expiry dates while counting: short-dated or expired batches get flagged for write-off, not counted back into sellable stock.",
              "Review variances before authorising — investigate big ones first (miscount, an unentered assembly or transfer, damage, samples given away).",
              "Complete the stock take. Cin7 posts the variance to the expense account and syncs the journal to Xero."
            ]},
            { type: "callout", style: "warning", text: "While a stock take is open at a location you cannot complete purchases, transfers, write-offs, sales fulfilment or adjustments there. Count when the location is quiet, and be ready before you start — authorising is a one-way door." },
            { type: "callout", style: "tip", text: "Cycle counting beats one giant annual count: a different product group each week adds up to a full count every quarter without shutting the operation down." }
          ]
        },
        {
          id: "stock-adjustments",
          title: "Stock adjustments & write-offs at Kiko",
          body: [
            { type: "paragraph", text: "Use a stock adjustment for a known discrepancy outside a stock take; use a write-off to remove stock that's lost its value entirely. For a supplements business the big one is expiry — batches have hard expiry dates, so expired stock must leave the books via write-off, never quietly sold or ignored." },
            { type: "heading", text: "Stock adjustment — correct a quantity" },
            { type: "steps", items: [
              "Go to Inventory → New → Stock Adjustment (or the plus icon).",
              "Set the effective date, the location, and the expense account that matches the reason (damaged stock, discrepancy, promotional/internal use).",
              "Item already shows stock: enter the counted figure and Cin7 shows the variance. Item shows zero: add the stock you found.",
              "Save, then complete. Cin7 posts debit expense / credit inventory (or the reverse for additions) and syncs to Xero."
            ]},
            { type: "callout", style: "tip", text: "An adjustment is also the tool for moving units between SKUs — e.g. reduce a finished-good SKU and increase a 'samples' or graded SKU — without inventing a sale." },
            { type: "heading", text: "Write-off — remove worthless stock" },
            { type: "steps", items: [
              "Go to Inventory → Inventory Write-Off → New.",
              "Choose the location, the expense account for the reason (expired, damaged, lost, marketing/samples), the effective date and a note.",
              "Add the item, batch and quantity — Cin7 pulls the cost. For expired product, write off the specific batch so batch tracking stays truthful.",
              "Complete it: debit expense, credit inventory."
            ]},
            { type: "list", items: [
              "Expired batches (check expiry dates during every stock take and before every B2B shipment).",
              "Damaged units — leakers, crushed boxes, failed seals.",
              "Influencer/PR seeding and internal use — write off to a marketing expense account so giveaways don't distort COGS.",
              "Trade-show and event stock."
            ]},
            { type: "callout", style: "warning", text: "Written-off stock can have VAT implications (input VAT previously claimed). Flag large write-offs to Creative CFO before posting rather than after." },
            { type: "heading", text: "Stock revaluation — the cost is wrong, not the quantity" },
            { type: "paragraph", text: "If the count is right but the unit cost is wrong (supplier price change captured incorrectly, prior-period error), use Inventory → Stock Revaluation. It changes the cost without touching quantity and posts the difference to a revaluation account. Rare — most cost problems at Kiko trace back to a BOM labour line not matching the lab's or printer's current fee, which is fixed in the BOM, not by revaluation." }
          ]
        },
        {
          id: "stock-transfers",
          title: "Stock transfers at Kiko",
          body: [
            { type: "paragraph", text: "A transfer moves stock between locations without buying or selling anything — the value simply changes address, passing through an in-transit stage. It posts zero net effect to Xero." },
            { type: "heading", text: "When Kiko uses transfers" },
            { type: "list", items: [
              "Nutralab → Main Warehouse: every finished-goods dispatch from the lab (the Phase 4 workflow).",
              "Main Warehouse → a consignment stockist (Takealot CPT/JHB/Durban, The Lot, The Olio Store, WeAreEGG): every consignment drop — see the consignment section below.",
              "Consignment stockist → Main Warehouse: pulling unsold or short-dated stock back.",
              "Main Warehouse → Nutralab: sending components or stock back to the lab (e.g. bottles bought and held at Kiko, or returned units for rework)."
            ]},
            { type: "heading", text: "The steps" },
            { type: "steps", items: [
              "Go to Inventory → New → Transfer.",
              "Pick the From and To locations and set the required-by / sent / received dates (all can be today for a same-day move).",
              "Add the products, batches and quantities — Cin7 validates there's enough stock at the source.",
              "Mark as sent when the goods dispatch: stock leaves the From location and shows as In Transit.",
              "Mark as received when they land: the transfer completes and the stock arrives at the To location."
            ]},
            { type: "callout", style: "warning", text: "Don't receive a transfer before the goods physically arrive — In Transit is the honest state while a courier has them. And if quantities received don't match quantities sent, investigate immediately; the gap is either a miscount or a loss in transit." },
            { type: "callout", style: "info", text: "Rule of thumb: transfers move stock, assemblies transform it, purchases create it, sales remove it, adjustments correct it. Pick the transaction that matches what physically happened." }
          ]
        },
        {
          id: "consignment",
          title: "Consignment stockists — transfers out, invoice at month-end",
          body: [
            { type: "paragraph", text: "Kiko's consignment stockists hold stock on consignment: the stock sits in their store (or on their ecom platform, like Takealot) but it stays Kiko's inventory until they sell it. That's why each consignment stockist is a Cin7 location — Takealot CPT / JHB / Durban, The Lot (Sea Point, Cavendish/CMT), The Olio Store, WeAreEGG (V&A, Cavendish). Nothing is invoiced when stock is dropped off; Kiko only invoices what the stockist actually sold, once their month-end report arrives." },
            { type: "callout", style: "info", text: "Not every stockist is consignment. Buying stockists like Dischem Wellness purchase the stock outright — that's a normal B2B sale: invoice on dispatch, ship from Main Warehouse, done. The consignment process below applies only to stockists selling Kiko-owned stock on Kiko's behalf." },
            { type: "heading", text: "Step 1 — Send stock: transfer, don't sell" },
            { type: "steps", items: [
              "Go to Inventory → New → Transfer. From: Main Warehouse. To: the stockist's location (e.g. Takealot CPT).",
              "Add the finished goods, batches and quantities being dropped.",
              "Mark as sent on dispatch and received on delivery confirmation.",
              "No invoice, no sale — the stock is still Kiko's, it just lives at the stockist now, and Cin7 shows exactly what each stockist is holding."
            ]},
            { type: "callout", style: "warning", text: "Never raise a sales order for a consignment drop. If you invoice stock that hasn't sold yet, you've recognised revenue you haven't earned and Cin7 stops tracking the stock you still own." },
            { type: "heading", text: "Step 2 — Month-end: their report arrives, you invoice what sold" },
            { type: "steps", items: [
              "Collect the stockist's month-end sales report (and stock-on-hand where they provide it). The B2B manager sends the report through; check with Kristal that invoicing has been done each month.",
              "Raise ONE sale in Cin7 per stockist for the month: customer = the stockist, and — critically — Location = that stockist's Cin7 location (e.g. Takealot Durban), so the stock ships out of their location, not Main Warehouse.",
              "Add the lines from their sales report: each SKU and quantity they sold, at the agreed trade price.",
              "Pick, pack and ship the order out of the stockist's location. Nothing physically moves — the ship step is what removes the sold units from that location's stock and posts COGS.",
              "Invoice the stockist and send it. They pay once the invoice has been sent (terms per stockist).",
              "Repeat for every consignment location that reported sales. This same pattern applies to every warehouse set up this way — current stockists and any added later."
            ]},
            { type: "heading", text: "Step 3 — Reconcile their stock-on-hand" },
            { type: "steps", items: [
              "After invoicing, compare the stockist's reported stock-on-hand to Cin7's quantity at their location — they should now match.",
              "A gap means unreported sales, damage, theft or a missed transfer. Query it with the stockist first; only post a stock adjustment at their location once the cause is confirmed.",
              "Watch expiry dates on consignment stock — batches age in-store. Pull short-dated stock back to Main Warehouse by transfer before it becomes a write-off in someone else's stockroom."
            ]},
            { type: "heading", text: "Who sends what, each month" },
            { type: "table",
              headers: ["Stockist", "Contact", "Month-end routine"],
              rows: [
                ["The Olio Store", "Sammy — support@theoliostore.co.za", "Sends sales report at month-end to invoice from. Check with Kristal that invoicing has been done."],
                ["The Lot (Sea Point, Cavendish)", "Donna — donna@ilovethelot.com", "Sends sales and stock-on-hand at month-end. B2B manager sends the report through; invoice what was sold — they pay once the invoice is sent."],
                ["WeAreEGG (V&A, Cavendish)", "finance@weareegg.co.za", "Sends payment breakdown in the first week of the new month; compare it to sales on Erply. A statement breaks down sales and deductions; invoices for rent, bank charges and commission come separately (not always consistent — request if missing)."],
                ["Takealot (CPT, JHB, Durban)", "Takealot seller portal", "Stock is sent to their DCs to sell on their ecom. Pull the sales report per DC from the portal; invoice what sold, shipped out of the matching Takealot location."]
              ]
            },
            { type: "callout", style: "tip", text: "Work closely with Kristal on all consignment stockists — she owns the month-end invoicing check." }
          ]
        },
        {
          id: "validate",
          title: "Validate it — the Cin7 reports to check",
          body: [
            { type: "paragraph", text: "After running a cycle (or to check past ones), pull these Cin7 reports for the period and confirm each phase left the right footprint:" },
            { type: "list", items: [
              "Purchase Order Details / Pending Purchase Orders — every PO (Bonpak, printers, Nutralab) fully received AND invoiced; nothing left half-finished.",
              "Stock Received vs Invoiced — catches POs where the stock or the invoice tab was never authorised (GRNI/GINR left hanging).",
              "Inventory Movement Details — shows the assemblies (components out, finished goods in) and the transfers; confirm quantities and dates match the physical production runs.",
              "Stock on Hand / Inventory by Location — components and fresh finished goods should sit at Nutralab; transferred finished goods at Main Warehouse; nothing stuck In Transit beyond the shipping window.",
              "Product BOM export (or the product's BOM tab) — recipes match reality: right components, right quantities, labour lines match the printer's and lab's current per-unit fees.",
              "Batch/Expiry (lot recall) report — every finished-goods batch traces back to the lab's batch number and expiry date.",
              "Inventory Movement Summary / P&L by Product — unit costs look sane: printed bottles carry bottle + printing; finished goods carry components + lab fee.",
              "Stock Take / Stock Adjustment / Write-Off listings — every variance posted to the right expense account with a reason, and expired batches actually written off.",
              "Xero: GRNI and GINR balances — both should trend to zero over a full purchase cycle; anything stuck beyond a normal shipping window is a purchase finished on only one side."
            ]},
            { type: "callout", style: "warning", text: "Known setup snags to confirm on the live account: Inventory Accrual must be enabled (or GRNI/GINR don't exist), and the Nutralab location name has a trailing space that should be removed — location names must match exactly everywhere or transfers and integrations misfire." },
            { type: "callout", style: "tip", text: "Export each of these to Excel/CSV for the period you want checked and send them over — they're enough to verify the whole cycle was processed correctly, end to end." }
          ]
        }
      ]
    },
    {
      id: "ccfo-master",
      name: "CCFO Master Guide",
      icon: "book",
      subtitle: "The complete end-to-end Cin7 reference",
      description:
        "The Creative CFO master guide — a single reference that walks through every area of Cin7 from start to finish. Use the contents on the right to jump to a section.",
      embedUrl: "",
      sections: [
        {
          id: "intro",
          title: "About this guide",
          body: [
            { type: "paragraph", text: "This master guide brings together everything in the individual module SOPs into one continuous reference covering the full Cin7 workflow — from a customer enquiry all the way through to stock, purchasing and reconciliation." },
            { type: "callout", style: "info", text: "The module SOPs are the quick, task-by-task version. This guide is the big-picture, end-to-end version. To embed the full CCFO document, paste its link into 'embedUrl' in content.js." }
          ]
        },
        {
          id: "guide-sales",
          title: "Sales — end to end",
          body: [
            { type: "steps", items: [
              "Quote → the customer receives a priced quote (no stock impact yet).",
              "Sales order → once accepted, stock is allocated against the order.",
              "Pick & pack → the warehouse prepares the goods.",
              "Ship → dispatch reduces on-hand stock.",
              "Invoice → the customer is billed and the sale hits the finance ledger.",
              "Payment → the invoice is settled and reconciled."
            ]},
            { type: "callout", style: "tip", text: "See the Sales Module SOPs for the click-by-click steps of any stage above." }
          ]
        },
        {
          id: "guide-purchases",
          title: "Purchases — end to end",
          body: [
            { type: "steps", items: [
              "Decide stock-first or invoice-first based on whether goods or the bill arrive first.",
              "Raise and authorise the purchase order.",
              "Receive stock and/or enter the supplier bill on the correct tabs.",
              "Capture landed costs on imports so product costs stay accurate.",
              "Watch GRNI/GINR clear as each purchase completes."
            ]}
          ]
        },
        {
          id: "guide-inventory",
          title: "Inventory — end to end",
          body: [
            { type: "steps", items: [
              "Set products up correctly (stock, non-inventory, service, family, gift card).",
              "Keep stock accurate with write-offs, adjustments and stocktakes.",
              "Move stock between locations with transfers.",
              "Keep Cin7 as the master and let it push quantities to Shopify."
            ]}
          ]
        },
        {
          id: "guide-reporting",
          title: "Reporting & month-end",
          body: [
            { type: "paragraph", text: "Run the monthly Cin7 × Xero integrity audit: pull the key reports, run the health checks, and clear anything stuck in GRNI/GINR before signing off the month." },
            { type: "callout", style: "info", text: "See the Reporting module for the run-book, the report list and the 13 health checks." }
          ]
        }
      ]
    }
  ]
};
