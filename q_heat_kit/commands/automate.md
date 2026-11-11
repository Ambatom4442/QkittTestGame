# Q-HEAT automate

Add automation on top of a working harness: goal loops, scheduled loops,
event-driven loops, CI gates, multi-agent graphs. A loop only amplifies the
harness underneath it, so **audit first**. Method: [07-automate](../QHC/07-automate/README.md).

## Preconditions (stop if any fails)

- `Q-HEAT audit` shows feedback ≥ 4 and state ≥ 4.
- The fast check runs unattended and is deterministic.
- Every feature in scope has a machine-checkable verification command.

## Steps

1. Startup per [AGENTS.md](../AGENTS.md#2-startup-every-invocation). Create `harness/automate-<topic>`.
2. **Pick the loop type** with [loops.md](../QHC/07-automate/loops.md#which-loop):
   does the work have an end (goal loop) or not (timer/event loop)?
3. **Write the loop contract** ([goal template](../templates/automation/goal.md.tmpl)):
   goal, verification, stop condition, budget (turns, time, cost), state file,
   isolation (worktree/container), checker (separate from maker), escalation.
4. If more than one agent or branch/rollback paths are involved, decide whether
   it needs a graph ([graphs.md](../QHC/07-automate/graphs.md#when-you-need-a-graph));
   if yes, write `docs/harness/graphs/<name>.md` ([template](../templates/automation/graph.md.tmpl)).
5. **Wire the trigger** for the team's platform ([ci-cd.md](../QHC/07-automate/ci-cd.md)):
   scheduled task, CI workflow, webhook, or `/goal` instructions.
6. **Wire the checker**: a separate reviewer agent or deterministic gate;
   it never shares the maker's context ([evaluators.md](../QHC/04-verify/evaluators.md)).
7. **Wire escalation** ([human-in-the-loop.md](../QHC/07-automate/human-in-the-loop.md)):
   where the loop stops and who it notifies.
8. **Guard the costs** ([costs-and-risks.md](../QHC/07-automate/costs-and-risks.md)):
   caps on turns, spend, parallelism; an anchor metric checked by a human.
9. 🛑 Dry run once with the user watching. Record the transcript summary.
10. Self-check, manifest and changelog update, PR, report. Recommend a one-week
    observation period before widening the loop.
