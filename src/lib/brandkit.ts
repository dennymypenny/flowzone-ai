/**
 * The generator behind the playground.
 *
 * Everything here is deterministic: the same seed and the same settings always
 * produce the same identity. That is what makes it a toy worth playing with
 * rather than a slot machine. You can lock a colour you like, keep rolling the
 * rest, and nothing you locked ever moves.
 *
 * It also has to produce things that are genuinely usable, not screenshots of
 * things. The mark comes out as real SVG, the palette comes out as real CSS.
 * Someone should be able to leave with files they can hand to a developer.
 */

import { mulberry32, hashSeed } from "@/lib/generative";

export type Vibe = {
  energy: number; // quiet ............ loud
  temp: number; // cool ............. warm
  era: number; // classic .......... modern
};

export type Role = "bg" | "ink" | "a" | "b" | "muted";
export type Palette = Record<Role, string>;
export type Locks = Partial<Record<Role, string>>;

/* ---------------------------------------------------------------- colour -- */

function hsl(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

/** Relative luminance, so we can keep text legible on whatever we generate. */
export function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const p = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Hex back to HSL, so a colour someone picked by hand can still be varied. */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let sat = 0;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s: sat, l };
}

/**
 * Neighbours of a colour worth clicking.
 *
 * Rerolling is fun but blunt: it throws away the thing you were nearly happy
 * with. These are the small moves someone actually wants next, a bit lighter, a
 * bit richer, a step around the wheel, so a colour can be nudged instead of
 * gambled on.
 */
export function variants(hex: string, count = 12): string[] {
  const { h, s, l } = hexToHsl(hex);
  const moves: Array<[number, number, number]> = [
    [0, 0, 0.16], [0, 0, 0.08], [0, 0, -0.08], [0, 0, -0.16],
    [0, 0.18, 0], [0, -0.18, 0], [0, 0.32, 0.04], [0, -0.3, -0.02],
    [16, 0.04, 0], [-16, 0.04, 0], [34, 0, 0.03], [-34, 0, 0.03],
    [180, 0.05, 0], [120, 0.05, 0],
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const [dh, ds, dl] of moves) {
    const c = hsl(h + dh, Math.max(0, Math.min(1, s + ds)), Math.max(0.03, Math.min(0.97, l + dl)));
    if (c !== hex.toUpperCase() && !seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Build a palette from the sliders. The sliders genuinely drive it: pushing
 * energy up saturates and separates the accents, pushing era up moves from
 * neighbouring hues to opposing ones, temperature moves the whole base.
 */
export function makePalette(seed: number, vibe: Vibe, dark: boolean, locks: Locks = {}): Palette {
  const rand = mulberry32(seed);
  const e = vibe.energy / 100;
  const t = vibe.temp / 100;
  const m = vibe.era / 100;

  // Cool end sits in the blues, warm end in the oranges, with room to wander.
  const baseHue = (215 - t * 190 + (rand() - 0.5) * 44 + 360) % 360;

  // Classic keeps the second accent close by. Modern throws it across the wheel.
  const spread = 26 + m * 154;
  const dir = rand() > 0.5 ? 1 : -1;
  const hueB = baseHue + spread * dir;

  const sat = 0.3 + e * 0.62;
  const satB = Math.max(0.18, sat * (0.72 + rand() * 0.3));

  const bgL = dark ? 0.045 + rand() * 0.045 : 0.955 - rand() * 0.035;
  const inkL = dark ? 0.94 : 0.1;

  const out: Palette = {
    // A hint of the base hue in the neutrals is what stops a palette looking
    // like colour dropped onto grey.
    bg: hsl(baseHue, dark ? 0.24 : 0.16, bgL),
    ink: hsl(baseHue, dark ? 0.11 : 0.28, inkL),
    a: hsl(baseHue, sat, dark ? 0.56 + e * 0.08 : 0.44 - e * 0.06),
    b: hsl(hueB, satB, dark ? 0.64 + e * 0.06 : 0.5 - e * 0.05),
    muted: hsl(baseHue, 0.12 + e * 0.1, dark ? 0.46 : 0.52),
  };

  (Object.keys(locks) as Role[]).forEach((k) => {
    const v = locks[k];
    if (v) out[k] = v;
  });
  return out;
}

/* ------------------------------------------------------------------ mark -- */

export type Rendered = { defs: string; body: string };
export type Mark = { id: string; name: string; render: (p: Palette, initials: string) => Rendered };

/**
 * Marks are rendered, not drawn flat.
 *
 * Every one of these gets the same treatment a real logo gets: a metal or
 * pigment gradient rather than a single fill, a lit edge on the top and a dark
 * edge underneath so the shape reads as an object with thickness, a gloss pass
 * across the upper half, an outer glow in the second accent, and a fine grain
 * so it does not look like vector clip art. Flat geometry is what makes a
 * generated logo look generated.
 */

/** Shared lighting and surface definitions, tinted per palette. */
function surface(p: Palette, id: string): string {
  return `
    <linearGradient id="met${id}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="${p.ink}" stop-opacity="0.92"/>
      <stop offset="18%" stop-color="${p.a}"/>
      <stop offset="52%" stop-color="${p.a}" stop-opacity="0.72"/>
      <stop offset="72%" stop-color="${p.bg}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${p.a}"/>
    </linearGradient>
    <linearGradient id="met2${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${p.ink}" stop-opacity="0.85"/>
      <stop offset="30%" stop-color="${p.b}"/>
      <stop offset="70%" stop-color="${p.b}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${p.ink}" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="gloss${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.42"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.10"/>
      <stop offset="46%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="halo${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${p.b}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${p.b}" stop-opacity="0"/>
    </radialGradient>
    <filter id="lift${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.1" flood-color="#000" flood-opacity="0.55"/>
      <feDropShadow dx="0" dy="-0.7" stdDeviation="0.5" flood-color="#FFF" flood-opacity="0.30"/>
    </filter>
    <filter id="glow${id}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="grain${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="d"/>
      <feComposite in="d" in2="SourceGraphic" operator="in"/>
    </filter>`;
}

/** Grain laid over the whole mark, and the halo behind it. */
const halo = (id: string) => `<circle cx="50" cy="50" r="42" fill="url(#halo${id})"/>`;
const grain = (id: string) =>
  `<rect width="100" height="100" filter="url(#grain${id})" opacity="0.16" style="mix-blend-mode:overlay"/>`;

export const MARKS: Mark[] = [
  {
    id: "crest",
    name: "Crest",
    render: (p, i) => ({
      defs: surface(p, "crest"),
      body: `${halo("crest")}
      <g filter="url(#liftcrest)">
        <path d="M50 8 L88 23 V52 C88 74 68 87 50 93 C32 87 12 74 12 52 V23 Z" fill="url(#metcrest)"/>
        <path d="M50 15 L81 27 V52 C81 69 65 80 50 85 C35 80 19 69 19 52 V27 Z" fill="${p.bg}" opacity="0.94"/>
        <path d="M50 20 L76 30 V52 C76 66 64 75 50 80 C36 75 24 66 24 52 V30 Z" fill="none" stroke="url(#met2crest)" stroke-width="1.6"/>
      </g>
      <g filter="url(#glowcrest)">
        <text x="50" y="61" text-anchor="middle" font-family="Poppins, sans-serif" font-size="27" font-weight="700" fill="url(#met2crest)" letter-spacing="1">${i.slice(0, 3)}</text>
      </g>
      <path d="M50 8 L88 23 V40 C70 30 30 30 12 40 V23 Z" fill="url(#glosscrest)"/>
      ${grain("crest")}`,
    }),
  },
  {
    id: "chrome",
    name: "Chrome block",
    render: (p, i) => ({
      defs: surface(p, "chrome"),
      body: `${halo("chrome")}
      <g filter="url(#liftchrome)">
        <rect x="10" y="24" width="80" height="52" fill="url(#metchrome)"/>
        <rect x="14" y="28" width="72" height="44" fill="${p.bg}" opacity="0.9"/>
        <rect x="14" y="28" width="72" height="44" fill="none" stroke="url(#met2chrome)" stroke-width="1.4"/>
      </g>
      <g filter="url(#glowchrome)">
        <text x="50" y="60" text-anchor="middle" font-family="Poppins, sans-serif" font-size="26" font-weight="700" fill="url(#met2chrome)" letter-spacing="2">${i.slice(0, 3)}</text>
      </g>
      <rect x="10" y="24" width="80" height="26" fill="url(#glosschrome)"/>
      ${grain("chrome")}`,
    }),
  },
  {
    id: "flow",
    name: "Current",
    render: (p) => ({
      defs: surface(p, "flow"),
      body: `${halo("flow")}
      <g filter="url(#liftflow)">
        <path d="M10 70 C 32 24, 54 24, 70 50 C 80 66, 86 68, 92 62" fill="none" stroke="url(#metflow)" stroke-width="13" stroke-linecap="round"/>
        <path d="M10 84 C 32 40, 54 40, 70 66" fill="none" stroke="url(#met2flow)" stroke-width="8" stroke-linecap="round" opacity="0.9"/>
      </g>
      <path d="M10 66 C 32 22, 54 22, 70 46" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" opacity="0.4"/>
      ${grain("flow")}`,
    }),
  },
  {
    id: "prism",
    name: "Prism",
    render: (p) => ({
      defs: surface(p, "prism"),
      body: `${halo("prism")}
      <g filter="url(#liftprism)">
        <polygon points="50,10 90,78 10,78" fill="url(#metprism)"/>
        <polygon points="50,10 90,78 50,78" fill="url(#met2prism)" opacity="0.95"/>
        <polygon points="50,10 90,78 10,78" fill="none" stroke="${p.ink}" stroke-width="1.2" opacity="0.35"/>
      </g>
      <polygon points="50,10 72,48 28,48" fill="url(#glossprism)"/>
      ${grain("prism")}`,
    }),
  },
  {
    id: "orbit",
    name: "Orbit",
    render: (p) => ({
      defs: surface(p, "orbit"),
      body: `${halo("orbit")}
      <g filter="url(#liftorbit)">
        <circle cx="50" cy="50" r="31" fill="none" stroke="url(#metorbit)" stroke-width="9"/>
        <circle cx="50" cy="19" r="12" fill="url(#met2orbit)"/>
        <circle cx="77" cy="66" r="7.5" fill="${p.b}"/>
      </g>
      <circle cx="50" cy="50" r="35.5" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.28"/>
      <circle cx="46" cy="15" r="4" fill="#FFFFFF" opacity="0.5"/>
      ${grain("orbit")}`,
    }),
  },
  {
    id: "pulse",
    name: "Pulse",
    render: (p) => ({
      defs: surface(p, "pulse"),
      body: `${halo("pulse")}
      <g filter="url(#liftpulse)">
        <rect x="12" y="46" width="11" height="9" fill="${p.muted}"/>
        <rect x="29" y="28" width="11" height="44" fill="url(#metpulse)"/>
        <rect x="46" y="13" width="11" height="74" fill="url(#met2pulse)"/>
        <rect x="63" y="33" width="11" height="34" fill="url(#metpulse)"/>
        <rect x="80" y="46" width="9" height="9" fill="${p.muted}"/>
      </g>
      <rect x="12" y="13" width="77" height="30" fill="url(#glosspulse)"/>
      ${grain("pulse")}`,
    }),
  },
  {
    id: "monogram",
    name: "Monogram",
    render: (p, i) => ({
      defs: surface(p, "mono"),
      body: `${halo("mono")}
      <g filter="url(#liftmono)">
        <rect x="12" y="12" width="76" height="76" fill="url(#metmono)"/>
        <rect x="17" y="17" width="66" height="66" fill="none" stroke="${p.bg}" stroke-width="2" opacity="0.7"/>
      </g>
      <text x="50" y="66" text-anchor="middle" font-family="Poppins, sans-serif" font-size="40" font-weight="700" fill="${p.bg}">${i.slice(0, 2)}</text>
      <rect x="12" y="12" width="76" height="34" fill="url(#glossmono)"/>
      ${grain("mono")}`,
    }),
  },
  {
    id: "aperture",
    name: "Aperture",
    render: (p) => ({
      defs: surface(p, "ap"),
      body: `${halo("ap")}
      <g filter="url(#liftap)">
        <rect x="18" y="18" width="64" height="64" fill="none" stroke="url(#metap)" stroke-width="7"/>
        <rect x="33" y="33" width="34" height="34" fill="url(#met2ap)"/>
        <rect x="46" y="6" width="8" height="18" fill="${p.b}"/>
        <rect x="46" y="76" width="8" height="18" fill="${p.b}"/>
      </g>
      <rect x="33" y="33" width="34" height="16" fill="url(#glossap)"/>
      ${grain("ap")}`,
    }),
  },
];

/** A complete, standalone SVG file. This is what actually gets downloaded. */
export function markSVG(mark: Mark, p: Palette, initials: string, size = 512, bg = true): string {
  const r = mark.render(p, initials || "FZ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs>${r.defs}</defs>
${bg ? `  <rect width="100" height="100" fill="${p.bg}"/>` : ""}
${r.body}
</svg>`;
}

/* ------------------------------------------------------------------ name -- */

const HEADS = [
  "North", "Ember", "Atlas", "Fable", "Cobalt", "Wilder", "Lumen", "Orbit", "Field", "Ridge",
  "Harbor", "Iron", "Solace", "Vantage", "Aster", "Bramble", "Kite", "Mesa", "Onyx", "Rook",
];
const TAILS = [
  "works", "house", "studio", "supply", "collective", "lab", "co", "union", "craft", "goods",
  "society", "department", "practice", "yard", "club",
];

export function suggestNames(seed: number, count = 6): string[] {
  const rand = mulberry32(seed);
  const out = new Set<string>();
  let guard = 0;
  while (out.size < count && guard++ < 200) {
    const h = HEADS[Math.floor(rand() * HEADS.length)];
    const t = TAILS[Math.floor(rand() * TAILS.length)];
    out.add(rand() > 0.45 ? `${h}${t.charAt(0).toUpperCase()}${t.slice(1)}` : `${h} ${t}`);
  }
  return Array.from(out);
}

const LINES = [
  (n: string) => `${n}. Made properly.`,
  () => "Everything you need, nothing you do not.",
  () => "Built to be used, not admired.",
  (n: string) => `The honest way to ${n.toLowerCase()}.`,
  () => "Start it. We will keep it moving.",
  () => "Small studio. Real work.",
  () => "Less setup. More doing.",
  () => "For people who would rather it just worked.",
  () => "Quietly better than it needs to be.",
  () => "Everything in one place, finally.",
];

export function suggestLines(seed: number, name: string, count = 4): string[] {
  const rand = mulberry32(seed);
  const picked = new Set<string>();
  let guard = 0;
  while (picked.size < count && guard++ < 120) {
    picked.add(LINES[Math.floor(rand() * LINES.length)](name || "it"));
  }
  return Array.from(picked);
}

/* ------------------------------------------------------------------ type -- */

export type TypeSet = { id: string; name: string; display: string; body: string; note: string };

export const TYPESETS: TypeSet[] = [
  { id: "geo", name: "Geometric", display: "600", body: "300", note: "Modern, calm, gets out of the way." },
  { id: "bold", name: "Heavy", display: "700", body: "400", note: "Loud, confident, made to be seen small." },
  { id: "light", name: "Editorial", display: "500", body: "300", note: "Quiet and premium. Needs space around it." },
];

/* ----------------------------------------------------------------- export -- */

export function paletteCSS(p: Palette, name: string): string {
  const slug = (name || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brand";
  return `/* ${name || "Brand"} — generated at flowzone.dev/playground */
:root {
  --${slug}-bg: ${p.bg};
  --${slug}-ink: ${p.ink};
  --${slug}-accent: ${p.a};
  --${slug}-accent-2: ${p.b};
  --${slug}-muted: ${p.muted};
}
`;
}

/** How finished the identity is. Drives the meter, and it is honest about it. */
export function completeness(state: {
  name: string;
  line: string;
  touchedPalette: boolean;
  touchedMark: boolean;
  locks: number;
}): { pct: number; label: string; color: string } {
  let n = 0;
  if (state.name.trim()) n += 30;
  if (state.line.trim()) n += 20;
  if (state.touchedPalette) n += 20;
  if (state.touchedMark) n += 20;
  if (state.locks > 0) n += 10;
  const pct = Math.min(100, n);
  const tiers: Array<[number, string, string]> = [
    [100, "Ready to hand over", "#34D399"],
    [80, "Nearly there", "#FBBF24"],
    [50, "Taking shape", "#A78BFA"],
    [30, "A sketch", "#5B9BF9"],
    [0, "Blank canvas", "#647089"],
  ];
  const hit = tiers.find(([min]) => pct >= min) || tiers[tiers.length - 1];
  return { pct, label: hit[1], color: hit[2] };
}

export { hashSeed };

/* --------------------------------------------------------------- lockups -- */

/**
 * Logo templates, in the sense a designer means it: a composed lockup, not an
 * icon on its own.
 *
 * An icon is about a fifth of a logo. What people actually need is the mark,
 * the name and the line arranged with real spacing, real alignment and a real
 * type hierarchy, in the handful of layouts a brand genuinely uses: horizontal
 * for a site header, stacked for an avatar, a badge for a stamp, a wordmark for
 * when the icon is too small to survive.
 *
 * Each one returns a complete standalone SVG at its own proportions.
 */

export type Lockup = {
  id: string;
  name: string;
  note: string;
  w: number;
  h: number;
  build: (a: {
    mark: Mark;
    p: Palette;
    name: string;
    line: string;
    initials: string;
    display: string;
    body: string;
  }) => string;
};

const esc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT = "Poppins, Helvetica Neue, Helvetica, Arial, sans-serif";

/** Drops the 100x100 mark into a lockup at an arbitrary place and size. */
const place = (mark: Mark, p: Palette, initials: string, x: number, y: number, size: number) =>
  `<g transform="translate(${x} ${y}) scale(${size / 100})">${mark.render(p, initials).body}</g>`;

export const LOCKUPS: Lockup[] = [
  {
    id: "horizontal",
    name: "Horizontal",
    note: "The one your site header wants.",
    w: 520,
    h: 150,
    build: ({ mark, p, name, line, initials, display, body }) => `
      ${place(mark, p, initials, 24, 25, 100)}
      <text x="146" y="72" font-family="${FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="-0.8">${esc(name)}</text>
      ${line ? `<text x="148" y="99" font-family="${FONT}" font-size="15" font-weight="${body}" fill="${p.ink}" opacity="0.6">${esc(line)}</text>` : ""}`,
  },
  {
    id: "stacked",
    name: "Stacked",
    note: "Avatars, app icons, anything square.",
    w: 380,
    h: 380,
    build: ({ mark, p, name, line, initials, display, body }) => `
      ${place(mark, p, initials, 130, 58, 120)}
      <text x="190" y="238" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="-0.8">${esc(name)}</text>
      ${line ? `<text x="190" y="270" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="${body}" fill="${p.ink}" opacity="0.6">${esc(line)}</text>` : ""}
      <rect x="150" y="292" width="80" height="2" fill="${p.a}"/>`,
  },
  {
    id: "badge",
    name: "Badge",
    note: "A stamp. Good on packaging and merch.",
    w: 380,
    h: 380,
    build: ({ mark, p, name, initials, display }) => `
      <circle cx="190" cy="190" r="168" fill="none" stroke="${p.a}" stroke-width="3"/>
      <circle cx="190" cy="190" r="152" fill="none" stroke="${p.muted}" stroke-width="1"/>
      ${place(mark, p, initials, 135, 108, 110)}
      <text x="190" y="262" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="${display}" fill="${p.ink}" letter-spacing="1">${esc(name.toUpperCase())}</text>
      <rect x="160" y="278" width="60" height="2" fill="${p.b}"/>
      <text x="190" y="306" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="500" fill="${p.ink}" opacity="0.55" letter-spacing="4">EST. ${new Date().getFullYear()}</text>`,
  },
  {
    id: "wordmark",
    name: "Wordmark",
    note: "No icon. For when it has to survive being tiny.",
    w: 560,
    h: 150,
    build: ({ p, name, line, display, body }) => `
      <rect x="30" y="40" width="4" height="66" fill="${p.a}"/>
      <text x="54" y="80" font-family="${FONT}" font-size="46" font-weight="${display}" fill="${p.ink}" letter-spacing="-1">${esc(name)}</text>
      ${line ? `<text x="56" y="106" font-family="${FONT}" font-size="15" font-weight="${body}" fill="${p.ink}" opacity="0.6" letter-spacing="1">${esc(line)}</text>` : ""}`,
  },
  {
    id: "block",
    name: "Colour block",
    note: "Loud. Works on a shirt or a sticker.",
    w: 520,
    h: 190,
    build: ({ mark, p, name, line, initials, display, body }) => `
      <rect x="0" y="0" width="150" height="190" fill="${p.a}"/>
      ${place(mark, p, initials, 30, 45, 92)}
      <text x="182" y="86" font-family="${FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="-0.8">${esc(name)}</text>
      ${line ? `<text x="184" y="116" font-family="${FONT}" font-size="15" font-weight="${body}" fill="${p.ink}" opacity="0.6">${esc(line)}</text>` : ""}
      <rect x="182" y="134" width="46" height="3" fill="${p.b}"/>`,
  },
  {
    id: "framed",
    name: "Framed",
    note: "Formal. Certificates, letterheads, footers.",
    w: 480,
    h: 260,
    build: ({ mark, p, name, line, initials, display, body }) => `
      <rect x="16" y="16" width="448" height="228" fill="none" stroke="${p.muted}" stroke-width="2"/>
      <rect x="26" y="26" width="428" height="208" fill="none" stroke="${p.a}" stroke-width="1"/>
      ${place(mark, p, initials, 205, 52, 70)}
      <text x="240" y="164" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="${display}" fill="${p.ink}" letter-spacing="-0.5">${esc(name)}</text>
      ${line ? `<text x="240" y="192" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="${body}" fill="${p.ink}" opacity="0.6" letter-spacing="2">${esc(line.toUpperCase())}</text>` : ""}`,
  },
];

/** A finished, downloadable lockup file. */
export function lockupSVG(
  lockup: Lockup,
  mark: Mark,
  p: Palette,
  name: string,
  line: string,
  initials: string,
  display: string,
  body: string,
  bg = true
): string {
  const inner = lockup.build({
    mark,
    p,
    name: name.trim() || "Your Thing",
    line: line.trim(),
    initials: initials || "YT",
    display,
    body,
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lockup.w} ${lockup.h}" width="${lockup.w}" height="${lockup.h}">
  <defs>${mark.render(p, initials || "YT").defs}</defs>
${bg ? `  <rect width="${lockup.w}" height="${lockup.h}" fill="${p.bg}"/>` : ""}
${inner}
</svg>`;
}

/* ------------------------------------------------------------ icon marks -- */

import { ICONS, type Icon } from "@/lib/icons";

export { ICONS };
export type { Icon };

export type Container = { id: string; name: string };

export const CONTAINERS: Container[] = [
  { id: "bare", name: "Bare" },
  { id: "circle", name: "Circle" },
  { id: "block", name: "Block" },
  { id: "shield", name: "Shield" },
  { id: "ring", name: "Ring" },
  { id: "hex", name: "Hex" },
];

/**
 * Wraps a drawn icon in a container and lights it like an object.
 *
 * The container decides whether the icon is knocked out of a solid metal face
 * or drawn in metal on open ground, and the stroke colour follows from that, so
 * the mark stays legible instead of gradient-on-gradient mush.
 */
export function iconMark(icon: Icon, containerId: string): Mark {
  const uid = `i${icon.id.replace(/[^a-z0-9]/gi, "")}${containerId}`;
  const solid = containerId === "circle" || containerId === "block" || containerId === "hex";

  return {
    id: `${icon.id}:${containerId}`,
    name: icon.id.replace(/-/g, " "),
    render: (p: Palette) => {
      const strokeCol = solid ? p.bg : `url(#met${uid})`;
      const glyph = `<g transform="translate(29 29) scale(1.75)" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.d}</g>`;

      let shell = "";
      let gloss = "";
      if (containerId === "circle") {
        shell = `<circle cx="50" cy="50" r="40" fill="url(#met${uid})"/>`;
        gloss = `<path d="M10 50 A40 40 0 0 1 90 50 Z" fill="url(#gloss${uid})"/>`;
      } else if (containerId === "block") {
        shell = `<rect x="10" y="10" width="80" height="80" fill="url(#met${uid})"/>`;
        gloss = `<rect x="10" y="10" width="80" height="36" fill="url(#gloss${uid})"/>`;
      } else if (containerId === "hex") {
        shell = `<polygon points="50,7 87,28 87,72 50,93 13,72 13,28" fill="url(#met${uid})"/>`;
        gloss = `<polygon points="50,7 87,28 87,44 50,30 13,44 13,28" fill="url(#gloss${uid})"/>`;
      } else if (containerId === "shield") {
        shell = `<path d="M50 6 L90 22 V52 C90 75 69 89 50 95 C31 89 10 75 10 52 V22 Z" fill="url(#met${uid})"/>
                 <path d="M50 14 L82 27 V52 C82 70 65 82 50 87 C35 82 18 70 18 52 V27 Z" fill="${p.bg}" opacity="0.95"/>`;
        gloss = `<path d="M50 6 L90 22 V38 C70 28 30 28 10 38 V22 Z" fill="url(#gloss${uid})"/>`;
      } else if (containerId === "ring") {
        shell = `<circle cx="50" cy="50" r="41" fill="none" stroke="url(#met${uid})" stroke-width="6"/>`;
      }

      return {
        defs: surface(p, uid),
        body: `${halo(uid)}
          <g filter="url(#lift${uid})">${shell}${glyph}</g>
          ${gloss}
          ${grain(uid)}`,
      };
    },
  };
}

/** Search the library by name. Nobody scrolls two hundred icons. */
export function findIcons(q: string, limit = 60): Icon[] {
  const term = q.trim().toLowerCase();
  if (!term) return ICONS.slice(0, limit);
  const hits = ICONS.filter((i) => i.id.includes(term));
  return (hits.length ? hits : ICONS).slice(0, limit);
}
