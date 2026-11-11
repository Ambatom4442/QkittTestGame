# Cleanup loops

Agents reproduce the patterns they see. Without cleanup, small deviations
compound session after session.

## Immediate cleanup (every session, developer agents)

The clean-state checklist at clock-out ([clean-state.md](../03-operate/clean-state.md)):
build, tests, progress, no stray artifacts, startup works.

## Periodic cleanup (`Q-HEAT maintain`)

| Scan | Finds | Action |
|---|---|---|
| Stale artifacts | Debug logs, temp files, commented-out code, ownerless TODOs | Remove (harness) or small refactor PR (product) |
| Doc drift | Commands that fail, docs that contradict code, dead links | Fix in a harness PR |
| Pattern drift | Copies of helpers, boundary violations below the ratchet | Targeted refactor PRs; lower the ratchet |
| Rule rot | Instructions past expiry, without source, contradicting each other | Prune ([instruction-hygiene.md](../05-change/instruction-hygiene.md)) |
| Sensor health | Silent, noisy or ignored checks | Test, scope or fix |
| Quality score | Domains/layers whose grade changed | Update [quality-score.md](quality-score.md) |
| Benchmark drift | Eval results trending down | Diagnose by subsystem |

## Golden rules (examples to encode)

- Prefer shared utilities over hand-rolled copies.
- Validate data at boundaries; never guess data shapes — use typed clients.
- Follow the layer model; no shortcuts across layers.
- Keep functions and files below the size limits.
- Structured logging only; no ad-hoc prints.

Each golden rule becomes a check where possible, so cleanup turns into
continuous enforcement rather than a weekly chore.

## Targeted refactor PRs

Background cleanup produces **small** PRs: one rule, one area, reviewable in
about a minute, each with its evidence. Never bundle cleanup into feature PRs.

## Idempotence

Every cleanup step can run twice without harm. Scripts check before they
change; reports are regenerated, not appended.

## Automating it

Once stable, run the periodic scan as a scheduled loop that opens PRs and
posts a summary for a human ([loop-recipes.md](../07-automate/loop-recipes.md#weekly-cleanup)).
