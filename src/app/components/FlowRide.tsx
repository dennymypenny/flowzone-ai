"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

/**
 * The ride into Flow Mode, first person, with stops.
 *
 * Click and you become the ball. Phase one: launch, the field starts
 * streaming. Phase two: cruise, and options float toward you out of the
 * dark, real starting points you can grab mid-flight. Grab one and you
 * boost: the field floors it, the light swallows the screen, and you
 * land in Flow Mode with that idea already loaded and searching. Ignore
 * them and after a while the ride boosts on its own, empty handed but
 * still moving. Reduced motion skips straight to /start.
 */

const COLORS = ["#1E3A8A", "#5B9BF9", "#C6E4F8", "#FFFFFF", "#5B8CFF"];
const DRIFT_WORDS = [
  "an idea",
  "a name",
  "a logo",
  "colours",
  "the words",
  "a video",
  "the brief",
  "a vibe",
  "go",
];

/** The options you can grab on the way in. */
const GATES = [
  { icon: "bread", label: "a bakery" },
  { icon: "scissors", label: "a barbershop" },
  { icon: "shoe", label: "a sneaker shop" },
  { icon: "dumbbell", label: "a gym" },
  { icon: "truck", label: "a taco truck" },
  { icon: "flower", label: "a flower stand" },
];

/** Act two: how it should feel. Colours the search on landing. */
const FEELS = [
  { icon: "flame", label: "warm" },
  { icon: "droplet", label: "clean" },
  { icon: "bolt", label: "bold" },
  { icon: "balloon", label: "playful" },
  { icon: "gem", label: "luxe" },
  { icon: "moon", label: "moody" },
];

/** Scattered seats so the gates feel spatial, not like a menu. */
const SEATS = [
  { x: 22, y: 30, d: 0 },
  { x: 74, y: 26, d: 400 },
  { x: 16, y: 66, d: 800 },
  { x: 80, y: 64, d: 1200 },
  { x: 34, y: 82, d: 1600 },
  { x: 60, y: 45, d: 2000 },
];

type Star = { a: number; r: number; s: number; c: string };
type Thought = { a: number; r: number; s: number; w: string };

export default function FlowRide({ className = "" }: { className?: string }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [riding, setRiding] = useState(false);
  const [cruise, setCruise] = useState(false);
  const [act, setAct] = useState<"idea" | "feel">("idea");
  const [typed, setTyped] = useState("");
  const grabbedIdea = useRef("");
  // speed lives in a ref so the render loop feels it instantly
  const boost = useRef(0); // 0 = cruising, ramps to 1 when boosting
  const boosting = useRef(false);
  const alive = useRef(false);

  useEffect(() => {
    return () => {
      alive.current = false;
    };
  }, []);

  /** Act one: a thought is grabbed. It leads on, not out. */
  const grabIdea = (idea: string) => {
    const clean = idea.trim();
    if (!clean) return;
    grabbedIdea.current = clean;
    setTyped("");
    setAct("feel");
  };

  /** Act two: the feel is grabbed, and now we boost. */
  const grabFeel = (feel?: string) => {
    const idea = grabbedIdea.current;
    if (idea) {
      try {
        window.sessionStorage.setItem(
          "flowzone.ride.idea",
          feel ? `${feel} ${idea.replace(/^(a|an|the|my)\s+/i, "")}` : idea
        );
      } catch {
        /* ignore */
      }
    }
    boosting.current = true;
  };

  const land = () => {
    boosting.current = true;
  };

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
    setCruise(false);
    setAct("idea");
    setTyped("");
    grabbedIdea.current = "";
    boost.current = 0;
    boosting.current = false;
    alive.current = true;

    window.requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const c = canvas?.getContext("2d");
      if (!canvas || !c) {
        router.push("/start");
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
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
      const thoughts: Thought[] = DRIFT_WORDS.map((wd, i) => ({
        a: (i / DRIFT_WORDS.length) * Math.PI * 2 + Math.random() * 0.5,
        r: 40 + Math.random() * (maxR * 0.5),
        s: 0.7 + Math.random() * 0.6,
        w: wd,
      }));

      const LAUNCH = 1100;
      const CRUISE_MAX = 16000; // generous: two acts of choosing before auto-boost
      const BOOST = 1300;
      const t0 = performance.now();
      let boostT0 = 0;
      c.fillStyle = "#0C1424";
      c.fillRect(0, 0, w, h);
      window.setTimeout(() => setCruise(true), LAUNCH);

      const tick = (now: number) => {
        if (!alive.current) return;
        const t = now - t0;

        // ramp into boost when grabbed, or when patience runs out
        if (!boostT0 && (boosting.current || t > LAUNCH + CRUISE_MAX)) {
          boostT0 = now;
          setCruise(false);
        }
        const bp = boostT0 ? Math.min(1, (now - boostT0) / BOOST) : 0;
        boost.current = bp;

        // launch ramps up, cruise floats, boost floors it
        const launch = Math.min(1, t / LAUNCH);
        const v = 1.004 + launch * 0.014 + bp * bp * 0.13;

        c.fillStyle = `rgba(12, 20, 36, ${0.34 - bp * 0.08})`;
        c.fillRect(0, 0, w, h);
        c.lineCap = "round";

        for (const st of stars) {
          const r0 = st.r;
          st.r = st.r * v + st.s * (0.25 + launch * 0.9 + bp * 3.4);
          const x0 = cx + Math.cos(st.a) * r0;
          const y0 = cy + Math.sin(st.a) * r0;
          const x1 = cx + Math.cos(st.a) * st.r;
          const y1 = cy + Math.sin(st.a) * st.r;
          c.strokeStyle = st.c;
          c.globalAlpha = Math.min(0.9, 0.22 + (st.r / maxR) * 0.75);
          c.lineWidth = 0.8 + (st.r / maxR) * (1.6 + bp * 1.6);
          c.beginPath();
          c.moveTo(x0, y0);
          c.lineTo(x1, y1);
          c.stroke();
          if (st.r > maxR + 40) {
            st.r = 10 + Math.random() * 60;
            st.a = Math.random() * Math.PI * 2;
          }
        }

        c.textAlign = "center";
        for (const th of thoughts) {
          th.r = th.r * (v + 0.003);
          const x = cx + Math.cos(th.a) * th.r;
          const y = cy + Math.sin(th.a) * th.r;
          const near = Math.min(1, th.r / (maxR * 0.75));
          c.globalAlpha = Math.max(0, Math.min(0.7, near * 0.9 - 0.05)) * (1 - bp * 0.5);
          c.fillStyle = "#DCE8FA";
          c.font = `300 ${Math.round(12 + near * 26 * th.s)}px Poppins, system-ui, sans-serif`;
          c.fillText(th.w, x, y);
          if (th.r > maxR + 80) {
            th.r = 30 + Math.random() * 80;
            th.a = Math.random() * Math.PI * 2;
            th.w = DRIFT_WORDS[(Math.random() * DRIFT_WORDS.length) | 0];
          }
        }
        c.globalAlpha = 1;

        const glow = c.createRadialGradient(cx, cy, 0, cx, cy, 70 + launch * 80 + bp * 320);
        glow.addColorStop(0, `rgba(198, 228, 248, ${0.1 + launch * 0.1 + bp * 0.8})`);
        glow.addColorStop(0.5, `rgba(91, 155, 249, ${0.05 + bp * 0.4})`);
        glow.addColorStop(1, "rgba(12, 20, 36, 0)");
        c.fillStyle = glow;
        c.fillRect(0, 0, w, h);

        if (boostT0 && bp >= 1) {
          alive.current = false;
          try {
            window.sessionStorage.setItem("flowzone.ride.arrived", "1");
          } catch {
            /* ignore */
          }
          router.push("/start");
          window.setTimeout(() => setRiding(false), 900);
          return;
        }
        window.requestAnimationFrame(tick);
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
        <div className="fixed inset-0 z-[90]" aria-hidden={!cruise}>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {cruise && (
            <div className="absolute inset-0" key={act}>
              <p
                className="absolute left-1/2 -translate-x-1/2 top-[12%] label !text-ink-soft"
                style={{ animation: "ideain 0.8s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                {act === "idea" ? "Grab a thought on the way in" : `Okay, ${grabbedIdea.current}. How should it feel?`}
              </p>

              {(act === "idea" ? GATES : FEELS).map((g, i) => {
                const seat = SEATS[i % SEATS.length];
                return (
                  <button
                    key={g.label}
                    onClick={() => (act === "idea" ? grabIdea(g.label) : grabFeel(g.label))}
                    className="absolute -translate-x-1/2 -translate-y-1/2 chip !text-[13px] !normal-case !tracking-normal hover:!border-accent hover:scale-110 transition-all"
                    style={{
                      left: `${seat.x}%`,
                      top: `${seat.y}%`,
                      animation: `gatein 5s cubic-bezier(0.16, 1, 0.3, 1) ${seat.d}ms both`,
                    }}
                  >
                    <Icon name={g.icon} size={15} color="#A8C4FF" /> {g.label}
                  </button>
                );
              })}

              {act === "idea" && (
                <input
                  autoFocus
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && grabIdea(typed)}
                  placeholder="or type your own and press enter..."
                  aria-label="Type your own idea mid-flight"
                  className="absolute left-1/2 -translate-x-1/2 bottom-[18%] w-[82%] max-w-md text-center bg-paper-deep/60 backdrop-blur text-ink placeholder-ink-mute border border-rule px-5 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                  style={{ animation: "ideain 1s cubic-bezier(0.22,1,0.36,1) 600ms both" }}
                />
              )}

              <button
                onClick={() => (act === "idea" ? land() : grabFeel())}
                className="absolute left-1/2 -translate-x-1/2 bottom-[9%] text-xs text-ink-mute hover:text-ink transition-colors"
                style={{ animation: "ideain 1s cubic-bezier(0.22,1,0.36,1) 800ms both" }}
              >
                Just fly →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
