"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * The narrowing funnel, asked like a consultant.
 *
 * The old three questions were polite and told nobody anything. These six
 * are the ones somebody who charges by the hour would open with: who pays,
 * what exists, what a customer is worth, why you and not the next one, and
 * what is actually in the way. One tap each, so honesty stays cheap.
 *
 * At the point of the funnel the answers stop being a summary and become a
 * read: the arithmetic of the price, the name of the real bottleneck, an
 * honest look at the edge, and a first move that is allowed to disagree
 * with the one they picked. Disagreeing is the whole value.
 */

type Q = {
  id: string;
  ask: string;
  why: string;
  options: string[];
};

const QUESTIONS: Q[] = [
  {
    id: "who",
    ask: "Who actually pays for this?",
    why: "Not who likes it. Who hands over money.",
    options: ["people nearby", "people online", "other businesses", "not sure yet"],
  },
  {
    id: "have",
    ask: "What exists so far?",
    why: "This changes the order of everything below.",
    options: ["just the idea", "an audience", "a name and a look", "paying customers"],
  },
  {
    id: "price",
    ask: "What does one customer pay you?",
    why: "The number decides whether this is a volume game or a trust game.",
    options: ["under $20", "$20 to $100", "$100 to $1,000", "over $1,000", "nothing yet"],
  },
  {
    id: "edge",
    ask: "Why would they pick you over the next one?",
    why: "If there is no answer, that is the finding.",
    options: [
      "nobody near me does it",
      "it is better made",
      "it is cheaper",
      "I am the reason",
      "still working that out",
    ],
  },
  {
    id: "block",
    ask: "What is actually in the way right now?",
    why: "Most people spend money on the wrong one of these.",
    options: [
      "nobody knows it exists",
      "it looks amateur",
      "I cannot explain it fast",
      "no time to build it",
      "no money to spend",
    ],
  },
  {
    id: "first",
    ask: "What do you think should exist first?",
    why: "Answer honestly. You will get a second opinion.",
    options: ["the brief", "the design", "a reel", "a one-pager", "the site"],
  },
];

const COLORS = ["#1E3A8A", "#2F5BC4", "#5B9BF9", "#8FBEF9", "#C6E4F8", "#DCEEFB", "#5B8CFF"];
const KEY = "flowzone.funnel.v2";

/** What one customer is worth, and what that implies about volume. */
const MONEY: Record<string, { mid: number; line: (n: number) => string }> = {
  "under $20": {
    mid: 12,
    line: (n) =>
      `At around $12 a sale this is a volume game: roughly ${n} customers a month to clear $3,000. Volume games are won with reach and repeat, never with a prettier logo.`,
  },
  "$20 to $100": {
    mid: 60,
    line: (n) =>
      `At around $60 a sale you need roughly ${n} customers a month to clear $3,000. That is reachable, and it lives or dies on how often people see you.`,
  },
  "$100 to $1,000": {
    mid: 400,
    line: (n) =>
      `At around $400 a sale you only need about ${n} customers a month to clear $3,000. That is a trust game, not a volume game. Everything should be built to make one person say yes.`,
  },
  "over $1,000": {
    mid: 2000,
    line: () =>
      `Over $1,000 a customer means one or two yeses a month changes your year. Nothing here should chase an audience. It should chase a handful of the right people.`,
  },
  "nothing yet": {
    mid: 0,
    line: () =>
      `Nothing has a price yet, and that is the first decision rather than the last. Pick a number you can say out loud without flinching, then build backwards from it.`,
  },
};

const BOTTLENECK: Record<string, string> = {
  "nobody knows it exists":
    "This is a distribution problem, not a product one. More polish does not fix it and usually delays the fix.",
  "it looks amateur":
    "Trust is the leak. People decide in the first two seconds and right now they are deciding wrong.",
  "I cannot explain it fast":
    "The problem is the sentence, not the thing. If you cannot say it in one line, nobody can repeat it for you, and repeating is how it spreads.",
  "no time to build it":
    "You are the constraint. Anything that needs your hands every week will stall, so the first build has to remove work rather than add it.",
  "no money to spend":
    "Then the first thing you make has to sell, not impress. Impressive comes out of the money that sells.",
};

const EDGE: Record<string, string> = {
  "nobody near me does it":
    "Being the only one nearby is a real edge and a temporary one. Use it loudly while it lasts.",
  "it is better made":
    "Better made is only an edge if people can see it before they buy. That is a proof problem, and proof is showable.",
  "it is cheaper":
    "Cheapest is the hardest position to hold. Anyone with deeper pockets can take it from you in a week.",
  "I am the reason":
    "You are the moat. That means your face and your voice belong out front, and a logo cannot do that job for you.",
  "still working that out":
    "No edge yet is an honest answer and the highest-value thing on this list to fix. Everything else gets easier after it.",
};

/** The honest first move, which is often not the one they picked. */
const ADVISE: Record<string, { thing: string; because: string }> = {
  "nobody knows it exists": {
    thing: "a reel",
    because: "people have to see it before anything else matters",
  },
  "it looks amateur": {
    thing: "the design",
    because: "the trust gap is costing you sales you never hear about",
  },
  "I cannot explain it fast": {
    thing: "the brief",
    because: "the words come first and everything else is built out of them",
  },
  "no time to build it": {
    thing: "the site",
    because: "a site that takes bookings works the hours you do not have",
  },
  "no money to spend": {
    thing: "a one-pager",
    because: "one page can start selling this week for almost nothing",
  },
};

const HAVE: Record<string, string> = {
  "just the idea":
    "Nothing exists yet, so the win is something you can show a real person this week.",
  "an audience":
    "You already have attention, which is the expensive part. The gap is something to send them to.",
  "a name and a look":
    "You have the surface. What is missing is the proof underneath it.",
  "paying customers":
    "You have proof, which almost nobody else on this page has. Lead with it everywhere.",
};

export default function FunnelNarrow({
  topic,
  onDone,
}: {
  topic: string;
  /** Fires the moment the last question lands, so the page can open up the
      next thing instead of having it sitting there the whole time. */
  onDone?: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setDone(Boolean(parsed.done));
        if (parsed.done) onDone?.();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const idx = QUESTIONS.findIndex((q) => !answers[q.id]);
  const current = idx === -1 ? null : QUESTIONS[idx];

  const answer = (q: Q, opt: string) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    const finished = QUESTIONS.every((qq) => next[qq.id]);
    if (finished) {
      setDone(true);
      onDone?.();
    }
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ answers: next, done: finished }));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setAnswers({});
    setDone(false);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  // ---- The read -------------------------------------------------------
  const money = MONEY[answers.price] || MONEY["nothing yet"];
  const perMonth = money.mid ? Math.max(1, Math.round(3000 / money.mid)) : 0;
  const advice = ADVISE[answers.block] || { thing: answers.first, because: "" };
  const agrees = advice.thing === answers.first;

  /** The point of the funnel: the recommendation becomes the next move. */
  const go = (thing: string) => {
    if (thing === "a reel") {
      document.getElementById("make-video")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (thing === "the site") {
      window.location.href = "/intake";
      return;
    }
    const track = thing === "the brief" ? "brief" : thing === "a one-pager" ? "writing" : "design";
    try {
      window.localStorage.setItem("flowzone.track.v2", track);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  const message = `Hi FlowZone, I want to get ${topic} moving. It is for ${answers.who}, I have ${answers.have}, a customer is worth ${answers.price}, my edge is ${answers.edge}, and what is in the way is ${answers.block}. First thing I need is ${advice.thing}.`;

  const levels = QUESTIONS.filter((q) => answers[q.id]);

  return (
    <div className="mt-8 max-w-xl">
      {/* the funnel so far: each answer a narrower bar */}
      <div className="space-y-1.5 mb-6">
        <div
          className="mx-auto rounded-md px-3 py-1.5 text-center text-[12px] font-medium text-white"
          style={{ width: "100%", background: COLORS[0] }}
        >
          {topic}
        </div>
        {levels.map((q, i) => (
          <div
            key={q.id}
            className="mx-auto rounded-md px-3 py-1.5 text-center text-[12px] font-medium truncate"
            style={{
              width: `${88 - i * 11}%`,
              background: COLORS[(i + 1) % COLORS.length],
              color: i >= 1 ? "#0B1322" : "#FFFFFF",
              animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {answers[q.id]}
          </div>
        ))}
      </div>

      {current && (
        <div key={current.id} style={{ animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
          <p className="label mb-3">
            Narrow it · {idx + 1} of {QUESTIONS.length}
          </p>
          <p className="font-display text-xl mb-1.5">{current.ask}</p>
          <p className="text-xs text-ink-mute font-light mb-4">{current.why}</p>
          <div className="flex flex-wrap gap-2">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(current, opt)}
                className="text-sm border border-rule text-ink-soft px-4 py-2.5 rounded-xl hover:text-ink hover:border-accent hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div
          className="panel p-6 mt-2"
          style={{ animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <p className="label mb-4">The read on {topic}</p>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-label mb-1.5" style={{ color: "#34D399" }}>
                The arithmetic
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed">
                {money.line(perMonth)}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-label mb-1.5" style={{ color: "#FBBF24" }}>
                The real bottleneck
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed">
                {BOTTLENECK[answers.block]} {HAVE[answers.have]}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-label mb-1.5" style={{ color: "#F0845F" }}>
                Your edge, honestly
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed">{EDGE[answers.edge]}</p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-label mb-1.5" style={{ color: "#5B9BF9" }}>
                {agrees ? "You called it" : "A second opinion"}
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed">
                {agrees ? (
                  <>
                    You picked <span className="text-ink">{answers.first}</span> first, and that is
                    the right call, {advice.because}.
                  </>
                ) : (
                  <>
                    You said <span className="text-ink">{answers.first}</span> first. From where you
                    are standing, <span className="text-accent">{advice.thing}</span> moves money
                    sooner, {advice.because}. You still get {answers.first}, just second.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={() => go(advice.thing)} className="btn-primary shine !px-5 !py-2.5 text-sm">
              Make {advice.thing} now <span className="arrow">→</span>
            </button>
            {!agrees && (
              <button
                onClick={() => go(answers.first)}
                className="btn-ghost !px-4 !py-2.5 text-xs"
              >
                No, {answers.first} first
              </button>
            )}
            <button onClick={reset} className="btn-ghost !px-4 !py-2.5 text-xs">
              Start over
            </button>
          </div>

          {/* The sell, made of their own answers */}
          <div className="border-t border-rule pt-5">
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Or skip the homework entirely. {advice.thing.charAt(0).toUpperCase() + advice.thing.slice(1)} and
              the rest of it, built for you and live in days.{" "}
              <span className="text-ink">Flat, from $600.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={
                  SITE.phone
                    ? `sms:${SITE.phone}?&body=${encodeURIComponent(message)}`
                    : `mailto:${SITE.email}?subject=${encodeURIComponent(
                        `Get ${topic} moving`
                      )}&body=${encodeURIComponent(message)}`
                }
                className="btn-primary shine !px-5 !py-2.5 text-sm"
              >
                Have us build it <span className="arrow">→</span>
              </a>
              <a href="/pricing" className="text-xs text-ink-mute hover:text-ink transition-colors">
                See the three prices first
              </a>
            </div>
            <p className="text-[11px] text-ink-mute mt-3">
              Every answer rides along in the message, so the reply you get is already specific.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
