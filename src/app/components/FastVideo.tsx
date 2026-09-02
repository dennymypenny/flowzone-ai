"use client";

import { useEffect, useRef } from "react";

/* A muted looping video that plays a touch faster than real time and
   actually autoplays on phones. React does not write the muted attribute
   into the server HTML, so iOS sees an unmuted video and refuses to start
   it. We set muted as a property, call play() ourselves, and retry on the
   first touch or scroll for Low Power Mode, which blocks the silent start
   until the person interacts. */
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
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.playbackRate = rate;

    const tryPlay = () => {
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
    v.addEventListener("play", onPlay);
    v.addEventListener("loadeddata", tryPlay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", tryPlay, { passive: true });
    window.addEventListener("scroll", tryPlay, { passive: true });
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("scroll", tryPlay);
    };
  }, [rate]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      poster={poster}
      aria-label={ariaLabel}
      disablePictureInPicture
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
