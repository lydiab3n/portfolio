import * as THREE from "three";

/** anisotropic filtering level, set once from the quality tier */
export let ANISO = 8;
export const setAniso = (n: number) => (ANISO = n);

/** photos still loading, so the loading screen can wait for them */
const pending = { n: 0, waiters: [] as (() => void)[] };
export const photosIdle = () => new Promise<void>((r) => (pending.n === 0 ? r() : pending.waiters.push(r)));
const done = () => {
  if (--pending.n <= 0) {
    pending.n = 0;
    pending.waiters.splice(0).forEach((f) => f());
  }
};

/** tiny seeded random so every load looks identical */
export const seeded = (seed = 1) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
};

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, opts: { repeat?: [number, number]; color?: boolean; aniso?: number } = {}) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  if (opts.color !== false) t.colorSpace = THREE.SRGBColorSpace;
  if (opts.repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...opts.repeat);
  }
  t.anisotropy = opts.aniso ?? ANISO;
  return t;
}

export const woodFloor = () =>
  canvasTex(
    1024,
    1024,
    (g, w, h) => {
      const r = seeded(11);
      const planks = 5;
      const pw = w / planks;
      for (let i = 0; i < planks; i++) {
        const light = 30 + r() * 6;
        const hue = 24 + r() * 7;
        g.fillStyle = `hsl(${hue} 38% ${light}%)`;
        g.fillRect(i * pw, 0, pw, h);
        for (let k = 0; k < 70; k++) {
          g.strokeStyle = `hsla(${hue} 34% ${light - 8 + r() * 6}%, ${0.1 + r() * 0.18})`;
          g.lineWidth = 0.6 + r() * 1.8;
          const x = i * pw + r() * pw;
          g.beginPath();
          g.moveTo(x, 0);
          g.bezierCurveTo(x + (r() - 0.5) * 14, h * 0.33, x + (r() - 0.5) * 14, h * 0.66, x + (r() - 0.5) * 8, h);
          g.stroke();
        }
        const cut = r() * h;
        g.fillStyle = "rgba(0,0,0,.18)";
        g.fillRect(i * pw, cut, pw, 2);
        g.fillStyle = "rgba(0,0,0,.22)";
        g.fillRect(i * pw - 1, 0, 2, h);
      }
    },
    { repeat: [20, 4] },
  );

export const plaster = () =>
  canvasTex(
    512,
    512,
    (g, w, h) => {
      const r = seeded(5);
      g.fillStyle = "#7d6c70";
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) {
        const v = 100 + r() * 70;
        g.fillStyle = `rgba(${v},${v - 8},${v - 4},${0.05 + r() * 0.07})`;
        g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3);
      }
    },
    { repeat: [3, 1.2] },
  );

export const cork = () =>
  canvasTex(512, 384, (g, w, h) => {
    const r = seeded(9);
    g.fillStyle = "#b98a58";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4200; i++) {
      const dark = r() > 0.5;
      g.fillStyle = dark ? `rgba(86,50,22,${0.15 + r() * 0.3})` : `rgba(240,200,150,${0.1 + r() * 0.25})`;
      g.beginPath();
      g.ellipse(r() * w, r() * h, 1 + r() * 4, 1 + r() * 3, r() * 3, 0, 6.3);
      g.fill();
    }
  });

export const woodGrain = (hex: string, seed = 3) =>
  canvasTex(512, 256, (g, w, h) => {
    const r = seeded(seed);
    g.fillStyle = hex;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) {
      g.strokeStyle = `rgba(0,0,0,${0.03 + r() * 0.1})`;
      g.lineWidth = 0.5 + r() * 2;
      const y = r() * h;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 8, w * 0.7, y + (r() - 0.5) * 8, w, y + (r() - 0.5) * 5);
      g.stroke();
    }
  });

export const spine = (title: string, color: string, seed = 1, band = "#ecd9a2") =>
  canvasTex(128, 512, (g, w, h) => {
    const r = seeded(seed * 13 + 7);
    g.fillStyle = color;
    g.fillRect(0, 0, w, h);
    const sh = g.createLinearGradient(0, 0, w, 0);
    sh.addColorStop(0, "rgba(255,255,255,.18)");
    sh.addColorStop(0.3, "rgba(255,255,255,0)");
    sh.addColorStop(1, "rgba(0,0,0,.35)");
    g.fillStyle = sh;
    g.fillRect(0, 0, w, h);
    g.fillStyle = band;
    for (const y of [34, 44, h - 44, h - 34]) g.fillRect(0, y, w, 3.5);
    if (title) {
      g.save();
      g.translate(w / 2, h / 2);
      g.rotate(-Math.PI / 2);
      g.fillStyle = "#f6ebe0";
      g.font = '600 46px "Playfair Display", Georgia, serif';
      g.textAlign = "center";
      g.textBaseline = "middle";
      let t = title;
      while (g.measureText(t).width > h - 150 && t.length > 4) t = t.slice(0, -2);
      if (t !== title) t = t.trimEnd() + "…";
      g.fillText(t, 0, 0);
      g.restore();
    } else if (r() > 0.4) {
      g.fillStyle = "rgba(255,236,190,.55)";
      g.fillRect(w * 0.3, h * 0.42, w * 0.4, 3.5);
      g.fillRect(w * 0.3, h * 0.46, w * 0.4, 3.5);
    }
  });

export const note = (text: string, color: string, title = "") =>
  canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = color;
    g.fillRect(0, 0, w, h);
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,.35)");
    gr.addColorStop(1, "rgba(0,0,0,.08)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#3a2f2a";
    let y = 62;
    if (title) {
      g.font = '700 40px Caveat, "Segoe Print", cursive';
      g.fillText(title, 20, y);
      y += 46;
    }
    g.font = '400 36px Caveat, "Segoe Print", cursive';
    const words = text.split(" ");
    let line = "";
    for (const wd of words) {
      const test = line ? line + " " + wd : wd;
      if (g.measureText(test).width > w - 36) {
        g.fillText(line, 20, y);
        y += 38;
        line = wd;
      } else line = test;
    }
    g.fillText(line, 20, y);
  });

export const resumeSheet = (name: string, role: string, heading: string) =>
  canvasTex(512, 724, (g, w, h) => {
    g.fillStyle = "#f6f1e8";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#2a1f22";
    g.font = '600 46px "Playfair Display", Georgia, serif';
    g.fillText(heading, 44, 86);
    g.font = '400 26px Karla, sans-serif';
    g.fillStyle = "#5a4a4e";
    g.fillText(name, 44, 128);
    g.fillText(role, 44, 160);
    g.fillStyle = "#e7a8bf";
    g.fillRect(44, 190, 80, 5);
    g.fillStyle = "#cfc6b8";
    for (let i = 0; i < 17; i++) g.fillRect(44, 236 + i * 26, i % 5 === 4 ? 230 : 424 - (i % 3) * 40, 9);
  });

export const globeMap = () =>
  canvasTex(1024, 512, (g, w, h) => {
    const r = seeded(21);
    const og = g.createLinearGradient(0, 0, 0, h);
    og.addColorStop(0, "#2a6a8a");
    og.addColorStop(0.5, "#2f7ea0");
    og.addColorStop(1, "#245c7a");
    g.fillStyle = og;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const cx = r() * w;
      const cy = 80 + r() * (h - 160);
      g.fillStyle = ["#8fb872", "#7aa862", "#a5c27e", "#c9b878"][Math.floor(r() * 4)];
      g.beginPath();
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * 6.283;
        const rr = 18 + r() * 46;
        g.lineTo(cx + Math.cos(a) * rr * 1.6, cy + Math.sin(a) * rr);
      }
      g.closePath();
      g.fill();
    }
    g.fillStyle = "rgba(255,255,255,.85)";
    g.fillRect(0, 0, w, 22);
    g.fillRect(0, h - 26, w, 26);
  });

export const rug = () =>
  canvasTex(512, 512, (g, w, h) => {
    const r = seeded(4);
    const c = w / 2;
    g.fillStyle = "#e9d3d0";
    g.fillRect(0, 0, w, h);
    const rings = ["#d98aa2", "#f3e6dc", "#c96f8f", "#f3e6dc"];
    for (let i = 0; i < 4; i++) {
      g.strokeStyle = rings[i];
      g.lineWidth = 26;
      g.beginPath();
      g.arc(c, c, 210 - i * 38, 0, 6.283);
      g.stroke();
    }
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "90,40,50"},${0.04 + r() * 0.06})`;
      g.fillRect(r() * w, r() * h, 1.5, 1.5 + r() * 3);
    }
  });

export const furStripes = (base: string, stripe: string, seed = 2) =>
  canvasTex(256, 256, (g, w, h) => {
    const r = seeded(seed);
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) {
      const x = (i / 9) * w + r() * 10;
      g.strokeStyle = stripe;
      g.globalAlpha = 0.55;
      g.lineWidth = 8 + r() * 6;
      g.beginPath();
      g.moveTo(x, -10);
      g.bezierCurveTo(x + 20, h * 0.3, x - 18, h * 0.66, x + 6, h + 10);
      g.stroke();
    }
    g.globalAlpha = 1;
    for (let i = 0; i < 2500; i++) {
      g.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.04})`;
      g.fillRect(r() * w, r() * h, 1, 3);
    }
  });

export const softShadow = () =>
  canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, "rgba(0,0,0,.65)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  }, { color: false });

export const mote = () =>
  canvasTex(64, 64, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, "rgba(255,228,190,1)");
    gr.addColorStop(1, "rgba(255,228,190,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });

/** soft inner shadow so the window glass looks recessed */
export const recess = () =>
  canvasTex(256, 256, (g, w, h) => {
    const a = g.createLinearGradient(0, 0, w * 0.35, 0);
    a.addColorStop(0, "rgba(10,4,2,.6)");
    a.addColorStop(1, "rgba(10,4,2,0)");
    g.fillStyle = a;
    g.fillRect(0, 0, w, h);
    const b = g.createLinearGradient(0, 0, 0, h * 0.3);
    b.addColorStop(0, "rgba(10,4,2,.5)");
    b.addColorStop(1, "rgba(10,4,2,0)");
    g.fillStyle = b;
    g.fillRect(0, 0, w, h);
  }, { color: false });

/** photo texture that behaves like object-fit: cover */
export function photo(url: string, aspect: number, focus: [number, number] = [0.5, 0.5], onLoad?: () => void) {
  pending.n++;
  const t = new THREE.TextureLoader().load(
    url,
    (tx) => {
    const ia = tx.image.width / tx.image.height;
    if (ia > aspect) {
      tx.repeat.set(aspect / ia, 1);
      tx.offset.set((1 - aspect / ia) * focus[0], 0);
    } else {
      tx.repeat.set(1, ia / aspect);
      tx.offset.set(0, (1 - ia / aspect) * (1 - focus[1]));
    }
    onLoad?.();
    done();
    },
    undefined,
    done,
  );
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = ANISO;
  return t;
}

/** shared strip for the plain filler books: bright bands on the top half, plain white below (vertex colour tints it) */
let _bands: THREE.CanvasTexture | null = null;
export const spineBands = () =>
  (_bands ??= canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = "#c9c9c9";
    g.fillRect(0, 0, w, h / 2);
    g.fillStyle = "#ffffff";
    for (const y of [8, 14, h / 2 - 14, h / 2 - 8]) g.fillRect(0, y, w, 3);
    g.fillRect(w * 0.3, h * 0.22, w * 0.4, 3);
    g.fillRect(0, h / 2, w, h / 2);
  }));
