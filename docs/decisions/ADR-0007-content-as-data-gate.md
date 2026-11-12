# ADR-0007: Content-as-data gate for case ids

- Status: accepted
- Date: 2026-11-12
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

Ticket H-04 identifies hard-coded `E-xx` and `D-xx` literals in server runtime source and missing real case content files. This violates the content data-model requirement and blocks content scale-out.

## Decision

1. Add sensor `S-058-content-as-data` (`npm run check:content-as-data`) to detect `E-xx`, `D-xx`, and `R-xx` literals in `server/src/**` and `client/src/**`, excluding the content loader and tests.
2. The sensor also fails when `content/cases/speckled-band/case.json` is missing.
3. Move clue, deduction, and scene definitions into versioned files under `content/cases/speckled-band/` and load them via `server/src/contentLoader.js`.
4. Register this sensor as non-blocking in this PR so `harness-check` stays green while `main` still fails it; switch it to blocking when P-04 is merged.

## Consequences

- Runtime source no longer carries case-id literals directly.
- Content validation now runs against real case data files in-repo.
- The new check is executable now and provides failure proof on current `main` without gating merges until P-04 lands.
