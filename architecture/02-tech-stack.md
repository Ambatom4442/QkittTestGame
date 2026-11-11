# Tech stack (proposed)

## Choice

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript (strict) everywhere | One language; shared types between client, server and content; type checks act as a sensor |
| Runtime | Node.js LTS (pinned in `.nvmrc`) | Runs the server, build and tests |
| Package manager | npm workspaces (lock file committed) | Built in; one install for all packages |
| 3D | Three.js (bundled, not from a CDN) | Mature WebGL 2 engine, glTF loader, small and well documented |
| Physics / collision | Simple capsule vs. box/mesh collision (three-mesh-bvh) | No full physics needed for walking and raycasts |
| UI | Lightweight DOM UI with a small reactive library (e.g. Preact) over the canvas | Accessible text, keyboard navigation, easy to test with Playwright |
| Build | Vite | Fast dev server; hashed production bundle served by our server |
| Server | Fastify | Fast, schema-based validation, built-in `inject` for API tests |
| Database | SQLite via better-sqlite3, WAL mode | Single file, synchronous and fast, no separate service |
| Migrations | Plain numbered SQL files run at startup | Simple, reviewable |
| Validation | Zod schemas in `shared/` (content, API bodies) | Same schema checks content, requests and responses |
| Unit tests | Vitest | Fast, TypeScript native |
| Browser e2e | Playwright | Drives the real game in Chromium, Firefox, WebKit |
| Lint / format | ESLint (with import-boundary rules) + Prettier | Enforce layer rules from [06-repo-layout.md](06-repo-layout.md) |
| 3D assets | glTF 2.0 `.glb`, Meshopt or Draco compression, KTX2/WebP textures | Small downloads; standard tools (Blender, gltf-transform) |
| Audio | OGG Vorbis via Web Audio (Three.js audio) | Small, good quality |
| Container | Docker (Node LTS slim) | One-command deployment |

## Version policy

- Pin exact versions in the lock file; upgrade deliberately in dedicated PRs.
- Three.js changes often between releases; upgrades need the e2e and
  screenshot tests to pass.

## Alternatives considered

| Option | Why not (for now) |
|---|---|
| Babylon.js | Also good; heavier bundle; Three.js has more examples for this style |
| Unity / Godot web export | Large downloads, harder to test with browser tools, binary scene files are hard for agents to edit and review |
| .NET (ASP.NET Core) server | Viable and familiar; two languages and duplicated schemas between client and server |
| Python (FastAPI) server | Same reason as .NET |
| Node built-in `node:sqlite` | Still maturing; better-sqlite3 is proven |
| PostgreSQL | Requirement is a single self-contained file |

If the team prefers a .NET or Python server, only `server/` changes; the
client, content format and API contract stay the same.
