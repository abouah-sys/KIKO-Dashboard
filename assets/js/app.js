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

      // YouTube
      if (host === "youtube.com" || host === "m.youtube.com") {
        const id = u.searchParams.get("v");
        if (id) return "https://www.youtube.com/embed/" + id;
        if (u.pathname.startsWith("/embed/")) return url;
        if (u.pathname.startsWith("/shorts/")) return "https://www.youtube.com/embed/" + u.pathname.split("/")[2];
      }
      if (host === "youtu.be") return "https://www.youtube.com/embed/" + u.pathname.slice(1);

      // Vimeo
      if (host === "vimeo.com") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        if (id) return "https://player.vimeo.com/video/" + id;
      }
      if (host === "player.vimeo.com") return url;

      // Loom
      if (host === "loom.com" || host.endsWith(".loom.com")) {
        const id = u.pathname.split("/").filter(Boolean).pop();
        if (id) return "https://www.loom.com/embed/" + id;
      }

      // Google Drive
      if (host === "drive.google.com") {
        const m = u.pathname.match(/\/file\/d\/([^/]+)/);
        if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
      }

      // Fallback: use as-is (works for any /embed style link)
      return url;
    } catch (e) {
      return null;
    }
  }

  /* ------------------------------------------------------------- data model */
  const systems = (typeof KB_CONTENT !== "undefined" && KB_CONTENT.systems) || [];

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

  /* =============================================================== ROUTER */
  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (parts[0] === "search") return { view: "search", q: decodeURIComponent(parts[1] || "") };
    if (parts.length === 0) return { view: "home" };
    if (parts.length === 2) return { view: "module", sys: parts[0], mod: parts[1] };
    if (parts.length === 3) return { view: "lesson", sys: parts[0], mod: parts[1], lesson: parts[2] };
    return { view: "home" };
  }

  function navigate(hash) { location.hash = hash; }

  /* =============================================================== RENDER */
  const content = () => $("#content");

  function render() {
    const route = parseHash();
    closeSidebar();
    renderSidebar(route);
    window.scrollTo(0, 0);

    if (route.view === "home") return renderHome();
    if (route.view === "module") return renderModule(route);
    if (route.view === "lesson") return renderLesson(route);
    if (route.view === "search") return renderSearch(route.q);
  }

  /* -------- sidebar -------- */
  function renderSidebar(route) {
    const nav = $("#sidebar-nav");
    nav.innerHTML = "";
    systems.forEach((s) => {
      nav.appendChild(el("div", { class: "nav-section-title" }, s.name));
      nav.appendChild(
        el("button",
          { class: "nav-item" + (route.view === "home" ? " active" : ""),
            onClick: () => navigate("#/") },
          el("span", { class: "nav-icon", html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' }),
          "Home"
        )
      );
      s.modules.forEach((m) => {
        const active = route.sys === s.id && route.mod === m.id;
        nav.appendChild(
          el("button",
            { class: "nav-item" + (active ? " active" : ""),
              onClick: () => navigate(`#/${s.id}/${m.id}`) },
            el("span", { class: "nav-icon", html: ICONS[m.icon] || ICONS.article }),
            m.name,
            el("span", { class: "nav-count" }, String(m.lessons.length))
          )
        );
      });
    });
  }

  /* -------- home -------- */
  function renderHome() {
    const c = content();
    c.innerHTML = "";
    const sys = systems[0];
    if (!sys) { c.appendChild(emptyState("No content yet", "Add content in assets/js/content.js")); return; }

    c.appendChild(
      el("div", { class: "hero" },
        el("span", { class: "hero-tag" }, sys.tagline || "Knowledge Base"),
        el("h1", {}, `Welcome to the ${KB_CONFIG.brandName} Knowledge Base`),
        el("p", {}, sys.description || "")
      )
    );

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
    c.appendChild(lessonList(ctx.module.lessons, ctx.system, ctx.module));
  }

  function lessonList(lessons, sys, mod) {
    if (!lessons.length) return emptyState("No lessons yet", "Add lessons to this module in content.js");
    const list = el("div", { class: "lesson-list" });
    lessons.forEach((l) => {
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
    const metaBits = [];
    if (l.duration) metaBits.push(l.duration);
    c.appendChild(el("p", { class: "page-subtitle" }, l.summary || (metaBits.join(" · "))));

    if (l.type === "video" && l.videoUrl) c.appendChild(videoEmbed(l.videoUrl));

    if (l.body && l.body.length) c.appendChild(renderBody(l.body));

    if (l.resources && l.resources.length) {
      const res = el("div", { class: "resources" }, el("h3", {}, "Attachments & links"));
      l.resources.forEach((r) =>
        res.appendChild(el("a", { class: "resource-link", href: r.url, target: "_blank", rel: "noopener", html: ICONS.link + `<span>${escapeHtml(r.label)}</span>` }))
      );
      c.appendChild(res);
    }
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

  /* -------- search -------- */
  function renderSearch(q) {
    const c = content();
    c.innerHTML = "";
    const query = (q || "").trim().toLowerCase();
    c.appendChild(el("h1", { class: "page-title" }, "Search"));
    c.appendChild(el("p", { class: "page-subtitle" }, query ? `Results for “${q}”` : "Type in the search box above."));
    if (!query) return;

    const matches = allLessons().filter(({ lesson, module }) => {
      const hay = [
        lesson.title, lesson.summary, module.name,
        (lesson.tags || []).join(" "),
        (lesson.body || []).map((b) => b.text || (b.items || []).join(" ")).join(" ")
      ].join(" ").toLowerCase();
      return hay.includes(query);
    });

    if (!matches.length) { c.appendChild(emptyState("No results", `Nothing matched “${q}”. Try a different word.`)); return; }

    const list = el("div", { class: "lesson-list" });
    matches.forEach(({ system, module, lesson }) => {
      list.appendChild(
        el("div",
          { class: "lesson-row", role: "button", tabindex: "0",
            onClick: () => navigate(`#/${system.id}/${module.id}/${lesson.id}`) },
          el("div", { class: "lesson-type-icon " + lesson.type, html: lesson.type === "video" ? ICONS.video : ICONS.article }),
          el("div", { class: "lesson-info" },
            el("h4", {}, lesson.title),
            el("p", {}, `${module.name} · ${lesson.summary || ""}`)
          ),
          el("span", { class: "pill " + lesson.type }, lesson.type === "video" ? "Video" : "SOP")
        )
      );
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
  function isAuthed() {
    return sessionStorage.getItem(AUTH_KEY) === "1" || readPersistentAuth();
  }
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
    if (typeof mode === "number" && mode > 0) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ exp: Date.now() + mode * 864e5 }));
    } else {
      sessionStorage.setItem(AUTH_KEY, "1");
    }
  }
  function clearAuth() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }

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
      const val = input.value;
      let hash;
      try { hash = await sha256(val); }
      catch (err) { errEl.textContent = "This page must be served over http(s), not opened as a file."; errEl.hidden = false; return; }

      if (hash === (KB_CONFIG.PASSWORD_HASH || "").toLowerCase()) {
        setAuthed();
        input.value = "";
        showApp();
      } else {
        errEl.textContent = "Incorrect password. Please try again.";
        errEl.hidden = false;
        input.select();
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
