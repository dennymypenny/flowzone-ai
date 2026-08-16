"use client";
import { useEffect, useMemo, useState } from "react";
import MemeMaker from "@/app/components/MemeMaker";

/**
 * The content track.
 *
 * Reels and short video, planned properly: a hook, timed beats, the shot for
 * each one, a caption and the on-screen text. Editable throughout, because a
 * plan you cannot change is a plan you will abandon on the day.
 *
 * The whole thing runs locally. Openverse supplies real photographs and GIFs
 * for the meme maker, and nothing else calls out, so this costs nothing to run
 * however many people use it.
 */

const KEY = "flowzone.content.v1";

type Beat = { id: string; secs: number; say: string; show: string; text: string };

const TEMPLATES: Record<string, { name: string; blurb: string; beats: Array<Omit<Beat, "id">> }> = {
  hook: {
    name: "Hook and payoff",
    blurb: "The default. Grab, turn, deliver, ask.",
    beats: [
      { secs: 2, say: "The most surprising thing you know about this.", show: "Your face, close, mid-sentence already.", text: "The claim, 4 words max" },
      { secs: 8, say: "Why what they assume is wrong.", show: "Cut to the thing you are talking about.", text: "Most people think..." },
      { secs: 20, say: "The actual answer, given away properly.", show: "Show it happening. Hands, screen, product.", text: "Step labels" },
      { secs: 5, say: "One instruction or one question.", show: "Back to your face.", text: "The ask" },
    ],
  },
  before: {
    name: "Before and after",
    blurb: "Strongest format there is if you make things.",
    beats: [
      { secs: 2, say: "Name what is wrong with the before.", show: "The before, held still, unflattering.", text: "Before" },
      { secs: 6, say: "What you changed and why.", show: "The work happening, sped up.", text: "The one decision" },
      { secs: 12, say: "The after, and what it fixed.", show: "The after, same framing as the before.", text: "After" },
      { secs: 5, say: "Who this is for and how to get it.", show: "Your face or the logo.", text: "The ask" },
    ],
  },
  list: {
    name: "Three things",
    blurb: "Easy to shoot, easy to watch, easy to repeat weekly.",
    beats: [
      { secs: 3, say: "Three things about X that nobody tells you.", show: "Face, straight in.", text: "3 things" },
      { secs: 8, say: "Number one, and why it matters.", show: "Cut to an example.", text: "01" },
      { secs: 8, say: "Number two.", show: "Different angle, keep it moving.", text: "02" },
      { secs: 8, say: "Number three, the strongest one.", show: "The best visual you have.", text: "03" },
      { secs: 4, say: "Which one surprised you?", show: "Face.", text: "Comment yours" },
    ],
  },
  teach: {
    name: "Teach one thing",
    blurb: "Builds trust faster than anything else you can post.",
    beats: [
      { secs: 3, say: "The mistake almost everyone makes.", show: "The mistake, on screen.", text: "The mistake" },
      { secs: 5, say: "Why it happens.", show: "You, explaining.", text: "Why" },
      { secs: 15, say: "The fix, step by step.", show: "Do it on camera, no cuts if possible.", text: "The fix" },
      { secs: 5, say: "What to do with it now.", show: "Result.", text: "Try it" },
    ],
  },
};

const HASHTAG_BANK: Record<string, string[]> = {
  general: ["smallbusiness", "behindthescenes", "howitsmade", "buildinpublic", "learnontiktok"],
  design: ["branding", "graphicdesign", "logodesign", "brandidentity", "designtips"],
  food: ["foodie", "cafelife", "baking", "smallbatch", "localfood"],
  retail: ["smallshop", "newin", "restock", "unboxing", "collectors"],
  trade: ["trades", "renovation", "beforeandafter", "craftsmanship", "toolsofthetrade"],
};

let seq = 0;
const nid = () => `b${++seq}${Date.now().toString(36)}`;

export default function ContentTrack({ accent }: { accent: string }) {
  const [tpl, setTpl] = useState("hook");
  const [topic, setTopic] = useState("");
  const [beats, setBeats] = useState<Beat[]>([]);
  const [caption, setCaption] = useState("");
  const [tagSet, setTagSet] = useState("general");
  const [view, setView] = useState<"plan" | "meme">("plan");
  const [picked, setPicked] = useState<string | null>(null);
  const [shots, setShots] = useState<Array<{ id: string; thumb: string; url: string; title: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setTpl(p.tpl || "hook");
        setTopic(p.topic || "");
        setBeats(p.beats && p.beats.length ? p.beats : TEMPLATES.hook.beats.map((b) => ({ ...b, id: nid() })));
        setCaption(p.caption || "");
        setTagSet(p.tagSet || "general");
        return;
      }
    } catch {
      /* ignore */
    }
    setBeats(TEMPLATES.hook.beats.map((b) => ({ ...b, id: nid() })));
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ tpl, topic, beats, caption, tagSet }));
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [tpl, topic, beats, caption, tagSet]);

  const loadTemplate = (id: string) => {
    setTpl(id);
    setBeats((TEMPLATES[id] || TEMPLATES.hook).beats.map((b) => ({ ...b, id: nid() })));
  };

  const total = useMemo(() => beats.reduce((n, b) => n + (Number(b.secs) || 0), 0), [beats]);
  const patch = (id: string, field: keyof Beat, v: string | number) =>
    setBeats((bs) => bs.map((b) => (b.id === id ? { ...b, [field]: v } : b)));

  const pullRefs = async (kind: "photo" | "gif") => {
    const q = topic.trim() || "small business";
    setLoading(true);
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(q)}&kind=${kind}`);
      const data = await res.json();
      if (data.ok) setShots(data.shots || []);
    } catch {
      /* leave the board as it was */
    }
    setLoading(false);
  };

  const plan = () =>
    [
      `REEL PLAN — ${topic.trim() || "Untitled"}`,
      `Format: ${(TEMPLATES[tpl] || TEMPLATES.hook).name}`,
      `Runtime: ${total}s`,
      "",
      ...beats.flatMap((b, i) => [
        `[${String(i + 1).padStart(2, "0")}] ${b.secs}s`,
        `  SAY:  ${b.say}`,
        `  SHOW: ${b.show}`,
        `  TEXT: ${b.text}`,
        "",
      ]),
      "CAPTION",
      caption.trim() || "(not written)",
      "",
      "HASHTAGS",
      (HASHTAG_BANK[tagSet] || []).map((h) => `#${h}`).join(" "),
      "",
      "Planned in Flow Mode at flowzone.dev/start",
    ].join("\n");

  const download = () => {
    const blob = new Blob([plan()], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reel-plan-${(topic.trim() || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="panel p-6 mb-4 relative overflow-hidden">
        <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="label mb-2">Format</p>
            <select
              value={tpl}
              onChange={(e) => loadTemplate(e.target.value)}
              className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
            >
              {Object.entries(TEMPLATES).map(([id, t]) => (
                <option key={id} value={id}>
                  {t.name} — {t.blurb}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="label mb-2">What it is about</p>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. how we rebuilt a shop logo"
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-label text-ink-mute">Runtime {total}s</span>
          <div className="flex">
            {(["plan", "meme"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="text-[11px] px-3 py-1.5 border-t border-b border-r first:border-l transition-colors"
                style={{
                  borderColor: view === v ? "#5B8CFF" : "#1D2942",
                  color: view === v ? "#F1F3F7" : "#9AA7BE",
                  background: view === v ? "#101A2C" : "transparent",
                }}
              >
                {v === "plan" ? "Shot plan" : "Thumbnail / meme"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "plan" ? (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            {beats.map((b, i) => (
              <div key={b.id} className="panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display text-base">
                    <span className="text-ink-mute text-sm mr-2">{String(i + 1).padStart(2, "0")}</span>
                    Beat
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={b.secs}
                      onChange={(e) => patch(b.id, "secs", Number(e.target.value))}
                      className="w-16 bg-paper-deep text-ink border border-rule px-2 py-1.5 text-xs outline-none focus:border-accent"
                    />
                    <span className="text-[11px] text-ink-mute">sec</span>
                    <button
                      onClick={() => setBeats((bs) => bs.filter((x) => x.id !== b.id))}
                      className="text-[11px] text-ink-mute hover:text-ink transition-colors ml-1"
                    >
                      remove
                    </button>
                  </div>
                </div>
                {(
                  [
                    ["say", "Say", "What you actually say out loud"],
                    ["show", "Show", "What is on screen while you say it"],
                    ["text", "On-screen text", "The words burned into the frame"],
                  ] as const
                ).map(([f, label, ph]) => (
                  <div key={f} className="mb-2 last:mb-0">
                    <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1">{label}</p>
                    <textarea
                      rows={f === "say" ? 2 : 1}
                      value={b[f]}
                      onChange={(e) => patch(b.id, f, e.target.value)}
                      placeholder={ph}
                      className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-3 py-2 text-[13px] font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={() =>
                setBeats((bs) => [...bs, { id: nid(), secs: 5, say: "", show: "", text: "" }])
              }
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              + Add a beat
            </button>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="panel p-6">
              <p className="label mb-3">Caption</p>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="First line is the only one most people read. Put the hook there."
                className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none mb-3"
              />
              <p className="label mb-2">Hashtag set</p>
              <select
                value={tagSet}
                onChange={(e) => setTagSet(e.target.value)}
                className="w-full bg-paper-deep text-ink border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
              >
                {Object.keys(HASHTAG_BANK).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <p className="text-[12px] text-ink-soft font-light leading-relaxed">
                {(HASHTAG_BANK[tagSet] || []).map((h) => `#${h}`).join("  ")}
              </p>
            </div>

            <div className="panel p-6">
              <p className="label mb-3">Look for real footage references</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => pullRefs("photo")} disabled={loading} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                  {loading ? "Looking..." : "Photos"}
                </button>
                <button onClick={() => pullRefs("gif")} disabled={loading} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                  GIFs
                </button>
              </div>
              {shots.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {shots.slice(0, 8).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setPicked(s.url);
                        setView("meme");
                      }}
                      title={s.title}
                      className="border border-rule hover:border-accent transition-colors overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.thumb} alt={s.title} loading="lazy" className="w-full h-16 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="panel p-6">
              <p className="label mb-3">Take it with you</p>
              <button onClick={download} className="btn-primary !px-4 !py-2.5 text-xs">
                Download the plan <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel p-6">
          <p className="label mb-4">Thumbnail and meme maker</p>
          <MemeMaker src={picked} brandColor={accent} />
        </div>
      )}
    </div>
  );
}
