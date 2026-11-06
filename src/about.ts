/* About me: a profile you can poke at. Ask questions, flip the cards, say hi to the cats, strum a chord. */
import { about, hero, skills } from "./content";
import { t } from "./i18n";
import type { Ctx } from "./apps";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

interface Q { q: string; a: string; act?: "strum" | "mail" | "room" }
const questions = (): Q[] => [
  { q: t("Where are you from?", "D’où viens-tu ?"), a: t("Algiers. I carry the sea with me, which is why so many of my pictures are of water. Now I live near Paris, close enough to wave at the Eiffel Tower.", "D’Alger. J’emporte la mer avec moi, c’est pour ça que tant de mes photos sont de l’eau. Aujourd’hui je vis près de Paris, assez près pour faire coucou à la tour Eiffel.") },
  { q: t("What are you up to now?", "Que fais-tu en ce moment ?"), a: t("Finishing my Master’s in Human-Computer Interaction at Paris-Saclay University, and looking for an internship in product and UX design.", "Je termine mon Master en Interaction Homme-Machine à l’Université Paris-Saclay, et je cherche un stage en design produit et UX.") },
  { q: t("What do you design?", "Que conçois-tu ?"), a: t("Things people can touch, fold, play with or walk into: a foldable paper map for group trips, a coffee game that teaches Java, calm VR rooms.", "Des choses qu’on peut toucher, plier, jouer ou explorer : une carte en papier pliable pour voyager en groupe, un jeu de café qui enseigne Java, des pièces de VR apaisantes.") },
  { q: t("Who are those cats?", "Qui sont ces chats ?"), a: t("Ferrari has the cut ear and Lamborghini has the pink flip-flop. Both are orange, both are in charge, and both live in my room in 3D if you want to chat with them.", "Ferrari a l’oreille coupée et Lamborghini a sa tong rose. Tous les deux sont roux, tous les deux commandent, et ils vivent dans ma chambre en 3D si vous voulez discuter avec eux."), act: "room" },
  { q: t("Do you play music?", "Tu joues de la musique ?"), a: t("Electric guitar, and I’m never far from a playlist. Here, have a chord.", "De la guitare électrique, et je ne suis jamais loin d’une playlist. Tiens, un accord."), act: "strum" },
  { q: t("Coffee or matcha?", "Café ou matcha ?"), a: t("Matcha. Finding the best one in Paris is officially on my to-do list.", "Matcha. Trouver le meilleur de Paris est officiellement sur ma liste de choses à faire.") },
  { q: t("Can we work together?", "On peut travailler ensemble ?"), a: t("I’d love that. I’m open to internships, so say hello.", "Avec plaisir. Je suis ouverte aux stages, alors dites bonjour."), act: "mail" },
];

/* a short electric-guitar strum, made on the spot (Karplus-Strong), so there is no audio file to load */
let ac: AudioContext | null = null;
export function strum() {
  try {
    ac ??= new AudioContext();
    if (ac.state === "suspended") void ac.resume();
    const sr = ac.sampleRate;
    const drive = ac.createWaveShaper();
    const curve = new Float32Array(256);
    curve.forEach((_, i) => (curve[i] = Math.tanh(((i / 255) * 2 - 1) * 2.4)));
    drive.curve = curve;
    const out = ac.createGain();
    out.gain.value = 0.2;
    drive.connect(out).connect(ac.destination);
    [82.4, 110, 146.8, 196, 246.9, 329.6].forEach((f, k) => {
      const n = Math.floor(sr * 1.8);
      const buf = ac!.createBuffer(1, n, sr);
      const d = buf.getChannelData(0);
      const N = Math.round(sr / f);
      const ring = Float32Array.from({ length: N }, () => Math.random() * 2 - 1);
      for (let i = 0, j = 0; i < n; i++, j = (j + 1) % N) {
        const v = (ring[j] + ring[(j + 1) % N]) * 0.4985;
        d[i] = ring[j];
        ring[j] = v;
      }
      const src = ac!.createBufferSource();
      src.buffer = buf;
      src.connect(drive);
      src.start(ac!.currentTime + k * 0.045);
    });
  } catch {
    /* no audio, no problem */
  }
}

export function renderAbout(body: HTMLElement, ctx: Ctx) {
  const qs = questions();
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  body.innerHTML = `
  <div class="scroll ab">
    <header class="ab-hero">
      <div class="ab-photo" tabindex="0" role="img" aria-label="${esc(about.photoAlt)}"><div class="ab-img"></div></div>
      <div class="ab-id">
        <h1 class="display">Lydia Benosmane</h1>
        <p class="role">${esc(hero.role)}</p>
        <p class="status"><i></i>${esc(hero.status)}</p>
      </div>
      <div class="ab-polas">
        <button type="button" class="pola a" data-go="photos" aria-label="${t("Ferrari, open the photo book", "Ferrari, ouvrir le livre photo")}"><img src="room/cat-1.jpg" alt="" draggable="false" /><span>Ferrari</span></button>
        <button type="button" class="pola b" data-go="photos" aria-label="${t("Lamborghini, open the photo book", "Lamborghini, ouvrir le livre photo")}"><img src="room/cat-2.jpg" alt="" draggable="false" /><span>Lamborghini</span></button>
      </div>
    </header>

    <p class="ab-lede">${t("Bonjour! I’m Lydia.", "Bonjour ! Moi c’est Lydia.")}</p>
    <div class="prose">${about.paragraphs.slice(1).map((p) => `<p>${p}</p>`).join("")}</div>

    <h2 class="group-h">${t("Ask me anything", "Pose-moi une question")}</h2>
    <div class="ab-q">${qs.map((x, i) => `<button type="button" data-i="${i}">${esc(x.q)}</button>`).join("")}</div>
    <div class="ab-a" aria-live="polite"><p class="ab-hint">${t("Pick a question.", "Choisis une question.")}</p></div>

    <h2 class="group-h">${t("A few of my things", "Quelques-unes de mes choses")}</h2>
    <div class="ab-cards">${about.favourites
      .map(([k, v], i) => `<button type="button" class="fc c${i % 5}" aria-label="${esc(k)}: ${esc(v)}"><span class="fc-in"><span class="fc-f"><span class="fc-tape"></span><span class="fc-k">${esc(k)}</span></span><span class="fc-b"><span class="fc-pen">${esc(v)}</span><span class="fc-stamp">LB</span></span></span></button>`)
      .join("")}</div>

    <h2 class="group-h">${t("What I do", "Ce que je fais")}</h2>
    <div class="chips">${skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>

    <a class="ab-room" href="room.html" target="_blank" rel="noopener"><b>${t("Want to see where I actually hang out?", "Envie de voir où je traîne vraiment ?")}</b><span>${t("Step into my room (3D)", "Entrer dans ma chambre (3D)")}</span></a>
  </div>`;

  /* portrait leans toward the pointer */
  const photo = body.querySelector<HTMLElement>(".ab-photo")!;
  if (!calm) {
    photo.addEventListener("pointermove", (e) => {
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      photo.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    photo.addEventListener("pointerleave", () => (photo.style.transform = ""));
  }

  body.querySelectorAll<HTMLElement>(".pola").forEach((p) => p.addEventListener("click", () => ctx.open(p.dataset.go!)));

  /* flip cards */
  body.querySelectorAll<HTMLElement>(".fc").forEach((c) =>
    c.addEventListener("click", () => {
      c.classList.toggle("flip");
      ctx.sfx.tick();
    }),
  );

  /* questions */
  const out = body.querySelector<HTMLElement>(".ab-a")!;
  const btns = [...body.querySelectorAll<HTMLButtonElement>(".ab-q button")];
  let timer = 0;
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      const q = qs[Number(b.dataset.i)];
      btns.forEach((o) => o.classList.toggle("on", o === b));
      clearInterval(timer);
      ctx.sfx.tick();
      out.innerHTML = `<p class="ab-me">${esc(q.q)}</p><p class="ab-you"><span></span></p>`;
      const el = out.querySelector<HTMLElement>(".ab-you span")!;
      const finish = () => {
        el.textContent = q.a;
        if (q.act === "mail") out.insertAdjacentHTML("beforeend", `<button type="button" class="ab-act">${t("Say hello", "Dire bonjour")}</button>`);
        if (q.act === "room") out.insertAdjacentHTML("beforeend", `<a class="ab-act" href="room.html" target="_blank" rel="noopener">${t("Go to the room", "Aller dans la chambre")}</a>`);
        if (q.act === "strum") out.insertAdjacentHTML("beforeend", `<button type="button" class="ab-act">${t("Strum again", "Rejouer")}</button>`);
        out.querySelector<HTMLElement>("button.ab-act")?.addEventListener("click", () => (q.act === "mail" ? ctx.open("mail") : strum()));
      };
      if (q.act === "strum" && ctx.sfx.enabled) strum();
      if (calm) return finish();
      let i = 0;
      timer = window.setInterval(() => {
        i += 2;
        el.textContent = q.a.slice(0, i);
        if (i >= q.a.length) {
          clearInterval(timer);
          finish();
        }
      }, 16);
    }),
  );
}
