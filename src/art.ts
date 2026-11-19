/* Art, as a real gallery you walk through sideways: paintings framed and lit on the wall, a felt book in a glass case, and
   little films on screens. Scroll, drag or swipe to walk; click anything to look closer (← → move, Esc closes). */
import { t } from "./i18n";
import type { Ctx } from "./apps";
import "./art.css";

interface Piece { kind: "img" | "vid"; src: string; poster?: string; title: string; cap: string; alt: string; len?: string }

const paintings = (): Piece[] => [
  { kind: "img", src: "art/road.jpg", title: t("Road at dusk", "Route au crépuscule"), cap: t("A car heading into the last light", "Une voiture vers la dernière lumière"), alt: t("Painting of a dark road with a small car and telephone poles under a red and orange sunset", "Peinture d’une route sombre avec une petite voiture et des poteaux sous un coucher de soleil rouge et orange") },
  { kind: "img", src: "art/eye.jpg", title: t("Eye", "Œil"), cap: t("Loud brushwork around a quiet centre", "Un geste franc autour d’un regard calme"), alt: t("Close-up painting of an eye built from bold blocks of red, blue, yellow and black", "Gros plan d’un œil peint en larges aplats rouges, bleus, jaunes et noirs") },
  { kind: "img", src: "art/tea.jpg", title: t("Pouring tea", "Le thé"), cap: t("Light on porcelain", "La lumière sur la porcelaine"), alt: t("Painting of tea being poured into a flowered porcelain cup on a saucer", "Peinture de thé versé dans une tasse en porcelaine à fleurs") },
  { kind: "img", src: "art/scooby.jpg", title: t("The gang", "La bande"), cap: t("Scooby-Doo, caught in the headlights", "Scooby-Doo, pris dans les phares"), alt: t("Painting of the Scooby-Doo gang squeezed into a car at night", "Peinture de la bande de Scooby-Doo serrée dans une voiture, de nuit") },
  { kind: "img", src: "art/boots.jpg", title: t("Boots", "Bottes"), cap: t("Well-worn, and loved for it", "Usées, et aimées pour ça"), alt: t("Painting of a pair of worn brown boots with rolled blue jeans", "Peinture d’une paire de bottes brunes usées et d’un jean retroussé") },
  { kind: "img", src: "art/skull.jpg", title: t("Skull", "Crâne"), cap: t("Pinks and reds on black", "Roses et rouges sur fond noir"), alt: t("Painting of a skull in pink, white and red on a black background", "Peinture d’un crâne rose, blanc et rouge sur fond noir") },
];

const clips = (): Piece[] => [
  { kind: "vid", src: "art/book-film.mp4", poster: "art/book-film.jpg", title: t("The felt book, in motion", "Le livre en feutrine, en mouvement"), cap: t("The cover, the palette, under the sea and dress-up, played with in one film", "La couverture, la palette, sous la mer et l’habillage, dans un seul film"), alt: t("Video: hands playing with the pages of a felt book", "Vidéo : des mains qui jouent avec les pages d’un livre en feutrine"), len: "1:34" },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/* how big each painting hangs (share of the wall height) and which frame it gets */
const HANG: { k: number; f: string }[] = [
  { k: 0.62, f: "black" },
  { k: 0.5, f: "oak" },
  { k: 0.58, f: "float" },
  { k: 0.44, f: "gold" },
  { k: 0.46, f: "black" },
  { k: 0.54, f: "oak" },
];

export function renderArt(body: HTMLElement, ctx: Ctx) {
  const P = paintings();
  const V = clips();
  const all = [...P, ...V];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const num = (i: number) => String(i + 1).padStart(2, "0");

  const work = (p: Piece, i: number) => `
    <figure class="gal-work" style="--k:${HANG[i % HANG.length].k}">
      <i class="gal-lamp" aria-hidden="true"></i><i class="gal-beam" aria-hidden="true"></i>
      <button type="button" class="gal-frame f-${HANG[i % HANG.length].f}" data-n="${i}" aria-label="${esc(p.title)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" draggable="false" /></button>
      <figcaption class="gal-card"><i>${num(i)}</i><b>${esc(p.title)}</b><span>${t("Acrylic painting", "Peinture acrylique")}</span><em>${esc(p.cap)}</em></figcaption>
    </figure>`;

  const screen = (p: Piece, i: number) => `
    <figure class="gal-screen">
      <i class="gal-lamp" aria-hidden="true"></i>
      <button type="button" class="gal-reel" data-n="${P.length + i}" aria-label="${esc(p.title)}">
        <img src="${p.poster}" alt="" loading="lazy" draggable="false" />
        <video muted loop playsinline preload="none" src="${p.src}" aria-hidden="true"></video>
        <em>${p.len ?? ""}</em><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l9-5.5z"/></svg>
      </button>
      <figcaption class="gal-card slim"><b>${esc(p.title)}</b></figcaption>
    </figure>`;

  body.innerHTML = `
  <div class="gal" role="region" aria-label="${t("Art gallery", "Galerie d’art")}">
    <div class="gal-hall" tabindex="0" aria-label="${t("Scroll sideways to walk through the gallery", "Faites défiler sur le côté pour parcourir la galerie")}">
      <div class="gal-track">
        <div class="gal-wall">
          <section class="gal-intro" data-sec="paintings">
            <small>${t("One of my passions", "Une de mes passions")}</small>
            <h2>${t("Arts & crafts", "Arts & créations")}</h2>
            <p>${t("I love using my hands to create anything. Here is a compilation of things I have made over the years: acrylic paintings, and a few things made by hand for people I love.", "J’adore créer avec mes mains, peu importe quoi. Voici une compilation de choses que j’ai faites au fil des années : des peintures acryliques, et quelques créations faites main pour des gens que j’aime.")}</p>
            <p class="gal-legend">${P.length} ${t("paintings", "peintures")} · 1 ${t("felt book", "livre en feutrine")} · ${V.length} ${t("film", "film")}</p>
            <p class="gal-hint"><span>${t("Scroll, drag or swipe to walk through", "Faites défiler, glissez ou balayez pour avancer")}</span><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6h37m-6-5 6 5-6 5"/></svg></p>
          </section>
          ${P.map(work).join("")}
          <section class="gal-text" data-sec="felt">
            <small>${t("Made by hand", "Fait main")}</small>
            <h3>${t("A felt book for my nieces", "Un livre en feutrine pour mes nièces")}</h3>
            <p>${t("I made this quiet book as a gift for my two one-year-old nieces. Their moms, my cousins, are twins, so the gifts had to be twinning too. They loved it and started playing with it straight away.", "J’ai fait ce livre d’éveil en cadeau pour mes deux nièces de un an. Leurs mamans, mes cousines, sont jumelles : les cadeaux devaient donc être jumeaux eux aussi. Elles l’ont adoré et ont tout de suite joué avec.")}</p>
            <p>${t("It also sits close to my field. It is an interactive book for babies that resembles any interactive interface I would create on a laptop (except it’s tangible).", "Cela rejoint aussi mon domaine : c’est un livre interactif pour bébés, qui ressemble à n’importe quelle interface interactive que je créerais sur ordinateur (sauf qu’il est tangible).")}</p>
          </section>
          <div class="gal-screens" data-sec="films">${V.map(screen).join("")}</div>
          <section class="gal-end">
            <h3>${t("That’s the show.", "Fin de l’exposition.")}</h3>
            <button type="button" class="gal-again">${t("Walk back to the start", "Retourner à l’entrée")}</button>
          </section>
        </div>
      </div>
    </div>
    <nav class="gal-nav" aria-label="${t("Gallery", "Galerie")}">
      <button type="button" class="gal-step prev" aria-label="${t("Back", "Reculer")}">‹</button>
      <div class="gal-jump"><button type="button" data-to="paintings">${t("Paintings", "Peintures")}</button><button type="button" data-to="felt">${t("Felt book", "Livre")}</button><button type="button" data-to="films">${t("Film", "Film")}</button></div>
      <button type="button" class="gal-step next" aria-label="${t("Forward", "Avancer")}">›</button>
    </nav>
    <div class="gal-prog" aria-hidden="true"><i></i></div>
  </div>`;
  const root = body.querySelector<HTMLElement>(".gal")!;
  const hall = root.querySelector<HTMLElement>(".gal-hall")!;
  const prog = root.querySelector<HTMLElement>(".gal-prog i")!;

  /* the wall height drives the size of everything hung on it */
  const size = () => {
    const ceil = parseFloat(getComputedStyle(root.querySelector(".gal-track")!).paddingTop) || 56;
    const floor = Math.max(64, Math.min(110, hall.clientHeight * 0.14));
    root.style.setProperty("--floor", floor + "px");
    root.style.setProperty("--H", Math.max(260, hall.clientHeight - ceil - floor) + "px");
  };
  new ResizeObserver(size).observe(hall);
  size();

  /* walking: wheel, drag, buttons, jumps */
  const by = (d: number) => hall.scrollBy({ left: d * hall.clientWidth * 0.7, behavior: calm ? "auto" : "smooth" });
  root.querySelector(".gal-step.prev")!.addEventListener("click", () => by(-1));
  root.querySelector(".gal-step.next")!.addEventListener("click", () => by(1));
  root.querySelectorAll<HTMLElement>(".gal-jump [data-to]").forEach((b) =>
    b.addEventListener("click", () => {
      const el = root.querySelector<HTMLElement>(`[data-sec="${b.dataset.to}"]`);
      if (el) hall.scrollTo({ left: Math.max(0, el.offsetLeft - 40), behavior: calm ? "auto" : "smooth" });
    }),
  );
  root.querySelector(".gal-again")!.addEventListener("click", () => hall.scrollTo({ left: 0, behavior: calm ? "auto" : "smooth" }));
  hall.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      hall.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
  hall.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); by(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); by(-1); }
  });
  let drag = false;
  let sx = 0;
  let sl = 0;
  let moved = 0;
  hall.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = true;
    moved = 0;
    sx = e.clientX;
    sl = hall.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    moved = Math.max(moved, Math.abs(e.clientX - sx));
    if (moved > 5) {
      hall.classList.add("drag");
      hall.scrollLeft = sl - (e.clientX - sx);
    }
  });
  window.addEventListener("pointerup", () => {
    drag = false;
    setTimeout(() => hall.classList.remove("drag"), 0);
  });
  const progress = () => {
    const max = hall.scrollWidth - hall.clientWidth;
    prog.style.transform = `scaleX(${max > 0 ? hall.scrollLeft / max : 0})`;
  };
  hall.addEventListener("scroll", progress, { passive: true });
  progress();

  /* a screen plays while you look at it */
  root.querySelectorAll<HTMLElement>(".gal-reel").forEach((r) => {
    const v = r.querySelector("video")!;
    if (calm) return;
    r.addEventListener("pointerenter", () => { v.play().then(() => r.classList.add("live")).catch(() => {}); });
    r.addEventListener("pointerleave", () => { r.classList.remove("live"); v.pause(); });
  });

  /* the viewer: one piece, alone, under a spotlight */
  let box: HTMLElement | null = null;
  let cur = 0;
  let from: HTMLElement | null = null;
  const paint = () => {
    const p = all[cur];
    const media = p.kind === "vid"
      ? `<video src="${p.src}" poster="${p.poster}" controls autoplay loop playsinline></video>`
      : `<img src="${p.src}" alt="${esc(p.alt)}" draggable="false" />`;
    box!.innerHTML = `
      <button type="button" class="gal-x" aria-label="${t("Close", "Fermer")}">×</button>
      <button type="button" class="gal-n prev" aria-label="${t("Previous", "Précédent")}">‹</button>
      <div class="gal-stage ${p.kind}">${media}</div>
      <button type="button" class="gal-n next" aria-label="${t("Next", "Suivant")}">›</button>
      <p class="gal-label"><b>${esc(p.title)}</b><span>${esc(p.cap)}</span><i>${cur + 1} / ${all.length}</i></p>`;
  };
  const go = (d: number) => { cur = (cur + d + all.length) % all.length; ctx.sfx.tick(); paint(); };
  const key = (e: KeyboardEvent) => {
    if (!box) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); go(-1); }
  };
  const close = () => {
    if (!box) return;
    const b = box;
    box = null;
    document.removeEventListener("keydown", key, true);
    b.classList.add("out");
    setTimeout(() => b.remove(), calm ? 0 : 200);
    from?.focus({ preventScroll: true });
  };
  const open = (n: number, el: HTMLElement) => {
    if (box) return;
    cur = n;
    from = el;
    box = document.createElement("div");
    box.className = "gal-view";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    root.appendChild(box);
    paint();
    box.addEventListener("click", (e) => {
      const tg = e.target as HTMLElement;
      if (tg.closest(".gal-n")) go(tg.closest(".gal-n")!.classList.contains("next") ? 1 : -1);
      else if (tg.closest(".gal-x") || !tg.closest(".gal-stage, .gal-label")) close();
    });
    document.addEventListener("keydown", key, true);
    ctx.sfx.tick();
    box.querySelector<HTMLElement>(".gal-x")!.focus();
  };
  root.addEventListener("click", (e) => {
    if (moved > 5) return; // that was a drag, not a click
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-n]");
    if (b) open(Number(b.dataset.n), b);
  });
}
