# Why harnesses

## The capability gap

Models score highly on benchmarks yet fail on real multi-step work in real
repositories. The same model can perform an order of magnitude differently
depending on what surrounds it. Examples from public reports:

- Anthropic built a retro game editor twice: bare model ~20 min, ~$9, broken;
  with a planner/generator/evaluator harness ~6 h, ~$200, working.
- LangChain moved a coding agent on Terminal Bench 2.0 from 52.8% to 66.5% by
  changing only the harness (verification guidance, middleware, context handling).
- OpenAI shipped a ~1M-line product in about five months with a small team;
  the engineers' work was designing environments, intent and feedback loops.

## Why agents fail

| Failure | What it looks like | Harness layer that prevents it |
|---|---|---|
| Vague task | Builds the wrong thing confidently | Task specification (feature list, specs) |
| Implicit conventions | Breaks rules nobody wrote down | Context provision (`AGENTS.md`, topic docs) |
| Broken environment | Spends the session fixing setup | Execution environment (`init.sh`, containers) |
| No verification | Claims done; it is not | Verification feedback (sensors, DoD) |
| Lost state | Next session redoes or undoes work | State management (progress, feature list) |

Failure rates rise sharply for tasks longer than about 30 minutes, when
context fills and continuity breaks. Near a full context window some models
also rush to finish ("context anxiety").

The **verification gap** is the difference between how confident the agent is
and how correct the work is. Agents are systematically over-confident about
their own output, so confidence is never evidence.

## The diagnostic loop

When something fails, do not just re-prompt. Run:

1. **Execute** the task with the current harness.
2. **Observe** what went wrong (logs, diff, transcript).
3. **Attribute** it to one of the five layers in the table above.
4. **Fix that layer** — a doc, a rule, a check, a script.
5. **Re-run** the same task to confirm the fix.

Keep a simple failure log (task, pass/fail, layer, fix). After a few rounds
it shows where the harness is weakest. This is article 2: fix the harness.

## What a harness gives you

- Higher first-attempt success and fewer review cycles.
- Work that survives session restarts and hand-offs between people and agents.
- Problems caught by machines before a human reviews.
- A way to externalise what experienced developers know but never wrote down.

A harness does not replace human judgement. Its job is to direct human
attention to where it matters.

Next: [five-subsystems.md](five-subsystems.md).
