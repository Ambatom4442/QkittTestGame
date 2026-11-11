# Architecture

Proposed architecture for Q-Game. The stack is a recommendation chosen for
harnessability (strict types end to end, fast deterministic tests, one-command
startup); it becomes final when the decisions in
[decisions-proposed.md](decisions-proposed.md) are accepted.

| # | Page | Contents |
|---|---|---|
| 1 | [01-system-overview.md](01-system-overview.md) | One-server design, components, request flow |
| 2 | [02-tech-stack.md](02-tech-stack.md) | Chosen libraries, versions policy, alternatives |
| 3 | [03-client.md](03-client.md) | Engine loop, scenes, interaction, UI, state |
| 4 | [04-server-and-api.md](04-server-and-api.md) | Server modules, REST API, validation rules |
| 5 | [05-data-model.md](05-data-model.md) | Case content schema and SQLite schema |
| 6 | [06-repo-layout.md](06-repo-layout.md) | Folder structure and dependency rules |
| 7 | [07-testing-strategy.md](07-testing-strategy.md) | Unit, API, content, browser e2e, performance |
| 8 | [08-deployment.md](08-deployment.md) | Install, run, Docker, backup |
| — | [decisions-proposed.md](decisions-proposed.md) | Decisions to accept or change |
