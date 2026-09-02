"use client";

import { useEffect, useRef } from "react";

/* A muted looping video that plays a touch faster than real time and
   actually autoplays on phones. React never writes the muted attribute
   into the server HTML, and iOS decides at parse time, so the tag is
   written as raw HTML with muted in it. Then we still set the property,
   call play() ourselves, and retry on the first touch or scroll for Low
   Power Mode, which blocks the silent start until the person interacts. */
export default function FastVideo({
  className = "",
  poster,
  rate = 1.2,
  preload = "metadata",
  ariaLabel,
  sources,
}: {
  className?: string;
  poster?: string;
  rate?: number;
  preload?: "none" | "metadata" | "auto";
  ariaLabel?: string;
  sources: { src: string; type: string }[];
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = box.current?.querySelector("video");
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.playbackRate = rate;

    const tryPlay = () => {
      v.muted = true;
      v.playbackRate = rate;
      if (v.paused) v.play().catch(() => {});
    };
    const onPlay = () => {
      v.playbackRate = rate;
    };
    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };

    tryPlay();
    const t = window.setTimeout(tryPlay, 800);
    v.addEventListener("play", onPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", tryPlay, { passive: true });
    window.addEventListener("touchend", tryPlay, { passive: true });
    window.addEventListener("scroll", tryPlay, { passive: true });
    window.addEventListener("click", tryPlay, { passive: true });
    return () => {
      window.clearTimeout(t);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("touchend", tryPlay);
      window.removeEventListener("scroll", tryPlay);
      window.removeEventListener("click", tryPlay);
    };
  }, [rate]);

  const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const html =
    `<video class="${esc(className)}" autoplay muted loop playsinline webkit-playsinline ` +
    `preload="${preload}" disablepictureinpicture` +
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
