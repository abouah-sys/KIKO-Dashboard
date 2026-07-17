/* ============================================================================
   KIKO KNOWLEDGE BASE — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to add or change content.
   No coding experience required — just follow the patterns below.

   HOW IT'S ORGANISED
     System  ->  Module  ->  Category  ->  Lesson
     (Cin7)      (Sales)     (Getting Started)   (a video or a written SOP)

   There is also a separate "guides" section at the bottom for big reference
   documents like the CCFO Master Guide.

   -------------------------------------------------------------
   CATEGORIES (the dropdown groups under each module)
   -------------------------------------------------------------
   Each module has a "categories" list — the named groups that appear when you
   expand the module in the sidebar, e.g.:

       categories: ["Getting Started", "Daily Tasks", "Advanced"]

   Then every lesson has a "category" that must match one of those names:

       category: "Getting Started"

   • Categories appear in the order you list them.
   • A lesson with no matching "category" falls into the first one automatically.

   -------------------------------------------------------------
   SOPs WITH TWO VERSIONS  (Standard + KIKO tailored)
   -------------------------------------------------------------
   An SOP can show two tabs: the generic "Standard" way, and KIKO's own tailored
   process. Use "variants" instead of "body":

     {
       id: "...", title: "SOP: ...", type: "article",
       category: "Daily Tasks", duration: "4 min read",
       summary: "...",
       variants: [
         { label: "Standard (Cin7)", body: [ ...blocks... ] },
         { label: "KIKO tailored",   body: [ ...blocks... ] }
       ]
     }

   If you only want ONE version, just use "body" instead of "variants".

   -------------------------------------------------------------
   TO ADD A VIDEO LESSON  (copy this into a module's "lessons" list)
   -------------------------------------------------------------
     {
       id: "unique-id-here",
       title: "How to raise a sales order",
       type: "video",
       category: "Getting Started",
       duration: "6 min",
       videoUrl: "https://www.youtube.com/watch?v=XXXXXXXX",  // YouTube/Vimeo/Loom
       summary: "Short one-line description shown in the list.",
       tags: ["sales order"]
     },

   Body block types you can use inside body / variants:
     { type: "heading",   text: "..." }
     { type: "paragraph", text: "..." }
     { type: "steps",     items: ["step 1", "step 2", ...] }   // numbered
     { type: "list",      items: ["point 1", "point 2", ...] } // bulleted
     { type: "callout",   style: "tip" | "warning" | "info", text: "..." }
     { type: "video",     videoUrl: "https://..." }            // embed inside an article

   Attach a document link to any lesson with:
     resources: [ { label: "Download the checklist (PDF)", url: "https://..." } ]
   ========================================================================== */

/* A short reusable placeholder for KIKO-tailored tabs you haven't filled in yet.
   Replace it with KIKO's real process whenever you're ready. */
const KIKO_TODO = [
  { type: "callout", style: "info", text: "This is KIKO's own way of doing this task. Replace the steps below with the exact process your team follows — approvers, naming conventions, the specific fields/templates KIKO uses, and anything that differs from the standard method." },
  { type: "steps", items: [
    "Add KIKO-specific step 1…",
    "Add KIKO-specific step 2…",
    "Add KIKO-specific step 3…"
  ]}
];

const KB_CONTENT = {
  systems: [
    {
      id: "cin7",
      name: "Cin7",
      tagline: "Inventory & order management",
      description:
        "Cin7 is KIKO's core inventory and order management system. Use the guides below to learn each module step by step. Start with the Sales module if you're new — or read the CCFO Master Guide for the complete end-to-end picture.",
      modules: [
        /* ================= SALES MODULE ================= */
        {
          id: "sales",
          name: "Sales Module",
          icon: "sales",
          summary:
            "Quotes, sales orders, picking, packing, invoicing and customer returns.",
          categories: ["Getting Started", "Orders & Fulfilment", "Returns & Credits"],
          lessons: [
            {
              id: "sales-overview",
              title: "Sales Module — Overview & navigation",
              type: "video",
              category: "Getting Started",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary: "A tour of the Sales module: where everything lives and the order lifecycle.",
              tags: ["overview", "getting started"]
            },
            {
              id: "sales-create-order",
              title: "SOP: Create a new sales order",
              type: "article",
              category: "Orders & Fulfilment",
              duration: "5 min read",
              summary: "Raise a sales order from scratch for a customer.",
              tags: ["sales order", "core task"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "The standard Cin7 process for raising a sales order that will be fulfilled from stock." },
                  { type: "heading", text: "Steps" },
                  { type: "steps", items: [
                    "From the main menu go to Sales and click New Sale.",
                    "Select the Customer. If they don't exist yet, click the + to add them first.",
                    "Check the Price Tier, Currency and Location are correct for this customer.",
                    "Add products by typing the SKU or product name into the line item field.",
                    "Enter the quantity for each line and confirm the unit price.",
                    "Review the order total, tax and any discounts.",
                    "Click Authorise to confirm the order and move it into fulfilment."
                  ]},
                  { type: "callout", style: "tip", text: "Save the order as a Draft first if you're waiting on customer confirmation — it won't reserve stock until you Authorise it." },
                  { type: "callout", style: "warning", text: "Always double-check the shipping Location. Picking the wrong location can allocate stock you don't physically have." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-quote-to-order",
              title: "SOP: Convert a quote into a sales order",
              type: "article",
              category: "Orders & Fulfilment",
              duration: "3 min read",
              summary: "Turn an accepted quote into a live order without re-keying.",
              tags: ["quotes", "sales order"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Open the Sales module and find the quote under the Quote tab.",
                    "Confirm the customer has accepted the quote in writing.",
                    "Open the quote and click Copy to Sale (or Convert).",
                    "Review the copied lines, quantities and prices.",
                    "Authorise the new sale to begin fulfilment."
                  ]},
                  { type: "callout", style: "info", text: "Converting keeps a link between the quote and the order for your audit trail." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-pick-pack-ship",
              title: "Pick, pack & ship an order",
              type: "video",
              category: "Orders & Fulfilment",
              duration: "8 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "The fulfilment workflow from picking through to dispatch.",
              tags: ["fulfilment", "shipping"]
            },
            {
              id: "sales-invoice",
              title: "SOP: Raise and send an invoice",
              type: "article",
              category: "Orders & Fulfilment",
              duration: "4 min read",
              summary: "Generate the customer invoice and send it out.",
              tags: ["invoicing", "finance"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Open the authorised sale.",
                    "Go to the Invoice tab.",
                    "Confirm the quantities being invoiced match what was shipped.",
                    "Click Authorise on the invoice.",
                    "Use Email to send the invoice PDF to the customer, or Export to save it."
                  ]},
                  { type: "callout", style: "tip", text: "If you invoice in stages, set the quantity on each line to only what's being billed now." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "sales-returns",
              title: "SOP: Process a customer return (credit note)",
              type: "article",
              category: "Returns & Credits",
              duration: "4 min read",
              summary: "Handle returned goods and issue a credit note.",
              tags: ["returns", "credit note"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "paragraph", text: "Follow this whenever a customer sends goods back." },
                  { type: "steps", items: [
                    "Find the original sale in the Sales module.",
                    "Open it and choose Credit Note (or Actions > Credit).",
                    "Enter the quantities being returned on each line.",
                    "Select whether stock is being returned to inventory or written off.",
                    "Add the reason for the return in the notes.",
                    "Authorise the credit note."
                  ]},
                  { type: "callout", style: "warning", text: "Only return items to sellable stock if they've been checked and are in resalable condition." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            }
          ]
        },

        /* ================= PURCHASES MODULE ================= */
        {
          id: "purchases",
          name: "Purchases Module",
          icon: "purchases",
          summary:
            "Purchase orders, receiving stock, supplier bills and returns to suppliers.",
          categories: ["Getting Started", "Ordering & Receiving", "Bills & Returns"],
          lessons: [
            {
              id: "purch-overview",
              title: "Purchases Module — Overview & navigation",
              type: "video",
              category: "Getting Started",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary: "How the purchasing workflow fits together in Cin7.",
              tags: ["overview", "getting started"]
            },
            {
              id: "purch-create-po",
              title: "SOP: Raise a purchase order",
              type: "article",
              category: "Ordering & Receiving",
              duration: "5 min read",
              summary: "Order stock from a supplier.",
              tags: ["purchase order", "core task"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "heading", text: "Steps" },
                  { type: "steps", items: [
                    "Go to Purchases and click New Purchase.",
                    "Select the Supplier.",
                    "Confirm the delivery Location where stock will be received.",
                    "Add products by SKU or name and enter the quantities to order.",
                    "Check the supplier unit cost on each line.",
                    "Confirm expected delivery date and any freight costs.",
                    "Click Authorise to send the PO for approval / to the supplier."
                  ]},
                  { type: "callout", style: "tip", text: "Use the reorder / low-stock report to decide what needs ordering before raising the PO." },
                  { type: "callout", style: "warning", text: "Match the supplier's currency and unit of measure — a mismatch here throws off your landed cost." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "purch-receive-stock",
              title: "SOP: Receive stock against a purchase order",
              type: "article",
              category: "Ordering & Receiving",
              duration: "4 min read",
              summary: "Book in goods when a delivery arrives.",
              tags: ["receiving", "goods in"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Open the relevant purchase order in the Purchases module.",
                    "Go to the Stock Received tab.",
                    "Enter the quantity actually received for each line (not just what was ordered).",
                    "Note any shortages, damages or over-deliveries.",
                    "Authorise the stock receipt to add the items into inventory."
                  ]},
                  { type: "callout", style: "info", text: "Stock only becomes available to sell once the receipt is authorised." },
                  { type: "callout", style: "warning", text: "Count before you confirm. Booking in quantities you didn't actually receive causes stock discrepancies later." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "purch-supplier-bill",
              title: "Enter and match a supplier bill",
              type: "video",
              category: "Bills & Returns",
              duration: "6 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "Record the supplier invoice and match it to the PO.",
              tags: ["bills", "finance"]
            },
            {
              id: "purch-return-supplier",
              title: "SOP: Return stock to a supplier",
              type: "article",
              category: "Bills & Returns",
              duration: "3 min read",
              summary: "Send faulty or incorrect goods back to the supplier.",
              tags: ["returns", "supplier"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Open the original purchase order.",
                    "Choose Credit / Return.",
                    "Enter the quantities being returned.",
                    "Record the reason (faulty, wrong item, over-supply).",
                    "Authorise the return so stock is removed from inventory."
                  ]}
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            }
          ]
        },

        /* ================= INVENTORY MODULE ================= */
        {
          id: "inventory",
          name: "Inventory Module",
          icon: "inventory",
          summary:
            "Stock levels, adjustments, transfers between locations and stocktakes.",
          categories: ["Getting Started", "Stock Management", "Counting & Stocktakes"],
          lessons: [
            {
              id: "inv-overview",
              title: "Inventory Module — Overview & navigation",
              type: "video",
              category: "Getting Started",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary: "Understand stock on hand, available and allocated quantities.",
              tags: ["overview", "getting started"]
            },
            {
              id: "inv-check-levels",
              title: "SOP: Check stock levels for a product",
              type: "article",
              category: "Stock Management",
              duration: "3 min read",
              summary: "See how much of an item you have and where.",
              tags: ["stock levels", "core task"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Go to Inventory and search for the product by SKU or name.",
                    "Open the product to view On Hand, Available and Allocated quantities.",
                    "Switch the Location filter to see stock across different warehouses."
                  ]},
                  { type: "callout", style: "info", text: "Available = On Hand minus what's already allocated to open orders. Always sell against Available, not On Hand." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "inv-adjustment",
              title: "SOP: Make a stock adjustment",
              type: "article",
              category: "Stock Management",
              duration: "4 min read",
              summary: "Correct a stock quantity (damage, loss, found stock).",
              tags: ["adjustment", "corrections"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Go to Inventory and choose Stock Adjustment.",
                    "Select the Location being adjusted.",
                    "Add the product line(s).",
                    "Enter the new counted quantity or the +/- change.",
                    "Select the reason account (e.g. damage, shrinkage).",
                    "Add a note explaining the adjustment, then Authorise."
                  ]},
                  { type: "callout", style: "warning", text: "Adjustments change your stock value. Always record a clear reason so finance can reconcile it." }
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "inv-transfer",
              title: "SOP: Transfer stock between locations",
              type: "article",
              category: "Stock Management",
              duration: "3 min read",
              summary: "Move inventory from one warehouse/location to another.",
              tags: ["transfer", "locations"],
              variants: [
                { label: "Standard (Cin7)", body: [
                  { type: "steps", items: [
                    "Go to Inventory and choose Stock Transfer.",
                    "Set the From location and the To location.",
                    "Add the products and quantities being moved.",
                    "Authorise the transfer to mark stock as in transit.",
                    "Complete the transfer when the stock arrives at the destination."
                  ]}
                ]},
                { label: "KIKO tailored", body: KIKO_TODO }
              ]
            },
            {
              id: "inv-stocktake",
              title: "Run a stocktake",
              type: "video",
              category: "Counting & Stocktakes",
              duration: "9 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "The full stocktake process from count sheet to adjustment.",
              tags: ["stocktake", "counting"]
            }
          ]
        }
      ]
    },

    /* ============================================================
       B2B PORTAL — the wholesale / trade ordering portal.
       Add training for stockists and the internal team here.
       ============================================================ */
    {
      id: "b2b",
      name: "B2B Portal",
      tagline: "Wholesale & trade ordering",
      description:
        "Guides for using the Kiko Vitals B2B (wholesale) portal — how stockists set up their account, place and track orders, and manage pricing and payments.",
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
              duration: "4 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
              duration: "5 min",
              videoUrl: "https://vimeo.com/76979871",
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
     ------------------------------------------------------------------------
     • "concerns" are the filter groups (they become the Products dropdown).
     • Each item links to the live product page for up-to-date price & stock.
     • To add a product: copy an item block, set a unique id, the name, its
       concern, an image URL and the store link (handle).
     • Prices change often, so we link to the live page rather than hard-code
       them. Add a "price" field to any item if you want it shown on the card.
     ======================================================================== */
  products: {
    storeUrl: "https://kikovitals.com",
    concerns: ["Hormones", "Gut Health", "Menopause", "Period Care", "Hydration", "Bundles & Kits"],
    items: [
      {
        id: "hormone-balance",
        name: "Hormone Balance",
        concern: "Hormones",
        blurb: "Daily support for hormonal balance, PMS and radiant feminine wellbeing.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Hormone_Balance_bottle_-_Edited_400x400.png",
        url: "https://kikovitals.com/products/hormone-balance"
      },
      {
        id: "prebiotic-probiotic",
        name: "Prebiotic + Probiotic",
        concern: "Gut Health",
        blurb: "Advanced gut therapy to nourish, repair and support healthy digestion.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Prebiotic_Probiotic1_400x400.png",
        url: "https://kikovitals.com/products/prebiotic-probiotic"
      },
      {
        id: "kiko-bloat",
        name: "Kiko Bloat",
        concern: "Gut Health",
        blurb: "Targeted relief for bloating and everyday digestive comfort.",
        image: "",
        url: "https://kikovitals.com/products/kiko-bloat"
      },
      {
        id: "heal-your-gut-duo",
        name: "Heal Your Gut Duo",
        concern: "Gut Health",
        blurb: "A pairing designed to debloat and restore gut balance.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/heal-your-gut_8f7d30ef-0f27-438a-b2b0-1ac575166769_400x400.png",
        url: "https://kikovitals.com/products/heal-your-gut-duo"
      },
      {
        id: "menopause-balance",
        name: "Menopause Balance",
        concern: "Menopause",
        blurb: "Support through perimenopause and menopause symptoms.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Meno_d1d07fe4-7240-46a1-b979-c244f02521e7_400x400.png",
        url: "https://kikovitals.com/products/menopause-balance"
      },
      {
        id: "meno-radiance-trio",
        name: "Meno Radiance Trio",
        concern: "Menopause",
        blurb: "A three-step routine for radiance and balance through menopause.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/meno-trio_c50ffc25-0d2f-4835-8f54-0959ed1e4b79_400x400.png",
        url: "https://kikovitals.com/products/meno-radiance-trio"
      },
      {
        id: "moon-balm-period-pain-relief",
        name: "Moon Balm — Period Pain Relief",
        concern: "Period Care",
        blurb: "A soothing balm for natural period pain relief.",
        image: "",
        url: "https://kikovitals.com/products/moon-balm-period-pain-relief"
      },
      {
        id: "hydration-electrolytes",
        name: "Litchi Salt Hydration Electrolytes",
        concern: "Hydration",
        blurb: "Hydrate your way to hormonal balance with everyday electrolytes.",
        image: "",
        url: "https://kikovitals.com/products/hydration-electrolytes"
      },
      {
        id: "kiko-synergy-duo",
        name: "Kiko Synergy Duo",
        concern: "Bundles & Kits",
        blurb: "The core gut + hormone pairing for whole-body balance.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/Synergy-Duo_412c0dd4-d0bf-41a8-8ce7-9768f9f0e261_400x400.png",
        url: "https://kikovitals.com/products/kiko-synergy-duo"
      },
      {
        id: "kiko-trilogy",
        name: "Kiko Trilogy",
        concern: "Bundles & Kits",
        blurb: "A three-product set covering gut, hormones and daily wellness.",
        image: "https://cdn.shopify.com/s/files/1/0502/6260/5981/files/trio_15d31fc4-508e-4f0c-b447-ff9b6faddef6_400x400.png",
        url: "https://kikovitals.com/products/kiko-trilogy"
      },
      {
        id: "mother-daughter-duo",
        name: "Mother + Daughter Duo",
        concern: "Bundles & Kits",
        blurb: "A thoughtful pairing to support wellness across generations.",
        image: "",
        url: "https://kikovitals.com/products/mother-daughter-duo"
      },
      {
        id: "essentials-duo",
        name: "Essentials Duo",
        concern: "Bundles & Kits",
        blurb: "The everyday essentials pairing to get started with Kiko Vitals.",
        image: "",
        url: "https://kikovitals.com/products/essentials-duo"
      }
    ]
  },

  /* ========================================================================
     GUIDES — big reference documents (shown as their own sidebar section)
     ------------------------------------------------------------------------
     Two ways to provide a guide's content:
       1. embedUrl  — paste a link to the real document to show it inside the
                      site (a Google Doc "Publish to web" link, or a Drive/PDF
                      preview link). Leave "" to hide the embed.
       2. sections  — write the guide directly here. Each section becomes an
                      entry in the guide's table of contents and in the sidebar
                      dropdown. Uses the same body blocks as SOPs.
     You can use either one, or both (embed at the top, written notes below).
     ======================================================================== */
  guides: [
    {
      id: "ccfo-master",
      name: "CCFO Master Guide",
      icon: "book",
      subtitle: "The complete end-to-end Cin7 reference",
      description:
        "The Creative CFO master guide — a single reference that walks through every area of Cin7 from start to finish. Use the contents on the right to jump to a section.",

      // Paste the real master document link here to embed it (e.g. a Google Doc
      // published to the web, or a Drive/PDF preview link). Leave "" for none.
      embedUrl: "",

      sections: [
        {
          id: "intro",
          title: "About this guide",
          body: [
            { type: "paragraph", text: "This master guide brings together everything in the individual module SOPs into one continuous reference covering the full Cin7 workflow — from a customer enquiry all the way through to stock, purchasing and reconciliation." },
            { type: "callout", style: "info", text: "Tip: the module SOPs are the quick, task-by-task version. This guide is the big-picture, end-to-end version. To embed the full CCFO document itself, paste its link into 'embedUrl' in content.js." }
          ]
        },
        {
          id: "guide-sales",
          title: "Sales — end to end",
          body: [
            { type: "paragraph", text: "The full sales cycle in Cin7 and how each step affects stock and finance." },
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
              "Identify what to reorder (reorder report / low-stock alerts).",
              "Raise the purchase order to the supplier.",
              "Receive stock against the PO when it arrives.",
              "Enter and match the supplier bill.",
              "Handle any returns or credits with the supplier."
            ]},
            { type: "callout", style: "warning", text: "Landed costs (freight, duty) should be captured on the PO so product costs stay accurate." }
          ]
        },
        {
          id: "guide-inventory",
          title: "Inventory — end to end",
          body: [
            { type: "steps", items: [
              "Understand the stock figures: On Hand, Allocated and Available.",
              "Keep stock accurate with adjustments (damage, loss, found stock).",
              "Move stock between locations with transfers.",
              "Reconcile physical vs system counts with regular stocktakes."
            ]}
          ]
        },
        {
          id: "guide-finance",
          title: "Finance & reconciliation",
          body: [
            { type: "paragraph", text: "How Cin7 activity flows into the accounts and what to reconcile." },
            { type: "list", items: [
              "Sales invoices and customer payments.",
              "Supplier bills and payments.",
              "Stock-on-hand value vs the balance sheet.",
              "Cost of goods sold from shipped orders."
            ]},
            { type: "callout", style: "info", text: "Replace this section with KIKO's specific reconciliation checklist and month-end routine." }
          ]
        }
      ]
    }
  ]
};
