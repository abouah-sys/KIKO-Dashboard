/* ============================================================================
   KIKO KNOWLEDGE BASE — APP LOGIC
   You should not need to edit this file. Content lives in content.js and
   settings live in config.js.
   ========================================================================== */
(function () {
  "use strict";

  const AUTH_KEY = "kiko_kb_auth";

  /* ---------------------------------------------------------------- helpers */
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    children.flat().forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /* ------------------------------------------------------------------ icons */
  const ICONS = {
    sales:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    purchases:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    inventory:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V21H3V8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
    book:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    portal:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    tag:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    report:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7"/><rect x="12" y="6" width="3" height="11"/><rect x="17" y="13" width="3" height="4"/></svg>',
    external:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    home:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    chevron:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    video:      '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>',
    article:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    clock:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    empty:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    link:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
  };

  /* -------------------------------------------------------- video embedding */
  function toEmbedUrl(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (host === "youtube.com" || host === "m.youtube.com") {
        const id = u.searchParams.get("v");
        if (id) return "https://www.youtube.com/embed/" + id;
        if (u.pathname.startsWith("/embed/")) return url;
        if (u.pathname.startsWith("/shorts/")) return "https://www.youtube.com/embed/" + u.pathname.split("/")[2];
      }
      if (host === "youtu.be") return "https://www.youtube.com/embed/" + u.pathname.slice(1);
      if (host === "vimeo.com") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        if (id) return "https://player.vimeo.com/video/" + id;
      }
      if (host === "player.vimeo.com") return url;
      if (host === "loom.com" || host.endsWith(".loom.com")) {
        const id = u.pathname.split("/").filter(Boolean).pop();
        if (id) return "https://www.loom.com/embed/" + id;
      }
      if (host === "drive.google.com") {
        const m = u.pathname.match(/\/file\/d\/([^/]+)/);
        if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
      }
      return url;
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------- data model */
  const systems = (typeof KB_CONTENT !== "undefined" && KB_CONTENT.systems) || [];
  const guides = (typeof KB_CONTENT !== "undefined" && KB_CONTENT.guides) || [];
  const catalogue = (typeof KB_CONTENT !== "undefined" && KB_CONTENT.products) || null;

  function productConcerns() {
    if (!catalogue) return [];
    if (catalogue.concerns && catalogue.concerns.length) return catalogue.concerns.slice();
    const seen = [];
    (catalogue.items || []).forEach((p) => { if (p.concern && !seen.includes(p.concern)) seen.push(p.concern); });
    return seen;
  }
  function productsByConcern(concernId) {
    const items = (catalogue && catalogue.items) || [];
    if (!concernId) return items;
    return items.filter((p) => slug(p.concern) === concernId);
  }

  function moduleGroups(mod) {
    // Returns [{ id, name, lessons: [] }] in the module's defined category order.
    const defined = (mod.categories && mod.categories.length) ? mod.categories : null;
    const map = new Map();
    const order = [];
    const ensure = (name) => {
      const id = slug(name) || "general";
      if (!map.has(id)) { map.set(id, { id, name, lessons: [] }); order.push(id); }
      return map.get(id);
    };
    if (defined) defined.forEach(ensure);
    const fallback = defined ? defined[0] : "Lessons";
    mod.lessons.forEach((l) => {
      const name = (l.category && (!defined || defined.includes(l.category))) ? l.category : fallback;
      ensure(name).lessons.push(l);
    });
    return order.map((id) => map.get(id)).filter((g) => g.lessons.length);
  }

  function allLessons() {
    const out = [];
    systems.forEach((s) =>
      s.modules.forEach((m) =>
        m.lessons.forEach((l) => out.push({ system: s, module: m, lesson: l }))
      )
    );
    return out;
  }
  function findModule(sysId, modId) {
    const s = systems.find((x) => x.id === sysId);
    if (!s) return null;
    const m = s.modules.find((x) => x.id === modId);
    return m ? { system: s, module: m } : null;
  }
  function findLesson(sysId, modId, lessonId) {
    const ctx = findModule(sysId, modId);
    if (!ctx) return null;
    const lesson = ctx.module.lessons.find((x) => x.id === lessonId);
    return lesson ? { ...ctx, lesson } : null;
  }
  function findGuide(id) { return guides.find((g) => g.id === id) || null; }

  /* =============================================================== ROUTER */
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (parts[0] === "search") return { view: "search", q: decodeURIComponent(parts[1] || "") };
    if (parts[0] === "products") return { view: "products", concern: parts[1] === "c" ? parts[2] : null };
    if (parts[0] === "guide") return { view: "guide", guide: parts[1], section: parts[2] === "s" ? parts[3] : null };
    if (parts.length === 0) return { view: "home" };
    if (parts.length === 2) return { view: "module", sys: parts[0], mod: parts[1] };
    if (parts.length === 4 && parts[2] === "c") return { view: "module", sys: parts[0], mod: parts[1], cat: parts[3] };
    if (parts.length === 3) return { view: "lesson", sys: parts[0], mod: parts[1], lesson: parts[2] };
    return { view: "home" };
  }
  function navigate(hash) { location.hash = hash; }

  /* =============================================================== RENDER */
  const content = () => $("#content");
  const expanded = new Set();       // which module/guide nodes are open in the sidebar

  function render() {
    const route = parseHash();
    // Auto-expand the node we're inside.
    if (route.view === "module") expanded.add("mod:" + route.sys + "/" + route.mod);
    if (route.view === "lesson") expanded.add("mod:" + route.sys + "/" + route.mod);
    if (route.view === "guide") expanded.add("guide:" + route.guide);
    closeSidebar();
    renderSidebar(route);
    window.scrollTo(0, 0);
    if (route.view === "products") expanded.add("products");
    if (route.view === "home") return renderHome();
    if (route.view === "module") return renderModule(route);
    if (route.view === "lesson") return renderLesson(route);
    if (route.view === "guide") return renderGuide(route);
    if (route.view === "products") return renderProducts(route);
    if (route.view === "search") return renderSearch(route.q);
  }

  /* -------- sidebar -------- */
  function renderSidebar(route) {
    const nav = $("#sidebar-nav");
    nav.innerHTML = "";

    // Home (once, at the top)
    nav.appendChild(
      el("button",
        { class: "nav-item" + (route.view === "home" ? " active" : ""),
          onClick: () => navigate("#/") },
        el("span", { class: "nav-icon", html: ICONS.home }),
        "Home"
      )
    );

    systems.forEach((s) => {
      nav.appendChild(el("div", { class: "nav-section-title" }, s.name));

      s.modules.forEach((m) => {
        const key = "mod:" + s.id + "/" + m.id;
        const isOpen = expanded.has(key);
        const onThisModule = route.sys === s.id && route.mod === m.id;
        const groups = moduleGroups(m);

        const row = el("button",
          { class: "nav-item nav-parent" + (onThisModule && route.view === "module" && !route.cat ? " active" : ""),
            onClick: () => { expanded.add(key); navigate(`#/${s.id}/${m.id}`); } },
          el("span",
            { class: "nav-caret" + (isOpen ? " open" : ""), html: ICONS.chevron, title: "Expand / collapse",
              onClick: (e) => { e.stopPropagation(); if (isOpen) expanded.delete(key); else expanded.add(key); renderSidebar(parseHash()); } }),
          el("span", { class: "nav-icon", html: ICONS[m.icon] || ICONS.article }),
          el("span", { class: "nav-label" }, m.name),
          el("span", { class: "nav-count" }, String(m.lessons.length))
        );
        nav.appendChild(row);

        if (isOpen && groups.length) {
          const sub = el("div", { class: "nav-sub" });
          groups.forEach((g) => {
            const active = onThisModule && route.cat === g.id;
            sub.appendChild(
              el("button",
                { class: "nav-subitem" + (active ? " active" : ""),
                  onClick: () => navigate(`#/${s.id}/${m.id}/c/${g.id}`) },
                el("span", { class: "nav-dot" }),
                el("span", { class: "nav-label" }, g.name),
                el("span", { class: "nav-count subtle" }, String(g.lessons.length))
              )
            );
          });
          nav.appendChild(sub);
        }
      });
    });

    // Catalogue / Products section
    if (catalogue && (catalogue.items || []).length) {
      nav.appendChild(el("div", { class: "nav-section-title" }, "Catalogue"));
      const key = "products";
      const isOpen = expanded.has(key);
      const concerns = productConcerns();
      const row = el("button",
        { class: "nav-item nav-parent" + (route.view === "products" && !route.concern ? " active" : ""),
          onClick: () => { expanded.add(key); navigate("#/products"); } },
        el("span",
          { class: "nav-caret" + (isOpen ? " open" : ""), html: ICONS.chevron,
            onClick: (e) => { e.stopPropagation(); if (isOpen) expanded.delete(key); else expanded.add(key); renderSidebar(parseHash()); } }),
        el("span", { class: "nav-icon", html: ICONS.tag }),
        el("span", { class: "nav-label" }, "Products"),
        el("span", { class: "nav-count" }, String((catalogue.items || []).length))
      );
      nav.appendChild(row);
      if (isOpen && concerns.length) {
        const sub = el("div", { class: "nav-sub" });
        concerns.forEach((cn) => {
          const cid = slug(cn);
          const active = route.view === "products" && route.concern === cid;
          const count = productsByConcern(cid).length;
          if (!count) return;
          sub.appendChild(
            el("button",
              { class: "nav-subitem" + (active ? " active" : ""),
                onClick: () => navigate(`#/products/c/${cid}`) },
              el("span", { class: "nav-dot" }),
              el("span", { class: "nav-label" }, cn),
              el("span", { class: "nav-count subtle" }, String(count))
            )
          );
        });
        nav.appendChild(sub);
      }
    }

    // Guides section
    if (guides.length) {
      nav.appendChild(el("div", { class: "nav-section-title" }, "Guides"));
      guides.forEach((g) => {
        const key = "guide:" + g.id;
        const isOpen = expanded.has(key);
        const onThis = route.view === "guide" && route.guide === g.id;
        const secs = g.sections || [];

        const row = el("button",
          { class: "nav-item nav-parent" + (onThis && !route.section ? " active" : ""),
            onClick: () => { expanded.add(key); navigate(`#/guide/${g.id}`); } },
          el("span",
            { class: "nav-caret" + (isOpen ? " open" : ""), html: ICONS.chevron,
              onClick: (e) => { e.stopPropagation(); if (isOpen) expanded.delete(key); else expanded.add(key); renderSidebar(parseHash()); } }),
          el("span", { class: "nav-icon", html: ICONS[g.icon] || ICONS.book }),
          el("span", { class: "nav-label" }, g.name)
        );
        nav.appendChild(row);

        if (isOpen && secs.length) {
          const sub = el("div", { class: "nav-sub" });
          secs.forEach((sec) => {
            const active = onThis && route.section === sec.id;
            sub.appendChild(
              el("button",
                { class: "nav-subitem" + (active ? " active" : ""),
                  onClick: () => navigate(`#/guide/${g.id}/s/${sec.id}`) },
                el("span", { class: "nav-dot" }),
                el("span", { class: "nav-label" }, sec.title)
              )
            );
          });
          nav.appendChild(sub);
        }
      });
    }
  }

  /* -------- home -------- */
  function renderHome() {
    const c = content();
    c.innerHTML = "";
    if (!systems.length) { c.appendChild(emptyState("No content yet", "Add content in assets/js/content.js")); return; }

    c.appendChild(
      el("div", { class: "hero" },
        el("span", { class: "hero-tag" }, "Team Knowledge Base"),
        el("h1", {}, `Welcome to the ${KB_CONFIG.brandName} Knowledge Base`),
        el("p", {}, "Training videos, step-by-step SOPs and product know-how for the Kiko Vitals team — all in one place. Pick a system below to get started.")
      )
    );

    // Each system's modules
    systems.forEach((sys) => {
      c.appendChild(el("div", { class: "section-heading" }, `${sys.name} · Modules`));
      const grid = el("div", { class: "card-grid" });
      sys.modules.forEach((m) => {
        const videos = m.lessons.filter((l) => l.type === "video").length;
        const articles = m.lessons.filter((l) => l.type === "article").length;
        grid.appendChild(
          el("div",
            { class: "module-card", role: "button", tabindex: "0",
              onClick: () => navigate(`#/${sys.id}/${m.id}`) },
            el("div", { class: "card-icon", html: ICONS[m.icon] || ICONS.article }),
            el("h3", {}, m.name),
            el("p", {}, m.summary || ""),
            el("div", { class: "card-meta" },
              el("span", { html: ICONS.video + `<span>${videos} video${videos === 1 ? "" : "s"}</span>` }),
              el("span", { html: ICONS.article + `<span>${articles} SOP${articles === 1 ? "" : "s"}</span>` })
            )
          )
        );
      });
      c.appendChild(grid);
    });

    // Products preview
    if (catalogue && (catalogue.items || []).length) {
      const header = el("div", { class: "section-heading section-heading-row", style: "margin-top:34px" },
        el("span", {}, "Products"),
        el("a", { class: "section-link", onClick: () => navigate("#/products") }, "View all products →"));
      c.appendChild(header);
      const grid = el("div", { class: "product-grid" });
      catalogue.items.slice(0, 4).forEach((p) => grid.appendChild(productCard(p)));
      c.appendChild(grid);
    }

    // Guides
    if (guides.length) {
      c.appendChild(el("div", { class: "section-heading", style: "margin-top:34px" }, "Guides"));
      const gg = el("div", { class: "card-grid" });
      guides.forEach((g) => {
        gg.appendChild(
          el("div",
            { class: "module-card", role: "button", tabindex: "0",
              onClick: () => navigate(`#/guide/${g.id}`) },
            el("div", { class: "card-icon", html: ICONS[g.icon] || ICONS.book }),
            el("h3", {}, g.name),
            el("p", {}, g.subtitle || g.description || ""),
            el("div", { class: "card-meta" },
              el("span", { html: ICONS.book + `<span>${(g.sections || []).length} sections</span>` })
            )
          )
        );
      });
      c.appendChild(gg);
    }
  }

  /* -------- products -------- */
  function productCard(p) {
    const media = p.image
      ? el("div", { class: "product-media" }, el("img", { src: p.image, alt: p.name, loading: "lazy" }))
      : el("div", { class: "product-media product-media-empty" }, el("span", {}, (p.name || "?").charAt(0)));
    return el("a",
      { class: "product-card", href: p.url || "#", target: p.url ? "_blank" : null, rel: "noopener" },
      media,
      el("div", { class: "product-body" },
        p.concern ? el("span", { class: "product-concern" }, p.concern) : null,
        el("h3", {}, p.name),
        p.blurb ? el("p", {}, p.blurb) : null,
        el("div", { class: "product-foot" },
          p.price ? el("span", { class: "product-price" }, p.price) : null,
          el("span", { class: "product-view", html: "View product " + ICONS.external })
        )
      )
    );
  }

  function renderProducts(route) {
    const c = content();
    c.innerHTML = "";
    if (!catalogue || !(catalogue.items || []).length) { c.appendChild(emptyState("No products yet", "Add products in assets/js/content.js")); return; }

    c.appendChild(el("h1", { class: "page-title" }, "Products"));
    c.appendChild(el("p", { class: "page-subtitle" }, "The Kiko Vitals range for staff reference. Click any product to open its page on the store for current pricing and details."));

    // Concern filter chips
    const concerns = productConcerns();
    const chips = el("div", { class: "chip-row" });
    chips.appendChild(el("button",
      { class: "chip" + (!route.concern ? " active" : ""), onClick: () => navigate("#/products") }, "All"));
    concerns.forEach((cn) => {
      const cid = slug(cn);
      if (!productsByConcern(cid).length) return;
      chips.appendChild(el("button",
        { class: "chip" + (route.concern === cid ? " active" : ""), onClick: () => navigate(`#/products/c/${cid}`) }, cn));
    });
    c.appendChild(chips);

    const items = productsByConcern(route.concern);
    const grid = el("div", { class: "product-grid" });
    items.forEach((p) => grid.appendChild(productCard(p)));
    c.appendChild(grid);
  }

  /* -------- module -------- */
  function renderModule(route) {
    const ctx = findModule(route.sys, route.mod);
    const c = content();
    c.innerHTML = "";
    if (!ctx) { c.appendChild(emptyState("Not found", "That module doesn't exist.")); return; }

    c.appendChild(breadcrumb([{ label: "Home", hash: "#/" }, { label: ctx.module.name }]));
    c.appendChild(el("h1", { class: "page-title" }, ctx.module.name));
    c.appendChild(el("p", { class: "page-subtitle" }, ctx.module.summary || ""));

    const groups = moduleGroups(ctx.module);
    groups.forEach((g) => {
      const section = el("section", { class: "cat-section", id: "cat-" + g.id });
      section.appendChild(el("h2", { class: "cat-heading" }, g.name));
      section.appendChild(lessonList(g.lessons, ctx.system, ctx.module));
      c.appendChild(section);
    });

    if (route.cat) {
      const target = $("#cat-" + route.cat, c);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.classList.add("cat-flash");
        setTimeout(() => target.classList.remove("cat-flash"), 1400);
      }
    }
  }

  function lessonList(lessons, sys, mod) {
    if (!lessons.length) return emptyState("No lessons yet", "Add lessons to this category in content.js");
    const list = el("div", { class: "lesson-list" });
    lessons.forEach((l) => {
      const hasKiko = Array.isArray(l.variants) && l.variants.length > 1;
      list.appendChild(
        el("div",
          { class: "lesson-row", role: "button", tabindex: "0",
            onClick: () => navigate(`#/${sys.id}/${mod.id}/${l.id}`) },
          el("div", { class: "lesson-type-icon " + l.type, html: l.type === "video" ? ICONS.video : ICONS.article }),
          el("div", { class: "lesson-info" },
            el("h4", {}, l.title),
            el("p", {}, l.summary || "")
          ),
          el("div", { class: "lesson-badge" },
            hasKiko ? el("span", { class: "pill kiko" }, "KIKO") : null,
            el("span", { class: "pill " + l.type }, l.type === "video" ? "Video" : "SOP"),
            l.duration ? el("span", { html: ICONS.clock + `<span style="margin-left:4px">${l.duration}</span>`, style: "display:inline-flex;align-items:center;gap:2px" }) : null
          )
        )
      );
    });
    return list;
  }

  /* -------- lesson -------- */
  function renderLesson(route) {
    const ctx = findLesson(route.sys, route.mod, route.lesson);
    const c = content();
    c.innerHTML = "";
    if (!ctx) { c.appendChild(emptyState("Not found", "That lesson doesn't exist.")); return; }
    const { system: sys, module: mod, lesson: l } = ctx;

    c.appendChild(breadcrumb([
      { label: "Home", hash: "#/" },
      { label: mod.name, hash: `#/${sys.id}/${mod.id}` },
      { label: l.title }
    ]));
    c.appendChild(el("h1", { class: "page-title" }, l.title));
    c.appendChild(el("p", { class: "page-subtitle" }, l.summary || (l.duration || "")));

    if (l.type === "video") {
      if (l.videoUrl) c.appendChild(videoEmbed(l.videoUrl));
      else c.appendChild(el("div", { class: "callout info" },
        (l.videoFile ? `Video: “${l.videoFile}”. ` : "") +
        "This video hasn't been linked yet. Paste its share link into the lesson's videoUrl in content.js (YouTube, Vimeo, Loom, or a Google Drive link set to “anyone with the link”)."));
    }

    // SOP variants (Standard vs KIKO tailored) rendered as tabs.
    if (Array.isArray(l.variants) && l.variants.length) {
      if (l.variants.length === 1) {
        c.appendChild(renderBody(l.variants[0].body || []));
      } else {
        c.appendChild(renderTabs(l.variants));
      }
    } else if (l.body && l.body.length) {
      c.appendChild(renderBody(l.body));
    }

    if (l.resources && l.resources.length) c.appendChild(resourceBlock(l.resources));
  }

  function renderTabs(variants) {
    const wrap = el("div", { class: "tabs" });
    const bar = el("div", { class: "tab-bar", role: "tablist" });
    const panel = el("div", { class: "tab-panel" });
    const buttons = [];

    const show = (i) => {
      buttons.forEach((b, j) => b.classList.toggle("active", i === j));
      panel.innerHTML = "";
      panel.appendChild(renderBody(variants[i].body || []));
    };

    variants.forEach((v, i) => {
      const isKiko = /kiko/i.test(v.label || "");
      const btn = el("button",
        { class: "tab-btn" + (isKiko ? " kiko" : ""), role: "tab",
          onClick: () => show(i) },
        v.label || ("Version " + (i + 1))
      );
      buttons.push(btn);
      bar.appendChild(btn);
    });

    wrap.appendChild(bar);
    wrap.appendChild(panel);
    show(0);
    return wrap;
  }

  /* -------- guide -------- */
  function renderGuide(route) {
    const g = findGuide(route.guide);
    const c = content();
    c.innerHTML = "";
    if (!g) { c.appendChild(emptyState("Not found", "That guide doesn't exist.")); return; }

    c.appendChild(breadcrumb([{ label: "Home", hash: "#/" }, { label: g.name }]));
    c.appendChild(el("h1", { class: "page-title" }, g.name));
    if (g.subtitle || g.description) c.appendChild(el("p", { class: "page-subtitle" }, g.subtitle || g.description));

    const layout = el("div", { class: "guide-layout" });
    const main = el("div", { class: "guide-main" });
    const sections = g.sections || [];

    // Table of contents (only if multiple sections)
    if (sections.length > 1) {
      const toc = el("aside", { class: "guide-toc" },
        el("div", { class: "guide-toc-title" }, "On this page"));
      sections.forEach((sec) => {
        toc.appendChild(el("a",
          { class: "guide-toc-link", onClick: () => scrollToSection(sec.id) }, sec.title));
      });
      layout.appendChild(toc);
    }

    // Embedded document, if provided
    if (g.embedUrl) {
      const embed = toEmbedUrl(g.embedUrl) || g.embedUrl;
      main.appendChild(
        el("div", { class: "guide-embed" },
          el("iframe", { src: embed, loading: "lazy", allowfullscreen: "", referrerpolicy: "strict-origin-when-cross-origin" })
        )
      );
    }

    sections.forEach((sec) => {
      const s = el("section", { class: "guide-section", id: "sec-" + sec.id });
      s.appendChild(el("h2", { class: "guide-section-title" }, sec.title));
      s.appendChild(renderBody(sec.body || []));
      main.appendChild(s);
    });

    if (g.resources && g.resources.length) main.appendChild(resourceBlock(g.resources));

    layout.appendChild(main);
    c.appendChild(layout);

    if (route.section) setTimeout(() => scrollToSection(route.section), 60);
  }

  function scrollToSection(id) {
    const target = $("#sec-" + id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("cat-flash");
      setTimeout(() => target.classList.remove("cat-flash"), 1400);
    }
  }

  /* -------- shared body renderer -------- */
  function renderBody(blocks) {
    const wrap = el("div", { class: "article-body" });
    blocks.forEach((b) => {
      if (b.type === "heading") wrap.appendChild(el("h2", {}, b.text));
      else if (b.type === "paragraph") wrap.appendChild(el("p", {}, b.text));
      else if (b.type === "steps") {
        const ol = el("ol", {});
        (b.items || []).forEach((i) => ol.appendChild(el("li", {}, i)));
        wrap.appendChild(ol);
      } else if (b.type === "list") {
        const ul = el("ul", {});
        (b.items || []).forEach((i) => ul.appendChild(el("li", {}, i)));
        wrap.appendChild(ul);
      } else if (b.type === "callout") {
        wrap.appendChild(el("div", { class: "callout " + (b.style || "info") }, b.text));
      } else if (b.type === "video" && b.videoUrl) {
        wrap.appendChild(videoEmbed(b.videoUrl));
      }
    });
    return wrap;
  }

  function videoEmbed(url) {
    const embed = toEmbedUrl(url);
    const frame = el("div", { class: "video-frame" });
    if (embed) {
      frame.appendChild(el("iframe", {
        src: embed, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowfullscreen: "", loading: "lazy", referrerpolicy: "strict-origin-when-cross-origin"
      }));
    } else {
      frame.appendChild(el("div", { class: "video-fallback" },
        el("p", {}, "Video link couldn't be embedded."),
        el("a", { href: url, target: "_blank", rel: "noopener" }, "Open the video in a new tab →")
      ));
    }
    return frame;
  }

  function resourceBlock(resources) {
    const res = el("div", { class: "resources" }, el("h3", {}, "Attachments & links"));
    resources.forEach((r) =>
      res.appendChild(el("a", { class: "resource-link", href: r.url, target: "_blank", rel: "noopener", html: ICONS.link + `<span>${escapeHtml(r.label)}</span>` }))
    );
    return res;
  }

  /* -------- search -------- */
  function renderSearch(q) {
    const c = content();
    c.innerHTML = "";
    const query = (q || "").trim().toLowerCase();
    c.appendChild(el("h1", { class: "page-title" }, "Search"));
    c.appendChild(el("p", { class: "page-subtitle" }, query ? `Results for “${q}”` : "Type in the search box above."));
    if (!query) return;

    const bodyText = (l) => {
      const bits = [];
      (l.body || []).forEach((b) => bits.push(b.text || (b.items || []).join(" ")));
      (l.variants || []).forEach((v) => (v.body || []).forEach((b) => bits.push(b.text || (b.items || []).join(" "))));
      return bits.join(" ");
    };

    const results = [];
    allLessons().forEach(({ system, module, lesson }) => {
      const hay = [lesson.title, lesson.summary, module.name, (lesson.tags || []).join(" "), bodyText(lesson)].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ system, module, lesson });
    });
    // Include guide sections
    guides.forEach((g) => (g.sections || []).forEach((sec) => {
      const hay = [g.name, sec.title, (sec.body || []).map((b) => b.text || (b.items || []).join(" ")).join(" ")].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ guide: g, section: sec });
    }));
    // Include products
    if (catalogue) (catalogue.items || []).forEach((p) => {
      const hay = [p.name, p.blurb, p.concern].join(" ").toLowerCase();
      if (hay.includes(query)) results.push({ product: p });
    });

    if (!results.length) { c.appendChild(emptyState("No results", `Nothing matched “${q}”. Try a different word.`)); return; }

    const list = el("div", { class: "lesson-list" });
    results.forEach((r) => {
      if (r.product) {
        list.appendChild(
          el("a", { class: "lesson-row", href: r.product.url || "#", target: "_blank", rel: "noopener" },
            el("div", { class: "lesson-type-icon product", html: ICONS.tag }),
            el("div", { class: "lesson-info" },
              el("h4", {}, r.product.name),
              el("p", {}, `Product · ${r.product.concern || ""}`)),
            el("span", { class: "pill product" }, "Product")
          )
        );
      } else if (r.guide) {
        list.appendChild(
          el("div", { class: "lesson-row", role: "button", tabindex: "0",
              onClick: () => navigate(`#/guide/${r.guide.id}/s/${r.section.id}`) },
            el("div", { class: "lesson-type-icon article", html: ICONS.book }),
            el("div", { class: "lesson-info" },
              el("h4", {}, r.section.title),
              el("p", {}, `${r.guide.name}`)),
            el("span", { class: "pill guide" }, "Guide")
          )
        );
      } else {
        list.appendChild(
          el("div", { class: "lesson-row", role: "button", tabindex: "0",
              onClick: () => navigate(`#/${r.system.id}/${r.module.id}/${r.lesson.id}`) },
            el("div", { class: "lesson-type-icon " + r.lesson.type, html: r.lesson.type === "video" ? ICONS.video : ICONS.article }),
            el("div", { class: "lesson-info" },
              el("h4", {}, r.lesson.title),
              el("p", {}, `${r.module.name} · ${r.lesson.summary || ""}`)),
            el("span", { class: "pill " + r.lesson.type }, r.lesson.type === "video" ? "Video" : "SOP")
          )
        );
      }
    });
    c.appendChild(list);
  }

  /* -------- shared UI -------- */
  function breadcrumb(items) {
    const bc = el("div", { class: "breadcrumb" });
    items.forEach((it, i) => {
      if (i > 0) bc.appendChild(el("span", { class: "sep" }, "/"));
      if (it.hash) bc.appendChild(el("a", { onClick: () => navigate(it.hash) }, it.label));
      else bc.appendChild(el("span", {}, it.label));
    });
    return bc;
  }
  function emptyState(title, msg) {
    return el("div", { class: "empty-state" },
      el("div", { html: ICONS.empty }),
      el("h3", {}, title),
      el("p", {}, msg)
    );
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* -------- sidebar mobile -------- */
  function openSidebar() { $("#sidebar").classList.add("open"); $("#sidebar-backdrop").hidden = false; }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#sidebar-backdrop").hidden = true; }

  /* =============================================================== AUTH */
  function isAuthed() { return sessionStorage.getItem(AUTH_KEY) === "1" || readPersistentAuth(); }
  function readPersistentAuth() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return false;
      const { exp } = JSON.parse(raw);
      if (exp && Date.now() < exp) return true;
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
    return false;
  }
  function setAuthed() {
    const mode = KB_CONFIG.sessionMode;
    if (typeof mode === "number" && mode > 0)
      localStorage.setItem(AUTH_KEY, JSON.stringify({ exp: Date.now() + mode * 864e5 }));
    else sessionStorage.setItem(AUTH_KEY, "1");
  }
  function clearAuth() { sessionStorage.removeItem(AUTH_KEY); localStorage.removeItem(AUTH_KEY); }

  function showApp() {
    $("#login-screen").hidden = true;
    $("#app").hidden = false;
    if (!location.hash) location.hash = "#/";
    render();
  }
  function showLogin() {
    $("#app").hidden = true;
    $("#login-screen").hidden = false;
    setTimeout(() => $("#password-input").focus(), 50);
  }

  /* =============================================================== INIT */
  function applyBranding() {
    document.querySelectorAll("[data-brand-name]").forEach((n) => (n.textContent = KB_CONFIG.brandName));
    document.querySelectorAll("[data-brand-subtitle]").forEach((n) => (n.textContent = KB_CONFIG.brandSubtitle));
    if (KB_CONFIG.supportContact) {
      const sup = $("#login-support");
      const link = $("#support-link");
      link.href = "mailto:" + KB_CONFIG.supportContact;
      link.textContent = KB_CONFIG.supportContact;
      sup.hidden = false;
    }
  }

  function wireLogin() {
    const form = $("#login-form");
    const input = $("#password-input");
    const errEl = $("#login-error");
    const toggle = $("#toggle-password");

    toggle.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      toggle.textContent = showing ? "Show" : "Hide";
      input.focus();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errEl.hidden = true;
      let hash;
      try { hash = await sha256(input.value); }
      catch (err) { errEl.textContent = "This page must be served over http(s), not opened as a file."; errEl.hidden = false; return; }
      if (hash === (KB_CONFIG.PASSWORD_HASH || "").toLowerCase()) {
        setAuthed(); input.value = ""; showApp();
      } else {
        errEl.textContent = "Incorrect password. Please try again.";
        errEl.hidden = false; input.select();
      }
    });
  }

  function wireApp() {
    $("#logout-btn").addEventListener("click", () => { clearAuth(); location.hash = ""; showLogin(); });
    $("#home-link").addEventListener("click", () => navigate("#/"));
    $("#menu-toggle").addEventListener("click", () =>
      $("#sidebar").classList.contains("open") ? closeSidebar() : openSidebar());
    $("#sidebar-backdrop").addEventListener("click", closeSidebar);

    const search = $("#search-input");
    let t;
    search.addEventListener("input", () => {
      clearTimeout(t);
      const q = search.value.trim();
      t = setTimeout(() => {
        if (q) navigate("#/search/" + encodeURIComponent(q));
        else if (parseHash().view === "search") navigate("#/");
      }, 220);
    });

    window.addEventListener("hashchange", () => { if (isAuthed()) render(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyBranding();
    wireLogin();
    wireApp();
    if (isAuthed()) showApp();
    else showLogin();
  });
})();
