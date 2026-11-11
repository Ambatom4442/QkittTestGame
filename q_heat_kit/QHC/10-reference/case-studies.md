# Case data

Public numbers useful when explaining or justifying harness choices. Cite the
source; treat single cases as illustrations, not laws.

| Case | Result | Lesson |
|---|---|---|
| Anthropic retro game editor | Bare model ~20 min / ~$9, broken; full harness ~6 h / ~$200, working | Harness, not model, decided the outcome |
| Anthropic music-production app (planner/generator/evaluator) | ~3 h 50 min, ~$125; planner < 5 min | Role separation and QA with a real browser |
| OpenAI harness engineering | ~1M lines, ~1,500 PRs in ~5 months, ~3.5 PRs/engineer/day, all code by agents | Repo as system of record; custom lints; cleanup agents |
| LangChain deep agent | Terminal Bench 2.0: 52.8% → 66.5% by harness changes only | Verification guidance, middleware, context handling |
| Team adoption story (course) | ~20% → ~60% (AGENTS.md) → ~80% (verify commands) → higher (progress file) | Order of returns: instructions, feedback, state |
| WIP limit experiment (course) | 3/8 verified unconstrained vs 7/8 with WIP = 1 | Finish before starting |
| Structured feature list (course) | ~20 min re-inference + rework vs ~3 min, no rework | State on disk beats memory |
| Init vs mixed (course) | Mixed approach ~60% more total rebuild time | Separate the init phase |
| E2E on a desktop app (course) | 5 defects found by e2e, 0 by unit tests | Test across boundaries |
| 12-week cleanup comparison (course) | Build 68% / tests 61% / 60+ min startup vs 97% / 95% / 9 min | Clean state every session |
| AGENTS.md efficiency study (arXiv 2601.20404) | ~29% less runtime, ~17% fewer output tokens | Instruction files can pay off |
| ETH Zurich AGENTS.md study | No general success gain; ~20% more cost | Keep instructions minimal and tested |
| Anthropic eval fix (CORE-Bench) | 42% → 95% after fixing grading and specs | Read transcripts; broken tasks look like weak agents |
| Claude Code head's 30-day report | 259 PRs, 497 commits, all code agent-written | Loops replace manual prompting |
| Karpathy autoresearch → nanochat | GPT-2-level training 2.02 h → 1.80 h (~11%) | Fixed budgets, logged experiments, ratchet |
| Stripe "Minions" | One-shot end-to-end agents in devboxes; pre-push lint by heuristics | Isolation and shift-left feedback |

"Course" = *Learn Harness Engineering* (WalkingLabs), which reports these as
teaching cases. Other sources are listed in [sources.md](sources.md).

## A worked internal example

A real team harness (Platform3, 2026) showed the pattern in practice: scope,
policy and sensor registries in JSON; `make check` tiers; claim commits per
issue; heal merges from the integration branch; design-gate approvals before
opening frozen areas. It also showed a common gap — sensors registered but not
run by any CI job — which the QHC addresses in [sensors.md](../04-verify/sensors.md).
