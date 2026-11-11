# Secrets

## Rules

1. **No secrets in the repository** — not in code, docs, harness files,
   templates, test fixtures or commit history.
2. **No secrets in prompts or chat.** Agents reference secrets by environment
   variable name, never by value.
3. **No secrets in logs, screenshots, PR descriptions or traces.** Redact at
   the logging layer.
4. **Agents cannot read secret files**: deny rules for `.env`, `.env.*`,
   `*.pem`, `*.key`, cloud credential folders, keychains.
5. **Least-privilege, short-lived tokens** for agent jobs; separate tokens for
   read and write; never admin or production tokens.

## Approved paths for configuration

| Need | Approved path |
|---|---|
| Local development values | `.env` (git-ignored) created from committed `.env.example` with placeholders |
| CI | The CI system's secret store, injected as env vars |
| Runtime | A secret manager (Vault, cloud secret manager, Key Vault) |
| Test credentials | Clearly fake, local-only values in seed scripts, labelled as such |

Document these in `docs/SECURITY.md`.

## Detection

- A secret-scanning sensor in `check-fast` and CI (e.g. gitleaks, trufflehog,
  platform secret scanning) — blocking.
- Push protection in the hosting platform.
- If a secret is committed: treat it as leaked — rotate it first, then remove
  it from history if policy requires. Removing alone is not enough.

## Local sandbox defaults

Seed scripts often contain default passwords for local databases. Mark them
in code comments and in `docs/SECURITY.md` as local-only; make sure they never
match any real environment, and that CI fails if they appear in deployment
configuration.
