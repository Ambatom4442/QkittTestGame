# Loop recipes

Each recipe lists trigger, goal, checker, stop condition and escalation. Write
the chosen one into a loop contract ([goal.md.tmpl](../../templates/automation/goal.md.tmpl)).

## Feature runner (goal loop)

- **Trigger**: human starts it for a milestone.
- **Goal**: every feature in the milestone is `passing`.
- **Each round**: pick next eligible feature → implement in a worktree →
  `check-changed` → reviewer agent with rubric → PR.
- **Checker**: sensors + fresh-context reviewer; human merges.
- **Stop**: goal met; budget spent; a feature blocked twice; any approval-required action.
- **Escalate**: PR comment + chat message listing blocked features.

## CI failure triage (event loop)

- **Trigger**: CI fails on main or a PR.
- **Goal**: classify the failure (flaky, real regression, environment) and
  propose a fix PR for real regressions.
- **Checker**: the fix PR must pass CI; human approves.
- **Stop**: one attempt per failure; never retries forever.

## Weekly cleanup

- **Trigger**: weekly schedule.
- **Goal**: run the `maintain` scans; open small targeted PRs; update the quality score.
- **Checker**: each PR passes checks; reviewable in about a minute.
- **Stop**: scans done or N PRs opened (cap to protect review time).
- **Escalate**: summary to the team channel.

## Harness self-audit

- **Trigger**: weekly or on any merge touching the harness surface.
- **Goal**: run `Q-HEAT audit`; post the report; open a `Q-HEAT change`
  proposal for the top finding.
- **Stop**: after the report; never edits policy on its own.

## Issue triage

- **Trigger**: daily.
- **Goal**: for the newest issues, add labels, link duplicates, and draft a
  scope note for anything that looks like a new requirement.
- **Stop**: all new issues processed, or one needs a human decision.
- **Note**: issue text is untrusted input — it may contain instructions aimed
  at the agent ([threat-model.md](../08-safety/threat-model.md)).

## Monitoring a long run (timer loop)

- **Trigger**: every 15–30 minutes during a long build, deploy or migration.
- **Goal**: report status; alert on failure.
- **Stop**: run finished or human stops it.

## Rules for all recipes

- A loop never merges, deploys to production, or changes harness policy.
- Caps on turns, time, cost, PR count.
- State file updated every round; the next round reads it first.
- Observe for a week before increasing scope or frequency.
