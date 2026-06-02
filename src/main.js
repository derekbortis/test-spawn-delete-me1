// Entry point. Wires DOM elements, handles canvas scaling, and runs the loop.

import { Game, VIEW_W, VIEW_H } from './game.js';
import { setupInput } from './input.js';
import { sfx } from './audio.js';

const canvas      = document.getElementById('stage');
const actionBtn   = document.getElementById('action-btn');
const overlay     = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBody  = document.getElementById('overlay-body');
const overlayBtn   = document.getElementById('overlay-btn');

canvas.width = VIEW_W;
canvas.height = VIEW_H;

function fitCanvas() {
  // Scale to fill viewport while preserving aspect ratio.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(vw / VIEW_W, vh / VIEW_H);
  const w = Math.floor(VIEW_W * scale);
  const h = Math.floor(VIEW_H * scale);
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
}
fitCanvas();
window.addEventListener('resize', fitCanvas);
window.addEventListener('orientationchange', fitCanvas);

setupInput(canvas, actionBtn);

const hudEls = {
  score: document.getElementById('hud-score'),
  coins: document.getElementById('hud-coins'),
  lives: document.getElementById('hud-lives'),
  time:  document.getElementById('hud-time'),
};
const overlayEls = {
  root: overlay, title: overlayTitle, body: overlayBody, btn: overlayBtn,
};

const game = new Game(canvas, hudEls, overlayEls);

let starting = false;
function beginGame(e) {
  if (starting) return;
  starting = true;
  if (e && e.cancelable) {
    try { e.preventDefault(); } catch { /* ignore */ }
  }
  try { sfx.init(); } catch { /* audio is non-fatal */ }
  if (game.state === 'gameover' || game.state === 'win') {
    game.reset(true);
  }
  game.start();
  setTimeout(() => { starting = false; }, 250);
}
// Listen on both the button AND the overlay div, with both pointerup and click,
// so a tap anywhere on the overlay starts the game regardless of which event
// the browser delivers first.
for (const el of [overlayBtn, overlay]) {
  el.addEventListener('click',     beginGame);
  el.addEventListener('pointerup', beginGame);
}

let lastT = performance.now();
function frame(t) {
  const dt = Math.min(0.1, (t - lastT) / 1000);
  lastT = t;
  game.tick(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
