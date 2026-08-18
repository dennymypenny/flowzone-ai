"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
 *
 * Everything here is fill rate. A phone GPU can clear a full screen or it
 * can paint a full screen gradient, but not both twice a frame at retina
 * density. So on touch devices the canvas runs at a lower pixel ratio, the
 * glow is painted only inside its own circle, the streaks go out in twenty
 * batched paths instead of two hundred and forty, and the loop holds a
 * steady 30. Motion is scaled by real elapsed time so half the frames still
 * covers the same distance at the same speed.
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

/**
 * The options you can grab on the way in.
 *
 * These were a bakery, a sneaker shop and a flower stand, which is a fun list
 * and the wrong one. The people who land here are running or about to run a
 * real thing, and mostly a service business with a van, a chair or a camera
 * rather than a shopfront. If somebody does not see themselves in six words
 * they type their own, and most do not bother. So these are the six that
 * cover the most of them.
 */
const GATES = [
  { icon: "hammer", label: "a trade business" },
  { icon: "scissors", label: "a barber or salon" },
  { icon: "truck", label: "a food business" },
  { icon: "dumbbell", label: "a coach or trainer" },
  { icon: "palette", label: "a creative service" },
  { icon: "box", label: "a shop or a brand" },
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

/** Depth bands. Alpha and line width come from the band, not the star, so all
    the streaks at one depth in one colour go out as a single path. */
const BANDS = 4;

/** A phone is a phone whether it is narrow or just touch only. */
const LITE_QUERY = "(hover: none), (max-width: 767px)";

type Star = { a: number; ca: number; sa: number; r: number; s: number; ci: number };
type Thought = { a: number; r: number; s: number; w: string };
type Audio = { ctx: AudioContext; gain: GainNode; filter: BiquadFilterNode };

export default function FlowRide({ className = "" }: { className?: string }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [riding, setRiding] = useState(false);
  const [cruise, setCruise] = useState(false);
  const [act, setAct] = useState<"idea" | "feel">("idea");
  const [typed, setTyped] = useState("");
  const [lite, setLite] = useState(false);
  const grabbedIdea = useRef("");
  const boosting = useRef(false);
  const alive = useRef(false);
  const audio = useRef<Audio | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const raf = useRef(0);
  const timers = useRef<number[]>([]);

  /* Every timer the ride starts goes in here. Leaving early used to leave a
     handful of them running, so state landed on a screen that was gone. */
  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  useEffect(() => {
    // Matched once on the client so the server render and the first paint agree.
    setLite(typeof window.matchMedia === "function" && window.matchMedia(LITE_QUERY).matches);

    /* /start is a big route and it used to be fetched at the moment of the
       click, so a phone spent the first second of the warp parsing it. The
       worst frame of the whole ride was that one. Now it is pulled in while
       the page is idle, long before anybody presses anything. */
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, o?: { timeout: number }) => number)
      | undefined;
    let id = 0;
    const pull = () => router.prefetch("/start");
    if (ric) id = ric(pull, { timeout: 3000 });
    else id = window.setTimeout(pull, 1500);
    return () => {
      const cic = (window as any).cancelIdleCallback as ((h: number) => void) | undefined;
      if (ric && cic) cic(id);
      else window.clearTimeout(id);
    };
  }, [router]);

  /** The thinking sound: filtered wind, made from nothing, no file. */
  const startSound = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx: AudioContext = new AC();
      // iOS hands back a suspended context and only a real gesture can wake it,
      // so resume happens here inside the click and never later.
      try {
        const woke = ctx.resume?.();
        if (woke && typeof woke.catch === "function") woke.catch(() => {});
      } catch {
        /* a refused context must never stop the ride */
      }

      const gain = ctx.createGain();
      gain.gain.value = 0;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 320;
      filter.connect(gain);
      gain.connect(ctx.destination);
      audio.current = { ctx, gain, filter };

      /* Filling the noise buffer is tens of thousands of iterations of main
         thread maths. It used to run before the first frame, which is exactly
         where a phone cannot afford it, so it waits until the warp is moving.
         If it never runs the ride is silent and otherwise identical. */
      after(() => {
        const a = audio.current;
        if (!a || !alive.current) return;
        try {
          const len = Math.floor(a.ctx.sampleRate * 1.2);
          const buf = a.ctx.createBuffer(1, len, a.ctx.sampleRate);
          const data = buf.getChannelData(0);
          let last = 0;
          for (let i = 0; i < len; i++) {
            // brown-ish noise: deep and airy rather than hissy
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            data[i] = last * 3.2;
          }
          // Brown noise wanders, so the loop point clicks unless the ends meet.
          const drift = (data[len - 1] - data[0]) / (len - 1);
          for (let i = 0; i < len; i++) data[i] -= drift * i;

          const src = a.ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.connect(a.filter);
          src.start();
          a.gain.gain.setValueAtTime(0.0001, a.ctx.currentTime);
          a.gain.gain.linearRampToValueAtTime(0.16, a.ctx.currentTime + 1.2);
        } catch {
          /* silence is acceptable */
        }
      }, 250);
    } catch {
      /* silence is acceptable */
    }
  }, [after]);

  /** Close the context for good and let go of every node hanging off it. */
  const killSound = useCallback((fade: number) => {
    const a = audio.current;
    audio.current = null;
    if (!a) return;
    try {
      a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
      a.gain.gain.setValueAtTime(a.gain.gain.value, a.ctx.currentTime);
      a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + fade);
    } catch {
      /* fine */
    }
    window.setTimeout(() => {
      try {
        a.ctx.close();
      } catch {
        /* fine */
      }
    }, fade * 1000 + 100);
  }, []);

  /** A soft ping when a thought is grabbed. */
  const ping = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    try {
      const t = a.ctx.currentTime;
      const o = a.ctx.createOscillator();
      const g = a.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(740, t);
      o.frequency.exponentialRampToValueAtTime(1180, t + 0.18);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.connect(g);
      g.connect(a.ctx.destination);
      // Safari holds on to connected nodes long after they stop, so cut them free.
      o.onended = () => {
        try {
          o.disconnect();
          g.disconnect();
        } catch {
          /* fine */
        }
      };
      o.start(t);
      o.stop(t + 0.55);
    } catch {
      /* fine */
    }
  }, []);

  /** Boost leans the wind up; landing fades everything out. */
  const soundBoost = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    // Handed over now, so leaving mid boost cannot close it twice.
    audio.current = null;
    try {
      const t = a.ctx.currentTime;
      a.filter.frequency.linearRampToValueAtTime(1400, t + 1.2);
      a.gain.gain.linearRampToValueAtTime(0.24, t + 0.8);
      a.gain.gain.linearRampToValueAtTime(0, t + 1.7);
    } catch {
      /* fine */
    }
    // Not tracked with the ride timers: this one has to outlive the ride.
    window.setTimeout(() => {
      try {
        a.ctx.close();
      } catch {
        /* fine */
      }
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      alive.current = false;
      cancelAnimationFrame(raf.current);
      clearTimers();
      killSound(0);
    };
  }, [clearTimers, killSound]);

  /* The single most expensive thing about the ride turned out to be the page
     underneath it. The homepage keeps every ambient animation running for the
     whole seventeen seconds, behind an opaque canvas nobody can see through,
     and on a throttled phone that alone eats a frame's entire budget. Nothing
     is hidden and nothing moves, it just stops animating until the ride ends. */
  useEffect(() => {
    if (!riding) return;
    document.body.classList.add("flowride-on");
    return () => document.body.classList.remove("flowride-on");
  }, [riding]);

  /* Backgrounding the ride used to leave the wind blowing in a tab nobody is
     looking at, and on iOS that keeps the audio session open. */
  useEffect(() => {
    if (!riding) return;
    const onHide = () => {
      if (document.visibilityState === "hidden") killSound(0.2);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [riding, killSound]);

  /** Act one: a thought is grabbed. It leads on, not out. */
  const grabIdea = (idea: string) => {
    const clean = idea.trim();
    if (!clean) return;
    grabbedIdea.current = clean;
    setTyped("");
    ping();
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
    ping();
    soundBoost();
    boosting.current = true;
  };

  const land = () => {
    soundBoost();
    boosting.current = true;
  };

  /**
   * Leave now, land where the ride was going anyway.
   *
   * The overlay used to sit over the whole page for up to seventeen seconds
   * with no way out and no way back to the keyboard. Escape and the skip
   * button both come here.
   */
  const exitRide = useCallback(() => {
    alive.current = false;
    boosting.current = false;
    cancelAnimationFrame(raf.current);
    clearTimers();
    killSound(0.3);
    setRiding(false);
    setCruise(false);
    router.push("/start");
  }, [router, clearTimers, killSound]);

  /* While the overlay is up it owns the keyboard. Escape gets out, and Tab
     cycles inside it instead of wandering into the page underneath. */
  useEffect(() => {
    if (!riding) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitRide();
        return;
      }
      if (e.key !== "Tab") return;
      const node = overlayRef.current;
      if (!node) return;
      const stops = Array.from(
        node.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? node.contains(active) : false;
      if (e.shiftKey && (!inside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [riding, exitRide]);

  const go = () => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push("/start");
      return;
    }
    router.prefetch("/start");
    clearTimers();
    setRiding(true);
    setCruise(false);
    setAct("idea");
    setTyped("");
    grabbedIdea.current = "";
    boosting.current = false;
    alive.current = true;
    startSound();

    window.requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const c = canvas?.getContext("2d");
      if (!canvas || !c) {
        router.push("/start");
        return;
      }
      const small = typeof window.matchMedia === "function" && window.matchMedia(LITE_QUERY).matches;
      /* A phone at device pixel ratio 3 is painting nine times the pixels of a
         phone at 1. The warp is soft light and moving fast, so nobody can see
         the difference, and it is the single biggest lever there is. */
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(cx, cy);

      const COUNT = small ? 110 : 240;
      /* A stable 30 reads better than a stuttering 45, and it halves every full
         screen fill. Desktop keeps whatever the display gives it.
         The gate is well under a thirtieth of a second on purpose. At a full 60
         it still draws every other frame, but when the phone is already only
         managing 30 it draws every frame instead of halving again to 15. */
      const budget = small ? 1000 / 30 - 10 : 0;

      const stars: Star[] = Array.from({ length: COUNT }, () => {
        const a = Math.random() * Math.PI * 2;
        return {
          a,
          ca: Math.cos(a),
          sa: Math.sin(a),
          r: 20 + Math.random() * maxR,
          s: 0.5 + Math.random() * 1.4,
          ci: (Math.random() * COLORS.length) | 0,
        };
      });
      const thoughts: Thought[] = DRIFT_WORDS.map((wd, i) => ({
        a: (i / DRIFT_WORDS.length) * Math.PI * 2 + Math.random() * 0.5,
        r: 40 + Math.random() * (maxR * 0.5),
        s: 0.7 + Math.random() * 0.6,
        w: wd,
      }));

      /* Scratch space allocated once. The loop must not create garbage or the
         collector shows up mid warp and eats a frame. */
      const seg = new Float32Array(COUNT * 4);
      const slots = COLORS.length * BANDS;
      const bucket: Int32Array[] = Array.from({ length: slots }, () => new Int32Array(COUNT));
      const bucketN = new Int32Array(slots);
      const fonts = new Map<number, string>();
      let lastFont = "";

      const LAUNCH = 1100;
      const CRUISE_MAX = 16000; // generous: two acts of choosing before auto-boost
      const BOOST = 1300;
      const t0 = performance.now();
      let boostT0 = 0;
      let prev = t0;
      let drew = -1e9;
      c.fillStyle = "#0C1424";
      c.fillRect(0, 0, w, h);
      c.lineCap = "round";
      c.textAlign = "center";
      after(() => setCruise(true), LAUNCH);

      const tick = (now: number) => {
        if (!alive.current) return;
        raf.current = window.requestAnimationFrame(tick);
        if (now - drew < budget) return;

        /* Distance travelled comes from wall clock, not from frame count, so
           30fps and 60fps cover the same ground at the same speed. */
        const k = Math.min(4, Math.max(0.2, (now - prev) / 16.667));
        prev = now;
        drew = now;
        const t = now - t0;

        // ramp into boost when grabbed, or when patience runs out
        if (!boostT0 && (boosting.current || t > LAUNCH + CRUISE_MAX)) {
          boostT0 = now;
          setCruise(false);
        }
        const bp = boostT0 ? Math.min(1, (now - boostT0) / BOOST) : 0;

        // launch ramps up, cruise floats, boost floors it
        const launch = Math.min(1, t / LAUNCH);
        const v = 1.004 + launch * 0.014 + bp * bp * 0.13;
        const vk = Math.pow(v, k);
        const push = 0.25 + launch * 0.9 + bp * 3.4;

        // Trail length is a fade per frame, so it has to follow frame length too.
        const fade = 1 - Math.pow(1 - (0.34 - bp * 0.08), k);
        c.globalAlpha = 1;
        c.fillStyle = `rgba(12, 20, 36, ${fade.toFixed(3)})`;
        c.fillRect(0, 0, w, h);

        bucketN.fill(0);
        for (let i = 0; i < COUNT; i++) {
          const st = stars[i];
          const r0 = st.r;
          st.r = st.r * vk + st.s * push * k;
          const j = i * 4;
          seg[j] = cx + st.ca * r0;
          seg[j + 1] = cy + st.sa * r0;
          seg[j + 2] = cx + st.ca * st.r;
          seg[j + 3] = cy + st.sa * st.r;
          const d = Math.min(0.999, st.r / maxR);
          const b = st.ci * BANDS + ((d * BANDS) | 0);
          bucket[b][bucketN[b]++] = i;
          if (st.r > maxR + 40) {
            st.r = 10 + Math.random() * 60;
            st.a = Math.random() * Math.PI * 2;
            st.ca = Math.cos(st.a);
            st.sa = Math.sin(st.a);
          }
        }

        /* Two hundred and forty stroke calls became twenty. Same streaks, one
           path per colour per depth band. */
        for (let b = 0; b < slots; b++) {
          const n = bucketN[b];
          if (!n) continue;
          const d = ((b % BANDS) + 0.5) / BANDS;
          c.strokeStyle = COLORS[(b / BANDS) | 0];
          c.globalAlpha = Math.min(0.9, 0.22 + d * 0.75);
          c.lineWidth = 0.8 + d * (1.6 + bp * 1.6);
          c.beginPath();
          const list = bucket[b];
          for (let m = 0; m < n; m++) {
            const j = list[m] * 4;
            c.moveTo(seg[j], seg[j + 1]);
            c.lineTo(seg[j + 2], seg[j + 3]);
          }
          c.stroke();
        }

        c.fillStyle = "#DCE8FA";
        for (const th of thoughts) {
          th.r = th.r * (vk + 0.003 * k);
          const x = cx + Math.cos(th.a) * th.r;
          const y = cy + Math.sin(th.a) * th.r;
          const near = Math.min(1, th.r / (maxR * 0.75));
          c.globalAlpha = Math.max(0, Math.min(0.7, near * 0.9 - 0.05)) * (1 - bp * 0.5);
          // Setting c.font reparses the shorthand every time, so sizes are reused.
          const size = Math.round(12 + near * 26 * th.s);
          let f = fonts.get(size);
          if (!f) {
            f = `300 ${size}px Figtree, system-ui, sans-serif`;
            fonts.set(size, f);
          }
          if (f !== lastFont) {
            c.font = f;
            lastFont = f;
          }
          c.fillText(th.w, x, y);
          if (th.r > maxR + 80) {
            th.r = 30 + Math.random() * 80;
            th.a = Math.random() * Math.PI * 2;
            th.w = DRIFT_WORDS[(Math.random() * DRIFT_WORDS.length) | 0];
          }
        }
        c.globalAlpha = 1;

        /* The glow used to be a full screen gradient fill every frame, which on
           a phone costs about as much as the rest of the ride put together. It
           is transparent past its own radius, so now only that square is painted
           and for most of the ride that square is a fraction of the screen. */
        const gr = 70 + launch * 80 + bp * 320;
        const glow = c.createRadialGradient(cx, cy, 0, cx, cy, gr);
        glow.addColorStop(0, `rgba(198, 228, 248, ${(0.1 + launch * 0.1 + bp * 0.8).toFixed(3)})`);
        glow.addColorStop(0.5, `rgba(91, 155, 249, ${(0.05 + bp * 0.4).toFixed(3)})`);
        glow.addColorStop(1, "rgba(12, 20, 36, 0)");
        c.fillStyle = glow;
        const gx = Math.max(0, cx - gr);
        const gy = Math.max(0, cy - gr);
        c.fillRect(gx, gy, Math.min(w, cx + gr) - gx, Math.min(h, cy + gr) - gy);

        if (boostT0 && bp >= 1) {
          alive.current = false;
          cancelAnimationFrame(raf.current);
          try {
            window.sessionStorage.setItem("flowzone.ride.arrived", "1");
          } catch {
            /* ignore */
          }
          router.push("/start");
          after(() => setRiding(false), 900);
        }
      };
      raf.current = window.requestAnimationFrame(tick);
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
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Riding into Flow Mode"
          data-flowride
          className="fixed inset-0 z-[90]"
        >
          {/* Two rules. One stops the page underneath animating while the ride
              owns the screen, and one hands the ride its own animations back.
              The second is the more specific of the two, so it wins.
              The shipped gate animation also blurs six elements for the first
              second and three quarters, and a CSS blur over a live canvas
              repaints the lot every frame, so touch devices arrive without it. */}
          <style>{`body.flowride-on *{animation-play-state:paused!important}body.flowride-on [data-flowride],body.flowride-on [data-flowride] *{animation-play-state:running!important}@keyframes gateinlite{0%{opacity:0;transform:translate(-50%,-50%) scale(0.25)}35%{opacity:1}100%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}`}</style>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />

          <button
            ref={closeRef}
            type="button"
            onClick={exitRide}
            className="absolute top-4 right-4 z-10 chip !text-[13px] !normal-case !tracking-normal hover:!border-accent"
          >
            Skip the ride
          </button>

          {cruise && (
            <div className="absolute inset-0" key={act}>
              <p
                className="absolute left-1/2 -translate-x-1/2 top-[12%] label !text-ink-soft"
                style={{ animation: "ideain 0.8s cubic-bezier(0.22,1,0.36,1) both", willChange: "transform, opacity" }}
              >
                {act === "idea" ? "Grab a thought on the way in" : `Okay, ${grabbedIdea.current}. How should it feel?`}
              </p>

              {(act === "idea" ? GATES : FEELS).map((g, i) => {
                const seat = SEATS[i % SEATS.length];
                return (
                  <button
                    key={g.label}
                    onClick={() => (act === "idea" ? grabIdea(g.label) : grabFeel(g.label))}
                    className="absolute -translate-x-1/2 -translate-y-1/2 chip !text-[13px] !normal-case !tracking-normal hover:!border-accent hover:scale-110 transition-transform"
                    style={{
                      left: `${seat.x}%`,
                      top: `${seat.y}%`,
                      animation: `${lite ? "gateinlite" : "gatein"} 5s cubic-bezier(0.16, 1, 0.3, 1) ${seat.d}ms both`,
                      /* Six pills scaling for five seconds over a live canvas.
                         Without this they repaint their gradient and their
                         rounded border on every one of those frames. */
                      willChange: "transform, opacity",
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
                  /* No backdrop blur here. Blurring what is behind a box means
                     reading the canvas back every single frame it moves. */
                  className="absolute left-1/2 -translate-x-1/2 bottom-[18%] w-[82%] max-w-md text-center bg-paper-deep/90 text-ink placeholder-ink-mute border border-rule px-5 py-3 text-sm font-light outline-none focus:border-accent transition-colors"
                  style={{ animation: "ideain 1s cubic-bezier(0.22,1,0.36,1) 600ms both", willChange: "transform, opacity" }}
                />
              )}

              <button
                onClick={() => (act === "idea" ? land() : grabFeel())}
                className="absolute left-1/2 -translate-x-1/2 bottom-[9%] text-xs text-ink-mute hover:text-ink transition-colors"
                style={{ animation: "ideain 1s cubic-bezier(0.22,1,0.36,1) 800ms both", willChange: "transform, opacity" }}
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
