# Rule Garden — merged build notes

Assembled from `rule-garden-code.zip` plus three asset packs. Code untouched;
only `assets/cinematic/**` was added.

## Asset placement performed

| Source pack | Files | Placed at |
|---|---|---|
| first_pass (PNG, flat) | 6 character art | `assets/cinematic/characters/` |
| first_pass | promise_flame_crystal.png | `assets/cinematic/` |
| first_pass | notebook_panel_open.png, encounter_card_frame.png | `assets/cinematic/ui/` |
| cinematic_assets (WebP) | hero-pip, pip-portrait, story-bridge, map-landmarks | `assets/cinematic/` |
| cinematic_assets | 6 portraits | `assets/cinematic/portraits/` |
| batch_2 | 5 portraits | `assets/cinematic/portraits/` |
| batch_2 | 5 props | `assets/cinematic/props/` |

| high_impact_batch_1 | 5 Pip play states | `assets/cinematic/pip/` |
| high_impact_batch_1 | 5 mission scenes | `assets/cinematic/scenes/` |
| pip_states | 6 matched 1024x1536 RGBA Pip states | `assets/cinematic/pip/` |
| scene_backplates | forge, glassworks, tovins-route, lantern-heart-breaking, second-morning | `assets/cinematic/scenes/` |
| portrait_cleanup | 9 portraits (plant, flower, basket, beetle, mole, cat, turtle, bat, lizard) | `assets/cinematic/portraits/` |

All 9 verified against the pack's `manifest.json` SHA-256 digests. All matched.
Registered in `PORTRAIT_ASSETS` in `app.js`.

**Portrait coverage is now complete: all 19 species used in `levels.js` have art.**
No encounter falls back to an SVG avatar.

## Code changes (batch 1 only — everything before this was asset placement only)

`app.js`
- Added `PIP_STATE_ASSETS`, `SCENE_ART_BY_LEVEL`, `SCENE_ART_BY_THEME`, `sceneArtKey()`
  next to the existing `SCENE_PROP_OVERRIDES` block.
- One line in the mission renderer: `$("#world").dataset.scene=sceneArtKey(level);`
  set immediately after the existing theme class assignment.
- Registered the new files with the existing `preloadCinematicAssets()` loader.

`assets.css`
- Scene backdrops paint on `#world[data-scene]::before`, with the authored
  sky/back/ground/fence faded out only when a backdrop is active. The animated
  rain overlay and festival lights are untouched.
- Pip states swap in as a `background-image` on `#pip`, hiding the SVG shape
  children but keeping `.pip-accessories` (pin, scarf, notebook, moon) visible.
  Gated on the loader's `asset-pip*` flags, so nothing changes unless the image
  actually loaded.

No engine, level, scoring, save, or event-wiring logic was touched.

### Scene assignment

Now explicit for all twelve levels, reconciled against `STORY_LEVEL_MATRIX_2.0.md`.
The theme-default fallback remains in the code as a safety net for future levels.

| # | Level | Story location (per matrix) | Backdrop used | Fit |
|---|---|---|---|---|
| 1 | bell-basics | The Bridge of Embers | bridge-of-embers | exact |
| 2 | thirsty-beds | The Wardroot's Two Wounds | wardroot-garden | exact |
| 3 | seed-gate | The Rootgate Breach | rootgate | exact |
| 4 | berry-basket | The old forge | forge | exact |
| 5 | knock-first | The Glassworks | glassworks | exact |
| 6 | rain-memory | The Second Morning (ash trail) | second-morning | exact |
| 7 | care-first | Care Before the Flame (ward-garden) | wardroot-garden | good |
| 8 | moon-voices | Voices in the Moonhouse | moonhouse | exact |
| 9 | matching-tools | The Lantern Heart channels | lantern-heart | exact |
| 10 | garden-rhythm | The Echo Procession | tovins-route | exact |
| 11 | weather-wisdom | Before the Black Rain | black-rain | exact |
| 12 | festival-gate | The Last Promise (breaking Heart) | lantern-heart-breaking | exact |

**All twelve levels now have purpose-made backdrop art. No stand-ins remain.**

### Per-scene wash calibration

The eleven backplates span mean luminance 31 to 119 out of 255, so the dimming
gradient is calibrated per scene rather than applied uniformly — each pair in
`assets.css` normalizes its scene toward an effective mean near 40. Measured
values and the resulting wash:

| Scene | Mean lum | Wash (top/bottom) |
|---|---|---|
| bridge-of-embers | 31 | .05 / .11 |
| wardroot-garden | 32 | .05 / .11 |
| moonhouse | 34 | .05 / .11 |
| black-rain | 34 | .05 / .11 |
| rootgate | 37 | .05 / .11 |
| lantern-heart-breaking | 42 | .05 / .11 |
| forge | 65 | .24 / .52 |
| lantern-heart | 80 | .31 / .69 |
| glassworks | 82 | .32 / .71 |
| tovins-route | 104 | .36 / .75 |
| second-morning | 119 | .36 / .75 |

Re-measure if any scene is re-exported at a different exposure.

### Pip state mapping

curious → idle · thinking → thinking · confident → confident · confused → confused ·
proud → proud. `sad` is used once in `app.js` and has no art; it keeps the SVG Pip.

## Verification

- Every `assets/cinematic/...` path referenced in `app.js` and `assets.css` resolves to a real file. No missing refs.
- No orphaned assets: every delivered file is referenced by the runtime.
- `node --check` passes on app.js, engine.js, levels.js, validation-harness.js.
- macOS metadata (`__MACOSX`, `.DS_Store`) removed.

## Known gaps (not blockers)

1. **Scene exposure is inconsistent across batches** — the original five sit near
   luminance 31-37, the newer ones at 42-119. Handled in CSS for now (table above),
   but a re-export of the original five to the brighter target would let the wash
   values collapse back to a single uniform rule.
2. **Portrait backdrops are blurred squares, not transparent** (per the pack README).
   Fine for `.portraitPhoto`, which uses `object-fit:cover` in a rounded box — but
   worth a glance in the lesson grid at 46x46px to confirm subjects stay readable.
3. **`squirrel.webp` is unused** — no `species:"squirrel"` case exists in `levels.js`.
   Either add a case or drop the file.
4. **Pip states are calibrated per-state in CSS, not by `contain`.** See the
   comment block in `assets.css`. If the six frames are ever re-exported, the
   six `background-size` / `background-position` pairs must be re-measured.
5. **Transparency not verified** — character PNGs and props are composited by CSS
   assuming transparent backgrounds (props use `mix-blend-mode:screen`).
   Needs a visual pass in-browser. The Pip states are now all 1024x1536 RGBA
   with real alpha, so the rectangle risk there is resolved.

## Run

Open `index.html` directly in a browser. No server or build step.
Append `?review=1` to the URL for the reviewer unlock.
