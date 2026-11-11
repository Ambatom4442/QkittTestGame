# Harness metrics

Measure the harness so changes are decisions, not opinions. Keep the set small.

## Core metrics

| Metric | Definition | Good direction | Source |
|---|---|---|---|
| Task success rate | Features reaching `passing` without human repair ÷ features attempted | Up | Feature list history |
| Verified completion rate (VCR) | Verified ÷ activated features | → 1.0 | Feature list |
| Verification gap | Features the agent called done that failed checks or review ÷ claimed done | Down | PRs, CI |
| Rebuild cost | Minutes from session start to first useful edit | Down | Session logs |
| Time to first passing test | Fresh clone → first green test | Down | Init / CI |
| Defects before review | Problems caught by sensors before a human looked | Up (share) | CI |
| Defects after merge | Escaped defects traced to agent work | Down | Issues |
| Review time per PR | Human minutes to review | Down | PR data |
| Fast-check duration | Seconds | Stable, low | CI |
| Cost per feature | Tokens or money per passing feature | Down | Platform usage |
| Build / test pass rate on main | Over time | Up | CI |

## Harness-specific signals

- Instruction size (root lines, hard-rule count) — should stay flat.
- Rules with a sensor ÷ all hard rules — up.
- Sensors that never ran in 30 days — 0.
- Knowledge visibility (spot test) — ≥ 90%.

## Keep honest

- Track trends, not single points; tasks differ in difficulty.
- Watch for Goodhart: when a metric becomes a target it can detach from what
  matters (e.g. closing tickets vs solving them). Pair each automated metric
  with a human spot check ([costs-and-risks.md](../07-automate/costs-and-risks.md)).
- Record numbers in `docs/QUALITY_SCORE.md`; baseline them at init.
