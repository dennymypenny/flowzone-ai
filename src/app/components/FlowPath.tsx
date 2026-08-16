"use client";
import { useEffect, useState } from "react";

/**
 * The idea flowing along the mark.
 *
 * The logo is three connected dots. Flow Mode is three moves. This strip
 * pins them together: as the visitor moves down the page their idea
 * travels the same line the mark draws, dot by dot, left to right. The
 * connector charges with scroll so the progress IS the brand.
 */

const STOPS = [
  { id: "flow-idea", label: "The idea", color: "#1E3A8A" },
  { id: "flow-shape", label: "The shape", color: "#5B9BF9" },
  { id: "flow-keep", label: "Yours to keep", color: "#C6E4F8" },
];

export default function FlowPath() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const els = STOPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
      if (els.length < 2) return;
      const mid = window.innerHeight * 0.55;
      const first = els[0].getBoundingClientRect().top;
      const last = els[els.length - 1].getBoundingClientRect().top;
      const p = (mid - first) / Math.max(1, last - first);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sticky top-[61px] z-40 glassbar border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="relative flex items-center justify-between">
          {/* the line, and the charge that follows the visitor */}
          <div className="absolute left-3 right-3 top-[7px] h-px bg-rule" aria-hidden />
          <div
            className="absolute left-3 top-[7px] h-px transition-[width] duration-300"
            style={{
              width: `calc(${progress * 100}% - ${progress * 24}px)`,
              background: "linear-gradient(90deg, #1E3A8A, #5B9BF9, #C6E4F8)",
            }}
            aria-hidden
          />
          {STOPS.map((s, i) => {
            const lit = progress >= i / (STOPS.length - 1) - 0.08;
            return (
              <button
                key={s.id}
                onClick={() =>
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="relative flex flex-col items-center gap-1.5 group"
                aria-label={`Go to ${s.label}`}
              >
                <span
                  className="block w-3.5 h-3.5 rounded-full transition-all duration-500"
                  style={{
                    background: lit ? s.color : "#1D2942",
                    boxShadow: lit ? `0 0 12px ${s.color}88` : "none",
                    transform: lit ? "scale(1.15)" : "scale(1)",
                  }}
                />
                <span
                  className="text-[10px] font-medium uppercase tracking-label transition-colors duration-500 group-hover:text-ink"
                  style={{ color: lit ? "#F1F3F7" : "#647089" }}
                >
                  {i + 1} · {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
