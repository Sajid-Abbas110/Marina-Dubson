/* ============================================================
   Technical Support — Knowledge Base (scripted answers)
   ------------------------------------------------------------
   This is the ONLY file the content team edits to add/adjust
   answers. No code changes needed.

   An "intent" = a question the assistant can answer.
     id     : unique key (also used for a light page-context boost)
     roles  : which roles may receive this answer
              -> one or more of: admin | private | agency | reporter
     kw     : trigger keywords/phrases (lowercase). Multi-word
              phrases score higher than single words.
     a      : the answer (safe HTML). Use <span class="ts-ref">Tab</span>
              to reference a portal page.

   IMPORTANT: answers must reference ONLY things that exist in the
   portal. Never add general/outside knowledge here.
   ============================================================ */
(function (root) {
  var CLIENT = ["private", "agency"];
  var ALL = ["admin", "private", "agency", "reporter"];

  var ROLE_LABEL = { admin: "Admin", private: "Private Client", agency: "Agency", reporter: "Reporter" };

  /* Phrases that a NON-ADMIN role must never get data for.
     Detected before intent matching -> polite refusal. */
  var OOS = [
    "other client", "another client", "all clients", "everyone", "every client",
    "other agency", "another agency", "other agencies",
    "other reporter", "another reporter", "all reporters", "other reporters",
    "total revenue", "all revenue", "company revenue",
    "all bookings", "everyone's", "all users", "other people",
    "other accounts", "whole system", "system-wide", "system wide",
    "all invoices", "all accounts"
  ];

  var KB = [
    /* ---------- everyone ---------- */
    { id: "hello", roles: ALL, kw: ["hi", "hello", "hey", "what can you do", "who are you", "help me", "how do you work"],
      a: "Hi! I'm <strong>Technical Support</strong> — I help you use the Marina Dubson portal. I know which page you're on and what your role can do. Ask me anything about scheduling, documents, billing or your account, or tap a suggestion below." },
    { id: "contact", roles: ALL, kw: ["contact", "human", "real person", "talk to", "speak to", "call", "phone", "stuck", "cant find", "can't find", "not working", "broken", "help from"],
      a: "For anything I can't resolve, reach the team directly from the <span class='ts-ref'>Messages</span> tab — that's the fastest way to a person at Marina Dubson's office." },
    { id: "profile", roles: ALL, kw: ["profile", "update my details", "change my name", "photo", "picture", "avatar", "bio", "my info"],
      a: "Open <span class='ts-ref'>Settings</span> to update your profile — name, contact details, photo and (for reporters) certification and bio." },
    { id: "password", roles: ALL, kw: ["password", "reset password", "forgot password", "log in", "login", "sign in", "locked out", "2fa"],
      a: "For security I never handle passwords. Use <strong>“Forgot password?”</strong> on the login screen to reset it yourself, or ask an admin to re-send your access. I won't ever ask you to type a password here." },

    /* ---------- client + agency ---------- */
    { id: "create-booking", roles: ALL, kw: ["book", "booking", "schedule", "new booking", "create a booking", "make a booking", "fill the booking form", "fill out the booking", "booking form", "fill the form", "request a reporter", "request reporter", "order", "set up a deposition", "hire"],
      a: "To create a booking, open the 3-step form:<ul><li><strong>Clients &amp; agencies:</strong> <span class='ts-ref'>My Bookings → New Booking</span></li><li><strong>Admin:</strong> <span class='ts-ref'>Calendar → Schedule Booking</span> (or the <span class='ts-ref'>Bookings</span> registry)</li></ul>Then complete the three steps:<ol><li><strong>Proceeding</strong> — type (deposition or arbitration/hearing) and the jurisdiction/venue.</li><li><strong>Logistics</strong> — remote or in-person, date, start time, and the address or Zoom/WebEx link.</li><li><strong>Add-ons</strong> — real-time, rough draft, CART, expedite, plus any protocol notes — then <strong>Finalize</strong>.</li></ol>" },
    { id: "booking-steps", roles: ALL, kw: ["proceeding", "venue", "jurisdiction", "delivery method", "remote", "in person", "in-person", "add-on", "real-time", "real time", "rough draft", "cart", "expedite", "protocol notes", "zoom", "webex", "which fields", "what fields", "fill", "step 1", "step 2", "step 3"],
      a: "The booking form has three steps: <strong>1)</strong> proceeding type + jurisdiction/venue, <strong>2)</strong> delivery (remote or in-person), date, start time and the address or Zoom/WebEx link, and <strong>3)</strong> optional add-ons — real-time streaming, rough draft, CART (accessibility), expedite — plus protocol notes. You can go <strong>Back</strong> between steps before finalizing." },
    { id: "mybookings", roles: CLIENT, kw: ["my bookings", "status", "pending", "confirmed", "accepted", "completed", "submitted", "where is my booking", "track"],
      a: "See everything under <span class='ts-ref'>My Bookings</span>. Statuses read: <strong>Submitted</strong> (received) → <strong>Pending</strong> (under review) → <strong>Accepted/Confirmed</strong> (reporter assigned) → <strong>Completed</strong> (transcript delivered)." },
    { id: "upload-doc", roles: CLIENT, kw: ["upload", "document", "attach", "file", "exhibit", "send a file", "share a document"],
      a: "Go to <span class='ts-ref'>My Documents</span>, choose the booking to attach to, and upload. Accepted types: PDF, DOC/DOCX, TXT, RTF, XLSX, PPTX, PNG, JPG. Transcripts Marina delivers appear here to download." },
    { id: "services", roles: CLIENT, kw: ["services", "what do you offer", "deposition service", "arbitration", "hearings", "offerings", "what can i book"],
      a: "Under <span class='ts-ref'>Services</span> you can book <strong>Depositions</strong> and <strong>Arbitrations/Hearings</strong>. Base rates show as “upon approval”; remote and on-site are quoted per job." },
    { id: "cancellation", roles: CLIENT, kw: ["cancel", "cancellation", "reschedule", "call off", "postpone"],
      a: "Cancellations must be made <strong>before 3:00 PM on the previous business day</strong>. Later than that, the minimum booking fee for the proceeding applies. To cancel, open the booking or message the team." },
    { id: "minfees", roles: CLIENT, kw: ["minimum", "how much", "fee", "price", "cost", "charge", "deposition cost", "arbitration cost"],
      a: "Minimum booking fees are <strong>$400 for a deposition</strong> and <strong>$500 for an arbitration/hearing</strong>. Final pricing depends on length and any add-ons, confirmed on approval." },
    { id: "rates-private", roles: ["private"], kw: ["rate", "rates", "billing", "payment terms", "invoice", "when do i pay", "balance", "outstanding", "how do i pay"],
      a: "Your <span class='ts-ref'>Rates</span> tab shows <strong>Client Terms — standard billing</strong>: payment due within <strong>30 days</strong> of invoice. Any bills appear there. Minimum fees: deposition $400, arbitration/hearing $500." },
    { id: "rates-agency", roles: ["agency"], kw: ["rate", "rates", "billing", "payment terms", "invoice", "when do i pay", "balance", "outstanding", "how do i pay", "statement", "direct deposit"],
      a: "Your <span class='ts-ref'>Rates</span> tab shows <strong>Agency Terms — direct deposit</strong>: <strong>45-day</strong> financial responsibility, payment due within 30 days of invoice. Agency statements are kept outside the portal — contact the operations desk via <span class='ts-ref'>Messages</span> for copies." },
    { id: "messages-how", roles: ALL, kw: ["message", "send a message", "chat with team", "write to marina", "email the office"],
      a: "Open <span class='ts-ref'>Messages</span> and start a thread — it goes straight to the Marina Dubson team. Good for anything specific to one of your bookings." },
    { id: "data-own", roles: CLIENT, kw: ["my next booking", "my balance", "my invoice", "my outstanding", "how much do i owe", "my last booking", "my documents count"],
      a: "In the live portal I'd pull <strong>your own records only</strong> and answer directly. In this scripted build there's no live data lookup — you'll find it under <span class='ts-ref'>Dashboard</span> (counts), <span class='ts-ref'>My Bookings</span> (bookings) and <span class='ts-ref'>Rates</span> (balance). <em>(When upgraded to the data-aware build, this answers from your own records.)</em>" },

    /* ---------- reporter ---------- */
    { id: "rep-first", roles: ["reporter"], kw: ["what do i do first", "getting started", "new here", "just joined", "first steps", "onboard"],
      a: "Welcome aboard — quick start:<ol><li><span class='ts-ref'>Settings</span> — complete your profile (name, certification, bio).</li><li><span class='ts-ref'>Calendar</span> — mark the days you're available.</li><li><span class='ts-ref'>Marketplace</span> — claim any open proceedings you want.</li></ol>Once Marina selects you, the job appears under <span class='ts-ref'>Assignments</span>." },
    { id: "availability", roles: ["reporter"], kw: ["availability", "available", "set availability", "mark days", "calendar", "block off", "my schedule"],
      a: "Open <span class='ts-ref'>Calendar</span> and mark the days you're available. That's what keeps you in the running for new assignments." },
    { id: "claim", roles: ["reporter"], kw: ["claim", "marketplace", "open job", "find work", "get assigned", "how do i get jobs", "browse jobs", "pick up work"],
      a: "Go to <span class='ts-ref'>Marketplace</span> (the Job Claim Hub) to browse open proceedings and <strong>claim</strong> the ones you want. Claiming signals interest — Marina then confirms and it becomes a real assignment." },
    { id: "claim-status", roles: ["reporter"], kw: ["claim status", "my claims", "pending claim", "did i get", "waiting to hear"],
      a: "Track submitted claims under <span class='ts-ref'>Marketplace</span> (Your Claims) and <span class='ts-ref'>Rates</span> (Job Claim Status). Confirmed ones move to <span class='ts-ref'>Assignments</span>." },
    { id: "assignments", roles: ["reporter"], kw: ["assignment", "confirmed job", "my jobs", "what am i working", "upcoming"],
      a: "Your confirmed work lives under <span class='ts-ref'>Assignments</span>. Each one shows the proceeding details; deliver the transcript once it's done." },
    { id: "deliver", roles: ["reporter"], kw: ["deliver", "transcript", "submit transcript", "upload transcript", "turn in", "finish job", "complete"],
      a: "After the proceeding, upload the transcript in <span class='ts-ref'>Documents</span> and attach it to the assignment. That marks your delivery and lets Marina invoice the client." },
    { id: "getpaid", roles: ["reporter"], kw: ["paid", "get paid", "payout", "earnings", "payment", "invoice", "money", "when do i get", "settle"],
      a: "After you finish a job, Marina sends a <strong>Payout Offer</strong> under <span class='ts-ref'>Rates</span>. Accept it and it becomes an entry in <strong>My Invoices</strong>. Payment timing is handled by the office — ask via <span class='ts-ref'>Messages</span> for a specific job." },
    { id: "metrics", roles: ["reporter"], kw: ["efficiency", "delivery rate", "claim success", "reliability", "metrics", "stats", "my numbers", "score"],
      a: "Your <span class='ts-ref'>Dashboard</span> tracks <strong>Transcript Delivery Rate</strong>, <strong>Claim Success Rate</strong> and <strong>On-Site Reliability</strong> — a quick read on your standing in the network." },

    /* ---------- admin ---------- */
    { id: "create-account", roles: ["admin"], kw: ["create account", "new user", "add user", "provision", "onboard", "add a client", "add a reporter", "add an agency", "new login", "invite"],
      a: "Open <span class='ts-ref'>User Accounts</span> → <strong>Create Account</strong>. Pick the role (Client, Agency, Reporter, Staff, Manager, Admin) and, for clients, the type (Private/Agency). Leave the password blank and it <strong>auto-generates</strong> — share it for self-onboarding." },
    { id: "review-booking", roles: ["admin"], kw: ["review booking", "assign", "assign reporter", "requires review", "incoming", "approve booking", "new request"],
      a: "In <span class='ts-ref'>Bookings</span> (Tactical Registry), filter to <strong>Requires Review</strong> to see new requests, then assign a reporter. Use <strong>Reporter Availability</strong> to find who's free." },
    { id: "post-job", roles: ["admin"], kw: ["post job", "new job", "job entry", "create job", "open a job", "list a job"],
      a: "Go to <span class='ts-ref'>Jobs</span> → <strong>New Job Entry</strong>. Posted jobs enter the global pool where reporters can claim them; you confirm from the claims." },
    { id: "payout", roles: ["admin"], kw: ["payout", "pay reporter", "send offer", "reporter payment", "pay a reporter"],
      a: "From <span class='ts-ref'>Invoices</span> (Reporter Matrix) send a reporter a <strong>Payout Offer</strong>. They accept it in their Rates tab and it becomes a settled invoice." },
    { id: "invoice-client", roles: ["admin"], kw: ["invoice client", "bill client", "create invoice", "billing", "charge client", "send invoice"],
      a: "Use <span class='ts-ref'>Invoices</span> (Client Matrix) to raise and track client bills — Draft → Billed → Paid, with Overdue flagged. Terms are 30 days (clients) / 45 days (agencies)." },
    { id: "admin-docs", roles: ["admin"], kw: ["document", "upload doc", "distribute", "rate sheet", "contract", "archive", "share files"],
      a: "In <span class='ts-ref'>Documents</span> upload and categorize files (rate sheet, contract, invoice, transcript, etc.), attach them to a booking, and distribute to clients or reporters." },
    { id: "reports", roles: ["admin"], kw: ["report", "reports", "analytics", "export", "numbers", "revenue report"],
      a: "Open <span class='ts-ref'>Reports</span> to generate operational and financial readouts, or use <strong>Export</strong> on the dashboard for a quick pull." },
    { id: "campaigns", roles: ["admin"], kw: ["campaign", "email campaign", "marketing", "newsletter", "outreach", "blast"],
      a: "Manage outreach in <span class='ts-ref'>Campaigns</span> — audience size, open/click rates and launch controls for attorney/agency email." },
    { id: "admin-settings", roles: ["admin"], kw: ["settings", "lockdown", "security", "system config", "off-grid", "root profile"],
      a: "<span class='ts-ref'>Settings</span> (Configuration Core) holds root identity, security, policies, notifications and the <strong>Emergency Off-Grid</strong> lockdown that disables external endpoints." },
    { id: "admin-services", roles: ["admin"], kw: ["add service", "service catalog", "edit rate", "pricing", "new service", "change fees"],
      a: "Manage the <span class='ts-ref'>Services</span> catalog and rate templates — these feed the pricing clients see when they book." }
  ];

  /* Starter questions shown as chips, keyed by role then page-label
     (lowercased). "_" is the fallback for any page. */
  var SUGGESTIONS = {
    admin: {
      dashboard: ["What needs my attention today?", "How do I create a new account?", "How do I assign a reporter?"],
      bookings: ["How do I assign a reporter?", "What does 'Requires review' mean?", "How do I post a job?"],
      jobs: ["How do I post a job?", "How do reporters claim jobs?", "How do I pay a reporter?"],
      "user accounts": ["How do I create a new account?", "How are passwords set?", "What roles can I assign?"],
      invoices: ["How do I invoice a client?", "How do I send a payout offer?", "What are the payment terms?"],
      settings: ["What is Emergency Off-Grid?", "How do I update the root profile?"],
      _: ["How do I create a new account?", "How do I assign a reporter?", "How do I invoice a client?"]
    },
    private: {
      dashboard: ["How do I book a reporter?", "Where do I see my bookings?", "What are my payment terms?"],
      "my bookings": ["How do I book a reporter?", "What do the statuses mean?", "How do I cancel a booking?"],
      rates: ["What are my payment terms?", "What are the minimum fees?", "How do I pay an invoice?"],
      "my documents": ["How do I upload a document?", "Where are my transcripts?"],
      services: ["What services can I book?", "How much is a deposition?"],
      _: ["How do I book a reporter?", "What are the minimum fees?", "How do I contact the team?"]
    },
    agency: {
      dashboard: ["How do I book a reporter?", "What are our agency terms?", "Where do I see our bookings?"],
      rates: ["What are our agency terms?", "How are statements handled?", "What are the minimum fees?"],
      "my bookings": ["How do I book a reporter?", "How do I cancel a booking?"],
      _: ["How do I book a reporter?", "What are our agency payment terms?", "How do I contact the team?"]
    },
    reporter: {
      dashboard: ["What do I do first?", "How do I get assigned to jobs?", "How do I get paid?"],
      marketplace: ["How do I claim a job?", "How do I track my claims?"],
      calendar: ["How do I set my availability?"],
      assignments: ["Where are my confirmed jobs?", "How do I deliver a transcript?"],
      rates: ["How do I get paid?", "What is a payout offer?"],
      _: ["What do I do first?", "How do I claim a job?", "How do I get paid?"]
    }
  };

  root.TechnicalSupportKB = { KB: KB, OOS: OOS, SUGGESTIONS: SUGGESTIONS, ROLE_LABEL: ROLE_LABEL };
  if (typeof module !== "undefined" && module.exports) module.exports = root.TechnicalSupportKB;
})(typeof window !== "undefined" ? window : this);
