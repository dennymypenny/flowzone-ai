"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import MemeMaker from "@/app/components/MemeMaker";

/**
 * Planning a short video, for somebody who has never planned one.
 *
 * Two things drive every decision in here. The words are the words a normal
 * person uses: scenes, what you say, what we see, words on screen. Nobody
 * outside the industry says "beat" or "B-roll", and jargon is the fastest way
 * to make someone feel this tool is not for them.
 *
 * And you can just ask for changes. Typing "make it shorter" edits the plan,
 * because that is how people actually think about their own video. The
 * assistant runs on the Groq key already in the project, whose free tier costs
 * nothing, and when it is unavailable a set of local rules handles the common
 * requests so the button is never dead.
 */

const KEY = "flowzone.content.v2";

type Scene = { id: string; secs: number; say: string; show: string; text: string };

const TEMPLATES: Record<string, { name: string; blurb: string; scenes: Array<Omit<Scene, "id">> }> = {
  hook: {
    name: "Grab and deliver",
    blurb: "Works for almost anything. Start here if you are not sure.",
    scenes: [
      { secs: 2, say: "The most surprising thing you know about this.", show: "You, close up, already talking.", text: "The claim" },
      { secs: 8, say: "Why what people assume is wrong.", show: "Cut to the thing itself.", text: "Most people think..." },
      { secs: 20, say: "The actual answer, given away properly.", show: "Show it happening. Hands, screen, product.", text: "The steps" },
      { secs: 5, say: "One thing you want them to do.", show: "Back to you.", text: "The ask" },
    ],
  },
  before: {
    name: "Before and after",
    blurb: "The strongest one if you make or fix things.",
    scenes: [
      { secs: 2, say: "What is wrong with the before.", show: "The before, held still.", text: "Before" },
      { secs: 6, say: "What you changed and why.", show: "The work happening, sped up.", text: "The change" },
      { secs: 12, say: "The after, and what it fixed.", show: "The after, framed exactly like the before.", text: "After" },
      { secs: 5, say: "Who this is for.", show: "You, or your logo.", text: "The ask" },
    ],
  },
  list: {
    name: "Three things",
    blurb: "Easy to film, easy to repeat every week.",
    scenes: [
      { secs: 3, say: "Three things about this that nobody tells you.", show: "You, straight in.", text: "3 things" },
      { secs: 8, say: "The first one, and why it matters.", show: "An example.", text: "One" },
      { secs: 8, say: "The second one.", show: "New angle, keep it moving.", text: "Two" },
      { secs: 8, say: "The third, your strongest.", show: "Your best shot.", text: "Three" },
      { secs: 4, say: "Which one surprised you?", show: "You.", text: "Tell me yours" },
    ],
  },
  teach: {
    name: "Teach one thing",
    blurb: "Builds trust faster than anything else you can post.",
    scenes: [
      { secs: 3, say: "The mistake almost everyone makes.", show: "The mistake, on screen.", text: "The mistake" },
      { secs: 5, say: "Why it happens.", show: "You explaining.", text: "Why" },
      { secs: 15, say: "The fix, step by step.", show: "Do it on camera.", text: "The fix" },
      { secs: 5, say: "What to do with it now.", show: "The result.", text: "Try it" },
    ],
  },
};

const TAGS: Record<string, string[]> = {
  general: ["smallbusiness", "behindthescenes", "howitsmade", "buildinpublic"],
  design: ["branding", "logodesign", "brandidentity", "designtips"],
  food: ["foodie", "cafelife", "baking", "localfood"],
  retail: ["smallshop", "newin", "restock", "unboxing"],
  trades: ["trades", "renovation", "beforeandafter", "craftsmanship"],
};

const QUICK = [
  "Make it shorter",
  "Make the opening punchier",
  "Add a scene",
  "Make it sound less formal",
  "Write the caption for me",
];

let seq = 0;
const nid = () => `s${++seq}${Date.now().toString(36)}`;

export default function ContentTrack({ accent }: { accent: string }) {
  const [tpl, setTpl] = useState("hook");
  const [topic, setTopic] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [caption, setCaption] = useState("");
  const [tagSet, setTagSet] = useState("general");
  const [step, setStep] = useState<"plan" | "caption" | "thumb">("plan");
  const [picked, setPicked] = useState<string | null>(null);
  const [shots, setShots] = useState<Array<{ id: string; thumb: string; url: string; title: string }>>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [ask, setAsk] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<Array<{ you: string; back: string }>>([]);
  const logEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setTpl(p.tpl || "hook");
        setTopic(p.topic || "");
        setScenes(p.scenes?.length ? p.scenes : TEMPLATES.hook.scenes.map((b) => ({ ...b, id: nid() })));
        setCaption(p.caption || "");
        setTagSet(p.tagSet || "general");
        return;
      }
    } catch {
      /* ignore */
    }
    setScenes(TEMPLATES.hook.scenes.map((b) => ({ ...b, id: nid() })));
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ tpl, topic, scenes, caption, tagSet }));
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [tpl, topic, scenes, caption, tagSet]);

  const total = useMemo(() => scenes.reduce((n, s) => n + (Number(s.secs) || 0), 0), [scenes]);

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

  const loadTemplate = (id: string) => {
    setTpl(id);
    setScenes((TEMPLATES[id] || TEMPLATES.hook).scenes.map((b) => ({ ...b, id: nid() })));
  };

  const sendAsk = async (text?: string) => {
    const instruction = (text ?? ask).trim();
    if (!instruction || busy) return;
    setBusy(true);
    setAsk("");
    try {
      const res = await fetch("/api/plan-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction,
          topic,
          format: (TEMPLATES[tpl] || TEMPLATES.hook).name,
          caption,
          scenes: undefined,
          beats: scenes.map(({ secs, say, show, text: t }) => ({ secs, say, show, text: t })),
        }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.beats) && data.applied !== false) {
        setScenes(data.beats.map((b: Omit<Scene, "id">) => ({ ...b, id: nid() })));
        if (typeof data.caption === "string") setCaption(data.caption);
      }
      setLog((l) => [...l, { you: instruction, back: data.note || "Done." }]);
    } catch {
      setLog((l) => [...l, { you: instruction, back: "That did not go through. Your plan is untouched." }]);
    }
    setBusy(false);
    window.setTimeout(() => logEnd.current?.scrollIntoView({ block: "nearest" }), 60);
  };

  const pullRefs = async (kind: "photo" | "gif") => {
    const q = topic.trim() || "small business";
    setLoadingRefs(true);
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(q)}&kind=${kind}`);
      const data = await res.json();
      if (data.ok) setShots(data.shots || []);
    } catch {
      /* leave it as it was */
    }
    setLoadingRefs(false);
  };

  const plan = () =>
    [
      `${topic.trim() || "Untitled video"}`,
      `${(TEMPLATES[tpl] || TEMPLATES.hook).name} · ${total} seconds`,
      "",
      ...scenes.flatMap((s, i) => [
        `SCENE ${i + 1} (${s.secs}s)`,
        `  You say:        ${s.say || "-"}`,
        `  We see:         ${s.show || "-"}`,
        `  Words on screen: ${s.text || "-"}`,
        "",
      ]),
      "CAPTION",
      caption.trim() || "(not written yet)",
      "",
      (TAGS[tagSet] || []).map((h) => `#${h}`).join(" "),
      "",
      "Planned at flowzone.dev/start",
    ].join("\n");

  const download = () => {
    const blob = new Blob([plan()], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(topic.trim() || "video-plan").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const STEPS: Array<{ id: typeof step; n: string; label: string }> = [
    { id: "plan", n: "1", label: "Plan the video" },
    { id: "caption", n: "2", label: "Write the caption" },
    { id: "thumb", n: "3", label: "Make the thumbnail" },
  ];

  return (
    <div>
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
                borderColor: on ? accent : "#1D2942",
                background: on ? "#101A2C" : "transparent",
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
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. how we redid a shop logo"
                  className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <p className="label mb-2">Shape of it</p>
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
            </div>
          </div>

          {/* Ask for changes in plain words */}
          <div className="panel p-6 mb-4">
            <p className="label mb-2">💬 Or just say what you want changed</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Type it the way you would say it out loud. The plan below updates.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <input
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAsk()}
                placeholder="Make it shorter and less formal"
                className="flex-1 min-w-[220px] bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={() => sendAsk()}
                disabled={busy || !ask.trim()}
                className="btn-primary !px-5 !py-3 text-xs disabled:opacity-50"
              >
                {busy ? "Working..." : "Change it"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => sendAsk(q)}
                  disabled={busy}
                  className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors disabled:opacity-50"
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
            <p className="label">The video, scene by scene</p>
            <p className="text-[11px] text-ink-mute">{total} seconds total</p>
          </div>

          <div className="space-y-3">
            {scenes.map((s, i) => (
              <div key={s.id} className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <p className="font-display text-base">Scene {i + 1}</p>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      value={s.secs}
                      onChange={(e) => patch(s.id, "secs", Number(e.target.value))}
                      className="w-14 bg-paper-deep text-ink border border-rule px-2 py-1.5 text-xs outline-none focus:border-accent"
                    />
                    <span className="text-[11px] text-ink-mute mr-1">sec</span>
                    <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up" className="text-ink-mute hover:text-ink disabled:opacity-30 px-1.5 text-sm">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === scenes.length - 1} title="Move down" className="text-ink-mute hover:text-ink disabled:opacity-30 px-1.5 text-sm">↓</button>
                    <button onClick={() => duplicate(i)} title="Duplicate" className="text-ink-mute hover:text-ink px-1.5 text-xs">copy</button>
                    <button onClick={() => setScenes((ss) => ss.filter((x) => x.id !== s.id))} title="Remove" className="text-ink-mute hover:text-ink px-1.5 text-xs">remove</button>
                  </div>
                </div>
                {(
                  [
                    ["say", "What you say", "The actual words out loud"],
                    ["show", "What we see", "Where the camera is pointing"],
                    ["text", "Words on screen", "Six words maximum"],
                  ] as const
                ).map(([f, label, ph]) => (
                  <div key={f} className="mb-2 last:mb-0">
                    <p className="text-[10px] uppercase tracking-label text-ink-mute mb-1">{label}</p>
                    <textarea
                      rows={f === "say" ? 2 : 1}
                      value={s[f]}
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
              onClick={() => setScenes((ss) => [...ss, { id: nid(), secs: 5, say: "", show: "", text: "" }])}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              + Add a scene
            </button>
            <button onClick={() => setStep("caption")} className="btn-primary !px-4 !py-2.5 text-xs">
              Next, the caption <span className="arrow">→</span>
            </button>
          </div>
        </>
      )}

      {step === "caption" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: accent }} />
            <p className="label mb-2">The caption</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Only the first line gets read by most people. Put the hook there and
              let the rest run on.
            </p>
            <textarea
              rows={7}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="First line is the hook. Then the detail. Then what to do."
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light leading-relaxed outline-none focus:border-accent transition-colors resize-none mb-4"
            />
            <button
              onClick={() => sendAsk("Write the caption for me")}
              disabled={busy}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50"
            >
              {busy ? "Working..." : "Write one for me"}
            </button>
          </div>

          <div className="panel p-6">
            <p className="label mb-2">Hashtags</p>
            <select
              value={tagSet}
              onChange={(e) => setTagSet(e.target.value)}
              className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            >
              {Object.keys(TAGS).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-5">
              {(TAGS[tagSet] || []).map((h) => `#${h}`).join("  ")}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={download} className="btn-primary !px-4 !py-2.5 text-xs">
                Download the plan <span className="arrow">→</span>
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
              Real photographs and GIFs, free to use. Click one to caption it, or
              upload your own below.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => pullRefs("photo")} disabled={loadingRefs} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                {loadingRefs ? "Looking..." : "Find photos"}
              </button>
              <button onClick={() => pullRefs("gif")} disabled={loadingRefs} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs disabled:opacity-50">
                Find GIFs
              </button>
            </div>
            {shots.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {shots.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPicked(s.url)}
                    title={s.title}
                    className="border overflow-hidden transition-colors"
                    style={{ borderColor: picked === s.url ? accent : "#1D2942", borderWidth: picked === s.url ? 2 : 1 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.thumb} alt={s.title} loading="lazy" className="w-full h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
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
