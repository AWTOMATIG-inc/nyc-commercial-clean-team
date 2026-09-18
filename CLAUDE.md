## chatbot implementation

Working on the website chatbot? Read `chatbot-implementation/CLAUDE.md`
first — it has the phase workflow rules. The full architecture and all
decisions live in `chatbot-implementation/00-ARCHITECTURE.md`, and current
progress is tracked in `chatbot-implementation/PROGRESS.md`.

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
