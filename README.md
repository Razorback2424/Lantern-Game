# Rule Garden — The Last Promise

A chapter-sized browser-game vertical slice about teaching Pip through examples while uncovering why Mossgrove's living rules failed a family during the Black Rain.

## Story

The twelve magical Promises inside the Lantern Heart are being stolen. Each missing Flame makes part of Mossgrove forget an important distinction. Pip, a newborn living Promise, can relearn those distinctions only from examples selected by the player—the Listener bonded to Pip's notebook.

The thief is Sable Vey, a former Keeper whose brother vanished after an incomplete Gate Promise chose possession of a mark over the reason it had been given away. Sable intends to end the Heart's central authority. Saving Mossgrove therefore requires more than restoring the old system: Pip must prove that a shared rule can be questioned, revised, and taught to value care.

Read `NARRATIVE_BIBLE_2.0.md` for the complete plot, character arcs, world rules, mystery clues, ending, and narrative quality gate. Read `STORY_LEVEL_MATRIX_2.0.md` for the causal connection between every story scene and its logic.

## Open the game

Open `index.html` in a current version of Safari, Chrome, Edge, or Firefox. Normal play is self-contained and loads no remote code or assets.

No compilation step, framework runtime, package manager, or local server is required.

## Revision 2.2

Revision 2.2 is a presentation-only cinematic redesign over the tested 2.1 release. It preserves the story, Promise logic, inference engine, save namespace, progression, scoring, accessibility, and event wiring. It replaces the remaining flat, grid-heavy presentation with a continuous Promise route, atmospheric mission scenes, a horizontal cast rail, a single action dock, a physical notebook treatment, and deliberate desktop/mobile composition. Reviewer unlock remains hidden in normal play and appears only when the URL includes `?review=1`.

### 2.0 narrative foundation
Revision 2.0 is a narrative-first rebuild. It preserves the deterministic inference engine and modern 1.7 presentation, while replacing the disconnected festival-job structure with one continuous magical mystery.

### Narrative changes

- A central antagonist with a constructive goal, valid criticism, and costly blind spot.
- A protagonist arc in which Pip's willingness to revise a belief becomes the heroic quality.
- Rowan, Juniper, Lumi, Sable, and Tovin each make choices that change the plot.
- A fair mystery about Tovin's transferred Keeper mark and Rowan's cover-up.
- Permanent change to Mossgrove's institutions; the ending does not restore the original status quo.
- Story interludes after major turning points, including the midpoint reveal and final resolution.

### Story-derived level design

The twelve logical conflicts now arise naturally from the pursuit:

1. Protect a fading bridge for living ember-bearers.
2. Recognize two different wounds in the wardroots.
3. Allow two valid kinds of helpers through Rootgate.
4. Reach the exact charge needed to identify Sable's ash signature.
5. Cross living glass in the only safe sequence.
6. Use two mornings of memory to distinguish Sable's trail from ordinary soot.
7. Choose urgent care before recovering a Promise Flame.
8. Hear Tovin's echo using a day/night-sensitive voice rule.
9. Match stolen Flames to their true Heart channels.
10. Detect genuine changes in Sable's repeating Echo Procession.
11. Protect the path using a heat threshold with a Black Rain exception.
12. Write the Last Promise through ordered priorities inside the breaking Heart.

### Preserved systems

- Bounded deterministic hypothesis spaces
- Exact authored proof requirements and pars
- Adaptive solo tries
- Prediction previews and confidence display
- Autosaved notebooks and progression recovery
- Persistent misunderstanding memory
- Keyboard, reduced-motion, sound, and responsive behavior

## Optional screenshot tooling

```bash
npm install
npx playwright install chromium
npm run screenshots
```

The script starts the actual game, clears storage, plays through the first Promise, and writes real browser screenshots to `screenshots/`.

## Save data

Permanent progress:

```text
rule-garden-last-promise-v1
```

Active notebook:

```text
rule-garden-last-promise-active-v1
```

Revision 2.0 intentionally uses a fresh save namespace because the story, cases, rules, and progression meaning changed substantially.

## Main files

- `index.html` — accessible game shell
- `styles.css` / `modern.css` — responsive Lantern Atelier visual system
- `engine.js` — deterministic inference, proof matching, solo-try selection, and validation
- `levels.js` — twelve story-derived Promise conflicts
- `app.js` — phase state, story interludes, persistence, rendering, and progression
- `NARRATIVE_BIBLE_2.0.md` — story and character foundation
- `STORY_LEVEL_MATRIX_2.0.md` — causal story-to-logic design
- `validation.html` / `validation-harness.js` — integrity harness
- `capture-screenshots.mjs` — optional real-browser screenshot tour
- `TEST_REPORT_2.2.md` — executed validation and browser results
- `INTEGRATION_NOTES.md` — how the art packs were assembled and wired
- `ASSET_SPEC_NEXT.md` — remaining open asset items
- `assets/cinematic/` — scene backplates, Pip play states, portraits, props, character art
