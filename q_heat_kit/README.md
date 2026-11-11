# q_heat_kit — for humans

A portable kit that turns any coding agent (Claude Code, VS Code + Copilot,
Codex, Cursor and others that read `AGENTS.md`) into **Q-HEAT**, a harness
engineering agent. Paste the folder into a repository, ask for `Q-HEAT init`,
and it builds a harness fitted to that project's requirements and architecture.

A **harness** is everything around the model that makes its work reliable:
instructions, project state, environment, checks, safety rules and automation.
The kit holds the general rules (the **QHC**). Each project's harness is
generated into that project and owned by its team.

## Install

1. Copy `q_heat_kit/` to the root of your repository. Commit it as-is.
2. Optional: put your inputs where Q-HEAT will look for them:
   - requirements → `requirements/` (any format: markdown, PDF export, tickets)
   - architecture → `architecture/` (diagrams, decisions, stack notes)
   Other locations work too; you will be asked.
3. Optional: install an adapter so you can type `/q-heat` — see
   [adapters/README.md](adapters/README.md).

## Use

Open your agent at the repository root and say:

```text
Read q_heat_kit/AGENTS.md, then: Q-HEAT init
```

| Command | When |
|---|---|
| `Q-HEAT init` | Once per repository (new or existing code) |
| `Q-HEAT change <description>` | A new requirement, module, tool, rule or team change |
| `Q-HEAT audit` | Validate the harness (read-only report with scores) |
| `Q-HEAT maintain` | Periodic cleanup, quality scoring, simplification |
| `Q-HEAT automate <what>` | Add loops, schedules, CI gates, multi-agent flows |
| `Q-HEAT status` | Plain-language tour of the current harness |

Q-HEAT always works on a branch and opens a pull request. People review and
merge harness changes; Q-HEAT never merges.

## What you get after init

A root `AGENTS.md` (and `CLAUDE.md` pointer), `ARCHITECTURE.md`, a `harness/`
folder (feature list, progress log, sensors, policy, manifest), `docs/`
(decisions, specs, plans, quality, reliability, security), agent settings for
your tools, and a CI check. The exact set depends on the tier chosen
([tiers](QHC/02-create/tiers.md)); the layout is in
[target-layout.md](QHC/02-create/target-layout.md).

## Day to day

- Developer agents work **under** the harness: they read the root `AGENTS.md`,
  pick one feature, verify it, update progress.
- When the rules themselves need to change, run `Q-HEAT change`.
- Who may edit which harness file: [harness-surface.md](QHC/00-constitution/harness-surface.md).

## Upgrading the kit

Replace `q_heat_kit/` with the newer release, then run `Q-HEAT audit`. It
compares `harness/manifest.json` with the new kit and proposes changes.

## Credits

Built on the MIT-licensed course *Learn Harness Engineering* (WalkingLabs) and
public writing from OpenAI, Anthropic, Thoughtworks and others. Full list:
[QHC/10-reference/sources.md](QHC/10-reference/sources.md). The course's MIT
notice is kept in [LICENSES/](LICENSES/learn-harness-engineering-MIT.txt).

## Checking the kit

`python q_heat_kit/scripts/qhc_check.py --kit q_heat_kit` verifies links,
anchors, page sizes, orphan pages, template JSON and hidden characters.
