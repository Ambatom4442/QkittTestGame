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
