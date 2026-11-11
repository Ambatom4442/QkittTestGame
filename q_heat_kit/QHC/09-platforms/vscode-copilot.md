# VS Code with GitHub Copilot

## Customisation types

| Type | Location | Use for |
|---|---|---|
| Always-on instructions | `AGENTS.md`, `.github/copilot-instructions.md`, `CLAUDE.md` | Project-wide commands and conventions |
| File-based instructions | `.github/instructions/<topic>.instructions.md` with `applyTo: "src/api/**"` | Rules for matching files |
| Prompt files | `.github/prompts/<name>.prompt.md` | Reusable task prompts (`/name`) |
| Custom agents | `.github/agents/<name>.agent.md` | A recurring role with its own tools and guidance |
| Agent skills | Skill folders with `SKILL.md` | Multi-step team procedures with scripts |
| Hooks | Settings, repo, or agent files | Actions at workflow events |
| MCP servers | `.vscode/mcp.json` or connectors | External tools and data |
| Plugins | Marketplace | Bundles of the above |

VS Code's own guidance: conventions → instructions; repeated multi-step process
→ skill; recurring role → custom agent; external service → MCP; workflow event
→ hook; one-off → put it in the prompt; if the agent already does it right,
add nothing.

## Custom agent files

Locations: `.github/agents/*.agent.md` (workspace), `~/.copilot/agents/` (user).
VS Code also reads `.claude/agents/*.md` in Claude format, so one reviewer
definition can serve both tools if written in Claude format.

Common frontmatter: `name`, `description` (required for Copilot), `tools`,
`model`, `model-policy`, `skills`, `user-invocable`, `disable-model-invocation`,
`agents` (allowed subagents), `hooks`, `mcp-servers`, `target`.
`handoffs` exist only in the deprecated Local harness (scheduled for removal in
February 2027) — do not build workflows on them.

Template: [q-heat.agent.md](../../adapters/vscode/agents/q-heat.agent.md).

## Mapping the harness

| Harness piece | VS Code file |
|---|---|
| Root map | `AGENTS.md` (shared with other tools) |
| Path-scoped rule | `.github/instructions/*.instructions.md` mirrored from `.claude/rules/` |
| Session routine as a command | `.github/prompts/next-feature.prompt.md` |
| Reviewer | `.claude/agents/reviewer.md` (read by both) or `.github/agents/reviewer.agent.md` |
| Q-HEAT | `.github/agents/q-heat.agent.md` + `.github/prompts/q-heat-*.prompt.md` |

## Permissions

Restrict each custom agent's `tools` list; reviewers get read and search only.
Keep terminal auto-approval narrow (documented check commands only). Use
organisation policies where available for MCP and model access.

## Monorepos

A setting allows discovering customisations from the parent repository root;
nested `AGENTS.md` files give per-package rules.
