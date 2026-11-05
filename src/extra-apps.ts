/* Four extra apps for the desktop: Messages (the cats), Maps, Safari, Calendar.
   Everything personal lives in the constants at the top of each section, so it is easy to edit. */
import { CATS, START_CHIPS, intentOf, reply, type Cat, type Chip } from "./room/chat";
import { contact, cases, education } from "./content";
import { lang, t } from "./i18n";
import type { AppDef, Ctx } from "./apps";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const locale = () => (lang === "fr" ? "fr-FR" : "en-GB");

/* ======================================================================== icons */
const tile = (id: string, a: string, b: string, inner: string) =>
  `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:${a}"/><stop offset="1" style="stop-color:${b}"/></linearGradient></defs><rect width="100" height="100" rx="23" fill="url(#g-${id})"/>${inner}<rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-edge)" stroke-opacity=".5" stroke-width="1.5"/></svg>`;

export function extraIcon(id: string): string {
  switch (id) {
    case "messages":
      return tile("msg", "#ff9ab3", "#ec2a72", `<path d="M26 34 31 18l14 11h10l14-11 5 16c3 4 4 8 4 13 0 14-13 22-28 22S22 61 22 47c0-5 1-9 4-13z" fill="#fff"/><circle cx="40" cy="47" r="3.2" fill="#ec2a72"/><circle cx="60" cy="47" r="3.2" fill="#ec2a72"/><path d="M46 54h8l-4 4.4z" fill="#ff7aa8"/>`);
    case "maps":
      return tile("map", "var(--ic-map-a, #ffe4ec)", "var(--ic-map-b, #ffc2d4)", `<path d="M18 30 40 22l20 8 22-8v48l-22 8-20-8-22 8z" fill="#fff" fill-opacity=".75"/><path d="M40 22v48M60 30v48" stroke="#ffb3ca" stroke-width="2"/><path d="M26 66C38 50 46 62 58 46s14-10 22-16" fill="none" stroke="#c8153f" stroke-width="3" stroke-dasharray="1 6" stroke-linecap="round"/><path d="M72 24c-6 0-10 4-10 9 0 7 10 16 10 16s10-9 10-16c0-5-4-9-10-9z" fill="#ec2a72"/><circle cx="72" cy="33" r="3.4" fill="#fff"/>`);
    case "safari":
      return tile("saf", "#fff5f8", "#ffd0de", `<circle cx="50" cy="50" r="31" fill="#fff" stroke="#ec2a72" stroke-width="3"/><g stroke="#ec2a72" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M50 22v6M50 72v6M22 50h6M72 50h6"/></g><path d="m64 36-8 20-20 8 8-20z" fill="#ec2a72"/><path d="m64 36-8 20-12-12z" fill="#ff9ab3"/><circle cx="50" cy="50" r="3" fill="#fff"/>`);
    case "calendar": {
      const d = new Date();
      const wd = new Intl.DateTimeFormat(locale(), { weekday: "short" }).format(d).replace(".", "").slice(0, 3);
      return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="23" fill="var(--icon-paper)"/><path d="M0 23a23 23 0 0 1 23-23h54a23 23 0 0 1 23 23v10H0z" fill="#ec2a72"/><text x="50" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#fff">${wd.toUpperCase()}</text><text x="50" y="78" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="44" fill="var(--icon-type)">${d.getDate()}</text><rect width="100" height="100" rx="23" fill="none" stroke="var(--icon-outline)" stroke-opacity=".8"/></svg>`;
    }
    default:
      return "";
  }
}

/* ======================================================================== Messages */
const toApp = (id: string, arg?: string): [string, string | undefined] => {
  switch (id) {
    case "case": return ["work", arg];
    case "exp": return ["experience", undefined];
    case "paris":
    case "algiers": return ["maps", id];
    default: return [id, arg];
  }
};

const threads = new Map<string, { nodes: HTMLElement; chips: Chip[] }>();

function renderMessages(body: HTMLElement, ctx: Ctx) {
  const list = CATS.map((c, i) => `<button class="side-i${i ? "" : " on"}" data-cat="${c.id}"><span class="mini ms-mini"><img src="${c.photo}" alt="" draggable="false" /></span><span><b>${esc(c.name)}</b><small data-prev="${c.id}">${esc(c.bio)}</small></span></button>`).join("");
  body.innerHTML = `
  <aside class="side"><p class="side-h">${t("Messages", "Messages")}</p>${list}</aside>
  <main class="main ms">
    <header class="ms-head"><span class="ms-av"><img alt="" draggable="false" /></span><div><b></b><small></small></div></header>
    <div class="ms-body" aria-live="polite"></div>
    <div class="ms-chips"></div>
    <form class="ms-form" autocomplete="off"><input type="text" maxlength="140" /><button type="submit" aria-label="${t("Send", "Envoyer")}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg></button></form>
  </main>`;
  const q = <T extends HTMLElement>(s: string) => body.querySelector<T>(s)!;
  const feed = q(".ms-body");
  const chips = q(".ms-chips");
  const input = q<HTMLInputElement>(".ms-form input");
  const status = q(".ms-head small");
  let cat: Cat = CATS[0];
  let busy = false;
  let token = 0;

  const scroll = () => (feed.scrollTop = feed.scrollHeight);
  const cur = () => threads.get(cat.id)!.nodes;
  const paintChips = (cs: Chip[]) => {
    chips.innerHTML = cs.map((c) => `<button type="button" data-q="${esc(c.q)}" data-l="${esc(c.label)}">${esc(c.label)}</button>`).join("");
    const th = threads.get(cat.id);
    if (th) th.chips = cs;
  };
  const bubble = (text: string, who: "cat" | "me") => {
    const p = document.createElement("p");
    p.className = "bb " + who;
    p.textContent = text;
    cur().appendChild(p);
    scroll();
    const prev = body.querySelector(`[data-prev="${cat.id}"]`);
    if (prev) prev.textContent = text;
  };
  async function say(lines: string[], actions: { label: string; open?: { id: string; arg?: string }; href?: string }[] = [], next: Chip[] = []) {
    const mine = ++token;
    const nodes = cur();
    busy = true;
    paintChips([]);
    for (const line of lines) {
      status.textContent = t("typing…", "écrit…");
      const dots = document.createElement("p");
      dots.className = "bb cat typing";
      dots.innerHTML = "<i></i><i></i><i></i>";
      nodes.appendChild(dots);
      scroll();
      await sleep(calm() ? 80 : Math.min(1200, 380 + line.length * 12));
      dots.remove();
      if (mine !== token) return;
      bubble(line, "cat");
    }
    if (actions.length) {
      const row = document.createElement("div");
      row.className = "bb-act";
      actions.forEach((a) => {
        if (a.href) row.insertAdjacentHTML("beforeend", `<a href="${esc(a.href)}" ${a.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${esc(a.label)}</a>`);
        else {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = a.label;
          b.addEventListener("click", () => ctx.open(...toApp(a.open!.id, a.open!.arg)));
          row.appendChild(b);
        }
      });
      nodes.appendChild(row);
    }
    status.textContent = t("Online, mostly napping", "En ligne, surtout en train de dormir");
    busy = false;
    paintChips(next);
    scroll();
  }
  function ask(qk: string, label: string) {
    if (busy) return;
    ctx.sfx.tick();
    bubble(label, "me");
    const r = reply(cat, qk === "?" ? "" : qk);
    void say(r.lines, r.actions, r.chips);
  }
  function open(id: string) {
    token++;
    busy = false;
    cat = CATS.find((c) => c.id === id)!;
    body.querySelectorAll<HTMLElement>("[data-cat]").forEach((b) => b.classList.toggle("on", b.dataset.cat === id));
    q<HTMLImageElement>(".ms-av img").src = cat.photo;
    q(".ms-head b").textContent = cat.name;
    status.textContent = t("Online, mostly napping", "En ligne, surtout en train de dormir");
    input.placeholder = t("Message ", "Message à ") + cat.name;
    let th = threads.get(id);
    if (th) {
      feed.replaceChildren(th.nodes);
      paintChips(th.chips);
      scroll();
    } else {
      th = { nodes: document.createElement("div"), chips: [] };
      th.nodes.className = "ms-thread";
      threads.set(id, th);
      feed.replaceChildren(th.nodes);
      void say(cat.intro, [], START_CHIPS);
    }
  }
  body.querySelectorAll<HTMLElement>("[data-cat]").forEach((b) => b.addEventListener("click", () => open(b.dataset.cat!)));
  chips.addEventListener("click", (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>("button");
    if (c) ask(c.dataset.q!, c.dataset.l!);
  });
  q<HTMLFormElement>(".ms-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || busy) return;
    input.value = "";
    ask(intentOf(v), v);
  });
  open(CATS[0].id);
}

/* ======================================================================== Maps */
const proj = (lon: number, lat: number): [number, number] => [(lon + 1.5) * 40.7, (49.5 - lat) * 34];
const poly = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => proj(lo, la).map((n) => n.toFixed(1)).join(" ")).join("L") + "Z";
const LAND_N = poly([[-6, 56], [14, 56], [14, 44.6], [9.3, 44.3], [8, 43.9], [7.4, 43.75], [6.9, 43.5], [6.3, 43.15], [5.9, 43.1], [5.4, 43.28], [4.9, 43.4], [4.2, 43.5], [3.6, 43.35], [3.1, 43.05], [3.1, 42.45], [3.2, 42.2], [2.8, 41.85], [2.2, 41.4], [1.3, 41.1], [0.9, 40.75], [0.3, 40.1], [-0.1, 39.5], [0, 39], [-0.4, 38.4], [-0.9, 37.7], [-1.5, 37.4], [-6, 36.8]]);
const LAND_S = poly([[-6, 34.4], [-6, 35.1], [-1.5, 35.2], [-0.63, 35.7], [0.09, 35.93], [0.9, 36.2], [1.7, 36.5], [2.44, 36.6], [3.06, 36.78], [3.5, 36.85], [3.92, 36.92], [4.5, 36.88], [5.08, 36.77], [5.77, 36.82], [6.4, 36.85], [6.9, 36.9], [7.77, 36.9], [8.6, 37], [9.4, 37.3], [14, 37.3], [14, 30], [-6, 30]]);
const ISLANDS = [
  poly([[2.4, 39.55], [2.8, 39.9], [3.4, 39.75], [3.2, 39.4], [2.6, 39.35]]),
  poly([[8.6, 42.95], [9.4, 43], [9.5, 42.2], [9.3, 41.4], [8.8, 41.55], [8.55, 42.3]]),
  poly([[8.2, 41.2], [9.7, 41.1], [9.7, 39.2], [8.4, 39.1], [8.2, 40]]),
];

interface Place { id: string; lon: number; lat: number; name: string; kind: string; copy: string; img?: string; imgAlt?: string; action?: { label: string; app?: string; href?: string } }
const places = (): Place[] => [
  { id: "paris", lon: 2.35, lat: 48.86, name: "Paris", kind: t("Where I live now", "Où j’habite aujourd’hui"), copy: t("My base for the Master’s at Paris-Saclay University. The Eiffel Tower stands in my 3D room too, if you want to say hi.", "Ma base pour le Master à l’Université Paris-Saclay. La tour Eiffel est aussi dans ma chambre en 3D, si vous voulez lui dire bonjour."), action: { label: t("Visit my room", "Visiter ma chambre"), href: "room.html" } },
  { id: "algiers", lon: 3.06, lat: 36.77, name: t("Algiers", "Alger"), kind: t("Where I come from", "D’où je viens"), copy: t("Home. The white city on the bay, and the first place I think of when I say the word.", "La maison. La ville blanche au bord de la baie, et le premier endroit auquel je pense quand je dis ce mot."), img: "room/algiers.jpg", imgAlt: t("An old colour print of the port of Algiers", "Une ancienne gravure en couleur du port d’Alger") },
  { id: "bejaia", lon: 5.08, lat: 36.77, name: t("Béjaïa", "Béjaïa"), kind: t("For the sea", "Pour la mer"), copy: t("My place for the sea: salt water, warm rocks and golden hour.", "Mon endroit pour la mer : eau salée, rochers chauds et heure dorée."), img: "room/sea-sunset.jpg", imgAlt: t("The sea at sunset", "La mer au coucher du soleil"), action: { label: t("See the photo book", "Voir le livre photo"), app: "photos" } },
];

function renderMaps(body: HTMLElement, ctx: Ctx, arg?: string) {
  const ps = places();
  const pt = (p: Place) => proj(p.lon, p.lat);
  const [px, py] = pt(ps[0]);
  const [ax, ay] = pt(ps[1]);
  const [bx, by] = pt(ps[2]);
  const flight = `M${ax.toFixed(1)} ${ay.toFixed(1)}Q${(ax + 120).toFixed(1)} ${((ay + py) / 2).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
  const c1 = proj(3.92, 36.98);
  const c2 = proj(4.55, 36.95);
  const coast = `M${ax.toFixed(1)} ${ay.toFixed(1)}Q${c1[0].toFixed(1)} ${(c1[1] - 2).toFixed(1)} ${((c1[0] + c2[0]) / 2).toFixed(1)} ${(c1[1] - 1).toFixed(1)}T${bx.toFixed(1)} ${by.toFixed(1)}`;

  const pin = (p: Place) => {
    const [x, y] = pt(p);
    return `<g class="mp-pin" data-id="${p.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" tabindex="0" role="button" aria-label="${esc(p.name)}: ${esc(p.kind)}"><ellipse class="mp-sh" cy="1" rx="7" ry="2.4"/><g class="mp-h"><path d="M0 0C-9-12-12-16-12-23a12 12 0 0 1 24 0c0 7-3 11-12 23z"/><circle cy="-23" r="4.6"/></g><text class="mp-lab" y="14" text-anchor="middle">${esc(p.name)}</text></g>`;
  };
  body.innerHTML = `
  <aside class="side"><p class="side-h">${t("Places", "Lieux")}</p>${ps.map((p, i) => `<button class="side-i${i ? "" : " on"}" data-id="${p.id}"><span class="mini mp-dot"></span><span><b>${esc(p.name)}</b><small>${esc(p.kind)}</small></span></button>`).join("")}
    <p class="side-h mp-legend">${t("Routes", "Trajets")}</p>
    <p class="mp-key"><i class="fl"></i>${t("The flight home", "Le vol pour rentrer")}</p>
    <p class="mp-key"><i class="co"></i>${t("Along the coast", "Le long de la côte")}</p>
  </aside>
  <main class="main mp">
    <svg class="mp-svg" viewBox="-80 0 612 540" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${t("Illustrated map: Paris, Algiers and Béjaïa", "Carte illustrée : Paris, Alger et Béjaïa")}">
      <defs>
        <linearGradient id="mpsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9e6"/><stop offset="1" stop-color="#f6bfd6"/></linearGradient>
        <filter id="mpg"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .1 0 0 0 0 .2 0 0 0 .22 0"/></filter>
        <filter id="mpsh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#8a1b45" flood-opacity=".22"/></filter>
      </defs>
      <rect x="-200" y="-50" width="900" height="700" fill="url(#mpsea)"/>
      <g class="mp-grid" stroke="#fff" stroke-opacity=".4" stroke-width=".7" fill="none">${[-0, 100, 200, 300, 400].map((x) => `<path d="M${x} -50V600"/>`).join("")}${[60, 160, 260, 360, 460].map((y) => `<path d="M-200 ${y}H700"/>`).join("")}</g>
      <g filter="url(#mpsh)"><path class="mp-lf" d="${LAND_N}" fill="#fff6ee"/><path class="mp-lf" d="${LAND_S}" fill="#fff0e4"/>${ISLANDS.map((d) => `<path class="mp-lf" d="${d}" fill="#fff6ee"/>`).join("")}</g>
      <g fill="none" stroke="#f2a9c1" stroke-width="1.2" stroke-dasharray="2 4" stroke-linecap="round"><path d="${LAND_N}"/><path d="${LAND_S}"/></g>
      <text class="mp-sea" x="206" y="318" text-anchor="middle">${t("Mediterranean Sea", "Mer Méditerranée")}</text>
      <text class="mp-land" x="150" y="96">France</text><text class="mp-land" x="180" y="500">${t("Algeria", "Algérie")}</text><text class="mp-land" x="30" y="300" >España</text>
      <path id="mp-flight" class="mp-flight" d="${flight}"/>
      <path class="mp-coast" d="${coast}"/>
      ${calm() ? "" : `<circle r="4" fill="#ec2a72" stroke="#fff" stroke-width="1.5"><animateMotion dur="5.5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.8;1" calcMode="linear"><mpath href="#mp-flight"/></animateMotion></circle>`}
      ${ps.map(pin).join("")}
      <rect x="-200" y="-50" width="900" height="700" filter="url(#mpg)" pointer-events="none"/>
    </svg>
    <article class="mp-card" aria-live="polite"></article>
  </main>`;

  const card = body.querySelector<HTMLElement>(".mp-card")!;
  const pins = [...body.querySelectorAll<SVGGElement>(".mp-pin")];
  const items = [...body.querySelectorAll<HTMLElement>(".side-i")];
  function select(id: string, sound = true) {
    const p = ps.find((x) => x.id === id) ?? ps[0];
    if (sound) ctx.sfx.tick();
    pins.forEach((g) => g.classList.toggle("on", g.dataset.id === p.id));
    items.forEach((b) => b.classList.toggle("on", b.dataset.id === p.id));
    card.innerHTML = `${p.img ? `<img src="${p.img}" alt="${esc(p.imgAlt ?? "")}" draggable="false" />` : ""}<div><p>${esc(p.kind)}</p><h3>${esc(p.name)}</h3><span>${esc(p.copy)}</span>${p.action ? (p.action.href ? `<a href="${p.action.href}" target="_blank" rel="noopener">${esc(p.action.label)}</a>` : `<button type="button" data-app="${p.action.app}">${esc(p.action.label)}</button>`) : ""}</div>`;
    card.classList.remove("in");
    void card.offsetWidth;
    card.classList.add("in");
    card.querySelector<HTMLElement>("button[data-app]")?.addEventListener("click", (e) => ctx.open((e.currentTarget as HTMLElement).dataset.app!));
  }
  pins.forEach((g) => {
    g.addEventListener("click", () => select(g.dataset.id!));
    g.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(g.dataset.id!)));
  });
  items.forEach((b) => b.addEventListener("click", () => select(b.dataset.id!)));
  select(arg && ps.some((p) => p.id === arg) ? arg : "paris", false);
}

/* ======================================================================== Safari */
/* Edit this list: label, address, and a short note. Links open in a new tab. */
interface Mark { label: string; href: string; note: string; tint: string; group: "fav" | "ins" }
const marks = (): Mark[] => [
  { label: "LinkedIn", href: contact.links[0]?.href ?? "https://www.linkedin.com", note: t("Let’s connect", "Restons en contact"), tint: "#0a66c2", group: "fav" },
  { label: t("Email", "E-mail"), href: `mailto:${contact.email}`, note: contact.email, tint: "#ec2a72", group: "fav" },
  { label: "Suite numérique", href: cases.find((c) => c.id === "suite-numerique")?.links?.[0]?.href ?? "https://www.figma.com", note: t("Figma prototype", "Prototype Figma"), tint: "#7c5cff", group: "fav" },
  { label: "Javarista", href: cases.find((c) => c.id === "javarista")?.links?.[0]?.href ?? "#", note: t("Final report", "Rapport final"), tint: "#e09a2b", group: "fav" },
  { label: "Pinterest", href: "https://www.pinterest.com", note: t("Where I get lost for hours", "Où je me perds pendant des heures"), tint: "#e60023", group: "ins" },
  { label: "Julia Moresco", href: "https://juliamoresco.com.br", note: t("The portfolio that inspired my room", "Le portfolio qui a inspiré ma chambre"), tint: "#3a2530", group: "ins" },
  { label: "Paris-Saclay", href: "https://www.universite-paris-saclay.fr", note: t("Where I study", "Là où j’étudie"), tint: "#c8153f", group: "ins" },
];

function renderSafari(body: HTMLElement, ctx: Ctx) {
  const all = marks();
  const tileHtml = (m: Mark) => `<a class="sf-t" href="${esc(m.href)}" ${m.href.startsWith("mailto") ? "" : 'target="_blank" rel="noopener noreferrer"'} data-k="${esc((m.label + " " + m.note).toLowerCase())}"><span class="sf-i" style="--c:${m.tint}">${esc(m.label.replace(/[^A-Za-zÀ-ÿ]/g, "").slice(0, 1).toUpperCase())}</span><b>${esc(m.label)}</b><small>${esc(m.note)}</small></a>`;
  body.innerHTML = `
  <div class="sf">
    <div class="sf-bar"><label class="sf-url"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><input type="search" placeholder="${t("Search my bookmarks", "Chercher dans mes favoris")}" aria-label="${t("Search my bookmarks", "Chercher dans mes favoris")}" /></label></div>
    <div class="scroll sf-page">
      <h1 class="display">${t("Start page", "Page de démarrage")}</h1>
      <h2 class="group-h">${t("Favourites", "Favoris")}</h2>
      <div class="sf-grid">${all.filter((m) => m.group === "fav").map(tileHtml).join("")}<button type="button" class="sf-t" data-app="cv"><span class="sf-i" style="--c:#ff5d8f">CV</span><b>${t("Résumé", "CV")}</b><small>${t("Open in this portfolio", "Ouvrir dans ce portfolio")}</small></button></div>
      <h2 class="group-h">${t("Inspirations", "Inspirations")}</h2>
      <div class="sf-grid">${all.filter((m) => m.group === "ins").map(tileHtml).join("")}</div>
      <p class="sf-none" hidden>${t("Nothing matches that.", "Rien ne correspond.")}</p>
    </div>
  </div>`;
  const input = body.querySelector<HTMLInputElement>(".sf-bar input")!;
  const tiles = [...body.querySelectorAll<HTMLElement>(".sf-t")];
  const none = body.querySelector<HTMLElement>(".sf-none")!;
  input.addEventListener("input", () => {
    const v = input.value.trim().toLowerCase();
    let n = 0;
    tiles.forEach((el) => {
      const hit = !v || (el.dataset.k ?? el.textContent!.toLowerCase()).includes(v);
      el.hidden = !hit;
      if (hit) n++;
    });
    none.hidden = n > 0;
  });
  body.querySelector<HTMLElement>("[data-app]")?.addEventListener("click", () => ctx.open("cv"));
}

/* ======================================================================== Calendar */
/* Edit these dates: month is 0-based (2 = March). */
const INTERN = { from: new Date(2027, 2, 1), to: new Date(2027, 7, 31) };
const MASTER = { from: new Date(2025, 8, 1), to: new Date(2027, 7, 31) };
const dayKey = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
const within = (d: Date, r: { from: Date; to: Date }) => dayKey(d) >= dayKey(r.from) && dayKey(d) <= dayKey(r.to);

function renderCalendar(body: HTMLElement, ctx: Ctx) {
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const fmt = (o: Intl.DateTimeFormatOptions, d: Date) => new Intl.DateTimeFormat(locale(), o).format(d);
  const days = Math.ceil((INTERN.from.getTime() - today.getTime()) / 86400000);
  const status = days > 0 ? t(`Starts in ${days} days`, `Commence dans ${days} jours`) : t("Under way", "En cours");
  const master = education[0];

  body.innerHTML = `
  <aside class="side">
    <p class="side-h">${t("Availability", "Disponibilité")}</p>
    <div class="cl-open"><span class="cl-dot"></span><b>${t("Open to internships", "Ouverte aux stages")}</b><p>${t("From March 2027, for 6 months.", "À partir de mars 2027, pendant 6 mois.")}</p><em>${status}</em><button type="button" id="cl-go">${t("Jump to March 2027", "Aller à mars 2027")}</button><button type="button" id="cl-hi" class="alt">${t("Say hello", "Dire bonjour")}</button></div>
    <p class="side-h">${t("Calendars", "Calendriers")}</p>
    <p class="cl-key"><i class="in"></i><span><b>${t("Internship", "Stage")}</b><small>${t("March – August 2027", "Mars – août 2027")}</small></span></p>
    <p class="cl-key"><i class="ma"></i><span><b>${t("Master’s", "Master")}</b><small>${esc(master.dates.replace("September", t("September", "septembre")).replace("August", t("August", "août")))}</small></span></p>
  </aside>
  <main class="main cl">
    <div class="cl-top"><h2></h2><div><button type="button" id="cl-p" aria-label="${t("Previous month", "Mois précédent")}"><svg viewBox="0 0 12 12"><path d="M7.5 2 3.5 6l4 4"/></svg></button><button type="button" id="cl-t">${t("Today", "Aujourd’hui")}</button><button type="button" id="cl-n" aria-label="${t("Next month", "Mois suivant")}"><svg viewBox="0 0 12 12"><path d="m4.5 2 4 4-4 4"/></svg></button></div></div>
    <div class="cl-wk">${Array.from({ length: 7 }, (_, i) => `<span>${fmt({ weekday: "short" }, new Date(2024, 0, 1 + i)).replace(".", "")}</span>`).join("")}</div>
    <div class="cl-grid" role="grid"></div>
    <p class="cl-note"></p>
  </main>`;
  const grid = body.querySelector<HTMLElement>(".cl-grid")!;
  const title = body.querySelector<HTMLElement>(".cl-top h2")!;
  const note = body.querySelector<HTMLElement>(".cl-note")!;

  function paint(dir = 0) {
    title.textContent = fmt({ month: "long", year: "numeric" }, view);
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7;
    const start = new Date(view.getFullYear(), view.getMonth(), 1 - lead);
    let h = "";
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const inI = within(d, INTERN);
      const prev = within(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), INTERN);
      const nxt = within(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1), INTERN);
      const cls = ["cl-d", d.getMonth() !== view.getMonth() ? "out" : "", dayKey(d) === dayKey(today) ? "today" : "", inI ? "in" : "", inI && !prev ? "s" : "", inI && !nxt ? "e" : "", within(d, MASTER) ? "ma" : ""].filter(Boolean).join(" ");
      h += `<div class="${cls}" role="gridcell"><span>${d.getDate()}</span></div>`;
    }
    grid.innerHTML = h;
    if (dir && !calm()) grid.animate([{ opacity: 0, transform: `translateX(${dir * 14}px)` }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.9,.2,1)" });
    const m0 = new Date(view.getFullYear(), view.getMonth(), 1);
    const m1 = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    note.textContent = within(m0, INTERN) || within(m1, INTERN) ? t("Internship month: open to start in March, 6 months.", "Mois de stage : début en mars, 6 mois.") : "";
  }
  const go = (n: number) => {
    view = new Date(view.getFullYear(), view.getMonth() + n, 1);
    ctx.sfx.tick();
    paint(n);
  };
  body.querySelector("#cl-p")!.addEventListener("click", () => go(-1));
  body.querySelector("#cl-n")!.addEventListener("click", () => go(1));
  body.querySelector("#cl-t")!.addEventListener("click", () => ((view = new Date(today.getFullYear(), today.getMonth(), 1)), paint(1)));
  body.querySelector("#cl-go")!.addEventListener("click", () => ((view = new Date(2027, 2, 1)), ctx.sfx.tick(), paint(1)));
  body.querySelector("#cl-hi")!.addEventListener("click", () => ctx.open("mail"));
  paint();
}

/* ======================================================================== registry */
export const extraApps = (): AppDef[] => [
  { id: "messages", name: t("Messages", "Messages"), w: 800, h: 580, split: 232, keywords: "messages chat cats ferrari lamborghini talk ask chats discuter", render: renderMessages },
  { id: "maps", name: t("Maps", "Plans"), w: 940, h: 620, split: 232, keywords: "maps places paris algiers bejaia béjaïa sea route where from carte plans lieux alger mer", render: renderMaps, onArg: (b, a) => b.querySelector<HTMLElement>(`.side-i[data-id="${a}"]`)?.click() },
  { id: "calendar", name: t("Calendar", "Calendrier"), w: 900, h: 620, split: 250, keywords: "calendar availability internship march 2027 master dates calendrier disponibilité stage", render: renderCalendar },
];
