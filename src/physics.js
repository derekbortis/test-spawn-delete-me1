// Physics constants (pixels, seconds). Tuned for a Mario-style feel:
// brisk run, snappy jump, slight skid on direction change. Adjust here.

export const TILE = 16;

export const PHYS = {
  gravity:        1500,    // px/s² (downward)
  fallGravity:    2000,    // higher gravity when falling = snappy arc
  cutGravity:     2800,    // applied when jump released early (variable height)
  maxFall:         480,    // terminal velocity
  walkAccel:       900,
  runAccel:       1200,
  airAccel:        700,
  friction:        850,
  turnFriction:   1500,   // extra friction when reversing direction (skid)
  walkMax:         120,
  runMax:          200,
  jumpV:          -420,   // initial jump velocity (up)
  runJumpBoost:    -40,   // extra when running
  coyoteTime:      0.10,  // sec after leaving ground you can still jump
  jumpBuffer:      0.12,  // sec input is remembered before landing
  enemySpeed:      40,
  shellSpeed:      300,
  fireballSpeed:   260,
  fireballGravity: 1800,
  fireballBounce: -300,
};

// Sweep an AABB against the static tilemap.
// `level.solidAt(tx, ty)` -> true/false. Bumpable tiles return true too —
// callers handle hits separately via collidedTiles list.
//
// Returns { hitX, hitY } — whether we collided on each axis.
export function sweepAABB(actor, level, dx, dy, collidedTiles) {
  let hitX = false, hitY = false;

  // --- X axis ---
  actor.x += dx;
  if (dx !== 0) {
    const dir = dx > 0 ? 1 : -1;
    const probeX = dir > 0 ? actor.x + actor.w : actor.x;
    const tx = Math.floor(probeX / TILE);
    const y0 = Math.floor(actor.y / TILE);
    const y1 = Math.floor((actor.y + actor.h - 0.001) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      if (level.solidAt(tx, ty)) {
        hitX = true;
        if (dir > 0) actor.x = tx * TILE - actor.w;
        else         actor.x = (tx + 1) * TILE;
        actor.vx = 0;
        if (collidedTiles) collidedTiles.push({ tx, ty, axis: 'x', dir });
        break;
      }
    }
  }

  // --- Y axis ---
  actor.y += dy;
  if (dy !== 0) {
    const dir = dy > 0 ? 1 : -1;
    const probeY = dir > 0 ? actor.y + actor.h : actor.y;
    const ty = Math.floor(probeY / TILE);
    const x0 = Math.floor(actor.x / TILE);
    const x1 = Math.floor((actor.x + actor.w - 0.001) / TILE);
    for (let tx = x0; tx <= x1; tx++) {
      if (level.solidAt(tx, ty)) {
        hitY = true;
        if (dir > 0) actor.y = ty * TILE - actor.h;
        else         actor.y = (ty + 1) * TILE;
        actor.vy = 0;
        if (collidedTiles) collidedTiles.push({ tx, ty, axis: 'y', dir });
        break;
      }
    }
  }

  return { hitX, hitY };
}

export function aabbOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}
