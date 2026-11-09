import { t } from "../../i18n";

export interface SceneFx {
  burst: (x: number, y: number, glyphs?: string[], n?: number) => void;
  toast: (text: string) => void;
  close: () => void;
}

export interface SceneDef {
  title: string;
  html: string;
  /** wire up the scene; return a cleanup function if it has timers or sounds to stop */
  mount: (root: HTMLElement, fx: SceneFx) => void | (() => void);
  /** called once the scene has closed */
  after?: () => void;
}

/** one full-screen "play" overlay, shared by the guitar, makeup, cats and matcha scenes */
export function createScenes(host: HTMLElement, base: Pick<SceneFx, "burst" | "toast">, reduce: boolean) {
  host.innerHTML = `
    <div class="sc-card" role="dialog" aria-modal="true" aria-labelledby="sc-title" tabindex="-1">
      <div class="sc-bar"><h2 id="sc-title"></h2><button type="button" class="orb" id="sc-close" aria-label="${t("Close", "Fermer")}">×</button></div>
      <div class="sc-body" id="sc-body"></div>
    </div>`;
  const card = host.querySelector<HTMLElement>(".sc-card")!;
  const title = host.querySelector<HTMLElement>("#sc-title")!;
  const body = host.querySelector<HTMLElement>("#sc-body")!;
  let cleanup: void | (() => void);
  let def: SceneDef | null = null;
  let opener: HTMLElement | null = null;
  let timer = 0;

  const fx: SceneFx = { ...base, close: () => api.close() };

  const api = {
    isOpen: () => !host.hidden,
    open(d: SceneDef, from?: HTMLElement | null) {
      if (!host.hidden) api.close(true);
      def = d;
      opener = from ?? (document.activeElement as HTMLElement | null);
      title.textContent = d.title;
      body.innerHTML = d.html;
      host.hidden = false;
      host.classList.remove("on");
      void host.offsetWidth;
      host.classList.add("on");
      document.getElementById("room")?.classList.add("playing");
      cleanup = d.mount(body, fx);
      card.focus({ preventScroll: true });
    },
    close(quick = false) {
      if (host.hidden) return;
      const d = def;
      def = null;
      clearTimeout(timer);
      if (typeof cleanup === "function") cleanup();
      cleanup = undefined;
      host.classList.remove("on");
      const done = () => {
        host.hidden = true;
        body.innerHTML = "";
        document.getElementById("room")?.classList.remove("playing");
        opener?.focus?.({ preventScroll: true });
        d?.after?.();
      };
      if (quick || reduce) done();
      else timer = window.setTimeout(done, 260);
    },
  };

  host.querySelector("#sc-close")!.addEventListener("click", () => api.close());
  host.addEventListener("pointerdown", (e) => {
    if (e.target === host) api.close();
  });
  /* keep Tab inside the card */
  host.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [...card.querySelectorAll<HTMLElement>("button:not([disabled]), [tabindex='0'], a[href]")].filter((n) => n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  return api;
}
