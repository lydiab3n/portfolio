export type Lang = "en" | "fr";

const fromUrl = new URLSearchParams(location.search).get("lang");
const stored = (() => {
  try {
    return localStorage.getItem("lang");
  } catch {
    return null;
  }
})();
const guess: Lang = (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
const pick = (v: string | null): Lang | null => (v === "fr" || v === "en" ? v : null);

export const lang: Lang = pick(fromUrl) ?? pick(stored) ?? guess;
document.documentElement.lang = lang;

/** Pick the English or French copy. */
export const t = (en: string, fr: string): string => (lang === "fr" ? fr : en);

/** Remember the choice and reload, keeping what is open. */
export function switchLang(next: Lang, keep: Record<string, string> = {}) {
  if (next === lang) return;
  try {
    localStorage.setItem("lang", next);
  } catch {
    /* storage unavailable */
  }
  const p = new URLSearchParams({ s: "d", lang: next, ...keep });
  location.search = p.toString();
}
