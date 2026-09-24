"use client";

import { useEffect } from "react";

/* The 2.5s FlowZone intro on the homepage. Two 4K renders: 3840x2160 for
   desktop and 2160x3840 for phones, picked by the screen's shape.

   Whether it plays is decided by the head script in layout.tsx, which puts
   fz-intro-on on <html> before first paint (homepage only, once per visit,
   never for reduced motion, data saver or crawlers). The inline script
   below then starts the right file straight away, without waiting for
   React. This component only handles leaving: near the end, on tap, on
   Escape, on error, or if the video is slow to start. */

const SRC_DESKTOP = "/assets/flowzone-intro-desktop.mp4";
const SRC_PHONE = "/assets/flowzone-intro-phone.mp4";

const START = `(function(){try{var h=document.documentElement;if(!h.classList.contains('fz-intro-on'))return;var v=document.getElementById('fz-intro-v');if(!v)return;v.src=innerHeight>innerWidth?'${SRC_PHONE}':'${SRC_DESKTOP}';v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}})();`;

export default function Intro() {
  useEffect(() => {
    const h = document.documentElement;
    if (!h.classList.contains("fz-intro-on")) return;
    const v = document.getElementById("fz-intro-v") as HTMLVideoElement | null;
    const box = document.getElementById("fz-intro");
    let done = false;
    const timers: number[] = [];

    const leave = () => {
      if (done) return;
      done = true;
      h.classList.add("fz-intro-out");
      timers.push(
        window.setTimeout(() => {
          h.classList.remove("fz-intro-on", "fz-intro-out");
          if (v) {
            v.pause();
            v.removeAttribute("src");
            v.load();
          }
        }, 500),
      );
    };

    /* Start fading while the last half second plays out, so the video
       hands straight over to the page with no dead frame. */
    const onTime = () => { if (v && v.currentTime >= 2.05) leave(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") leave(); };

    v?.addEventListener("timeupdate", onTime);
    v?.addEventListener("ended", leave);
    v?.addEventListener("error", leave);
    box?.addEventListener("click", leave);
    window.addEventListener("keydown", onKey);

    /* A loading screen should never be the thing people wait on. If the
       video is not playing within 1.2s, skip it. Hard stop at 3.2s. */
    timers.push(window.setTimeout(() => { if (!v || v.paused || v.currentTime < 0.05) leave(); }, 1200));
    timers.push(window.setTimeout(leave, 3200));

    return () => {
      v?.removeEventListener("timeupdate", onTime);
      v?.removeEventListener("ended", leave);
      v?.removeEventListener("error", leave);
      box?.removeEventListener("click", leave);
      window.removeEventListener("keydown", onKey);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div id="fz-intro" className="fz-intro" role="presentation">
      <video
        id="fz-intro-v"
        muted
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
        suppressHydrationWarning
      />
      <script dangerouslySetInnerHTML={{ __html: START }} />
      <button type="button" className="fz-intro-skip" aria-label="Skip intro">
        Skip
      </button>
    </div>
  );
}
