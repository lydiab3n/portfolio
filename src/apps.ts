import { cases, contact, education, hero, roles, toolkit, type CaseStudy, type DoitId, type ExperienceRole, type DataTable, type ExternalVideoMedia, type Media, type VideoMedia } from "./content";
import type { Sfx } from "./sound";
import { lang, t } from "./i18n";
import { renderAbout } from "./about";
import { renderPhotos } from "./photobook";
import { extraApps, extraIcon } from "./extra-apps";
import { thumbFor } from "./desk";

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
      return extraIcon(id);
  }
}

export const folderSvg = `<img class="fi-l" src="folder-light.png" alt="" draggable="false" /><img class="fi-d" src="folder-dark.png" alt="" draggable="false" />`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const slot = (label: string, cls = "") => `<div class="slot ${cls}"><span>${esc(label)}</span></div>`;

/* ---------- About ---------- */
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
  "color-ai-t": ["product", "interaction"],
};

const fig = (m: Media) =>
  `<figure class="media${m.wide ? " wide" : ""}"><button class="zoom" type="button" aria-label="${t("Enlarge", "Agrandir")}: ${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" draggable="false" /></button>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}</figure>`;

const videoFig = (v: VideoMedia) =>
  `<figure class="video"><video controls playsinline preload="${v.poster ? "none" : "metadata"}"${v.poster ? ` poster="${v.poster}"` : ""} aria-label="${esc(v.caption)}"><source src="${v.src}" type="video/mp4" /></video><figcaption>${esc(v.caption)}</figcaption></figure>`;

const externalVideoFig = (v: ExternalVideoMedia) =>
  `<figure class="youtube-video"><iframe src="${v.src}" title="${esc(v.caption)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><figcaption>${esc(v.caption)}</figcaption></figure>`;

const tbl = (t: DataTable) =>
  `<div class="tbl"><table>${t.caption ? `<caption>${esc(t.caption)}</caption>` : ""}<thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${t.rows
    .map((r) => `<tr>${r.map((c, i) => `<${i === 0 ? "th scope=\"row\"" : "td"}>${esc(c)}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;

/* little numbers for the "At a glance" card, all counted from the case study itself */
function mediaCount(c: CaseStudy): number {
  let n = (c.video ? 1 : 0) + (c.embed ? 1 : 0) + (c.poster ? 1 : 0);
  const h = c.heroMedia;
  n += Array.isArray(h) ? h.length : h ? 1 : 0;
  for (const st of c.steps) n += (st.media?.length ?? 0) + (st.videos?.length ?? 0) + (st.externalVideos?.length ?? 0);
  n += c.outcome.filter((o) => o.media).length;
  return n;
}
function stats(c: CaseStudy): string {
  const items: [number, string, string][] = [
    [c.steps.length, t("step", "étape"), t("steps", "étapes")],
    [c.decisions.length, t("key decision", "décision clé"), t("key decisions", "décisions clés")],
    [mediaCount(c), t("visual", "visuel"), t("visuals", "visuels")],
  ];
  return items.filter(([n]) => n > 0).map(([n, one, many]) => `<span><b>${n}</b> ${n === 1 ? one : many}</span>`).join("");
}

/* a few facts shown when a card is hovered */
function cardFacts(c: CaseStudy): string[] {
  const pick = c.facts.filter(([k]) => /time|calend|dur|period|tool|outil|method|métho/i.test(k));
  return (pick.length ? pick : c.facts).slice(0, 2).map(([, v]) => clean(v)).filter((v) => v && v.length < 90);
}

const cover = (c: CaseStudy) => {
  const th = thumbFor(c);
  if (!th) return "";
  return th.kind === "art" ? th.v : `<img src="${th.v}" alt="" loading="lazy" draggable="false" style="object-position:${th.pos ?? "center"}" />`;
};

const SELECTED = new Set(["magic-map", "suite-numerique"]);
const catColor: Record<string, string> = { product: "#ec2a72", interaction: "#8f6bf0", immersive: "#1fa6a0", games: "#f08a3c", tangible: "#3f9b5e", civic: "#4f7cf0" };


/* ---------- Wendy Mackay's DOIT circle: four questions, each collecting, interpreting and representing ---------- */
const QUAD = [
  { q: () => t("Who is the user?", "Qui est l’utilisateur ?"), c: "#5b6bb0", soft: "#8a93c9" },
  { q: () => t("What is possible?", "Qu’est-ce qui est possible ?"), c: "#3f9d99", soft: "#78b9a4" },
  { q: () => t("What should it be?", "Que doit-il être ?"), c: "#f08a2c", soft: "#ffc76a" },
  { q: () => t("Does it work?", "Est-ce que ça marche ?"), c: "#bd4a5a", soft: "#d27280" },
];
const PHASE = () => [t("collect", "collecter"), t("interpret", "interpréter"), t("represent", "représenter")];
/* outer ring = collect / interpret, centre = represent. Angles run clockwise from the top. */
const DOIT_SEGS: { id: DoitId; quad: number; phase: number; a0: number; a1: number; en: string[]; fr: string[] }[] = [
  { id: "observations", quad: 0, phase: 0, a0: 0, a1: 45, en: ["OBSERVATIONS"], fr: ["OBSERVATIONS"] },
  { id: "needs", quad: 0, phase: 1, a0: 45, a1: 90, en: ["NEEDS"], fr: ["BESOINS"] },
  { id: "inspiration", quad: 1, phase: 0, a0: 90, a1: 135, en: ["INSPIRATION"], fr: ["INSPIRATION"] },
  { id: "design-space", quad: 1, phase: 1, a0: 135, a1: 180, en: ["DESIGN", "SPACE"], fr: ["ESPACE DE", "CONCEPTION"] },
  { id: "design-inputs", quad: 2, phase: 0, a0: 180, a1: 225, en: ["DESIGN", "INPUTS"], fr: ["DONNÉES DE", "CONCEPTION"] },
  { id: "designs", quad: 2, phase: 1, a0: 225, a1: 270, en: ["DESIGNS"], fr: ["CONCEPTIONS"] },
  { id: "questions", quad: 3, phase: 0, a0: 270, a1: 315, en: ["QUESTIONS"], fr: ["QUESTIONS"] },
  { id: "implications", quad: 3, phase: 1, a0: 315, a1: 360, en: ["IMPLICATIONS"], fr: ["IMPLICATIONS"] },
  { id: "insights", quad: 0, phase: 2, a0: 0, a1: 90, en: ["INSIGHTS"], fr: ["CONSTATS"] },
  { id: "categories", quad: 1, phase: 2, a0: 90, a1: 180, en: ["CATE-", "GORIES"], fr: ["CATÉ-", "GORIES"] },
  { id: "prototype", quad: 2, phase: 2, a0: 180, a1: 270, en: ["PROTO-", "TYPE"], fr: ["PROTO-", "TYPE"] },
  { id: "study-design", quad: 3, phase: 2, a0: 270, a1: 360, en: ["STUDY", "DESIGN"], fr: ["PLAN", "D’ÉTUDE"] },
];
const doitLabel = (id: DoitId) => {
  const d = DOIT_SEGS.find((x) => x.id === id)!;
  const w = (lang === "fr" ? d.fr : d.en).join(" ").replace(/- /g, "").replace(/-$/, "");
  return w.charAt(0) + w.slice(1).toLowerCase();
};

function doitHtml(c: CaseStudy): string {
  const used = new Map<DoitId, number[]>();
  c.steps.forEach((st, i) => st.doit?.forEach((id) => used.set(id, [...(used.get(id) ?? []), i])));
  if (!used.size) return "";
  const cx = 250;
  const cy = 250;
  const pt = (r: number, a: number) => `${(cx + r * Math.sin((a * Math.PI) / 180)).toFixed(1)} ${(cy - r * Math.cos((a * Math.PI) / 180)).toFixed(1)}`;
  const ph = PHASE();
  const segs = DOIT_SEGS.map((d) => {
    const inner = d.phase === 2;
    const [r0, r1] = inner ? [0, 118] : [126, 236];
    const path = inner ? `M${cx} ${cy} L${pt(r1, d.a0)} A${r1} ${r1} 0 0 1 ${pt(r1, d.a1)} Z` : `M${pt(r1, d.a0)} A${r1} ${r1} 0 0 1 ${pt(r1, d.a1)} L${pt(r0, d.a1)} A${r0} ${r0} 0 0 0 ${pt(r0, d.a0)} Z`;
    const mid = (d.a0 + d.a1) / 2;
    const [tx, ty] = (inner ? pt(66, mid) : pt(181, mid)).split(" ").map(Number);
    const words = lang === "fr" ? d.fr : d.en;
    const q = QUAD[d.quad];
    const on = used.has(d.id);
    const fill = inner ? q.soft : q.c;
    const ink = inner && d.quad === 2 ? "#6b3d00" : "#fff";
    const lines = [`<tspan x="${tx}" dy="0" class="doit-ph">${ph[d.phase]}</tspan>`, ...words.map((w, k) => `<tspan x="${tx}" dy="${k === 0 ? 14 : 14}" class="doit-w">${w}</tspan>`)].join("");
    const ty0 = ty - (words.length * 14 + 8) / 2 + 4;
    return `<g class="doit-seg${on ? " on" : ""}" data-id="${d.id}" data-steps="${(used.get(d.id) ?? []).join(",")}"${on ? ` role="button" tabindex="0" aria-pressed="false" aria-label="${esc(doitLabel(d.id))}, ${ph[d.phase]}: ${esc(QUAD[d.quad].q())}"` : ` aria-hidden="true"`}><path d="${path}" fill="${fill}"/><text x="${tx}" y="${ty0.toFixed(1)}" text-anchor="middle" fill="${ink}">${lines}</text></g>`;
  }).join("");
  const legend = QUAD.map((q) => `<li><i style="background:${q.c}"></i>${esc(q.q())}</li>`).join("");
  return `<section data-sec class="doit-sec"><h2 class="group-h">${t("DOIT circle", "Cercle DOIT")}</h2>
    <p class="prose-p">${t("We designed this project with Wendy Mackay’s DOIT circle, a design method that moves through four questions. For each one you collect data, interpret it, then represent what you learned. The highlighted steps are the ones we went through. Select one to see where it happened.", "Nous avons conçu ce projet avec le cercle DOIT de Wendy Mackay, une méthode de conception qui suit quatre questions. Pour chacune, on collecte des données, on les interprète, puis on représente ce qu’on a appris. Les étapes en couleur sont celles que nous avons suivies. Sélectionnez-en une pour voir où cela s’est passé.")}</p>
    <div class="doit">
      <svg class="doit-wheel" viewBox="0 0 500 500" role="group" aria-label="${t("The DOIT circle", "Le cercle DOIT")}">${segs}</svg>
      <div class="doit-info">
        <div class="doit-card" aria-live="polite"><p class="doit-hint">${t("Select a highlighted step.", "Sélectionnez une étape en couleur.")}</p></div>
        <ul class="doit-legend">${legend}</ul>
      </div>
    </div></section>`;
}

function wireDoit(root: HTMLElement, sc: HTMLElement, tick: () => void, calm: boolean) {
  const card = root.querySelector<HTMLElement>(".doit-card")!;
  const segs = [...root.querySelectorAll<SVGGElement>(".doit-seg.on")];
  const steps = [...sc.querySelectorAll<HTMLElement>(".step")];
  const pick = (g: SVGGElement) => {
    tick();
    segs.forEach((x) => {
      x.classList.toggle("sel", x === g);
      x.setAttribute("aria-pressed", String(x === g));
    });
    const d = DOIT_SEGS.find((x) => x.id === g.dataset.id)!;
    const q = QUAD[d.quad];
    const where = (g.dataset.steps ?? "").split(",").filter(Boolean).map(Number);
    card.style.setProperty("--c", q.c);
    card.innerHTML = `<p class="doit-q">${esc(q.q())}</p><h3>${esc(doitLabel(d.id))} <small>${PHASE()[d.phase]}</small></h3><p class="doit-where">${t("In this project", "Dans ce projet")}</p><ul>${where.map((i) => `<li><button type="button" data-step="${i}">${esc(steps[i]?.querySelector("h3")?.textContent ?? "")}</button></li>`).join("")}</ul>`;
  };
  segs.forEach((g) => {
    g.addEventListener("click", () => pick(g));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick(g);
      }
    });
  });
  const go = (i: number) => {
    const el = steps[i];
    if (!el) return;
    tick();
    sc.scrollTo({ top: el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 16, behavior: calm ? "auto" : "smooth" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  };
  card.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-step]");
    if (b) go(Number(b.dataset.step));
  });
  /* the small tags on each step also jump back to the circle */
  sc.querySelectorAll<HTMLElement>(".doit-tags button").forEach((b) =>
    b.addEventListener("click", () => {
      tick();
      const seg = segs.find((x) => x.dataset.id === b.dataset.id);
      root.scrollIntoView({ block: "start", behavior: calm ? "auto" : "smooth" });
      if (seg) pick(seg);
    }),
  );
}

function caseHtml(c: CaseStudy): string {
  const facts = c.facts.map(([k, v]) => [k, clean(v)] as const).filter(([, v]) => v);
  const steps = c.steps
    .map(
      (s) => `<article class="step"><h3>${esc(s.title)}</h3>${s.doit ? `<p class="doit-tags" aria-label="DOIT">${s.doit.map((id) => { const d = DOIT_SEGS.find((x) => x.id === id)!; return `<button type="button" data-id="${id}" style="--c:${QUAD[d.quad].c}" title="${esc(QUAD[d.quad].q())}">${esc(doitLabel(id))}<small>${PHASE()[d.phase]}</small></button>`; }).join("")}</p>` : ""}${s.copy ? `<p>${esc(s.copy)}</p>` : ""}${s.bullets ? `<ul class="bul">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${s.table ? tbl(s.table) : ""}${s.media ? `<div class="gallery">${s.media.map(fig).join("")}</div>` : ""}${s.videos ? `<div class="gallery">${s.videos.map(videoFig).join("")}</div>` : ""}${s.externalVideos ? `<div class="gallery">${s.externalVideos.map(externalVideoFig).join("")}</div>` : ""}${s.slots.length ? `<div class="slots">${s.slots.map((x) => slot(x)).join("")}</div>` : ""}${s.note ? `<p class="callout">${esc(s.note)}</p>` : ""}</article>`
    )
    .join("");
  const decisions = c.decisions.map(([h, p]) => `<article class="decision"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join("");
  const outcome = c.outcome
    .map((o) => `<figure class="out">${o.media ? fig(o.media) : slot(o.slot, "tall")}<figcaption><b>${esc(o.title)}</b>${o.copy ? `<span>${esc(o.copy)}</span>` : ""}</figcaption></figure>`)
    .join("");
  const refl = c.reflection.filter((r) => !/TODO/i.test(r));
  let n = 0;
  const scenario = c.scenario
    ? `<section data-sec><h2 class="group-h">${t("The scenario, step by step", "Le scénario, étape par étape")}</h2><div class="scen">${c.scenario
        .map(
          (g) => `<div class="scen-g"><h3>${esc(g.label)}</h3><ol>${g.items
            .map(([tag, text]) => `<li>${tag ? `<b>${esc(tag)}</b>` : ""}<span>${esc(text)}</span></li>`)
            .map((li) => (li.includes("<b>") ? (n++, li) : li))
            .join("")}</ol></div>`
        )
        .join("")}</div></section>`
    : "";
  const videoHero = c.video ? `<figure class="video"><video controls playsinline preload="metadata" poster="${c.video.poster}"><source src="${c.video.src}" type="video/mp4" /></video><figcaption>${esc(c.video.caption)}</figcaption></figure>` : "";
  const embedHero = c.embed ? `<figure class="embed"><iframe src="${c.embed.src}" title="${esc(c.embed.caption)}" loading="lazy" allowfullscreen></iframe><figcaption>${esc(c.embed.caption)}</figcaption></figure>` : "";
  const hero = c.heroStack
    ? `<div class="hero-stack">${c.heroMedia && !Array.isArray(c.heroMedia) ? fig(c.heroMedia) : ""}${embedHero}${videoHero}</div>`
    : c.video
    ? `<figure class="video"><video controls playsinline preload="metadata" poster="${c.video.poster}"><source src="${c.video.src}" type="video/mp4" /></video><figcaption>${esc(c.video.caption)}</figcaption></figure>`
    : c.embed ? `<figure class="embed"><iframe src="${c.embed.src}" title="${esc(c.embed.caption)}" loading="lazy" allowfullscreen></iframe><figcaption>${esc(c.embed.caption)}</figcaption></figure>` : c.poster ? `<div class="poster-full">${fig(c.poster)}</div>` : Array.isArray(c.heroMedia) ? `<div class="gallery">${c.heroMedia.map(fig).join("")}</div>` : c.heroMedia ? fig(c.heroMedia) : slot(c.hero, "hero");
  return `
  <div class="scroll case">
    <div class="case-title" data-top><p>${esc(c.kind)}</p><h1 class="display">${esc(c.title)}</h1><p class="blurb">${esc(c.blurb)}</p></div>
    <div class="case-hero">${hero}</div>
    ${c.links ? `<div class="doc-links">${c.links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg><span><b>${esc(l.label)}</b><small>${esc(l.hint)}</small></span></a>`).join("")}</div>` : ""}
    <div class="glance"><p class="glance-h">${t("At a glance", "En un coup d’œil")}</p>
      <div class="glance-stats">${stats(c)}</div>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>
    <section data-sec><h2 class="group-h">${t("The brief", "Le brief")}</h2><p class="prose-p">${esc(c.brief)}</p></section>
    ${doitHtml(c)}
    <section data-sec><h2 class="group-h">${t("Process", "Processus")}</h2><div class="process">${steps}</div></section>
    ${c.principles ? `<section data-sec><h2 class="group-h">${t("Principles in the design", "Les principes dans la conception")}</h2><ul class="bul">${c.principles.intro.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${tbl(c.principles.table)}</section>` : ""}
    ${scenario}
    ${c.decisions.length ? `<section data-sec><h2 class="group-h">${t("Key decisions", "Décisions clés")}</h2><div class="decisions">${decisions}</div></section>` : ""}
    ${c.outcome.length ? `<section data-sec><h2 class="group-h">${t("Outcome", "Résultat")}</h2><div class="outcome">${outcome}</div></section>` : ""}
    ${c.evaluation ? `<section data-sec><h2 class="group-h">${t("Evaluation", "Évaluation")}</h2><ul class="bul">${c.evaluation.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>${c.evaluationNote ? `<p class="note">${esc(c.evaluationNote)}</p>` : ""}</section>` : ""}
    ${c.future ? `<section data-sec><h2 class="group-h">${t("Future improvements", "Améliorations futures")}</h2><ul class="bul">${c.future.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></section>` : ""}
    ${refl.length ? `<section data-sec><h2 class="group-h">${t("Reflection", "Réflexion")}</h2>${refl.map((r) => `<p class="prose-p">${esc(r)}</p>`).join("")}</section>` : ""}
  </div>`;
}

function lightbox(items: { src: string; alt: string }[], start: number, sfx: Sfx) {
  let i = start;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", items[i].alt);
  const many = items.length > 1;
  box.innerHTML = `<img src="${items[i].src}" alt="${esc(items[i].alt)}" /><button class="lb-x" aria-label="${t("Close", "Fermer")}">×</button>${
    many ? `<button class="lb-n prev" aria-label="${t("Previous image", "Image précédente")}">‹</button><button class="lb-n next" aria-label="${t("Next image", "Image suivante")}">›</button><p class="lb-c"></p>` : ""
  }${items[i].alt ? `<p class="lb-cap"></p>` : ""}`;
  const img = box.querySelector("img")!;
  const count = box.querySelector<HTMLElement>(".lb-c");
  const cap = box.querySelector<HTMLElement>(".lb-cap");
  const paint = () => {
    img.src = items[i].src;
    img.alt = items[i].alt;
    box.setAttribute("aria-label", items[i].alt);
    if (count) count.textContent = `${i + 1} / ${items.length}`;
    if (cap) cap.textContent = items[i].alt;
  };
  const go = (d: number) => {
    i = (i + d + items.length) % items.length;
    sfx.tick();
    paint();
  };
  const close = () => {
    document.removeEventListener("keydown", key, true);
    box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).onfinish = () => box.remove();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (many && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      e.stopPropagation();
      e.preventDefault();
      go(e.key === "ArrowRight" ? 1 : -1);
    }
  };
  box.addEventListener("click", (e) => {
    const n = (e.target as HTMLElement).closest<HTMLElement>(".lb-n");
    if (n) {
      e.stopPropagation();
      go(n.classList.contains("next") ? 1 : -1);
    } else close();
  });
  document.addEventListener("keydown", key, true);
  document.body.appendChild(box);
  paint();
  sfx.spot();
  box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
  box.querySelector<HTMLElement>(".lb-x")!.focus();
}
function renderWork(body: HTMLElement, ctx: Ctx, arg?: string) {
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pref = (() => {
    try {
      return localStorage.getItem("work.view") === "list" ? "list" : "grid";
    } catch {
      return "grid";
    }
  })();
  const st = { cat: "all", q: "", view: pref as "grid" | "list", open: cases.find((c) => c.id === arg)?.id ?? null as string | null };
  const count = (cat: string) => cases.filter((c) => cat === "all" || caseCategories[c.id]?.includes(cat)).length;
  const visible = () => {
    const q = st.q.trim().toLowerCase();
    return cases.filter((c) => (st.cat === "all" || caseCategories[c.id]?.includes(st.cat)) && (!q || [c.title, c.kind, c.blurb, ...c.facts.map(([, v]) => v)].join(" ").toLowerCase().includes(q)));
  };

  body.innerHTML = `
  <aside class="side projects" aria-label="${t("Projects", "Projets")}">
    <p class="side-h">${t("My work", "Mes projets")}</p>
    <button type="button" class="side-i wk-all" data-all><span class="mini">${icon("work")}</span><span><b>${t("All projects", "Tous les projets")}</b><small>${cases.length} ${t("files", "fichiers")}</small></span></button>
    <p class="side-h">${t("Categories", "Catégories")}</p>
    <div class="wk-cats">${projectCategories
      .filter((k) => count(k.id) > 0)
      .map((k) => `<button type="button" class="side-i cat" data-cat="${k.id}" style="--c:${catColor[k.id] ?? "#ec2a72"}"><i class="dot"></i><span><b>${esc(k.label)}</b></span><em>${count(k.id)}</em></button>`)
      .join("")}</div>
    <p class="side-h">${t("Files", "Fichiers")}</p>
    <div class="project-list"></div>
  </aside>
  <main class="main" id="case-main"></main>`;
  const list = body.querySelector<HTMLElement>(".project-list")!;
  const main = body.querySelector<HTMLElement>("#case-main")!;

  const paintSide = () => {
    body.querySelectorAll<HTMLElement>(".wk-all").forEach((b) => b.classList.toggle("on", st.open === null && st.cat === "all"));
    body.querySelectorAll<HTMLElement>(".cat").forEach((b) => b.classList.toggle("on", st.open === null && b.dataset.cat === st.cat));
    list.innerHTML = visible()
      .map((c) => `<button type="button" class="side-i" data-case="${c.id}"><span class="wk-th">${cover(c)}</span><span><b>${esc(c.title)}</b><small>${esc(c.kind)}</small></span></button>`)
      .join("");
    list.querySelectorAll<HTMLElement>(".side-i").forEach((b) => {
      b.classList.toggle("on", b.dataset.case === st.open);
      b.addEventListener("click", () => {
        ctx.sfx.tick();
        showCase(b.dataset.case!);
      });
    });
  };

  /* ---------- the folder: a gallery of files ---------- */
  const cardHtml = (c: CaseStudy, i: number) => {
    const tags = (caseCategories[c.id] ?? []).map((k) => projectCategories.find((x) => x.id === k)).filter(Boolean);
    const facts = cardFacts(c);
    return `<button type="button" class="wk-card" data-case="${c.id}" style="--i:${i}">
      <span class="wk-cover">${cover(c)}${SELECTED.has(c.id) ? `<i class="wk-sel">★ ${t("Selected", "Sélection")}</i>` : ""}
        <span class="wk-over">${facts.map((f) => `<span>${esc(f)}</span>`).join("")}<b>${t("Open the project", "Ouvrir le projet")} →</b></span></span>
      <span class="wk-meta"><small>${esc(c.kind)}</small><b>${esc(c.title)}</b><em>${esc(c.blurb)}</em>
        <span class="wk-tags">${tags.map((k) => `<i style="--c:${catColor[k!.id] ?? "#ec2a72"}">${esc(k!.label)}</i>`).join("")}</span>
      </span></button>`;
  };

  const showGallery = (focusId?: string) => {
    st.open = null;
    main.innerHTML = `<div class="wk">
      <header class="wk-bar">
        <nav class="wk-crumb" aria-label="${t("Location", "Emplacement")}"><b>${t("My work", "Mes projets")}</b><span class="wk-n"></span></nav>
        <label class="wk-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" placeholder="${t("Search projects", "Rechercher un projet")}" aria-label="${t("Search projects", "Rechercher un projet")}" value="${esc(st.q)}" /></label>
        <div class="wk-seg" role="group" aria-label="${t("View", "Affichage")}">
          <button type="button" data-v="grid" aria-label="${t("Gallery", "Galerie")}" aria-pressed="${st.view === "grid"}"><svg viewBox="0 0 20 20"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/></svg></button>
          <button type="button" data-v="list" aria-label="${t("List", "Liste")}" aria-pressed="${st.view === "list"}"><svg viewBox="0 0 20 20"><path d="M3 5h14M3 10h14M3 15h14"/></svg></button>
        </div>
      </header>
      <div class="scroll wk-scroll"><div class="wk-grid" data-v="${st.view}"></div></div></div>`;
    const grid = main.querySelector<HTMLElement>(".wk-grid")!;
    const n = main.querySelector<HTMLElement>(".wk-n")!;
    const input = main.querySelector<HTMLInputElement>("input")!;
    const fill = () => {
      const v = visible();
      n.textContent = `${v.length} ${v.length === 1 ? t("project", "projet") : t("projects", "projets")}`;
      grid.dataset.v = st.view;
      grid.innerHTML = v.length
        ? v.map(cardHtml).join("")
        : `<div class="wk-empty"><b>${t("Nothing matches that.", "Rien ne correspond.")}</b><span>${t("Try another word, or look through all the projects.", "Essayez un autre mot, ou parcourez tous les projets.")}</span><button type="button" class="btn ghost" data-clear>${t("Show all projects", "Voir tous les projets")}</button></div>`;
      if (calm) grid.classList.add("calm");
      paintSide();
    };
    fill();
    input.addEventListener("input", () => {
      st.q = input.value;
      fill();
    });
    main.querySelectorAll<HTMLElement>(".wk-seg button").forEach((b) =>
      b.addEventListener("click", () => {
        ctx.sfx.tick();
        st.view = b.dataset.v === "list" ? "list" : "grid";
        try {
          localStorage.setItem("work.view", st.view);
        } catch {
          /* private mode */
        }
        main.querySelectorAll<HTMLElement>(".wk-seg button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        fill();
      }),
    );
    grid.addEventListener("click", (e) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-clear]")) {
        st.q = "";
        st.cat = "all";
        input.value = "";
        fill();
        return;
      }
      const card = el.closest<HTMLElement>(".wk-card");
      if (card) {
        ctx.sfx.tick();
        showCase(card.dataset.case!);
      }
    });
    /* arrow keys move between cards */
    grid.addEventListener("keydown", (e) => {
      const cards = [...grid.querySelectorAll<HTMLElement>(".wk-card")];
      const i = cards.indexOf(document.activeElement as HTMLElement);
      if (i < 0 || !["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      const cols = Math.max(1, cards.filter((c) => c.offsetTop === cards[0].offsetTop).length);
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? cols : -cols;
      const to = cards[i + d];
      if (to) {
        e.preventDefault();
        to.focus();
      }
    });
    if (focusId) grid.querySelector<HTMLElement>(`.wk-card[data-case="${focusId}"]`)?.focus({ preventScroll: true });
  };

  /* ---------- one project: easier to read ---------- */
  const showCase = (id: string) => {
    const idx = cases.findIndex((c) => c.id === id);
    const c = cases[idx] ?? cases[0];
    st.open = c.id;
    const prev = cases[(idx - 1 + cases.length) % cases.length];
    const next = cases[(idx + 1) % cases.length];
    main.innerHTML = `<div class="wk">
      <header class="wk-bar">
        <button type="button" class="wk-back"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 4-6 6 6 6"/></svg>${t("My work", "Mes projets")}</button>
        <nav class="wk-crumb" aria-label="${t("Location", "Emplacement")}"><span>${t("My work", "Mes projets")}</span><i aria-hidden="true">›</i><b>${esc(c.title)}</b></nav>
        <div class="wk-pn"><button type="button" data-go="${prev.id}" aria-label="${t("Previous project", "Projet précédent")}: ${esc(prev.title)}" title="${esc(prev.title)}">‹</button><span>${idx + 1} / ${cases.length}</span><button type="button" data-go="${next.id}" aria-label="${t("Next project", "Projet suivant")}: ${esc(next.title)}" title="${esc(next.title)}">›</button></div>
      </header>
      <nav class="wk-chap" aria-label="${t("Sections", "Sections")}"></nav>
      <div class="wk-prog" aria-hidden="true"><i></i></div>
      ${caseHtml(c)}</div>`;
    paintSide();
    const sc = main.querySelector<HTMLElement>(".scroll")!;
    sc.scrollTop = 0;
    main.querySelector(".wk-back")!.addEventListener("click", () => {
      ctx.sfx.tick();
      showGallery(c.id);
    });
    main.querySelectorAll<HTMLElement>(".wk-pn [data-go]").forEach((b) =>
      b.addEventListener("click", () => {
        ctx.sfx.tick();
        showCase(b.dataset.go!);
      }),
    );
    /* image viewer: browse every picture of this project */
    const zooms = [...main.querySelectorAll<HTMLElement>(".zoom")];
    const items = zooms.map((z) => {
      const im = z.querySelector("img")!;
      return { src: im.src, alt: im.alt };
    });
    zooms.forEach((z, k) => z.addEventListener("click", () => lightbox(items, k, ctx.sfx)));
    const doit = sc.querySelector<HTMLElement>(".doit");
    if (doit) wireDoit(doit, sc, () => ctx.sfx.tick(), calm);
    /* chapter chips, reading progress and "where am I" */
    const secs = [...sc.querySelectorAll<HTMLElement>("[data-top], section[data-sec]")];
    const chap = main.querySelector<HTMLElement>(".wk-chap")!;
    chap.innerHTML = secs
      .map((el, k) => `<button type="button" data-k="${k}">${k === 0 ? t("Overview", "Aperçu") : esc(el.querySelector("h2")?.textContent ?? "")}</button>`)
      .join("");
    const chips = [...chap.querySelectorAll<HTMLElement>("button")];
    const bar = main.querySelector<HTMLElement>(".wk-prog i")!;
    let raf = 0;
    const spy = () => {
      raf = 0;
      const max = sc.scrollHeight - sc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, sc.scrollTop / max) : 0})`;
      let on = 0;
      secs.forEach((el, k) => {
        if (el.offsetTop - sc.offsetTop <= sc.scrollTop + 90) on = k;
      });
      if (max > 0 && sc.scrollTop >= max - 4) on = secs.length - 1;
      chips.forEach((ch, k) => {
        const is = k === on;
        ch.classList.toggle("on", is);
        if (is) ch.setAttribute("aria-current", "true");
        else ch.removeAttribute("aria-current");
      });
    };
    sc.addEventListener("scroll", () => (raf ||= requestAnimationFrame(spy)), { passive: true });
    chips.forEach((ch) =>
      ch.addEventListener("click", () => {
        ctx.sfx.tick();
        const el = secs[Number(ch.dataset.k)];
        sc.scrollTo({ top: Number(ch.dataset.k) === 0 ? 0 : el.offsetTop - sc.offsetTop - 12, behavior: calm ? "auto" : "smooth" });
      }),
    );
    spy();
    main.querySelector<HTMLElement>(".wk-back")!.focus({ preventScroll: true });
  };

  /* sidebar: all projects and categories */
  body.querySelector(".wk-all")!.addEventListener("click", () => {
    ctx.sfx.tick();
    st.cat = "all";
    showGallery();
  });
  body.querySelectorAll<HTMLElement>(".cat").forEach((b) =>
    b.addEventListener("click", () => {
      ctx.sfx.tick();
      st.cat = st.cat === b.dataset.cat ? "all" : b.dataset.cat!;
      showGallery();
    }),
  );

  if (st.open) showCase(st.open);
  else showGallery();
}

/* ---------- Experience (Notes) ---------- */
function renderExperience(body: HTMLElement, ctx: Ctx) {
  const entry = (r: ExperienceRole) =>
    `<h1 class="display">${esc(r.title)}</h1><p class="role">${esc(r.place)}${r.where ? ` · ${esc(r.where)}` : ""} · ${esc(r.dates)}</p>${r.copy ? `<p class="prose-p">${esc(r.copy)}</p>` : ""}${r.bullets?.length ? `<ul class="bul">${r.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${r.tags?.length ? `<div class="chips">${r.tags.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}`;
  const notes = [
    ...roles.map((r) => ({ key: r.title, sub: `${r.place} · ${r.dates}`, html: entry(r) })),
    ...education.map((e) => ({ key: e.title, sub: `${e.place} · ${e.dates}`, html: entry(e) })),
    { key: t("Skills & languages", "Compétences & langues"), sub: t("From my CV", "D’après mon CV"), html: `<h1 class="display">${t("Skills & languages", "Compétences & langues")}</h1><dl class="tk">${toolkit.map((k) => `<dt>${esc(k.label)}</dt><dd>${esc(k.items)}</dd>`).join("")}</dl>` },
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

/* ---------- CV ---------- */
const CV_URL = t("cv-en.pdf", "cv-fr.pdf");

function renderCV(body: HTMLElement) {
  body.innerHTML = `
  <div class="cvapp">
    <div class="cv-top"><div><h1 class="display">${t("Curriculum vitae", "Curriculum vitae")}</h1><p class="role" id="cv-name">Lydia Benosmane · ${esc(hero.role)}</p></div><div class="cv-actions">
      <a class="btn ghost" id="cv-open" target="_blank" rel="noreferrer">${t("Open in new tab", "Ouvrir dans un onglet")}</a><a class="btn" id="cv-dl" download="${t("Lydia-Benosmane-CV-EN.pdf", "Lydia-Benosmane-CV-FR.pdf")}">${t("Download", "Télécharger")}</a></div></div>
    <div class="cv-stage" id="cv-stage"></div>
  </div>`;
  const stage = body.querySelector<HTMLElement>("#cv-stage")!;
  stage.innerHTML = `<iframe title="Lydia Benosmane CV" src="${CV_URL}#toolbar=0&navpanes=0&view=FitH"></iframe>`;
  (body.querySelector("#cv-open") as HTMLAnchorElement).href = CV_URL;
  (body.querySelector("#cv-dl") as HTMLAnchorElement).href = CV_URL;
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


/* ---------- Music and Videos ---------- */
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
  return (body: HTMLElement) => {
    const music = kind === "music";
    const src = music
      ? toSpotify(DEFAULT_PLAYLIST, document.body.classList.contains("dark"))!
      : toYouTube(DEFAULT_VIDEO)!;
    body.innerHTML = `
    <div class="scroll emb">
      <div class="emb-heading">${music ? '<img class="emb-icon" src="music-note.png" alt="" />' : ""}<h1 class="display">${music ? t("Music", "Musique") : t("Videos", "Vidéos")}</h1></div>
      <p class="lede">${music ? t("What I have on repeat.", "Ce que j’écoute en boucle.") : t("Things I watched, made or just liked.", "Ce que j’ai regardé, fait ou simplement aimé.")}</p>
      <div class="emb-frame ${music ? "sp" : "yt"}"><iframe src="${src}" title="${music ? "Spotify" : "YouTube"}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
    </div>`;
  };
}

const BASE_APPS: AppDef[] = [
  { id: "about", name: t("About Lydia", "À propos de Lydia"), w: 800, h: 640, keywords: "about me lydia bio profile hello propos présentation bonjour", render: renderAbout },
  { id: "work", name: t("Work", "Projets"), w: 1060, h: 740, split: 232, keywords: "work projects case studies lineup zen rooms portfolio projets travaux études de cas", render: renderWork, onArg: (b, a) => {
    const row = () => b.querySelector<HTMLElement>(`.side-i[data-case="${a}"]`);
    if (!row()) b.querySelector<HTMLElement>(".wk-all")?.click();
    row()?.click();
  } },
  { id: "experience", name: t("Experience", "Parcours"), w: 820, h: 560, split: 232, keywords: "experience roles skills cv resume jobs parcours formation compétences", render: renderExperience },
  { id: "cv", name: "CV", w: 860, h: 700, keywords: "cv resume curriculum vitae download pdf télécharger", render: renderCV },
  { id: "photos", name: t("Photos", "Photos"), w: 1040, h: 720, keywords: "photos book album cats sea beach algiers photography images galerie livre chats mer plage", render: renderPhotos },
  { id: "music", name: t("Music", "Musique"), w: 560, h: 660, keywords: "music spotify playlist songs listen musique écouter", render: renderEmbed("music") },
  { id: "mail", name: t("Contact", "Contact"), w: 640, h: 520, keywords: "mail contact email hire hello linkedin instagram message courriel écrire", render: renderMail },
];

/* Messages, Maps, Safari and Calendar sit before Contact in the Dock */
export const APPS: AppDef[] = [...BASE_APPS.slice(0, -1), ...extraApps(), BASE_APPS[BASE_APPS.length - 1]];
