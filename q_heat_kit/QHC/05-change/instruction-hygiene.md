# Instruction hygiene

Instructions are the cheapest thing to add and the hardest to keep correct.
Unchecked, they bloat, contradict each other, and drift from the code.

## Every instruction carries three facts

| Fact | Question | Example |
|---|---|---|
| **Source** | Why was it added? | `ADR-0004`, `incident 2026-09-12`, `PR #812 review` |
| **Scope** | When does it apply? | `src/billing/**`, "when adding an endpoint" |
| **Expiry** | When can it be removed? | Review date, or "remove when check X exists" |

Use a trailing HTML comment so humans can read the rule cleanly:
`<!-- src: …; scope: …; review: YYYY-MM -->`. Rules without a source are
candidates for deletion in the next `maintain`.

## Placement

- Most critical rules at the **top** of the file; repeat the top 2–3 at the
  **bottom**. Never bury a red line in the middle.
- Separate **hard rules** (never/always), **conventions** (prefer), and
  **lessons** (context). Mixing them makes everything look equally important.
- Put a rule as close as possible to where it applies: path-scoped rule or
  nested file before root file.

## Limits

| File | Limit |
|---|---|
| Root `AGENTS.md` | ≤ 150 lines; ≤ 15 hard rules |
| Nested `AGENTS.md` | ≤ 80 lines |
| Topic doc | 50–150 lines |
| Skill `SKILL.md` | < 500 lines; detail in `references/` |

## Signal-to-noise audit

For each common task type (add endpoint, fix bug, add UI page), count how many
instruction lines are relevant. If most lines are irrelevant to most tasks,
split and scope them.

## Contradictions

When two instructions conflict, models pick one arbitrarily. `audit` lists
conflicting pairs; the fix is to delete one or scope both, with a human
deciding which is right.

## Pruning rules

Delete an instruction when: its expiry passed; a check now enforces it; the
code it described is gone; or a fresh-session test shows behaviour does not
change without it. Deleting is a normal, healthy harness change.

## Position test (optional experiment)

Move a rule from the middle to the top of the file and compare compliance on
a few tasks. If compliance rises, your file is too long.
