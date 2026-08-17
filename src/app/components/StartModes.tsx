"use client";
import { useEffect, useState } from "react";
import Playground from "@/app/components/Playground";
import WorkSession from "@/app/components/WorkSession";
import WritingTrack from "@/app/components/WritingTrack";
import ContentTrack from "@/app/components/ContentTrack";
import Tilt3D from "@/app/components/Tilt3D";
import Icon from "@/components/Icon";

/**
 * Four tracks, one dropdown.
 *
 * These were tabs, and four tabs plus the panels inside each one crowded the
 * page badly on anything narrower than a laptop. A dropdown says the same thing
 * in one line, and the description underneath does the work the tab label could
 * not fit.
 *
 * Every track saves separately, so switching never costs anybody their work.
 * All four run locally: no key, no per-use cost, nothing that can be switched
 * off later because the bill got big.
 */

const KEY = "flowzone.track.v2";

const TRACKS = [
  {
    id: "design",
    icon: "palette",
    name: "Design",
    blurb: "Name, colours, a real vector logo and references. Leave with the files.",
    accent: "#A78BFA",
    rgb: "167, 139, 250",
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

  const pick = (id: string) => {
    setTrack(id);
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  };

  const current = TRACKS.find((t) => t.id === track) || TRACKS[0];

  return (
    <div>
      <div className="mb-8 scroll-mt-24" id="pick-your-flow">
        <p className="label mb-4">Pick your flow</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="tablist" aria-label="Flow Mode tracks">
          {TRACKS.map((t) => {
            const active = t.id === track;
            return (
              <Tilt3D key={t.id} max={9}>
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => pick(t.id)}
                  className={`relative overflow-hidden w-full h-full text-left p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
                    active ? "game-active shine" : ""
                  }`}
                  style={{
                    ["--ga" as string]: t.rgb,
                    borderColor: active ? `${t.accent}88` : "rgba(255,255,255,0.16)",
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

      {track === "design" && <Playground />}
      {track === "writing" && <WritingTrack accent={current.accent} />}
      {track === "content" && <ContentTrack accent={current.accent} />}
      {track === "brief" && <WorkSession />}
    </div>
  );
}
