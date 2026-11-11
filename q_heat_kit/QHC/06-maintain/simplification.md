# Simplification and ablation

Every harness component encodes an assumption about what the model cannot do
on its own. Models improve; assumptions go stale. A harness that only grows
becomes slow, expensive and contradictory.

## Monthly ablation

1. Pick one component (a rule block, a check, a hook, a subagent, a template).
2. Disable it on a branch.
3. Run the harness eval suite ([evals.md](../04-verify/evals.md)) — same tasks,
   same model, several trials.
4. Compare completion rate, retries, defects before review, cost.
5. No degradation → propose removal (🛑 human approves). Degradation → keep it
   and record why in the simplification log.

Change one variable at a time. Ablation shows marginal value; failure
attribution (the diagnostic loop) shows where to look.

## On a model upgrade

- Re-run the eval suite before changing anything.
- Revisit model-specific choices: handoff threshold, compaction vs reset,
  verbosity rules, planning steps, rules written to compensate for a specific
  model weakness.
- Expect the **combination** of useful components to shift rather than simply
  shrink: some scaffolding becomes unnecessary while new capabilities (longer
  tasks, more autonomy) need new checks.

## Candidates for removal

- Rules now enforced by a check (keep the check, drop the prose).
- Sensors that can no longer fire for structural reasons (the code or
  dependency they guard is gone). A sensor that is merely quiet but still
  catches a seeded bad example is working — keep it.
- Instructions that a fresh-session test shows make no difference.
- Templates or docs nobody reads (no links in, no updates in months).
- Steps in the session routine that are always no-ops.

## Do not simplify

- Safety and permission controls, on the basis of evals alone.
- Checks for rare but severe failures (data loss, security).
- The separation of maker and checker.

Record every decision in `docs/QUALITY_SCORE.md` → Simplification log.
