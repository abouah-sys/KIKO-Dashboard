/* ============================================================================
   KIKO KNOWLEDGE BASE — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to add or change content.
   No coding experience required — just follow the patterns below.

   HOW IT'S ORGANISED
     System  ->  Module  ->  Lesson
     (Cin7)      (Sales)     (a video or a written SOP)

   TO ADD A VIDEO LESSON, copy this block into a module's "lessons" list:
     {
       id: "unique-id-here",
       title: "How to raise a sales order",
       type: "video",
       duration: "6 min",
       // Paste a normal YouTube / Vimeo / Loom link. The site works it out.
       videoUrl: "https://www.youtube.com/watch?v=XXXXXXXX",
       summary: "Short one-line description shown in the list.",
       tags: ["sales order", "getting started"]
     },

   TO ADD A WRITTEN SOP LESSON, copy this block instead:
     {
       id: "unique-id-here",
       title: "SOP: Processing a customer return",
       type: "article",
       duration: "4 min read",
       summary: "Step-by-step for handling returns.",
       tags: ["returns"],
       body: [
         { type: "heading", text: "Before you start" },
         { type: "paragraph", text: "Make sure you have the original order number." },
         { type: "steps", items: [
             "Open the Sales module.",
             "Search for the original order.",
             "Click Actions > Credit Note."
         ]},
         { type: "callout", style: "tip", text: "Always confirm the reason for return." }
       ]
     },

   Body block types you can use inside an article:
     { type: "heading",   text: "..." }
     { type: "paragraph", text: "..." }
     { type: "steps",     items: ["step 1", "step 2", ...] }   // numbered
     { type: "list",      items: ["point 1", "point 2", ...] } // bulleted
     { type: "callout",   style: "tip" | "warning" | "info", text: "..." }
     { type: "video",     videoUrl: "https://..." }            // embed inside an article

   TIP: You can also attach a document link to any lesson with:
     resources: [ { label: "Download the checklist (PDF)", url: "https://..." } ]
   ========================================================================== */

const KB_CONTENT = {
  systems: [
    {
      id: "cin7",
      name: "Cin7",
      tagline: "Inventory & order management",
      description:
        "Cin7 is KIKO's core inventory and order management system. Use the guides below to learn each module step by step. Start with the Sales module if you're new.",
      modules: [
        /* ================= SALES MODULE ================= */
        {
          id: "sales",
          name: "Sales Module",
          icon: "sales",
          summary:
            "Quotes, sales orders, picking, packing, invoicing and customer returns.",
          lessons: [
            {
              id: "sales-overview",
              title: "Sales Module — Overview & navigation",
              type: "video",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary:
                "A tour of the Sales module: where everything lives and the order lifecycle.",
              tags: ["overview", "getting started"]
            },
            {
              id: "sales-create-order",
              title: "SOP: Create a new sales order",
              type: "article",
              duration: "5 min read",
              summary: "Raise a sales order from scratch for a customer.",
              tags: ["sales order", "core task"],
              body: [
                { type: "paragraph", text: "Use this process every time a customer places an order that needs to be fulfilled from stock." },
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
              ]
            },
            {
              id: "sales-quote-to-order",
              title: "SOP: Convert a quote into a sales order",
              type: "article",
              duration: "3 min read",
              summary: "Turn an accepted quote into a live order without re-keying.",
              tags: ["quotes", "sales order"],
              body: [
                { type: "steps", items: [
                  "Open the Sales module and find the quote under the Quote tab.",
                  "Confirm the customer has accepted the quote in writing.",
                  "Open the quote and click Copy to Sale (or Convert).",
                  "Review the copied lines, quantities and prices.",
                  "Authorise the new sale to begin fulfilment."
                ]},
                { type: "callout", style: "info", text: "Converting keeps a link between the quote and the order for your audit trail." }
              ]
            },
            {
              id: "sales-pick-pack-ship",
              title: "Pick, pack & ship an order",
              type: "video",
              duration: "8 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "The fulfilment workflow from picking through to dispatch.",
              tags: ["fulfilment", "shipping"]
            },
            {
              id: "sales-invoice",
              title: "SOP: Raise and send an invoice",
              type: "article",
              duration: "4 min read",
              summary: "Generate the customer invoice and send it out.",
              tags: ["invoicing", "finance"],
              body: [
                { type: "steps", items: [
                  "Open the authorised sale.",
                  "Go to the Invoice tab.",
                  "Confirm the quantities being invoiced match what was shipped.",
                  "Click Authorise on the invoice.",
                  "Use Email to send the invoice PDF to the customer, or Export to save it."
                ]},
                { type: "callout", style: "tip", text: "If you invoice in stages, set the quantity on each line to only what's being billed now." }
              ]
            },
            {
              id: "sales-returns",
              title: "SOP: Process a customer return (credit note)",
              type: "article",
              duration: "4 min read",
              summary: "Handle returned goods and issue a credit note.",
              tags: ["returns", "credit note"],
              body: [
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
          lessons: [
            {
              id: "purch-overview",
              title: "Purchases Module — Overview & navigation",
              type: "video",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary: "How the purchasing workflow fits together in Cin7.",
              tags: ["overview", "getting started"]
            },
            {
              id: "purch-create-po",
              title: "SOP: Raise a purchase order",
              type: "article",
              duration: "5 min read",
              summary: "Order stock from a supplier.",
              tags: ["purchase order", "core task"],
              body: [
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
              ]
            },
            {
              id: "purch-receive-stock",
              title: "SOP: Receive stock against a purchase order",
              type: "article",
              duration: "4 min read",
              summary: "Book in goods when a delivery arrives.",
              tags: ["receiving", "goods in"],
              body: [
                { type: "steps", items: [
                  "Open the relevant purchase order in the Purchases module.",
                  "Go to the Stock Received tab.",
                  "Enter the quantity actually received for each line (not just what was ordered).",
                  "Note any shortages, damages or over-deliveries.",
                  "Authorise the stock receipt to add the items into inventory."
                ]},
                { type: "callout", style: "info", text: "Stock only becomes available to sell once the receipt is authorised." },
                { type: "callout", style: "warning", text: "Count before you confirm. Booking in quantities you didn't actually receive causes stock discrepancies later." }
              ]
            },
            {
              id: "purch-supplier-bill",
              title: "Enter and match a supplier bill",
              type: "video",
              duration: "6 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "Record the supplier invoice and match it to the PO.",
              tags: ["bills", "finance"]
            },
            {
              id: "purch-return-supplier",
              title: "SOP: Return stock to a supplier",
              type: "article",
              duration: "3 min read",
              summary: "Send faulty or incorrect goods back to the supplier.",
              tags: ["returns", "supplier"],
              body: [
                { type: "steps", items: [
                  "Open the original purchase order.",
                  "Choose Credit / Return.",
                  "Enter the quantities being returned.",
                  "Record the reason (faulty, wrong item, over-supply).",
                  "Authorise the return so stock is removed from inventory."
                ]}
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
          lessons: [
            {
              id: "inv-overview",
              title: "Inventory Module — Overview & navigation",
              type: "video",
              duration: "5 min",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              summary: "Understand stock on hand, available and allocated quantities.",
              tags: ["overview", "getting started"]
            },
            {
              id: "inv-check-levels",
              title: "SOP: Check stock levels for a product",
              type: "article",
              duration: "3 min read",
              summary: "See how much of an item you have and where.",
              tags: ["stock levels", "core task"],
              body: [
                { type: "steps", items: [
                  "Go to Inventory and search for the product by SKU or name.",
                  "Open the product to view On Hand, Available and Allocated quantities.",
                  "Switch the Location filter to see stock across different warehouses.",
                ]},
                { type: "callout", style: "info", text: "Available = On Hand minus what's already allocated to open orders. Always sell against Available, not On Hand." }
              ]
            },
            {
              id: "inv-adjustment",
              title: "SOP: Make a stock adjustment",
              type: "article",
              duration: "4 min read",
              summary: "Correct a stock quantity (damage, loss, found stock).",
              tags: ["adjustment", "corrections"],
              body: [
                { type: "steps", items: [
                  "Go to Inventory and choose Stock Adjustment.",
                  "Select the Location being adjusted.",
                  "Add the product line(s).",
                  "Enter the new counted quantity or the +/- change.",
                  "Select the reason account (e.g. damage, shrinkage).",
                  "Add a note explaining the adjustment, then Authorise."
                ]},
                { type: "callout", style: "warning", text: "Adjustments change your stock value. Always record a clear reason so finance can reconcile it." }
              ]
            },
            {
              id: "inv-transfer",
              title: "SOP: Transfer stock between locations",
              type: "article",
              duration: "3 min read",
              summary: "Move inventory from one warehouse/location to another.",
              tags: ["transfer", "locations"],
              body: [
                { type: "steps", items: [
                  "Go to Inventory and choose Stock Transfer.",
                  "Set the From location and the To location.",
                  "Add the products and quantities being moved.",
                  "Authorise the transfer to mark stock as in transit.",
                  "Complete the transfer when the stock arrives at the destination."
                ]}
              ]
            },
            {
              id: "inv-stocktake",
              title: "Run a stocktake",
              type: "video",
              duration: "9 min",
              videoUrl: "https://vimeo.com/76979871",
              summary: "The full stocktake process from count sheet to adjustment.",
              tags: ["stocktake", "counting"]
            }
          ]
        }
      ]
    }
  ]
};
