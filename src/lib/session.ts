/**
 * The session plumbing: storage, downloads, clipboard.
 *
 * Six components were each hand rolling the same blob download, the same
 * try/catch around JSON.parse and the same debounced save. Six copies means
 * six places a bug hides, so they live here once.
 *
 * Two rules shape everything below. Storage is never trusted: a key can hold
 * "not json", "null", the wrong shape or nothing at all, and a page must
 * survive all of it. And storage is never fatal: a full quota or a locked
 * private window loses the save, not the work on screen.
 *
 * Key strings and saved shapes are frozen. People have real work parked under
 * them and a rename is a silent data loss.
 */

/** Every key the site reads or writes. Never change a string here. */
export const KEYS = {
  funnel: "flowzone.funnel.v2",
  idea: "flowzone.idealens.v1",
  uploads: "flowzone.uploads.v1",
  photoRead: "flowzone.photoread.v1",
  track: "flowzone.track.v2",
} as const;

/* ------------------------------------------------------------------ storage */

/**
 * Read JSON out of localStorage, or hand back the fallback.
 *
 * Anything can be in there: a half written string, "null", an array where an
 * object belongs, a shape from three versions ago. Pass `shape` when you care
 * about the contents. Without it the value still has to match the broad kind
 * of the fallback, so an array can never land where an object was expected.
 */
export function loadJSON<T>(key: string, fallback: T, shape?: (v: unknown) => boolean): T {
  if (typeof window === "undefined") return fallback;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Private windows and blocked storage throw on read. That is a miss.
    return fallback;
  }
  if (!raw) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fallback;
  }
  // "null" parses fine and is still nothing.
  if (parsed === null || parsed === undefined) return fallback;

  if (shape) {
    try {
      return shape(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(fallback) !== Array.isArray(parsed)) return fallback;
  if (typeof parsed !== typeof fallback) return fallback;
  return parsed as T;
}

/** Write JSON. Returns false when it did not stick, so callers can react. */
export function saveJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded, private mode, a circular value. Losing a save must never
    // take the page with it.
    return false;
  }
}

/** Drop a key. Silent if storage will not cooperate. */
export function removeJSON(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* nothing to do, and nothing worth breaking over */
  }
}

/** Read a plain string key, for the flags that are not JSON. */
export function loadRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write a plain string key. Returns false when it did not stick. */
export function saveRaw(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------- the two shared documents */

/** The five narrowing answers, plus the first line if they gave one. */
export type FunnelAnswers = Partial<
  Record<"who" | "have" | "price" | "edge" | "block" | "first", string>
>;

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * The funnel answers, filtered down to real strings.
 *
 * Four components read this key and four of them used to trust it. A number,
 * a nested object or a missing `answers` all come back as {} now.
 */
export function readFunnelAnswers(): FunnelAnswers {
  const wrap = loadJSON<Record<string, unknown>>(KEYS.funnel, {}, isObject);
  const raw = isObject(wrap.answers) ? wrap.answers : {};
  const out: FunnelAnswers = {};
  (["who", "have", "price", "edge", "block", "first"] as const).forEach((k) => {
    const v = raw[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  });
  return out;
}

/** What the visitor typed at the front door, and the picture behind it. */
export type SavedIdea = { q: string; thumb: string };

/** The current idea, or null when there is not one worth carrying. */
export function readIdea(): SavedIdea | null {
  const saved = loadJSON<Record<string, unknown> | null>(KEYS.idea, null, isObject);
  if (!saved) return null;
  const q = typeof saved.q === "string" ? saved.q.trim() : "";
  const thumb = typeof saved.thumb === "string" ? saved.thumb : "";
  if (!q && !thumb) return null;
  return { q, thumb };
}

/** Save the current idea in the shape everything else already expects. */
export function saveIdea(idea: SavedIdea): boolean {
  return saveJSON(KEYS.idea, idea);
}

/** The photos they dropped, as data URLs. Anything not a string is dropped. */
export function readUploads(): string[] {
  const list = loadJSON<unknown[]>(KEYS.uploads, [], Array.isArray);
  return list.filter((u): u is string => typeof u === "string");
}

/* ---------------------------------------------------------------- downloads */

function clickDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  // Firefox will not fire a click on a detached anchor, so it goes in the
  // document for the length of one call and comes straight back out.
  a.style.position = "fixed";
  a.style.left = "-9999px";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Hand a generated file to the browser.
 *
 * The revoke is deferred on purpose. Safari and Firefox can start reading the
 * blob after the click returns, and killing the URL on the very next line
 * cancels the download with no error anywhere. A minute is long enough for any
 * of them and short enough that nothing meaningful leaks.
 */
export function downloadBlob(content: BlobPart | BlobPart[], filename: string, type = "text/plain"): void {
  if (typeof window === "undefined") return;
  const parts = Array.isArray(content) ? content : [content];
  const blob = content instanceof Blob ? content : new Blob(parts, { type });
  const url = URL.createObjectURL(blob);
  clickDownload(url, filename);
  window.setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* already gone */
    }
  }, 60000);
}

/** Same trip for a data URL, which owns no object URL to revoke. */
export function downloadDataURL(href: string, filename: string): void {
  if (typeof window === "undefined") return;
  clickDownload(href, filename);
}

/* ---------------------------------------------------------------- clipboard */

/**
 * Copy text, and say whether it worked.
 *
 * Clipboard access dies on http, in older Safari and whenever the browser
 * decides the click was not close enough to the call. Every caller has a
 * download to fall back to, so the answer has to be honest.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copy if we can, otherwise send the same text down as a file. */
export async function copyOrDownload(
  text: string,
  filename: string,
  type = "text/plain"
): Promise<"copied" | "downloaded"> {
  if (await copyText(text)) return "copied";
  downloadBlob(text, filename, type);
  return "downloaded";
}

/* ------------------------------------------------------------------- fetch */

/** Every client fetch gets a leash. A spinner with no end is not a state. */
export const FETCH_TIMEOUT = 8000;

/**
 * fetch with a timeout, and a thrown error when the response is not usable.
 *
 * `AbortSignal.timeout` is missing on older Safari, so there is a manual
 * fallback. Without one, a phone on a dying connection hangs forever.
 */
export async function fetchJSON<T = any>(url: string, ms = FETCH_TIMEOUT): Promise<T> {
  const ctrl = typeof AbortController === "function" ? new AbortController() : null;
  let timer: number | null = null;
  if (ctrl) timer = window.setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    if (timer !== null) window.clearTimeout(timer);
  }
}
