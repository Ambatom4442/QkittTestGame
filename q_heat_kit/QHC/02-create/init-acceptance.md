# Init acceptance

`init` is done only when every box is checked with evidence. Copy this list
into `docs/harness/init-plan.md` and fill it in.

## Checklist

- [ ] **Setup from scratch**: setup command succeeds on a clean checkout
      (container or fresh clone). Output saved.
- [ ] **Start**: the app (or library test harness) reaches a ready state.
- [ ] **Verification path**: `check-fast` and `check` run; at least one test
      passes; brownfield baseline recorded.
- [ ] **Sensors proven**: each new sensor failed on a bad example and passed
      (or matched baseline) on current code.
- [ ] **Feature list**: ≥ 3 features, each with behaviour, verification
      command, dependencies, source; ordered.
- [ ] **Progress log**: current verified state filled in.
- [ ] **Instructions**: root `AGENTS.md` ≤ 150 lines, ≤ 15 hard rules, every
      link resolves; `CLAUDE.md` imports it.
- [ ] **Policy**: frozen and harness paths set; permission settings for each
      platform the team uses; CODEOWNERS present.
- [ ] **CI**: harness check workflow present and green on the init branch.
- [ ] **Self-check**: `qhc_check.py --harness .` reports no errors.
- [ ] **Fresh-session test**: a new session answered all five questions
      correctly ([system-of-record.md](../01-foundations/system-of-record.md#fresh-session-test)).
- [ ] **Manifest**: every created file listed in `harness/manifest.json`.
- [ ] **Clean state**: no temp files, debug output or stray changes; all
      committed on `harness/init`.

## Startup readiness (the four conditions)

A repo is ready for agents when a new session **can start** it, **can test**
it, **can see progress**, and **can pick up the next step** — always ready to
hand off.

## Metrics to record now (baseline for later)

- Time from fresh clone to first passing test.
- Fast-check duration; full-check duration.
- Count of baseline failures (brownfield).

Later sessions are compared with these ([metrics.md](../06-maintain/metrics.md)).
