# Rule Garden — open asset items

Everything in the original spec has been delivered and integrated. All twelve
levels have purpose-made backdrops, all 19 species have portraits, and all six
Pip play states are matched 1024x1536 RGBA.

What remains:

## 1. Optional re-export: the original five scenes

The eleven backplates span mean luminance 31 to 119 out of 255. The dimming
wash is currently calibrated per scene in `assets.css` to compensate (see the
table in `INTEGRATION_NOTES.md`).

Re-exporting the original five — `bridge-of-embers`, `wardroot-garden`,
`rootgate`, `moonhouse`, `black-rain` — at roughly the `lantern-heart` level
(mean ~80/255) would let those per-scene overrides collapse back into one
uniform rule. `second-morning` (119) and `tovins-route` (104) could also come
down somewhat; a lot of their range is currently being discarded by the wash.

Target if regenerating: **mean luminance ~80/255, 1536x1024 WebP.**

## 2. squirrel.webp

Still the only asset with no runtime use. There is no `species:"squirrel"`
case anywhere in `levels.js`. It is registered in `PORTRAIT_ASSETS` and simply
never fires. Either add a case or drop the file.

## 3. Verification that needs a human

- **In-browser visual pass.** The wash calibration is derived from luminance
  measurement, not from viewing the rendered result.
- **Prop blend mode.** The five files in `assets/cinematic/props/` composite
  with `mix-blend-mode:screen`, so black areas go invisible and light areas
  glow. If they look washed out or ghostly in scene, that is the cause and it
  is a one-line CSS change.
- **Portrait legibility at 46x46px** in the lesson grid. The cleanup batch
  portraits use blurred square backdrops rather than transparency.
