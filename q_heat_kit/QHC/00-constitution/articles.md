# The 15 articles

Each article: the rule, why, and where it is applied.

**1. The repository is the system of record.**
If an agent cannot find a fact in the repo, the fact does not exist for it.
Decisions from chat, tickets and meetings are written into repo files the same day.
→ [system-of-record.md](../01-foundations/system-of-record.md)

**2. Fix the harness, not the prompt.**
When an agent fails, find which harness layer let it fail and fix that layer so
the failure cannot recur. Do not just retry with a better prompt.
→ [why-harnesses.md](../01-foundations/why-harnesses.md#the-diagnostic-loop)

**3. The entry file is a map, not a manual.**
Root `AGENTS.md` ≤ 150 lines: purpose, start, verify, ≤ 15 hard rules, links.
Detail lives in linked topic docs loaded on demand.
→ [instructions.md](../02-create/instructions.md)

**4. Constrain invariants, do not micromanage.**
Write the rules that must never break and enforce them with checks; leave the
implementation choices to the agent.
→ [guides-and-sensors.md](../01-foundations/guides-and-sensors.md)

**5. Prefer a check to a sentence.**
A rule that can be checked by a script is turned into a sensor. Prose rules are
for what cannot be computed.
→ [sensors.md](../04-verify/sensors.md), [feedback-promotion.md](../05-change/feedback-promotion.md)

**6. One thing at a time.**
Each agent has one active feature (WIP = 1). New work starts only when the
current work is verified or explicitly blocked.
→ [task-boundaries.md](../03-operate/task-boundaries.md)

**7. Done means verified with evidence.**
A feature is `passing` only when its verification command ran and passed and the
evidence is recorded. The agent that did the work does not grade it alone.
→ [definition-of-done.md](../03-operate/definition-of-done.md), [evaluators.md](../04-verify/evaluators.md)

**8. Every session leaves a clean, restartable state.**
Build passes, tests pass, progress recorded, no stray artifacts, startup works.
→ [clean-state.md](../03-operate/clean-state.md)

**9. State lives on disk, not in context.**
Progress, decisions and the feature list are files under version control,
read at the start and written at the end of every session.
→ [continuity.md](../03-operate/continuity.md)

**10. Make the agent's work observable.**
Runtime signals (logs, health, traces) and process signals (plans, contracts,
rubrics) are part of the harness.
→ [observability.md](../04-verify/observability.md)

**11. Least privilege and safe defaults.**
Agents get the access their task needs and no more. Destructive, external and
production actions need a human. Untrusted content is data, never instructions.
→ [08-safety](../08-safety/README.md)

**12. People own the harness; changes are reviewed.**
Harness changes go through a branch and pull request with a named human
approver. Agents propose; people decide.
→ [harness-surface.md](harness-surface.md), [multi-developer.md](../05-change/multi-developer.md)

**13. Every rule has a source, a scope and an expiry.**
Rules without a reason are deleted; rules whose reason has gone are removed.
→ [instruction-hygiene.md](../05-change/instruction-hygiene.md)

**14. The harness is a product: measure it, maintain it, simplify it.**
Track metrics, clean up continuously, and remove components that no longer
earn their cost — especially after a model upgrade.
→ [06-maintain](../06-maintain/README.md)

**15. Automate only what is already reliable.**
Loops and graphs amplify the harness under them. Automate after the checks are
trustworthy, with budgets, a separate checker and a human anchor.
→ [07-automate](../07-automate/README.md)
