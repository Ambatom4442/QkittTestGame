# ADR-0005: Enforce real-browser E2E with Playwright

- Status: accepted
- Date: 2026-11-12
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

`tests/e2e/**` had Vitest-in-Node tests with fake rendering/window classes and direct client imports. Those checks could pass even when the real browser boot path failed.

## Decision

1. Run `test:e2e` with `@playwright/test` in Chromium against the running app service.
2. Add blocking sensor `e2e-real-browser` (`python harness/checks/e2e_real_browser.py`) to reject:
   - missing `@playwright/test` imports in e2e files,
   - fake/mock declarations in e2e files,
   - direct client module imports from e2e files.
3. Keep fakes in unit tests only.

## Consequences

- E2E failures now reflect browser/runtime behavior of the deployed app service.
- Harness prevents regressions back to fake-based e2e tests.
- E2E execution requires Playwright and Chromium in the checks environment.


## H-07 addendum (2026-11-12)

### Context

Playwright adoption alone did not guarantee behavior coverage: several E2E tests only asserted shell existence (HTML/API presence) and still let UI features appear complete.

### Decision

1. Keep shell-level checks, but label them explicitly with `[shell check]` in test titles.
2. Require feature verification commands for UI work (F-005/F-006/F-007/F-009/F-011 and the E2E slices of F-010/F-012) to run behavior-focused Playwright tests that drive `window.__qgame` or real user input and assert visible or state change.
3. Reset feature states that previously passed against shell checks so they must be re-verified against behavior tests.

### Consequences

- H-07 keeps shell checks as smoke tests and resets pass-state while deferring real behavior proof to P-05..P-08 test files.
- Shell checks remain available as smoke tests without being mistaken for full behavior proof.
