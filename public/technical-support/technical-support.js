/* ============================================================
   Technical Support — in-portal help assistant (widget)
   ------------------------------------------------------------
   Framework-agnostic. Works in plain HTML, React, Vue, etc.
   Depends on: technical-support-kb.js  (load it FIRST)
               technical-support.css

   USAGE
   -----
   TechnicalSupport.mount({
     role:  'reporter',          // REQUIRED. MUST come from the
                                 // server-verified session — never
                                 // from a value the browser can edit.
     page:  'Marketplace',       // current page label (see setContext)
     mode:  'scripted',          // 'scripted' (default) | 'api'
     apiEndpoint: '/api/assistant/ask',   // used only when mode==='api'
     getAuthHeaders: function () {   // OPTIONAL, 'api' mode only. Return
       // extra headers (e.g. { Authorization: 'Bearer ' + token }) to
       // send with the ask request, read fresh on every question. Needed
       // whenever the host app authenticates via header/token rather
       // than an httpOnly cookie.
     },
     onLog: function (entry) {    // OPTIONAL client hook. The server
       // POST entry to your audit endpoint. Server-side logging is
       // the authoritative record (see INTEGRATION.md).
     },
     theme: 'auto'               // 'auto' | 'light' | 'dark'
   });

   // On client-side route changes, keep the assistant's context fresh:
   TechnicalSupport.setContext({ page: 'Rates' });
   // If your app can switch the active user without a full reload:
   TechnicalSupport.setContext({ role: 'admin', page: 'Bookings' });

   SECURITY NOTE
   -------------
   In 'scripted' mode the answer text is chosen on the client, but it
   contains only generic how-to guidance (no private records), and the
   role passed here only decides WHICH generic guidance shows. Any
   answer that returns real records must run in 'api' mode, where the
   backend re-derives the role from the session and scopes the query.
   Never trust this widget's `role` for data access decisions.
   ============================================================ */
(function (root) {
  var KB, OOS, SUGGESTIONS, ROLE_LABEL;

  var state = { role: "admin", page: "Dashboard", mode: "scripted", apiEndpoint: null, getAuthHeaders: null, onLog: null, brand: "Technical Support" };
  var el = {}; // dom refs
  var mounted = false;

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function pageKey(){ return String(state.page || "").toLowerCase(); }

  /* ---------- scripted engine ---------- */
  function normalize(t){ return " " + String(t).toLowerCase().replace(/[^a-z0-9\s']/g, " ").replace(/\s+/g, " ").trim() + " "; }

  function scriptedAnswer(qRaw){
    var q = normalize(qRaw), i, k;
    // 1) role-scoped refusal (non-admin) — enforced before matching
    if (state.role !== "admin") {
      for (i = 0; i < OOS.length; i++) {
        if (q.indexOf(" " + OOS[i] + " ") !== -1 || q.indexOf(OOS[i]) !== -1) {
          return { type: "decline",
            html: "I can only help with your own <strong>" + ROLE_LABEL[state.role] +
              "</strong> account and records — I can't share other clients', agencies' or system-wide data. If you need that, the admin can help via <span class='ts-ref'>Messages</span>." };
        }
      }
    }
    // 2) score role-eligible intents
    var best = null, bestScore = 0, pk = pageKey();
    for (i = 0; i < KB.length; i++) {
      var it = KB[i];
      if (it.roles.indexOf(state.role) === -1) continue;
      var sc = 0;
      for (k = 0; k < it.kw.length; k++) {
        var w = it.kw[k];
        if (q.indexOf(" " + w + " ") !== -1 || q.indexOf(w) !== -1) sc += (w.split(" ").length > 1 ? 2 : 1);
      }
      if (sc > 0 && pk && it.id.indexOf(pk.replace(/\s+/g, "")) !== -1) sc += 0.5; // light page boost
      if (sc > bestScore) { bestScore = sc; best = it; }
    }
    if (best && bestScore >= 1) return { type: "ok", html: best.a, intent: best.id };
    // 3) grounded fallback — never guess, never use outside knowledge
    return { type: "none",
      html: "I can only answer questions about the Marina Dubson portal, and only from your own records — so I don't have that one. Try a suggestion below, or reach a person via <span class='ts-ref'>Messages</span>." };
  }

  /* ---------- rendering ---------- */
  function bubble(cls, html){
    var d = document.createElement("div");
    d.className = "ts-msg " + cls; d.innerHTML = html;
    el.stream.appendChild(d); el.stream.scrollTop = el.stream.scrollHeight;
    return d;
  }
  function suggestionsFor(){
    var r = SUGGESTIONS[state.role] || {};
    return r[pageKey()] || r._ || [];
  }
  function renderChips(){
    var s = suggestionsFor();
    el.chips.innerHTML = '<div class="ts-lbl">Try asking</div>' +
      s.map(function(qq){ return '<button class="ts-chip" type="button">' + esc(qq) + "</button>"; }).join("");
  }
  function syncAware(){
    el.awarePage.textContent = state.page;
    el.awareRole.textContent = state.role;
    el.input.placeholder = "Ask about " + state.page + "…";
    renderChips();
  }
  function greet(){
    el.stream.innerHTML = "";
    bubble("ts-bot", "Hi! I'm <strong>" + esc(state.brand) + "</strong>. You're on <strong>" + esc(state.page) +
      "</strong> as <strong>" + esc(ROLE_LABEL[state.role] || state.role) + "</strong>. Not sure what to do here? Just ask — or tap a suggestion.");
  }

  /* ---------- send ---------- */
  function logEntry(q, res){
    if (typeof state.onLog !== "function") return;
    try {
      state.onLog({
        at: new Date().toISOString(),
        role: state.role, page: state.page, question: q,
        result: res.type,                 // ok | decline | none
        intent: res.intent || null,
        mode: state.mode
      });
    } catch (e) { /* never let logging break the widget */ }
  }

  function send(text){
    var t = (text || "").trim(); if (!t) return;
    bubble("ts-me", esc(t));
    el.input.value = ""; el.input.style.height = "auto";

    if (state.mode === "api" && state.apiEndpoint) {
      var typing = bubble("ts-bot", "…");
      // Role is NOT sent — the server derives it from the session.
      var headers = { "Content-Type": "application/json" };
      if (typeof state.getAuthHeaders === "function") {
        try {
          var extra = state.getAuthHeaders() || {};
          for (var hk in extra) { if (Object.prototype.hasOwnProperty.call(extra, hk)) headers[hk] = extra[hk]; }
        } catch (e) { /* never let a header hook break the widget */ }
      }
      fetch(state.apiEndpoint, {
        method: "POST", credentials: "same-origin",
        headers: headers,
        body: JSON.stringify({ question: t, page: state.page })
      }).then(function(r){ return r.json(); })
        .then(function(data){
          typing.className = "ts-msg ts-bot" + (data && data.declined ? " ts-decline" : "");
          typing.innerHTML = (data && data.answer) ? data.answer :
            "I couldn't reach the assistant service. Try again, or use <span class='ts-ref'>Messages</span>.";
          // server does the authoritative audit log; onLog is optional client mirror
          logEntry(t, { type: data && data.declined ? "decline" : "ok", intent: data && data.intent });
        })
        .catch(function(){
          typing.innerHTML = "I couldn't reach the assistant service. Try again, or use <span class='ts-ref'>Messages</span>.";
        });
      return;
    }

    // scripted mode
    var res = scriptedAnswer(t);
    setTimeout(function(){
      bubble(res.type === "decline" ? "ts-bot ts-decline" : "ts-bot", res.html);
      logEntry(t, res);
    }, 240);
  }

  /* ---------- build DOM ---------- */
  function build(){
    var rootEl = document.createElement("div");
    rootEl.className = "ts-root";
    if (state.theme === "light" || state.theme === "dark") rootEl.setAttribute("data-ts-theme", state.theme);

    rootEl.innerHTML =
      '<button class="ts-launcher" type="button" data-ts="open">' +
        '<span class="ts-dot">✦</span> ' + esc(state.brand) + '</button>' +
      '<section class="ts-panel" hidden aria-label="' + esc(state.brand) + '">' +
        '<div class="ts-head">' +
          '<div class="ts-avatar">✦</div>' +
          '<div><h2>' + esc(state.brand) + '</h2>' +
            '<div class="ts-aware">Aware of: <b data-ts="awarePage"></b> · <b data-ts="awareRole"></b></div></div>' +
          '<button class="ts-x" type="button" data-ts="close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="ts-stream" data-ts="stream"></div>' +
        '<div class="ts-chips" data-ts="chips"></div>' +
        '<div class="ts-composer"><form data-ts="form">' +
          '<textarea data-ts="input" rows="1" placeholder="Ask…" autocomplete="off"></textarea>' +
          '<button class="ts-send" type="submit" aria-label="Send">↑</button>' +
        '</form><div class="ts-foot">Scripted · answers only from portal workflows &amp; your own records</div></div>' +
      '</section>';
    document.body.appendChild(rootEl);

    el.root = rootEl;
    el.launcher = rootEl.querySelector('[data-ts="open"]');
    el.panel = rootEl.querySelector(".ts-panel");
    el.stream = rootEl.querySelector('[data-ts="stream"]');
    el.chips = rootEl.querySelector('[data-ts="chips"]');
    el.form = rootEl.querySelector('[data-ts="form"]');
    el.input = rootEl.querySelector('[data-ts="input"]');
    el.awarePage = rootEl.querySelector('[data-ts="awarePage"]');
    el.awareRole = rootEl.querySelector('[data-ts="awareRole"]');

    el.launcher.addEventListener("click", function(){
      el.panel.hidden = false; el.launcher.style.display = "none";
      if (!el.stream.children.length) greet();
      el.input.focus();
    });
    rootEl.querySelector('[data-ts="close"]').addEventListener("click", function(){
      el.panel.hidden = true; el.launcher.style.display = "";
    });
    el.chips.addEventListener("click", function(e){
      var c = e.target.closest(".ts-chip"); if (c) send(c.textContent);
    });
    el.input.addEventListener("input", function(){
      el.input.style.height = "auto"; el.input.style.height = Math.min(el.input.scrollHeight, 96) + "px";
    });
    el.input.addEventListener("keydown", function(e){
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); el.form.requestSubmit(); }
    });
    el.form.addEventListener("submit", function(e){ e.preventDefault(); send(el.input.value); });

    syncAware();
  }

  /* ---------- public API ---------- */
  var api = {
    mount: function (cfg){
      cfg = cfg || {};
      if (!root.TechnicalSupportKB) { console.error("[TechnicalSupport] load technical-support-kb.js before technical-support.js"); return; }
      KB = root.TechnicalSupportKB.KB; OOS = root.TechnicalSupportKB.OOS;
      SUGGESTIONS = root.TechnicalSupportKB.SUGGESTIONS; ROLE_LABEL = root.TechnicalSupportKB.ROLE_LABEL;

      if (cfg.role) state.role = cfg.role;
      if (cfg.page) state.page = cfg.page;
      if (cfg.mode) state.mode = cfg.mode;
      if (cfg.apiEndpoint) state.apiEndpoint = cfg.apiEndpoint;
      if (cfg.getAuthHeaders) state.getAuthHeaders = cfg.getAuthHeaders;
      if (cfg.onLog) state.onLog = cfg.onLog;
      if (cfg.brandName) state.brand = cfg.brandName;
      state.theme = cfg.theme || "auto";

      if (mounted) { syncAware(); return api; }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
      else build();
      mounted = true;
      return api;
    },
    setContext: function (ctx){
      ctx = ctx || {};
      var changed = false;
      if (ctx.role && ctx.role !== state.role) { state.role = ctx.role; changed = true; }
      if (ctx.page && ctx.page !== state.page) { state.page = ctx.page; changed = true; }
      if (!mounted) return api;
      syncAware();
      // if the panel is open and the role changed, re-greet for the new context
      if (changed && el.panel && !el.panel.hidden) greet();
      return api;
    },
    open: function(){ if (el.launcher) el.launcher.click(); return api; },
    destroy: function(){ if (el.root) el.root.remove(); mounted = false; return api; }
  };

  root.TechnicalSupport = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : this);
