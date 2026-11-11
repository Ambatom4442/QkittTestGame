# Functional requirements

Each item has an acceptance check that can be verified by a test.

## Profiles and saves

| ID | Requirement | Acceptance |
|---|---|---|
| FR-01 | Create a local profile with a display name (no password) | New profile appears in the list; stored in SQLite |
| FR-02 | Start a new game or continue the last save | Continue restores scene, position, casebook and deductions exactly |
| FR-03 | Autosave on every clue, deduction, chapter change and every 60 s | Killing the browser and reopening loses ≤ 60 s of movement and no clues |
| FR-04 | Multiple save slots per profile (3) | Slots list chapter, play time and date |

## Exploration

| ID | Requirement | Acceptance |
|---|---|---|
| FR-10 | First-person movement with collision; cannot pass walls or furniture | E2E: walking into a wall does not change position beyond it |
| FR-11 | Click-to-move alternative | Clicking a floor marker moves the player there |
| FR-12 | Interactable objects outline on hover and show an action prompt | Each clue object in E-xx is interactable |
| FR-13 | Close-up inspection with object-specific actions | Pulling the bell-pull (E-09) plays no bell sound and adds the clue |
| FR-14 | Scene transitions between locations with a loading screen | All L-xx reachable in chapter order |

## Evidence and conversation

| ID | Requirement | Acceptance |
|---|---|---|
| FR-20 | Casebook with Evidence, Testimony, People, Places, Timeline, Deductions tabs | Every collected clue appears once, in the right tab |
| FR-21 | Observation mode on people with hotspots | Helen's sleeve, glove, wrist give E-01…E-03 |
| FR-22 | Branching dialogue; topics unlock from clues and events | Asking about the whistle is possible only after Helen mentions it |
| FR-23 | Show evidence during dialogue | Showing E-15 to Helen gets her reply about the cat |
| FR-24 | All dialogue has subtitles and a log | Dialogue log lists every line spoken this chapter |

## Deduction

| ID | Requirement | Acceptance |
|---|---|---|
| FR-30 | Deduction board: link clues to a deduction slot | Correct set unlocks D-xx; validation done by the server API |
| FR-31 | Wrong links return a hint, never the answer | Response contains a hint id, not the required clue ids |
| FR-32 | Red herrings can be proposed and refuted | Refuting R-01 with E-07 + E-08 marks it closed |
| FR-33 | Will puzzle with numeric inputs | Correct figures (£1,100 / £750 / £250) unlock D-04 |
| FR-34 | Final explanation: five questions with cited deductions | All correct → case solved screen |

## Events and sequences

| ID | Requirement | Acceptance |
|---|---|---|
| FR-40 | Scripted events (Roylott's visit, the poker) triggered by story state | Event plays once; poker model ends straightened |
| FR-41 | Vigil sequence with timed cues and a strike window | Strike inside the window → success; outside or moving → retry |
| FR-42 | Chapter gating by required deductions | Chapter 5 is locked until D-12 exists |

## Hints, score, settings

| ID | Requirement | Acceptance |
|---|---|---|
| FR-50 | Three-level hints from Watson for the current objective | Hint text depends on missing clues; penalties applied |
| FR-51 | Score and rank calculated by the server | End screen score equals server record |
| FR-52 | Settings: volume, mouse sensitivity, key bindings, subtitles size, reduce motion, colour-blind outline | Settings persist per profile |
| FR-53 | Pause menu: resume, casebook, settings, save, quit | Esc opens it in any scene |

## Content administration

| ID | Requirement | Acceptance |
|---|---|---|
| FR-60 | Case content (scenes, clues, dialogue, deductions) loaded from versioned files and seeded into SQLite | `npm run seed` rebuilds content; schema validation fails on bad content |
| FR-61 | Content validator checks fair play | Every clue needed by D-12 is obtainable before chapter 5 |
