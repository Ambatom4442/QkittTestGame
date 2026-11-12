# RELIABILITY - Q-Game

## Standard paths

- Setup: `npm run setup`
- Fast check: `npm run check:fast`
- Changed-scope check: `npm run check:changed`
- Full check: `npm run check`
- E2E (real browser): `npm run test:e2e`
- Golden boot (real browser + screenshot): `npm run check:golden-boot`
- Sandbox start (Docker): `npm run sandbox:up`
- Sandbox full check (Docker): `npm run sandbox:check`
- Sandbox teardown (Docker): `npm run sandbox:down`

## Golden journey placeholders

| Journey | Command | Clean when | Owner |
|---|---|---|---|
| Health endpoint and static boot | `npm run test:e2e -- health-page` | endpoint and page return success | @Ambatom4442 |
| Golden browser boot render | `npm run check:golden-boot` | no page/console errors, hook is live, non-blank canvas, screenshot saved | @Ambatom4442 |

## Rules

- A session is incomplete if check:fast fails.
- A feature is not passing without recorded verification evidence.
- Setup and checks must be rerunnable from a clean checkout.
- `tests/e2e/**` must run via Playwright in a real Chromium browser (no fake/mocked browser-engine classes).
- Golden-boot checks must emit `artifacts/golden-boot.png` and CI must upload it.
- `npm run sandbox:check` must match local Docker and GitHub Actions behavior.
- Any repeated failure should become a dedicated sensor or feature.
