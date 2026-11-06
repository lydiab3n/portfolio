import { about, cases, contact, education, hero, roles, skills, type CaseStudy, type DataTable, type Media } from "../content";
import { t } from "../i18n";
import { CATS } from "./chat";
import { thisThatHtml } from "./thisthat";

export interface PanelDef {
  title: string;
  html: string;
  status: string;
  small?: boolean;
  flush?: boolean;
  /** shown as a back button */
  back?: { label: string; to: string };
}

/** Spotify playlist id shown by the guitar. Replace with your own playlist. */
const SPOTIFY_PLAYLIST = "37i9dQZF1DXcBWIGoYBM5M";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const SEA: Media[] = [
  { src: "room/sea-sunset.jpg", alt: t("Sunset over a rocky bay", "Coucher de soleil sur une baie rocheuse"), caption: t("The view from the window", "La vue depuis la fenêtre") },
  { src: "room/sea-rocks.jpg", alt: t("Rocks above clear green water", "Des rochers au-dessus d'une eau verte et claire") },
  { src: "room/shells.jpg", alt: t("Three iridescent shells on weathered wood", "Trois coquillages nacrés sur du bois patiné") },
];

const fig = (m: Media) =>
  `<figure class="${m.wide ? "wide" : ""}"><button type="button" data-zoom="${m.src}" data-alt="${esc(m.alt)}" aria-label="${t("Enlarge", "Agrandir")}: ${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" draggable="false" /></button>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ""}</figure>`;

const tbl = (d: DataTable) =>
  `<div class="tbl"><table>${d.caption ? `<caption>${esc(d.caption)}</caption>` : ""}<thead><tr>${d.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${d.rows
    .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join("")}</tr>`)
    .join("")}</tbody></table></div>`;

const clean = (v: string) => v.split(" · ").filter((x) => !/TODO/i.test(x)).join(" · ");

function thumb(c: CaseStudy): string | null {
  if (c.poster) return c.poster.src;
  if (Array.isArray(c.heroMedia)) return c.heroMedia[0]?.src ?? null;
  if (c.heroMedia) return c.heroMedia.src;
  if (c.video) return c.video.poster;
  for (const s of c.steps) if (s.media?.[0]) return s.media[0].src;
  return c.outcome.find((o) => o.media)?.media?.src ?? null;
}

function heroOf(c: CaseStudy): string {
  if (c.video) return `<figure class="hero-m"><video controls playsinline preload="metadata" poster="${c.video.poster}"><source src="${c.video.src}" type="video/mp4" /></video><figcaption>${esc(c.video.caption)}</figcaption></figure>`;
  if (c.embed) return `<figure class="hero-m"><iframe src="${c.embed.src}" title="${esc(c.embed.caption)}" loading="lazy" allowfullscreen></iframe><figcaption>${esc(c.embed.caption)}</figcaption></figure>`;
  if (c.poster) return `<div class="hero-m gallery">${fig(c.poster)}</div>`;
  if (Array.isArray(c.heroMedia)) return `<div class="hero-m gallery">${c.heroMedia.map(fig).join("")}</div>`;
  if (c.heroMedia) return `<div class="hero-m gallery">${fig(c.heroMedia)}</div>`;
  return "";
}

function caseBody(c: CaseStudy): string {
  const facts = c.facts.map(([k, v]) => [k, clean(v)] as const).filter(([, v]) => v);
  const steps = c.steps
    .map(
      (s) =>
        `<article class="step"><h3>${esc(s.title)}</h3>${s.copy ? `<p>${esc(s.copy)}</p>` : ""}${s.bullets ? `<ul class="bul">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${s.table ? tbl(s.table) : ""}${s.media ? `<div class="gallery">${s.media.map(fig).join("")}</div>` : ""}${s.videos ? s.videos.map((v) => `<figure class="hero-m"><video controls playsinline preload="metadata"><source src="${v.src}" type="video/mp4" /></video><figcaption>${esc(v.caption)}</figcaption></figure>`).join("") : ""}${s.externalVideos ? s.externalVideos.map((v) => `<figure class="hero-m"><iframe src="${v.src}" title="${esc(v.caption)}" loading="lazy" allowfullscreen></iframe><figcaption>${esc(v.caption)}</figcaption></figure>`).join("") : ""}${s.note ? `<p class="callout">${esc(s.note)}</p>` : ""}</article>`,
    )
    .join("");
  const refl = c.reflection.filter((r) => !/TODO/i.test(r));
  return `
  <h2 class="big">${esc(c.title)}</h2>
  <p class="blurb">${esc(c.blurb)}</p>
  ${heroOf(c)}
  ${c.links ? `<div class="doc-links">${c.links.map((l) => `<a href="${l.href}" target="_blank" rel="noreferrer">${esc(l.label)}<small>${esc(l.hint)}</small></a>`).join("")}</div>` : ""}
  <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  <h3>${t("The brief", "Le brief")}</h3><p>${esc(c.brief)}</p>
  <h3>${t("Process", "Processus")}</h3>${steps}
  ${c.principles ? `<h3>${t("Principles in the design", "Les principes dans la conception")}</h3><ul class="bul">${c.principles.intro.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>${tbl(c.principles.table)}` : ""}
  ${c.scenario ? `<h3>${t("The scenario, step by step", "Le scénario, étape par étape")}</h3><div class="scen">${c.scenario.map((g) => `<h4>${esc(g.label)}</h4><ol>${g.items.map(([tag, text]) => `<li>${tag ? `<b>${esc(tag)}</b>` : ""}${esc(text)}</li>`).join("")}</ol>`).join("")}</div>` : ""}
  ${c.decisions.length ? `<h3>${t("Key decisions", "Décisions clés")}</h3><div class="decisions">${c.decisions.map(([h, p]) => `<article class="decision"><h4>${esc(h)}</h4><p>${esc(p)}</p></article>`).join("")}</div>` : ""}
  ${c.outcome.length ? `<h3>${t("Outcome", "Résultat")}</h3><div class="outcome">${c.outcome.map((o) => `<figure>${o.media ? `<div class="gallery">${fig(o.media)}</div>` : ""}<figcaption><b>${esc(o.title)}</b>${o.copy ? esc(o.copy) : ""}</figcaption></figure>`).join("")}</div>` : ""}
  ${c.evaluation ? `<h3>${t("Evaluation", "Évaluation")}</h3><ul class="bul">${c.evaluation.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>${c.evaluationNote ? `<p>${esc(c.evaluationNote)}</p>` : ""}` : ""}
  ${c.future ? `<h3>${t("Future improvements", "Améliorations futures")}</h3><ul class="bul">${c.future.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
  ${refl.length ? `<h3>${t("Reflection", "Réflexion")}</h3>${refl.map((r) => `<p>${esc(r)}</p>`).join("")}` : ""}`;
}

export function panel(id: string, arg?: string): PanelDef {
  switch (id) {
    case "thisthat":
      return { title: t("this-or-that.app", "ceci-ou-cela.app"), status: t("✦ are we alike?", "✦ on se ressemble ?"), small: true, html: thisThatHtml() };
    case "about":
      return {
        title: t("About me", "À propos de moi"),
        status: t("✦ nice to meet you", "✦ enchantée"),
        html: `<div class="about">
          <figure class="sticker"><img src="lydia-portrait.jpg" alt="${esc(about.photoAlt)}" draggable="false" /></figure>
          <div>
            <h2 class="big">Lydia Benosmane</h2>
            <p class="role">${esc(hero.role)}, ${esc(hero.place)}</p>
            <p class="status"><i></i>${esc(hero.status)}</p>
            <p class="lede">${esc(hero.tagline)}</p>
            ${about.paragraphs.map((p) => `<p>${p}</p>`).join("")}
            <ul class="chips">${about.tags.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <h3>${t("Favourites", "Favoris")}</h3>
            <ul class="rows">${about.favourites.map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("")}</ul>
            <h3>${t("What I do", "Ce que je fais")}</h3>
            <ul class="chips">${skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          </div></div>`,
      };
    case "work":
      return {
        title: t("projects.exe", "projets.exe"),
        status: `✦ ${cases.length} ${t("projects", "projets")}`,
        html: `<h2 class="big">${t("Things I made", "Ce que j'ai fabriqué")}</h2>
          <p class="role">${t("Pick one to read the whole story.", "Choisissez-en un pour lire toute l'histoire.")}</p>
          <div class="tiles">${cases
            .map((c) => {
              const src = thumb(c);
              return `<button type="button" class="tile" data-case="${c.id}"><span class="ph">${src ? `<img src="${src}" alt="" loading="lazy" draggable="false" />` : ""}</span><b>${esc(c.title)}</b><small>${esc(c.kind)}</small><span class="bl">${esc(c.blurb)}</span></button>`;
            })
            .join("")}</div>`,
      };
    case "case": {
      const c = cases.find((x) => x.id === arg) ?? cases[0];
      return {
        title: `${c.title}.exe`,
        status: `✦ ${c.kind}`,
        html: `<p class="kind">${esc(c.kind)}</p>${caseBody(c)}`,
        back: { label: t("All projects", "Tous les projets"), to: "work" },
      };
    }
    case "exp":
      return {
        title: t("experience.doc", "parcours.doc"),
        status: `✦ ${roles.length} ${t("roles", "expériences")}, ${education.length} ${t("degrees", "diplômes")}`,
        html: `<h2 class="big">${t("Where I've been", "D'où je viens")}</h2>
          <div class="tl">${roles
            .map((r) => `<article><h3>${esc(r.title)}, ${esc(r.place)}</h3><p class="when">${esc(r.dates)}${r.where ? `, ${esc(r.where)}` : ""}</p>${r.copy ? `<p>${esc(r.copy)}</p>` : ""}${r.bullets?.length ? `<ul class="bul">${r.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${r.tags?.length ? `<ul class="chips">${r.tags.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</article>`)
            .join("")}${education
            .map((e) => `<article class="edu"><h3>${esc(e.title)}</h3><p class="when">${esc(e.place)}, ${esc(e.dates)}</p>${e.bullets?.length ? `<ul class="bul">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</article>`)
            .join("")}</div>`,
      };
    case "cv":
      return {
        title: t("resume.pdf", "cv.pdf"),
        status: "✦ pdf",
        flush: true,
        html: `<div class="cv-wrap"><div class="cv-top"><h2 class="big" style="font-size:clamp(22px,3vw,32px)">${t("Résumé", "CV")}</h2><div class="row"><a class="gloss" href="${t("cv-en.pdf", "cv-fr.pdf")}" target="_blank" rel="noreferrer">${t("Open in a new tab", "Ouvrir dans un onglet")}</a><a class="gloss pink" href="${t("cv-en.pdf", "cv-fr.pdf")}" download="${t("Lydia-Benosmane-CV-EN.pdf", "Lydia-Benosmane-CV-FR.pdf")}">${t("Download", "Télécharger")}</a></div></div><div class="cv-frame-wrap"><iframe title="${t("Lydia Benosmane's résumé", "CV de Lydia Benosmane")}" src="${t("cv-en.pdf", "cv-fr.pdf")}#toolbar=0&navpanes=0&view=FitH"></iframe></div></div>`,
      };
    case "phone":
      return {
        title: t("contact", "contact"),
        status: t("pick a number", "choisis un numéro"),
        html: phoneScene(),
      };
    case "music":
      return {
        title: t("music.mp3", "musique.mp3"),
        status: "spotify",
        html: `<h2 class="big">${t("Turn it up", "Plus fort")}</h2><p class="role">${t("The electric guitar is here because I love it. This is what I listen to.", "La guitare électrique est là parce que je l'adore. Voilà ce que j'écoute.")}</p>
          <iframe class="embed" style="margin-top:22px;height:352px" src="https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST}?theme=0" title="Spotify" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
      };
    case "algiers":
      return {
        title: t("postcard.jpg", "carte-postale.jpg"),
        status: "Alger",
        html: `<h2 class="big">Alger</h2>
          <p class="role">${t("Where I come from", "D'où je viens")}</p>
          <p>${t("Algiers, Algeria is where I come from. Today I live near Paris.", "Alger, en Algérie, c'est d'où je viens. Aujourd'hui je vis près de Paris.")}</p>
          <div class="gallery" style="margin-top:22px"><figure class="wide"><button type="button" data-zoom="room/algiers.jpg" data-alt="${esc(t("Old colour postcard of the harbour and the white city of Algiers", "Ancienne carte postale en couleur du port et de la ville blanche d'Alger"))}"><img src="room/algiers.jpg" alt="${esc(t("Old colour postcard of the harbour and the white city of Algiers", "Ancienne carte postale en couleur du port et de la ville blanche d'Alger"))}" loading="lazy" draggable="false" /></button><figcaption>${t("The harbour of Algiers, around 1899. Photochrom print, public domain, Library of Congress via Wikimedia Commons.", "Le port d'Alger, vers 1899. Photochrome, domaine public, Bibliothèque du Congrès via Wikimedia Commons.")}</figcaption></figure></div>`,
      };
    case "paris":
      return {
        title: t("where-i-live.map", "ou-jhabite.map"),
        status: hero.place,
        small: true,
        html: `<h2 class="big" style="font-size:34px">${t("Near Paris", "Près de Paris")}</h2>
          <p class="role">${esc(hero.place)}</p>
          <p>${t("I live in the Paris area. I study Human-Computer Interaction at Université Paris-Saclay and tutor children in Paris at Parkours.", "Je vis en région parisienne. J'étudie l'interaction homme-machine à l'Université Paris-Saclay et je donne des cours à des enfants à Paris chez Parkours.")}</p>
          <p>${t("Finding the best matcha in Paris is still on my to-do list.", "Trouver le meilleur matcha de Paris est toujours sur ma liste.")}</p>
          <div class="row"><button type="button" class="gloss pink" data-open="phone">${t("Say hello", "Dire bonjour")}</button></div>`,
      };
    case "sea":
      return {
        title: t("the-sea.jpg", "la-mer.jpg"),
        status: `✦ ${SEA.length} ${t("photos", "photos")}`,
        html: `<h2 class="big">${t("Wish you were here", "Vous me manquez ici")}</h2>
          <p class="role">${t("Where my head goes when the screen stays on too long.", "Là où ma tête part quand l'écran reste allumé trop longtemps.")}</p>
          <div class="sea-grid">${SEA.map((m) => `<button type="button" data-zoom="${m.src}" data-alt="${esc(m.alt)}" aria-label="${t("Enlarge", "Agrandir")}: ${esc(m.alt)}"><img src="${m.src}" alt="${esc(m.alt)}" loading="lazy" draggable="false" /></button>`).join("")}</div>`,
      };
    case "cats":
      return {
        title: t("the-cats.jpg", "les-chats.jpg"),
        status: "2 cats, 0 regrets",
        html: `<h2 class="big">${t("Meet the cats", "Les chats")}</h2>
          <p class="role">${t("Two orange cats live in the room. They talk, if you ask nicely.", "Deux chats orange vivent dans la chambre. Ils parlent, si tu demandes gentiment.")}</p>
          <div class="cats">${CATS.map(
            (c) => `<figure class="cat-card"><div class="sticker"><img src="${c.photo}" alt="${esc(c.photoAlt)}" draggable="false" /></div><figcaption><b>${esc(c.name)}</b><span>${esc(c.bio)}</span><button type="button" class="gloss pink" data-chat="${c.id}">${t("Talk to", "Parler à")} ${esc(c.name)}</button></figcaption></figure>`,
          ).join("")}</div>`,
      };
    case "todo":
      return {
        title: t("to-do.txt", "a-faire.txt"),
        status: "✦ 2 / 6",
        small: true,
        html: `<h2 class="big" style="font-size:30px">${t("To do", "À faire")}</h2>
          <ul class="todo-list">
            <li>${t("Land my dream UX internship", "Décrocher le stage UX de mes rêves")}</li>
            <li>${t("Design something that makes people smile", "Créer un design qui donne le sourire")}</li>
            <li class="done">${t("Make peace with Figma Auto Layout", "Faire la paix avec l'Auto Layout de Figma")}</li>
            <li>${t("Finish my Master's with my sanity intact", "Finir mon Master sans perdre la tête")}</li>
            <li>${t("Find the best matcha in Paris", "Trouver le meilleur matcha de Paris")}</li>
            <li class="done">${t("Stop overthinking every pixel", "Arrêter de trop réfléchir à chaque pixel")}</li>
          </ul>
          <div class="row"><button type="button" class="gloss pink" data-open="phone">${t("Say hello", "Dire bonjour")}</button></div>`,
      };
    default:
      return { title: "", html: "", status: "" };
  }
}

/* ---------- the rotary phone close-up ---------- */
const HOLE_R = 58;
const DIAL = { cx: 210, cy: 236 };
export const dialAngle = (n: number) => 95 - (n - 1) * 28;
export const dialRotation = (n: number) => 30 + (n - 1) * 28;
const pos = (deg: number, r: number) => [DIAL.cx + Math.sin((deg * Math.PI) / 180) * r, DIAL.cy - Math.cos((deg * Math.PI) / 180) * r] as const;

function phoneSvg(): string {
  const nums = Array.from({ length: 10 }, (_, i) => i + 1);
  const plate = nums.map((n) => { const [x, y] = pos(dialAngle(n), HOLE_R); return `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Playfair Display, serif" font-size="15" fill="#6b3a4c">${n === 10 ? 0 : n}</text>`; }).join("");
  const holes = nums.map((n) => { const [x, y] = pos(dialAngle(n), HOLE_R); return `<g class="hole" data-dial="${n}" tabindex="0" role="button" aria-label="${t("Dial", "Composer")} ${n === 10 ? 0 : n}"><circle cx="${x}" cy="${y}" r="15" fill="transparent"/><circle cx="${x}" cy="${y}" r="16.5" fill="none" stroke="#b9708a" stroke-width="1.2"/></g>`; }).join("");
  const [sx, sy] = pos(125, 84);
  return `<svg viewBox="0 0 420 380" class="big-phone" aria-hidden="false" role="img" aria-label="${t("A pink rotary telephone", "Un téléphone rose à cadran")}">
  <defs>
    <linearGradient id="bpB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0a8c2"/><stop offset="1" stop-color="#bf6384"/></linearGradient>
    <linearGradient id="bpH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7bdd1"/><stop offset="1" stop-color="#c96f8f"/></linearGradient>
  </defs>
  <ellipse cx="210" cy="362" rx="170" ry="12" fill="#000" opacity=".35"/>
  <path d="M30 352 Q14 240 70 168 H350 Q406 240 390 352Z" fill="url(#bpB)"/>
  <path d="M70 168 Q60 190 56 215" stroke="#fff" stroke-opacity=".25" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M78 150 Q78 66 150 58 H270 Q342 66 342 150" fill="none" stroke="url(#bpH)" stroke-width="40" stroke-linecap="round"/>
  <path d="M96 150 Q96 80 156 72 H246" stroke="#fff" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/>
  <rect x="44" y="118" width="84" height="48" rx="22" fill="url(#bpH)"/><rect x="292" y="118" width="84" height="48" rx="22" fill="url(#bpH)"/>
  <path d="M60 176 C20 200 40 240 14 262 S20 320 40 330" fill="none" stroke="#c96f8f" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 9"/>
  <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="98" fill="#f7e3ea"/><circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="98" fill="none" stroke="#a65a76" stroke-width="3"/>
  ${plate}
  <g id="dial-rot" style="transform-origin:${DIAL.cx}px ${DIAL.cy}px;transform-box:view-box">
    <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="86" fill="rgba(201,111,143,.0)"/>
    <path fill-rule="evenodd" fill="#d98aa8" fill-opacity=".92" d="M${DIAL.cx - 86} ${DIAL.cy}a86 86 0 1 0 172 0a86 86 0 1 0 -172 0Z${nums.map((n) => { const [x, y] = pos(dialAngle(n), HOLE_R); return `M${x - 15} ${y}a15 15 0 1 0 30 0a15 15 0 1 0 -30 0Z`; }).join("")}"/>
    <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="86" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>
    ${holes}
    <circle cx="${DIAL.cx}" cy="${DIAL.cy}" r="28" fill="#f7e3ea" stroke="#a65a76" stroke-width="2"/>
    <text x="${DIAL.cx}" y="${DIAL.cy - 3}" text-anchor="middle" font-family="Playfair Display, serif" font-size="9" fill="#6b3a4c">${t("SAY", "DITES")}</text>
    <text x="${DIAL.cx}" y="${DIAL.cy + 9}" text-anchor="middle" font-family="Playfair Display, serif" font-size="9" fill="#6b3a4c">${t("HELLO", "BONJOUR")}</text>
  </g>
  <path d="M${sx - 6} ${sy - 4} q14 -2 18 10 q-6 8 -16 4z" fill="#cfd3d8" stroke="#8a9099" stroke-width="1.5"/>
</svg>`;
}

function phoneScene(): string {
  return `<div class="phone-scene">
    <div class="phone-art">${phoneSvg()}</div>
    <div class="phone-copy">
      <h2 class="big">${t("Say hello", "Dites bonjour")}</h2>
      <p>${t("Open to internships. Let's talk about product design, interaction or a project you have in mind.", "Ouverte aux stages. Parlons de design produit, d'interaction ou d'un projet que vous avez en tête.")}</p>
      <p class="dial-hint">${t("Pick a number and the phone dials it for you, or press 1, 2 or 3. You can spin the dial yourself too.", "Choisissez un numéro et le téléphone le compose pour vous, ou appuyez sur 1, 2 ou 3. Vous pouvez aussi faire tourner le cadran.")}</p>
      <div class="dial-btns">
        <button type="button" data-dial="1"><i>1</i>LinkedIn</button>
        <button type="button" data-dial="2"><i>2</i>Email</button>
        <button type="button" data-dial="3"><i>3</i>${t("Copy address", "Copier l'adresse")}</button>
      </div>
      <span class="big-mail" id="mail-text">${esc(contact.email)}</span>
      <p class="dial-note" id="dial-note" role="status"></p>
    </div>
  </div>`;
}
