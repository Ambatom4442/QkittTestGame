# Human in the loop

Automation makes generation nearly free; judgement becomes the scarce resource.
The harness decides **which** decisions reach a human, **how**, and **when**.

## Always a human

- Merging to protected branches; production deploys; releases.
- Accepting decision records; opening frozen paths; changing policy or blocking sensors.
- New dependencies, schema migrations, public API changes, auth and permission code.
- Anything irreversible (data deletion, external messages, payments).
- Security posture changes, secrets, access grants.
- Scope disputes: when requirement and evidence disagree.
- Trade-offs the instructions do not settle (performance vs clarity, deadline vs completeness).

Record this list in `harness/policy.json` → `approvals.required_for`.

## How the agent asks

A good escalation is self-contained: context in two sentences, the decision
needed, 2–4 options with consequences, the agent's recommendation, what it
will do meanwhile (wait, or continue with safe parts). The agent never
proceeds on the risky branch while waiting.

Template: [escalation.md.tmpl](../../templates/automation/escalation.md.tmpl).

## Channels

| Channel | Good for |
|---|---|
| PR comment / review request | Decisions tied to a change (default) |
| Issue / ticket comment (Jira, Azure DevOps, GitHub) | Scope and requirement questions |
| Team chat (Slack, Teams) | Time-sensitive blocks in a running loop |
| Email | Summaries and reports |
| Messaging apps (WhatsApp, Telegram) | Urgent personal alerts, if the organisation allows it |

Channels are wired through connectors (MCP servers) or CI notifications; the
escalation contacts per decision type live in `policy.json` → `escalation`.
Never send code, secrets or personal data through a channel not approved for it.

## Approval nodes in graphs and loops

A loop or graph **pauses before** the gated step and resumes after approval
([graphs.md](graphs.md)). State is checkpointed so the pause can last days.

## Avoid overloading people

- Batch questions; ask once with defaults.
- Rank by urgency; mark which block work and which do not.
- Every ask states what happens if nobody answers (safe default or stop).
- Track how many escalations each loop produces; many escalations mean the
  harness lacks a rule or the loop's scope is too wide.

## Cognitive surrender

When automation runs smoothly, people stop forming opinions and accept the
output. Reviews become rubber stamps. Counter it: rotate reviewers, require
reviewers to state one risk per PR, and spot-check merged work weekly.
