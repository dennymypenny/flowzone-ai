"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CONTAINERS,
  LOCKUPS,
  TYPESETS,
  brandSpec,
  categoryById,
  classify,
  contrast,
  findIcons,
  generatedMarks,
  hashSeed,
  iconMark,
  iconsForIdea,
  lockupSVG,
  makePalette,
  markSVG,
  nameIdeas,
  paletteCSS,
  paletteReport,
  palettePlan,
  readableOn,
  slugify,
  taglineIdeas,
  variants,
  type Locks,
  type Palette,
  type Role,
  type Vibe,
} from "@/lib/brandkit";
import { useAmbient } from "@/app/components/useAmbient";
import MemeMaker from "@/app/components/MemeMaker";
import Icon from "@/components/Icon";

/**
 * Flow Mode.
 *
 * You say what you are making, then you make it. Every control produces a real
 * file at the end: a composed logo lockup as SVG, a palette as CSS, a written
 * spec. Nothing here is a picture of a deliverable.
 *
 * Three ideas hold it together. The words the visitor typed drive everything,
 * so the same idea always grows the same identity and a bakery never comes out
 * looking like a law firm. Rerolling is for when you have no idea, and direct
 * picking is for when you do, so every generated thing can also be clicked and
 * overridden. And anything that opens must be easy to close: click outside it,
 * or press escape.
 */

const KEY = "flowzone.flow.v1";
const IDEA_KEY = "flowzone.idealens.v1";

const ROLES: Array<{ id: Role; label: string }> = [
  { id: "bg", label: "Background" },
  { id: "surface", label: "Surface" },
  { id: "ink", label: "Text" },
  { id: "muted", label: "Quiet" },
  { id: "a", label: "Accent" },
  { id: "b", label: "Second" },
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

/**
 * A lot of doors, because "a small business" is fifty different businesses.
 * The ids match the categories in the generator, so picking a flow and typing
 * an idea point at the same place.
 */
const FLOWS: Flow[] = [
  { id: "food", icon: "bread", name: "Food and drink", blurb: "Cafes, kitchens, bakeries, trucks, bars.", vibe: { energy: 62, temp: 78, era: 45 }, icons: "coffee", refs: "bakery interior", lockup: "badge", container: "circle" },
  { id: "shop", icon: "box", name: "A shop", blurb: "Products, drops, collectors, merch.", vibe: { energy: 78, temp: 45, era: 78 }, icons: "shopping-bag", refs: "retail store front", lockup: "block", container: "block" },
  { id: "trade", icon: "hammer", name: "Trades and building", blurb: "Builders, sparkies, plumbers, landscapers.", vibe: { energy: 52, temp: 62, era: 30 }, icons: "hammer", refs: "workshop tools", lockup: "framed", container: "shield" },
  { id: "studio", icon: "palette", name: "Creative studio", blurb: "Design, photo, film, music, writing.", vibe: { energy: 45, temp: 30, era: 88 }, icons: "pen-tool", refs: "design studio", lockup: "wordmark", container: "bare" },
  { id: "health", icon: "leaf", name: "Health and care", blurb: "Clinics, therapists, trainers, wellbeing.", vibe: { energy: 30, temp: 48, era: 60 }, icons: "leaf", refs: "calm clinic interior", lockup: "stacked", container: "circle" },
  { id: "sport", icon: "trophy", name: "Sport and clubs", blurb: "Teams, gyms, leagues, coaching.", vibe: { energy: 88, temp: 55, era: 70 }, icons: "trophy", refs: "sports team crest", lockup: "badge", container: "shield" },
  { id: "tech", icon: "bolt", name: "Tech and tools", blurb: "Apps, agencies, SaaS, anything technical.", vibe: { energy: 58, temp: 18, era: 92 }, icons: "zap", refs: "modern office", lockup: "horizontal", container: "hex" },
  { id: "home", icon: "house", name: "Home and property", blurb: "Lettings, interiors, cleaning, moving.", vibe: { energy: 34, temp: 58, era: 40 }, icons: "home", refs: "interior architecture", lockup: "framed", container: "ring" },
  { id: "pets", icon: "paw", name: "Pets and animals", blurb: "Grooming, walking, vets, supplies.", vibe: { energy: 66, temp: 70, era: 55 }, icons: "paw-print", refs: "dog grooming", lockup: "stacked", container: "circle" },
  { id: "events", icon: "ticket", name: "Events and nights", blurb: "Promoters, venues, weddings, markets.", vibe: { energy: 84, temp: 35, era: 82 }, icons: "ticket", refs: "concert lighting", lockup: "block", container: "block" },
  { id: "money", icon: "banknote", name: "Money and advice", blurb: "Bookkeeping, consulting, legal, insurance.", vibe: { energy: 26, temp: 22, era: 48 }, icons: "landmark", refs: "architecture columns", lockup: "wordmark", container: "ring" },
  { id: "open", icon: "sparkle", name: "Something else", blurb: "Start blank and take it wherever.", vibe: { energy: 55, temp: 45, era: 65 }, icons: "sparkles", refs: "abstract texture", lockup: "horizontal", container: "circle" },
];

type Shot = { id: string; url: string; thumb: string; title: string; creator: string; license: string; source: string };
type Quest = { id: string; icon: string; name: string; goal: string; xp: number; color: string };

const QUESTS: Quest[] = [
  { id: "name", icon: "pencil", name: "A name", goal: "What the thing is called", xp: 20, color: "#5B9BF9" },
  { id: "purpose", icon: "target", name: "A purpose", goal: "The line that says what it is", xp: 20, color: "#A78BFA" },
  { id: "color", icon: "palette", name: "Colours", goal: "A palette you chose on purpose", xp: 20, color: "#FBBF24" },
  { id: "mark", icon: "shield", name: "A symbol", goal: "The mark and the shape it sits in", xp: 20, color: "#2DD4BF" },
  { id: "logo", icon: "ruler", name: "A logo", goal: "The finished lockup, downloaded", xp: 20, color: "#34D399" },
];

const LEVELS = ["Nothing yet", "A sketch", "Taking shape", "Nearly there", "Ready to hand over"];

/**
 * Reference topics as a list to choose from rather than a blank search box.
 * A blank box asks somebody to already know what to look for, which is the
 * exact thing they came here without. The first few come from their own idea.
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
        className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-label transition-colors motion-reduce:transition-none"
        style={{ color }}
      >
        <span>{open ? "−" : "+"}</span> Why this matters: {title}
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
  const [idea, setIdea] = useState("");
  const [seed, setSeed] = useState(1);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [dark, setDark] = useState(true);
  const [vibe, setVibe] = useState<Vibe>({ energy: 55, temp: 45, era: 65 });
  const [locks, setLocks] = useState<Locks>({});
  const [typeId, setTypeId] = useState(TYPESETS[0].id);
  const [markMode, setMarkMode] = useState<"built" | "library">("built");
  const [builtId, setBuiltId] = useState("");
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
        setIdea(p.idea ?? "");
        setSeed(p.seed ?? 1);
        setName(p.name ?? "");
        setLine(p.line ?? "");
        setDark(p.dark ?? true);
        setVibe(p.vibe ?? { energy: 55, temp: 45, era: 65 });
        setLocks(p.locks ?? {});
        setTypeId(p.typeId ?? TYPESETS[0].id);
        setMarkMode(p.markMode ?? "built");
        setBuiltId(p.builtId ?? "");
        setIconId(p.iconId ?? "sparkles");
        setContainerId(p.containerId ?? "circle");
        setLockupId(p.lockupId ?? "horizontal");
        setDone(p.done ?? {});
        // Somebody who has already got going keeps what they have. Only a run
        // with nothing in it yet gets handed the idea from the front door.
        if (p.idea || p.name) return;
      }
      // Whatever they typed on the way in is the whole point. Pick it up.
      const lens = window.localStorage.getItem(IDEA_KEY);
      if (lens) {
        const parsed = JSON.parse(lens);
        if (parsed?.q) setIdea(String(parsed.q));
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
          JSON.stringify({ flowId, idea, seed, name, line, dark, vibe, locks, typeId, markMode, builtId, iconId, containerId, lockupId, done })
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [flowId, idea, seed, name, line, dark, vibe, locks, typeId, markMode, builtId, iconId, containerId, lockupId, done]);

  /**
   * Everything downstream grows from these two lines. The idea sets the seed,
   * so the same sentence always regrows the same identity, and rerolling is
   * just walking one step along from it rather than starting again somewhere
   * unrelated.
   */
  const detected = useMemo(() => classify(idea), [idea]);
  const category = useMemo(() => (flowId ? categoryById(flowId) : detected), [flowId, detected]);
  const seedNum = useMemo(
    () => (hashSeed(`${idea.trim().toLowerCase()}|${category.id}`) + seed * 2654435761) >>> 0,
    [idea, category.id, seed]
  );

  const palette: Palette = useMemo(
    () => makePalette(seedNum, vibe, dark, locks, { hue: category.hue }),
    [seedNum, vibe, dark, locks, category.hue]
  );
  const plan = useMemo(() => palettePlan(seedNum, vibe, { hue: category.hue }), [seedNum, vibe, category.hue]);
  const checks = useMemo(() => paletteReport(palette), [palette]);
  const failing = checks.filter((c) => !c.pass);

  const initials =
    (name.trim() || "Your Thing").split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 3) || "YT";

  const built = useMemo(() => generatedMarks(seedNum, initials, category), [seedNum, initials, category]);
  const suggestedIcons = useMemo(() => iconsForIdea(idea, category, 12), [idea, category]);
  const iconList = useMemo(() => findIcons(iconQ, 48), [iconQ]);
  const icon = useMemo(
    () => findIcons(iconId, 1).find((i) => i.id === iconId) || iconList[0] || findIcons("sparkles", 1)[0],
    [iconId, iconList]
  );
  const builtMark = built.find((m) => m.id === builtId) || built[0];
  const mark = useMemo(
    () => (markMode === "built" ? builtMark : iconMark(icon, containerId)),
    [markMode, builtMark, icon, containerId]
  );

  const typeSet = TYPESETS.find((t) => t.id === typeId) || TYPESETS[0];
  const lockup = LOCKUPS.find((l) => l.id === lockupId) || LOCKUPS[0];
  const fonts = { displayFont: typeSet.displayFont, bodyFont: typeSet.bodyFont, tracking: typeSet.tracking };
  const rendered = mark.render(palette, initials);

  const names = useMemo(() => nameIdeas(idea, seedNum, 7, category), [idea, seedNum, category]);
  const lines = useMemo(() => taglineIdeas(idea, name, seedNum, 4, category), [idea, name, seedNum, category]);
  const chosenName = names.find((n) => n.name.toLowerCase() === name.trim().toLowerCase());

  /**
   * Progress is measured from the kit itself, not from clicks. A bar that fills
   * because you pressed things is a lie; this one only moves when the brand
   * genuinely has another piece of itself.
   */
  const has: Record<string, boolean> = {
    name: Boolean(name.trim()),
    purpose: Boolean(line.trim()),
    color: Object.keys(locks).length > 0 || Boolean(done.color),
    mark: Boolean(done.mark) || Boolean(builtId) || iconId !== "sparkles",
    logo: Boolean(done.logo),
  };
  const xp = QUESTS.reduce((n, q) => n + (has[q.id] ? q.xp : 0), 0);
  const levelIdx = Math.min(LEVELS.length - 1, Math.floor(xp / 25));
  const complete = (id: string) => setDone((d) => (d[id] ? d : { ...d, [id]: true }));
  const music = useAmbient(seedNum, vibe.energy, vibe.era, vibe.temp);

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

  const slug = slugify(name);

  const downloadLockup = () => {
    download(
      lockupSVG(lockup, mark, palette, name, line, initials, typeSet.display, typeSet.body, true, fonts),
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
    setBuiltId("");
    setRefQ(f.refs);
  };

  /* ------------------------------------------------------- pick your flow -- */
  if (!flow) {
    const suggestion = FLOWS.find((f) => f.id === detected.id) || FLOWS[FLOWS.length - 1];
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Icon name="wave" size={24} color="#5B9BF9" />
          <h2 className="font-display text-3xl">Say what you are making.</h2>
        </div>
        <p className="text-ink-soft font-light leading-relaxed max-w-reading mb-6">
          One line is enough. Everything after this is built out of the words you
          use here: the names, the base colour, the symbol, what is worth looking
          at. Type it, then pick the door that fits.
        </p>
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="a bakery people cross town for"
          className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3.5 text-base font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none mb-4"
        />
        {idea.trim() && (
          <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-6">
            That reads like <span style={{ color: "#8BADFF" }}>{suggestion.name.toLowerCase()}</span> to me.
            Base colour will be {detected.hueNote}.{" "}
            <button onClick={() => startFlow(suggestion)} className="underline text-accent">
              Start there
            </button>
            , or choose your own below.
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FLOWS.map((f) => {
            const hint = idea.trim() && f.id === suggestion.id;
            return (
              <button
                key={f.id}
                onClick={() => startFlow(f)}
                className="text-left border p-5 hover:border-accent hover:bg-raised transition-colors motion-reduce:transition-none"
                style={{ borderColor: hint ? "#5B8CFF" : "#26355A" }}
              >
                <span className="block mb-3"><Icon name={f.icon} size={22} color="#8BADFF" /></span>
                <p className="font-display text-lg mb-1">{f.name}</p>
                <p className="text-[13px] text-ink-soft font-light leading-relaxed">{f.blurb}</p>
              </button>
            );
          })}
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
            <Icon name={flow.icon} size={24} color="#8BADFF" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-label text-ink-mute">
                {flow.name} · {LEVELS[levelIdx]}
              </p>
              <p className="font-display text-xl leading-tight">
                Your brand kit is {xp}% built
              </p>
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

        {/* The idea, still editable, because it drives everything below it. */}
        <label className="block mb-5">
          <span className="label mb-2 block">What you are making</span>
          <input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="a bakery people cross town for"
            className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none"
          />
          <span className="block text-[11px] text-ink-mute font-light mt-2 leading-relaxed">
            Change this and the names, the colours and the symbols all change with it.
            Same sentence, same kit, every time.
          </span>
        </label>

        <div className="h-1.5 w-full bg-raised mb-5">
          <div
            className="h-full transition-all duration-700 motion-reduce:transition-none"
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
                borderColor: has[q.id] ? q.color : "#26355A",
                color: has[q.id] ? q.color : "#647089",
                background: has[q.id] ? `${q.color}0F` : "transparent",
              }}
            >
              <Icon name={q.icon} size={15} color={q.color} />
              {q.name}
              <span>{has[q.id] ? "✓" : "—"}</span>
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
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none mb-3"
            />
            {chosenName && (
              <p className="text-[12px] text-ink-soft font-light leading-relaxed mb-3">
                <span style={{ color: "#5B9BF9" }}>{chosenName.strategy}.</span> {chosenName.why}
              </p>
            )}
            <div className="space-y-2 mb-6">
              {names.map((n) => (
                <button
                  key={n.name}
                  onClick={() => {
                    setName(n.name);
                    complete("name");
                  }}
                  className="w-full text-left border border-rule px-4 py-3 hover:border-accent hover:bg-raised transition-colors motion-reduce:transition-none"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-ink">{n.name}</span>
                    <span className="text-[10px] uppercase tracking-label text-ink-mute shrink-0">{n.strategy}</span>
                  </span>
                  <span className="block text-[11px] text-ink-mute font-light leading-relaxed mt-1">{n.why}</span>
                </button>
              ))}
            </div>
            <input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="What it is, in one line. This is the purpose."
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {lines.map((l) => (
                <button
                  key={l}
                  onClick={() => setLine(l)}
                  className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors motion-reduce:transition-none text-left"
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
            <div className="flex items-center justify-between mb-2">
              <p className="label">🎨 Colour it</p>
              <span className="text-[10px]" style={{ color: failing.length ? "#FBBF24" : "#34D399" }}>
                {failing.length ? `${failing.length} pair below AA` : "all pairs pass AA"}
              </span>
            </div>
            <p className="text-[12px] text-ink-mute font-light leading-relaxed mb-4">
              Base hue {Math.round(plan.base)}°, {category.hueNote}. Second colour is{" "}
              {plan.relation}, {Math.round(plan.hueB)}°.
            </p>

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

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setOpenRole(openRole === r.id ? null : r.id)}
                  title={`${r.label}, click to change`}
                >
                  <span
                    className="block w-full h-14 border transition-all motion-reduce:transition-none"
                    style={{
                      background: palette[r.id],
                      borderColor: openRole === r.id ? "#5B8CFF" : locks[r.id] ? "#5B8CFF" : "#26355A",
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

            <ul className="mt-4 space-y-1">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center justify-between text-[11px] font-light">
                  <span className="text-ink-mute">{c.label}</span>
                  <span style={{ color: c.pass ? "#34D399" : "#FBBF24" }}>
                    {c.ratio}:1 {c.pass ? "✓" : "low"}
                  </span>
                </li>
              ))}
            </ul>

            {openRole && (
              <div
                ref={popRef}
                className="absolute left-4 right-4 bottom-4 z-40 panel shadow-panel p-5"
                style={{ background: "#172440" }}
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
                      title={`${c} · ${Math.round(contrast(c, palette.bg) * 10) / 10}:1 on the background`}
                      onClick={() => {
                        setLocks((l) => ({ ...l, [openRole]: c }));
                        complete("color");
                      }}
                      className="block h-8 border border-rule hover:border-accent transition-colors motion-reduce:transition-none"
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
                    className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:bg-raised transition-colors motion-reduce:transition-none"
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
              {copied === "css" ? "✓ Copied" : "Copy as CSS variables"}
            </button>
            <Principle
              title="how palettes actually hold together"
              color="#A78BFA"
              points={[
                "One base hue, then a real relationship. Analogous for calm, complementary for tension, triadic for noise. Two hues picked at random are just two hues.",
                "Two accents, not five. Colours far apart on the wheel stay readable together; a crowd of them turns to mush the second anything gets small.",
                "Most of the surface should be near neutral. Accent is punctuation, not paragraphs, and colour only reads as loud when there is quiet around it.",
                "Tint the neutrals with the base hue. Pure grey next to colour is what makes a palette look like it was assembled rather than chosen.",
                "Measure contrast, do not eyeball it. Yellow at half lightness is twice as bright as blue at half lightness, which is why the numbers above exist.",
              ]}
            />
          </div>

          {/* Symbol */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#FBBF24" }} />
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="label">🛡️ Draw the mark</p>
              <div className="flex">
                {(
                  [
                    ["built", "Built for you"],
                    ["library", "Symbol library"],
                  ] as const
                ).map(([k, label]) => {
                  const on = markMode === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setMarkMode(k)}
                      className="text-[11px] px-3 py-1.5 border-t border-b border-r first:border-l transition-colors motion-reduce:transition-none"
                      style={{
                        borderColor: on ? "#5B8CFF" : "#26355A",
                        color: on ? "#F1F3F7" : "#9AA7BE",
                        background: on ? "#172440" : "transparent",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {markMode === "built" ? (
              <>
                <p className="text-[13px] text-ink-soft font-light leading-relaxed mb-4">
                  Ten mark systems, each one a rule rather than a picture: how many
                  arcs, how tall the bars, which cells are filled. Your seed sets the
                  numbers, so reroll gives you a cousin, not a stranger.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {built.map((m) => {
                    const on = m.id === mark.id;
                    const r = m.render(palette, initials);
                    return (
                      <button
                        key={m.id}
                        title={m.note}
                        onClick={() => {
                          setBuiltId(m.id);
                          complete("mark");
                        }}
                        className="border p-1 transition-colors motion-reduce:transition-none"
                        style={{
                          borderColor: on ? "#5B8CFF" : "#26355A",
                          borderWidth: on ? 2 : 1,
                          background: palette.bg,
                        }}
                      >
                        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label={m.name}>
                          {r.defs ? <defs dangerouslySetInnerHTML={{ __html: r.defs }} /> : null}
                          <g dangerouslySetInnerHTML={{ __html: r.body }} />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-ink-mute font-light mt-3 leading-relaxed">
                  {builtMark.name}. {builtMark.note}
                </p>
              </>
            ) : (
              <>
                {suggestedIcons.length > 0 && (
                  <>
                    <p className="text-[11px] text-ink-mute font-light mb-2">From what you typed</p>
                    <div className="grid grid-cols-8 gap-1.5 mb-4">
                      {suggestedIcons.map((ic) => {
                        const on = ic.id === icon.id;
                        return (
                          <button
                            key={`s-${ic.id}`}
                            title={ic.id.replace(/-/g, " ")}
                            onClick={() => {
                              setIconId(ic.id);
                              complete("mark");
                            }}
                            className="aspect-square border flex items-center justify-center transition-colors motion-reduce:transition-none"
                            style={{ borderColor: on ? "#5B8CFF" : "#26355A", background: on ? "#172440" : "transparent" }}
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={on ? "#F1F3F7" : "#9AA7BE"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ic.d }} />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                <input
                  value={iconQ}
                  onChange={(e) => setIconQ(e.target.value)}
                  placeholder="Search 199 symbols: coffee, dog, wrench, wave..."
                  className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule px-4 py-3 text-sm font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none mb-3"
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
                        className="aspect-square border flex items-center justify-center transition-colors motion-reduce:transition-none"
                        style={{ borderColor: on ? "#5B8CFF" : "#26355A", background: on ? "#172440" : "transparent" }}
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
                      className="text-xs border px-3 py-2 transition-colors motion-reduce:transition-none"
                      style={{ borderColor: c.id === containerId ? "#5B8CFF" : "#26355A", color: c.id === containerId ? "#F1F3F7" : "#9AA7BE" }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* The only test that matters, at the size it will live at. */}
            <div className="flex items-center gap-4 mt-5 border-t border-rule pt-4">
              {[16, 24, 40].map((s) => (
                <span key={s} className="flex items-center gap-2">
                  <svg viewBox="0 0 100 100" width={s} height={s} aria-label={`Mark at ${s} pixels`}>
                    {rendered.defs ? <defs dangerouslySetInnerHTML={{ __html: rendered.defs }} /> : null}
                    <g dangerouslySetInnerHTML={{ __html: rendered.body }} />
                  </svg>
                  <span className="text-[10px] text-ink-mute">{s}px</span>
                </span>
              ))}
            </div>

            <Principle
              title="what stops a mark dying at small sizes"
              color="#FBBF24"
              points={[
                "The silhouette has to work in one flat colour first. Gradients and shine are the last thing you add, never the thing holding it up.",
                "It spends its life at about forty pixels, in a tab and on a phone. Judge it there, which is why the row above exists.",
                "Pick a symbol that says something about the business, not one that looks nice. Every element should answer a question or come out.",
                "The container is a real decision. A circle reads friendly, a shield reads authority, bare reads modern and confident.",
              ]}
            />
          </div>

          {/* Type */}
          <div className="panel p-6 relative overflow-hidden">
            <span className="absolute top-0 left-0 h-[3px] w-full" style={{ background: "#C6E4F8" }} />
            <p className="label mb-2">🔤 Set the type</p>
            <p className="text-[12px] text-ink-mute font-light leading-relaxed mb-4">
              Every one of these is installed on the machine you are reading this on.
              No licence to buy, no download, and the preview is the real thing.
            </p>
            <div className="space-y-2">
              {TYPESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypeId(t.id)}
                  className="w-full text-left border px-4 py-3 transition-colors motion-reduce:transition-none"
                  style={{ borderColor: t.id === typeId ? "#5B8CFF" : "#26355A" }}
                >
                  <span
                    className="block text-lg leading-tight"
                    style={{ fontFamily: t.displayFont, fontWeight: Number(t.display), letterSpacing: `${t.tracking}px` }}
                  >
                    {name.trim() || "Your Thing"}
                  </span>
                  <span
                    className="block text-[12px] text-ink-soft mt-1"
                    style={{ fontFamily: t.bodyFont, fontWeight: Number(t.body) }}
                  >
                    {t.name}. {t.note}
                  </span>
                  {t.id === typeId && (
                    <span className="block text-[11px] text-ink-mute font-light leading-relaxed mt-2">{t.why}</span>
                  )}
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
              Each one measures your name and grows to fit it. Pick the layout, take the file.
            </p>

            <div className="space-y-3">
              {LOCKUPS.map((lk) => {
                const on = lk.id === lockupId;
                const svg = lockupSVG(lk, mark, palette, name, line, initials, typeSet.display, typeSet.body, true, fonts);
                return (
                  <button
                    key={lk.id}
                    onClick={() => setLockupId(lk.id)}
                    className="w-full border overflow-hidden transition-colors motion-reduce:transition-none text-left"
                    style={{ borderColor: on ? "#5B8CFF" : "#26355A", borderWidth: on ? 2 : 1 }}
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
          <div className="rounded-2xl border border-rule overflow-hidden transition-colors duration-500 motion-reduce:transition-none" style={{ background: palette.bg }}>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <svg viewBox="0 0 100 100" width="56" height="56" aria-label="Generated mark">
                  {rendered.defs ? <defs dangerouslySetInnerHTML={{ __html: rendered.defs }} /> : null}
                  <g dangerouslySetInnerHTML={{ __html: rendered.body }} />
                </svg>
                <div>
                  <p
                    className="text-2xl leading-tight"
                    style={{ color: palette.ink, fontFamily: typeSet.displayFont, fontWeight: Number(typeSet.display), letterSpacing: `${typeSet.tracking}px` }}
                  >
                    {name.trim() || "Your Thing"}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: palette.muted, fontFamily: typeSet.bodyFont, fontWeight: Number(typeSet.body) }}>
                    {line.trim() || "One line that says what it is"}
                  </p>
                </div>
              </div>
              <p
                className="text-[32px] leading-[1.08] mb-4"
                style={{ color: palette.ink, fontFamily: typeSet.displayFont, fontWeight: Number(typeSet.display), letterSpacing: `${typeSet.tracking}px` }}
              >
                {line.trim() || "The headline sits here."}
              </p>
              <p className="text-sm leading-relaxed mb-6 max-w-reading" style={{ color: palette.muted, fontFamily: typeSet.bodyFont, fontWeight: Number(typeSet.body) }}>
                And this is the body text underneath it, set in the pairing you picked, on
                the surface colour that came out of the same base hue. If this is hard to
                read here it will be hard to read everywhere.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs px-4 py-2.5 font-medium" style={{ background: palette.a, color: readableOn(palette.a, palette) }}>Primary action</span>
                <span className="text-xs px-4 py-2.5 font-medium" style={{ border: `1px solid ${palette.muted}`, color: palette.ink }}>Secondary</span>
                <span className="text-xs px-4 py-2.5 font-medium" style={{ background: palette.b, color: readableOn(palette.b, palette) }}>Highlight</span>
              </div>
              <div className="p-5 mb-8" style={{ background: palette.surface }}>
                <p className="text-[11px] uppercase tracking-label mb-1" style={{ color: palette.a }}>A card on the surface colour</p>
                <p className="text-sm" style={{ color: palette.ink, fontFamily: typeSet.bodyFont, fontWeight: Number(typeSet.body) }}>
                  Every real interface has a layer above the page. This is it.
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROLES.map((r) => (
                  <div key={r.id}>
                    <span className="block h-10" style={{ background: palette[r.id], outline: `1px solid ${palette.muted}` }} />
                    <span className="block text-[9px] mt-1" style={{ color: palette.muted }}>{r.label}</span>
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
                  const on = refKind === k;
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        setRefKind(k as never);
                        if (k !== "meme" && refQ) fetchRefs(refQ, k as "photo" | "gif");
                      }}
                      className="text-[11px] px-3 py-1.5 border-t border-b border-r first:border-l transition-colors motion-reduce:transition-none"
                      style={{
                        borderColor: on ? "#5B8CFF" : "#26355A",
                        color: on ? "#F1F3F7" : "#9AA7BE",
                        background: on ? "#172440" : "transparent",
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

                {refKind === "photo" && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.refs.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRefQ(r);
                          fetchRefs(r, "photo");
                        }}
                        className="text-[11px] border px-3 py-1.5 hover:bg-raised transition-colors motion-reduce:transition-none"
                        style={{ borderColor: refQ === r ? "#5B8CFF" : "#26355A", color: refQ === r ? "#F1F3F7" : "#9AA7BE" }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <select
                    value={refQ}
                    onChange={(e) => {
                      setRefQ(e.target.value);
                      if (e.target.value) fetchRefs(e.target.value);
                    }}
                    className="flex-1 min-w-0 bg-paper-deep text-ink border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors motion-reduce:transition-none"
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
                            title={`${s.title}, by ${s.creator} (${s.license})`}
                            className="block overflow-hidden border transition-colors motion-reduce:transition-none relative"
                            style={{ borderColor: on ? "#5B8CFF" : "#26355A", borderWidth: on ? 2 : 1 }}
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
                    brandSpec({
                      idea,
                      name,
                      line,
                      category,
                      palette,
                      plan,
                      type: typeSet,
                      markName: markMode === "built" ? `${builtMark.name}, built from your seed` : `${icon.id.replace(/-/g, " ")} in a ${containerId}`,
                      lockupName: lockup.name,
                      strategy: chosenName?.strategy,
                      why: chosenName?.why,
                    }),
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
                🏆 That is a complete brand kit. A name with a reason behind it, a
                purpose, colours that pass contrast and a real vector logo. Further than
                most projects get before anybody starts building.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
