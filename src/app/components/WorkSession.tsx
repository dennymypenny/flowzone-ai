"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { hashSeed, renderStill } from "@/lib/generative";
import GenerativeField from "@/app/components/GenerativeField";
import VoiceSession from "@/app/components/VoiceSession";
import Tilt3D from "@/app/components/Tilt3D";

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
  previewLine: string;
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
    previewLine: "Something worth naming.",
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
    previewLine: "Shop the drop.",
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
    previewLine: "Work with us.",
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
    previewLine: "It runs itself now.",
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
  now: [
    "Nothing yet, honestly",
    "A logo I do not love",
    "Social accounts only",
    "An old site I have outgrown",
  ],
  who: [
    "People like me",
    "Local customers",
    "Other businesses",
    "Not sure yet, that is the problem",
  ],
  feel: [
    "Premium and quiet",
    "Loud and fun",
    "Warm and human",
    "Serious and technical",
    "Nostalgic",
  ],
  win: [
    "It exists and looks real",
    "People take me seriously",
    "First paying customer",
    "I stop doing this by hand",
  ],
};

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
    try {
      if (window.localStorage.getItem("flowzone.briefunlock.v1")) setUnlocked(true);
    } catch {
      /* ignore */
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

  const brief = () =>
    [
      `NAME — ${projectName || "Not named yet"}`,
      `PATH — ${path ? path.name : "Not chosen"}`,
      `DIRECTION — ${palette.name}`,
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

  const unlock = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gateEmail)) {
      setGateErr("That does not look like an email address.");
      return;
    }
    setGateErr("");
    setUnlocked(true);
    try {
      window.localStorage.setItem("flowzone.briefunlock.v1", "1");
    } catch {
      /* ignore */
    }
    // Best effort. A failed send must never block someone from their own work.
    try {
      await fetch("/api/subscribe", {
        method: "POST",
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

    const headH = 452;
    const footH = 132;
    const bodyH = blocks.reduce((h, b) => h + (b.kind === "eyebrow" ? 58 : 40), 0);

    const c = document.createElement("canvas");
    c.width = W;
    c.height = headH + bodyH + footH;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#080D18";
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
    fade.addColorStop(0, "rgba(8,13,24,0)");
    fade.addColorStop(1, "#080D18");
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
    ctx.font = "600 52px Poppins, sans-serif";
    ctx.fillText("Your brief", pad, 356);
    ctx.font = "300 24px Poppins, sans-serif";
    ctx.fillStyle = "#8B94A3";
    ctx.fillText(path ? path.name : "Work session", pad, 396);

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
    } catch {
      setSaveState("error");
    }
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
          className="border border-rule overflow-hidden transition-colors duration-700"
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
              colors={{ bg: palette.bg, a: palette.a, b: palette.b, ink: palette.ink }}
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
        <div className="border border-rule border-t-0 px-4 py-3 flex items-center justify-between gap-3">
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
                        borderColor: answers.palette === p.id ? p.a : "#1D2942",
                        background: answers.palette === p.id ? "rgba(255,255,255,0.03)" : "transparent",
                      }}
                    >
                      <span className="flex gap-1 mb-2.5">
                        <span className="w-4 h-4 block" style={{ background: p.a }} />
                        <span className="w-4 h-4 block" style={{ background: p.b }} />
                        <span className="w-4 h-4 block" style={{ background: p.bg, border: "1px solid #1D2942" }} />
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

            <div className="border border-rule p-6 mb-8">
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
                      That did not send. Check the address, or use the download buttons
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
