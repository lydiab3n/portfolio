import "./style.css";
import { startTracking, track } from "./track";
import "./piles.css";
import { cases, hero } from "./content";
import { Sfx } from "./sound";
import { lang, switchLang, t } from "./i18n";
import { Wallpaper } from "./wallpaper";
import { mountWidgets, type Peek } from "./desk";
import { APPS, avatar, folderSvg, icon, type AppDef } from "./apps";

const sfx = new Sfx();
const wall = new Wallpaper(document.getElementById("wall") as HTMLCanvasElement);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = () => innerWidth < 760;
const params = new URLSearchParams(location.search);
const LOC = lang === "fr" ? "fr-FR" : "en-GB";
const MB = 34; // menu bar height
const EASE_OUT = "cubic-bezier(.2,.9,.2,1.02)";
const dur = (n: number) => (reduce ? 1 : n);

const root = document.getElementById("app")!;
const PORTRAIT = "lydia-portrait.jpg";

root.innerHTML = `
<div id="desktop">
  <header id="menubar">
    <div class="mb-l">
      <button class="mb-btn logo" id="mb-logo" aria-label="Lydia Benosmane, ${t("about", "à propos")}"><svg class="straw" viewBox="0 0 24 24" aria-hidden="true"><defs><path id="lv" d="M12 8.6C10.7 6.7 8.7 6 6.6 6.8 7.8 8.2 9.6 9 12 8.6ZM12 8.6c1.3-1.9 3.3-2.6 5.4-1.8-1.2 1.4-3 2.2-5.4 1.8ZM11.3 8.2c-.2-2.3.2-4.2 1.4-5.6.3 1.9.3 3.8.1 5.6Z"/><mask id="bite" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" fill="#000"><rect width="24" height="24" fill="#fff"/><use href="#lv" stroke="#000" stroke-width="1.7" stroke-linejoin="round"/><circle cx="22.3" cy="12.2" r="3.5"/><circle cx="21.2" cy="17.7" r="2.5"/><g transform="rotate(0)"><ellipse cx="8.4" cy="12.4" rx=".55" ry=".85"/><ellipse cx="12" cy="12.2" rx=".55" ry=".85"/><ellipse cx="15.4" cy="12.4" rx=".55" ry=".85"/><ellipse cx="10.2" cy="15.8" rx=".55" ry=".85"/><ellipse cx="13.8" cy="15.8" rx=".55" ry=".85"/><ellipse cx="12" cy="19" rx=".55" ry=".85"/></g></mask></defs><path mask="url(#bite)" fill="currentColor" d="M12 8.3C14 6.8 18.4 6.7 20 9.8c1.2 2.4-.2 6.5-3.8 10-1.6 1.5-3 2.5-4.2 2.9-1.2-.4-2.6-1.4-4.2-2.9C4.2 16.3 2.8 12.2 4 9.8c1.6-3.1 6-3 8-1.5Z"/><use href="#lv" fill="currentColor"/></svg></button>
      <b id="mb-app">Lydia’s World</b>
      <em class="credit" role="tooltip">${t("Designed and coded with my imagination, mixed with Claude ✦", "Conçu et codé avec mon imagination, mélangée à Claude ✦")}</em>
      <nav class="mb-nav" aria-label="Apps">
        <button data-open="about">${t("About", "À propos")}</button><button data-open="work">${t("Work", "Projets")}</button><button data-open="experience">${t("Experience", "Parcours")}</button><button data-open="cv">CV</button><button data-open="mail">Contact</button>
      </nav>
    </div>
    
    <div class="mb-r">
      <div class="lang" role="group" aria-label="${t("Language", "Langue")}"><button type="button" data-l="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-l="fr" aria-pressed="${lang === "fr"}">FR</button></div>
      <button class="mb-btn chip" id="mb-search" aria-label="${t("Search", "Rechercher")} (Ctrl K)"><svg viewBox="0 0 20 20"><circle cx="8.4" cy="8.4" r="5.3"/><path d="m12.6 12.6 4.4 4.4" class="h"/></svg></button>
      <button class="mb-btn chip" id="mb-cc" aria-label="${t("Control Center", "Centre de contrôle")}" aria-expanded="false"><svg viewBox="0 0 20 20"><rect x="1.8" y="3" width="16.4" height="6.2" rx="3.1"/><rect x="1.8" y="10.8" width="16.4" height="6.2" rx="3.1"/><circle cx="14.9" cy="6.1" r="2" class="f"/><circle cx="5.1" cy="13.9" r="2" class="f"/></svg></button>
      <span class="mb-clock" id="mb-clock"></span>
    </div>
  </header>

  <div id="greet"></div>

<aside id="sticky" aria-label="${t("To do", "À faire")}">
  <header><b>${t("To do", "À faire")}</b></header>
  <ul>
    <li>${t("Land my dream UX internship", "Décrocher le stage UX de mes rêves")}</li>
    <li>${t("Design something that makes people smile", "Créer un design qui donne le sourire")}</li>
    <li class="done">${t("Make peace with Figma Auto Layout", "Faire la paix avec l'Auto Layout de Figma")}</li>
    <li>${t("Finish my Master's with my sanity intact", "Finir mon Master sans perdre la tête")}</li>
    <li>${t("Find the best matcha in Paris", "Trouver le meilleur matcha de Paris")}</li>
    <li class="done">${t("Stop overthinking every pixel", "Arrêter de trop réfléchir à chaque pixel")}</li>
  </ul>
  <button id="sticky-hi" type="button">${t("Say hello", "Dire bonjour")}</button>
</aside>
  <div id="folders"></div>
  <section id="widgets" aria-label="${t("Selected work", "Projets à la une")}"></section>
  <div id="wins"></div>

  <nav id="dock" aria-label="Dock"></nav>

  <div id="notif" hidden tabindex="0" role="alert">
    <span class="n-ic">${avatar}</span>
    <div><b>Lydia Benosmane</b><p>${hero.status}. ${t("Say hello?", "On se dit bonjour ?")}</p></div>
    <small>${t("now", "maintenant")}</small>
    <button class="n-x" aria-label="${t("Dismiss notification", "Fermer la notification")}"><svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6"/></svg></button>
  </div>

  <div id="cc" hidden>
    <div class="cc-row">
      <button class="cc-tile" id="cc-sound" aria-pressed="true"><i class="cc-ic"><svg viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" class="s"/></svg></i><span><b>${t("Sound", "Son")}</b><small>${t("On", "Activé")}</small></span></button>
      <button class="cc-tile" id="cc-theme" aria-pressed="false"><i class="cc-ic"><svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg></i><span><b>${t("Dark", "Sombre")}</b><small>${t("Off", "Désactivé")}</small></span></button>
    </div>
    <label class="cc-slide"><b>${t("Display", "Affichage")}</b><input id="cc-bright" type="range" min="35" max="100" value="100" aria-label="${t("Brightness", "Luminosité")}" /></label>
    <button class="cc-link" id="cc-replay">${t("Replay intro", "Revoir l’intro")}</button>
  </div>
</div>

<div id="spot" hidden>
  <div class="spot-box" role="dialog" aria-label="${t("Search", "Rechercher")}">
    <div class="spot-in"><svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input id="spot-q" placeholder="${t("Search Lydia’s World", "Rechercher dans Lydia’s World")}" autocomplete="off" spellcheck="false" aria-label="${t("Search", "Rechercher")}" /></div>
    <ul id="spot-list" role="listbox"></ul>
  </div>
</div>

<div id="lock">
  <div class="lk-top"><p id="lk-date"></p><h1 id="lk-time"></h1></div>
  <button class="lk-enter" id="lk-enter">
    <span class="lk-av">${avatar}</span>
    <b>Lydia Benosmane</b>
    <small><svg viewBox="0 0 24 24"><path d="M12 4a6 6 0 0 0-6 6v3M12 8a2 2 0 0 0-2 2v6M12 4a6 6 0 0 1 6 6v4a8 8 0 0 1-1.5 4.5M15 11v3a6 6 0 0 1-.8 3"/></svg>${t("Click or press any key to enter", "Cliquez ou appuyez sur une touche pour entrer")}</small>
  </button>
</div>

<div id="boot">
  <div class="lang boot-lang" role="group" aria-label="${t("Language", "Langue")}"><button type="button" data-l="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-l="fr" aria-pressed="${lang === "fr"}">FR</button></div>
  <div class="bm" aria-label="LB"><span>L</span><span>B</span></div>
  <div class="bbar"><i></i></div>
  <div class="boot-ask">
    <button id="boot-go" class="pill">${t("Open Lydia’s World", "Ouvrir Lydia’s World")}</button>
    <div class="alt"><button id="boot-quiet" class="plain">${t("Continue without sound", "Continuer sans le son")}</button><button id="boot-skip0" class="plain">${t("Skip intro", "Passer l’intro")}</button></div>
  </div>
  <button id="boot-skip" class="skip">${t("Skip intro", "Passer l’intro")}</button>
</div>`;

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const desktop = $("#desktop");
const winsEl = $("#wins");
const dock = $("#dock");

/* ================= Windows ================= */
interface Win {
  app: AppDef;
  el: HTMLElement;
  body: HTMLElement;
  min: boolean;
  max: boolean;
  prev?: { l: string; t: string; w: string; h: string };
}
const wins = new Map<string, Win>();
let z = 10;
let active: Win | null = null;

const stage = () => ({ w: innerWidth, h: innerHeight - MB - (mobile() ? 86 : 104) });
const dockRect = (id: string) => dock.querySelector<HTMLElement>(`.dk[data-app="${id}"]`)?.getBoundingClientRect();

function setActive(w: Win | null) {
  active = w;
  wins.forEach((x) => x.el.classList.toggle("active", x === w));
  $("#mb-app").textContent = w ? w.app.name : "Lydia’s World";
  if (w) w.el.style.zIndex = String(++z);
}

function flyFrom(w: Win, rect?: DOMRect) {
  const r = w.el.getBoundingClientRect();
  const tr = rect ?? new DOMRect(innerWidth / 2, innerHeight, 40, 40);
  const dx = tr.left + tr.width / 2 - (r.left + r.width / 2);
  const dy = tr.top + tr.height / 2 - (r.top + r.height / 2);
  return `translate(${dx}px,${dy}px) scale(${Math.max(0.06, tr.width / r.width)})`;
}

function openApp(id: string, arg?: string) {
  const app = APPS.find((a) => a.id === id);
  if (!app) return;
  track("open:" + id);
  const ex = wins.get(id);
  if (ex) {
    if (ex.min) restore(ex);
    else sfx.tick();
    setActive(ex);
    if (arg) app.onArg?.(ex.body, arg);
    return;
  }
  const s = stage();
  const w = Math.min(app.w, s.w - (mobile() ? 0 : 40));
  const h = Math.min(app.h, s.h - 16);
  const n = wins.size;
  const left = Math.max(8, (s.w - w) / 2 + (n % 4) * 34 - 51);
  const top = MB + Math.max(8, (s.h - h) / 2 - 8 + (n % 4) * 26 - 39);
  const el = document.createElement("section");
  el.className = "win" + (app.split ? " split" : "");
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", app.name);
  el.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;--side:${app.split ?? 0}px`;
  el.innerHTML = `<header class="tb"><div class="lights"><button class="l c" aria-label="Close"></button><button class="l m" aria-label="Minimise"></button><button class="l z" aria-label="Zoom"></button></div><div class="ttl">${app.name}</div></header><div class="body"></div>`;
  winsEl.appendChild(el);
  const win: Win = { app, el, body: el.querySelector(".body")!, min: false, max: false };
  wins.set(id, win);
  app.render(win.body, { sfx, open: openApp }, arg);
  setActive(win);
  bounce(id);
  sfx.open();
  el.animate(
    [
      { transform: flyFrom(win, dockRect(id)), opacity: 0, filter: "blur(8px)" },
      { transform: "none", opacity: 1, filter: "blur(0)" },
    ],
    { duration: dur(560), easing: EASE_OUT }
  );
  wire(win);
  syncDock();
}

function wire(w: Win) {
  const { el } = w;
  el.addEventListener("pointerdown", () => active !== w && setActive(w), true);
  el.querySelector(".c")!.addEventListener("click", () => closeWin(w));
  el.querySelector(".m")!.addEventListener("click", () => minimize(w));
  el.querySelector(".z")!.addEventListener("click", () => toggleMax(w));
  const tb = el.querySelector<HTMLElement>(".tb")!;
  tb.addEventListener("dblclick", (e) => {
    if (!(e.target as HTMLElement).closest(".l")) toggleMax(w);
  });
  tb.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest(".l") || mobile() || w.max) return;
    const sx = e.clientX - el.offsetLeft;
    const sy = e.clientY - el.offsetTop;
    tb.setPointerCapture(e.pointerId);
    el.classList.add("drag");
    const mv = (ev: PointerEvent) => {
      const x = Math.min(innerWidth - 120, Math.max(-el.offsetWidth + 160, ev.clientX - sx));
      const y = Math.min(innerHeight - 60, Math.max(MB, ev.clientY - sy));
      el.style.left = x + "px";
      el.style.top = y + "px";
    };
    const up = () => {
      el.classList.remove("drag");
      tb.removeEventListener("pointermove", mv);
      tb.removeEventListener("pointerup", up);
      tb.removeEventListener("pointercancel", up);
    };
    tb.addEventListener("pointermove", mv);
    tb.addEventListener("pointerup", up);
    tb.addEventListener("pointercancel", up);
  });
}

function nextActive() {
  const vis = [...wins.values()].filter((x) => !x.min).sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex));
  setActive(vis[0] ?? null);
}

function closeWin(w: Win) {
  sfx.close();
  wins.delete(w.app.id);
  nextActive();
  syncDock();
  w.el.animate([{ transform: "none", opacity: 1 }, { transform: "scale(.94)", opacity: 0 }], { duration: dur(180), easing: "ease-in" }).onfinish = () => w.el.remove();
  w.el.style.pointerEvents = "none";
}

function minimize(w: Win) {
  sfx.minimize();
  w.min = true;
  const to = flyFrom(w, dockRect(w.app.id));
  w.el.animate([{ transform: "none", opacity: 1, filter: "blur(0)" }, { transform: to, opacity: 0.2, filter: "blur(6px)" }], { duration: dur(480), easing: "cubic-bezier(.6,0,.4,1)" }).onfinish = () => {
    w.el.style.display = "none";
  };
  nextActive();
  syncDock();
}

function restore(w: Win) {
  sfx.open();
  w.min = false;
  w.el.style.display = "";
  w.el.animate([{ transform: flyFrom(w, dockRect(w.app.id)), opacity: 0.2, filter: "blur(6px)" }, { transform: "none", opacity: 1, filter: "blur(0)" }], { duration: dur(520), easing: EASE_OUT });
  syncDock();
}

function toggleMax(w: Win) {
  if (mobile()) return;
  sfx.tick();
  const el = w.el;
  el.classList.add("anim");
  if (!w.max) {
    w.prev = { l: el.style.left, t: el.style.top, w: el.style.width, h: el.style.height };
    el.style.left = "10px";
    el.style.top = MB + 6 + "px";
    el.style.width = innerWidth - 20 + "px";
    el.style.height = innerHeight - MB - 112 + "px";
  } else if (w.prev) {
    el.style.left = w.prev.l;
    el.style.top = w.prev.t;
    el.style.width = w.prev.w;
    el.style.height = w.prev.h;
  }
  w.max = !w.max;
  setTimeout(() => el.classList.remove("anim"), 520);
}

/* ================= Dock ================= */
dock.innerHTML = APPS.map((a) => `<button class="dk" data-app="${a.id}" aria-label="${a.name}"><span class="ic">${icon(a.id)}</span><span class="tip">${a.name}</span><i class="dot"></i></button>`).join("")
/* Extra project: the explorable 3D room, a small app at the end of the Dock that opens in its own tab */
const roomIcon = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="g-room" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b07a54"/><stop offset="1" stop-color="#5a3420"/></linearGradient><radialGradient id="g-room-glow" cx=".72" cy=".62" r=".6"><stop offset="0" stop-color="#ffe27a" stop-opacity=".95"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs><rect width="100" height="100" rx="23" fill="url(#g-room)"/><circle cx="64" cy="58" r="30" fill="url(#g-room-glow)"/><path d="M22 36l28-14 28 14v36L50 86 22 72z" fill="#f6e6d2"/><path d="M22 36l28 14v36L22 72z" fill="#dcc0a0"/><path d="M78 36L50 50v36l28-14z" fill="#ffd166"/><path d="M50 50L22 36l28-14 28 14z" fill="#fff"/><rect x="58" y="56" width="12" height="12" rx="2" fill="#fff6cf" transform="skewY(-26)"/><path d="M36 60l6 3v8l-6-3z" fill="#ff5fa2"/><rect width="100" height="100" rx="23" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.5"/></svg>`;
dock.insertAdjacentHTML("beforeend", `<button class="dk" data-app="room" aria-label="Explore my room (3D)"><span class="ic">${roomIcon}</span><span class="tip">${t("My room (3D)", "Ma chambre (3D)")}</span><i class="dot"></i></button>`);
const dks = [...dock.querySelectorAll<HTMLElement>(".dk")];
const cur = dks.map(() => 1);
let mx: number | null = null;
let magRaf = 0;
const base = () => (mobile() ? 40 : 46);

function mag() {
  const b = base();
  const gap = 6;
  const n = dks.length;
  const real = (i: number) => innerWidth / 2 - (n * (b + gap) - gap) / 2 + i * (b + gap) + b / 2;
  let busy = false;
  const k = dks.map((_, i) => {
    const c = real(i);
    const t = mx === null || mobile() ? 1 : 1 + 0.8 * Math.exp(-((mx - c) ** 2) / (2 * 58 ** 2));
    cur[i] += (t - cur[i]) * 0.22;
    if (Math.abs(t - cur[i]) > 0.002) busy = true;
    return cur[i];
  });
  const total = k.reduce((s, v) => s + v * b, 0) + (n - 1) * gap;
  let x = innerWidth / 2 - total / 2;
  dks.forEach((d, i) => {
    const w = k[i] * b;
    const centre = x + w / 2;
    x += w + gap;
    d.style.setProperty("--s", k[i].toFixed(3));
    d.style.setProperty("--x", (centre - real(i)).toFixed(2) + "px");
  });
  magRaf = busy ? requestAnimationFrame(mag) : 0;
}
const kick = () => {
  if (!magRaf && !reduce) magRaf = requestAnimationFrame(mag);
};
dock.addEventListener("pointermove", (e) => {
  if (e.pointerType === "touch") return;
  mx = e.clientX;
  kick();
});
dock.addEventListener("pointerleave", () => {
  mx = null;
  kick();
});
dks.forEach((d) => {
  d.style.setProperty("--sz", base() + "px");
  d.addEventListener("click", () => {
    const id = d.dataset.app!;
    if (id === "room") {
      /* same tab, so no pop-up blocker can stop it; the room has a "← Portfolio" button to come back */
      bounce(id);
      setTimeout(() => location.assign(`room.html?lang=${lang}`), reduce ? 0 : 260);
      return;
    }
    const w = wins.get(id);
    if (w && !w.min && active === w) {
      minimize(w);
      return;
    }
    openApp(id);
  });
});
addEventListener("resize", () => {
  dks.forEach((d) => d.style.setProperty("--sz", base() + "px"));
  kick();
});
function bounce(id: string) {
  if (reduce) return;
  dock.querySelector(`.dk[data-app="${id}"] .ic`)?.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-26px)", offset: 0.25 }, { transform: "translateY(0)", offset: 0.5 }, { transform: "translateY(-14px)", offset: 0.72 }, { transform: "translateY(0)" }],
    { duration: 820, easing: "cubic-bezier(.3,.7,.4,1)" }
  );
}
function syncDock() {
  dks.forEach((d) => {
    const w = wins.get(d.dataset.app!);
    d.classList.toggle("run", !!w);
    d.classList.toggle("mini", !!w?.min);
  });
}

/* ================= Desktop: scattered icons, greeting, sticky note ================= */
const fileSvg = `<svg viewBox="0 0 64 80" aria-hidden="true"><path d="M8 4h32l16 16v52a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="var(--icon-paper)"/><path d="M40 4v12a4 4 0 0 0 4 4h12z" fill="var(--icon-fold)"/><path d="M14 40h36M14 49h36M14 58h24" stroke="var(--icon-line)" stroke-width="3" stroke-linecap="round" opacity="var(--icon-line-opacity)"/></svg>`;
/** x, y: column and row in the little icon grid next to the widgets */
interface DeskIcon { label: string; x: number; y: number; file?: boolean; fk?: string; peek?: Peek; go: () => void }
const texFolder = (k: string) => `<img class="fi-l" src="folders/light-${k}.png" alt="" draggable="false" /><img class="fi-d" src="folders/dark-${k}.png" alt="" draggable="false" />`;
const deskIcons: DeskIcon[] = [
  { label: "About me", x: 1, y: 0, fk: "about", peek: { title: t("About me", "À propos de moi"), kind: t("Folder", "Dossier"), blurb: t("Who I am, where I come from, my two cats, and what I’m looking for next.", "Qui je suis, d’où je viens, mes deux chats, et ce que je cherche."), cta: t("Double-click to open", "Double-clic pour ouvrir") }, go: () => openApp("about") },
  { label: "Resume.pdf", x: 0, y: 1, file: true, peek: { title: "Resume.pdf", kind: t("Document", "Document"), blurb: t("Education, experience and skills, ready to read or download.", "Formation, expérience et compétences, à lire ou à télécharger."), cta: t("Double-click to open", "Double-clic pour ouvrir") }, go: () => openApp("cv") },
  { label: "Albums", x: 1, y: 1, fk: "albums", peek: { title: t("Photos", "Photos"), kind: t("Photo book", "Livre photo"), blurb: t("A little book to swipe through: my cats Ferrari and Lamborghini, the sea.", "Un petit livre à feuilleter : mes chats Ferrari et Lamborghini, la mer."), cta: t("Double-click to open", "Double-clic pour ouvrir") }, go: () => openApp("photos") },
  { label: "Art", x: 0, y: 2, fk: "tangible", peek: { title: "Art", kind: t("Folder", "Dossier") + " · " + t("paintings & videos", "peintures et créations"), blurb: t("Find out about one of my passions: arts and crafts. Paintings, and a felt book made for my nieces.", "Une de mes passions : les arts et la création. Des peintures, et un livre en feutrine fait pour mes nièces."), cta: t("Double-click to open", "Double-clic pour ouvrir") }, go: () => openApp("art") },
  /* every project lives in one folder; the widgets above it show the selected ones */
  { label: t("My work", "Mes projets"), x: 0, y: 0, fk: "product", peek: { title: t("My work", "Mes projets"), kind: t("Folder", "Dossier") + " · " + cases.length + " " + t("projects", "projets"), blurb: cases.map((c) => c.title.replace(" — VR", "")).join(", "), cta: t("Double-click to open", "Double-clic pour ouvrir") }, go: () => openApp("work") },
];
$("#folders").innerHTML = deskIcons
  .map((c, i) => `<button class="fld${c.file ? " file" : ""}" data-i="${i}" style="--c:${c.x};--r:${c.y}"><span class="fi">${c.file ? fileSvg : c.fk ? texFolder(c.fk) : folderSvg}</span><span class="fl">${c.label}</span></button>`)
  .join("");
const letters = (w: string) => [...w].map((ch) => `<span class="lt">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
$("#greet").innerHTML = `<p>${t("welcome to", "bienvenue sur")}</p><h1 aria-label="${t("Lydia’s portfolio", "Le portfolio de Lydia")}"><span class="wd" aria-hidden="true">${letters(t("Lydia’s", "portfolio"))}</span> <span class="wd" aria-hidden="true">${letters(t("portfolio", "de Lydia"))}</span><span class="lt dot" aria-hidden="true">.</span></h1><small>${hero.role}, ${hero.place}</small>`;
/* phone only (hidden by CSS on desktop): the three things a recruiter wants, one tap away */
$("#greet").insertAdjacentHTML("beforeend", `<div id="m-cta"><button type="button" class="pri" data-go="work">${t("See my work", "Voir mes projets")}</button><button type="button" data-go="cv">${t("Résumé", "CV")}</button><button type="button" data-go="mail">${t("Say hello", "Me contacter")}</button></div>`);
$("#m-cta").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("[data-go]");
  if (b) openApp(b.dataset.go!);
});

/* letters lean toward the pointer, lift, tilt and warm up; click to make one hop */
{
  const lts = [...document.querySelectorAll<HTMLElement>("#greet .lt")];
  const st = lts.map(() => ({ v: 0 }));
  let px = -9999;
  let py = -9999;
  let run = false;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = () => {
    let busy = false;
    lts.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / 150);
      const s = st[i];
      s.v += (near - s.v) * 0.16;
      if (Math.abs(near - s.v) > 0.003) busy = true;
      const k = s.v;
      el.style.setProperty("--k", k.toFixed(3));
      el.style.transform = `translate(${(dx / 150) * -6 * k}px, ${-18 * k}px) rotate(${(dx / 150) * 12 * k}deg) scale(${1 + 0.32 * k})`;
    });
    run = busy;
    if (busy) requestAnimationFrame(tick);
  };
  if (!calm) {
    addEventListener("pointermove", (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!run) {
        run = true;
        requestAnimationFrame(tick);
      }
    });
    addEventListener("pointerleave", () => {
      px = py = -9999;
      if (!run) {
        run = true;
        requestAnimationFrame(tick);
      }
    });
  }
  lts.forEach((el) =>
    el.addEventListener("click", () => {
      el.classList.remove("hop");
      void el.offsetWidth;
      el.classList.add("hop");
    }),
  );
}

/* language toggle */
document.querySelectorAll<HTMLButtonElement>(".lang button").forEach((b) =>
  b.addEventListener("click", () => {
    const booting = !!b.closest("#boot");
    const keep: Record<string, string> = booting ? { s: "" } : { open: [...wins.keys()].join(",") };
    if (!booting && wins.has("work")) {
      const on = document.querySelector<HTMLElement>(".win .side-i.on[data-case]")?.dataset.case;
      if (on) keep.case = on;
    }
    switchLang(b.dataset.l as "en" | "fr", keep);
  }),
);
$("#sticky-hi").addEventListener("click", () => openApp("mail"));

/* widgets */
mountWidgets($("#widgets"), cases, openApp, () => sfx.tick());

let dragged = false;
document.querySelectorAll<HTMLElement>(".fld").forEach((f) => {
  const it = deskIcons[Number(f.dataset.i)];
  const select = () => document.querySelectorAll(".fld").forEach((o) => o.classList.toggle("sel", o === f));
  f.addEventListener("click", () => {
    if (dragged) return;
    select();
    sfx.tick();
    if (matchMedia("(pointer: coarse)").matches) it.go();
  });
  f.addEventListener("dblclick", () => !dragged && it.go());
  f.addEventListener("keydown", (e) => e.key === "Enter" && it.go());
  let sx = 0, sy = 0, ox = 0, oy = 0, down = false;
  f.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || matchMedia("(max-width: 759px)").matches) return;
    down = true;
    dragged = false;
    sx = e.clientX;
    sy = e.clientY;
    ox = f.offsetLeft;
    oy = f.offsetTop;
    f.setPointerCapture(e.pointerId);
  });
  f.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (!dragged && Math.hypot(dx, dy) < 5) return;
    if (!dragged) select();
    dragged = true;
    const host = f.parentElement!;
    f.classList.add("drag");
    f.style.left = Math.max(0, Math.min(host.clientWidth - f.offsetWidth, ox + dx)) + "px";
    f.style.top = Math.max(MB, Math.min(host.clientHeight - f.offsetHeight - 90, oy + dy)) + "px";
  });
  const up = () => {
    down = false;
    f.classList.remove("drag");
    setTimeout(() => (dragged = false), 0);
  };
  f.addEventListener("pointerup", up);
  f.addEventListener("pointercancel", up);
});
winsEl.addEventListener("pointerdown", (e) => e.target === winsEl && document.querySelectorAll(".fld").forEach((o) => o.classList.remove("sel")));
$("#folders").addEventListener("pointerdown", (e) => e.target === e.currentTarget && document.querySelectorAll(".fld").forEach((o) => o.classList.remove("sel")));

/* ================= Menu bar ================= */
document.querySelectorAll<HTMLElement>("[data-open]").forEach((b) => b.addEventListener("click", () => openApp(b.dataset.open!)));
$("#mb-logo").addEventListener("click", () => openApp("about"));
const clock = () => {
  const d = new Date();
  $("#mb-clock").textContent = d.toLocaleDateString(LOC, { weekday: "short", day: "numeric", month: "short" }) + "  " + d.toLocaleTimeString(LOC, { hour: "2-digit", minute: "2-digit" });
  const lt = document.getElementById("lk-time");
  const ld = document.getElementById("lk-date");
  if (!lt || !ld) return;
  lt.textContent = d.toLocaleTimeString(LOC, { hour: "2-digit", minute: "2-digit" });
  ld.textContent = d.toLocaleDateString(LOC, { weekday: "long", day: "numeric", month: "long" });
};
clock();
setInterval(clock, 10000);

/* ================= Control Center ================= */
const cc = $("#cc");
function toggleCC(force?: boolean) {
  const open = force ?? cc.hidden;
  if (open === !cc.hidden) return;
  cc.hidden = !open;
  $("#mb-cc").setAttribute("aria-expanded", String(open));
  if (open) {
    sfx.spot();
    cc.animate([{ opacity: 0, transform: "translateY(-8px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: dur(260), easing: EASE_OUT });
  }
}
$("#mb-cc").addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCC();
});
cc.addEventListener("click", (e) => e.stopPropagation());
document.addEventListener("click", () => toggleCC(false));

function setSound(on: boolean) {
  sfx.enabled = on;
  $("#cc-sound").setAttribute("aria-pressed", String(on));
  $("#cc-sound small").textContent = on ? t("On", "Activé") : t("Off", "Désactivé");
  if (on) {
    sfx.unlock();
    sfx.tick();
  }
}
function setTheme(dark: boolean) {
  document.body.classList.toggle("dark", dark);
  wall.setDark(dark);
  $("#cc-theme").setAttribute("aria-pressed", String(dark));
  $("#cc-theme small").textContent = dark ? t("On", "Activé") : t("Off", "Désactivé");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#2a1328" : "#f3b6c6");
}
$("#cc-sound").addEventListener("click", () => setSound(!sfx.enabled));
$("#cc-theme").addEventListener("click", () => {
  sfx.tick();
  setTheme(!document.body.classList.contains("dark"));
});
$("#cc-bright").addEventListener("input", (e) => {
  const v = Number((e.target as HTMLInputElement).value) / 100;
  document.documentElement.style.setProperty("--dim", String((1 - v) * 0.75));
});
$("#cc-replay").addEventListener("click", () => {
  location.reload();
});

/* ================= Spotlight ================= */
interface Item { label: string; sub: string; ic: string; kw: string; run: () => void }
const items: Item[] = [
  ...APPS.map((a) => ({ label: a.name, sub: t("App", "Application"), ic: icon(a.id), kw: a.keywords, run: () => openApp(a.id) })),
  ...cases.map((c) => ({ label: c.title, sub: t("Project", "Projet") + " · " + c.kind, ic: icon("work"), kw: c.blurb + " " + c.kind, run: () => openApp("work", c.id) })),
  { label: t("Switch appearance", "Changer l’apparence"), sub: t("Light / Dark", "Clair / Sombre"), ic: "", kw: "dark light theme mode appearance sombre clair thème", run: () => setTheme(!document.body.classList.contains("dark")) },
  { label: t("Sound on / off", "Son activé / désactivé"), sub: t("Interface sounds", "Sons de l’interface"), ic: "", kw: "sound mute audio son muet", run: () => setSound(!sfx.enabled) },
];
const spot = $("#spot");
const sq = $<HTMLInputElement>("#spot-q");
const sl = $("#spot-list");
let sel = 0;
let shown: Item[] = [];
function drawSpot() {
  const q = sq.value.trim().toLowerCase();
  shown = items.filter((i) => !q || (i.label + " " + i.kw + " " + i.sub).toLowerCase().includes(q)).slice(0, 7);
  sel = Math.min(sel, Math.max(0, shown.length - 1));
  sl.innerHTML = shown.length
    ? shown.map((i, n) => `<li role="option" class="${n === sel ? "on" : ""}" data-n="${n}"><span class="si">${i.ic}</span><b>${i.label}</b><small>${i.sub}</small></li>`).join("")
    : `<li class="none">${t("Nothing for", "Rien pour")} “${sq.value.replace(/</g, "&lt;")}”. ${t("Try “work” or “mail”.", "Essayez « projets » ou « contact ».")}</li>`;
}
function toggleSpot(force?: boolean) {
  const open = force ?? spot.hidden;
  spot.hidden = !open;
  if (open) {
    sfx.spot();
    sq.value = "";
    sel = 0;
    drawSpot();
    sq.focus();
    spot.querySelector(".spot-box")!.animate([{ opacity: 0, transform: "scale(.96) translateY(-10px)" }, { opacity: 1, transform: "none" }], { duration: dur(280), easing: EASE_OUT });
  }
}
sq.addEventListener("input", () => {
  sel = 0;
  drawSpot();
});
sq.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") (sel = (sel + 1) % Math.max(1, shown.length)), drawSpot(), e.preventDefault();
  else if (e.key === "ArrowUp") (sel = (sel - 1 + shown.length) % Math.max(1, shown.length)), drawSpot(), e.preventDefault();
  else if (e.key === "Enter" && shown[sel]) {
    const it = shown[sel];
    toggleSpot(false);
    it.run();
  }
});
sl.addEventListener("click", (e) => {
  const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-n]");
  if (!li) return;
  const it = shown[Number(li.dataset.n)];
  toggleSpot(false);
  it.run();
});
spot.addEventListener("pointerdown", (e) => e.target === spot && toggleSpot(false));
$("#mb-search").addEventListener("click", (e) => {
  e.stopPropagation();
  toggleSpot();
});
addEventListener("keydown", (e) => {
  if (document.body.classList.contains("locked")) return;
  if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === " " && (e.ctrlKey || e.metaKey))) {
    e.preventDefault();
    toggleSpot();
  } else if (e.key === "Escape") {
    toggleSpot(false);
    toggleCC(false);
  } else if (e.key === "w" && e.altKey && active) closeWin(active);
});

/* ================= Notification ================= */
let notifOn = false;
function notify() {
  if (notifOn) return;
  notifOn = true;
  const n = $("#notif");
  n.hidden = false;
  sfx.notify();
  n.animate([{ transform: "translateX(120%) scale(.96)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: dur(700), easing: EASE_OUT });
  let timer = 0;
  const hide = () => {
    clearTimeout(timer);
    n.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(60%)" }], { duration: dur(300), easing: "ease-in" }).onfinish = () => (n.hidden = true);
    n.style.pointerEvents = "none";
  };
  const arm = () => {
    clearTimeout(timer);
    timer = window.setTimeout(hide, 15000);
  };
  n.addEventListener("pointerenter", () => clearTimeout(timer));
  n.addEventListener("pointerleave", arm);
  n.addEventListener("focusin", () => clearTimeout(timer));
  n.addEventListener("focusout", arm);
  n.querySelector(".n-x")!.addEventListener("click", (e) => {
    e.stopPropagation();
    sfx.tick();
    hide();
  });
  const go = () => {
    hide();
    openApp("mail");
  };
  n.addEventListener("click", go);
  n.addEventListener("keydown", (e) => e.key === "Enter" && e.target === n && go());
  arm();
}
/* ================= Boot → Lock → Desktop ================= */
const body = document.body;
let entered = false;

function enterDesktop(quiet = false) {
  if (entered) return;
  entered = true;
  if (!quiet) sfx.unlockSound();
  $("#lock").classList.add("gone");
  body.classList.remove("locked");
  body.classList.add("on");
  setTimeout(() => $("#lock").remove(), 1100);
  const want = (params.get("open") ?? "").split(",").filter(Boolean);
  want.forEach((id, i) => setTimeout(() => openApp(id, params.get("case") ?? undefined), quiet ? 0 : 700 + i * 250));
  const sc = Number(params.get("scroll") ?? 0);
  if (sc) setTimeout(() => ((document.querySelector("#case-main .scroll") as HTMLElement).scrollTop = sc), 600);
  if (!quiet && !mobile()) setTimeout(notify, 4200);
  if (params.get("notif")) setTimeout(notify, 700);
}

function lock() {
  body.classList.remove("booting");
  const go = () => {
    removeEventListener("keydown", key);
    enterDesktop();
  };
  const key = (e: KeyboardEvent) => !e.metaKey && !e.ctrlKey && e.key.length <= 10 && go();
  $("#lk-enter").addEventListener("click", go);
  $("#lock").addEventListener("pointerdown", go);
  setTimeout(() => addEventListener("keydown", key), 600);
}

if (localStorage.getItem("dark") === "1" || params.get("dark")) setTheme(true);
$("#cc-theme").addEventListener("click", () => localStorage.setItem("dark", body.classList.contains("dark") ? "1" : "0"));

/* no intro: the desktop opens straight away (?s=lock still shows the lock screen) */
sfx.enabled = false;
$("#boot").remove();
body.classList.remove("booting");
if (params.get("s") === "lock") lock();
else {
  enterDesktop(true);
  if (!params.get("s") && !mobile()) setTimeout(notify, 3200);
}

startTracking("/");
