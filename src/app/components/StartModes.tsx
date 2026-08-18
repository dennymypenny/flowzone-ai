"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Tilt3D from "@/app/components/Tilt3D";
import Icon from "@/components/Icon";

/**
 * Four tracks, one picker.
 *
 * These were tabs, and four tabs plus the panels inside each one crowded the
 * page badly on anything narrower than a laptop. Cards say the same thing in
 * one row, and the description underneath does the work the tab label could
 * not fit.
 *
 * Every track saves separately, so switching never costs anybody their work.
 * All four run locally: no key, no per-use cost, nothing that can be switched
 * off later because the bill got big.
 *
 * WHY THE TRACKS ARE LAZY
 * A visitor sees exactly one track. Shipping all four up front meant every
 * visitor paid for roughly 5,800 lines of track code plus a 54KB icon library
 * that only the Design track's icon search ever touches. Now the page ships
 * the picker, and the chosen track arrives as its own chunk.
 *
 * WHY ssr: false ON ALL FOUR
 * Every track reaches for the browser on mount: canvas contexts, localStorage,
 * MediaRecorder, window measurements. Rendering them on the server either
 * crashes or produces markup the client instantly throws away, so we skip the
 * server pass and let them mount where their APIs actually exist.
 */

const KEY = "flowzone.track.v2";

/**
 * The loading state is a real panel, not a spinner in the void.
 *
 * It reserves close to the height a live track takes, so the page does not
 * lurch when the chunk lands, and it says in plain words what is happening.
 * Somebody on a slow phone gets a sentence, not a mystery.
 */
function TrackLoading({ name }: { name: string }) {
  return (
    <div className="panel p-6 md:p-8 min-h-[560px] md:min-h-[640px]" aria-busy="true">
      <p className="label mb-4">Loading</p>
      <p className="text-base font-light leading-relaxed" style={{ color: "#ABB8CF" }} role="status">
        Getting the {name} track ready.
      </p>
      <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: "#7A89A5" }}>
        It is a big one so it loads on its own. That keeps the rest of the page quick. A few seconds
        on a slow connection.
      </p>

      {/* Placeholder bars, sized like the real controls that land here. They
          breathe gently and hold still for anyone who asked for less motion.
          Nothing is hidden: these are visible blocks, not invisible content. */}
      <div className="mt-8 space-y-4 animate-pulse motion-reduce:animate-none">
        <div className="h-11 w-2/3 rounded-xl" style={{ background: "rgba(255,255,255,0.10)" }} />
        <div className="h-11 w-full rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-40 w-full rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </div>
  );
}

const Playground = dynamic(() => import("@/app/components/Playground"), {
  ssr: false,
  loading: () => <TrackLoading name="Design" />,
});

const WritingTrack = dynamic(() => import("@/app/components/WritingTrack"), {
  ssr: false,
  loading: () => <TrackLoading name="Writing" />,
});

const ContentTrack = dynamic(() => import("@/app/components/ContentTrack"), {
  ssr: false,
  loading: () => <TrackLoading name="Content and reels" />,
});

const WorkSession = dynamic(() => import("@/app/components/WorkSession"), {
  ssr: false,
  loading: () => <TrackLoading name="The brief" />,
});

/**
 * Same modules, same chunks, called by hand so we can warm the three tracks
 * nobody picked yet. Webpack hands back the cached chunk, so this costs one
 * download and the later switch is instant.
 */
const LOAD_TRACK: Record<string, () => Promise<unknown>> = {
  design: () => import("@/app/components/Playground"),
  writing: () => import("@/app/components/WritingTrack"),
  content: () => import("@/app/components/ContentTrack"),
  brief: () => import("@/app/components/WorkSession"),
};

const TRACKS = [
  {
    id: "design",
    icon: "palette",
    name: "Design",
    blurb: "Name, colours, a real vector logo and references. Leave with the files.",
    accent: "#F0845F",
    rgb: "240, 132, 95",
  },
  {
    id: "writing",
    icon: "pencil",
    name: "Writing",
    blurb: "Scripts, landing pages and emails, built from the structure that makes them work.",
    accent: "#5B9BF9",
    rgb: "91, 155, 249",
  },
  {
    id: "content",
    icon: "clapper",
    name: "Content and reels",
    blurb: "Timed shot plans, captions, thumbnails. Editable to the last second.",
    accent: "#2DD4BF",
    rgb: "45, 212, 191",
  },
  {
    id: "brief",
    icon: "compass",
    name: "The brief",
    blurb: "Nine questions that turn a vague idea into something you can hand to anyone.",
    accent: "#34D399",
    rgb: "52, 211, 153",
  },
];

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type SaveDataNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

export default function StartModes() {
  const [track, setTrack] = useState("design");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved && TRACKS.some((t) => t.id === saved)) setTrack(saved);
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Prefetch the other three, but only once the page has finished loading and
   * the browser is genuinely idle. That ordering is the whole point: the
   * chosen track and everything else on the page win the network first, and
   * these three go out on leftover time.
   *
   * We back off entirely on Data Saver and 2g. Somebody metering their data
   * should not pay for three tracks they may never open. They still get the
   * loading panel and the track, just when they ask for it.
   */
  useEffect(() => {
    const w = window as IdleWindow;
    const conn = (navigator as SaveDataNavigator).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    let idleHandle = 0;
    let timeoutHandle = 0;

    const warm = () => {
      Object.keys(LOAD_TRACK).forEach((id) => {
        if (id === track) return;
        LOAD_TRACK[id]().catch(() => {
          /* a failed prefetch is not a problem, the real load retries */
        });
      });
    };

    const schedule = () => {
      if (w.requestIdleCallback) {
        idleHandle = w.requestIdleCallback(warm, { timeout: 4000 });
      } else {
        timeoutHandle = window.setTimeout(warm, 2500);
      }
    };

    if (document.readyState === "complete") {
      schedule();
      return () => {
        if (idleHandle && w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
        if (timeoutHandle) window.clearTimeout(timeoutHandle);
      };
    }

    window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleHandle && w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
    };
    // Runs once. The saved track lands before idle, and warming one extra
    // track later is cheaper than tearing this down and rebuilding it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id: string) => {
    setTrack(id);
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  };

  const current = TRACKS.find((t) => t.id === track) || TRACKS[0];

  /**
   * WHY PLAIN BUTTONS AND NOT THE ARIA TABS PATTERN
   *
   * Three reasons, all of them about the visitor rather than the spec.
   *
   * 1. The markup cannot honestly be a tablist. Every card is wrapped in
   *    Tilt3D, which renders its own div between the list and the button. A
   *    tablist has to own its tabs, so the roles were already a lie to a
   *    screen reader.
   * 2. Tabs move selection with the arrow keys, and here selection mounts a
   *    huge lazy panel and writes to storage. Arrowing across four tracks
   *    would fire four chunk loads and four saves. That is hostile on a slow
   *    phone.
   * 3. These panels are not four views of one thing. They are four separate
   *    tools with their own saved work. A visitor choosing one is making a
   *    choice, not flicking through.
   *
   * So: real buttons. Tab reaches them, Enter and Space fire them, aria-pressed
   * says which one is on, and the region below is labelled by the button that
   * chose it. Nothing to reimplement and nothing to get wrong.
   */
  return (
    <div>
      <div className="mb-8 scroll-mt-24" id="pick-your-flow">
        <p className="label mb-4" id="pick-your-flow-label">
          Pick your flow
        </p>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          role="group"
          aria-labelledby="pick-your-flow-label"
        >
          {TRACKS.map((t) => {
            const active = t.id === track;
            return (
              <Tilt3D key={t.id} max={9}>
                <button
                  type="button"
                  id={`track-btn-${t.id}`}
                  aria-pressed={active}
                  onClick={() => pick(t.id)}
                  className={`relative overflow-hidden w-full h-full text-left p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
                    active ? "game-active shine" : ""
                  }`}
                  style={{
                    ["--ga" as string]: t.rgb,
                    // Each tool keeps its colour even at rest, so the four
                    // cards read as four different doors before any is open.
                    borderColor: active ? `${t.accent}88` : `${t.accent}3d`,
                    background: active
                      ? `linear-gradient(180deg, ${t.accent}1f 0%, rgba(255,255,255,0.02) 100%), linear-gradient(to bottom, #1A2946, #131F36)`
                      : "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.035))",
                    boxShadow: active ? undefined : "inset 0 1px 0 rgba(255,255,255,0.16)",
                  }}
                >
                  {active && (
                    <span
                      className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-20 rounded-full blur-2xl opacity-30 pointer-events-none"
                      style={{ background: t.accent }}
                    />
                  )}
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] pointer-events-none"
                    style={{ background: t.accent, opacity: active ? 0.9 : 0.45 }}
                  />
                  <span className="flex items-center justify-between mb-3">
                    <Icon name={t.icon} size={22} color={t.accent} />
                    {active && (
                      <span
                        className="text-[10px] font-medium uppercase tracking-label"
                        style={{ color: t.accent }}
                      >
                        ▶ Selected
                      </span>
                    )}
                  </span>
                  <span
                    className="block font-display text-base leading-tight mb-1.5 transition-colors"
                    style={{ color: active ? "#FFFFFF" : "#C4D0E4" }}
                  >
                    {t.name}
                  </span>
                  <span className="block text-xs text-ink-mute font-light leading-relaxed">
                    {t.blurb}
                  </span>
                </button>
              </Tilt3D>
            );
          })}
        </div>
      </div>

      {/* The region says which track it is, so a screen reader user landing
          here hears where they are. Naming it off the card would drag the
          whole blurb along, and that is a lot of words to sit through. */}
      <section aria-label={`${current.name} track`}>
        {track === "design" && <Playground />}
        {track === "writing" && <WritingTrack accent={current.accent} />}
        {track === "content" && <ContentTrack accent={current.accent} />}
        {track === "brief" && <WorkSession />}
      </section>
    </div>
  );
}
