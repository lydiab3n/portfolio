import { t } from "../../i18n";
import { sound } from "./audio";
import type { SceneDef, SceneFx } from "./overlay";

const LIPS = () => [
  { n: t("Strawberry", "Fraise"), c: "#ec2a72" },
  { n: t("Classic red", "Rouge classique"), c: "#c4122f" },
  { n: t("Nude rose", "Rose nude"), c: "#c98a86" },
  { n: t("Berry", "Baie"), c: "#8e1f5a" },
  { n: t("Coral", "Corail"), c: "#ff6b57" },
  { n: t("Plum", "Prune"), c: "#5e1a3c"},
  { n: t("Brown nude", "Nude brun"), c: "#9a5a4a" },
  { n: t("Baby pink", "Rose bonbon"), c: "#ff9cc0" },
];
const BLUSH = () => [
  { n: t("Peach", "Pêche"), c: "#ff9a7a" },
  { n: t("Rose", "Rose"), c: "#ff6f9f" },
  { n: t("Berry blush", "Blush baie"), c: "#c0396b" },
];

/* A cartoon portrait of Lydia drawn with shapes, in an 800 x 960 space. */
/* the lips are drawn once at 1:1, then shrunk to fit the CSS portrait (LS) and centred on its mouth */
const LS = 0.66;
const LCY = 594;
const sc = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(400 + (+x - 400) * LS).toFixed(1)} ${(LCY + (+y - 618) * LS).toFixed(1)}`);
const UPPER = sc("M316 598 C338 586 366 560 388 567 C396 570 404 570 412 567 C434 560 462 586 484 598 C458 612 430 614 400 614 C370 614 342 612 316 598Z");
const LOWER = sc("M316 598 C342 612 370 614 400 614 C430 614 458 612 484 598 C478 640 444 670 400 670 C356 670 322 640 316 598Z");
const MOUTHLINE = sc("M316 598 C345 612 455 612 484 598");
const FACE = "M256 496 a144 192 0 1 0 288 0 a144 192 0 1 0 -288 0Z";

function eye(cx: number, id: string) {
  const almond = `M${cx - 42} 456 Q${cx} 414 ${cx + 42} 456 Q${cx} 488 ${cx - 42} 456Z`;
  const flick = cx < 400 ? -1 : 1;
  return `
    <g>
      <clipPath id="${id}"><path d="${almond}"/></clipPath>
      <path d="${almond}" fill="#fff8f2"/>
      <g clip-path="url(#${id})"><circle cx="${cx}" cy="456" r="25" fill="#4a2a1c"/><circle cx="${cx}" cy="456" r="12" fill="#140a08"/><circle cx="${cx + 9}" cy="446" r="7" fill="#fff"/><circle cx="${cx - 9}" cy="466" r="3" fill="#fff" opacity=".8"/></g>
      <path d="M${cx - 46} 460 Q${cx} 408 ${cx + 46} 458" fill="none" stroke="#1a0d10" stroke-width="8.5" stroke-linecap="round"/>
      <path d="M${cx + flick * 44} 458 q${flick * 11} -3 ${flick * 15} -15" fill="none" stroke="#1a0d10" stroke-width="6" stroke-linecap="round"/>
      <path d="M${cx - 28} 477 Q${cx} 490 ${cx + 28} 477" fill="none" stroke="#a8683c" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
    </g>`;
}

export function makeupScene(): SceneDef {
  const lips = LIPS();
  const blush = BLUSH();
  const sw = (list: { n: string; c: string }[], kind: string) => list.map((s, i) => `<button type="button" class="mk-sw${kind === "lip" && i === 0 ? " on" : ""}" data-kind="${kind}" data-c="${s.c}" style="--c:${s.c}" aria-label="${s.n}" title="${s.n}"></button>`).join("");
  return {
    title: t("Try on some makeup", "Un peu de maquillage"),
    html: `
    <div class="mk">
      <p class="gt-hint" id="mk-say" aria-live="polite">${t("Pick a shade, then drag across her lips. Blush goes on the cheeks.", "Choisis une teinte, puis glisse sur ses lèvres. Le blush se pose sur les joues.")}</p>
      <div class="mk-stage">
        <svg viewBox="0 0 800 960" id="mk-svg" role="img" aria-label="${t("A portrait of Lydia", "Un portrait de Lydia")}">
          <defs>
            <linearGradient id="mk-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3cf"/><stop offset="1" stop-color="#f06292"/></linearGradient>
            <linearGradient id="mk-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0a36c"/><stop offset="1" stop-color="#c98250"/></linearGradient>
            <clipPath id="mk-frame"><rect width="800" height="960" rx="52"/></clipPath>
            <clipPath id="mk-top"><path d="M342 700 L400 790 L458 700 L525 790 L575 960 L225 960 L275 790Z"/></clipPath>
            <clipPath id="mk-lipclip"><path d="${UPPER}"/><path d="${LOWER}"/></clipPath>
            <clipPath id="mk-faceclip"><path d="${FACE}"/></clipPath>
            <filter id="mk-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>
            <filter id="mk-feather" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2"/></filter>
          </defs>
          <rect width="800" height="960" rx="52" fill="url(#mk-bg)"/>
          <g clip-path="url(#mk-frame)"><g id="mk-head">
            <foreignObject x="0" y="160" width="800" height="800"><div xmlns="http://www.w3.org/1999/xhtml" class="cssav">   <div class="hair-back"></div>   <div class="strand l2"></div><div class="strand r2"></div>   <div class="strand l"></div><div class="strand r"></div>   <div class="shoulders"></div>   <div class="neck"></div>   <div class="head">     <div class="left-ear ear"><div class="stud"></div></div>     <div class="right-ear ear"><div class="stud"></div></div>     <div class="brow-left brow"></div><div class="brow-right brow"></div>     <div class="eye-left eye"><div class="iris"></div></div>     <div class="eye-right eye"><div class="iris"></div></div>     <div class="nose"></div>     <div class="blush l"></div><div class="blush r"></div>     <div class="hair-top"></div>     <div class="hl a"></div><div class="hl b"></div>   </div></div></foreignObject>
            <g clip-path="url(#mk-faceclip)"><g style="mix-blend-mode:multiply"><g id="mk-blush" filter="url(#mk-soft)"></g></g></g>
            <g id="mk-mouth">
              <path d="${UPPER}" fill="#e0707f"/><path d="${LOWER}" fill="#ee8c96"/>
              <g clip-path="url(#mk-lipclip)"><g id="mk-paint"></g></g>
              <path d="${MOUTHLINE}" fill="none" stroke="#9b3a4a" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>
              <ellipse cx="389.4" cy="608.5" rx="17" ry="5" fill="#fff" opacity=".5"/>
              <g id="mk-gloss" opacity="0"><ellipse cx="378.9" cy="570.2" rx="10.5" ry="2.6" fill="#fff" opacity=".7"/><ellipse cx="423.8" cy="611.2" rx="10.5" ry="4" fill="#fff" opacity=".7"/><ellipse cx="413.2" cy="584.8" rx="14.5" ry="2" fill="#fff" opacity=".4"/></g>
            </g>
          </g></g>
          <text id="mk-heart" x="400" y="610" text-anchor="middle" font-size="64" fill="#ff4fa3" opacity="0">♥</text>
          <rect id="mk-hit" width="800" height="960" fill="transparent" style="cursor:crosshair;touch-action:none"/>
        </svg>
      </div>
      <div class="mk-tray">
        <div class="mk-group"><span>${t("Lipstick", "Rouge à lèvres")}</span><div role="group">${sw(lips, "lip")}</div></div>
        <div class="mk-group"><span>${t("Blush", "Blush")}</span><div role="group">${sw(blush, "blush")}</div></div>
        <div class="gt-row">
          <button type="button" class="gloss" data-mk="gloss" aria-pressed="false">${t("Gloss", "Gloss")}</button>
          <button type="button" class="gloss pink" data-mk="kiss">${t("Blow a kiss", "Envoyer un bisou")}</button>
          <button type="button" class="gloss" data-mk="blot">${t("Blot lips", "Effacer les lèvres")}</button>
          <button type="button" class="gloss" data-mk="reset">${t("Start over", "Recommencer")}</button>
        </div>
      </div>
    </div>`,
    mount(root: HTMLElement, fx: SceneFx) {
      const svg = root.querySelector<SVGSVGElement>("#mk-svg")!;
      const hit = root.querySelector<SVGRectElement>("#mk-hit")!;
      const paint = root.querySelector<SVGGElement>("#mk-paint")!;
      const blushG = root.querySelector<SVGGElement>("#mk-blush")!;
      const gloss = root.querySelector<SVGGElement>("#mk-gloss")!;
      const say = root.querySelector<HTMLElement>("#mk-say")!;
      const upper = svg.querySelector<SVGPathElement>("#mk-lipclip path:nth-child(1)")!;
      const lower = svg.querySelector<SVGPathElement>("#mk-lipclip path:nth-child(2)")!;
      let color = lips[0].c;
      let kind: "lip" | "blush" = "lip";
      let down = false;
      let cur: SVGPathElement | null = null;
      let last: [number, number] | null = null;
      let celebrated = false;
      let glossOn = false;
      let kissTimer = 0;
      let dabAt = 0;

      /* a grid of points inside the lips, so we know how much of them is covered */
      const cells: [number, number][] = [];
      const pt = svg.createSVGPoint();
      const bb = upper.getBBox();
      const bl = lower.getBBox();
      for (let x = Math.floor(bb.x); x <= bb.x + bb.width; x += 3)
        for (let y = Math.floor(bb.y); y <= bl.y + bl.height; y += 3) {
          pt.x = x;
          pt.y = y;
          if (upper.isPointInFill(pt) || lower.isPointInFill(pt)) cells.push([x, y]);
        }
      const covered = new Set<number>();
      const mark = (x: number, y: number) => {
        cells.forEach(([cx, cy], i) => {
          if (Math.hypot(cx - x, cy - y) < 8) covered.add(i);
        });
      };
      const coverage = () => (cells.length ? covered.size / cells.length : 0);

      const toSvg = (e: PointerEvent): [number, number] => {
        const m = svg.getScreenCTM()!.inverse();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const p = pt.matrixTransform(m);
        return [p.x, p.y];
      };

      const kiss = (px?: number, py?: number) => {
        clearTimeout(kissTimer);
        svg.classList.add("kiss");
        sound.kiss();
        const r = svg.getBoundingClientRect();
        fx.burst(px ?? r.left + r.width / 2, py ?? r.top + r.height * 0.66, ["♥", "💋", "♥", "✦"], 9);
        const h = svg.querySelector<SVGTextElement>("#mk-heart")!;
        h.animate([{ opacity: 1, transform: "translateY(0) scale(.6)" }, { opacity: 0, transform: "translateY(-70px) scale(1.4)" }], { duration: 1000, easing: "ease-out" });
        kissTimer = window.setTimeout(() => svg.classList.remove("kiss"), 1200);
      };

      const begin = (e: PointerEvent) => {
        down = true;
        hit.setPointerCapture(e.pointerId);
        const [x, y] = toSvg(e);
        cur = document.createElementNS("http://www.w3.org/2000/svg", "path");
        cur.setAttribute("fill", "none");
        cur.setAttribute("stroke", color);
        cur.setAttribute("stroke-linecap", "round");
        cur.setAttribute("stroke-linejoin", "round");
        if (kind === "lip") {
          cur.setAttribute("stroke-width", "15");
          cur.setAttribute("opacity", "0.96");
          paint.appendChild(cur);
        } else {
          cur.setAttribute("stroke-width", "90");
          cur.setAttribute("opacity", "0.42");
          blushG.appendChild(cur);
        }
        cur.setAttribute("d", `M${x} ${y} L${x + 0.1} ${y}`);
        last = [x, y];
        if (kind === "lip") mark(x, y);
      };
      const move = (e: PointerEvent) => {
        if (!down || !cur || !last) return;
        const [x, y] = toSvg(e);
        cur.setAttribute("d", (cur.getAttribute("d") ?? "") + ` L${x.toFixed(1)} ${y.toFixed(1)}`);
        if (kind === "lip") {
          const steps = Math.ceil(Math.hypot(x - last[0], y - last[1]) / 4);
          for (let i = 1; i <= steps; i++) mark(last[0] + ((x - last[0]) * i) / steps, last[1] + ((y - last[1]) * i) / steps);
        }
        last = [x, y];
        const now = performance.now();
        if (now - dabAt > 140) {
          dabAt = now;
          sound.dab();
        }
      };
      const end = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        cur = null;
        if (kind === "lip" && !celebrated && coverage() >= 0.78) {
          celebrated = true;
          say.textContent = t("Gorgeous. That shade is so her.", "Magnifique. Cette teinte lui va trop bien.");
          kiss(e.clientX, e.clientY);
        }
      };
      hit.addEventListener("pointerdown", begin);
      hit.addEventListener("pointermove", move);
      hit.addEventListener("pointerup", end);
      hit.addEventListener("pointercancel", () => (down = false));

      root.addEventListener("click", (e) => {
        const el = e.target as HTMLElement;
        const sw = el.closest<HTMLElement>(".mk-sw");
        if (sw) {
          color = sw.dataset.c!;
          kind = sw.dataset.kind as "lip" | "blush";
          root.querySelectorAll(".mk-sw").forEach((b) => b.classList.toggle("on", b === sw));
          sound.dab();
          if (kind === "lip") celebrated = false;
          say.textContent = kind === "lip" ? t("Now drag across her lips.", "Maintenant, glisse sur ses lèvres.") : t("Brush it onto her cheeks.", "Pose-le sur ses joues.");
          return;
        }
        const b = el.closest<HTMLElement>("[data-mk]");
        if (!b) return;
        switch (b.dataset.mk) {
          case "gloss":
            glossOn = !glossOn;
            gloss.setAttribute("opacity", glossOn ? "1" : "0");
            b.setAttribute("aria-pressed", String(glossOn));
            b.classList.toggle("on", glossOn);
            sound.dab();
            break;
          case "kiss": {
            const r = b.getBoundingClientRect();
            kiss(r.left + r.width / 2, r.top);
            break;
          }
          case "blot":
            paint.innerHTML = "";
            covered.clear();
            celebrated = false;
            sound.dab();
            break;
          case "reset":
            paint.innerHTML = "";
            blushG.innerHTML = "";
            covered.clear();
            celebrated = false;
            glossOn = false;
            gloss.setAttribute("opacity", "0");
            root.querySelector('[data-mk="gloss"]')?.classList.remove("on");
            sound.dab();
            break;
        }
      });
      return () => clearTimeout(kissTimer);
    },
  };
}
