# Data model

Two kinds of data: **case content** (authored, versioned in git, read-only at
runtime) and **player data** (written at runtime, in SQLite).

## Case content (files in `content/cases/speckled-band/`)

| File | Holds |
|---|---|
| `case.json` | id, title, version, chapters (id, title, required deductions to enter, scenes) |
| `scenes/<id>.json` | model file, spawn points, interactables (object id, glTF node name, actions), triggers, ambience |
| `clues.json` | E-xx: title, text, category (evidence/testimony), granted by (object+action / dialogue / event) |
| `dialogue/<character>.json` | nodes, lines (speaker, text, origin), choices with conditions and effects |
| `deductions.json` | D-xx: title, text, required clues/deductions, effects (unlock chapter, topic) — **server only** |
| `red-herrings.json` | R-xx: claim, refuting clues — **server only** |
| `hints.json` | per objective, three levels — server only |
| `explanation.json` | five questions, answers, required citations — server only |
| `sequences/<id>.json` | timed cues for Roylott's visit and the vigil |

All files are validated by Zod schemas in `shared/` at seed time and in CI.
The **fair-play validator** walks the content graph and fails if any clue
needed for D-12 is unobtainable before chapter 5 (FR-61).

## SQLite schema (player data + seeded content)

```mermaid
erDiagram
  profile ||--o{ game : has
  profile ||--|| settings : has
  game ||--o{ game_clue : collects
  game ||--o{ game_deduction : makes
  game ||--o{ game_event : logs
  game ||--o{ game_topic : unlocks
  content_case ||--o{ game : played_in

  profile {
    int id PK
    text name
    text created_at
  }
  settings {
    int profile_id PK
    text json
  }
  content_case {
    text id PK
    text version
    text content_json
    text seeded_at
  }
  game {
    int id PK
    int profile_id FK
    int slot
    text case_id FK
    text content_version
    text chapter_id
    text scene_id
    text transform_json
    int score
    int play_ms
    text updated_at
  }
  game_clue {
    int game_id FK
    text clue_id
    text found_at
  }
  game_deduction {
    int game_id FK
    text deduction_id
    int attempts
    text made_at
  }
  game_topic {
    int game_id FK
    text topic_id
    text unlocked_at
  }
  game_event {
    int id PK
    int game_id FK
    text type
    text payload_json
    text at
  }
```

- `game_event` is append-only: every action is logged, so score and progress
  can be recomputed and play-throughs replayed in tests.
- Unique keys: `(profile_id, slot)` on `game`; `(game_id, clue_id)` etc.
- Migrations in `server/migrations/NNN_name.sql`, applied in order at startup.
- `content_version` on each game lets the server detect saves from older content.

## Shared ids

Ids are strings matching the requirement ids (`E-09`, `D-06`, `L-06`), so
tests, content, requirements and the feature list all use the same names.
