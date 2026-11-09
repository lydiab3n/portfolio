/* Sounds for the room's little games. Everything is synthesised on the spot, so there is no audio file to load.
   They belong to things you play with, so they sound whenever you act, whatever the ambience toggle says. */
let ac: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;

function ctx(): AudioContext | null {
  try {
    if (!ac) {
      ac = new AudioContext();
      const comp = ac.createDynamicsCompressor();
      out = ac.createGain();
      out.gain.value = 0.7;
      out.connect(comp).connect(ac.destination);
      noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === "suspended") void ac.resume();
    return ac;
  } catch {
    return null;
  }
}

/** one guitar string, Karplus-Strong, lightly overdriven */
export function pluck(freq: number, vel = 0.8, delay = 0) {
  const c = ctx();
  if (!c || !out) return;
  const sr = c.sampleRate;
  const n = Math.floor(sr * 1.9);
  const buf = c.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / freq));
  const ring = Float32Array.from({ length: N }, () => Math.random() * 2 - 1);
  for (let i = 0, j = 0; i < n; i++, j = (j + 1) % N) {
    const v = (ring[j] + ring[(j + 1) % N]) * 0.4985;
    d[i] = ring[j];
    ring[j] = v;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const drive = c.createWaveShaper();
  const curve = new Float32Array(256);
  curve.forEach((_, i) => (curve[i] = Math.tanh(((i / 255) * 2 - 1) * 2.2)));
  drive.curve = curve;
  const g = c.createGain();
  g.gain.value = 0.2 * Math.min(1, Math.max(0.2, vel));
  src.connect(drive).connect(g).connect(out);
  src.start(c.currentTime + delay);
}

function burst(opts: { type?: BiquadFilterType; freq: number; q?: number; dur: number; gain: number; at?: number; sweepTo?: number }) {
  const c = ctx();
  if (!c || !out || !noise) return;
  const t = c.currentTime + (opts.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = opts.type ?? "bandpass";
  f.frequency.setValueAtTime(opts.freq, t);
  if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t + opts.dur);
  f.Q.value = opts.q ?? 1;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(opts.gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  src.connect(f).connect(g).connect(out);
  src.start(t, Math.random() * 0.5);
  src.stop(t + opts.dur + 0.05);
}

function tone(from: number, to: number, dur: number, gain: number, at = 0, type: OscillatorType = "sine") {
  const c = ctx();
  if (!c || !out) return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sound = {
  /** the soft smack of a kiss */
  kiss() {
    tone(900, 320, 0.09, 0.22);
    burst({ freq: 2400, q: 0.8, dur: 0.07, gain: 0.12 });
  },
  /** a tiny dab of lipstick on skin */
  dab() {
    burst({ freq: 1500, q: 1.4, dur: 0.05, gain: 0.05 });
  },
  crunch() {
    for (let i = 0; i < 4; i++) burst({ freq: 2600 + Math.random() * 1200, q: 2, dur: 0.05, gain: 0.16, at: i * 0.07 });
  },
  scoop() {
    burst({ type: "highpass", freq: 3000, dur: 0.14, gain: 0.07 });
    tone(520, 380, 0.08, 0.05, 0.02);
  },
  pour() {
    burst({ type: "lowpass", freq: 1400, q: 0.7, dur: 0.18, gain: 0.07, sweepTo: 700 });
  },
  whisk() {
    burst({ freq: 3400 + Math.random() * 900, q: 3, dur: 0.06, gain: 0.07 });
  },
  sip() {
    tone(320, 640, 0.18, 0.05);
    burst({ type: "lowpass", freq: 900, dur: 0.25, gain: 0.05, at: 0.05 });
  },
  chime(freq = 880) {
    tone(freq, freq, 0.5, 0.09);
    tone(freq * 1.5, freq * 1.5, 0.45, 0.05, 0.05);
  },
  /** a cat's purr: returns a handle so it can swell while you stroke and fade when you stop */
  purr() {
    const c = ctx();
    if (!c || !out || !noise) return { set() {}, stop() {} };
    const src = c.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 240;
    const am = c.createGain();
    am.gain.value = 0;
    const lfo = c.createOscillator();
    lfo.frequency.value = 24;
    const depth = c.createGain();
    depth.gain.value = 0.5;
    lfo.connect(depth).connect(am.gain);
    const level = c.createGain();
    level.gain.value = 0;
    src.connect(f).connect(am).connect(level).connect(out);
    src.start();
    lfo.start();
    let dead = false;
    return {
      set(v: number) {
        if (dead) return;
        level.gain.setTargetAtTime(Math.min(1, Math.max(0, v)) * 0.55, c.currentTime, 0.15);
      },
      stop() {
        if (dead) return;
        dead = true;
        level.gain.setTargetAtTime(0, c.currentTime, 0.1);
        setTimeout(() => {
          try {
            src.stop();
            lfo.stop();
          } catch {
            /* already stopped */
          }
        }, 600);
      },
    };
  },
};
