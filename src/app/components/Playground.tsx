"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTAINERS,
  LOCKUPS,
  TYPESETS,
  contrast,
  findIcons,
  iconMark,
  lockupSVG,
  makePalette,
  markSVG,
  paletteCSS,
  suggestLines,
  suggestNames,
  variants,
  type Locks,
  type Palette,
  type Role,
  type Vibe,
} from "@/lib/brandkit";
import { useAmbient } from "@/app/components/useAmbient";
import MemeMaker from "@/app/components/MemeMaker";

/**
 * Flow Mode.
 *
 * You pick a flow, then you make things. Every control produces a real file at
 * the end: a composed logo lockup as SVG, a palette as CSS, a written spec.
 * Nothing here is a picture of a deliverable.
 *
 * Two ideas hold it together. Rerolling is for when you have no idea, and
 * direct picking is for when you do, so every generated thing can also be
 * clicked and overridden. And anything that opens must be easy to close:
 * click outside it, or press escape.
 */

const KEY = "flowzone.flow.v1";

const ROLES: Array<{ id: Role; label: string }> = [
  { id: "bg", label: "Background" },
  { id: "ink", label: "Text" },
  { id: "a", label: "Accent" },
  { id: "b", label: "Second" },
  { id: "muted", label: "Muted" },
];

type Flow = {
  id: string;
  icon: string;
  name: string;
  blurb: string;
  vibe: Vibe;
  icons: string;
  refs: string;
  lockup: string;
  container: string;
};

/** A lot of doors, because "a small business" is fifty different businesses. */
const FLOWS: Flow[] = [
  { id: "food", icon: "🍕", name: "Food and drink", blurb: "Cafes, kitchens, bakeries, trucks, bars.", vibe: { energy: 62, temp: 78, era: 45 }, icons: "coffee", refs: "bakery interior", lockup: "badge", container: "circle" },
  { id: "shop", icon: "🛍️", name: "A shop", blurb: "Products, drops, collectors, merch.", vibe: { energy: 78, temp: 45, era: 78 }, icons: "shopping-bag", refs: "retail store front", lockup: "block", container: "block" },
  { id: "trade", icon: "🔨", name: "Trades and building", blurb: "Builders, sparkies, plumbers, landscapers.", vibe: { energy: 52, temp: 62, era: 30 }, icons: "hammer", refs: "workshop tools", lockup: "framed", container: "shield" },
  { id: "studio", icon: "🎨", name: "Creative studio", blurb: "Design, photo, film, music, writing.", vibe: { energy: 45, temp: 30, era: 88 }, icons: "pen-tool", refs: "design studio", lockup: "wordmark", container: "bare" },
  { id: "health", icon: "🌿", name: "Health and care", blurb: "Clinics, therapists, trainers, wellbeing.", vibe: { energy: 30, temp: 48, era: 60 }, icons: "leaf", refs: "calm clinic interior", lockup: "stacked", container: "circle" },
  { id: "sport", icon: "🏆", name: "Sport and clubs", blurb: "Teams, gyms, leagues, coaching.", vibe: { energy: 88, temp: 55, era: 70 }, icons: "trophy", refs: "sports team crest", lockup: "badge", container: "shield" },
  { id: "tech", icon: "⚡", name: "Tech and tools", blurb: "Apps, agencies, SaaS, anything technical.", vibe: { energy: 58, temp: 18, era: 92 }, icons: "zap", refs: "modern office", lockup: "horizontal", container: "hex" },
  { id: "home", icon: "🏠", name: "Home and property", blurb: "Lettings, interiors, cleaning, moving.", vibe: { energy: 34, temp: 58, era: 40 }, icons: "home", refs: "interior architecture", lockup: "framed", container: "ring" },
  { id: "pets", icon: "🐾", name: "Pets and animals", blurb: "Grooming, walking, vets, supplies.", vibe: { energy: 66, temp: 70, era: 55 }, icons: "paw-print", refs: "dog grooming", lockup: "stacked", container: "circle" },
  { id: "events", icon: "🎟️", name: "Events and nights", blurb: "Promoters, venues, weddings, markets.", vibe: { energy: 84, temp: 35, era: 82 }, icons: "ticket", refs: "concert lighting", lockup: "block", container: "block" },
  { id: "money", icon: "📊", name: "Money and advice", blurb: "Bookkeeping, consulting, legal, insurance.", vibe: { energy: 26, temp: 22, era: 48 }, icons: "landmark", refs: "architecture columns", lockup: "wordmark", container: "ring" },
  { id: "open", icon: "✨", name: "Something else", blurb: "Start blank and take it wherever.", vibe: { energy: 55, temp: 45, era: 65 }, icons: "sparkles", refs: "abstract texture", lockup: "horizontal", container: "circle" },
];

type Shot = { id: string; url: string; thumb: string; title: string; creator: string; license: string; source: string };
type Quest = { id: string; icon: string; name: string; goal: string; xp: number; color: string };

const QUESTS: Quest[] = [
  { id: "name", icon: "✍️", name: "Name it", goal: "Give it a name and a line", xp: 20, color: "#5B9BF9" },
  { id: "color", icon: "🎨", name: "Colour it", goal: "Pick or lock a colour on purpose", xp: 20, color: "#A78BFA" },
  { id: "mark", icon: "🛡️", name: "Draw the mark", goal: "Choose a symbol and a shape", xp: 20, color: "#FBBF24" },
  { id: "logo", icon: "📐", name: "Build the logo", goal: "Download a finished lockup", xp: 25, color: "#2DD4BF" },
  { id: "refs", icon: "🔭", name: "Go looking", goal: "Pull real references off the web", xp: 15, color: "#34D399" },
];

const LEVELS = ["Curious", "Sketching", "Deciding", "Designing", "Ready to build"];

/**
 * Reference topics as a list to choose from rather than a blank search box.
 * A blank box asks somebody to already know what to look for, which is the
 * exact thing they came here without.
 */
const REF_GROUPS: Array<{ group: string; items: string[] }> = [
  { group: "Places", items: ["bakery interior", "retail store front", "coffee roaster", "workshop tools", "design studio", "modern office", "interior architecture", "market stall"] },
  { group: "Texture and material", items: ["abstract texture", "concrete wall", "linen fabric", "brushed metal", "wood grain", "neon light", "paper texture", "marble"] },
  { group: "Type and print", items: ["vintage type", "letterpress", "hand painted sign", "packaging design", "poster wall", "enamel pin"] },
  { group: "Mood", items: ["calm minimal", "warm sunlight", "moody dark", "bright colourful", "nostalgic film photo", "high contrast"] },
  { group: "Subjects", items: ["dog grooming", "sports team crest", "concert lighting", "fresh produce", "hands making", "skate shop"] },
];

const GIF_IDEAS = ["celebration", "thumbs up", "confetti", "fireworks", "dancing", "applause", "loading", "sparkle"];


/**
 * The teaching layer.
 *
 * A generator that hands you a logo teaches you nothing, and you cannot judge
 * what you do not understand. So every step says what actually makes that thing
 * work, in the same shape a good breakdown uses: the rule, why it is true, and
 * the mistake it stops you making.
 *
 * Collapsed by default. Available to anyone who wants it, in the way of nobody
 * who does not.
 */
function Principle({ title, color, points }: { title: string; color: string; points: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 border-t border-rule pt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-label transition-colors"
        style={{ color }}
      >
        <span>{open ? "\u2212" : "+"}</span> Why this matters: {title}
      </button>
      {open && (
        <ul className="mt-3 space-y-2.5">
          {points.map((pt) => (
            <li key={pt} className="text-[13px] text-ink-soft font-light leading-relaxed pl-4 border-l" style={{ borderLeftColor: color }}>
              {pt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Playground() {
  const [flowId, setFlowId] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [dark, setDark] = useState(true);
  const [vibe, setVibe] = useState<Vibe>({ energy: 55, temp: 45, era: 65 });
  const [locks, setLocks] = useState<Locks>({});
  const [typeId, setTypeId] = useState(TYPESETS[0].id);
  const [iconId, setIconId] = useState("sparkles");
  const [iconQ, setIconQ] = useState("");
  const [containerId, setContainerId] = useState("circle");
  const [lockupId, setLockupId] = useState("horizontal");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [openRole, setOpenRole] = useState<Role | null>(null);
  const [copied, setCopied] = useState("");
  const [refQ, setRefQ] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [refState, setRefState] = useState<"idle" | "loading" | "error">("idle");
  const [refKind, setRefKind] = useState<"photo" | "gif" | "meme">("photo");
  const [picked, setPicked] = useState<string | null>(null);
  const [refError, setRefError] = useState("");
  const popRef = useRef<HTMLDivElement | null>(null);

  const flow = FLOWS.find((f) => f.id === flowId) || null;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setFlowId(p.flowId ?? null);
        setSeed(p.seed ?? 1);
        setName(p.name ?? "");
        setLine(p.line ?? "");
        setDark(p.dark ?? true);
        setVibe(p.vibe ?? { energy: 55, temp: 45, era: 65 });
        setLocks(p.locks ?? {});
        setTypeId(p.typeId ?? TYPESETS[0].id);
        setIconId(p.iconId ?? "sparkles");
        setContainerId(p.containerId ?? "circle");
        setLockupId(p.lockupId ?? "horizontal");
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
          JSON.stringify({ flowId, seed, name, line, dark, vibe, locks, typeId, iconId, containerId, lockupId, done })
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [flowId, seed, name, line, dark, vibe, locks, typeId, iconId, containerId, lockupId, done]);

  const palette: Palette = useMemo(() => makePalette(seed, vibe, dark, locks), [seed, vibe, dark, locks]);
  const iconList = useMemo(() => findIcons(iconQ, 48), [iconQ]);
  const icon = useMemo(
    () => findIcons(iconId, 1).find((i) => i.id === iconId) || iconList[0] || findIcons("sparkles", 1)[0],
    [iconId, iconList]
  );
  const mark = useMemo(() => iconMark(icon, containerId), [icon, containerId]);
  const typeSet = TYPESETS.find((t) => t.id === typeId) || TYPESETS[0];
  const lockup = LOCKUPS.find((l) => l.id === lockupId) || LOCKUPS[0];

  const initials =
    (name.trim() || "Your Thing").split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 3) || "YT";
  const rendered = mark.render(palette, initials);

  const xp = QUESTS.reduce((n, q) => n + (done[q.id] ? q.xp : 0), 0);
  const levelIdx = Math.min(LEVELS.length - 1, Math.floor(xp / 25));
  const complete = (id: string) => setDone((d) => (d[id] ? d : { ...d, [id]: true }));
  const music = useAmbient(seed, vibe.energy, vibe.era, vibe.temp);

  // Click outside, or escape, closes whatever is open. Nothing traps you.
  useEffect(() => {
    if (!openRole) return;
    const onDown = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpenRole(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenRole(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openRole]);

  // Space rerolls, but never while a field or a picker has the floor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (openRole) return;
      if (el && /INPUT|TEXTAREA|SELECT/.test(el.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        setSeed((s) => s + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openRole]);

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const slug = (name.trim() || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const downloadLockup = () => {
    download(
      lockupSVG(lockup, mark, palette, name, line, initials, typeSet.display, typeSet.body),
      `${slug}-logo-${lockup.id}.svg`,
      "image/svg+xml"
    );
    complete("logo");
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

  const fetchRefs = async (q: string, kind: "photo" | "gif" = refKind === "meme" ? "photo" : refKind) => {
    const query = q.trim();
    if (!query) return;
    setRefState("loading");
    setRefError("");
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(query)}&kind=${kind}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setShots(data.shots || []);
      setRefState("idle");
      if ((data.shots || []).length) complete("refs");
    } catch (e) {
      setRefState("error");
      setRefError(e instanceof Error && e.message !== "failed" ? e.message : "Could not reach the reference service.");
    }
  };

  const startFlow = (f: Flow) => {
    setFlowId(f.id);
    setVibe(f.vibe);
    setIconId(f.icons);
    setContainerId(f.container);
    setLockupId(f.lockup);
    setRefQ(f.refs);
  };

  const nameIdeas = useMemo(() => suggestNames(seed * 7 + 13, 6), [seed]);
  const lineIdeas = useMemo(() => suggestLines(seed * 3 + 5, name, 4), [seed, name]);
  const readable = contrast(palette.bg, palette.ink) >= 4.5;

  /* ------------------------------------------------------- pick your flow -- */
  if (!flow) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl leading-none">🌊</span>
          <h2 className="font-display text-3xl">Pick your flow.</h2>
        </div>
        <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-8">
          Each one starts you somewhere different: different colours, a different
          symbol, a different logo shape and different references. Nothing is locked,
          it is just a running start instead of a blank page.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FLOWS.map((f) => (
            <button
              key={f.id}
              onClick={() => startFlow(f)}
              className="text-left border border-rule p-5 hover:border-accent hover:bg-raised transition-colors"
            >
              <span className="block text-2xl mb-3 leading-none">{f.icon}</span>
              <p className="font-display text-lg mb-1">{f.name}</p>
              <p className="text-[13px] text-ink-soft font-light leading-relaxed">{f.blurb}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ workspace -- */
  return (
    <div>
      {/* Run header */}
      <div className="panel p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-5 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{flow.icon}</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
                {flow.name} · Level {levelIdx + 1} · {LEVELS[levelIdx]}
              </p>
              <p className="font-display text-xl leading-tight">{xp} / 100 XP</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSeed((s) => s + 1)} className="btn-primary !px-4 !py-2.5 text-xs">
              🎲 Reroll <span className="hidden sm:inline opacity-60">(space)</span>
            </button>
            {music.supported && (
              <button
                onClick={music.toggle}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                {music.playing ? "⏸ Stop sound" : "🎧 Hear it"}
              </button>
            )}
            <button
              onClick={() => setDark((d) => !d)}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => setFlowId(null)}
              className="btn border border-rule text-ink-mute hover:text-ink-soft !px-4 !py-2.5 text-xs"
            >
              Change flow
            </button>
          </div>
        </div>

        <div className="h-1.5 w-full bg-raised mb-5">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${xp}%`, background: "linear-gradient(90deg,#1E3A8A,#5B9BF9,#34D399)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {QUESTS.map((q) => (
            <span
              key={q.id}
              title={q.goal}
              className="inline-flex items-center gap-2 border px-3 py-1.5 text-[11px]"
              style={{
                borderColor: done[q.id] ? q.color : "#1D2942",
                color: done[q.id] ? q.color : "#647089",
                background: done[q.id] ? `${q.color}0F` : "transparent",
              }}
            >
              <span className="leading-none">{q.icon}</span>
              {q.name}
              {done[q.id] && <span>✓</span>}
            </span>
          ))}
        </div>

        {music.playing && (
          <p className="text-[11px] text-ink-mute font-light mt-4 leading-relaxed">
            🎧 That is your identity as sound, generated from the same seed. The sliders
            move it: energy sets tempo and brightness, era sets whether it is warm,
            open or tense.
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ---------------------------------------------------- left column -- */}
        <div className="lg:col-span-5 space-y-6">
          {/* Name */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#5B9BF9" }} />
            <p className="label mb-4">✍️ Name it</p>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) complete("name");
              }}
              placeholder="Type a name, or take one below"
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-6">
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
            <Principle
              title="what makes a name usable"
              color="#5B9BF9"
              points={[
                "Say it out loud down a phone line. If it has to be spelled every time, it will cost you customers forever.",
                "Do not describe the product. A name that says exactly what you sell today is a cage the moment you sell anything else.",
                "Short beats clever. It has to fit a logo, a handle, a domain and somebody's memory.",
                "The line under it does the explaining. That is its whole job, which frees the name to just be a name.",
              ]}
            />
          </div>

          {/* Colour, now clickable */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#A78BFA" }} />
            <div className="flex items-center justify-between mb-4">
              <p className="label">🎨 Colour it</p>
              {!readable && <span className="text-[10px] text-[#FBBF24]">Low contrast</span>}
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
                  onClick={() => setOpenRole(openRole === r.id ? null : r.id)}
                  title={`${r.label} — click to change`}
                >
                  <span
                    className="block w-full h-14 border transition-all"
                    style={{
                      background: palette[r.id],
                      borderColor: openRole === r.id ? "#5B8CFF" : locks[r.id] ? "#5B8CFF" : "#1D2942",
                      borderWidth: openRole === r.id || locks[r.id] ? 2 : 1,
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
              Click any swatch to change it. Locked colours survive every reroll.
            </p>

            {openRole && (
              <div
                ref={popRef}
                className="absolute left-4 right-4 bottom-4 z-40 panel shadow-panel p-5"
                style={{ background: "#101A2C" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-medium uppercase tracking-label text-ink-soft">
                    {ROLES.find((r) => r.id === openRole)?.label}
                  </p>
                  <button
                    onClick={() => setOpenRole(null)}
                    className="text-ink-mute hover:text-ink text-xs"
                    aria-label="Close"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-4">
                  {variants(palette[openRole], 14).map((c) => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => {
                        setLocks((l) => ({ ...l, [openRole]: c }));
                        complete("color");
                      }}
                      className="block h-8 border border-rule hover:border-accent transition-colors"
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-ink-soft">
                    <input
                      type="color"
                      value={palette[openRole]}
                      onChange={(e) => {
                        setLocks((l) => ({ ...l, [openRole]: e.target.value.toUpperCase() }));
                        complete("color");
                      }}
                      className="w-9 h-9 bg-transparent border border-rule cursor-pointer"
                    />
                    Exact colour
                  </label>
                  <button
                    onClick={() =>
                      setLocks((l) => {
                        const n = { ...l };
                        delete n[openRole];
                        return n;
                      })
                    }
                    className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors"
                  >
                    Unlock, let it roll
                  </button>
                </div>
                <p className="text-[11px] text-ink-mute font-light mt-3">
                  Click anywhere outside, or press escape, to close this.
                </p>
              </div>
            )}

            <button
              onClick={copyCSS}
              className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs mt-4"
            >
              {copied === "css" ? "✅ Copied" : "Copy as CSS variables"}
            </button>
            <Principle
              title="how palettes actually hold together"
              color="#A78BFA"
              points={[
                "Two accents, not five. Colours far apart on the wheel stay readable together; a crowd of them turns to mush the second anything gets small.",
                "Most of the surface should be near neutral. Accent is punctuation, not paragraphs, and colour only reads as loud when there is quiet around it.",
                "Tint the neutrals with the base hue. Pure grey next to colour is what makes a palette look like it was assembled rather than chosen.",
                "Check contrast before you fall in love. If text fails against the background, the palette is already broken, however good it looks here.",
              ]}
            />
          </div>

          {/* Symbol */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#FBBF24" }} />
            <p className="label mb-4">🛡️ Draw the mark</p>
            <input
              value={iconQ}
              onChange={(e) => setIconQ(e.target.value)}
              placeholder="Search 199 symbols: coffee, dog, wrench, wave..."
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors mb-3"
            />
            <div className="grid grid-cols-8 gap-1.5 max-h-52 overflow-y-auto mb-4 pr-1">
              {iconList.map((ic) => {
                const on = ic.id === icon.id;
                return (
                  <button
                    key={ic.id}
                    title={ic.id.replace(/-/g, " ")}
                    onClick={() => {
                      setIconId(ic.id);
                      complete("mark");
                    }}
                    className="aspect-square border flex items-center justify-center transition-colors"
                    style={{ borderColor: on ? "#5B8CFF" : "#1D2942", background: on ? "#101A2C" : "transparent" }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={on ? "#F1F3F7" : "#9AA7BE"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ic.d }} />
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {CONTAINERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setContainerId(c.id);
                    complete("mark");
                  }}
                  className="text-xs border px-3 py-2 transition-colors"
                  style={{ borderColor: c.id === containerId ? "#5B8CFF" : "#1D2942", color: c.id === containerId ? "#F1F3F7" : "#9AA7BE" }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <Principle
              title="what stops a mark dying at small sizes"
              color="#FBBF24"
              points={[
                "The silhouette has to work in one flat colour first. Gradients and shine are the last thing you add, never the thing holding it up.",
                "It spends its life at about forty pixels, in a tab and on a phone. Judge it there, not at the size you are drawing it.",
                "Pick a symbol that says something about the business, not one that looks nice. Every element should answer a question or come out.",
                "The container is a real decision. A circle reads friendly, a shield reads authority, bare reads modern and confident.",
              ]}
            />
          </div>

          {/* Type */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#C6E4F8" }} />
            <p className="label mb-4">🔤 Set the type</p>
            <div className="space-y-2">
              {TYPESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeId(t.id)}
                  className="w-full text-left border px-4 py-3 transition-colors"
                  style={{ borderColor: t.id === typeId ? "#5B8CFF" : "#1D2942" }}
                >
                  <span className="block text-sm" style={{ fontWeight: Number(t.display) }}>{t.name}</span>
                  <span className="block text-[11px] text-ink-mute font-light mt-0.5">{t.note}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- right column -- */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
          {/* Logo templates */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#2DD4BF" }} />
            <div className="flex items-center justify-between mb-1">
              <p className="label">📐 Build the logo</p>
              <button onClick={downloadLockup} className="btn-primary !px-4 !py-2.5 text-xs">
                Download SVG <span className="arrow">→</span>
              </button>
            </div>
            <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">
              Not an icon, a finished lockup: symbol, name and line arranged properly.
              Pick the layout, take the file.
            </p>

            <div className="space-y-3">
              {LOCKUPS.map((lk) => {
                const on = lk.id === lockupId;
                const svg = lockupSVG(lk, mark, palette, name, line, initials, typeSet.display, typeSet.body);
                return (
                  <button
                    key={lk.id}
                    onClick={() => setLockupId(lk.id)}
                    className="w-full border overflow-hidden transition-colors text-left"
                    style={{ borderColor: on ? "#5B8CFF" : "#1D2942", borderWidth: on ? 2 : 1 }}
                  >
                    <div
                      className="w-full flex items-center justify-center py-4"
                      style={{ background: palette.bg }}
                      dangerouslySetInnerHTML={{
                        __html: svg.replace(
                          /width="\d+" height="\d+"/,
                          `style="max-width:100%;height:${lk.h > 300 ? 190 : 110}px"`
                        ),
                      }}
                    />
                    <div className="px-4 py-2.5 flex items-center justify-between bg-paper-deep">
                      <span className="text-xs text-ink">{lk.name}</span>
                      <span className="text-[11px] text-ink-mute font-light">{lk.note}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <Principle
              title="why a logo is more than an icon"
              color="#2DD4BF"
              points={[
                "You need several lockups, not one. Horizontal fits a site header, stacked fits an avatar, a badge fits packaging. One layout will fail somewhere.",
                "Spacing is the craft. Most amateur logos are fine shapes with the name jammed too close, and that alone is what reads as homemade.",
                "Keep a wordmark with no symbol. When the icon is too small to survive, the name still has to hold on its own.",
                "Ship vector. A PNG of a logo is a logo you cannot resize, recolour, print or hand to anyone.",
              ]}
            />
          </div>

          {/* Applied preview */}
          <div className="border border-rule overflow-hidden transition-colors duration-500" style={{ background: palette.bg }}>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <svg viewBox="0 0 100 100" width="56" height="56" aria-label="Generated mark">
                  <defs dangerouslySetInnerHTML={{ __html: rendered.defs }} />
                  <g dangerouslySetInnerHTML={{ __html: rendered.body }} />
                </svg>
                <div>
                  <p className="text-2xl leading-tight tracking-tight" style={{ color: palette.ink, fontWeight: Number(typeSet.display) }}>
                    {name.trim() || "Your Thing"}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: palette.ink, opacity: 0.6, fontWeight: Number(typeSet.body) }}>
                    {line.trim() || "One line that says what it is"}
                  </p>
                </div>
              </div>
              <p className="text-[32px] leading-[1.08] tracking-tight mb-4" style={{ color: palette.ink, fontWeight: Number(typeSet.display) }}>
                {line.trim() || "The headline sits here."}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs px-4 py-2.5 font-medium" style={{ background: palette.a, color: palette.bg }}>Primary action</span>
                <span className="text-xs px-4 py-2.5 font-medium" style={{ border: `1px solid ${palette.ink}44`, color: palette.ink }}>Secondary</span>
                <span className="text-xs px-4 py-2.5 font-medium" style={{ background: palette.b, color: palette.bg }}>Highlight</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {ROLES.map((r) => (
                  <div key={r.id}>
                    <span className="block h-10" style={{ background: palette[r.id] }} />
                    <span className="block text-[9px] mt-1" style={{ color: palette.ink, opacity: 0.45 }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* References, GIFs and memes */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#34D399" }} />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="label">🔭 Go looking</p>
              <div className="flex">
                {(
                  [
                    ["photo", "Photos"],
                    ["gif", "GIFs"],
                    ["meme", "Meme maker"],
                  ] as const
                ).map(([k, label]) => {
                  const on = refKind === k || (k === "meme" && refKind === "meme");
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        setRefKind(k as never);
                        if (k !== "meme" && refQ) fetchRefs(refQ, k as "photo" | "gif");
                      }}
                      className="text-[11px] px-3 py-1.5 border-t border-b border-r first:border-l transition-colors"
                      style={{
                        borderColor: on ? "#5B8CFF" : "#1D2942",
                        color: on ? "#F1F3F7" : "#9AA7BE",
                        background: on ? "#101A2C" : "transparent",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {refKind === "meme" ? (
              <MemeMaker src={picked} brandColor={palette.a} />
            ) : (
              <>
                <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
                  {refKind === "gif"
                    ? "Animated, openly licensed, and ready to caption in the meme maker."
                    : "Generated shapes cannot give you taste. Real things other people made can."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <select
                    value={refQ}
                    onChange={(e) => {
                      setRefQ(e.target.value);
                      if (e.target.value) fetchRefs(e.target.value);
                    }}
                    className="flex-1 min-w-0 bg-paper-deep text-ink border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Choose what to look at...</option>
                    {refKind === "gif"
                      ? GIF_IDEAS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))
                      : REF_GROUPS.map((grp) => (
                          <optgroup key={grp.group} label={grp.group}>
                            {grp.items.map((it) => (
                              <option key={it} value={it}>
                                {it}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                  </select>
                  <button
                    onClick={() => fetchRefs(refQ)}
                    disabled={refState === "loading" || !refQ}
                    className="btn-primary !px-4 !py-2.5 text-xs shrink-0 disabled:opacity-50"
                  >
                    {refState === "loading" ? "Looking..." : "Pull"}
                  </button>
                </div>

                {refState === "error" && <p className="text-[12px] text-[#FBBF24]">{refError}</p>}

                {shots.length > 0 && (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {shots.map((s) => {
                        const on = picked === s.url;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setPicked(on ? null : s.url)}
                            title={`${s.title} — ${s.creator} (${s.license})`}
                            className="block overflow-hidden border transition-colors relative"
                            style={{ borderColor: on ? "#5B8CFF" : "#1D2942", borderWidth: on ? 2 : 1 }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={s.thumb} alt={s.title} loading="lazy" className="w-full h-24 object-cover" />
                            {on && (
                              <span className="absolute bottom-1 right-1 text-[10px] bg-accent text-paper px-1.5 py-0.5">
                                picked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                      Click one to select it, then open the meme maker to caption it.
                      Openly licensed work from Openverse, credit the maker if you use it.
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          {/* Take it away */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "linear-gradient(90deg,#1E3A8A,#5B9BF9,#C6E4F8)" }} />
            <p className="label mb-3">Take it with you</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadLockup} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">Logo lockup, SVG</button>
              <button
                onClick={() => {
                  download(markSVG(mark, palette, initials, 512, true), `${slug}-mark.svg`, "image/svg+xml");
                  complete("mark");
                }}
                className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs"
              >
                Symbol only, SVG
              </button>
              <button onClick={copyCSS} className="btn border border-rule text-ink-soft hover:text-ink hover:bg-raised !px-4 !py-2.5 text-xs">Palette as CSS</button>
              <button
                onClick={() =>
                  download(
                    `${name || "Your thing"}\n${line || ""}\n\nFLOW\n${flow.name}\n\nPALETTE\n${ROLES.map((r) => `${r.label}: ${palette[r.id]}`).join("\n")}\n\nMARK\n${icon.id.replace(/-/g, " ")} in a ${containerId}\n\nLOGO\n${lockup.name} lockup\n\nTYPE\nPoppins ${typeSet.display} / ${typeSet.body} (${typeSet.name})\n\nMade in Flow Mode at flowzone.dev/start\n`,
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
                🏆 Every quest done. A name, colours chosen on purpose, a real vector
                logo and references to argue from. That is further than most projects
                get before anyone starts building.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
