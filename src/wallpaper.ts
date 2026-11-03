/* Living wallpaper: slow silk folds in rose, peach and lilac. Rendered at low resolution, upscaled smoothly. */
const VS = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FS = `precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float d;
float h(vec2 s){ return fract(sin(dot(s, vec2(12.9898,78.233))) * 43758.5453); }
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (uv - .5) * vec2(r.x / r.y, 1.);
  p += (m - .5) * .12;
  float tt = t * .055;
  for(int i = 1; i < 5; i++){
    float f = float(i);
    p += .38 / f * vec2(sin(p.y * f * 2.0 + tt * f + 1.3), cos(p.x * f * 1.6 - tt * f * .9));
  }
  float a = .5 + .5 * sin(p.x * 2.1 + p.y * 1.3 + tt * 2.);
  float b = .5 + .5 * sin(p.y * 2.5 - p.x * 1.1 - tt * 1.6 + 2.);
  vec3 L0 = vec3(1.00,.80,.78), L1 = vec3(1.00,.30,.58), L2 = vec3(.98,.50,.68), L3 = vec3(1.00,.91,.92);
  vec3 D0 = vec3(.20,.02,.05), D1 = vec3(.58,.05,.14), D2 = vec3(.36,.03,.10), D3 = vec3(.08,.01,.03);
  vec3 c0 = mix(L0, D0, d), c1 = mix(L1, D1, d), c2 = mix(L2, D2, d), c3 = mix(L3, D3, d);
  vec3 col = mix(mix(c0, c1, a), mix(c2, c3, a), b);
  float s = pow(.5 + .5 * sin(p.x * 5. + p.y * 3. + tt * 3.), 7.);
  col += s * mix(.07, .05, d);
  col *= 1. - .16 * smoothstep(.35, 1.0, length(uv - .5) * 1.3);
  col += (h(gl_FragCoord.xy + fract(t)) - .5) * .02;
  gl_FragColor = vec4(col, 1.);
}`;

export class Wallpaper {
  private gl: WebGLRenderingContext | null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private dark = 0;
  private darkTarget = 0;
  private mx = 0.5;
  private my = 0.5;
  private cx = 0.5;
  private cy = 0.5;
  private raf = 0;
  private visible = true;
  private reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private t0 = performance.now();

  constructor(private cv: HTMLCanvasElement) {
    this.gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!this.gl) {
      cv.style.background = "var(--wall-fallback)";
      return;
    }
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["r", "t", "m", "d"]) this.u[n] = gl.getUniformLocation(pr, n);

    this.resize();
    addEventListener("resize", () => this.resize());
    addEventListener("pointermove", (e) => {
      this.mx = e.clientX / innerWidth;
      this.my = 1 - e.clientY / innerHeight;
    });
    document.addEventListener("visibilitychange", () => {
      this.visible = !document.hidden;
      if (this.visible) this.loop();
    });
    this.loop();
  }

  setDark(v: boolean) {
    this.darkTarget = v ? 1 : 0;
    if (this.reduce || !this.visible || document.hidden) {
      this.frame(performance.now(), true);
    }
  }

  private resize() {
    const k = 0.5;
    this.cv.width = Math.max(2, Math.round(innerWidth * k));
    this.cv.height = Math.max(2, Math.round(innerHeight * k));
    this.gl?.viewport(0, 0, this.cv.width, this.cv.height);
    this.frame(performance.now());
  }

  private frame(now: number, snapDark = false) {
    const gl = this.gl;
    if (!gl) return;
    this.dark = snapDark ? this.darkTarget : this.dark + (this.darkTarget - this.dark) * 0.06;
    this.cx += (this.mx - this.cx) * 0.04;
    this.cy += (this.my - this.cy) * 0.04;
    gl.uniform2f(this.u.r, this.cv.width, this.cv.height);
    gl.uniform1f(this.u.t, this.reduce ? 20 : (now - this.t0) / 1000);
    gl.uniform2f(this.u.m, this.cx, this.cy);
    gl.uniform1f(this.u.d, this.dark);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private loop = () => {
    cancelAnimationFrame(this.raf);
    if (!this.visible || this.reduce) return;
    this.raf = requestAnimationFrame((n) => {
      this.frame(n);
      this.loop();
    });
  };
}
