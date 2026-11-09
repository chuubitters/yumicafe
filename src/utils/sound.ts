import { useSettings } from '../store/settingsStore';

/**
 * WebAudio synth — every sound is generated at runtime, so no audio files ship with the game.
 * Signal chain:  voices ─┬─ dry ────────────┐
 *                        └─ reverb send ─ convolver ─┴─ master ─ compressor ─ out
 * The AudioContext is only created/resumed after the first user gesture (no autoplay).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let reverbSend: GainNode | null = null;
let musicGain: GainNode | null = null;
let unlocked = false;
let lastSfxAt = 0;

/** generated room impulse response (soft café room) */
function makeImpulse(c: AudioContext, seconds = 1.7, decay = 2.6) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function ac() {
  if (!unlocked) return null;
  if (!ctx) {
    const C = window.AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    comp.connect(ctx.destination);
    master = ctx.createGain();
    master.connect(comp);
    sfxBus = ctx.createGain();
    sfxBus.connect(master);
    const conv = ctx.createConvolver();
    conv.buffer = makeImpulse(ctx);
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.22;
    reverbSend.connect(conv);
    const wet = ctx.createGain();
    wet.gain.value = 0.8;
    conv.connect(wet);
    wet.connect(master);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(master);
    musicGain.connect(reverbSend);
  }
  if (ctx.state === 'suspended') ctx.resume();
  master!.gain.value = useSettings.getState().volume;
  return ctx;
}

/** unlock audio on first interaction */
export function installAudioUnlock() {
  const go = () => {
    unlocked = true;
    ac();
    window.removeEventListener('pointerdown', go, true);
    window.removeEventListener('keydown', go, true);
    window.removeEventListener('touchend', go, true);
  };
  window.addEventListener('pointerdown', go, true);
  window.addEventListener('keydown', go, true);
  window.addEventListener('touchend', go, true);
}

interface ToneOpts {
  type?: OscillatorType;
  vol?: number;
  slideTo?: number;
  delay?: number;
  attack?: number;
  dest?: AudioNode;
  wet?: number; // reverb amount 0..1
  detune?: number;
  vibrato?: number;
}

function tone(freq: number, dur: number, o: ToneOpts = {}) {
  const c = ac();
  if (!c) return;
  const { type = 'sine', vol = 0.2, slideTo, delay = 0, attack = 0.008, wet = 0.25, detune = 0, vibrato = 0 } = o;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (detune) osc.detune.value = detune;
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
  if (vibrato) {
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 5.5;
    lg.gain.value = vibrato;
    lfo.connect(lg);
    lg.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + dur + 0.1);
  }
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  const out = o.dest || sfxBus!;
  g.connect(out);
  if (wet > 0 && !o.dest) {
    const s = c.createGain();
    s.gain.value = wet;
    g.connect(s);
    s.connect(reverbSend!);
  }
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** glassy bell: fundamental + inharmonic partials */
function bell(freq: number, dur = 1.2, vol = 0.14, delay = 0) {
  tone(freq, dur, { vol, delay, wet: 0.5 });
  tone(freq * 2.76, dur * 0.55, { vol: vol * 0.35, delay, wet: 0.5 });
  tone(freq * 5.4, dur * 0.28, { vol: vol * 0.15, delay, wet: 0.5 });
}

function noise(dur: number, vol = 0.15, f0 = 1200, q = 1, type: BiquadFilterType = 'bandpass', delay = 0, f1?: number, wet = 0.1, dest?: AudioNode) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + Math.min(0.03, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest || sfxBus!);
  if (wet > 0 && !dest) {
    const s = c.createGain();
    s.gain.value = wet;
    g.connect(s);
    s.connect(reverbSend!);
  }
  src.start(t);
}

export type Sfx =
  | 'click' | 'pop' | 'pour' | 'ice' | 'stir' | 'scoop' | 'pipe' | 'cut' | 'oven' | 'ding'
  | 'shutter' | 'sparkle' | 'flip' | 'sizzle' | 'shake' | 'drop' | 'error' | 'coin' | 'knead' | 'roll'
  | 'hover' | 'tap' | 'tab' | 'whoosh' | 'fizz' | 'clink' | 'stamp' | 'levelup' | 'unlock' | 'success'
  | 'open' | 'close' | 'select' | 'undo' | 'redo' | 'delete' | 'upload' | 'pickup' | 'place' | 'tick' | 'toggle'
  | 'drizzle' | 'sprinkle' | 'bake' | 'cheer' | 'meow';

const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5];
let selectIdx = 0;
const last: Record<string, number> = {};
const gate = (k: string, ms: number) => {
  const n = performance.now();
  if (n - (last[k] || 0) < ms) return false;
  last[k] = n;
  return true;
};
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function sfx(name: Sfx, param = 0.5) {
  const s = useSettings.getState();
  if (!s.soundEnabled || !unlocked) return;
  if (name !== 'hover') lastSfxAt = performance.now();
  try {
    switch (name) {
      // ---- UI ----
      case 'hover':
        if (!gate('hover', 60)) return;
        tone(rnd(1500, 1750), 0.05, { type: 'sine', vol: 0.018, wet: 0.1 });
        break;
      case 'click':
      case 'tap':
        tone(rnd(820, 920), 0.07, { type: 'triangle', vol: name === 'tap' ? 0.07 : 0.1, slideTo: 640, wet: 0.12 });
        tone(1760, 0.04, { type: 'sine', vol: 0.03, delay: 0.005 });
        break;
      case 'tab':
        tone(660, 0.09, { type: 'triangle', vol: 0.09 });
        tone(990, 0.14, { type: 'sine', vol: 0.07, delay: 0.06, wet: 0.35 });
        break;
      case 'whoosh':
        if (!gate('whoosh', 250)) return;
        noise(0.35, 0.05, 500, 0.8, 'bandpass', 0, 2600, 0.25);
        break;
      case 'select': {
        const f = PENTA[selectIdx++ % PENTA.length];
        tone(f, 0.18, { type: 'sine', vol: 0.12, wet: 0.35 });
        tone(f * 2, 0.1, { type: 'triangle', vol: 0.04, delay: 0.01 });
        break;
      }
      case 'pop': {
        const f = rnd(480, 620);
        tone(f, 0.12, { type: 'sine', vol: 0.17, slideTo: f * 2.1, wet: 0.2 });
        noise(0.04, 0.05, 3500, 2, 'bandpass', 0, undefined, 0);
        break;
      }
      case 'toggle':
        tone(param > 0.5 ? 900 : 600, 0.09, { type: 'triangle', vol: 0.1, slideTo: param > 0.5 ? 1300 : 420 });
        break;
      case 'tick':
        if (!gate('tick', 45)) return;
        tone(700 + param * 900, 0.04, { type: 'square', vol: 0.025, wet: 0.05 });
        break;
      case 'open':
        tone(520, 0.12, { type: 'sine', vol: 0.1, slideTo: 780 });
        bell(1046.5, 0.5, 0.05, 0.06);
        noise(0.2, 0.03, 700, 0.8, 'bandpass', 0, 2200, 0.2);
        break;
      case 'close':
        tone(780, 0.12, { type: 'sine', vol: 0.09, slideTo: 480 });
        break;
      case 'undo':
        tone(740, 0.1, { type: 'triangle', vol: 0.1, slideTo: 440 });
        break;
      case 'redo':
        tone(440, 0.1, { type: 'triangle', vol: 0.1, slideTo: 740 });
        break;
      case 'delete':
        tone(320, 0.18, { type: 'sawtooth', vol: 0.06, slideTo: 90 });
        noise(0.12, 0.06, 1800, 1, 'lowpass', 0, 300);
        break;
      case 'upload':
        [0, 0.07, 0.14].forEach((d, i) => tone(660 * Math.pow(1.25, i), 0.16, { type: 'sine', vol: 0.1, delay: d }));
        break;
      case 'pickup':
        tone(420, 0.09, { type: 'sine', vol: 0.1, slideTo: 640 });
        break;
      case 'place':
      case 'drop':
        tone(rnd(640, 760), 0.16, { type: 'sine', vol: 0.17, slideTo: 250 });
        noise(0.05, 0.07, 900, 1, 'lowpass', 0.02, undefined, 0);
        break;
      case 'stamp':
        tone(130, 0.18, { type: 'sine', vol: 0.28, slideTo: 60, wet: 0.1 });
        noise(0.07, 0.15, 1400, 1, 'lowpass');
        break;
      case 'error':
        tone(220, 0.14, { type: 'triangle', vol: 0.11, slideTo: 170 });
        tone(196, 0.2, { type: 'triangle', vol: 0.1, slideTo: 150, delay: 0.12 });
        break;
      // ---- cooking ----
      case 'pour': {
        // a glug-glug stream: filtered noise sliding up as the cup fills, plus bubbly blips
        noise(1.1, 0.12, 700, 0.9, 'bandpass', 0, 1600, 0.2);
        noise(1.1, 0.05, 3200, 2, 'bandpass', 0.05, 5200, 0.1);
        for (let i = 0; i < 6; i++) tone(rnd(300, 520) + i * 40, 0.07, { type: 'sine', vol: 0.05, slideTo: rnd(600, 900), delay: 0.1 + i * 0.15, wet: 0.2 });
        break;
      }
      case 'drizzle':
        noise(0.7, 0.07, 1800, 1.6, 'bandpass', 0, 900, 0.2);
        for (let i = 0; i < 4; i++) tone(rnd(900, 1400), 0.05, { vol: 0.03, delay: i * 0.14 });
        break;
      case 'ice':
        [0, 0.07, 0.15, 0.22].forEach((d, i) => {
          tone(2400 + i * 330 + rnd(0, 120), 0.12, { type: 'sine', vol: 0.09, slideTo: 1700, delay: d, wet: 0.45 });
          tone(3600 + i * 200, 0.05, { type: 'triangle', vol: 0.03, delay: d });
        });
        break;
      case 'clink':
        bell(rnd(2200, 2600), 0.7, 0.09);
        break;
      case 'fizz':
        for (let i = 0; i < 10; i++) noise(0.04, 0.03, rnd(4000, 8000), 3, 'bandpass', i * rnd(0.04, 0.09), undefined, 0.05);
        break;
      case 'stir': {
        if (!gate('stir', 130)) return;
        tone(rnd(1900, 2400), 0.06, { type: 'sine', vol: 0.045, wet: 0.35 });
        break;
      }
      case 'shake':
        for (let i = 0; i < 7; i++) noise(0.09, 0.12, 2600, 3, 'bandpass', i * 0.11, undefined, 0.08);
        for (let i = 0; i < 4; i++) tone(rnd(2200, 3200), 0.05, { vol: 0.03, delay: i * 0.17 });
        break;
      case 'scoop':
        noise(0.28, 0.1, 400, 1, 'lowpass', 0, 900, 0.1);
        tone(300, 0.22, { vol: 0.12, slideTo: 170 });
        tone(rnd(900, 1100), 0.08, { vol: 0.05, delay: 0.2 });
        break;
      case 'pipe':
        noise(0.4, 0.07, 600, 0.6, 'lowpass', 0, 1100, 0.1);
        tone(rnd(180, 230), 0.35, { type: 'sine', vol: 0.05, slideTo: 140 });
        break;
      case 'sprinkle':
        for (let i = 0; i < 12; i++) tone(rnd(2800, 5200), 0.04, { vol: 0.025, delay: i * rnd(0.025, 0.06), wet: 0.3 });
        break;
      case 'cut':
        tone(320, 0.08, { type: 'square', vol: 0.05, slideTo: 110 });
        noise(0.07, 0.1, 3400, 2);
        break;
      case 'knead':
        tone(rnd(120, 150), 0.14, { vol: 0.22, slideTo: 80, wet: 0.05 });
        noise(0.1, 0.04, 300, 1, 'lowpass', 0, undefined, 0);
        break;
      case 'roll':
        noise(0.45, 0.07, 280, 0.7, 'lowpass', 0, 520, 0.05);
        break;
      case 'flip':
        tone(380, 0.18, { vol: 0.12, slideTo: 980 });
        noise(0.12, 0.06, 1500, 1, 'bandpass', 0.06);
        tone(240, 0.12, { vol: 0.1, slideTo: 140, delay: 0.3 });
        break;
      case 'sizzle':
        noise(0.9, 0.05, 6000, 0.5, 'highpass', 0, undefined, 0);
        for (let i = 0; i < 9; i++) noise(0.03, 0.06, rnd(3000, 7000), 4, 'bandpass', rnd(0, 0.85), undefined, 0);
        break;
      case 'oven':
        tone(200, 0.15, { type: 'square', vol: 0.035 });
        noise(0.35, 0.05, 350, 1, 'lowpass', 0.04, 160, 0.05);
        break;
      case 'bake': // oven-timer "ting" + door
        noise(0.15, 0.1, 500, 1, 'lowpass');
        bell(2093, 1.4, 0.12, 0.2);
        bell(2093, 1.4, 0.1, 0.65);
        break;
      // ---- rewards ----
      case 'ding':
        bell(1568, 1.0, 0.13);
        bell(2093, 1.1, 0.09, 0.12);
        break;
      case 'shutter':
        noise(0.05, 0.28, 4200, 1, 'highpass', 0, undefined, 0);
        noise(0.09, 0.2, 2200, 1, 'highpass', 0.09, undefined, 0);
        tone(1200, 0.03, { type: 'square', vol: 0.04, delay: 0.005 });
        break;
      case 'sparkle':
        [0, 0.06, 0.12, 0.18, 0.25].forEach((d, i) => tone(1318 * Math.pow(1.19, i), 0.3, { vol: 0.07, delay: d, wet: 0.5 }));
        break;
      case 'coin':
        tone(988, 0.07, { type: 'square', vol: 0.05, wet: 0.1 });
        tone(1319, 0.34, { type: 'square', vol: 0.05, delay: 0.07, wet: 0.2 });
        bell(2637, 0.5, 0.04, 0.09);
        break;
      case 'unlock':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => bell(f, 0.8, 0.09, i * 0.09));
        noise(0.4, 0.04, 2000, 1, 'highpass', 0.3, undefined, 0.3);
        break;
      case 'success':
        // happy little fanfare in C major
        [[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.32]].forEach(([f, d]) => {
          tone(f, 0.32, { type: 'triangle', vol: 0.11, delay: d, wet: 0.35 });
          tone(f * 2, 0.2, { type: 'sine', vol: 0.04, delay: d });
        });
        bell(1568, 1.2, 0.08, 0.38);
        break;
      case 'levelup':
        [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
          tone(f, 0.26, { type: 'triangle', vol: 0.1, delay: i * 0.085, wet: 0.4 });
          bell(f * 2, 0.7, 0.04, i * 0.085);
        });
        noise(0.9, 0.05, 1500, 1, 'highpass', 0.4, 6000, 0.4);
        break;
      case 'cheer':
        for (let i = 0; i < 9; i++) noise(0.05, 0.1, rnd(1800, 4200), 2, 'bandpass', i * 0.05, undefined, 0.2);
        break;
      case 'meow':
        tone(620, 0.34, { type: 'triangle', vol: 0.1, slideTo: 880, vibrato: 14 });
        tone(880, 0.3, { type: 'triangle', vol: 0.08, slideTo: 420, delay: 0.3 });
        break;
    }
  } catch (e) {
    /* audio is optional */
    if (import.meta.env.DEV) console.warn('[sfx]', name, e);
  }
}

/** Auto "tap" for any button that doesn't make its own sound; hover ticks on desktop; slider ticks. */
export function installUiSounds() {
  const inter = 'button, a[href], [role="button"], .tile, .btn, summary, label.cursor-pointer';
  const onClick = (e: MouseEvent) => {
    const t = e.target as HTMLElement | null;
    const el = t?.closest?.(inter) as HTMLElement | null;
    if (!el || (el as HTMLButtonElement).disabled) return;
    // React handlers run first (root container) → if one already played a sound, stay quiet
    if (performance.now() - lastSfxAt > 45) sfx('tap');
  };
  const onOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = (e.target as HTMLElement | null)?.closest?.('.tile, .btn, .nav-item, .card-hover') as HTMLElement | null;
    if (!el || (el as HTMLButtonElement).disabled) return;
    const from = (e.relatedTarget as HTMLElement | null)?.closest?.('.tile, .btn, .nav-item, .card-hover');
    if (from === el) return;
    sfx('hover');
  };
  const onInput = (e: Event) => {
    const t = e.target as HTMLInputElement;
    if (t?.type === 'range') {
      const min = +t.min || 0, max = +t.max || 100;
      sfx('tick', (+t.value - min) / Math.max(1, max - min));
    }
  };
  document.addEventListener('click', onClick);
  document.addEventListener('pointerover', onOver);
  document.addEventListener('input', onInput);
  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('input', onInput);
  };
}

// ---------- Showa-kissaten generative jazz ----------
// swung bossa-ish loop: electric-piano comping (maj7/min7/dom7), walking bass, brushed snare, sparse melody + room tone
const BPM = 88;
const STEP = 60 / BPM / 2; // eighth note
const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
// [root midi, quality voicing offsets]
const PROG: { root: number; chord: number[]; scale: number[] }[] = [
  { root: 48, chord: [4, 7, 11, 14], scale: [0, 2, 4, 7, 9] }, // Cmaj9
  { root: 45, chord: [3, 7, 10, 14], scale: [0, 3, 5, 7, 10] }, // Am9
  { root: 50, chord: [3, 7, 10, 14], scale: [0, 3, 5, 7, 10] }, // Dm9
  { root: 43, chord: [4, 10, 14, 16], scale: [0, 2, 4, 7, 9] }, // G13
  { root: 52, chord: [3, 7, 10, 14], scale: [0, 3, 5, 7, 10] }, // Em9
  { root: 45, chord: [3, 7, 10, 14], scale: [0, 3, 5, 7, 10] }, // Am9
  { root: 50, chord: [3, 7, 10, 14], scale: [0, 3, 5, 7, 10] }, // Dm9
  { root: 43, chord: [4, 10, 13, 16], scale: [0, 2, 4, 7, 9] }, // G7b9-ish
];
let step = 0;
let nextTime = 0;
let musicTimer: number | null = null;
let ambience: { src: AudioBufferSourceNode; g: GainNode } | null = null;

function ePiano(midi: number, t: number, dur: number, vol: number) {
  const c = ctx!;
  const f = mtof(midi);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(musicGain!);
  const o1 = c.createOscillator();
  o1.type = 'sine';
  o1.frequency.value = f;
  const o2 = c.createOscillator(); // tine
  o2.type = 'sine';
  o2.frequency.value = f * 4.01;
  const tg = c.createGain();
  tg.gain.setValueAtTime(vol * 0.5, t);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o2.connect(tg);
  tg.connect(g);
  const o3 = c.createOscillator();
  o3.type = 'triangle';
  o3.frequency.value = f;
  const g3 = c.createGain();
  g3.gain.value = 0.35;
  o3.connect(g3);
  g3.connect(g);
  o1.connect(g);
  [o1, o2, o3].forEach((o) => { o.start(t); o.stop(t + dur + 0.05); });
}

function bass(midi: number, t: number, dur: number) {
  const c = ctx!;
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.value = mtof(midi);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 520;
  o.connect(lp);
  lp.connect(g);
  g.connect(musicGain!);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function brush(t: number, vol: number, f = 6500, dur = 0.09) {
  const c = ctx!;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = 'bandpass';
  hp.frequency.value = f;
  hp.Q.value = 0.7;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(hp);
  hp.connect(g);
  g.connect(musicGain!);
  src.start(t);
}

function scheduleStep(i: number, t: number) {
  const bar = Math.floor(i / 8) % PROG.length;
  const beat = i % 8;
  const p = PROG[bar];
  const swing = beat % 2 === 1 ? STEP * 0.28 : 0;
  const tt = t + swing;
  // comping: syncopated hits
  if (beat === 0 || beat === 3 || (beat === 5 && Math.random() < 0.7) || (beat === 7 && Math.random() < 0.3)) {
    const v = beat === 0 ? 0.045 : 0.032;
    p.chord.forEach((n, k) => ePiano(p.root + 12 + n, tt + k * 0.012, STEP * (beat === 0 ? 5 : 3), v));
  }
  // walking-ish bass on quarter notes
  if (beat % 2 === 0) {
    const walk = [0, 7, 4, 7, 0, 5, 7, 4][(beat / 2 + bar) % 8 | 0] ?? 0;
    bass(p.root - 12 + (beat === 0 ? 0 : walk % 12), tt, STEP * 1.8);
  }
  // brushes: swish on every eighth, accent on 2 & 4
  brush(tt, beat % 2 === 0 ? 0.012 : 0.007, 7000, 0.06);
  if (beat === 2 || beat === 6) brush(tt, 0.03, 3200, 0.14);
  // sparse melody
  if ((beat === 1 || beat === 4 || beat === 6) && Math.random() < 0.38) {
    const n = p.scale[Math.floor(Math.random() * p.scale.length)] + 60 + p.root % 12 + (Math.random() < 0.3 ? 12 : 0);
    ePiano(n, tt, STEP * (Math.random() < 0.4 ? 4 : 2), 0.03);
  }
}

function musicPump() {
  const c = ctx;
  if (!c) return;
  while (nextTime < c.currentTime + 0.35) {
    scheduleStep(step++, Math.max(nextTime, c.currentTime + 0.02));
    nextTime += STEP;
  }
}

function startAmbience() {
  const c = ctx!;
  if (ambience) return;
  // soft pink-ish room tone (low-passed noise) — "café murmur"
  const len = c.sampleRate * 4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  let b = 0;
  for (let i = 0; i < len; i++) { b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = b * 3.2; }
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 700;
  const g = c.createGain();
  g.gain.value = 0.05;
  src.connect(lp);
  lp.connect(g);
  g.connect(musicGain!);
  src.start();
  ambience = { src, g };
}
function stopAmbience() {
  try { ambience?.src.stop(); } catch { /* noop */ }
  ambience = null;
}

export function setMusic(on: boolean) {
  const c = ac();
  if (!c || !musicGain) return;
  if (on) {
    musicGain.gain.setTargetAtTime(1.0, c.currentTime, 0.6);
    startAmbience();
    if (musicTimer == null) {
      nextTime = c.currentTime + 0.1;
      musicTimer = window.setInterval(musicPump, 90);
    }
  } else {
    musicGain.gain.setTargetAtTime(0.0, c.currentTime, 0.25);
    if (musicTimer != null) { clearInterval(musicTimer); musicTimer = null; }
    window.setTimeout(stopAmbience, 900);
  }
}

export function applyVolume(v: number) {
  if (master) master.gain.value = v;
}
