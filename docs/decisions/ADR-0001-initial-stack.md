# ADR-0001: Initial stack and skeleton boundary

- Status: accepted
- Date: 2026-11-11
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

The repository is greenfield with requirements and architecture docs but no runnable code. Init needs a minimal runnable baseline without product implementation.

## Decision

Use a strict TypeScript npm-workspace skeleton with shared-only code, Vitest (one passing test), ESLint boundary rules, Prettier, and harness checks wired through npm scripts.

## Alternatives rejected

- Delay runnable skeleton until product code: rejected because blocking checks must be provable now.
- Add client/server stubs now: rejected because init must avoid product implementation.

## Consequences

- Fast feedback path exists from day one.
- Product features start in later feature sessions (F-001 onward).
