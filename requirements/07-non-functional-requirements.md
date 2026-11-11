# Non-functional requirements

## Self-hosting

| ID | Requirement |
|---|---|
| NFR-01 | One server process serves the game client, all assets, the API and the database |
| NFR-02 | Storage is a single SQLite file; no other database or external service |
| NFR-03 | No runtime requests to external hosts: no CDN scripts, web fonts, analytics or model APIs. Enforced by a Content-Security-Policy of `'self'` |
| NFR-04 | Works offline on a LAN or a single machine after installation |
| NFR-05 | One command to install and one to start; also a Docker image |

## Performance

| ID | Requirement |
|---|---|
| NFR-10 | ≥ 50 fps at 1080p on a mid-range laptop with integrated graphics (e.g. Intel Iris Xe); ≥ 30 fps minimum |
| NFR-11 | First load ≤ 25 MB transferred; each scene's assets ≤ 15 MB |
| NFR-12 | First scene interactive within 5 s on a LAN |
| NFR-13 | Scene change ≤ 3 s with a loading screen |
| NFR-14 | API responses ≤ 100 ms at p95 for one player; ≥ 20 concurrent players on one server |
| NFR-15 | Draw calls ≤ 150 per scene; textures ≤ 2048 px; models compressed (glTF with Draco or Meshopt) |

## Browsers

| ID | Requirement |
|---|---|
| NFR-20 | Latest two versions of Chrome, Edge, Firefox and Safari on desktop |
| NFR-21 | WebGL 2 required; WebGPU optional later. Show a clear message if WebGL 2 is unavailable |
| NFR-22 | Minimum window 1280×720; scales up to 4K |

## Accessibility

| ID | Requirement |
|---|---|
| NFR-30 | Subtitles on by default; adjustable size |
| NFR-31 | Remappable keys; click-to-move alternative to WASD |
| NFR-32 | Reduce-motion option (no head bob, no camera shake) |
| NFR-33 | Interaction outlines not reliant on colour alone |
| NFR-34 | All menus and the casebook usable with keyboard only |
| NFR-35 | Content notice at start: death, a venomous snake, domestic violence |

## Reliability and data

| ID | Requirement |
|---|---|
| NFR-40 | No progress lost on browser crash beyond 60 s of movement (FR-03) |
| NFR-41 | SQLite in WAL mode; daily backup of the database file; schema migrations versioned |
| NFR-42 | Content and saves are versioned; old saves load after a content update, or the player is told why not |

## Security

| ID | Requirement |
|---|---|
| NFR-50 | Profiles have no passwords (local use). If exposed beyond a LAN, an optional shared access key protects the server |
| NFR-51 | All API input validated by schema; SQL only through parameterised queries |
| NFR-52 | Solutions and deduction rules never sent to the client; the server validates |
| NFR-53 | Security headers: CSP self, no inline scripts, `X-Content-Type-Options`, `Referrer-Policy` |
| NFR-54 | Secrets (access key, if used) via environment variables only |

## Maintainability

| ID | Requirement |
|---|---|
| NFR-60 | TypeScript strict mode on client, server and shared code |
| NFR-61 | Case content is data, not code: adding a second case needs no engine changes |
| NFR-62 | Deterministic test mode: fixed seed, skippable animations, a test hook exposing game state (see [../architecture/07-testing-strategy.md](../architecture/07-testing-strategy.md)) |
