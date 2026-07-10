// Hand-crafted level. Tile codes:
//   .  empty
//   G  ground (solid)
//   B  brick (solid, bumpable, breakable if big)
//   ?  question block (gives coin or powerup, becomes 'U' after hit)
//   U  used question block (solid)
//   [  pipe top-left (solid)
//   ]  pipe top-right (solid)
//   (  pipe body-left (solid)
//   )  pipe body-right (solid)
//   F  flagpole top (non-solid trigger)
//   |  flagpole body (non-solid trigger)
//   c  coin (non-solid pickup)
//   g  goomba spawn
//   k  koopa spawn
//   m  mushroom hidden in nearest '?' to the right (handled by builder)
//   .  empty / sky

import { SPRITES } from './sprites.js';
import { TILE } from './physics.js';

// Each character is one tile (16px). Bottom of array = bottom of world.
// World is ~200 tiles wide, 14 tall (= 224 px tall = visible at most res).
const RAW = [
//        1111111111222222222233333333334444444444555555555566666666667777777777888888888899999999991111111111111111111111111111111111111111111111111111
//0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789000000000011111111112222222222333333333344444444
  '..............................................................................................................................................................................................................',
  '..............................................................................................................................................................................................................',
  '..............................................................................................................................................................................................................',
  '..............................................................................................................................................................................................................',
  '..............................................................................................................................................................................................................',
  '...................c.....................................c.c.c...............cccc..........................................................................................................................F..',
  '...........cBcBcB......B?BcB?B.................c.c..B...........BB..B.....cc........cccc...c.c..B?B...........c..c..c..c..............................c..c..............c.c....c.c.....cccccc.................|..',
  '....................................................................[]..................................B?B..............B..B..B..B...B...........................................................c.........|..',
  '...............................................................[]..()...........[]......................................................................................c.cccc..............cc..............|..',
  '............c..g.....g.g..............k............[]...g.......()..()....g.......()........g..g..k.........g..g...........g..g..g..g....k.....g.g.g........g.....g..g....................g.g...g.g.g.........|..',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG..GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
];

// Mark the first '?' to spawn a mushroom (rather than a coin). The 2nd '?' spawns a flower.
const POWERUP_QUESTIONS_TO_PROMOTE = [0, 1]; // indices of '?' tiles to upgrade

export class Level {
  constructor() {
    this.h = RAW.length;
    this.w = Math.max(...RAW.map(r => r.length));
    this.tiles = new Array(this.h * this.w).fill('.');
    this.enemySpawns = [];
    this.coinSpawns = [];
    this.powerupQuestions = new Set();

    let qIdx = 0;
    for (let y = 0; y < this.h; y++) {
      const row = RAW[y];
      for (let x = 0; x < this.w; x++) {
        const ch = row[x] || '.';
        if (ch === 'g')      { this.enemySpawns.push({ type: 'goomba', x, y }); this.tiles[y*this.w + x] = '.'; }
        else if (ch === 'k') { this.enemySpawns.push({ type: 'koopa',  x, y }); this.tiles[y*this.w + x] = '.'; }
        else if (ch === 'c') { this.coinSpawns.push({ x, y });                  this.tiles[y*this.w + x] = '.'; }
        else                 { this.tiles[y*this.w + x] = ch; }
        if (ch === '?') {
          if (POWERUP_QUESTIONS_TO_PROMOTE.includes(qIdx)) this.powerupQuestions.add(y*this.w + x);
          qIdx++;
        }
      }
    }

    this.pixelW = this.w * TILE;
    this.pixelH = this.h * TILE;

    // Find flagpole position for win detection
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.at(x, y) === 'F') {
          this.flagpoleX = x * TILE;
          this.flagpoleTopY = y * TILE;
          break;
        }
      }
    }
  }

  at(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return '.';
    return this.tiles[ty * this.w + tx];
  }

  set(tx, ty, ch) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return;
    this.tiles[ty * this.w + tx] = ch;
  }

  solidAt(tx, ty) {
    if (ty >= this.h) return false;          // fall off bottom
    const c = this.at(tx, ty);
    return c === 'G' || c === 'B' || c === '?' || c === 'U' ||
           c === '[' || c === ']' || c === '(' || c === ')';
  }

  isQuestion(tx, ty) { return this.at(tx, ty) === '?'; }
  isBreakable(tx, ty) { return this.at(tx, ty) === 'B'; }

  // Does this '?' tile carry a powerup payload? Caller picks mushroom vs flower
  // based on player state (small → mushroom; big/fire → flower).
  isPowerupQuestion(tx, ty) {
    return this.powerupQuestions.has(ty * this.w + tx);
  }
  consumePowerupQuestion(tx, ty) {
    this.powerupQuestions.delete(ty * this.w + tx);
  }

  render(ctx, camX, camY, viewW, viewH, t) {
    const x0 = Math.max(0, Math.floor(camX / TILE));
    const x1 = Math.min(this.w - 1, Math.ceil((camX + viewW) / TILE));
    const y0 = Math.max(0, Math.floor(camY / TILE));
    const y1 = Math.min(this.h - 1, Math.ceil((camY + viewH) / TILE));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const c = this.tiles[y * this.w + x];
        let s = null;
        switch (c) {
          case 'G': s = SPRITES.tileGround; break;
          case 'B': s = SPRITES.tileBrick; break;
          case '?': {
            // gentle pulsing bob is handled by the sprite alone; flicker = use two states
            s = SPRITES.tileQuestion;
            // small "shine" — re-use plain question; could animate later
            break;
          }
          case 'U': s = SPRITES.tileQuestionUsed; break;
          case '[': s = SPRITES.tilePipeTopL; break;
          case ']': s = SPRITES.tilePipeTopR; break;
          case '(': s = SPRITES.tilePipeBodyL; break;
          case ')': s = SPRITES.tilePipeBodyR; break;
          case 'F':
          case '|': s = SPRITES.flagPole; break;
          default: continue;
        }
        if (s) ctx.drawImage(s, Math.floor(x * TILE - camX), Math.floor(y * TILE - camY));
      }
    }

    // Flagpole top + cloth
    if (this.flagpoleX != null) {
      const fx = Math.floor(this.flagpoleX - camX);
      const fy = Math.floor(this.flagpoleTopY - camY);
      ctx.drawImage(SPRITES.flagTop, fx, fy - 8);
    }
  }
}
