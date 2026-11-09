import { t } from "../../i18n";
import { CATS } from "../chat";
import { sound } from "./audio";
import type { SceneDef, SceneFx } from "./overlay";

type CatId = "ferrari" | "lambo";

const LOOK = {
  ferrari: { base: "#ee8a35", stripe: "#c4631a", white: "#fff2e2" },
  lambo: { base: "#f3c58f", stripe: "#e1a56c", white: "#fff6ea" },
};

function catSvg(id: CatId) {
  const c = LOOK[id];
  const ferrari = id === "ferrari";
  return `
  <svg viewBox="0 0 400 350" class="pc-cat" role="img" aria-label="${ferrari ? t("Ferrari, an orange and white cat with a cut ear", "Ferrari, un chat orange et blanc à l’oreille coupée") : t("Lamborghini, a pale ginger cat on a pink flip-flop", "Lamborghini, une chatte gingembre claire sur une tong rose")}">
    ${ferrari ? "" : `<g><ellipse cx="200" cy="332" rx="112" ry="15" fill="#ff7fb0"/><path d="M150 332 Q200 300 250 332" fill="none" stroke="#ff4f93" stroke-width="7" stroke-linecap="round"/></g>`}
    <ellipse cx="200" cy="338" rx="${ferrari ? 120 : 100}" ry="8" fill="rgba(0,0,0,.18)" ${ferrari ? "" : 'opacity="0"'}/>
    <g class="pc-tail"><path d="M300 270 C376 262 392 196 348 156" fill="none" stroke="${c.base}" stroke-width="30" stroke-linecap="round"/><path d="M345 168 C360 188 360 214 348 230" fill="none" stroke="${c.stripe}" stroke-width="8" stroke-linecap="round" opacity=".5"/></g>
    <ellipse cx="196" cy="262" rx="124" ry="72" fill="${c.base}"/>
    <path d="M110 240 q12 -4 18 10 M120 270 q14 -6 20 8 M262 238 q-12 -4 -18 10" fill="none" stroke="${c.stripe}" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <ellipse cx="196" cy="282" rx="52" ry="46" fill="${c.white}"/>
    <ellipse cx="156" cy="322" rx="30" ry="17" fill="${c.white}"/><ellipse cx="238" cy="322" rx="30" ry="17" fill="${c.white}"/>
    <g class="pc-head">
      <path d="M112 118 L116 44 L170 90Z" fill="${c.base}"/><path d="M123 106 L125 66 L155 92Z" fill="#f6a1a8"/>
      ${
        ferrari
          ? `<path d="M280 118 L276 66 L256 60 L246 74 L224 90Z" fill="${c.base}"/><path d="M270 106 L268 76 L254 76 L244 90Z" fill="#f6a1a8"/><path d="M276 66 L256 60 L246 74" fill="none" stroke="#b25518" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<path d="M280 118 L276 44 L222 90Z" fill="${c.base}"/><path d="M269 106 L267 66 L237 92Z" fill="#f6a1a8"/>`
      }
      <ellipse cx="196" cy="168" rx="96" ry="80" fill="${c.base}"/>
      <path d="M172 100 q6 18 -2 34 M196 96 v36 M220 100 q-6 18 2 34" fill="none" stroke="${c.stripe}" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="196" cy="198" rx="40" ry="28" fill="${c.white}"/>
      <g class="pc-open"><ellipse cx="156" cy="164" rx="15" ry="18" fill="#f2b53a"/><ellipse cx="236" cy="164" rx="15" ry="18" fill="#f2b53a"/><ellipse cx="156" cy="164" rx="5" ry="14" fill="#1c1210"/><ellipse cx="236" cy="164" rx="5" ry="14" fill="#1c1210"/><circle cx="160" cy="157" r="4" fill="#fff"/><circle cx="240" cy="157" r="4" fill="#fff"/></g>
      <g class="pc-happy"><path d="M138 168 Q156 148 174 168" fill="none" stroke="#2a1620" stroke-width="6" stroke-linecap="round"/><path d="M218 168 Q236 148 254 168" fill="none" stroke="#2a1620" stroke-width="6" stroke-linecap="round"/></g>
      <path d="M186 186 h20 l-10 12z" fill="#f08aa0"/>
      <path d="M196 198 v8 M196 206 q-10 10 -20 4 M196 206 q10 10 20 4" fill="none" stroke="#6b3a2c" stroke-width="3" stroke-linecap="round"/>
      <path d="M120 196 l-46 -8 M120 206 l-48 6 M272 196 l46 -8 M272 206 l48 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>
      <text class="pc-z" x="296" y="84" font-size="30" fill="#f6ebe0" opacity="0">z z z</text>
    </g>
  </svg>`;
}

const FISH = `<svg viewBox="0 0 48 28" width="38" height="22" aria-hidden="true"><path d="M3 14 C12 2 30 2 38 14 C30 26 12 26 3 14Z" fill="#f4a8c6"/><path d="M36 14 L46 5 V23Z" fill="#f4a8c6"/><circle cx="12" cy="12" r="2.2" fill="#2a1620"/></svg>`;

export function petsScene(opts: { cat: CatId; chat: (id: CatId) => void; hop: (spot: string) => void }): SceneDef {
  const first = CATS.find((c) => c.id === opts.cat) ?? CATS[0];
  let shown: CatId = opts.cat;
  return {
    title: t("Pet and feed the cats", "Caresse et nourris les chats"),
    html: `
    <div class="pc">
      <div class="pc-tabs" role="tablist" aria-label="${t("Choose a cat", "Choisis un chat")}">
        ${CATS.map((c) => `<button type="button" role="tab" class="pc-tab${c.id === first.id ? " on" : ""}" data-cat="${c.id}" aria-selected="${c.id === first.id}">${c.name}</button>`).join("")}
      </div>
      <div class="pc-stage" id="pc-stage" tabindex="0" aria-label="${t("Drag over the cat to pet it", "Glisse sur le chat pour le caresser")}"></div>
      <p class="gt-hint" id="pc-say" aria-live="polite"></p>
      <div class="pc-meters">
        <div><span>${t("Happiness", "Bonheur")}</span><i class="pc-bar"><b id="pc-love"></b></i></div>
        <div><span>${t("Full tummy", "Ventre plein")}</span><i class="pc-bar"><b id="pc-full"></b></i></div>
      </div>
      <div class="gt-row pc-tray">
        <button type="button" class="gloss" data-pat>${t("Give a pat", "Une caresse")}</button>
        <button type="button" class="pc-treat" data-treat aria-label="${t("Give a treat", "Donner une friandise")}">${FISH}<span>${t("Treat", "Friandise")}</span></button>
        <button type="button" class="gloss pink" data-talk>${t("Talk to", "Parler à")} <span id="pc-name"></span></button>
      </div>
    </div>`,
    mount(root: HTMLElement, fx: SceneFx) {
      const stage = root.querySelector<HTMLElement>("#pc-stage")!;
      const say = root.querySelector<HTMLElement>("#pc-say")!;
      const love = root.querySelector<HTMLElement>("#pc-love")!;
      const full = root.querySelector<HTMLElement>("#pc-full")!;
      const nameEl = root.querySelector<HTMLElement>("#pc-name")!;
      const state: Record<CatId, { love: number; full: number }> = { ferrari: { love: 0, full: 0 }, lambo: { love: 0, full: 0 } };
      let purr: ReturnType<typeof sound.purr> | null = null;
      let down = false;
      let lx = 0;
      let ly = 0;
      let lt = 0;
      let acc = 0;
      let happyTimer = 0;
      let purrTimer = 0;
      const cat = () => CATS.find((c) => c.id === shown)!;
      const svg = () => stage.querySelector<SVGSVGElement>("svg")!;

      const meters = () => {
        const s = state[shown];
        love.style.width = s.love * 100 + "%";
        full.style.width = s.full * 100 + "%";
        const tr = root.querySelector<HTMLButtonElement>("[data-treat]")!;
        tr.disabled = s.full >= 1;
        svg()?.classList.toggle("sleepy", s.full >= 1);
      };
      const show = (id: CatId) => {
        shown = id;
        stage.innerHTML = catSvg(id);
        nameEl.textContent = cat().name;
        root.querySelectorAll<HTMLElement>(".pc-tab").forEach((b) => {
          b.classList.toggle("on", b.dataset.cat === id);
          b.setAttribute("aria-selected", String(b.dataset.cat === id));
        });
        say.textContent = cat().intro[0];
        meters();
      };
      const happy = (ms = 1300) => {
        svg().classList.add("happy");
        clearTimeout(happyTimer);
        happyTimer = window.setTimeout(() => svg().classList.remove("happy"), ms);
      };
      const stroke = (d: number, speed: number, x: number, y: number) => {
        const s = state[shown];
        s.love = Math.min(1, s.love + d * 0.0011);
        acc += d;
        purr?.set(0.35 + Math.min(0.65, speed * 0.6) + s.love * 0.2);
        happy(900);
        if (acc > 150) {
          acc = 0;
          fx.burst(x, y, ["♥", "♥", "✦"], 3);
        }
        if (s.love >= 1 && !stage.dataset[shown + "loved"]) {
          stage.dataset[shown + "loved"] = "1";
          say.textContent = cat().petLine;
        }
        meters();
        clearTimeout(purrTimer);
        purrTimer = window.setTimeout(() => purr?.set(0.25), 350);
      };

      stage.addEventListener("pointerdown", (e) => {
        down = true;
        stage.setPointerCapture(e.pointerId);
        lx = e.clientX;
        ly = e.clientY;
        lt = performance.now();
        purr?.stop();
        purr = sound.purr();
        purr.set(0.3);
        say.textContent = cat().petLine;
      });
      stage.addEventListener("pointermove", (e) => {
        if (!down) return;
        const now = performance.now();
        const d = Math.hypot(e.clientX - lx, e.clientY - ly);
        const speed = d / Math.max(1, now - lt);
        const r = stage.getBoundingClientRect();
        svg().style.setProperty("--tilt", String(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))));
        stroke(d, speed, e.clientX, e.clientY);
        lx = e.clientX;
        ly = e.clientY;
        lt = now;
      });
      const up = () => {
        down = false;
        purr?.stop();
        purr = null;
      };
      stage.addEventListener("pointerup", up);
      stage.addEventListener("pointercancel", up);

      root.addEventListener("click", (e) => {
        const el = e.target as HTMLElement;
        const tab = el.closest<HTMLElement>("[data-cat]");
        if (tab) return show(tab.dataset.cat as CatId);
        if (el.closest("[data-pat]")) {
          const r = stage.getBoundingClientRect();
          const p = sound.purr();
          p.set(0.7);
          setTimeout(() => p.stop(), 900);
          stroke(80, 0.8, r.left + r.width / 2, r.top + r.height * 0.4);
          say.textContent = cat().petLine;
          return;
        }
        if (el.closest("[data-treat]")) {
          const s = state[shown];
          if (s.full >= 1) return;
          const btn = el.closest<HTMLElement>("[data-treat]")!;
          const br = btn.getBoundingClientRect();
          const sr = stage.getBoundingClientRect();
          const fly = document.createElement("span");
          fly.className = "pc-fly";
          fly.innerHTML = FISH;
          fly.style.left = br.left + br.width / 2 + "px";
          fly.style.top = br.top + "px";
          document.body.appendChild(fly);
          const tx = sr.left + sr.width / 2 - (br.left + br.width / 2);
          const ty = sr.top + sr.height * 0.48 - br.top;
          const anim = fly.animate([{ transform: "translate(-50%,0) scale(1)" }, { transform: `translate(calc(-50% + ${tx * 0.5}px), ${ty * 0.5 - 60}px) scale(1.2)`, offset: 0.5 }, { transform: `translate(calc(-50% + ${tx}px), ${ty}px) scale(.4)`, opacity: 0.2 }], { duration: 520, easing: "cubic-bezier(.3,.7,.4,1)" });
          anim.onfinish = () => {
            fly.remove();
            sound.crunch();
            s.full = Math.min(1, s.full + 0.25);
            s.love = Math.min(1, s.love + 0.15);
            happy(1500);
            svg().classList.remove("munch");
            void svg().getBoundingClientRect();
            svg().classList.add("munch");
            fx.burst(sr.left + sr.width / 2, sr.top + sr.height * 0.4, ["★", "✦", "♥"], 6);
            say.textContent = s.full >= 1 ? shown === "ferrari" ? t("Ferrari is full and sleepy now. Gentle pats only.", "Ferrari est rassasié et somnolent. Caresses douces seulement.") : t("Lamborghini is full and sleepy now. Gentle pats only.", "Lamborghini est rassasiée et somnolente. Caresses douces seulement.") : cat().treatLine;
            meters();
          };
          return;
        }
        if (el.closest("[data-talk]")) {
          const id = shown;
          fx.close();
          opts.chat(id);
        }
      });
      show(shown);
      return () => {
        purr?.stop();
        clearTimeout(happyTimer);
        clearTimeout(purrTimer);
        document.querySelectorAll(".pc-fly").forEach((n) => n.remove());
        opts.hop(cat().spot);
      };
    },
  };
}
