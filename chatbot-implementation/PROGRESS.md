# Chatbot Implementation — Progress Tracker

Update this file only after the user has explicitly confirmed a phase works.
Do not mark a phase Done based on your own testing alone — the user tests in
a real browser against a real API key.

Note: the LLM provider was switched from Gemini to Groq during Phase 2 (the
Gemini key provided had no usable quota). See `00-ARCHITECTURE.md`'s
"Conversation architecture" section for the current provider details.

| # | Phase | File | Status | Date | Notes |
|---|---|---|---|---|---|
| 1 | Widget shell | `phase-01-widget-shell.md` | Done ✅ | 2026-07-27 | |
| 2 | Gemini connection + basic Q&A | `phase-02-gemini-qa.md` | Done ✅ | 2026-07-27 | Provider switched to Groq (`openai/gpt-oss-120b`), see note above |
| 3 | Client-side memory | `phase-03-client-memory.md` | Not Started | | |
| 4 | Quote flow | `phase-04-quote-flow.md` | Not Started | | |
| 5 | Booking intent | `phase-05-booking-intent.md` | Not Started | | |
| 6 | Session closing | `phase-06-session-closing.md` | Not Started | | |
| 7 | Rate limiting & abuse hardening | `phase-07-rate-limiting.md` | Not Started | | |
| 8 | Polish & full QA pass | `phase-08-polish-qa.md` | Not Started | | |

Status values: `Not Started`, `In Progress`, `Done ✅`, `Blocked` (add a note
explaining why if blocked).
