/* Phone version: the portfolio as an iPhone.
   A home screen with widgets, app icons and a dock. Each app opens full screen with a
   "‹ Home" bar and a home indicator, the way iOS does. Desktop is untouched. */
import "./ios.css";
import { cases } from "./content";
import { icon } from "./apps";
import { thumbFor } from "./desk";
import { lang, t } from "./i18n";

export interface IosDeps {
  open: (id: string, arg?: string) => void;
  roomIcon: string;
  openRoom: () => void;
}

/* the desktop dock already holds these icons (hidden on phones), and SVG gradients with a duplicate id break;
   give every copy its own ids */
let uid = 0;
const uniq = (svg: string) => {
  const k = `i${++uid}-`;
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  return ids.reduce((out, id) => out.split(`id="${id}"`).join(`id="${k}${id}"`).split(`#${id})`).join(`#${k}${id})`).split(`"#${id}"`).join(`"#${k}${id}"`), svg);
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const chevron = `<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8"/></svg>`;
const signal = `<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>`;
const wifi = `<svg viewBox="0 0 17 12" aria-hidden="true"><path d="M8.5 11.2 6.3 8.9a3.1 3.1 0 0 1 4.4 0Zm-5-5.3a7.2 7.2 0 0 1 10 0l-1.5 1.6a5 5 0 0 0-7 0ZM.8 3.2a11 11 0 0 1 15.4 0l-1.5 1.6a8.8 8.8 0 0 0-12.4 0Z"/></svg>`;
const battery = `<svg viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="9" rx="2.2"/><path d="M24.5 4.5v4c.9-.3 1.5-1.2 1.5-2s-.6-1.7-1.5-2Z" opacity=".5"/></svg>`;

export function mountIOS(host: HTMLElement, d: IosDeps) {
  const featured = ["suite-numerique", "magic-map"].map((id) => cases.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => !!c);
  const tile = (c: (typeof featured)[number]) => {
    const th = thumbFor(c);
    const art = th?.kind === "art" ? th.v : th ? `<img src="${th.v}" alt="" draggable="false" />` : "";
    return `<button type="button" class="ios-tile" data-open="work" data-arg="${c.id}" aria-label="${esc(c.title)}"><span class="ios-tile-art">${art}</span><b>${esc(c.title)}</b><small>${esc(c.kind.split(" · ")[0])}</small></button>`;
  };

  const apps: { id: string; label: string; svg: string }[] = [
    { id: "work", label: t("Projects", "Projets"), svg: icon("work") },
    { id: "about", label: t("About", "À propos"), svg: icon("about") },
    { id: "experience", label: t("Experience", "Parcours"), svg: icon("experience") },
    { id: "cv", label: "CV", svg: icon("cv") },
    { id: "photos", label: "Photos", svg: icon("photos") },
    { id: "art", label: "Art", svg: icon("art") },
    { id: "mail", label: "Contact", svg: icon("mail") },
    { id: "room", label: t("3D room", "Chambre 3D"), svg: d.roomIcon },
  ];
  const appHtml = (a: (typeof apps)[number]) => `<button type="button" class="ios-app" data-app="${a.id}" aria-label="${esc(a.label)}"><span class="ic">${uniq(a.svg)}</span><span class="lb">${esc(a.label)}</span></button>`;
  const dockIds = ["work", "about", "cv", "mail"];

  const el = document.createElement("div");
  el.id = "ios";
  el.innerHTML = `
    <div class="ios-status" aria-hidden="true"><b class="ios-time"></b><span class="ios-sys">${signal}${wifi}${battery}</span></div>
    <div class="ios-scroll">
      <section class="iw iw-me" aria-label="${t("About Lydia", "À propos de Lydia")}">
        <button type="button" class="iw-me-top" data-open="about">
          <span class="iw-av"><img src="avatar.jpg" alt="" draggable="false" /></span>
          <span class="iw-me-t"><b>Lydia Benosmane</b><small>${esc(t("UX/UI designer · HCI Master’s student", "UX/UI designer · étudiante en Master IHM"))}</small></span>
        </button>
        <div class="iw-cta">
          <button type="button" class="pri" data-open="work">${t("See my projects", "Voir mes projets")}</button>
          <button type="button" data-open="cv">${t("Résumé", "CV")}</button>
        </div>
      </section>

      <section class="iw iw-work" aria-label="${t("Selected work", "Projets à la une")}">
        <header><b>${t("Selected work", "Projets à la une")}</b><button type="button" data-open="work">${t("All projects", "Tous")} ›</button></header>
        <div class="ios-tiles">${featured.map(tile).join("")}</div>
      </section>

      <div class="iw-row">
        <button type="button" class="iw iw-sm iw-job" data-open="mail"><i class="dot"></i><b>${t("Open to internships", "Ouverte aux stages")}</b><small>${t("March 2027 · 6 months", "Mars 2027 · 6 mois")}</small><span>${t("Say hello", "Dire bonjour")} ›</span></button>
        <button type="button" class="iw iw-sm iw-cv" data-open="cv"><span class="ic">${uniq(icon("cv"))}</span><b>${t("Résumé", "CV")}</b><small>${t("1 page · PDF", "1 page · PDF")}</small><span>${t("Open", "Ouvrir")} ›</span></button>
      </div>

      <nav class="ios-grid" aria-label="Apps">${apps.map(appHtml).join("")}</nav>
    </div>
    <div class="ios-dots" aria-hidden="true"><i class="on"></i><i></i></div>
    <nav class="ios-dock" aria-label="Dock">${dockIds.map((id) => appHtml(apps.find((a) => a.id === id)!)).join("")}</nav>
    <i class="ios-bar" aria-hidden="true"></i>
    <div class="ios-lang" role="group" aria-label="${t("Language", "Langue")}"><button type="button" data-l="en">EN</button><button type="button" data-l="fr">FR</button></div>`;
  host.appendChild(el);

  /* clock */
  const time = el.querySelector<HTMLElement>(".ios-time")!;
  const tick = () => (time.textContent = new Date().toLocaleTimeString(t("en-GB", "fr-FR"), { hour: "2-digit", minute: "2-digit" }));
  tick();
  setInterval(tick, 15000);

  /* taps */
  el.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const lg = target.closest<HTMLElement>("[data-l]");
    if (lg) {
      location.search = "?lang=" + lg.dataset.l;
      return;
    }
    const open = target.closest<HTMLElement>("[data-open]");
    if (open) {
      d.open(open.dataset.open!, open.dataset.arg);
      return;
    }
    const app = target.closest<HTMLElement>("[data-app]");
    if (!app) return;
    if (app.dataset.app === "room") d.openRoom();
    else d.open(app.dataset.app!);
  });
  el.querySelectorAll<HTMLElement>(".ios-lang [data-l]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === lang)));

  /* every app window gets a "‹ Home" bar and a home indicator */
  const wins = document.getElementById("wins");
  if (wins) {
    const dress = (w: HTMLElement) => {
      const c = w.querySelector<HTMLElement>(".l.c");
      if (c && !c.dataset.ios) {
        c.dataset.ios = "1";
        c.setAttribute("aria-label", t("Back to the home screen", "Retour à l’écran d’accueil"));
        /* inside a project the button reads "‹ Projects" and goes back to the list; everywhere else it goes home */
        const paint = () => {
          const mode = w.querySelector(".wk-back") ? "case" : "home";
          if (c.dataset.mode === mode) return; // only touch the button when it changes, or the observer would loop
          c.dataset.mode = mode;
          c.innerHTML = `${chevron}<span>${mode === "case" ? t("Projects", "Projets") : t("Home", "Accueil")}</span>`;
        };
        paint();
        new MutationObserver(paint).observe(w, { childList: true, subtree: true });
        w.addEventListener(
          "click",
          (e) => {
            const back = w.querySelector<HTMLElement>(".wk-back");
            if (back && !w.dataset.home && (e.target as HTMLElement).closest(".l.c")) {
              e.stopPropagation();
              e.preventDefault();
              back.click();
            }
          },
          true,
        );
      }
      if (!w.querySelector(".ios-hbar")) {
        const h = document.createElement("button");
        h.type = "button";
        h.className = "ios-hbar";
        h.setAttribute("aria-label", t("Back to the home screen", "Retour à l’écran d’accueil"));
        h.innerHTML = "<i></i>";
        h.addEventListener("click", () => {
          w.dataset.home = "1";
          w.querySelector<HTMLElement>(".l.c")?.click();
        });
        w.appendChild(h);
      }
    };
    new MutationObserver((list) =>
      list.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement && n.classList.contains("win")) dress(n);
        }),
      ),
    ).observe(wins, { childList: true });
  }
}
