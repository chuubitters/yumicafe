import { useSettings } from '../store/settingsStore';

/**
 * Tiny WebAudio synth — every sound is generated at runtime, so no audio files need to ship.
 * The AudioContext is only created after the first user gesture (no autoplay).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  master!.gain.value = useSettings.getState().volume;
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.2, slideTo?: number, delay = 0, dest?: AudioNode) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest || master!);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, vol = 0.15, filterFreq = 1200, q = 1, type: BiquadFilterType = 'bandpass', delay = 0) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = filterFreq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master!);
  src.start(t);
}

export type Sfx =
  | 'click' | 'pop' | 'pour' | 'ice' | 'stir' | 'scoop' | 'pipe' | 'cut' | 'oven' | 'ding'
  | 'shutter' | 'sparkle' | 'flip' | 'sizzle' | 'shake' | 'drop' | 'error' | 'coin' | 'knead' | 'roll';

let lastStir = 0;
export function sfx(name: Sfx) {
  const s = useSettings.getState();
  if (!s.soundEnabled) return;
  try {
    switch (name) {
      case 'click': tone(880, 0.06, 'triangle', 0.08); break;
      case 'pop': tone(520, 0.12, 'sine', 0.18, 1100); break;
      case 'drop': tone(700, 0.15, 'sine', 0.18, 260); break;
      case 'pour': noise(0.9, 0.12, 900, 0.8); noise(0.9, 0.05, 3000, 2, 'bandpass', 0.05); break;
      case 'ice': [0, 0.07, 0.15].forEach((d, i) => tone(2400 + i * 300, 0.09, 'sine', 0.1, 1800, d)); break;
      case 'stir': {
        const now = performance.now();
        if (now - lastStir < 140) return;
        lastStir = now;
        tone(1900 + Math.random() * 500, 0.05, 'sine', 0.04);
        break;
      }
      case 'shake': for (let i = 0; i < 6; i++) noise(0.08, 0.12, 2500, 3, 'bandpass', i * 0.12); break;
      case 'scoop': noise(0.25, 0.1, 500, 1, 'lowpass'); tone(300, 0.2, 'sine', 0.1, 180); break;
      case 'pipe': noise(0.35, 0.06, 700, 0.6, 'lowpass'); break;
      case 'cut': tone(300, 0.08, 'square', 0.06, 120); noise(0.06, 0.1, 3000, 2); break;
      case 'knead': tone(140, 0.12, 'sine', 0.2, 90); break;
      case 'roll': noise(0.4, 0.06, 300, 0.7, 'lowpass'); break;
      case 'oven': tone(200, 0.15, 'square', 0.04); noise(0.3, 0.05, 400, 1, 'lowpass', 0.05); break;
      case 'ding': tone(1568, 0.6, 'sine', 0.15); tone(2093, 0.8, 'sine', 0.1, undefined, 0.12); break;
      case 'shutter': noise(0.05, 0.3, 4000, 1, 'highpass'); noise(0.08, 0.2, 2000, 1, 'highpass', 0.09); break;
      case 'sparkle': [0, 0.06, 0.12, 0.18].forEach((d, i) => tone(1318 * Math.pow(1.26, i), 0.25, 'sine', 0.07, undefined, d)); break;
      case 'flip': tone(400, 0.15, 'sine', 0.12, 900); noise(0.1, 0.05, 1500, 1, 'bandpass', 0.05); break;
      case 'sizzle': noise(0.8, 0.04, 5000, 0.5, 'highpass'); break;
      case 'coin': tone(988, 0.08, 'square', 0.06); tone(1319, 0.3, 'square', 0.06, undefined, 0.08); break;
      case 'error': tone(220, 0.2, 'triangle', 0.1, 180); break;
    }
  } catch {
    /* audio is optional */
  }
}

// ---------- gentle generative café music ----------
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
const CHORDS = [[0, 2, 4], [3, 5, 7], [1, 3, 5], [4, 6, 1]];
let step = 0;

function musicTick() {
  const c = ac();
  if (!c || !musicGain) return;
  const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];
  if (step % 8 === 0) chord.forEach((n) => tone(SCALE[n] / 2, 2.6, 'sine', 0.05, undefined, 0, musicGain!));
  if (Math.random() < 0.6) {
    const n = chord[Math.floor(Math.random() * 3)] + (Math.random() < 0.4 ? 1 : 0);
    tone(SCALE[n % SCALE.length] * (Math.random() < 0.3 ? 2 : 1), 0.7, 'triangle', 0.035, undefined, 0, musicGain!);
  }
  step++;
}

export function setMusic(on: boolean) {
  const c = ac();
  if (!c || !musicGain) return;
  if (on) {
    musicGain.gain.setTargetAtTime(0.9, c.currentTime, 0.5);
    if (musicTimer == null) musicTimer = window.setInterval(musicTick, 380);
  } else {
    musicGain.gain.setTargetAtTime(0.0, c.currentTime, 0.2);
    if (musicTimer != null) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }
}

export function applyVolume(v: number) {
  if (master) master.gain.value = v;
}
