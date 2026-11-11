# Proposed decisions

Q-HEAT turns accepted items into decision records (`docs/decisions/`) during
`init`. Change anything here before then.

| ID | Decision | Status |
|---|---|---|
| P-01 | Case: *The Speckled Band*, faithful to Doyle; later cases added as content | Proposed |
| P-02 | TypeScript strict on client, server and shared code | Proposed |
| P-03 | Three.js (WebGL 2) for 3D, bundled locally | Proposed |
| P-04 | Single Node.js server (Fastify) serving client, assets and API | Proposed |
| P-05 | SQLite (better-sqlite3, WAL) as the only store | Proposed |
| P-06 | Game rules and solution validated on the server only | Proposed |
| P-07 | Case content as versioned JSON validated by Zod, seeded into SQLite | Proposed |
| P-08 | No external network calls at runtime (CSP `'self'`) | Proposed |
| P-09 | Test mode + `window.__qgame` hook for deterministic browser e2e | Proposed |
| P-10 | Desktop browsers only in v1; no voice acting | Proposed |
| P-11 | Assets: glTF + compression; CC0 or self-made; attribution file | Proposed |
| P-12 | Client layer rules (engine → game → ui) enforced by lint | Proposed |
