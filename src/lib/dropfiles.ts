/**
 * What a browser can honestly do with a dropped file.
 *
 * Three kinds, and the difference matters to the person standing there:
 *
 *   image   the canvas reads it, so we shrink it and pull a palette on device
 *   text    the file API reads it, so we keep the words for the brief
 *   opaque  a PDF or a Word file. A browser cannot open these without a
 *           parser library, and we are not shipping one. So we keep the name
 *           and the size, say plainly that it stays on the device, and let
 *           them send it over when they message us.
 *
 * Nothing here touches the network. Every read is FileReader or canvas, both
 * of which run on the machine the file is already sitting on.
 */

import { KEYS, loadJSON, saveJSON } from "@/lib/session";

/* ------------------------------------------------------------------- types */

export type DropKind = "image" | "text" | "opaque";

export type DroppedFile = {
  id: string;
  name: string;
  size: number;
  kind: DropKind;
  /** Images only: the shrunk data URL. Small enough to store and to paint. */
  dataURL?: string;
  /** Text only: the words, capped so one big log cannot eat the quota. */
  text?: string;
  /** Text only: true when we had to cut it. Never cut something quietly. */
  truncated?: boolean;
  /** True when we could have read the kind but the file was too big to try. */
  oversize?: boolean;
  /**
   * Anything this entry borrowed from the browser and has to hand back.
   * Nothing sets it today, because previews come from data URLs and opaque
   * files are never opened. It exists so that the day something does hold a
   * URL, the remove path already revokes it instead of leaking a 200MB video.
   */
  objectURL?: string;
};

export type SkippedFile = { name: string; why: string };

export type Intake = { added: DroppedFile[]; skipped: SkippedFile[] };

/* ------------------------------------------------------------------ limits */

/** Eight is more than anybody needs and few enough to stay a list, not a grid. */
export const MAX_FILES = 8;
/** Photos are capped lower because each one is kilobytes of base64 in storage. */
export const MAX_IMAGES = 6;
/**
 * The read cap, not a size cap. Bigger images and text files are not thrown
 * out, they drop to the listed-by-name path, which costs nothing to hold.
 */
export const MAX_READ_BYTES = 25 * 1024 * 1024;
/** Per file, and across all of them. A 5MB log would take the whole quota. */
export const TEXT_CHARS = 12000;
export const TEXT_CHARS_TOTAL = 40000;

/** Where the readable and the listed files park. Images stay in KEYS.uploads. */
export const DOCS_KEY = "flowzone.dropdocs.v1";

/** The extensions we can genuinely read as text, on top of any text/* type. */
const TEXT_EXT = ["txt", "md", "markdown", "csv", "tsv", "json", "log", "rtf"];

/* ---------------------------------------------------------------- helpers */

let seq = 0;
const newId = () => `f${Date.now().toString(36)}${(seq += 1).toString(36)}`;

const ext = (name: string) => {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1).toLowerCase() : "";
};

/** Sizes the way a person says them. */
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Which of the three a file is.
 *
 * Type first, extension second. Plenty of systems hand over a .md with an
 * empty type, and plenty hand over text/plain for a file called notes.
 */
export function classify(file: File): DropKind {
  const type = (file.type || "").toLowerCase();
  const e = ext(file.name);
  // RTF claims text/rtf but is markup soup, so it is read and left as-is.
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("text/")) return "text";
  if (type === "application/json" || type === "application/xml") return "text";
  if (TEXT_EXT.includes(e)) return "text";
  return "opaque";
}

/** The plain-words note that sits under each file in the list. */
export function noteFor(f: DroppedFile): string {
  if (f.kind === "image") return "Read here for its colours. It never left this device.";
  if (f.kind === "text") {
    return f.truncated
      ? "Read here. We kept the first part of it for your brief."
      : "Read here. The words are in your brief now.";
  }
  if (f.oversize) {
    return "Too big to read in a browser, so it is listed by name. Send it over when you message us.";
  }
  return "Stays on your device. A browser cannot read this kind, so send it over when you message us.";
}

/**
 * Read a file as text without a network round trip.
 *
 * `File.text()` is the short road. Older Safari does not have it, so
 * FileReader is the fallback rather than a broken drop on somebody's phone.
 */
function readText(file: File): Promise<string | null> {
  if (typeof (file as any).text === "function") {
    return file.text().then(
      (t) => t,
      () => null
    );
  }
  return new Promise((resolve) => {
    try {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsText(file);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Shrink an image on device so storage stays small and paint stays fast.
 *
 * The object URL is revoked on every exit, including the error one. A dropped
 * video or a 40MB raw file that never loads must not leave its bytes pinned.
 */
export function shrinkImage(file: File, max = 1280): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(null);
    let url = "";
    try {
      url = URL.createObjectURL(file);
    } catch {
      return resolve(null);
    }
    let done = false;
    const finish = (out: string | null) => {
      if (done) return;
      done = true;
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* already gone */
      }
      resolve(out);
    };
    const im = new Image();
    im.onload = () => {
      try {
        const scale = Math.min(1, max / Math.max(im.width, im.height, 1));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(im.width * scale));
        canvas.height = Math.max(1, Math.round(im.height * scale));
        const c = canvas.getContext("2d");
        if (!c) return finish(null);
        c.drawImage(im, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL("image/jpeg", 0.82));
      } catch {
        finish(null);
      }
    };
    im.onerror = () => finish(null);
    im.src = url;
  });
}

/**
 * The first line of a text file worth putting in the idea box.
 *
 * Front matter, markdown hashes, bullet dashes, quote marks and JSON braces
 * are all noise. What we want is the first line a person actually wrote, so a
 * candidate has to have some length and more than one word.
 */
export function firstMeaningfulLine(text: string): string {
  const lines = text.split(/\r?\n/).slice(0, 40);
  for (const raw of lines) {
    let line = raw.trim();
    if (!line || line === "---") continue;
    if (/^[[\]{}",]/.test(line)) continue; // JSON scaffolding
    line = line.replace(/^#+\s*/, "").replace(/^[-*>+]\s*/, "").trim();
    line = line.replace(/^["'`]+|["'`]+$/g, "").trim();
    // A CSV header row is commas with no breathing room. Give it some.
    if (line.includes(",") && !line.includes(" ")) line = line.replace(/,+/g, ", ");
    if (line.length < 12) continue;
    if (!line.includes(" ")) continue;
    return line.length > 120 ? `${line.slice(0, 117).trimEnd()}...` : line;
  }
  return "";
}

/* ------------------------------------------------------------------ intake */

/**
 * Turn what somebody dropped into entries, and say why anything was skipped.
 *
 * `existing` is what is already in the list, because the caps are about the
 * whole list and not about one drop. Every rejection comes back with a reason
 * attached. Nothing disappears without a sentence.
 */
export async function intake(list: FileList | File[], existing: DroppedFile[]): Promise<Intake> {
  const files = Array.from(list);
  const added: DroppedFile[] = [];
  const skipped: SkippedFile[] = [];

  let count = existing.length;
  let images = existing.filter((f) => f.kind === "image").length;
  let chars = existing.reduce((n, f) => n + (f.text ? f.text.length : 0), 0);

  for (const file of files) {
    const name = file.name || "Untitled file";

    if (count >= MAX_FILES) {
      skipped.push({ name, why: `you can carry ${MAX_FILES} files at a time` });
      continue;
    }
    if (file.size === 0) {
      skipped.push({ name, why: "the file is empty" });
      continue;
    }

    let kind = classify(file);
    // Too big to read is not too big to carry. It drops to the listed path so
    // the file still shows up, instead of vanishing with a scolding.
    const tooBigToRead = file.size > MAX_READ_BYTES;
    if (tooBigToRead) kind = "opaque";

    if (kind === "image") {
      if (images >= MAX_IMAGES) {
        skipped.push({ name, why: `${MAX_IMAGES} photos is the limit` });
        continue;
      }
      const dataURL = await shrinkImage(file);
      if (!dataURL) {
        skipped.push({ name, why: "this browser could not open the picture" });
        continue;
      }
      added.push({ id: newId(), name, size: file.size, kind: "image", dataURL });
      images += 1;
      count += 1;
      continue;
    }

    if (kind === "text") {
      const raw = await readText(file);
      if (raw === null) {
        skipped.push({ name, why: "the file would not open" });
        continue;
      }
      const trimmed = raw.trim();
      if (!trimmed) {
        skipped.push({ name, why: "there are no words in it" });
        continue;
      }
      const room = Math.max(0, Math.min(TEXT_CHARS, TEXT_CHARS_TOTAL - chars));
      if (room < 200) {
        skipped.push({ name, why: "there is no room left for more text" });
        continue;
      }
      const text = trimmed.slice(0, room);
      added.push({
        id: newId(),
        name,
        size: file.size,
        kind: "text",
        text,
        truncated: text.length < trimmed.length,
      });
      chars += text.length;
      count += 1;
      continue;
    }

    added.push({ id: newId(), name, size: file.size, kind: "opaque", oversize: tooBigToRead });
    count += 1;
  }

  return { added, skipped };
}

/** Hand back anything an entry borrowed. Safe to call on entries holding nothing. */
export function release(f: DroppedFile): void {
  if (!f.objectURL) return;
  try {
    URL.revokeObjectURL(f.objectURL);
  } catch {
    /* already gone */
  }
}

/* ----------------------------------------------------------------- storage */

/** The shape the docs key holds. Images are not in here, they live in uploads. */
type SavedDoc = {
  name: string;
  size: number;
  kind: "text" | "opaque";
  text?: string;
  truncated?: boolean;
  oversize?: boolean;
};

const isDoc = (v: unknown): v is SavedDoc =>
  typeof v === "object" && v !== null && typeof (v as any).name === "string";

/**
 * Read the list back after a reload.
 *
 * Images come from the uploads key, which is a plain array of data URLs and
 * carries no filenames, so they get counted names. Everything else comes from
 * the docs key with its name and size intact, which is the whole point for the
 * PDFs: a reload should not lose the note that you have one to send us.
 */
export function loadDropped(): DroppedFile[] {
  const out: DroppedFile[] = [];
  const images = loadJSON<unknown[]>(KEYS.uploads, [], Array.isArray).filter(
    (u): u is string => typeof u === "string"
  );
  images.forEach((dataURL, i) => {
    out.push({ id: newId(), name: `Photo ${i + 1}`, size: 0, kind: "image", dataURL });
  });
  const docs = loadJSON<unknown[]>(DOCS_KEY, [], Array.isArray).filter(isDoc);
  docs.forEach((d) => {
    out.push({
      id: newId(),
      name: d.name,
      size: typeof d.size === "number" ? d.size : 0,
      kind: d.kind === "text" ? "text" : "opaque",
      text: typeof d.text === "string" ? d.text : undefined,
      truncated: d.truncated === true,
      oversize: d.oversize === true,
    });
  });
  return out;
}

/**
 * Write the list back to the two keys, and say whether both writes stuck.
 *
 * The uploads key keeps its exact old shape, a flat array of data URL strings,
 * because VideoSpark and the reel read it directly. A false here is a real
 * failure and the caller has to tell the truth about it.
 */
export function saveDropped(files: DroppedFile[]): boolean {
  const images = files.filter((f) => f.kind === "image" && f.dataURL).map((f) => f.dataURL as string);
  const docs: SavedDoc[] = files
    .filter((f) => f.kind !== "image")
    .map((f) => ({
      name: f.name,
      size: f.size,
      kind: f.kind === "text" ? "text" : "opaque",
      text: f.text,
      truncated: f.truncated,
      oversize: f.oversize,
    }));
  const a = saveJSON(KEYS.uploads, images);
  const b = saveJSON(DOCS_KEY, docs);
  return a && b;
}
