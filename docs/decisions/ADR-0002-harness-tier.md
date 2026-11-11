# ADR-0002: Standard harness tier on Windows npm flow

- Status: accepted
- Date: 2026-11-11
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

Project uses VS Code Copilot and Claude Code, requires branch/policy checks, and targets GitHub Actions. Environment is Windows PowerShell locally with Ubuntu in CI.

## Decision

Adopt standard harness tier with npm scripts (`setup`, `check:fast`, `check:changed`, `check`) and `python` command for harness checks across local and CI environments.

## Alternatives rejected

- Minimal tier: rejected due missing policy/sensor/CI coverage.
- Makefile/init.sh as primary path: rejected in favor of Windows-first npm scripts.

## Consequences

- Standard governance and reproducible checks are available immediately.
- Harness files remain owned and gated on harness/* branch flow.
