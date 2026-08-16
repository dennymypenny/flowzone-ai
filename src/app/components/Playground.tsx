"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MARKS,
  TYPESETS,
  makePalette,
  markSVG,
  paletteCSS,
  suggestLines,
  suggestNames,
  contrast,
  hashSeed,
  type Locks,
  type Palette,
  type Role,
  type Vibe,
} from "@/lib/brandkit";

/**
 * The playground.
 *
 * Structured as a run rather than a form: four quests, each one worth XP, each
 * one ending in a real file rather than a feeling of progress. You can play any
 * of them in any order, reroll forever, lock what you like, and leave with an
 * SVG logo, a CSS palette and a board of real references.
 *
 * Two rules held throughout. Nothing here is a screenshot of a thing, it is the
 * thing. And nothing costs money to run, because a free toy that quietly bills
 * per click is a toy that gets switched off in three months.
 */

const KEY = "flowzone.playground.v1";
const ROLES: Array<{ id: Role; label: string }> = [
  { id: "bg", label: "Background" },
  { id: "ink", label: "Text" },
  { id: "a", label: "Accent" },
  { id: "b", label: "Second" },
  { id: "muted", label: "Muted" },
];

type Shot = {
  id: string;
  url: string;
  thumb: string;
  title: string;
  creator: string;
  license: string;
  source: string;
};

type Quest = { id: string; icon: string; name: string; goal: string; xp: number; color: string };

const QUESTS: Quest[] = [
  { id: "name", icon: "✍️", name: "Name it", goal: "Give the thing a name", xp: 25, color: "#5B9BF9" },
  { id: "color", icon: "🎨", name: "Colour it", goal: "Lock a colour you would defend", xp: 25, color: "#A78BFA" },
  { id: "mark", icon: "🛡️", name: "Make a mark", goal: "Pick a mark and download it", xp: 30, color: "#FBBF24" },
  { id: "refs", icon: "🔭", name: "Go looking", goal: "Pull real references from the web", xp: 20, color: "#34D399" },
];

const LEVELS = [
  { at: 0, name: "Curious" },
  { at: 25, name: "Sketching" },
  { at: 50, name: "Deciding" },
  { at: 80, name: "Designing" },
  { at: 100, name: "Ready to build" },
];

export default function Playground() {
  const [seed, setSeed] = useState(1);
  const [markSeed, setMarkSeed] = useState(0);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [dark, setDark] = useState(true);
  const [vibe, setVibe] = useState<Vibe>({ energy: 55, temp: 40, era: 65 });
  const [locks, setLocks] = useState<Locks>({});
  const [typeId, setTypeId] = useState(TYPESETS[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");

  const [refQ, setRefQ] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [refState, setRefState] = useState<"idle" | "loading" | "error">("idle");
  const [refError, setRefError] = useState("");

  // Restore, so a closed tab does not throw the run away.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setSeed(p.seed ?? 1);
        setMarkSeed(p.markSeed ?? 0);
        setName(p.name ?? "");
        setLine(p.line ?? "");
        setDark(p.dark ?? true);
        setVibe(p.vibe ?? { energy: 55, temp: 40, era: 65 });
        setLocks(p.locks ?? {});
        setTypeId(p.typeId ?? TYPESETS[0].id);
        setDone(p.done ?? {});
      }
    } catch {
      /* storage must never break the page */
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          KEY,
          JSON.stringify({ seed, markSeed, name, line, dark, vibe, locks, typeId, done })
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [seed, markSeed, name, line, dark, vibe, locks, typeId, done]);

  const palette: Palette = useMemo(
    () => makePalette(seed, vibe, dark, locks),
    [seed, vibe, dark, locks]
  );
  const mark = MARKS[markSeed % MARKS.length];
  const typeSet = TYPESETS.find((t) => t.id === typeId) || TYPESETS[0];
  const initials =
    (name.trim() || "Your Thing")
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3) || "YT";

  const rendered = mark.render(palette, initials);
  const xp = QUESTS.reduce((n, q) => n + (done[q.id] ? q.xp : 0), 0);
  const level = [...LEVELS].reverse().find((l) => xp >= l.at) || LEVELS[0];
  const complete = (id: string) => setDone((d) => (d[id] ? d : { ...d, [id]: true }));

  // Space rerolls whatever is not locked. It is a playground, it should feel
  // like one under the fingers as well as on the screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        setSeed((s) => s + 1);
      }
      if (e.key.toLowerCase() === "m") setMarkSeed((m) => m + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleLock = (r: Role) => {
    setLocks((l) => {
      const next = { ...l };
      if (next[r]) delete next[r];
      else next[r] = palette[r];
      return next;
    });
    complete("color");
  };

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const slug = (name.trim() || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const downloadSVG = () => {
    download(markSVG(mark, palette, initials, 512, true), `${slug}-mark.svg`, "image/svg+xml");
    complete("mark");
  };

  const copyCSS = async () => {
    const css = paletteCSS(palette, name);
    try {
      await navigator.clipboard.writeText(css);
      setCopied("css");
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      download(css, `${slug}-palette.css`, "text/css");
    }
    complete("color");
  };

  const fetchRefs = async (q: string) => {
    const query = q.trim();
    if (!query) return;
    setRefState("loading");
    setRefError("");
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setShots(data.shots || []);
      setRefState("idle");
      if ((data.shots || []).length) complete("refs");
    } catch (e) {
      setRefState("error");
      setRefError(
        e instanceof Error && e.message !== "failed"
          ? e.message
          : "Could not reach the reference service. Try different words."
      );
    }
  };

  const nameIdeas = useMemo(() => suggestNames(seed * 7 + 13, 6), [seed]);
  const lineIdeas = useMemo(() => suggestLines(seed * 3 + 5, name, 4), [seed, name]);
  const readable = contrast(palette.bg, palette.ink) >= 4.5;

  return (
    <div>
      {/* ------------------------------------------------ the run so far -- */}
      <div className="panel p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">🎮</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
                Level {LEVELS.findIndex((l) => l.name === level.name) + 1} · {level.name}
              </p>
              <p className="font-display text-xl leading-tight">{xp} / 100 XP</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSeed((s) => s + 1)} className="btn-primary !px-4 !py-2.5 text-xs">
              🎲 Reroll <span className="hidden sm:inline opacity-60">(space)</span>
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        <div className="h-1.5 w-full bg-raised mb-5">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${xp}%`, background: "linear-gradient(90deg,#1E3A8A,#5B9BF9,#34D399)" }}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUESTS.map((q) => (
            <div
              key={q.id}
              className="border p-4 transition-colors"
              style={{
                borderColor: done[q.id] ? q.color : "#1D2942",
                background: done[q.id] ? `${q.color}0F` : "transparent",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg leading-none">{q.icon}</span>
                <span
                  className="text-[10px] font-medium uppercase tracking-label"
                  style={{ color: done[q.id] ? q.color : "#647089" }}
                >
                  {done[q.id] ? "Done" : `${q.xp} XP`}
                </span>
              </div>
              <p className="text-sm font-medium mb-1">{q.name}</p>
              <p className="text-[11px] text-ink-mute font-light leading-relaxed">{q.goal}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ------------------------------------------------------ controls -- */}
        <div className="lg:col-span-5 space-y-6">
          {/* Name */}
          <div className="panel p-6">
            <p className="label mb-4">✍️ Name it</p>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) complete("name");
              }}
              placeholder="Type a name, or steal one below"
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {nameIdeas.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setName(n);
                    complete("name");
                  }}
                  className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="label mt-6 mb-3">And a line under it</p>
            <input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="One line that says what it is"
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {lineIdeas.map((l) => (
                <button
                  key={l}
                  onClick={() => setLine(l)}
                  className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors text-left"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Palette */}
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="label">🎨 Colour it</p>
              {!readable && (
                <span className="text-[10px] text-[#FBBF24]">Low contrast, reroll</span>
              )}
            </div>

            {(
              [
                ["energy", "Quiet", "Loud"],
                ["temp", "Cool", "Warm"],
                ["era", "Classic", "Modern"],
              ] as const
            ).map(([k, lo, hi]) => (
              <div key={k} className="mb-4">
                <div className="flex justify-between text-[11px] text-ink-mute mb-1.5">
                  <span>{lo}</span>
                  <span>{hi}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={vibe[k]}
                  onChange={(e) => {
                    setVibe((v) => ({ ...v, [k]: Number(e.target.value) }));
                    complete("color");
                  }}
                  className="w-full accent-accent"
                />
              </div>
            ))}

            <div className="grid grid-cols-5 gap-2 mt-5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => toggleLock(r.id)}
                  title={`${r.label} · ${palette[r.id]} · click to ${locks[r.id] ? "unlock" : "lock"}`}
                  className="group"
                >
                  <span
                    className="block w-full h-14 border transition-all"
                    style={{
                      background: palette[r.id],
                      borderColor: locks[r.id] ? "#5B8CFF" : "#1D2942",
                      borderWidth: locks[r.id] ? 2 : 1,
                    }}
                  />
                  <span className="block text-[9px] text-ink-mute mt-1.5 truncate">
                    {locks[r.id] ? "🔒 " : ""}
                    {palette[r.id]}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
              Click a swatch to lock it. Locked colours survive every reroll, so you
              can keep the one you like and keep hunting for the rest.
            </p>
            <button
              onClick={copyCSS}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs mt-4"
            >
              {copied === "css" ? "✅ Copied" : "Copy as CSS variables"}
            </button>
          </div>

          {/* Mark */}
          <div className="panel p-6">
            <p className="label mb-4">🛡️ Make a mark</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {MARKS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMarkSeed(i);
                    complete("mark");
                  }}
                  className="text-xs border px-3 py-2 transition-colors"
                  style={{
                    borderColor: m.id === mark.id ? "#5B8CFF" : "#1D2942",
                    color: m.id === mark.id ? "#F1F3F7" : "#9AA7BE",
                  }}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadSVG} className="btn-primary !px-4 !py-2.5 text-xs">
                Download SVG <span className="arrow">→</span>
              </button>
              <button
                onClick={() => setMarkSeed((m) => m + 1)}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                Next mark <span className="opacity-60">(m)</span>
              </button>
            </div>
            <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
              That download is a real vector file, drawn in your colours. Open it in
              anything, hand it to anyone.
            </p>
          </div>

          {/* Type */}
          <div className="panel p-6">
            <p className="label mb-4">🔤 Set the type</p>
            <div className="space-y-2">
              {TYPESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeId(t.id)}
                  className="w-full text-left border px-4 py-3 transition-colors"
                  style={{ borderColor: t.id === typeId ? "#5B8CFF" : "#1D2942" }}
                >
                  <span className="block text-sm" style={{ fontWeight: Number(t.display) }}>
                    {t.name}
                  </span>
                  <span className="block text-[11px] text-ink-mute font-light mt-0.5">{t.note}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- board -- */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          <div
            className="border border-rule overflow-hidden transition-colors duration-500"
            style={{ background: palette.bg }}
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <svg viewBox="0 0 100 100" width="64" height="64" aria-label="Generated mark">
                  <defs dangerouslySetInnerHTML={{ __html: rendered.defs }} />
                  <g dangerouslySetInnerHTML={{ __html: rendered.body }} />
                </svg>
                <div>
                  <p
                    className="text-2xl leading-tight tracking-tight"
                    style={{ color: palette.ink, fontWeight: Number(typeSet.display) }}
                  >
                    {name.trim() || "Your Thing"}
                  </p>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: palette.ink, opacity: 0.6, fontWeight: Number(typeSet.body) }}
                  >
                    {line.trim() || "One line that says what it is"}
                  </p>
                </div>
              </div>

              <p
                className="text-[34px] leading-[1.08] tracking-tight mb-4"
                style={{ color: palette.ink, fontWeight: Number(typeSet.display) }}
              >
                {line.trim() || "The headline sits here."}
              </p>
              <p
                className="text-sm leading-relaxed mb-7 max-w-md"
                style={{ color: palette.ink, opacity: 0.55, fontWeight: Number(typeSet.body) }}
              >
                Body copy in the second weight, at the size people actually read it,
                so you can tell whether the pairing holds up before anyone builds it.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span
                  className="text-xs px-4 py-2.5 font-medium"
                  style={{ background: palette.a, color: palette.bg }}
                >
                  Primary action
                </span>
                <span
                  className="text-xs px-4 py-2.5 font-medium"
                  style={{ border: `1px solid ${palette.ink}44`, color: palette.ink }}
                >
                  Secondary
                </span>
                <span
                  className="text-xs px-4 py-2.5 font-medium"
                  style={{ background: palette.b, color: palette.bg }}
                >
                  Highlight
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {ROLES.map((r) => (
                  <div key={r.id}>
                    <span className="block h-10" style={{ background: palette[r.id] }} />
                    <span
                      className="block text-[9px] mt-1"
                      style={{ color: palette.ink, opacity: 0.45 }}
                    >
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* References */}
          <div className="panel p-6">
            <p className="label mb-2">🔭 Go looking</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
              Generated shapes cannot give you taste. Real things other people made can.
              Type what your thing is about and pull actual photographs off the open web.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <input
                value={refQ}
                onChange={(e) => setRefQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchRefs(refQ)}
                placeholder="trading cards, bakery, skate shop, studio..."
                className="flex-1 min-w-0 bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={() => fetchRefs(refQ)}
                disabled={refState === "loading"}
                className="btn-primary !px-4 !py-3 text-xs shrink-0 disabled:opacity-50"
              >
                {refState === "loading" ? "Looking..." : "Pull references"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {["trading cards", "bakery", "skate shop", "coffee roaster", "vintage type"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setRefQ(s);
                    fetchRefs(s);
                  }}
                  className="text-xs border border-rule text-ink-soft px-3 py-1.5 hover:text-ink hover:bg-raised transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {refState === "error" && <p className="text-[12px] text-[#FBBF24]">{refError}</p>}

            {shots.length > 0 && (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {shots.map((s) => (
                    <a
                      key={s.id}
                      href={s.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${s.title} — ${s.creator} (${s.license})`}
                      className="block overflow-hidden border border-rule hover:border-accent transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.thumb}
                        alt={s.title}
                        loading="lazy"
                        className="w-full h-24 object-cover"
                      />
                    </a>
                  ))}
                </div>
                <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                  Openly licensed work from Openverse. Every image links back to its
                  maker, and the licence is on the tooltip. Credit them if you use them.
                </p>
              </>
            )}
          </div>

          <div className="panel p-6">
            <p className="label mb-3">Take it with you</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadSVG} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">
                Logo as SVG
              </button>
              <button onClick={copyCSS} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">
                Palette as CSS
              </button>
              <button
                onClick={() =>
                  download(
                    `${name || "Your thing"}\n${line || ""}\n\nPALETTE\n${ROLES.map(
                      (r) => `${r.label}: ${palette[r.id]}`
                    ).join("\n")}\n\nMARK\n${mark.name}\n\nTYPE\nPoppins ${typeSet.display} / ${typeSet.body} (${typeSet.name})\n\nMade at flowzone.dev/start\n`,
                    `${slug}-identity.txt`,
                    "text/plain"
                  )
                }
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                The whole spec
              </button>
            </div>
            {xp >= 100 && (
              <p className="text-sm mt-4 leading-relaxed" style={{ color: "#34D399" }}>
                🏆 All four done. You have a name, colours you chose on purpose, a real
                vector mark and references to argue from. That is further than most
                projects get before someone starts building.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
