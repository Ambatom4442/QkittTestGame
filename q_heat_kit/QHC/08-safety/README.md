# 08 — Safety

Agents run code, read untrusted text and hold credentials. Safety controls are
part of every harness tier and are never removed on the basis of speed or
evals alone.

| Page | Covers |
|---|---|
| [threat-model.md](threat-model.md) | Prompt injection, the lethal trifecta, untrusted inputs, destructive actions |
| [permissions-and-sandbox.md](permissions-and-sandbox.md) | Least privilege, deny rules, fail-closed defaults, sandboxes, network |
| [secrets.md](secrets.md) | Keeping credentials out of repos, prompts, logs and agent reach |
| [harness-supply-chain.md](harness-supply-chain.md) | Instruction files, hooks, skills and MCP servers as code to review |

Target-repo file: `docs/SECURITY.md` ([template](../../templates/docs/security.md.tmpl)).
