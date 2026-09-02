"use client";

import { useEffect, useRef } from "react";

/* A muted looping video that plays a touch faster than real time.
   playbackRate is not an attribute, so it needs a ref; everything else
   matches the plain <video> it replaces. */
export default function FastVideo({
  className = "",
  poster,
  rate = 1.2,
  ariaLabel,
  sources,
}: {
  className?: string;
  poster?: string;
  rate?: number;
  ariaLabel?: string;
  sources: { src: string; type: string }[];
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const set = () => {
      v.playbackRate = rate;
    };
    set();
    v.addEventListener("play", set);
    return () => v.removeEventListener("play", set);
  }, [rate]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={ariaLabel}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
