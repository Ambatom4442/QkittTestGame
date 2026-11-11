# Agent-oriented error messages

A check's output is read by a model that will try to fix the problem. A bare
`FAILED` or a stack trace without context leads to guessing, retries and
workarounds. Every harness check prints three parts:

| Part | Content |
|---|---|
| **WHAT** | The exact violation: file, line, value, rule id |
| **WHY** | The rule's purpose, with a link to the doc or decision that set it |
| **FIX** | The concrete repair: what to change, where, or which command to run |

## Example

```text
[policy/frozen-path] FAILED
WHAT: src/billing/ledger.py changed; src/billing/ is frozen.
WHY:  Ledger logic is audited (ADR-0007). Changes need an accepted decision record.
FIX:  Revert this file, or stop and ask a human to open the area via `Q-HEAT change`
      with a decision record. Do not edit harness/policy.json yourself.
```

## Rules

- One failure, one message; group repeats ("12 more in src/ui/, run X to list").
- Cap long output and point to the full log file.
- Use stable rule ids so the agent and humans can search for them.
- Never tell the agent to disable the check; if an exception exists, describe
  the legitimate path to get one.
- Exit codes: `0` pass, non-zero fail. For agent hooks, follow the platform's
  blocking code (Claude Code uses `2` to block) ([claude-code.md](../09-platforms/claude-code.md)).

## Linters

Many linters let you set custom messages. Rewrite messages for your custom
rules in WHAT/WHY/FIX form; this alone measurably reduces repeat failures.
