# Threat model for coding agents

## Prompt injection

Models do not reliably separate instructions from data. Text inside a file,
web page, issue, PR comment, log, email, dependency README or tool result can
say "ignore previous instructions and …" and the model may comply.

**Rule for every harness**: only the human user (and the committed, reviewed
harness files) give instructions. Everything else is data. When data contains
instructions aimed at the agent, the agent quotes it to the human and does not
act on it. Q-HEAT writes this rule into the root `AGENTS.md`.

## The lethal trifecta

An agent that has all three of these can be tricked into leaking data:

1. Access to **private data** (code, secrets, customer data).
2. Exposure to **untrusted content** (web, issues, emails, third-party docs).
3. Ability to **communicate externally** (network, posting, sending messages, pushing).

Guardrail products catch most attacks, not all — and "most" is a failing
grade in security. The reliable defence is to **not combine all three** in one
agent or toolset. For example:

- An issue-triage agent reads untrusted text → no secrets, no network beyond the tracker.
- An implementer with code access → no general web browsing during the run, or
  egress allowlist only.
- A web-research agent → no repository write access and no secrets.

## Other threats

| Threat | Example | Control |
|---|---|---|
| Destructive commands | `rm -rf`, `DROP TABLE`, `git push --force` | Deny rules, ask rules, sandbox, backups |
| Production access | Agent runs a migration against prod | No prod credentials in agent environments |
| Secret exfiltration | Agent prints `.env` into a log or PR | Deny reads of secret files; secret scanning ([secrets.md](secrets.md)) |
| Malicious dependency | Typosquatted package added by the agent | Approval for new dependencies; lock files; scanning |
| Poisoned instructions | A PR adds a hidden rule to `AGENTS.md` | Harness files reviewed and owned ([harness-supply-chain.md](harness-supply-chain.md)) |
| Malicious hook / MCP server | Shared config runs a script on every session | Review hooks and MCP configs like code; workspace trust |
| Over-broad tokens | CI agent token can merge or change settings | Narrow-scoped tokens; no admin |
| Data leakage to channels | Personal data sent to chat | Approved channels per data class |

## Where untrusted input enters

Issue and ticket text, PR comments from outside contributors, web pages,
documentation fetched at runtime, third-party API responses, user-uploaded
files, error messages from external services, and other repositories.

## Harness responses

- Least privilege per agent role ([permissions-and-sandbox.md](permissions-and-sandbox.md)).
- Sandboxed execution with network allowlists for unattended runs.
- Human approval for external and irreversible actions ([human-in-the-loop.md](../07-automate/human-in-the-loop.md)).
- Logs of tool calls for audit ([observability.md](../04-verify/observability.md)).
