# Claude Code

Applies to the terminal, the VS Code and JetBrains extensions and the desktop
app, which share the same files.

## Memory (instruction) files

| Scope | Location | Committed |
|---|---|---|
| Organisation | Managed `CLAUDE.md` (set by IT) | — |
| User | `~/.claude/CLAUDE.md`, `~/.claude/rules/` | No |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Yes |
| Local | `./CLAUDE.local.md` | No (git-ignore) |

- Files are concatenated (broad → specific); subdirectory `CLAUDE.md` files
  load when Claude reads files there.
- Claude Code reads `CLAUDE.md`, **not** `AGENTS.md`: write `CLAUDE.md` as
  `@AGENTS.md` plus Claude-only notes ([template](../../templates/root/CLAUDE.md.tmpl)).
- `@path` imports work up to four levels deep.
- Keep each file under ~200 lines; remove conflicting instructions.
- Path-scoped rules: `.claude/rules/<topic>.md` with frontmatter
  `paths: ["src/api/**/*.ts"]` load only when matching files are read.
- Auto memory is machine-local; put team facts in committed files instead.

## Settings and permissions

Files (highest precedence first): managed → command line → `.claude/settings.local.json`
→ `.claude/settings.json` (commit for the team) → `~/.claude/settings.json`.
List keys like `permissions.allow` merge across files.

```json
{
  "permissions": {
    "allow": ["Bash(make check-fast)", "Bash(npm run test *)", "Bash(git status)"],
    "ask":   ["Bash(git push *)", "Bash(npm install *)"],
    "deny":  ["Read(./.env)", "Read(./.env.*)", "Edit(./q_heat_kit/**)", "Bash(git push --force *)"]
  }
}
```

Do not put harness paths in `deny`: Q-HEAT is the same agent and would be
blocked too, and deny rules cannot be overridden. Use the branch-based guard
hook instead (below).

Template: [settings.json.tmpl](../../templates/platforms/claude/settings.json.tmpl).
`deny` and `ask` apply immediately; project `allow` rules wait until the user
trusts the folder.

## Hooks

Configured under `hooks` in settings (or in skill/subagent frontmatter).
Useful events: `SessionStart` (inject current state), `PreToolUse` (block
dangerous calls), `PostToolUse` (run fast checks after edits), `Stop` (refuse
to stop until checks pass and progress is updated), `PreCompact` (save state).

- Exit `0` = ok; exit `2` = block (stderr goes to Claude); other codes do not block.
- Hooks fail open by default; for policy use permissions, or set the hook to block on failure.
- Project hooks run only in trusted workspaces.

Templates: [stop-check](../../templates/platforms/claude/hooks/stop-check.sh.tmpl)
(no stopping while checks fail or progress is stale) and
[guard-harness-paths](../../templates/platforms/claude/hooks/guard-harness-paths.sh.tmpl)
(harness edits only on `harness/*` branches).

## Subagents

`.claude/agents/<name>.md` with frontmatter `name`, `description` (required),
`tools` / `disallowedTools`, `model`, `permissionMode`, `skills`, `hooks`,
`memory`, `isolation: worktree`, `maxTurns`. Subagents start with no chat
history — pass context explicitly. Use read-only tools for reviewers.
Template: [reviewer](../../templates/platforms/claude/agents/reviewer.md.tmpl).

## Skills and plugins

- Skills: `.claude/skills/<name>/SKILL.md` ([skills-standard.md](skills-standard.md)).
- Plugins bundle skills, agents, hooks and MCP servers; organisations can run
  a private marketplace and require it through managed settings — a good way
  to distribute the Q-HEAT adapter ([adapters](../../adapters/README.md)).

## Useful built-ins

Plan mode for reviewable plans; `/init` to draft a `CLAUDE.md` (Q-HEAT replaces
this with its own init); `/goal` for goal loops; `/loop` and scheduled tasks
for timer loops; worktree support for parallel sessions.
