import { about, albums, cases, contact, education, hero, roles, skills, type Album, type CaseStudy, type DataTable, type ExternalVideoMedia, type Media, type VideoMedia } from "./content";
import type { Sfx } from "./sound";
import { t } from "./i18n";

export interface Ctx {
  sfx: Sfx;
  open: (id: string, arg?: string) => void;
}

export interface AppDef {
  id: string;
  name: string;
  w: number;
  h: number;
  split?: number; // sidebar width
  keywords: string;
  render: (body: HTMLElement, ctx: Ctx, arg?: string) => void;
  onArg?: (body: HTMLElement, arg: string) => void;
}

const PORTRAIT = "lydia-portrait.jpg";

const sq = (inner: string, g: [string, string], id: string) =>
  `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs><rect width="100" height="100" rx="23" fill="url(#g-${id})"/>${inner}<rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-edge)" stroke-opacity=".5" stroke-width="1.5"/></svg>`;

/* Illustrated avatar of Lydia: long dark waves, warm skin, hot-pink backdrop. */
export const avatar = `<img class="av" src="avatar.jpg" alt="" draggable="false" />`;

export function icon(id: string): string {
  switch (id) {
    case "about":
      return avatar;
    case "cv":
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="g-cv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--icon-pink-a)"/><stop offset="1" stop-color="var(--icon-pink-b)"/></linearGradient></defs><rect width="100" height="100" rx="23" fill="url(#g-cv)"/><path d="M29 17h30l16 16v48a4 4 0 0 1-4 4H29a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4z" fill="var(--icon-paper)"/><path d="M59 17v12a4 4 0 0 0 4 4h12z" fill="var(--icon-fold)"/><text x="50" y="66" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="25" fill="var(--icon-type)" letter-spacing="1">CV</text><path d="M34 76h32" stroke="var(--icon-cv-line)" stroke-width="3" stroke-linecap="round"/><rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-edge)" stroke-opacity=".5" stroke-width="1.5"/></svg>`;
    case "work":
      return sq(`<path d="M16 34a6 6 0 0 1 6-6h16l8 8h32a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z" fill="var(--icon-paper)" fill-opacity=".93"/>`, ["var(--icon-pink-light)", "var(--icon-pink-deep)"], id);
    case "experience":
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="23" fill="var(--icon-paper)"/><path d="M0 23a23 23 0 0 1 23-23h54a23 23 0 0 1 23 23v13H0z" fill="var(--icon-gold)"/><path d="M20 56h60M20 71h60M20 86h36" stroke="var(--icon-line-soft)" stroke-width="3.5" stroke-linecap="round"/><rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-outline)" stroke-opacity=".8"/></svg>`;
    case "photos": {
      const cols = ["var(--icon-petal-pink)", "#ffb86b", "#ffe26b", "#9be37f", "#6fe0c8", "#8fb8ff", "#b69aff", "var(--icon-petal-rose)"];
      const petals = cols.map((c, k) => `<ellipse class="petal" cx="50" cy="31" rx="10" ry="19" fill="${c}" transform="rotate(${k * 45} 50 50)"/>`).join("");
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="23" fill="var(--icon-paper)"/>${petals}<rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-outline)" stroke-opacity=".8"/></svg>`;
    }
    case "mail":
      return sq(`<path d="M22 32h56a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V36a4 4 0 0 1 4-4z" fill="var(--icon-paper)"/><path d="M20 36l30 22 30-22" stroke="var(--icon-pink-deep)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, ["var(--icon-pink-light)", "var(--icon-pink-deep)"], id);
    case "music":
      return `<img class="music-icon" src="music-note.png" alt="" draggable="false" />`;
    case "videos":
      return sq(`<rect x="19" y="29" width="62" height="42" rx="12" fill="var(--icon-paper)"/><path d="M44 40v20l18-10z" fill="var(--icon-accent)"/>`, ["var(--icon-accent-light)", "var(--icon-accent-deep)"], id);
    default:
      return "";
  }
}

export const folderSvg = `<img class="fi-l" src="folder-light.png" alt="" draggable="false" /><img class="fi-d" src="folder-dark.png" alt="" draggable="false" />`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const slot = (label: string, cls = "") => `<div class="slot ${cls}"><span>${esc(label)}</span></div>`;

/* ---------- About ---------- */
function renderAbout(body: HTMLElement) {
  body.innerHTML = `
  <div class="scroll about">
    <header class="profile">
      <div class="avatar" style="background-image:url(${PORTRAIT})" role="img" aria-label="${esc(about.photoAlt)}"></div>
      <div>
        <h1 class="display">Lydia Benosmane</h1>
        <p class="role">${esc(hero.role)} · ${esc(hero.place)}</p>
        <p class="status"><i></i>${esc(hero.status)}</p>
      </div>
    </header>
    <p class="lede">${esc(hero.tagline)}</p>
    <div class="prose">${about.paragraphs.map((p) => `<p>${p}</p>`).join("")}</div>
    <div class="chips">${about.tags.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
    <h2 class="group-h">${t("Favourites", "Favoris")}</h2>
    <ul class="rows">${about.favourites.map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("")}</ul>
    <h2 class="group-h">${t("What I do", "Ce que je fais")}</h2>
    <ul class="rows">${skills.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ul>
  </div>`;
}

/* ---------- Work ---------- */
const clean = (v: string) =>
  v.split(" · ").filter((x) => !/TODO/i.test(x)).join(" · ");

const projectCategories = [
  { id: "product", label: t("Product & UX", "Produit & UX") },
  { id: "interaction", label: t("Interaction design", "Design d’interaction") },
  { id: "immersive", label: t("Immersive & VR", "Immersif & VR") },
  { id: "games", label: t("Games", "Jeux") },
  { id: "tangible", label: t("Tangible interfaces", "Interfaces tangibles") },
  { id: "civic", label: t("Public digital services", "Services numériques publics") },
];

const caseCategories: Record<string, string[]> = {
  lineup: ["product", "interaction"],
  "zen-rooms": ["immersive", "interaction"],
  "magic-map": ["product", "interaction"],
  javarista: ["games"],
  bookerfly: ["product", "interaction"],
  khamsa: ["tangible"],
  "suite-numerique": ["product", "civic"],
};

const fig = (m: Media) =>
  `<figure class="media${m.wide ? " wide" : ""}"><button class="zoom" type="button" aria-label="${t("Enlarge", "Agrandir")}: ${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" draggable="false" /></button>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}</figure>`;

const videoFig = (v: VideoMedia) =>
  `<figure class="video"><video controls playsinline preload="metadata" aria-label="${esc(v.caption)}"><source src="${v.src}" type="video/mp4" /></video><figcaption>${esc(v.caption)}</figcaption></figure>`;

const externalVideoFig = (v: ExternalVideoMedia) =>
  `<figure class="youtube-video"><iframe src="${v.src}" title="${esc(v.caption)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><figcaption>${esc(v.caption)}</figcaption></figure>`;

const tbl = (t: DataTable) =>
  `<div class="tbl"><table>${t.caption ? `<caption>${esc(t.caption)}</caption>` : ""}<thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${t.rows
    .map((r) => `<tr>${r.map((c, i) => `<${i === 0 ? "th scope=\"row\"" : "td"}>${esc(c)}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;

function caseHtml(c: CaseStudy): string {
  const facts = c.facts.map(([k, v]) => [k, clean(v)] as const).filter(([, v]) => v);
  const steps = c.steps
    .map(
      (s) => `<article class="step"><h3>${esc(s.title)}</h3>${s.copy ? `<p>${esc(s.copy)}</p>` : ""}${s.bullets ? `<ul class="bul">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${s.table ? tbl(s.table) : ""}${s.media ? `<div class="gallery">${s.media.map(fig).join("")}</div>` : ""}${s.videos ? `<div class="gallery">${s.videos.map(videoFig).join("")}</div>` : ""}${s.externalVideos ? `<div class="gallery">${s.externalVideos.map(externalVideoFig).join("")}</div>` : ""}${s.slots.length ? `<div class="slots">${s.slots.map((x) => slot(x)).join("")}</div>` : ""}${s.note ? `<p class="callout">${esc(s.note)}</p>` : ""}</article>`
    )
    .join("");
  const decisions = c.decisions.map(([h, p]) => `<article class="decision"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join("");
  const outcome = c.outcome
    .map((o) => `<figure class="out">${o.media ? fig(o.media) : slot(o.slot, "tall")}<figcaption><b>${esc(o.title)}</b>${o.copy ? `<span>${esc(o.copy)}</span>` : ""}</figcaption></figure>`)
    .join("");
  const refl = c.reflection.filter((r) => !/TODO/i.test(r));
  let n = 0;
  const scenario = c.scenario
    ? `<section><h2 class="group-h">${t("The scenario, step by step", "Le scénario, étape par étape")}</h2><div class="scen">${c.scenario
        .map(
          (g) => `<div class="scen-g"><h3>${esc(g.label)}</h3><ol>${g.items
            .map(([tag, text]) => `<li>${tag ? `<b>${esc(tag)}</b>` : ""}<span>${esc(text)}</span></li>`)
            .map((li) => (li.includes("<b>") ? (n++, li) : li))
            .join("")}</ol></div>`
        )
        .join("")}</div></section>`
    : "";
  const hero = c.video
    ? `<figure class="video"><video controls playsinline preload="metadata" poster="${c.video.poster}"><source src="${c.video.src}" type="video/mp4" /></video><figcaption>${esc(c.video.caption)}</figcaption></figure>`
    : c.embed ? `<figure class="embed"><iframe src="${c.embed.src}" title="${esc(c.embed.caption)}" loading="lazy" allowfullscreen></iframe><figcaption>${esc(c.embed.caption)}</figcaption></figure>` : c.poster ? `<div class="poster-full">${fig(c.poster)}</div>` : Array.isArray(c.heroMedia) ? `<div class="gallery">${c.heroMedia.map(fig).join("")}</div>` : c.heroMedia ? fig(c.heroMedia) : slot(c.hero, "hero");
  return `
  <div class="scroll case">
    <div class="case-title"><p>${esc(c.kind)}</p><h1 class="display">${esc(c.title)}</h1><p class="blurb">${esc(c.blurb)}</p></div>
    <div class="case-hero">${hero}</div>
    ${c.links ? `<div class="doc-links">${c.links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg><span><b>${esc(l.label)}</b><small>${esc(l.hint)}</small></span></a>`).join("")}</div>` : ""}
    <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <section><h2 class="group-h">${t("The brief", "Le brief")}</h2><p class="prose-p">${esc(c.brief)}</p></section>
    <section><h2 class="group-h">${t("Process", "Processus")}</h2>${steps}</section>
    ${c.principles ? `<section><h2 class="group-h">${t("Principles in the design", "Les principes dans la conception")}</h2><ul class="bul">${c.principles.intro.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${tbl(c.principles.table)}</section>` : ""}
    ${scenario}
    ${c.decisions.length ? `<section><h2 class="group-h">${t("Key decisions", "Décisions clés")}</h2><div class="decisions">${decisions}</div></section>` : ""}
    ${c.outcome.length ? `<section><h2 class="group-h">${t("Outcome", "Résultat")}</h2><div class="outcome">${outcome}</div></section>` : ""}
    ${c.evaluation ? `<section><h2 class="group-h">${t("Evaluation", "Évaluation")}</h2><ul class="bul">${c.evaluation.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>${c.evaluationNote ? `<p class="note">${esc(c.evaluationNote)}</p>` : ""}</section>` : ""}
    ${c.future ? `<section><h2 class="group-h">${t("Future improvements", "Améliorations futures")}</h2><ul class="bul">${c.future.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></section>` : ""}
    ${refl.length ? `<section><h2 class="group-h">${t("Reflection", "Réflexion")}</h2>${refl.map((r) => `<p class="prose-p">${esc(r)}</p>`).join("")}</section>` : ""}
  </div>`;
}

function lightbox(src: string, alt: string, sfx: Sfx) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", alt);
  box.innerHTML = `<img src="${src}" alt="${esc(alt)}" /><button aria-label="${t("Close", "Fermer")}">×</button>`;
  const close = () => {
    document.removeEventListener("keydown", key, true);
    box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).onfinish = () => box.remove();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  };
  box.addEventListener("click", close);
  document.addEventListener("keydown", key, true);
  document.body.appendChild(box);
  sfx.spot();
  box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
  box.querySelector<HTMLElement>("button")!.focus();
}
function renderWork(body: HTMLElement, ctx: Ctx, arg?: string) {
  body.innerHTML = `
  <aside class="side projects"><p class="side-h">${t("Projects", "Projets")}</p>
    <label class="project-filter"><span>${t("Category", "Catégorie")}</span>
      <select id="project-category" aria-label="${t("Filter projects by category", "Filtrer les projets par catégorie")}">
        <option value="all">${t("All categories", "Toutes les catégories")}</option>
        ${projectCategories.map((category) => `<option value="${category.id}">${esc(category.label)}</option>`).join("")}
      </select>
    </label>
    <div class="project-list"></div>
  </aside>
  <main class="main" id="case-main"></main>`;
  const projectList = body.querySelector<HTMLElement>(".project-list")!;
  const categorySelect = body.querySelector<HTMLSelectElement>("#project-category")!;
  let activeCaseId = cases.find((c) => c.id === arg)?.id ?? cases[0].id;

  const filteredCases = () => cases.filter((c) =>
    categorySelect.value === "all" || caseCategories[c.id]?.includes(categorySelect.value)
  );

  const renderProjectList = (visibleCases: CaseStudy[]) => {
    projectList.innerHTML = visibleCases
      .map((c) => `<button class="side-i" data-case="${c.id}"><span class="mini">${icon("work")}</span><span><b>${esc(c.title)}</b><small>${esc(c.kind)}</small></span></button>`)
      .join("");
    projectList.querySelectorAll<HTMLButtonElement>(".side-i").forEach((button) =>
      button.addEventListener("click", () => {
        ctx.sfx.tick();
        show(button.dataset.case!);
      })
    );
  };

  const show = (id: string) => {
    const c = filteredCases().find((x) => x.id === id) ?? filteredCases()[0] ?? cases[0];
    activeCaseId = c.id;
    body.querySelectorAll<HTMLElement>(".side-i").forEach((b) => b.classList.toggle("on", b.dataset.case === c.id));
    const m = body.querySelector<HTMLElement>("#case-main")!;
    m.innerHTML = caseHtml(c);
    m.scrollTop = 0;
    m.querySelectorAll<HTMLElement>(".zoom").forEach((z) =>
      z.addEventListener("click", () => {
        const im = z.querySelector("img")!;
        lightbox(im.src, im.alt, ctx.sfx);
      })
    );
  };

  categorySelect.addEventListener("change", () => {
    const visibleCases = filteredCases();
    renderProjectList(visibleCases);
    show(activeCaseId);
  });
  renderProjectList(filteredCases());
  show(activeCaseId);
}

/* ---------- Experience (Notes) ---------- */
function renderExperience(body: HTMLElement, ctx: Ctx) {
  const notes = [
    ...roles.map((r) => ({ key: r.title, sub: r.place, html: `<h1 class="display">${esc(r.title)}</h1><p class="role">${esc(r.place)} · ${esc(r.dates)}</p><p class="prose-p">${esc(r.copy)}</p>${r.bullets?.length ? `<ul class="bul">${r.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>` : ""}` })),
    ...education.map((e) => ({ key: e.title, sub: e.place, html: `<h1 class="display">${esc(e.title)}</h1><p class="role">${esc(e.place)} · ${esc(e.dates)}</p><p class="prose-p">${esc(e.copy)}</p>` })),
    { key: t("Skills", "Compétences"), sub: t("Toolkit", "Boîte à outils"), html: `<h1 class="display">${t("Skills", "Compétences")}</h1><div class="chips big">${skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>` },
  ];
  body.innerHTML = `
  <aside class="side notes"><p class="side-h">${t("Experience & education", "Expérience & formation")}</p>${notes.map((n, i) => `<button class="side-i" data-i="${i}"><span><b>${esc(n.key)}</b><small>${esc(n.sub)}</small></span></button>`).join("")}</aside>
  <main class="main"><div class="scroll note-body" id="note"></div></main>`;
  const show = (i: number) => {
    body.querySelectorAll<HTMLElement>(".side-i").forEach((b) => b.classList.toggle("on", Number(b.dataset.i) === i));
    body.querySelector<HTMLElement>("#note")!.innerHTML = notes[i].html;
  };
  body.querySelectorAll<HTMLElement>(".side-i").forEach((b) =>
    b.addEventListener("click", () => {
      ctx.sfx.tick();
      show(Number(b.dataset.i));
    })
  );
  show(0);
}

/* ---------- Photos: piles of pictures. Open a pile to flip through it as a cover-flow ---------- */
function renderPhotos(body: HTMLElement, ctx: Ctx) {
  const ttl = body.closest<HTMLElement>(".win")?.querySelector<HTMLElement>(".ttl") ?? null;
  const appName = ttl?.textContent ?? "Photos";
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const spread: [number, number, number][] = [
    [-2, 0, 0],
    [6, 10, -6],
    [-8, -12, -10],
    [11, 6, -14],
  ];

  const piles = albums
    .map((a) => {
      const cards = a.photos
        .slice(0, 4)
        .map((p, i) => `<img class="pc" src="${p.src}" alt="" draggable="false" style="--r:${spread[i][0]}deg;--x:${spread[i][1]}px;--y:${spread[i][2]}px;z-index:${4 - i}" />`)
        .join("");
      return `<button class="pile" data-id="${a.id}" aria-label="${t("Open", "Ouvrir")} ${esc(a.title)}, ${a.photos.length} ${t("photos", "photos")}"><span class="stack">${cards}</span><b>${esc(a.title)}</b><small>${a.photos.length} ${t("photos", "photos")}</small></button>`;
    })
    .join("");

  body.innerHTML = `
  <div class="scroll pl">
    <h1 class="display">${t("Photos", "Photos")}</h1>
    <p class="lede">${t("Piles of pictures. Pick one up and flip through it.", "Des piles de photos. Prenez-en une et feuilletez-la.")}</p>
    <div class="piles">${piles}</div>
  </div>
  <div class="cf-view" hidden tabindex="-1" role="dialog" aria-label="${t("Photo pile", "Pile de photos")}">
    <button class="cf-back" type="button"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2 3.5 6l4 4"/></svg>${t("Piles", "Piles")}</button>
    <div class="cf-stage"></div>
    <p class="cf-cap" aria-live="polite"></p>
  </div>`;

  const list = body.querySelector<HTMLElement>(".pl")!;
  const view = body.querySelector<HTMLElement>(".cf-view")!;
  const stage = view.querySelector<HTMLElement>(".cf-stage")!;
  const cap = view.querySelector<HTMLElement>(".cf-cap")!;
  let cur: Album | null = null;
  let els: HTMLElement[] = [];
  let pos = 0;
  let target = 0;
  let raf = 0;
  let lastPile: HTMLElement | null = null;

  const paint = () => {
    const k = Math.min(1, (stage.clientWidth || 820) / 860, (stage.clientHeight || 520) / 480);
    els.forEach((el, i) => {
      const o = i - pos;
      const a = Math.abs(o);
      const s = Math.sign(o);
      const x = s * (Math.min(a, 1) * 168 + Math.max(a - 1, 0) * 112) * k;
      const z = -Math.min(a, 1) * 130 - Math.max(a - 1, 0) * 24;
      const rot = -s * Math.min(a, 1) * 56;
      el.style.transform = `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg) scale(${k})`;
      el.style.zIndex = String(200 - Math.round(a * 10));
      el.style.opacity = String(Math.max(0, 1 - Math.max(a - 3, 0) / 1.4));
      el.style.pointerEvents = a > 4 ? "none" : "auto";
    });
  };
  const caption = () => {
    if (!cur) return;
    const i = Math.round(target);
    cap.textContent = `${i + 1} / ${cur.photos.length}  ·  ${cur.photos[i].caption}`;
  };
  const tick = () => {
    pos += (target - pos) * 0.13;
    if (Math.abs(target - pos) < 0.002) {
      pos = target;
      raf = 0;
    } else raf = requestAnimationFrame(tick);
    paint();
  };
  const to = (n: number) => {
    if (!cur) return;
    const next = Math.max(0, Math.min(cur.photos.length - 1, Math.round(n)));
    if (next !== Math.round(target)) ctx.sfx.page();
    target = next;
    caption();
    if (calm) {
      pos = target;
      paint();
    } else if (!raf) raf = requestAnimationFrame(tick);
  };

  const open = (a: Album, from?: HTMLElement, start = 0) => {
    cur = a;
    lastPile = from ?? null;
    stage.innerHTML = a.photos
      .map((p, i) => `<figure class="cf-i" data-i="${i}"><img src="${p.src}" alt="${esc(p.caption)}" draggable="false" /></figure>`)
      .join("");
    els = Array.from(stage.querySelectorAll<HTMLElement>(".cf-i"));
    target = Math.max(0, Math.min(a.photos.length - 1, start));
    pos = calm ? target : target - Math.min(3, a.photos.length - 1) * 0.9;
    list.hidden = true;
    view.hidden = false;
    paint();
    caption();
    if (ttl) ttl.textContent = a.title.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".photos";
    view.focus({ preventScroll: true });
    ctx.sfx.page();
    if (!calm && !raf) raf = requestAnimationFrame(tick);
  };
  const close = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    view.hidden = true;
    list.hidden = false;
    stage.innerHTML = "";
    cur = null;
    if (ttl) ttl.textContent = appName;
    ctx.sfx.tick();
    lastPile?.focus({ preventScroll: true });
  };

  body.querySelectorAll<HTMLElement>(".pile").forEach((b) => {
    const a = albums.find((x) => x.id === b.dataset.id)!;
    b.addEventListener("pointerenter", () => ctx.sfx.tick());
    b.addEventListener("click", () => {
      b.classList.add("lifted");
      setTimeout(() => {
        b.classList.remove("lifted");
        open(a, b);
      }, 220);
    });
  });
  view.querySelector(".cf-back")!.addEventListener("click", close);
  view.addEventListener("goto", ((e: CustomEvent<number>) => {
    if (!cur) return;
    target = pos = Math.max(0, Math.min(cur.photos.length - 1, e.detail));
    paint();
    caption();
  }) as EventListener);

  view.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      to(target + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      to(target - 1);
    } else if (e.key === "Home") to(0);
    else if (e.key === "End") to(1e6);
    else if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });

  let wheelAt = 0;
  view.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 6 || performance.now() < wheelAt) return;
      wheelAt = performance.now() + 110;
      to(target + (d > 0 ? 1 : -1));
    },
    { passive: false }
  );

  /* drag to scrub, tap a photo to bring it forward */
  let down = false;
  let x0 = 0;
  let p0 = 0;
  let moved = 0;
  stage.addEventListener("pointerdown", (e) => {
    down = true;
    x0 = e.clientX;
    p0 = pos;
    moved = 0;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!down || !cur) return;
    const dx = e.clientX - x0;
    moved = Math.max(moved, Math.abs(dx));
    if (moved < 5) return;
    stage.classList.add("drag");
    cancelAnimationFrame(raf);
    raf = 0;
    pos = Math.max(0, Math.min(cur.photos.length - 1, p0 - dx / 110));
    target = pos;
    paint();
    const i = Math.round(pos);
    cap.textContent = `${i + 1} / ${cur.photos.length}  ·  ${cur.photos[i].caption}`;
  });
  const release = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    stage.classList.remove("drag");
    if (moved < 5) {
      const fig = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>(".cf-i");
      if (fig) to(Number(fig.dataset.i));
    } else {
      const i = Math.round(pos);
      target = pos;
      to(i);
      if (!raf && !calm) raf = requestAnimationFrame(tick);
    }
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  addEventListener("resize", () => cur && paint());
}

/* ---------- CV ---------- */
const CV_URL = "cv.pdf";

function renderCV(body: HTMLElement, ctx: Ctx) {
  body.innerHTML = `
  <div class="cvapp">
    <div class="cv-top"><div><h1 class="display">${t("Curriculum vitae", "Curriculum vitae")}</h1><p class="role" id="cv-name">Lydia Benosmane · ${esc(hero.role)}</p></div><div class="cv-actions" hidden>
      <a class="btn ghost" id="cv-open" target="_blank" rel="noreferrer">${t("Open in new tab", "Ouvrir dans un onglet")}</a><a class="btn" id="cv-dl" download="Lydia-Benosmane-CV.pdf">${t("Download", "Télécharger")}</a><button class="btn ghost" id="cv-swap">${t("Replace", "Remplacer")}</button></div></div>
    <div class="cv-stage" id="cv-stage"></div>
    <input type="file" id="cv-file" accept="application/pdf" hidden />
  </div>`;
  const stage = body.querySelector<HTMLElement>("#cv-stage")!;
  const actions = body.querySelector<HTMLElement>(".cv-actions")!;
  const file = body.querySelector<HTMLInputElement>("#cv-file")!;
  const show = (url: string) => {
    stage.innerHTML = `<iframe title="Lydia Benosmane CV" src="${url}#toolbar=0&navpanes=0&view=FitH"></iframe>`;
    (body.querySelector("#cv-open") as HTMLAnchorElement).href = url;
    (body.querySelector("#cv-dl") as HTMLAnchorElement).href = url;
    actions.hidden = false;
  };
  const drop = () => {
    actions.hidden = true;
    stage.innerHTML = `<label class="drop" for="cv-file" tabindex="0"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h15l9 9v25a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M29 6v9h9M24 34V22m-5 5 5-5 5 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><b>${t("Attach your CV", "Joignez votre CV")}</b><span>${t("Drop a PDF here, or click to choose a file", "Déposez un PDF ici, ou cliquez pour choisir un fichier")}</span><small>${t("To publish it with the site, save the file as", "Pour le publier avec le site, enregistrez le fichier sous")} <code>public/cv.pdf</code></small></label>`;
  };
  const take = (f?: File) => {
    if (!f || f.type !== "application/pdf") return;
    ctx.sfx.send();
    show(URL.createObjectURL(f));
  };
  file.addEventListener("change", () => take(file.files?.[0]));
  body.querySelector("#cv-swap")!.addEventListener("click", () => file.click());
  stage.addEventListener("dragover", (e) => {
    e.preventDefault();
    stage.classList.add("over");
  });
  stage.addEventListener("dragleave", () => stage.classList.remove("over"));
  stage.addEventListener("drop", (e) => {
    e.preventDefault();
    stage.classList.remove("over");
    take(e.dataTransfer?.files[0]);
  });
  stage.addEventListener("keydown", (e) => e.key === "Enter" && file.click());
  drop();
  fetch(CV_URL, { method: "HEAD" })
    .then((r) => r.ok && (r.headers.get("content-type") ?? "").includes("pdf") && show(CV_URL))
    .catch(() => {});
}

/* ---------- Mail ---------- */
function renderMail(body: HTMLElement, ctx: Ctx) {
  body.innerHTML = `
  <form class="scroll mail" novalidate>
    <div class="mrow"><label for="m-to">${t("To", "À")}</label><input id="m-to" value="Lydia Benosmane &lt;${esc(contact.email)}&gt;" readonly /></div>
    <div class="mrow"><label for="m-sub">${t("Subject", "Objet")}</label><input id="m-sub" value="${t("Hello Lydia", "Bonjour Lydia")}" /></div>
    <textarea id="m-msg" aria-label="Message" placeholder="${t("Hi Lydia, I’d love to talk about an internship…", "Bonjour Lydia, j’aimerais parler d’un stage…")}"></textarea>
    <div class="mfoot">
      <div class="links">${contact.links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer">${esc(l.label)}</a>`).join("")}</div>
      <button type="submit" class="send">${t("Send", "Envoyer")}</button>
    </div>
    <p class="sent" role="status" hidden>${t("Opened in your mail app.", "Ouvert dans votre application de messagerie.")}</p>
  </form>`;
  const f = body.querySelector("form")!;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const sub = encodeURIComponent((f.querySelector("#m-sub") as HTMLInputElement).value);
    const msg = encodeURIComponent((f.querySelector("#m-msg") as HTMLTextAreaElement).value);
    ctx.sfx.send();
    f.querySelector<HTMLElement>(".sent")!.hidden = false;
    location.href = `mailto:${contact.email}?subject=${sub}&body=${msg}`;
  });
}


/* ---------- Music and Videos: embeds you can point at your own playlist or video ---------- */
/* Replace these two links with yours, or paste a link inside the app (it is remembered in this browser). */
const DEFAULT_PLAYLIST = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
const DEFAULT_VIDEO = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

const toSpotify = (u: string, dark: boolean): string | null => {
  const m = u.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=${dark ? 0 : 1}` : null;
};
const toYouTube = (u: string): string | null => {
  const list = u.match(/[?&]list=([\w-]+)/);
  const one = u.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
  if (one) return `https://www.youtube-nocookie.com/embed/${one[1]}${list ? `?list=${list[1]}` : ""}`;
  if (list) return `https://www.youtube-nocookie.com/embed/videoseries?list=${list[1]}`;
  return null;
};

function renderEmbed(kind: "music" | "video") {
  return (body: HTMLElement, ctx: Ctx) => {
    const music = kind === "music";
    const key = "embed-" + kind;
    const parse = music ? (url: string) => toSpotify(url, document.body.classList.contains("dark")) : toYouTube;
    const saved = (() => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    })();
    const src = parse(saved ?? "") ?? parse(music ? DEFAULT_PLAYLIST : DEFAULT_VIDEO)!;
    body.innerHTML = `
    <div class="scroll emb">
      <div class="emb-heading">${music ? '<img class="emb-icon" src="music-note.png" alt="" />' : ""}<h1 class="display">${music ? t("Music", "Musique") : t("Videos", "Vidéos")}</h1></div>
      <p class="lede">${music ? t("What I have on repeat.", "Ce que j’écoute en boucle.") : t("Things I watched, made or just liked.", "Ce que j’ai regardé, fait ou simplement aimé.")}</p>
      <div class="emb-frame ${music ? "sp" : "yt"}"><iframe src="${src}" title="${music ? "Spotify" : "YouTube"}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
      <form class="emb-form"><input type="url" required aria-label="${music ? t("Spotify link", "Lien Spotify") : t("YouTube link", "Lien YouTube")}" placeholder="${music ? t("Paste a Spotify playlist, album or track link", "Collez un lien de playlist, d’album ou de titre Spotify") : t("Paste a YouTube video or playlist link", "Collez un lien de vidéo ou de playlist YouTube")}" /><button type="submit">${t("Use this", "Utiliser")}</button></form>
      <p class="emb-note" role="status" aria-live="polite"></p>
    </div>`;
    const f = body.querySelector<HTMLFormElement>(".emb-form")!;
    const note = body.querySelector<HTMLElement>(".emb-note")!;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = f.querySelector<HTMLInputElement>("input")!.value.trim();
      const next = parse(v);
      if (!next) {
        note.textContent = music ? t("That does not look like a Spotify link. Copy it from Share, then Copy link.", "Ce n’est pas un lien Spotify. Copiez-le depuis Partager, puis Copier le lien.") : t("That does not look like a YouTube link.", "Ce n’est pas un lien YouTube.");
        return;
      }
      body.querySelector<HTMLIFrameElement>("iframe")!.src = next;
      try {
        localStorage.setItem(key, v);
      } catch {
        /* storage unavailable */
      }
      note.textContent = t("Updated.", "Mis à jour.");
      ctx.sfx.tick();
    });
  };
}

export const APPS: AppDef[] = [
  { id: "about", name: t("About Lydia", "À propos de Lydia"), w: 800, h: 640, keywords: "about me lydia bio profile hello propos présentation bonjour", render: renderAbout },
  { id: "work", name: t("Work", "Projets"), w: 1060, h: 740, split: 232, keywords: "work projects case studies lineup zen rooms portfolio projets travaux études de cas", render: renderWork, onArg: (b, a) => b.querySelector<HTMLElement>(`.side-i[data-case="${a}"]`)?.click() },
  { id: "experience", name: t("Experience", "Parcours"), w: 820, h: 560, split: 232, keywords: "experience roles skills cv resume jobs parcours formation compétences", render: renderExperience },
  { id: "cv", name: "CV", w: 860, h: 700, keywords: "cv resume curriculum vitae download pdf télécharger", render: renderCV },
  { id: "photos", name: t("Photos", "Photos"), w: 1040, h: 720, keywords: "photos albums drawing illustration photography collage book images galerie", render: renderPhotos },
  { id: "music", name: t("Music", "Musique"), w: 560, h: 660, keywords: "music spotify playlist songs listen musique écouter", render: renderEmbed("music") },
  { id: "videos", name: t("Videos", "Vidéos"), w: 780, h: 600, keywords: "videos youtube watch film vidéos regarder", render: renderEmbed("video") },
  { id: "mail", name: t("Contact", "Contact"), w: 640, h: 520, keywords: "mail contact email hire hello linkedin instagram message courriel écrire", render: renderMail },
];
