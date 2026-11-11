# 09 — Platforms

The QHC is tool-neutral; each tool reads different files. Q-HEAT writes one
source of truth (`AGENTS.md` + topic docs) and thin tool-specific files that
point to it — never two diverging copies.

> Platform details change often. These pages were checked in November 2026.
> If you can browse, confirm against the vendor docs before writing config,
> and note any difference in the PR.

## Which file each tool reads

| Need | Claude Code | VS Code (Copilot) | Codex | Others (Cursor, Gemini CLI, Aider, …) |
|---|---|---|---|---|
| Always-on instructions | `CLAUDE.md` (use `@AGENTS.md`) | `AGENTS.md`, `.github/copilot-instructions.md`, `CLAUDE.md` | `AGENTS.md` (nested, closest wins) | `AGENTS.md` (most tools) |
| Path-scoped rules | `.claude/rules/*.md` with `paths:` | `.github/instructions/*.instructions.md` with `applyTo:` | Nested `AGENTS.md` | Tool-specific (e.g. `.cursor/rules`) |
| Reusable prompts / commands | Skills (`/name`) | `.github/prompts/*.prompt.md` | Skills | Varies |
| Custom agents / subagents | `.claude/agents/*.md` | `.github/agents/*.agent.md` (also reads `.claude/agents`) | Agent definitions in Codex config | Varies |
| Skills | `.claude/skills/<name>/SKILL.md` | Agent skills (see docs) | Agent Skills format | Agent Skills format (growing support) |
| Hooks | `.claude/settings.json` → `hooks` | Hooks (settings, agent files) | Hooks (see docs) | Varies |
| Permissions | `.claude/settings.json` → `permissions` | Tool approvals, `tools:` in agents | Sandbox + approval policy | Varies |
| MCP servers | `.mcp.json` / settings | `.vscode/mcp.json` | Codex config | Varies |
| Cloud agent environment | Cloud environment settings | `copilot-setup-steps.yml` (Copilot cloud agent) | Cloud environment | Varies |

## Pages

| Page | Covers |
|---|---|
| [claude-code.md](claude-code.md) | Memory files, rules, settings, permissions, hooks, subagents, skills, plugins |
| [vscode-copilot.md](vscode-copilot.md) | Instructions, prompt files, custom agents, skills, hooks, MCP |
| [codex.md](codex.md) | AGENTS.md hierarchy, sandbox and approvals, subagents, worktrees |
| [github-copilot-cloud.md](github-copilot-cloud.md) | Setup steps workflow, firewall, repository instructions |
| [other-agents.md](other-agents.md) | AGENTS.md support across tools; bridging files |
| [skills-standard.md](skills-standard.md) | The Agent Skills `SKILL.md` format |

## Single-source rule

- Shared facts live once (root `AGENTS.md`, `docs/`, path-scoped rule sources).
- Tool files contain only what that tool needs plus a pointer.
- When the same path-scoped rule is needed for two tools, keep one source
  file and generate or mirror the other in the same PR; `audit` flags drift.
