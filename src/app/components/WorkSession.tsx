"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { hashSeed, renderStill } from "@/lib/generative";
import GenerativeField from "@/app/components/GenerativeField";
import VoiceSession from "@/app/components/VoiceSession";
import Tilt3D from "@/app/components/Tilt3D";
import Icon from "@/components/Icon";
import {
  FETCH_TIMEOUT,
  downloadBlob,
  downloadDataURL,
  loadJSON,
  loadRaw,
  readFunnelAnswers,
  removeJSON,
  saveJSON,
  saveRaw,
} from "@/lib/session";

/**
 * A guided session that turns a vague intention into a real brief.
 *
 * The first decision picks a path, and the path narrows everything after it:
 * the questions asked, the prompts offered, and the build recommended at the
 * end. The visitor is always working over their own idea, never filling in a
 * generic form.
 *
 * The questions used to be soft, and soft questions make a soft document. These
 * are the ones somebody who charges by the hour opens with: who pays, what one
 * customer is worth, why you and not the next one, what proof exists, and what
 * is actually in the way. Every one of them can be answered with a tap, because
 * honesty has to stay cheap or people bail on question three.
 *
 * What comes out the other end is a document with a point of view, not a
 * transcript. It takes a position, draws a line around the work, names what is
 * out of scope, does the arithmetic on the price, and lists the things the
 * visitor still has to go and find out. A brief that disagrees with you is
 * worth more than one that flatters you.
 *
 * Everything saves to their browser as they go, so a session survives a closed
 * tab. No backend and no signup: nothing leaves their machine until they press
 * send, which is why it can be handed to a stranger on the first visit.
 */

const KEY = "flowzone.session.v2";
const UNLOCK_KEY = "flowzone.briefunlock.v1";

type Path = {
  id: string;
  color: string;
  icon: string;
  name: string;
  blurb: string;
  build: string;
  previewLine: string;
  buildWhy: string;
  // Path-specific prompts, keyed by step id
  chips: Record<string, string[]>;
  focus: Record<string, string>;
  // The line around the work, drawn per path. Out of scope is the half that
  // saves the argument later.
  scopeIn: string[];
  scopeOut: string[];
};

const PATHS: Path[] = [
  {
    id: "brand",
    color: "#4C7BE8",
    icon: "palette",
    name: "Starting from nothing",
    blurb: "There is an idea and not much else yet. It needs a name, a look and a voice before anything can be built.",
    build: "The Identity Build",
    previewLine: "Something worth naming.",
    buildWhy:
      "You are at the beginning, so the mark, the palette, the type and the voice come first. Everything after it gets built against those decisions instead of guessing.",
    chips: {
      now: ["Nothing yet", "Just a name I like", "A rough logo I made", "A notes app full of ideas"],
      who: ["People like me", "People nearby", "A niche community", "Not sure yet, that is the problem"],
      money: ["nothing yet", "under $20", "$20 to $100", "I have not picked a number"],
      edge: ["Nobody near me does it", "I am the reason", "It is better made", "Still working that out"],
      proof: ["Nothing yet, it is a hunch", "Friends say they would buy", "Strangers ask for it"],
      feel: ["Premium and quiet", "Loud and fun", "Warm and human", "Serious and technical"],
      block: ["I do not know what to build first", "I cannot explain it fast", "No money to spend"],
      win: ["First paying customer", "10 paying customers", "I stop being embarrassed to share it"],
    },
    focus: {
      who: "You get to choose here, which is rare. Who do you want to be paying you?",
      money: "Even a guess. A guessed price beats no price, because everything else is built to justify it.",
      feel: "This is the most important answer on the page. It is the one that decides what your brand ends up looking like.",
    },
    scopeIn: [
      "A name and a mark that still works small and in one colour",
      "Palette, type and the rules for using them",
      "A voice: how it talks, what it never says",
      "One page that can carry the whole thing while the rest gets built",
    ],
    scopeOut: [
      "Ecommerce, carts and checkout",
      "Anything behind a login",
      "Ongoing content and social management",
    ],
  },
  {
    id: "shop",
    color: "#F0845F",
    icon: "box",
    name: "I want to sell things",
    blurb: "Products, real ones, and a place to sell them properly instead of through DMs and screenshots.",
    build: "The Storefront Build",
    previewLine: "Shop the drop.",
    buildWhy:
      "You need a real shop: product pages built for how your buyers decide, a cart, and checkout that takes money without you touching it.",
    chips: {
      now: ["Selling through DMs", "On a marketplace", "An Instagram and nothing else", "A shop I do not like"],
      who: ["Collectors", "Repeat regulars", "Gift buyers", "People who found me on social"],
      money: ["under $20", "$20 to $100", "$100 to $1,000", "over $1,000"],
      edge: ["Nobody else makes this", "It is better made", "I am the reason", "It is cheaper"],
      proof: ["People already pay me", "A waitlist or a list", "The last run sold out", "Nothing yet, it is a hunch"],
      feel: ["Like a real store", "Hyped and loud", "Clean and trustworthy", "Nostalgic"],
      block: ["Nobody knows it exists", "It looks amateur", "No time to build it", "Stock costs money up front"],
      win: ["First sales through my own site", "Sell out the first run", "$3,000 a month", "Stop taking orders in DMs"],
    },
    focus: {
      now: "How are people buying from you today, even if it is messy?",
      money: "Take your best seller. What does one of them cost somebody?",
      win: "What number would tell you the shop paid for itself?",
    },
    scopeIn: [
      "Product pages built the way your buyers actually decide",
      "Cart and checkout that take money without you touching it",
      "A photography and layout template you can repeat forever",
      "Stock, shipping and tax wired to the real world",
    ],
    scopeOut: [
      "A full rebrand from scratch",
      "Marketplace listings and the fees that come with them",
      "Paid ads and the budget behind them",
    ],
  },
  {
    id: "site",
    color: "#5B9BF9",
    icon: "house",
    name: "I need a proper site",
    blurb: "The business is real. The site is not doing it justice, or does not exist at all.",
    build: "The Site Build",
    previewLine: "Work with us.",
    buildWhy:
      "The business exists, so this is about the place people land. Custom design against your brand, words written for you, and forms that reach your inbox.",
    chips: {
      now: ["No site at all", "A template I outgrew", "A one pager", "A site I am embarrassed by"],
      who: ["Other businesses", "People nearby", "People comparing me to competitors", "Referrals checking me out"],
      money: ["$100 to $1,000", "over $1,000", "$20 to $100", "a monthly fee"],
      edge: ["I know this audience", "It is better made", "I am the reason", "Nobody near me does it"],
      proof: ["People already pay me", "Referrals keep coming", "Strangers ask for it", "Nothing yet, it is a hunch"],
      feel: ["Credible and calm", "Confident, not corporate", "Modern and fast", "Like a bigger company than I am"],
      block: ["It looks amateur", "I cannot explain it fast", "Nobody knows it exists", "No time to build it"],
      win: ["5 enquiries a week", "Stop losing people who look me up", "Charge more without flinching"],
    },
    focus: {
      who: "Who is looking you up right now, and what are they trying to decide?",
      money: "One job, one project, one client. What does that come to?",
      feel: "What should someone walk away thinking in the first four seconds?",
    },
    scopeIn: [
      "A custom design against your brand, not a template",
      "Words written for the pages, no filler",
      "Forms that reach your inbox and get answered",
      "Speed, search basics and analytics done properly",
    ],
    scopeOut: [
      "Ecommerce and checkout",
      "A customer login or dashboard",
      "Ongoing content after launch",
    ],
  },
  {
    id: "system",
    color: "#34D399",
    icon: "bolt",
    name: "The manual work is eating me",
    blurb: "The launch went fine. Now you are doing the same jobs by hand every day and it does not scale.",
    build: "The Engine Build",
    previewLine: "It runs itself now.",
    buildWhy:
      "The front is working, so the fix is behind it. Intake, booking, invoicing and reporting wired up so the day to day runs without you.",
    chips: {
      now: ["Chasing leads by hand", "Booking over DMs", "Invoicing manually", "Copying between spreadsheets"],
      who: ["Existing customers", "New enquiries", "My team", "Just me, drowning"],
      money: ["$100 to $1,000", "over $1,000", "a monthly fee", "$20 to $100"],
      edge: ["I know this audience", "It is faster", "I am the reason", "Still working that out"],
      proof: ["People already pay me", "More work than I can take", "Referrals keep coming"],
      feel: ["Invisible, it should just work", "Fast and reliable", "Simple enough for my team"],
      block: ["No time to build it", "It only works if I do it", "Things fall through the cracks"],
      win: ["10 hours a week back", "Nothing falls through", "Handle double the volume"],
    },
    focus: {
      now: "Which job do you repeat most, and how often?",
      money: "What is one customer worth over a year, not one order?",
      win: "Put a number on the hours. That is what this build is buying back.",
    },
    scopeIn: [
      "Intake, booking and invoicing wired end to end",
      "One place the working day actually lives",
      "Alerts when something needs a human",
      "A weekly number you can look at in ten seconds",
    ],
    scopeOut: [
      "A rebrand",
      "A new public site",
      "Anything that needs a native app",
    ],
  },
];


type Palette = { id: string; name: string; ink: string; bg: string; a: string; b: string };

const PALETTES: Palette[] = [
  { id: "quiet", name: "Premium and quiet", bg: "#0E0F12", ink: "#F4F1EA", a: "#C8A96A", b: "#6E7076" },
  { id: "loud", name: "Loud and fun", bg: "#140A1E", ink: "#FFFFFF", a: "#FF3D9A", b: "#38E1FF" },
  { id: "clean", name: "Clean and trusted", bg: "#0B1220", ink: "#F1F5FB", a: "#3B82F6", b: "#93C5FD" },
  { id: "warm", name: "Warm and human", bg: "#17110C", ink: "#FBF3E8", a: "#E2703A", b: "#C9A227" },
  { id: "sharp", name: "Sharp and technical", bg: "#08110E", ink: "#E9FFF6", a: "#22C55E", b: "#0EA5E9" },
  { id: "nostalgic", name: "Nostalgic", bg: "#141019", ink: "#FDF6E3", a: "#B45309", b: "#7C3AED" },
];

type Step = {
  id: string;
  color: string;
  icon: string;
  eyebrow: string;
  q: string;
  hint: string;
  rows: number;
};

const STEPS: Step[] = [
  {
    id: "what",
    color: "#4C7BE8",
    icon: "chat",
    eyebrow: "The idea",
    q: "Say it in your own words.",
    hint: "The version you would say out loud to a friend. Messy is fine, this is the raw material.",
    rows: 4,
  },
  {
    id: "who",
    color: "#F0845F",
    icon: "target",
    eyebrow: "Who pays",
    q: "Who actually hands over the money?",
    hint: "Not who likes it. Not who follows you. The person whose card comes out.",
    rows: 3,
  },
  {
    id: "money",
    color: "#34D399",
    icon: "banknote",
    eyebrow: "The money",
    q: "What does one customer pay you?",
    hint: "This number decides everything under it. A volume game and a trust game do not get built the same way.",
    rows: 2,
  },
  {
    id: "edge",
    color: "#FBBF24",
    icon: "gem",
    eyebrow: "The edge",
    q: "Why would they pick you over the next one?",
    hint: "The next one is one search away and probably cheaper. If there is no answer yet, say so, that is the most useful thing on this page.",
    rows: 3,
  },
  {
    id: "proof",
    color: "#5B9BF9",
    icon: "eye",
    eyebrow: "The proof",
    q: "What already tells you people want this?",
    hint: "Anything real. Money, a waitlist, a repeat customer, strangers asking. Wanting it yourself does not count.",
    rows: 3,
  },
  {
    id: "now",
    color: "#5B8CFF",
    icon: "hammer",
    eyebrow: "What exists",
    q: "What is built already?",
    hint: "Be honest about the messy parts. It decides what gets kept and what gets thrown away.",
    rows: 3,
  },
  {
    id: "feel",
    color: "#C6E4F8",
    icon: "sparkle",
    eyebrow: "The feel",
    q: "How should it feel to land on?",
    hint: "Adjectives are welcome. Links to things you love and things you hate are better.",
    rows: 3,
  },
  {
    id: "block",
    color: "#E2703A",
    icon: "puzzle",
    eyebrow: "The constraint",
    q: "What is actually in the way?",
    hint: "Money, time, skill, nerve. Name the real one. Most people spend on the wrong one and wonder why nothing moved.",
    rows: 3,
  },
  {
    id: "win",
    color: "#22C55E",
    icon: "trophy",
    eyebrow: "The win",
    q: "What number tells you this worked?",
    hint: "Ninety days out. Something you could check on a Friday afternoon, not a feeling.",
    rows: 3,
  },
];

/**
 * A floor of suggestions, so no question is ever a blank box.
 *
 * The path supplies sharper prompts where it has them, and these fill the gaps.
 * Someone should be able to finish this entire session by tapping, never typing
 * a word, and still walk out with a brief that says something true. Minimum
 * effort has to be a real option, not a worse one.
 */
const FALLBACK_CHIPS: Record<string, string[]> = {
  what: [
    "I know the feeling I want, not the words",
    "It is a business I already run",
    "It is an idea I have not started",
    "Something I keep explaining badly",
  ],
  who: [
    "People nearby",
    "People online, anywhere",
    "Other businesses",
    "One big client",
    "Not sure yet, that is the problem",
  ],
  money: [
    "under $20",
    "$20 to $100",
    "$100 to $1,000",
    "over $1,000",
    "a monthly fee",
    "nothing yet",
  ],
  edge: [
    "Nobody near me does it",
    "It is better made",
    "It is faster",
    "I am the reason",
    "I know this audience",
    "Still working that out",
  ],
  proof: [
    "People already pay me",
    "Strangers ask for it",
    "A waitlist or a list",
    "It works for me and nobody else yet",
    "Nothing yet, it is a hunch",
  ],
  now: [
    "Nothing yet, honestly",
    "A name I like",
    "A logo I do not love",
    "Social accounts only",
    "An old site I have outgrown",
    "Paying customers",
  ],
  feel: [
    "Premium and quiet",
    "Loud and fun",
    "Warm and human",
    "Serious and technical",
    "Nostalgic",
  ],
  block: [
    "Nobody knows it exists",
    "It looks amateur",
    "I cannot explain it fast",
    "No time to build it",
    "No money to spend",
    "I do not know what to build first",
  ],
  win: [
    "10 paying customers",
    "$3,000 a month",
    "5 enquiries a week",
    "10 hours a week back",
    "First sale from a stranger",
  ],
};

const RANKS = [
  { label: "Not started", color: "#647089" },
  { label: "A sentence", color: "#4C7BE8" },
  { label: "A sketch", color: "#4C7BE8" },
  { label: "Taking shape", color: "#5B9BF9" },
  { label: "Getting real", color: "#5B9BF9" },
  { label: "It has a spine", color: "#F0845F" },
  { label: "Sharp", color: "#F0845F" },
  { label: "Nearly a brief", color: "#FBBF24" },
  { label: "Brief in hand", color: "#FBBF24" },
  { label: "Ready to build", color: "#34D399" },
];

/* -------------------------------------------------------------------------
 * The read.
 *
 * Everything below turns nine answers into a document with an opinion. No
 * network, no model, no cleverness: just the arithmetic somebody would do on
 * the back of a napkin, written down properly.
 * ---------------------------------------------------------------------- */

/** First non-empty line of an answer, which is usually the one that matters. */
const firstLine = (s?: string) =>
  (s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)[0] || "";

/** Lowercase the opening letter so an answer can sit inside a sentence. */
const soften = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Chips get appended, so match on contains rather than equals. */
function pick<T>(map: Record<string, T>, text: string): T | null {
  const t = (text || "").toLowerCase();
  if (!t) return null;
  const hit = Object.keys(map).find((k) => t.includes(k.toLowerCase()));
  return hit ? map[hit] : null;
}

type Band = { id: string; mid: number; read: (n: number) => string; risk: string };

/**
 * What one customer is worth, and what that fact demands of the build. The
 * bands match the funnel's word for word so an answer can cross over.
 */
const BANDS: Band[] = [
  {
    id: "over $1,000",
    mid: 2000,
    read: () =>
      "Over $1,000 a customer means one or two yeses a month change your year. Nothing here should chase an audience. It should chase a handful of the right people and make saying yes feel safe.",
    risk: "Few customers, each one heavy. Losing two of them is a bad quarter, so the work has to make you replaceable to nobody and findable by everybody.",
  },
  {
    id: "$100 to $1,000",
    mid: 400,
    read: (n) =>
      `At around $400 a sale you need roughly ${n} customers a month to clear $3,000. That is a trust game, not a volume game. Every page should be built to make one person say yes.`,
    risk: "Trust games are lost quietly. People decide you are not serious and never tell you, so proof has to be visible before the price is.",
  },
  {
    id: "$20 to $100",
    mid: 60,
    read: (n) =>
      `At around $60 a sale you need roughly ${n} customers a month to clear $3,000. Reachable, and it lives or dies on how often people see you and how easily they come back.`,
    risk: "The middle band needs both reach and repeat. One without the other stalls at about half the number you want.",
  },
  {
    id: "under $20",
    mid: 12,
    read: (n) =>
      `At around $12 a sale this is a volume game: roughly ${n} customers a month to clear $3,000. Volume is won with reach and repeat, never with a prettier logo.`,
    risk: "At this price the maths only works at scale, and scale costs either money or months. Budget for one of them now.",
  },
  {
    id: "a monthly fee",
    mid: 80,
    read: (n) =>
      `A monthly fee changes the question from how many sales to how few leave. At around $80 a month it takes about ${n} people staying to clear $3,000, and keeping them is cheaper than finding them.`,
    risk: "Recurring money hides its own leak. If nobody is watching who cancels, the number looks fine right up until it does not.",
  },
  {
    id: "nothing yet",
    mid: 0,
    read: () =>
      "Nothing has a price yet, so that is the first decision rather than the last. Pick a number you can say out loud without flinching, then build everything backwards from it.",
    risk: "No price means no maths, and no maths means every choice below is a guess wearing a suit.",
  },
];

const NO_PRICE = BANDS[BANDS.length - 1];

/** Reads a band out of whatever they typed or tapped, digits included. */
function readBand(text: string): Band {
  const t = (text || "").toLowerCase();
  const named = BANDS.find((b) => t.includes(b.id.toLowerCase()));
  if (named) return named;
  const m = t.match(/\$\s?([\d,]+)/);
  if (m) {
    const n = Number(m[1].replace(/,/g, ""));
    if (n >= 1000) return BANDS[0];
    if (n >= 100) return BANDS[1];
    if (n >= 20) return BANDS[2];
    if (n > 0) return BANDS[3];
  }
  return NO_PRICE;
}

const AUDIENCE: Record<string, string> = {
  "people nearby": "Local. The map, the window and word of mouth do more work here than anything online, so the build has to be findable at street level.",
  "local customers": "Local. The map, the window and word of mouth do more work here than anything online, so the build has to be findable at street level.",
  "people like me": "You are the audience. That is a real advantage and a blind spot at once, because your taste and your market are not the same size.",
  "people online": "Online, which means nobody walks past. Every visit is bought, earned or borrowed from somebody else's audience, and the site has to convert the ones you get.",
  "other businesses": "Business buyers. Slower yes, bigger cheque, and the decision usually needs a second person to nod. Everything you make has to survive being forwarded.",
  "one big client": "One client is a customer and a risk in the same sentence. Build it so the second one is easy to add, before you need them.",
  "collectors": "Collectors. They care about the story, the run size and being early. Scarcity and provenance sell more than polish.",
  "repeat regulars": "Regulars. The second purchase is the whole business, so the work should make coming back easier than deciding again.",
  "gift buyers": "Gift buyers. They are not the user, they are the payer, and they need reassurance more than detail.",
  "referrals": "Referrals. Somebody already vouched for you, so the job is to not lose them in the first ten seconds.",
  "people comparing me": "People holding you against a competitor tab. Whatever they can compare fast, they will, so give them something that does not compare.",
  "existing customers": "People who already pay you. The cheapest growth in the building, and the easiest to take for granted.",
  "new enquiries": "People at the front door. Speed of reply beats almost everything else here.",
  "my team": "Your team. If it is not simpler than what they do now, they will quietly keep doing what they do now.",
  "just me": "You, on your own. That means the build has to remove work, not add a thing you now have to feed.",
  "not sure yet": "Not named yet, which makes this the most expensive gap in the brief. Everything below is provisional until somebody real is on the other end.",
};

const EDGE: Record<string, string> = {
  "nobody near me does it": "Being the only one nearby is a real edge and a temporary one. Use it loudly while it lasts, and build something harder to copy underneath.",
  "nobody else makes this": "Being the only one is a real edge and a temporary one. Use it loudly while it lasts, and build something harder to copy underneath.",
  "it is better made": "Better made only counts if people can see it before they buy. That is a proof problem, and proof is showable.",
  "it is faster": "Speed is a promise, so it has to be measured somewhere public or it reads as a slogan.",
  "it is cheaper": "Cheapest is the hardest position to hold. Anyone with deeper pockets can take it off you in a week.",
  "i am the reason": "You are the moat. Your face and your voice belong out front, and no logo can do that job for you.",
  "i know this audience": "Knowing the audience better than the competition is a durable edge, as long as the work sounds like it. Generic copy throws it away.",
  "still working that out": "No edge named yet. This is the highest value thing on the list to fix, because everything else gets easier the moment it is answered.",
};

const PROOF: Record<string, string> = {
  "people already pay me": "Money has changed hands, which puts you ahead of almost everyone with the same idea. Lead with it on every page.",
  "more work than i can take": "Demand is proven and capacity is the problem. That is a good problem and a completely different build.",
  "the last run sold out": "Sold out is proof and a story. Say the number, scarcity only works when it is specific.",
  "referrals keep coming": "Referrals are the strongest proof there is. Write down what people say when they refer you, that is your positioning already written.",
  "strangers ask for it": "Strangers asking is real signal. Turn it into a list before you turn it into a build.",
  "a waitlist": "A list is proof with a phone number attached. Its size is the first honest number in this brief.",
  "friends say they would buy": "Friends are not proof. Kind, but not proof. The first job is one stranger paying.",
  "it works for me": "It works for you and nobody else yet. That is a hypothesis, so the build should be the cheapest way to test it on a stranger.",
  "nothing yet": "No proof yet. Everything here is a bet, so the first thing built should be the cheapest thing that can be put in front of a stranger.",
};

const CONSTRAINT: Record<string, string> = {
  "nobody knows it exists": "A distribution problem, not a product one. More polish will not fix it and usually delays the fix.",
  "it looks amateur": "Trust is the leak. People decide in the first two seconds and right now they are deciding wrong, which costs sales you never hear about.",
  "i cannot explain it fast": "The problem is the sentence, not the thing. If you cannot say it in one line, nobody can repeat it for you, and repeating is how it spreads.",
  "no time to build it": "You are the constraint. Anything needing your hands every week will stall, so the first build has to remove work rather than add it.",
  "it only works if i do it": "You are the constraint. Anything needing your hands every week will stall, so the first build has to remove work rather than add it.",
  "no money to spend": "Then the first thing you make has to sell, not impress. Impressive comes out of the money that sells.",
  "stock costs money up front": "Cash is tied up in things before anyone has bought them. Pre-orders or made to order take that risk off the table.",
  "i do not know what to build first": "Order is the constraint, which is what this document is for. Do the top of the scope and nothing else until it is live.",
  "things fall through the cracks": "Nothing is dropping on purpose, it is dropping because the work lives in your head. The fix is one place things land, not more discipline.",
};

/** Risks that come from the shape of the answers, not from the words. */
const CONSTRAINT_RISK: Record<string, string> = {
  "nobody knows it exists": "Launching quietly. A build with no distribution plan attached is a very expensive private page.",
  "it looks amateur": "Spending on the surface and skipping the proof, which moves the same trust problem one layer down.",
  "i cannot explain it fast": "Designing before the words exist. The layout gets rebuilt the day the sentence lands.",
  "no time to build it": "Scope that needs you weekly. It will be abandoned by week three and blamed on the build.",
  "no money to spend": "Building the whole thing at once. Half of it, earning, beats all of it, waiting.",
  "i do not know what to build first": "Doing everything a little. Nothing gets finished enough to be judged.",
  "things fall through the cracks": "Building a system nobody moves into. If the old way is still open, people use the old way.",
};

type Doc = {
  positioning: string;
  audience: string;
  arithmetic: string;
  evidence: string;
  scopeIn: string[];
  scopeOut: string[];
  constraint: string;
  measure: string;
  risks: string[];
  open: string[];
};

/**
 * Builds the document. Every section has a fallback that says something true
 * about the gap instead of printing a dash, because a named gap is useful and
 * a dash is not.
 */
function buildDoc(
  answers: Record<string, string>,
  path: Path | null,
  projectName: string
): Doc {
  const name = projectName || "This project";
  const who = firstLine(answers.who);
  const what = firstLine(answers.what);
  const edge = firstLine(answers.edge);
  const band = readBand(answers.money || "");
  const perMonth = band.mid ? Math.max(1, Math.round(3000 / band.mid)) : 0;
  const winLine = firstLine(answers.win);
  const blocked = firstLine(answers.block);

  // Positioning: one sentence somebody could repeat back to you.
  const whoBit = who ? soften(who) : "an audience nobody has named yet";
  const whatBit = what ? soften(what) : "still a sentence looking for its edges";
  const edgeBit =
    edge && !/still working/i.test(edge)
      ? `They pick it over the next one because ${soften(edge)}.`
      : "Why anyone picks it over the next one is still open, and that is the first thing this build has to answer.";
  const positioning = `${name} is ${whatBit}, made for ${whoBit}. ${edgeBit}`;

  const audience =
    pick(AUDIENCE, answers.who || "") ||
    (who
      ? `Written down as: ${who}. Specific enough to build against, and worth checking against a real person this week.`
      : "Nobody is named yet. Until somebody is, every decision below is taste rather than strategy.");

  const arithmetic = band.read(perMonth);

  const evidence = [
    pick(EDGE, answers.edge || "") ||
      "No edge is written down, so assume the next option looks identical from the outside.",
    pick(PROOF, answers.proof || "") ||
      "No proof is written down. Treat the first build as an experiment with a budget, not a launch.",
  ].join(" ");

  // Scope comes from the path, then the constraint edits it. Money and time
  // change what belongs in a first build more than taste ever does.
  const scopeIn = path
    ? [...path.scopeIn]
    : [
        "A name and one page that explains it in a sentence",
        "A way for somebody to say yes without emailing you first",
        "Enough proof on the page to be believed",
      ];
  const scopeOut = path
    ? [...path.scopeOut]
    : ["Anything that cannot be finished in one go", "Features nobody has asked for yet"];

  const b = (answers.block || "").toLowerCase();
  if (b.includes("no money")) {
    scopeOut.push("Anything that cannot start earning inside ninety days");
  }
  if (b.includes("no time") || b.includes("only works if i do it")) {
    scopeOut.push("Anything that needs you every week to keep running");
  }
  if (band === NO_PRICE) {
    scopeOut.push("Anything priced before the price exists");
  }
  if ((answers.proof || "").toLowerCase().includes("nothing yet")) {
    scopeIn.push("One cheap thing a stranger can react to before the rest is built");
  }

  const constraint =
    pick(CONSTRAINT, answers.block || "") ||
    (blocked
      ? `Named as: ${blocked}. Everything in scope should be judged against whether it moves that, and nothing else.`
      : "No constraint named, which usually means the real one has not been said out loud yet. Ask again after a week of trying.");

  // Success, dragged towards a number wherever the answers allow it.
  const hasNumber = /\d/.test(winLine);
  const measure = winLine
    ? hasNumber
      ? `${winLine}. Check it on a Friday, ninety days from launch. If it is not moving by day thirty, the constraint above is the wrong one.`
      : `${winLine}. That is a feeling, so here is the number under it: ${
          perMonth
            ? `${perMonth} customers a month at around $${band.mid}, which is $3,000 through the door.`
            : "pick a price first, then a count, then a date."
        }`
    : perMonth
      ? `Nothing was written down, so use the arithmetic: ${perMonth} customers a month at around $${band.mid}. Ninety days to get there.`
      : "Nothing was written down and there is no price to work from. First number, then first date.";

  const risks: string[] = [];
  risks.push(band.risk);
  if (/still working/i.test(answers.edge || "") || !edge) {
    risks.push("No edge yet, so the work has to compete on looks, and looks are the cheapest thing to copy.");
  }
  if ((answers.proof || "").toLowerCase().includes("nothing yet") || !answers.proof) {
    risks.push("No proof yet. Spending the whole budget before one stranger has said yes is the most common way this goes wrong.");
  }
  const cr = pick(CONSTRAINT_RISK, answers.block || "");
  if (cr) risks.push(cr);
  if (!projectName) {
    risks.push("Nothing has a name, so nothing can be searched for, said out loud or repeated by anybody else.");
  }
  if (path && path.id === "system" && (answers.who || "").toLowerCase().includes("my team")) {
    risks.push("Team tools fail on adoption, not on features. Budget time for showing people, not just building.");
  }

  // Blanks are open questions too, but they are the boring kind, so only the
  // first few get a seat and the sharper ones keep theirs.
  const open: string[] = [];
  STEPS.filter((s) => !(answers[s.id] || "").trim())
    .slice(0, 2)
    .forEach((s) => open.push(`${s.q} Left blank, and it changes the shape of the work.`));
  if (/not sure|do not know|dunno/i.test(answers.who || "")) {
    open.push("Who pays is still open. Name one real person you could call this week and test the sentence on them.");
  }
  if (band === NO_PRICE) {
    open.push("What is the price? Pick a number, say it out loud, then see whether you flinch.");
  }
  open.push("What happens the day after somebody says yes? Who replies, how fast, and in what words?");
  open.push("What is the honest budget, and what does it have to earn back before it counts as working?");
  if (path && path.id !== "brand") {
    open.push("Who writes the words when the design is ready? That job lands on somebody, usually late.");
  }

  return {
    positioning,
    audience,
    arithmetic,
    evidence,
    scopeIn,
    scopeOut,
    constraint,
    measure,
    risks: risks.slice(0, 5),
    open: open.slice(0, 6),
  };
}

type Saved = {
  answers: Record<string, string>;
  path: string | null;
  step: number;
  started: string | null;
};

export default function WorkSession() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pathId, setPathId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [carried, setCarried] = useState<string[]>([]);
  // Saving, sending and downloading all finish silently, so they get said here.
  const [say, setSay] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let loadedAnswers: Record<string, string> = {};
    const p = loadJSON<Partial<Saved> | null>(KEY, null);
    if (p) {
      loadedAnswers = p.answers || {};
      setPathId(p.path || null);
      setStep(Math.min(p.step || 0, STEPS.length + 2));
      setStarted(p.started || null);
    }

    // The funnel asked six of these already. Carrying them over is the whole
    // difference between a session that respects your time and a form.
    const from = readFunnelAnswers();
    const map: Array<[string, "who" | "have" | "price" | "edge" | "block"]> = [
      ["who", "who"],
      ["now", "have"],
      ["money", "price"],
      ["edge", "edge"],
      ["block", "block"],
    ];
    const took: string[] = [];
    map.forEach(([stepId, funnelKey]) => {
      const v = (from[funnelKey] || "").trim();
      if (v && !(loadedAnswers[stepId] || "").trim()) {
        loadedAnswers[stepId] = v.charAt(0).toUpperCase() + v.slice(1);
        took.push(stepId);
      }
    });
    if (from.first && !loadedAnswers.first) loadedAnswers.first = from.first;
    setCarried(took);

    setAnswers(loadedAnswers);
    if (loadRaw(UNLOCK_KEY)) setUnlocked(true);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (saveJSON(KEY, { answers, path: pathId, step, started } as Saved)) {
        setSavedTick(true);
        window.setTimeout(() => setSavedTick(false), 1400);
      }
    }, 500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [answers, pathId, step, started, loaded]);

  const path = PATHS.find((p) => p.id === pathId) || null;
  const palette =
    PALETTES.find((p) => p.id === (answers.palette || "")) || PALETTES[2];
  const projectName = (answers.name || "").trim();
  const answered = STEPS.filter((s) => (answers[s.id] || "").trim()).length;
  const rank = RANKS[answered] || RANKS[0];
  const onPathPick = step === 1;
  const onSummary = step > STEPS.length + 1;
  const current = step >= 2 && step <= STEPS.length + 1 ? STEPS[step - 2] : null;

  // The artwork's fingerprint. Built from what they have actually said, so it
  // is theirs, it is reproducible, and it visibly changes as they go.
  // A fresh object literal every render restarted the whole particle system on
  // every keystroke. The identity now only changes when a colour does.
  const fieldColors = useMemo(
    () => ({ bg: palette.bg, a: palette.a, b: palette.b, ink: palette.ink }),
    [palette.bg, palette.a, palette.b, palette.ink]
  );

  const fieldSeed = `${pathId || "none"}|${palette.id}|${projectName}|${STEPS.map(
    (s) => (answers[s.id] || "").length
  ).join(",")}`;

  const stamp = () =>
    new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const choosePath = (p: Path) => {
    setPathId(p.id);
    if (!started) setStarted(stamp());
    setStep(2);
  };

  const addChip = (id: string, chip: string) => {
    const existing = (answers[id] || "").trim();
    setAnswers({ ...answers, [id]: existing ? `${existing}\n${chip}` : chip });
  };

  const doc = buildDoc(answers, path, projectName);

  /**
   * The document, as plain text. Same sections in the same order as the screen,
   * because somebody is going to paste this into an email to a developer and it
   * has to hold up on its own with none of the styling.
   */
  const brief = () =>
    [
      `PROJECT BRIEF: ${projectName || "Not named yet"}`,
      `Written in Flow Mode on flowzone.dev${started ? ", " + started : ""}`,
      `POSITIONING\n${doc.positioning}`,
      `THE AUDIENCE\n${doc.audience}`,
      `THE MONEY\n${doc.arithmetic}`,
      `EDGE AND PROOF\n${doc.evidence}`,
      `IN SCOPE\n${doc.scopeIn.map((x) => `- ${x}`).join("\n")}`,
      `NOT IN SCOPE\n${doc.scopeOut.map((x) => `- ${x}`).join("\n")}`,
      `THE CONSTRAINT\n${doc.constraint}`,
      `WHAT SUCCESS LOOKS LIKE\n${doc.measure}`,
      `RISKS\n${doc.risks.map((x) => `- ${x}`).join("\n")}`,
      `OPEN QUESTIONS\n${doc.open.map((x) => `- ${x}`).join("\n")}`,
      `DIRECTION\n${palette.name}${answers.feel ? `\n${(answers.feel || "").trim()}` : ""}`,
      path ? `SUGGESTED BUILD\n${path.build}\n${path.buildWhy}` : "",
      `IN THEIR OWN WORDS\n${STEPS.map(
        (s) => `${s.eyebrow.toUpperCase()}: ${s.q}\n${(answers[s.id] || "").trim() || "Left blank"}`
      ).join("\n\n")}`,
    ]
      .filter(Boolean)
      .join("\n\n");

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `My project brief${path ? ", " + path.build : ""}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nI worked through the session on your site and it wrote this brief. Here is where I landed.\n\n${brief()}\n\nThanks,\n`
  )}`;

  /** A send that never returns leaves Sending on screen forever. Eight seconds. */
  const postSignal = () => {
    try {
      return AbortSignal.timeout ? AbortSignal.timeout(FETCH_TIMEOUT) : undefined;
    } catch {
      return undefined;
    }
  };

  const unlock = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gateEmail)) {
      setGateErr("That does not look like an email address.");
      return;
    }
    setGateErr("");
    setUnlocked(true);
    saveRaw(UNLOCK_KEY, "1");
    // Best effort. A failed send must never block someone from their own work.
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        signal: postSignal(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: gateEmail,
          brief: brief(),
          name: projectName,
          path: path ? path.name : "",
          build: path ? path.build : "",
          source: "brief download",
        }),
      });
    } catch {
      /* ignore */
    }
    const go = pending;
    setPending(null);
    if (go === "image") window.setTimeout(() => downloadImage(), 60);
    if (go === "text") window.setTimeout(() => downloadText(), 60);
  };

  const downloadText = () => {
    downloadBlob(
      `FLOWZONE WORK SESSION\n${started ? "Started " + started : ""}\n\n${brief()}\n\nflowzone.dev\n`,
      "flowzone-brief.txt",
      "text/plain"
    );
    setSay("Your brief downloaded as a text file.");
  };

  const downloadImage = () => {
    const W = 1200;
    const pad = 72;
    const measureCtx = document.createElement("canvas").getContext("2d");
    if (!measureCtx) return;

    const wrap = (text: string, font: string, max: number) => {
      measureCtx.font = font;
      const out: string[] = [];
      text.split("\n").forEach((para) => {
        let line = "";
        para.split(" ").forEach((w) => {
          const test = line ? line + " " + w : w;
          if (measureCtx.measureText(test).width > max && line) {
            out.push(line);
            line = w;
          } else line = test;
        });
        out.push(line);
      });
      return out;
    };

    // The image gets the document, not the transcript. Somebody screenshots this
    // into a group chat, so it has to make the argument on its own.
    const sections: Array<{ head: string; color: string; body: string }> = [
      { head: "POSITIONING", color: "#4C7BE8", body: doc.positioning },
      { head: "THE AUDIENCE", color: "#F0845F", body: doc.audience },
      { head: "THE MONEY", color: "#34D399", body: doc.arithmetic },
      { head: "EDGE AND PROOF", color: "#5B9BF9", body: doc.evidence },
      { head: "IN SCOPE", color: "#5B8CFF", body: doc.scopeIn.map((x) => `- ${x}`).join("\n") },
      { head: "NOT IN SCOPE", color: "#647089", body: doc.scopeOut.map((x) => `- ${x}`).join("\n") },
      { head: "THE CONSTRAINT", color: "#E2703A", body: doc.constraint },
      { head: "WHAT SUCCESS LOOKS LIKE", color: "#22C55E", body: doc.measure },
      { head: "RISKS", color: "#FBBF24", body: doc.risks.map((x) => `- ${x}`).join("\n") },
      { head: "OPEN QUESTIONS", color: "#C6E4F8", body: doc.open.map((x) => `- ${x}`).join("\n") },
    ];

    const blocks: Array<{ t: string; kind: "eyebrow" | "body"; color: string }> = [];
    sections.forEach((s) => {
      blocks.push({ t: s.head, kind: "eyebrow", color: s.color });
      wrap(s.body, "300 26px Figtree, sans-serif", W - pad * 2).forEach((l) =>
        blocks.push({ t: l, kind: "body", color: "#C7CFDD" })
      );
    });

    const headH = 452;
    const footH = 132;
    const bodyH = blocks.reduce((h, b) => h + (b.kind === "eyebrow" ? 58 : 40), 0);

    const c = document.createElement("canvas");
    c.width = W;
    c.height = headH + bodyH + footH;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0C1424";
    ctx.fillRect(0, 0, c.width, c.height);

    // The same field their session grew, rendered still, across the top. This
    // is the part that makes the download theirs rather than a form printout.
    renderStill(
      ctx,
      W,
      240,
      hashSeed(fieldSeed),
      { bg: palette.bg, a: palette.a, b: palette.b, ink: palette.ink },
      answered / STEPS.length
    );
    const fade = ctx.createLinearGradient(0, 120, 0, 240);
    fade.addColorStop(0, "rgba(12,20,36,0)");
    fade.addColorStop(1, "#0C1424");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 120, W, 120);

    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "#1E3A8A");
    g.addColorStop(0.5, "#5B9BF9");
    g.addColorStop(1, "#C6E4F8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 6);

    ([["#1E3A8A", pad + 12], ["#5B9BF9", pad + 52], ["#C6E4F8", pad + 92]] as const).forEach(
      ([col, x]) => {
        ctx.beginPath();
        ctx.arc(x, 292, 12, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }
    );

    ctx.fillStyle = "#F1F3F7";
    ctx.font = "600 52px Figtree, sans-serif";
    ctx.fillText(projectName || "Project brief", pad, 356);
    ctx.font = "300 24px Figtree, sans-serif";
    ctx.fillStyle = "#8B94A3";
    ctx.fillText(
      path ? `Project brief · ${path.name}` : "Project brief",
      pad,
      396
    );

    let y = headH;
    blocks.forEach((b) => {
      if (b.kind === "eyebrow") {
        y += 18;
        ctx.font = "500 17px Figtree, sans-serif";
        ctx.fillStyle = b.color;
        ctx.fillText(b.t, pad, y);
        y += 40;
      } else {
        ctx.font = "300 26px Figtree, sans-serif";
        ctx.fillStyle = b.color;
        ctx.fillText(b.t, pad, y);
        y += 40;
      }
    });

    if (path) {
      ctx.font = "500 22px Figtree, sans-serif";
      ctx.fillStyle = path.color;
      ctx.fillText(`Suggested: ${path.build}`, pad, c.height - 84);
    }
    ctx.font = "500 20px Figtree, sans-serif";
    ctx.fillStyle = "#5B8CFF";
    ctx.fillText("flowzone.dev", pad, c.height - 44);

    downloadDataURL(c.toDataURL("image/png"), "flowzone-brief.png");
    setSay("Your brief downloaded as an image.");
  };

  const [saveEmail, setSaveEmail] = useState("");
  // Downloads are gated on an address. The session itself stays free and
  // nothing is sent anywhere until this point, but taking the finished brief
  // away is the moment the exchange is fair on both sides.
  const [unlocked, setUnlocked] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateErr, setGateErr] = useState("");
  const [pending, setPending] = useState<null | "image" | "text">(null);
  const [saveState, setSaveState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const saveByEmail = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(saveEmail)) {
      setSaveState("error");
      return;
    }
    setSaveState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        signal: postSignal(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: saveEmail,
          brief: brief(),
          name: projectName,
          path: path ? path.name : "",
          build: path ? path.build : "",
          source: "work session",
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSaveState("done");
      setSay("Sent. Check your inbox for the brief.");
    } catch {
      setSaveState("error");
      setSay("Could not reach the studio. Check the address and try again.");
    }
  };

  const reset = () => {
    setAnswers({});
    setPathId(null);
    setStep(0);
    setStarted(null);
    removeJSON(KEY);
    setSay("Session cleared. Starting over.");
  };

  // Path prompts first, generic ones behind them, deduped. Never an empty list.
  const chipsFor = (id: string) => {
    const fromPath = (path && path.chips[id]) || [];
    const merged = [...fromPath, ...(FALLBACK_CHIPS[id] || [])];
    return Array.from(new Set(merged)).slice(0, 6);
  };
  const hintFor = (s: Step) => (path && path.focus[s.id]) || s.hint;


  // Everything the visitor has decided so far, drawn as the thing itself.
  const VisionPanel = () => {
    const shownName = projectName || "Your thing";
    const dim = !projectName;
    return (
      <div className="lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
            Taking shape
          </p>
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
            Live
          </p>
        </div>

        <Tilt3D>
        <div
          className="rounded-2xl border border-rule overflow-hidden transition-colors duration-700"
          style={{
            background: palette.bg,
            transformStyle: "preserve-3d",
            boxShadow: "0 30px 60px -25px rgba(0,0,0,.75)",
          }}
        >
          {/* browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="w-2 h-2" style={{ background: palette.a }} />
            <span className="w-2 h-2" style={{ background: palette.b }} />
            <span className="w-2 h-2" style={{ background: "rgba(255,255,255,0.18)" }} />
            <span
              className="ml-2 text-[10px] tracking-wide truncate"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {projectName
                ? projectName.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com"
                : "yourthing.com"}
            </span>
          </div>

          {/* The hero image, generated from this session and nobody else's */}
          <div style={{ transform: "translateZ(14px)" }}>
            <GenerativeField
              seed={fieldSeed}
              colors={fieldColors}
              warp={answered / STEPS.length}
              height={132}
            />
          </div>

          <div className="p-6" style={{ minHeight: 240, transform: "translateZ(26px)" }}>
            {/* the mark, drawn from the palette */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-3.5 h-3.5 block" style={{ background: palette.a }} />
              <span className="w-3.5 h-3.5 block" style={{ background: palette.b }} />
              <span
                className="text-[15px] font-semibold tracking-tight transition-opacity duration-500"
                style={{ color: palette.ink, opacity: dim ? 0.35 : 1 }}
              >
                {shownName}
              </span>
            </div>

            {/* headline area */}
            <p
              className="text-[26px] leading-[1.1] font-semibold tracking-tight mb-3 transition-opacity duration-500"
              style={{ color: palette.ink, opacity: dim ? 0.25 : 1 }}
            >
              {path ? path.previewLine : "Your line goes here."}
            </p>
            <p
              className="text-[12px] leading-relaxed mb-6"
              style={{ color: palette.ink, opacity: 0.5 }}
            >
              {(answers.what || "").trim().slice(0, 110) ||
                "Your idea, in your own words, appears here as you type it."}
            </p>

            <div className="flex gap-2 mb-7">
              <span
                className="text-[11px] px-3 py-2 font-medium"
                style={{ background: palette.a, color: palette.bg }}
              >
                {path && path.id === "shop" ? "Shop now" : "Get in touch"}
              </span>
              <span
                className="text-[11px] px-3 py-2 font-medium"
                style={{ border: `1px solid ${palette.ink}33`, color: palette.ink }}
              >
                Learn more
              </span>
            </div>

            {/* the body of the mock changes with the path */}
            {path && path.id === "shop" && (
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <div
                      className="w-full mb-1.5"
                      style={{
                        height: 62,
                        background: i === 1 ? palette.a : `${palette.ink}12`,
                        opacity: i === 1 ? 0.85 : 1,
                      }}
                    />
                    <div className="w-3/4 h-1.5 mb-1" style={{ background: `${palette.ink}26` }} />
                    <div className="w-1/3 h-1.5" style={{ background: palette.b }} />
                  </div>
                ))}
              </div>
            )}

            {path && path.id === "system" && (
              <div className="space-y-2">
                {[
                  ["New enquiry", palette.a],
                  ["Booking confirmed", palette.b],
                  ["Invoice paid", palette.a],
                ].map(([label, col], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2.5"
                    style={{ background: `${palette.ink}0D` }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 block" style={{ background: col as string }} />
                      <span className="text-[11px]" style={{ color: palette.ink, opacity: 0.75 }}>
                        {label as string}
                      </span>
                    </span>
                    <span className="text-[10px]" style={{ color: palette.ink, opacity: 0.35 }}>
                      auto
                    </span>
                  </div>
                ))}
              </div>
            )}

            {path && (path.id === "brand" || path.id === "site") && (
              <div className="space-y-2.5">
                <div className="w-full h-1.5" style={{ background: `${palette.ink}1F` }} />
                <div className="w-5/6 h-1.5" style={{ background: `${palette.ink}1F` }} />
                <div className="w-2/3 h-1.5" style={{ background: `${palette.ink}1F` }} />
                <div className="flex gap-2 pt-3">
                  <span className="w-10 h-10 block" style={{ background: palette.a }} />
                  <span className="w-10 h-10 block" style={{ background: palette.b }} />
                  <span className="w-10 h-10 block" style={{ background: `${palette.ink}1A` }} />
                </div>
              </div>
            )}

            {!path && (
              <div className="space-y-2.5">
                <div className="w-full h-1.5" style={{ background: `${palette.ink}14` }} />
                <div className="w-4/6 h-1.5" style={{ background: `${palette.ink}14` }} />
              </div>
            )}
          </div>
        </div>
        </Tilt3D>

        {/* the palette strip */}
        <div className="rounded-2xl border border-rule border-t-0 px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
            {palette.name}
          </p>
          <div className="flex gap-1.5">
            {[palette.a, palette.b, palette.ink, palette.bg].map((c) => (
              <span
                key={c}
                className="w-4 h-4 block border border-rule transition-colors duration-500"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
          A sketch, not a promise. The artwork at the top is generated from your
          own answers, so nobody else has this one, and the currents reorganise
          every time you answer another question.
        </p>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Saves, sends and downloads all land silently. Not any more. */}
      <p aria-live="polite" className="sr-only">
        {say}
      </p>
      <div className="lg:col-span-7 panel overflow-hidden">
      {/* Session bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-rule bg-paper-deep">
        <div className="flex items-center gap-3">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 bg-accent" />
          </span>
          <p className="text-[11px] font-medium uppercase tracking-label text-ink-soft">
            {path ? path.name : started ? "Session in progress" : "Work session"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className="w-3.5 h-[3px] block transition-colors duration-300"
                style={{
                  background: (answers[s.id] || "").trim() ? s.color : "#26355A",
                }}
              />
            ))}
          </div>
          <p
            className="text-[11px] font-medium uppercase tracking-label transition-colors duration-300"
            style={{ color: rank.color }}
          >
            {rank.label}
          </p>
        </div>
      </div>

      <div className="p-7 md:p-10">
        {/* Intro */}
        {step === 0 && (
          <div>
            <h3 className="font-display text-3xl md:text-4xl mb-4">
              Flow through the zone with your thoughts.
            </h3>
            <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-3">
              Pick where you are starting from and the session narrows to your idea.
              Different starting points get different questions, different prompts and
              a different answer at the end.
            </p>
            <p className="text-sm text-ink-mute font-light leading-relaxed max-w-reading mb-8">
              Nine questions after that, and none of them are decoration. Who pays,
              what they pay, why you and not the next one. Tap the answers if you
              like, typing is optional. It saves as you go, so close the tab whenever
              you want. Nothing is sent anywhere until you decide to send it.
            </p>
            <button onClick={() => setStep(1)} className="btn-primary">
              {started ? "Pick up where you left off" : "Start the session"}{" "}
              <span className="arrow">→</span>
            </button>
          </div>
        )}

        {/* First decision, which narrows everything after it */}
        {onPathPick && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon name="compass" size={22} color="#5B8CFF" />
              <p className="text-[11px] font-medium uppercase tracking-label text-accent">
                First decision
              </p>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3">
              Where are you starting from?
            </h3>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading mb-8">
              This is the only question with fixed answers. Everything after it adapts
              to what you pick here.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {PATHS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choosePath(p)}
                  className="text-left border border-rule p-6 hover:bg-raised transition-colors group relative overflow-hidden"
                >
                  <span
                    className="absolute top-0 left-0 h-[3px] w-full opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: p.color }}
                  />
                  <span className="block mb-4 mt-1 leading-none">
                    <Icon name={p.icon} size={26} color={p.color} />
                  </span>
                  <p className="font-display text-xl mb-2">{p.name}</p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {p.blurb}
                  </p>
                </button>
              ))}
            </div>

            {pathId && (
              <button
                onClick={() => setStep(2)}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised mt-6"
              >
                Keep my current path <span className="arrow">→</span>
              </button>
            )}
          </div>
        )}

        {/* Questions */}
        {current && !onSummary && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Icon name={current.icon} size={22} color={current.color} />
              <p
                className="text-[11px] font-medium uppercase tracking-label"
                style={{ color: current.color }}
              >
                {current.eyebrow} · {step - 1} of {STEPS.length}
              </p>
            </div>

            {step === 2 && (
              <div className="mb-7 pb-7 border-b border-rule">
                <label
                  htmlFor="fz-name"
                  className="block text-sm mb-2"
                  style={{ color: "#5B8CFF" }}
                >
                  What is it called?
                </label>
                <p className="text-[13px] text-ink-mute font-light mb-2.5">
                  A working name is fine. Watch it appear in the sketch.
                </p>
                <input
                  id="fz-name"
                  value={answers.name || ""}
                  onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                  placeholder="Working name"
                  className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                />
              </div>
            )}

            <h3 className="font-display text-2xl md:text-3xl mb-3">{current.q}</h3>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading mb-6">
              {hintFor(current)}
            </p>

            {carried.includes(current.id) && (
              <p
                className="text-[12px] font-light mb-5 border-l-2 pl-3"
                style={{ borderColor: current.color, color: "#8B94A3" }}
              >
                You answered this upstairs, so we brought it down. Change it if it
                was a guess.
              </p>
            )}

            {current.id === "feel" && (
              <div className="mb-6">
                <p className="label mb-3">Pick a direction and watch it change</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setAnswers({
                          ...answers,
                          palette: p.id,
                          feel: (answers.feel || "").includes(p.name)
                            ? answers.feel
                            : ((answers.feel || "").trim()
                                ? (answers.feel || "").trim() + "\n"
                                : "") + p.name,
                        });
                      }}
                      className="border p-3 text-left transition-colors"
                      style={{
                        borderColor: answers.palette === p.id ? p.a : "#26355A",
                        background: answers.palette === p.id ? "rgba(255,255,255,0.03)" : "transparent",
                      }}
                    >
                      <span className="flex gap-1 mb-2.5">
                        <span className="w-4 h-4 block" style={{ background: p.a }} />
                        <span className="w-4 h-4 block" style={{ background: p.b }} />
                        <span className="w-4 h-4 block" style={{ background: p.bg, border: "1px solid #26355A" }} />
                      </span>
                      <span className="block text-[11px] text-ink-soft leading-snug">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chipsFor(current.id).length > 0 && (
              <>
              <p className="text-[11px] text-ink-mute font-light mb-2.5">
                Tap what fits. You never have to type a word here.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {chipsFor(current.id).map((c) => (
                  <button
                    key={c}
                    onClick={() => addChip(current.id, c)}
                    className="text-xs border border-rule text-ink-soft px-3.5 py-2 hover:text-ink hover:bg-raised transition-colors"
                  >
                    + {c}
                  </button>
                ))}
              </div>
              </>
            )}

            <VoiceSession
              question={current.q}
              hint={hintFor(current)}
              value={answers[current.id] || ""}
              onTranscript={(next) => setAnswers({ ...answers, [current.id]: next })}
              accent={current.color}
            />

            <textarea
              rows={current.rows}
              aria-label={current.q}
              value={answers[current.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder="In your own words, or press the mic and just say it..."
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none"
            />

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setStep(step - 1)}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                {/* Rendered only when it is true. Nothing on this site sits on
                    the page at zero opacity waiting for its turn. */}
                {savedTick && (
                  <span className="text-[11px] uppercase tracking-label text-accent">
                    Saved
                  </span>
                )}
                <button onClick={() => setStep(step + 1)} className="btn-primary">
                  {step === STEPS.length + 1 ? "See the brief" : "Next"}{" "}
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {onSummary && (
          <div>
            <div
              className="inline-flex items-center gap-2.5 border px-3.5 py-2 mb-6"
              style={{ borderColor: rank.color }}
            >
              <Icon
                name={answered === STEPS.length ? "trophy" : "bolt"}
                size={16}
                color={rank.color}
              />
              <span
                className="text-[11px] font-medium uppercase tracking-label"
                style={{ color: rank.color }}
              >
                {answered === STEPS.length
                  ? `All ${STEPS.length} answered · Ready to build`
                  : `${answered} of ${STEPS.length} answered · ${rank.label}`}
              </span>
            </div>

            <h3 className="font-display text-3xl md:text-4xl mb-3">
              {answered === STEPS.length
                ? "This is a brief now."
                : "Already more than most people arrive with."}
            </h3>
            <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-9">
              Not a summary of what you said. A position, a scope, a number and the
              questions you still have to go and answer. Hand it to any designer,
              developer or agency and they can quote it. Or send it here and you get
              back a scope, a price and a date.
            </p>

            {/* The document. Written in the same voice we would write it in if
                somebody had paid for the hour. */}
            <div className="border border-rule p-7 md:p-8 mb-9">
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute mb-2">
                Project brief
              </p>
              <p className="font-display text-3xl md:text-4xl mb-6">
                {projectName || "Not named yet"}
              </p>

              <div className="space-y-7">
                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#4C7BE8" }}
                  >
                    Positioning
                  </p>
                  <p className="text-[15px] text-ink font-light leading-relaxed">
                    {doc.positioning}
                  </p>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#F0845F" }}
                  >
                    The audience
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {doc.audience}
                  </p>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#34D399" }}
                  >
                    The money
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {doc.arithmetic}
                  </p>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#5B9BF9" }}
                  >
                    Edge and proof
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {doc.evidence}
                  </p>
                </section>

                <section className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p
                      className="text-[11px] font-medium uppercase tracking-label mb-2"
                      style={{ color: "#5B8CFF" }}
                    >
                      In scope
                    </p>
                    <ul className="space-y-1.5">
                      {doc.scopeIn.map((x) => (
                        <li
                          key={x}
                          className="text-sm text-ink-soft font-light leading-relaxed pl-4 relative"
                        >
                          <span
                            className="absolute left-0 top-[9px] w-1.5 h-1.5 block"
                            style={{ background: "#5B8CFF" }}
                          />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-label mb-2 text-ink-mute">
                      Not in this build
                    </p>
                    <ul className="space-y-1.5">
                      {doc.scopeOut.map((x) => (
                        <li
                          key={x}
                          className="text-sm text-ink-mute font-light leading-relaxed pl-4 relative"
                        >
                          <span className="absolute left-0 top-[11px] w-2 h-px block bg-ink-mute" />
                          {x}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                      Out of scope is the half that saves the argument later. Add to it
                      before you add to the other side.
                    </p>
                  </div>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#E2703A" }}
                  >
                    The constraint
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {doc.constraint}
                  </p>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#22C55E" }}
                  >
                    What success looks like
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {doc.measure}
                  </p>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#FBBF24" }}
                  >
                    Risks
                  </p>
                  <ul className="space-y-1.5">
                    {doc.risks.map((x) => (
                      <li
                        key={x}
                        className="text-sm text-ink-soft font-light leading-relaxed pl-4 relative"
                      >
                        <span
                          className="absolute left-0 top-[9px] w-1.5 h-1.5 block"
                          style={{ background: "#FBBF24" }}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-2"
                    style={{ color: "#C6E4F8" }}
                  >
                    Open questions
                  </p>
                  <p className="text-[12px] text-ink-mute font-light mb-2.5">
                    Nobody can answer these for you. They are the difference between a
                    quote and a guess.
                  </p>
                  <ul className="space-y-1.5">
                    {doc.open.map((x) => (
                      <li
                        key={x}
                        className="text-sm text-ink-soft font-light leading-relaxed pl-4 relative"
                      >
                        <span
                          className="absolute left-0 top-[9px] w-1.5 h-1.5 block"
                          style={{ background: "#C6E4F8" }}
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <p className="text-[11px] font-medium uppercase tracking-label mb-2 text-ink-mute">
                    Direction
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                      {[palette.a, palette.b, palette.ink, palette.bg].map((c) => (
                        <span
                          key={c}
                          className="w-4 h-4 block border border-rule"
                          style={{ background: c }}
                        />
                      ))}
                    </span>
                    <p className="text-sm text-ink-soft font-light">{palette.name}</p>
                  </div>
                </section>
              </div>
            </div>

            {path && (
              <div
                className="border p-7 mb-9"
                style={{ borderColor: path.color, background: "rgba(255,255,255,0.02)" }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-label mb-3"
                  style={{ color: path.color }}
                >
                  Based on where you started
                </p>
                <p className="font-display text-3xl mb-3">{path.build}</p>
                <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading">
                  {path.buildWhy}
                </p>
                {answers.first && (
                  <p className="text-[12px] text-ink-mute font-light leading-relaxed max-w-reading mt-3">
                    Upstairs you said {answers.first} should exist first. That still
                    holds, as long as it moves the constraint above. If it does not,
                    it is a nice thing to own and not the first thing to buy.
                  </p>
                )}
              </div>
            )}

            {/* The raw answers stay on the page. The document has a point of
                view, and anybody reading it deserves to see what it was built
                from. */}
            <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute mb-4">
              In your own words
            </p>
            <div className="space-y-5 mb-9">
              {STEPS.map((s) => (
                <div key={s.id} className="border-l-2 pl-5" style={{ borderColor: s.color }}>
                  <p
                    className="text-[11px] font-medium uppercase tracking-label mb-1.5"
                    style={{ color: s.color }}
                  >
                    {s.eyebrow}
                  </p>
                  <p className="text-sm text-ink-soft font-light leading-relaxed whitespace-pre-line">
                    {(answers[s.id] || "").trim() || "Left blank"}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-rule p-6 mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-1.5 bg-accent block" />
                <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
                  Save it to your email
                </p>
              </div>
              {saveState === "done" ? (
                <p className="text-sm text-ink-soft font-light leading-relaxed">
                  Sent. Your brief is in your inbox, and it is yours to keep. Reply to
                  it whenever you want us to build it.
                </p>
              ) : (
                <>
                  <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
                    Right now this only exists in this browser. Clear your history and
                    it is gone. Send yourself a copy you actually own.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      aria-label="Your email address"
                      value={saveEmail}
                      onChange={(e) => {
                        setSaveEmail(e.target.value);
                        if (saveState === "error") setSaveState("idle");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && saveByEmail()}
                      placeholder="you@example.com"
                      className="flex-1 min-w-0 bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                    />
                    <button
                      onClick={saveByEmail}
                      disabled={saveState === "sending"}
                      className="btn-primary shrink-0 disabled:opacity-50"
                    >
                      {saveState === "sending" ? "Sending..." : "Email it to me"}
                    </button>
                  </div>
                  {saveState === "error" && (
                    <p className="text-[12px] text-[#FBBF24] mt-2.5">
                      Could not reach the studio. Check the address, or use the download buttons
                      below instead.
                    </p>
                  )}
                  <p className="text-[12px] text-ink-mute font-light mt-3">
                    One email with your brief in it. You can also just download it below
                    and give us nothing, which is a completely fine choice.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-rule">
              <a href={mailto} className="btn-primary">
                Send this brief <span className="arrow">→</span>
              </a>
              <button
                onClick={() => (unlocked ? downloadImage() : setPending("image"))}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised"
              >
                Save as image
              </button>
              <button
                onClick={() => (unlocked ? downloadText() : setPending("text"))}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised"
              >
                Save as text
              </button>
              <button
                onClick={() => setStep(STEPS.length + 1)}
                className="btn text-ink-mute hover:text-ink !px-3"
              >
                Keep editing
              </button>
              <button onClick={reset} className="btn text-ink-mute hover:text-ink !px-3">
                Start over
              </button>
            </div>

            {pending && !unlocked && (
              <div className="mt-5 border border-accent p-6 bg-paper-deep">
                <p className="font-display text-xl mb-2">Where should it go?</p>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-4 max-w-reading">
                  The brief is yours either way, and the session never left your browser.
                  Leave an address and the download starts straight away, plus a copy lands
                  in your inbox so it is not trapped in one tab.
                </p>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="email"
                    aria-label="Your email address"
                    value={gateEmail}
                    onChange={(e) => {
                      setGateEmail(e.target.value);
                      if (gateErr) setGateErr("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && unlock()}
                    placeholder="you@example.com"
                    className="flex-1 min-w-[220px] bg-paper text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                  />
                  <button onClick={unlock} className="btn-primary !px-5 !py-3 text-xs">
                    Get the brief <span className="arrow">→</span>
                  </button>
                  <button
                    onClick={() => setPending(null)}
                    className="btn text-ink-mute hover:text-ink-soft !px-3 text-xs"
                  >
                    Not now
                  </button>
                </div>
                {gateErr && <p className="text-[12px] text-[#FBBF24] mt-2.5">{gateErr}</p>}
                <p className="text-[11px] text-ink-mute font-light mt-3">
                  One email with your brief in it. You can still send it straight to us
                  with the button above and skip this entirely.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {started && (
        <div className="px-6 py-3 border-t border-rule bg-paper-deep">
          <p className="text-[11px] text-ink-mute font-light">
            Session started {started} · saved in this browser · {answered} of{" "}
            {STEPS.length} answered
          </p>
        </div>
      )}
      </div>

      <div className="lg:col-span-5">
        <VisionPanel />
      </div>
    </div>
  );
}
