// Main game state + loop orchestration.

import { Level } from './level.js';
import { Camera } from './camera.js';
import { Player } from './player.js';
import { Goomba, Koopa, Coin, Powerup, Fireball, BrickBit } from './entities.js';
import { input, sampleInput } from './input.js';
import { SPRITES, bakeSprites } from './sprites.js';
import { TILE, aabbOverlap } from './physics.js';

// Logical resolution. The canvas is rendered at this resolution then scaled
// (via CSS) to fit the device. 320 x 192 ≈ 5:3, fits well on most phones.
export const VIEW_W = 320;
export const VIEW_H = 192;

const FIXED_DT = 1 / 60;
const MAX_DT = 0.05;

export class Game {
  constructor(canvas, hudEls, overlayEls) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.ctx.imageSmoothingEnabled = false;
    this.hud = hudEls;
    this.overlay = overlayEls;

    bakeSprites();

    this.tNow = 0;
    this.acc = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.timer = 300;
    this.timerRemainder = 0;
    this.state = 'title'; // title | play | dead | win | gameover

    this.cameraShake = 0;

    this.reset(true);
  }

  reset(firstLoad) {
    this.level = new Level();
    this.camera = new Camera(VIEW_W, VIEW_H);
    this.camera.setBounds(this.level.pixelW, this.level.pixelH);

    this.player = new Player(2 * TILE, (this.level.h - 4) * TILE);
    this.enemies = [];
    this.pickups = [];
    this.fireballs = [];
    this.particles = [];
    this.popupCoins = [];

    for (const s of this.level.enemySpawns) {
      const px = s.x * TILE;
      const py = s.y * TILE - 2;
      if (s.type === 'goomba') this.enemies.push(new Goomba(px, py));
      else if (s.type === 'koopa') this.enemies.push(new Koopa(px, py - 8));
    }
    for (const c of this.level.coinSpawns) {
      this.pickups.push(new Coin(c.x * TILE, c.y * TILE));
    }

    this.timer = 300;
    this.timerRemainder = 0;
    if (firstLoad) {
      this.score = 0;
      this.coins = 0;
      this.lives = 3;
    }
    this.refreshHUD();
  }

  start() {
    this.state = 'play';
    this.overlay.root.classList.add('hidden');
  }

  showOverlay(title, body, btnLabel) {
    this.overlay.title.textContent = title;
    this.overlay.body.textContent = body;
    this.overlay.btn.textContent = btnLabel;
    this.overlay.root.classList.remove('hidden');
  }

  refreshHUD() {
    this.hud.score.textContent = 'SCORE ' + String(this.score).padStart(6, '0');
    this.hud.coins.textContent = 'x' + String(this.coins).padStart(2, '0');
    this.hud.lives.textContent = 'LIVES ' + this.lives;
    this.hud.time.textContent  = 'TIME ' + String(Math.max(0, Math.ceil(this.timer))).padStart(3, '0');
  }

  addScore(n) { this.score += n; this.refreshHUD(); }
  addCoin(n = 1) {
    this.coins += n;
    if (this.coins >= 100) { this.coins -= 100; this.lives += 1; }
    this.addScore(200);
  }

  // --- callbacks from player ---
  bumpTile(tx, ty, player) {
    const c = this.level.at(tx, ty);
    if (c === '?') {
      const power = this.level.promoteQuestion(tx, ty);
      this.level.set(tx, ty, 'U');
      this.cameraShake = 0.08;
      if (power) {
        this.pickups.push(new Powerup(tx * TILE + 1, ty * TILE, power));
      } else {
        this.popupCoins.push(Coin.popFromBlock(tx * TILE, ty * TILE));
        this.addCoin(1);
      }
    } else if (c === 'B') {
      if (player.isBig()) {
        this.level.set(tx, ty, '.');
        this.addScore(50);
        // brick chunks
        const cx = tx * TILE + 8;
        const cy = ty * TILE + 8;
        for (const [vx, vy] of [[-80, -260], [80, -260], [-120, -180], [120, -180]]) {
          this.particles.push(new BrickBit(cx, cy, vx, vy));
        }
      } else {
        this.cameraShake = 0.08;
      }
    }
  }

  spawnFireball(player) {
    const fx = player.x + (player.facing > 0 ? player.w : -2);
    const fy = player.y + 6;
    this.fireballs.push(new Fireball(fx, fy, player.facing));
  }

  onJump() {
    // (audio hook point)
  }

  // --- main step ---
  tick(rawDt) {
    sampleInput();
    if (this.state === 'play') {
      this.acc += Math.min(MAX_DT, rawDt);
      while (this.acc >= FIXED_DT) {
        this.step(FIXED_DT);
        this.acc -= FIXED_DT;
      }
    }
    this.render();
  }

  step(dt) {
    this.tNow += dt;

    // timer
    this.timerRemainder += dt;
    if (this.timerRemainder >= 0.4) {
      this.timer -= 1; // ~2.5x faster than wall clock — matches retro feel
      this.timerRemainder = 0;
      this.refreshHUD();
      if (this.timer <= 0 && !this.player.win && !this.player.dead) {
        this.player.takeDamage();
        this.player.dead = true;
      }
    }

    this.player.update(dt, this.level, this);

    // popup coins from bumped blocks
    for (const c of this.popupCoins) c.update(dt);
    this.popupCoins = this.popupCoins.filter(c => !c.dead);

    for (const e of this.enemies) e.update(dt, this.level);
    for (const p of this.pickups) p.update(dt, this.level);
    for (const f of this.fireballs) f.update(dt, this.level, this.enemies, this);
    for (const p of this.particles) p.update(dt);

    // player vs enemies
    if (!this.player.dead && !this.player.win) {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (!aabbOverlap(this.player, e)) continue;
        // stomp = falling and feet are above enemy's top
        const playerBottom = this.player.y + this.player.h;
        const enemyTop = e.y;
        if (this.player.vy > 30 && playerBottom - this.player.vy * (1/60) <= enemyTop + 4) {
          // stomp
          if (e instanceof Goomba) {
            e.stomp();
            this.addScore(100);
          } else if (e instanceof Koopa) {
            e.stomp(this.player.x + this.player.w/2);
            this.addScore(100);
          }
          this.player.vy = -260; // bounce
          this.player.holdingJump = input.jumpHeld; // keep variable
        } else {
          // sliding shells are dangerous; walking koopa in shell mode is safe-to-kick
          if (e instanceof Koopa && e.state === 'shell' && Math.abs(e.vx) < 1) {
            // kick
            e.hitFromSide(this.player);
            this.addScore(400);
          } else {
            this.player.takeDamage();
          }
        }
      }
    }

    // player vs pickups
    for (const p of this.pickups) {
      if (p.dead) continue;
      if (!aabbOverlap(this.player, p)) continue;
      if (p instanceof Coin) {
        p.dead = true;
        this.addCoin(1);
      } else if (p instanceof Powerup) {
        if (p.spawnT > 0) continue;
        p.dead = true;
        this.player.powerUp(p.kind);
        this.addScore(p.kind === 'flower' ? 1000 : 500);
      }
    }

    // flagpole win
    if (!this.player.win && this.level.flagpoleX != null) {
      if (this.player.x + this.player.w >= this.level.flagpoleX &&
          this.player.x <= this.level.flagpoleX + TILE) {
        this.player.win = true;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.x = this.level.flagpoleX - 4;
        this.addScore(1000 + Math.max(0, Math.floor(this.timer)) * 10);
      }
    }

    // clean dead
    this.enemies   = this.enemies.filter(e => !e.dead);
    this.pickups   = this.pickups.filter(p => !p.dead);
    this.fireballs = this.fireballs.filter(f => !f.dead);
    this.particles = this.particles.filter(p => !p.dead);

    // win / death transitions
    if (this.player.dead) {
      this.player.deadT = (this.player.deadT || 0) + dt;
      if (this.player.deadT > 1.5) {
        this.player.deadT = 0;
        this.lives -= 1;
        if (this.lives <= 0) {
          this.state = 'gameover';
          this.showOverlay('GAME OVER', 'Tap RESTART to try again.', 'RESTART');
        } else {
          this.reset(false);
        }
        this.refreshHUD();
      }
    }
    if (this.player.win && this.player.winT > 3.5) {
      this.state = 'win';
      this.showOverlay('YOU WIN!', `Final score: ${this.score}.`, 'PLAY AGAIN');
    }

    if (this.cameraShake > 0) this.cameraShake -= dt;

    this.camera.follow(this.player);
  }

  render() {
    const ctx = this.ctx;
    const { x: camX, y: camY } = this.camera;
    const sx = (this.cameraShake > 0 ? (Math.random() - 0.5) * 4 : 0);
    const sy = (this.cameraShake > 0 ? (Math.random() - 0.5) * 2 : 0);

    // Sky background gradient (a clean simple solid + cloud band)
    ctx.fillStyle = '#5C94FC';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Parallax: hills + clouds. We tile them across the world but draw with
    // a fraction of camX so they scroll slower than the foreground.
    const hillImg = SPRITES.hill;
    const cloudImg = SPRITES.cloud;
    const hillParallax = 0.5;
    const cloudParallax = 0.3;
    const hillOff = (camX * hillParallax) % (hillImg.width * 4);
    for (let i = -1; i < Math.ceil(VIEW_W / (hillImg.width * 2)) + 2; i++) {
      const hx = i * hillImg.width * 2 - hillOff;
      ctx.drawImage(hillImg, Math.floor(hx + sx), VIEW_H - 48 + sy);
    }
    const cloudOff = (camX * cloudParallax) % (cloudImg.width * 6);
    for (let i = -1; i < Math.ceil(VIEW_W / (cloudImg.width * 3)) + 2; i++) {
      const cx = i * cloudImg.width * 3 - cloudOff;
      ctx.drawImage(cloudImg, Math.floor(cx + sx), 20 + (i % 3) * 14 + sy);
    }

    // World
    this.level.render(ctx, camX - sx, camY - sy, VIEW_W, VIEW_H, this.tNow);
    for (const p of this.pickups)  p.render(ctx, camX - sx, camY - sy);
    for (const c of this.popupCoins) c.render(ctx, camX - sx, camY - sy);
    for (const e of this.enemies)  e.render(ctx, camX - sx, camY - sy);
    for (const f of this.fireballs) f.render(ctx, camX - sx, camY - sy);
    for (const p of this.particles) p.render(ctx, camX - sx, camY - sy);
    this.player.render(ctx, camX - sx, camY - sy);
  }
}
