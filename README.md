# KIKO Knowledge Base

An internal knowledge base where KIKO employees can sign in with a shared team
password and watch training **videos** and read **SOPs**, organised by system
and module. It currently covers **Cin7** with the **Sales**, **Purchases**, and
**Inventory** modules.

It's a plain static website — no servers, no databases, no build step. That
makes it free to host and dead simple to maintain.

---

## 📁 What's in here

| File | What it's for |
| --- | --- |
| `index.html` | The site itself. You don't need to edit this. |
| `assets/js/content.js` | **All the videos & SOPs live here.** This is the file you edit to add content. |
| `assets/js/config.js` | Team password + branding settings. |
| `assets/js/app.js` | The app logic. You shouldn't need to touch this. |
| `assets/css/styles.css` | Styling. |
| `set-password.html` | A little helper page for changing the password. |
| `netlify.toml` | Optional hosting settings. |

---

## 🚀 Getting it online (recommended: Netlify — free)

You don't need any technical tools. The easiest path:

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag the whole `KIKO-Dashboard` folder onto the page.
3. Netlify gives you a live URL (e.g. `kiko-kb.netlify.app`) in a few seconds.
4. (Optional) Sign up for a free Netlify account to keep the site, set a nicer
   name, or add a custom domain.

**Even easier for ongoing updates:** connect Netlify to this GitHub repository
(Netlify → *Add new site* → *Import from Git*). After that, every time you
change content and push to GitHub, the site updates itself automatically.

> Other free hosts work too — Vercel, Cloudflare Pages, or GitHub Pages. Any
> static host is fine. Just upload the whole folder.

---

## 🔑 The password

- The **starter password is `kiko2024`**. Please change it before sharing.
- Passwords are stored as a scrambled "hash", never as plain text, so nobody can
  read the password out of the code.

**To change it:**

1. Open `set-password.html` in your browser (double-click it, or open it on the
   live site at `your-site-url/set-password.html`).
2. Type your new password and click **Generate**.
3. Click **Copy to clipboard**.
4. Open `assets/js/config.js` and paste it as the value of `PASSWORD_HASH`
   (keep the quotes).
5. Save and re-deploy (or push to GitHub if you connected it).

> **A note on security:** this is a *shared-password gate* suitable for internal
> training material — it keeps casual/public visitors out. It is not bank-grade
> security, and anyone with the password (or the deployed files) can view the
> content. Don't put confidential data (customer records, credentials, financials)
> in here. If you later need per-person logins or truly private content, that
> requires a backend — ask and we can build it.

---

## ✏️ Adding or editing content

Open **`assets/js/content.js`**. It's written in plain, commented English at the
top with copy-paste templates. The structure is:

```
System (Cin7, B2B Portal)
 └─ Module (Sales / Purchases / Inventory / …)
     └─ Category (Getting Started / Daily Tasks / …)   ← the sidebar dropdowns
         └─ Lesson (a video OR a written SOP)

Products (the Kiko Vitals catalogue)
 └─ grouped by concern (Hormones, Gut Health, Menopause, …)

Guides
 └─ CCFO Master Guide
     └─ Sections (Sales end-to-end, Purchases…, etc.)
```

### Adding another system (like the B2B Portal)
The `systems` list in `content.js` can hold as many systems as you like — Cin7
and the B2B Portal are just two entries. Copy a whole system block, give it a new
`id`, `name` and modules, and it automatically appears in the sidebar and home
page.

### The product list
The Kiko Vitals catalogue lives in the `products` block of `content.js`. Each
product has a `name`, a `concern` (which becomes the Products dropdown groups),
an optional `image`, and a `url` linking to the live product page. Prices change
often, so cards link to the store for current pricing — add a `price:` field to
any product if you'd rather show it. (If you'd like, the store's live products
and prices can be pulled in automatically from Shopify instead of listing them
by hand — just ask.)

### Categories (the dropdown groups)
Each module has a `categories` list — these are the collapsible groups shown
under the module in the sidebar. Every lesson has a `category:` that matches one
of them. To add a group, add its name to `categories` and tag lessons with it.

### SOPs with two versions (Standard + KIKO tailored)
An SOP can show two tabs — the generic **Standard (Cin7)** method and **KIKO's
tailored** process — using `variants` instead of `body`. Every SOP in the
starter content already has a "KIKO tailored" tab with a placeholder; just
replace the placeholder steps with KIKO's real process. A lesson with a KIKO tab
shows a small **KIKO** badge in the lists.

### CCFO Master Guide
The big end-to-end reference lives in the `guides` section of `content.js`. You
can either **write it in sections** (each becomes a table-of-contents entry) or
**embed the real document** — paste a Google Doc "Publish to web" link, or a
Drive/PDF preview link, into the guide's `embedUrl`. You can use both together.

### Linking the training videos
Several video lessons (Simple Sales, Advanced Sales, Logging Returns, the
Purchasing and Inventory videos, etc.) are already set up but not yet linked —
they show a tidy "to be added" note. To link one, open the lesson in
`content.js` and set its `videoUrl` to the share link.

> **Google Drive videos:** set the file's sharing to **"Anyone with the link —
> Viewer"** in Drive, or employees won't be able to play it. If you'd rather not
> make them link-shareable, upload them to YouTube (unlisted) or Vimeo instead.
> Paste any of those links and the site embeds them automatically.

### Add a video
Copy a video block into a module's `lessons` list and paste a normal
**YouTube, Vimeo, Loom, or Google Drive** share link — the site turns it into an
embedded player automatically:

```js
{
  id: "sales-new-video",
  title: "How to apply a discount",
  type: "video",
  duration: "4 min",
  videoUrl: "https://www.loom.com/share/XXXXXXXX",
  summary: "Applying line and order-level discounts.",
  tags: ["discounts"]
},
```

### Add a written SOP
```js
{
  id: "sales-new-sop",
  title: "SOP: Something new",
  type: "article",
  duration: "3 min read",
  summary: "What this SOP covers.",
  body: [
    { type: "paragraph", text: "Intro sentence." },
    { type: "steps", items: ["Step one", "Step two"] },
    { type: "callout", style: "tip", text: "A helpful tip." }
  ]
},
```

Full list of building blocks and an "attach a document" option are documented at
the top of `content.js`.

### Add a whole new module or system
Copy an existing module block (with its `id`, `name`, `icon`, `summary`,
`lessons`). Available icons: `sales`, `purchases`, `inventory` (defaults to a
document icon otherwise).

---

## 👀 Previewing changes on your computer

Because browsers restrict the login feature when opening files directly, run a
tiny local preview server from inside the `KIKO-Dashboard` folder:

```bash
# If you have Python (most Macs do):
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser. Sign in with `kiko2024`.

---

## Branding

The site uses the Kiko Vitals palette (sand `#d4bda5`, ink `#1d1d1d`, cream
`#f9f6f1`) and fonts (Shippori Mincho for headings, Newsreader for the logo).
All colours are defined once at the top of `assets/css/styles.css` in the
`:root` block — change them there and the whole site updates.

## Features

- 🔒 Shared-password sign-in (hashed, not plain text)
- 🎨 Kiko Vitals brand colours & typography, with automatic dark mode
- 🛍️ Product catalogue grouped by concern, linking to the live store
- 🏢 Multiple systems (Cin7 + B2B Portal), each with its own modules
- 📊 Reporting module: the monthly Cin7 × Xero audit, key reports & 13 health checks
- 🗂️ Collapsible module dropdowns with your own custom categories
- 🔀 SOPs with two tabs: Standard (Cin7) method + KIKO-tailored process
- 📖 CCFO Master Guide with table of contents (write it in, or embed the real doc)
- 📺 Auto-embedding of YouTube / Vimeo / Loom / Google Drive videos
- 📄 Rich SOPs with numbered steps, tips, warnings and attachments
- 🔎 Instant search across every video, SOP and guide section
- 📱 Works on phones, tablets and desktops
- 🌗 Automatic light & dark mode
