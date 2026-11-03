/* UI sounds only — no music. Every sound is synthesised, short and soft. */
export class Sfx {
  enabled = true;
  private ctx?: AudioContext;
  private master!: GainNode;
  private verb!: ConvolverNode;
  private noise!: AudioBuffer;

  unlock() {
    if (!this.ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = (this.ctx = new C());
      const comp = ctx.createDynamicsCompressor();
      this.master = ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(comp);
      comp.connect(ctx.destination);
      // short generated room reverb
      const len = Math.floor(ctx.sampleRate * 1.8);
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = ir.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      this.verb = ctx.createConvolver();
      this.verb.buffer = ir;
      const wet = ctx.createGain();
      wet.gain.value = 0.32;
      this.verb.connect(wet);
      wet.connect(this.master);
      this.noise = ctx.createBuffer(1, ctx.sampleRate / 2, ctx.sampleRate);
      const n = this.noise.getChannelData(0);
      for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1;
    }
    void this.ctx.resume();
  }

  private get c() {
    return this.enabled && this.ctx ? this.ctx : null;
  }

  private bell(freq: number, at: number, dur: number, gain: number) {
    const ctx = this.c;
    if (!ctx) return;
    const t = ctx.currentTime + at;
    for (const [mul, g, d] of [[1, 1, 1], [2.76, 0.22, 0.45], [5.4, 0.06, 0.2]] as const) {
      const o = ctx.createOscillator();
      const e = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * mul;
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(gain * g, t + 0.006);
      e.gain.exponentialRampToValueAtTime(0.0001, t + dur * d);
      o.connect(e);
      e.connect(this.master);
      e.connect(this.verb);
      o.start(t);
      o.stop(t + dur * d + 0.05);
    }
  }

  private sweep(from: number, to: number, dur: number, gain: number, type: OscillatorType = "sine") {
    const ctx = this.c;
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const e = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(e);
    e.connect(this.master);
    e.connect(this.verb);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Start-up: a wide, warm chord that blooms and fades. */
  chime() {
    const ctx = this.c;
    if (!ctx) return;
    const t = ctx.currentTime;
    for (const f of [73.42, 146.83, 220, 293.66]) {
      const o = ctx.createOscillator();
      const e = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      e.gain.setValueAtTime(0.0001, t);
      e.gain.exponentialRampToValueAtTime(0.09, t + 0.5);
      e.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      o.connect(e);
      e.connect(this.master);
      e.connect(this.verb);
      o.start(t);
      o.stop(t + 3.8);
    }
    [293.66, 369.99, 440, 554.37, 659.25, 880].forEach((f, i) => this.bell(f, 0.04 + i * 0.07, 3.2, 0.12));
  }

  unlockSound() {
    this.bell(659.25, 0, 1.2, 0.14);
    this.bell(987.77, 0.09, 1.4, 0.12);
  }

  open() {
    this.sweep(460, 760, 0.1, 0.1);
    this.bell(1318.5, 0.02, 0.5, 0.03);
  }

  close() {
    this.sweep(640, 360, 0.11, 0.09);
  }

  minimize() {
    const ctx = this.c;
    if (!ctx) return;
    const t = ctx.currentTime;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 2.2;
    f.frequency.setValueAtTime(500, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + 0.3);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.14, t + 0.08);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    s.connect(f);
    f.connect(e);
    e.connect(this.master);
    s.start(t);
    s.stop(t + 0.35);
    this.sweep(320, 190, 0.2, 0.05);
  }

  /** Paper page turn: a short, soft swish. */
  page() {
    const ctx = this.c;
    if (!ctx) return;
    const t = ctx.currentTime;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 0.9;
    f.frequency.setValueAtTime(1400, t);
    f.frequency.exponentialRampToValueAtTime(4200, t + 0.28);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(0.16, t + 0.07);
    e.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    s.connect(f);
    f.connect(e);
    e.connect(this.master);
    s.start(t);
    s.stop(t + 0.4);
  }

  /** Book cover: a low, muted thump with a little paper. */
  thud() {
    this.sweep(150, 62, 0.22, 0.2);
    this.page();
  }

  tick() {
    this.sweep(1900, 1500, 0.035, 0.06, "triangle");
  }

  spot() {
    this.sweep(700, 1050, 0.07, 0.07);
  }

  notify() {
    this.bell(987.77, 0, 1.2, 0.16);
    this.bell(1318.5, 0.13, 1.6, 0.14);
  }

  send() {
    this.sweep(520, 1400, 0.18, 0.09);
    this.bell(1760, 0.12, 0.8, 0.07);
  }
}
