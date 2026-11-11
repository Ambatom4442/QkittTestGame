# ADR-0004: Controlled q_heat_kit upgrades

- Status: accepted
- Date: 2026-11-11
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

`q_heat_kit/**` is frozen by policy (ADR-0002), but released kit upgrades require replacing files under that path. CI runs on detached checkouts, so branch policy must be explicit and machine-checkable.

## Decision

Allow changes under `q_heat_kit/**` only when the branch name matches `harness/kit-*`.

Upgrade rules:

1. Replace the kit folder with a released version; no hand edits to individual kit files.
2. Update `harness/manifest.json` `kit_version` in the same PR.
3. Keep all other frozen-path protections unchanged.

## Consequences

- Normal feature and non-kit harness branches cannot modify `q_heat_kit/**`.
- Kit upgrades remain possible in a narrowly scoped, auditable flow.