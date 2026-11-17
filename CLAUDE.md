## Project memory

Read `memory.md` first. It has the site structure, finished work, open items and rules.

## codegraph

The `.codegraph/` index maps files, functions, imports and routes.

- Find symbols: `codegraph query "<term>"`.
- Trace relationships: `codegraph explore`, `codegraph context` or `codegraph node <name>`.
- Callers and callees: `codegraph callers <symbol>`, `codegraph callees <symbol>`.
- Before changing a symbol: `codegraph impact <symbol>` and `codegraph affected [files...]`.
- After code changes: `codegraph sync`.
