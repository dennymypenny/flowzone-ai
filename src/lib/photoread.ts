/**
 * Reading a photograph, in the browser, with nothing sent anywhere.
 *
 * Somebody drops a picture of the thing they are trying to build. That
 * picture already knows most of the brief: the colours it lives in, whether
 * it is warm or cold, whether it is lit like a bakery at 7am or a bar at
 * 11pm, whether it is busy or calm, and whether it is a close-up of one
 * object or a wide room. None of that needs a model or an API. It is
 * arithmetic over pixels, and arithmetic runs on a phone in a few
 * milliseconds with the file never leaving the device.
 *
 * What comes out is a palette you can actually build with and a read in
 * plain words, so the next question the site asks is already informed.
 */

export type PhotoRead = {
  /** Up to five dominant colours, most-used first, as hex. */
  palette: string[];
  /** The single strongest colour, the one worth building on. */
  hero: string;
  /** 0 dark, 1 bright. */
  light: number;
  /** -1 cool, 1 warm. */
  warmth: number;
  /** 0 grey, 1 vivid. */
  colour: number;
  /** 0 calm and empty, 1 busy and detailed. */
  busy: number;
  /** Plain-word tags, the ones a person would actually say. */
  tags: string[];
  /** One sentence of read, written the way a person would say it. */
  line: string;
  /** Words worth putting into the idea, drawn from the read. */
  words: string[];
};

const hex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

/** Saturation and lightness, the two things the eye actually reports on. */
function sl(r: number, g: number, b: number) {
  const mx = Math.max(r, g, b) / 255;
  const mn = Math.min(r, g, b) / 255;
  const l = (mx + mn) / 2;
  const d = mx - mn;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { s, l };
}

/**
 * Buckets first, then a real average inside the winning buckets.
 *
 * Straight quantising to a 4-bit cube gives muddy colours, because the
 * bucket centre is never where the pixels actually sit. Counting in buckets
 * and then averaging the members gives back the colour that was really
 * there, which is the difference between a palette you can use and five
 * shades of sludge.
 */
function dominant(data: Uint8ClampedArray): { hex: string; n: number }[] {
  const bins = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const cur = bins.get(key);
    if (cur) {
      cur.r += r;
      cur.g += g;
      cur.b += b;
      cur.n += 1;
    } else {
      bins.set(key, { r, g, b, n: 1 });
    }
  }
  const all = Array.from(bins.values()).sort((a, b) => b.n - a.n);
  const out: { hex: string; n: number }[] = [];
  for (const c of all) {
    const r = c.r / c.n;
    const g = c.g / c.n;
    const b = c.b / c.n;
    // Keep the palette from filling up with five versions of the same colour.
    const near = out.some((o) => {
      const pr = parseInt(o.hex.slice(1, 3), 16);
      const pg = parseInt(o.hex.slice(3, 5), 16);
      const pb = parseInt(o.hex.slice(5, 7), 16);
      return Math.abs(pr - r) + Math.abs(pg - g) + Math.abs(pb - b) < 64;
    });
    if (near) continue;
    out.push({ hex: hex(r, g, b), n: c.n });
    if (out.length === 5) break;
  }
  return out;
}

const WORDS = {
  warmDark: ["late night", "candlelit", "amber", "close"],
  warmLight: ["golden", "morning", "sunlit", "honeyed"],
  coolDark: ["moody", "after hours", "inky", "quiet"],
  coolLight: ["crisp", "clean", "airy", "cold light"],
  vivid: ["loud", "saturated", "unmissable"],
  muted: ["muted", "washed", "understated"],
  busy: ["textured", "hands on", "lived in"],
  calm: ["spare", "still", "minimal"],
};

/**
 * The read, in the order a person would say it: light first, because that is
 * what you notice, then colour, then how much is going on.
 */
function describe(light: number, warmth: number, colour: number, busy: number) {
  const tags: string[] = [];
  const words: string[] = [];

  const warm = warmth > 0.08;
  const cool = warmth < -0.08;
  const dark = light < 0.42;
  const bright = light > 0.62;

  if (dark) tags.push("low light");
  else if (bright) tags.push("bright");
  else tags.push("even light");

  if (warm) tags.push("warm");
  else if (cool) tags.push("cool");
  else tags.push("neutral");

  if (colour > 0.45) tags.push("vivid");
  else if (colour < 0.18) tags.push("almost grey");
  else tags.push("soft colour");

  if (busy > 0.5) tags.push("busy");
  else if (busy < 0.22) tags.push("spare");
  else tags.push("simple");

  const bucket = warm ? (dark ? WORDS.warmDark : WORDS.warmLight) : dark ? WORDS.coolDark : WORDS.coolLight;
  words.push(...bucket.slice(0, 2));
  words.push(colour > 0.45 ? WORDS.vivid[0] : WORDS.muted[0]);
  words.push(busy > 0.5 ? WORDS.busy[0] : WORDS.calm[0]);

  const lightLine = dark
    ? "It is shot in low light"
    : bright
      ? "It is bright and open"
      : "The light in it is even";
  const warmLine = warm
    ? "and it runs warm, which reads as welcoming before anybody reads a word"
    : cool
      ? "and it runs cool, which reads as clean and a little serious"
      : "and the colour sits neutral, so the subject does the talking";
  const busyLine =
    busy > 0.5
      ? "There is a lot going on in the frame, so whatever you build should let it breathe."
      : busy < 0.22
        ? "There is almost nothing in the frame, so the brand can afford to be quiet and confident."
        : "The frame is simple enough to put type over.";

  return { tags, words, line: `${lightLine} ${warmLine}. ${busyLine}` };
}

/**
 * Read a photograph. Takes anything an <img> can load, including the data
 * URLs the drop handler already makes, and never touches the network.
 * Returns null rather than throwing, because a page in the middle of a good
 * moment should not break over a picture.
 */
export function readPhoto(source: string): Promise<PhotoRead | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined" || !source) return resolve(null);
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        // Small is plenty. 96px on the long edge is enough for colour and
        // enough for detail, and it keeps the whole read under a frame.
        const long = Math.max(im.width, im.height) || 1;
        const scale = Math.min(1, 96 / long);
        const w = Math.max(8, Math.round(im.width * scale));
        const h = Math.max(8, Math.round(im.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const c = canvas.getContext("2d", { willReadFrequently: true });
        if (!c) return resolve(null);
        c.drawImage(im, 0, 0, w, h);
        const img = c.getImageData(0, 0, w, h);
        const d = img.data;

        let lSum = 0;
        let sSum = 0;
        let warmSum = 0;
        let n = 0;
        const lum: number[] = new Array(w * h);
        for (let i = 0, p = 0; i < d.length; i += 4, p += 1) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const { s, l } = sl(r, g, b);
          lSum += l;
          sSum += s;
          // Warmth: how far red beats blue, scaled so it lands in -1..1.
          warmSum += (r - b) / 255;
          lum[p] = l;
          n += 1;
        }
        if (!n) return resolve(null);

        // Busy-ness is edge energy: how much the picture changes as you walk
        // across it. A plate of food on a table is calm, a workshop is not.
        let edge = 0;
        for (let y = 1; y < h; y += 1) {
          for (let x = 1; x < w; x += 1) {
            const i = y * w + x;
            edge += Math.abs(lum[i] - lum[i - 1]) + Math.abs(lum[i] - lum[i - w]);
          }
        }
        const busyRaw = edge / ((w - 1) * (h - 1) * 2);

        const light = lSum / n;
        const colour = Math.min(1, (sSum / n) * 1.35);
        const warmth = Math.max(-1, Math.min(1, (warmSum / n) * 3.2));
        const busy = Math.min(1, busyRaw * 7);

        const pal = dominant(d);
        const palette = pal.map((p) => p.hex);
        // The hero is the most-used colour that is not mud: something with a
        // bit of life in it, because that is the one worth building on.
        const hero =
          pal
            .map((p) => {
              const r = parseInt(p.hex.slice(1, 3), 16);
              const g = parseInt(p.hex.slice(3, 5), 16);
              const b = parseInt(p.hex.slice(5, 7), 16);
              const { s, l } = sl(r, g, b);
              return { hexv: p.hex, score: p.n * (0.35 + s) * (l > 0.12 && l < 0.9 ? 1 : 0.35) };
            })
            .sort((a, b) => b.score - a.score)[0]?.hexv || palette[0] || "#5B8CFF";

        const { tags, words, line } = describe(light, warmth, colour, busy);
        resolve({ palette, hero, light, warmth, colour, busy, tags, line, words });
      } catch {
        resolve(null);
      }
    };
    im.onerror = () => resolve(null);
    im.src = source;
  });
}

/** Where the read is left for the design track to pick up. */
export const PHOTO_READ_KEY = "flowzone.photoread.v1";
