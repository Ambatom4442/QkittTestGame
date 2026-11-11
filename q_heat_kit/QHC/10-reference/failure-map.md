# Failure map: symptom → fix

Use with the diagnostic loop: find the symptom, apply the first fix, re-run.

| Symptom | Likely layer | First fix | QHC page |
|---|---|---|---|
| New session spends most of its time rediscovering setup and status | State / instructions | Progress log + quick start in `AGENTS.md` | [continuity.md](../03-operate/continuity.md) |
| Agent asks how the system works, or guesses wrong | Instructions / knowledge | Encode the knowledge in the repo; link it from the map | [knowledge-docs.md](../02-create/knowledge-docs.md) |
| Starts several features, finishes none | Scope | Feature list + WIP = 1 + VCR gate | [task-boundaries.md](../03-operate/task-boundaries.md) |
| Claims done; it does not work | Feedback | Sensors + DoD + separate checker | [definition-of-done.md](../03-operate/definition-of-done.md) |
| Unit tests pass, the app fails | Feedback | E2E for cross-component changes | [e2e-and-boundaries.md](../04-verify/e2e-and-boundaries.md) |
| Breaks architecture rules repeatedly | Feedback | Boundary check with WHAT/WHY/FIX | [e2e-and-boundaries.md](../04-verify/e2e-and-boundaries.md) |
| Same review comment again and again | Feedback | Promote to a check | [feedback-promotion.md](../05-change/feedback-promotion.md) |
| Ignores a rule that is written down | Instructions | Move it to top/bottom, scope it, or make it a check | [instruction-hygiene.md](../05-change/instruction-hygiene.md) |
| Follows an outdated rule | Instructions | Prune; add source/scope/expiry | [instruction-hygiene.md](../05-change/instruction-hygiene.md) |
| Every session sets up differently | Environment | `init.sh`, pinned versions, container | [environment.md](../02-create/environment.md) |
| Next session cannot tell what is verified | State | Handoff note + evidence in feature list | [continuity.md](../03-operate/continuity.md) |
| Quality drifts down over weeks | Maintenance | Cleanup loops + quality score | [cleanup.md](../06-maintain/cleanup.md) |
| Rushes and skips checks late in long sessions | State / context | Handoff at ~60% of window; fresh session | [context-engineering.md](../01-foundations/context-engineering.md) |
| Edits files it should not touch | Policy | Deny rules + policy check + CODEOWNERS | [policy-setup.md](../02-create/policy-setup.md) |
| Loosens tests to get green | Policy / feedback | Deny edits to sensors; decision record rule | [harness-surface.md](../00-constitution/harness-surface.md) |
| Parallel agents overwrite each other | Environment / state | Worktrees, per-feature files, claims | [multi-developer.md](../05-change/multi-developer.md) |
| Review quality depends on who reviews | Feedback | Evaluator rubric | [evaluators.md](../04-verify/evaluators.md) |
| Can't tell why an automated run did what it did | Observability | Task traces, tool-call logs | [observability.md](../04-verify/observability.md) |
| Loop metric improves, real outcome does not | Automation | Anchor + human spot check | [costs-and-risks.md](../07-automate/costs-and-risks.md) |
| Agent followed instructions found in an issue or web page | Safety | Untrusted-input rule; split the trifecta | [threat-model.md](../08-safety/threat-model.md) |
| Harness keeps growing; sessions slower and costlier | Maintenance | Ablation and pruning | [simplification.md](../06-maintain/simplification.md) |
| Sensors defined but nothing happens when they fail | Feedback | Run them in CI and hooks; required check | [ci-cd.md](../07-automate/ci-cd.md) |

**Operating principle:** add the smallest artifact that directly addresses the
observed failure. Do not answer every problem by adding text to the root file.
