/* Photos, as one little book you can swipe through (think Apple Books, but with pictures).
   Drag a page, flick it, tap a page, press the arrow keys, or use the arrows below.
   The page angle comes from a single number, `pos`, so a turn can be grabbed and reversed at any moment. */
import { t } from "./i18n";
import type { Ctx } from "./apps";

interface Pg { src: string; alt: string; cap: string; pos?: string }

const pages = (): Pg[] => [
  { src: "room/cat-1.jpg", alt: t("Ferrari, an orange and white cat with a cut ear, on a terrace by the sea", "Ferrari, un chat roux et blanc à l’oreille coupée, sur une terrasse au bord de la mer"), cap: t("Ferrari, my boy with the cut ear", "Ferrari, mon garçon à l’oreille coupée") },
  { src: "room/cat-2.jpg", alt: t("Lamborghini, a pale ginger cat, lying on a pink flip-flop", "Lamborghini, une chatte rousse pâle, allongée sur une tong rose"), cap: t("Lamborghini, asleep on her pink flip-flop", "Lamborghini, endormie sur sa tong rose") },
  { src: "room/sea-sunset.jpg", alt: t("The sea at sunset with a rocky headland", "La mer au coucher du soleil, devant un promontoire rocheux"), cap: t("Golden hour by the sea", "L’heure dorée au bord de la mer"), pos: "60% 50%" },
  { src: "room/sea-rocks.jpg", alt: t("Turquoise water and sunlit rocks", "Eau turquoise et rochers ensoleillés"), cap: t("Salt water and warm rocks", "Eau salée et rochers chauds") },
  { src: "room/shells.jpg", alt: t("Three pearly shells on a weathered wooden table", "Trois coquillages nacrés sur une table en bois patiné"), cap: t("Shells I couldn’t leave behind", "Des coquillages que je n’ai pas pu laisser") },
  { src: "room/algiers.jpg", alt: t("An old colour print of the port of Algiers", "Une ancienne gravure en couleur du port d’Alger"), cap: t("Algiers, where I come from", "Alger, d’où je viens") },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function renderPhotos(body: HTMLElement, ctx: Ctx) {
  const ph = pages();
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const photo = (p: Pg, n: number) =>
    `<div class="pb-pg"><div class="pb-ph"><img src="${p.src}" alt="${esc(p.alt)}" draggable="false" decoding="async" style="object-position:${p.pos ?? "50% 50%"}" /></div><p class="pb-cap">${esc(p.cap)}</p><span class="pb-n">${n}</span></div>`;
  const cover = `<div class="pb-pg pb-cover"><h2>${t("Photos", "Photos")}</h2><p>${t("cats, the sea & home", "chats, mer & maison")}</p><small>${t("Swipe or tap a page to turn it", "Glissez ou touchez une page pour la tourner")}</small></div>`;
  const end = `<div class="pb-pg pb-end"><p>${t("That’s all for now.", "C’est tout pour l’instant.")}</p><a href="room.html" target="_blank" rel="noopener">${t("Meet the cats in my 3D room", "Rencontrer les chats dans ma chambre 3D")}</a></div>`;
  /* every sheet has a front and a back, so photos sit on both sides of the paper */
  const sheets = [
    [cover, photo(ph[0], 1)],
    [photo(ph[1], 2), photo(ph[2], 3)],
    [photo(ph[3], 4), photo(ph[4], 5)],
    [photo(ph[5], 6), end],
  ];
  const L = sheets.length;

  body.innerHTML = `
  <div class="pb" role="group" aria-roledescription="${t("photo book", "livre photo")}" aria-label="${t("Photos", "Photos")}">
    <div class="pb-stage" tabindex="0">
      <div class="pb-book">${sheets.map(([f, b]) => `<div class="pb-lf"><div class="pb-f">${f}</div><div class="pb-b">${b}</div></div>`).join("")}</div>
    </div>
    <div class="pb-bar">
      <button type="button" class="pb-prev" aria-label="${t("Previous page", "Page précédente")}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2 3.5 6l4 4"/></svg></button>
      <div class="pb-dots" role="tablist" aria-label="${t("Pages", "Pages")}">${Array.from({ length: L + 1 }, (_, i) => `<button type="button" role="tab" data-i="${i}" aria-label="${i === 0 ? t("Cover", "Couverture") : i === L ? t("Back cover", "Quatrième de couverture") : t("Pages", "Pages") + " " + (i * 2 - 1) + "–" + i * 2}"></button>`).join("")}</div>
      <button type="button" class="pb-next" aria-label="${t("Next page", "Page suivante")}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m4.5 2 4 4-4 4"/></svg></button>
    </div>
    <p class="pb-live" aria-live="polite"></p>
  </div>`;

  const root = body.querySelector<HTMLElement>(".pb")!;
  const stage = root.querySelector<HTMLElement>(".pb-stage")!;
  const book = root.querySelector<HTMLElement>(".pb-book")!;
  const leaves = [...book.querySelectorAll<HTMLElement>(".pb-lf")];
  const dots = [...root.querySelectorAll<HTMLButtonElement>(".pb-dots button")];
  const live = root.querySelector<HTMLElement>(".pb-live")!;
  const prev = root.querySelector<HTMLButtonElement>(".pb-prev")!;
  const next = root.querySelector<HTMLButtonElement>(".pb-next")!;

  let pw = 300;
  let pos = 0;
  let target = 0;
  let vel = 0;
  let raf = 0;
  let last = 0;
  let spoken = -1;

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  function size() {
    const W = root.clientWidth;
    const H = root.clientHeight - 96;
    pw = Math.max(110, Math.min((W - 40) / 2, (H - 10) * 0.75, 470));
    root.style.setProperty("--pw", pw + "px");
    root.style.setProperty("--ph", (pw * 4) / 3 + "px");
    paint();
  }

  function paint() {
    const shift = -(pw / 2) * (1 - clamp(pos, 0, 1)) + (pw / 2) * clamp(pos - (L - 1), 0, 1);
    book.style.transform = `translateX(${shift.toFixed(1)}px)`;
    leaves.forEach((lf, i) => {
      const k = clamp(pos - i, 0, 1);
      lf.style.transform = k === 0 ? "none" : `rotateY(${(-180 * k).toFixed(2)}deg)`;
      lf.style.zIndex = String(pos - i > 0.5 ? i : L - i);
      lf.style.setProperty("--sh", (Math.sin(Math.PI * k) * 0.32).toFixed(3));
    });
    const at = Math.round(clamp(pos, 0, L));
    dots.forEach((d, i) => {
      d.setAttribute("aria-selected", String(i === at));
      d.classList.toggle("on", i === at);
    });
    prev.disabled = at === 0;
    next.disabled = at === L;
    if (at !== spoken && Math.abs(pos - at) < 0.05) {
      spoken = at;
      live.textContent = at === 0 ? t("Cover", "Couverture") : at === L ? t("Back cover", "Quatrième de couverture") : [ph[at * 2 - 2], ph[at * 2 - 1]].filter(Boolean).map((p) => p.cap).join(" · ");
    }
  }

  /* critically damped spring that keeps the velocity of the flick */
  function step(ts: number) {
    const dt = Math.min(0.032, (ts - last) / 1000 || 0.016);
    last = ts;
    const w = (2 * Math.PI) / 0.62;
    const z = 0.86;
    vel += (w * w * (target - pos) - 2 * z * w * vel) * dt;
    pos += vel * dt;
    if (Math.abs(target - pos) < 0.0015 && Math.abs(vel) < 0.02) {
      pos = target;
      vel = 0;
      raf = 0;
    } else raf = requestAnimationFrame(step);
    paint();
  }
  function go(to: number, v = 0) {
    target = clamp(Math.round(to), 0, L);
    vel = v;
    if (calm) {
      pos = target;
      paint();
      return;
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
  }

  /* drag, flick, tap */
  let down = false;
  let x0 = 0;
  let pos0 = 0;
  let t0 = 0;
  let moved = 0;
  let hist: [number, number][] = [];
  const rubber = (o: number) => (o * 0.55) / (1 + (0.55 * Math.abs(o)) / 0.6);
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    down = true;
    moved = 0;
    x0 = e.clientX;
    t0 = e.timeStamp;
    cancelAnimationFrame(raf);
    raf = 0;
    vel = 0;
    pos0 = pos;
    hist = [[e.timeStamp, pos]];
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("drag");
  });
  stage.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - x0;
    moved = Math.max(moved, Math.abs(dx));
    let p = pos0 - dx / pw;
    if (p < 0) p = rubber(p);
    else if (p > L) p = L + rubber(p - L);
    pos = p;
    hist.push([e.timeStamp, pos]);
    if (hist.length > 5) hist.shift();
    paint();
  });
  const release = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    stage.classList.remove("drag");
    if (moved < 6 && e.timeStamp - t0 < 500 && e.type === "pointerup") {
      if ((e.target as HTMLElement).closest("a,button")) return go(pos);
      const r = stage.getBoundingClientRect();
      go(Math.round(pos) + (e.clientX > r.left + r.width / 2 ? 1 : -1));
      return;
    }
    const a = hist[0];
    const b = hist[hist.length - 1];
    const v = b && a && b[0] > a[0] ? ((b[1] - a[1]) / (b[0] - a[0])) * 1000 : 0;
    go(clamp(pos + v * 0.2, 0, L), v);
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  prev.addEventListener("click", () => go(Math.round(pos) - 1));
  next.addEventListener("click", () => go(Math.round(pos) + 1));
  dots.forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.i))));
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(Math.round(pos) + 1);
    else if (e.key === "ArrowLeft") go(Math.round(pos) - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(L);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });

  new ResizeObserver(size).observe(root);
  size();
  paint();
  void ctx;
}
