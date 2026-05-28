// Enemies, pickups, fireballs.

import { PHYS, TILE, sweepAABB, aabbOverlap } from './physics.js';
import { SPRITES } from './sprites.js';

// ----- Goomba -----
export class Goomba {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 14; this.h = 14;
    this.vx = -PHYS.enemySpeed;
    this.vy = 0;
    this.onGround = false;
    this.dead = false;
    this.squished = 0;
    this.animT = 0;
    this.frame = 0;
  }
  update(dt, level) {
    if (this.squished > 0) {
      this.squished -= dt;
      if (this.squished <= 0) this.dead = true;
      return;
    }
    this.vy = Math.min(PHYS.maxFall, this.vy + PHYS.gravity * dt);
    const hits = [];
    sweepAABB(this, level, this.vx * dt, this.vy * dt, hits);
    let landed = false;
    for (const h of hits) {
      if (h.axis === 'x') this.vx = -this.vx;
      if (h.axis === 'y' && h.dir > 0) landed = true;
    }
    this.onGround = landed;
    this.animT += dt;
    if (this.animT > 0.18) { this.animT = 0; this.frame ^= 1; }
    if (this.y > level.pixelH + 64) this.dead = true;
  }
  stomp() {
    this.squished = 0.5;
    this.vx = 0;
  }
  render(ctx, camX, camY) {
    const s = this.squished > 0 ? SPRITES.goombaSquish
                                : (this.frame === 0 ? SPRITES.goombaA : SPRITES.goombaB);
    ctx.drawImage(s, Math.floor(this.x - camX - 1), Math.floor(this.y - camY - 2));
  }
}

// ----- Koopa -----
// Walks like a goomba until stomped → becomes a shell. Stomp shell again to kick.
export class Koopa {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 14; this.h = 22;
    this.vx = -PHYS.enemySpeed;
    this.vy = 0;
    this.state = 'walk'; // walk | shell | sliding
    this.dead = false;
    this.animT = 0;
    this.frame = 0;
  }
  update(dt, level) {
    this.vy = Math.min(PHYS.maxFall, this.vy + PHYS.gravity * dt);
    const hits = [];
    sweepAABB(this, level, this.vx * dt, this.vy * dt, hits);
    for (const h of hits) {
      if (h.axis === 'x') this.vx = -this.vx;
    }
    this.animT += dt;
    if (this.animT > 0.18) { this.animT = 0; this.frame ^= 1; }
    if (this.y > level.pixelH + 64) this.dead = true;
  }
  stomp(fromX) {
    if (this.state === 'walk') {
      this.state = 'shell';
      this.vx = 0;
      this.h = 14;
      this.y += 8; // shrink visually
    } else if (this.state === 'shell') {
      this.state = 'sliding';
      this.vx = (this.x + this.w/2 > fromX ? 1 : -1) * PHYS.shellSpeed;
    } else { // sliding → stop
      this.state = 'shell';
      this.vx = 0;
    }
  }
  hitFromSide(player) {
    if (this.state === 'shell') {
      // kick
      this.state = 'sliding';
      this.vx = (this.x + this.w/2 > player.x + player.w/2 ? 1 : -1) * PHYS.shellSpeed;
      return false; // doesn't hurt
    }
    return true;
  }
  render(ctx, camX, camY) {
    let s;
    if (this.state === 'walk') {
      s = this.frame === 0 ? SPRITES.koopaA : SPRITES.koopaB;
      ctx.drawImage(s, Math.floor(this.x - camX - 1), Math.floor(this.y - camY - 2));
    } else {
      s = SPRITES.koopaShell;
      ctx.drawImage(s, Math.floor(this.x - camX - 1), Math.floor(this.y - camY - 2));
    }
  }
}

// ----- Coin (collectible, no collision) -----
export class Coin {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 12; this.h = 16;
    this.dead = false;
    this.animT = 0;
    this.frame = 0;
    this.bobT = Math.random() * Math.PI * 2;
    this.popVy = 0;   // if popped from a question block, an extra arc
    this.popT = 0;
  }
  update(dt) {
    this.animT += dt;
    this.bobT += dt * 4;
    if (this.animT > 0.14) { this.animT = 0; this.frame ^= 1; }
    if (this.popT > 0) {
      this.popVy += 1800 * dt;
      this.y += this.popVy * dt;
      this.popT -= dt;
      if (this.popT <= 0) this.dead = true;
    }
  }
  render(ctx, camX, camY) {
    const s = this.frame === 0 ? SPRITES.coinA : SPRITES.coinB;
    const bob = this.popT > 0 ? 0 : Math.sin(this.bobT) * 1.5;
    ctx.drawImage(s, Math.floor(this.x - camX - 2), Math.floor(this.y - camY + bob - 1));
  }
  static popFromBlock(x, y) {
    const c = new Coin(x, y - 16);
    c.popVy = -360;
    c.popT = 0.55;
    return c;
  }
}

// ----- Powerups -----
export class Powerup {
  constructor(x, y, kind) {
    this.x = x; this.y = y;
    this.w = 14; this.h = 14;
    this.kind = kind; // 'mushroom' | 'flower'
    this.vx = kind === 'mushroom' ? 80 : 0;
    this.vy = 0;
    this.dead = false;
    this.spawnT = 0.6;       // emerging from block
    this.startY = y;
  }
  update(dt, level) {
    if (this.spawnT > 0) {
      this.spawnT -= dt;
      this.y -= dt * 26;
      return;
    }
    if (this.kind === 'mushroom') {
      this.vy = Math.min(PHYS.maxFall, this.vy + PHYS.gravity * dt);
      const hits = [];
      sweepAABB(this, level, this.vx * dt, this.vy * dt, hits);
      for (const h of hits) {
        if (h.axis === 'x') this.vx = -this.vx;
      }
    }
    if (this.y > level.pixelH + 64) this.dead = true;
  }
  render(ctx, camX, camY) {
    const s = this.kind === 'mushroom' ? SPRITES.mushroom : SPRITES.flower;
    ctx.drawImage(s, Math.floor(this.x - camX - 1), Math.floor(this.y - camY - 2));
  }
}

// ----- Fireball -----
export class Fireball {
  constructor(x, y, dir) {
    this.x = x; this.y = y;
    this.w = 6; this.h = 6;
    this.vx = PHYS.fireballSpeed * dir;
    this.vy = 100;
    this.dead = false;
    this.spinT = 0;
    this.life = 1.2;
  }
  update(dt, level, enemies, game) {
    this.life -= dt;
    if (this.life <= 0) { this.dead = true; return; }
    this.vy = Math.min(PHYS.maxFall, this.vy + PHYS.fireballGravity * dt);
    const hits = [];
    sweepAABB(this, level, this.vx * dt, this.vy * dt, hits);
    for (const h of hits) {
      if (h.axis === 'y' && h.dir > 0) {
        this.vy = PHYS.fireballBounce;
      } else if (h.axis === 'x') {
        this.dead = true;
      }
    }
    this.spinT += dt * 20;
    // hit enemies
    for (const e of enemies) {
      if (e.dead) continue;
      if (aabbOverlap(this, e)) {
        e.dead = true;
        this.dead = true;
        game.addScore(200);
        break;
      }
    }
  }
  render(ctx, camX, camY) {
    const s = SPRITES.fireball;
    ctx.save();
    const cx = Math.floor(this.x - camX + this.w/2);
    const cy = Math.floor(this.y - camY + this.h/2);
    ctx.translate(cx, cy);
    ctx.rotate(this.spinT);
    ctx.drawImage(s, -s.width/2, -s.height/2);
    ctx.restore();
  }
}

// ----- Bump particle (brick smash) -----
export class BrickBit {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = 0.7;
    this.dead = false;
  }
  update(dt) {
    this.vy += 1500 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }
  render(ctx, camX, camY) {
    ctx.fillStyle = '#c4731d';
    ctx.fillRect(Math.floor(this.x - camX), Math.floor(this.y - camY), 4, 4);
  }
}
