# Sensors

A sensor is any check that observes the agent's work and reports back. The
registry is `harness/sensors.json`; scripts live in `harness/checks/`.

## Kinds

| Kind | Deterministic? | Examples | Notes |
|---|---|---|---|
| Static computational | Yes | Lint, types, format, import/layer rules, secret scan | Cheapest; run on every change |
| Runtime computational | Yes | Unit, integration, contract, smoke, e2e tests | Need a working environment |
| Structural | Yes | Architecture tests, dependency direction, file-size limits, forbidden APIs | Encode `ARCHITECTURE.md` |
| Policy | Yes | Frozen-path edits, PR size, missing decision record | Encode `policy.json` |
| Inferential | No | Reviewer agent, LLM-as-judge rubric, review skill | Calibrate; never the only gate |
| Drift | Yes | Dead code, stale docs, broken links, dependency vulnerabilities | Scheduled, outside the change flow |

## Registry fields

`id`, `command`, `kind`, `layer` (static/runtime/system), `tier`
(fast/changed/full), `paths`, `blocking`, `timeout`, `owner`,
`introduced_by` (decision or failure id), `last_fired` (optional, updated by CI).

## Design rules

1. **One check, one concern**, clearly named (`no-ui-to-repo-imports`).
2. **Fast checks stay fast.** If a check grows slow, move it to a slower tier.
3. **Deterministic.** Flaky checks teach agents to ignore failures; quarantine
   and fix flaky tests, recorded in the progress log.
4. **Messages for agents**: WHAT / WHY / FIX ([error-messages.md](error-messages.md)).
5. **Scoped by path** so `check-changed` runs only what matters.
6. **Ratchet legacy problems**: fail on increase, not on existence.
7. **Never weaken to pass.** Changing a blocking sensor needs a decision record
   and human approval (article 2, policy).
8. **Prove every new sensor** fails on a bad example and passes on good code.

## Where sensors run

| Point | Mechanism |
|---|---|
| During the session | Agent hooks after edits / on stop ([09-platforms](../09-platforms/README.md)) |
| End of feature | Agent runs `check-changed` (session routine) |
| Pull request | CI runs `check` ([ci-cd.md](../07-automate/ci-cd.md)) |
| Scheduled | Drift sensors in a nightly/weekly job |
| Production | SLOs, log anomaly alerts feeding new features |

Today many teams define sensors that **nobody runs** — the registry lists them,
but no CI job or hook executes them. A sensor that never runs is decoration.
`audit` checks that every blocking sensor is executed somewhere automatic.

## Sensor health

- **Never fires**: either the code is clean in that respect, or the sensor is
  blind. Test it with a seeded bad example before trusting the silence.
- **Fires constantly**: noise; split it, scope it, or ratchet it.
- **Ignored**: agents work around it — the message is unclear or the rule is
  wrong. Fix the message or bring it to a human.

## Harness coverage (open question)

There is no standard "coverage" for a harness yet. Practical proxy: for each
hard rule in `AGENTS.md` and each dependency rule in `ARCHITECTURE.md`, is
there a sensor? Track the share of rules with a sensor in `QUALITY_SCORE.md`.
