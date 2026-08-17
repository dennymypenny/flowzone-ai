"use client";
import { useEffect, useRef, useState } from "react";
import VideoSpark from "@/app/components/VideoSpark";
import Icon from "@/components/Icon";
import FunnelNarrow from "@/app/components/FunnelNarrow";

/**
 * Say the thing, and you are in it.
 *
 * No photo browsing, no picking step, no canned suggestion chips. The
 * input murmurs possibilities to itself, a typewriter cycling through
 * half-dreamed ideas, until the visitor types their own. The moment they
 * do, they are inside: imagery becomes faint atmosphere behind the page
 * while the narrowing questions flow in front, one thought leading to
 * the next, like moving through your own head.
 *
 * Dropped photos are different: those are THEIRS, so they lead the
 * backdrop and the reel. Files never leave the browser.
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

/** The murmur: ideas the input dreams about while it waits. */
const MURMURS = [
  "a late night ramen bar",
  "a sneaker vault",
  "a flower truck",
  "a barber studio with a waitlist",
  "a candle brand",
  "a card shop that goes live on Fridays",
  "a supper club",
  "a vintage store",
  "my clothing line",
  "a bakery people cross town for",
];

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
  const [clip, setClip] = useState("");
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [chosen, setChosen] = useState<{ q: string; thumb: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [murmur, setMurmur] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChosen(parsed);
        if (parsed?.thumb) setPhoto(parsed.thumb);
        if (parsed?.q) fetchClip(parsed.q);
      }
      const ups = window.localStorage.getItem(UPLOADS_KEY);
      if (ups) setUploadCount((JSON.parse(ups) as string[]).length);
      // A thought grabbed mid-ride lands here, already inside it.
      const grabbed = window.sessionStorage.getItem("flowzone.ride.idea");
      if (grabbed) {
        window.sessionStorage.removeItem("flowzone.ride.idea");
        window.localStorage.removeItem(KEY);
        window.localStorage.removeItem("flowzone.funnel.v2");
        setChosen(null);
        enter(grabbed);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The placeholder types itself: a slow stream of half-dreamed ideas.
  useEffect(() => {
    if (chosen) return;
    let word = 0;
    let ch = 0;
    let deleting = false;
    const id = window.setInterval(() => {
      const target = MURMURS[word % MURMURS.length];
      if (!deleting) {
        ch += 1;
        if (ch >= target.length + 14) deleting = true; // hold, then let go
      } else {
        ch -= 3;
        if (ch <= 0) {
          deleting = false;
          word += 1;
        }
      }
      setMurmur(target.slice(0, Math.max(0, Math.min(target.length, ch))));
    }, 70);
    return () => window.clearInterval(id);
  }, [chosen]);

  /** The room fills with the idea: footage first, a photograph as fallback. */
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

  /** Entering the idea IS the action. No picking, no scanning. */
  const enter = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setBusy(true);
    fetchClip(term);
    let thumb = "";
    try {
      const res = await fetch(`/api/moodboard?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.ok && data.shots?.length) thumb = (data.shots as Shot[])[0].thumb;
    } catch {
      /* the questions do not need a picture to work */
    }
    setBusy(false);
    const sel = { q: term, thumb };
    setChosen(sel);
    if (thumb) setPhoto(thumb);
    setQ("");
    try {
      window.localStorage.setItem(KEY, JSON.stringify(sel));
    } catch {
      /* ignore */
    }
  };

  // Typing pauses, and you are in. Enter also works.
  useEffect(() => {
    if (!q.trim() || chosen) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => enter(q), 1000);
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  /** Dropped files are theirs: they lead the backdrop and the reel. */
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
      /* storage full: carry on */
    }
    setUploadCount(all.length);
    const term = q.trim() || chosen?.q || "your own thing";
    const sel = { q: term, thumb: datas[0] };
    setChosen(sel);
    setPhoto(datas[0]);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(sel));
    } catch {
      /* ignore */
    }
  };

  const clear = () => {
    setChosen(null);
    setClip("");
    setPhoto("");
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem("flowzone.funnel.v2");
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

  /* The atmosphere. Footage when it exists, a photograph otherwise. */
  const ambient =
    clip || photo ? (
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        aria-hidden
      >
        {clip ? (
          <video
            src={clip}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-[0.22]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src(photo)}
            alt=""
            className="w-full h-full object-cover opacity-[0.15]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,20,36,0.5) 0%, rgba(12,20,36,0.35) 40%, rgba(12,20,36,0.92) 100%)",
          }}
        />
      </div>
    ) : null;

  // Inside the idea: the experience continues as questions, not homework.
  if (chosen) {
    return (
      <div {...dropProps} className={`relative transition-all ${dropRing}`}>
        {ambient}
        {dragOver && (
          <p className="absolute -top-8 left-0 label text-accent">Drop them in</p>
        )}
        <div className="flex items-center gap-4 rounded-2xl border border-rule bg-paper-deep/70 backdrop-blur p-3 pr-5 max-w-xl">
          {chosen.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src(chosen.thumb)}
              alt=""
              className="w-14 h-14 object-cover rounded-xl border border-white/15"
            />
          ) : (
            <span className="w-14 h-14 rounded-xl border border-white/15 flex items-center justify-center shrink-0">
              <Icon name="sparkle" size={20} color="#5B8CFF" />
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="label mb-1">You are in</p>
            <p className="text-sm text-ink font-light truncate">
              {chosen.q}
              {uploadCount > 0 && (
                <span className="text-ink-mute"> · {uploadCount} of your photos riding along</span>
              )}
            </p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors shrink-0"
          >
            + Your photos
          </button>
          <button
            onClick={clear}
            className="text-xs border border-rule text-ink-soft px-3 py-2 hover:text-ink hover:border-accent transition-colors shrink-0"
          >
            New idea
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
        <FunnelNarrow topic={chosen.q} />
        <VideoSpark topic={chosen.q} />
      </div>
    );
  }

  return (
    <div {...dropProps} className={`relative transition-all ${dropRing}`}>
      {dragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-paper/80 pointer-events-none">
          <p className="font-display text-2xl text-accent flex items-center gap-3">
            <Icon name="download" size={24} color="#5B8CFF" /> Drop your photos in
          </p>
        </div>
      )}
      <div className="relative max-w-xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enter(q)}
          placeholder={murmur || " "}
          aria-label="Type an idea to enter it"
          className="glowbox w-full bg-paper-deep/80 text-ink placeholder-ink-mute border border-rule px-5 py-4 text-base font-light outline-none focus:border-accent transition-colors"
        />
        {busy && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
        )}
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        className="mt-3 text-xs text-ink-mute hover:text-ink transition-colors"
      >
        Or drag your own photos anywhere here
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
    </div>
  );
}
