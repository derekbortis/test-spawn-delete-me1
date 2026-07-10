// Procedural sound effects via WebAudio. No samples shipped — every sound is
// a short synth blip generated on demand. Mobile browsers require an
// AudioContext to be created/resumed from a user gesture, so init() must be
// called from inside a tap handler (the START button or first touch).

let ctx = null;
let masterGain = null;
let muted = false;

export const sfx = {
  init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return;
    }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(ctx.destination);
    } catch {
      ctx = null;
    }
  },

  setMuted(v) { muted = !!v; },

  jump() {
    blip({ type: 'square', f0: 520, f1: 880, dur: 0.18, gain: 0.5 });
  },
  coin() {
    blip({ type: 'square', f0: 988, f1: 1318, dur: 0.07, gain: 0.4 });
    setTimeout(() => blip({ type: 'square', f0: 1318, f1: 1318, dur: 0.12, gain: 0.4 }), 60);
  },
  stomp() {
    blip({ type: 'square', f0: 220, f1: 80, dur: 0.16, gain: 0.5 });
  },
  hit() {
    blip({ type: 'sawtooth', f0: 440, f1: 60, dur: 0.55, gain: 0.45 });
  },
  bump() {
    blip({ type: 'square', f0: 140, f1: 100, dur: 0.05, gain: 0.4 });
  },
  brick() {
    blip({ type: 'square', f0: 180, f1: 60, dur: 0.10, gain: 0.5 });
    noise(0.08, 0.25);
  },
  powerup() {
    const seq = [523, 659, 784, 988, 1175];
    seq.forEach((f, i) => {
      setTimeout(() => blip({ type: 'square', f0: f, f1: f, dur: 0.08, gain: 0.4 }), i * 60);
    });
  },
  fire() {
    blip({ type: 'square', f0: 800, f1: 200, dur: 0.10, gain: 0.35 });
  },
  win() {
    const seq = [659, 784, 988, 1175, 1568];
    seq.forEach((f, i) => {
      setTimeout(() => blip({ type: 'square', f0: f, f1: f, dur: 0.13, gain: 0.45 }), i * 100);
    });
  },
  death() {
    const seq = [440, 392, 349, 294, 220];
    seq.forEach((f, i) => {
      setTimeout(() => blip({ type: 'triangle', f0: f, f1: f, dur: 0.16, gain: 0.5 }), i * 110);
    });
  },
  oneUp() {
    const seq = [659, 880, 1175, 1568];
    seq.forEach((f, i) => {
      setTimeout(() => blip({ type: 'square', f0: f, f1: f, dur: 0.10, gain: 0.4 }), i * 70);
    });
  },
};

function blip({ type, f0, f1, dur, gain }) {
  if (!ctx || muted) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), now + dur);
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(masterGain);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function noise(dur, gain) {
  if (!ctx || muted) return;
  const now = ctx.currentTime;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g).connect(masterGain);
  src.start(now);
}
