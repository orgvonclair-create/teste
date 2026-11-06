const RELOAD_FLAG = "ff-chunk-reload";

const CHUNK_PATTERNS = [
  "failed to fetch dynamically imported module",
  "error loading dynamically imported module",
  "importing a module script failed",
  "chunkloaderror",
  "loading chunk",
  "loading css chunk",
  "unexpected token '<'",
  "text/html",
];

export function isStaleAssetError(error: unknown): boolean {
  const message = [
    (error as { message?: string } | null)?.message,
    (error as { name?: string } | null)?.name,
    typeof error === "string" ? error : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (!message) return false;
  return CHUNK_PATTERNS.some((pattern) => message.includes(pattern));
}

/** Reload once with a cache-busting param so a stale deploy in the browser self-heals. */
export function reloadForStaleAssets(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(RELOAD_FLAG)) return false;
    window.sessionStorage.setItem(RELOAD_FLAG, "1");
  } catch {
    // sessionStorage unavailable: still attempt a single reload below
  }
  const url = new URL(window.location.href);
  url.searchParams.set("_v", Date.now().toString(36));
  window.location.replace(url.toString());
  return true;
}

export function clearStaleAssetFlag() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    /* ignore */
  }
}

export function installStaleAssetRecovery() {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { __ffStaleRecovery?: boolean };
  if (w.__ffStaleRecovery) return;
  w.__ffStaleRecovery = true;

  window.addEventListener("error", (event) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === "SCRIPT" || target.tagName === "LINK")) {
      reloadForStaleAssets();
      return;
    }
    if (isStaleAssetError(event.error)) reloadForStaleAssets();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isStaleAssetError(event.reason)) reloadForStaleAssets();
  });
}
