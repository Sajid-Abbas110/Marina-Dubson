/* ============================================================
   Site Assistant — Knowledge Base for the PUBLIC marketing site
   ------------------------------------------------------------
   Visitor-facing FAQ content only. No account/role/records concept —
   everything here must be true for any anonymous visitor.
   Content team: edit this file only. See technical-support-kb.js
   for the (separate) portal knowledge base.

   IMPORTANT: only state facts that actually appear on the public
   site (services, about, contact, notable-experience, register,
   login pages). No pricing numbers exist on the site (pricing/plans
   pages redirect to Services) — do not invent any.
   ============================================================ */
(function (root) {
  var ALL = ["visitor"];
  var ROLE_LABEL = { visitor: "Visitor" };

  /* Guardrail: decline rather than speculate — not a law firm,
     can't give legal advice or predict case outcomes. */
  var OOS = [
    "legal advice", "should i sue", "will i win", "is my case",
    "what should i do about my case", "represent me", "be my lawyer",
    "hire you as my attorney", "give me advice about my lawsuit",
    "should i settle", "am i going to win"
  ];

  var KB = [
    { id: "hello", roles: ALL, kw: ["hi", "hello", "hey", "what can you do", "who are you", "help"],
      a: "Hi! I'm the <strong>Marina Dubson Assistant</strong>. I can tell you about Marina's court reporting services — realtime reporting, depositions, arbitrations &amp; hearings, CART, and transcript production — and help you find the right way to get in touch or sign up. Ask away, or tap a suggestion below." },

    { id: "services-overview", roles: ALL, kw: ["services", "what do you offer", "what do you do", "offerings", "what can you help with"],
      a: "Marina offers:<ul><li><strong>Realtime Reporting</strong> — an instant, scrolling transcript to your laptop or tablet during depositions, arbitrations and trials.</li><li><strong>Deposition Reporting</strong> — certified deposition transcripts for civil and federal matters.</li><li><strong>Arbitrations &amp; Hearings</strong> — administrative hearings and legal proceedings, including government and ethics hearings.</li><li><strong>CART Services</strong> — Communication Access Realtime Translation for schools, universities and live events.</li><li><strong>Transcript Production</strong> — from rough draft through certified, formatted final transcript.</li></ul>See <span class='ts-ref'>Services</span> for details." },

    { id: "realtime", roles: ALL, kw: ["realtime", "real-time", "real time reporting", "scrolling transcript", "live transcript"],
      a: "<strong>Realtime Reporting</strong> streams an instant, scrolling transcript to your laptop or tablet during depositions, arbitrations, and trials — see <span class='ts-ref'>Services</span> for more." },

    { id: "deposition", roles: ALL, kw: ["deposition", "depositions"],
      a: "Marina provides certified deposition transcripts for civil and federal matters — covering personal injury, medical malpractice, fraud, breach of contract, IP, employment discrimination and complex litigation — with verbatim coverage and fast turnaround, including daily and immediate delivery." },

    { id: "arbitration", roles: ALL, kw: ["arbitration", "arbitrations", "hearing", "hearings", "administrative hearing"],
      a: "Marina reports arbitrations, administrative hearings, and other legal proceedings, including government and ethics hearings. See <span class='ts-ref'>Services</span> for more." },

    { id: "cart", roles: ALL, kw: ["cart", "communication access", "accessibility service", "captioning"],
      a: "<strong>CART</strong> (Communication Access Realtime Translation) provides live, real-time captioning for schools, universities, and live events." },

    { id: "transcript-production", roles: ALL, kw: ["transcript production", "rough draft", "final transcript", "formatting", "certified transcript"],
      a: "Transcript production covers the full path from rough draft through a certified, formatted final transcript." },

    { id: "coverage", roles: ALL, kw: ["location", "where are you", "area", "cover", "coverage", "new york", "nationwide", "travel"],
      a: "Marina is based in New York and works throughout New York and nationwide, partnering with court reporting agencies across the country for out-of-area jobs." },

    { id: "pricing", roles: ALL, kw: ["price", "pricing", "cost", "how much", "rate", "rates", "fee", "fees", "quote"],
      a: "Pricing isn't published on the site — it depends on the proceeding, length, and any add-ons like realtime or rough draft. The fastest way to get a quote is via <span class='ts-ref'>Contact</span>." },

    { id: "how-to-book", roles: ALL, kw: ["book", "booking", "request a reporter", "hire", "schedule", "need a reporter", "get a reporter"],
      a: "To request a reporter, use <span class='ts-ref'>Contact</span> — Marina welcomes inquiries from attorneys, agencies, institutions and schools. If you already have a portal account, log in and book directly from there." },

    { id: "contact-info", roles: ALL, kw: ["contact", "email", "reach you", "get in touch", "phone", "call", "message"],
      a: "You can reach Marina by email at <strong>MarinaDubson@gmail.com</strong>, or through the form on <span class='ts-ref'>Contact</span>." },

    { id: "register-client", roles: ALL, kw: ["sign up", "create an account", "register", "client account", "become a client", "agency account"],
      a: "To create a client account, go to <span class='ts-ref'>Register</span> and choose <strong>Private Client</strong> or <strong>Agency</strong>, then fill in your name, email and a password (min. 8 characters with a symbol)." },

    { id: "register-reporter", roles: ALL, kw: ["become a reporter", "join as a reporter", "reporter account", "reporter registry", "work as a reporter"],
      a: "Reporters can apply via <span class='ts-ref'>Register</span> → <strong>Reporter</strong>. You'll provide your name, certification (CSR/RPR/CRR), phone and email — certifications can be uploaded after signup." },

    { id: "login-help", roles: ALL, kw: ["log in", "login", "sign in", "forgot password", "password reset", "cant log in", "can't log in"],
      a: "Existing clients and reporters can sign in at <span class='ts-ref'>Login</span>. If you've forgotten your password, use the reset link on that page, or reach out via <span class='ts-ref'>Contact</span>." },

    { id: "about-marina", roles: ALL, kw: ["about marina", "who is marina", "background", "experience", "how long", "years", "credentials", "qualified"],
      a: "Marina has been a court reporter since 2011 — previously a Senior Court Reporter for the Unified Court System at Manhattan Supreme Court, and a Reporter/Stenographer for six years at the Kings County District Attorney's Office. She holds a B.A. in English and Education from Hunter College and has served on the NYSCRA (New York State Court Reporters Association) board since 2021. More on <span class='ts-ref'>About Us</span>." },

    { id: "notable-experience", roles: ALL, kw: ["notable", "cases", "case types", "practice areas", "experience with", "what kind of cases"],
      a: "Since 2011 Marina has reported depositions, arbitrations, trials and hearings across personal injury, medical malpractice, fraud, breach of contract, IP, workplace discrimination, wrongful termination, government ethics hearings, financial-sector disputes and more. Most assignments are confidential; select public-record matters are referenced on request — see <span class='ts-ref'>Notable Experience</span>." },

    { id: "gallery", roles: ALL, kw: ["gallery", "photos", "pictures", "images"],
      a: "See <span class='ts-ref'>Gallery</span> for photos of the team and work." },

    { id: "blogs", roles: ALL, kw: ["blog", "blogs", "articles", "news"],
      a: "Marina's <span class='ts-ref'>Blogs</span> page has articles and updates." }
  ];

  /* Starter questions shown as chips, keyed by page-label (lowercased).
     "_" is the fallback for any page. */
  var SUGGESTIONS = {
    visitor: {
      home: ["What services do you offer?", "How do I request a court reporter?", "What areas do you cover?"],
      "about us": ["What's Marina's background?", "How long has Marina been a court reporter?"],
      services: ["What is Realtime Reporting?", "Do you offer CART services?", "How much does a deposition cost?"],
      gallery: ["What services do you offer?", "How do I contact you?"],
      blogs: ["What services do you offer?", "How do I contact you?"],
      "notable experience": ["What kinds of cases have you worked on?", "Is this confidential?"],
      "contact us": ["How do I reach Marina?", "How do I request a reporter?"],
      login: ["I forgot my password", "How do I create an account?"],
      register: ["What account types can I create?", "How do I sign up as a reporter?"],
      _: ["What services do you offer?", "How do I request a court reporter?", "How do I contact Marina?"]
    }
  };

  root.PublicAssistantKB = { KB: KB, OOS: OOS, SUGGESTIONS: SUGGESTIONS, ROLE_LABEL: ROLE_LABEL };
  if (typeof module !== "undefined" && module.exports) module.exports = root.PublicAssistantKB;
})(typeof window !== "undefined" ? window : this);
