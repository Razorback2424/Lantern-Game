# Executed Test Report — The Last Promise 2.2

## Scope

This pass verifies the cinematic presentation redesign while preserving the tested 2.1 gameplay baseline. The inference engine, Promise definitions, story beats, scoring, progression, save keys, and event wiring were not changed.

Browser plugin status: not available in this session. The runtime was exercised with Python Playwright and system Chromium against a temporary localhost server.

Viewports:

- Desktop: 1440 × 1100
- Mobile: 390 × 844

## Automated integrity harness

Result: **PASS — 12 / 12 Promises satisfy the integrity contract**.

- Campaign errors: 0
- Global errors: 0
- Proof minimum equals authored three-star goal: 12/12
- Raw inference minimum equals authored three-star goal: 12/12
- Adaptive mismatch witnesses available: 12/12
- Clean player-facing evidence punctuation: 12/12
- Valid prediction snapshots: 12/12

## Runtime interaction checks

### Normal desktop flow

- Welcome tableau rendered.
- Opening story advanced to the Promise path.
- Promise path rendered as a horizontal journey.
- Reviewer unlock remained hidden in normal play.
- Level 1 opened with the redesigned mission scene, cast rail, action dock, notebook, and world stage.
- Pip's notebook opened after the first example.
- Reload restored the unfinished notebook with one saved example.
- The second example unlocked **Let Pip try alone**.
- Level 1 completed successfully through reflection.

### Settings and reset

- Reduced motion and faster scenes were enabled.
- Chapter progress was reset.
- Both settings remained enabled after the reset.

### Review-only capstone

- `?review=1` exposed Reviewer unlock.
- The final Promise opened successfully.
- Its valid five-example teaching set unlocked Pip's solo try.
- The capstone completed successfully through reflection.

### Responsive behavior

- Level 1 rendered at 390 × 844.
- Desktop horizontal page overflow: 0 px.
- Mobile horizontal page overflow: 0 px.
- The mobile mission scene stacks title, conflict, and example status vertically.
- Pip's notebook remains a bounded card rather than painting its binding across the page.

## Runtime health

Across normal, review-only, mobile, and validation pages:

- Console errors: 0
- Uncaught page errors: 0
- Failed application requests: 0

## Preserved core files

The gameplay core is byte-identical to the 2.1 release:

- `engine.js`: `634fc497d82fe78e8920c7062658c18aafac52e9319ebc3c31539ff997d6b6be`
- `levels.js`: `336dc93c084ad173e7a6422dd7ef1e2323c392203828e885a53f0bbf55b98aa3`

## Remaining test boundary

The combinatorial harness covers all authored Promise definitions and relevant rule states. Browser playthroughs covered the complete first Promise, the final Promise, persistence, reset behavior, reviewer disclosure, and mobile layout. Every possible example order was not manually replayed in Safari, Firefox, and Edge.
