# ADR-0008: Architecture conformance gate for stack and layout

- Status: accepted
- Date: 2026-11-12
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

Ticket H-05 reports drift from ADR-0001 and `architecture/06-repo-layout.md`: runtime source is still JavaScript, Vite is not declared directly, and the expected layer folder layout is not enforced by checks.

## Decision

1. Add sensor `S-059-architecture-conformance` (`npm run check:architecture-conformance`) to enforce:
   - TypeScript source roots under `client/src`, `server/src`, `shared/src`, and `content-tools/src` once their milestone feature has started.
   - No JavaScript source files inside those roots.
   - Required layer folders from `architecture/06-repo-layout.md`.
   - Direct `vite` dependency declaration in `package.json`.
   - Explicit `client/dist/` git-ignore coverage and no tracked files in `client/dist`.
2. Extend ESLint boundary rules to target the architecture folder layout (`client/src/*` and `server/src/*`) and server-only content import bans for `client/src/**`.
3. Register this sensor as non-blocking in this PR so `harness-check` stays green while the current `main` branch still fails it.
4. Make this sensor blocking when proposed decisions P-02 and P-03 are merged.

## Consequences

- Architecture drift is now detected by a dedicated executable sensor with actionable errors.
- CI remains green during migration, but the gap is visible and tracked.
- The blocking flip is tied to the TypeScript and Three.js decision merge point (P-02/P-03) instead of an ad-hoc date.
