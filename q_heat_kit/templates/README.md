# Templates

Copy a template to its target path, drop the `.tmpl` suffix, and replace every
`{{PLACEHOLDER}}` with a project fact from the intake. A file that still
contains `{{` is not finished — `qhc_check.py --harness` reports it.
Never copy a section you cannot justify from the intake; delete it instead.

## Root

| Template | Target | Tier |
|---|---|---|
| [AGENTS.md.tmpl](root/AGENTS.md.tmpl) | `AGENTS.md` | all |
| [CLAUDE.md.tmpl](root/CLAUDE.md.tmpl) | `CLAUDE.md` | all (if Claude Code is used) |
| [ARCHITECTURE.md.tmpl](root/ARCHITECTURE.md.tmpl) | `ARCHITECTURE.md` | standard+ |
| [init.sh.tmpl](root/init.sh.tmpl) | `init.sh` | all |
| [Makefile.tmpl](root/Makefile.tmpl) | `Makefile` (or package scripts) | all |

## Harness

| Template | Target | Tier |
|---|---|---|
| [manifest.json.tmpl](harness/manifest.json.tmpl) | `harness/manifest.json` | all |
| [CHANGELOG.md.tmpl](harness/CHANGELOG.md.tmpl) | `harness/CHANGELOG.md` | all |
| [feature_list.json.tmpl](harness/feature_list.json.tmpl) | `harness/feature_list.json` | minimal, standard |
| [feature.json.tmpl](harness/feature.json.tmpl) | `harness/features/<id>.json` | advanced |
| [progress.md.tmpl](harness/progress.md.tmpl) | `harness/progress.md` or `harness/sessions/<branch>.md` | all |
| [session-handoff.md.tmpl](harness/session-handoff.md.tmpl) | used inside progress or a plan | standard+ |
| [clean-state-checklist.md.tmpl](harness/clean-state-checklist.md.tmpl) | referenced from `AGENTS.md` | all |
| [sensors.json.tmpl](harness/sensors.json.tmpl) | `harness/sensors.json` | standard+ |
| [policy.json.tmpl](harness/policy.json.tmpl) | `harness/policy.json` | standard+ |
| [checks/verify_feature.py.tmpl](harness/checks/verify_feature.py.tmpl) | `harness/checks/verify_feature.py` | all |
| [checks/policy_check.py.tmpl](harness/checks/policy_check.py.tmpl) | `harness/checks/policy_check.py` | standard+ |

## Docs

| Template | Target |
|---|---|
| [intake.md.tmpl](docs/intake.md.tmpl) | `docs/harness/intake.md` |
| [init-plan.md.tmpl](docs/init-plan.md.tmpl) | `docs/harness/init-plan.md` |
| [audit-report.md.tmpl](docs/audit-report.md.tmpl) | chat, or `docs/harness/audits/<date>.md` |
| [decision.md.tmpl](docs/decision.md.tmpl) | `docs/decisions/ADR-NNNN-<slug>.md` |
| [product-spec.md.tmpl](docs/product-spec.md.tmpl) | `docs/product-specs/<area>-<topic>.md` |
| [exec-plan.md.tmpl](docs/exec-plan.md.tmpl) | `docs/exec-plans/active/<date>-<topic>.md` |
| [tech-debt.md.tmpl](docs/tech-debt.md.tmpl) | `docs/exec-plans/tech-debt.md` |
| [quality-score.md.tmpl](docs/quality-score.md.tmpl) | `docs/QUALITY_SCORE.md` |
| [reliability.md.tmpl](docs/reliability.md.tmpl) | `docs/RELIABILITY.md` |
| [security.md.tmpl](docs/security.md.tmpl) | `docs/SECURITY.md` |
| [evaluator-rubric.md.tmpl](docs/evaluator-rubric.md.tmpl) | `docs/evaluator-rubric.md` |

## Platforms

| Template | Target |
|---|---|
| [claude/settings.json.tmpl](platforms/claude/settings.json.tmpl) | `.claude/settings.json` |
| [claude/hooks/stop-check.sh.tmpl](platforms/claude/hooks/stop-check.sh.tmpl) | `harness/hooks/stop-check.sh` |
| [claude/hooks/guard-harness-paths.sh.tmpl](platforms/claude/hooks/guard-harness-paths.sh.tmpl) | `harness/hooks/guard-harness-paths.sh` |
| [claude/agents/reviewer.md.tmpl](platforms/claude/agents/reviewer.md.tmpl) | `.claude/agents/reviewer.md` (also read by VS Code) |
| [claude/rules/topic.md.tmpl](platforms/claude/rules/topic.md.tmpl) | `.claude/rules/<topic>.md` |
| [claude/skills/next-feature/SKILL.md.tmpl](platforms/claude/skills/next-feature/SKILL.md.tmpl) | `.claude/skills/next-feature/SKILL.md` |
| [vscode/instructions/topic.instructions.md.tmpl](platforms/vscode/instructions/topic.instructions.md.tmpl) | `.github/instructions/<topic>.instructions.md` |
| [vscode/prompts/next-feature.prompt.md.tmpl](platforms/vscode/prompts/next-feature.prompt.md.tmpl) | `.github/prompts/next-feature.prompt.md` |

## CI

| Template | Target |
|---|---|
| [harness-check.yml.tmpl](ci/harness-check.yml.tmpl) | `.github/workflows/harness-check.yml` |
| [copilot-setup-steps.yml.tmpl](ci/copilot-setup-steps.yml.tmpl) | `.github/workflows/copilot-setup-steps.yml` |
| [CODEOWNERS.tmpl](ci/CODEOWNERS.tmpl) | `.github/CODEOWNERS` |

## Automation

| Template | Target |
|---|---|
| [goal.md.tmpl](automation/goal.md.tmpl) | `docs/harness/loops/<name>.md` |
| [graph.md.tmpl](automation/graph.md.tmpl) | `docs/harness/graphs/<name>.md` |
| [escalation.md.tmpl](automation/escalation.md.tmpl) | message body for a human decision |
