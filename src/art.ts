/* Art: paintings hung on a gallery wall, and a few things made by hand on the table.
   Click anything to look closer; arrows or ← → move between pieces, Esc closes. */
import { t } from "./i18n";
import type { Ctx } from "./apps";

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
  { kind: "vid", src: "art/book-8111.mp4", poster: "art/book-8111.jpg", title: t("Felt book, the cover", "Livre en feutrine, la couverture"), cap: t("Gingham and a first page flip", "Du vichy et une première page"), alt: t("Video: a pink gingham cover moving in and out of focus", "Vidéo : une couverture vichy rose, mise au point mouvante"), len: "0:04" },
  { kind: "vid", src: "art/book-8112.mp4", poster: "art/book-8112.jpg", title: t("Felt book, palette & shapes", "Livre en feutrine, palette et formes"), cap: t("Sticking shapes onto a painter’s palette", "Des formes à coller sur une palette de peintre"), alt: t("Video: hands placing felt shapes on a painter’s palette page", "Vidéo : des mains placent des formes en feutrine sur une page palette"), len: "0:42" },
  { kind: "vid", src: "art/book-8113.mp4", poster: "art/book-8113.jpg", title: t("Felt book, under the sea", "Livre en feutrine, sous la mer"), cap: t("A jellyfish you can count with beads", "Une méduse à compter avec des perles"), alt: t("Video: a felt page with a jellyfish and bead counting strings", "Vidéo : une page en feutrine avec une méduse et des perles à compter"), len: "0:31" },
  { kind: "vid", src: "art/book-8114.mp4", poster: "art/book-8114.jpg", title: t("Felt book, dress-up", "Livre en feutrine, habillage"), cap: t("A paper doll with felt clothes", "Une poupée aux vêtements en feutrine"), alt: t("Video: hands dressing a felt doll on a colourful page", "Vidéo : des mains habillent une poupée en feutrine sur une page colorée"), len: "0:16" },
];

const pageShots = (): Piece[] => [
  { kind: "img", src: "art/page-aquarium.jpg", title: t("Under the sea", "Sous la mer"), cap: t("A fish tank with a seahorse and glitter water", "Un aquarium avec un hippocampe et de l’eau pailletée"), alt: t("A felt page showing a fish tank with a seahorse, a fish and a pink shell on a blue patterned background", "Une page en feutrine : un aquarium avec un hippocampe, un poisson et un coquillage rose sur un fond bleu motifs") },
  { kind: "img", src: "art/page-tree.jpg", title: t("The apple tree", "Le pommier"), cap: t("Apples to pick, bags to carry them in", "Des pommes à cueillir, des paniers pour les ranger"), alt: t("A felt page with a green apple tree and two bags, one yellow and one red, on a blue background", "Une page en feutrine : un pommier vert et deux paniers, un jaune et un rouge, sur fond bleu") },
  { kind: "img", src: "art/page-note.jpg", title: t("The last page", "La dernière page"), cap: t("A little note, signed by me", "Un petit mot, signé de ma main"), alt: t("A handwritten note in French on a pink felt page, with a cherry blossom sticker", "Un mot manuscrit en français sur une page en feutrine rose, avec un autocollant de fleurs de cerisier") },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function renderArt(body: HTMLElement, ctx: Ctx) {
  const P = paintings();
  const G = pageShots();
  const V = clips();
  const all = [...P, ...G, ...V];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const frame = (p: Piece, i: number) => `
    <figure class="ar-fig" style="--i:${i}">
      <button type="button" class="ar-frame" data-n="${i}" aria-label="${esc(p.title)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" draggable="false" /></button>
      <figcaption><i>${String(i + 1).padStart(2, "0")}</i><b>${esc(p.title)}</b><span>${esc(p.cap)}</span></figcaption>
    </figure>`;
  const pageTile = (p: Piece, i: number) => `
    <figure class="ar-clip" style="--i:${i}">
      <button type="button" class="ar-page" data-n="${P.length + i}" aria-label="${esc(p.title)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" draggable="false" /></button>
      <figcaption><b>${esc(p.title)}</b><span>${esc(p.cap)}</span></figcaption>
    </figure>`;
  const clip = (p: Piece, i: number) => `
    <figure class="ar-clip" style="--i:${i}">
      <button type="button" class="ar-reel" data-n="${P.length + G.length + i}" aria-label="${esc(p.title)}">
        <img src="${p.poster}" alt="" loading="lazy" draggable="false" />
        <video muted loop playsinline preload="none" src="${p.src}" aria-hidden="true"></video>
        <em>${p.len}</em><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4.5v11l9-5.5z"/></svg>
      </button>
      <figcaption><b>${esc(p.title)}</b></figcaption>
    </figure>`;

  body.innerHTML = `
  <div class="ar">
    <div class="scroll ar-scroll">
      <header class="ar-head"><small>${t("One of my passions", "Une de mes passions")}</small><h2>${t("Arts & crafts", "Arts & créations")}</h2>
        <p>${t("I love using my hands to create anything. Here is a compilation of things I have made over the years: acrylic paintings, and a few things made by hand for people I love.", "J’adore créer avec mes mains, peu importe quoi. Voici une compilation de choses que j’ai faites au fil des années : des peintures acryliques, et quelques créations faites main pour des gens que j’aime.")}</p></header>
      <section class="ar-wall" aria-label="${t("Paintings", "Peintures")}">${P.map(frame).join("")}</section>
      <header class="ar-head ar-sub"><h3>${t("A felt book for my nieces", "Un livre en feutrine pour mes nièces")}</h3>
        <p>${t("I made this quiet book as a gift for my two one-year-old nieces. Their moms, my cousins, are twins, so the gifts had to be twinning too. They loved it and started playing with it straight away.", "J’ai fait ce livre d’éveil en cadeau pour mes deux nièces de un an. Leurs mamans, mes cousines, sont jumelles : les cadeaux devaient donc être jumeaux eux aussi. Elles l’ont adoré et ont tout de suite joué avec.")}</p>
        <p>${t("It also sits close to my field. It is an interactive book for babies that resembles any interactive interface I would create on a laptop (except it’s tangible).", "Cela rejoint aussi mon domaine : c’est un livre interactif pour bébés, qui ressemble à n’importe quelle interface interactive que je créerais sur ordinateur (sauf qu’il est tangible).")}</p></header>
      <section class="ar-pages" aria-label="${t("Pages of the book", "Pages du livre")}">${G.map(pageTile).join("")}</section>
      <section class="ar-reels" aria-label="${t("Videos", "Vidéos")}">${V.map(clip).join("")}</section>
    </div>
  </div>`;
  const root = body.querySelector<HTMLElement>(".ar")!;

  /* hover a reel to see it move */
  root.querySelectorAll<HTMLElement>(".ar-reel").forEach((r) => {
    const v = r.querySelector("video")!;
    if (calm) return;
    r.addEventListener("pointerenter", () => { v.play().then(() => r.classList.add("live")).catch(() => {}); });
    r.addEventListener("pointerleave", () => { r.classList.remove("live"); v.pause(); });
  });

  /* the viewer */
  let box: HTMLElement | null = null;
  let cur = 0;
  let from: HTMLElement | null = null;
  const paint = () => {
    const p = all[cur];
    const media = p.kind === "vid"
      ? `<video src="${p.src}" poster="${p.poster}" controls autoplay loop playsinline></video>`
      : `<img src="${p.src}" alt="${esc(p.alt)}" draggable="false" />`;
    box!.innerHTML = `
      <button type="button" class="ar-x" aria-label="${t("Close", "Fermer")}">×</button>
      <button type="button" class="ar-n prev" aria-label="${t("Previous", "Précédent")}">‹</button>
      <div class="ar-stage ${p.kind}">${media}</div>
      <button type="button" class="ar-n next" aria-label="${t("Next", "Suivant")}">›</button>
      <p class="ar-cap"><b>${esc(p.title)}</b><span>${esc(p.cap)}</span><i>${cur + 1} / ${all.length}</i></p>`;
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
    box.className = "ar-view";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    root.appendChild(box);
    paint();
    box.addEventListener("click", (e) => {
      const tg = e.target as HTMLElement;
      if (tg.closest(".ar-n")) go(tg.closest(".ar-n")!.classList.contains("next") ? 1 : -1);
      else if (tg.closest(".ar-x") || !tg.closest(".ar-stage, .ar-cap")) close();
    });
    document.addEventListener("keydown", key, true);
    ctx.sfx.tick();
    box.querySelector<HTMLElement>(".ar-x")!.focus();
  };
  root.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-n]");
    if (b) open(Number(b.dataset.n), b);
  });
}
