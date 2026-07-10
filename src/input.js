// SNES-style virtual gamepad input. Buttons in the DOM drive a shared
// snapshot object the game reads each frame.
//
// Mapping:
//   Left / Right d-pad → moveX (-1 / +1)
//   Down d-pad         → crouch (held)
//   Up d-pad           → also triggers jump (extra option, since Up doesn't do much in this game)
//   A                  → jump (variable-height via hold/release)
//   B                  → run + fire (held = run; press = fire when powered)
//
// Keyboard mirrors the same mapping (Arrow keys + Z/X) for desktop testing.

export const input = {
  moveX: 0,
  jumpPressed: false,
  jumpHeld: false,
  crouch: false,
  run: false,
  firePressed: false,
};

// Per-button held state. Lets us combine multiple sources (touch + keys).
const held = { left: 0, right: 0, down: 0, up: 0, a: 0, b: 0 };

function recompute() {
  const leftOn  = held.left  > 0;
  const rightOn = held.right > 0;
  input.moveX = leftOn && !rightOn ? -1 : rightOn && !leftOn ? 1 : 0;
  input.crouch = held.down > 0;
}

function bindButton(el, key, opts = {}) {
  if (!el) return;
  let activePointer = null;
  const press = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (activePointer !== null && e && e.pointerId !== activePointer) return;
    if (e && 'pointerId' in e) activePointer = e.pointerId;
    if (held[key] === 0) opts.onPress?.();
    held[key]++;
    el.classList.add('pressed');
    recompute();
  };
  const release = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (e && 'pointerId' in e && activePointer !== null && e.pointerId !== activePointer) return;
    activePointer = null;
    if (held[key] > 0) held[key]--;
    if (held[key] === 0) {
      el.classList.remove('pressed');
      opts.onRelease?.();
    }
    recompute();
  };
  el.addEventListener('pointerdown',   press,   { passive: false });
  el.addEventListener('pointerup',     release, { passive: false });
  el.addEventListener('pointercancel', release, { passive: false });
  el.addEventListener('pointerleave',  release, { passive: false });
  // Block context menu on long-press
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}

export function setupInput(refs) {
  // refs: { dpad: {up,down,left,right}, a, b }

  // Block iOS pinch/double-tap zoom at the page level
  const blockGesture = (e) => e.preventDefault();
  document.addEventListener('gesturestart',  blockGesture, { passive: false });
  document.addEventListener('gesturechange', blockGesture, { passive: false });
  document.addEventListener('gestureend',    blockGesture, { passive: false });
  document.addEventListener('contextmenu',   blockGesture);

  bindButton(refs.dpad.left,  'left');
  bindButton(refs.dpad.right, 'right');
  bindButton(refs.dpad.down,  'down');

  // Up triggers an alternate jump (handy for thumbs already on the d-pad)
  bindButton(refs.dpad.up, 'up', {
    onPress: () => { input.jumpPressed = true; input.jumpHeld = true; },
    onRelease: () => { input.jumpHeld = false; },
  });

  // A = jump (variable height)
  bindButton(refs.a, 'a', {
    onPress: () => { input.jumpPressed = true; input.jumpHeld = true; },
    onRelease: () => { input.jumpHeld = false; },
  });

  // B = run + fire
  bindButton(refs.b, 'b', {
    onPress: () => { if (!input.run) input.firePressed = true; input.run = true; },
    onRelease: () => { input.run = false; },
  });

  // ----- Keyboard fallback (desktop) -----
  const keymap = {
    ArrowLeft: 'left', a: 'left',
    ArrowRight: 'right', d: 'right',
    ArrowDown: 'down', s: 'down',
    ArrowUp: 'up', w: 'up',
    ' ': 'a', z: 'a', x: 'b', Shift: 'b',
  };
  const downKeys = new Set();
  window.addEventListener('keydown', (e) => {
    const key = keymap[e.key];
    if (!key) return;
    if (e.repeat || downKeys.has(e.key)) return;
    downKeys.add(e.key);
    held[key]++;
    if (key === 'a' || key === 'up') { input.jumpPressed = true; input.jumpHeld = true; }
    if (key === 'b') { if (!input.run) input.firePressed = true; input.run = true; }
    recompute();
  });
  window.addEventListener('keyup', (e) => {
    const key = keymap[e.key];
    if (!key) return;
    if (!downKeys.has(e.key)) return;
    downKeys.delete(e.key);
    if (held[key] > 0) held[key]--;
    if (key === 'a' || key === 'up') { if (held.a === 0 && held.up === 0) input.jumpHeld = false; }
    if (key === 'b' && held.b === 0) input.run = false;
    recompute();
  });
}

// Game loop calls this once per frame. (We compute eagerly on event, but
// having this entry point lets the game stay decoupled from event details.)
export function sampleInput() { /* no-op: recompute() runs on every event */ }

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
