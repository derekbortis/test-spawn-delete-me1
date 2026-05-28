# Pixel Plumber — Mobile 2D Platformer

A mobile-first, touch-controlled 2D side-scrolling platformer in the spirit
of classic NES platformers. Vanilla JS + HTML5 Canvas, built on Vite. Sprites
are procedurally generated in code (no external assets, no third-party IP).

## Play it (easiest)

Just **double-click `PixelPlumber.html`** at the root of this repo. It's a
single self-contained file (everything inlined — no server, no install). Opens
straight in your browser. Works on desktop and mobile.

To play on your phone: AirDrop / iCloud Drive / Google Drive / email the
`PixelPlumber.html` file to yourself and open it from there.

## Develop it

```bash
npm install
npm run dev      # live-reload dev server
npm run build    # rebuilds PixelPlumber.html
```

## Controls

- **Drag left / right** on the screen → walk in that direction (hold to keep going)
- **Swipe up** → jump (faster swipe = higher jump; hold finger down for max height)
- **Hold finger on bottom of screen** → crouch (only while big)
- **RUN/FIRE button** (bottom-right) → sprint; throws a fireball if powered by the fire flower
- **Desktop fallback:** arrow keys to move, Space/Up to jump, Shift/X to run/fire

## Architecture

Modular vanilla JS — Vite is just the bundler/dev server.

```
src/
  main.js       entry: wires DOM, sets up canvas scaling, runs the loop
  game.js       game state machine + per-frame orchestration
  input.js      pointer + keyboard input → typed input snapshot
  physics.js    constants, AABB tilemap sweep, overlap helper
  player.js     player entity (movement, jump, powerup state, animation)
  entities.js   Goomba, Koopa, Coin, Powerup, Fireball, BrickBit
  level.js      tile codes, hand-crafted level data, tilemap renderer
  camera.js     follow camera with no-rewind scrolling
  sprites.js    procedural pixel-art atlas baked to offscreen canvases
```

## Feel tuning

All physics constants live in `src/physics.js` (`PHYS`). Common knobs:

| Knob              | Effect                                          |
| ----------------- | ----------------------------------------------- |
| `walkMax/runMax`  | Top speeds (px/sec)                             |
| `walkAccel/runAccel` | How quickly you reach top speed             |
| `friction/turnFriction` | Skid feel when stopping or reversing      |
| `gravity/fallGravity/cutGravity` | Jump arc shape (variable-height jump uses `cutGravity` when the button is released early) |
| `jumpV`           | Initial jump velocity                           |
| `coyoteTime`      | Forgiveness after walking off a ledge           |
| `jumpBuffer`      | Pre-landing jump input buffer                   |

Swipe-velocity threshold for jump lives in `src/input.js` (`SWIPE_VEL_THRESHOLD`).

## Visual style

NES-era pixel art generated procedurally — see `src/sprites.js`. Each sprite
is a string-array of pixels referencing a small palette, baked once at boot
into an offscreen `<canvas>` (no PNG assets shipped). The art is original
to this project; nothing is traced from copyrighted material.

## License

MIT for code. Sprites are CC0.
