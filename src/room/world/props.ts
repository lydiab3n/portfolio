import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as TX from "./textures";

export type Reg = (id: string, g: THREE.Group, mode?: "pull" | "lift" | "none") => void;

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const std = (color: number | string, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const rbox = (w: number, h: number, d: number, r = 0.006) => new RoundedBoxGeometry(w, h, d, 3, r);
const M = (g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[]) => new THREE.Mesh(g, m);

export function shade<T extends THREE.Object3D>(o: T, cast = true, receive = true): T {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = cast && !c.userData.noShadow;
      c.receiveShadow = receive;
    }
  });
  return o;
}

/**
 * Merge every plain mesh under `root` into one mesh per material, so a model made of
 * hundreds of pieces costs a handful of draw calls. Meshes that are hidden (hit boxes)
 * or use several materials are kept as they are.
 */
export function bake(root: THREE.Object3D, opts: { raycast?: boolean } = {}): THREE.Group {
  root.updateWorldMatrix(true, true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const keep: THREE.Object3D[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mat = m.material;
    if (Array.isArray(mat) || !mat.visible || (m as THREE.InstancedMesh).isInstancedMesh) {
      keep.push(o);
      return;
    }
    let g = m.geometry.clone();
    if (g.index) g = g.toNonIndexed();
    for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") g.deleteAttribute(k);
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
    (buckets.get(mat) ?? buckets.set(mat, []).get(mat)!).push(g);
  });
  const out = new THREE.Group();
  for (const [mat, list] of buckets) {
    const merged = mergeGeometries(list, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (!opts.raycast) mesh.raycast = () => {};
    out.add(mesh);
    list.forEach((g) => g.dispose());
  }
  for (const o of keep) {
    const rel = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
    o.removeFromParent();
    rel.decompose(o.position, o.quaternion, o.scale);
    out.add(o);
  }
  return out;
}

/** photo plane that stays bright and looks printed */
const printed = (tex: THREE.Texture, w: number, h: number) => {
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.22 });
  return M(new THREE.PlaneGeometry(w, h), m);
};

export function framedPhoto(url: string, w: number, h: number, focus: [number, number] = [0.5, 0.5], opts: { border?: number; mat?: number; depth?: number } = {}) {
  const b = opts.border ?? 0.018;
  const mat = opts.mat ?? 0.022;
  const d = opts.depth ?? 0.032;
  const g = new THREE.Group();
  g.add(M(rbox(w, h, d, 0.004), std(0x151215, 0.45)));
  const matPlane = M(new THREE.PlaneGeometry(w - b * 2, h - b * 2), std(0xf1ebe1, 0.9));
  matPlane.position.z = d / 2 + 0.0006;
  g.add(matPlane);
  const iw = w - (b + mat) * 2;
  const ih = h - (b + mat) * 2;
  const p = printed(TX.photo(url, iw / ih, focus), iw, ih);
  p.position.z = d / 2 + 0.0012;
  g.add(p);
  return shade(g);
}

/* ---------------------------------------------------------------- bookcase */
const PALETTE = ["#6e2f3f", "#2f4a5a", "#c9a05a", "#4c6a4a", "#b86a4a", "#3a2f4a", "#8a3a52", "#d9c9a8", "#2a5a5a", "#7a4a2a", "#3d2a33"];
interface Filler {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: string;
  lean?: number;
}

/** every plain book in one mesh: colours live in the vertices, so the whole shelf is one draw call */
function fillerBooks(list: Filler[]): THREE.Mesh {
  const geos: THREE.BufferGeometry[] = [];
  const c = new THREE.Color();
  const pages = new THREE.Color(0xe9dcc4);
  for (const b of list) {
    const g = new THREE.BoxGeometry(b.w, b.h, b.d);
    g.translate(0, b.h / 2, 0);
    const m = new THREE.Matrix4();
    if (b.lean) m.makeTranslation(b.x + b.w, b.y, b.z).multiply(new THREE.Matrix4().makeRotationZ(-b.lean)).multiply(new THREE.Matrix4().makeTranslation(-b.w / 2, 0, 0));
    else m.makeTranslation(b.x + b.w / 2, b.y, b.z);
    g.applyMatrix4(m);
    const colors = new Float32Array(24 * 3);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    const cover = c.set(b.color);
    const spine = new THREE.Color(b.color).multiplyScalar(1.3);
    for (let f = 0; f < 6; f++) {
      const col = f === 4 ? spine : f === 2 || f === 5 ? pages : cover;
      for (let v = 0; v < 4; v++) {
        const i = f * 4 + v;
        colors.set([col.r, col.g, col.b], i * 3);
        if (f === 4) uv.setXY(i, uv.getX(i), 0.5 + uv.getY(i) * 0.5);
        else uv.setXY(i, 0.5, 0.25);
      }
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geos.push(g);
  }
  const merged = mergeGeometries(geos, false)!;
  const mesh = new THREE.Mesh(merged, new THREE.MeshStandardMaterial({ map: TX.spineBands(), vertexColors: true, roughness: 0.68 }));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.raycast = () => {};
  geos.forEach((g) => g.dispose());
  return mesh;
}

export function bookcase(reg: Reg): { root: THREE.Group; slots: { phone: THREE.Vector3; eiffel: THREE.Vector3 } } {
  const root = new THREE.Group();
  const T = 0.035;
  const D = 0.36;
  const ROW = 0.43;
  const rose = new THREE.MeshPhysicalMaterial({ color: 0xd9889f, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.45 });
  const back = std(0x2a1a21, 0.95);
  const cols = [
    { x: 1.335, w: 0.62, rows: 3 },
    { x: 1.99, w: 0.56, rows: 5 },
    { x: 2.585, w: 0.66, rows: 4 },
  ];
  const hOf = (r: number) => r * ROW + T;
  const sideX = [1.3, 1.955, 2.55, 3.245];
  const sideH = [hOf(3), hOf(5), hOf(5), hOf(4)];
  sideX.forEach((x, i) => {
    const s = M(rbox(T, sideH[i], D, 0.004), rose);
    s.position.set(x + T / 2, sideH[i] / 2, D / 2);
    root.add(s);
  });
  cols.forEach((c) => {
    const bp = M(new THREE.PlaneGeometry(c.w, hOf(c.rows)), back);
    bp.position.set(c.x + c.w / 2, hOf(c.rows) / 2, 0.012);
    root.add(bp);
    for (let i = 0; i <= c.rows; i++) {
      const bd = M(rbox(c.w + 0.004, T, D, 0.004), rose);
      bd.position.set(c.x + c.w / 2, i * ROW + T / 2, D / 2);
      root.add(bd);
    }
  });
  shade(root);

  /* a handful of plain books for texture: the shelves are mostly for my favourite things now */
  let seed = 1;
  const fillers: Filler[] = [];
  const row = (ci: number, r: number, items: { w: number; h: number; lean?: number }[], from = 0.012) => {
    const c = cols[ci];
    let x = c.x + from;
    const y = r * ROW + T;
    for (const it of items) {
      const w = it.w / 100;
      const lean = it.lean ?? 0;
      fillers.push({ x, y, z: 0.17 + ((seed * 3) % 3) * 0.008, w, h: it.h / 100, d: 0.22 + ((seed * 7) % 5) * 0.008, color: PALETTE[seed % PALETTE.length], lean });
      seed++;
      x += w + (lean ? Math.sin(lean) * (it.h / 100) : 0) + 0.004;
    }
  };
  row(0, 0, [{ w: 3, h: 31 }, { w: 2.6, h: 27 }, { w: 3.4, h: 30 }, { w: 2.4, h: 25 }, { w: 3, h: 29, lean: 0.16 }]);
  row(0, 2, [{ w: 3.4, h: 32 }, { w: 2.6, h: 28 }, { w: 3, h: 30, lean: 0.14 }]);
  row(1, 0, [{ w: 3.2, h: 32 }, { w: 2.4, h: 25 }, { w: 3, h: 31 }, { w: 2.8, h: 28 }]);
  row(1, 2, [{ w: 2.8, h: 31 }, { w: 3, h: 26 }, { w: 2.6, h: 29, lean: 0.15 }], 0.33);
  row(2, 0, [{ w: 3, h: 30 }, { w: 2.6, h: 26 }, { w: 3.4, h: 33 }, { w: 2.4, h: 29 }]);
  row(2, 3, [{ w: 3.4, h: 32 }, { w: 2.4, h: 26 }, { w: 3, h: 30 }], 0.4);
  root.add(fillerBooks(fillers));

  /* ---------- my favourite things ---------- */
  const at = (ci: number, r: number, dx: number) => V(cols[ci].x + dx, r * ROW + T, 0.18);
  const put = (g: THREE.Object3D, p: THREE.Vector3, ry = 0) => {
    g.position.copy(p);
    g.rotation.y = ry;
    root.add(g);
    return g;
  };
  /* top of the middle column: the make-up shelf */
  const big = <T extends THREE.Object3D>(o: T, k: number) => (o.scale.setScalar(k), o);
  const pf = put(big(perfume(), 1.75), at(1, 4, 0.14), -0.25) as THREE.Group;
  reg("perfume", pf, "lift");
  const lip = put(big(lipstick(), 2), at(1, 4, 0.36), 0.3) as THREE.Group;
  reg("lipstick", lip, "lift");
  /* fashion: magazines with heart sunglasses on top */
  const mags = put(big(magazines(), 1.4), at(1, 3, 0.28), 0.06);
  const sun = sunglasses();
  sun.position.set(0, 0.052, 0.03);
  sun.rotation.x = -0.12;
  mags.add(sun);
  reg("sunnies", sun, "lift");
  /* the bag gets a shelf of its own */
  const bg = put(big(handbag(), 1.5), at(2, 2, 0.33), -0.12) as THREE.Group;
  reg("bag", bg, "lift");
  /* nail polish, a little mirror, candles and a record */
  put(big(polishes(), 1.7), at(0, 1, 0.1), 0.1);
  put(big(mirror(), 1.5), at(0, 1, 0.46), -0.2);
  put(big(candle(), 1.5), at(2, 3, 0.2));
  put(big(vinyl(), 1.3), at(1, 1, 0.28), 0.05);
  put(big(candle(0xf7c6d6), 1.4), at(1, 2, 0.15));

  /* a small framed photo to break up the rows */
  const mini = framedPhoto("room/sea-rocks.jpg", 0.12, 0.15, [0.5, 0.5], { border: 0.008, mat: 0.01, depth: 0.014 });
  mini.position.set(cols[2].x + 0.5, 1 * ROW + T + 0.075, 0.14);
  mini.rotation.x = -0.12;
  root.add(mini);
  const mini2 = framedPhoto("room/shells.jpg", 0.13, 0.11, [0.5, 0.5], { border: 0.008, mat: 0.01, depth: 0.014 });
  mini2.position.set(cols[2].x + 0.17, 1 * ROW + T + 0.06, 0.14);
  mini2.rotation.x = -0.1;
  root.add(mini2);

  return {
    root,
    slots: {
      phone: V(cols[2].x + cols[2].w / 2, 4 * ROW + T, 0.17),
      eiffel: V(cols[0].x + cols[0].w / 2, 3 * ROW + T, 0.17),
    },
  };
}

/* ------------------------------------------------------ favourite things */
const gold = () => new THREE.MeshStandardMaterial({ color: 0xe0b46a, metalness: 1, roughness: 0.28 });
const hit = (w: number, h: number, d: number, y = h / 2) => {
  const m = M(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
  m.position.y = y;
  m.userData.noShadow = true;
  return m;
};

/** a glass perfume bottle with pink juice and a faceted gold cap */
export function perfume(): THREE.Group {
  const g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffe3ee, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.42, clearcoat: 1, clearcoatRoughness: 0.05 });
  const body = M(rbox(0.1, 0.12, 0.055, 0.012), glass);
  body.position.y = 0.06;
  body.userData.noShadow = true;
  g.add(body);
  const juice = M(rbox(0.084, 0.085, 0.04, 0.008), new THREE.MeshStandardMaterial({ color: 0xff6fa1, roughness: 0.2, emissive: 0x5a0d2a, transparent: true, opacity: 0.85 }));
  juice.position.y = 0.05;
  g.add(juice);
  const neck = M(new THREE.CylinderGeometry(0.011, 0.013, 0.02, 16), gold());
  neck.position.y = 0.13;
  g.add(neck);
  const cap = M(new THREE.IcosahedronGeometry(0.03, 0), new THREE.MeshPhysicalMaterial({ color: 0xffb3cf, roughness: 0.1, metalness: 0.2, clearcoat: 1 }));
  cap.position.y = 0.163;
  cap.scale.set(1, 0.85, 1);
  g.add(cap);
  const label = M(new THREE.PlaneGeometry(0.05, 0.022), new THREE.MeshStandardMaterial({ map: TX.canvasTex(256, 112, (c) => {
    c.fillStyle = "#f8e7c9";
    c.fillRect(0, 0, 256, 112);
    c.strokeStyle = "#b8873c";
    c.lineWidth = 6;
    c.strokeRect(8, 8, 240, 96);
    c.fillStyle = "#7a1a3c";
    c.font = 'italic 600 46px "Playfair Display", Georgia, serif';
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("Rose", 128, 60);
  }), roughness: 0.6 }));
  label.position.set(0, 0.06, 0.0281);
  g.add(label);
  g.add(hit(0.12, 0.2, 0.08));
  return shade(g);
}

/** a gold lipstick, open, cap lying beside it */
export function lipstick(): THREE.Group {
  const g = new THREE.Group();
  const gm = gold();
  const base = M(new THREE.CylinderGeometry(0.017, 0.017, 0.055, 24), gm);
  base.position.y = 0.0275;
  g.add(base);
  const collar = M(new THREE.CylinderGeometry(0.014, 0.014, 0.018, 24), gm);
  collar.position.y = 0.064;
  g.add(collar);
  const red = new THREE.MeshPhysicalMaterial({ color: 0xd8124f, roughness: 0.35, clearcoat: 0.6 });
  const bullet = M(new THREE.CylinderGeometry(0.0115, 0.0115, 0.03, 24), red);
  bullet.position.y = 0.088;
  g.add(bullet);
  const tip = M(new THREE.CylinderGeometry(0.0001, 0.0115, 0.016, 24), red);
  tip.position.set(0.002, 0.111, 0);
  tip.rotation.z = 0.5;
  g.add(tip);
  const cap = M(new THREE.CylinderGeometry(0.0185, 0.0185, 0.058, 24), new THREE.MeshPhysicalMaterial({ color: 0x1a1216, roughness: 0.25, clearcoat: 1 }));
  cap.rotation.z = Math.PI / 2;
  cap.rotation.y = 0.5;
  cap.position.set(0.055, 0.0185, 0.03);
  g.add(cap);
  const ring = M(new THREE.TorusGeometry(0.0185, 0.0025, 8, 24), gm);
  ring.position.copy(cap.position);
  ring.rotation.set(0, Math.PI / 2 + 0.5, 0);
  ring.position.x -= 0.024;
  ring.position.z += 0.014;
  g.add(ring);
  g.add(hit(0.12, 0.14, 0.08));
  return shade(g);
}

/** three little nail polish bottles */
export function polishes(): THREE.Group {
  const g = new THREE.Group();
  [0xff4f8b, 0xb31745, 0xc8a2ff].forEach((c, i) => {
    const b = M(rbox(0.026, 0.032, 0.026, 0.006), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.15, clearcoat: 1 }));
    b.position.set(i * 0.034, 0.016, (i % 2) * 0.02);
    g.add(b);
    const cap = M(new THREE.CylinderGeometry(0.007, 0.008, 0.034, 12), new THREE.MeshStandardMaterial({ color: 0x15100f, roughness: 0.3 }));
    cap.position.set(i * 0.034, 0.049, (i % 2) * 0.02);
    g.add(cap);
  });
  return shade(g);
}

/** a stack of fashion magazines lying flat */
export function magazines(): THREE.Group {
  const g = new THREE.Group();
  const cover = (title: string, bg: string, ink: string) =>
    new THREE.MeshStandardMaterial({
      roughness: 0.5,
      map: TX.canvasTex(256, 320, (c) => {
        const gr = c.createLinearGradient(0, 0, 256, 320);
        gr.addColorStop(0, bg);
        gr.addColorStop(1, "#ffffff");
        c.fillStyle = gr;
        c.fillRect(0, 0, 256, 320);
        c.fillStyle = "rgba(255,255,255,.55)";
        c.beginPath();
        c.ellipse(150, 200, 70, 100, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = ink;
        c.font = 'italic 700 74px "Playfair Display", Georgia, serif';
        c.textAlign = "center";
        c.fillText(title, 128, 84);
        c.font = '600 18px Karla, sans-serif';
        c.fillText("SPRING ISSUE", 128, 290);
      }),
    });
  const edge = std(0xf2ece4, 0.9);
  const data: [string, string, string, number, number][] = [
    ["Glam", "#ffc0d6", "#9c1446", 0, 0],
    ["Mode", "#d9c8ff", "#3a1f66", 0.016, -0.08],
    ["Muse", "#ffd8b8", "#8a3a20", 0.032, 0.1],
  ];
  for (const [title, bg, ink, y, r] of data) {
    const mats = [edge, edge, cover(title, bg, ink), edge, edge, edge];
    const m = M(new THREE.BoxGeometry(0.2, 0.014, 0.25), mats);
    m.position.y = y + 0.007;
    m.rotation.y = r;
    g.add(m);
  }
  return shade(g);
}

/** heart-shaped pink sunglasses */
export function sunglasses(): THREE.Group {
  const g = new THREE.Group();
  const heart = (s: number) => {
    const h = new THREE.Shape();
    h.moveTo(0, -0.9 * s);
    h.bezierCurveTo(-0.3 * s, -0.6 * s, -1.05 * s, -0.2 * s, -1 * s, 0.35 * s);
    h.bezierCurveTo(-0.95 * s, 0.95 * s, -0.25 * s, 1.05 * s, 0, 0.5 * s);
    h.bezierCurveTo(0.25 * s, 1.05 * s, 0.95 * s, 0.95 * s, 1 * s, 0.35 * s);
    h.bezierCurveTo(1.05 * s, -0.2 * s, 0.3 * s, -0.6 * s, 0, -0.9 * s);
    return h;
  };
  const frame = new THREE.MeshPhysicalMaterial({ color: 0xff4f8b, roughness: 0.25, clearcoat: 1 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x3a0d22, roughness: 0.05, metalness: 0.3, clearcoat: 1, transparent: true, opacity: 0.88 });
  for (const sx of [-1, 1]) {
    const f = M(new THREE.ExtrudeGeometry(heart(0.032), { depth: 0.006, bevelEnabled: false }), frame);
    f.position.set(sx * 0.038, 0.03, 0);
    g.add(f);
    const l = M(new THREE.ShapeGeometry(heart(0.025)), lens);
    l.position.set(sx * 0.038, 0.031, 0.0065);
    g.add(l);
    const arm = M(rbox(0.004, 0.006, 0.1, 0.002), frame);
    arm.position.set(sx * 0.07, 0.04, -0.05);
    g.add(arm);
  }
  const bridge = M(new THREE.TorusGeometry(0.01, 0.0025, 6, 12, Math.PI), frame);
  bridge.position.set(0, 0.044, 0.003);
  g.add(bridge);
  g.add(hit(0.16, 0.07, 0.1, 0.03));
  return shade(g);
}

/** a quilted pink bag with a gold chain */
export function handbag(): THREE.Group {
  const g = new THREE.Group();
  const quilt = TX.canvasTex(256, 192, (c) => {
    c.fillStyle = "#f497b6";
    c.fillRect(0, 0, 256, 192);
    c.strokeStyle = "rgba(140,30,70,.35)";
    c.lineWidth = 3;
    for (let i = -192; i < 256 + 192; i += 32) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i + 192, 192);
      c.stroke();
      c.beginPath();
      c.moveTo(i + 192, 0);
      c.lineTo(i, 192);
      c.stroke();
    }
  });
  const leather = new THREE.MeshPhysicalMaterial({ map: quilt, roughness: 0.55, clearcoat: 0.35 });
  const body = M(rbox(0.2, 0.13, 0.075, 0.018), leather);
  body.position.y = 0.065;
  g.add(body);
  const flap = M(rbox(0.205, 0.07, 0.012, 0.01), leather);
  flap.position.set(0, 0.1, 0.038);
  g.add(flap);
  const gm = gold();
  const clasp = M(new THREE.TorusGeometry(0.012, 0.003, 8, 20), gm);
  clasp.position.set(0, 0.075, 0.046);
  g.add(clasp);
  const chain = M(new THREE.TorusGeometry(0.075, 0.0035, 6, 40, Math.PI), gm);
  chain.position.set(0, 0.13, 0);
  g.add(chain);
  g.add(hit(0.22, 0.22, 0.09));
  return shade(g);
}

export function candle(color = 0xffb3c9): THREE.Group {
  const g = new THREE.Group();
  const jar = M(new THREE.CylinderGeometry(0.035, 0.035, 0.07, 24), new THREE.MeshPhysicalMaterial({ color: 0xfff1f5, roughness: 0.1, transparent: true, opacity: 0.6, clearcoat: 1 }));
  jar.position.y = 0.035;
  jar.userData.noShadow = true;
  g.add(jar);
  const wax = M(new THREE.CylinderGeometry(0.031, 0.031, 0.05, 24), std(color, 0.8));
  wax.position.y = 0.026;
  g.add(wax);
  const flame = M(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc46b, toneMapped: false }));
  flame.scale.set(1, 2, 1);
  flame.position.y = 0.064;
  g.add(flame);
  return shade(g);
}

export function mirror(): THREE.Group {
  const g = new THREE.Group();
  const gm = gold();
  const ring = M(new THREE.TorusGeometry(0.06, 0.008, 10, 36), gm);
  ring.position.y = 0.1;
  g.add(ring);
  const glass = M(new THREE.CircleGeometry(0.058, 32), new THREE.MeshStandardMaterial({ color: 0xdfe8f0, metalness: 1, roughness: 0.05 }));
  glass.position.y = 0.1;
  g.add(glass);
  const stem = M(new THREE.CylinderGeometry(0.004, 0.004, 0.04, 8), gm);
  stem.position.y = 0.025;
  g.add(stem);
  const foot = M(new THREE.CylinderGeometry(0.03, 0.034, 0.008, 20), gm);
  foot.position.y = 0.004;
  g.add(foot);
  return shade(g);
}

/** a pink record leaning against the back */
export function vinyl(): THREE.Group {
  const g = new THREE.Group();
  const sleeve = M(rbox(0.26, 0.26, 0.006, 0.002), new THREE.MeshStandardMaterial({ roughness: 0.7, map: TX.canvasTex(256, 256, (c) => {
    const gr = c.createRadialGradient(90, 80, 10, 128, 128, 200);
    gr.addColorStop(0, "#ffd0e0");
    gr.addColorStop(1, "#c2306a");
    c.fillStyle = gr;
    c.fillRect(0, 0, 256, 256);
    c.fillStyle = "#fff";
    c.font = 'italic 400 44px Caveat, cursive';
    c.fillText("summer mix", 28, 220);
  }) }));
  sleeve.position.set(-0.03, 0.13, -0.06);
  sleeve.rotation.x = -0.12;
  g.add(sleeve);
  const disc = M(new THREE.CylinderGeometry(0.115, 0.115, 0.004, 40), new THREE.MeshStandardMaterial({ color: 0xff5d9a, roughness: 0.25, metalness: 0.1 }));
  disc.rotation.x = Math.PI / 2 - 0.12;
  disc.position.set(0.07, 0.118, -0.03);
  g.add(disc);
  const lab = M(new THREE.CylinderGeometry(0.035, 0.035, 0.005, 24), std(0xfff3d6, 0.6));
  lab.rotation.copy(disc.rotation);
  lab.position.copy(disc.position);
  g.add(lab);
  return shade(g);
}

/* ------------------------------------------------------------- the laptop */
function screenArt(): THREE.CanvasTexture {
  return TX.canvasTex(1024, 640, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, "#ffd3e3");
    gr.addColorStop(0.55, "#f58ab0");
    gr.addColorStop(1, "#e2477f");
    c.fillStyle = gr;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(255,255,255,.35)";
    c.fillRect(0, 0, w, 26);
    c.fillStyle = "#5a1430";
    c.font = '600 15px Karla, sans-serif';
    c.fillText("Lydia's World", 40, 18);
    c.textAlign = "center";
    c.fillStyle = "#4a1028";
    c.font = '400 26px Karla, sans-serif';
    c.fillText("welcome to", w / 2, 270);
    c.font = 'italic 400 92px "Playfair Display", Georgia, serif';
    c.fillText("Lydia's portfolio", w / 2, 360);
    c.font = '400 20px Karla, sans-serif';
    c.fillText("click to open", w / 2, 410);
    /* folders */
    const folder = (x: number, y: number, col: string) => {
      c.fillStyle = col;
      c.beginPath();
      c.roundRect(x, y, 64, 46, 6);
      c.fill();
      c.fillRect(x, y - 6, 26, 10);
    };
    [[860, 80], [940, 120], [860, 160], [940, 200], [860, 240], [940, 280]].forEach(([x, y], i) => folder(x, y, ["#b87a95", "#c992a8", "#a96b88"][i % 3]));
    folder(60, 300, "#c992a8");
    c.fillStyle = "rgba(255,255,255,.9)";
    c.beginPath();
    c.roundRect(40, 60, 190, 150, 8);
    c.fill();
    c.fillStyle = "rgba(255,255,255,.55)";
    c.beginPath();
    c.roundRect(620, 50, 140, 90, 18);
    c.fill();
    c.beginPath();
    c.roundRect(470, 50, 140, 90, 18);
    c.fill();
    /* dock */
    c.fillStyle = "rgba(255,255,255,.45)";
    c.beginPath();
    c.roundRect(w / 2 - 230, h - 70, 460, 56, 18);
    c.fill();
    ["#f06292", "#ffd54f", "#e57373", "#ba68c8", "#ff8a65", "#f48fb1", "#ef5350", "#ce93d8", "#4fc3f7"].forEach((col, i) => {
      c.fillStyle = col;
      c.beginPath();
      c.roundRect(w / 2 - 214 + i * 48, h - 62, 40, 40, 10);
      c.fill();
    });
  });
}

/** an open laptop; its screen shows a tiny version of the portfolio */
export function laptop(): { group: THREE.Group; screen: THREE.Mesh; size: [number, number] } {
  const g = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0xe4dde2, metalness: 0.75, roughness: 0.32 });
  const W = 0.46;
  const Dp = 0.31;
  const base = M(rbox(W, 0.016, Dp, 0.006), alu);
  base.position.set(0, 0.008, 0);
  g.add(base);
  const keys = M(new THREE.PlaneGeometry(W - 0.07, Dp * 0.42), std(0x2a2427, 0.6));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, 0.0165, -0.045);
  g.add(keys);
  const pad = M(new THREE.PlaneGeometry(0.15, 0.085), new THREE.MeshStandardMaterial({ color: 0xd6cfd4, metalness: 0.6, roughness: 0.4 }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.0166, 0.09);
  g.add(pad);
  /* lid hinges at the back edge */
  const lid = new THREE.Group();
  lid.position.set(0, 0.016, -Dp / 2 + 0.004);
  lid.rotation.x = -0.2;
  g.add(lid);
  const LH = 0.3;
  const panel = M(rbox(W, LH, 0.01, 0.006), alu);
  panel.position.set(0, LH / 2, -0.005);
  lid.add(panel);
  const bezel = M(new THREE.PlaneGeometry(W - 0.008, LH - 0.008), std(0x0d0a0c, 0.3));
  bezel.position.set(0, LH / 2, 0.0002);
  lid.add(bezel);
  const sw = W - 0.03;
  const sh = LH - 0.034;
  const screen = M(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ map: screenArt(), toneMapped: false }));
  screen.position.set(0, LH / 2 - 0.004, 0.0006);
  screen.name = "screen";
  lid.add(screen);
  const notch = M(new THREE.PlaneGeometry(0.03, 0.007), std(0x0d0a0c, 0.3));
  notch.position.set(0, LH - 0.0075, 0.0008);
  lid.add(notch);
  shade(g);
  screen.castShadow = false;
  const box = hit(W + 0.02, LH + 0.02, Dp, (LH + 0.02) / 2);
  box.position.z = -0.04;
  g.add(box);
  return { group: g, screen, size: [sw, sh] };
}

/* --------------------------------------------------------- electric guitar */
export function guitar(): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xd8638f, roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 });
  const maple = new THREE.MeshPhysicalMaterial({ color: 0xdcb27a, roughness: 0.45, clearcoat: 0.5 });
  const rose = std(0x3b2218, 0.6);
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.22, metalness: 1 });
  const pearl = new THREE.MeshPhysicalMaterial({ color: 0xf6efe8, roughness: 0.3, clearcoat: 0.7 });
  const black = std(0x121012, 0.45);

  const R: [number, number][] = [[0.05, 0.152], [0.078, 0.205], [0.112, 0.165], [0.128, 0.105], [0.122, 0.045], [0.09, -0.005], [0.12, -0.06], [0.158, -0.125], [0.15, -0.19], [0.095, -0.235], [0, -0.248]];
  const s = new THREE.Shape();
  s.moveTo(0, 0.15);
  s.splineThru(R.map(([x, y]) => new THREE.Vector2(x, y)));
  s.splineThru([...R].reverse().slice(1).map(([x, y]) => new THREE.Vector2(-x, y)).concat([new THREE.Vector2(0, 0.15)]));
  const bg = new THREE.ExtrudeGeometry(s, { depth: 0.034, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 4, curveSegments: 36 });
  bg.translate(0, 0, -0.017);
  g.add(M(bg, bodyMat));

  const pg = M(new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: false, curveSegments: 36 }), pearl);
  pg.scale.set(0.8, 0.66, 1);
  pg.position.set(0.004, -0.05, 0.0245);
  g.add(pg);
  [0.045, -0.012, -0.07].forEach((y) => {
    const pu = M(rbox(0.074, 0.02, 0.012, 0.003), pearl);
    pu.position.set(0, y, 0.03);
    g.add(pu);
    for (let i = 0; i < 6; i++) {
      const p = M(new THREE.CylinderGeometry(0.0023, 0.0023, 0.004, 8), chrome);
      p.rotation.x = Math.PI / 2;
      p.position.set(-0.026 + i * 0.0104, y, 0.037);
      g.add(p);
    }
  });
  const bridge = M(rbox(0.07, 0.05, 0.008, 0.002), chrome);
  bridge.position.set(0, -0.135, 0.028);
  g.add(bridge);
  [[0.075, -0.17], [0.1, -0.205], [0.12, -0.235]].forEach(([x, y], i) => {
    const k = M(new THREE.CylinderGeometry(0.014, 0.016, 0.02, 16), i === 0 ? black : black);
    k.rotation.x = Math.PI / 2;
    k.position.set(x - 0.03, y + 0.02, 0.036);
    g.add(k);
  });

  const neck = M(rbox(0.052, 0.54, 0.022, 0.004), maple);
  neck.position.set(0, 0.4, 0);
  g.add(neck);
  const fb = M(rbox(0.048, 0.5, 0.008, 0.002), rose);
  fb.position.set(0, 0.405, 0.012);
  g.add(fb);
  const S = 0.86;
  for (let n = 1; n <= 21; n++) {
    const y = 0.655 - S * (1 - Math.pow(2, -n / 12));
    if (y < 0.16) break;
    const f = M(new THREE.BoxGeometry(0.05, 0.0018, 0.0016), chrome);
    f.position.set(0, y, 0.0165);
    g.add(f);
    if ([3, 5, 7, 9, 15, 17].includes(n)) {
      const d = M(new THREE.CylinderGeometry(0.0034, 0.0034, 0.0014, 10), pearl);
      d.rotation.x = Math.PI / 2;
      d.position.set(0, y + 0.014, 0.0168);
      g.add(d);
    }
  }
  const hs = new THREE.Shape();
  hs.moveTo(-0.028, 0);
  hs.lineTo(0.028, 0);
  hs.bezierCurveTo(0.036, 0.06, 0.04, 0.12, 0.03, 0.17);
  hs.lineTo(-0.03, 0.16);
  hs.bezierCurveTo(-0.04, 0.1, -0.03, 0.05, -0.028, 0);
  const head = M(new THREE.ExtrudeGeometry(hs, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2 }), maple);
  head.position.set(0, 0.665, -0.008);
  g.add(head);
  for (let i = 0; i < 6; i++) {
    const t = M(new THREE.CylinderGeometry(0.0055, 0.0055, 0.018, 10), chrome);
    t.rotation.x = Math.PI / 2;
    t.position.set(-0.022 + (i % 2 ? 0.044 : 0), 0.7 + Math.floor(i / 2) * 0.032 + 0.0, 0.02);
    g.add(t);
  }
  for (let i = 0; i < 6; i++) {
    const x = -0.0185 + i * 0.0074;
    const st = M(new THREE.CylinderGeometry(0.0009 + (5 - i) * 0.00012, 0.0009 + (5 - i) * 0.00012, 0.795, 5), chrome);
    st.position.set(x, 0.2625, 0.0215);
    g.add(st);
  }
  shade(g);
  const hit = M(new THREE.BoxGeometry(0.34, 1.1, 0.12), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.set(0, 0.28, 0);
  g.add(hit);
  return bake(g);
}

/* ------------------------------------------------------------ rotary phone */
export function phone(): THREE.Group {
  const g = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: 0xe69ab6, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.15 });
  const cream = std(0xf6e8ee, 0.5);
  const prof = new THREE.Shape();
  prof.moveTo(0.1, 0);
  prof.lineTo(-0.1, 0);
  prof.lineTo(-0.1, 0.03);
  prof.lineTo(0.1, 0.095);
  const bodyGeo = new THREE.ExtrudeGeometry(prof, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 5, curveSegments: 10 });
  bodyGeo.translate(0, 0, -0.1);
  bodyGeo.rotateY(Math.PI / 2);
  g.add(M(bodyGeo, shell));
  const slope = Math.atan2(0.065, 0.2);
  const dial = new THREE.Group();
  dial.position.set(0, 0.0625 + 0.014, 0.005);
  dial.rotation.x = slope;
  const plate = M(new THREE.CircleGeometry(0.066, 40), new THREE.MeshStandardMaterial({ color: 0xf6e8ee, roughness: 0.5 }));
  plate.rotation.x = -Math.PI / 2;
  dial.add(plate);
  const ring = new THREE.Shape();
  ring.absarc(0, 0, 0.06, 0, Math.PI * 2, false);
  for (let i = 0; i < 10; i++) {
    const a = ((120 + i * 28) * Math.PI) / 180;
    const h = new THREE.Path();
    h.absarc(Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0.0095, 0, Math.PI * 2, true);
    ring.holes.push(h);
  }
  const ringMesh = M(new THREE.ExtrudeGeometry(ring, { depth: 0.004, bevelEnabled: false, curveSegments: 20 }), new THREE.MeshPhysicalMaterial({ color: 0xd9889f, roughness: 0.35, clearcoat: 0.6 }));
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.0045;
  dial.add(ringMesh);
  const cap = M(new THREE.CylinderGeometry(0.02, 0.02, 0.006, 24), cream);
  cap.position.y = 0.008;
  dial.add(cap);
  g.add(dial);
  const curve = new THREE.CatmullRomCurve3([V(-0.105, 0.115, -0.012), V(-0.075, 0.15, -0.012), V(0, 0.162, -0.012), V(0.075, 0.15, -0.012), V(0.105, 0.115, -0.012)]);
  g.add(M(new THREE.TubeGeometry(curve, 24, 0.0145, 12), shell));
  for (const sx of [-1, 1]) {
    const cup = M(new THREE.CapsuleGeometry(0.03, 0.045, 6, 14), shell);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(sx * 0.108, 0.108, -0.012);
    cup.scale.set(0.82, 1, 1);
    g.add(cup);
    const cradle = M(new THREE.BoxGeometry(0.03, 0.03, 0.04), shell);
    cradle.position.set(sx * 0.095, 0.085, -0.012);
    g.add(cradle);
  }
  const cord: THREE.Vector3[] = [];
  for (let i = 0; i < 80; i++) {
    const t = i / 79;
    cord.push(V(-0.13 - t * 0.04 + Math.sin(i * 0.9) * 0.008, 0.07 - t * 0.065 + Math.cos(i * 0.9) * 0.006, 0.01 + t * 0.08));
  }
  g.add(M(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cord), 80, 0.0032, 6), shell));
  /* merging the pieces removes their click targets, so give the phone one invisible box */
  const hit = M(new THREE.BoxGeometry(0.3, 0.2, 0.26), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.set(-0.02, 0.09, 0);
  g.add(hit);
  return bake(g);
}

/* ------------------------------------------------------------------- globe */
export function globe(): THREE.Group {
  const g = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: 0xc2a050, metalness: 0.85, roughness: 0.3 });
  const ball = M(new THREE.SphereGeometry(0.095, 48, 32), new THREE.MeshStandardMaterial({ map: TX.globeMap(), roughness: 0.4 }));
  ball.position.y = 0.17;
  ball.rotation.z = 0.4;
  ball.name = "ball";
  g.add(ball);
  const ring = M(new THREE.TorusGeometry(0.105, 0.004, 8, 48, Math.PI * 1.15), brass);
  ring.position.y = 0.17;
  ring.rotation.set(0, Math.PI / 2, 0.4);
  g.add(ring);
  g.add(M(new THREE.CylinderGeometry(0.04, 0.05, 0.012, 24), brass));
  const stem = M(new THREE.CylinderGeometry(0.005, 0.005, 0.07, 8), brass);
  stem.position.y = 0.045;
  g.add(stem);
  return shade(g);
}

/* ------------------------------------------------------------------- plant */
export function plant(): { group: THREE.Group; update: (t: number) => void } {
  const r = TX.seeded(31);
  const g = new THREE.Group();
  const potPts = [V(0, 0), V(0.06, 0), V(0.082, 0.04), V(0.1, 0.13), V(0.092, 0.14), V(0, 0.14)].map((v) => new THREE.Vector2(v.x, v.y));
  g.add(M(new THREE.LatheGeometry(potPts, 36), new THREE.MeshPhysicalMaterial({ color: 0x1f1a1c, roughness: 0.35, clearcoat: 0.5 })));
  const soil = M(new THREE.CircleGeometry(0.09, 24), std(0x2a1f18, 1));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.128;
  g.add(soil);
  const stems = new THREE.Group();
  g.add(stems);
  const leafGeo = new THREE.SphereGeometry(1, 8, 6);
  const leaves = new THREE.InstancedMesh(leafGeo, new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }), 420);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const col = new THREE.Color();
  const greens = [0x5c8a3e, 0x6f9d49, 0x4a7634, 0x7aa84f, 0x3f6a2c];
  let n = 0;
  for (let s = 0; s < 8; s++) {
    const a = (s / 8) * Math.PI * 2 + r();
    const L = 0.3 + r() * 0.8;
    const x0 = Math.cos(a) * 0.05;
    const z0 = Math.sin(a) * 0.04;
    const pts = [V(x0, 0.13, z0), V(x0 * 1.6, 0.17, z0 * 1.4), V(x0 * 2.4 + (r() - 0.5) * 0.05, 0.12, z0 * 2.2 + 0.02), V(x0 * 2.7 + (r() - 0.5) * 0.08, 0.12 - L * 0.4, z0 * 2.2 + 0.03), V(x0 * 2.5 + (r() - 0.5) * 0.1, 0.12 - L * 0.75, z0 * 2.0 + 0.02), V(x0 * 2.6 + (r() - 0.5) * 0.12, 0.12 - L, z0 * 2.0)];
    const curve = new THREE.CatmullRomCurve3(pts);
    stems.add(M(new THREE.TubeGeometry(curve, 36, 0.0017, 5), std(0x3a5a2a, 0.8)));
    const count = Math.floor(L * 58);
    for (let i = 3; i < count && n < 420; i++) {
      const t = 0.18 + (i / count) * 0.82;
      const p = curve.getPoint(Math.min(1, t));
      const side = i % 2 ? 1 : -1;
      const sz = 0.9 + r() * 0.6;
      e.set((r() - 0.5) * 0.7, (r() - 0.5) * 1.2, side * (0.4 + r() * 0.8));
      q.setFromEuler(e);
      m4.compose(V(p.x + side * 0.012, p.y, p.z), q, V(0.0125 * sz, 0.0175 * sz, 0.0018));
      leaves.setMatrixAt(n, m4);
      leaves.setColorAt(n, col.setHex(greens[Math.floor(r() * greens.length)]));
      n++;
    }
  }
  leaves.count = n;
  stems.add(leaves);
  shade(g);
  g.userData.sway = stems;
  return { group: g, update: (t) => (stems.rotation.z = Math.sin(t * 0.7) * 0.012) };
}

/* -------------------------------------------------------------- corkboard */
export function corkboard(notes: { text: string; title?: string; color: string; x: number; y: number; r: number }[]): THREE.Group {
  const W = 0.98;
  const H = 0.64;
  const g = new THREE.Group();
  g.add(M(rbox(W, H, 0.04, 0.008), std(0x6e4524, 0.6)));
  const c = M(new THREE.PlaneGeometry(W - 0.07, H - 0.07), new THREE.MeshStandardMaterial({ map: TX.cork(), roughness: 0.95 }));
  c.position.z = 0.0205;
  g.add(c);
  const sh = TX.softShadow();
  let z = 0.022;
  const put = (mesh: THREE.Mesh, x: number, y: number, rot: number, w: number, h: number) => {
    const s = M(new THREE.PlaneGeometry(w * 1.15, h * 1.15), new THREE.MeshBasicMaterial({ map: sh, transparent: true, opacity: 0.55, depthWrite: false }));
    s.position.set(x + 0.006, y - 0.008, z - 0.0004);
    s.rotation.z = rot;
    g.add(s);
    mesh.position.set(x, y, z);
    mesh.rotation.z = rot;
    g.add(mesh);
    z += 0.0008;
  };
  for (const n of notes) {
    const p = M(new THREE.PlaneGeometry(0.15, 0.15), new THREE.MeshStandardMaterial({ map: TX.note(n.text, n.color, n.title), roughness: 0.85 }));
    put(p, n.x, n.y, n.r, 0.15, 0.15);
    const pin = M(new THREE.SphereGeometry(0.0075, 12, 8), std(["#d94a5a", "#3a7ad9", "#e0b020"][Math.floor(Math.abs(n.x * 10)) % 3], 0.3));
    pin.position.set(n.x, n.y + 0.058, z + 0.004);
    g.add(pin);
  }
  const card = new THREE.Group();
  card.add(M(new THREE.PlaneGeometry(0.2, 0.145), std(0xffffff, 0.8)));
  const ph = printed(TX.photo("room/sea-sunset.jpg", 0.18 / 0.1, [0.5, 0.6]), 0.18, 0.1);
  ph.position.set(0, 0.012, 0.0006);
  card.add(ph);
  put(card as unknown as THREE.Mesh, 0.28, -0.14, 0.07, 0.2, 0.145);
  return shade(g, true, true);
}

/* ------------------------------------------------------------------ window */
export function windowFrame(): THREE.Group {
  const W = 1.08;
  const H = 1.36;
  const g = new THREE.Group();
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xeee4d3, roughness: 0.5, clearcoat: 0.25 });
  const F = 0.075;
  const DEP = 0.08;
  const part = (w: number, h: number, x: number, y: number) => {
    const m = M(rbox(w, h, DEP, 0.004), ivory);
    m.position.set(x, y, DEP / 2);
    g.add(m);
  };
  part(W, F, 0, H / 2 - F / 2);
  part(W, F, 0, -H / 2 + F / 2);
  part(F, H, -W / 2 + F / 2, 0);
  part(F, H, W / 2 - F / 2, 0);
  part(0.038, H - F, 0, 0);
  part(W - F, 0.038, 0, 0.04);
  const tex = TX.photo("room/sea-sunset.jpg", (W - 2 * F) / (H - 2 * F), [0.5, 0.62]);
  const glass = M(new THREE.PlaneGeometry(W - 2 * F, H - 2 * F), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 1.45 }));
  glass.position.z = 0.012;
  glass.name = "glass";
  g.add(glass);
  const rec = M(new THREE.PlaneGeometry(W - 2 * F, H - 2 * F), new THREE.MeshBasicMaterial({ map: TX.recess(), transparent: true, depthWrite: false }));
  rec.position.z = 0.014;
  g.add(rec);
  const sill = M(rbox(W + 0.16, 0.045, 0.17, 0.008), ivory);
  sill.position.set(0, -H / 2 - 0.02, 0.085);
  g.add(sill);
  return shade(g, true, true);
}

/* ------------------------------------------------------------- desk pieces */
export function desk(): THREE.Group {
  const g = new THREE.Group();
  const top = M(rbox(2.1, 0.05, 0.8, 0.012), new THREE.MeshStandardMaterial({ map: TX.woodGrain("#a06a46"), roughness: 0.48 }));
  top.position.set(0, 0.74, 0.4);
  g.add(top);
  const legM = std(0x2a2023, 0.4, 0.2);
  for (const [x, z] of [[-0.97, 0.06], [0.97, 0.06], [-0.97, 0.74], [0.97, 0.74]]) {
    const l = M(rbox(0.045, 0.72, 0.045, 0.006), legM);
    l.position.set(x, 0.36, z);
    g.add(l);
  }
  const rail = M(rbox(1.9, 0.07, 0.03, 0.006), legM);
  rail.position.set(0, 0.69, 0.06);
  g.add(rail);
  return shade(g);
}

export function folder(heading: string, name: string, role: string): THREE.Group {
  const g = new THREE.Group();
  const kraft = std(0xe2d2b6, 0.85);
  const f = M(rbox(0.23, 0.014, 0.31, 0.004), kraft);
  f.position.y = 0.007;
  g.add(f);
  const tab = M(rbox(0.07, 0.014, 0.025, 0.003), std(0xd98aa2, 0.6));
  tab.position.set(-0.07, 0.007, -0.168);
  g.add(tab);
  for (let i = 0; i < 3; i++) {
    const p = M(new THREE.BoxGeometry(0.205, 0.0012, 0.285), std(0xf4efe5, 0.9));
    p.position.set((i - 1) * 0.003, 0.0155 + i * 0.0014, (i - 1) * 0.004);
    p.rotation.y = (i - 1) * 0.02;
    g.add(p);
  }
  const top = M(new THREE.PlaneGeometry(0.205, 0.285), new THREE.MeshStandardMaterial({ map: TX.resumeSheet(name, role, heading), roughness: 0.8 }));
  top.rotation.x = -Math.PI / 2;
  top.position.set(0.003, 0.0215, 0.0);
  g.add(top);
  const clip = M(rbox(0.012, 0.01, 0.04, 0.002), new THREE.MeshStandardMaterial({ color: 0xcfd3da, metalness: 1, roughness: 0.25 }));
  clip.position.set(-0.09, 0.025, -0.12);
  g.add(clip);
  return shade(g);
}

/** a matcha bowl with a bamboo whisk, and a few puffs of steam */
export function matcha(): { group: THREE.Group; steam: THREE.Sprite[] } {
  const g = new THREE.Group();
  const clay = new THREE.MeshPhysicalMaterial({ color: 0x8fae9a, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.3 });
  const pts = [V(0, 0), V(0.03, 0), V(0.036, 0.01), V(0.05, 0.03), V(0.062, 0.06), V(0.064, 0.07), V(0.06, 0.072), V(0.054, 0.062), V(0.042, 0.032), V(0.033, 0.018), V(0, 0.018)].map((v) => new THREE.Vector2(v.x, v.y));
  g.add(M(new THREE.LatheGeometry(pts, 32), clay));
  const tea = M(new THREE.CircleGeometry(0.057, 28), new THREE.MeshStandardMaterial({ color: 0x78b030, roughness: 0.4, emissive: 0x16280a }));
  tea.rotation.x = -Math.PI / 2;
  tea.position.y = 0.056;
  g.add(tea);
  const foam = M(new THREE.CircleGeometry(0.04, 24), new THREE.MeshStandardMaterial({ color: 0xa6d36a, roughness: 0.9, emissive: 0x1c300c }));
  foam.rotation.x = -Math.PI / 2;
  foam.position.set(0.006, 0.0575, -0.004);
  g.add(foam);
  /* bamboo whisk, standing next to the bowl */
  const bamboo = new THREE.MeshStandardMaterial({ color: 0xdcc490, roughness: 0.7 });
  const wp = [V(0, 0), V(0.024, 0), V(0.032, 0.018), V(0.026, 0.046), V(0.014, 0.058), V(0, 0.06)].map((v) => new THREE.Vector2(v.x, v.y));
  const whisk = new THREE.Group();
  whisk.add(M(new THREE.LatheGeometry(wp, 18), bamboo));
  const handle = M(new THREE.CylinderGeometry(0.012, 0.014, 0.06, 12), bamboo);
  handle.position.y = 0.09;
  whisk.add(handle);
  whisk.position.set(0.13, 0, 0.02);
  g.add(whisk);
  shade(g);
  /* one invisible box so the bowl and whisk are easy to point at */
  const hit = M(new THREE.BoxGeometry(0.28, 0.14, 0.15), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.set(0.06, 0.07, 0);
  g.add(hit);
  const steam: THREE.Sprite[] = [];
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: TX.mote(), transparent: true, opacity: 0, depthWrite: false, color: 0xeaf6dc }));
    sp.scale.setScalar(0.06);
    sp.position.set(0, 0.08, 0);
    g.add(sp);
    steam.push(sp);
  }
  return { group: g, steam };
}

export function lamp(): { group: THREE.Group; light: THREE.PointLight; bulbMat: THREE.MeshBasicMaterial } {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x2a2124, metalness: 0.7, roughness: 0.35 });
  g.add(M(new THREE.CylinderGeometry(0.075, 0.08, 0.016, 28), metal));
  const arm1 = M(new THREE.TubeGeometry(new THREE.LineCurve3(V(0, 0.01, 0), V(-0.06, 0.28, -0.02)), 4, 0.006, 8), metal);
  const arm2 = M(new THREE.TubeGeometry(new THREE.LineCurve3(V(-0.06, 0.28, -0.02), V(0.08, 0.46, 0.02)), 4, 0.006, 8), metal);
  g.add(arm1, arm2);
  const shadeM = M(new THREE.CylinderGeometry(0.03, 0.085, 0.1, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xd98aa2, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide }));
  shadeM.position.set(0.1, 0.45, 0.03);
  shadeM.rotation.z = -0.5;
  g.add(shadeM);
  const bulb = M(new THREE.SphereGeometry(0.022, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffe2a8, toneMapped: false }));
  bulb.position.set(0.115, 0.42, 0.03);
  g.add(bulb);
  const light = new THREE.PointLight(0xffc27a, 1.1, 2.6, 1.6);
  light.position.set(0.115, 0.4, 0.04);
  g.add(light);
  shade(g);
  bulb.castShadow = false;
  shadeM.castShadow = false;
  const hit = M(new THREE.BoxGeometry(0.32, 0.56, 0.26), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.set(0.02, 0.27, 0.02);
  g.add(hit);
  const bulbMat = bulb.material as THREE.MeshBasicMaterial;
  return { group: g, light, bulbMat };
}

export function rugMesh(): THREE.Mesh {
  const m = M(new THREE.CylinderGeometry(1.35, 1.35, 0.016, 64), new THREE.MeshStandardMaterial({ map: TX.rug(), roughness: 1 }));
  m.scale.z = 0.72;
  m.receiveShadow = true;
  return m;
}

