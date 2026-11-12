# ADR-0009: UI evidence and independent review gate

- Status: accepted
- Date: 2026-11-12
- Deciders: @Ambatom4442
- Drafted by: Q-HEAT

## Context

Ticket H-06 reports that command-only verification can pass while visible UI behavior is still wrong. Harness verification must capture visible artifacts and PRs must require independent review evidence before merge.

## Decision

1. `harness/checks/verify_feature.py` records screenshot artifact paths in feature evidence for every feature requiring the `system` layer.
2. UI feature entries include `layers_required: [static, runtime, system]` and explicit on-screen acceptance text.
3. Add `.github/pull_request_template.md` checklist requiring screenshot(s), reviewer-agent verdict, and `npm run sandbox:check` result.
4. Update root `AGENTS.md` Definition of Done to require the same evidence.

## Consequences

- Passing state now includes visible-system proof, not command output alone.
- PR reviewers receive a consistent evidence packet for UI behavior and sandbox parity.
- Feature metadata now expresses both visible acceptance and layer expectations for UI slices.
