# RELIABILITY - Q-Game

## Standard paths

- Setup: `npm run setup`
- Fast check: `npm run check:fast`
- Changed-scope check: `npm run check:changed`
- Full check: `npm run check`

## Golden journey placeholders

| Journey | Command | Clean when | Owner |
|---|---|---|---|
| Health endpoint and static boot | `npm run test:e2e -- health-page` | endpoint and page return success | @Ambatom4442 |

## Rules

- A session is incomplete if check:fast fails.
- A feature is not passing without recorded verification evidence.
- Setup and checks must be rerunnable from a clean checkout.
- Any repeated failure should become a dedicated sensor or feature.
