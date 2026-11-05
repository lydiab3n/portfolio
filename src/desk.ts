/* Desktop extras: "Selected work" widgets and the hover preview for folders. */
import type { CaseStudy, Media } from "./content";
import { t } from "./i18n";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/* ---------- little illustrations for projects that have no good photo ---------- */
const ART: Record<string, string> = {
  "magic-map": `<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="pt1" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter><radialGradient id="pg1" cx=".3" cy=".2" r="1"><stop offset="0" stop-color="#fff3f6"/><stop offset="1" stop-color="#f7b6cb"/></radialGradient></defs><rect width="200" height="120" fill="url(#pg1)"/><g filter="url(#pt1)"><path d="M10 34 60 22l5 76-55 12z" fill="#f4a3bd"/><path d="M60 22l52 14-2 76-45-14z" fill="#fbd0dd"/><path d="M112 36l56-16 6 80-60 14z" fill="#ee8fb0"/><path d="M30 92c22-34 44-12 66-40s44-22 70-32" fill="none" stroke="#b3123f" stroke-width="3.4" stroke-dasharray="1 7.5" stroke-linecap="round"/><g fill="#d81b60"><circle cx="30" cy="92" r="6.5"/><circle cx="96" cy="52" r="6.5"/><circle cx="166" cy="20" r="6.5"/></g></g><path d="M60 22l5 76M112 36l-2 76" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/></svg>`,
  "suite-numerique": `<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="pt2" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter><radialGradient id="pg2" cx=".8" cy=".1" r="1.1"><stop offset="0" stop-color="#f1eeff"/><stop offset="1" stop-color="#c9d3ff"/></radialGradient></defs><rect width="200" height="120" fill="url(#pg2)"/><g filter="url(#pt2)"><rect x="24" y="20" width="152" height="86" rx="12" fill="#fff" fill-opacity=".9"/><rect x="36" y="34" width="56" height="30" rx="8" fill="#7d8cff"/><rect x="100" y="34" width="64" height="30" rx="8" fill="#ffc4d6"/><rect x="36" y="72" width="38" height="24" rx="8" fill="#ffc4d6"/><rect x="82" y="72" width="82" height="24" rx="8" fill="#d3dbff"/></g><circle cx="46" cy="27" r="2.6" fill="#7d8cff"/><circle cx="55" cy="27" r="2.6" fill="#a9b4ff"/><path d="M134 62l14 12-6.5 1.2 3.6 7.4-3.8 1.8-3.6-7.4-5 4.2z" fill="#1d1a1f" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
};

type Thumb = { kind: "art" | "img"; v: string; pos?: string } | null;

/** A picture for a project: its own artwork if it has one, else its first image. */
export function thumbFor(c: CaseStudy): Thumb {
  if (ART[c.id]) return { kind: "art", v: ART[c.id] };
  const m: Media | undefined = Array.isArray(c.heroMedia) ? c.heroMedia[0] : c.heroMedia;
  if (c.video?.poster) return { kind: "img", v: c.video.poster };
  if (m) return { kind: "img", v: m.src };
  if (c.poster) return { kind: "img", v: c.poster.src, pos: "top" };
  return null;
}

/* ---------- widgets: photos and soft glass, like a Mac widget wall ---------- */
export function mountWidgets(box: HTMLElement, cases: CaseStudy[], open: (id: string, arg?: string) => void, tick: () => void) {
  const proj = (id: string) => {
    const c = cases.find((x) => x.id === id);
    if (!c) return "";
    const th = thumbFor(c);
    const art = th?.kind === "art" ? th.v : th ? `<img src="${th.v}" alt="" draggable="false" />` : "";
    return `<button type="button" class="wgt m" data-open="work" data-arg="${c.id}" aria-label="${t("Open", "Ouvrir")} ${esc(c.title)}"><span class="wgt-art">${art}</span><span class="wgt-l"><b>${esc(c.title)}</b><small>${esc(c.kind.split(" · ")[0])}</small></span></button>`;
  };
  box.innerHTML = `<div class="wgt-row">
    ${proj("magic-map")}
    ${proj("suite-numerique")}
    <button type="button" class="wgt s clk" data-open="calendar" aria-label="${t("Open the calendar", "Ouvrir le calendrier")}"><span class="clk-dot"></span><b class="clk-t">${t("Open to internships", "Ouverte aux stages")}</b><span class="clk-d">${t("March 2027 · 6 months", "Mars 2027 · 6 mois")}</span></button>
  </div>`;
  box.querySelectorAll<HTMLElement>(".wgt").forEach((w) =>
    w.addEventListener("click", () => {
      tick();
      open(w.dataset.open!, w.dataset.arg);
    }),
  );
}

/* ---------- hover preview ---------- */
export interface Peek { title: string; kind: string; blurb: string; meta?: string[]; thumb?: Thumb; cta?: string }

export function peekFor(c: CaseStudy): Peek {
  const get = (k: string) => c.facts.find(([key]) => key.toLowerCase() === k)?.[1];
  const meta = [get("timeline"), get("tools")].filter((x): x is string => !!x && !/TODO/i.test(x));
  return { title: c.title, kind: c.kind, blurb: c.blurb, meta, thumb: thumbFor(c), cta: t("Double-click to open", "Double-clic pour ouvrir") };
}

export function mountPeek(host: HTMLElement) {
  const el = document.createElement("div");
  el.id = "peek";
  el.hidden = true;
  el.setAttribute("role", "tooltip");
  host.appendChild(el);
  let timer = 0;
  let onOpen: (() => void) | null = null;
  let over = false;

  const hide = () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (over) return;
      el.classList.remove("on");
      timer = window.setTimeout(() => (el.hidden = true), 180);
    }, 140);
  };
  el.addEventListener("pointerenter", () => {
    over = true;
    clearTimeout(timer);
  });
  el.addEventListener("pointerleave", () => {
    over = false;
    hide();
  });
  el.addEventListener("click", () => onOpen?.());

  function show(anchor: HTMLElement, p: Peek, open: () => void) {
    clearTimeout(timer);
    onOpen = open;
    const th = p.thumb;
    const pic = th ? (th.kind === "art" ? th.v : `<img src="${th.v}" alt="" draggable="false" style="object-position:${th.pos ?? "center"}" />`) : "";
    el.innerHTML = `${pic ? `<div class="pk-pic">${pic}</div>` : ""}<div class="pk-t"><p>${esc(p.kind)}</p><h3>${esc(p.title)}</h3><span>${esc(p.blurb)}</span>${p.meta?.length ? `<ul>${p.meta.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>` : ""}${p.cta ? `<em>${esc(p.cta)}</em>` : ""}</div>`;
    el.hidden = false;
    const r = anchor.getBoundingClientRect();
    const w = 290;
    const left = r.left + r.width / 2 > innerWidth / 2 ? r.left - w - 8 : r.right + 8;
    el.style.left = Math.max(10, Math.min(innerWidth - w - 10, left)) + "px";
    el.style.top = "0px";
    const h = el.offsetHeight;
    el.style.top = Math.max(44, Math.min(innerHeight - h - 100, r.top + r.height / 2 - h / 2)) + "px";
    requestAnimationFrame(() => el.classList.add("on"));
  }
  return { show, hide };
}
