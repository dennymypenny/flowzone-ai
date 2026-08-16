"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * A guided session that turns a vague intention into a real brief.
 *
 * The first decision picks a path, and the path narrows everything after it:
 * the questions asked, the prompts offered, and the build recommended at the
 * end. The visitor is always working over their own idea, never filling in a
 * generic form.
 *
 * Everything saves to their browser as they go, so a session survives a closed
 * tab. No backend and no signup: nothing leaves their machine until they press
 * send, which is why it can be handed to a stranger on the first visit.
 */

const KEY = "flowzone.session.v2";

type Path = {
  id: string;
  color: string;
  icon: string;
  name: string;
  blurb: string;
  build: string;
  buildWhy: string;
  // Path-specific prompts, keyed by step id
  chips: Record<string, string[]>;
  focus: Record<string, string>;
};

const PATHS: Path[] = [
  {
    id: "brand",
    color: "#4C7BE8",
    icon: "🎨",
    name: "Starting from nothing",
    blurb: "There is an idea and not much else yet. It needs a name, a look and a voice before anything can be built.",
    build: "The Identity Build",
    buildWhy:
      "You are at the beginning, so the mark, the palette, the type and the voice come first. Everything after it gets built against those decisions instead of guessing.",
    chips: {
      now: ["Nothing yet", "Just a name I like", "A rough logo I made", "A notes app full of ideas"],
      who: ["People like me", "Local customers", "A niche community", "Not sure yet, that is the problem"],
      feel: ["Premium and quiet", "Loud and fun", "Warm and human", "Serious and technical"],
      win: ["It exists and looks real", "I stop being embarrassed to share it", "First paying customer"],
    },
    focus: {
      who: "You get to choose here, which is rare. Who do you want it to be for?",
      feel: "This is the most important answer on the page. It is the one that decides what your brand ends up looking like.",
    },
  },
  {
    id: "shop",
    color: "#A78BFA",
    icon: "🛒",
    name: "I want to sell things",
    blurb: "Products, real ones, and a place to sell them properly instead of through DMs and screenshots.",
    build: "The Storefront Build",
    buildWhy:
      "You need a real shop: product pages built for how your buyers decide, a cart, and checkout that takes money without you touching it.",
    chips: {
      now: ["Selling through DMs", "On a marketplace", "An Instagram and nothing else", "A shop I do not like"],
      who: ["Collectors", "Repeat regulars", "Gift buyers", "People who found me on social"],
      feel: ["Like a real store", "Hyped and loud", "Clean and trustworthy", "Nostalgic"],
      win: ["First sales through my own site", "Stop taking orders in DMs", "Look legitimate enough to be trusted"],
    },
    focus: {
      now: "How are people buying from you today, even if it is messy?",
      win: "What number or moment would tell you the shop was worth building?",
    },
  },
  {
    id: "site",
    color: "#5B9BF9",
    icon: "🌐",
    name: "I need a proper site",
    blurb: "The business is real. The site is not doing it justice, or does not exist at all.",
    build: "The Site Build",
    buildWhy:
      "The business exists, so this is about the place people land. Custom design against your brand, words written for you, and forms that reach your inbox.",
    chips: {
      now: ["No site at all", "A template I outgrew", "A one pager", "A site I am embarrassed by"],
      who: ["Other businesses", "Local customers", "People comparing me to competitors", "Referrals checking me out"],
      feel: ["Credible and calm", "Confident, not corporate", "Modern and fast", "Like a bigger company than I am"],
      win: ["Enquiries that actually arrive", "Stop losing people who look me up", "Charge more without flinching"],
    },
    focus: {
      who: "Who is looking you up right now, and what are they trying to decide?",
      feel: "What impression do you want someone to walk away with in the first four seconds?",
    },
  },
  {
    id: "system",
    color: "#34D399",
    icon: "⚙️",
    name: "The manual work is eating me",
    blurb: "The launch went fine. Now you are doing the same jobs by hand every day and it does not scale.",
    build: "The Engine Build",
    buildWhy:
      "The front is working, so the fix is behind it. Intake, booking, invoicing and reporting wired up so the day to day runs without you.",
    chips: {
      now: ["Chasing leads by hand", "Booking over DMs", "Invoicing manually", "Copying between spreadsheets"],
      who: ["Existing customers", "New enquiries", "My team", "Just me, drowning"],
      feel: ["Invisible, it should just work", "Fast and reliable", "Simple enough for my team"],
      win: ["Get my evenings back", "Nothing falls through", "Handle double the volume"],
    },
    focus: {
      now: "Which job do you repeat most, and how often?",
      win: "What would you do with the time it gives back?",
    },
  },
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
    icon: "💡",
    eyebrow: "The idea",
    q: "Say it in your own words.",
    hint: "The version you would say out loud to a friend. Messy is fine, this is the raw material.",
    rows: 4,
  },
  {
    id: "now",
    color: "#5B9BF9",
    icon: "📍",
    eyebrow: "Where you are",
    q: "What exists already?",
    hint: "Be honest about the messy parts. It changes what we would start with.",
    rows: 3,
  },
  {
    id: "who",
    color: "#A78BFA",
    icon: "🎯",
    eyebrow: "The audience",
    q: "Who is this for, specifically?",
    hint: "Not everyone. The person you picture on the other end.",
    rows: 3,
  },
  {
    id: "feel",
    color: "#FBBF24",
    icon: "✨",
    eyebrow: "The feel",
    q: "How should it feel to land on?",
    hint: "Adjectives are welcome. So are links to things you like and things you hate.",
    rows: 3,
  },
  {
    id: "win",
    color: "#34D399",
    icon: "🏁",
    eyebrow: "The win",
    q: "What makes this worth doing?",
    hint: "Ninety days after launch, what would make you glad you did it?",
    rows: 3,
  },
];

const RANKS = [
  { label: "Not started", color: "#647089" },
  { label: "A sketch", color: "#4C7BE8" },
  { label: "Taking shape", color: "#5B9BF9" },
  { label: "Getting real", color: "#A78BFA" },
  { label: "Sharp", color: "#FBBF24" },
  { label: "Ready to build", color: "#34D399" },
];

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
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p: Saved = JSON.parse(raw);
        setAnswers(p.answers || {});
        setPathId(p.path || null);
        setStep(Math.min(p.step || 0, STEPS.length + 1));
        setStarted(p.started || null);
      }
    } catch {
      /* storage must never break the page */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          KEY,
          JSON.stringify({ answers, path: pathId, step, started } as Saved)
        );
        setSavedTick(true);
        window.setTimeout(() => setSavedTick(false), 1400);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [answers, pathId, step, started, loaded]);

  const path = PATHS.find((p) => p.id === pathId) || null;
  const answered = STEPS.filter((s) => (answers[s.id] || "").trim()).length;
  const rank = RANKS[answered] || RANKS[0];
  const onPathPick = step === 1;
  const onSummary = step > STEPS.length + 1;
  const current = step >= 2 && step <= STEPS.length + 1 ? STEPS[step - 2] : null;

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

  const brief = () =>
    [
      `PATH — ${path ? path.name : "Not chosen"}`,
      ...STEPS.map(
        (s) => `${s.eyebrow.toUpperCase()} — ${s.q}\n${(answers[s.id] || "").trim() || "—"}`
      ),
      path ? `SUGGESTED BUILD — ${path.build}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `My work session${path ? " — " + path.build : ""}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nI worked through the session on your site. Here is where I landed.\n\n${brief()}\n\nThanks,\n`
  )}`;

  const downloadText = () => {
    const blob = new Blob(
      [`FLOWZONE WORK SESSION\n${started ? "Started " + started : ""}\n\n${brief()}\n\nflowzone.dev\n`],
      { type: "text/plain" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flowzone-brief.txt";
    a.click();
    URL.revokeObjectURL(a.href);
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

    const blocks: Array<{ t: string; kind: "eyebrow" | "body"; color: string }> = [];
    STEPS.forEach((s) => {
      blocks.push({ t: s.eyebrow.toUpperCase(), kind: "eyebrow", color: s.color });
      wrap(
        (answers[s.id] || "").trim() || "Left blank",
        "300 26px Poppins, sans-serif",
        W - pad * 2
      ).forEach((l) => blocks.push({ t: l, kind: "body", color: "#C7CFDD" }));
    });

    const headH = 268;
    const footH = 132;
    const bodyH = blocks.reduce((h, b) => h + (b.kind === "eyebrow" ? 58 : 40), 0);

    const c = document.createElement("canvas");
    c.width = W;
    c.height = headH + bodyH + footH;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#080D18";
    ctx.fillRect(0, 0, c.width, c.height);
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "#1E3A8A");
    g.addColorStop(0.5, "#5B9BF9");
    g.addColorStop(1, "#C6E4F8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 6);

    ([["#1E3A8A", pad + 12], ["#5B9BF9", pad + 52], ["#C6E4F8", pad + 92]] as const).forEach(
      ([col, x]) => {
        ctx.beginPath();
        ctx.arc(x, 84, 12, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }
    );

    ctx.fillStyle = "#F1F3F7";
    ctx.font = "600 52px Poppins, sans-serif";
    ctx.fillText("Your brief", pad, 172);
    ctx.font = "300 24px Poppins, sans-serif";
    ctx.fillStyle = "#8B94A3";
    ctx.fillText(path ? path.name : "Work session", pad, 212);

    let y = headH;
    blocks.forEach((b) => {
      if (b.kind === "eyebrow") {
        y += 18;
        ctx.font = "500 17px Poppins, sans-serif";
        ctx.fillStyle = b.color;
        ctx.fillText(b.t, pad, y);
        y += 40;
      } else {
        ctx.font = "300 26px Poppins, sans-serif";
        ctx.fillStyle = b.color;
        ctx.fillText(b.t, pad, y);
        y += 40;
      }
    });

    if (path) {
      ctx.font = "500 22px Poppins, sans-serif";
      ctx.fillStyle = path.color;
      ctx.fillText(`Suggested: ${path.build}`, pad, c.height - 84);
    }
    ctx.font = "500 20px Poppins, sans-serif";
    ctx.fillStyle = "#5B8CFF";
    ctx.fillText("flowzone.dev", pad, c.height - 44);

    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "flowzone-brief.png";
    a.click();
  };

  const reset = () => {
    setAnswers({});
    setPathId(null);
    setStep(0);
    setStarted(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  const chipsFor = (id: string) => (path && path.chips[id]) || [];
  const hintFor = (s: Step) => (path && path.focus[s.id]) || s.hint;

  return (
    <div className="panel overflow-hidden">
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
                className="w-5 h-[3px] block transition-colors duration-300"
                style={{
                  background: (answers[s.id] || "").trim() ? s.color : "#1D2942",
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
              Five questions after that. It saves as you go, so close the tab whenever
              you like. Nothing is sent anywhere until you decide to send it.
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
              <span className="text-2xl leading-none">🧭</span>
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
                  <span className="block text-2xl mb-4 mt-1 leading-none">{p.icon}</span>
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
              <span className="text-2xl leading-none">{current.icon}</span>
              <p
                className="text-[11px] font-medium uppercase tracking-label"
                style={{ color: current.color }}
              >
                {current.eyebrow} · {step - 1} of {STEPS.length}
              </p>
            </div>

            <h3 className="font-display text-2xl md:text-3xl mb-3">{current.q}</h3>
            <p className="text-sm text-ink-soft font-light leading-relaxed max-w-reading mb-6">
              {hintFor(current)}
            </p>

            {chipsFor(current.id).length > 0 && (
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
            )}

            <textarea
              rows={current.rows}
              value={answers[current.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder="In your own words..."
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
                <span
                  className={`text-[11px] uppercase tracking-label transition-opacity duration-500 ${
                    savedTick ? "opacity-100 text-accent" : "opacity-0"
                  }`}
                >
                  Saved
                </span>
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
              <span className="text-base leading-none">
                {answered === STEPS.length ? "🏆" : "📈"}
              </span>
              <span
                className="text-[11px] font-medium uppercase tracking-label"
                style={{ color: rank.color }}
              >
                {answered === STEPS.length
                  ? "All five answered · Ready to build"
                  : `${answered} of ${STEPS.length} answered · ${rank.label}`}
              </span>
            </div>

            <h3 className="font-display text-3xl md:text-4xl mb-3">
              {answered === STEPS.length
                ? "You just built a brief."
                : "Already more than most people arrive with."}
            </h3>
            <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-9">
              It is yours. Take it anywhere, brief anyone with it. Or send it here and
              you will get back a scope, a price and a date.
            </p>

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
              </div>
            )}

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

            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-rule">
              <a href={mailto} className="btn-primary">
                Send this brief <span className="arrow">→</span>
              </a>
              <button
                onClick={downloadImage}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised"
              >
                Save as image
              </button>
              <button
                onClick={downloadText}
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
  );
}
