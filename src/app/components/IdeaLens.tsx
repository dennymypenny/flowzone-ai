"use client";
import { useEffect, useRef, useState } from "react";
import Tilt3D from "@/app/components/Tilt3D";
import VideoSpark from "@/app/components/VideoSpark";

/**
 * Type a thing, see the thing, pick it, move on.
 * Or skip all of that and drop your own.
 *
 * One photograph at a time, big, in a card that tilts toward the pointer.
 * Drag photos from your desktop anywhere onto this block and they become
 * the vibe and star in the video. Files never leave the browser: they are
 * downscaled to a data URL on the visitor's own machine and stored
 * locally, which is also what makes them safe to paint into the reel.
 */

type Shot = {
  id: string;
  thumb: string;
  url: string;
  title: string;
  creator: string;
  source: string;
};

const KEY = "flowzone.idealens.v1";
const UPLOADS_KEY = "flowzone.uploads.v1";
const STARTERS = ["a bakery", "a barbershop", "a sneaker shop"];

/** Shrink a dropped image on-device so storage stays small and paint stays fast. */
function shrink(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(null);
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const max = 1280;
      const scale = Math.min(1, max / Math.max(im.width, im.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(im.width * scale);
      canvas.height = Math.round(im.height * scale);
      const c = canvas.getContext("2d");
      if (!c) {
        URL.revokeObjectURL(url);
        return resolve(null);
      }
      c.drawImage(im, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch {
        resolve(null);
      }
    };
    im.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    im.src = url;
  });
}

/** Data URLs render directly; web images go through the same-origin pass. */
const src = (thumb: string) =>
  thumb.startsWith("data:") ? thumb : `/api/imageproxy?src=${encodeURIComponent(thumb)}`;

export default function IdeaLens() {
  const [q, setQ] = useState("");
  const [clip, setClip] = useState<string>("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState("");
  const [chosen, setChosen] = useState<{ q: string; thumb: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) setChosen(JSON.parse(saved));
      const ups = window.localStorage.getItem(UPLOADS_KEY);
      if (ups) setUploadCount((JSON.parse(ups) as string[]).length);
    } catch {
      /* ignore */
    }
  }, []);

  /** Immersion: real footage of the idea fills the room behind the page. */
  const fetchClip = async (term: string) => {
    try {
      const res = await fetch(`/api/clips?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.ok && data.clips?.length) {
        setClip(data.clips[(Math.random() * data.clips.length) | 0].url);
      }
    } catch {
      /* stillness is fine */
    }
  };

  const fetchShots = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    setFailed(false);
    fetchClip(term);
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.shots) && data.shots.length) {
        setShots(data.shots);
        setIdx(0);
        setShown(term);
      } else {
        setShots([]);
        setFailed(true);
      }
    } catch {
      setShots([]);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!q.trim()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => fetchShots(q), 650);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  const shot = shots[idx];

  const keep = (sel: { q: string; thumb: string }) => {
    setChosen(sel);
    setShots([]);
    setQ("");
    try {
      window.localStorage.setItem(KEY, JSON.stringify(sel));
    } catch {
      /* ignore */
    }
    document.getElementById("pick-your-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pick = () => {
    if (!shot) return;
    keep({ q: shown, thumb: shot.thumb });
  };

  /** Dropped or browsed files become the vibe and feed the video. */
  const addFiles = async (list: FileList | File[]) => {
    const files = Array.from(list).slice(0, 6);
    if (!files.length) return;
    setBusy(true);
    const datas = (await Promise.all(files.map(shrink))).filter(Boolean) as string[];
    setBusy(false);
    if (!datas.length) return;
    let existing: string[] = [];
    try {
      existing = JSON.parse(window.localStorage.getItem(UPLOADS_KEY) || "[]");
    } catch {
      /* ignore */
    }
    const all = [...datas, ...existing].slice(0, 6);
    try {
      window.localStorage.setItem(UPLOADS_KEY, JSON.stringify(all));
    } catch {
      /* storage full: carry on with what fits in memory */
    }
    setUploadCount(all.length);
    keep({ q: q.trim() || shown || "your own photos", thumb: datas[0] });
  };

  const clear = () => {
    setChosen(null);
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    },
  };

  const dropRing = dragOver
    ? "outline outline-2 outline-accent outline-offset-8 rounded-2xl"
    : "";

  /* The room fills with the idea. Sits behind everything, never blocks. */
  const ambient = clip ? (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      <video
        src={clip}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-[0.18]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,20,36,0.55) 0%, rgba(12,20,36,0.35) 40%, rgba(12,20,36,0.9) 100%)",
        }}
      />
    </div>
  ) : null;

  // Already picked: one quiet line, then the next move. Still a drop target.
  if (chosen && !shots.length) {
    return (
      <div {...dropProps} className={`relative transition-all ${dropRing}`}>
        {ambient}
        {dragOver && (
          <p className="absolute -top-8 left-0 label text-accent">Drop them in</p>
        )}
        <div className="flex items-center gap-4 rounded-2xl border border-rule bg-paper-deep/70 p-3 pr-5 max-w-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src(chosen.thumb)}
            alt={chosen.q}
            className="w-16 h-16 object-cover rounded-xl border border-white/15"
          />
          <div className="flex-1 min-w-0">
            <p className="label mb-1">Your vibe</p>
            <p className="text-sm text-ink font-light truncate">
              {chosen.q}
              {uploadCount > 0 && (
                <span className="text-ink-mute"> · {uploadCount} of your photos in</span>
              )}
            </p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors shrink-0"
          >
            + Add photos
          </button>
          <button
            onClick={clear}
            className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors shrink-0"
          >
            Change it
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <VideoSpark topic={chosen.q} />
      </div>
    );
  }

  return (
    <div {...dropProps} className={`relative transition-all ${dropRing}`}>
      {ambient}
      {dragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-paper/80 pointer-events-none">
          <p className="font-display text-2xl text-accent">Drop your photos in 📥</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchShots(q)}
            placeholder="Type the thing you dream of. Bread. A barbershop. Anything."
            aria-label="Type an idea to see a real photograph of it"
            className="w-full bg-paper-deep/80 text-ink placeholder-ink-mute border border-rule px-5 py-4 text-base font-light outline-none focus:border-accent transition-colors"
          />
          {busy && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQ(s);
                fetchShots(s);
              }}
              className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        className="mt-3 text-xs text-ink-mute hover:text-ink transition-colors"
      >
        📥 Or drag your own photos anywhere here, or click to browse
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {failed && !busy && (
        <div className="mt-6 flex items-center gap-4">
          <p className="text-sm text-ink-soft font-light">
            Could not pull photos just now. It happens.
          </p>
          <button
            onClick={() => fetchShots(q || shown)}
            className="text-xs border border-rule text-ink px-3 py-2 hover:border-accent transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {shot && (
        <div className="mt-8 max-w-2xl">
          <p className="label mb-4">This is {shown} · like it or roll another</p>
          <Tilt3D max={8}>
            <button
              onClick={pick}
              className="group relative block w-full rounded-2xl overflow-hidden bg-[#172440] border border-white/15 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.85)] text-left"
              aria-label={`Use this photograph of ${shown}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={shot.id}
                src={src(shot.thumb)}
                alt={shown}
                onError={() => setIdx((i) => (i + 1) % Math.max(1, shots.length))}
                className="w-full h-[300px] sm:h-[380px] object-cover block"
                style={{ animation: "ideain 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
              />
              {/* Credit lives on hover only. No caption bar. */}
              <span className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {shot.creator}
              </span>
              <span className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-white">✓ Yes, this feeling. Keep it.</span>
              </span>
            </button>
          </Tilt3D>
          <div className="flex gap-3 mt-4">
            <button onClick={pick} className="btn-primary !px-5 !py-2.5 text-sm">
              ✓ Keep it, move on
            </button>
            <button
              onClick={() => setIdx((idx + 1) % shots.length)}
              className="btn-ghost !px-5 !py-2.5 text-sm"
            >
              Show me another <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
