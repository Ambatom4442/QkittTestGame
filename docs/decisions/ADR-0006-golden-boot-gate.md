# ADR-0006: Golden-boot browser render gate

- Status: accepted
- Date: 2026-11-12
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

Even with Playwright e2e coverage, a module-resolution failure can leave the game boot page effectively blank while API-first checks still pass. No sensor currently verifies that Chromium can boot the page, expose the runtime hook, and render non-background pixels.

## Decision

1. Add a blocking full-tier sensor `S-057-golden-boot` (`npm run check:golden-boot`).
2. The sensor opens `/?test=1` in Chromium and fails on:
   - any page errors or console errors,
   - missing `window.__qgame` hook,
   - non-positive FPS from the hook,
   - canvas sample not differing from the expected clear colour.
3. The sensor always writes `artifacts/golden-boot.png`, and CI uploads this artifact on every run (`if: always()`).

## Consequences

- Harness now detects blank-boot regressions that API-only checks miss.
- CI can fail even when API and unit checks pass, by design.
- Every CI run carries screenshot evidence for boot failures.
