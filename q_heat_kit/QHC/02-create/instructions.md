# Writing the instruction files

## Why one big file fails

A giant instruction file eats the context budget, buries rules in the middle
where models recall them worst, makes red lines look the same as suggestions,
only ever grows, and accumulates contradictions. Split it.

## Root `AGENTS.md` — the entry map

Template: [AGENTS.md.tmpl](../../templates/root/AGENTS.md.tmpl). Limit 150 lines
(aim for ~100). Sections, in this order:

1. **Purpose** — 1–2 sentences: what the project is.
2. **Quick start** — exact commands: setup, start, fast check, full check.
3. **Session routine** — clock-in and clock-out steps
   ([session-lifecycle.md](../03-operate/session-lifecycle.md)).
4. **Hard rules** — at most 15, each one line, numbered, the most critical
   first. Things that must never happen (frozen paths, no secrets, no
   weakening tests, one feature at a time).
5. **Definition of done** — the 4–5 conditions ([definition-of-done.md](../03-operate/definition-of-done.md)).
6. **Routing map** — links to topic docs, each with a one-line description
   **and when to read it**: "`docs/api.md` — read before adding an endpoint".
7. **Harness changes** — "Do not edit harness files; ask for `Q-HEAT change`".
8. **Closing reminder** — repeat the top 2–3 hard rules at the bottom.

## What stays out of the root file

Long history, one-module detail, examples for one subsystem, tutorials,
architecture explanations (→ `ARCHITECTURE.md`), and anything the code already
expresses (types, config, comments).

## Topic docs

- One subject per file, 50–150 lines, under `docs/` or next to the module.
- Start with "Read this when…". End with links to related docs.
- Path-scoped rules for files that match a pattern: `.claude/rules/*.md` with
  `paths:` and `.github/instructions/*.instructions.md` with `applyTo:` — same
  content, generated from one source ([09-platforms](../09-platforms/README.md)).

## Nested `AGENTS.md`

Put one in a module or package when it has its own commands or rules. The
nearest file to the edited code wins; keep each short and do not repeat root rules.

## Every rule has source, scope, expiry

Write rules so a future auditor can tell why they exist:

```markdown
7. Never call the payments API from UI code. <!-- src: ADR-0004; scope: src/ui/**; review: 2027-06 -->
```

## `CLAUDE.md`

Claude Code reads `CLAUDE.md`, not `AGENTS.md`. Create `CLAUDE.md` containing
`@AGENTS.md` plus only Claude-specific notes. A symlink also works but needs
admin rights on Windows; prefer the import.

## Existing instruction files

Never delete them. Merge: move shared facts into `AGENTS.md` and topic docs;
make tool-specific files point to `AGENTS.md`; record what moved in the init
plan. If two files contradict each other, ask the human which is right.

## Writing style for agent instructions

- Imperative, specific, checkable: "Run `npm test` before committing", not
  "make sure things work".
- Name exact commands, paths and file names.
- Say what to do instead of only what not to do.
- No emphasis inflation (ALL CAPS everywhere means nothing is important).
- Test instructions on real tasks; delete ones that do not change behaviour.
