# The harness surface and who may edit it

The **harness surface** is every file that shapes how agents work, as opposed
to the product itself. Q-HEAT may only edit files on this list. Paths follow
the default [target layout](../02-create/target-layout.md); if a project moved a
file, `harness/manifest.json` records the real path.

## Ownership table

| File or folder | What it is | Q-HEAT | Developer agent | Human |
|---|---|---|---|---|
| `AGENTS.md`, `CLAUDE.md`, nested `AGENTS.md` | Instructions (map) | Writes | Proposes only | Approves |
| `ARCHITECTURE.md` | System map, layers, dependency rules | Writes | Updates domain table when it adds a module | Approves |
| `docs/decisions/` (ADRs) | Why decisions were made | Drafts | Drafts | Accepts / rejects |
| `docs/product-specs/` | What the product must do | Structures | Reads | Owns content |
| `docs/exec-plans/` | Plans for multi-session work | Template | Writes and updates | Reviews |
| `docs/QUALITY_SCORE.md` | Grades by domain and layer | Writes (`maintain`) | Reads | Reviews |
| `docs/RELIABILITY.md`, `docs/SECURITY.md` | Runtime and safety rules | Writes | Reads | Approves |
| `harness/feature_list.json` (or `harness/features/`) | What to build, its check, its state | Adds and splits entries | Moves own feature `not_started → active → blocked`; never sets `passing` by hand | Prioritises |
| `harness/progress.md` (or `harness/sessions/`) | Session log | Template | Writes every session | Reads |
| `harness/sensors.json`, `harness/checks/` | Automated checks | Writes | Runs; proposes new checks | Approves |
| `harness/policy.json` | Scope, frozen paths, approvals | Writes | Reads; never edits | Approves every change |
| `harness/manifest.json`, `harness/CHANGELOG.md` | Harness inventory and history | Writes | Never | Reads |
| `init.sh`, `Makefile` harness targets, `.devcontainer/` | Environment | Writes | Proposes | Approves |
| `.claude/`, `.github/agents/`, `.github/instructions/`, `.github/prompts/`, `.vscode/mcp.json` | Platform config | Writes | Never | Approves |
| `.github/workflows/harness-*.yml`, `CODEOWNERS` | CI gate, ownership | Writes | Never | Approves |
| `q_heat_kit/` | This kit | Never (read-only) | Never | Upgrades by replacing |

"Proposes only" means: the developer agent writes the suggestion in its
progress entry or PR description, or asks the human to run `Q-HEAT change`.

## Why split ownership

- Developer agents optimise for finishing their task; left alone they loosen
  checks that block them. Separating who builds from who sets the rules removes
  that incentive (article 7, 12).
- A single owner per file avoids conflicting edits across branches
  ([multi-developer.md](../05-change/multi-developer.md)).

## Enforcement

- `CODEOWNERS` assigns harness paths to the harness owners
  ([template](../../templates/ci/CODEOWNERS.tmpl)).
- **Branch decides the mode**: harness files may be edited only on `harness/*`
  branches. A pre-edit hook blocks harness edits on other branches during the
  session, and the CI policy check fails any non-harness PR that touches them
  ([permissions-and-sandbox.md](../08-safety/permissions-and-sandbox.md)).
- The policy check also fails a PR that edits `harness/policy.json` or
  `harness/sensors.json` without a decision record in the same PR.

## Same agent, two modes

Q-HEAT is not a different model. It is the same coding agent reading this kit
instead of only the root `AGENTS.md`. "Harness mode" is defined by the files it
reads, the surface above, and the deny rules for developer mode.
