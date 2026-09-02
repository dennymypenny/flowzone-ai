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
}: {
  className?: string;
  poster?: string;
  rate?: number;
  preload?: "none" | "metadata" | "auto";
  ariaLabel?: string;
  sources: { src: string; type: string }[];
  fallback?: string;
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
      img.src = fallback;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.className = v.className;
      img.decoding = "async";
      v.replaceWith(img);
    };

    const tryPlay = () => {
      if (swapped) return;
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
    /* Belt and braces: if nothing is moving after a moment, swap anyway. */
    const t = window.setTimeout(() => {
      if (!swapped && (v.paused || v.readyState < 2) && v.currentTime === 0) {
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
      window.clearTimeout(t);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
    };
  }, [rate, fallback]);

  const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const html =
    `<video class="${esc(className)} fz-video" autoplay muted loop playsinline webkit-playsinline ` +
    `preload="${preload}" disablepictureinpicture disableremoteplayback x-webkit-airplay="deny"` +
    (poster ? ` poster="${esc(poster)}"` : "") +
    (ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : "") +
    `>` +
    sources.map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`).join("") +
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
