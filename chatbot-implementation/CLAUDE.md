# Chatbot Implementation — Workflow Instructions

You are implementing one phase of a multi-session chatbot build. Each phase
is done in its own fresh Claude Code session with no memory of prior
sessions — this file, `00-ARCHITECTURE.md`, and `PROGRESS.md` are your only
context. Read all three before writing any code.

## Before you start

1. Read `chatbot-implementation/00-ARCHITECTURE.md` in full. It's the single
   source of truth for every decision (data model mapping, validation
   rules, timers, category logic, etc.). Don't re-derive or second-guess
   these decisions — they were already discussed and confirmed with the
   user across a long conversation. If something in the phase file seems to
   contradict it, say so to the user instead of picking one silently.
2. Read `chatbot-implementation/PROGRESS.md`. Confirm the phase you've been
   asked to implement has its dependencies marked "Done ✅". If a dependency
   isn't done, tell the user instead of proceeding or trying to build it
   yourself.
3. Read only the phase file you were asked to implement (e.g.
   `phase-04-quote-flow.md`). Do not jump ahead and implement later phases
   "while you're at it" — later phases assume things (like the collapse UI
   from Phase 6) that may not exist yet, and building ahead makes it harder
   to isolate what broke if a test fails.

## While implementing

- Match the existing codebase's conventions: Next.js App Router, Tailwind
  utility classes, `"use client"` where needed. Look at existing components
  for style (e.g. `src/components/ButtonSolid.jsx`, `src/components/quote/QuoteForm.jsx`,
  `src/components/ScrollToTopButton.jsx`) for visual/structural consistency
  — the chat widget should look like it belongs on this site, not like a
  generic bolt-on.
- Don't add abstractions, config options, or error handling for scenarios
  the architecture doc doesn't call for. Simple and direct beats flexible.
- Don't touch `quoteModel.js`, `quoteYupSchema.js`, or change the external
  behavior of the existing `/api/quote` route. The chatbot is a new client
  of it, not a replacement.
- If `GROQ_API_KEY` is required for this phase and missing/empty in
  `.env`, tell the user rather than guessing or stubbing around it.
  (Note: the LLM provider was switched from Gemini to Groq during Phase 2 —
  see `00-ARCHITECTURE.md`'s "Conversation architecture" section.)

## When you're done implementing a phase

Report back to the user in this exact shape:

1. **What I implemented** — files created/modified, one line each.
2. **What to test** — concrete, numbered steps the user can follow in the
   browser (start the dev server if it's not already running).
3. **Expected behavior** — what should happen at each step, so the user
   knows what "working" looks like vs. a bug.

Do **not** mark the phase as done in `PROGRESS.md` yourself, and do **not**
commit yet. Wait for the user to explicitly confirm the phase works (e.g.
"phase is ok", "tested, works").

## After the user confirms a phase is OK

1. Update `chatbot-implementation/PROGRESS.md`: set that phase's status to
   `Done ✅`, fill in today's date.
2. Create a git commit of the changes for this phase only (`git add` the
   specific files touched this phase, not `-A`). Commit message format:
   `feat: chatbot phase N - <short title>` (match the phase file's title).
   **Commit only — do not push.**
3. Tell the user the phase is marked done and committed, and that they can
   start a fresh session with the next phase file whenever ready.

## If the user reports something is broken

Fix it within this same session/phase — don't blame it on a "future phase"
unless the architecture doc genuinely defers that behavior to a later phase
(e.g. the visual "collapse to launcher" doesn't fully exist until Phase 6 —
it's fine for Phase 4's retry-exhaustion close to just be a text message
until then). If you're not sure whether something is in scope for the
current phase, say so and ask rather than guessing.
