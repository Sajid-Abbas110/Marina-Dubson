# Technical Support — Developer Integration Guide

An in-portal, role-aware help assistant for the Marina Dubson court-reporting CRM.
**Phase 1 = scripted (no LLM).** The files are structured so a data-aware / LLM
upgrade later is a config change, not a rewrite.

---

## 1. What's in this folder

| File | Purpose |
|---|---|
| `technical-support.js` | The widget + scripted engine. Framework-agnostic. |
| `technical-support-kb.js` | The answers (intents, keywords, suggestions, refusal list). **This is the only file the content team edits.** |
| `technical-support.css` | Styles. Everything namespaced under `.ts-` so it won't collide with the portal. |

No build step, no dependencies. Fonts (IBM Plex Sans/Mono) are optional — the CSS falls back to system fonts.

React mount point: [app/components/TechnicalSupportWidget.tsx](../../app/components/TechnicalSupportWidget.tsx).
It is wired into the four authenticated portal layouts only:
[app/admin/layout.tsx](../../app/admin/layout.tsx),
[app/components/layout/PortalLayout.tsx](../../app/components/layout/PortalLayout.tsx) (used by client/reporter/staff).

---

## 2. ⚠️ Two hard rules

### a) Portal pages only — never the public site
The widget is mounted only inside the authenticated portal layouts above. Do not
add it to the root layout or any public route.

### b) `role` must come from the server-verified session
`TechnicalSupportWidget` reads `role` (and `clientType` for private/agency) from
the `user` object the app already stores from `/api/auth/login` — the same
source `PortalHeader`/`ProtectedRoute` use — never from a query string or
editable global. In scripted mode the role only decides **which generic how-to
text** shows (no private records are ever read on the client), but keeping it
honest here matters the moment data-aware mode (section 6 below) is turned on.

---

## 3. Editing the answers

All content lives in `technical-support-kb.js`. Each intent:

```js
{ id: "cancellation",
  roles: ["private","agency"],        // who may receive it
  kw: ["cancel","cancellation","reschedule"],  // triggers (lowercase)
  a:  "Cancellations must be made <strong>before 3:00 PM…</strong>" }  // safe HTML
```

- Add an intent → add an object to `KB`.
- Add starter chips → edit `SUGGESTIONS[role][pageLabelLowercased]`.
- Add a phrase non-admins must be refused data for → add to `OOS`.
- **Only put things that exist in the portal.** No outside/general knowledge.

Note: internal `STAFF`/`MANAGER`/`SUPER_ADMIN` accounts are mapped to the
`admin` KB role in `TechnicalSupportWidget.tsx` (`roleForUser`) since the KB
only ships `admin | private | agency | reporter` answer sets.

---

## 4. Upgrade path → data-aware / LLM (Option A or B) — later

The widget already supports an `api` mode:

```js
window.TechnicalSupport.mount({ role, page, mode: "api", apiEndpoint: "/api/assistant/ask" })
```

In `api` mode the widget POSTs `{ question, page }` with `credentials:"same-origin"`
and renders the JSON reply. **It deliberately does NOT send the role** — the
backend must derive it from the session.

### Backend contract — `POST /api/assistant/ask`

Implement the isolation **server-side, at the query layer** (this is the whole
security model — do not rely on the widget or on prompt instructions):

```
1. IDENTIFY   Read the session -> userId + role. Reject if unauthenticated.
2. SCOPE      Build the data filter from role:
                 admin    -> no filter (all records)
                 private  -> WHERE client_id  = session.userId
                 agency   -> WHERE agency_id  = session.userId
                 reporter -> WHERE reporter_id = session.userId
3. RETRIEVE   Query ONLY within that scope (+ the static workflow KB,
              which is safe for everyone).
4. ANSWER     Scripted: match intent as this widget does.
              LLM (Option A/B): pass ONLY the retrieved records + workflow
              rules to the model with: "Answer only from the provided
              context; if it isn't there, say you don't have it. Never use
              outside knowledge." No record the user can't see is ever put
              in the prompt.
5. GUARDRAIL  Out-of-scope request (scoped query returns nothing / references
              another party) -> { declined:true }.
6. LOG        Write an audit row (section 5) — server-side is authoritative.
```

**Response shape:**
```json
{ "answer": "<safe HTML string>", "declined": false, "intent": "getpaid" }
```

Because isolation happens at steps 1–3, a non-admin cannot extract another
role's data even with an adversarial prompt — the data never enters the response.

---

## 5. Audit logging

Every question is logged with the asker's role. Two layers:

- **Server (authoritative):** in `api` mode, step 6 above writes the row. Suggested columns:
  `id, at (utc), user_id, role, page, question, result (ok|decline|none), intent, mode`.
- **Client (current, dev-only mirror):** `TechnicalSupportWidget.tsx` passes an
  `onLog` that currently just `console.log`s. It is **not** an audit record —
  wire it to a real `/api/assistant/log` endpoint (`navigator.sendBeacon`) once
  one exists. Never treat the client log as the audit record — it can be tampered with.

---

## 6. Scripted-mode limitations (set expectations)

- Answers only questions the KB anticipates; unrecognized phrasing → polite
  fallback that routes the user to **Messages**. (Upgrading to Option A removes this.)
- It does **not** read live records in scripted mode; data questions point the
  user to the right tab. (Option A/data-aware mode answers from their own records.)
- Refusal for non-admins is keyword-based (`OOS` list). The real guarantee comes
  from the server-side scoping in section 4 once data-aware mode is on.

---

## 7. Roles reference

| role value | Portal dashboard | Data scope (enforced server-side in api mode) |
|---|---|---|
| `admin` | Admin command center (also STAFF/MANAGER/SUPER_ADMIN) | Everything |
| `private` | Private Client portal | Own account only |
| `agency` | Agency portal | Own agency's records only |
| `reporter` | Reporter portal | Own assignments/payouts only |
