# Browser validation

For UI work, reading code is not evidence. The agent must drive the real app:
click, type, observe the DOM, console and network, take screenshots.

## Tools

- **Playwright** (library or MCP server) — scripted journeys and agent-driven
  exploration; the usual choice for e2e and evaluator agents.
- **Chrome DevTools** (MCP or protocol) — DOM snapshots, console, network, performance.
- The platform's built-in browser tools, where available.

Record the chosen tool in `docs/RELIABILITY.md` and, if it is an MCP server,
in the platform config ([09-platforms](../09-platforms/README.md)).

## The validation loop

1. Choose one target journey (from the golden journeys or the feature).
2. Define "clean" in observable terms: text present, button enabled, request
   succeeded, console free of errors, data persisted.
3. Clear stale console output; capture the **before** state.
4. Trigger exactly one path.
5. Record runtime events, DOM changes, network calls.
6. Capture the **after** state; compare with the definition of clean.
7. If it fails: fix the smallest responsible layer, restart the app, re-run
   the same path.
8. Repeat until the journey is clean twice in a row.

## Rules

- Use stable selectors (roles, labels, test ids), not brittle CSS paths.
- Run against a local or sandbox environment with test data — never against
  production or with real user credentials.
- Screenshots and traces are evidence; save them under a git-ignored artifacts
  folder and summarise in the progress log.
- When a journey becomes critical, promote it to an automated e2e test in
  `check` and list it in `docs/RELIABILITY.md`.
