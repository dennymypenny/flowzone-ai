"use client";
import { useEffect, useState } from "react";
import Playground from "@/app/components/Playground";
import WorkSession from "@/app/components/WorkSession";
import WritingTrack from "@/app/components/WritingTrack";
import ContentTrack from "@/app/components/ContentTrack";

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
    icon: "🎨",
    name: "Design",
    blurb: "Name, colours, a real vector logo and references. Leave with the files.",
    accent: "#A78BFA",
  },
  {
    id: "writing",
    icon: "✍️",
    name: "Writing",
    blurb: "Scripts, landing pages and emails, built from the structure that makes them work.",
    accent: "#5B9BF9",
  },
  {
    id: "content",
    icon: "🎬",
    name: "Content and reels",
    blurb: "Timed shot plans, captions, thumbnails. Editable to the last second.",
    accent: "#2DD4BF",
  },
  {
    id: "brief",
    icon: "🧭",
    name: "The brief",
    blurb: "Six questions that turn a vague idea into something you can hand to anyone.",
    accent: "#34D399",
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
      <div className="panel p-5 mb-6 relative overflow-hidden">
        <span
          className="absolute top-0 left-0 h-[3px] w-full transition-colors duration-500"
          style={{ background: current.accent }}
        />
        <div className="grid sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5">
            <p className="label mb-2">Working on</p>
            <select
              value={track}
              onChange={(e) => pick(e.target.value)}
              className="w-full bg-paper-deep text-ink border border-rule px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            >
              {TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon}  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-7">
            <p className="font-display text-lg leading-tight mb-1">{current.name}</p>
            <p className="text-sm text-ink-soft font-light leading-relaxed">{current.blurb}</p>
          </div>
        </div>
      </div>

      {track === "design" && <Playground />}
      {track === "writing" && <WritingTrack accent={current.accent} />}
      {track === "content" && <ContentTrack accent={current.accent} />}
      {track === "brief" && <WorkSession />}
    </div>
  );
}
