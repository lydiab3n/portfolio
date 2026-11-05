import * as THREE from "three";
import * as TX from "./textures";
import { shade, std } from "./props";

export interface CatRig {
  group: THREE.Group;
  update: (t: number) => void;
}

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const furMat = (base: string, stripe: string, seed: number, sheen: number) =>
  new THREE.MeshPhysicalMaterial({ map: TX.furStripes(base, stripe, seed), roughness: 0.92, sheen: 1, sheenColor: new THREE.Color(sheen), sheenRoughness: 0.65 });
const creamMat = () => new THREE.MeshPhysicalMaterial({ color: 0xf6e6cf, roughness: 0.95, sheen: 1, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.7 });

function sph(mat: THREE.Material, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0, parent?: THREE.Object3D) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 26), mat);
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  parent?.add(m);
  return m;
}

function ear(mat: THREE.Material, inner: THREE.Material, x: number, cut: boolean, parent: THREE.Object3D) {
  const g = new THREE.Group();
  const h = cut ? 0.07 : 0.078;
  const rt = cut ? 0.03 : 0.004;
  const e = new THREE.Mesh(new THREE.CylinderGeometry(rt, 0.046, h, 14), mat);
  e.scale.z = 0.55;
  const i = new THREE.Mesh(new THREE.CylinderGeometry(cut ? 0.021 : 0.002, 0.031, h * 0.82, 10), inner);
  i.scale.z = 0.4;
  i.position.set(0, -0.004, 0.013);
  g.add(e, i);
  if (cut) {
    /* the clipped tip is folded over towards the front and the side, so the cut shows */
    const flap = new THREE.Group();
    flap.position.set(0.004, h / 2 - 0.002, 0.004);
    flap.rotation.set(1.15, 0, -0.75);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.016, 16), mat);
    f.scale.z = 0.55;
    f.position.y = 0.006;
    const fi = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.004, 12), inner);
    fi.scale.z = 0.4;
    fi.position.set(0, 0.008, 0.012);
    flap.add(f, fi);
    g.add(flap);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.003, 6, 14, Math.PI), new THREE.MeshStandardMaterial({ color: 0x8a4a1c, roughness: 0.8 }));
    edge.rotation.x = Math.PI / 2;
    edge.position.set(0.004, h / 2 - 0.002, 0.004);
    g.add(edge);
  }
  g.position.set(x, 0.092 - (cut ? 0.004 : 0), -0.004);
  g.rotation.z = x < 0 ? 0.3 : cut ? -0.34 : -0.3;
  g.rotation.x = cut ? 0.1 : -0.1;
  parent.add(g);
  return g;
}

function whiskers(parent: THREE.Object3D, x: number, y: number, z: number, scale = 1) {
  const m = new THREE.MeshStandardMaterial({ color: 0xfff6ea, roughness: 0.6 });
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.0007, 0.0004, 0.085 * scale, 4), m);
      w.rotation.z = (Math.PI / 2) * side + (i - 1) * 0.16 * side;
      w.position.set(side * (x + 0.04 * scale), y - (i - 1) * 0.006, z);
      w.rotation.y = side * 0.25;
      w.userData.noShadow = true;
      parent.add(w);
    }
  }
}

/* Ferrari: orange and white, sitting up, one ear cut flat */
export function ferrari(): CatRig {
  const g = new THREE.Group();
  const orange = furMat("#ea9440", "#b8601c", 3, 0xffd2a0);
  const cream = creamMat();
  const pink = std(0xd98a96, 0.7);
  const body = sph(orange, 0.092, 0.185, 0.102, 0, 0.18, 0, g);
  sph(cream, 0.066, 0.135, 0.06, 0, 0.16, 0.074, g);
  sph(orange, 0.06, 0.092, 0.115, -0.082, 0.078, 0.01, g);
  sph(orange, 0.06, 0.092, 0.115, 0.082, 0.078, 0.01, g);
  for (const x of [-0.04, 0.04]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, 0.13, 8, 14), cream);
    leg.position.set(x, 0.1, 0.092);
    g.add(leg);
    sph(cream, 0.03, 0.02, 0.044, x, 0.02, 0.11, g);
  }
  const head = new THREE.Group();
  head.position.set(0, 0.385, 0.03);
  g.add(head);
  sph(orange, 0.104, 0.095, 0.094, 0, 0, 0, head);
  sph(cream, 0.05, 0.037, 0.04, 0, -0.03, 0.082, head);
  sph(pink, 0.009, 0.007, 0.007, 0, -0.008, 0.108, head);
  ear(orange, pink, -0.058, false, head);
  ear(orange, pink, 0.058, true, head);
  const dark = std(0xa85a1c, 0.8);
  sph(dark, 0.004, 0.017, 0.004, 0, 0.078, 0.064, head);
  sph(dark, 0.004, 0.014, 0.004, -0.024, 0.074, 0.06, head).rotation.z = 0.2;
  sph(dark, 0.004, 0.014, 0.004, 0.024, 0.074, 0.06, head).rotation.z = -0.2;
  const eyes = new THREE.Group();
  head.add(eyes);
  for (const x of [-0.044, 0.044]) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.014, 0.088);
    sph(std(0x8fae3a, 0.3), 0.0165, 0.0175, 0.009, 0, 0, 0, eye);
    sph(std(0x0b0807, 0.2), 0.0075, 0.0145, 0.006, 0, 0, 0.007, eye);
    sph(new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.003, 0.003, 0.003, 0.005, 0.006, 0.013, eye);
    eyes.add(eye);
  }
  whiskers(head, 0.02, -0.03, 0.09);
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0.058, 0.04, -0.06);
  g.add(tailPivot);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, 0, 0), V(0.07, 0.005, 0.02), V(0.13, 0.04, 0.08), V(0.14, 0.12, 0.13), V(0.11, 0.2, 0.12)]), 24, 0.015, 10), orange);
  tailPivot.add(tail);
  sph(dark, 0.016, 0.016, 0.016, 0.11, 0.205, 0.12, tailPivot);
  shade(g);
  return {
    group: g,
    update: (t) => {
      tailPivot.rotation.y = Math.sin(t * 1.5) * 0.28;
      tailPivot.rotation.z = Math.sin(t * 1.1 + 1) * 0.06;
      head.rotation.y = Math.sin(t * 0.45) * 0.22;
      head.rotation.z = Math.sin(t * 0.33) * 0.05;
      const ph = t % 5.6;
      eyes.scale.y = ph > 5.4 ? Math.max(0.08, 1 - Math.sin(((ph - 5.4) / 0.2) * Math.PI)) : 1;
      body.scale.y = 0.185 * (1 + Math.sin(t * 1.9) * 0.012);
    },
  };
}

/* Lamborghini: pale ginger, asleep on a pink flip-flop */
export function lamborghini(): CatRig {
  const g = new THREE.Group();
  const fur = furMat("#f1c590", "#d9a066", 8, 0xfff0dc);
  const cream = creamMat();
  const pink = std(0xd98a96, 0.7);
  const strap = std(0xc8507a, 0.4);
  const sole = new THREE.MeshPhysicalMaterial({ color: 0xe8749e, roughness: 0.4, clearcoat: 0.4 });

  const makeFlip = (x: number, z: number, ry: number) => {
    const f = new THREE.Group();
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, 0.065, 0.155, 0, Math.PI * 2, false, 0);
    const s = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 3, curveSegments: 28 }), sole);
    s.rotation.x = -Math.PI / 2;
    s.position.y = 0.002;
    f.add(s);
    for (const sx of [-1, 1]) {
      const c = new THREE.CatmullRomCurve3([V(0, 0.018, 0.09), V(sx * 0.02, 0.05, 0.03), V(sx * 0.05, 0.022, -0.02)]);
      f.add(new THREE.Mesh(new THREE.TubeGeometry(c, 12, 0.006, 8), strap));
    }
    f.position.set(x, 0, z);
    f.rotation.y = ry;
    return f;
  };
  g.add(makeFlip(-0.09, 0.07, -0.5));
  g.add(makeFlip(0.16, -0.12, 0.7));

  const body = sph(fur, 0.205, 0.108, 0.145, 0.02, 0.112, 0, g);
  sph(fur, 0.1, 0.09, 0.12, 0.12, 0.075, 0.03, g);
  const head = new THREE.Group();
  head.position.set(-0.17, 0.092, 0.12);
  head.rotation.set(0.05, 0.38, 0.1);
  g.add(head);
  sph(fur, 0.106, 0.092, 0.092, 0, 0, 0, head);
  sph(cream, 0.047, 0.034, 0.036, 0, -0.028, 0.076, head);
  sph(pink, 0.009, 0.007, 0.007, 0, -0.008, 0.1, head);
  ear(fur, pink, -0.062, false, head).scale.setScalar(0.92);
  ear(fur, pink, 0.062, false, head).scale.setScalar(0.92);
  const lid = std(0x6a4020, 0.6);
  for (const x of [-0.042, 0.042]) {
    const a = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0024, 6, 18, Math.PI), lid);
    a.rotation.z = Math.PI;
    a.position.set(x, 0.01, 0.083);
    head.add(a);
  }
  whiskers(head, 0.02, -0.03, 0.085, 0.95);
  sph(cream, 0.042, 0.026, 0.052, -0.1, 0.03, 0.2, g);
  sph(cream, 0.042, 0.026, 0.052, -0.04, 0.03, 0.205, g);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0.2, 0.06, 0.05), V(0.225, 0.045, 0.14), V(0.16, 0.038, 0.22), V(0.05, 0.036, 0.235), V(-0.03, 0.036, 0.222)]), 28, 0.021, 10), fur);
  g.add(tail);
  sph(cream, 0.024, 0.022, 0.024, -0.035, 0.036, 0.222, g);

  const zs: THREE.Sprite[] = [];
  for (let i = 0; i < 3; i++) {
    const tex = TX.canvasTex(64, 64, (c) => {
      c.fillStyle = "#f6ebe0";
      c.font = 'italic 600 46px "Playfair Display", Georgia, serif';
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("z", 32, 34);
    });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
    s.scale.setScalar(0.07 - i * 0.012);
    g.add(s);
    zs.push(s);
  }
  shade(g);
  return {
    group: g,
    update: (t) => {
      body.scale.y = 0.108 * (1 + Math.sin(t * 1.7) * 0.04);
      head.position.y = 0.092 + Math.sin(t * 1.7) * 0.003;
      zs.forEach((s, i) => {
        const p = (t * 0.28 + i / 3) % 1;
        s.position.set(-0.2 + p * 0.1, 0.22 + p * 0.22, 0.14);
        (s.material as THREE.SpriteMaterial).opacity = Math.sin(p * Math.PI) * 0.8;
      });
    },
  };
}
