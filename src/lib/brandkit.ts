/**
 * The generator behind the playground.
 *
 * Everything here is deterministic: the same idea and the same settings always
 * produce the same identity. That is what makes it a toy worth playing with
 * rather than a slot machine. You can lock a colour you like, keep rolling the
 * rest, and nothing you locked ever moves.
 *
 * It also has to produce things that are genuinely usable, not screenshots of
 * things. The mark comes out as real SVG, the palette comes out as real CSS.
 * Someone should be able to leave with files they can hand to a developer.
 *
 * The rule that shapes the whole file: nothing is picked off a list at random.
 * Names come from naming strategies applied to the words the visitor actually
 * typed. Colours come from one base hue and real relationships around the
 * wheel, then get measured for contrast before they are allowed out. Marks are
 * constructed on a grid from the seed. Random output is why generated brands
 * look generated.
 */

import { mulberry32, hashSeed } from "@/lib/generative";

export type Vibe = {
  energy: number; // quiet ............ loud
  temp: number; // cool ............. warm
  era: number; // classic .......... modern
};

export type Role = "bg" | "surface" | "ink" | "a" | "b" | "muted";
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
 * HSL lies about brightness. A yellow at fifty percent lightness is far
 * brighter than a blue at fifty percent lightness, so a palette built on raw
 * HSL numbers comes out with one accent screaming and the other sulking. This
 * caps saturation where the eye is most sensitive, and every colour that
 * carries text gets measured afterwards anyway.
 */
function capSat(h: number, s: number): number {
  const deg = ((h % 360) + 360) % 360;
  // Yellows and cyans go acidic fast. Blues and violets can take everything.
  const bright = Math.exp(-Math.pow((deg - 68) / 34, 2)) + 0.7 * Math.exp(-Math.pow((deg - 182) / 30, 2));
  return s * (1 - 0.32 * bright);
}

/**
 * Walk a colour's lightness away from a reference until it is actually
 * readable. Guessing lightness and hoping is how generators ship palettes
 * where the body text disappears on the background.
 */
function tune(h: number, s: number, ref: string, min: number, prefer: number): string {
  const away = luminance(ref) > 0.32 ? -1 : 1;
  const sat = capSat(h, s);
  let best = hsl(h, sat, prefer);
  if (contrast(best, ref) >= min) return best;
  for (let i = 1; i <= 70; i++) {
    const l = prefer + away * i * 0.014;
    if (l < 0.02 || l > 0.985) break;
    best = hsl(h, sat, l);
    if (contrast(best, ref) >= min) return best;
  }
  return best;
}

/**
 * A colour sitting exactly halfway between black and white cannot carry text
 * in either direction. Neither white nor black clears 4.5 on it, and that is
 * how generators end up handing people a button nobody can read. So an accent
 * that lands in that dead zone gets walked out of it, away from the background
 * first so the palette keeps its shape.
 */
function carryText(hex: string, bg: string, min = 4.5): string {
  const { h, s, l } = hexToHsl(hex);
  const textable = (c: string) =>
    Math.max(contrast(c, hsl(h, 0.16, 0.97)), contrast(c, hsl(h, 0.4, 0.08)));
  if (textable(hex) >= min) return hex;
  const away = luminance(bg) > 0.32 ? -1 : 1;
  for (const dir of [away, -away]) {
    for (let i = 1; i <= 45; i++) {
      const li = l + dir * i * 0.014;
      if (li < 0.04 || li > 0.96) break;
      const c = hsl(h, s, li);
      if (textable(c) >= min && contrast(c, bg) >= 3) return c;
    }
  }
  return hex;
}

/** The text colour that actually works on a given fill. Never a coin toss. */
export function readableOn(fill: string, palette?: Palette): string {
  const { h } = hexToHsl(fill);
  const candidates = [
    palette?.bg,
    palette?.ink,
    hsl(h, 0.16, 0.97),
    hsl(h, 0.4, 0.08),
  ].filter(Boolean) as string[];
  let best = candidates[0];
  let score = 0;
  for (const c of candidates) {
    const r = contrast(c, fill);
    if (r > score) {
      score = r;
      best = c;
    }
  }
  return best;
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

/* -------------------------------------------------------------- category -- */

/**
 * What kind of thing is this.
 *
 * Everything downstream hangs off this: the base hue, the words the names are
 * built from, the shape language of the mark, what is worth looking at for
 * reference. A bakery and a law firm should not come out of the same machine
 * looking like cousins.
 */
export type Category = {
  id: string;
  label: string;
  subject: string;
  hue: number;
  hueNote: string;
  round: boolean;
  keys: string[];
  nouns: string[];
  tails: string[];
  verbs: string[];
  borrowed: Array<{ word: string; gloss: string }>;
  refs: string[];
  icon: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food and drink",
    subject: "kitchen",
    hue: 24,
    hueNote: "crust and terracotta, the colour of the thing coming out of the oven",
    round: true,
    keys: ["bakery", "bake", "bread", "pastry", "patisserie", "cafe", "coffee", "roaster", "espresso", "tea", "kitchen", "food", "eat", "restaurant", "ramen", "pizza", "taco", "sushi", "deli", "butcher", "brunch", "supper", "chef", "menu", "bar", "brewery", "beer", "wine", "cocktail", "juice", "cake", "dessert", "truck", "diner", "grill", "catering"],
    nouns: ["Crumb", "Ember", "Hearth", "Salt", "Kettle", "Copper", "Rind", "Proof"],
    tails: ["House", "Kitchen", "Table", "Counter", "Bakehouse", "Provisions", "Larder", "Room"],
    verbs: ["Proof", "Rise", "Roast", "Pour", "Fold", "Feed", "Serve"],
    borrowed: [
      { word: "Levain", gloss: "french, the living starter that makes bread rise" },
      { word: "Forno", gloss: "italian, the oven" },
      { word: "Sobremesa", gloss: "spanish, the talk that keeps going after the meal" },
      { word: "Mesa", gloss: "spanish, the table" },
    ],
    refs: ["bakery interior", "coffee roaster", "fresh produce", "hand painted sign", "packaging design"],
    icon: "croissant",
  },
  {
    id: "shop",
    label: "A shop",
    subject: "shop",
    hue: 348,
    hueNote: "a retail red, the hue that pulls an eye across a street",
    round: false,
    keys: ["shop", "store", "boutique", "sneaker", "clothing", "clothes", "apparel", "shirt", "vintage", "thrift", "resale", "candle", "jewellery", "jewelry", "merch", "drop", "ceramics", "plant", "bookshop", "records", "print", "product", "goods", "market", "retail", "skate", "surf"],
    nouns: ["Shelf", "Crate", "Ribbon", "Stack", "Counter", "Rail", "Tag"],
    tails: ["Supply", "Goods", "Store", "Trading Co", "Stock", "Depot", "Shop"],
    verbs: ["Stock", "Carry", "Ship", "Trade", "Keep", "Drop"],
    borrowed: [
      { word: "Bodega", gloss: "spanish, the corner shop that has everything" },
      { word: "Mercato", gloss: "italian, the market" },
      { word: "Winkel", gloss: "dutch, the shop" },
      { word: "Bazaar", gloss: "persian, the covered market" },
    ],
    refs: ["retail store front", "packaging design", "enamel pin", "poster wall", "skate shop"],
    icon: "shopping-bag",
  },
  {
    id: "trade",
    label: "Trades and building",
    subject: "workshop",
    hue: 38,
    hueNote: "site amber, borrowed from every high visibility jacket on a job",
    round: false,
    keys: ["builder", "building", "build", "plumber", "plumbing", "electrician", "sparky", "roofing", "roofer", "joinery", "carpentry", "carpenter", "landscaping", "landscaper", "scaffolding", "tiling", "tiler", "painter", "decorator", "garage", "mechanic", "welding", "fabrication", "construction", "renovation", "handyman", "flooring", "glazing", "trade"],
    nouns: ["Anvil", "Rafter", "Plumb", "Grit", "Timber", "Iron", "Keystone"],
    tails: ["Works", "Trade Co", "Build", "Yard", "Craft", "Contracting", "Joinery"],
    verbs: ["Build", "Fix", "Frame", "Fit", "Level", "Rig", "Set"],
    borrowed: [
      { word: "Fabrica", gloss: "latin, the workshop where things get made" },
      { word: "Handwerk", gloss: "german, work done by hand" },
      { word: "Opus", gloss: "latin, the work itself" },
      { word: "Ambacht", gloss: "dutch, a trade learned properly" },
    ],
    refs: ["workshop tools", "brushed metal", "concrete wall", "wood grain", "hands making"],
    icon: "hammer",
  },
  {
    id: "studio",
    label: "Creative studio",
    subject: "studio",
    hue: 268,
    hueNote: "ink violet, the studio colour that reads modern without shouting",
    round: false,
    keys: ["design", "designer", "studio", "photography", "photo", "photographer", "film", "video", "music", "band", "writer", "writing", "illustration", "illustrator", "tattoo", "agency", "creative", "podcast", "art", "artist", "brand", "animation", "editor"],
    nouns: ["Ink", "Grain", "Frame", "Signal", "Plate", "Margin", "Index"],
    tails: ["Studio", "Practice", "Atelier", "Works", "Department", "Office"],
    verbs: ["Make", "Draft", "Frame", "Shape", "Cut", "Render"],
    borrowed: [
      { word: "Atelier", gloss: "french, the room the work happens in" },
      { word: "Bottega", gloss: "italian, a master's workshop with people learning in it" },
      { word: "Camera", gloss: "latin, the room, long before it meant the box" },
      { word: "Opera", gloss: "italian, the body of work" },
    ],
    refs: ["design studio", "poster wall", "letterpress", "vintage type", "high contrast"],
    icon: "pen-tool",
  },
  {
    id: "health",
    label: "Health and care",
    subject: "practice",
    hue: 158,
    hueNote: "a green that reads clean and calm without going clinical",
    round: true,
    keys: ["clinic", "therapy", "therapist", "dentist", "dental", "physio", "wellbeing", "wellness", "yoga", "pilates", "massage", "nutrition", "nutritionist", "midwife", "care", "counselling", "counseling", "mental", "health", "healing", "recovery", "doctor", "nurse", "skin", "salon", "spa", "barber", "hair", "beauty", "nails"],
    nouns: ["Willow", "Linden", "Balm", "Meadow", "Still", "Pulse", "Haven"],
    tails: ["Clinic", "Practice", "Rooms", "Care", "Method", "Collective"],
    verbs: ["Ease", "Mend", "Restore", "Steady", "Breathe", "Move"],
    borrowed: [
      { word: "Sana", gloss: "latin, healthy and whole" },
      { word: "Vita", gloss: "latin, life" },
      { word: "Otium", gloss: "latin, rest that actually restores you" },
      { word: "Kur", gloss: "german, a course of treatment you go away for" },
    ],
    refs: ["calm clinic interior", "linen fabric", "warm sunlight", "calm minimal", "marble"],
    icon: "leaf",
  },
  {
    id: "sport",
    label: "Sport and clubs",
    subject: "club",
    hue: 356,
    hueNote: "competition red, the hue every kit and crest keeps coming back to",
    round: false,
    keys: ["gym", "team", "club", "league", "coach", "coaching", "boxing", "running", "runner", "football", "soccer", "basketball", "climbing", "cycling", "martial", "fitness", "training", "athletics", "swim", "rugby", "tennis", "sport", "workout", "crossfit"],
    nouns: ["Ridge", "Summit", "Iron", "Rally", "Grit", "Sprint", "Vanguard"],
    tails: ["Club", "Athletic", "Union", "Academy", "Gym", "League"],
    verbs: ["Push", "Lift", "Sprint", "Train", "Chase", "Send"],
    borrowed: [
      { word: "Ludus", gloss: "latin, the school where fighters trained" },
      { word: "Agon", gloss: "greek, the contest itself" },
      { word: "Palestra", gloss: "greek, the yard you wrestled in" },
      { word: "Ultra", gloss: "latin, beyond" },
    ],
    refs: ["sports team crest", "high contrast", "brushed metal", "concrete wall", "moody dark"],
    icon: "trophy",
  },
  {
    id: "tech",
    label: "Tech and tools",
    subject: "product",
    hue: 205,
    hueNote: "an electric blue, the default of the category, so the shapes have to do the arguing",
    round: false,
    keys: ["app", "saas", "software", "platform", "ai", "data", "dev", "developer", "startup", "tool", "tools", "automation", "api", "cyber", "robotics", "hardware", "code", "coding", "web", "site", "website", "dashboard", "analytics", "crm", "tech", "technical"],
    nouns: ["Vector", "Beacon", "Lattice", "Relay", "Pilot", "Circuit", "Vertex"],
    tails: ["Labs", "Systems", "Stack", "Works", "Engine", "Layer"],
    verbs: ["Ship", "Run", "Scale", "Route", "Sync", "Deploy"],
    borrowed: [
      { word: "Nexus", gloss: "latin, the point where things bind together" },
      { word: "Ratio", gloss: "latin, reckoning, the root of the word rational" },
      { word: "Axiom", gloss: "greek, the thing taken as true before anything else" },
      { word: "Kairos", gloss: "greek, the right moment to act" },
    ],
    refs: ["modern office", "abstract texture", "neon light", "high contrast", "brushed metal"],
    icon: "zap",
  },
  {
    id: "home",
    label: "Home and property",
    subject: "service",
    hue: 168,
    hueNote: "a sage teal, domestic and calm, and rare enough in the category to stand out",
    round: true,
    keys: ["cleaning", "cleaner", "lettings", "estate", "interiors", "interior", "moving", "removals", "gardening", "gardener", "property", "rental", "airbnb", "storage", "furniture", "decor", "house", "home", "houses", "landlord", "tenant", "mortgage"],
    nouns: ["Hearth", "Threshold", "Keystone", "Brick", "Alcove", "Porch", "Lintel"],
    tails: ["Property", "Interiors", "Services", "Care", "Keeping", "Co"],
    verbs: ["Settle", "Tidy", "Keep", "Nest", "Restore", "Move"],
    borrowed: [
      { word: "Casa", gloss: "spanish, the house" },
      { word: "Domus", gloss: "latin, the household, not just the building" },
      { word: "Hem", gloss: "swedish, home" },
      { word: "Herd", gloss: "german, the hearth at the middle of a house" },
    ],
    refs: ["interior architecture", "linen fabric", "warm sunlight", "wood grain", "calm minimal"],
    icon: "home",
  },
  {
    id: "pets",
    label: "Pets and animals",
    subject: "pet service",
    hue: 92,
    hueNote: "a grass green, outdoors and friendly, which is where this work happens",
    round: true,
    keys: ["dog", "dogs", "cat", "cats", "pet", "pets", "grooming", "groomer", "vet", "veterinary", "walker", "walking", "kennel", "aquarium", "horse", "stable", "puppy", "animal", "animals", "boarding"],
    nouns: ["Paw", "Bramble", "Whistle", "Biscuit", "Rover", "Fetch", "Clover"],
    tails: ["Pet Co", "Grooming", "Kennel", "Care", "Companion", "Club"],
    verbs: ["Fetch", "Walk", "Groom", "Roam", "Trot", "Wag"],
    borrowed: [
      { word: "Fauna", gloss: "latin, the animals a place belongs to" },
      { word: "Cane", gloss: "italian, dog" },
      { word: "Hond", gloss: "dutch, dog" },
      { word: "Amico", gloss: "italian, friend" },
    ],
    refs: ["dog grooming", "warm sunlight", "fresh produce", "hand painted sign", "nostalgic film photo"],
    icon: "paw-print",
  },
  {
    id: "events",
    label: "Events and nights",
    subject: "night",
    hue: 286,
    hueNote: "nightlife violet, which is what a room looks like once the lights come up",
    round: false,
    keys: ["event", "events", "wedding", "weddings", "venue", "promoter", "festival", "party", "night", "nights", "dj", "conference", "gig", "concert", "rave", "supperclub", "popup", "exhibition", "tour"],
    nouns: ["Marquee", "Encore", "Lantern", "Rally", "Vinyl", "Spark", "Foyer"],
    tails: ["Events", "Nights", "Presents", "Collective", "Productions", "Rooms"],
    verbs: ["Gather", "Host", "Stage", "Open", "Draw"],
    borrowed: [
      { word: "Fiesta", gloss: "spanish, the party everyone is invited to" },
      { word: "Ceilidh", gloss: "gaelic, a gathering with music in it" },
      { word: "Sagra", gloss: "italian, a village festival built around food" },
      { word: "Fete", gloss: "french, the celebration" },
    ],
    refs: ["concert lighting", "neon light", "poster wall", "moody dark", "high contrast"],
    icon: "ticket",
  },
  {
    id: "money",
    label: "Money and advice",
    subject: "practice",
    hue: 228,
    hueNote: "navy, because this category is sold on looking like it will still be here in ten years",
    round: false,
    keys: ["bookkeeping", "bookkeeper", "accounting", "accountant", "legal", "law", "lawyer", "solicitor", "insurance", "consulting", "consultant", "finance", "financial", "tax", "advice", "adviser", "advisor", "recruitment", "hr", "payroll", "audit", "invest", "wealth"],
    nouns: ["Ledger", "Compass", "Keystone", "Tally", "Anchor", "Plumb", "Meridian"],
    tails: ["Partners", "Advisory", "Group", "Practice", "Associates", "Ledger"],
    verbs: ["Balance", "Count", "Settle", "Clear", "Advise", "Reckon"],
    borrowed: [
      { word: "Fiducia", gloss: "latin, trust, and the root of fiduciary" },
      { word: "Conto", gloss: "italian, the account" },
      { word: "Aequus", gloss: "latin, level and fair" },
      { word: "Bilan", gloss: "french, the balance you strike at the end" },
    ],
    refs: ["architecture columns", "marble", "paper texture", "calm minimal", "modern office"],
    icon: "landmark",
  },
  {
    id: "open",
    label: "Something else",
    subject: "thing",
    hue: 250,
    hueNote: "a wide open blue violet, with no category baggage on it yet",
    round: false,
    keys: [],
    nouns: ["North", "Ember", "Atlas", "Kite", "Mesa", "Field", "Harbour"],
    tails: ["Studio", "Works", "Co", "Collective", "Union", "Supply"],
    verbs: ["Start", "Make", "Move", "Build", "Go"],
    borrowed: [
      { word: "Terra", gloss: "latin, the ground you stand on" },
      { word: "Novo", gloss: "latin, new" },
      { word: "Kairos", gloss: "greek, the right moment to act" },
      { word: "Alba", gloss: "italian, first light" },
    ],
    refs: ["abstract texture", "calm minimal", "warm sunlight", "paper texture", "high contrast"],
    icon: "sparkles",
  },
];

const STOP = new Set([
  "a", "an", "the", "for", "and", "or", "but", "of", "to", "in", "on", "at", "by", "with",
  "that", "this", "those", "these", "my", "our", "your", "their", "his", "her", "its",
  "i", "we", "you", "they", "it", "is", "are", "am", "be", "been", "being", "was", "were",
  "want", "wants", "wanted", "make", "making", "start", "starting", "started", "run", "running",
  "people", "person", "someone", "everyone", "who", "what", "where", "when", "why", "how",
  "some", "any", "really", "just", "very", "so", "like", "would", "could", "should", "will",
  "business", "company", "idea", "thing", "things", "new", "own", "little", "own",
  "from", "into", "about", "up", "down", "out", "over", "under", "more", "most",
]);

/** The words the visitor actually gave us, in the order they gave them. */
export function ideaWords(idea: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of idea.toLowerCase().split(/[^a-z']+/)) {
    const w = raw.replace(/'/g, "");
    if (w.length < 3 || STOP.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

/** Which category the idea belongs to, by weight of evidence, not first hit. */
export function classify(idea: string): Category {
  const words = idea.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  let best = CATEGORIES[CATEGORIES.length - 1];
  let score = 0;
  for (const cat of CATEGORIES) {
    let n = 0;
    for (const w of words) {
      for (const k of cat.keys) {
        if (w === k) n += 3;
        else if (w.length > 3 && (w.startsWith(k) || k.startsWith(w))) n += 2;
      }
    }
    if (n > score) {
      score = n;
      best = cat;
    }
  }
  return best;
}

export function categoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

/* --------------------------------------------------------------- palette -- */

export type PalettePlan = {
  base: number;
  hueA: number;
  hueB: number;
  relation: string;
  why: string;
};

const RELATIONS: Array<{ name: string; d: number; why: string }> = [
  { name: "analogous", d: 30, why: "two hues sitting next to each other. quiet, harmonious, hard to get wrong." },
  { name: "split complementary", d: 152, why: "an accent and the two hues either side of its opposite. the tension of a complementary pair without the vibration." },
  { name: "complementary", d: 180, why: "straight across the wheel. maximum separation, so the second colour never gets lost in the first." },
  { name: "triadic", d: 120, why: "an even third of the wheel away. bold, and it still balances because the spacing is even." },
];

/** Shortest way round the wheel, so the temperature slider never spins. */
function toward(h: number, target: number, amount: number): number {
  let d = ((target - h + 540) % 360) - 180;
  return (h + d * amount + 360) % 360;
}

/**
 * The plan behind a palette, so the UI can say what it did.
 *
 * A base hue from the category, then a real relationship chosen by the era
 * slider: classic stays close and analogous, modern throws the second accent
 * across the wheel.
 */
export function palettePlan(seed: number, vibe: Vibe, opts: { hue?: number } = {}): PalettePlan {
  const rand = mulberry32(seed >>> 0);
  const t = vibe.temp / 100;
  const m = vibe.era / 100;
  const start = opts.hue ?? 250;

  // Temperature pulls the category hue toward the warm end or the cool end,
  // but never all the way, because a bakery should still look like a bakery.
  const warmed = toward(start, t > 0.5 ? 30 : 212, Math.abs(t - 0.5) * 2 * 0.42);
  const base = (warmed + (rand() - 0.5) * 16 + 360) % 360;

  const idx = m < 0.28 ? 0 : m < 0.55 ? (rand() < 0.6 ? 0 : 1) : m < 0.8 ? 1 : rand() < 0.5 ? 2 : 3;
  const rel = RELATIONS[idx];
  const dir = rand() > 0.5 ? 1 : -1;

  return {
    base,
    hueA: base,
    hueB: (base + rel.d * dir + 360) % 360,
    relation: rel.name,
    why: rel.why,
  };
}

/**
 * Build a palette from one base hue and measured contrast.
 *
 * Six roles, because five is not enough to build anything real: a page, a
 * raised surface on top of it, text, quiet text, and two accents. Every colour
 * that has to carry words gets walked until it passes, so nothing generated
 * here can hand somebody unreadable text.
 */
export function makePalette(
  seed: number,
  vibe: Vibe,
  dark: boolean,
  locks: Locks = {},
  opts: { hue?: number } = {}
): Palette {
  const rand = mulberry32((seed >>> 0) + 9);
  const e = vibe.energy / 100;
  const plan = palettePlan(seed, vibe, opts);

  const sat = 0.34 + e * 0.5;
  const satB = Math.max(0.24, sat * (0.78 + rand() * 0.26));

  // A hint of the base hue in the neutrals is what stops a palette looking
  // like colour dropped onto grey.
  const bgL = dark ? 0.062 + rand() * 0.02 : 0.972 - rand() * 0.018;
  const bg = hsl(plan.base, dark ? 0.26 : 0.1, bgL);
  const surface = hsl(plan.base, dark ? 0.24 : 0.12, dark ? bgL + 0.055 : bgL - 0.045);

  const out: Palette = {
    bg,
    surface,
    ink: tune(plan.base, dark ? 0.14 : 0.3, bg, 11, dark ? 0.95 : 0.11),
    muted: tune(plan.base, 0.16 + e * 0.12, bg, 4.6, dark ? 0.66 : 0.42),
    a: carryText(tune(plan.hueA, sat, bg, 4.5, dark ? 0.62 : 0.46), bg),
    b: carryText(tune(plan.hueB, satB, bg, 3.4, dark ? 0.7 : 0.5), bg),
  };

  (Object.keys(locks) as Role[]).forEach((k) => {
    const v = locks[k];
    if (v) out[k] = v;
  });
  return out;
}

export type ContrastCheck = { label: string; ratio: number; need: number; pass: boolean; fg: string; bg: string };

/** The honest report. Every pair somebody will actually build with. */
export function paletteReport(p: Palette): ContrastCheck[] {
  const rows: Array<[string, string, string, number]> = [
    ["text on background", p.ink, p.bg, 4.5],
    ["quiet text on background", p.muted, p.bg, 4.5],
    ["text on surface", p.ink, p.surface, 4.5],
    ["accent on background", p.a, p.bg, 4.5],
    ["text on accent button", readableOn(p.a, p), p.a, 4.5],
    ["text on second button", readableOn(p.b, p), p.b, 4.5],
  ];
  return rows.map(([label, fg, bg, need]) => {
    const ratio = contrast(fg, bg);
    return { label, fg, bg, need, ratio: Math.round(ratio * 10) / 10, pass: ratio >= need };
  });
}

/* ------------------------------------------------------------------ mark -- */

export type Rendered = { defs: string; body: string };
export type Mark = { id: string; name: string; note?: string; render: (p: Palette, initials: string) => Rendered };

/**
 * Marks are constructed, not decorated.
 *
 * Everything below is drawn on the same hundred unit grid with the same safe
 * margin and the same stroke weight, in flat colour. That is deliberate. A
 * logo has to survive as one silhouette at forty pixels, so gloss and grain
 * and a drop shadow are not craft, they are a costume over a shape that does
 * not work. Get the silhouette right and it needs none of it.
 */

const f = (n: number) => Number(n.toFixed(2));
const pol = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(((deg - 90) * Math.PI) / 180),
  cy + r * Math.sin(((deg - 90) * Math.PI) / 180),
];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pol(cx, cy, r, a0);
  const [x1, y1] = pol(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${large} ${sweep} ${f(x1)} ${f(y1)}`;
};

const MARK_FONT = "Poppins, Helvetica Neue, Helvetica, Arial, sans-serif";

/** Letters in a mark are set once, properly, and reused everywhere. */
const letters = (t: string, x: number, y: number, size: number, fill: string, weight = 600, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${MARK_FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="${f(size * -0.03)}" fill="${fill}">${esc(t)}</text>`;

/* The eight originals, redrawn flat. Same ids, so saved work still resolves. */
export const MARKS: Mark[] = [
  {
    id: "crest",
    name: "Crest",
    render: (p, i) => ({
      defs: "",
      body: `<path d="M50 8 L88 24 V54 C88 75 69 88 50 94 C31 88 12 75 12 54 V24 Z" fill="${p.a}"/>
      <path d="M50 18 L79 30 V54 C79 69 65 79 50 84 C35 79 21 69 21 54 V30 Z" fill="${p.bg}"/>
      ${letters(i.slice(0, 3), 50, 62, 24, p.a, 700)}`,
    }),
  },
  {
    id: "chrome",
    name: "Block",
    render: (p, i) => ({
      defs: "",
      body: `<rect x="10" y="24" width="80" height="52" fill="${p.a}"/>
      <rect x="16" y="30" width="68" height="40" fill="${p.bg}"/>
      ${letters(i.slice(0, 3), 50, 60, 22, p.a, 700)}`,
    }),
  },
  {
    id: "flow",
    name: "Current",
    render: (p) => ({
      defs: "",
      body: `<path d="M12 68 C 32 26, 54 26, 70 50 C 79 64, 84 66, 90 60" fill="none" stroke="${p.a}" stroke-width="12" stroke-linecap="round"/>
      <path d="M12 84 C 32 44, 54 44, 68 66" fill="none" stroke="${p.b}" stroke-width="8" stroke-linecap="round"/>`,
    }),
  },
  {
    id: "prism",
    name: "Prism",
    render: (p) => ({
      defs: "",
      body: `<polygon points="50,10 90,78 10,78" fill="${p.a}"/>
      <polygon points="50,10 90,78 50,78" fill="${p.b}"/>`,
    }),
  },
  {
    id: "orbit",
    name: "Orbit",
    render: (p) => ({
      defs: "",
      body: `<circle cx="50" cy="50" r="31" fill="none" stroke="${p.a}" stroke-width="9"/>
      <circle cx="50" cy="19" r="11" fill="${p.b}"/>`,
    }),
  },
  {
    id: "pulse",
    name: "Pulse",
    render: (p) => ({
      defs: "",
      body: `<rect x="14" y="46" width="10" height="9" rx="2" fill="${p.muted}"/>
      <rect x="30" y="30" width="10" height="41" rx="2" fill="${p.a}"/>
      <rect x="46" y="15" width="10" height="71" rx="2" fill="${p.b}"/>
      <rect x="62" y="35" width="10" height="31" rx="2" fill="${p.a}"/>
      <rect x="78" y="46" width="10" height="9" rx="2" fill="${p.muted}"/>`,
    }),
  },
  {
    id: "monogram",
    name: "Monogram",
    render: (p, i) => ({
      defs: "",
      body: `<rect x="12" y="12" width="76" height="76" fill="${p.a}"/>
      ${letters(i.slice(0, 2), 50, 66, 40, readableOn(p.a, p), 600)}`,
    }),
  },
  {
    id: "aperture",
    name: "Aperture",
    render: (p) => ({
      defs: "",
      body: `<rect x="18" y="18" width="64" height="64" fill="none" stroke="${p.a}" stroke-width="8"/>
      <rect x="34" y="34" width="32" height="32" fill="${p.b}"/>`,
    }),
  },
];

export type MarkSystem = { id: string; name: string; note: string };

/**
 * The parametric systems.
 *
 * Each one is a rule rather than a drawing: how many arcs, how tall the bars,
 * which cells of the grid are filled, where the satellite sits. The seed picks
 * the numbers, the category picks the shape language, round for anything that
 * touches people and animals, square for anything that builds or counts. Roll
 * again and you get a different member of the same family, not a different
 * family.
 */
export function generatedMarks(seed: number, initials: string, category: Category): Mark[] {
  const rand = mulberry32((seed >>> 0) + 77);
  const round = category.round;
  const cap = round ? "round" : "butt";
  const r = round ? 12 : 0; // corner radius on the containers
  const w = 8 + Math.floor(rand() * 4); // one stroke weight, used by everything
  const spin = Math.floor(rand() * 8) * 45; // where the open side faces
  const arcs = 2 + Math.floor(rand() * 3);
  const bars = 4 + Math.floor(rand() * 3);
  const cells = 3 + Math.floor(rand() * 2);
  const mask = Array.from({ length: cells * cells }, () => rand() > 0.42);
  const hero = Math.floor(rand() * cells * cells);
  const ini = (initials || "FZ").slice(0, 2);

  const out: Mark[] = [
    {
      id: "gen-monogram",
      name: "Monogram, solid",
      note: "the initials knocked out of a solid face. reads at any size, prints in one colour.",
      render: (p, i) => ({
        defs: "",
        body: `<rect x="8" y="8" width="84" height="84" rx="${r}" fill="${p.a}"/>
        ${letters((i || ini).slice(0, 2), 50, 66, 38, readableOn(p.a, p), 600)}`,
      }),
    },
    {
      id: "gen-mono-rule",
      name: "Monogram, ruled",
      note: "initials over a rule in the second colour. the calmest thing here, and the hardest to date.",
      render: (p, i) => ({
        defs: "",
        body: `${letters((i || ini).slice(0, 3), 50, 58, 34, p.ink, 600)}
        <rect x="24" y="70" width="52" height="${f(w * 0.6)}" rx="${round ? f(w * 0.3) : 0}" fill="${p.a}"/>
        <rect x="24" y="70" width="17" height="${f(w * 0.6)}" rx="${round ? f(w * 0.3) : 0}" fill="${p.b}"/>`,
      }),
    },
    {
      id: "gen-counter",
      name: "Monogram, counter",
      note: "one letter cut out of a disc. the counter shape does the work, which is why it survives being tiny.",
      render: (p, i) => ({
        defs: "",
        body: `<circle cx="50" cy="50" r="40" fill="${p.a}"/>
        ${letters((i || ini).slice(0, 1), 50, 68, 52, readableOn(p.a, p), 700)}
        <path d="${arc(50, 50, 40, spin, spin + 62)}" fill="none" stroke="${p.b}" stroke-width="${w}" stroke-linecap="${cap}"/>`,
      }),
    },
    {
      id: "gen-arcs",
      name: "Arcs",
      note: `${arcs} arcs on one centre, opening at ${spin} degrees. movement without drawing an arrow.`,
      render: (p) => ({
        defs: "",
        body: Array.from({ length: arcs }, (_, k) => {
          const rad = 38 - k * (w + 4);
          if (rad < w) return "";
          const sweep = 230 - k * 22;
          return `<path d="${arc(50, 50, rad, spin, spin + sweep)}" fill="none" stroke="${k % 2 ? p.b : p.a}" stroke-width="${w}" stroke-linecap="${cap}"/>`;
        }).join("\n        "),
      }),
    },
    {
      id: "gen-bars",
      name: "Bars",
      note: `${bars} bars on one baseline. a rhythm, and it stays legible in a favicon.`,
      render: (p) => {
        const gap = 76 / bars;
        return {
          defs: "",
          body: Array.from({ length: bars }, (_, k) => {
            const h = 20 + Math.round(Math.abs(Math.sin((k + 1) * (spin + 30))) * 52);
            const x = 12 + k * gap;
            return `<rect x="${f(x)}" y="${f(84 - h)}" width="${f(gap * 0.62)}" height="${h}" rx="${round ? f(gap * 0.31) : 0}" fill="${k === bars - 2 ? p.b : p.a}"/>`;
          }).join("\n        "),
        };
      },
    },
    {
      id: "gen-grid",
      name: "Grid",
      note: `a ${cells} by ${cells} field with one cell picked out. systematic, and it tiles into patterns for free.`,
      render: (p) => {
        const step = 76 / cells;
        const size = step * 0.62;
        const cellsOut: string[] = [];
        for (let y = 0; y < cells; y++) {
          for (let x = 0; x < cells; x++) {
            const on = mask[y * cells + x];
            const cx = 12 + x * step + step / 2;
            const cy = 12 + y * step + step / 2;
            const fill = on ? p.a : p.muted;
            cellsOut.push(
              round
                ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(size / 2)}" fill="${fill}"/>`
                : `<rect x="${f(cx - size / 2)}" y="${f(cy - size / 2)}" width="${f(size)}" height="${f(size)}" fill="${fill}"/>`
            );
          }
        }
        const hx = 12 + (hero % cells) * step + step / 2;
        const hy = 12 + Math.floor(hero / cells) * step + step / 2;
        cellsOut.push(
          round
            ? `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(size / 2)}" fill="${p.b}"/>`
            : `<rect x="${f(hx - size / 2)}" y="${f(hy - size / 2)}" width="${f(size)}" height="${f(size)}" fill="${p.b}"/>`
        );
        return { defs: "", body: cellsOut.join("\n        ") };
      },
    },
    {
      id: "gen-lens",
      name: "Lens",
      note: "two arcs meeting. organic, and the shape between them is as considered as the strokes.",
      render: (p) => ({
        defs: "",
        body: `<path d="M50 12 A 46 46 0 0 1 50 88 A 46 46 0 0 1 50 12 Z" fill="${p.a}"/>
        <path d="M50 26 A 30 30 0 0 1 50 74 A 30 30 0 0 1 50 26 Z" fill="${p.bg}"/>
        <circle cx="50" cy="50" r="${f(w * 0.9)}" fill="${p.b}"/>`,
      }),
    },
    {
      id: "gen-notch",
      name: "Notch",
      note: "a square with a quarter taken out. one decision, held all the way through.",
      render: (p) => ({
        defs: "",
        body: `<path d="M12 12 H62 V38 H88 V88 H12 Z" fill="${p.a}"/>
        <rect x="62" y="12" width="26" height="26" fill="${p.b}"/>`,
      }),
    },
    {
      id: "gen-orbit",
      name: "Orbit",
      note: `a ring with the satellite at ${spin} degrees. the angle is yours, from your seed.`,
      render: (p) => {
        const [sx, sy] = pol(50, 50, 34, spin);
        return {
          defs: "",
          body: `<circle cx="50" cy="50" r="34" fill="none" stroke="${p.a}" stroke-width="${w}"/>
        <circle cx="${f(sx)}" cy="${f(sy)}" r="${f(w * 1.3)}" fill="${p.b}"/>`,
        };
      },
    },
    {
      id: "gen-chevron",
      name: "Chevron",
      note: "nested chevrons, one weight, one angle. direction, and nobody has to be told what it means.",
      render: (p) => ({
        defs: "",
        body: Array.from({ length: 3 }, (_, k) => {
          const off = k * (w + 5);
          return `<path d="M${20 + off} 26 L${50 + off} 50 L${20 + off} 74" fill="none" stroke="${k === 1 ? p.b : p.a}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="${round ? "round" : "miter"}"/>`;
        }).join("\n        "),
      }),
    },
  ];

  // Round categories get the soft systems first, square ones get the built
  // ones. Nobody scrolls to find the one that suits them.
  const order = round
    ? ["gen-counter", "gen-lens", "gen-arcs", "gen-orbit", "gen-monogram", "gen-grid", "gen-bars", "gen-mono-rule", "gen-chevron", "gen-notch"]
    : ["gen-monogram", "gen-notch", "gen-grid", "gen-bars", "gen-mono-rule", "gen-chevron", "gen-arcs", "gen-counter", "gen-orbit", "gen-lens"];
  return out.slice().sort((x, y) => order.indexOf(x.id) - order.indexOf(y.id));
}

/** A complete, standalone SVG file. This is what actually gets downloaded. */
export function markSVG(mark: Mark, p: Palette, initials: string, size = 512, bg = true): string {
  const r = mark.render(p, initials || "FZ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
${r.defs ? `  <defs>${r.defs}</defs>\n` : ""}${bg ? `  <rect width="100" height="100" fill="${p.bg}"/>\n` : ""}${r.body}
</svg>`;
}

/* ------------------------------------------------------------------ name -- */

export type NameIdea = { name: string; strategy: string; why: string };

const PLACES = ["Lane", "Row", "Yard", "Quarter", "Corner", "Market", "Bridge", "Common", "Wharf", "Hill", "Green", "Mill", "Cross", "Post"];
const SURNAME = ["well", "stead", "bury", "field", "ridge", "ton", "low", "combe", "ford", "gate", "more"];
const FIRMS = ["& Co", "& Sons", "& Daughters", "& Partners", "Bros"];
const ADVERBS = ["Daily", "Twice", "Slow", "Early", "Late", "Proper", "Often"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const title = (s: string) => s.split(/\s+/).map(cap).join(" ");

/**
 * Words that are technically theirs but carry nothing. A name built on "busy"
 * or "app" is a name built on nothing, so these never get to be the anchor.
 */
const WEAK = new Set([
  "busy", "late", "best", "local", "small", "big", "new", "quick", "fast", "cheap", "good",
  "great", "nice", "cool", "proper", "real", "simple", "easy", "modern", "app", "site",
  "website", "service", "services", "brand", "customer", "customers", "client", "clients",
  "owner", "owners", "everyone", "anybody", "everybody", "stuff", "kind", "sort", "place",
]);

/** Trim a word back to the part a name can be built on. */
function stem(w: string): string {
  let s = w;
  if (s.length > 4 && s.endsWith("ies")) s = s.slice(0, -3) + "y";
  else if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("es")) s = s.slice(0, -2);
  else if (s.length > 4 && s.endsWith("s") && s[s.length - 2] !== "s") s = s.slice(0, -1);
  if (s.length > 4 && s.endsWith("y")) s = s.slice(0, -1);
  return s;
}

/**
 * Two words pushed into one, sharing a letter where they can.
 *
 * Only when the result is short enough to say. Two long words jammed together
 * is not a name, it is a domain nobody types twice.
 */
function blend(a: string, b: string): string {
  if (!a || !b || a.length > 7 || b.length > 7) return "";
  const x = stem(a);
  const joined = x[x.length - 1] === b[0] ? x + b.slice(1) : x + b;
  return joined.length > 12 ? "" : cap(joined);
}

/**
 * Names, from strategies rather than mad libs.
 *
 * Six real approaches a naming studio would actually run, applied to the words
 * the visitor typed. The reasoning comes back with each one, because the choice
 * is the valuable part and a bare list teaches nobody anything.
 */
export function nameIdeas(idea: string, seed: number, count = 6, cat?: Category): NameIdea[] {
  const category = cat || classify(idea);
  const rand = mulberry32((seed >>> 0) + 3);
  const pick = <T,>(arr: T[], k = 0): T => arr[(Math.floor(rand() * arr.length) + k) % arr.length];

  const typed = ideaWords(idea);
  const keyish = new Set(category.keys);
  // The words that are theirs rather than the category's are the good ones.
  // "a bakery people cross town for" is worth more as cross and town than as
  // bakery, because bakery is what everyone in the category would have said.
  const own = typed.filter((w) => !keyish.has(w) && !WEAK.has(w));
  const anchor = own[0] || typed.find((w) => !WEAK.has(w)) || "";
  const second = own[1] || "";
  const noun = pick(category.nouns);
  const tail = pick(category.tails);
  const verb = pick(category.verbs);
  const borrowed = pick(category.borrowed);
  const place = pick(PLACES);

  const made: NameIdea[] = [];
  const push = (name: string, strategy: string, why: string) => {
    const clean = name.replace(/\s+/g, " ").trim();
    if (!clean || clean.length > 22) return;
    if (made.some((m) => m.name.toLowerCase() === clean.toLowerCase())) return;
    made.push({ name: clean, strategy, why });
  };

  // 1. Blend. Two of their words pushed together, which is where the best of
  // these come from when somebody has typed something with texture in it.
  const blended = blend(anchor, second);
  if (blended) {
    push(
      blended,
      "blend",
      `your words "${anchor}" and "${second}" pushed into one. it is unmistakably yours and nobody has to spell it twice.`
    );
  }

  // 2. One strong noun. Concrete, short, and it never describes the product.
  push(
    own.length && own[0].length <= 7 ? title(own[0]) : noun,
    "one noun",
    own.length && own[0].length <= 7
      ? `the most concrete word you typed, on its own. one syllable more than that and it stops being memorable.`
      : `one concrete noun from the world of a ${category.subject}. it suggests the thing without naming it, so you can sell something else next year.`
  );

  // 3. Compound. The workhorse, and the safest thing on this list.
  const head = blended || (anchor ? title(stem(anchor)) : noun);
  push(
    `${head} ${tail}`,
    "compound",
    `${anchor ? `your word "${anchor}"` : `a ${category.subject} word`} plus a word about the work. says the job without spelling out the product.`
  );

  // 4. Founder. Built from their word, so it sounds like a family that has
  // been doing this a while. The seam gets tidied, because no real surname has
  // three of the same letter in a row.
  const stub = stem(anchor || noun).slice(0, 6);
  const end = pick(SURNAME);
  const sur = title(stub[stub.length - 1] === end[0] ? stub.slice(0, -1) + end : stub + end);
  push(
    `${sur} ${pick(FIRMS)}`,
    "founder",
    `a surname built out of "${anchor || noun.toLowerCase()}". people trust a name that sounds like somebody is answerable for it.`
  );

  // 5. Place. Nothing makes a small business feel rooted faster.
  push(`${anchor ? title(stem(anchor)) : noun} ${place}`, "place", `a name that sounds like an address. it feels local before anyone has read a word about you.`);

  // 6. Verb. An instruction, which is the most energetic shape a name has.
  push(`${verb} ${pick(ADVERBS)}`, "verb", `an instruction, not a description. verbs move, and a name that moves gets said out loud more.`);

  // 7. Borrowed. A real word from somewhere else, with a real meaning behind
  // it, which is a story you get to tell every time somebody asks.
  push(borrowed.word, "borrowed", `${borrowed.gloss}. it comes with a story, and the story is free marketing every time somebody asks.`);

  // 8. Compound, the other way round, so there is always a spare.
  push(`${noun} ${tail}`, "compound", `a ${category.subject} noun plus a working word. plain, sturdy, and impossible to mishear.`);
  push(`${title(verb)} ${noun}`, "verb", `a verb doing the work and a noun catching it. reads short, sits well in a logo.`);

  return made.slice(0, count);
}

/** Kept for anything that just wants a list of strings. */
export function suggestNames(seed: number, count = 6): string[] {
  return nameIdeas("", seed, count).map((n) => n.name);
}

/* ------------------------------------------------------------------ line -- */

/**
 * The line under the name. Its whole job is to say what the name is free not
 * to, so it is plain on purpose.
 */
export function taglineIdeas(idea: string, name: string, seed: number, count = 4, cat?: Category): string[] {
  const category = cat || classify(idea);
  const rand = mulberry32((seed >>> 0) + 21);
  const typed = ideaWords(idea);
  // Their own word for the thing, if they gave one that reads like a noun.
  // "bookkeeping" and "grooming" are actions, and "a grooming worth the walk"
  // is not a sentence anybody says.
  const subject =
    typed.find((w) => category.keys.includes(w) && w.length < 9 && !w.endsWith("ing")) || category.subject;
  const own = typed.filter((w) => !category.keys.includes(w) && !WEAK.has(w));
  const root = own[0] || "";
  const n = name.trim();

  const pool: string[] = [
    `A ${subject} worth the walk.`,
    `${cap(subject)}, done properly.`,
    `The ${subject} people tell people about.`,
    `Small ${subject}. Big standards.`,
    `${cap(category.verbs[0])} it properly, every day.`,
    "Made to be used, not admired.",
    "Less setup. More doing.",
    "For people who would rather it just worked.",
    "Small studio. Real work.",
    "Built by hand. Built to last.",
  ];
  if (root) {
    pool.unshift(`${cap(root)} first. Everything else after.`);
    pool.unshift(`Come for the ${root}. Stay for the rest.`);
  }
  if (n) pool.push(`${n}. Made properly.`);

  const out = new Set<string>();
  let guard = 0;
  while (out.size < Math.min(count, pool.length) && guard++ < 200) {
    out.add(pool[Math.floor(rand() * pool.length)]);
  }
  return Array.from(out);
}

/** Kept for callers that only have a name. */
export function suggestLines(seed: number, name: string, count = 4): string[] {
  return taglineIdeas("", name, seed, count);
}

/* ------------------------------------------------------------------ type -- */

export type TypeSet = {
  id: string;
  name: string;
  display: string;
  body: string;
  note: string;
  displayFont: string;
  bodyFont: string;
  tracking: number;
  why: string;
};

const POPPINS = "Poppins, Helvetica Neue, Helvetica, Arial, sans-serif";
const GEORGIA = "Georgia, Cambria, Times New Roman, Times, serif";
const PALATINO = "Palatino Linotype, Palatino, Book Antiqua, Georgia, serif";
const GROTESK = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, Courier New, monospace";

/**
 * Real pairings, from fonts that are actually there.
 *
 * Poppins is the one webfont this site loads. Everything paired with it ships
 * with the operating system, so none of these need a font licence, a download
 * or a fallback that looks nothing like the preview. A type pairing you cannot
 * install is a mood board, not a decision.
 */
export const TYPESETS: TypeSet[] = [
  {
    id: "geo",
    name: "Geometric",
    display: "600",
    body: "300",
    note: "Modern, calm, gets out of the way.",
    displayFont: POPPINS,
    bodyFont: POPPINS,
    tracking: -0.8,
    why: "One family, contrast made out of weight. The safest pairing there is, because two weights of the same face can never clash.",
  },
  {
    id: "bold",
    name: "Heavy",
    display: "700",
    body: "400",
    note: "Loud, confident, made to be seen small.",
    displayFont: POPPINS,
    bodyFont: POPPINS,
    tracking: -1.4,
    why: "Poppins at 700 with the tracking pulled in. Heavy geometric letters keep their shape at thumbnail size, which is where most people will meet you.",
  },
  {
    id: "editorial",
    name: "Editorial",
    display: "500",
    body: "400",
    note: "Quiet and premium. Needs space around it.",
    displayFont: POPPINS,
    bodyFont: GEORGIA,
    tracking: -0.4,
    why: "Geometric name, serif reading. Georgia was drawn for screens and sits on every machine, so long copy stops feeling like an interface and starts feeling like something written.",
  },
  {
    id: "serifled",
    name: "Serif led",
    display: "700",
    body: "300",
    note: "Old money. Good for trust and craft.",
    displayFont: GEORGIA,
    bodyFont: POPPINS,
    tracking: -0.6,
    why: "Serif on top, geometric underneath. The serif buys you age and care, the sans keeps the small print modern.",
  },
  {
    id: "swiss",
    name: "Swiss",
    display: "700",
    body: "400",
    note: "Neutral, industrial, never in the way.",
    displayFont: GROTESK,
    bodyFont: POPPINS,
    tracking: -1.2,
    why: "Helvetica or Arial set tight, with Poppins doing the body. Neutral on purpose, so the colour and the mark carry the personality.",
  },
  {
    id: "technical",
    name: "Technical",
    display: "600",
    body: "400",
    note: "For tools, dashboards, anything with numbers in it.",
    displayFont: POPPINS,
    bodyFont: MONO,
    tracking: -0.5,
    why: "A monospace body reads as precision and lines numbers up for free. Use it where the numbers matter, not for paragraphs.",
  },
  {
    id: "classic",
    name: "Classic",
    display: "400",
    body: "300",
    note: "Warm, printed, unhurried.",
    displayFont: PALATINO,
    bodyFont: POPPINS,
    tracking: 0.4,
    why: "Palatino is a calligraphic old style with real warmth in it, and it falls back to Georgia everywhere it is missing. Set it with air around it or it looks like a letter from a bank.",
  },
];

/* ----------------------------------------------------------------- export -- */

export function slugify(name: string): string {
  return (name || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "brand";
}

export function paletteCSS(p: Palette, name: string): string {
  const slug = slugify(name);
  const rows = paletteReport(p);
  const notes = rows.map((r) => ` * ${r.label}: ${r.ratio}:1 ${r.pass ? "passes" : "fails"} AA`).join("\n");
  return `/* ${name || "Brand"}, generated at flowzone.dev/start
${notes}
 */
:root {
  --${slug}-bg: ${p.bg};
  --${slug}-surface: ${p.surface};
  --${slug}-ink: ${p.ink};
  --${slug}-muted: ${p.muted};
  --${slug}-accent: ${p.a};
  --${slug}-accent-2: ${p.b};
  --${slug}-on-accent: ${readableOn(p.a, p)};
  --${slug}-on-accent-2: ${readableOn(p.b, p)};
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
 * Every one measures the name before it draws it and grows to fit, because a
 * long name running off the edge of its own logo is the single most obvious
 * tell that a machine made it.
 */

export type LockupArgs = {
  mark: Mark;
  p: Palette;
  name: string;
  line: string;
  initials: string;
  display: string;
  body: string;
  displayFont?: string;
  bodyFont?: string;
  tracking?: number;
  w?: number;
  h?: number;
};

export type Lockup = {
  id: string;
  name: string;
  note: string;
  w: number;
  h: number;
  /** How much wider this layout needs to be for a given name. */
  fit?: (name: string, line: string, display: string) => number;
  build: (a: LockupArgs) => string;
};

const esc = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT = POPPINS;

/**
 * Roughly how wide a string will set.
 *
 * There is no way to measure text in a generated SVG file, so this counts
 * character widths the way a type designer would: caps and round letters wide,
 * i and l narrow, spaces narrower still. It only has to be close. Its job is to
 * stop the name colliding with the edge, not to kern anything.
 */
export function textWidth(s: string, size: number, weight = 600): number {
  let units = 0;
  for (const ch of s) {
    if (" ".includes(ch)) units += 0.28;
    else if ("iIl|!.,;:'".includes(ch)) units += 0.31;
    else if ("ftrj()[]-".includes(ch)) units += 0.4;
    else if ("mwMW@".includes(ch)) units += 0.92;
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) units += 0.68;
    else units += 0.56;
  }
  return units * size * (weight >= 600 ? 1.02 : 0.98);
}

/** Drops the 100x100 mark into a lockup at an arbitrary place and size. */
const place = (mark: Mark, p: Palette, initials: string, x: number, y: number, size: number) =>
  `<g transform="translate(${f(x)} ${f(y)}) scale(${f(size / 100)})">${mark.render(p, initials).body}</g>`;

export const LOCKUPS: Lockup[] = [
  {
    id: "horizontal",
    name: "Horizontal",
    note: "The one your site header wants.",
    w: 520,
    h: 150,
    fit: (name, line, display) =>
      Math.max(360, 172 + Math.max(textWidth(name, 40, Number(display)), textWidth(line, 15, 300)) + 34),
    build: ({ mark, p, name, line, initials, display, body, displayFont, bodyFont, tracking }) => `
      ${place(mark, p, initials, 24, 25, 100)}
      <text x="150" y="${line ? 72 : 84}" font-family="${displayFont || FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="${tracking ?? -0.8}">${esc(name)}</text>
      ${line ? `<text x="152" y="99" font-family="${bodyFont || FONT}" font-size="15" font-weight="${body}" fill="${p.muted}">${esc(line)}</text>` : ""}`,
  },
  {
    id: "stacked",
    name: "Stacked",
    note: "Avatars, app icons, anything square.",
    w: 380,
    h: 380,
    fit: (name, line, display) =>
      Math.max(380, Math.max(textWidth(name, 40, Number(display)), textWidth(line, 15, 300)) + 80),
    build: ({ mark, p, name, line, initials, display, body, displayFont, bodyFont, tracking, w }) => {
      const cx = (w || 380) / 2;
      return `
      ${place(mark, p, initials, cx - 60, 58, 120)}
      <text x="${f(cx)}" y="238" text-anchor="middle" font-family="${displayFont || FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="${tracking ?? -0.8}">${esc(name)}</text>
      ${line ? `<text x="${f(cx)}" y="270" text-anchor="middle" font-family="${bodyFont || FONT}" font-size="15" font-weight="${body}" fill="${p.muted}">${esc(line)}</text>` : ""}
      <rect x="${f(cx - 40)}" y="292" width="80" height="2" fill="${p.a}"/>`;
    },
  },
  {
    id: "badge",
    name: "Badge",
    note: "A stamp. Good on packaging and merch.",
    w: 380,
    h: 380,
    fit: (name, _line, display) => Math.max(380, textWidth(name.toUpperCase(), 30, Number(display)) + 110),
    build: ({ mark, p, name, initials, display, displayFont, w }) => {
      const cx = (w || 380) / 2;
      return `
      <circle cx="${f(cx)}" cy="190" r="168" fill="none" stroke="${p.a}" stroke-width="3"/>
      <circle cx="${f(cx)}" cy="190" r="152" fill="none" stroke="${p.muted}" stroke-width="1"/>
      ${place(mark, p, initials, cx - 55, 108, 110)}
      <text x="${f(cx)}" y="262" text-anchor="middle" font-family="${displayFont || FONT}" font-size="30" font-weight="${display}" fill="${p.ink}" letter-spacing="1">${esc(name.toUpperCase())}</text>
      <rect x="${f(cx - 30)}" y="278" width="60" height="2" fill="${p.b}"/>
      <text x="${f(cx)}" y="306" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="500" fill="${p.muted}" letter-spacing="4">EST. ${new Date().getFullYear()}</text>`;
    },
  },
  {
    id: "wordmark",
    name: "Wordmark",
    note: "No icon. For when it has to survive being tiny.",
    w: 560,
    h: 150,
    fit: (name, line, display) =>
      Math.max(300, 78 + Math.max(textWidth(name, 46, Number(display)), textWidth(line, 15, 300)) + 40),
    build: ({ p, name, line, display, body, displayFont, bodyFont, tracking }) => `
      <rect x="30" y="40" width="4" height="66" fill="${p.a}"/>
      <text x="54" y="${line ? 80 : 88}" font-family="${displayFont || FONT}" font-size="46" font-weight="${display}" fill="${p.ink}" letter-spacing="${tracking ?? -1}">${esc(name)}</text>
      ${line ? `<text x="56" y="106" font-family="${bodyFont || FONT}" font-size="15" font-weight="${body}" fill="${p.muted}" letter-spacing="1">${esc(line)}</text>` : ""}`,
  },
  {
    id: "block",
    name: "Colour block",
    note: "Loud. Works on a shirt or a sticker.",
    w: 520,
    h: 190,
    fit: (name, line, display) =>
      Math.max(420, 200 + Math.max(textWidth(name, 40, Number(display)), textWidth(line, 15, 300)) + 36),
    build: ({ mark, p, name, line, initials, display, body, displayFont, bodyFont, tracking }) => `
      <rect x="0" y="0" width="150" height="190" fill="${p.a}"/>
      ${place(mark, p, initials, 30, 45, 92)}
      <text x="186" y="${line ? 86 : 104}" font-family="${displayFont || FONT}" font-size="40" font-weight="${display}" fill="${p.ink}" letter-spacing="${tracking ?? -0.8}">${esc(name)}</text>
      ${line ? `<text x="188" y="116" font-family="${bodyFont || FONT}" font-size="15" font-weight="${body}" fill="${p.muted}">${esc(line)}</text>` : ""}
      <rect x="186" y="136" width="46" height="3" fill="${p.b}"/>`,
  },
  {
    id: "framed",
    name: "Framed",
    note: "Formal. Certificates, letterheads, footers.",
    w: 480,
    h: 260,
    fit: (name, line, display) =>
      Math.max(480, Math.max(textWidth(name, 34, Number(display)), textWidth(line.toUpperCase(), 14, 300)) + 120),
    build: ({ mark, p, name, line, initials, display, body, displayFont, bodyFont, w }) => {
      const W = w || 480;
      const cx = W / 2;
      return `
      <rect x="16" y="16" width="${f(W - 32)}" height="228" fill="none" stroke="${p.muted}" stroke-width="2"/>
      <rect x="26" y="26" width="${f(W - 52)}" height="208" fill="none" stroke="${p.a}" stroke-width="1"/>
      ${place(mark, p, initials, cx - 35, 52, 70)}
      <text x="${f(cx)}" y="164" text-anchor="middle" font-family="${displayFont || FONT}" font-size="34" font-weight="${display}" fill="${p.ink}" letter-spacing="-0.5">${esc(name)}</text>
      ${line ? `<text x="${f(cx)}" y="192" text-anchor="middle" font-family="${bodyFont || FONT}" font-size="14" font-weight="${body}" fill="${p.muted}" letter-spacing="2">${esc(line.toUpperCase())}</text>` : ""}`;
    },
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
  bg = true,
  fonts?: { displayFont?: string; bodyFont?: string; tracking?: number }
): string {
  const n = name.trim() || "Your Thing";
  const l = line.trim();
  // Each layout states its own minimum, so short names tighten up and long
  // ones grow. A fixed canvas is what leaves a name floating in dead space.
  const w = Math.round(lockup.fit ? lockup.fit(n, l, display) : lockup.w);
  const inner = lockup.build({
    mark,
    p,
    name: n,
    line: l,
    initials: initials || "YT",
    display,
    body,
    displayFont: fonts?.displayFont,
    bodyFont: fonts?.bodyFont,
    tracking: fonts?.tracking,
    w,
    h: lockup.h,
  });
  const defs = mark.render(p, initials || "YT").defs;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${lockup.h}" width="${w}" height="${lockup.h}">
${defs ? `  <defs>${defs}</defs>\n` : ""}${bg ? `  <rect width="${w}" height="${lockup.h}" fill="${p.bg}"/>\n` : ""}${inner}
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
 * Wraps a drawn icon in a container.
 *
 * The container decides whether the icon is knocked out of a solid face or
 * drawn on open ground, and the stroke colour follows from that, so the mark
 * stays legible instead of colour on colour mush. Flat, one weight, no
 * lighting: exactly what has to survive at sixteen pixels in a browser tab.
 */
export function iconMark(icon: Icon, containerId: string): Mark {
  const solid = containerId === "circle" || containerId === "block" || containerId === "hex" || containerId === "shield";

  return {
    id: `${icon.id}:${containerId}`,
    name: icon.id.replace(/-/g, " "),
    render: (p: Palette) => {
      const stroke = solid ? readableOn(p.a, p) : p.a;
      const glyph = `<g transform="translate(29 29) scale(1.75)" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icon.d}</g>`;

      let shell = "";
      if (containerId === "circle") shell = `<circle cx="50" cy="50" r="40" fill="${p.a}"/>`;
      else if (containerId === "block") shell = `<rect x="10" y="10" width="80" height="80" fill="${p.a}"/>`;
      else if (containerId === "hex") shell = `<polygon points="50,7 87,28 87,72 50,93 13,72 13,28" fill="${p.a}"/>`;
      else if (containerId === "shield") shell = `<path d="M50 6 L90 22 V52 C90 75 69 89 50 95 C31 89 10 75 10 52 V22 Z" fill="${p.a}"/>`;
      else if (containerId === "ring") shell = `<circle cx="50" cy="50" r="41" fill="none" stroke="${p.a}" stroke-width="6"/>`;

      return { defs: "", body: `${shell}${glyph}` };
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

/**
 * Icons that match what the visitor typed.
 *
 * Somebody who wrote "a bakery people cross town for" should not have to think
 * of the word croissant. Their own words go at the front of the queue, the
 * category's suggestion behind them.
 */
export function iconsForIdea(idea: string, cat?: Category, limit = 24): Icon[] {
  const category = cat || classify(idea);
  const words = ideaWords(idea);
  const out: Icon[] = [];
  const seen = new Set<string>();
  const add = (ic?: Icon) => {
    if (ic && !seen.has(ic.id)) {
      seen.add(ic.id);
      out.push(ic);
    }
  };
  for (const w of words) {
    for (const ic of ICONS) {
      if (ic.id === w || ic.id.startsWith(w) || (w.length > 4 && ic.id.includes(w.slice(0, 5)))) add(ic);
    }
  }
  add(ICONS.find((i) => i.id === category.icon));
  for (const k of category.keys) {
    const hit = ICONS.find((i) => i.id === k || i.id.startsWith(k));
    if (hit) add(hit);
  }
  return out.slice(0, limit);
}

/* -------------------------------------------------------------- handover -- */

/**
 * The written spec.
 *
 * The thing a developer or a printer actually asks for, and the part most
 * generators skip: the hex values, the contrast numbers, the font stacks, and
 * the reasoning, so the decisions survive the person who made them.
 */
export function brandSpec(a: {
  idea: string;
  name: string;
  line: string;
  category: Category;
  palette: Palette;
  plan: PalettePlan;
  type: TypeSet;
  markName: string;
  lockupName: string;
  strategy?: string;
  why?: string;
}): string {
  const p = a.palette;
  const rows = paletteReport(p)
    .map((r) => `  ${r.label}: ${r.ratio}:1 ${r.pass ? "passes AA" : "fails AA, fix before shipping"}`)
    .join("\n");
  return `${a.name || "Your thing"}
${a.line || ""}

THE IDEA
${a.idea || "not written down yet"}
Category read as: ${a.category.label}

THE NAME
${a.name || "not chosen yet"}${a.strategy ? `\nStrategy: ${a.strategy}\n${a.why || ""}` : ""}

PALETTE
  Background   ${p.bg}
  Surface      ${p.surface}
  Text         ${p.ink}
  Quiet text   ${p.muted}
  Accent       ${p.a}   text on it: ${readableOn(p.a, p)}
  Second       ${p.b}   text on it: ${readableOn(p.b, p)}

  Built from a base hue of ${Math.round(a.plan.base)} degrees, ${a.category.hueNote}.
  Relationship: ${a.plan.relation}. ${a.plan.why}

CONTRAST
${rows}

TYPE
  ${a.type.name}
  Display: ${a.type.displayFont} ${a.type.display}, tracking ${a.type.tracking}px
  Body:    ${a.type.bodyFont} ${a.type.body}
  ${a.type.why}

MARK
  ${a.markName}
  Drawn flat on a 100 unit grid with a 10 unit margin. It has to hold as one
  silhouette at 16px, so keep it in one colour wherever it goes small.

LOGO
  ${a.lockupName} lockup, supplied as SVG. Keep clear space around it of at
  least the height of the mark's own margin, and never redraw it in a document.

Made in Flow Mode at flowzone.dev/start
`;
}
