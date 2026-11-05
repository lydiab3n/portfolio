import { t } from "../i18n";
import { CATS, START_CHIPS, intentOf, reply, type Action, type Cat, type Chip } from "./chat";

export interface ChatDeps {
  scrim: HTMLElement;
  openPanel: (id: string, arg?: string, origin?: HTMLElement | null) => void;
  burst: (x: number, y: number, glyphs?: string[], n?: number) => void;
  react: (spot: string, kind: "pet" | "treat" | "play") => void;
  lightbox: (src: string, alt: string) => void;
  tick: () => void;
  notify: () => void;
  reduce: boolean;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function initChat(host: HTMLElement, d: ChatDeps) {
  const el = document.createElement("section");
  el.className = "chat";
  el.id = "chat";
  el.hidden = true;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "chat-name");
  el.innerHTML = `
    <header class="chat-head">
      <button type="button" class="chat-av" id="chat-photo" aria-label="${t("See the photo", "Voir la photo")}"><img id="chat-img" alt="" draggable="false" /></button>
      <div class="chat-who"><b id="chat-name"></b><small id="chat-status" aria-live="polite"></small></div>
      <button type="button" class="orb" id="chat-close" aria-label="${t("Close the chat", "Fermer la discussion")}">×</button>
    </header>
    <div class="chat-body" id="chat-body"></div>
    <div class="chat-chips" id="chat-chips"></div>
    <form class="chat-ask" id="chat-ask" autocomplete="off">
      <input id="chat-in" type="text" maxlength="140" />
      <button type="submit" class="chat-send">${t("Ask", "Envoyer")}</button>
    </form>`;
  host.appendChild(el);

  const body = el.querySelector<HTMLElement>("#chat-body")!;
  const chipsEl = el.querySelector<HTMLElement>("#chat-chips")!;
  const input = el.querySelector<HTMLInputElement>("#chat-in")!;
  const status = el.querySelector<HTMLElement>("#chat-status")!;
  const img = el.querySelector<HTMLImageElement>("#chat-img")!;
  const threads = new Map<string, { nodes: HTMLElement; chips: Chip[]; started: boolean }>();
  let cat: Cat = CATS[0];
  let busy = false;
  let origin: HTMLElement | null = null;
  let lastFocus: HTMLElement | null = null;
  let token = 0;

  const scroll = () => (body.scrollTop = body.scrollHeight);
  const thread = () => threads.get(cat.id)!;

  function bubble(text: string, who: "cat" | "me") {
    const b = document.createElement("p");
    b.className = "msg " + who;
    b.textContent = text;
    thread().nodes.appendChild(b);
    scroll();
    return b;
  }

  function actionsRow(actions: Action[]) {
    const row = document.createElement("div");
    row.className = "msg-actions";
    for (const a of actions) {
      if (a.href) {
        const l = document.createElement("a");
        l.className = "act";
        l.href = a.href;
        if (a.href.startsWith("http")) {
          l.target = "_blank";
          l.rel = "noreferrer";
        }
        l.textContent = a.label;
        row.appendChild(l);
      } else {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "act";
        b.textContent = a.label;
        b.addEventListener("click", () => {
          const spot = a.open!.id === "case" ? "book-" + a.open!.arg : a.open!.id === "todo" ? "notes" : a.open!.id;
          close(true);
          d.openPanel(a.open!.id, a.open!.arg, document.getElementById("hs-" + spot) ?? document.getElementById("hs-" + cat.spot));
        });
        row.appendChild(b);
      }
    }
    thread().nodes.appendChild(row);
    scroll();
  }

  async function say(lines: string[], actions?: Action[], chips: Chip[] = []) {
    const mine = ++token;
    busy = true;
    paintChips([]);
    for (const line of lines) {
      status.textContent = t("typing…", "écrit…");
      const dots = document.createElement("p");
      dots.className = "msg cat typing";
      dots.innerHTML = "<i></i><i></i><i></i>";
      thread().nodes.appendChild(dots);
      scroll();
      await sleep(d.reduce ? 80 : Math.min(1300, 420 + line.length * 13));
      dots.remove();
      if (mine !== token) return;
      bubble(line, "cat");
      d.notify();
    }
    if (actions?.length) actionsRow(actions);
    status.textContent = t("Ask me anything", "Demande-moi tout");
    busy = false;
    thread().chips = chips;
    paintChips(chips);
    requestAnimationFrame(scroll);
  }

  function paintChips(chips: Chip[]) {
    chipsEl.innerHTML = chips.map((c, i) => `<button type="button" class="chip c${i % 4}" data-q="${esc(c.q)}" data-label="${esc(c.label)}">${esc(c.label)}</button>`).join("");
  }

  function ask(q: string, label: string) {
    if (busy) return;
    d.tick();
    bubble(label, "me");
    const r = reply(cat, q === "?" ? "" : q);
    if (r.react) {
      d.react(cat.spot, r.react);
      const b = el.getBoundingClientRect();
      d.burst(b.left + b.width / 2, b.top + 70, r.react === "treat" ? ["★", "✦"] : ["♥", "♥", "✦"], 8);
    }
    void say(r.lines, r.actions, r.chips);
  }

  chipsEl.addEventListener("click", (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>(".chip");
    if (c) ask(c.dataset.q!, c.dataset.label!);
  });
  el.querySelector<HTMLFormElement>("#chat-ask")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v || busy) return;
    input.value = "";
    ask(intentOf(v), v);
  });
  el.querySelector("#chat-photo")!.addEventListener("click", () => d.lightbox(cat.photo, cat.photoAlt));
  el.querySelector("#chat-close")!.addEventListener("click", () => close());
  d.scrim.addEventListener("click", () => el.hidden || close());

  function fly(from: HTMLElement | null) {
    const r = (from ?? document.body).getBoundingClientRect();
    const p = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (p.left + p.width / 2);
    const dy = r.top + r.height / 2 - (p.top + p.height / 2);
    return `translate(${dx}px,${dy}px) scale(${Math.max(0.08, Math.min(0.5, r.width / p.width))})`;
  }

  function open(id: "ferrari" | "lambo", from: HTMLElement | null) {
    const next = CATS.find((c) => c.id === id)!;
    const wasOpen = !el.hidden;
    cat = next;
    origin = from;
    if (!threads.has(cat.id)) {
      const nodes = document.createElement("div");
      nodes.className = "thread";
      threads.set(cat.id, { nodes, chips: START_CHIPS, started: false });
    }
    body.innerHTML = "";
    body.appendChild(thread().nodes);
    img.src = cat.photo;
    el.querySelector("#chat-name")!.textContent = cat.name;
    input.placeholder = t(`Ask ${cat.name} about Lydia…`, `Demande à ${cat.name} des choses sur Lydia…`);
    el.dataset.cat = cat.id;
    status.textContent = t("Ask me anything", "Demande-moi tout");
    token++;
    busy = false;
    if (!wasOpen) {
      lastFocus = document.activeElement as HTMLElement;
      el.getAnimations().forEach((a) => a.cancel());
      el.style.pointerEvents = "";
      el.hidden = false;
      d.scrim.classList.add("on");
      if (!d.reduce) el.animate([{ transform: fly(from), opacity: 0, filter: "blur(10px)" }, { transform: "none", opacity: 1, filter: "blur(0)" }], { duration: 560, easing: "cubic-bezier(.2,.9,.2,1.04)" });
    }
    if (!thread().started) {
      thread().started = true;
      void say(cat.intro, undefined, START_CHIPS);
    } else paintChips(thread().chips);
    scroll();
    input.focus({ preventScroll: true });
  }

  function close(keepScrim = false) {
    if (el.hidden) return;
    token++;
    if (!keepScrim) d.scrim.classList.remove("on");
    el.style.pointerEvents = "none";
    const done = () => {
      el.hidden = true;
      lastFocus?.focus({ preventScroll: true });
    };
    el.getAnimations().forEach((a) => a.cancel());
    if (d.reduce || keepScrim) return done();
    el.animate([{ transform: "none", opacity: 1 }, { transform: fly(origin), opacity: 0, filter: "blur(8px)" }], { duration: 300, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" }).onfinish = done;
  }

  el.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [...el.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],input")].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
      e.preventDefault();
      f[0].focus();
    }
  });

  return { open, close, isOpen: () => !el.hidden };
}
