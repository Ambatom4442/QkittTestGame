# Testing strategy

Agents will build most of this game, so every feature must be verifiable by a
command. Visual quality still needs human playtests.

## Layers

| Layer | Tool | What it proves | When |
|---|---|---|---|
| Static | `tsc --noEmit`, ESLint (boundary rules), Prettier | Types, layer rules, style | Every commit |
| Content | Zod validation + fair-play checker | Content is well-formed and the case is solvable | Every commit |
| Rules unit | Vitest on `server/rules` | Each clue grant, deduction, gating, hint and score rule | Every commit |
| API | Vitest + Fastify `inject` on a temp SQLite file | Endpoints, validation, persistence, no answers leak | Every commit |
| Engine unit | Vitest (jsdom/headless) on math, collision, input mapping | Movement and collision logic | Every commit |
| Browser e2e | Playwright (Chromium; Firefox and WebKit nightly) | Real game in a browser: scenes load, interactions grant clues, deductions unlock | End of feature + CI |
| Full play-through | Playwright in test mode | The whole case can be solved from a new game | CI |
| Visual | Playwright screenshots of fixed camera views | Scenes render; regressions caught | CI (tolerance threshold) |
| Performance | Playwright + test hook fps sampling; bundle size check | NFR-10…NFR-15 budgets | Nightly |
| Bundle leak | Script scanning the built client for server-only ids and answers | NFR-52 | CI |
| Human | Playtest sessions with a feedback form | Fun, clarity, fairness | Each milestone |

## Making a 3D game testable

- **Test mode** (`?test=1`, allowed only when `QGAME_TEST_MODE=1` on the
  server): fixed random seed, animations skippable, pointer lock disabled.
- **Test hook** `window.__qgame`: read state (scene, clues, deductions, fps),
  `teleport(spawnId)`, `interact(objectId, action)`, `skipAnimations()`.
  Tests use it to reach objects reliably instead of steering the mouse.
- **At least one test per area drives real input** (keys and mouse) to cover
  the controls themselves.
- **Stable ids**: every interactable has a content id and a `data-testid` for
  its UI prompt.
- **Replays**: the append-only event log lets a test replay a recorded
  play-through and compare the final state.

## Example e2e (sketch)

```ts
test('bell-pull is a dummy (E-09)', async ({ page }) => {
  await page.goto('/?test=1&save=chapter4');
  await page.evaluate(() => window.__qgame.teleport('julia-room.bed'));
  await page.evaluate(() => window.__qgame.interact('bell-pull', 'pull'));
  await expect.poll(() => page.evaluate(() => window.__qgame.state().clues)).toContain('E-09');
  await expect(page.getByTestId('casebook-new-clue')).toHaveText(/rings nothing/i);
});
```

## Check tiers (for the harness)

| Tier | Includes | Target time |
|---|---|---|
| fast | types, lint, content validation, rules + API tests | ≤ 60 s |
| changed | fast + e2e specs for changed scenes/features | ≤ 5 min |
| full | everything incl. full play-through, screenshots, bundle leak | CI |
