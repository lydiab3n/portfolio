import { cases, contact, education, hero, roles, toolkit, type CaseStudy, type ExperienceRole, type DataTable, type ExternalVideoMedia, type Media, type VideoMedia } from "./content";
import type { Sfx } from "./sound";
import { t } from "./i18n";
import { renderAbout } from "./about";
import { renderPhotos } from "./photobook";
import { extraApps, extraIcon } from "./extra-apps";

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
  { id: "work", name: t("Work", "Projets"), w: 1060, h: 740, split: 232, keywords: "work projects case studies lineup zen rooms portfolio projets travaux études de cas", render: renderWork, onArg: (b, a) => b.querySelector<HTMLElement>(`.side-i[data-case="${a}"]`)?.click() },
  { id: "experience", name: t("Experience", "Parcours"), w: 820, h: 560, split: 232, keywords: "experience roles skills cv resume jobs parcours formation compétences", render: renderExperience },
  { id: "cv", name: "CV", w: 860, h: 700, keywords: "cv resume curriculum vitae download pdf télécharger", render: renderCV },
  { id: "photos", name: t("Photos", "Photos"), w: 1040, h: 720, keywords: "photos book album cats sea beach algiers photography images galerie livre chats mer plage", render: renderPhotos },
  { id: "music", name: t("Music", "Musique"), w: 560, h: 660, keywords: "music spotify playlist songs listen musique écouter", render: renderEmbed("music") },
  { id: "mail", name: t("Contact", "Contact"), w: 640, h: 520, keywords: "mail contact email hire hello linkedin instagram message courriel écrire", render: renderMail },
];

/* Messages, Maps, Safari and Calendar sit before Contact in the Dock */
export const APPS: AppDef[] = [...BASE_APPS.slice(0, -1), ...extraApps(), BASE_APPS[BASE_APPS.length - 1]];
