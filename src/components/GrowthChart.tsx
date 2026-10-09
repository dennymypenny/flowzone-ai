"use client";
import { useEffect, useRef, useState } from "react";

/**
 * The CardsRG Instagram results, drawn so the line climbs when you reach it.
 *
 * Visible by default (see feedback on CSS that hid content in production):
 * the server renders the finished chart and full numbers. Only after JS has an
 * IntersectionObserver ready does it rewind to zero and wait to be scrolled to.
 *
 * The daily line is traced from the real Insights screenshot (Jul 10 to Oct 7),
 * 150 samples across the window, values in daily views.
 */

const DAILY = [
  991, 885, 885, 991, 1098, 1098, 1523, 2056, 2162, 1736, 1311, 1204, 1098, 885, 991, 1204, 1311, 1311, 1311,
  1311, 1311, 991, 778, 778, 778, 885, 1098, 1204, 1311, 1311, 1098, 885, 885, 1098, 1417, 1417, 1311, 1949,
  2268, 2375, 2375, 2056, 1417, 1098, 991, 1311, 1843, 2375, 2694, 2801, 2907, 2907, 2801, 2375, 1523, 2801, 4290,
  4397, 3971, 6738, 11953, 15784, 15890, 15465, 8228, 4078, 3971, 2801, 2907, 2907, 2694, 2481, 1736, 1630, 1843, 2056,
  2056, 2162, 2907, 3013, 2375, 1098, 1204, 1311, 1523, 1736, 1630, 1417, 1098, 991, 4078, 9505, 24830, 36430, 36536,
  36324, 21318, 8228, 6419, 6632, 6419, 5993, 5780, 5567, 4716, 3758, 2907, 2481, 2588, 2801, 2694, 2588, 2375, 2268,
  1949, 2162, 2375, 2268, 2268, 1843, 1204, 1417, 1843, 1843, 2162, 3013, 3333, 3120, 2481, 2056, 1949, 2056, 2268,
  2375, 2056, 1204, 1417, 1417, 991, 991, 991, 1098, 1417, 1630, 1523, 1523, 1311, 1204, 1311, 1417,
];

const STATS = [
  { n: 407555, k: "Views", c: "#A8C4FF", pre: "" },
  { n: 103707, k: "Viewers", c: "#5B8CFF", pre: "" },
  { n: 13741, k: "Interactions", c: "#C6E4F8", pre: "" },
  { n: 1162, k: "Net new followers", c: "#34D399", pre: "+" },
];

const SPLIT = [
  { k: "Reels", v: 330, c: "#5B8CFF" },
  { k: "Posts", v: 46, c: "#A8C4FF" },
  { k: "Stories", v: 31, c: "#C6E4F8" },
];

const W = 640;
const H = 170;
const TOP = 22;
const MAX = 37000;

function buildPath(data: number[]) {
  return data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - 4 - (v / MAX) * (H - 4 - TOP);
      return `${i ? "L" : "M"} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const LINE = buildPath(DAILY);
const AREA = `${LINE} L ${W},${H} L 0,${H} Z`;
const PEAK_I = DAILY.indexOf(Math.max(...DAILY));
const PEAK_X = (PEAK_I / (DAILY.length - 1)) * W;
const PEAK_Y = H - 4 - (DAILY[PEAK_I] / MAX) * (H - 4 - TOP);

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function GrowthChart() {
  const root = useRef<HTMLDivElement>(null);
  // 1 = finished. Server render and no-JS both get the finished chart.
  const [p, setP] = useState(1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    // Already on screen: leave it drawn, nothing should flicker.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;

    setP(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const dur = 2200;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          setP(t);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const e = ease(p);
  const peakOn = p >= (PEAK_I / DAILY.length) * 0.95;

  return (
    <div ref={root}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 mb-10">
        {STATS.map((m) => (
          <div key={m.k}>
            <p className="font-display text-[28px] sm:text-3xl xl:text-[40px] leading-none tabular-nums" style={{ color: m.c }}>
              {m.pre}
              {fmt(m.n * e)}
            </p>
            <p className="label mt-2">{m.k}</p>
          </div>
        ))}
      </div>

      <div className="panel p-5 md:p-6">
        <div className="flex items-baseline justify-between mb-3">
          <p className="label">Daily views</p>
          <p className="label" style={{ opacity: peakOn ? 1 : 0, transition: "opacity .4s" }}>
            Peak · 37K in one day
          </p>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[150px] md:h-[200px] block overflow-visible"
          preserveAspectRatio="none"
          role="img"
          aria-label="Daily Instagram views from July 10 to October 7: around one to two thousand a day, a spike to sixteen thousand in mid August, then a spike to thirty-seven thousand in early September, settling at two to three thousand after"
        >
          <defs>
            <linearGradient id="crgGrowLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7E9FD8" />
              <stop offset="55%" stopColor="#C6E4F8" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="crgGrowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6E4F8" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C6E4F8" stopOpacity="0" />
            </linearGradient>
            <clipPath id="crgGrowClip">
              <rect x="0" y="-20" width={W * p} height={H + 40} />
            </clipPath>
          </defs>
          {[0.5, 1].map((g) => (
            <line
              key={g}
              x1="0"
              x2={W}
              y1={H - 4 - g * (H - 4 - TOP)}
              y2={H - 4 - g * (H - 4 - TOP)}
              stroke="currentColor"
              strokeOpacity="0.12"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <g clipPath="url(#crgGrowClip)">
            <path d={AREA} fill="url(#crgGrowFill)" />
            <path
              d={LINE}
              fill="none"
              stroke="url(#crgGrowLine)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <circle
            cx={PEAK_X}
            cy={PEAK_Y}
            r="5"
            fill="#FFFFFF"
            style={{ opacity: peakOn ? 1 : 0, transition: "opacity .4s" }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="flex justify-between mt-3">
          <span className="label">Jul 10</span>
          <span className="label">Aug 23</span>
          <span className="label">Oct 7</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mt-6">
        {SPLIT.map((b) => (
          <div key={b.k}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-sm text-ink">{b.k}</p>
              <p className="text-sm tabular-nums" style={{ color: b.c }}>
                {Math.round(b.v * e)}K views
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-rule overflow-hidden">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(b.v / 330) * 100 * e}%`, background: b.c }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
