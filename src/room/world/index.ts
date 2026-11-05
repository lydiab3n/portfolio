import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as TX from "./textures";
import { bake, bookcase, corkboard, desk, folder, framedPhoto, globe, guitar, lamp, laptop, matcha, phone, plant, postcard, rugMesh, shade, std, windowFrame, type Reg } from "./props";
import { ferrari, lamborghini } from "./cats";

export class NoWebGL extends Error {}

export interface WorldOptions {
  canvas: HTMLCanvasElement;
  proxies: Map<string, HTMLElement>;
  titles: Record<string, string>;
  reduce: boolean;
  night: boolean;
  debug: boolean;
  resume: { heading: string; name: string; role: string };
  notes: { text: string; title?: string; color: string; x: number; y: number; r: number }[];
  onPick: (id: string) => void;
  onHover: (id: string | null) => void;
  onProgress: (p: number) => void;
  onLost: () => void;
}

export interface World {
  ready: Promise<void>;
  setPaused: (p: boolean) => void;
  resize: () => void;
  hop: (id: string) => void;
  setHover: (id: string | null) => void;
  setNight: (on: boolean) => void;
  /** a little physical reaction: spin the globe, shake the guitar, wiggle the plant, stir the steam */
  kick: (id: string) => void;
  /** fly the camera to the laptop screen (true) or back to the room (false); resolves when the move ends */
  zoom: (on: boolean) => Promise<void>;
  /** where the laptop screen is on the page, in CSS pixels */
  screenRect: () => { x: number; y: number; w: number; h: number };
}

interface Entry {
  id: string;
  group: THREE.Group;
  mode: "pull" | "lift" | "none";
  base?: THREE.Vector3;
  box?: THREE.Box3;
  hover: number;
}

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const HOVER_GLOW = new THREE.Color(0x3d2412);
const yieldNow = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

/* ---------- quality tiers: 0 weakest ... 3 strongest ---------- */
interface Quality {
  dpr: number;
  shadow: number;
  aa: boolean;
  motes: number;
  every: number;
  aniso: number;
}
const TIERS: Quality[] = [
  { dpr: 1, shadow: 1024, aa: false, motes: 0, every: 4, aniso: 2 },
  { dpr: 1.5, shadow: 2048, aa: false, motes: 60, every: 3, aniso: 4 },
  { dpr: 1.5, shadow: 2048, aa: true, motes: 120, every: 2, aniso: 8 },
  { dpr: 2, shadow: 3072, aa: true, motes: 160, every: 2, aniso: 16 },
];

function pickTier(): number {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2");
  if (!gl || new URLSearchParams(location.search).has("nogl")) throw new NoWebGL("WebGL 2 is not available"); // ?nogl lets you test the fallback
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  if (/swiftshader|llvmpipe|software|microsoft basic|softpipe/i.test(name)) return 0;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const phone = matchMedia("(pointer: coarse)").matches;
  let tier = phone ? (cores >= 8 && mem >= 4 ? 2 : 1) : cores <= 4 || mem <= 4 ? 2 : 3;
  if (nav.connection?.saveData) tier = Math.max(0, tier - 1);
  return tier;
}

export async function createWorld(o: WorldOptions): Promise<World> {
  const t0 = performance.now();
  const tier = pickTier();
  const Q = TIERS[tier];
  TX.setAniso(Q.aniso);
  const log = (what: string) => o.debug && console.info(`[room] ${what} @ ${Math.round(performance.now() - t0)}ms`);

  try {
    await Promise.all([document.fonts.load('600 40px "Playfair Display"'), document.fonts.load('400 36px Caveat'), document.fonts.load('400 26px Karla')]);
  } catch {
    /* fall back to system fonts */
  }
  o.onProgress(0.06);
  log("fonts");

  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: Q.aa, powerPreference: "high-performance" });
  let dpr = Math.min(devicePixelRatio, Q.dpr);
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.reduce ? 0.92 : 0.35;
  o.canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    o.onLost();
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1417);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.22;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(33, 1.78, 0.1, 60);
  const DIST = 7.4;
  let CAM_Y = 1.5;
  let LOOK_Y = 1.22;

  /* ---------- light ---------- */
  const hemi = new THREE.HemisphereLight(0xffe6d2, 0x1d1216, 0.32);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffcf9a, 3.4);
  key.position.set(-3.8, 4.6, 5.6);
  key.target.position.set(0, 1.2, 0);
  key.castShadow = true;
  let shadowSize = Q.shadow;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  const sc = key.shadow.camera;
  sc.left = -4.3;
  sc.right = 4.3;
  sc.top = 4.4;
  sc.bottom = -3.4;
  sc.near = 1;
  sc.far = 18;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.012;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0x9db4ff, 0.18);
  fill.position.set(5, 2.5, 5);
  scene.add(fill);
  const glow = new THREE.PointLight(0xffb070, 3.2, 3.2, 2);
  glow.position.set(-0.25, 2.1, 0.6);
  scene.add(glow);

  /* ---------- room shell ---------- */
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 3.7), new THREE.MeshStandardMaterial({ map: TX.plaster(), color: 0x86767b, roughness: 0.95 }));
  wall.position.set(0, 1.85, 0);
  wall.receiveShadow = true;
  scene.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 11), new THREE.MeshStandardMaterial({ map: TX.woodFloor(), roughness: 0.5, metalness: 0.04 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 4.5);
  floor.receiveShadow = true;
  scene.add(floor);
  const base = new THREE.Mesh(new RoundedBoxGeometry(12, 0.13, 0.035, 2, 0.008), std(0x4a3a3f, 0.6));
  base.position.set(0, 0.065, 0.018);
  shade(base);
  scene.add(base);
  o.onProgress(0.14);
  await yieldNow();
  log("shell");

  /* ---------- interactive registry ---------- */
  const entries: Entry[] = [];
  const reg: Reg = (id, group, mode = "lift") => {
    group.userData.spot = id;
    entries.push({ id, group, mode, hover: 0 });
  };
  const add = (g: THREE.Object3D, x: number, y: number, z: number, ry = 0) => {
    g.position.set(x, y, z);
    g.rotation.y = ry;
    scene.add(g);
    return g;
  };

  /* bookcase and rotary phone; the Eiffel Tower slot is filled later, after the first frame */
  const bc = bookcase(reg);
  scene.add(bc.root);
  const eif = new THREE.Group();
  eif.position.copy(bc.slots.eiffel);
  eif.rotation.y = 0.45;
  const eifHit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.64, 0.4), new THREE.MeshBasicMaterial({ visible: false }));
  eifHit.position.y = 0.32;
  eif.add(eifHit);
  scene.add(eif);
  reg("paris", eif, "lift");
  const towerLight = new THREE.PointLight(0xffd9a8, 1.3, 1.6, 1.6);
  towerLight.position.set(bc.slots.eiffel.x - 0.25, bc.slots.eiffel.y + 0.4, 0.75);
  scene.add(towerLight);
  const ph = phone();
  ph.position.copy(bc.slots.phone);
  ph.position.z = 0.16;
  ph.rotation.y = -0.18;
  scene.add(ph);
  reg("phone", ph, "lift");
  o.onProgress(0.3);
  await yieldNow();
  log("bookcase");

  /* floating shelf with photos, globe and plant */
  const rose = new THREE.MeshPhysicalMaterial({ color: 0xd9889f, roughness: 0.5, clearcoat: 0.3 });
  const plank = new THREE.Mesh(new RoundedBoxGeometry(1.95, 0.042, 0.3, 3, 0.008), rose);
  plank.position.set(-2.15, 1.95, 0.15);
  shade(plank);
  scene.add(plank);
  const shelfTop = 1.95 + 0.021;
  const f1 = framedPhoto("room/cat-1.jpg", 0.3, 0.34, [0.5, 0.42]);
  add(f1, -2.88, shelfTop + 0.17, 0.1, 0.12).rotation.x = -0.1;
  reg("cat-photo-1", f1 as THREE.Group, "lift");
  const f2 = framedPhoto("room/cat-2.jpg", 0.27, 0.3, [0.3, 0.45]);
  add(f2, -2.46, shelfTop + 0.15, 0.1, -0.1).rotation.x = -0.1;
  reg("cat-photo-2", f2 as THREE.Group, "lift");
  const gl = globe();
  add(gl, -2.02, shelfTop, 0.13);
  reg("exp", gl, "lift");
  const globeBall = gl.getObjectByName("ball")!;
  const pl = plant();
  add(pl.group, -1.5, shelfTop, 0.14);
  reg("plant", pl.group, "none");

  /* wall: portrait, corkboard, postcard, window */
  const portrait = framedPhoto("lydia-portrait.jpg", 0.44, 0.6, [0.52, 0.32]);
  add(portrait, -2.82, 1.18, 0.02);
  reg("about", portrait as THREE.Group, "pull");
  const cork = corkboard(o.notes);
  add(cork, -1.9, 1.18, 0.02);
  reg("notes", cork, "pull");
  const pc = postcard();
  add(pc, -1.11, 1.56, 0.012);
  pc.rotation.z = 0.05;
  pc.scale.setScalar(1.3);
  reg("algiers", pc, "pull");
  const win = windowFrame();
  add(win, -0.2, 2.15, 0);
  reg("sea", win, "none");
  o.onProgress(0.5);
  await yieldNow();
  log("wall");

  /* desk with résumé folder, mug and lamp */
  const dk = desk();
  add(dk, -0.35, 0, 0);
  const top = 0.74 + 0.025;
  const fo = folder(o.resume.heading, o.resume.name, o.resume.role);
  fo.scale.setScalar(1.3);
  add(fo, -1.12, top, 0.45, 0.32);
  const lt = laptop();
  lt.group.scale.setScalar(1.25);
  add(lt.group, -0.48, top, 0.36, 0.06);
  reg("laptop", lt.group, "none");
  reg("cv", fo, "lift");
  const mt = matcha();
  add(mt.group, 0.06, top, 0.5, 0.25);
  mt.group.scale.setScalar(1.35);
  reg("matcha", mt.group, "lift");
  const lp = lamp();
  add(lp.group, 0.42, top, 0.18, -0.4);
  reg("lamp", lp.group, "none");
  lp.light.shadow.mapSize.set(1024, 1024);
  lp.light.shadow.bias = -0.003;
  const gt = guitar();
  add(gt, 1.0, 0.46, 0.48);
  gt.rotation.x = -0.34;
  gt.rotation.z = -0.07;
  reg("music", gt, "none");
  o.onProgress(0.62);
  await yieldNow();
  log("desk");

  /* rug and cats */
  const rg = rugMesh();
  rg.position.set(0.1, 0.008, 1.55);
  rg.scale.set(0.8, 1, 0.58);
  scene.add(rg);
  const fe = ferrari();
  fe.group.scale.setScalar(1.4);
  add(fe.group, -0.18, 0.016, 1.5, 0.3);
  reg("cat-a", fe.group, "none");
  const la = lamborghini();
  la.group.scale.setScalar(1.4);
  add(la.group, 0.78, 0.016, 1.36, -0.3);
  reg("cat-b", la.group, "none");
  o.onProgress(0.72);
  await yieldNow();
  log("cats");

  /* dust in the light (skipped on weak machines and for reduced motion) */
  const N = o.reduce ? 0 : Q.motes;
  const motePos = new Float32Array(Math.max(1, N) * 3);
  const r = TX.seeded(77);
  for (let i = 0; i < N; i++) {
    motePos[i * 3] = -3 + r() * 5;
    motePos[i * 3 + 1] = 0.4 + r() * 3;
    motePos[i * 3 + 2] = 0.3 + r() * 3.4;
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(mg, new THREE.PointsMaterial({ map: TX.mote(), size: 0.03, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }));
  if (N) scene.add(motes);

  /* night sky outside the window */
  const sr = TX.seeded(5);
  const starPos = new Float32Array(60 * 3);
  for (let i = 0; i < 60; i++) {
    starPos[i * 3] = -0.2 + (sr() - 0.5) * 0.9;
    starPos[i * 3 + 1] = 2.15 + 0.04 + sr() * 0.55;
    starPos[i * 3 + 2] = 0.017;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.011, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(stars);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.045, 32), new THREE.MeshBasicMaterial({ color: 0xfff3d6, transparent: true, opacity: 0, toneMapped: false }));
  moon.position.set(0.08, 2.62, 0.018);
  scene.add(moon);
  const glassMat = (win.getObjectByName("glass") as THREE.Mesh).material as THREE.MeshStandardMaterial;
  const warmGlow = new THREE.Color(0xffb070);
  const coolGlow = new THREE.Color(0x6f8cff);
  const white = new THREE.Color(0xffffff);
  const dusk = new THREE.Color(0x6a80c0);
  let nightGoal = o.night ? 1 : 0;
  let nightT = nightGoal;
  o.onProgress(0.78);
  await yieldNow();

  /* ---------- camera, pan and parallax ---------- */
  let W = 1;
  let H = 1;
  let panMax = 0;
  const cam = { x: 0, y: 0, tx: 0, ty: 0, px: 0, dragging: false };
  let needProxy = true;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const small = W < 760;
    camera.fov = small ? 46 : 33;
    CAM_Y = small ? 1.85 : 1.5;
    LOOK_Y = small ? 1.85 : 1.22;
    if (small) camera.setViewOffset(W, H, 0, 170, W, H);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    const visW = 2 * DIST * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    panMax = Math.max(0, 3.35 - visW / 2);
    cam.px = Math.min(cam.px, panMax);
    needProxy = true;
    if (lt) aimAtScreen();
  }

  /* ---------- picking: a cheap box test first, triangles only for the few objects under the pointer ---------- */
  const boxOf = (e: Entry) => (e.box ??= new THREE.Box3().setFromObject(e.group));
  const ray = new THREE.Raycaster();
  const pt = new THREE.Vector2();
  function pick(cx: number, cy: number): string | null {
    const rect = o.canvas.getBoundingClientRect();
    pt.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(pt, camera);
    let best: { d: number; id: string } | null = null;
    for (const e of entries) {
      if (!ray.ray.intersectsBox(boxOf(e))) continue;
      const hit = ray.intersectObject(e.group, true)[0];
      if (hit && (!best || hit.distance < best.d)) best = { d: hit.distance, id: e.id };
    }
    return best ? best.id : null;
  }

  let hovered: string | null = null;
  const baseEmissive = new WeakMap<THREE.Material, THREE.Color>();
  function tint(g: THREE.Object3D, on: boolean) {
    g.traverse((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m) return;
      for (const mat of Array.isArray(m) ? m : [m]) {
        const s = mat as THREE.MeshStandardMaterial;
        if (!s.emissive || s.emissiveMap) continue;
        if (!baseEmissive.has(mat)) baseEmissive.set(mat, s.emissive.clone());
        s.emissive.copy(baseEmissive.get(mat)!);
        if (on) s.emissive.add(HOVER_GLOW);
      }
    });
  }
  function setHover(id: string | null) {
    if (id === hovered) return;
    const prev = entries.find((e) => e.id === hovered);
    if (prev) tint(prev.group, false);
    hovered = id;
    const cur = entries.find((e) => e.id === id);
    if (cur) tint(cur.group, true);
    o.canvas.style.cursor = id ? "pointer" : "";
    for (const [pid, el] of o.proxies) el.classList.toggle("hover", pid === id);
    o.onHover(id);
  }

  let down: { x: number; y: number; px: number } | null = null;
  let pendingPick: { x: number; y: number } | null = null;
  o.canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, px: cam.px };
    cam.dragging = false;
    if (e.pointerType !== "mouse") o.canvas.setPointerCapture(e.pointerId);
  });
  o.canvas.addEventListener("pointermove", (e) => {
    if (down && e.pointerType !== "mouse" && panMax > 0) {
      const dx = e.clientX - down.x;
      if (Math.abs(dx) > 6) cam.dragging = true;
      if (cam.dragging) {
        const visW = 2 * DIST * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
        cam.px = THREE.MathUtils.clamp(down.px - (dx / W) * visW, -panMax, panMax);
        cam.tx = cam.px;
      }
      return;
    }
    if (e.pointerType === "mouse") {
      cam.ty = -((e.clientY / H) * 2 - 1);
      cam.tx = panMax > 0 ? ((e.clientX / W) * 2 - 1) * panMax : ((e.clientX / W) * 2 - 1) * 0.28;
      pendingPick = { x: e.clientX, y: e.clientY };
    }
  });
  o.canvas.addEventListener("pointerleave", () => {
    if (panMax === 0) {
      cam.tx = 0;
      cam.ty = 0;
    }
    pendingPick = null;
    setHover(null);
  });
  o.canvas.addEventListener("pointerup", (e) => {
    const moved = down ? Math.hypot(e.clientX - down.x, e.clientY - down.y) : 0;
    down = null;
    if (cam.dragging || moved > 8) return;
    if (zoomGoal || zoomT) return;
    const id = pick(e.clientX, e.clientY);
    if (id) o.onPick(id);
  });
  o.canvas.addEventListener("pointercancel", () => (down = null));

  /* ---------- proxies: real buttons laid over the 3D objects, for keyboard and screen readers ---------- */
  const corner = new THREE.Vector3();
  function placeProxies() {
    for (const e of entries) {
      const el = o.proxies.get(e.id);
      if (!el) continue;
      const box = boxOf(e);
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
        const sx = (corner.x * 0.5 + 0.5) * W;
        const sy = (-corner.y * 0.5 + 0.5) * H;
        x0 = Math.min(x0, sx);
        x1 = Math.max(x1, sx);
        y0 = Math.min(y0, sy);
        y1 = Math.max(y1, sy);
      }
      el.style.left = x0 + "px";
      el.style.top = y0 + "px";
      el.style.width = Math.max(8, x1 - x0) + "px";
      el.style.height = Math.max(8, y1 - y0) + "px";
    }
    needProxy = false;
  }
  for (const [id, el] of o.proxies) {
    el.addEventListener("focus", () => setHover(id));
    el.addEventListener("blur", () => setHover(null));
  }

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let t = 0;
  let intro = o.reduce ? 1 : 0;
  let introOn = o.reduce;
  const hops = new Map<string, number>();
  let frameNo = 0;
  let every = Q.every;
  let lastDraw = 0;
  let warm = 60;
  let acc = 0;
  let counted = 0;
  let level = 0;
  let motesOn = N > 0;
  let globeSpin = 0;
  let gShake = 0;
  let plShake = 0;
  let steamBoost = 0;
  const wobble = new Map<string, number>();
  /* laptop zoom: 0 is the room, 1 is the screen filling the view */
  let zoomT = 0;
  let zoomGoal = 0;
  let zoomFrom = 0;
  let zoomStart = 0;
  let zoomDone: (() => void) | null = null;
  const scrCenter = new THREE.Vector3();
  const scrNormal = new THREE.Vector3();
  const zoomPos = new THREE.Vector3();
  const roomPos = new THREE.Vector3();
  const roomLook = new THREE.Vector3();
  const curLook = new THREE.Vector3();
  function aimAtScreen() {
    lt.screen.updateWorldMatrix(true, false);
    lt.screen.getWorldPosition(scrCenter);
    scrNormal.set(0, 0, 1).transformDirection(lt.screen.matrixWorld);
    const s = lt.group.scale.x;
    const sw = lt.size[0] * s;
    const sh = lt.size[1] * s;
    const half = Math.tan((camera.fov * Math.PI) / 360);
    /* the screen fills about 78% of the view, whichever side runs out first */
    const d = Math.max(sh / (2 * half * 0.78), sw / (2 * half * camera.aspect * 0.86));
    zoomPos.copy(scrCenter).addScaledVector(scrNormal, d);
  }

  /** if the machine can't keep 45 fps, step quality down: resolution first, then shadows, then dust */
  function adapt(dt: number) {
    if (warm > 0) {
      warm--;
      return;
    }
    acc += dt;
    if (++counted < 50) return;
    const avg = acc / counted;
    acc = counted = 0;
    if (avg <= 0.022 || level >= 3) return;
    level++;
    if (level === 1) dpr = Math.max(1, dpr * 0.75);
    else if (level === 2) {
      shadowSize = Math.max(1024, shadowSize / 2);
      key.shadow.mapSize.set(shadowSize, shadowSize);
      key.shadow.map?.dispose();
      key.shadow.map = null;
      every = Math.min(4, every + 1);
    } else {
      dpr = 1;
      if (motesOn) {
        scene.remove(motes);
        motesOn = false;
      }
    }
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    needProxy = true;
    warm = 40;
    if (o.debug) console.info(`[room] slow frames (${Math.round(avg * 1000)}ms): quality level ${level}, dpr ${dpr}, shadow ${shadowSize}`);
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;
    frameNo++;
    if (introOn && intro < 1) {
      intro = Math.min(1, intro + dt / 2.4);
      renderer.toneMappingExposure = (0.35 + 0.57 * (1 - Math.pow(1 - intro, 3))) * (1 - 0.1 * nightT);
    } else if (intro >= 1) renderer.toneMappingExposure = 0.92 * (1 - 0.1 * nightT);

    const nightMoving = Math.abs(nightGoal - nightT) > 0.002;
    nightT += (nightGoal - nightT) * (1 - Math.exp(-dt * (o.reduce ? 40 : 2.4)));
    const n = nightT;
    if (nightMoving) {
      key.intensity = 3.4 * (1 - n) + 0.05 * n;
      hemi.intensity = 0.32 * (1 - n) + 0.1 * n;
      fill.intensity = 0.18 * (1 - n) + 0.5 * n;
      scene.environmentIntensity = 0.22 * (1 - n) + 0.07 * n;
      glow.intensity = 3.2 * (1 - n) + 1.2 * n;
      glow.color.lerpColors(warmGlow, coolGlow, n);
      lp.light.intensity = 1.1 + 6.4 * n;
      lp.light.distance = 2.6 + 2.6 * n;
      lp.light.castShadow = n > 0.03;
      glassMat.emissiveIntensity = 1.45 * (1 - n) + 0.5 * n;
      glassMat.emissive.lerpColors(white, dusk, n);
      (stars.material as THREE.PointsMaterial).opacity = n * 0.9;
      (moon.material as THREE.MeshBasicMaterial).opacity = n;
    }
    const k = 1 - Math.exp(-dt * 4.5);
    const px = cam.x;
    const py = cam.y;
    if (!o.reduce) {
      cam.x += (cam.tx - cam.x) * k;
      cam.y += (cam.ty - cam.y) * k;
    } else cam.x = cam.tx;
    const e = 1 - Math.pow(1 - intro, 3);
    const dolly = o.reduce ? 0 : (1 - e) * 1.1;
    roomPos.set(cam.x, CAM_Y + cam.y * 0.1 + (1 - e) * 0.12, DIST + dolly);
    roomLook.set(cam.x * 0.92, LOOK_Y + cam.y * 0.05, 0);
    if (zoomT !== zoomGoal) {
      const p = Math.min(1, (performance.now() - zoomStart) / (o.reduce ? 1 : 1150));
      zoomT = zoomFrom + (zoomGoal - zoomFrom) * p;
      if (p >= 1) {
        zoomT = zoomGoal;
        zoomDone?.();
        zoomDone = null;
      }
      needProxy = true;
    }
    if (zoomT > 0) {
      const z = zoomT < 0.5 ? 4 * zoomT ** 3 : 1 - (-2 * zoomT + 2) ** 3 / 2;
      camera.position.lerpVectors(roomPos, zoomPos, z);
      curLook.lerpVectors(roomLook, scrCenter, z);
      camera.lookAt(curLook);
    } else {
      camera.position.copy(roomPos);
      camera.lookAt(roomLook);
    }

    if (pendingPick) {
      setHover(zoomGoal || zoomT ? null : pick(pendingPick.x, pendingPick.y));
      pendingPick = null;
    }

    if (!o.reduce) {
      fe.update(t);
      la.update(t);
      pl.update(t);
      globeSpin *= Math.exp(-dt * 1.4);
      gShake *= Math.exp(-dt * 3.5);
      plShake *= Math.exp(-dt * 2.6);
      steamBoost *= Math.exp(-dt * 1.2);
      globeBall.rotation.y += (hovered === "exp" ? dt * 3 : dt * 0.15) + globeSpin * dt;
      gt.rotation.z = -0.07 + Math.sin(t * 46) * 0.035 * gShake;
      pl.group.rotation.z = Math.sin(t * 24) * 0.06 * plShake;
      mt.steam.forEach((sp, i) => {
        const p = (t * 0.28 + i / 3) % 1;
        sp.position.set(Math.sin(t * 1.3 + i * 2) * 0.012, 0.08 + p * 0.1, 0);
        (sp.material as THREE.SpriteMaterial).opacity = Math.sin(p * Math.PI) * (0.16 + steamBoost * 0.35);
        sp.scale.setScalar(0.04 + p * 0.05);
      });
      wobble.forEach((w, id) => {
        const en = entries.find((x) => x.id === id);
        if (!en) return;
        const p = (t - w) / 0.8;
        if (p >= 1) {
          wobble.delete(id);
          en.group.rotation.z = 0;
        } else en.group.rotation.z = Math.sin(p * Math.PI * 5) * 0.12 * (1 - p);
      });
      if (motesOn) {
        const pos = mg.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < N; i++) {
          pos.setY(i, ((pos.getY(i) + dt * (0.015 + (i % 5) * 0.004) - 0.4) % 3.1) + 0.4);
          pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * dt * 0.012);
        }
        pos.needsUpdate = true;
      }
    }

    for (const en of entries) {
      if (!en.base) en.base = en.group.position.clone();
      const target = hovered === en.id ? 1 : 0;
      en.hover += (target - en.hover) * (1 - Math.exp(-dt * 10));
      const b = en.base;
      let y = b.y;
      let z = b.z;
      if (en.mode === "lift") y += en.hover * 0.022;
      if (en.mode === "pull") z += en.hover * 0.07;
      const hp = hops.get(en.id);
      if (hp !== undefined) {
        const p = (t - hp) / 0.7;
        if (p >= 1) hops.delete(en.id);
        else y += Math.sin(p * Math.PI) * 0.22 * (1 - p * 0.35);
      }
      en.group.position.set(b.x, y, z);
    }
    if (needProxy || Math.abs(cam.x - px) > 0.0004 || Math.abs(cam.y - py) > 0.0004) placeProxies();

    /* shadows only need a refresh a few times a second: the light never moves */
    if (frameNo % every === 0 || nightMoving || frameNo < 4) renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    adapt(dt);
  }

  let running = true;
  const loop = (time: number) => {
    if (time - lastDraw < 14.5) return; // 60 fps ceiling: no point drawing twice per refresh on 120 Hz screens
    lastDraw = time;
    frame();
  };
  const start = () => {
    clock.getDelta();
    warm = 30;
    renderer.setAnimationLoop(loop);
  };

  resize();
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) renderer.setAnimationLoop(null);
    else if (running) start();
  });

  /* compile every shader before the first frame so nothing stutters when the room appears */
  o.onProgress(0.82);
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* compile on first render instead */
  }
  log("compiled");
  start();
  o.onProgress(0.92);
  await new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));
  await TX.photosIdle();
  o.onProgress(1);
  introOn = true;
  log("ready");

  const loadTower = () => {
    /* a real 3D model of the Eiffel Tower: "SM - Eiffel Tower" by Scott Marshall, CC BY 3.0 (poly.pizza) */
    new GLTFLoader().load(
      "room/eiffel.glb",
      (gltf) => {
        const m = gltf.scene;
        m.traverse((c) => {
          const mesh = c as THREE.Mesh;
          if (!mesh.isMesh) return;
          for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            const sm = mat as THREE.MeshStandardMaterial;
            if (!sm.color) continue;
            const { r: cr, g: cg, b: cb } = sm.color;
            if (Math.max(cr, cg, cb) - Math.min(cr, cg, cb) < 0.08 && (cr + cg + cb) / 3 > 0.2) {
              sm.color.set(0xdcbc90);
              sm.metalness = 0.3;
              sm.roughness = 0.5;
              sm.emissive.set(0x3a2616);
            }
          }
        });
        const model = bake(m); // hundreds of pieces become a few meshes
        const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
        model.scale.setScalar(0.62 / size.y);
        const bb = new THREE.Box3().setFromObject(model);
        model.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
        eif.add(model);
        eif.scale.setScalar(0.01);
        let s0 = performance.now();
        const grow = () => {
          const p = Math.min(1, (performance.now() - s0) / 450);
          eif.scale.setScalar(Math.max(0.01, 1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(grow);
          else {
            /* the click box was measured while the tower was still small: measure it again at full size */
            entries.find((x) => x.id === "paris")!.box = undefined;
            needProxy = true;
          }
        };
        s0 = performance.now();
        grow();
        entries.find((x) => x.id === "paris")!.box = undefined;
        needProxy = true;
        log("tower");
      },
      undefined,
      () => console.warn("Eiffel Tower model could not be loaded"),
    );
  };
  setTimeout(loadTower, 250);

  /* warm up the night-time lamp shadow in idle time, so the first switch to night is smooth */
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
  idle(
    () => {
      lp.light.castShadow = true;
      renderer.compileAsync(scene, camera).finally(() => {
        lp.light.castShadow = nightT > 0.03;
      });
    },
    { timeout: 6000 },
  );

  if (o.debug) {
    setTimeout(() => {
      const i = renderer.info;
      console.info("[room] tier", tier, "| draw calls", i.render.calls, "| triangles", i.render.triangles, "| geometries", i.memory.geometries, "| textures", i.memory.textures, "| dpr", dpr);
    }, 1500);
  }

  return {
    ready: Promise.resolve(),
    setPaused: (p) => {
      running = !p;
      if (p) renderer.setAnimationLoop(null);
      else start();
    },
    resize,
    hop: (id) => hops.set(id, t),
    setNight: (on) => (nightGoal = on ? 1 : 0),
    setHover,
    kick: (id) => {
      if (id === "exp") globeSpin = 14;
      else if (id === "music") gShake = 1;
      else if (id === "plant") plShake = 1;
      else if (id === "matcha") steamBoost = 1;
      else wobble.set(id, t);
    },
    zoom: (on) =>
      new Promise<void>((res) => {
        aimAtScreen();
        setHover(null);
        zoomDone?.();
        zoomFrom = zoomT;
        zoomGoal = on ? 1 : 0;
        zoomStart = performance.now();
        if (zoomT === zoomGoal) return res();
        zoomDone = res;
        if (!running) start();
      }),
    screenRect: () => {
      const s = lt.group.scale.x;
      const hw = (lt.size[0] * s) / 2;
      const hh = (lt.size[1] * s) / 2;
      lt.screen.updateWorldMatrix(true, false);
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        corner.set((cx * hw) / s, (cy * hh) / s, 0).applyMatrix4(lt.screen.matrixWorld).project(camera);
        const sx = (corner.x * 0.5 + 0.5) * W;
        const sy = (-corner.y * 0.5 + 0.5) * H;
        x0 = Math.min(x0, sx);
        x1 = Math.max(x1, sx);
        y0 = Math.min(y0, sy);
        y1 = Math.max(y1, sy);
      }
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    },
  };
}
