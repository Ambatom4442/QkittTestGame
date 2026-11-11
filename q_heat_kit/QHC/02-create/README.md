# 02 — Create a harness

How Q-HEAT builds the first harness. The step-by-step procedure is
[commands/init.md](../../commands/init.md); these pages hold the rules for each step.

| Step | Page | Produces |
|---|---|---|
| 1 | [intake.md](intake.md) | `docs/harness/intake.md` — what the project needs |
| 2 | [repo-assessment.md](repo-assessment.md) | Greenfield/brownfield, stack, baseline, harnessability |
| 3 | [tiers.md](tiers.md) | Minimal / standard / advanced choice |
| 3 | [target-layout.md](target-layout.md) | Where every harness file goes |
| 4 | [instructions.md](instructions.md) | `AGENTS.md`, `CLAUDE.md`, nested files |
| 4 | [knowledge-docs.md](knowledge-docs.md) | `ARCHITECTURE.md`, `docs/` tree, decision records |
| 4 | [state-and-scope.md](state-and-scope.md) | Feature list, progress log |
| 4 | [environment.md](environment.md) | `init.sh`, Make targets, containers |
| 4 | [verification-setup.md](verification-setup.md) | Sensors, check tiers, first test |
| 4 | [policy-setup.md](policy-setup.md) | Policy, permissions, CODEOWNERS |
| 5 | [init-acceptance.md](init-acceptance.md) | Acceptance checklist and evidence |

## Init is its own phase

Building the harness and building features have different goals. Mixing them
leaves weak infrastructure under unverified features, wastes budget, and plants
hidden assumptions (for example one session uses Jest and the next Vitest).
Reported cost of mixing: about 60% more total rebuild time across sessions.

So `init` produces only:

1. A runnable environment (one command to set up, one to start).
2. A working verification path with at least one passing test.
3. Instructions a fresh session can follow.
4. An ordered task breakdown (feature list) with acceptance criteria.
5. A clean git checkpoint (the init PR).

Feature work starts in the next session, under the harness.

## Start from a template, not from scratch

Copy from [templates/](../../templates/README.md) and fill in project facts.
Templates encode lessons that a blank page forgets.

## Fit the harness to the project

The QHC is general; the harness is specific. Every file Q-HEAT writes must be
justified by something in the intake (a requirement, a risk, a team practice).
Do not add a component "because the template has it". Measures of success:

- **Time to first passing test** for a new session.
- **Success rate of the sessions that follow** init.
