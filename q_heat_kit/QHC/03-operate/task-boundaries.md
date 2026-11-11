# Task boundaries

## The problem

Agents **overreach** (start too much) and **under-finish** (verify too little).
The two feed each other: with k tasks open, attention per task is roughly C/k,
so each gets less verification. Little's law (L = λW) says more work in
progress means each item takes longer.

Case data: unconstrained, 3 of 8 features verified (37.5%); with WIP = 1,
7 of 8 (87.5%) — with less code written.

## Rules Q-HEAT installs

1. **WIP = 1** per agent by default (`harness/policy.json` → `limits.wip`).
2. Start the next feature only after the current one is verified end to end,
   or explicitly marked `blocked` with a reason.
3. **No "while I'm here"**: no unrelated refactors, renames or upgrades inside
   a feature. Note them in `docs/exec-plans/tech-debt.md` instead.
4. A narrow supporting fix is allowed when it blocks the feature; say so in
   the commit message.
5. **Completion priority**: functionality → performance → style. No refactor
   before the core behaviour is verified.
6. Do not change verification rules during implementation.

## Verified completion rate (VCR)

VCR = verified features ÷ activated features. Target 1.0. When VCR < 1.0,
block new activations until active work is verified or blocked. `audit`
reports it; a check can enforce it.

## Scope surface

The feature list with `depends_on` forms a DAG. Agents pick from features
whose dependencies are `passing`. Features in a `blocked` state carry what
would unblock them.

## Atomising a requirement

Break a requirement into ≥ 5 units when it is large. Each unit has: behaviour
(one sentence), verification command, dependencies. If a unit cannot be
verified by a command, it is not ready — clarify it first.

## Multiple agents

WIP = 1 is per agent. Parallel agents each hold one feature, on separate
branches or worktrees, with non-overlapping file ownership where possible
([multi-agent.md](../07-automate/multi-agent.md)). Your review capacity is the
real limit on how many run at once.
