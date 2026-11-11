# Feedback promotion

Human feedback given in chat or review is lost after the session. When it
recurs, promote it into the harness so it is enforced every time.

## The ladder

| Step | Signal | Promote to |
|---|---|---|
| 1 | A reviewer writes a comment once | Nothing yet; note it (label `harness-candidate`) |
| 2 | Same comment twice, or same agent mistake twice | A check if computable; otherwise a scoped rule or example |
| 3 | The rule exists but is still broken | Turn the rule into a check, or move it closer (path-scoped, nested file) |
| 4 | The check fires constantly | Fix the root cause in code; ratchet; improve the FIX message |

## Promotion procedure

1. Collect the instances (PR links, transcript excerpts, failure log lines).
2. State the invariant in one sentence.
3. Can a script decide it? Write the check ([sensors.md](../04-verify/sensors.md))
   with a WHAT/WHY/FIX message. Prove it on a bad and a good example.
4. If not computable: add a scoped rule or a canonical example where the
   mistake happens (path-scoped rule > nested `AGENTS.md` > root `AGENTS.md`).
   Consider an inferential review skill.
5. Record the source (the instances) in the rule or the sensor's `introduced_by`.
6. Ship with `Q-HEAT change`.

## Capture taste once, enforce continuously

Teams that spent a fixed day each week cleaning up after agents replaced that
with encoded "golden rules" plus background jobs that scan for deviations and
open small targeted fix PRs. The human effort moved from fixing to deciding
the rules.

## Sources of feedback to scan in `maintain`

- PR review comments (especially requested changes).
- Progress-log notes from developer agents about blocked or confusing rules.
- CI failures that were fixed by the same kind of change repeatedly.
- Incidents and escaped defects.
- Evaluator findings that humans agreed with.
