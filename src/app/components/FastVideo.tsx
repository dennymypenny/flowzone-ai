"use client";

import { useEffect, useRef } from "react";

/* A muted looping video that plays a touch faster than real time and
   never shows a play button. React never writes the muted attribute into
   the server HTML and iOS decides at parse time, so the tag is written as
   raw HTML with muted in it. Then we call play() ourselves. If the phone
   still refuses (Low Power Mode, Low Data Mode, autoplay previews off),
   the video is swapped for an animated image of the same footage, which
   phones always animate, so the page moves either way. */
export default function FastVideo({
  className = "",
  poster,
  rate = 1.2,
  preload = "metadata",
  ariaLabel,
  sources,
  fallback,
  fallbackPortrait,
  lazy = false,
}: {
  className?: string;
  poster?: string;
  rate?: number;
  preload?: "none" | "metadata" | "auto";
  ariaLabel?: string;
  sources: { src: string; type: string; media?: string }[];
  fallback?: string;
  /* Animated image used instead of `fallback` when the viewport is taller
     than it is wide, so a phone never stretches a landscape frame. */
  fallbackPortrait?: string;
  /* Below the fold: the sources stay out of the tag until VideoGate sees
     the video coming into view, so a phone downloads nothing for it on
     arrival. The poster shows in the meantime. */
  lazy?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = box.current;
    const v = root?.querySelector("video");
    if (!root || !v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.playbackRate = rate;

    let swapped = false;
    const swap = () => {
      if (swapped || !fallback) return;
      swapped = true;
      const img = document.createElement("img");
      const portrait =
        fallbackPortrait && window.matchMedia("(orientation: portrait)").matches;
      img.src = portrait ? fallbackPortrait : fallback;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.className = v.className;
      img.decoding = "async";
      v.replaceWith(img);
    };

    const tryPlay = () => {
      if (swapped) return;
      /* VideoGate parked it off screen, or it is nowhere near the screen
         yet. Leave it alone so a phone is not downloading three videos at
         once on arrival. */
      if (v.dataset.fzOff) return;
      if (lazy && !v.querySelector("source[src]")) return;
      const r = v.getBoundingClientRect();
      if (r.top > window.innerHeight + 160 || r.bottom < -160) return;
      v.muted = true;
      v.playbackRate = rate;
      if (!v.paused) return;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* Refused. On a phone that means a play button would appear,
             so hand over to the animated image instead. */
          swap();
        });
      }
    };
    const onPlay = () => {
      v.playbackRate = rate;
    };
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };

    tryPlay();
    /* Belt and braces: if the phone has plainly refused to play, swap. A
       video that is still downloading on a slow connection is not a
       refusal, so keep checking instead of fetching the animated image on
       top of the video and paying for both. Give up after 12 seconds. */
    let checks = 0;
    const t = window.setInterval(() => {
      if (swapped) { window.clearInterval(t); return; }
      const stillLoading = v.networkState === HTMLMediaElement.NETWORK_LOADING && v.readyState < 3;
      if (!v.paused || v.currentTime > 0 || v.dataset.fzOff) { window.clearInterval(t); return; }
      checks += 1;
      if (!stillLoading || checks >= 5) {
        window.clearInterval(t);
        swap();
      }
    }, 2500);
    v.addEventListener("play", onPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", tryPlay, { passive: true });
    window.addEventListener("scroll", tryPlay, { passive: true });
    return () => {
      window.clearInterval(t);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
    };
  }, [rate, fallback, fallbackPortrait, lazy]);

  const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const html =
    `<video class="${esc(className)} fz-video" ${lazy ? 'data-fz-auto="1"' : "autoplay"} muted loop playsinline webkit-playsinline ` +
    `preload="${preload}" disablepictureinpicture disableremoteplayback x-webkit-airplay="deny"` +
    (poster ? ` poster="${esc(poster)}"` : "") +
    (ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : "") +
    `>` +
    sources
      .map(
        (s) =>
          `<source ${lazy ? "data-src" : "src"}="${esc(s.src)}" type="${esc(s.type)}"` +
          (s.media ? ` media="${esc(s.media)}"` : "") +
          `>`,
      )
      .join("") +
    `</video>`;

  return (
    <div
      ref={box}
      className="contents"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
