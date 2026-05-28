// Player entity — movement, jumping (with coyote time + buffer + variable
// height), powerup state machine, animation, and tilemap collision callbacks.

import { input, consumeJump, consumeFire } from './input.js';
import { PHYS, TILE, sweepAABB } from './physics.js';
import { SPRITES } from './sprites.js';

const STATE = {
  SMALL:    'small',
  BIG:      'big',
  FIRE:     'fire',
};

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.onGround = false;
    this.lastGroundT = 0;
    this.jumpBufferT = 0;
    this.holdingJump = false;
    this.crouching = false;
    this.state = STATE.SMALL;
    this.animT = 0;
    this.frame = 0;
    this.invuln = 0;       // i-frames after damage
    this.starT = 0;
    this.dead = false;
    this.win = false;
    this.winT = 0;
    this.firedRecently = 0; // small cooldown
    this.updateHitbox();
  }

  isBig() { return this.state !== STATE.SMALL; }
  isFire() { return this.state === STATE.FIRE; }

  updateHitbox() {
    this.w = 12;
    if (this.isBig() && !this.crouching) {
      this.h = 28;
    } else {
      this.h = 14;
    }
  }

  // Damage handler — small dies, big shrinks, fire shrinks to big.
  takeDamage() {
    if (this.invuln > 0 || this.dead || this.win) return;
    if (this.state === STATE.SMALL) {
      this.dead = true;
      this.vy = -360;
      this.vx = 0;
    } else if (this.state === STATE.FIRE) {
      this.state = STATE.BIG;
      this.invuln = 1.5;
    } else {
      this.state = STATE.SMALL;
      this.invuln = 1.5;
    }
    this.updateHitbox();
  }

  powerUp(kind) {
    if (kind === 'mushroom' && this.state === STATE.SMALL) {
      // grow: keep feet planted
      this.y -= 14;
      this.state = STATE.BIG;
    } else if (kind === 'flower') {
      if (this.state === STATE.SMALL) {
        this.y -= 14;
      }
      this.state = STATE.FIRE;
    }
    this.updateHitbox();
  }

  update(dt, level, game) {
    if (this.dead) {
      this.vy += PHYS.gravity * dt;
      this.y += this.vy * dt;
      return;
    }
    if (this.win) {
      // simple flagpole slide → walk-off animation
      this.winT += dt;
      if (this.winT < 1.2) {
        this.y = Math.min(this.y + 120 * dt, level.pixelH - 2 * TILE - this.h);
      } else {
        this.x += 60 * dt;
        this.vy += PHYS.gravity * dt;
        this.y += this.vy * dt;
      }
      return;
    }

    // ----- horizontal input → acceleration -----
    const wantRun = input.run;
    const maxSpeed = wantRun ? PHYS.runMax : PHYS.walkMax;
    const accel = this.onGround
      ? (wantRun ? PHYS.runAccel : PHYS.walkAccel)
      : PHYS.airAccel;

    const ix = input.moveX;
    if (Math.abs(ix) > 0.05) {
      const target = ix * maxSpeed;
      // reverse direction → skid
      const isReversing = (this.vx > 0 && target < 0) || (this.vx < 0 && target > 0);
      const a = isReversing ? PHYS.turnFriction + accel : accel;
      if (this.vx < target) this.vx = Math.min(target, this.vx + a * dt);
      else if (this.vx > target) this.vx = Math.max(target, this.vx - a * dt);
      this.facing = ix > 0 ? 1 : -1;
    } else if (this.onGround) {
      // friction
      const f = PHYS.friction * dt;
      if (this.vx > 0) this.vx = Math.max(0, this.vx - f);
      else if (this.vx < 0) this.vx = Math.min(0, this.vx + f);
    }

    // ----- crouch (only big) -----
    const wantCrouch = input.crouch && this.isBig() && this.onGround;
    if (wantCrouch !== this.crouching) {
      this.crouching = wantCrouch;
      const oldH = this.h;
      this.updateHitbox();
      if (this.crouching) this.y += (oldH - this.h);
      else                this.y -= (this.h - oldH);
    }

    // ----- jump (coyote + buffer + variable height) -----
    if (consumeJump()) {
      this.jumpBufferT = PHYS.jumpBuffer;
      this.holdingJump = true;
    }
    if (!input.jumpHeld) this.holdingJump = false;

    const canCoyote = (game.tNow - this.lastGroundT) <= PHYS.coyoteTime;
    if (this.jumpBufferT > 0 && (this.onGround || canCoyote)) {
      // boost a little if running
      const speedRatio = Math.min(1, Math.abs(this.vx) / PHYS.runMax);
      this.vy = PHYS.jumpV + speedRatio * PHYS.runJumpBoost;
      this.onGround = false;
      this.lastGroundT = -1;
      this.jumpBufferT = 0;
      game.onJump?.();
    }
    if (this.jumpBufferT > 0) this.jumpBufferT -= dt;

    // ----- gravity (with jump-cut + fall-snap) -----
    let g = PHYS.gravity;
    if (this.vy < 0 && !this.holdingJump) g = PHYS.cutGravity;
    else if (this.vy > 0) g = PHYS.fallGravity;
    this.vy = Math.min(PHYS.maxFall, this.vy + g * dt);

    // ----- fire -----
    if (this.isFire() && consumeFire() && this.firedRecently <= 0) {
      game.spawnFireball(this);
      this.firedRecently = 0.35;
    }
    if (this.firedRecently > 0) this.firedRecently -= dt;

    // ----- collide and move -----
    const dx = this.vx * dt;
    const dy = this.vy * dt;
    const wasOnGround = this.onGround;
    const hits = [];
    const { hitY } = sweepAABB(this, level, dx, dy, hits);

    // Process bump-from-below
    let nowOnGround = false;
    for (const h of hits) {
      if (h.axis === 'y' && h.dir < 0) {
        // hit head — bump tile
        game.bumpTile(h.tx, h.ty, this);
      } else if (h.axis === 'y' && h.dir > 0) {
        nowOnGround = true;
      }
    }
    this.onGround = nowOnGround;
    if (nowOnGround) this.lastGroundT = game.tNow;
    if (wasOnGround && !nowOnGround && this.vy >= 0) {
      // started falling — track for coyote
      this.lastGroundT = game.tNow;
    }

    // ----- bounds -----
    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.y > level.pixelH + 64) this.dead = true; // fell out

    // ----- invuln tick -----
    if (this.invuln > 0) this.invuln -= dt;

    // ----- animation -----
    this.animT += dt;
    const moving = Math.abs(this.vx) > 8;
    const animSpeed = moving ? (0.18 - Math.min(0.12, Math.abs(this.vx) / 2000)) : 0.25;
    if (this.animT > animSpeed) {
      this.animT = 0;
      this.frame = (this.frame + 1) & 1;
    }
  }

  render(ctx, camX, camY) {
    // Flicker if invulnerable
    if (this.invuln > 0 && Math.floor(this.invuln * 16) % 2 === 0) return;
    const big = this.isBig();
    const L = this.facing < 0;
    let s;
    if (this.dead) {
      s = big ? (L ? SPRITES.playerBigJumpL : SPRITES.playerBigJump)
              : (L ? SPRITES.playerSmallJumpL : SPRITES.playerSmallJump);
    } else if (this.crouching) {
      s = big ? (L ? SPRITES.playerBigCrouchL : SPRITES.playerBigCrouch)
              : (L ? SPRITES.playerSmallCrouchL : SPRITES.playerSmallCrouch);
    } else if (!this.onGround) {
      s = big ? (L ? SPRITES.playerBigJumpL : SPRITES.playerBigJump)
              : (L ? SPRITES.playerSmallJumpL : SPRITES.playerSmallJump);
    } else if (Math.abs(this.vx) > 8) {
      // 2-frame run cycle (alternating with idle)
      if (this.frame === 0) {
        s = big ? (L ? SPRITES.playerBigRunL : SPRITES.playerBigRun)
                : (L ? SPRITES.playerSmallRunL : SPRITES.playerSmallRun);
      } else {
        s = big ? (L ? SPRITES.playerBigIdleL : SPRITES.playerBigIdle)
                : (L ? SPRITES.playerSmallIdleL : SPRITES.playerSmallIdle);
      }
    } else {
      s = big ? (L ? SPRITES.playerBigIdleL : SPRITES.playerBigIdle)
              : (L ? SPRITES.playerSmallIdleL : SPRITES.playerSmallIdle);
    }
    // tint for fire flower state
    if (this.isFire()) {
      // simple tinting overlay: draw a translucent yellow rect
      ctx.drawImage(s, Math.floor(this.x - camX - 2), Math.floor(this.y - camY));
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(255,220,120,0.18)';
      ctx.fillRect(Math.floor(this.x - camX - 2), Math.floor(this.y - camY), 16, big ? 32 : 16);
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.drawImage(s, Math.floor(this.x - camX - 2), Math.floor(this.y - camY));
    }
  }
}
