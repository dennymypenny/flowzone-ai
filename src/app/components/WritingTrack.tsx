"use client";
import { useEffect, useMemo, useState } from "react";
import {
  copyOrDownload,
  downloadBlob,
  loadJSON,
  readFunnelAnswers,
  readIdea,
  saveJSON,
} from "@/lib/session";
import AskAboutThis, { askBody } from "@/app/components/AskAboutThis";

/**
 * The writing track.
 *
 * The old version handed over a shape and left the visitor holding the pen.
 * Good idea, wrong order. Most people cannot start, and a blank box under a
 * heading called "the hook" is still a blank box.
 *
 * So this writes the draft first, out of what the visitor already told the
 * site in Flow Mode: who pays, what exists, what one customer is worth, what
 * their edge is, what is in the way. Copy written against a known buyer and a
 * known price is a different animal to copy written against a noun.
 *
 * Two rules keep it honest. It never invents a fact, so anything only the
 * founder knows comes out in [brackets] waiting to be filled. And every shape
 * is genuinely a different shape: a one-pager is not a landing page, a cold
 * email is not a script.
 *
 * Entirely local. No model call, no key, no cost, works offline.
 */

const KEY = "flowzone.writing.v3";

/* -------------------------------------------------------------------------
   What we know about the visitor
   ------------------------------------------------------------------------- */

type Facts = {
  idea: string;
  who: string;
  have: string;
  price: string;
  edge: string;
  block: string;
  proof: string;
  ask: string;
};

const EMPTY: Facts = {
  idea: "",
  who: "people nearby",
  have: "just the idea",
  price: "nothing yet",
  edge: "still working that out",
  block: "nobody knows it exists",
  proof: "",
  ask: "",
};

const WHO_OPTIONS = ["people nearby", "people online", "other businesses", "not sure yet"];
const HAVE_OPTIONS = ["just the idea", "an audience", "a name and a look", "paying customers"];
const PRICE_OPTIONS = ["under $20", "$20 to $100", "$100 to $1,000", "over $1,000", "nothing yet"];
const EDGE_OPTIONS = [
  "nobody near me does it",
  "it is better made",
  "it is cheaper",
  "I am the reason",
  "still working that out",
];
const BLOCK_OPTIONS = [
  "nobody knows it exists",
  "it looks amateur",
  "I cannot explain it fast",
  "no time to build it",
  "no money to spend",
];

/** Who is reading. Every line below changes depending on this one answer. */
type Aud = {
  they: string;
  near: string;
  rival: string;
  settle: string;
  question: string;
  step3: string;
  ask: string;
};

const AUD: Record<string, Aud> = {
  "people nearby": {
    they: "people near you",
    near: "a few minutes from your door",
    rival: "the nearest one",
    settle: "The good one is [40 minutes] away, so you go twice a year and put up with it the rest of the time.",
    question: "Where is the good one around here?",
    step3: "You pick it up on [Saturday], no queue",
    ask: "[Text 555 0100] with what you want. You get a time back the same day.",
  },
  "people online": {
    they: "people who find you on a phone at 11pm",
    near: "posted on [Tuesday], with you by [Friday]",
    rival: "the one that comes up first",
    settle: "The good one is sold out or ships in [three weeks], so you buy the near enough one and it sits in a drawer.",
    question: "Is there one that is actually worth the money?",
    step3: "It lands on your doorstep [Friday]",
    ask: "Order the [small one] first. If it is not for you, send it back and keep the [tin].",
  },
  "other businesses": {
    they: "the person who has to sign the invoice",
    near: "live inside a week",
    rival: "the big one everyone ends up stuck with",
    settle: "The good option wants [a three month contract] and [six weeks of onboarding], so the job stays parked for another quarter.",
    question: "Who does this properly without a three month contract?",
    step3: "You get it back live, and a person to call",
    ask: "Reply with a date that suits and you get scope, price and a start day back.",
  },
  "not sure yet": {
    they: "the first ten people who get it",
    near: "ready this week",
    rival: "the obvious option",
    settle: "The good one is hard to find, so most people put up with the ordinary one and stop looking.",
    question: "Does anyone actually do this?",
    step3: "You get it [this week]",
    ask: "Reply to this and you are on the first list.",
  },
};

/** What one customer is worth changes how hard the copy is allowed to push. */
type Money = { tag: string; slot: string; decide: string; close: string };

const MONEY: Record<string, Money> = {
  "under $20": {
    tag: "under $20",
    slot: "[$12]",
    decide: "Nobody agonises over this. They fancy it or they do not, so the copy is short and the ask is now.",
    close: "Ask for it today. There is nothing to think about at this price.",
  },
  "$20 to $100": {
    tag: "under $100",
    slot: "[$60]",
    decide: "This is a small yes. People decide in about a minute, then either remember you or do not.",
    close: "Make the first one easy to say yes to, then earn the second.",
  },
  "$100 to $1,000": {
    tag: "[a few hundred]",
    slot: "[$400]",
    decide: "People sleep on this one. The page has to answer the questions they would have asked out loud.",
    close: "Answer the awkward question before the ask, or they leave to think and never come back.",
  },
  "over $1,000": {
    tag: "over $1,000",
    slot: "[$2,000]",
    decide: "One yes changes the month. Write to one person, never to a crowd.",
    close: "The ask is a conversation, not a checkout.",
  },
  "nothing yet": {
    tag: "[your price]",
    slot: "[your price]",
    decide: "There is no price yet. Put a number in before this goes anywhere. A page with no number gets no replies.",
    close: "Pick a number you can say out loud without flinching, then put it here.",
  },
};

/** The edge decides what the copy is arguing against. */
type Edge = { enemy: string; why: string; notFor: string };

const EDGE: Record<string, Edge> = {
  "nobody near me does it": {
    enemy: "The nearest one is [40 minutes] away. This one is not.",
    why: "Nobody else near you is doing this. That is true today and it will not be true forever, so say it loudly now.",
    notFor: "If you are happy driving [40 minutes] for it, you already have this sorted.",
  },
  "it is better made": {
    enemy: "Most of what you can buy is made down to a price. This one is not.",
    why: "It is better made, and better made only counts if people can see it before they pay. Show the work.",
    notFor: "If the cheapest one is the only thing that matters, this is not it.",
  },
  "it is cheaper": {
    enemy: "You are paying [twice this] for the same thing somewhere else.",
    why: "It costs less for the same result. Say what the other price is, or cheap just sounds like worse.",
    notFor: "If you want the badge on it, buy the expensive one. This is the same job for less.",
  },
  "I am the reason": {
    enemy: "You get me. Not a queue, not a form, not whoever is free.",
    why: "You are the reason people pick this, so your name and your face belong in the copy, not a logo.",
    notFor: "If you want a big team behind glass, that is not this.",
  },
  "still working that out": {
    enemy: "Most of it is fine. Fine is the problem.",
    why: "There is no clear edge yet, so the copy leans on what is specific and true instead of what is different.",
    notFor: "This is not for everyone, and pretending otherwise is what makes copy sound like nothing.",
  },
};

/** What is in the way becomes the objection the reader is already holding. */
type Block = { objection: string; answer: string; note: string };

const BLOCK: Record<string, Block> = {
  "nobody knows it exists": {
    objection: "Never heard of you.",
    answer:
      "Fair. [We started in March.] Here is what there is to go on: [the thing itself], [who has already bought], and a name you can ask about.",
    note: "Nobody has heard of you, so this is written for a cold reader who owes you nothing.",
  },
  "it looks amateur": {
    objection: "Is this a real business?",
    answer:
      "Yes. [Registered in 2024], [address], [a real phone number that a person answers]. Specifics are what make a stranger relax.",
    note: "Trust is the leak, so the copy leads with specifics. Vague sentences are what make a thing look homemade.",
  },
  "I cannot explain it fast": {
    objection: "What is this, exactly?",
    answer:
      "One line: [what it is] for [who], and you get it [when]. If that line is hard to write, everything after it is harder.",
    note: "The sentence is the whole job here. Everything else on the page is built out of it.",
  },
  "no time to build it": {
    objection: "How much of my time does this take?",
    answer: "[Ten minutes] at the start, then nothing until [it is ready]. That is the whole thing.",
    note: "You have no spare hours, so the ask has to be one action that takes a minute.",
  },
  "no money to spend": {
    objection: "Why should I pay before I know?",
    answer:
      "You should not have to guess. [Here is the small version at a small price.] If it does not work, you have lost [an afternoon].",
    note: "Nothing here is built to impress. It is built to sell this week, because that is what pays for the impressive version.",
  },
};

const HAVE_PROOF: Record<string, string> = {
  "just the idea":
    "[Nothing to point to yet, so do not fake it. Say what you are making, who it is for and when the first one is ready. Being early is more interesting than being fake.]",
  "an audience":
    "[How many people already follow this, and the one post they would not shut up about.]",
  "a name and a look":
    "[Show the work rather than describe it. One photograph of the real thing beats a paragraph about it.]",
  "paying customers":
    "[How many have paid, how often they come back, and one sentence somebody actually said to you.]",
};

/* -------------------------------------------------------------------------
   Small tools
   ------------------------------------------------------------------------- */

const STOP = new Set([
  "people",
  "that",
  "you",
  "for",
  "with",
  "who",
  "they",
  "i",
  "and",
  "in",
  "on",
  "of",
  "to",
]);

/** Strip the article off the front so the phrase can sit mid sentence. */
function phrase(idea: string): string {
  const t = idea.trim().replace(/[.!]+$/, "");
  return t.replace(/^(a|an|the|my|our|this)\s+/i, "");
}

/** The idea as typed, article kept, so it can sit mid sentence without limping. */
function mid(idea: string): string {
  const t = idea.trim().replace(/[.!]+$/, "");
  if (!t) return "[what you make]";
  return /^[A-Z]{2,}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1);
}

/** A line the visitor typed should end in a full stop like everything else. */
function dot(s: string): string {
  const t = s.trim();
  return !t || /[.!?\]]$/.test(t) ? t : `${t}.`;
}

/** The short category noun, which is what headlines and questions need. */
function shortName(idea: string): string {
  const words = phrase(idea).split(/\s+/).filter(Boolean);
  if (!words.length) return "this";
  if (words.length === 1) return words[0];
  return STOP.has(words[1].toLowerCase()) ? words[0] : `${words[0]} ${words[1]}`;
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function pick<T>(arr: T[], n: number): T {
  return arr[Math.abs(Math.round(n)) % arr.length];
}

function lines(...parts: string[]): string {
  return parts.filter(Boolean).join("\n");
}

/* -------------------------------------------------------------------------
   Headlines, built from mechanics rather than moods
   ------------------------------------------------------------------------- */

type Head = { mechanic: string; why: string; text: string };

function headlines(f: Facts, seed: number): Head[] {
  const named = Boolean(phrase(f.idea));
  const thing = named ? phrase(f.idea) : "[what you make]";
  const short = named ? shortName(f.idea) : "[it]";
  const aud = AUD[f.who] || AUD["not sure yet"];
  const money = MONEY[f.price] || MONEY["nothing yet"];
  const edge = EDGE[f.edge] || EDGE["still working that out"];
  const proof = f.proof.trim().replace(/[.]+$/, "");

  return [
    {
      mechanic: "The specific promise",
      why: "A promise with a number or a place in it. Specific is the whole trick, because vague promises read as no promise.",
      text: pick(
        [
          `${cap(thing)}, ${aud.near}.`,
          `${cap(short)} that is ${aud.near}, from ${money.slot}.`,
          `${cap(thing)}. ${cap(aud.near)}, ${money.tag}.`,
        ],
        seed
      ),
    },
    {
      mechanic: "The contrast",
      why: "Set it against the thing they already know. Two short sentences, and the second one is the turn.",
      text: pick(
        [
          `Not another ${short}. ${cap(thing)}.`,
          `You already know ${aud.rival}. This is not that.`,
          `${cap(thing)}. Not the ${short} you settle for.`,
        ],
        seed + 1
      ),
    },
    {
      mechanic: "The named enemy",
      why: "Name what you are against. People pick sides faster than they pick features.",
      text: edge.enemy,
    },
    {
      mechanic: "The number",
      why: "One number does more than a paragraph. Price, time or count, never all three.",
      text: pick(
        [
          `${money.slot}. ${cap(aud.near)}. That is the whole thing.`,
          proof
            ? `${cap(proof)}. And still ${aud.near}.`
            : `[200] a week, and every one of them ${aud.near}.`,
          `${money.slot} and [ten minutes]. No forms, no waiting.`,
        ],
        seed + 2
      ),
    },
    {
      mechanic: "The question they are already asking",
      why: "Say the sentence that is already in their head. They finish it before they finish reading.",
      text: pick(
        [
          aud.question,
          `Where do you get a good ${short} without ${f.who === "other businesses" ? "a three month contract" : "a 40 minute drive"}?`,
          `Is ${thing} even a thing? It is now.`,
        ],
        seed + 3
      ),
    },
    {
      mechanic: "Flat and true",
      why: "No angle at all. Say the thing plainly and put your proof right behind it. This one wins more often than people expect.",
      text: proof ? `${cap(thing)}. ${cap(proof)}.` : `${cap(thing)}. For ${aud.they}.`,
    },
  ];
}

/* -------------------------------------------------------------------------
   The four shapes
   ------------------------------------------------------------------------- */

type Section = { id: string; label: string; note: string; text: string };
type Piece = { id: string; name: string; blurb: string; job: string };

const PIECES: Piece[] = [
  {
    id: "onepager",
    name: "One-pager",
    blurb: "One page you hand over or attach. Print it and it still works.",
    job: "Somebody asked what this is. This is the answer, on one page, with a price on it.",
  },
  {
    id: "page",
    name: "Landing page",
    blurb: "The page that does the convincing while you sleep.",
    job: "One promise, one problem, one proof, one ask. Blocks in the order a stranger reads them.",
  },
  {
    id: "email",
    name: "Cold email",
    blurb: "Under 120 words, read on a phone between two meetings.",
    job: "It is not a pitch. It is one specific noticing, one offer with a price, one easy reply.",
  },
  {
    id: "script",
    name: "30 second script",
    blurb: "Time-coded. What you say, what is on screen, second by second.",
    job: "Spoken words, not written ones. Short lines, one idea each, nothing to read twice.",
  },
];

function build(pieceId: string, f: Facts, head: string, seed: number): Section[] {
  const named = Boolean(phrase(f.idea));
  const thing = named ? phrase(f.idea) : "[what you make]";
  const it = named ? mid(f.idea) : "[what you make]";
  const short = named ? shortName(f.idea) : "[it]";
  const aud = AUD[f.who] || AUD["not sure yet"];
  const money = MONEY[f.price] || MONEY["nothing yet"];
  const edge = EDGE[f.edge] || EDGE["still working that out"];
  const block = BLOCK[f.block] || BLOCK["nobody knows it exists"];
  const solo = f.edge === "I am the reason";
  const we = solo ? "I" : "We";
  const us = solo ? "me" : "us";
  const proof = dot(f.proof.trim()) || HAVE_PROOF[f.have] || HAVE_PROOF["just the idea"];
  const ask = f.ask.trim() || aud.ask;

  if (pieceId === "onepager") {
    return [
      {
        id: "top",
        label: "Top line",
        note: "If somebody reads this and nothing else, they should know what it is, who it is for and roughly what it costs.",
        text: lines(head, "", `For ${aud.they}. ${cap(aud.near)}, ${money.tag}.`),
      },
      {
        id: "what",
        label: "What it is",
        note: "Three short sentences, all concrete. No adjectives doing work that a fact should do.",
        text: lines(
          `${we} make ${it}.`,
          `${we} do it [here], ${we.toLowerCase() === "i" ? "myself" : "ourselves"}, and when it is gone it is gone.`,
          `Open [Tuesday to Sunday], from [7am].`
        ),
      },
      {
        id: "for",
        label: "Who it is for",
        note: "Naming who it is not for is what makes the rest believable. Everybody is nobody.",
        text: lines(`For ${aud.they}.`, "", edge.notFor),
      },
      {
        id: "get",
        label: "What you get",
        note: "Three lines, each one a thing they can picture. Anything in brackets is a fact only you have.",
        text: lines(
          `· [The thing itself], made [the day you get it].`,
          `· ${cap(aud.near)}.`,
          `· [The one part nobody else here bothers with.]`
        ),
      },
      {
        id: "cost",
        label: "What it costs",
        note: money.decide,
        text: lines(
          `${cap(money.tag)}. That covers [what is included], and nothing gets added at the end.`,
          `[What the bigger version costs, if there is one.]`
        ),
      },
      {
        id: "why",
        label: "Why this one",
        note: "The edge, then the proof. In that order, because a claim with nothing behind it makes people suspicious.",
        text: lines(edge.enemy, "", proof),
      },
      {
        id: "next",
        label: "The next step",
        note: `One action, and what happens after it. ${money.close}`,
        text: ask,
      },
    ];
  }

  if (pieceId === "page") {
    return [
      {
        id: "hero",
        label: "[HERO]",
        note: "One promise. The subhead carries the specifics the headline had to drop. The button says what happens, never Submit.",
        text: lines(
          head,
          "",
          `For ${aud.they}. ${cap(aud.near)}, ${money.tag}.`,
          "",
          `[BUTTON] ${pick(["See what is on this week", "Get the price", "Start one", "See it working"], seed)}`,
          `Under the button: Takes a minute. No account, no app.`
        ),
      },
      {
        id: "problem",
        label: "[THE PROBLEM, IN THEIR WORDS]",
        note: "Not your problem. Theirs, said the way they would say it to a friend. Get this right and the rest is easy.",
        text: lines(
          /* If the contrast headline is already up top, do not open the page by
             saying the same sentence twice. */
          head.startsWith("You already know")
            ? `${cap(aud.rival)} is fine. Fine is the problem.`
            : `You already know ${aud.rival}. It is fine. Fine is the problem.`,
          aud.settle,
          `${aud.question}`
        ),
      },
      {
        id: "how",
        label: "[WHAT HAPPENS]",
        note: "Three steps, verbs at the front. People buy when they can see themselves doing it.",
        text: lines(
          `1. Tell ${us} what you want. One line is enough.`,
          `2. ${we} [make it] and tell you when it is ready.`,
          `3. ${aud.step3}.`
        ),
      },
      {
        id: "proof",
        label: "[PROOF]",
        note: "Real work beats testimonials. A number beats an adjective. A photograph beats both.",
        text: proof,
      },
      {
        id: "objection",
        label: "[THE BIT PEOPLE ASK ABOUT]",
        note: block.note,
        text: lines(`"${block.objection}"`, "", block.answer),
      },
      {
        id: "ask",
        label: "[ONE ASK]",
        note: `Two calls to action is the same as none. ${money.close}`,
        text: lines(ask, "", `[BUTTON] ${pick(["Start one", "Get the price", "Book a time"], seed + 2)}`),
      },
      {
        id: "ps",
        label: "[THE LINE UNDERNEATH]",
        note: "The small print people actually read. Put the thing that removes the last bit of risk here.",
        text: `[What happens if they change their mind. Say it in one sentence and mean it.]`,
      },
    ];
  }

  if (pieceId === "email") {
    return [
      {
        id: "subject",
        label: "Subject lines, pick one",
        note: "Lower case, specific, boring on purpose. Anything that looks like marketing gets deleted by a thumb.",
        text: lines(
          `1. [their name], quick one about [the thing you noticed]`,
          `2. ${short} for [their company]?`,
          `3. [the specific thing], ${money.slot}`
        ),
      },
      {
        id: "body",
        label: "The email",
        note: "Under 120 words. One noticing, one offer with a number, one easy question. Nothing about how you got here.",
        text: lines(
          `Hi [name],`,
          "",
          `[The specific thing you noticed. One line, and it has to be true. If it could be sent to anyone, it gets read by nobody.]`,
          "",
          `${we} make ${it}. It is for ${aud.they}. ${proof.startsWith("[") ? "[The one number or name that makes this credible.]" : cap(proof)}`,
          "",
          `If it is useful, ${solo ? "I" : "we"} can [do the specific small version] for ${money.slot}. It takes [a week].`,
          "",
          `Worth a look?`,
          "",
          `[Your name]`,
          `[Phone number a person answers]`
        ),
      },
      {
        id: "followup",
        label: "The follow up, three days later",
        note: "Most replies come from this one. Two lines, no guilt, and an easy way to say no.",
        text: lines(
          `Bumping this once in case it went under.`,
          "",
          `Same offer, still ${money.slot}. If it is a no, one word back and I will leave you alone.`
        ),
      },
      {
        id: "send",
        label: "Before you send it",
        note: "The bits that change the reply rate more than the words do.",
        text: lines(
          `· Send it [Tuesday or Wednesday], early. Monday is a bin.`,
          `· One link at most. Two looks like a campaign.`,
          `· ${block.note}`
        ),
      },
    ];
  }

  return [
    {
      id: "hook",
      label: "0:00 to 0:03",
      note: "The whole video is decided here. Say the most surprising true thing you have, first word first.",
      text: lines(
        `SAY: ${pick(
          [
            `${cap(edge.enemy)}`,
            `${aud.question}`,
            `Nobody told me ${thing} was even possible [here].`,
          ],
          seed
        )}`,
        `ON SCREEN: ${short}, close up, already moving.`,
        `TEXT: [the claim in four words]`
      ),
    },
    {
      id: "turn",
      label: "0:03 to 0:09",
      note: "The turn. What they assume, then what is actually true. No tension, no watch time.",
      text: lines(
        `SAY: Most people [do it the obvious way]. That is why [the obvious thing goes wrong].`,
        `ON SCREEN: the wrong way, held for one beat.`,
        `TEXT: most people get this wrong`
      ),
    },
    {
      id: "payoff",
      label: "0:09 to 0:22",
      note: "Give it away properly. Three beats, one idea each. Do not save the good part for a link.",
      text: lines(
        `SAY: [Beat one, the actual method.]`,
        `SAY: [Beat two, the part that takes practice.]`,
        `SAY: [Beat three, the mistake to avoid.]`,
        `ON SCREEN: hands, the thing, the result. Cut every two seconds.`
      ),
    },
    {
      id: "ask",
      label: "0:22 to 0:30",
      note: `One instruction or one question. A question gets comments, a link gets scrolled past. ${money.close}`,
      text: lines(
        `SAY: ${ask}`,
        `ON SCREEN: you, still, looking at the lens.`,
        `TEXT: ${money.tag}, ${aud.near}`
      ),
    },
    {
      id: "caption",
      label: "The caption and the first comment",
      note: "The caption sells to the people who watched with the sound off. The first comment is where the link lives.",
      text: lines(
        `CAPTION: ${head} ${cap(aud.near)}, ${money.tag}.`,
        "",
        `FIRST COMMENT: [the link, and one line saying what happens when they tap it]`
      ),
    },
  ];
}

/* -------------------------------------------------------------------------
   The house rules, checked out loud
   ------------------------------------------------------------------------- */

const BANNED = [
  "elevate",
  "unlock",
  "seamless",
  "seamlessly",
  "empower",
  "empowering",
  "journey",
  "solutions",
  "leverage",
  "game-changing",
  "game changing",
  "unleash",
  "revolutionary",
  "cutting-edge",
  "synergy",
  "world-class",
];

function readCheck(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 0);
  const longest = sentences.length ? Math.max(...sentences) : 0;
  const lower = text.toLowerCase();
  const found = BANNED.filter((w) => new RegExp(`\\b${w.replace("-", "[- ]")}\\b`).test(lower));
  const dashes = (text.match(/—|–/g) || []).length;
  return { words, longest, found, dashes };
}

/* -------------------------------------------------------------------------
   The component
   ------------------------------------------------------------------------- */

export default function WritingTrack({ accent }: { accent: string }) {
  const [facts, setFacts] = useState<Facts>(EMPTY);
  const [pieceId, setPieceId] = useState("page");
  const [seed, setSeed] = useState(0);
  const [headIdx, setHeadIdx] = useState(1);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [bump, setBump] = useState<Record<string, number>>({});
  const [pulled, setPulled] = useState(false);
  const [openNote, setOpenNote] = useState<string | null>(null);
  // Copying and downloading change nothing on screen, so they get said here.
  const [say, setSay] = useState("");

  /* Everything the visitor already told the site comes through here. Funnel
     answers first, then the idea itself, then anything saved from last time.
     Any of the three can be missing and the page still works. */
  useEffect(() => {
    let next = { ...EMPTY };
    let got = false;

    const a = readFunnelAnswers();
    (["who", "have", "price", "edge", "block"] as const).forEach((k) => {
      const v = a[k];
      if (v) {
        next[k] = v;
        got = true;
      }
    });

    const idea = readIdea();
    if (idea?.q) {
      next.idea = idea.q;
      got = true;
    }

    const saved = loadJSON<Record<string, any>>(KEY, {});
    if (saved.facts) next = { ...next, ...saved.facts };
    if (typeof saved.pieceId === "string") setPieceId(saved.pieceId);
    if (typeof saved.headIdx === "number") setHeadIdx(saved.headIdx);
    if (typeof saved.seed === "number") setSeed(saved.seed);
    if (saved.edits) setEdits(saved.edits);

    setFacts(next);
    setPulled(got);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      saveJSON(KEY, { facts, pieceId, headIdx, seed, edits });
    }, 400);
    return () => window.clearTimeout(t);
  }, [facts, pieceId, headIdx, seed, edits]);

  const heads = useMemo(() => headlines(facts, seed), [facts, seed]);
  const head = heads[Math.min(headIdx, heads.length - 1)].text;

  const sections = useMemo(() => {
    const base = build(pieceId, facts, head, seed);
    /* A section can be rerolled on its own without disturbing its neighbours,
       which is how people actually edit: one line bothers them, not the page. */
    return base.map((s) => {
      const b = bump[`${pieceId}:${s.id}`] || 0;
      if (!b) return s;
      const alt = build(pieceId, facts, head, seed + b * 7).find((x) => x.id === s.id);
      return alt || s;
    });
  }, [pieceId, facts, head, seed, bump]);

  const piece = PIECES.find((p) => p.id === pieceId) || PIECES[0];
  const keyOf = (id: string) => `${pieceId}:${id}`;
  const valueOf = (s: Section) => edits[keyOf(s.id)] ?? s.text;

  const full = useMemo(
    () =>
      [
        piece.name.toUpperCase(),
        phrase(facts.idea) ? `for ${phrase(facts.idea)}` : "",
        "",
        ...sections.flatMap((s) => [s.label, valueOf(s), ""]),
        "Anything in [brackets] is a fact only you have. Fill it in before this goes out.",
        "Written in Flow Mode at flowzone.dev/start",
      ]
        .filter((l) => l !== undefined)
        .join("\n"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, edits, pieceId, facts.idea]
  );

  const check = useMemo(
    () => readCheck(sections.map((s) => valueOf(s)).join(" ")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, edits]
  );

  const slots = (full.match(/\[[^\]]+\]/g) || []).length;

  /* A draft exists from the first second, so "a draft was generated" is not a
     real signal here. Investment is: they typed the idea, edited a section or
     asked for it again. Any one of those and the words on screen are theirs. */
  const touched = Boolean(facts.idea.trim()) || Object.keys(edits).length > 0 || seed > 0;

  const fileName = () =>
    `${(phrase(facts.idea) || pieceId).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${pieceId}.md`;

  const download = () => {
    downloadBlob(full, fileName(), "text/markdown");
    setSay("Downloaded as a markdown file.");
  };

  const copy = async () => {
    const how = await copyOrDownload(full, fileName(), "text/markdown");
    setSay(how === "copied" ? "Copied. Paste it wherever it needs to go." : "Clipboard was blocked, so it downloaded instead.");
  };

  const reroll = (id: string) => {
    setBump({ ...bump, [keyOf(id)]: (bump[keyOf(id)] || 0) + 1 });
    const next = { ...edits };
    delete next[keyOf(id)];
    setEdits(next);
  };

  const set = (k: keyof Facts, v: string) => setFacts({ ...facts, [k]: v });

  const selectClass =
    "w-full bg-paper-deep text-ink border border-rule px-3 py-2.5 text-[13px] font-light outline-none focus:border-accent transition-colors";

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Results appear away from focus, so assistive tech hears them here. */}
      <p aria-live="polite" className="sr-only">
        {say}
      </p>
      <div className="lg:col-span-7 space-y-4">
        {/* What the copy is written against. Wrong here means wrong everywhere. */}
        <div className="panel p-6 relative overflow-hidden">
          <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
          <p className="label mb-1">What this is written for</p>
          <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">
            {pulled
              ? "Pulled from your answers in Flow Mode. Change anything that is off and the writing changes with it."
              : "Answer these and the writing gets specific. Copy written against a known buyer and a known price beats copy written against a noun."}
          </p>

          <input
            value={facts.idea}
            onChange={(e) => set("idea", e.target.value)}
            placeholder="a bakery people cross town for"
            aria-label="What you are making"
            className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
          />

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-label text-ink-mute">Who pays</span>
              <select value={facts.who} onChange={(e) => set("who", e.target.value)} className={selectClass}>
                {WHO_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-label text-ink-mute">One customer pays</span>
              <select value={facts.price} onChange={(e) => set("price", e.target.value)} className={selectClass}>
                {PRICE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-label text-ink-mute">Your edge</span>
              <select value={facts.edge} onChange={(e) => set("edge", e.target.value)} className={selectClass}>
                {EDGE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-label text-ink-mute">What exists so far</span>
              <select value={facts.have} onChange={(e) => set("have", e.target.value)} className={selectClass}>
                {HAVE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-label text-ink-mute">What is in the way</span>
              <select value={facts.block} onChange={(e) => set("block", e.target.value)} className={selectClass}>
                {BLOCK_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input
            value={facts.proof}
            aria-label="One true thing about it"
            onChange={(e) => set("proof", e.target.value)}
            placeholder="One true thing: 200 loaves a week, all gone by noon"
            className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
          />
          <input
            value={facts.ask}
            aria-label="What you want them to do"
            onChange={(e) => set("ask", e.target.value)}
            placeholder="What you want them to do: text 555 0100 and you get a time back"
            className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Headlines with the mechanic showing, so the visitor picks with taste. */}
        <div className="panel p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <p className="label">Pick the headline</p>
            <button
              onClick={() => setSeed(seed + 1)}
              className="text-[11px] font-medium uppercase tracking-label transition-colors"
              style={{ color: accent }}
            >
              Six more →
            </button>
          </div>
          <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">
            Six mechanics, not six moods. The label tells you what each one is doing, so you can pick
            the one that fits your reader instead of the one that sounds nicest.
          </p>
          <div className="space-y-2">
            {heads.map((h, i) => {
              const on = i === headIdx;
              return (
                <button
                  key={h.mechanic}
                  onClick={() => setHeadIdx(i)}
                  className="w-full text-left rounded-2xl border p-4 transition-colors"
                  style={{
                    borderColor: on ? accent : "rgba(255,255,255,0.09)",
                    background: on ? `${accent}14` : "transparent",
                  }}
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-medium uppercase tracking-label"
                      style={{ color: on ? accent : "#9AA7BE" }}
                    >
                      {h.mechanic}
                    </span>
                    {on && (
                      <span className="text-[10px] uppercase tracking-label text-ink-mute">In use</span>
                    )}
                  </span>
                  <span className="block font-display text-base leading-snug mb-1.5">{h.text}</span>
                  <span className="block text-[12px] text-ink-mute font-light leading-relaxed">{h.why}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The draft itself, in the shape of the thing being written. */}
        <div className="panel p-6">
          <p className="label mb-3">{piece.name}</p>
          <p className="text-[13px] text-ink-soft font-light leading-relaxed">{piece.job}</p>
        </div>

        {sections.map((s, i) => (
          <div key={s.id} className="panel p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <p className="font-display text-base">
                <span className="text-ink-mute text-sm mr-2">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </p>
              <button
                onClick={() => reroll(s.id)}
                className="text-[11px] font-medium uppercase tracking-label transition-colors"
                style={{ color: accent }}
              >
                Another way →
              </button>
            </div>

            <textarea
              rows={Math.min(14, Math.max(3, valueOf(s).split("\n").length + 1))}
              value={valueOf(s)}
              aria-label={s.label}
              onChange={(e) => setEdits({ ...edits, [keyOf(s.id)]: e.target.value })}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-y"
            />

            <button
              onClick={() => setOpenNote(openNote === s.id ? null : s.id)}
              className="text-[11px] font-medium uppercase tracking-label mt-3 transition-colors"
              style={{ color: accent }}
            >
              {openNote === s.id ? "−" : "+"} Why this part exists
            </button>
            {openNote === s.id && (
              <p
                className="text-[13px] text-ink-soft font-light leading-relaxed mt-2.5 pl-4 border-l"
                style={{ borderLeftColor: accent }}
              >
                {s.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <div className="panel p-6">
          <p className="label mb-4">What are you writing?</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PIECES.map((p) => {
              const on = p.id === pieceId;
              return (
                <button
                  key={p.id}
                  onClick={() => setPieceId(p.id)}
                  className="text-left rounded-2xl border p-3 transition-colors"
                  style={{
                    borderColor: on ? accent : "rgba(255,255,255,0.09)",
                    background: on ? `${accent}14` : "transparent",
                  }}
                >
                  <span className="block text-[13px] font-display mb-1" style={{ color: on ? accent : "#F1F3F7" }}>
                    {p.name}
                  </span>
                  <span className="block text-[11px] text-ink-mute font-light leading-relaxed">{p.blurb}</span>
                </button>
              );
            })}
          </div>

          <p className="label mb-3">Reads clean?</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              ["Words", String(check.words)],
              ["Longest sentence", `${check.longest}w`],
              ["To fill in", String(slots)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-rule p-3">
                <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1">{k}</p>
                <p className="font-display text-xl">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft font-light leading-relaxed mb-5">
            {check.found.length || check.dashes
              ? `Fix these: ${[...check.found, check.dashes ? "an em dash" : ""].filter(Boolean).join(", ")}. They are the words that make writing sound like nobody wrote it.`
              : check.longest > 30
                ? "One sentence is running long. Cut it in two and the whole thing speeds up."
                : "No filler words, no em dashes, sentences short enough to say out loud."}
          </p>

          <div className="flex flex-wrap gap-2">
            <button onClick={download} className="btn-primary !px-4 !py-2.5 text-xs">
              Download <span className="arrow">→</span>
            </button>
            <button
              onClick={copy}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              Copy it all
            </button>
            <button
              onClick={() => {
                setEdits({});
                setBump({});
                setSeed(seed + 1);
              }}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              Write it again
            </button>
          </div>
        </div>

        <div className="panel p-6">
          <p className="label mb-3">The whole thing</p>
          <pre className="text-[12px] text-ink-soft font-light leading-relaxed whitespace-pre-wrap max-h-[30rem] overflow-y-auto">
            {full}
          </pre>
        </div>

        {/* Directly under the finished draft, because that is where the doubt
            lives. Nobody wonders whether copy is good while they are writing
            it. They wonder after they read it back. Gated on real work, so an
            untouched default draft never triggers an ask. */}
        {touched && (
          <AskAboutThis
            id="writing-draft"
            icon="pencil"
            subject={`Does this copy land? ${piece.name}`}
            title="Read it back. Does it sound like you?"
            note="Send the draft to Denny. He writes this stuff for clients and he will mark up what is working and what is not, free, no obligation."
            body={() =>
              askBody({
                opener: `I wrote this in Flow Mode. It is ${piece.name.toLowerCase()} and I want to know if it lands.`,
                sections: [
                  { label: "What it is for", text: facts.idea.trim() },
                  { label: "Who it is for", text: facts.who.trim() },
                  { label: "The headline", text: head },
                  ...sections.map((s) => ({ label: s.label, text: valueOf(s) })),
                  slots ? { label: "Still blank", text: `${slots} facts in brackets I have not filled in.` } : null,
                ],
                unsure: "The line I keep rewriting:",
              })
            }
            accent={accent}
          />
        )}
      </div>
    </div>
  );
}
