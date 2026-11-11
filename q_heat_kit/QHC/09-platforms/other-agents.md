# Other agents

## AGENTS.md as the common denominator

`AGENTS.md` is an open format stewarded by the Agentic AI Foundation under the
Linux Foundation. It is plain Markdown with no required fields; agents read
whatever headings you use. Supporting tools include OpenAI Codex, GitHub
Copilot, VS Code, Cursor, Gemini CLI, Google Jules, Aider, goose, opencode,
Zed, Warp, Devin, JetBrains Junie, Amp, Windsurf, Factory and others.

Conventions shared across tools:

- Recommended sections: overview, build and test commands, code style,
  testing instructions, security considerations; plus PR/commit rules.
- Nested files in monorepos; **the closest file to the edited code wins**.
- An explicit user prompt overrides `AGENTS.md`.

## Bridging tools that use their own file

| Tool | Bridge |
|---|---|
| Claude Code | `CLAUDE.md` containing `@AGENTS.md` |
| Gemini CLI | Configure the context file name to include `AGENTS.md` in its settings |
| Aider | Add `AGENTS.md` to the files it reads in its config |
| Cursor | Reads `AGENTS.md`; project rules in `.cursor/rules/` for path-scoped needs |
| Older tools | Rename to `AGENTS.md` and symlink the old name (symlinks need admin on Windows) |

## Choosing what to support

During `init`, ask which tools the team uses (intake). Write bridge files only
for those; record them in `harness/manifest.json` so `audit` can check they
still point to the right place.

## When a tool cannot follow a rule

Some tools lack hooks, permissions or subagents. The harness then relies on
the rules every tool shares: CI checks, CODEOWNERS, branch protection and the
policy check. Those are tool-independent and therefore the real enforcement layer.
