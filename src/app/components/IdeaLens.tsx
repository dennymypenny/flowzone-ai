"use client";
import { useEffect, useRef, useState } from "react";
import Tilt3D from "@/app/components/Tilt3D";
import VideoSpark from "@/app/components/VideoSpark";

/**
 * Type a thing, see the thing, pick it, move on.
 *
 * One photograph at a time, big, in a card that tilts toward the pointer.
 * Not a wall of options: a single frame, a reroll, and a pick. Click the
 * picture or the pick button and it is saved as the vibe for this session,
 * the page moves you on to the tracks, and a small bar remembers your
 * choice with a way to change it.
 *
 * Images are openly licensed, pulled live from the open web. The credit
 * rides along quietly: it appears on hover, never as a caption.
 */

type Shot = {
  id: string;
  thumb: string;
  url: string;
  title: string;
  creator: string;
  source: string;
};

const KEY = "flowzone.idealens.v1";
const STARTERS = ["a bakery", "a barbershop", "a sneaker shop"];

export default function IdeaLens() {
  const [q, setQ] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState("");
  const [chosen, setChosen] = useState<{ q: string; thumb: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) setChosen(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const fetchShots = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.shots) && data.shots.length) {
        setShots(data.shots);
        setIdx(0);
        setShown(term);
      }
    } catch {
      /* the frame just stays as it was */
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!q.trim()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => fetchShots(q), 650);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  const shot = shots[idx];

  const pick = () => {
    if (!shot) return;
    const sel = { q: shown, thumb: shot.thumb };
    setChosen(sel);
    setShots([]);
    setQ("");
    try {
      window.localStorage.setItem(KEY, JSON.stringify(sel));
    } catch {
      /* ignore */
    }
    document.getElementById("pick-your-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clear = () => {
    setChosen(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  // Already picked: one quiet line, then the next move.
  if (chosen && !shots.length) {
    return (
      <div>
        <div className="flex items-center gap-4 rounded-2xl border border-rule bg-paper-deep/70 p-3 pr-5 max-w-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={chosen.thumb}
            alt={chosen.q}
            className="w-16 h-16 object-cover rounded-xl border border-white/15"
          />
          <div className="flex-1 min-w-0">
            <p className="label mb-1">Your vibe</p>
            <p className="text-sm text-ink font-light truncate">{chosen.q}</p>
          </div>
          <button
            onClick={clear}
            className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors shrink-0"
          >
            Change it
          </button>
        </div>
        <VideoSpark topic={chosen.q} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchShots(q)}
            placeholder="Type the thing you dream of. Bread. A barbershop. Anything."
            aria-label="Type an idea to see a real photograph of it"
            className="w-full bg-paper-deep/80 text-ink placeholder-ink-mute border border-rule px-5 py-4 text-base font-light outline-none focus:border-accent transition-colors"
          />
          {busy && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQ(s);
                fetchShots(s);
              }}
              className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {shot && (
        <div className="mt-8 max-w-2xl">
          <p className="label mb-4">This is {shown} · like it or roll another</p>
          <Tilt3D max={8}>
            <button
              onClick={pick}
              className="group relative block w-full rounded-2xl overflow-hidden bg-[#101A2C] border border-white/15 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.85)] text-left"
              aria-label={`Use this photograph of ${shown}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={shot.id}
                src={shot.thumb}
                alt={shown}
                className="w-full h-[300px] sm:h-[380px] object-cover block"
                style={{ animation: "ideain 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
              />
              {/* Credit lives on hover only. No caption bar. */}
              <span className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {shot.creator}
              </span>
              <span className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-white">✓ Yes, this feeling. Keep it.</span>
              </span>
            </button>
          </Tilt3D>
          <div className="flex gap-3 mt-4">
            <button onClick={pick} className="btn-primary !px-5 !py-2.5 text-sm">
              ✓ Keep it, move on
            </button>
            <button
              onClick={() => setIdx((idx + 1) % shots.length)}
              className="btn-ghost !px-5 !py-2.5 text-sm"
            >
              Show me another <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
