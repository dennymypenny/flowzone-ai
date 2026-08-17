"use client";
import { useEffect, useRef, useState } from "react";
import VideoSpark from "@/app/components/VideoSpark";
import Icon from "@/components/Icon";
import FunnelNarrow from "@/app/components/FunnelNarrow";
import { readPhoto, PHOTO_READ_KEY, type PhotoRead } from "@/lib/photoread";
import {
  KEYS,
  fetchJSON,
  loadJSON,
  readIdea,
  readUploads,
  removeJSON,
  saveIdea,
  saveJSON,
} from "@/lib/session";

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

const KEY = KEYS.idea;
const UPLOADS_KEY = KEYS.uploads;

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
  const [read, setRead] = useState<PhotoRead | null>(null);
  /* The video maker used to sit under the questions from the first second, so
     everything a person had not done yet was visible at once. It opens when
     the questions are answered, or the moment somebody says they only came
     for the video. */
  const [showVideo, setShowVideo] = useState(false);
  const [oops, setOops] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement | null>(null);
  /* Typing debounces by a second, so two entries can be in flight at once. A
     slow first answer used to land on top of a fast second one and the backdrop
     showed the wrong idea. Every response checks it is still the current one. */
  const reqId = useRef(0);

  useEffect(() => {
    const saved = readIdea();
    if (saved) {
      setChosen(saved);
      if (saved.thumb) setPhoto(saved.thumb);
      if (saved.q) fetchClip(saved.q, reqId.current);
    }
    const savedRead = loadJSON<PhotoRead | null>(PHOTO_READ_KEY, null);
    if (savedRead) setRead(savedRead);
    setUploadCount(readUploads().length);
    // A thought grabbed mid-ride lands here, already inside it.
    let grabbed: string | null = null;
    try {
      grabbed = window.sessionStorage.getItem("flowzone.ride.idea");
      if (grabbed) window.sessionStorage.removeItem("flowzone.ride.idea");
    } catch {
      /* a blocked session store just means no handoff */
    }
    if (grabbed) {
      removeJSON(KEY);
      removeJSON(KEYS.funnel);
      setChosen(null);
      enter(grabbed);
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
  const fetchClip = async (term: string, mine: number) => {
    try {
      const data = await fetchJSON<{ ok?: boolean; clips?: Array<{ url: string }> }>(
        `/api/clips?q=${encodeURIComponent(term)}`
      );
      if (mine !== reqId.current) return; // a newer idea already won
      if (data.ok && data.clips?.length) {
        setClip(data.clips[(Math.random() * data.clips.length) | 0].url);
      }
    } catch {
      /* stillness is fine, and the timeout stops it hanging */
    }
  };

  /** Entering the idea IS the action. No picking, no scanning. */
  const enter = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    const mine = ++reqId.current;
    setBusy(true);
    setOops("");
    setClip("");
    fetchClip(term, mine);
    let thumb = "";
    let timedOut = false;
    try {
      const data = await fetchJSON<{ ok?: boolean; shots?: Shot[] }>(
        `/api/moodboard?q=${encodeURIComponent(term)}`
      );
      if (data.ok && data.shots?.length) thumb = data.shots[0].thumb;
    } catch (e) {
      // The questions do not need a picture to work, but a silent stall does
      // need saying, otherwise the dot just spins.
      timedOut = e instanceof Error && e.name === "AbortError";
    }
    if (mine !== reqId.current) return; // a newer idea already won
    setBusy(false);
    if (timedOut) setOops("The backdrop could not load. Your idea still went through.");
    const sel = { q: term, thumb };
    setChosen(sel);
    if (thumb) setPhoto(thumb);
    setQ("");
    saveIdea(sel);
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
    const all = [...datas, ...readUploads()].slice(0, 6);
    // A full quota means the photos ride along for this visit only. Say so.
    if (!saveJSON(UPLOADS_KEY, all)) {
      setOops("Storage is full, so these photos will not survive a reload.");
    }
    setUploadCount(all.length);

    // The picture already knows most of the brief. Read it here, on this
    // device, and hand the answer to the rest of the page.
    try {
      const r = await readPhoto(datas[0]);
      if (r) {
        setRead(r);
        saveJSON(PHOTO_READ_KEY, r);
      }
    } catch {
      /* a picture that will not read is not a reason to stop */
    }

    // Their own photos beat anything a search returns, so any search still in
    // flight loses. Bumping the id is what makes it lose.
    reqId.current += 1;
    const term = q.trim() || chosen?.q || "your own thing";
    const sel = { q: term, thumb: datas[0] };
    setChosen(sel);
    setPhoto(datas[0]);
    setClip("");
    saveIdea(sel);
  };

  const clear = () => {
    setChosen(null);
    setClip("");
    setPhoto("");
    setRead(null);
    setOops("");
    // Nothing in flight may land on a cleared board.
    reqId.current += 1;
    removeJSON(KEY);
    removeJSON(PHOTO_READ_KEY);
    removeJSON(KEYS.funnel);
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
        <p aria-live="polite" className="sr-only">
          {busy ? "Looking for your idea." : oops || (chosen ? `You are in: ${chosen.q}` : "")}
        </p>
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
          aria-label="Add your own photos"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        {read && (
          <div
            className="panel p-5 mt-4 max-w-xl"
            style={{ animation: "ideain 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <p className="label mb-3">What your photo says</p>
            <div className="flex gap-1.5 mb-4">
              {read.palette.map((hexv) => (
                <span key={hexv} className="flex-1">
                  <span
                    className="block h-9 rounded-lg border border-white/25"
                    style={{ background: hexv }}
                  />
                  <span className="block text-[9px] text-ink-mute mt-1.5 text-center tracking-wide">
                    {hexv}
                  </span>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {read.tags.map((t) => (
                <span
                  key={t}
                  className="surface text-[10px] uppercase tracking-label text-ink-soft px-2.5 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm text-ink-soft font-light leading-relaxed">{read.line}</p>
            <p className="text-[11px] text-ink-mute mt-3">
              Read on your device. The picture never left it, and these colours ride
              into the Design track with you.
            </p>
          </div>
        )}
        {oops && <p className="text-[12px] text-[#FBBF24] mt-3">{oops}</p>}
        <FunnelNarrow topic={chosen.q} onDone={() => setShowVideo(true)} />
        {showVideo ? (
          <VideoSpark topic={chosen.q} />
        ) : (
          <button
            onClick={() => setShowVideo(true)}
            className="mt-6 text-xs text-ink-mute hover:text-ink transition-colors"
          >
            Only came for the video? Open the editor now
          </button>
        )}
      </div>
    );
  }

  return (
    <div {...dropProps} className={`relative transition-all ${dropRing}`}>
      <p aria-live="polite" className="sr-only">
        {busy ? "Looking for your idea." : oops}
      </p>
      {dragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-paper/80 pointer-events-none">
          <p className="font-display text-2xl text-accent flex items-center gap-3">
            <Icon name="download" size={24} color="#5B8CFF" /> Drop your photos in
          </p>
        </div>
      )}
      {/* One short prompt, tight to the field. The hero above already said
          what this is, and two paragraphs stacked over an input is the thing
          that made this page feel like a form. */}
      <p className="text-ink font-light mb-4">
        One line, the way you would say it to a friend.
      </p>
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
      {oops && <p className="mt-3 text-[12px] text-[#FBBF24]">{oops}</p>}
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
        aria-label="Add your own photos"
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
    </div>
  );
}
