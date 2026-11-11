# ADR-0003: Init PR size exception for harness/init

- Status: superseded
- Date: 2026-11-11
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

The standard policy limits are max 25 files and max 800 lines per change. The initial harness bootstrap PR is intentionally larger because it creates first-time harness, policy, checks, docs, and platform files.

## Decision

Keep strict limits in harness/policy.json (`max_files_changed: 25`, `max_lines_changed: 800`) and add a one-time branch exemption for `harness/init` via `limits_exempt_branches`.

## Alternatives rejected

- Permanently raising size limits: rejected because it weakens review discipline for normal feature work.
- Splitting init after the fact into many PRs: rejected to preserve a coherent one-time bootstrap baseline.

## Consequences

- Normal branches remain held to strict limits.
- The initial bootstrap branch can pass policy checks without weakening default policy.

## Review

`harness/init` was removed from `limits_exempt_branches` after init merge.
