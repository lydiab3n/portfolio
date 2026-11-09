import { t } from "../../i18n";
import { pluck } from "./audio";
import type { SceneDef, SceneFx } from "./overlay";

/* open strings, low E to high e */
const OPEN = [82.41, 110, 146.83, 196, 246.94, 329.63];
const NAMES = ["E", "A", "D", "G", "B", "e"];
const WIDTH = [4.4, 3.8, 3.2, 2.4, 1.8, 1.4];
/* fret per string, low to high. -1 is a muted string */
const CHORDS: Record<string, number[]> = {
  Open: [0, 0, 0, 0, 0, 0],
  Am: [-1, 0, 2, 2, 1, 0],
  C: [-1, 3, 2, 0, 1, 0],
  G: [3, 2, 0, 0, 0, 3],
  D: [-1, -1, 0, 2, 3, 2],
  Em: [0, 2, 2, 0, 0, 0],
};
const SONGS = () => [
  { id: "sun", name: t("Sunny morning", "Matin ensoleillé"), seq: ["C", "G", "Am", "G"] },
  { id: "pink", name: t("Pink hour", "Heure rose"), seq: ["Am", "C", "G", "D"] },
];

const NUT = 100;
const FRET_W = 160;
const TOP = 60;
const GAP = 40;
const yOf = (s: number) => TOP + (5 - s) * GAP; /* high e on top */

function board() {
  let g = `<rect x="${NUT}" y="30" width="${FRET_W * 5}" height="${GAP * 5 + 60}" rx="10" fill="url(#gt-wood)"/>`;
  for (let k = 1; k <= 5; k++) g += `<line x1="${NUT + k * FRET_W}" y1="34" x2="${NUT + k * FRET_W}" y2="${TOP + GAP * 5 + 26}" stroke="#d8c9b8" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
  g += `<rect x="${NUT - 8}" y="30" width="10" height="${GAP * 5 + 60}" rx="3" fill="#f4eadc"/>`;
  for (const f of [3, 5]) g += `<circle cx="${NUT + (f - 1) * FRET_W + FRET_W / 2}" cy="${TOP + GAP * 2.5}" r="9" fill="#f4eadc" opacity=".55"/>`;
  g += `<text x="${NUT + 2 * FRET_W + FRET_W / 2}" y="${TOP + GAP * 5 + 52}" text-anchor="middle" class="gt-fnum">3</text><text x="${NUT + 4 * FRET_W + FRET_W / 2}" y="${TOP + GAP * 5 + 52}" text-anchor="middle" class="gt-fnum">5</text>`;
  /* headstock */
  g += `<path d="M18 52 Q18 40 32 40 L${NUT - 8} 56 L${NUT - 8} ${TOP + GAP * 5 + 4} L32 ${TOP + GAP * 5 + 20} Q18 ${TOP + GAP * 5 + 20} 18 ${TOP + GAP * 5 + 8} Z" fill="#c43b72"/>`;
  for (let s = 0; s < 6; s++) g += `<text x="46" y="${yOf(s) + 5}" text-anchor="middle" class="gt-name">${NAMES[s]}</text>`;
  /* strings */
  for (let s = 0; s < 6; s++) {
    const y = yOf(s);
    g += `<g class="gt-str" data-s="${s}"><line class="vis" x1="${NUT - 6}" y1="${y}" x2="${NUT + FRET_W * 5}" y2="${y}" stroke="#f2e6d8" stroke-width="${WIDTH[s]}" stroke-linecap="round"/></g>`;
  }
  g += `<g id="gt-marks"></g>`;
  return g;
}

export function guitarScene(opts: { listen: () => void }): SceneDef {
  const chordBtns = Object.keys(CHORDS)
    .map((c) => `<button type="button" class="gt-chord${c === "Open" ? " on" : ""}" data-chord="${c}">${c === "Open" ? t("Open", "À vide") : c}</button>`)
    .join("");
  const songBtns = [`<button type="button" class="gt-song on" data-song="">${t("Free play", "Jeu libre")}</button>`, ...SONGS().map((s) => `<button type="button" class="gt-song" data-song="${s.id}">${s.name}</button>`)].join("");
  return {
    title: t("Play the guitar", "Jouer de la guitare"),
    html: `
    <div class="gt">
      <p class="gt-hint" id="gt-hint">${t("Drag across the strings to strum, or tap one to pluck it. Pick a chord below.", "Glissez sur les cordes pour gratter, ou touchez-en une pour la pincer. Choisissez un accord ci-dessous.")}</p>
      <div class="gt-board">
        <svg viewBox="0 0 920 330" role="img" aria-label="${t("Guitar neck with six strings", "Manche de guitare à six cordes")}" id="gt-svg">
          <defs><linearGradient id="gt-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4a35"/><stop offset=".5" stop-color="#5e3526"/><stop offset="1" stop-color="#4a2a1f"/></linearGradient></defs>
          ${board()}
          <rect id="gt-hit" x="0" y="0" width="920" height="330" fill="transparent" style="cursor:pointer;touch-action:none"/>
        </svg>
      </div>
      <div class="gt-rows">
        <div class="gt-row" role="group" aria-label="${t("Chords", "Accords")}">${chordBtns}</div>
        <div class="gt-row">
          <button type="button" class="gloss" data-strum="down">${t("Strum down", "Gratter vers le bas")}</button>
          <button type="button" class="gloss" data-strum="up">${t("Strum up", "Gratter vers le haut")}</button>
          <button type="button" class="gloss pink" data-listen>${t("Listen on Spotify", "Écouter sur Spotify")}</button>
        </div>
        <div class="gt-row" role="group" aria-label="${t("Play along", "Jouer en suivant")}">${songBtns}</div>
        <p class="gt-next" id="gt-next" aria-live="polite"></p>
      </div>
    </div>`,
    mount(root: HTMLElement, fx: SceneFx) {
      const svg = root.querySelector<SVGSVGElement>("#gt-svg")!;
      const hit = root.querySelector<SVGRectElement>("#gt-hit")!;
      const marks = root.querySelector<SVGGElement>("#gt-marks")!;
      const next = root.querySelector<HTMLElement>("#gt-next")!;
      const strs = [...root.querySelectorAll<SVGGElement>(".gt-str")];
      let chord = "Open";
      let song: { id: string; name: string; seq: string[] } | null = null;
      let step = 0;
      let strummed = false;

      const draw = () => {
        const fr = CHORDS[chord];
        let m = "";
        fr.forEach((f, s) => {
          const y = yOf(s);
          if (f < 0) m += `<text x="${NUT - 22}" y="${y + 6}" text-anchor="middle" class="gt-mute">×</text>`;
          else if (f > 0) m += `<circle cx="${NUT + (f - 1) * FRET_W + FRET_W / 2}" cy="${y}" r="15" fill="#ec2a72" stroke="#fff" stroke-width="3"/>`;
        });
        marks.innerHTML = m;
        root.querySelectorAll<HTMLElement>(".gt-chord").forEach((b) => {
          b.classList.toggle("on", b.dataset.chord === chord);
          b.setAttribute("aria-pressed", String(b.dataset.chord === chord));
        });
      };
      const showNext = () => {
        root.querySelectorAll(".gt-chord.next").forEach((b) => b.classList.remove("next"));
        if (!song) {
          next.textContent = "";
          return;
        }
        const want = song.seq[step];
        root.querySelector(`.gt-chord[data-chord="${want}"]`)?.classList.add("next");
        next.textContent = t(`${song.name}: play ${want}, then strum (${step + 1} of ${song.seq.length})`, `${song.name} : jouez ${want}, puis grattez (${step + 1} sur ${song.seq.length})`);
      };
      const vibrate = (s: number) => {
        const g = strs[s];
        g.classList.remove("vib");
        void (g as unknown as HTMLElement).getBoundingClientRect();
        g.classList.add("vib");
      };
      const play = (s: number, vel = 0.8, delay = 0) => {
        const f = CHORDS[chord][s];
        if (f < 0) return;
        pluck(OPEN[s] * Math.pow(2, f / 12), vel, delay);
        if (delay) setTimeout(() => vibrate(s), delay * 1000);
        else vibrate(s);
        strummed = true;
      };
      const strum = (dir: "down" | "up", px?: number, py?: number) => {
        const order = dir === "down" ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];
        order.forEach((s, k) => play(s, 0.85, k * 0.04));
        afterStrum(px, py);
      };
      const afterStrum = (px?: number, py?: number) => {
        if (!song || !strummed) return;
        if (chord === song.seq[step]) {
          step++;
          if (px != null && py != null) fx.burst(px, py, ["♪", "♫", "♥"], 5);
          if (step >= song.seq.length) {
            step = 0;
            fx.toast(t("That was lovely. Play it again?", "C’était joli. On la rejoue ?"));
            if (px != null && py != null) fx.burst(px, py, ["♪", "♫", "✦", "♥"], 10);
          }
          showNext();
        }
        strummed = false;
      };

      /* pointer: tap a string, or drag across several */
      const svgY = (e: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        return ((e.clientY - r.top) / r.height) * 330;
      };
      let down = false;
      let prev = 0;
      let prevT = 0;
      hit.addEventListener("pointerdown", (e) => {
        down = true;
        hit.setPointerCapture(e.pointerId);
        prev = svgY(e);
        prevT = performance.now();
        strummed = false;
        for (let s = 0; s < 6; s++) if (Math.abs(prev - yOf(s)) < GAP / 2.2) play(s, 0.8);
      });
      hit.addEventListener("pointermove", (e) => {
        if (!down) return;
        const y = svgY(e);
        const now = performance.now();
        const speed = Math.min(1, Math.abs(y - prev) / Math.max(1, now - prevT) / 1.6 + 0.35);
        const lo = Math.min(prev, y);
        const hi = Math.max(prev, y);
        const cross: number[] = [];
        for (let s = 0; s < 6; s++) if (yOf(s) > lo && yOf(s) <= hi) cross.push(s);
        if (y < prev) cross.reverse();
        cross.forEach((s) => play(s, speed));
        prev = y;
        prevT = now;
      });
      const end = (e: PointerEvent) => {
        if (!down) return;
        down = false;
        afterStrum(e.clientX, e.clientY);
      };
      hit.addEventListener("pointerup", end);
      hit.addEventListener("pointercancel", () => (down = false));

      root.addEventListener("click", (e) => {
        const el = e.target as HTMLElement;
        const c = el.closest<HTMLElement>("[data-chord]");
        if (c) {
          chord = c.dataset.chord!;
          draw();
          return;
        }
        const st = el.closest<HTMLElement>("[data-strum]");
        if (st) {
          const r = st.getBoundingClientRect();
          return strum(st.dataset.strum as "down" | "up", r.left + r.width / 2, r.top);
        }
        const sg = el.closest<HTMLElement>("[data-song]");
        if (sg) {
          root.querySelectorAll(".gt-song").forEach((b) => b.classList.toggle("on", b === sg));
          song = SONGS().find((s) => s.id === sg.dataset.song) ?? null;
          step = 0;
          showNext();
          return;
        }
        if (el.closest("[data-listen]")) {
          fx.close();
          opts.listen();
        }
      });

      /* keyboard: 1 to 6 pluck low E to high e, space strums, arrows pick the chord */
      const names = Object.keys(CHORDS);
      const onKey = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLButtonElement && e.key === " ") return;
        if (/^[1-6]$/.test(e.key)) {
          strummed = false;
          play(Number(e.key) - 1, 0.8);
        } else if (e.key === " ") {
          e.preventDefault();
          strum("down");
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const i = names.indexOf(chord) + (e.key === "ArrowRight" ? 1 : -1);
          chord = names[(i + names.length) % names.length];
          draw();
        }
      };
      addEventListener("keydown", onKey);
      draw();
      return () => removeEventListener("keydown", onKey);
    },
  };
}
