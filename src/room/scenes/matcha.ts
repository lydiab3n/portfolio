import { t } from "../../i18n";
import { sound } from "./audio";
import type { SceneDef, SceneFx } from "./overlay";

const mix = (a: string, b: string, k: number) => {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

type Milk = "none" | "oat" | "coco";
type Sweet = "none" | "honey" | "vanilla";

export function matchaScene(opts: { served: () => void }): SceneDef {
  const steps = [t("Scoop", "Doser"), t("Pour", "Verser"), t("Whisk", "Fouetter"), t("Finish", "Finir")];
  return {
    title: t("Make your own matcha", "Prépare ton matcha"),
    html: `
    <div class="mt">
      <ol class="mt-steps">${steps.map((s, i) => `<li data-i="${i}"><b>${i + 1}</b>${s}</li>`).join("")}</ol>
      <div class="mt-stage" id="mt-stage">
        <svg viewBox="0 0 400 290" id="mt-svg" role="img" aria-label="${t("A matcha bowl", "Un bol de matcha")}">
          <defs>
            <linearGradient id="mt-cer" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7ecdc"/><stop offset="1" stop-color="#d9c2a6"/></linearGradient>
            <radialGradient id="mt-foam" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#e6f1b8"/><stop offset="1" stop-color="#b5cf72"/></radialGradient>
            <clipPath id="mt-clip"><ellipse cx="200" cy="130" rx="132" ry="46"/></clipPath>
          </defs>
          <ellipse cx="200" cy="262" rx="140" ry="14" fill="rgba(0,0,0,.28)"/>
          <path d="M52 124 C52 226 112 268 200 268 C288 268 348 226 348 124 Z" fill="url(#mt-cer)"/>
          <path d="M150 262 Q200 276 250 262 L246 272 Q200 282 154 272Z" fill="#c9ae8e"/>
          <path d="M80 190 Q200 232 320 190" fill="none" stroke="#ec2a72" stroke-width="5" stroke-linecap="round" opacity=".55"/>
          <ellipse cx="200" cy="124" rx="148" ry="54" fill="#fbf2e4" stroke="#e4d0b6" stroke-width="3"/>
          <ellipse cx="200" cy="130" rx="132" ry="46" fill="#5b4631"/>
          <g clip-path="url(#mt-clip)">
            <g id="mt-powder"></g>
            <ellipse id="mt-liq" cx="200" cy="136" rx="0" ry="0" fill="#7ea03a"/>
            <ellipse id="mt-fm" cx="200" cy="130" rx="0" ry="0" fill="url(#mt-foam)"/>
            <g id="mt-bub"></g>
            <g id="mt-ice"></g>
          </g>
          <g id="mt-steam" opacity="0"><path d="M170 80 q-10 -18 0 -34 q10 -16 0 -32" /><path d="M205 76 q-10 -18 0 -34 q10 -16 0 -32" /><path d="M238 80 q-10 -18 0 -34 q10 -16 0 -32" /></g>
          <g id="mt-whisk" transform="translate(300 40)" opacity="0" style="pointer-events:none">
            <g transform="rotate(-24)"><rect x="-7" y="-60" width="14" height="62" rx="6" fill="#c9a064"/><path d="M-12 2 Q0 52 12 2 Q6 50 0 52 Q-6 50 -12 2Z" fill="#e5c58f" stroke="#b58a4e" stroke-width="2"/></g>
          </g>
        </svg>
        <p class="mt-say" id="mt-say" aria-live="polite"></p>
      </div>
      <div class="mt-acts" id="mt-acts"></div>
    </div>`,
    mount(root: HTMLElement, fx: SceneFx) {
      const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
      const stage = $<HTMLElement>("#mt-stage");
      const svg = $<SVGSVGElement>("#mt-svg");
      const liq = $<SVGEllipseElement>("#mt-liq");
      const fm = $<SVGEllipseElement>("#mt-fm");
      const bub = $<SVGGElement>("#mt-bub");
      const powder = $<SVGGElement>("#mt-powder");
      const ice = $<SVGGElement>("#mt-ice");
      const steam = $<SVGGElement>("#mt-steam");
      const whiskEl = $<SVGGElement>("#mt-whisk");
      const say = $<HTMLElement>("#mt-say");
      const acts = $<HTMLElement>("#mt-acts");
      const pills = [...root.querySelectorAll<HTMLElement>(".mt-steps li")];

      let step = 0;
      let scoops = 0;
      let water = 0;
      let foam = 0;
      let milk: Milk = "none";
      let sweet: Sweet = "none";
      let iced = false;
      let sips = 0;
      let holdTimer = 0;
      let lastWhisk = 0;
      let lx = 0;
      let ly = 0;
      let dragging = false;

      const talk = (s: string) => {
        say.textContent = s;
      };
      const bowlColor = () => {
        const deep = mix("#a6c558", "#4e7a1c", Math.min(1, (scoops - 1) / 2));
        return milk === "none" ? deep : mixRgb(deep, "#efe9c8", milk === "oat" ? 0.5 : 0.42);
      };
      /* mix an rgb() string with a hex */
      function mixRgb(rgb: string, hex: string, k: number) {
        const m = rgb.match(/\d+/g)!.map(Number);
        const h = [0, 1, 2].map((i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16));
        return `rgb(${m.map((v, i) => Math.round(v + (h[i] - v) * k)).join(",")})`;
      }
      const render = () => {
        pills.forEach((p, i) => {
          p.classList.toggle("on", i === Math.min(step, 3));
          p.classList.toggle("done", i < step);
        });
        /* the dry powder dots at the bottom of the bowl */
        let dots = "";
        for (let i = 0; i < scoops * 16; i++) {
          const a = i * 2.399;
          const r = 8 + ((i * 53) % 100) * 0.62;
          dots += `<circle cx="${200 + Math.cos(a) * r * 1.5}" cy="${134 + Math.sin(a) * r * 0.4}" r="${3 + (i % 3)}" fill="${i % 2 ? "#8fb84a" : "#a6cc5e"}"/>`;
        }
        powder.innerHTML = water > 0.2 ? "" : dots;
        const w = water === 0 ? 0 : 0.3 + 0.7 * water;
        liq.setAttribute("rx", String(132 * w));
        liq.setAttribute("ry", String(46 * w));
        liq.setAttribute("cy", String(136 - 6 * w));
        liq.setAttribute("fill", water > 0 ? bowlColor() : "#7ea03a");
        const f = foam * w;
        fm.setAttribute("rx", String(124 * f));
        fm.setAttribute("ry", String(41 * f));
        let b = "";
        for (let i = 0; i < Math.round(foam * 26); i++) {
          const a = i * 2.399;
          const r = 14 + ((i * 37) % 100) * 0.9;
          b += `<circle cx="${200 + Math.cos(a) * r * 1.2 * Math.min(1, w)}" cy="${130 + Math.sin(a) * r * 0.34 * Math.min(1, w)}" r="${2 + (i % 4)}" fill="#f4fad2" opacity=".7"/>`;
        }
        bub.innerHTML = b;
        steam.setAttribute("opacity", step >= 3 && !iced && water > 0 ? "1" : "0");
        whiskEl.setAttribute("opacity", step === 2 ? "1" : "0");
      };

      const label = (id: string, en: string, fr: string) => `<button type="button" class="mt-chip" data-set="${id}">${t(en, fr)}</button>`;
      const screen = () => {
        if (step === 0) {
          talk(scoops ? t("Nice. One scoop is gentle, two is balanced, three is strong.", "Bien. Une dose est douce, deux équilibrée, trois forte.") : t("Start with the powder. Tap the scoop.", "Commence par la poudre. Touche la cuillère."));
          acts.innerHTML = `<button type="button" class="gloss" data-do="scoop">${t("Add a scoop", "Ajouter une dose")}</button><button type="button" class="gloss pink" data-do="next" ${scoops ? "" : "disabled"}>${t("Add water", "Ajouter l’eau")} →</button>`;
        } else if (step === 1) {
          talk(water > 0.5 ? t("That’s enough. Time to whisk.", "C’est assez. Place au fouet.") : t("Hold the button to pour hot water.", "Maintiens le bouton pour verser l’eau chaude."));
          acts.innerHTML = `<button type="button" class="gloss" data-do="pour">${t("Hold to pour", "Maintenir pour verser")}</button><button type="button" class="gloss pink" data-do="next" ${water > 0.4 ? "" : "disabled"}>${t("Whisk", "Fouetter")} →</button>`;
        } else if (step === 2) {
          talk(foam >= 1 ? t("Cloud-level foam. Perfect.", "Une mousse parfaite, façon nuage.") : foam > 0.5 ? t("Keep going, it’s getting frothy.", "Continue, ça mousse.") : t("Whisk it fast: drag back and forth across the bowl.", "Fouette vite : fais des allers-retours sur le bol."));
          acts.innerHTML = `<button type="button" class="gloss" data-do="whisk">${t("Whisk", "Fouetter")}</button><button type="button" class="gloss pink" data-do="next" ${foam > 0.35 ? "" : "disabled"}>${t("Finish it", "Finaliser")} →</button>`;
        } else if (step === 3) {
          talk(t("Make it yours.", "Fais-en le tien."));
          acts.innerHTML = `
            <div class="mt-opts">
              <p>${t("Milk", "Lait")}</p><div role="group">${label("milk:none", "None", "Aucun")}${label("milk:oat", "Oat", "Avoine")}${label("milk:coco", "Coconut", "Coco")}</div>
              <p>${t("Sweet", "Sucré")}</p><div role="group">${label("sweet:none", "None", "Aucun")}${label("sweet:honey", "Honey", "Miel")}${label("sweet:vanilla", "Vanilla", "Vanille")}</div>
              <p>${t("Serve", "Servir")}</p><div role="group">${label("temp:hot", "Hot", "Chaud")}${label("temp:iced", "Iced", "Glacé")}</div>
            </div>
            <button type="button" class="gloss pink" data-do="serve">${t("Serve my matcha", "Servir mon matcha")}</button>`;
          markChips();
        } else {
          const strength = scoops === 1 ? t("gentle", "douce") : scoops === 2 ? t("balanced", "équilibrée") : t("strong", "forte");
          const foamTxt = foam >= 1 ? t("Cloud-level foam.", "Mousse parfaite, façon nuage.") : foam > 0.6 ? t("Nicely frothy.", "Bien mousseuse.") : t("A little flat, but cosy.", "Un peu plate, mais réconfortante.");
          const milkTxt = milk === "none" ? "matcha" : milk === "oat" ? t("oat matcha latte", "matcha latte à l’avoine") : t("coconut matcha latte", "matcha latte à la coco");
          const sw = sweet === "none" ? "" : sweet === "honey" ? t(", with honey", ", au miel") : t(", with vanilla", ", à la vanille");
          const drink = `${iced ? t("Iced ", "") : ""}${milkTxt}${iced ? t("", " glacé") : ""}`;
          talk(`${drink.charAt(0).toUpperCase() + drink.slice(1)}${sw}. ${t("Strength", "Intensité")}: ${strength}. ${foamTxt}`);
          acts.innerHTML = sips >= 3 ? `<button type="button" class="gloss pink" data-do="again">${t("Make another", "En refaire un")}</button>` : `<button type="button" class="gloss pink" data-do="sip">${t("Sip", "Siroter")}</button><button type="button" class="gloss" data-do="again">${t("Make another", "En refaire un")}</button>`;
        }
        render();
      };
      const markChips = () => {
        root.querySelectorAll<HTMLElement>(".mt-chip").forEach((c) => {
          const [k, v] = c.dataset.set!.split(":");
          const on = k === "milk" ? milk === v : k === "sweet" ? sweet === v : (v === "iced") === iced;
          c.classList.toggle("on", on);
          c.setAttribute("aria-pressed", String(on));
        });
      };
      const iceCubes = () => {
        ice.innerHTML = iced ? [[146, 104], [196, 112], [238, 100], [172, 128]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="26" height="26" rx="6" fill="#e9f6ff" opacity=".72" transform="rotate(${i * 17 - 20} ${x + 13} ${y + 13})"/>`).join("") : "";
      };
      const point = (e: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 290] as const;
      };
      const addFoam = (d: number, x: number, y: number) => {
        foam = Math.min(1, foam + d);
        const now = performance.now();
        if (now - lastWhisk > 90) {
          lastWhisk = now;
          sound.whisk();
        }
        if (foam >= 1 && !stage.dataset.perfect) {
          stage.dataset.perfect = "1";
          sound.chime(988);
          const r = svg.getBoundingClientRect();
          fx.burst(r.left + (x / 400) * r.width, r.top + (y / 290) * r.height, ["✦", "✧", "♥"], 7);
        }
        render();
        screenDebounce();
      };
      let sdb = 0;
      const screenDebounce = () => {
        clearTimeout(sdb);
        sdb = window.setTimeout(() => {
          if (step === 2) {
            talk(foam >= 1 ? t("Cloud-level foam. Perfect.", "Une mousse parfaite, façon nuage.") : foam > 0.5 ? t("Keep going, it’s getting frothy.", "Continue, ça mousse.") : say.textContent || "");
            const nx = acts.querySelector<HTMLButtonElement>("[data-do=next]");
            if (nx) nx.disabled = !(foam > 0.35);
          }
        }, 120);
      };

      /* drag the whisk across the bowl */
      svg.addEventListener("pointerdown", (e) => {
        if (step !== 2) return;
        dragging = true;
        svg.setPointerCapture(e.pointerId);
        [lx, ly] = point(e);
      });
      svg.addEventListener("pointermove", (e) => {
        if (step !== 2) return;
        const [x, y] = point(e);
        whiskEl.setAttribute("transform", `translate(${x} ${y - 4})`);
        if (!dragging) return;
        const inBowl = ((x - 200) / 150) ** 2 + ((y - 130) / 64) ** 2 < 1;
        const d = Math.hypot(x - lx, y - ly);
        lx = x;
        ly = y;
        if (inBowl && d > 1) {
          addFoam(d * 0.0021, x, y);
        }
      });
      svg.addEventListener("pointerup", () => (dragging = false));
      svg.addEventListener("pointercancel", () => (dragging = false));

      const pourOn = () => {
        clearInterval(holdTimer);
        holdTimer = window.setInterval(() => {
          water = Math.min(1, water + 0.035);
          sound.pour();
          render();
          if (water > 0.4) {
            const nx = acts.querySelector<HTMLButtonElement>("[data-do=next]");
            if (nx) nx.disabled = false;
          }
          if (water >= 1) pourOff();
        }, 110);
      };
      const pourOff = () => {
        clearInterval(holdTimer);
        if (step === 1) screen();
      };
      root.addEventListener("pointerdown", (e) => {
        if ((e.target as HTMLElement).closest("[data-do=pour]")) pourOn();
      });
      addEventListener("pointerup", pourOff);

      root.addEventListener("click", (e) => {
        const el = e.target as HTMLElement;
        const chip = el.closest<HTMLElement>("[data-set]");
        if (chip) {
          const [k, v] = chip.dataset.set!.split(":");
          if (k === "milk") milk = v as Milk;
          else if (k === "sweet") sweet = v as Sweet;
          else {
            iced = v === "iced";
            iceCubes();
          }
          sound.dab();
          markChips();
          render();
          return;
        }
        const b = el.closest<HTMLElement>("[data-do]");
        if (!b) return;
        const r = b.getBoundingClientRect();
        switch (b.dataset.do) {
          case "scoop":
            if (scoops >= 3) return talk(t("That’s plenty of matcha.", "Ça fait déjà beaucoup de matcha."));
            scoops++;
            sound.scoop();
            fx.burst(r.left + r.width / 2, r.top, ["✦", "·"], 4);
            return screen();
          case "pour":
            if (e instanceof MouseEvent && e.detail === 0) {
              water = Math.min(1, water + 0.14);
              sound.pour();
              screen();
            }
            return;
          case "whisk":
            if (e instanceof MouseEvent && e.detail === 0) addFoam(0.12, 200, 130);
            return;
          case "next":
            step++;
            if (step === 3) sound.chime(660);
            return screen();
          case "serve":
            step = 4;
            sips = 0;
            sound.chime(784);
            fx.burst(r.left + r.width / 2, r.top, ["♥", "✦", "✧"], 9);
            opts.served();
            return screen();
          case "sip": {
            sips++;
            sound.sip();
            fm.setAttribute("opacity", String(Math.max(0.2, 1 - sips * 0.25)));
            liq.setAttribute("ry", String(46 * (0.9 - sips * 0.2)));
            fx.burst(r.left + r.width / 2, r.top, ["♥"], 4);
            if (sips >= 3) fx.toast(t("Empty bowl. Best part of the day.", "Bol vide. Le meilleur moment de la journée."));
            return screen();
          }
          case "again":
            scoops = 0;
            water = 0;
            foam = 0;
            milk = "none";
            sweet = "none";
            iced = false;
            sips = 0;
            step = 0;
            delete stage.dataset.perfect;
            fm.setAttribute("opacity", "1");
            iceCubes();
            return screen();
        }
      });
      screen();
      return () => {
        clearInterval(holdTimer);
        clearTimeout(sdb);
        removeEventListener("pointerup", pourOff);
      };
    },
  };
}
