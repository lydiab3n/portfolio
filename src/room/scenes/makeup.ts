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

const UPPER = "M142 318 C160 300 182 292 200 303 C218 292 240 300 258 318 C238 324 220 326 200 326 C180 326 162 324 142 318Z";
const LOWER = "M142 318 C162 324 180 326 200 326 C220 326 238 324 258 318 C246 344 224 352 200 352 C176 352 154 344 142 318Z";
const FACE = "M104 215 C104 125 148 104 200 104 C252 104 296 125 296 215 C296 296 258 372 200 378 C142 372 104 296 104 215Z";

function eye(cx: number) {
  return `
    <g>
      <ellipse cx="${cx}" cy="222" rx="25" ry="13" fill="#fff8f4"/>
      <circle cx="${cx}" cy="222" r="10.5" fill="#4a2a1c"/>
      <circle cx="${cx}" cy="222" r="5" fill="#140a08"/>
      <circle cx="${cx + 4}" cy="218" r="3" fill="#fff"/>
      <ellipse class="mk-lid" cx="${cx}" cy="222" rx="26" ry="14" fill="#eab08c"/>
      <path d="M${cx - 27} 224 Q${cx} 200 ${cx + 27} 224" fill="none" stroke="#1a0d10" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M${cx + (cx < 200 ? -26 : 26)} 223 l${cx < 200 ? -6 : 6} -4" stroke="#1a0d10" stroke-width="3" stroke-linecap="round"/>
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
        <svg viewBox="0 0 400 480" id="mk-svg" role="img" aria-label="${t("An illustrated portrait of Lydia", "Un portrait illustré de Lydia")}">
          <defs>
            <linearGradient id="mk-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9cc0"/><stop offset="1" stop-color="#ec2a72"/></linearGradient>
            <clipPath id="mk-frame"><rect width="400" height="480" rx="26"/></clipPath>
            <clipPath id="mk-lipclip"><path d="${UPPER}"/><path d="${LOWER}"/></clipPath>
            <clipPath id="mk-faceclip"><path d="${FACE}"/></clipPath>
            <filter id="mk-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
          </defs>
          <rect width="400" height="480" rx="26" fill="url(#mk-bg)"/>
          <g clip-path="url(#mk-frame)"><g id="mk-head">
            <path d="M70 200 C40 330 50 480 90 560 L310 560 C350 480 360 330 330 200 C330 80 270 36 200 36 C130 36 70 80 70 200Z" fill="#24121b"/>
            <path d="M40 560 L60 480 C70 420 150 396 200 396 C250 396 330 420 340 480 L360 560Z" fill="#fff4f7"/>
            <path d="M172 356 H228 V412 C218 426 182 426 172 412Z" fill="#dd9d78"/>
            <path d="${FACE}" fill="#eab08c"/>
            <g clip-path="url(#mk-faceclip)"><ellipse cx="140" cy="276" rx="26" ry="16" fill="#ff7a9c" opacity=".16" filter="url(#mk-soft)"/><ellipse cx="260" cy="276" rx="26" ry="16" fill="#ff7a9c" opacity=".16" filter="url(#mk-soft)"/><g id="mk-blush" filter="url(#mk-soft)"></g></g>
            <path d="M104 250 C102 290 112 330 130 352" fill="none" stroke="#d99870" stroke-width="3" opacity=".35" stroke-linecap="round"/>
            ${eye(160)}${eye(240)}
            <path d="M132 194 Q160 178 188 191" fill="none" stroke="#24121b" stroke-width="7" stroke-linecap="round"/>
            <path d="M212 191 Q240 178 268 194" fill="none" stroke="#24121b" stroke-width="7" stroke-linecap="round"/>
            <path d="M194 262 Q200 272 208 262" fill="none" stroke="#c98f6b" stroke-width="3.5" stroke-linecap="round"/>
            <g id="mk-mouth">
              <path d="${UPPER}" fill="#cf8a86"/><path d="${LOWER}" fill="#d99a96"/>
              <g clip-path="url(#mk-lipclip)"><g id="mk-paint"></g></g>
              <path d="M142 318 C165 324 235 324 258 318" fill="none" stroke="#7a3a38" stroke-width="2" opacity=".55" stroke-linecap="round"/>
              <g id="mk-gloss" opacity="0"><ellipse cx="186" cy="337" rx="16" ry="4.5" fill="#fff" opacity=".6"/><ellipse cx="226" cy="334" rx="8" ry="3" fill="#fff" opacity=".45"/></g>
            </g>
            <path d="M200 92 C156 96 112 132 100 222 C128 170 160 138 200 118Z" fill="#24121b"/>
            <path d="M200 92 C244 96 288 132 300 222 C272 170 240 138 200 118Z" fill="#24121b"/>
            <path d="M104 215 C94 280 100 340 116 396 L138 396 C124 338 116 280 120 226Z" fill="#24121b"/>
            <path d="M296 215 C306 280 300 340 284 396 L262 396 C276 338 284 280 280 226Z" fill="#24121b"/>
            <circle cx="104" cy="268" r="8" fill="none" stroke="#f0c14a" stroke-width="3"/><circle cx="296" cy="268" r="8" fill="none" stroke="#f0c14a" stroke-width="3"/>
          </g></g>
          <text id="mk-heart" x="200" y="300" text-anchor="middle" font-size="34" fill="#ff4fa3" opacity="0">♥</text>
          <rect id="mk-hit" width="400" height="480" fill="transparent" style="cursor:crosshair;touch-action:none"/>
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
      const upper = svg.querySelector<SVGPathElement>("#mk-mouth path:nth-child(1)")!;
      const lower = svg.querySelector<SVGPathElement>("#mk-mouth path:nth-child(2)")!;
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
      for (let x = 140; x <= 260; x += 5)
        for (let y = 294; y <= 352; y += 5) {
          pt.x = x;
          pt.y = y;
          if (upper.isPointInFill(pt) || lower.isPointInFill(pt)) cells.push([x, y]);
        }
      const covered = new Set<number>();
      const mark = (x: number, y: number) => {
        cells.forEach(([cx, cy], i) => {
          if (Math.hypot(cx - x, cy - y) < 12) covered.add(i);
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
          cur.setAttribute("stroke-width", "22");
          cur.setAttribute("opacity", "0.94");
          paint.appendChild(cur);
        } else {
          cur.setAttribute("stroke-width", "46");
          cur.setAttribute("opacity", "0.3");
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
          const steps = Math.ceil(Math.hypot(x - last[0], y - last[1]) / 5);
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
