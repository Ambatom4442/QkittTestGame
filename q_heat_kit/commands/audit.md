# Q-HEAT audit

Validate the harness and report. **Read-only**: do not edit files. This is the
command a senior developer uses to have Q-HEAT check a harness they changed by
hand. Method: [06-maintain/audit.md](../QHC/06-maintain/audit.md).

## Steps

1. Startup per [AGENTS.md](../AGENTS.md#2-startup-every-invocation).
2. Run `python q_heat_kit/scripts/qhc_check.py --harness .` and keep the output.
3. Run the project's standard startup and fast verification path. Record results.
4. **Structure**: compare files on disk with `harness/manifest.json` and the
   tier in [tiers.md](../QHC/02-create/tiers.md). List missing, extra, orphaned files.
5. **Five-subsystem score** (1–5 each, with one line of evidence per score):
   instructions, tools, environment, state, feedback
   ([five-subsystems.md](../QHC/01-foundations/five-subsystems.md)).
6. **Fresh-session test**: answer the five questions using only repo files
   ([system-of-record.md](../QHC/01-foundations/system-of-record.md#fresh-session-test)).
   Note how many files you had to open for each.
7. **Instruction health**: root file length, hard-constraint count, rules
   without source/scope/expiry, contradictions, critical rules buried in the
   middle ([instruction-hygiene.md](../QHC/05-change/instruction-hygiene.md)).
8. **Sensor health**: every sensor in `harness/sensors.json` has a script that
   exists, runs, and has fired at least once or has a reason not to; CI runs
   them ([sensors.md](../QHC/04-verify/sensors.md)).
9. **State health**: feature states match evidence; no `passing` without
   evidence; WIP within limit; progress log recent.
10. **Safety**: permission settings present, secrets not in repo, policy and
    CODEOWNERS cover harness files ([08-safety](../QHC/08-safety/README.md)).
11. **Drift**: docs that contradict code or commands that no longer run.
12. **Kit version**: compare `harness/manifest.json` `kit_version` with
    `q_heat_kit/VERSION`; list upgrade actions if they differ.
13. Write the report ([template](../templates/docs/audit-report.md.tmpl)) to the
    chat. Save it to `docs/harness/audits/<date>.md` only if the user asks.
14. End with the 3 highest-value fixes, each mapped to a `Q-HEAT change` or
    `Q-HEAT maintain` action.
