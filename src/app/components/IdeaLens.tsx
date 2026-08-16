"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Type a thing, see the thing.
 *
 * The fastest way to make "we get ideas moving" feel true is to move on the
 * visitor's own idea, in front of them, in a second. Type bread and actual
 * photographs of bread arrive and hang in space. Not icons, not clip art:
 * real pictures of the real thing, pulled live from the open web with the
 * credit attached.
 *
 * The depth is honest CSS 3D: every card gets its own Z plane and the whole
 * scene leans with the pointer, so the collage reads as a space you are
 * looking into rather than a grid.
 */

type Shot = {
  id: string;
  thumb: string;
  title: string;
  creator: string;
  source: string;
};

const STARTERS = ["a bakery", "a barbershop", "a sneaker shop", "a taco truck", "a gym", "a flower stand"];

/** Deterministic scatter per index, so layout does not jump between renders. */
const SEATS = [
  { x: -34, y: -6, r: -7, z: 90 },
  { x: 2, y: -14, r: 3, z: 30 },
  { x: 36, y: -4, r: 8, z: 110 },
  { x: -18, y: 12, r: 5, z: 60 },
  { x: 18, y: 14, r: -4, z: 140 },
  { x: 44, y: 18, r: -9, z: 45 },
  { x: -44, y: 16, r: 9, z: 20 },
  { x: 0, y: 4, r: -2, z: 75 },
];

export default function IdeaLens() {
  const [q, setQ] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const timer = useRef<number | undefined>(undefined);
  const scene = useRef<HTMLDivElement | null>(null);

  const fetchShots = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.shots)) {
        setShots(data.shots.slice(0, 8));
        setShown(term);
      }
    } catch {
      /* the field just stays as it was */
    } finally {
      setBusy(false);
    }
  };

  // Debounced live search while typing.
  useEffect(() => {
    if (!q.trim()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => fetchShots(q), 650);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 12 });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchShots(q)}
            placeholder="Type the thing you dream of. Bread. A barbershop. Anything."
            aria-label="Type an idea to see real photographs of it"
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
          {STARTERS.slice(0, 3).map((s) => (
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

      {shots.length > 0 && (
        <div
          ref={scene}
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative mt-10 h-[340px] sm:h-[400px]"
          style={{ perspective: 1200 }}
        >
          <p className="absolute -top-2 left-0 label z-10">
            Real photographs of {shown} · live from the open web
          </p>
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {shots.map((s, i) => {
              const seat = SEATS[i % SEATS.length];
              return (
                <a
                  key={s.id}
                  href={s.source || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${s.title} — ${s.creator}`}
                  className="absolute block w-[32%] sm:w-[24%] rounded-xl overflow-hidden bg-[#101A2C] border border-white/15 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] hover:!scale-105 transition-transform duration-300"
                  style={{
                    left: `${50 + seat.x}%`,
                    top: `${44 + seat.y}%`,
                    transform: `translate(-50%, -50%) translateZ(${seat.z}px) rotate(${seat.r}deg)`,
                    animation: `ideain 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms both`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.thumb}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-32 sm:h-40 object-cover block"
                  />
                  <span className="block bg-[#0B1322]/90 px-2.5 py-1.5 text-[10px] text-ink-mute truncate">
                    {s.creator}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
