# Session lifecycle

Every developer-agent session follows the same routine. Q-HEAT writes it into
the root `AGENTS.md` ("Session routine" section).

## Clock-in

1. `pwd` — confirm the repository root (prevents work in the wrong folder).
2. Read `harness/progress.md` — latest verified state and next step.
3. Read `harness/feature_list.json` — pick the highest-priority feature whose
   dependencies are `passing`, or continue the one already `active`.
4. `git log --oneline -5` — what changed most recently and why.
5. Run setup (`./init.sh`) if the environment may be stale.
6. Run the **baseline check** (`check-fast` + the smoke journey).
7. **If the baseline fails, fix that first.** Never stack new work on a broken
   start; record what was broken and how it was fixed.
8. Mark the chosen feature `active`; note it in the progress log.

## During work

- One feature only ([task-boundaries.md](task-boundaries.md)).
- For multi-step or risky work, write a short plan or sprint contract first
  (scope, checks, exclusions) — in `docs/exec-plans/active/` when it spans sessions.
- Small, verified commits with messages that say what and why.
- Run `check-fast` often; read failures; fix the cause, not the symptom.
- Write decisions down as they are made.
- If a harness rule blocks correct work or is missing, stop and propose a
  `Q-HEAT change` in the progress log; do not edit harness files.
- If a decision is irreversible, security-relevant, or ambiguous, ask a human.

## Clock-out

1. Run the verification for the feature (all required layers).
2. Let the check update the feature's state and evidence.
3. Update `harness/progress.md`: what was done, what ran, evidence, risks, next step.
4. Write a handoff if the work continues next session ([continuity.md](continuity.md)).
5. Clean up ([clean-state.md](clean-state.md)).
6. Commit; push the branch; open or update the PR. Never merge.

## Why the order matters

Reading state before editing recovers the truth; checking the baseline first
stops new work from hiding old breakage; recording at the end is what makes
the next session cheap. The clock-out mirrors the clock-in.

## Signals the routine is not followed

- Progress log not updated for several sessions while commits continue.
- Features `active` for days with no evidence.
- PRs that mix several features or "while I was here" refactors.

`Q-HEAT audit` reports these. Consider a `Stop` hook that blocks ending the
session until progress is updated ([09-platforms](../09-platforms/README.md)).
