/* "This or that": clicking my portrait starts a quick game. Pick one of two, see what I would pick. */
import { t } from "../i18n";

interface Q { a: string; b: string; me: "a" | "b" | "both"; why: string }
const QS = (): Q[] => [
  { a: t("Matcha", "Matcha"), b: t("Coffee", "Café"), me: "a", why: t("Matcha, always. I’m still hunting for the best one in Paris.", "Matcha, toujours. Je cherche encore le meilleur de Paris.") },
  { a: t("The sea", "La mer"), b: t("The mountains", "La montagne"), me: "a", why: t("The sea. I grew up in Algiers with it right outside.", "La mer. J’ai grandi à Alger avec elle juste à côté.") },
  { a: t("Cats", "Chats"), b: t("Dogs", "Chiens"), me: "a", why: t("Two orange cats run my life: Ferrari and Lamborghini.", "Deux chats roux dirigent ma vie : Ferrari et Lamborghini.") },
  { a: t("Pink", "Rose"), b: t("Black", "Noir"), me: "a", why: t("Pink, obviously. Look around this room.", "Rose, évidemment. Regardez cette chambre.") },
  { a: "Pinterest", b: "Instagram", me: "a", why: t("Pinterest. My boards are basically a second brain.", "Pinterest. Mes tableaux sont un deuxième cerveau.") },
  { a: t("Guitar", "Guitare"), b: t("Piano", "Piano"), me: "a", why: t("Electric guitar. Go strum the one by the desk.", "Guitare électrique. Allez gratter celle près du bureau.") },
  { a: "Paris", b: t("Algiers", "Alger"), me: "both", why: t("Don’t make me choose. Algiers is home, Paris is now.", "Ne me faites pas choisir. Alger c’est chez moi, Paris c’est maintenant.") },
];

export const thisThatHtml = () =>
  `<div class="tt" aria-live="polite"><p class="tt-step"></p><h2 class="tt-q big">${t("This or that?", "Ceci ou cela ?")}</h2><div class="tt-row"><button type="button" class="tt-opt" data-tt="a"></button><span class="tt-or">${t("or", "ou")}</span><button type="button" class="tt-opt" data-tt="b"></button></div><p class="tt-me"></p><div class="tt-end" hidden></div></div>`;

/** Wire up the game inside an open panel. Returns nothing: the panel owns the markup. */
export function mountThisThat(root: HTMLElement, fx: { burst: (x: number, y: number, g?: string[], n?: number) => void; tick: () => void }) {
  const box = root.querySelector<HTMLElement>(".tt");
  if (!box) return;
  const qs = QS();
  const step = box.querySelector<HTMLElement>(".tt-step")!;
  const me = box.querySelector<HTMLElement>(".tt-me")!;
  const end = box.querySelector<HTMLElement>(".tt-end")!;
  const row = box.querySelector<HTMLElement>(".tt-row")!;
  const opts = [...box.querySelectorAll<HTMLButtonElement>(".tt-opt")];
  let i = 0;
  let score = 0;
  let locked = false;

  const show = () => {
    const q = qs[i];
    step.textContent = `${i + 1} / ${qs.length}`;
    opts[0].textContent = q.a;
    opts[1].textContent = q.b;
    opts.forEach((o) => {
      o.className = "tt-opt";
      o.disabled = false;
    });
    me.textContent = "";
    locked = false;
  };

  const finish = () => {
    row.hidden = true;
    me.textContent = "";
    step.textContent = t("Results", "Résultat");
    const msg =
      score === qs.length ? t("Soulmates. Let’s get a matcha.", "Âmes sœurs. Allons boire un matcha.")
      : score >= 5 ? t("Very compatible. The cats approve.", "Très compatibles. Les chats approuvent.")
      : score >= 3 ? t("Not bad! We’d still be friends.", "Pas mal ! On serait quand même amis.")
      : t("Opposites attract, right?", "Les opposés s’attirent, non ?");
    end.hidden = false;
    end.innerHTML = `<p class="tt-score"><b>${score}</b> / ${qs.length}</p><p class="tt-msg">${msg}</p><button type="button" class="gloss pink" data-tt="again">${t("Play again", "Rejouer")}</button>`;
    const r = end.getBoundingClientRect();
    if (score >= 5) fx.burst(r.left + r.width / 2, r.top + 20, ["♥", "✦", "✧"], 14);
  };

  box.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-tt]");
    if (!b) return;
    const pick = b.dataset.tt!;
    if (pick === "again") {
      i = 0;
      score = 0;
      end.hidden = true;
      row.hidden = false;
      return show();
    }
    if (locked) return;
    locked = true;
    fx.tick();
    const q = qs[i];
    const match = q.me === "both" || q.me === pick;
    if (match) score++;
    opts.forEach((o) => {
      o.disabled = true;
      const mine = q.me === "both" || o.dataset.tt === q.me;
      o.classList.add(mine ? "mine" : "nope");
      if (o === b) o.classList.add("you");
    });
    me.textContent = (match ? t("Same! ", "Pareil ! ") : t("Ah, not me. ", "Ah, pas moi. ")) + q.why;
    const r = b.getBoundingClientRect();
    if (match) fx.burst(r.left + r.width / 2, r.top + r.height / 2, ["♥", "✦"], 7);
    setTimeout(() => {
      i++;
      if (i < qs.length) show();
      else finish();
    }, 2100);
  });
  show();
}
