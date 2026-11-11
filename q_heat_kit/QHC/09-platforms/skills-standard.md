# Agent Skills (`SKILL.md`)

A skill is a folder with instructions, and optionally scripts and references,
that an agent loads when a task matches. It stops the agent re-learning the
same procedure every session ("paying intent debt"). The format is an open
standard supported by Claude Code, Codex, VS Code/Copilot and many other tools.

## Structure

```text
<skill-name>/
├── SKILL.md        # required: frontmatter + instructions
├── scripts/        # optional: executable helpers
├── references/     # optional: detail loaded on demand
└── assets/         # optional: templates, schemas, data
```

## Frontmatter

| Field | Required | Rule |
|---|---|---|
| `name` | Yes | ≤ 64 chars, lowercase letters, digits, hyphens; matches the folder name |
| `description` | Yes | ≤ 1024 chars; what it does **and when to use it**, with trigger keywords first |
| `license` | No | Licence name or file |
| `compatibility` | No | Environment needs (tools, network) |
| `metadata` | No | Key–value strings (author, version) |
| `allowed-tools` | No | Pre-approved tools (experimental; support varies) |

## Progressive disclosure

1. Name + description (~100 tokens) load for every skill at startup — keep the
   description tight; listings may truncate long ones.
2. The `SKILL.md` body loads when activated — under 500 lines / ~5,000 tokens.
3. Files in `references/`, `scripts/`, `assets/` load only when needed; link
   them one level deep from `SKILL.md`.

## What belongs in a skill

- Reusable procedures (release, migration, adding an endpoint the house way).
- Decision procedures and checklists; templates; small safe scripts.

## What does not

- Project facts that belong in the repo's docs.
- Secrets, private URLs, credentials.
- Large manuals that must always be read (that is instruction bloat again).
- Hidden destructive behaviour; any destructive step needs explicit approval.

## Harness use

Q-HEAT creates skills for procedures developer agents repeat (for example
`next-feature`, `add-endpoint`, `write-adr`) when the intake or failures show
the need. Validate with the reference validator where available
(`skills-ref validate <dir>`).
