import { about, cases, contact, education, hero, roles, skills } from "../content";
import { t } from "../i18n";

/* ---------------------------------------------------------------------
   Talk to the cats. Scripted, not an AI: every answer is built from the
   portfolio content (content.ts), so nothing here can invent facts.
   Edit the personalities in CATS below.
   --------------------------------------------------------------------- */

export interface Cat {
  id: "ferrari" | "lambo";
  /** hotspot in the room */
  spot: "cat-a" | "cat-b";
  name: string;
  /** one line for the cats panel */
  bio: string;
  photo: string;
  photoAlt: string;
  /** what the cat says when you open the chat */
  intro: string[];
  /** said when the question is not about Lydia's work */
  lost: string;
  petLine: string;
  treatLine: string;
  playLine: string;
  /** the other cat */
  sibling: string;
}

export const CATS: Cat[] = [
  {
    id: "ferrari",
    spot: "cat-a",
    name: "Ferrari",
    bio: t("Orange and white, with a cut ear. Takes the sea view very seriously.", "Orange et blanc, avec une oreille coupée. Prend la vue sur la mer très au sérieux."),
    photo: "room/cat-1.jpg",
    photoAlt: t("Ferrari, an orange and white cat with a cut ear, on a railing above the sea", "Ferrari, un chat orange et blanc à l'oreille coupée, sur une rambarde au-dessus de la mer"),
    intro: [
      t("Mrrp. I'm Ferrari. The ear? Part of the look.", "Mrrp. Moi c'est Ferrari. L'oreille ? Ça fait partie du look."),
      t("I live here with my human, Lydia, and with Lamborghini, who thinks she owns the place.", "Je vis ici avec ma humaine, Lydia, et avec Lamborghini, qui croit que tout lui appartient."),
      t("I know a lot about Lydia and her work. Tap a button or type a question.", "J'en sais long sur Lydia et son travail. Touche un bouton ou écris une question."),
    ],
    lost: t("Mrrp? I only know what is on this page. Ask me about her projects, her background or how to reach her.", "Mrrp ? Je ne connais que ce qu'il y a sur cette page. Demande-moi ses projets, son parcours ou comment la joindre."),
    petLine: t("*leans into your hand* Okay. Five more seconds.", "*se frotte contre ta main* D'accord. Encore cinq secondes."),
    treatLine: t("Treat? Now you're speaking my language. Crunch.", "Une friandise ? Là tu parles ma langue. Crunch."),
    playLine: t("*zooms across the room and skids into the bookshelf*", "*traverse la pièce à toute vitesse et dérape contre la bibliothèque*"),
    sibling: t("Lamborghini is the pale one on the pink flip-flop. She sleeps a lot. Do not wake her. (You can, she likes talking too.)", "Lamborghini, c'est la claire, sur la tong rose. Elle dort beaucoup. Ne la réveille pas. (Tu peux, elle aime parler aussi.)"),
  },
  {
    id: "lambo",
    spot: "cat-b",
    name: "Lamborghini",
    bio: t("Pale ginger. Treats pink flip-flops as a pillow.", "Gingembre clair. Prend les tongs roses pour un oreiller."),
    photo: "room/cat-2.jpg",
    photoAlt: t("Lamborghini, a pale ginger cat, asleep on a pink flip-flop", "Lamborghini, une chatte gingembre claire, endormie sur une tong rose"),
    intro: [
      t("…Mrrp. Lamborghini. You woke me. Make it quick.", "…Mrrp. Lamborghini. Tu m'as réveillée. Fais vite."),
      t("Yes, the flip-flop is mine now. Lydia knows.", "Oui, la tong est à moi maintenant. Lydia le sait."),
      t("Ask me about Lydia. I know everything, I just don't always feel like saying it.", "Demande-moi des choses sur Lydia. Je sais tout, mais je n'ai pas toujours envie de le dire."),
    ],
    lost: t("Mrrp. Boring question. Ask me about her projects, her background or how to reach her.", "Mrrp. Question ennuyeuse. Demande-moi ses projets, son parcours ou comment la joindre."),
    petLine: t("*half-closes her eyes* Acceptable. Continue.", "*ferme à moitié les yeux* Acceptable. Continue."),
    treatLine: t("Finally, someone with taste. Put it on the flip-flop.", "Enfin quelqu'un de bon goût. Pose-la sur la tong."),
    playLine: t("*watches the toy. Does not move. Slowly blinks.* Not today.", "*regarde le jouet. Ne bouge pas. Cligne lentement des yeux.* Pas aujourd'hui."),
    sibling: t("Ferrari is the orange one with the cut ear. Very fast, very loud, very confident. He thinks he runs the shelf.", "Ferrari, c'est l'orange à l'oreille coupée. Très rapide, très bruyant, très sûr de lui. Il croit diriger l'étagère."),
  },
];

export interface Action {
  label: string;
  /** panel to open, or a link */
  open?: { id: string; arg?: string };
  href?: string;
}
export interface Chip {
  label: string;
  /** an intent key, or a free action */
  q: string;
}
export interface Reply {
  lines: string[];
  actions?: Action[];
  chips: Chip[];
  react?: "pet" | "treat" | "play";
}

const strip = (s: string) => s.replace(/<[^>]+>/g, "");
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const cleanTitle = (title: string) => title.replace(" — VR", "");
const firstSentences = (s: string, n = 2) => (strip(s).match(/[^.!?]+[.!?]+/g) ?? [strip(s)]).slice(0, n).join(" ").trim();

const ASK: Record<string, Chip> = {
  who: { label: t("Who is Lydia?", "Qui est Lydia ?"), q: "who" },
  now: { label: t("What does she do now?", "Que fait-elle en ce moment ?"), q: "now" },
  project: { label: t("Show me a project", "Montre-moi un projet"), q: "projects" },
  reach: { label: t("How do I reach her?", "Comment la joindre ?"), q: "contact" },
  exp: { label: t("Where has she worked?", "Où a-t-elle travaillé ?"), q: "exp" },
  edu: { label: t("What did she study?", "Qu'a-t-elle étudié ?"), q: "edu" },
  skills: { label: t("What are her skills?", "Quelles sont ses compétences ?"), q: "skills" },
  cv: { label: t("Her résumé", "Son CV"), q: "cv" },
  sibling: { label: t("Who is the other cat?", "Et l'autre chat ?"), q: "sibling" },
  pet: { label: t("Pet", "Caresser"), q: "pet" },
  treat: { label: t("Treat", "Friandise"), q: "treat" },
  play: { label: t("Play", "Jouer"), q: "play" },
};
const pick = (...keys: string[]) => keys.map((k) => ASK[k]);

export const START_CHIPS: Chip[] = pick("who", "now", "project", "reach");

const caseChips = (): Chip[] => cases.slice(0, 7).map((c) => ({ label: cleanTitle(c.title), q: "case:" + c.id }));

/** Build the answer for an intent. Everything comes from content.ts. */
export function reply(cat: Cat, q: string): Reply {
  if (q.startsWith("case:")) {
    const c = cases.find((x) => x.id === q.slice(5));
    if (c)
      return {
        lines: [`${cleanTitle(c.title)}. ${c.blurb}`, firstSentences(c.brief, 2)],
        actions: [{ label: t("Read the case study", "Lire l'étude de cas"), open: { id: "case", arg: c.id } }],
        chips: [...pick("project", "reach"), ASK.cv],
      };
  }
  switch (q) {
    case "who":
      return {
        lines: [
          `${t("Lydia Benosmane", "Lydia Benosmane")}: ${hero.role.toLowerCase()}, ${t("based in", "installée en")} ${hero.place}.`,
          hero.tagline,
          firstSentences(about.paragraphs[1] ?? about.paragraphs[0], 2),
        ],
        actions: [{ label: t("More about her", "En savoir plus"), open: { id: "about" } }],
        chips: pick("now", "project", "exp"),
      };
    case "now": {
      const master = education[0];
      const job = roles.find((r) => /present|aujourd/i.test(r.dates));
      return {
        lines: [
          `${t("She is doing a", "Elle prépare un")} ${master.title}${t(" at ", " à ")}${master.place} (${master.dates}).`,
          job ? `${t("On the side she is a", "À côté, elle est")} ${job.title.toLowerCase()} ${t("at", "chez")} ${job.place}.` : "",
          `${hero.status}.`,
        ].filter(Boolean),
        actions: [{ label: t("See her experience", "Voir son parcours"), open: { id: "exp" } }],
        chips: pick("exp", "project", "reach"),
      };
    }
    case "exp":
      return {
        lines: roles.map((r) => `${r.title}, ${r.place} (${r.dates.split(" · ")[0]}).`),
        actions: [{ label: t("The full timeline", "Le parcours complet"), open: { id: "exp" } }],
        chips: pick("edu", "project", "cv"),
      };
    case "edu":
      return {
        lines: education.map((e) => `${e.title}, ${e.place} (${e.dates}).`),
        chips: pick("exp", "skills", "project"),
      };
    case "skills":
      return {
        lines: [`${t("Her toolkit", "Sa boîte à outils")}: ${skills.join(", ").toLowerCase()}.`],
        chips: pick("project", "exp", "reach"),
      };
    case "projects":
      return {
        lines: [t("She has made a few things. Pick one and I will tell you about it.", "Elle a fabriqué quelques trucs. Choisis-en un et je t'en parle.")],
        chips: caseChips(),
      };
    case "contact":
      return {
        lines: [`${t("Email", "Mail")}: ${contact.email}`, t("Or find her on LinkedIn. She is open to internships.", "Ou retrouve-la sur LinkedIn. Elle est ouverte aux stages.")],
        actions: [
          { label: t("Write an email", "Écrire un mail"), href: `mailto:${contact.email}` },
          ...contact.links.map((l) => ({ label: l.label, href: l.href })),
        ],
        chips: pick("cv", "project", "who"),
      };
    case "origin":
      return {
        lines: [t("Lydia comes from Algiers, in Algeria. Now she lives near Paris.", "Lydia vient d'Alger, en Algérie. Aujourd'hui elle vit près de Paris.")],
        actions: [{ label: t("See the postcard", "Voir la carte postale"), open: { id: "algiers" } }],
        chips: pick("who", "project", "reach"),
      };
    case "place":
      return {
        lines: [`${t("Lydia lives in", "Lydia vit en")} ${hero.place}, ${t("close to Paris.", "près de Paris.")}`, t("She studies at Université Paris-Saclay and tutors in Paris.", "Elle étudie à l'Université Paris-Saclay et donne des cours à Paris.")],
        actions: [{ label: t("Where she lives", "Où elle habite"), open: { id: "paris" } }],
        chips: pick("now", "project", "reach"),
      };
    case "cv":
      return {
        lines: [t("Here is her résumé.", "Voici son CV.")],
        actions: [{ label: t("Open the résumé", "Ouvrir le CV"), open: { id: "cv" } }],
        chips: pick("reach", "project", "exp"),
      };
    case "sibling":
      return { lines: [cat.sibling], chips: pick("who", "project", "pet") };
    case "pet":
      return { lines: [cat.petLine], chips: pick("treat", "play", "who"), react: "pet" };
    case "treat":
      return { lines: [cat.treatLine], chips: pick("pet", "play", "project"), react: "treat" };
    case "play":
      return { lines: [cat.playLine], chips: pick("pet", "treat", "who"), react: "play" };
    case "hello":
      return { lines: [t("Mrrp. Hello. Ask me about Lydia.", "Mrrp. Bonjour. Demande-moi des choses sur Lydia.")], chips: START_CHIPS };
    case "thanks":
      return { lines: [t("Mrrp. You are welcome. Now, about that treat.", "Mrrp. De rien. Maintenant, parlons de cette friandise.")], chips: pick("reach", "project", "treat") };
    case "bye":
      return { lines: [t("Mrrp. Come back soon. Or don't. I will be here.", "Mrrp. Reviens vite. Ou pas. Je serai là.")], chips: pick("reach", "cv") };
    default:
      return { lines: [cat.lost], chips: START_CHIPS };
  }
}

/** Map free text to an intent. Works in English and French. */
const RULES: [string, string[]][] = [
  ["hello", ["hello", "hi ", "hey", "coucou", "bonjour", "salut", "mrrp", "meow", "miaou"]],
  ["thanks", ["thank", "merci", "thx"]],
  ["bye", ["bye", "goodbye", "au revoir", "a bientot", "ciao"]],
  ["sibling", ["other cat", "lamborghini", "ferrari", "sister", "brother", "autre chat", "l'autre", "ton frere", "ta soeur", "other one"]],
  ["pet", ["pet ", "pets", "cuddle", "caress", "gratt", "stroke"]],
  ["treat", ["treat", "food", "snack", "friandise", "croquette", "manger", "hungry", "faim"]],
  ["play", ["play", "toy", "jouer", "jeu"]],
  ["origin", ["where are you from", "where is she from", "where from", "origin", "origine", "algeria", "algerie", "alger", "algiers", "born", "native", "d'ou vient", "d'ou viens", "tu viens d", "vient d"]],
  ["place", ["where do you live", "where does she live", "where is she", "live", "lives", "habite", "vit ", "ou vit", "paris", "france", "city", "ville", "based"]],
  ["cv", ["resume", "cv", "curriculum", "download", "telecharg"]],
  ["contact", ["contact", "reach", "email", "mail", "linkedin", "hire", "recruit", "joindre", "ecrire", "message", "phone", "telephone", "embauch"]],
  ["projects", ["project", "projet", "work", "portfolio", "case", "etude", "show me", "montre", "made", "built", "fabriq", "design"]],
  ["exp", ["experience", "intern", "stage", "job", "career", "worked", "travaill", "parcours", "inria", "lisn", "tutor"]],
  ["edu", ["study", "studied", "school", "universit", "master", "degree", "diplom", "etud", "bachelor", "licence", "saclay"]],
  ["skills", ["skill", "tool", "competence", "good at", "figma", "unity", "blender", "prototyp"]],
  ["now", ["now", "currently", "right now", "en ce moment", "maintenant", "actuel", "doing", "fait-elle", "available", "disponible"]],
  ["who", ["who", "qui ", "about", "propos", "yourself", "presente", "introduce", "lydia", "she ", "elle"]],
];
export function intentOf(text: string): string {
  const s = " " + norm(text) + " ";
  for (const c of cases) if (s.includes(norm(cleanTitle(c.title)).slice(0, 7))) return "case:" + c.id;
  let best = "";
  let bestScore = 0;
  for (const [intent, words] of RULES) {
    const score = words.reduce((n, w) => n + (s.includes(norm(w)) ? 1 : 0), 0);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best || "?";
}
