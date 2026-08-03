# Rule Garden cinematic asset contract

The runtime is wired for clean standalone assets. Add these files without changing the game logic:

```text
assets/cinematic/characters/pip_character.png
assets/cinematic/characters/rowan_character.png
assets/cinematic/characters/sable_vey_character.png
assets/cinematic/characters/juniper_character.png
assets/cinematic/characters/lumi_spirit.png
assets/cinematic/characters/tovins_echo.png
assets/cinematic/promise_flame_crystal.png
assets/cinematic/ui/notebook_panel_open.png
assets/cinematic/ui/encounter_card_frame.png
assets/cinematic/story-bridge.webp
assets/cinematic/map-landmarks.webp
assets/cinematic/portraits/snail.webp
assets/cinematic/portraits/mouse.webp
assets/cinematic/portraits/raccoon.webp
assets/cinematic/portraits/squirrel.webp
assets/cinematic/portraits/otter.webp
assets/cinematic/props/bridge.webp
assets/cinematic/props/black-rain.webp
assets/cinematic/props/lantern.webp
assets/cinematic/props/gate.webp
assets/cinematic/props/wardroot.webp
```

Recommended exports:

- Hero and story character art: transparent PNG/WebP with the character centered and enough breathing room for contain-fit placement.
- Story/map backgrounds: 16:9 or wider JPG/WebP, no embedded interface text.
- Encounter portraits: square or portrait PNG/WebP with the character centered and no card frame unless the frame is intentionally part of the final UI.

Missing assets are safe: the current CSS scene and authored SVG avatars remain as fallbacks. Portrait images are loaded opportunistically and remove themselves on load failure.
