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
const UPPER = "M322 592 C345 582 372 568 388 574 C396 577 404 577 412 574 C428 568 455 582 478 592 C455 604 430 608 400 608 C370 608 345 604 322 592Z";
const LOWER = "M322 592 C345 604 370 608 400 608 C430 608 455 604 478 592 C470 620 440 642 400 642 C360 642 330 620 322 592Z";
const FACE = "M400 235 C515 235 595 320 595 445 C595 570 530 665 400 708 C270 665 205 570 205 445 C205 320 285 235 400 235Z";

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
            <path d="M400 55 C240 55 150 180 150 340 Q120 400 150 460 Q180 520 140 580 Q110 640 150 700 Q185 760 140 820 Q110 880 150 960 L650 960 Q690 880 660 820 Q615 760 650 700 Q690 640 665 580 Q620 520 650 460 Q680 400 650 340 C650 180 560 55 400 55Z" fill="#3a2016"/>
            <path d="M40 960 C70 860 200 790 340 760 L460 760 C600 790 730 860 760 960Z" fill="#c98250"/>
            <path d="M335 640 H465 V745 C440 780 360 780 335 745Z" fill="#c07a48"/>
            <g clip-path="url(#mk-top)">
              <path d="M342 700 L400 790 L458 700 L525 790 L575 960 L225 960 L275 790Z" fill="#3fa9d9"/>
              <g fill="#fff" opacity=".9"><circle cx="300" cy="860" r="15"/><circle cx="360" cy="900" r="15"/><circle cx="420" cy="850" r="15"/><circle cx="490" cy="905" r="15"/><circle cx="545" cy="860" r="15"/><circle cx="240" cy="925" r="15"/><circle cx="600" cy="925" r="15"/><circle cx="395" cy="940" r="12"/></g>
            </g>
            <path d="M342 700 L400 790 L458 700" fill="none" stroke="#2d87b8" stroke-width="6" stroke-linejoin="round"/>
            <path d="M346 720 Q400 800 454 720" fill="none" stroke="#1a1214" stroke-width="5" stroke-linecap="round"/>
            <path d="M352 724 Q400 760 448 724" fill="none" stroke="#e0b25a" stroke-width="3" stroke-linecap="round"/>
            <path d="M400 784 q-9 6 -8 22 q2 18 8 26 q6 -8 8 -26 q1 -16 -8 -22z" fill="#fbf3e2" stroke="#e5d6b8" stroke-width="2"/>
            <circle cx="400" cy="868" r="14" fill="#f4a261" stroke="#e0b25a" stroke-width="5"/>
            <path d="M400 760 V854" stroke="#e0b25a" stroke-width="2.5"/>
            <path d="${FACE}" fill="url(#mk-skin)"/>
            <g clip-path="url(#mk-faceclip)"><g style="mix-blend-mode:multiply"><ellipse cx="300" cy="545" rx="48" ry="30" fill="#ff8a6a" opacity=".3" filter="url(#mk-soft)"/><ellipse cx="500" cy="545" rx="48" ry="30" fill="#ff8a6a" opacity=".3" filter="url(#mk-soft)"/><g id="mk-blush" filter="url(#mk-soft)"></g></g></g>
            ${eye(338, "mk-eye-l")}${eye(462, "mk-eye-r")}
            <path d="M290 410 Q336 372 386 398" fill="none" stroke="#2a140e" stroke-width="9" stroke-linecap="round"/>
            <path d="M414 398 Q464 372 510 410" fill="none" stroke="#2a140e" stroke-width="9" stroke-linecap="round"/>
            <path d="M412 490 Q424 530 414 546" fill="none" stroke="#b86f3e" stroke-width="9" stroke-linecap="round" opacity=".3"/>
            <path d="M386 550 Q400 562 414 550" fill="none" stroke="#a8612f" stroke-width="5" stroke-linecap="round"/>
            <g id="mk-mouth">
              <path d="${UPPER}" fill="#e0707f"/><path d="${LOWER}" fill="#ee8c96"/>
              <g clip-path="url(#mk-lipclip)"><g id="mk-paint"></g></g>
              <path d="M322 592 C345 604 455 604 478 592" fill="none" stroke="#9b3a4a" stroke-width="3" stroke-linecap="round" opacity=".7"/>
              <path d="M318 588 q-6 4 -6 12 M482 588 q6 4 6 12" fill="none" stroke="#c07a48" stroke-width="3" stroke-linecap="round" opacity=".6"/>
              <ellipse cx="386" cy="622" rx="22" ry="6" fill="#fff" opacity=".5"/>
              <g id="mk-gloss" opacity="0"><ellipse cx="372" cy="582" rx="14" ry="4" fill="#fff" opacity=".7"/><ellipse cx="432" cy="624" rx="14" ry="5" fill="#fff" opacity=".7"/><ellipse cx="420" cy="598" rx="20" ry="3" fill="#fff" opacity=".4"/></g>
            </g>
            <path d="M300 262 C240 300 212 380 206 440 Q190 520 215 580 Q240 640 205 700 Q170 760 205 820 Q230 890 195 960 L300 960 Q270 890 292 830 Q325 770 290 710 Q255 650 280 590 Q300 530 275 470 Q262 410 285 360 Q305 310 345 275Z" fill="#4a2a1c"/>
            <path d="M500 262 C560 300 588 380 594 440 Q610 520 585 580 Q560 640 595 700 Q630 760 595 820 Q570 890 605 960 L500 960 Q530 890 508 830 Q475 770 510 710 Q545 650 520 590 Q500 530 525 470 Q538 410 515 360 Q495 310 455 275Z" fill="#4a2a1c"/><path d="M215 440 C205 300 290 222 400 222 C510 222 595 300 585 440 C570 350 520 298 440 288 C410 283 385 284 365 290 C290 300 232 350 215 440Z" fill="#4a2a1c"/>
            <g fill="none" stroke="#c98a4b" stroke-linecap="round" opacity=".95"><path d="M330 270 C290 305 268 355 268 420 Q262 480 282 540 Q296 590 270 650" stroke-width="13"/><path d="M300 285 C270 325 252 380 252 440" stroke-width="7"/><path d="M468 284 C520 316 538 370 534 430" stroke-width="9"/><path d="M215 700 Q190 760 220 820" stroke-width="9"/><path d="M590 700 Q612 760 585 820" stroke-width="8"/></g>
            <g fill="none" stroke="#6a3d28" stroke-linecap="round" opacity=".7"><path d="M360 252 C320 280 296 330 292 400" stroke-width="3"/><path d="M430 262 C480 300 510 350 515 420" stroke-width="3"/></g>
          </g></g>
          <text id="mk-heart" x="400" y="560" text-anchor="middle" font-size="64" fill="#ff4fa3" opacity="0">♥</text>
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
      for (let x = 318; x <= 482; x += 4)
        for (let y = 568; y <= 646; y += 4) {
          pt.x = x;
          pt.y = y;
          if (upper.isPointInFill(pt) || lower.isPointInFill(pt)) cells.push([x, y]);
        }
      const covered = new Set<number>();
      const mark = (x: number, y: number) => {
        cells.forEach(([cx, cy], i) => {
          if (Math.hypot(cx - x, cy - y) < 10) covered.add(i);
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
          cur.setAttribute("stroke-width", "20");
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
