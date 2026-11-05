import "./room.css";
import { cases } from "../content";
import { lang, t } from "../i18n";
import { Sfx } from "../sound";
import { SPOTS, TOTAL, proxyHtml } from "./scene";
import type { World } from "./world";
import { Ambience } from "./ambience";
import { strum } from "../about";
import { panel, dialRotation } from "./panels";
import { initChat } from "./chat-ui";
import { mountThisThat } from "./thisthat";
import { contact, hero } from "../content";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sfx = new Sfx();
sfx.enabled = false;

const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;

document.getElementById("room-app")!.innerHTML = `
<div class="room" id="room">
  <canvas class="gl" id="gl" aria-hidden="true"></canvas>
  <div class="vignette" aria-hidden="true"></div>
  <div class="proxies" id="proxies" role="group" aria-label="${t("Objects in the room", "Objets de la chambre")}">${proxyHtml()}</div>
  <div class="lights" id="lights" role="status">
    <div class="loading"><p>${t("Setting up the room", "Installation de la chambre")}</p><div class="bar"><i id="load-bar"></i></div></div>
  </div>

  <header class="hud-top">
    <div class="name">Lydia Benosmane</div>
    <div class="btns">
      <a class="pill back" href="./?s=desk" aria-label="${t("Back to the portfolio", "Retour au portfolio")}">← ${t("Portfolio", "Portfolio")}</a>
      <button type="button" class="pill" id="hints">${t("Hints", "Indices")}</button>
      <button type="button" class="pill" id="sound-pill" aria-pressed="false" title="${t("Sea and a snoring cat", "La mer et un chat qui ronfle")}">${t("Sound off", "Son coupé")}</button>
      <button type="button" class="pill" id="menu-btn" aria-expanded="false" aria-controls="drawer">${t("Menu", "Menu")}</button>
    </div>
  </header>

  <section class="welcome" aria-label="${t("Welcome", "Bienvenue")}">
    <h1>${t("Welcome to my room", "Bienvenue dans ma chambre")}</h1>
    <p>${t("Click around and see what you find, say hi to the cats, or open the menu for a quicker way through.", "Cliquez partout, dites bonjour aux chats, ou ouvrez le menu pour aller plus vite.")}</p>
    <div class="count" aria-live="polite"><span id="count-text"></span><span class="pips" id="pips" aria-hidden="true"></span></div>
  </section>

  <div class="scrim" id="scrim"></div>
  <section class="panel" id="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" hidden>
    <div class="pbar">
      <button type="button" class="orb ice" id="p-back" aria-label="${t("Back", "Retour")}" hidden>‹</button>
      <h2 id="panel-title"></h2>
      <button type="button" class="orb" id="p-close" aria-label="${t("Close", "Fermer")}">×</button>
    </div>
    <div class="pbody" id="p-body"></div>
    <div class="pstat"><span id="p-status"></span><span>lydia.room</span></div>
  </section>

  <div class="lap" id="lap" hidden>
    <button type="button" class="lap-scr" id="lap-scr" aria-label="${t("Open my portfolio", "Ouvrir mon portfolio")}"></button>
    <div class="lap-ui"><button type="button" class="gloss" id="lap-back">← ${t("Back to the room", "Retour à la chambre")}</button><p>${t("Click the screen to open my portfolio", "Cliquez sur l’écran pour ouvrir mon portfolio")}</p></div>
  </div>

  <aside class="drawer" id="drawer" aria-label="${t("Quick links", "Liens rapides")}">
    <header><h2>${t("Quick links", "Liens rapides")}</h2><button type="button" class="orb" id="d-close" aria-label="${t("Close menu", "Fermer le menu")}">×</button></header>
    <nav>

      <button type="button" data-go="laptop">${t("My portfolio (on the laptop)", "Mon portfolio (sur l’ordinateur)")}</button>
      <button type="button" data-go="thisthat">${t("This or that", "Ceci ou cela")}</button>
      <p class="grp">${t("More", "Et aussi")}</p>
      <button type="button" data-go="exp">${t("Experience", "Parcours")}</button>
      <button type="button" data-go="algiers">${t("Where I come from", "D'où je viens")}</button>
      <button type="button" data-go="paris">${t("Where I live", "Où j'habite")}</button>
      <button type="button" data-go="cv">${t("Résumé", "CV")}</button>
      <button type="button" data-go="cats">${t("The cats", "Les chats")}</button>
      <button type="button" data-go="sea">${t("The sea", "La mer")}</button>
      <button type="button" data-go="music">${t("Music", "Musique")}</button>
      <button type="button" data-go="phone">${t("Contact", "Contact")}</button>
    </nav>
    <p class="credit">${t("3D model", "Modèle 3D")}: “SM - Eiffel Tower”, Scott Marshall, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0</a>, <a href="https://poly.pizza/m/aIpJchqtRTg" target="_blank" rel="noreferrer">Poly Pizza</a>. ${t("Postcard", "Carte postale")}: ${t("Algiers harbour, c. 1899, public domain (Library of Congress via", "port d'Alger, vers 1899, domaine public (Bibliothèque du Congrès via")} <a href="https://commons.wikimedia.org/wiki/File:Algiers_harbor_1899.jpg" target="_blank" rel="noreferrer">Wikimedia Commons</a>).</p>
    <footer>
      <div class="seg" role="group" aria-label="${t("Language", "Langue")}"><button type="button" data-l="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-l="fr" aria-pressed="${lang === "fr"}">FR</button></div>
      <button type="button" class="gloss" id="sound" aria-pressed="false">${t("Sound off", "Son coupé")}</button>
    </footer>
  </aside>
</div>`;

const room = $("#room");
const canvas = $<HTMLCanvasElement>("#gl");
const proxiesEl = $("#proxies");
const lights = $("#lights");
const panelEl = $("#panel");
const pBody = $("#p-body");
const scrim = $("#scrim");
const drawer = $("#drawer");

/* ---------- little effects ---------- */
function burst(x: number, y: number, glyphs = ["✦", "✧", "♥"], n = 9) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "fx";
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.fontSize = 14 + Math.random() * 14 + "px";
    s.style.color = ["#ff4fa3", "#54d3ee", "#c3a8ff", "#ff9a3d"][i % 4];
    document.body.appendChild(s);
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
    const d = 38 + Math.random() * 46;
    s.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.3)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 14}px)) scale(1) rotate(${Math.random() * 90}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d * 1.2}px), calc(-50% + ${Math.sin(a) * d * 1.2 + 22}px)) scale(0.6)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" },
    ).onfinish = () => s.remove();
  }
}
const center = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
};
function toast(text: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  el.setAttribute("role", "status");
  document.body.appendChild(el);
  el.onanimationend = () => el.remove();
}

/* ---------- discovery counter ---------- */
const STORE = "room.found.v2";
const validKeys = new Set(SPOTS.map((s) => s.key));
const found = new Set<string>(
  (() => {
    try {
      return (JSON.parse(localStorage.getItem(STORE) || "[]") as string[]).filter((k) => validKeys.has(k));
    } catch {
      return [];
    }
  })(),
);
const pips = $("#pips");
pips.innerHTML = Array.from({ length: TOTAL }, () => "<i></i>").join("");
function paintCount() {
  $("#count-text").textContent = `${found.size} ${t("of", "sur")} ${TOTAL} ${t("discovered", "découverts")}`;
  [...pips.children].forEach((p, i) => p.classList.toggle("on", i < found.size));
}
paintCount();
function discover(key: string) {
  if (found.has(key)) return;
  found.add(key);
  try {
    localStorage.setItem(STORE, JSON.stringify([...found]));
  } catch {
    /* private mode */
  }
  paintCount();
  if (found.size === TOTAL) {
    toast(t("You found everything. Thanks for snooping ✦", "Vous avez tout trouvé. Merci d'avoir fouillé ✦"));
    for (let i = 0; i < 4; i++) setTimeout(() => burst(innerWidth * (0.25 + i * 0.16), innerHeight * 0.4, ["✦", "♥", "✧", "★"], 12), i * 160);
  }
}

/* ---------- panels ---------- */
let originEl: HTMLElement | null = null;
let lastFocus: HTMLElement | null = null;
let current = "";

function fillPanel(id: string, arg?: string) {
  const def = panel(id, arg);
  if (!def.html) return false;
  $("#panel-title").textContent = def.title;
  pBody.innerHTML = def.html;
  if (id === "thisthat") mountThisThat(pBody, { burst, tick: () => sfx.tick() });
  pBody.classList.toggle("flush", !!def.flush);
  pBody.scrollTop = 0;
  $("#p-status").textContent = def.status;
  panelEl.classList.toggle("small", !!def.small);
  const back = $("#p-back");
  back.hidden = !def.back;
  back.dataset.to = def.back?.to ?? "";
  if (def.back) back.setAttribute("aria-label", def.back.label);
  current = id + (arg ? ":" + arg : "");
  try {
    history.replaceState(null, "", "#" + (id === "case" ? "case-" + arg : id));
  } catch {
    /* sandboxed */
  }
  return true;
}

function flyFrom(el: HTMLElement | null) {
  const pr = panelEl.getBoundingClientRect();
  const r = (el ?? $("#menu-btn")).getBoundingClientRect();
  const dx = r.left + r.width / 2 - (pr.left + pr.width / 2);
  const dy = r.top + r.height / 2 - (pr.top + pr.height / 2);
  const s = Math.max(0.08, Math.min(0.5, r.width / pr.width));
  return `translate(${dx}px,${dy}px) scale(${s})`;
}

function openPanel(id: string, arg?: string, origin?: HTMLElement | null) {
  const wasOpen = !panelEl.hidden;
  if (!fillPanel(id, arg)) return;
  sfx.open();
  if (wasOpen) {
    if (!reduce) pBody.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.9,.2,1)" });
    return;
  }
  lastFocus = document.activeElement as HTMLElement;
  originEl = origin ?? null;
  panelEl.getAnimations().forEach((a) => a.cancel());
  panelEl.hidden = false;
  scrim.classList.add("on");
  panelEl.style.pointerEvents = "";
  if (!reduce) {
    panelEl.animate(
      [
        { transform: flyFrom(originEl), opacity: 0, filter: "blur(10px)" },
        { transform: "none", opacity: 1, filter: "blur(0)" },
      ],
      { duration: 560, easing: "cubic-bezier(.2,.9,.2,1.04)" },
    );
  }
  $("#p-close").focus({ preventScroll: true });
}

function closePanel() {
  if (panelEl.hidden) return;
  sfx.close();
  scrim.classList.remove("on");
  panelEl.style.pointerEvents = "none";
  const done = () => {
    panelEl.hidden = true;
    pBody.innerHTML = "";
    current = "";
    lastFocus?.focus({ preventScroll: true });
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {
      /* sandboxed */
    }
  };
  panelEl.getAnimations().forEach((a) => a.cancel());
  if (reduce) return done();
  panelEl.animate(
    [
      { transform: "none", opacity: 1, filter: "blur(0)" },
      { transform: flyFrom(originEl), opacity: 0, filter: "blur(8px)" },
    ],
    { duration: 320, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" },
  ).onfinish = done;
}

$("#p-close").addEventListener("click", closePanel);
scrim.addEventListener("click", closePanel);
$("#p-back").addEventListener("click", (e) => {
  const to = (e.currentTarget as HTMLElement).dataset.to;
  if (to) openPanel(to);
});

pBody.addEventListener("click", (e) => {
  const el = e.target as HTMLElement;
  const tile = el.closest<HTMLElement>("[data-case]");
  if (tile) return openPanel("case", tile.dataset.case);
  const zoom = el.closest<HTMLElement>("[data-zoom]");
  if (zoom) return lightbox(zoom.dataset.zoom!, zoom.dataset.alt ?? "");
  const cp = el.closest<HTMLElement>("[data-copy]");
  if (cp) {
    const old = cp.textContent;
    navigator.clipboard?.writeText(cp.dataset.copy!).then(
      () => (cp.textContent = t("Copied ✦", "Copié ✦")),
      () => {
        const r = document.createRange();
        const mail = document.getElementById("mail-text");
        if (mail) {
          r.selectNodeContents(mail);
          getSelection()?.removeAllRanges();
          getSelection()?.addRange(r);
        }
      },
    );
    setTimeout(() => (cp.textContent = old), 1800);
    return;
  }
  const op = el.closest<HTMLElement>("[data-open]");
  if (op) return openPanel(op.dataset.open!);
  const talk = el.closest<HTMLElement>("[data-chat]");
  if (talk) {
    const id = talk.dataset.chat as "ferrari" | "lambo";
    closePanel();
    return chat.open(id, document.getElementById(id === "ferrari" ? "hs-cat-a" : "hs-cat-b"));
  }
  const dl = el.closest<HTMLElement>("[data-dial]");
  if (dl) dial(Number(dl.dataset.dial));
});
pBody.addEventListener("keydown", (e) => {
  const hole = (e.target as HTMLElement).closest<HTMLElement>("g[data-dial]");
  if (hole && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    dial(Number(hole.dataset.dial));
  }
});

/* ---------- the rotary phone: the dial really turns ---------- */
let dialing = false;
function dial(n: number) {
  if (dialing) return;
  const ring = pBody.querySelector<SVGGElement>("#dial-rot");
  const note = pBody.querySelector<HTMLElement>("#dial-note");
  if (!ring) return;
  dialing = true;
  sfx.tick();
  const turn = dialRotation(n);
  const act = () => {
    if (n === 1) {
      window.open(contact.links[0]?.href ?? "https://www.linkedin.com", "_blank", "noopener");
      if (note) note.textContent = t("Calling LinkedIn…", "J'appelle LinkedIn…");
    } else if (n === 2) {
      location.href = `mailto:${contact.email}`;
      if (note) note.textContent = t("Opening your mail app…", "J'ouvre votre messagerie…");
    } else if (n === 3) {
      navigator.clipboard?.writeText(contact.email).catch(() => {});
      if (note) note.textContent = t("Address copied. Paste it anywhere.", "Adresse copiée. Collez-la où vous voulez.");
    } else if (note) note.textContent = t("Nobody picks up. Try 1, 2 or 3.", "Personne ne répond. Essayez 1, 2 ou 3.");
    dialing = false;
  };
  if (reduce) return act();
  ring.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${turn}deg)` }], { duration: 380 + turn * 2.2, easing: "cubic-bezier(.3,.1,.3,1)", fill: "forwards" }).onfinish = () => {
    ring.animate([{ transform: `rotate(${turn}deg)` }, { transform: "rotate(0deg)" }], { duration: 260 + turn * 3.4, easing: "cubic-bezier(.4,0,.6,1)" }).onfinish = () => {
      ring.getAnimations().forEach((a) => a.cancel());
      act();
    };
  };
}
addEventListener("keydown", (e) => {
  if (current === "phone" && ["1", "2", "3"].includes(e.key) && !(e.target as HTMLElement).closest("input,textarea")) dial(Number(e.key));
});

function lightbox(src: string, alt: string) {
  const box = document.createElement("div");
  box.className = "lbx";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", alt);
  box.innerHTML = `<img src="${src}" alt="${alt.replace(/"/g, "&quot;")}" />`;
  const close = () => {
    removeEventListener("keydown", key, true);
    box.remove();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  };
  box.addEventListener("click", close);
  addEventListener("keydown", key, true);
  document.body.appendChild(box);
}

/* keep Tab inside the open dialog */
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (lapOpen) closeLaptop();
    else if (chat.isOpen()) chat.close();
    else if (drawer.classList.contains("on")) toggleDrawer(false);
    else closePanel();
    return;
  }
  if (e.key !== "Tab") return;
  const box = !panelEl.hidden ? panelEl : drawer.classList.contains("on") ? drawer : null;
  if (!box) return;
  const f = [...box.querySelectorAll<HTMLElement>("a[href],button:not([hidden]),iframe,[tabindex]:not([tabindex='-1'])")].filter((x) => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const lastEl = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    lastEl.focus();
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    e.preventDefault();
    first.focus();
  }
});

/** the object in the room a panel grows out of */
function originFor(id: string, arg?: string): HTMLElement | null {
  const spot = id === "case" ? "laptop" : id === "cats" ? "cat-photo-1" : id === "todo" ? "notes" : id === "thisthat" ? "about" : id;
  return document.getElementById("hs-" + spot);
}

/* ---------- drawer ---------- */
function toggleDrawer(on: boolean) {
  drawer.classList.toggle("on", on);
  $("#menu-btn").setAttribute("aria-expanded", String(on));
  if (on) {
    sfx.tick();
    $("#d-close").focus({ preventScroll: true });
  } else if (!panelEl.hidden) $("#p-close").focus({ preventScroll: true });
  else $("#menu-btn").focus({ preventScroll: true });
}
$("#menu-btn").addEventListener("click", () => toggleDrawer(!drawer.classList.contains("on")));
$("#d-close").addEventListener("click", () => toggleDrawer(false));
drawer.querySelectorAll<HTMLElement>("[data-go]").forEach((b) =>
  b.addEventListener("click", () => {
    const [id, arg] = b.dataset.go!.split(":");
    toggleDrawer(false);
    if (id === "laptop") return openLaptop();
    openPanel(id, arg, originFor(id, arg));
  }),
);
drawer.querySelectorAll<HTMLButtonElement>("[data-l]").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.l === lang) return;
    try {
      localStorage.setItem("lang", b.dataset.l!);
    } catch {
      /* ignore */
    }
    location.search = "?lang=" + b.dataset.l;
  }),
);
/* ---------- sound: interface clicks plus the sea and a snoring cat ---------- */
const amb = new Ambience();
const soundBtn = $<HTMLButtonElement>("#sound");
const soundPill = $<HTMLButtonElement>("#sound-pill");
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode */
    }
  },
};
let soundOn = false;
function paintSound() {
  const label = soundOn ? t("Sound on", "Son activé") : t("Sound off", "Son coupé");
  for (const b of [soundBtn, soundPill]) {
    b.setAttribute("aria-pressed", String(soundOn));
    b.textContent = label;
  }
}
function setSound(on: boolean) {
  soundOn = on;
  sfx.enabled = on;
  store.set("room.sound", on ? "1" : "0");
  if (on) {
    sfx.unlock();
    void amb.start();
    toast(t("Listen: the sea outside, and Lamborghini snoring.", "Écoutez : la mer dehors, et Lamborghini qui ronfle."));
  } else amb.stop();
  paintSound();
}
soundBtn.addEventListener("click", () => setSound(!soundOn));
soundPill.addEventListener("click", () => setSound(!soundOn));
/* a remembered "on" starts at the first click or key, because browsers block audio before that */
if (store.get("room.sound") === "1") {
  soundOn = true;
  paintSound();
  const kick = () => {
    removeEventListener("pointerdown", kick);
    removeEventListener("keydown", kick);
    sfx.enabled = true;
    sfx.unlock();
    void amb.start();
  };
  addEventListener("pointerdown", kick);
  addEventListener("keydown", kick);
}

/* ---------- the lamp switches the room to night ---------- */
let night = store.get("room.night") === "1";
room.dataset.mood = night ? "night" : "day";
amb.setNight(night);
function toggleNight() {
  night = !night;
  room.dataset.mood = night ? "night" : "day";
  store.set("room.night", night ? "1" : "0");
  world?.setNight(night);
  amb.setNight(night);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", night ? "#0f0a12" : "#241d20");
  toast(night ? t("Lights out. Only the lamp and the moon.", "Lumières éteintes. Seulement la lampe et la lune.") : t("Lights back on.", "Lumières rallumées."));
}

/* ---------- hints ---------- */
$("#hints").addEventListener("click", () => {
  sfx.tick();
  const todo = SPOTS.filter((s) => !found.has(s.key));
  if (!todo.length) return toast(t("Nothing left to find. Go say hi to the cats.", "Plus rien à trouver. Allez dire bonjour aux chats."));
  todo.forEach((s) => document.getElementById("hs-" + s.id)?.classList.add("hint"));
  setTimeout(() => proxiesEl.querySelectorAll(".hint").forEach((h) => h.classList.remove("hint")), 3600);
});

/* ---------- the room ---------- */
/** a little reaction in the room when you pet, feed or play with a cat in the chat */
function reactCat(spot: string, kind: "pet" | "treat" | "play") {
  const el = document.getElementById("hs-" + spot);
  if (!el) return;
  world?.hop(spot);
  if (kind === "play") setTimeout(() => world?.hop(spot), 520);
  const [x, y] = center(el);
  burst(x, y - 20, kind === "treat" ? ["★", "✦"] : ["♥"], kind === "play" ? 3 : 6);
}
const chat = initChat(room, {
  scrim,
  openPanel,
  burst,
  react: reactCat,
  lightbox,
  tick: () => sfx.tick(),
  notify: () => sfx.notify(),
  reduce,
});

let sips = 0;
/* my favourite things on the shelves: each one has a little reaction */
const FAVS: Record<string, { fx: string[]; lines: string[] }> = {
  perfume: { fx: ["✧", "✦", "·"], lines: [t("Pssht. Something rosy and a little bit dramatic.", "Pschitt. Quelque chose de rosé et un peu dramatique."), t("One more spray, for the cats. They hate it.", "Encore un pschitt, pour les chats. Ils détestent.")] },
  lipstick: { fx: ["♥", "💋", "♥"], lines: [t("Red lipstick: instant confidence, no prototype needed.", "Rouge à lèvres : confiance immédiate, sans prototype."), t("The right red can fix any Monday.", "Le bon rouge répare n’importe quel lundi.")] },
  sunnies: { fx: ["♥", "☀", "♥"], lines: [t("Heart-shaped, obviously. For the beach in Béjaïa.", "En forme de cœur, évidemment. Pour la plage à Béjaïa."), t("Mermaid meets glamour, remember?", "Sirène et glamour, vous vous souvenez ?")] },
  bag: { fx: ["✦", "♥", "✧"], lines: [t("Inside: a sketchbook, a matcha card and cat hair. Always cat hair.", "Dedans : un carnet de croquis, une carte de fidélité matcha et des poils de chat. Toujours des poils de chat."), t("Fashion was my first design teacher.", "La mode a été mon premier prof de design.")] },
};
const favSeen: Record<string, number> = {};

/* ---------- the laptop: zoom into the screen, then into the real portfolio ---------- */
const lap = $("#lap");
const lapScr = $<HTMLButtonElement>("#lap-scr");
let lapOpen = false;
let lapFrame: HTMLIFrameElement | null = null;
const portfolioUrl = () => `./?s=desk&lang=${lang}`;
function fitScreen() {
  if (!world || !lapOpen) return;
  const r = world.screenRect();
  lapScr.style.left = r.x + "px";
  lapScr.style.top = r.y + "px";
  lapScr.style.width = r.w + "px";
  lapScr.style.height = r.h + "px";
  if (lapFrame) {
    const s = Math.max(r.w / innerWidth, r.h / innerHeight);
    lapFrame.style.width = innerWidth + "px";
    lapFrame.style.height = innerHeight + "px";
    lapFrame.style.transform = `translate(${(r.w - innerWidth * s) / 2}px, ${(r.h - innerHeight * s) / 2}px) scale(${s})`;
  }
}
async function openLaptop() {
  if (!world || lapOpen) return;
  lapOpen = true;
  sfx.open();
  closePanel();
  room.classList.add("zoomed");
  if (!lapFrame) {
    lapFrame = document.createElement("iframe");
    lapFrame.title = t("Lydia’s portfolio", "Le portfolio de Lydia");
    lapFrame.tabIndex = -1;
    lapFrame.setAttribute("aria-hidden", "true");
    lapFrame.src = portfolioUrl();
    lapScr.appendChild(lapFrame);
  }
  lap.hidden = false;
  lap.classList.remove("on", "go");
  await world.zoom(true);
  if (!lapOpen) return;
  fitScreen();
  lap.classList.add("on");
  lapScr.focus({ preventScroll: true });
}
async function closeLaptop() {
  if (!lapOpen || lap.classList.contains("go")) return;
  lapOpen = false;
  sfx.close();
  lap.classList.remove("on");
  await world?.zoom(false);
  if (lapOpen) return;
  lap.hidden = true;
  room.classList.remove("zoomed");
  document.getElementById("hs-laptop")?.focus({ preventScroll: true });
}
/* clicking the screen grows it to fill the window, then the page becomes the portfolio itself */
lapScr.addEventListener("click", () => {
  if (!lapOpen || lap.classList.contains("go")) return;
  lap.classList.add("go");
  sfx.open();
  const r = lapScr.getBoundingClientRect();
  const s0 = Math.max(r.width / innerWidth, r.height / innerHeight);
  const go = () => (location.href = portfolioUrl());
  if (reduce) return go();
  const dur = 720;
  const ease = "cubic-bezier(.65,0,.25,1)";
  lapScr.animate([{ left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", borderRadius: "6px" }, { left: "0px", top: "0px", width: innerWidth + "px", height: innerHeight + "px", borderRadius: "0px" }], { duration: dur, easing: ease, fill: "forwards" });
  lapFrame?.animate([{ transform: `translate(${(r.width - innerWidth * s0) / 2}px, ${(r.height - innerHeight * s0) / 2}px) scale(${s0})` }, { transform: "translate(0px, 0px) scale(1)" }], { duration: dur, easing: ease, fill: "forwards" });
  setTimeout(go, dur + 40);
});
$("#lap-back").addEventListener("click", () => void closeLaptop());
addEventListener("resize", () => requestAnimationFrame(fitScreen));

function activate(id: string) {
  const el = document.getElementById("hs-" + id);
  const spot = SPOTS.find((x) => x.id === id);
  if (!el || !spot) return;
  const [x, y] = center(el);
  sfx.tick();
  burst(x, y);
  discover(spot.key);
  el.classList.remove("hint");
  const fav = FAVS[id];
  if (fav) {
    world?.kick(id);
    world?.hop(id);
    burst(x, y, fav.fx, 10);
    const lines = fav.lines;
    const n = (favSeen[id] = (favSeen[id] ?? -1) + 1);
    return toast(lines[n % lines.length]);
  }
  switch (id) {
    case "laptop":
      return openLaptop();
    case "about":
      return openPanel("thisthat", undefined, el);
    case "matcha": {
      world?.kick("matcha");
      world?.hop("matcha");
      const lines = [t("Sip. Earthy and perfect.", "Une gorgée. Terreuse et parfaite."), t("Another sip. Don't tell the cats.", "Encore une gorgée. Ne le dites pas aux chats."), t("Okay, last one. (It is not.)", "Bon, la dernière. (Ce n'est pas la dernière.)")];
      return toast(lines[sips++ % lines.length]);
    }
    case "plant":
      world?.kick("plant");
      return toast(t("She's thriving. Thanks for asking.", "Elle va très bien. Merci de demander."));
    case "music":
      strum();
      world?.kick("music");
      return openPanel(id, undefined, el);
    case "exp":
      world?.kick("exp");
      return openPanel(id, undefined, el);
    case "cat-photo-1":
    case "cat-photo-2":
      return openPanel("cats", undefined, el);
    case "notes":
      return openPanel("todo", undefined, el);
    case "lamp":
      return toggleNight();
    case "cat-a":
      return chat.open("ferrari", el);
    case "cat-b":
      return chat.open("lambo", el);
    default:
      openPanel(id, undefined, el);
  }
}
proxiesEl.addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>(".hs");
  if (b) activate(b.dataset.id!);
});

/* ---------- the 3D room ---------- */
let world: World | null = null;
const shortTitle: Record<string, string> = { khamsa: "Yedd ouahda ma tsafek", "suite-numerique": "Suite numérique" };
const proxyMap = new Map<string, HTMLElement>();
proxiesEl.querySelectorAll<HTMLElement>(".hs").forEach((b) => proxyMap.set(b.dataset.id!, b));
const debug = new URLSearchParams(location.search).has("debug");
const loadBar = $("#load-bar");
const showProgress = (p: number) => (loadBar.style.transform = `scaleX(${p})`);

/** WebGL is missing or the room failed to start: keep the whole portfolio usable through the menu */
function noRoom() {
  room.classList.add("nogl");
  $(".welcome p").textContent = t("The 3D room can't run on this device, but everything is in the menu.", "La chambre 3D ne peut pas s'afficher sur cet appareil, mais tout est dans le menu.");
  lights.classList.add("off");
  setTimeout(() => lights.remove(), 800);
  toggleDrawer(true);
  toast(t("The 3D room can't start on this device. Everything is in the menu.", "La chambre 3D ne peut pas démarrer sur cet appareil. Tout est dans le menu."));
}

/* the 3D engine is a separate file: the page, menu and chat appear without waiting for it */
import("./world")
  .then(({ createWorld, NoWebGL }) =>
    createWorld({
      canvas,
      proxies: proxyMap,
      reduce,
      night,
      debug,
      titles: Object.fromEntries(cases.map((c) => [c.id, shortTitle[c.id] ?? c.title.replace(" — VR", "")])),
      resume: { heading: t("Résumé", "CV"), name: "Lydia Benosmane", role: hero.role },
      notes: [
        { title: "to do", text: t("land the internship", "décrocher le stage"), color: "#f7efc8", x: -0.31, y: 0.12, r: 0.05 },
        { text: t("best matcha in paris?", "meilleur matcha de paris ?"), color: "#f6c9d8", x: -0.1, y: 0.16, r: -0.04 },
        { text: t("kind words", "mots doux"), color: "#cfe6d0", x: 0.11, y: 0.13, r: 0.03 },
        { text: t("sketch every day", "croquer chaque jour"), color: "#cfe0f0", x: -0.3, y: -0.1, r: -0.03 },
        { text: t("answer emails", "répondre aux mails"), color: "#f7efc8", x: -0.08, y: -0.12, r: 0.05 },
      ],
      onPick: activate,
      onHover: () => {},
      onProgress: showProgress,
      onLost: () => {
        toast(t("The graphics card reset. Reloading the room…", "La carte graphique s'est réinitialisée. Rechargement de la chambre…"));
        setTimeout(() => location.reload(), 1200);
      },
    }).catch((err) => {
      console.warn("Room could not start:", err instanceof NoWebGL ? "WebGL 2 missing" : err);
      noRoom();
      return null;
    }),
  )
  .then((w) => {
    if (!w) return;
    world = w;
    lights.classList.add("off");
    setTimeout(() => lights.remove(), 1500);
  })
  .catch((err) => {
    console.warn("Room script failed to load:", err);
    noRoom();
  });
/** the 3D scene sleeps while something is open on top of it */
setInterval(() => world?.setPaused(!panelEl.hidden || chat.isOpen() || drawer.classList.contains("on")), 250);

/* ---------- start ---------- */
setTimeout(() => lights.remove(), 25000);

/* a gentle nudge for first-time visitors who have not clicked anything yet */
setTimeout(() => {
  if (found.size === 0) $("#hints").classList.add("nudge");
}, 14000);
$("#hints").addEventListener("click", () => $("#hints").classList.remove("nudge"));

const fromHash = () => {
  const h = location.hash.slice(1);
  if (!h) return;
  if (h.startsWith("case-")) openPanel("case", h.slice(5), originFor("case", h.slice(5)));
  else if (panel(h).html) openPanel(h, undefined, originFor(h));
};
setTimeout(fromHash, reduce ? 0 : 1500);
