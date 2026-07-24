// Small pub/sub bridge between the service-worker registration in main.tsx
// (outside the React tree) and the UpdateBanner component, so the app can
// prompt the user to apply a newly-installed update instead of reloading
// silently underneath them.

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

/** Called from main.tsx's onNeedRefresh callback. */
export function markUpdateAvailable() {
  updateAvailable = true;
  listeners.forEach((listener) => listener(updateAvailable));
}

/** Subscribes a component to update-availability changes. */
export function subscribeToUpdateAvailable(listener: Listener): () => void {
  listeners.add(listener);
  listener(updateAvailable);
  return () => listeners.delete(listener);
}

/** Triggers the waiting service worker to take over and reload the page. */
export function applyUpdate() {
  void applyUpdateFn?.(true);
}
