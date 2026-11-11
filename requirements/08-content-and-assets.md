# Content and assets

All assets live in the repository (or a release bundle) and are served by the
game server. Every asset has a recorded source and licence.

## 3D

| Group | Items | Style |
|---|---|---|
| Rooms | Baker Street sitting room; corridor; three bedrooms; Crown Inn room | Low-poly, stylised Victorian; baked lighting where possible |
| Exterior | Manor (central block, two wings, ruined west wing with scaffolding), lawn, laurels, plantation, park wall, gipsy camp | Modular kit pieces |
| Props (clues) | Bell-pull, ventilator grille, clamped bed, iron safe, saucer of milk, dog lash, wooden chair, shutters with bars, chimney staples, poker, dark lantern, matchbox, will document | Higher detail; close-up quality |
| Characters | Holmes (hands only, first person), Watson, Helen, Roylott, Mrs Hudson | Stylised, limited animation (idle, talk, gesture) |
| Animals | Swamp adder (with speckled pattern), cheetah, baboon | Simple rigs; the adder needs a crawl animation |

Format: glTF 2.0 binary (`.glb`), compressed; textures in KTX2 or WebP.
Sources: made in Blender for this game, or CC0 libraries. No asset from a
licence that forbids redistribution. Record each in `assets/ATTRIBUTION.md`.

## Audio

| Group | Items |
|---|---|
| Ambience | London street and fire crackle; rain; night countryside; clock ticking and chiming |
| Effects | Footsteps per floor type, door, shutter bar, bell-pull (silent), low whistle, metallic clang, hiss, cane strike, scream |
| Music | Short themes per chapter; tension cue for the vigil |

Format: OGG Vorbis (with AAC fallback for Safari if needed). Sources: original
or CC0.

## Text

- Dialogue adapted from the original story (public domain) and written for
  interaction. Keep Doyle's voice and facts; mark invented lines in the
  content files (`origin: "adapted" | "original"`).
- All text in content files, ready for later translation (`en-GB` first).

## Fonts and UI

- Self-hosted fonts in the repo (Open Font Licence), for example a Victorian
  display face for titles and a readable serif for text.
- UI art: casebook paper, ink, wax-seal buttons; no external icon fonts.

## Budget

| Item | Budget |
|---|---|
| Total download (all scenes) | ≤ 120 MB |
| Per scene | ≤ 15 MB |
| Triangles on screen | ≤ 300k |
