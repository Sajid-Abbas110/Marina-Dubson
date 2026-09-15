/* ============================================================
   Site Assistant — public-site FAQ widget
   ------------------------------------------------------------
   A fork of technical-support.js for anonymous visitors on the
   public marketing site (no login, no account/role concept).
   Kept as a separate engine + separate globals (PublicAssistant /
   PublicAssistantKB) on purpose: the portal widget and this one
   must never share state, so navigating between the public site
   and the authenticated portal in the same SPA session can never
   leave the wrong knowledge base mounted.
   Depends on: site-assistant-kb.js  (load it FIRST)
               technical-support.css (shared, namespaced under .ts-)

   USAGE
   -----
   PublicAssistant.mount({
     page: 'Home',
     mode: 'scripted',           // 'scripted' (default) | 'api'
     apiEndpoint: '/api/assistant/ask',
     onLog: function (entry) {},
     brandName: 'Marina Dubson Assistant',
     theme: 'auto'
   });
   PublicAssistant.setContext({ page: 'Services' });
   ============================================================ */
(function (root) {
  var KB, OOS, SUGGESTIONS;

  var state = { role: "visitor", page: "Home", mode: "scripted", apiEndpoint: null, onLog: null, brand: "Marina Dubson Assistant" };
  var el = {}; // dom refs
  var mounted = false;

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function pageKey(){ return String(state.page || "").toLowerCase(); }

  /* ---------- scripted engine ---------- */
  function normalize(t){ return " " + String(t).toLowerCase().replace(/[^a-z0-9\s']/g, " ").replace(/\s+/g, " ").trim() + " "; }

  function scriptedAnswer(qRaw){
    var q = normalize(qRaw), i, k;
    // 1) guardrail — not a law firm, no legal advice / outcome predictions
    for (i = 0; i < OOS.length; i++) {
      if (q.indexOf(" " + OOS[i] + " ") !== -1 || q.indexOf(OOS[i]) !== -1) {
        return { type: "decline",
          html: "That's outside what I can help with — for legal advice about your specific situation, please consult an attorney. I can help with services, booking, or account questions though! Try a suggestion below, or reach out via <span class='ts-ref'>Contact</span>." };
      }
    }
    // 2) score intents
    var best = null, bestScore = 0, pk = pageKey();
    for (i = 0; i < KB.length; i++) {
      var it = KB[i];
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
      html: "I don't have information about that on the site yet — try a suggestion below, or reach Marina directly via <span class='ts-ref'>Contact</span>." };
  }

  /* ---------- rendering ---------- */
  function bubble(cls, html){
    var d = document.createElement("div");
    d.className = "ts-msg " + cls; d.innerHTML = html;
    el.stream.appendChild(d); el.stream.scrollTop = el.stream.scrollHeight;
    return d;
  }
  function suggestionsFor(){
    var r = SUGGESTIONS.visitor || {};
    return r[pageKey()] || r._ || [];
  }
  function renderChips(){
    var s = suggestionsFor();
    el.chips.innerHTML = '<div class="ts-lbl">Try asking</div>' +
      s.map(function(qq){ return '<button class="ts-chip" type="button">' + esc(qq) + "</button>"; }).join("");
  }
  function syncAware(){
    el.awarePage.textContent = state.page;
    el.input.placeholder = "Ask about " + state.page + "…";
    renderChips();
  }
  function greet(){
    el.stream.innerHTML = "";
    bubble("ts-bot", "Hi! I'm <strong>" + esc(state.brand) + "</strong>. You're on <strong>" + esc(state.page) +
      "</strong> — ask me anything about services, booking, or your account, or tap a suggestion.");
  }

  /* ---------- send ---------- */
  function logEntry(q, res){
    if (typeof state.onLog !== "function") return;
    try {
      state.onLog({
        at: new Date().toISOString(),
        page: state.page, question: q,
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
      fetch(state.apiEndpoint, {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: t, page: state.page })
      }).then(function(r){ return r.json(); })
        .then(function(data){
          typing.className = "ts-msg ts-bot" + (data && data.declined ? " ts-decline" : "");
          typing.innerHTML = (data && data.answer) ? data.answer :
            "I couldn't reach the assistant service. Try again, or use <span class='ts-ref'>Contact</span>.";
          logEntry(t, { type: data && data.declined ? "decline" : "ok", intent: data && data.intent });
        })
        .catch(function(){
          typing.innerHTML = "I couldn't reach the assistant service. Try again, or use <span class='ts-ref'>Contact</span>.";
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
            '<div class="ts-aware">Aware of: <b data-ts="awarePage"></b></div></div>' +
          '<button class="ts-x" type="button" data-ts="close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="ts-stream" data-ts="stream"></div>' +
        '<div class="ts-chips" data-ts="chips"></div>' +
        '<div class="ts-composer"><form data-ts="form">' +
          '<textarea data-ts="input" rows="1" placeholder="Ask…" autocomplete="off"></textarea>' +
          '<button class="ts-send" type="submit" aria-label="Send">↑</button>' +
        '</form><div class="ts-foot">Scripted · answers only from information published on this site</div></div>' +
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
      if (!root.PublicAssistantKB) { console.error("[PublicAssistant] load site-assistant-kb.js before site-assistant.js"); return; }
      KB = root.PublicAssistantKB.KB; OOS = root.PublicAssistantKB.OOS; SUGGESTIONS = root.PublicAssistantKB.SUGGESTIONS;

      if (cfg.page) state.page = cfg.page;
      if (cfg.mode) state.mode = cfg.mode;
      if (cfg.apiEndpoint) state.apiEndpoint = cfg.apiEndpoint;
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
      if (!ctx.page || ctx.page === state.page) { return api; }
      state.page = ctx.page;
      if (!mounted) return api;
      syncAware();
      return api;
    },
    open: function(){ if (el.launcher) el.launcher.click(); return api; },
    destroy: function(){ if (el.root) el.root.remove(); mounted = false; return api; }
  };

  root.PublicAssistant = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : this);
