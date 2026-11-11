# End-to-end testing and architecture boundaries

## Unit tests have blind spots

| Blind spot | Example |
|---|---|
| Interface mismatch | Front end sends `userId`, API expects `user_id` |
| State propagation | Migration ran but a cache still holds the old shape |
| Resource lifecycle | Connections or file handles leak across requests |
| Environment dependency | Works with the dev config, fails with real env vars |
| Permissions | Works as admin, fails for a normal user |
| Error propagation | Inner error swallowed, outer layer reports success |

In one desktop-app case, five real defects were caught by e2e tests and none
by unit tests. **Testing adequacy grows: unit ≤ integration ≤ e2e.**

E2E tests also change agent behaviour: an agent that must pass an e2e journey
thinks about interactions, boundaries and error paths while writing code.

## Validation hierarchy Q-HEAT installs

- L1 unit tests must pass.
- L2 integration tests must pass for changed components.
- L3 e2e must pass when a change crosses a component boundary.
- Skipping a required level = not complete.

Golden journeys (3–5 critical user flows) live in `docs/RELIABILITY.md`, each
with a repeatable command.

## Architecture boundaries as checks

Define boundaries on day one; agents copy whatever structure exists.

A common layer model inside each domain:

```text
Types → Config → Repo → Service → Runtime → UI
```

Dependencies only point forward (left to right). Cross-cutting concerns (auth,
telemetry, feature flags, external clients) enter through **providers**.
Shared utilities stay generic and never accumulate domain logic.

Enforce with a structural check, for example a forbidden-import rule:

```bash
# harness/checks/no-ui-to-repo.sh
if grep -rnE "from ['\"].*/repo/" src/ui/; then
  echo "WHAT: UI imports the repository layer directly."
  echo "WHY: UI must go through services so validation and auth always run (ARCHITECTURE.md §Layers)."
  echo "FIX: call the matching function in src/services/ instead; add one there if missing."
  exit 1
fi
```

Prefer real tools where they exist (dependency-cruiser, import-linter,
ArchUnit, NetArchTest, eslint boundaries) over grep.

## Enforce invariants, not implementations

Parse and validate data at boundaries; type the contract; let the agent choose
how to implement inside the boundary.

## Review-feedback promotion

When a reviewer writes the same comment twice, it becomes a check or a rule
([feedback-promotion.md](../05-change/feedback-promotion.md)).
