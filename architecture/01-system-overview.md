# System overview

One Node.js process serves everything. The browser downloads the client and
assets from it and talks to its JSON API. Game rules that decide the case
(deduction validation, scoring, chapter gating) run on the server.

```mermaid
flowchart LR
  subgraph Browser
    UI[UI layer<br/>casebook, dialogue, deduction board]
    ENG[3D engine<br/>Three.js scenes, controls, interaction]
    ST[Client state store]
    UI <--> ST
    ENG <--> ST
  end
  subgraph Server["Q-Game server (single Node.js process)"]
    STATIC[Static files<br/>client bundle, .glb, .ogg, fonts]
    API[REST API /api/*]
    RULES[Game rules<br/>deductions, gating, hints, score]
    REPO[Repositories]
    DB[(SQLite file<br/>qgame.db)]
    CONTENT[Case content<br/>JSON files → seeded]
    API --> RULES --> REPO --> DB
    CONTENT -->|seed| DB
  end
  Browser -->|GET assets| STATIC
  ST -->|fetch JSON| API
```

## Components

| Component | Responsibility | Does not |
|---|---|---|
| 3D engine (client) | Render scenes, move the player, detect interactions, play audio | Decide if a deduction is correct |
| UI layer (client) | Casebook, dialogue, board, menus, HUD | Hold the solution |
| Client state store | Current scene, player position, collected clue ids, UI state; mirrors server progress | Persist anything itself (beyond a session cache) |
| Static server | Serve hashed client bundle and assets with long cache headers | Call external hosts |
| REST API | Profiles, saves, events (clue found, dialogue choice), deduction attempts, hints, score | Render or know about 3D |
| Game rules | Validate actions against content and progress; unlock deductions, chapters, topics | Read the filesystem directly |
| Repositories | All SQL; parameterised queries | Contain game rules |
| Case content | Scenes, objects, clues, dialogue, deductions, hints as versioned JSON | Execute code |

## Flow: finding a clue and making a deduction

```mermaid
sequenceDiagram
  participant P as Player
  participant C as Client
  participant S as Server
  participant D as SQLite
  P->>C: inspects bell-pull, action "pull"
  C->>S: POST /api/games/{id}/events {type:"interact", object:"bell-pull", action:"pull"}
  S->>D: check content rule → clue E-09 granted
  S-->>C: {granted:["E-09"], unlockedTopics:[...]}
  P->>C: links E-09, E-10, E-11, E-12 to slot D-06
  C->>S: POST /api/games/{id}/deductions {deduction:"D-06", clues:[...]}
  S->>D: compare with rule (server only), record attempt
  S-->>C: {result:"correct", unlocked:["D-06"], score:+100}
```

## Why server-side rules

- The solution is not in the client bundle, so it cannot be read in DevTools.
- One source of truth for progress, so saves are reliable.
- The rules engine is plain TypeScript with no 3D, so it is fast to unit-test.
