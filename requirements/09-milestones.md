# Milestones

Each milestone is playable and verified end to end before the next starts.

| # | Milestone | Contents | Done when |
|---|---|---|---|
| M0 | Skeleton | Server serves client; SQLite with migrations; profiles; empty 3D room with movement and collision; test hook; CI | Playwright walks across a room and saves/loads position |
| M1 | Vertical slice: Julia's room | L-06 fully built; inspect E-07…E-12; casebook; deduction board with D-03 and D-06; server-side validation | A player can make D-06 from scratch; e2e test does the same |
| M2 | Chapter 1–3 | Baker Street, observation mode, dialogue system, Roylott event, will puzzle | D-01, D-02, D-04 made in e2e |
| M3 | Stoke Moran complete | Exterior, corridor, Roylott's and Helen's rooms; all clues; red herrings; D-05…D-12 | Fair-play validator passes; D-12 reachable |
| M4 | The vigil and the end | Crown Inn, vigil sequence, final explanation, scoring, ranks | Full play-through in e2e (test mode) |
| M5 | Polish | Audio, lighting, accessibility options, performance budget, Docker image | NFRs measured and met; 5 external playtests |

## MVP

M0 + M1 is the minimum to prove the engine, the content model and the harness.
M4 completes the case.
