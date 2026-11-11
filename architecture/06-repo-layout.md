# Repository layout

```text
Q-Game/
├── requirements/            # this specification (input to Q-HEAT)
├── architecture/            # this design (input to Q-HEAT)
├── package.json             # npm workspaces: shared, client, server, content-tools
├── .nvmrc                   # pinned Node LTS
├── shared/                  # types, zod schemas, ids — no runtime dependencies
│   └── src/{schemas,ids,api}/
├── client/
│   ├── index.html
│   └── src/
│       ├── engine/          # renderer, loop, input, camera, collision, loader
│       ├── game/            # scene director, interaction, inspect, sequences, audio
│       ├── ui/              # casebook, dialogue, board, menus, HUD
│       ├── state/           # store, API client, save sync
│       └── app/             # boot, screens, test hook
├── server/
│   ├── src/{http,rules,content,repo,db}/
│   └── migrations/          # 001_init.sql …
├── content/
│   └── cases/speckled-band/ # case.json, scenes/, clues.json, dialogue/, deductions.json …
├── content-tools/           # seed, validate, fair-play checker
├── assets/
│   ├── models/  audio/  textures/  fonts/
│   └── ATTRIBUTION.md       # source + licence for every asset
├── tests/
│   ├── e2e/                 # Playwright specs, page objects, golden screenshots
│   └── perf/                # fps and load-size checks
├── data/                    # qgame.db at runtime (git-ignored)
└── Dockerfile
```

(The harness — `AGENTS.md`, `harness/`, `docs/`, `.claude/`, `.github/` — is
added by `Q-HEAT init`.)

## Dependency rules (to enforce with lint)

| From | May import | Must not import |
|---|---|---|
| `shared` | nothing outside itself | client, server, three |
| `client/engine` | shared, three | game, ui, state, any case content |
| `client/game` | engine, state, shared | ui |
| `client/ui` | state, shared | engine, game, three |
| `client/state` | shared | engine, game, ui |
| `server/rules` | shared | http, repo, db, fs |
| `server/repo` | db, shared | http, rules |
| `server/http` | rules, content, repo, shared | db directly |
| `client/*` | — | `content/**` server-only files (deductions, red herrings, hints, explanation) |

The last rule keeps the solution out of the client bundle; a build check also
scans the bundle for deduction ids and answer strings.
