"use client";
import { useEffect, useRef } from "react";

/**
 * The homepage intro reel, replayed when a ticket is sent (Oct 9 2026).
 *
 * Same board and the same render(t) as Intro.tsx's live fallback, driven from
 * React instead of the head script, with the tagline swapped to "Ticket sent."
 * It plays while the request is in flight, so the wait becomes the reel:
 *
 *   0 to 1.9s   dots pop, lines draw, FlowZone wipes in, tagline lands
 *   hold 1.9s   if the server has not answered yet, the lockup waits here
 *   1.9 to 2.5s it exits left to right and the overlay fades to the thank you
 *
 * `settled` flips when the fetch is done (either way). `onDone` fires once the
 * exit is over. `failed` fades it out at once, no exit. A hard cap of 12s always calls onDone, so nothing can ever
 * leave the page covered. Reduced motion skips straight to onDone.
 */
export default function SendReel({ settled, failed, onDone }: { settled: boolean; failed: boolean; onDone: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const settledRef = useRef(settled);
  settledRef.current = settled;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const failRef = useRef<() => void>(() => {});

  // A failed send does not get the victory lap: fade out now and show the error.
  useEffect(() => {
    if (failed) failRef.current();
  }, [failed]);

  useEffect(() => {
    const root = box.current;
    if (!root) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.add("fz-sendreel-out");
      setTimeout(() => doneRef.current(), 450);
    };
    failRef.current = finish;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // No reel, but still wait for the answer before leaving.
        const wait = setInterval(() => {
          if (settledRef.current) {
            clearInterval(wait);
            doneRef.current();
          }
        }, 50);
        return () => clearInterval(wait);
      }
    } catch {
      /* old browser, play the reel */
    }

    const st = root.querySelector<HTMLElement>(".fzi-stage")!;
    const q = (c: string) => st.querySelector(c) as HTMLElement & SVGElement;
    const P = innerHeight > innerWidth;
    if (P) {
      st.classList.add("fzi-p");
      q(".fzi-tag").innerHTML = "<b>Ticket sent.</b><br>We get it <i>moving.</i>";
    }
    const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
    const eo = (x: number) => 1 - Math.pow(1 - x, 3);
    const eb = (x: number) => 1 - Math.pow(1 - x, 4);
    const back = (x: number) => {
      const c = 1.9;
      return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
    };
    const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

    const render = (t: number) => {
      const W = P ? 1080 : 1920;
      const H = P ? 1920 : 1080;
      const markH = P ? 150 : 96;
      const lock = q(".fzi-lockup");
      const name = q(".fzi-name");
      const clip = q(".fzi-clip");
      const tag = q(".fzi-tag");
      const amb = eo(seg(t, 0, 0.6)) * (1 - seg(t, 2.1, 2.5));
      q(".fzi-glow").style.background = `radial-gradient(${P ? "70% 45%" : "55% 60%"} at ${lerp(38, 52, seg(t, 0, 2.5))}% 50%, rgba(76,123,232,${0.1 * amb}) 0%, rgba(76,123,232,0) 70%)`;
      const bw = eo(seg(t, 0, 0.55));
      const br = eo(seg(t, 2.1, 2.45));
      const bar = q(".fzi-bar");
      bar.style.left = `${br * 100}%`;
      bar.style.width = `${(1 - br) * 100 * bw}%`;
      [0.08, 0.2, 0.32].forEach((a, i) => {
        const p = seg(t, a, a + 0.34);
        const s = p <= 0 ? 0 : back(p);
        const cx = [6, 29, 52][i];
        q(`.fzi-d${i + 1}`).setAttribute("transform", `translate(${cx} 9) scale(${s}) translate(${-cx} -9)`);
      });
      const c1 = eo(seg(t, 0.24, 0.46));
      const c2 = eo(seg(t, 0.36, 0.58));
      q(".fzi-l1").setAttribute("x2", String(lerp(10.5, 23.5, c1)));
      q(".fzi-l2").setAttribute("x2", String(lerp(34.5, 46.5, c2)));
      const nr = eb(seg(t, 0.55, 1.1));
      const nw = name.offsetWidth;
      const ex = Math.pow(seg(t, 2, 2.5), 2.4);
      const dx = ex * W * 0.12;
      const fade = 1 - eo(seg(t, 2.05, 2.45));
      let tr: string;
      if (P) {
        clip.style.width = `${nw}px`;
        clip.style.clipPath = `inset(0 ${(1 - nr) * 100}% 0 0)`;
        name.style.transform = `translateX(${(1 - nr) * -40}px)`;
        const lift = eb(seg(t, 0.52, 1.05));
        const full = lock.offsetHeight;
        tr = `translate(-50%,${lerp((full - markH) / 2, 0, lift) - full / 2 - 90}px)`;
      } else {
        clip.style.width = `${nw * nr}px`;
        name.style.transform = `translateX(${(1 - nr) * -60}px)`;
        lock.style.gap = `${markH * 0.42 * nr}px`;
        tr = "translate(-50%, calc(-50% - 62px))";
      }
      name.style.opacity = nr > 0 ? "1" : "0";
      lock.style.transform = `${tr} translateX(${dx}px)`;
      lock.style.opacity = String(fade);
      const tg = eb(seg(t, 0.95, 1.4));
      tag.style.top = `${H / 2 + (P ? 190 : 40)}px`;
      tag.style.opacity = String(tg * fade);
      tag.style.transform = `translate(calc(-50% + ${(1 - tg) * -50}px),0) translateX(${dx * 1.15}px)`;
    };

    const fit = () => {
      const W = P ? 1080 : 1920;
      const H = P ? 1920 : 1080;
      const s = Math.max(innerWidth / W, innerHeight / H);
      st.style.width = `${W}px`;
      st.style.height = `${H}px`;
      st.style.transform = `translate(-50%,-50%) scale(${s})`;
    };
    fit();
    render(0);

    const HOLD = 1.9;
    let raf = 0;
    let last: number | null = null;
    let t = 0;
    const frame = (now: number) => {
      if (last === null) last = now;
      const dt = (now - last) / 1000;
      last = now;
      // Hold the full lockup until the server answers, then play the exit.
      t = t < HOLD || settledRef.current ? t + dt : HOLD;
      render(Math.min(t, 2.5));
      if (t >= 2.05) finish();
      if (t < 2.6) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const cap = setTimeout(finish, 12000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cap);
    };
  }, []);

  return (
    <div ref={box} className="fz-sendreel" role="status" aria-label="Sending your ticket">
      <div className="fzi-stage" aria-hidden="true">
        <div className="fzi-glow" />
        <div className="fzi-bar" />
        <div className="fzi-lockup">
          <svg className="fzi-mark" viewBox="0 0 58 18" overflow="visible">
            <line className="fzi-l1" x1="10.5" y1="9" x2="10.5" y2="9" stroke="#DDEEFB" strokeWidth="1.2" />
            <line className="fzi-l2" x1="34.5" y1="9" x2="34.5" y2="9" stroke="#DDEEFB" strokeWidth="1.2" />
            <circle className="fzi-d1" cx="6" cy="9" r="5.6" fill="#1E3A8A" stroke="#4C7BE8" strokeWidth="0.5" transform="scale(0)" />
            <circle className="fzi-d2" cx="29" cy="9" r="5.6" fill="#5B9BF9" transform="scale(0)" />
            <circle className="fzi-d3" cx="52" cy="9" r="5.6" fill="#C6E4F8" transform="scale(0)" />
          </svg>
          <span className="fzi-clip">
            <span className="fzi-name">FlowZone</span>
          </span>
        </div>
        <div className="fzi-tag">
          <b>Ticket sent.</b> We get it <i>moving.</i>
        </div>
      </div>
    </div>
  );
}
