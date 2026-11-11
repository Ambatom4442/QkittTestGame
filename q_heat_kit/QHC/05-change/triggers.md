# Change triggers

| Type | Trigger | Typical harness edits |
|---|---|---|
| **Requirement** | New feature area, client request, scope change | Product spec, feature entries, scope/policy unfreeze, new sensors for new invariants ([requirement-intake.md](requirement-intake.md)) |
| **Structure** | New module, service, package, repo split, layer change | `ARCHITECTURE.md` domain/layer tables, nested `AGENTS.md`, boundary checks, check paths, CODEOWNERS |
| **Tooling** | New framework, test runner, CI system, agent platform, MCP server | Quick-start commands, `init.sh`, sensors, platform files, permissions |
| **Failure-driven** | Same agent mistake twice; incident; escaped defect | A check first; a rule only if not checkable; failure-map entry |
| **Review-driven** | Same review comment twice | Promote to a check or rule ([feedback-promotion.md](feedback-promotion.md)) |
| **Policy** | New compliance need, frozen area, approval rule, access change | `policy.json`, permissions, `SECURITY.md`, decision record (always human-approved) |
| **Team** | People join/leave, more parallel agents, new owner | CODEOWNERS, escalation contacts, advanced-tier state layout |
| **Model** | Model upgrade or switch | Re-run evals; revisit model-specific rules (handoff thresholds, verbosity); simplify ([simplification.md](../06-maintain/simplification.md)) |
| **Simplification** | Component never fires, adds cost, or evals show no loss without it | Remove after ablation, with approval |
| **Kit upgrade** | New `q_heat_kit` version | Apply upgrade actions from `audit` ([versioning.md](../06-maintain/versioning.md)) |

## Who notices

- **Developer agents** note harness problems in the progress log ("rule X
  blocked a correct change", "no check caught Y") and in PR descriptions.
- **Reviewers** label PR comments that should become rules (e.g. `harness`).
- **`Q-HEAT maintain`** scans logs and comments weekly.
- **CI** reports sensors that never fire or always fire.

## What is *not* a harness change

- Implementing a feature that already has an entry → normal developer work.
- A one-off instruction for one task → put it in that task's prompt or plan.
- A personal preference → personal settings (`CLAUDE.local.md`,
  `.claude/settings.local.json`), never the shared harness.
