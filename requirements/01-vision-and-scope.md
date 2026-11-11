# Vision and scope

## Vision

The player *is* Sherlock Holmes. They don't watch Holmes reason; they do the
reasoning: notice the mud on a client's sleeve, find a bell-pull that rings
nothing, and decide what it means. The game rewards observation and
deduction, not reflexes.

## Player

- Adults and older teens who like mysteries and puzzle games.
- Playing in a desktop browser with keyboard and mouse.
- One session or several: progress is saved on the server.
- Target length: 60–90 minutes for a first play-through.

## Design pillars

1. **Observe, then deduce.** Every conclusion must come from evidence the
   player found. No answer is handed over.
2. **Faithful to Doyle.** Characters, places, clues and solution follow the
   original story. Dialogue is paraphrased or adapted, not invented lore.
3. **Fair play.** Every clue needed for the solution can be found before the
   final accusation. Red herrings exist but can be ruled out with evidence.
4. **Atmosphere over spectacle.** Victorian interiors, gaslight, rain, a clock
   ticking. Low-poly, stylised 3D that runs on an ordinary laptop.
5. **Self-contained.** One server, one SQLite file, no internet needed to play.

## In scope (version 1)

- One case: *The Speckled Band*, six chapters ([05-gameplay.md](05-gameplay.md)).
- First-person 3D exploration of Baker Street, Stoke Moran (exterior, three
  bedrooms, corridor) and the Crown Inn; Doctors' Commons as a 2D document scene.
- Inspecting objects, an evidence casebook, conversations with choices,
  a deduction board, the night vigil, and a final explanation.
- Hints, scoring, save/resume, local player profiles.
- Self-hosted server with SQLite.

## Out of scope (version 1)

- Multiplayer, chat, leaderboards across servers.
- Mobile and touch controls (desktop first; revisit later).
- Voice acting (text and subtitles only; ambient audio and effects are in scope).
- Other Sherlock Holmes cases. The data model must allow adding them later
  ([../architecture/05-data-model.md](../architecture/05-data-model.md)).
- Payments, accounts with passwords, cloud services.

## Success measures

- A first-time player can finish the case without external help in ≤ 90 min.
- At least 80% of playtesters reach the correct solution with ≤ 3 hints.
- Runs at ≥ 50 fps on a mid-range laptop with integrated graphics at 1080p.
