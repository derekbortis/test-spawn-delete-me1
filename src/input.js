// Touch input. Exposes a single `input` object the game reads each frame.
//
// Touch model:
//   - Left ~65% of screen is the "movement pad": drag-to-walk + swipe-up-to-jump
//   - Bottom 30% of that pad while holding still = crouch
//   - The action button (separate DOM element) is run-and-fire
//   - Mouse + arrow keys are mirrored for desktop testing
//
// Feel:
//   - Jump fires immediately on upward swipe velocity threshold (no debounce
//     wait) and is "held" as long as the finger remains down — that lets the
//     player-side jump-cut logic do variable height.
//   - Drag-to-walk uses the *current* x-delta from the touchstart point
//     instead of velocity, so a held finger keeps moving without retriggering.

export const input = {
  moveX: 0,          // -1..1
  jumpPressed: false,// edge: cleared after consumption
  jumpHeld: false,
  crouch: false,
  run: false,        // action button (run + fire)
  firePressed: false,// edge from run button taps while powered
  paused: false,
};

const MOVE_DEADZONE = 6;
const MOVE_MAX = 38;            // pixels of drag → full speed
const SWIPE_VEL_THRESHOLD = 520; // px/sec upward to trigger jump
const SWIPE_DY_MIN = 14;        // px minimum upward motion
const TAP_MAX_MS = 180;         // quick tap also triggers a jump
const TAP_MAX_MOVE = 10;        // tap must not have moved much
const CROUCH_BOTTOM_FRAC = 0.32;// of pad height

const padTouches = new Map();   // pointerId → state

let stageEl = null;
let actionBtn = null;

export function setupInput(stage, action) {
  stageEl = stage;
  actionBtn = action;

  // Block default behaviors that hurt mobile games.
  const block = (e) => { e.preventDefault(); };
  document.addEventListener('gesturestart', block, { passive: false });
  document.addEventListener('gesturechange', block, { passive: false });
  document.addEventListener('gestureend', block, { passive: false });
  document.addEventListener('contextmenu', block);

  // pad listeners on the canvas
  stage.addEventListener('pointerdown', onPadDown, { passive: false });
  stage.addEventListener('pointermove', onPadMove, { passive: false });
  stage.addEventListener('pointerup', onPadUp, { passive: false });
  stage.addEventListener('pointercancel', onPadUp, { passive: false });

  // action button
  const press = (e) => {
    e.preventDefault();
    actionBtn.classList.add('pressed');
    if (!input.run) input.firePressed = true;
    input.run = true;
  };
  const release = (e) => {
    e.preventDefault();
    actionBtn.classList.remove('pressed');
    input.run = false;
  };
  actionBtn.addEventListener('pointerdown', press, { passive: false });
  actionBtn.addEventListener('pointerup', release, { passive: false });
  actionBtn.addEventListener('pointercancel', release, { passive: false });
  actionBtn.addEventListener('pointerleave', release, { passive: false });

  // Desktop fallback
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') keyMoveX = -1;
    else if (e.key === 'ArrowRight' || e.key === 'd') keyMoveX = 1;
    else if (e.key === 'ArrowDown' || e.key === 's') input.crouch = true;
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
      input.jumpPressed = true;
      input.jumpHeld = true;
    } else if (e.key === 'Shift' || e.key === 'x') {
      if (!input.run) input.firePressed = true;
      input.run = true;
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { if (keyMoveX < 0) keyMoveX = 0; }
    else if (e.key === 'ArrowRight' || e.key === 'd') { if (keyMoveX > 0) keyMoveX = 0; }
    else if (e.key === 'ArrowDown' || e.key === 's') input.crouch = false;
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') input.jumpHeld = false;
    else if (e.key === 'Shift' || e.key === 'x') input.run = false;
  });
}

let keyMoveX = 0;

function onPadDown(e) {
  e.preventDefault();
  const now = performance.now();
  padTouches.set(e.pointerId, {
    startX: e.clientX,
    startY: e.clientY,
    lastX: e.clientX,
    lastY: e.clientY,
    lastT: now,
    samples: [{ y: e.clientY, t: now }],
    jumped: false,
  });
  try { stageEl.setPointerCapture(e.pointerId); } catch { /* ignore */ }
}

const SWIPE_SAMPLE_WINDOW = 90; // ms — only consider recent motion for velocity

function onPadMove(e) {
  const t = padTouches.get(e.pointerId);
  if (!t) return;
  e.preventDefault();
  const now = performance.now();

  // Maintain a sliding window of recent y-samples; compute velocity over it.
  t.samples.push({ y: e.clientY, t: now });
  while (t.samples.length > 2 && now - t.samples[0].t > SWIPE_SAMPLE_WINDOW) {
    t.samples.shift();
  }
  const first = t.samples[0];
  const dy = e.clientY - first.y;
  const dt = (now - first.t) / 1000;
  if (!t.jumped && dy < 0 && dt > 0) {
    const vy = dy / dt; // negative = upward
    if (-vy >= SWIPE_VEL_THRESHOLD && -dy >= SWIPE_DY_MIN) {
      input.jumpPressed = true;
      input.jumpHeld = true;
      t.jumped = true;
    }
  }
  // Re-arm: if the finger goes back down past the start, allow another jump
  // from a fresh upward flick.
  if (t.jumped && e.clientY > first.y + 14) {
    t.jumped = false;
  }

  t.lastX = e.clientX;
  t.lastY = e.clientY;
  t.lastT = now;
}

function onPadUp(e) {
  const t = padTouches.get(e.pointerId);
  if (!t) return;
  e.preventDefault();
  padTouches.delete(e.pointerId);
  const now = performance.now();
  const dur = now - t.samples[0].t;
  const totalMove = Math.hypot(e.clientX - t.startX, e.clientY - t.startY);
  // Tap fallback: a quick tap without significant motion = jump.
  if (!t.jumped && dur <= TAP_MAX_MS && totalMove <= TAP_MAX_MOVE) {
    input.jumpPressed = true;
    input.jumpHeld = true;
    // Release immediately so jump-cut applies → produces minimum-height hop
    setTimeout(() => { input.jumpHeld = false; }, 60);
  } else if (t.jumped) {
    input.jumpHeld = false;
  }
  try { stageEl.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
}

// Called once per frame by the game loop to derive moveX/crouch from the
// active touches' current positions, and to fold in keyboard.
export function sampleInput() {
  let touchMoveX = 0;
  let crouching = false;
  let activeTouches = 0;
  const ph = window.innerHeight || 1;
  const padBottomThreshold = ph * (1 - CROUCH_BOTTOM_FRAC);

  for (const t of padTouches.values()) {
    activeTouches++;
    const dx = t.lastX - t.startX;
    if (Math.abs(dx) > MOVE_DEADZONE) {
      const m = Math.max(-1, Math.min(1, (dx > 0 ? dx - MOVE_DEADZONE : dx + MOVE_DEADZONE) / MOVE_MAX));
      // Use the largest-magnitude finger
      if (Math.abs(m) > Math.abs(touchMoveX)) touchMoveX = m;
    }
    // crouch if a finger is below the threshold and not strongly moving sideways
    if (t.lastY >= padBottomThreshold && Math.abs(dx) < MOVE_DEADZONE * 2) {
      crouching = true;
    }
  }

  input.moveX = keyMoveX !== 0 ? keyMoveX : touchMoveX;
  if (!keyMoveX) input.crouch = crouching;
  // jumpPressed is one-shot; cleared by player after consuming.
}

export function consumeJump() {
  const v = input.jumpPressed;
  input.jumpPressed = false;
  return v;
}

export function consumeFire() {
  const v = input.firePressed;
  input.firePressed = false;
  return v;
}
