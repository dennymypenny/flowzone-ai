"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * The writing track.
 *
 * Not a generator you paste a topic into. The reason generated copy reads like
 * generated copy is that the person asking does not know what a good one is
 * built from, so they cannot tell when it is wrong.
 *
 * So this hands over the structure instead: the named parts, in order, each
 * with the job it is doing and the mistake it prevents, as fields you fill in.
 * You end up with copy that is yours, in a shape that works, and you learn the
 * shape on the way through.
 *
 * Entirely local. No model call, no key, no cost, works offline.
 */

const KEY = "flowzone.writing.v1";

type Part = { id: string; name: string; job: string; watch: string; hint: string; rows: number; seconds?: number };
type Piece = { id: string; name: string; blurb: string; parts: Part[] };

const PIECES: Piece[] = [
  {
    id: "video",
    name: "Long video script",
    blurb: "Six to twelve minutes. Built to hold attention the whole way.",
    parts: [
      {
        id: "hook",
        name: "The hook",
        job: "Confirm the click, then open a loop you will close later.",
        watch: "Do not open with who you are. Nobody has decided to care yet.",
        hint: "Say what they came for in one line, then hint at the thing you will reveal.",
        rows: 4,
        seconds: 15,
      },
      {
        id: "proof",
        name: "Why you",
        job: "One line of evidence that you are worth the next five minutes.",
        watch: "A credential is weaker than a result. Give the number, not the title.",
        hint: "The specific thing you have done that makes this credible.",
        rows: 2,
        seconds: 10,
      },
      {
        id: "stakes",
        name: "Why it matters",
        job: "Name the cost of not knowing this. That is what creates tension.",
        watch: "Vague stakes are no stakes. What do they actually lose?",
        hint: "What happens if they carry on the way they are.",
        rows: 3,
        seconds: 15,
      },
      {
        id: "body",
        name: "The body",
        job: "Your points, strongest first, each one landed before the next starts.",
        watch: "Do not list everything up front. Once they can see the whole shape, they leave.",
        hint: "One point per paragraph. Context, then how to use it, then why it matters.",
        rows: 8,
        seconds: 240,
      },
      {
        id: "rehook",
        name: "Rehooks",
        job: "Short lines between sections that reset attention.",
        watch: "Attention drops the longer a section runs. Every 30 to 40 seconds, break the pattern.",
        hint: "One per section. \"But none of that works if you skip the next part.\"",
        rows: 3,
        seconds: 20,
      },
      {
        id: "close",
        name: "The close",
        job: "Summarise, let them picture the result, then name one next step.",
        watch: "Two calls to action is the same as none.",
        hint: "What they now know, what it gets them, and the single thing to do next.",
        rows: 4,
        seconds: 30,
      },
    ],
  },
  {
    id: "reel",
    name: "Short reel script",
    blurb: "Under 45 seconds. Every word has to earn its place.",
    parts: [
      { id: "hook", name: "First 2 seconds", job: "Stop the scroll. Say the most surprising thing you have.", watch: "No greetings, no build-up. You do not have the time.", hint: "The claim, the number or the mistake. Straight in.", rows: 2, seconds: 2 },
      { id: "turn", name: "The turn", job: "Why what they assumed is wrong.", watch: "If there is no tension there is no reason to keep watching.", hint: "Most people think X. Actually Y.", rows: 3, seconds: 8 },
      { id: "payoff", name: "The payoff", job: "Deliver the thing you promised, fast and concretely.", watch: "Do not save it for a link. Give it away here.", hint: "The actual answer, in as few words as it takes.", rows: 4, seconds: 25 },
      { id: "cta", name: "The last line", job: "One instruction, or one question worth answering.", watch: "A question gets comments. A link gets scrolled past.", hint: "Say the one thing you want them to do or reply.", rows: 2, seconds: 5 },
    ],
  },
  {
    id: "page",
    name: "Landing page",
    blurb: "The page that has to do the convincing while you sleep.",
    parts: [
      { id: "head", name: "Headline", job: "The transformation, in the buyer's words, not yours.", watch: "Describing what you do is not a headline. Say what they get.", hint: "You imagine it. We get it moving.", rows: 2 },
      { id: "sub", name: "Subhead", job: "The specifics the headline had to leave out.", watch: "This is where the what and the how much go.", hint: "One sentence naming what is included and for whom.", rows: 3 },
      { id: "proof", name: "Proof", job: "The evidence that makes the claim survivable.", watch: "Real work beats testimonials. Show the thing.", hint: "A result, a named client, a number, a piece of work.", rows: 3 },
      { id: "objection", name: "The obvious objection", job: "Say the thing they are already thinking, before they leave.", watch: "Avoiding it reads as having no answer.", hint: "Too expensive, too slow, why not do it myself.", rows: 4 },
      { id: "cta", name: "The ask", job: "One action, with what happens next spelled out.", watch: "Ambiguity about what happens after the click kills conversion.", hint: "Text us and you get scope, price and a date back.", rows: 2 },
    ],
  },
  {
    id: "email",
    name: "Cold email",
    blurb: "Short enough to read on a phone between meetings.",
    parts: [
      { id: "subject", name: "Subject line", job: "Specific and low-key. It should not look like marketing.", watch: "No capitals, no emoji, no promises. Those get deleted.", hint: "Four to six words about them, not you.", rows: 1 },
      { id: "why", name: "Why them", job: "One line proving this is not a blast.", watch: "If it could be sent to anyone, it will be read by no one.", hint: "The specific thing you noticed about their business.", rows: 3 },
      { id: "offer", name: "The offer", job: "One sentence on what you would do and what it costs.", watch: "Do not ask for a call to explain. Explain.", hint: "The build, the price, the timeframe.", rows: 3 },
      { id: "ask", name: "The ask", job: "The smallest possible next step.", watch: "\"Worth a chat?\" beats a calendar link every time.", hint: "One question they can answer with one word.", rows: 2 },
    ],
  },
];

export default function WritingTrack({ accent }: { accent: string }) {
  const [pieceId, setPieceId] = useState("video");
  const [text, setText] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const piece = PIECES.find((p) => p.id === pieceId) || PIECES[0];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setPieceId(p.pieceId || "video");
        setText(p.text || {});
        setTitle(p.title || "");
      }
    } catch {
      /* storage must never break the page */
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ pieceId, text, title }));
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [pieceId, text, title]);

  const key = (partId: string) => `${pieceId}:${partId}`;
  const val = (partId: string) => text[key(partId)] || "";

  const words = useMemo(
    () =>
      piece.parts.reduce(
        (n, p) => n + val(p.id).trim().split(/\s+/).filter(Boolean).length,
        0
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, pieceId]
  );
  const readMins = Math.max(0, words / 150);
  const filled = piece.parts.filter((p) => val(p.id).trim()).length;

  const full = () =>
    [
      title.trim() || piece.name,
      "",
      ...piece.parts.flatMap((p) => [
        `## ${p.name.toUpperCase()}`,
        val(p.id).trim() || "(not written yet)",
        "",
      ]),
      `Words: ${words} · about ${readMins.toFixed(1)} minutes spoken`,
      "Structured in Flow Mode at flowzone.dev/start",
    ].join("\n");

  const download = () => {
    const blob = new Blob([full()], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(title.trim() || piece.id).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full());
    } catch {
      download();
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div className="panel p-6 relative overflow-hidden">
          <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
          <p className="label mb-4">What are you writing?</p>
          <select
            value={pieceId}
            onChange={(e) => setPieceId(e.target.value)}
            className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
          >
            {PIECES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.blurb}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Working title"
            className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
          />
        </div>

        {piece.parts.map((part, i) => (
          <div key={part.id} className="panel p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <p className="font-display text-lg">
                <span className="text-ink-mute text-sm mr-2">{String(i + 1).padStart(2, "0")}</span>
                {part.name}
              </p>
              {part.seconds && (
                <span className="text-[11px] text-ink-mute">about {part.seconds}s</span>
              )}
            </div>
            <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-3">{part.job}</p>

            <textarea
              rows={part.rows}
              value={val(part.id)}
              onChange={(e) => setText({ ...text, [key(part.id)]: e.target.value })}
              placeholder={part.hint}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none"
            />

            <button
              onClick={() => setOpen(open === part.id ? null : part.id)}
              className="text-[11px] font-medium uppercase tracking-label mt-3 transition-colors"
              style={{ color: accent }}
            >
              {open === part.id ? "−" : "+"} The mistake this prevents
            </button>
            {open === part.id && (
              <p
                className="text-[13px] text-ink-soft font-light leading-relaxed mt-2.5 pl-4 border-l"
                style={{ borderLeftColor: accent }}
              >
                {part.watch}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <div className="panel p-6">
          <p className="label mb-4">Where it stands</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              ["Words", String(words)],
              ["Spoken", `${readMins.toFixed(1)}m`],
              ["Parts", `${filled}/${piece.parts.length}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-rule p-3">
                <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1">{k}</p>
                <p className="font-display text-xl">{v}</p>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-raised mb-5">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${(filled / piece.parts.length) * 100}%`, background: accent }}
            />
          </div>
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
          </div>
        </div>

        <div className="panel p-6">
          <p className="label mb-3">The whole thing</p>
          <pre className="text-[12px] text-ink-soft font-light leading-relaxed whitespace-pre-wrap max-h-[30rem] overflow-y-auto">
            {full()}
          </pre>
        </div>
      </div>
    </div>
  );
}
