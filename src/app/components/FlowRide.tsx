"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The ride into Flow Mode, first person.
 *
 * Click, and you become the ball. The screen goes full warp: you fly
 * forward through a field of thoughts, loose words and sparks of the
 * kind Flow Mode is made of, streaking past as you accelerate, until
 * the light washes over and you arrive at /start. About a second and
 * a half. Reduced motion skips straight there.
 */

const COLORS = ["#1E3A8A", "#5B9BF9", "#C6E4F8", "#FFFFFF", "#5B8CFF"];
const THOUGHTS = [
  "an idea",
  "a name",
  "a logo",
  "colours",
  "the words",
  "a shop",
  "a video",
  "the brief",
  "a vibe",
  "the feeling",
  "go",
];

type Star = { a: number; r: number; s: number; c: string };
type Thought = { a: number; r: number; s: number; w: string };

export default function FlowRide({ className = "" }: { className?: string }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [riding, setRiding] = useState(false);

  const go = () => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push("/start");
      return;
    }
    router.prefetch("/start");
    setRiding(true);

    // Let the overlay mount, then fly.
    window.requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        router.push("/start");
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const c = canvas.getContext("2d");
      if (!c) {
        router.push("/start");
        return;
      }
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(cx, cy);

      const stars: Star[] = Array.from({ length: 240 }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 20 + Math.random() * maxR,
        s: 0.5 + Math.random() * 1.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
      const thoughts: Thought[] = THOUGHTS.map((wd, i) => ({
        a: (i / THOUGHTS.length) * Math.PI * 2 + Math.random() * 0.5,
        r: 40 + Math.random() * (maxR * 0.5),
        s: 0.7 + Math.random() * 0.6,
        w: wd,
      }));

      const D = 1500;
      const t0 = performance.now();
      c.fillStyle = "#0C1424";
      c.fillRect(0, 0, w, h);

      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / D);
        // accelerate: gentle, then flooring it
        const v = 1.012 + p * p * 0.11;

        c.fillStyle = "rgba(12, 20, 36, 0.32)";
        c.fillRect(0, 0, w, h);
        c.lineCap = "round";

        for (const st of stars) {
          const r0 = st.r;
          st.r = st.r * v + st.s * (0.4 + p * 3);
          const x0 = cx + Math.cos(st.a) * r0;
          const y0 = cy + Math.sin(st.a) * r0;
          const x1 = cx + Math.cos(st.a) * st.r;
          const y1 = cy + Math.sin(st.a) * st.r;
          c.strokeStyle = st.c;
          c.globalAlpha = Math.min(0.9, 0.25 + (st.r / maxR) * 0.75);
          c.lineWidth = 0.8 + (st.r / maxR) * 2.6;
          c.beginPath();
          c.moveTo(x0, y0);
          c.lineTo(x1, y1);
          c.stroke();
          if (st.r > maxR + 40) {
            st.r = 10 + Math.random() * 60;
            st.a = Math.random() * Math.PI * 2;
          }
        }

        // thoughts drift past you
        c.textAlign = "center";
        for (const th of thoughts) {
          th.r = th.r * (v + 0.004);
          const x = cx + Math.cos(th.a) * th.r;
          const y = cy + Math.sin(th.a) * th.r;
          const near = Math.min(1, th.r / (maxR * 0.75));
          c.globalAlpha = Math.max(0, Math.min(0.85, near * 1.1 - 0.1)) * (1 - p * 0.4);
          c.fillStyle = "#DCE8FA";
          c.font = `300 ${Math.round(13 + near * 30 * th.s)}px Poppins, system-ui, sans-serif`;
          c.fillText(th.w, x, y);
          if (th.r > maxR + 80) {
            th.r = 30 + Math.random() * 80;
            th.a = Math.random() * Math.PI * 2;
            th.w = THOUGHTS[(Math.random() * THOUGHTS.length) | 0];
          }
        }
        c.globalAlpha = 1;

        // the light you are flying into
        const glow = c.createRadialGradient(cx, cy, 0, cx, cy, 90 + p * 260);
        glow.addColorStop(0, `rgba(198, 228, 248, ${0.15 + p * 0.85})`);
        glow.addColorStop(0.5, `rgba(91, 155, 249, ${0.08 + p * 0.4})`);
        glow.addColorStop(1, "rgba(12, 20, 36, 0)");
        c.fillStyle = glow;
        c.fillRect(0, 0, w, h);

        if (p < 1) {
          window.requestAnimationFrame(tick);
        } else {
          router.push("/start");
          window.setTimeout(() => setRiding(false), 900);
        }
      };
      window.requestAnimationFrame(tick);
    });
  };

  return (
    <>
      <button onClick={go} className={`btn-ghost group ${className}`}>
        <svg width="30" height="12" viewBox="0 0 58 18" fill="none" aria-hidden>
          <line x1="10.5" y1="9" x2="23.5" y2="9" stroke="#DDEEFB" strokeWidth="1.6" opacity="0.6" />
          <line x1="34.5" y1="9" x2="46.5" y2="9" stroke="#DDEEFB" strokeWidth="1.6" opacity="0.6" />
          <circle className="pulse-1" cx="6" cy="9" r="5.6" fill="#4C7BE8" style={{ transformOrigin: "6px 9px" }} />
          <circle className="pulse-2" cx="29" cy="9" r="5.6" fill="#5B9BF9" style={{ transformOrigin: "29px 9px" }} />
          <circle className="pulse-3" cx="52" cy="9" r="5.6" fill="#C6E4F8" style={{ transformOrigin: "52px 9px" }} />
        </svg>
        Ride into Flow Mode
        <span className="arrow">→</span>
      </button>

      {riding && (
        <div className="fixed inset-0 z-[90] pointer-events-none" aria-hidden>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      )}
    </>
  );
}
