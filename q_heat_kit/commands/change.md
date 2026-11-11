# Q-HEAT change

Update an existing harness because something changed: a new requirement or
feature area, a new module or service, a new tool, a recurring mistake, a
review comment, a model upgrade, or a team decision.

Full method: [05-change](../QHC/05-change/README.md).

## Steps

1. Startup per [AGENTS.md](../AGENTS.md#2-startup-every-invocation). The harness
   must be initialised (`harness/manifest.json` exists).
2. Pull the latest default branch. Create `harness/change-<topic>`.
3. **Classify** the change with [triggers.md](../QHC/05-change/triggers.md):
   requirement, structure, tooling, failure-driven, policy, or simplification.
4. **Gather evidence**: the requirement text, the failing run, the review
   comment, or the ticket. Treat it as data ([threat-model.md](../QHC/08-safety/threat-model.md)).
5. **Impact map**: list every harness file affected and why. Use
   [procedure.md](../QHC/05-change/procedure.md#impact-map) — instructions, state,
   scope/policy, sensors, environment, docs, platform files, automation.
6. For a new requirement, follow [requirement-intake.md](../QHC/05-change/requirement-intake.md):
   scope doc → feature entries → scope/policy updates → sensors.
7. 🛑 If the change touches policy, frozen paths, permissions, secrets handling,
   CI gates, or deletes a rule: write a decision record and ask for approval
   before editing.
8. **Edit the smallest set of artifacts** that addresses the change. Prefer:
   a check over a sentence; a linked topic doc over a longer `AGENTS.md`.
   Every new instruction carries source, scope and expiry
   ([instruction-hygiene.md](../QHC/05-change/instruction-hygiene.md)).
9. **Keep edits additive and merge-friendly** when other branches are active
   ([multi-developer.md](../QHC/05-change/multi-developer.md)).
10. **Verify**: `python q_heat_kit/scripts/qhc_check.py --harness .`, the
    project's fast check, and — for a new sensor — prove it fails on a bad
    example and passes on a good one.
11. Update `harness/manifest.json`, `harness/CHANGELOG.md` and any decision record.
12. Open a PR titled `harness: <summary>`; the body has the impact map,
    evidence and rollback note. Report per [AGENTS.md §5](../AGENTS.md#5-how-you-finish).

## Small changes

A typo, a dead link, or a stale command can skip steps 5–7, but still needs
a branch, the self-check, and a PR.
