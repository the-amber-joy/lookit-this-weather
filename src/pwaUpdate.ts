// Small pub/sub bridge between the service-worker registration in main.tsx
// (outside the React tree) and the UpdateBanner component, so the app can
// prompt the user to apply a newly-installed update instead of reloading
// silently underneath them.

import { APP_VERSION } from "./changelog";

type Listener = (updateAvailable: boolean) => void;

const listeners = new Set<Listener>();
let updateAvailable = false;
let applyUpdateFn: ((reloadPage?: boolean) => Promise<void>) | null = null;

/** Called once from main.tsx with the function returned by registerSW. */
export function registerUpdateHandler(
  fn: (reloadPage?: boolean) => Promise<void>,
) {
  applyUpdateFn = fn;
}

/**
 * A waiting service worker gets installed for every deploy, even ones that
 * only touch build tooling/tests and don't bump APP_VERSION (see the
 * pre-push hook). Fetching the freshly-built build.txt (bypassing the SW's
 * own cache) tells us whether this particular deploy actually shipped a new
 * version worth interrupting the user for.
 */
async function isUserFacingUpdate(): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}build.txt`, {
      cache: "no-store",
    });
    const match = /version:\s*(\S+)/.exec(await response.text());
    return match ? match[1] !== APP_VERSION : true;
  } catch {
    return true;
  }
}

/** Called from main.tsx's onNeedRefresh callback. */
export async function markUpdateAvailable() {
  if (!(await isUserFacingUpdate())) return;
  updateAvailable = true;
  listeners.forEach((listener) => listener(updateAvailable));
}

/** Subscribes a component to update-availability changes. */
export function subscribeToUpdateAvailable(listener: Listener): () => void {
  listeners.add(listener);
  listener(updateAvailable);
  return () => listeners.delete(listener);
}

/**
 * Triggers the waiting service worker to take over and reloads the page.
 *
 * vite-plugin-pwa's registered update function ignores the `reloadPage`
 * argument it accepts -- it only reloads via an internal `controllerchange`
 * listener gated on its own "isUpdate" bookkeeping, which doesn't reliably
 * fire in every browser (observed: it silently no-ops in Firefox, so the new
 * service worker takes over but the page never refreshes). Reload directly
 * on `controllerchange` instead of depending on that internal flag.
 */
export function applyUpdate() {
  if ("serviceWorker" in navigator) {
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  }
  void applyUpdateFn?.(true);
}
