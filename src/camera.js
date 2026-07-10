// Camera that follows the player horizontally. NES-style: only scroll when the
// player crosses a deadband to the right; never scrolls backward past the start.

import { TILE } from './physics.js';

export class Camera {
  constructor(viewW, viewH) {
    this.viewW = viewW;
    this.viewH = viewH;
    this.x = 0;
    this.y = 0;
    this.maxX = 0;
  }
  setBounds(levelW, levelH) {
    this.levelW = levelW;
    this.levelH = levelH;
  }
  follow(player) {
    // Keep player ~40% from left edge once they've walked forward enough.
    const targetX = player.x + player.w / 2 - this.viewW * 0.4;
    if (targetX > this.x) this.x = targetX;
    // never scroll backward, never past level end
    if (this.x < 0) this.x = 0;
    if (this.x > this.levelW - this.viewW) this.x = this.levelW - this.viewW;
    // vertical: pin to the bottom of the level (level is short)
    this.y = this.levelH - this.viewH;
  }
}
