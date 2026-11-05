import { t } from "../i18n";

export interface Spot {
  id: string;
  /** hotspots sharing a key count as one discovery */
  key: string;
  label: string;
}

/** Every clickable thing in the 3D room. Ids match the objects built in world/index.ts. */
export const SPOTS: Spot[] = [
  { id: "sea", key: "sea", label: t("The sea", "La mer") },
  { id: "about", key: "about", label: t("Play “this or that” with me", "Jouer à « ceci ou cela » avec moi") },
  { id: "laptop", key: "laptop", label: t("My portfolio: zoom in", "Mon portfolio : zoomer") },
  { id: "perfume", key: "perfume", label: t("My perfume", "Mon parfum") },
  { id: "lipstick", key: "lipstick", label: t("The red lipstick", "Le rouge à lèvres") },
  { id: "sunnies", key: "sunnies", label: t("Heart sunglasses", "Lunettes cœur") },
  { id: "bag", key: "bag", label: t("The pink bag", "Le sac rose") },
  { id: "phone", key: "phone", label: t("Contact", "Contact") },
  { id: "cv", key: "cv", label: t("Résumé", "CV") },
  { id: "notes", key: "notes", label: t("To do", "À faire") },
  { id: "cat-photo-1", key: "cats", label: t("The cats", "Les chats") },
  { id: "cat-photo-2", key: "cats", label: t("The cats", "Les chats") },
  { id: "exp", key: "exp", label: t("Experience", "Parcours") },
  { id: "music", key: "music", label: t("Music", "Musique") },
  { id: "paris", key: "paris", label: t("Where I live", "Où j'habite") },
  { id: "algiers", key: "algiers", label: t("Postcard from Algiers", "Carte postale d'Alger") },
  { id: "lamp", key: "lamp", label: t("Switch the light", "Allumer ou éteindre") },
  { id: "matcha", key: "matcha", label: t("My favourite drink of the moment", "Ma boisson préférée du moment") },
  { id: "plant", key: "plant", label: t("Say hi to the plant", "Dire bonjour à la plante") },
  { id: "cat-a", key: "cat-a", label: t("Talk to Ferrari", "Parler à Ferrari") },
  { id: "cat-b", key: "cat-b", label: t("Talk to Lamborghini", "Parler à Lamborghini") },
];

export const TOTAL = new Set(SPOTS.map((s) => s.key)).size;

/** Invisible buttons laid over the 3D objects so the room works with a keyboard and a screen reader. */
export const proxyHtml = () =>
  SPOTS.map((s) => `<button type="button" class="hs" id="hs-${s.id}" data-id="${s.id}" data-label="${s.label}" aria-label="${s.label}"></button>`).join("");
