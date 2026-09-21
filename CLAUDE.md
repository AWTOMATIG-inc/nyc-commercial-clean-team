## chatbot implementation

Working on the website chatbot? Read `chatbot-implementation/CLAUDE.md`
first — it has the phase workflow rules. The full architecture and all
decisions live in `chatbot-implementation/00-ARCHITECTURE.md`, and current
progress is tracked in `chatbot-implementation/PROGRESS.md`.

## GSC indexing fix

Working on the Google Search Console indexing problem? This is a
multi-session task list — each task is meant to be run in its own fresh
Claude session. Read `gsc-tasks.md` first (it has the workflow rules and
non-negotiables at the top, including "commit only, never push" and "never
regress performance"), then `memory.md` for current progress before doing
any task. `gsc-implementation.md` has the full technical investigation and
root-cause analysis behind the plan, and `report.md` is the original GSC
audit that kicked this off (note: `gsc-implementation.md` documents where
that original audit got things wrong).

## codegraph

This project has a CodeGraph index at `.codegraph/` (SQLite-backed code
intelligence graph of files, functions, imports, routes, and their
relationships).

Rules:
- For finding symbols, prefer `codegraph query "<term>"` over grep/glob.
- For "how does X relate to Y" / call-path questions, prefer `codegraph explore <query...>`, `codegraph context <task...>`, or `codegraph node <name>` over manually tracing code.
- To find who calls or is called by a symbol, use `codegraph callers <symbol>` / `codegraph callees <symbol>`.
- Before changing a symbol, check blast radius with `codegraph impact <symbol>` and find affected tests with `codegraph affected [files...]`.
- After modifying code, run `codegraph sync` to keep the index current.
