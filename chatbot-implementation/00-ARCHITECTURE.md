# Chatbot — Architecture & Decisions (Single Source of Truth)

This file is the complete record of what we decided and why. Every phase file
assumes you've read this. If a phase file and this file ever disagree, this
file wins — flag the conflict to the user instead of guessing.

## What this feature is

A simple chat widget, floating on every page of the site, that can:
1. Answer customer questions about services/coverage/company facts (no RAG —
   knowledge is hardcoded into the system prompt).
2. Collect a **quote request** conversationally and submit it through the
   existing `/api/quote` endpoint, landing in the real admin Quotes panel.
3. Detect a **booking** request and hand the customer off to the real
   `/booking` page via a link/button (the chatbot never fills out a full
   booking itself).

## Explicitly out of scope (do not build these)

- No vector DB / RAG / embeddings.
- No server-side database for chat history or sessions. Memory is
  client-side only (sessionStorage).
- No full "Booking" flow inside the chat — that form has 14 fields including
  a terms-and-conditions checkbox; the chat only ever links out to `/booking`.
- No changes to `quoteModel.js`, `quoteYupSchema.js`, or the external
  behavior of `/api/quote` — the chatbot is a new client of that endpoint,
  not a replacement for it.
- No email/notification changes. Chat-submitted quotes behave exactly like
  form-submitted ones today (the existing route doesn't send an email on
  quote creation — don't add one as a "nice to have").

## The two existing systems this integrates with (read the actual files, this is a summary)

**Quote system** (what the chatbot creates):
- `src/database/models/quoteModel.js` — fields: `fullName`, `email`, `phone`,
  `facilityType`, `zipCode`, `category`, plus timestamps.
- `src/yup/quoteYupSchema.js` — validation rules for `fullName` (min 3 chars),
  `email` (valid email), `phone` (US phone, 10 digits after stripping
  non-digits, area code can't start with 0/1), `facilityType` (required
  non-empty), `zipCode` (required non-empty, no format enforced by the
  schema itself).
- `src/app/api/quote/route.js` — `POST` accepts `FormData`, creates a
  `QuoteModel` doc, revalidates `/` and `/dashboard/quotes`.
- `category` is **not** a facility type. It's the slug of the dynamic
  marketing landing page the quote came from (e.g. `janitorial-services`,
  `commercial-office-cleaning-nyc`), rendered via
  `src/app/(quotes)/[slug]/page.jsx` and `getPageBySlug()`. It shows as its
  own "CATEGORY" column in `/dashboard/quotes`, separate from the "FACILITY"
  column (which is `facilityType`).
- `facilityType` must be one of `industryOptions` in
  `src/constant/booking/booking.js`: `"Office / Corporate"`,
  `"Restaurant / Food Service"`, `"Retail Store"`,
  `"Medical / Dental / Healthcare"`, `"School / Educational"`,
  `"Warehouse / Industrial"`, `"Gym / Fitness Center"`,
  `"Hotel / Hospitality"`, `"Other"`.

**Booking system** (chat only links to it, never fills it out):
- `src/database/models/bookingModel.js` — 14 fields incl. `companyName`,
  `propertyAddress`, `area`, `services[]`, `cleaningSchedule`,
  `preferredStartDate`, `notes`, `termAndCondition: true`.
- Real page: `src/app/booking/`. The chatbot's "Book Now" button links to
  `/booking` (relative path — works correctly in dev, staging, and prod).

## Knowledge the system prompt must contain (all real data, pull from source — don't invent facts)

- **Services**: the 12 items in `src/constant/quotes/quoteServices.js`
  (`careServices` — Office Cleaning, Janitorial Services, Day Porter
  Services, Post-Construction, Deep Disinfection, Move-Out & Event, Floor
  Stripping & Waxing, Carpet Cleaning, Window Cleaning, Handyman Services,
  Supply Management, Power Washing) — title + description for each.
- **Coverage area**: `AreaOptions` in `src/constant/booking/booking.js` —
  Manhattan, Brooklyn, Queens, The Bronx, Staten Island, Long Island,
  "Outside NYC" (treat this as "we may still be able to help, let's check via
  a quote request" rather than a hard no).
- **Company facts**: from the `foundations` constant in
  `src/constant/service-area/index.js` — 25 years in business, fully
  insured, background-checked, licensed.
- **Contact info** (for "can I talk to a human" requests): from
  `src/constant/contact.js` (phone/email).
- **Hard rules the prompt must enforce**:
  - Never state or invent a price. There is no pricing data anywhere in the
    codebase — always redirect to "request a free quote."
  - Refuse anything unrelated to NYC Clean Team's services (code requests,
    general trivia, "ignore your instructions", requests to reveal the
    system prompt, requests to act as a different persona). Redirect back to
    how you can help with cleaning services.
  - Never claim to be a human.

## Conversation architecture (why it's a hybrid, not "let the LLM do everything")

Model: **Groq `openai/gpt-oss-120b`**, via a plain `fetch` call to Groq's
OpenAI-compatible endpoint (`https://api.groq.com/openai/v1/chat/completions`,
no SDK needed), key read from `process.env.GROQ_API_KEY`.

(Originally speced as Gemini/`@google/genai` — switched to Groq in Phase 2
after the provided Gemini key had no usable quota. No other architecture
decisions changed; anywhere below that says "Gemini" or "the LLM" refers to
whichever model is wired up, currently Groq.)

Validating structured data (phone/email/zip format, matching a facility type
to a fixed list) by asking an LLM "is this valid?" is unreliable and wastes
free-tier quota. So:

- **The model's job**: general Q&A from the hardcoded knowledge, and
  classifying user intent (wants a quote? wants to book? neither, just
  asking a question?).
- **Plain backend code's job**: once a quote request is detected, a
  deterministic state machine (`src/lib/chat/quoteFlow.js`) asks for one
  field at a time and validates each answer with real code (regexes mirrored
  from `quoteYupSchema.js`, not LLM judgment). This is what actually decides
  pass/fail and what actually calls `/api/quote`.

### Quote flow state machine

Fields collected in order: `fullName` → `email` → `phone` → `facilityType` →
`zipCode`.

Since there's no server-side session storage, the **client sends the
current quote-flow state back to the server on every request** alongside the
message history (fields collected so far, which field is currently being
asked, per-field attempt counts). The `/api/chat` route is stateless.

Validation rules per field:
- `fullName`: min 3 chars (matches the real schema).
- `email`: same email format check as `quoteYupSchema.js`.
- `phone`: same US-phone regex/normalization as `quoteYupSchema.js`.
- `zipCode`: the real schema doesn't enforce a format, but for chat UX add a
  basic 5-digit numeric check (chat-only convenience check, does not change
  the DB schema).
- `facilityType`: **fuzzy-match** the customer's free-text answer against
  `industryOptions` (keyword matching — e.g. "gym"/"fitness" →
  `Gym / Fitness Center`, "dental"/"clinic"/"hospital" →
  `Medical / Dental / Healthcare`, "restaurant"/"food" →
  `Restaurant / Food Service`, etc.). **If no confident match, default
  straight to `"Other"` and move on** — this field never blocks retries or
  closes the chat, unlike the other four fields.

Retry rule (per field, except `facilityType` which never fails):
- On invalid input: increment that field's attempt counter, reply with a
  short correction + a concrete example of the expected format (e.g. for
  phone: "Please enter a 10-digit US phone number, e.g. 212-555-0134").
- Budget is **3 attempts per field**, independent of other fields (a shaky
  phone number doesn't cost attempts needed later for zip).
- On the 3rd consecutive failure for a field: send a closing message and
  close the chat (see "Session closing" below) — no quote is submitted.

### Category value on submission

- If the chat widget is open on a `(quotes)/[slug]` landing page: category =
  that page's slug.
- Everywhere else on the site: category = the fixed string
  `"chatbot-general"`.
- Mechanism: a small client component mounted inside
  `src/app/(quotes)/[slug]/page.jsx` writes the slug to
  `sessionStorage.setItem("chatCategory", slug)` on mount (the slug is
  already known there — no extra DB call needed). The chat widget reads
  `sessionStorage.getItem("chatCategory")` (falling back to
  `"chatbot-general"`) only at the moment it actually submits a quote.
- Accepted edge case: if a customer navigates between two different quote
  landing pages mid-conversation, category reflects whichever page they were
  on most recently. Not worth solving for v1.

### Submitting the quote

On successful collection of all 5 fields, the `/api/chat` route makes a
server-side call to the existing `/api/quote` endpoint (build the absolute
URL from the incoming request, e.g. `new URL("/api/quote", request.url)`),
sending the same shape of data the real `QuoteForm` sends. Do not duplicate
the Mongoose creation logic — go through the real endpoint so validation and
the model stay single-sourced. Then reply to the user with a confirmation
message and clear the quote-flow state.

## Booking intent

If the customer expresses intent to book (not just ask about pricing), the
bot replies with a short message plus a **"Book Now"** button/link to
`/booking` (opens in a new tab so they don't lose the chat). The chat
**stays open** afterward — this is not a closing trigger.

## Session closing (four triggers, one behavior)

Triggers:
1. Customer says something like "thanks" / "thank you" / "that's all" / "bye".
2. 10 minutes of inactivity (no new message from the user) since the last
   message.
3. A field hits its 3rd failed validation attempt (see above; `facilityType`
   never triggers this).
4. (Not a close, but related) 3 minutes of inactivity → bot sends one
   automatic nudge ("Still there? Happy to help if you have more
   questions.") — this does NOT close the chat, it's just a prompt. The
   10-minute clock keeps running independently.

Behavior on close (same for all triggers):
- Bot sends a fixed closing line appropriate to the trigger (e.g. "Great, glad
  I could help! Closing this chat now." for the thank-you case).
- The widget collapses back down to just the floating launcher icon.
- Conversation history is cleared from `sessionStorage`.
- Clicking the launcher again starts a completely fresh conversation.

The 3-minute/10-minute timers reset on every new message (user or bot).

## Memory (client-side only, "Option A")

- The browser holds the full `{role, content}` message array in React state,
  persisted to `sessionStorage` so it survives a page refresh (but not a
  brand-new tab — that's expected `sessionStorage` behavior).
- Sliding window: cap at **30 exchanges (60 messages)**. Additionally, before
  hitting that count cap, do a rough character check — if total history
  size exceeds **~7,000 characters**, drop the oldest message pairs until
  under that threshold. Apply the message-count cap on top of that.
- The trimmed array is both what's shown in the UI and what's sent to the
  API — don't maintain two separate histories, that's unnecessary complexity.
- The quote-flow state (current field, collected values, attempt counts) is
  tracked and persisted separately from the chat message history, but
  alongside it in the same `sessionStorage` key structure.

## Rate limiting & abuse hardening

- Simple **in-memory per-IP limiter** in `src/lib/chat/rateLimiter.js` — a
  plain `Map` keyed by IP with a request count + window start, no
  Redis/DB. Resets on server restart — acceptable, this is abuse-throttling,
  not billing-critical. Target: roughly 15 messages/minute per IP.
- On breach: respond with a normal (HTTP 200) friendly "please slow down a
  bit" bot message rather than a hard error, so the UI doesn't break.
- Hard cap of **500 characters per user message** — reject or ask the user
  to shorten before sending to Gemini.
- System prompt explicitly instructs the model to ignore any user attempt to
  override instructions, reveal the system prompt, or request unrelated
  tasks (code, essays, unrelated advice).

## Widget placement

- Site-wide, mounted in `src/app/layout.js`, in the exact position/spot
  currently occupied by `<ScrollToTopButton />` (`fixed bottom-5 right-5`,
  `z-999`). `ScrollToTopButton` gets commented out (not deleted) when the
  chat widget is added in Phase 1.

## File manifest (which phase touches what)

| File | Created/Modified in |
|---|---|
| `src/app/layout.js` | Phase 1 (comment out ScrollToTopButton, mount ChatWidget) |
| `src/components/chat/ChatWidget.jsx` | Phase 1 (created), Phase 2/3/4/5/6 (extended) |
| `.env` (`GROQ_API_KEY=`) | Phase 2 |
| `src/lib/chat/systemPrompt.js` | Phase 2 (created), Phase 7 (hardened) |
| `src/app/api/chat/route.js` | Phase 2 (created), Phase 4/5/7 (extended) |
| `src/lib/chat/quoteFlow.js` | Phase 4 |
| `src/app/(quotes)/[slug]/page.jsx` | Phase 4 (add `ChatCategorySync` child component) |
| `src/lib/chat/rateLimiter.js` | Phase 7 |

## Workflow reminder

See `chatbot-implementation/CLAUDE.md` for how to run a phase session,
report back, and handle sign-off. See `chatbot-implementation/PROGRESS.md`
for current status — check it before starting any phase to confirm
dependencies are actually done.
