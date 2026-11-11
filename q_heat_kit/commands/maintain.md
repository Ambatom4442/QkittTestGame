# Q-HEAT maintain

Periodic upkeep so the harness and codebase do not rot. Run weekly or at the
end of a milestone. Method: [06-maintain](../QHC/06-maintain/README.md).

## Steps

1. Startup per [AGENTS.md](../AGENTS.md#2-startup-every-invocation). Create `harness/maintain-<date>`.
2. Run [audit](audit.md) steps 2–11 and keep the findings.
3. **Cleanup scan** ([cleanup.md](../QHC/06-maintain/cleanup.md)): stale
   artifacts (debug logs, temp files, commented-out code, orphan TODOs),
   docs that no longer match code, dead links, unused scripts.
   Harness files: fix directly. Product code: open small, separate
   refactor PRs or file them in `docs/exec-plans/tech-debt.md` — never mix.
4. **Quality score** ([quality-score.md](../QHC/06-maintain/quality-score.md)):
   regrade each domain and layer; record the change history.
5. **Feedback promotion** ([feedback-promotion.md](../QHC/05-change/feedback-promotion.md)):
   read recent PR review comments and failure logs; any comment seen 2+ times
   becomes a check or a rule proposal.
6. **Instruction pruning**: remove expired rules, merge duplicates, move topic
   detail out of the root file.
7. **Simplification** ([simplification.md](../QHC/06-maintain/simplification.md)):
   if a benchmark exists and the schedule says so, propose one component to
   disable for an ablation run. 🛑 Removal needs approval.
8. **Metrics** ([metrics.md](../QHC/06-maintain/metrics.md)): update the
   numbers in `docs/QUALITY_SCORE.md`.
9. Self-check, project checks, manifest and changelog update, PR, report.

## Cadence

| Every session (dev agents) | Weekly (`maintain`) | Monthly | On model upgrade |
|---|---|---|---|
| Clean-state checklist | Steps 2–6, 8 | + step 7 ablation | Re-run benchmark; revisit model-specific rules |
