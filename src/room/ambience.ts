/* ---------------------------------------------------------------------
   Ambient sound, synthesized with the Web Audio API (no audio files):
   waves from the sea outside the window, and Lamborghini snoring.
   Browsers only allow audio after a click, so start() must be called
   from a user gesture.
   --------------------------------------------------------------------- */
export class Ambience {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private waves!: GainNode;
  private snoreBus!: GainNode;
  private noise!: AudioBuffer;
  private timer = 0;
  private running = false;
  private night = false;

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    /* brown noise, 8 seconds, loops */
    const len = ctx.sampleRate * 8;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.2;
    }

    /* waves: a low swell and a hiss that rise and fall about every ten seconds */
    this.waves = ctx.createGain();
    this.waves.gain.value = 0.5;
    this.waves.connect(this.master);
    const layer = (type: BiquadFilterType, freq: number, base: number, swing: number, lfoHz: number, offset: number) => {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      src.loopStart = offset;
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = base;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = lfoHz;
      const lg = ctx.createGain();
      lg.gain.value = swing;
      lfo.connect(lg).connect(g.gain);
      src.connect(f).connect(g).connect(this.waves);
      src.start(0, offset);
      lfo.start();
    };
    layer("lowpass", 700, 0.22, 0.2, 0.085, 0);
    layer("highpass", 2200, 0.025, 0.022, 0.1, 3.1);
    layer("bandpass", 420, 0.1, 0.09, 0.07, 5.4);

    this.snoreBus = ctx.createGain();
    this.snoreBus.gain.value = 0.9;
    this.snoreBus.connect(this.master);
  }

  /** one slow breath: a soft inhale, then a low rattling exhale */
  private breath() {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime + 0.05;
    const inhale = ctx.createBufferSource();
    inhale.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 260;
    bp.Q.value = 1.1;
    const ig = ctx.createGain();
    ig.gain.setValueAtTime(0, t0);
    ig.gain.linearRampToValueAtTime(0.5, t0 + 0.55);
    ig.gain.linearRampToValueAtTime(0, t0 + 1.0);
    inhale.connect(bp).connect(ig).connect(this.snoreBus);
    inhale.start(t0, Math.random() * 6);
    inhale.stop(t0 + 1.1);

    const t1 = t0 + 1.15;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(70, t1);
    osc.frequency.linearRampToValueAtTime(48, t1 + 1.2);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 240;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0, t1);
    eg.gain.linearRampToValueAtTime(0.6, t1 + 0.35);
    eg.gain.linearRampToValueAtTime(0, t1 + 1.3);
    const rattle = ctx.createOscillator();
    rattle.frequency.value = 26;
    const rg = ctx.createGain();
    rg.gain.value = 0.35;
    const mod = ctx.createGain();
    mod.gain.value = 0.65;
    rattle.connect(rg).connect(mod.gain);
    osc.connect(lp).connect(mod).connect(eg).connect(this.snoreBus);
    osc.start(t1);
    rattle.start(t1);
    osc.stop(t1 + 1.4);
    rattle.stop(t1 + 1.4);
    const air = ctx.createBufferSource();
    air.buffer = this.noise;
    const ab = ctx.createBiquadFilter();
    ab.type = "bandpass";
    ab.frequency.value = 160;
    const ag = ctx.createGain();
    ag.gain.setValueAtTime(0, t1);
    ag.gain.linearRampToValueAtTime(0.35, t1 + 0.4);
    ag.gain.linearRampToValueAtTime(0, t1 + 1.3);
    air.connect(ab).connect(ag).connect(this.snoreBus);
    air.start(t1, Math.random() * 6);
    air.stop(t1 + 1.4);
  }

  private loop = () => {
    if (!this.running) return;
    this.breath();
    this.timer = window.setTimeout(this.loop, 4300 + Math.random() * 600);
  };

  async start() {
    if (this.running) return;
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    await ctx.resume();
    this.running = true;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(this.night ? 0.2 : 0.16, ctx.currentTime, 1.2);
    this.loop();
  }

  stop() {
    if (!this.ctx || !this.running) return;
    this.running = false;
    clearTimeout(this.timer);
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35);
    const c = this.ctx;
    setTimeout(() => !this.running && c.suspend(), 1500);
  }

  /** at night the sea sounds a little closer and the room quieter */
  setNight(n: boolean) {
    this.night = n;
    if (this.ctx && this.running) this.master.gain.setTargetAtTime(n ? 0.2 : 0.16, this.ctx.currentTime, 1.5);
  }
}
