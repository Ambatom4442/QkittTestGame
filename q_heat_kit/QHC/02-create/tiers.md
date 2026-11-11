# Harness tiers

Start with the smallest tier that fits; grow by `Q-HEAT change` when a real
failure shows the need ("add the smallest artifact that fixes the observed
failure").

## Minimal — solo developer, small repo, short tasks

- `AGENTS.md` (+ `CLAUDE.md` pointer)
- `init.sh` or Make targets: setup, start, check
- `harness/feature_list.json`, `harness/progress.md`
- `harness/manifest.json`, `harness/CHANGELOG.md`
- Clean-state checklist inside `AGENTS.md`

## Standard — a team, multi-session work, CI (default)

Minimal, plus:

- `ARCHITECTURE.md` with layers and dependency rules
- `docs/decisions/`, `docs/product-specs/`, `docs/exec-plans/`
- `docs/SECURITY.md`, `docs/RELIABILITY.md`, `docs/QUALITY_SCORE.md`
- `harness/sensors.json` + `harness/checks/` + check tiers (fast / changed / full)
- `harness/policy.json` (scope, frozen paths, approvals)
- Agent permission settings for each platform used
- `CODEOWNERS` for harness files; CI workflow running the checks
- Session handoff template; evaluator rubric

## Advanced — several agents in parallel, high risk, or automation

Standard, plus:

- Nested `AGENTS.md` per module or package
- Per-feature files (`harness/features/`) and per-branch session logs to avoid merge conflicts
- Separate reviewer/evaluator agent definition; sprint contracts
- Hooks for deterministic checks during the session (after edit, on stop)
- Runtime observability for agents (logs, traces, golden journeys)
- Browser validation loop for UI
- Evals suite for the harness itself; benchmark snapshots; ablation schedule
- Loop and graph definitions (`docs/harness/graphs/`), worktree isolation

## Choosing

| Signal | Tier |
|---|---|
| One person, < 10k lines, no CI | Minimal |
| Team of 2+, CI exists, work spans days | Standard |
| Multiple agents at once, regulated data, money, or unattended runs planned | Advanced |
| Unsure | Standard |

## Failure → component map

| Observed failure | Add |
|---|---|
| New sessions waste time rediscovering setup | `init.sh`, quick start in `AGENTS.md` |
| Starts many things, finishes none | Feature list + WIP rule |
| Claims done before it works | Sensors + DoD + evaluator |
| Next session cannot tell what is verified | Progress log + handoff |
| Review quality depends on who reviews | Evaluator rubric |
| Breaks architecture rules | Architecture checks + `ARCHITECTURE.md` |
| Parallel agents collide | Worktrees + per-feature files + ownership |

Record the chosen tier and the reasons in `harness/manifest.json`.
