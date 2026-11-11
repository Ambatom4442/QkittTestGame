# Anti-patterns and gotchas

## Harness anti-patterns

| Anti-pattern | Why it hurts | Instead |
|---|---|---|
| The 800-line `AGENTS.md` | Context eaten, rules lost in the middle | Map + topic docs |
| Rules with no check | Ignored under pressure | Promote to sensors |
| Agent grades its own work | Systematic over-confidence | Separate checker |
| "Implement the whole module" features | Not verifiable in one session | Behaviour-sized features |
| Progress kept in chat | Lost at compaction or session end | Progress file |
| Harness edited inside feature PRs | Rules bend to fit the feature | Separate harness PRs |
| Strict new rule failing 500 places | Agents learn to ignore it | Ratchet |
| Sensors defined, never run | False sense of safety | CI + hooks run them |
| Copying another team's harness wholesale | Rules without local reasons | Intake-driven, smallest artifact |
| Template-only docs | Placeholders look like facts | Fill or delete |
| Automating an unreliable harness | Faster mistakes | Audit first |
| Agents merging their own PRs | No independent gate | Humans or merge queue |
| One agent with private data, web access and push rights | Exfiltration risk | Split the trifecta |
| Personal preferences in shared files | Conflicts and churn | Local, ignored files |

## Non-obvious gotchas

1. **Memory/index caps cut silently** — tools load only the first N lines or
   KB of an index; keep entries one line; put detail in topic files.
2. **Precedence surprises** — local overrides beat project, which beats user;
   test with the full stack of files present.
3. **Derivable facts in memory go stale** — do not store code structure or
   history in memory; read the repo.
4. **Concurrency is per call, not per tool** — the same shell tool is safe for
   `cat` and unsafe for `rm`.
5. **Permission checks have side effects** — denials can change mode; do not
   cache permission results.
6. **Default tool permission is often "allow"** — set sensitive tools to ask/deny.
7. **Recursive forks explode cost** — children must not fork.
8. **Workers start with zero context** — self-contained prompts only.
9. **Hook trust is all-or-nothing** — an untrusted workspace disables all project hooks.
10. **Hooks fail open** — a crashed or timed-out hook usually lets the action through.
11. **Skill descriptions get truncated in listings** — front-load trigger words.
12. **Cached context goes stale** — anything memoised must be invalidated when
    the underlying file changes.
13. **Unknown frontmatter fields are ignored silently** — a typo disables a setting; validate.
14. **Windows symlinks need admin** — use import lines instead of symlinks for bridges.
15. **Line endings** — mixed CRLF/LF makes whole files look changed; set `.gitattributes`.
