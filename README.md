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
System (Cin7)
 └─ Module (Sales / Purchases / Inventory)
     └─ Lesson (a video OR a written SOP)
```

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

## Features

- 🔒 Shared-password sign-in (hashed, not plain text)
- 📺 Auto-embedding of YouTube / Vimeo / Loom / Google Drive videos
- 📄 Rich SOPs with numbered steps, tips, warnings and attachments
- 🔎 Instant search across every video and SOP
- 📱 Works on phones, tablets and desktops
- 🌗 Automatic light & dark mode
