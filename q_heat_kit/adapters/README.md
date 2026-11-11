# Adapters

Optional. They let people call Q-HEAT with a slash command or pick it from an
agent list instead of typing "Read q_heat_kit/AGENTS.md, then …". The adapter
only points at the kit; all rules stay in `q_heat_kit/`.

Installing an adapter is itself a harness change: do it on a `harness/*`
branch, list the files in `harness/manifest.json`, and get the PR approved.

## Claude Code

| Copy | To | Gives you |
|---|---|---|
| [claude/skills/q-heat/SKILL.md](claude/skills/q-heat/SKILL.md) | `.claude/skills/q-heat/SKILL.md` | `/q-heat init`, `/q-heat change …`, etc. |
| [claude/agents/q-heat.md](claude/agents/q-heat.md) | `.claude/agents/q-heat.md` | A Q-HEAT subagent (also visible in VS Code) |

## VS Code (GitHub Copilot)

| Copy | To | Gives you |
|---|---|---|
| [vscode/agents/q-heat.agent.md](vscode/agents/q-heat.agent.md) | `.github/agents/q-heat.agent.md` | "Q-HEAT" in the agent picker |
| [vscode/prompts/q-heat.prompt.md](vscode/prompts/q-heat.prompt.md) | `.github/prompts/q-heat.prompt.md` | `/q-heat` prompt |

## Other agents

No adapter needed: open the agent at the repo root and say
`Read q_heat_kit/AGENTS.md, then: Q-HEAT <command>`.

## Organisation-wide distribution

Package the Claude adapter as a plugin in a private marketplace, or share the
VS Code agent at organisation level, so every repository gets `/q-heat`
without copying files ([versioning.md](../QHC/06-maintain/versioning.md#distributing-the-kit)).
