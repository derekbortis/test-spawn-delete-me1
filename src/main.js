// Entry point. Wires DOM elements, handles canvas scaling, and runs the loop.

import { Game, VIEW_W, VIEW_H } from './game.js';
import { setupInput } from './input.js';
import { sfx } from './audio.js';

const canvas       = document.getElementById('stage');
const gameRoot     = document.getElementById('game-root');
const overlay      = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBody  = document.getElementById('overlay-body');
const overlayBtn   = document.getElementById('overlay-btn');

canvas.width = VIEW_W;
canvas.height = VIEW_H;

function fitCanvas() {
  // Scale canvas to fit the visible game-root area (the part of the screen
  // above the controls), preserving aspect ratio.
  const r = gameRoot.getBoundingClientRect();
  const scale = Math.max(1, Math.floor(Math.min(r.width / VIEW_W, r.height / VIEW_H)));
  // Fall back to fractional scale if the integer one is 0 (tiny screens)
  const useScale = scale * VIEW_W <= r.width && scale * VIEW_H <= r.height
    ? scale
    : Math.min(r.width / VIEW_W, r.height / VIEW_H);
  canvas.style.width  = Math.floor(VIEW_W * useScale) + 'px';
  canvas.style.height = Math.floor(VIEW_H * useScale) + 'px';
}
fitCanvas();
window.addEventListener('resize', fitCanvas);
window.addEventListener('orientationchange', () => setTimeout(fitCanvas, 100));
// iOS Safari shows/hides the URL bar dynamically — re-fit when that happens
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', fitCanvas);
}

setupInput({
  dpad: {
    up:    document.querySelector('.dpad-up'),
    down:  document.querySelector('.dpad-down'),
    left:  document.querySelector('.dpad-left'),
    right: document.querySelector('.dpad-right'),
  },
  a: document.getElementById('btn-a'),
  b: document.getElementById('btn-b'),
});

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
  // Hint iOS Safari to collapse the URL bar
  setTimeout(() => { window.scrollTo(0, 1); fitCanvas(); }, 50);
  setTimeout(() => { starting = false; }, 250);
}
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
