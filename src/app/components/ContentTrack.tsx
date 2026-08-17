"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MemeMaker from "@/app/components/MemeMaker";
import AskAboutThis, { askBody } from "@/app/components/AskAboutThis";
import {
  copyOrDownload,
  downloadBlob,
  fetchJSON,
  loadJSON,
  readFunnelAnswers,
  readIdea,
  saveJSON,
} from "@/lib/session";

/**
 * Planning a short video, for somebody who has never planned one.
 *
 * Two things drive every decision in here. The words are the words a normal
 * person uses: scenes, what you say, what we see, words on screen. Nobody
 * outside the industry says "beat" or "B-roll", and jargon is the fastest way
 * to make someone feel this tool is not for them.
 *
 * And the plan is not a template with their words dropped in. Upstairs on this
 * page they already told us who pays, what exists, what a customer is worth,
 * why them, and what is in the way. Those five answers change what the camera
 * should point at, what counts as proof and what the ask can reasonably be, so
 * they are read straight out of localStorage and used everywhere. When they are
 * missing the plan still works, it just gets a nudge to go answer them.
 *
 * Everything generates here in the browser. No key, no request, no waiting, no
 * dead button on a bad train connection.
 */

const KEY = "flowzone.content.v3";

type Scene = {
  id: string;
  secs: number;
  role: string;
  frame: string;
  say: string;
  show: string;
  text: string;
};

type Answers = Partial<Record<"who" | "have" | "price" | "edge" | "block" | "first", string>>;

/**
 * The read. Everything the generator needs, already turned into plain sentences
 * so the builders below stay about structure instead of about lookups.
 */
type Read = {
  subject: string;
  theThing: string;
  aThing: string;
  keyword: string;
  them: string;
  place: string;
  job: string;
  point: string;
  proof: string;
  ask: string;
  askSay: string;
  askText: string;
  known: boolean;
};

// ---- Turning the funnel answers into camera decisions ---------------------

/** Who is on the other end of the phone, and where this gets posted. */
const WHO: Record<string, { them: string; place: string }> = {
  "people nearby": {
    them: "somebody who lives ten minutes away and has never heard of you",
    place: "Instagram Reels first, location tag on, then the same file to TikTok",
  },
  "people online": {
    them: "a stranger who is three seconds from scrolling past",
    place: "TikTok first, it moves strangers fastest, then Reels",
  },
  "other businesses": {
    them: "the one person at that company who signs off on spend",
    place: "LinkedIn first, then Reels. Same footage, different caption",
  },
  "not sure yet": {
    them: "one specific person you have already met",
    place: "Reels and TikTok both, and watch which one gets saves",
  },
};

/** What is in the way decides what this particular video has to do. */
const JOB: Record<string, string> = {
  "nobody knows it exists":
    "This one is for reach. The first second does all the work and your name goes on screen inside three.",
  "it looks amateur":
    "This one buys trust. Steady phone, one clean frame, no clutter behind you. The video is the proof.",
  "I cannot explain it fast":
    "This one is the sentence. If a friend can repeat your first line back to you, it worked.",
  "no time to build it":
    "Film it in one pass while you are already doing the work. No second shoot, no set up.",
  "no money to spend":
    "It costs nothing to make, so it has to sell. Put the ask in words on screen, not only in your voice.",
};

/** The edge decides where the lens points. */
const POINT: Record<string, string> = {
  "nobody near me does it":
    "Say the town out loud in the first line. Being the only one nearby is the hook.",
  "it is better made":
    "Better made only counts if we see it. Get the phone close enough to read the texture.",
  "it is cheaper": "Put the price on screen early. Do not make anybody ask for it.",
  "I am the reason":
    "Your face carries this one. Straight into the lens, your own voice, no music over the top.",
  "still working that out":
    "No edge decided yet, so film the work itself. Process is interesting long before positioning is.",
};

/** What exists decides what counts as proof on camera. */
const PROOF: Record<string, string> = {
  "just the idea":
    "Nothing exists yet, so the video is the proof. Film yourself making the very first one.",
  "an audience":
    "You already own the attention, which is the expensive half. Spend it. The ask goes early, not only at the end.",
  "a name and a look":
    "You have the surface. Put the name on screen in the first second and show one real thing underneath it.",
  "paying customers":
    "You have proof nearly nobody else has. A real order, a real receipt, a regular saying the usual.",
};

/** What one customer is worth decides what you are allowed to ask for. */
const ASK: Record<string, { ask: string; text: string; say: string }> = {
  "under $20": {
    ask: "Follow is the whole ask at this price. You need volume, and volume comes from being seen again.",
    text: "Follow for the next one",
    say: "Follow if you want the next one, we do this every week.",
  },
  "$20 to $100": {
    ask: "Ask for the save. Saves are what get this pushed at strangers, and strangers are your growth.",
    text: "Save this for later",
    say: "Save this, you will want it the next time you need one.",
  },
  "$100 to $1,000": {
    ask: "Ask for one message, not a follow. At this price one conversation is worth more than a thousand views.",
    text: "Comment PRICE",
    say: "Comment the word PRICE and I will send the details straight over.",
  },
  "over $1,000": {
    ask: "You need one right person, not an audience. Ask for a conversation and make it easy to start.",
    text: "Send me a message",
    say: "If this is your kind of thing, message me and we will talk properly.",
  },
  "nothing yet": {
    ask: "No price yet, so use the post to find one. Ask the question you actually need answered.",
    text: "What would you pay?",
    say: "Genuine question. What would you pay for this? I am still working it out.",
  },
};

const STOPWORDS = new Set([
  "a", "an", "the", "my", "our", "your", "this", "that", "these", "those", "and", "or", "but",
  "for", "with", "from", "into", "about", "how", "why", "what", "we", "i", "you", "they",
  "it", "its", "to", "of", "in", "on", "at", "is", "are", "was", "were", "be", "been",
  "people", "person", "thing", "things", "make", "makes", "made", "new", "just", "really",
]);

/** Strip the throat clearing off the front of what somebody typed. */
function cleanTopic(raw: string): string {
  const t = raw.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return t
    .replace(/^(so |basically |it is |its |it's )/i, "")
    .replace(/^how (we|i|you) /i, "")
    .replace(/^(a|an|the|my|our) /i, "")
    .trim();
}

/**
 * The head of what they typed, so sentences read like sentences. People type
 * whole thoughts, "a bakery people cross town for", and dropping that into
 * "watch X come together" is how a generator gives itself away. Cut it back to
 * the noun, "bakery", and every line below survives contact with real input.
 */
const CUT_AT = new Set([
  "that", "who", "which", "where", "when", "people", "for", "with", "and", "to", "in", "on",
  "so", "but", "from", "everyone", "you", "they", "because", "while", "after", "before", "of",
]);

function headOf(subject: string): string {
  const s = subject.toLowerCase().replace(/[.!?,]+$/, "");
  const out: string[] = [];
  for (const w of s.split(/\s+/).filter(Boolean)) {
    if (CUT_AT.has(w) && out.length) break;
    out.push(w);
    if (out.length === 4) break;
  }
  // "redid a shop logo" is really "shop logo". Anything before an article is
  // somebody clearing their throat.
  const kept = out.join(" ");
  const afterArticle = kept.match(/^.*?\b(?:a|an|the|my|our|your)\s+(.+)$/);
  return (afterArticle ? afterArticle[1] : kept).trim();
}

/** Plurals and words that already carry a determiner do not want another one. */
function bare(h: string): boolean {
  return h === "this" || /^(the|a|an|my|our|your)\b/.test(h) || (/s$/.test(h) && !/ss$/.test(h));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const withThe = (h: string) => (bare(h) ? h : `the ${h}`);
const withA = (h: string) => (bare(h) ? h : `${/^[aeiou]/.test(h) ? "an" : "a"} ${h}`);

/**
 * One distinctive word, for hashtags and for the shot of the thing on its own.
 * It comes off the head rather than the whole sentence, because the whole
 * sentence gives you #redid and nobody follows that tag.
 */
function keywordOf(head: string): string {
  const words = head
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (!words.length) return "";
  // #line and #business are dead tags. Step back a word and take the real noun.
  const weak = new Set(["line", "work", "stuff", "business", "brand", "idea", "project"]);
  for (let i = words.length - 1; i >= 0; i--) if (!weak.has(words[i])) return words[i];
  return words[words.length - 1];
}

function buildRead(topic: string, a: Answers): Read {
  const subject = cleanTopic(topic) || "this";
  // Nothing typed yet, so the plan talks about "the work" and still reads right.
  const head = topic.trim() ? headOf(subject) : "";
  const who = WHO[a.who || ""] || WHO["not sure yet"];
  const money = ASK[a.price || ""] || ASK["nothing yet"];
  return {
    subject,
    theThing: head ? withThe(head) : "the work",
    aThing: head ? withA(head) : "this",
    keyword: keywordOf(head),
    them: who.them,
    place: who.place,
    job:
      JOB[a.block || ""] ||
      "Right now this video has one job: make one stranger care enough to watch to the end.",
    point:
      POINT[a.edge || ""] ||
      "Point the camera at the part you are proudest of. That is usually the right answer.",
    proof:
      PROOF[a.have || ""] ||
      "Show one real thing that already exists, however small. Real beats polished every time.",
    ask: money.ask,
    askSay: money.say,
    askText: money.text,
    known: Boolean(a.who || a.have || a.price || a.edge || a.block),
  };
}

// ---- Hooks, by mechanic ---------------------------------------------------

type Hook = { mechanic: string; why: string; line: string; text: string };

/**
 * Six mechanics, named, so somebody can pick with taste instead of picking the
 * first one. Every line here is sayable out loud in under two seconds, because
 * two seconds is all the first shot gets.
 */
function buildHooks(r: Read, v: number): Hook[] {
  const t = r.theThing;
  const an = r.aThing;
  const pick = <T,>(arr: T[]) => arr[v % arr.length];
  return [
    {
      mechanic: "The mistake",
      why: "People stay for anything that might mean they are the one getting it wrong.",
      line: pick([
        `Almost everybody makes the same mistake with ${an}.`,
        `The mistake people make with ${an} costs them money every week.`,
        `If ${t} looks like this, stop.`,
      ]),
      text: pick(["You are doing it wrong", "The common mistake", "Stop doing this"]),
    },
    {
      mechanic: "The number",
      why: "A number promises the video ends. That promise is what buys you the next ten seconds.",
      line: pick([
        `Three things nobody tells you about ${an}.`,
        `${cap(t)}, start to finish, in thirty seconds.`,
        `This took eleven hours. Here is the short version.`,
      ]),
      text: pick(["3 things", "Start to finish", "11 hours, 30 seconds"]),
    },
    {
      mechanic: "The before and after",
      why: "The eye finishes the story before the ear starts. Nothing stops a scroll faster.",
      line: pick([
        `This is ${t} before. Watch what it turns into.`,
        `Same thing, twenty minutes apart.`,
        `Nobody believes this is the same one.`,
      ]),
      text: pick(["Before", "20 minutes apart", "Same thing"]),
    },
    {
      mechanic: "The confession",
      why: "Nobody scrolls past somebody admitting something. It reads as true because it costs you.",
      line: pick([
        `I got ${t} wrong for a year before this clicked.`,
        `Nobody knew we existed. Here is what changed that.`,
        `I nearly gave up on ${t} in March.`,
      ]),
      text: pick(["I got it wrong", "What changed it", "Nearly quit"]),
    },
    {
      mechanic: "The demonstration",
      why: "No claim to argue with. The hands do the talking and people watch hands.",
      line: pick([
        `No talking. Just watch ${t} come together.`,
        `Here is exactly how ${t} gets made.`,
        `Sound on for this bit.`,
      ]),
      text: pick(["No talking", "How it is done", "Sound on"]),
    },
    {
      mechanic: "The question",
      why: "A question opens a loop, and an open loop is uncomfortable to scroll away from.",
      line: pick([
        `Would you pay for this? Watch first, then tell me.`,
        `Why does ${t} cost what it costs? Here.`,
        `Which one of these would you pick?`,
      ]),
      text: pick(["Would you pay?", "Why it costs that", "Which one?"]),
    },
  ];
}

// ---- The formats, which are genuinely different -------------------------

type Format = {
  name: string;
  blurb: string;
  unit: "sec" | "slide";
  build: (r: Read, v: number) => Array<Omit<Scene, "id">>;
};

const FORMATS: Record<string, Format> = {
  reel15: {
    name: "15 seconds, scroll stopper",
    blurb: "One idea, no room for a second. Post this when nobody knows you yet.",
    unit: "sec",
    build: (r, v) => {
      const h = buildHooks(r, v)[v % 6];
      return [
        {
          secs: 2,
          role: "The stop",
          frame: "Vertical. Phone in one hand, arm's length, moving slightly. No face yet.",
          show: `The single best looking second you own. ${r.point}`,
          say: h.line,
          text: h.text,
        },
        {
          secs: 4,
          role: "The promise",
          frame: "Locked off. Stand the phone against a mug or a shelf, chest up, window in front of you.",
          show: "You, once, so there is a human in it. Then cut back to the thing.",
          say: `Here is the whole of ${r.theThing} in ten seconds.`,
          text: "Watch this bit",
        },
        {
          secs: 6,
          role: "The payoff",
          frame: "Close. Phone about a foot from the work, both hands in frame, let it wobble a little.",
          show: `The good part, uncut. ${r.proof}`,
          say: "Say nothing here. Let the sound of the actual thing carry it.",
          text: "No caption needed",
        },
        {
          secs: 3,
          role: "The ask",
          frame: "Back to the locked off shot. You, still, looking down the lens.",
          show: "Your face, or your name written on something in the room.",
          say: r.askSay,
          text: r.askText,
        },
      ];
    },
  },

  reel30: {
    name: "30 seconds, the proof",
    blurb: "Enough room to show one thing properly. The workhorse. Start here.",
    unit: "sec",
    build: (r, v) => {
      const h = buildHooks(r, v)[(v + 1) % 6];
      return [
        {
          secs: 2,
          role: "The stop",
          frame: "Vertical, handheld, close. Frame full of the thing itself, nothing tidy behind it.",
          show: `Movement in the first frame. Something entering, opening, pouring, being picked up.`,
          say: h.line,
          text: h.text,
        },
        {
          secs: 5,
          role: "The promise",
          frame: "Locked off, phone propped at chest height, you an arm's length away so the mic gets you.",
          show: "You, talking straight down the lens. One breath, no throat clearing.",
          say: `Stay twenty seconds and you see the whole of ${r.theThing}.`,
          text: "Stay 20 seconds",
        },
        {
          secs: 8,
          role: "The turn",
          frame: "New angle. Get low, or shoot straight down over the work. Anything but the last shot.",
          show: `The part people assume is easy and is not. ${r.point}`,
          say: "The bit everyone underestimates, said in one sentence.",
          text: "The hard part",
        },
        {
          secs: 10,
          role: "The payoff",
          frame: "Close and steady. Rest your elbows on something. Two shots, cut between them.",
          show: `The finished thing, then the proof. ${r.proof}`,
          say: "What it does for the person who gets it. Not what it is made of.",
          text: "Here it is",
        },
        {
          secs: 5,
          role: "The ask",
          frame: "Back to the locked off shot, same framing as the promise so it feels like a return.",
          show: "You, or your hands holding the finished thing up.",
          say: r.askSay,
          text: r.askText,
        },
      ];
    },
  },

  reel60: {
    name: "60 seconds, teach one thing",
    blurb: "Builds trust faster than anything else you can post. Needs a reset in the middle.",
    unit: "sec",
    build: (r, v) => {
      const h = buildHooks(r, v)[(v + 3) % 6];
      return [
        {
          secs: 3,
          role: "The stop",
          frame: "Vertical, handheld, already moving when the recording starts. Never start on a still frame.",
          show: "The mistake, or the mess, on screen before anybody hears a word.",
          say: h.line,
          text: h.text,
        },
        {
          secs: 5,
          role: "The promise",
          frame: "Locked off, chest up, window light on your face. Phone close enough to hear you clearly.",
          show: "You, saying exactly what they walk away with.",
          say: `By the end of this you can do ${r.theThing} yourself.`,
          text: "You will be able to do this",
        },
        {
          secs: 10,
          role: "Step one",
          frame: "Overhead. Phone flat above the work, propped on a shelf or held by somebody else.",
          show: "The first move, done slowly enough to copy.",
          say: "One instruction. No history, no story, no why yet.",
          text: "1",
        },
        {
          secs: 8,
          role: "The reset",
          frame: "Change everything. Different room, different distance, or cut to your face mid sentence.",
          show: "This exists because people leave around twenty seconds. Give the eye something new.",
          say: "The thing that surprised you when you learned this.",
          text: "Nobody told me this",
        },
        {
          secs: 14,
          role: "Step two",
          frame: "Close, handheld, following the work. Move the phone with your hands, not around them.",
          show: `The part that actually matters. ${r.point}`,
          say: "The real instruction. Slow down here, this is what they came for.",
          text: "2",
        },
        {
          secs: 12,
          role: "The payoff",
          frame: "Wide, then close. Show the whole thing, then the detail that proves it.",
          show: `The finished result next to the mess from the first shot. ${r.proof}`,
          say: "What changed, in the words a customer would use.",
          text: "Same thing, fixed",
        },
        {
          secs: 8,
          role: "The ask",
          frame: "Locked off again, you sitting still, hands out of frame.",
          show: "Just you. No music under this bit.",
          say: r.askSay,
          text: r.askText,
        },
      ];
    },
  },

  ba30: {
    name: "Before and after, 30 seconds",
    blurb: "The strongest one if you make or fix things. Frame both shots identically.",
    unit: "sec",
    build: (r) => [
      {
        secs: 3,
        role: "The before",
        frame: "Vertical, locked off. Mark where your feet are, you need this exact spot again later.",
        show: "The before, held still for a full three seconds. Do not tidy it first.",
        say: "What is wrong with this, in six words.",
        text: "Before",
      },
      {
        secs: 4,
        role: "The stop",
        frame: "Snap in close, handheld. One detail of the problem, filling the frame.",
        show: "The worst bit. The crack, the mess, the wrong one.",
        say: `This is where ${r.theThing} started.`,
        text: "This is the problem",
      },
      {
        secs: 8,
        role: "The work",
        frame: "Overhead or over your shoulder. Record long, speed it up eight times in the app after.",
        show: `The work happening. ${r.point}`,
        say: "Nothing. Sped up footage with the real sound underneath.",
        text: "The work",
      },
      {
        secs: 10,
        role: "The after",
        frame: "Back to your marked spot. Exactly the same distance and height as the before, or it does not land.",
        show: `The after, held as still and as long as the before. ${r.proof}`,
        say: "What it fixed for the person who owns it.",
        text: "After",
      },
      {
        secs: 5,
        role: "The ask",
        frame: "Handheld, you next to the finished thing, one step back so both fit.",
        show: "You and the result in the same frame. That is the credibility shot.",
        say: r.askSay,
        text: r.askText,
      },
    ],
  },

  carousel: {
    name: "Carousel, 7 slides",
    blurb: "No camera, no face, no editing. Photos and text. Gets saved more than video.",
    unit: "slide",
    build: (r, v) => {
      const h = buildHooks(r, v)[(v + 2) % 6];
      return [
        {
          secs: 0,
          role: "Slide 1, the cover",
          frame: "One photograph, full bleed. Text across the middle third, huge, four words maximum.",
          show: "Your best photograph. If you only have one good picture, it goes here.",
          say: h.line,
          text: h.text,
        },
        {
          secs: 0,
          role: "Slide 2, the promise",
          frame: "Plain background. Text only, big, centred, plenty of space around it.",
          show: "Nothing. White space is why people keep swiping.",
          say: `What you get out of the next five slides about ${r.theThing}.`,
          text: "Here is the whole thing",
        },
        {
          secs: 0,
          role: "Slide 3, the setup",
          frame: "Photograph with a short line along the bottom. Never centre text over a busy picture.",
          show: "Where this starts. The raw material, the empty room, the blank page.",
          say: "One sentence of context. Resist telling the whole history.",
          text: "Where it starts",
        },
        {
          secs: 0,
          role: "Slide 4, the turn",
          frame: "Two photographs stacked, one line between them.",
          show: `The part people get wrong. ${r.point}`,
          say: "The thing that changes everything, stated flatly.",
          text: "This is the bit",
        },
        {
          secs: 0,
          role: "Slide 5, the proof",
          frame: "Photograph, full bleed, no text at all. Let one slide breathe.",
          show: `The photograph that does the arguing. ${r.proof}`,
          say: "Nothing on this slide. The picture is the argument.",
          text: "",
        },
        {
          secs: 0,
          role: "Slide 6, the payoff",
          frame: "Plain background, three short lines stacked, generous line spacing.",
          show: "The summary somebody screenshots.",
          say: "Three lines they could repeat to a friend tomorrow.",
          text: "The short version",
        },
        {
          secs: 0,
          role: "Slide 7, the ask",
          frame: "Your name, big. Handle underneath. One line of ask. Nothing else on it.",
          show: "Brand colour background. This is the slide people land on when they swipe too far.",
          say: r.askSay,
          text: r.askText,
        },
      ];
    },
  },
};

// ---- Captions, written for the platform they land on ----------------------

type Cap = { platform: string; note: string; body: string };

function buildCaptions(r: Read, hook: Hook, tags: string[], v: number): Cap[] {
  const tagLine = tags.map((t) => `#${t}`).join(" ");
  const t = r.theThing;
  const first = v % 2 === 0 ? hook.line : `${hook.line} Save it before you forget.`;
  return [
    {
      platform: "Instagram",
      note: "Two lines show before the More button. Everything that matters has to live above it.",
      body: [
        first,
        "",
        `Filmed on a phone in one pass. No lights, no crew, no second take.`,
        `${cap(t)}, exactly how it goes on an ordinary day.`,
        "",
        r.askSay,
        "",
        tagLine,
      ].join("\n"),
    },
    {
      platform: "TikTok",
      note: "The caption is a second hook, not a description. Short, and it can be a bit reckless.",
      body: [
        first,
        "Watch the middle bit twice.",
        "",
        tags.slice(0, 3).map((x) => `#${x}`).join(" "),
      ].join("\n"),
    },
    {
      platform: "LinkedIn",
      note: "No hashtag wall. First line, hard return, short paragraphs, end on a question.",
      body: [
        first,
        "",
        `Most of this work never gets seen, so here is ${t} on a normal Tuesday.`,
        `A phone, a window and twenty minutes. That is the entire production budget.`,
        "",
        r.askSay,
        "",
        `Curious what you would have filmed instead.`,
        "",
        tags.slice(0, 3).map((x) => `#${x}`).join(" "),
      ].join("\n"),
    },
  ];
}

// ---- Hashtags -------------------------------------------------------------

const TAGS: Record<string, string[]> = {
  general: ["smallbusiness", "behindthescenes", "howitsmade", "buildinpublic"],
  design: ["branding", "logodesign", "brandidentity", "designtips"],
  food: ["foodie", "cafelife", "baking", "localfood"],
  retail: ["smallshop", "newin", "restock", "unboxing"],
  trades: ["trades", "renovation", "beforeandafter", "craftsmanship"],
  service: ["localbusiness", "bookedout", "clientwork", "smallbiztips"],
};

/** Guess the set off the words they typed, so nobody has to pick from a menu. */
const TAG_HINTS: Array<[string, RegExp]> = [
  ["food", /bak(e|ing|ery)|cafe|coffee|food|kitchen|ramen|pizza|supper|menu|\bbars?\b|restaurant|cake|bread/i],
  ["design", /logo|brand|design|identity|typeface|website|poster|rebrand/i],
  ["trades", /renov|build|fix|repair|paint|carpen|plumb|garden|floor|tile|barber|salon/i],
  ["retail", /shop|store|shelf|stock|sneaker|vintage|clothing|candle|flower|card/i],
  ["service", /client|book|session|consult|coach|clean|photo|service/i],
];

function guessTagSet(topic: string): string {
  for (const [set, re] of TAG_HINTS) if (re.test(topic)) return set;
  return "general";
}

function tagsFor(set: string, keyword: string): string[] {
  const base = TAGS[set] || TAGS.general;
  return keyword ? [keyword.replace(/[^a-z0-9]/g, ""), ...base] : base;
}

// ---- Asking for changes, handled here in the browser ----------------------

const PLAIN: Array<[RegExp, string]> = [
  [/\butilis[ez]e?\b/gi, "use"],
  [/\bpurchase\b/gi, "buy"],
  [/\bindividuals\b/gi, "people"],
  [/\bhowever\b/gi, "but"],
  [/\badditionally\b/gi, "and"],
  [/\bin order to\b/gi, "to"],
  [/\bwe are able to\b/gi, "we can"],
  [/\bapproximately\b/gi, "about"],
  [/\bprior to\b/gi, "before"],
  [/\bcommence\b/gi, "start"],
  [/\bassist\b/gi, "help"],
  [/\bcurrently\b/gi, "right now"],
];

function loosen(s: string): string {
  return PLAIN.reduce((acc, [re, to]) => acc.replace(re, to), s);
}

const QUICK = [
  "Make it shorter",
  "Punchier opening",
  "I hate being on camera",
  "Add a scene",
  "Make it sound less formal",
  "Write the caption",
];

let seq = 0;
const nid = () => `s${++seq}${Date.now().toString(36)}`;

export default function ContentTrack({ accent }: { accent: string }) {
  const [fmt, setFmt] = useState("reel30");
  const [topic, setTopic] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [caption, setCaption] = useState("");
  const [tagSet, setTagSet] = useState("general");
  const [answers, setAnswers] = useState<Answers>({});
  const [variant, setVariant] = useState(0);
  const [hookPick, setHookPick] = useState(0);
  const [platform, setPlatform] = useState(0);
  const [step, setStep] = useState<"plan" | "caption" | "thumb">("plan");
  const [picked, setPicked] = useState<string | null>(null);
  const [shots, setShots] = useState<Array<{ id: string; thumb: string; url: string; title: string }>>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [refError, setRefError] = useState("");
  // Pulling references and copying the plan both finish somewhere nobody is
  // looking, so the outcome gets announced.
  const [say, setSay] = useState("");
  const [ask, setAsk] = useState("");
  const [log, setLog] = useState<Array<{ you: string; back: string }>>([]);
  const logEnd = useRef<HTMLDivElement | null>(null);

  // Read everything they already told the site. Their idea seeds the topic and
  // the five funnel answers steer every builder below.
  useEffect(() => {
    let seededTopic = "";
    let seededFmt = "reel30";
    const a: Answers = readFunnelAnswers();
    setAnswers(a);

    const idea = readIdea();
    if (idea?.q) seededTopic = idea.q;

    const p = loadJSON<Record<string, any> | null>(KEY, null);
    if (p) {
      seededFmt = p.fmt && FORMATS[p.fmt] ? p.fmt : "reel30";
      setFmt(seededFmt);
      seededTopic = p.topic || seededTopic;
      setTopic(seededTopic);
      setCaption(p.caption || "");
      setTagSet(p.tagSet || guessTagSet(p.topic || seededTopic));
      if (Array.isArray(p.scenes) && p.scenes.length) {
        setScenes(p.scenes as Scene[]);
        return;
      }
    } else {
      setTopic(seededTopic);
      setTagSet(guessTagSet(seededTopic));
    }
    // Nothing saved, so there is a real plan on screen before they touch anything.
    setScenes(
      (FORMATS[seededFmt] || FORMATS.reel30)
        .build(buildRead(seededTopic, a), 0)
        .map((b) => ({ ...b, id: nid() }))
    );
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      saveJSON(KEY, { fmt, topic, scenes, caption, tagSet });
    }, 400);
    return () => window.clearTimeout(t);
  }, [fmt, topic, scenes, caption, tagSet]);

  const read = useMemo(() => buildRead(topic, answers), [topic, answers]);
  const hooks = useMemo(() => buildHooks(read, variant), [read, variant]);
  const format = FORMATS[fmt] || FORMATS.reel30;
  const tags = useMemo(() => tagsFor(tagSet, read.keyword), [tagSet, read.keyword]);
  const caps = useMemo(
    () => buildCaptions(read, hooks[hookPick % hooks.length], tags, variant),
    [read, hooks, hookPick, tags, variant]
  );

  const total = useMemo(() => scenes.reduce((n, s) => n + (Number(s.secs) || 0), 0), [scenes]);
  const totalLabel = format.unit === "slide" ? `${scenes.length} slides` : `${total} seconds total`;

  const build = useCallback(
    (id: string, v: number) => {
      const f = FORMATS[id] || FORMATS.reel30;
      setScenes(f.build(buildRead(topic, answers), v).map((b) => ({ ...b, id: nid() })));
    },
    [topic, answers]
  );

  const patch = (id: string, f: keyof Scene, v: string | number) =>
    setScenes((ss) => ss.map((s) => (s.id === id ? { ...s, [f]: v } : s)));

  const move = (i: number, dir: -1 | 1) =>
    setScenes((ss) => {
      const j = i + dir;
      if (j < 0 || j >= ss.length) return ss;
      const copy = [...ss];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const duplicate = (i: number) =>
    setScenes((ss) => {
      const copy = [...ss];
      copy.splice(i + 1, 0, { ...ss[i], id: nid() });
      return copy;
    });

  const useHook = (i: number) => {
    setHookPick(i);
    const h = hooks[i];
    setScenes((ss) =>
      ss.length ? ss.map((s, n) => (n === 0 ? { ...s, say: h.line, text: h.text } : s)) : ss
    );
  };

  /**
   * Changes in plain words, answered instantly and offline. It handles the six
   * things people actually ask for, and when it does not understand it says so
   * and lists what it can do, which is more use than an apology.
   */
  const sendAsk = (text?: string) => {
    const instruction = (text ?? ask).trim();
    if (!instruction) return;
    const q = instruction.toLowerCase();
    setAsk("");
    let back = "";

    if (/(15|fifteen)\s*(s|sec)/.test(q)) {
      setFmt("reel15");
      build("reel15", variant);
      back = "Rebuilt as a 15 second cut. One idea only now.";
    } else if (/(60|sixty)\s*(s|sec)|minute/.test(q)) {
      setFmt("reel60");
      build("reel60", variant);
      back = "Rebuilt at 60 seconds, with a reset in the middle so people stay.";
    } else if (/(30|thirty)\s*(s|sec)/.test(q)) {
      setFmt("reel30");
      build("reel30", variant);
      back = "Rebuilt at 30 seconds. That is the one most people should post.";
    } else if (/shorter|tighter|too long|cut it down/.test(q)) {
      setScenes((ss) => ss.map((s) => ({ ...s, secs: Math.max(1, Math.round(s.secs * 0.65)) })));
      back = "Tightened every scene. Shorter almost always performs better, so this is usually right.";
    } else if (/longer|slower|more time/.test(q)) {
      setScenes((ss) => ss.map((s) => ({ ...s, secs: Math.max(1, Math.round(s.secs * 1.4)) })));
      back = "Given every scene more room. Watch the total, past 60 seconds the drop off is steep.";
    } else if (/punch|opening|first|hook|stronger start/.test(q)) {
      const next = (hookPick + 1) % hooks.length;
      useHook(next);
      back = `Swapped the opening to the ${hooks[next].mechanic.toLowerCase()}. ${hooks[next].why}`;
    } else if (/camera shy|hate being on camera|no face|shy|off camera/.test(q)) {
      setScenes((ss) =>
        ss.map((s) => ({
          ...s,
          frame: "Phone pointed down at your hands. No face in frame at any point.",
          show: `${s.show} Shoot it over your own shoulder.`,
          say: `Voice note, recorded after, in a quiet room: ${s.say}`,
        }))
      );
      back =
        "Rebuilt with no face. Film your hands, record the words separately as a voice note, lay it over the top. It works, and it is faster to shoot.";
    } else if (/add a scene|another scene|more scenes/.test(q)) {
      setScenes((ss) => [
        ...ss,
        {
          id: nid(),
          secs: 6,
          role: "The extra proof",
          frame: "Close, handheld, one steady move. Elbows resting on something.",
          show: read.proof,
          say: "One more piece of evidence, said in a single sentence.",
          text: "One more thing",
        },
      ]);
      back = "Added a proof scene at the end. Move it earlier if the middle is sagging.";
    } else if (/remove|delete|fewer|drop a scene/.test(q)) {
      setScenes((ss) => (ss.length > 2 ? ss.slice(0, -1) : ss));
      back = "Dropped the last scene.";
    } else if (/formal|stiff|corporate|casual|human/.test(q)) {
      setScenes((ss) => ss.map((s) => ({ ...s, say: loosen(s.say), text: loosen(s.text) })));
      setCaption((c) => loosen(c));
      back = "Plainer words throughout. Say it the way you would say it to a friend in the shop.";
    } else if (/caption|write the caption|post text/.test(q)) {
      setCaption(caps[platform % caps.length].body);
      back = `Written for ${caps[platform % caps.length].platform}. ${caps[platform % caps.length].note}`;
    } else if (/hashtag|tags/.test(q)) {
      setTagSet(guessTagSet(topic));
      back = `Tags set from what you typed: ${tagsFor(guessTagSet(topic), read.keyword).map((t) => `#${t}`).join(" ")}`;
    } else if (/another|different|again|new angle|fresh/.test(q)) {
      const v = variant + 1;
      setVariant(v);
      build(fmt, v);
      back = "Different angle on the same idea. Keep pressing until one sounds like you.";
    } else {
      back =
        "I can do: shorter, longer, punchier opening, less formal, no face on camera, add a scene, write the caption, make it 15 or 60 seconds.";
    }

    setLog((l) => [...l, { you: instruction, back }]);
    window.setTimeout(() => logEnd.current?.scrollIntoView({ block: "nearest" }), 60);
  };

  const pullRefs = async (kind: "photo" | "gif") => {
    const q = topic.trim() || "small business";
    setLoadingRefs(true);
    setRefError("");
    setSay("Looking for references.");
    try {
      // No leash here meant a dead network span forever. Eight seconds, then
      // an error somebody can actually act on.
      const data = await fetchJSON<{ ok?: boolean; shots?: typeof shots }>(
        `/api/moodboard?q=${encodeURIComponent(q)}&kind=${kind}`
      );
      if (!data.ok) throw new Error("failed");
      const found = data.shots || [];
      setShots(found);
      setSay(found.length ? `${found.length} references loaded.` : "No references came back for that.");
    } catch (e) {
      const msg =
        e instanceof Error && e.name === "AbortError"
          ? "That took too long. Check your connection and try again."
          : "Could not reach the reference service. Try again.";
      setRefError(msg);
      setSay(msg);
    }
    setLoadingRefs(false);
  };

  const plan = () =>
    [
      `${topic.trim() || "Untitled video"}`,
      `${format.name} · ${format.unit === "slide" ? `${scenes.length} slides` : `${total} seconds`}`,
      "",
      "HOW TO SHOOT IT",
      `  ${read.job}`,
      `  ${read.point}`,
      `  ${read.proof}`,
      `  ${read.ask}`,
      `  Post it: ${read.place}`,
      "",
      "OPENING LINES YOU COULD USE",
      ...hooks.map((h) => `  [${h.mechanic}] ${h.line}`),
      "",
      ...scenes.flatMap((s, i) => [
        format.unit === "slide" ? `SLIDE ${i + 1}` : `SCENE ${i + 1} (${s.secs}s) ${s.role}`,
        `  How to frame it: ${s.frame || "-"}`,
        `  What we see:     ${s.show || "-"}`,
        `  What you say:    ${s.say || "-"}`,
        `  Words on screen: ${s.text || "-"}`,
        "",
      ]),
      "CAPTION",
      caption.trim() || "(not written yet)",
      "",
      tags.map((h) => `#${h}`).join(" "),
      "",
      "Planned at flowzone.dev/start",
    ].join("\n");

  const planFile = () =>
    `${(topic.trim() || "video-plan").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;

  const download = () => {
    downloadBlob(plan(), planFile(), "text/plain");
    setSay("The plan downloaded as a text file.");
  };

  const copyAll = async () => {
    const how = await copyOrDownload(plan(), planFile(), "text/plain");
    const back =
      how === "copied"
        ? "Copied. Paste it into your notes app and shoot from your phone."
        : "Clipboard was blocked, so the plan downloaded instead.";
    setLog((l) => [...l, { you: "Copy the plan", back }]);
    setSay(back);
  };

  const STEPS: Array<{ id: typeof step; n: string; label: string }> = [
    { id: "plan", n: "1", label: "Plan the video" },
    { id: "caption", n: "2", label: "Write the caption" },
    { id: "thumb", n: "3", label: "Make the thumbnail" },
  ];

  const answered = (["who", "have", "price", "edge", "block"] as const)
    .map((k) => answers[k])
    .filter(Boolean) as string[];

  const fieldLabels: Array<[keyof Scene, string, string]> =
    format.unit === "slide"
      ? [
          ["frame", "How to lay it out", "Where the text sits on the slide"],
          ["show", "The picture", "What is actually on the slide"],
          ["say", "The line", "The sentence somebody reads"],
          ["text", "Big text", "Six words maximum"],
        ]
      : [
          ["frame", "How to frame it", "How close, handheld or propped up"],
          ["show", "What we see", "Where the camera is pointing"],
          ["say", "What you say", "The actual words out loud"],
          ["text", "Words on screen", "Six words maximum"],
        ];

  return (
    <div>
      {/* Async results land nowhere near focus, so they get said out loud. */}
      <p aria-live="polite" className="sr-only">
        {say}
      </p>
      {/* Three steps, in order, always visible. That is the whole navigation. */}
      <div className="grid sm:grid-cols-3 gap-2 mb-5">
        {STEPS.map((s) => {
          const on = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className="text-left border px-4 py-3 transition-colors"
              style={{
                borderColor: on ? accent : "#26355A",
                background: on ? "#172440" : "transparent",
              }}
            >
              <span
                className="text-[11px] font-medium uppercase tracking-label"
                style={{ color: on ? accent : "#647089" }}
              >
                Step {s.n}
              </span>
              <span className="block text-sm mt-0.5" style={{ color: on ? "#F1F3F7" : "#9AA7BE" }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {step === "plan" && (
        <>
          <div className="panel p-6 mb-4 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="label mb-2">What is the video about?</p>
                <input
                  value={topic}
                  aria-label="What the video is about"
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setTagSet(guessTagSet(e.target.value));
                  }}
                  placeholder="e.g. how we redid a shop logo"
                  className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <p className="label mb-2">How long, what shape</p>
                <select
                  value={fmt}
                  aria-label="How long and what shape"
                  onChange={(e) => {
                    setFmt(e.target.value);
                    build(e.target.value, variant);
                  }}
                  className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                >
                  {Object.entries(FORMATS).map(([id, f]) => (
                    <option key={id} value={id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <p className="text-[12px] text-ink-mute font-light leading-relaxed mt-2">{format.blurb}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => build(fmt, variant)} className="btn-primary !px-4 !py-2.5 text-xs">
                Build the plan <span className="arrow">→</span>
              </button>
              <button
                onClick={() => {
                  const v = variant + 1;
                  setVariant(v);
                  build(fmt, v);
                }}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                Another angle
              </button>
            </div>

            <p className="text-[12px] text-ink-mute font-light leading-relaxed mt-3">
              {answered.length ? (
                <>
                  Written for <span className="text-ink-soft">{answered.join(", ")}</span>. Change an
                  answer up the page and build it again.
                </>
              ) : (
                <>
                  Answer the questions further up the page and this gets a lot sharper. It knows who
                  pays, what you have and what is in the way, and it plans differently for each.
                </>
              )}
            </p>
          </div>

          {/* How to shoot it. The bit that turns a plan into a Saturday morning. */}
          <div className="panel p-6 mb-4">
            <p className="label mb-4">How to shoot it</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {(
                [
                  ["What this video has to do", read.job, "#FBBF24"],
                  ["Where to point the camera", read.point, "#F0845F"],
                  ["What counts as proof", read.proof, "#34D399"],
                  ["The ask you have earned", read.ask, "#5B9BF9"],
                ] as const
              ).map(([head, body, col]) => (
                <div key={head}>
                  <p className="text-[11px] font-medium uppercase tracking-label mb-1.5" style={{ color: col }}>
                    {head}
                  </p>
                  <p className="text-[13px] text-ink-soft font-light leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-rule mt-5 pt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              <p className="text-[13px] text-ink-soft font-light leading-relaxed">
                <span className="text-ink">Light.</span> Face a window, never stand with one behind
                you. Mid morning is the best free light there is. Wipe the lens, it is always dirty.
              </p>
              <p className="text-[13px] text-ink-soft font-light leading-relaxed">
                <span className="text-ink">Sound.</span> The phone mic gives up past arm&apos;s
                length. Stay close, or record the words after as a voice note and lay them over.
              </p>
              <p className="text-[13px] text-ink-soft font-light leading-relaxed">
                <span className="text-ink">If you hate being on camera.</span> Point the phone down
                at your hands for the whole thing. Hands outperform faces on process videos anyway.
              </p>
              <p className="text-[13px] text-ink-soft font-light leading-relaxed">
                <span className="text-ink">Where it goes.</span> {read.place}
              </p>
            </div>
            <div className="border-t border-rule mt-4 pt-4">
              <p className="text-[11px] uppercase tracking-label text-ink-mute mb-2">
                Grab these while you are already there
              </p>
              <ul className="text-[13px] text-ink-soft font-light leading-relaxed space-y-1">
                {[
                  "Ten seconds of the hands working, close enough to see texture.",
                  read.keyword
                    ? `The ${read.keyword} on its own against a plain wall, held still.`
                    : "The finished thing on its own against a plain wall, held still.",
                  "The door, the sign or the window, shot from across the street.",
                  "Somebody taking it from you, even if it is just a friend.",
                  "The mess at the end of the day. Nobody films this and everybody watches it.",
                ].map((b) => (
                  <li key={b} className="flex gap-2">
                    <span style={{ color: accent }}>·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Openings, with the mechanic named so they can pick with taste. */}
          <div className="panel p-6 mb-4">
            <p className="label mb-2">Openings that stop the scroll</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Six different mechanics, not six wordings of the same one. Pick the one that sounds
              like you, out loud, and it goes into scene one.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {hooks.map((h, i) => {
                const on = i === hookPick;
                return (
                  <button
                    key={h.mechanic}
                    onClick={() => useHook(i)}
                    className="text-left border p-4 transition-colors hover:bg-raised"
                    style={{ borderColor: on ? accent : "#26355A", background: on ? "#172440" : "transparent" }}
                  >
                    <span
                      className="text-[10px] font-medium uppercase tracking-label"
                      style={{ color: on ? accent : "#647089" }}
                    >
                      {h.mechanic}
                    </span>
                    <span className="block text-[13px] mt-1 leading-relaxed" style={{ color: "#F1F3F7" }}>
                      {h.line}
                    </span>
                    <span className="block text-[11px] text-ink-mute font-light mt-1.5 leading-relaxed">
                      {h.why}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ask for changes in plain words. Answered here, offline, instantly. */}
          <div className="panel p-6 mb-4">
            <p className="label mb-2">Or just say what you want changed</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Type it the way you would say it out loud. The plan below updates on the spot.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <input
                value={ask}
                aria-label="Say what you want changed"
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAsk()}
                placeholder="Make it shorter and less formal"
                className="flex-1 min-w-[220px] bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={() => sendAsk()}
                disabled={!ask.trim()}
                className="btn-primary !px-5 !py-3 text-xs disabled:opacity-50"
              >
                Change it
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => sendAsk(q)}
                  className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            {log.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {log.slice(-5).map((l, i) => (
                  <div key={i} className="text-[12px] leading-relaxed">
                    <p className="text-ink-mute">You: {l.you}</p>
                    <p style={{ color: accent }}>{l.back}</p>
                  </div>
                ))}
                <div ref={logEnd} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="label">{format.unit === "slide" ? "The carousel, slide by slide" : "The video, scene by scene"}</p>
            <p className="text-[11px] text-ink-mute">{totalLabel}</p>
          </div>

          <div className="space-y-3">
            {scenes.map((s, i) => (
              <div key={s.id} className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="font-display text-base">
                      {format.unit === "slide" ? `Slide ${i + 1}` : `Scene ${i + 1}`}
                    </p>
                    <p className="text-[10px] uppercase tracking-label" style={{ color: accent }}>
                      {s.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {format.unit === "sec" && (
                      <>
                        <input
                          type="number"
                          min={1}
                          aria-label={`Seconds for scene ${i + 1}`}
                          value={s.secs}
                          onChange={(e) => patch(s.id, "secs", Number(e.target.value))}
                          className="w-14 bg-paper-deep text-ink border border-rule px-2 py-1.5 text-xs outline-none focus:border-accent"
                        />
                        <span className="text-[11px] text-ink-mute mr-1">sec</span>
                      </>
                    )}
                    <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up" aria-label={`Move scene ${i + 1} up`} className="text-ink-mute hover:text-ink disabled:opacity-30 px-1.5 text-sm">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === scenes.length - 1} title="Move down" aria-label={`Move scene ${i + 1} down`} className="text-ink-mute hover:text-ink disabled:opacity-30 px-1.5 text-sm">↓</button>
                    <button onClick={() => duplicate(i)} title="Duplicate" aria-label={`Duplicate scene ${i + 1}`} className="text-ink-mute hover:text-ink px-1.5 text-xs">copy</button>
                    <button onClick={() => setScenes((ss) => ss.filter((x) => x.id !== s.id))} title="Remove" aria-label={`Remove scene ${i + 1}`} className="text-ink-mute hover:text-ink px-1.5 text-xs">remove</button>
                  </div>
                </div>
                {fieldLabels.map(([f, label, ph]) => (
                  <div key={f} className="mb-2 last:mb-0">
                    <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1">{label}</p>
                    <textarea
                      rows={f === "say" || f === "frame" ? 2 : 1}
                      aria-label={`${label}, ${format.unit === "slide" ? "slide" : "scene"} ${i + 1}`}
                      value={String(s[f] ?? "")}
                      onChange={(e) => patch(s.id, f, e.target.value)}
                      placeholder={ph}
                      className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-3 py-2 text-[13px] font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() =>
                setScenes((ss) => [
                  ...ss,
                  { id: nid(), secs: 5, role: "New scene", frame: "", say: "", show: "", text: "" },
                ])
              }
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              + Add a scene
            </button>
            <button onClick={copyAll} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">
              Copy the whole plan
            </button>
            <button onClick={() => setStep("caption")} className="btn-primary !px-4 !py-2.5 text-xs">
              Next, the caption <span className="arrow">→</span>
            </button>
          </div>

          {/* At the foot of the shot list, once there is a topic and scenes to
              read. This is the point where somebody has to decide whether they
              are actually going to stand in front of a camera on Saturday, and
              the honest question in their head is whether the plan is worth
              filming. Asking on the caption or thumbnail step would be later
              and quieter, so it goes here. */}
          {Boolean(topic.trim()) && scenes.length > 0 && (
            <AskAboutThis
              id="content-plan"
              icon="clapper"
              subject={`Would you shoot this? ${topic.trim().slice(0, 60)}`}
              title="Worth filming, or is the opening wrong?"
              note="Send the shot plan to Denny. He will tell you which scene to cut and which line to open on, free, no obligation."
              body={() =>
                askBody({
                  opener: `I planned this in Flow Mode and I want to know if it is worth shooting.`,
                  sections: [
                    { label: "The video", text: `${topic.trim()}\n${format.name}, ${format.unit === "slide" ? `${scenes.length} slides` : `${total} seconds`}` },
                    { label: "Opening line", text: hooks[hookPick % hooks.length]?.line || "" },
                    ...scenes.map((s, i) => ({
                      label: format.unit === "slide" ? `Slide ${i + 1}` : `Scene ${i + 1}, ${s.secs}s`,
                      text: [s.show && `See: ${s.show}`, s.say && `Say: ${s.say}`, s.text && `On screen: ${s.text}`]
                        .filter(Boolean)
                        .join("\n"),
                    })),
                    caption.trim() ? { label: "Caption", text: caption.trim() } : null,
                  ],
                  unsure: "The part I think is weak:",
                })
              }
              accent={accent}
              className="mt-4"
            />
          )}
        </>
      )}

      {step === "caption" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
            <p className="label mb-2">Written for where it lands</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              The same video needs three different captions. Only the first line gets read, so that
              is the line doing all the work.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {caps.map((c, i) => {
                const on = i === platform;
                return (
                  <button
                    key={c.platform}
                    onClick={() => setPlatform(i)}
                    className="text-xs border px-3 py-2 transition-colors"
                    style={{
                      borderColor: on ? accent : "#26355A",
                      background: on ? "#172440" : "transparent",
                      color: on ? "#F1F3F7" : "#9AA7BE",
                    }}
                  >
                    {c.platform}
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-ink-mute font-light leading-relaxed mb-3">
              {caps[platform % caps.length].note}
            </p>
            <textarea
              rows={10}
              value={caption}
              aria-label="The caption"
              onChange={(e) => setCaption(e.target.value)}
              placeholder="First line is the hook. Then the detail. Then what to do."
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none mb-4"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCaption(caps[platform % caps.length].body)}
                className="btn-primary !px-4 !py-2.5 text-xs"
              >
                Write the {caps[platform % caps.length].platform} one
              </button>
              <button
                onClick={() => {
                  const v = variant + 1;
                  setVariant(v);
                }}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                Try a different opening
              </button>
            </div>
          </div>

          <div className="panel p-6">
            <p className="label mb-2">Hashtags</p>
            <select
              value={tagSet}
              aria-label="Hashtag set"
              onChange={(e) => setTagSet(e.target.value)}
              className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            >
              {Object.keys(TAGS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-2">
              {tags.map((h) => `#${h}`).join("  ")}
            </p>
            <p className="text-[12px] text-ink-mute font-light leading-relaxed mb-5">
              Four or five is plenty. Thirty looks like somebody who is not sure what they sell.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={download} className="btn-primary !px-4 !py-2.5 text-xs">
                Download the plan <span className="arrow">→</span>
              </button>
              <button onClick={copyAll} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">
                Copy it
              </button>
              <button onClick={() => setStep("thumb")} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">
                Next, the thumbnail
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "thumb" && (
        <div className="space-y-4">
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
            <p className="label mb-2">Find a picture</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Real photographs and GIFs, free to use. Click one to caption it, or upload your own
              below. A frame you shot yourself beats a stock photo every time.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => pullRefs("photo")} disabled={loadingRefs} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                {loadingRefs ? "Looking..." : "Find photos"}
              </button>
              <button onClick={() => pullRefs("gif")} disabled={loadingRefs} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                Find GIFs
              </button>
            </div>
            {refError && <p className="text-[12px] text-[#FBBF24] mb-3">{refError}</p>}
            {shots.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {shots.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPicked(s.url)}
                    title={s.title}
                    className="border overflow-hidden transition-colors"
                    style={{ borderColor: picked === s.url ? accent : "#26355A", borderWidth: picked === s.url ? 2 : 1 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.thumb} alt={s.title} loading="lazy" className="w-full h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-6">
            <p className="label mb-2">Cover text worth using</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-3">
              Big, short, readable at thumbnail size. Type one of these into the maker below.
            </p>
            <div className="flex flex-wrap gap-2">
              {[hooks[hookPick % hooks.length].text, read.askText, "Before", "After", "The bit nobody shows"].map(
                (t) => (
                  <span key={t} className="text-xs border border-rule text-ink-soft px-3 py-2">
                    {t.toUpperCase()}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="panel p-6">
            <p className="label mb-4">Add the words</p>
            <MemeMaker src={picked} brandColor={accent} />
          </div>
        </div>
      )}
    </div>
  );
}
