/* Privacy-friendly, cookie-free counters sent to /api/track (see api/track.js).
   No personal data: the server only keeps totals. Visit /?notrack once in a browser to exclude it. */
const off = () => {
  try {
    if (location.search.includes("notrack")) localStorage.setItem("notrack", "1");
    if (location.search.includes("track=on")) localStorage.removeItem("notrack");
    return localStorage.getItem("notrack") === "1";
  } catch {
    return false;
  }
};
const local = /^(localhost|127\.|192\.168\.|\[::1\])/.test(location.hostname);

function send(body: Record<string, unknown>) {
  if (local || off()) return;
  try {
    const data = JSON.stringify(body);
    if (!navigator.sendBeacon?.("/api/track", new Blob([data], { type: "application/json" }))) {
      void fetch("/api/track", { method: "POST", body: data, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* analytics must never break the page */
  }
}

/** a named action, e.g. track("open:work") */
export const track = (name: string) => send({ t: "ev", n: name });

let started = false;
export function startTracking(page: string) {
  if (started) return;
  started = true;
  let ref = "";
  try {
    const u = new URL(document.referrer);
    if (u.host !== location.host) ref = u.host.replace(/^www\./, "");
  } catch {
    /* no referrer */
  }
  send({ t: "view", p: page, ref, l: document.documentElement.lang || navigator.language.slice(0, 2), w: innerWidth });
  /* outbound links, mail and downloads */
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const h = a.getAttribute("href") || "";
    if (h.startsWith("mailto:")) track("link:email");
    else if (/\.pdf($|\?)/i.test(h)) track("link:pdf");
    else if (/^https?:/i.test(h) && !h.includes(location.host)) track("link:" + new URL(h).host.replace(/^www\./, ""));
  });
}
