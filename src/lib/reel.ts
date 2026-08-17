/**
 * The engine behind the reel editor.
 *
 * Everything here is plain drawing and arithmetic, deliberately kept out of
 * React so the same code paints the little preview on a phone and the full
 * size export, from one description of the project. One painter, two canvases,
 * no chance of the preview lying about what you are going to get.
 *
 * Nothing in here touches the network and nothing leaves the device.
 */

export type Drawable = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

export type FormatId = "9x16" | "4x5" | "1x1" | "16x9" | "custom";

export type FormatPreset = { id: FormatId; label: string; note: string; w: number; h: number };

/** The four shapes short form actually uses, at the resolution each platform wants. */
export const FORMATS: FormatPreset[] = [
  { id: "9x16", label: "9:16", note: "Reels, TikTok, Shorts", w: 1080, h: 1920 },
  { id: "4x5", label: "4:5", note: "Instagram feed", w: 1080, h: 1350 },
  { id: "1x1", label: "1:1", note: "Square, fits anywhere", w: 1080, h: 1080 },
  { id: "16x9", label: "16:9", note: "YouTube, websites", w: 1920, h: 1080 },
];

export const POSITIONS = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"] as const;
export type Pos = (typeof POSITIONS)[number];

export type Overlay = {
  text: string;
  /** Percent of the frame's short side, so type stays the same weight in every format. */
  size: number;
  weight: number;
  color: string;
  pos: Pos;
  plate: boolean;
};

export type ClipKind = "video" | "image" | "card";
export type Fit = "cover" | "contain";
export type Trans = "cut" | "crossfade" | "dip";

export type Clip = {
  id: string;
  kind: ClipKind;
  name: string;
  /** Object URL for video. Images are decoded straight to a canvas, so they hold no URL. */
  src: string;
  mediaDur: number;
  inS: number;
  outS: number;
  stillMs: number;
  fit: Fit;
  bg: string;
  zoom: boolean;
  muted: boolean;
  text: Overlay | null;
  /** The transition into this clip from the one before it. The first clip ignores it. */
  trans: Trans;
  transMs: number;
  dipColor: string;
  thumb: string;
};

export type Slot = { clip: Clip; start: number; dur: number };

export const PAPER = "#0C1424";
export const INK = "#F1F3F7";
export const ACCENT = "#5B8CFF";

let seq = 0;
export function newId(): string {
  seq += 1;
  return `c${seq}_${Math.random().toString(36).slice(2, 7)}`;
}

export function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

/** Encoders want even numbers. Odd sizes make some browsers refuse to record at all. */
export function evenSize(n: number): number {
  const v = Math.round(clampNum(n, 240, 2160));
  return v % 2 === 0 ? v : v + 1;
}

export function defaultOverlay(text: string): Overlay {
  return { text, size: 6, weight: 600, color: INK, pos: "bc", plate: false };
}

export function clipMs(c: Clip): number {
  if (c.kind === "video") return Math.max(300, Math.round((c.outS - c.inS) * 1000));
  return Math.max(300, Math.round(c.stillMs));
}

export function layout(clips: Clip[]): { slots: Slot[]; total: number } {
  const slots: Slot[] = [];
  let t = 0;
  for (const clip of clips) {
    const dur = clipMs(clip);
    slots.push({ clip, start: t, dur });
    t += dur;
  }
  return { slots, total: t };
}

export function slotIndexAt(slots: Slot[], t: number): number {
  if (!slots.length) return -1;
  for (let i = 0; i < slots.length; i++) {
    if (t < slots[i].start + slots[i].dur) return i;
  }
  return slots.length - 1;
}

export function fmtTime(ms: number): string {
  const s = Math.max(0, ms) / 1000;
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r < 10 ? "0" : ""}${r.toFixed(1)}`;
}

export function fmtSecs(ms: number): string {
  return `${(Math.max(0, ms) / 1000).toFixed(1)}s`;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function sizeOf(el: Drawable): { w: number; h: number } {
  if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement) {
    return { w: el.videoWidth || 0, h: el.videoHeight || 0 };
  }
  if (typeof HTMLImageElement !== "undefined" && el instanceof HTMLImageElement) {
    return { w: el.naturalWidth || 0, h: el.naturalHeight || 0 };
  }
  return { w: el.width || 0, h: el.height || 0 };
}

export function wrapText(
  c: CanvasRenderingContext2D,
  text: string,
  max: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (c.measureText(t).width > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = t;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function hexLum(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  if (!Number.isFinite(n)) return 1;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function roundedPath(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.lineTo(x + w - rr, y);
  c.quadraticCurveTo(x + w, y, x + w, y + rr);
  c.lineTo(x + w, y + h - rr);
  c.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  c.lineTo(x + rr, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - rr);
  c.lineTo(x, y + rr);
  c.quadraticCurveTo(x, y, x + rr, y);
  c.closePath();
}

/** The studio card look: two soft lights bleeding in from opposite corners. */
function aurora(c: CanvasRenderingContext2D, W: number, H: number) {
  const big = Math.max(W, H);
  const g1 = c.createRadialGradient(W * 0.2, -H * 0.08, big * 0.04, W * 0.2, -H * 0.08, big * 0.7);
  g1.addColorStop(0, "rgba(91,155,249,0.5)");
  g1.addColorStop(1, "rgba(12,20,36,0)");
  c.fillStyle = g1;
  c.fillRect(0, 0, W, H);
  const g2 = c.createRadialGradient(W * 0.9, H * 1.06, big * 0.04, W * 0.9, H * 1.06, big * 0.62);
  g2.addColorStop(0, "rgba(30,58,138,0.6)");
  g2.addColorStop(1, "rgba(12,20,36,0)");
  c.fillStyle = g2;
  c.fillRect(0, 0, W, H);
}

/** The three dots. It is the studio signature, so it rides on top of everything. */
export function drawMark(c: CanvasRenderingContext2D, W: number, H: number, t: number, calm: boolean) {
  const unit = Math.min(W, H);
  const r = unit * 0.0125;
  const gap = unit * 0.05;
  const y = unit * 0.1;
  const cx = W / 2;
  const cols = ["#1E3A8A", "#5B9BF9", "#C6E4F8"];
  c.save();
  c.strokeStyle = "rgba(221,238,251,0.7)";
  c.lineWidth = Math.max(1, unit * 0.0028);
  c.beginPath();
  c.moveTo(cx - gap + r, y);
  c.lineTo(cx + gap - r, y);
  c.stroke();
  cols.forEach((col, i) => {
    const pulse = calm ? 1 : 1 + 0.18 * Math.max(0, Math.sin((t / 600) * Math.PI - i * 0.9));
    c.fillStyle = col;
    c.beginPath();
    c.arc(cx - gap + i * gap, y, r * pulse, 0, Math.PI * 2);
    c.fill();
  });
  c.restore();
}

/** A wash behind the words, aimed at whichever edge they sit on, so text reads on any footage. */
function scrim(c: CanvasRenderingContext2D, W: number, H: number, pos: Pos) {
  const v = pos[0];
  const g = c.createLinearGradient(0, 0, 0, H);
  if (v === "t") {
    g.addColorStop(0, "rgba(12,20,36,0.72)");
    g.addColorStop(0.45, "rgba(12,20,36,0)");
    g.addColorStop(1, "rgba(12,20,36,0)");
  } else if (v === "b") {
    g.addColorStop(0, "rgba(12,20,36,0)");
    g.addColorStop(0.55, "rgba(12,20,36,0)");
    g.addColorStop(1, "rgba(12,20,36,0.85)");
  } else {
    g.addColorStop(0, "rgba(12,20,36,0.15)");
    g.addColorStop(0.5, "rgba(12,20,36,0.5)");
    g.addColorStop(1, "rgba(12,20,36,0.15)");
  }
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}

export function drawOverlay(c: CanvasRenderingContext2D, W: number, H: number, o: Overlay, alpha: number) {
  const text = o.text.trim();
  if (!text) return;
  const short = Math.min(W, H);
  const px = Math.max(8, Math.round((short * o.size) / 100));
  c.save();
  c.globalAlpha = alpha;
  c.font = `${o.weight} ${px}px Poppins, system-ui, sans-serif`;
  c.textBaseline = "top";
  const pad = Math.round(short * 0.07);
  const lines = wrapText(c, text, W - pad * 2, 5);
  const lh = Math.round(px * 1.24);
  const blockH = lines.length * lh;
  const v = o.pos[0];
  const h = o.pos[1];
  const top = v === "t" ? pad : v === "m" ? Math.round((H - blockH) / 2) : H - pad - blockH;
  const x = h === "l" ? pad : h === "c" ? W / 2 : W - pad;
  c.textAlign = h === "l" ? "left" : h === "c" ? "center" : "right";

  if (o.plate) {
    let widest = 0;
    for (const ln of lines) widest = Math.max(widest, c.measureText(ln).width);
    const ix = Math.round(px * 0.5);
    const iy = Math.round(px * 0.34);
    const bx = h === "l" ? x - ix : h === "c" ? W / 2 - widest / 2 - ix : x - widest - ix;
    roundedPath(c, bx, top - iy, widest + ix * 2, blockH + iy * 2, Math.round(px * 0.3));
    c.fillStyle = hexLum(o.color) > 0.55 ? "rgba(12,20,36,0.86)" : "rgba(241,243,247,0.9)";
    c.fill();
  }

  c.fillStyle = o.color;
  lines.forEach((ln, i) => c.fillText(ln, x, top + i * lh));
  c.restore();
}

export function drawClip(
  c: CanvasRenderingContext2D,
  W: number,
  H: number,
  clip: Clip,
  el: Drawable | undefined,
  localMs: number,
  dur: number,
  alpha: number
) {
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = clip.bg || PAPER;
  c.fillRect(0, 0, W, H);

  if (clip.kind === "card") {
    aurora(c, W, H);
  } else if (el) {
    const { w: iw, h: ih } = sizeOf(el);
    if (iw > 0 && ih > 0) {
      const p = dur > 0 ? clampNum(localMs / dur, 0, 1) : 0;
      const grow = clip.zoom ? 1.02 + ease(p) * 0.12 : 1;
      const base = clip.fit === "contain" ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih);
      const s = base * grow;
      const dw = iw * s;
      const dh = ih * s;
      try {
        c.drawImage(el, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } catch {
        // A frame that is not ready yet is not an error worth stopping a render for.
      }
    }
  }

  const o = clip.text;
  if (o && o.text.trim()) {
    if (!o.plate && clip.kind !== "card") scrim(c, W, H, o.pos);
    drawOverlay(c, W, H, o, 1);
  }
  c.restore();
}

function veil(c: CanvasRenderingContext2D, W: number, H: number, color: string, alpha: number) {
  c.save();
  c.globalAlpha = clampNum(alpha, 0, 1);
  c.fillStyle = color;
  c.fillRect(0, 0, W, H);
  c.restore();
}

/**
 * Paint the whole project at one moment in time.
 *
 * A transition lives inside the first slice of the clip it belongs to, rather
 * than overlapping two clips on the ruler. That keeps the timeline honest: the
 * number on a clip card is the number of seconds it takes up, always.
 */
export function drawFrame(
  c: CanvasRenderingContext2D,
  W: number,
  H: number,
  slots: Slot[],
  t: number,
  get: (id: string) => Drawable | undefined,
  brand: boolean,
  calm: boolean
) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.fillStyle = PAPER;
  c.fillRect(0, 0, W, H);
  if (!slots.length) return;

  const i = slotIndexAt(slots, t);
  const s = slots[i];
  const local = clampNum(t - s.start, 0, s.dur);
  const prev = i > 0 ? slots[i - 1] : null;
  const tms = prev ? Math.min(s.clip.transMs, s.dur, prev.dur) : 0;

  if (prev && s.clip.trans !== "cut" && tms > 0 && local < tms) {
    const k = local / tms;
    if (s.clip.trans === "crossfade") {
      drawClip(c, W, H, prev.clip, get(prev.clip.id), prev.dur, prev.dur, 1);
      drawClip(c, W, H, s.clip, get(s.clip.id), local, s.dur, k);
    } else if (k < 0.5) {
      drawClip(c, W, H, prev.clip, get(prev.clip.id), prev.dur, prev.dur, 1);
      veil(c, W, H, s.clip.dipColor, k * 2);
    } else {
      drawClip(c, W, H, s.clip, get(s.clip.id), local, s.dur, 1);
      veil(c, W, H, s.clip.dipColor, 2 - 2 * k);
    }
  } else {
    drawClip(c, W, H, s.clip, get(s.clip.id), local, s.dur, 1);
  }

  if (brand) drawMark(c, W, H, t, calm);
}

/**
 * Every container worth trying, best first.
 *
 * isTypeSupported is not a promise. Browsers say yes to types their encoder
 * then refuses to build, so this is a list to walk, not an answer to trust.
 * An empty string at the end means let the browser pick whatever it likes.
 */
export function mimeCandidates(): string[] {
  const all = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  const canAsk = typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function";
  const ok = canAsk ? all.filter((m) => MediaRecorder.isTypeSupported(m)) : all;
  return [...ok, ""];
}

export const MP4_WHY =
  "Saved as MP4, because this browser records it directly. Drop it straight into anything.";
export const WEBM_WHY =
  "Saved as WebM, because this browser cannot record MP4. It is a real video file, it plays on every desktop and on Android, and any editor will convert it if you need MP4.";

export function whyFor(ext: string): string {
  return ext === "mp4" ? MP4_WHY : WEBM_WHY;
}

/** Enough bits that footage does not turn to soup, capped so a long reel stays a sane size. */
export function bitrateFor(w: number, h: number): number {
  return Math.round(clampNum(w * h * 2.4, 3_500_000, 14_000_000));
}
