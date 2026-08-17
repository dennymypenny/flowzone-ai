"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import ReelClipInspector from "@/app/components/ReelClipInspector";
import AskAboutThis, { askBody } from "@/app/components/AskAboutThis";
import {
  Clip,
  Drawable,
  FORMATS,
  FormatId,
  PAPER,
  Slot,
  bitrateFor,
  clampNum,
  clipMs,
  defaultOverlay,
  drawFrame,
  evenSize,
  fmtSecs,
  fmtTime,
  layout,
  newId,
  mimeCandidates,
  sizeOf,
  whyFor,
} from "@/lib/reel";

/**
 * Type a sentence, get a video. Then actually edit it.
 *
 * The one tap path is still the whole point: press the button, say nothing,
 * upload nothing, and a finished reel comes back. What changed is what happens
 * next. The result now lands in a real timeline, so anybody who wants to move
 * a clip, trim it, change the shape, drop in their own phone footage or put
 * their own words on top can do exactly that, right here, in the browser.
 *
 * No server, no key, no upload. Files picked from the device are read as
 * object URLs, drawn to a canvas and never sent anywhere. Canvas paints the
 * frames, MediaRecorder records the canvas, the audio graph mixes the sound.
 */

type Shot = { id: string; thumb: string };

/**
 * The ghostwriter.
 *
 * These used to be moods: "it is not a product, it is a mood", "this is your
 * sign to start the thing". Nice to read, useless to film, and nobody posts
 * them. A short video earns attention by being about something specific that
 * happens, so every line here is a real angle with a shot behind it: the
 * process, the price, the mistake, the before and after, the objection. The
 * person can still type their own, but the free option should be the one a
 * strategist would suggest.
 */
const LINES = [
  (t: string) => `how ${t} actually gets made, start to finish, in thirty seconds`,
  (t: string) => `what ${t} costs, and why, said out loud with no dancing around it`,
  (t: string) => `the mistake I made in the first year of ${t} so you do not have to`,
  (t: string) => `before and after: the same job, ${t}, and what changed`,
  (t: string) => `the question everybody asks about ${t}, answered properly`,
  (t: string) => `one thing to look for before you pay anybody for ${t}`,
  (t: string) => `a day of ${t}, the unglamorous version, no music`,
  (t: string) => `why ${t} takes as long as it does, shown rather than explained`,
  (t: string) => `the part of ${t} people never see, and why it is the part that matters`,
  (t: string) => `who ${t} is not for, said honestly, so the right people stay`,
];

const MAX_SIDE = 2048;
const MAX_TOTAL_MS = 8 * 60 * 1000;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    const to = window.setTimeout(() => reject(new Error("slow")), 12000);
    im.onload = () => {
      window.clearTimeout(to);
      resolve(im);
    };
    im.onerror = () => {
      window.clearTimeout(to);
      reject(new Error("image"));
    };
    im.src = url;
  });
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    const to = window.setTimeout(() => reject(new Error("slow")), 25000);
    v.onloadedmetadata = () => {
      window.clearTimeout(to);
      resolve(v);
    };
    v.onerror = () => {
      window.clearTimeout(to);
      reject(new Error("video"));
    };
    v.src = url;
    v.load();
  });
}

/** Seeking is asynchronous and sometimes silently never lands, so it always gets a way out. */
function seekTo(v: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      v.removeEventListener("seeked", finish);
      resolve();
    };
    v.addEventListener("seeked", finish);
    window.setTimeout(finish, 4000);
    try {
      v.currentTime = t;
    } catch {
      finish();
    }
  });
}

/**
 * Photos get baked down to a sane size and the file handle is thrown away.
 * A 48 megapixel phone shot redrawn sixty times a second will melt a laptop,
 * and holding the original around is how tabs die on a 200MB holiday video.
 */
function bake(img: HTMLImageElement): HTMLCanvasElement {
  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;
  const s = Math.min(1, MAX_SIDE / Math.max(iw, ih));
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(iw * s));
  cv.height = Math.max(1, Math.round(ih * s));
  const c = cv.getContext("2d");
  if (c) c.drawImage(img, 0, 0, cv.width, cv.height);
  return cv;
}

async function makeThumb(el: Drawable): Promise<string> {
  const { w, h } = sizeOf(el);
  if (!w || !h) return "";
  const tw = 160;
  const th = Math.max(1, Math.round((tw * h) / w));
  const cv = document.createElement("canvas");
  cv.width = tw;
  cv.height = th;
  const c = cv.getContext("2d");
  if (!c) return "";
  try {
    c.drawImage(el, 0, 0, tw, th);
    return cv.toDataURL("image/jpeg", 0.7);
  } catch {
    return "";
  }
}

function baseClip(): Omit<Clip, "id" | "kind" | "name"> {
  return {
    src: "",
    mediaDur: 0,
    inS: 0,
    outS: 0,
    stillMs: 3000,
    fit: "cover",
    bg: PAPER,
    zoom: true,
    muted: false,
    text: null,
    trans: "crossfade",
    transMs: 400,
    dipColor: PAPER,
    thumb: "",
  };
}

function cardClip(text: string, ms: number, size: number): Clip {
  return {
    ...baseClip(),
    id: newId(),
    kind: "card",
    name: text.slice(0, 30) || "Title card",
    stillMs: ms,
    zoom: false,
    muted: true,
    text: { ...defaultOverlay(text), size, pos: "mc", weight: 600 },
  };
}

function safeName(s: string): string {
  return (s || "flow").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "flow";
}

export default function VideoSpark({ topic }: { topic: string }) {
  const [script, setScript] = useState("");
  const [lineIdx, setLineIdx] = useState(-1);
  const typerRef = useRef<number | undefined>(undefined);

  const [clips, setClips] = useState<Clip[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [formatId, setFormatId] = useState<FormatId>("9x16");
  const [customW, setCustomW] = useState("1080");
  const [customH, setCustomH] = useState("1920");

  const [playing, setPlaying] = useState(false);
  const [headUi, setHeadUi] = useState(0);
  const headRef = useRef(0);

  const [phase, setPhase] = useState<"idle" | "gathering" | "reading" | "exporting" | "done" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outExt, setOutExt] = useState("webm");
  const [outWhy, setOutWhy] = useState("");
  const outUrlRef = useRef("");

  const [music, setMusic] = useState<{ url: string; name: string } | null>(null);
  const [musicVol, setMusicVol] = useState(0.7);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const [brand, setBrand] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [calm, setCalm] = useState(false);
  const [caps, setCaps] = useState({ capture: true, record: true, checked: false });

  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRef = useRef<Map<string, Drawable>>(new Map());
  const urlsRef = useRef<Set<string>>(new Set());
  const acRef = useRef<{
    ctx: AudioContext;
    dest: MediaStreamAudioDestinationNode;
    wired: Set<HTMLMediaElement>;
  } | null>(null);
  const deadRef = useRef(false);

  /* ---------------------------------------------------------------- project */

  const proj = useMemo(() => {
    if (formatId === "custom") {
      return { w: evenSize(parseInt(customW, 10) || 1080), h: evenSize(parseInt(customH, 10) || 1920) };
    }
    const f = FORMATS.find((x) => x.id === formatId) || FORMATS[0];
    return { w: f.w, h: f.h };
  }, [formatId, customW, customH]);

  const lay = useMemo(() => layout(clips), [clips]);
  const layRef = useRef(lay);
  layRef.current = lay;

  const previewSize = useMemo(() => {
    // Small screens get a small canvas. The export is always full size, so a
    // phone is not asked to push 1080 by 1920 sixty times a second just to
    // show you a thumbnail sized picture.
    const cap = narrow ? 420 : 640;
    const w = Math.min(proj.w, cap);
    return { w: Math.round(w), h: Math.max(1, Math.round((w * proj.h) / proj.w)) };
  }, [proj.w, proj.h, narrow]);

  const selected = useMemo(() => clips.find((c) => c.id === sel) || null, [clips, sel]);
  const selIndex = useMemo(() => clips.findIndex((c) => c.id === sel), [clips, sel]);
  const activeIdx = useMemo(() => {
    for (let i = 0; i < lay.slots.length; i++) {
      if (headUi < lay.slots[i].start + lay.slots[i].dur) return i;
    }
    return lay.slots.length - 1;
  }, [lay, headUi]);

  const canExport = caps.capture && caps.record;

  /* ------------------------------------------------------------- environment */

  useEffect(() => {
    const capture =
      typeof HTMLCanvasElement !== "undefined" && "captureStream" in HTMLCanvasElement.prototype;
    const record = typeof MediaRecorder !== "undefined";
    setCaps({ capture, record, checked: true });

    const mq = window.matchMedia("(max-width: 720px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setNarrow(mq.matches);
      setCalm(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  /* Everything the tab is holding gets handed back on the way out. */
  useEffect(() => {
    const media = mediaRef.current;
    const urls = urlsRef.current;
    // React mounts, unmounts and mounts again in development. Without this the
    // guard below would stay latched on and every later render would bail out.
    deadRef.current = false;
    return () => {
      deadRef.current = true;
      window.clearInterval(typerRef.current);
      media.forEach((el) => {
        if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement) {
          try {
            el.pause();
            el.removeAttribute("src");
            el.load();
          } catch {
            /* it is going away anyway */
          }
        }
      });
      media.clear();
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
      if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current);
      const a = acRef.current;
      if (a) {
        try {
          a.ctx.close();
        } catch {
          /* already gone */
        }
      }
    };
  }, []);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = clampNum(musicVol, 0, 1);
  }, [musicVol, music]);

  /* -------------------------------------------------------------- the engine */

  const getMedia = useCallback((id: string) => mediaRef.current.get(id), []);

  const drawAt = useCallback(
    (t: number, slots: Slot[]) => {
      const cv = previewRef.current;
      if (!cv) return;
      if (cv.width !== previewSize.w || cv.height !== previewSize.h) {
        cv.width = previewSize.w;
        cv.height = previewSize.h;
      }
      const c = cv.getContext("2d");
      if (!c) return;
      drawFrame(c, previewSize.w, previewSize.h, slots, t, getMedia, brand, calm);
    },
    [previewSize.w, previewSize.h, brand, calm, getMedia]
  );

  const pauseAll = useCallback(() => {
    mediaRef.current.forEach((el) => {
      if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement && !el.paused) {
        el.pause();
      }
    });
    const m = musicRef.current;
    if (m && !m.paused) m.pause();
  }, []);

  /**
   * Park every video where the playhead says it should be.
   *
   * Only one clip is ever the live one. The clip just before it is held on its
   * last frame while a transition runs, and anything about to arrive is nudged
   * onto its in point early so it does not open on a grey square.
   */
  const syncMedia = useCallback((slots: Slot[], t: number, live: boolean) => {
    let idx = slots.length - 1;
    for (let i = 0; i < slots.length; i++) {
      if (t < slots[i].start + slots[i].dur) {
        idx = i;
        break;
      }
    }
    slots.forEach((s, i) => {
      const el = mediaRef.current.get(s.clip.id);
      if (typeof HTMLVideoElement === "undefined" || !(el instanceof HTMLVideoElement)) return;
      const local = clampNum(t - s.start, 0, s.dur);
      if (i === idx) {
        el.muted = s.clip.muted;
        const want = s.clip.inS + local / 1000;
        if (live) {
          if (Math.abs(el.currentTime - want) > 0.4) {
            try {
              el.currentTime = want;
            } catch {
              /* the browser will catch up */
            }
          }
          if (el.paused) el.play().catch(() => undefined);
        } else {
          if (!el.paused) el.pause();
          if (Math.abs(el.currentTime - want) > 0.05) {
            try {
              el.currentTime = want;
            } catch {
              /* fine */
            }
          }
        }
        return;
      }
      const cur = slots[idx];
      const holding =
        i === idx - 1 && cur.clip.trans !== "cut" && t - cur.start < cur.clip.transMs;
      if (!el.paused) el.pause();
      if (holding) return;
      const soon = s.start - t;
      if (soon > 0 && soon < 800 && Math.abs(el.currentTime - s.clip.inS) > 0.12) {
        try {
          el.currentTime = s.clip.inS;
        } catch {
          /* fine */
        }
      }
    });
  }, []);

  const syncMusic = useCallback((t: number, live: boolean) => {
    const el = musicRef.current;
    if (!el) return;
    if (!live) {
      if (!el.paused) el.pause();
      return;
    }
    const want = t / 1000;
    if (Number.isFinite(el.duration) && want > el.duration) {
      if (!el.paused) el.pause();
      return;
    }
    if (Math.abs(el.currentTime - want) > 0.4) {
      try {
        el.currentTime = want;
      } catch {
        /* fine */
      }
    }
    if (el.paused) el.play().catch(() => undefined);
  }, []);

  /* Paused, scrubbing, or just changed a setting: repaint one honest frame. */
  useEffect(() => {
    if (playing || phase === "exporting") return;
    syncMedia(layRef.current.slots, headRef.current, false);
    const id = window.requestAnimationFrame(() => drawAt(headRef.current, layRef.current.slots));
    return () => window.cancelAnimationFrame(id);
  }, [headUi, clips, drawAt, playing, phase, syncMedia]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let lastUi = 0;
    const step = (now: number) => {
      const dt = Math.min(120, now - last);
      last = now;
      const total = layRef.current.total;
      let t = headRef.current + dt;
      if (t >= total) {
        t = total;
        headRef.current = t;
        setHeadUi(t);
        setPlaying(false);
        return;
      }
      headRef.current = t;
      syncMedia(layRef.current.slots, t, true);
      syncMusic(t, true);
      drawAt(t, layRef.current.slots);
      if (now - lastUi > 120) {
        lastUi = now;
        setHeadUi(t);
      }
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(raf);
      pauseAll();
    };
  }, [playing, drawAt, syncMedia, syncMusic, pauseAll]);

  /* ---------------------------------------------------------------- the audio */

  const ensureAudio = useCallback(() => {
    if (acRef.current) return acRef.current;
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = w.AudioContext || w.webkitAudioContext;
    if (!Ctor) return null;
    try {
      const ctx = new Ctor();
      acRef.current = { ctx, dest: ctx.createMediaStreamDestination(), wired: new Set() };
      return acRef.current;
    } catch {
      return null;
    }
  }, []);

  /* Route an element into the mix once, and keep it audible on the page too. */
  const wireAudio = useCallback((el: HTMLMediaElement) => {
    const a = acRef.current;
    if (!a || a.wired.has(el)) return;
    try {
      const node = a.ctx.createMediaElementSource(el);
      node.connect(a.dest);
      node.connect(a.ctx.destination);
      a.wired.add(el);
    } catch {
      // Some elements refuse to be tapped. Their sound simply stays out of the
      // mix rather than taking the whole export down with them.
    }
  }, []);

  /* ---------------------------------------------------------------- the files */

  const clipFromImage = async (file: File, name: string): Promise<Clip> => {
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    try {
      const img = await loadImage(url);
      const cv = bake(img);
      const id = newId();
      mediaRef.current.set(id, cv);
      return { ...baseClip(), id, kind: "image", name, thumb: await makeThumb(cv) };
    } finally {
      URL.revokeObjectURL(url);
      urlsRef.current.delete(url);
    }
  };

  const clipFromVideo = async (file: File, name: string): Promise<Clip> => {
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    try {
      const v = await loadVideo(url);
      const dur = Number.isFinite(v.duration) && v.duration > 0.2 ? v.duration : 10;
      const id = newId();
      mediaRef.current.set(id, v);
      await seekTo(v, Math.min(0.2, dur / 2));
      const thumb = await makeThumb(v);
      await seekTo(v, 0);
      return {
        ...baseClip(),
        id,
        kind: "video",
        name,
        src: url,
        mediaDur: dur,
        inS: 0,
        outS: Math.min(dur, 8),
        zoom: false,
        thumb,
      };
    } catch (err) {
      URL.revokeObjectURL(url);
      urlsRef.current.delete(url);
      throw err;
    }
  };

  const addFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setPhase("reading");
    setNotice("");
    const made: Clip[] = [];
    const skipped: string[] = [];
    let gotSound = false;
    for (const f of arr.slice(0, 24)) {
      const name = f.name || "clip";
      try {
        if (f.type.startsWith("video/")) made.push(await clipFromVideo(f, name));
        else if (f.type.startsWith("image/")) made.push(await clipFromImage(f, name));
        else if (f.type.startsWith("audio/")) {
          setMusicFile(f);
          gotSound = true;
        } else skipped.push(name);
      } catch {
        skipped.push(name);
      }
      if (deadRef.current) return;
    }
    if (made.length) {
      setClips((prev) => {
        const next = [...prev, ...made];
        return next;
      });
      setSel(made[0].id);
      setEditorOpen(true);
    }
    setPhase("idle");
    if (skipped.length) {
      setNotice(
        `Could not read ${skipped.slice(0, 3).join(", ")}${skipped.length > 3 ? ` and ${skipped.length - 3} more` : ""}. Some phone formats need converting before a browser will open them.`
      );
    } else if (made.length) {
      setNotice(`Added ${made.length} ${made.length === 1 ? "clip" : "clips"}. They stayed on your device.`);
    } else if (gotSound) {
      setNotice("Track added. It stayed on your device.");
    }
  };

  const setMusicFile = (f: File) => {
    setMusic((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.url);
        urlsRef.current.delete(prev.url);
      }
      const url = URL.createObjectURL(f);
      urlsRef.current.add(url);
      return { url, name: f.name || "track" };
    });
  };

  const dropMusic = () => {
    setMusic((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.url);
        urlsRef.current.delete(prev.url);
      }
      return null;
    });
  };

  /* ------------------------------------------------------------ the auto reel */

  const gatherPhotos = async (limit: number): Promise<Clip[]> => {
    let sources: string[] = [];
    try {
      const ups = JSON.parse(window.localStorage.getItem("flowzone.uploads.v1") || "[]");
      if (Array.isArray(ups)) sources = ups.filter((u: unknown) => typeof u === "string").slice(0, limit);
    } catch {
      /* their own photos are a bonus, not a requirement */
    }
    if (sources.length < limit) {
      try {
        // A hung request would leave somebody watching Gathering forever, so it
        // gets a leash. No photos is a fine outcome, a dead button is not.
        const res = await fetch(`/api/moodboard?q=${encodeURIComponent(topic)}`, {
          signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
        });
        const data = await res.json();
        const shots: Shot[] = data && data.ok && Array.isArray(data.shots) ? data.shots : [];
        sources = sources.concat(
          shots.slice(0, limit - sources.length).map((s) => `/api/imageproxy?src=${encodeURIComponent(s.thumb)}`)
        );
      } catch {
        /* offline is not a dead end, the cards still carry it */
      }
    }
    // All at once, not one after another. Four photos queued up behind each
    // other is four chances to keep somebody waiting.
    const settled = await Promise.all(
      sources.map(async (u) => {
        try {
          const img = await loadImage(u);
          const cv = bake(img);
          const id = newId();
          mediaRef.current.set(id, cv);
          const clip: Clip = { ...baseClip(), id, kind: "image", name: "Flow photo", thumb: await makeThumb(cv) };
          return clip;
        } catch {
          return null;
          // One photo short is not a broken video. The cards carry the rest.
        }
      })
    );
    return settled.filter((c): c is Clip => c !== null);
  };

  const autoProject = async (line: string): Promise<Clip[]> => {
    const photos = await gatherPhotos(4);
    const captions = [line, "real thing. real feeling.", "you imagine it", "we get it moving"];
    photos.forEach((p, i) => {
      p.text = { ...defaultOverlay(captions[i] ?? line), size: 6.6 };
    });
    const open = cardClip((topic || "flow").toUpperCase(), 2200, 8.6);
    open.trans = "cut";
    const close = cardClip("made in flow mode · flowzone.dev", 2200, 4.6);
    if (photos.length) return [open, ...photos, close];
    // No photos got through. A video still comes back, the words just carry it.
    const filler = [line, LINES[0](topic || "the thing"), "made properly, in the browser"].map((t, i) =>
      cardClip(t, 2600, i === 0 ? 7 : 6)
    );
    return [open, ...filler, close];
  };

  /* ----------------------------------------------------------------- the export */

  const exportAbort = useRef(false);

  const mirror = useCallback(
    (src: HTMLCanvasElement) => {
      const cv = previewRef.current;
      if (!cv) return;
      if (cv.width !== previewSize.w || cv.height !== previewSize.h) {
        cv.width = previewSize.w;
        cv.height = previewSize.h;
      }
      const c = cv.getContext("2d");
      if (!c) return;
      try {
        c.drawImage(src, 0, 0, cv.width, cv.height);
      } catch {
        /* a frame missed on the preview is not worth stopping the render */
      }
    },
    [previewSize.w, previewSize.h]
  );

  const runExport = async (source?: Clip[]) => {
    const list = source ?? clips;
    if (!list.length) return;
    if (!canExport) {
      setPhase("failed");
      setNotice(
        caps.record
          ? "This browser will not let a canvas be recorded, so there is nothing to save. Everything else here works, and Chrome, Edge or Safari will export it."
          : "MediaRecorder is missing in this browser, so there is nothing to save the file with. Build the reel here, then open the same page in Chrome, Edge or Safari to export it."
      );
      return;
    }
    setPlaying(false);
    pauseAll();
    setPhase("exporting");
    setProgress(0);
    setNotice("");
    if (outUrlRef.current) {
      URL.revokeObjectURL(outUrlRef.current);
      outUrlRef.current = "";
      setOutUrl("");
    }

    const { slots, total } = layout(list);
    if (total > MAX_TOTAL_MS) {
      setPhase("failed");
      setNotice("That is over eight minutes. Trim it down, short form does not want it anyway.");
      return;
    }

    const W = proj.w;
    const H = proj.h;

    try {
      // Figtree may still be loading. Waiting means the words come out in the
      // right typeface instead of whatever the system had lying around.
      try {
        await document.fonts.ready;
      } catch {
        /* not every browser has this, no harm */
      }

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const c = canvas.getContext("2d");
      if (!c) throw new Error("no context");
      const stream = canvas.captureStream(30);

      // Only carry an audio track when there is something to hear. A silent
      // track added for nothing is a good way to make a recorder refuse.
      const wantsSound = Boolean(music) || list.some((cl) => cl.kind === "video" && !cl.muted);
      let soundless = false;
      if (wantsSound) {
        const a = ensureAudio();
        if (!a) soundless = true;
        else {
          try {
            if (a.ctx.state === "suspended") await a.ctx.resume();
            mediaRef.current.forEach((el) => {
              if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement) wireAudio(el);
            });
            if (musicRef.current) wireAudio(musicRef.current);
            const tracks = a.dest.stream.getAudioTracks();
            if (tracks.length) tracks.forEach((tr) => stream.addTrack(tr));
            else soundless = true;
          } catch {
            soundless = true;
          }
        }
      }

      let rec: MediaRecorder | null = null;
      let usedMime = "";
      for (const m of mimeCandidates()) {
        try {
          rec = m
            ? new MediaRecorder(stream, { mimeType: m, videoBitsPerSecond: bitrateFor(W, H) })
            : new MediaRecorder(stream);
          usedMime = m;
          break;
        } catch {
          // The browser said it supported this one and then would not build it.
          // Fine. Try the next.
        }
      }
      if (!rec) throw new Error("recorder unavailable");
      const recorder = rec;
      const outType = (recorder.mimeType || usedMime || "video/webm").split(";")[0];
      const chunks: BlobPart[] = [];
      let broke = false;
      let rolling = false;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) {
          chunks.push(e.data);
          rolling = true;
        }
      };
      recorder.onerror = () => {
        broke = true;
      };
      const finished = new Promise<Blob | null>((resolve) => {
        // A recorder that never fires onstop would leave a spinner forever.
        const guard = window.setTimeout(() => resolve(chunks.length ? new Blob(chunks, { type: outType }) : null), 15000);
        recorder.onstop = () => {
          window.clearTimeout(guard);
          resolve(new Blob(chunks, { type: outType }));
        };
      });

      // Park everything on its start frame before the tape rolls.
      for (const s of slots) {
        const el = mediaRef.current.get(s.clip.id);
        if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement) {
          el.pause();
          el.muted = s.clip.muted;
          try {
            el.currentTime = s.clip.inS;
          } catch {
            /* fine */
          }
        }
      }
      const firstEl = mediaRef.current.get(slots[0].clip.id);
      if (typeof HTMLVideoElement !== "undefined" && firstEl instanceof HTMLVideoElement) {
        await seekTo(firstEl, slots[0].clip.inS);
      }
      if (musicRef.current) {
        try {
          musicRef.current.currentTime = 0;
        } catch {
          /* fine */
        }
      }

      exportAbort.current = false;
      try {
        recorder.start(300);
      } catch {
        recorder.start();
      }

      // Encoders take a moment to wake up, and on a slow phone that moment can
      // swallow the whole reel. Hold the first frame until the recorder hands
      // over its first chunk, so nobody gets an empty file back.
      await new Promise<void>((resolve) => {
        const until = performance.now() + 1500;
        const warm = () => {
          drawFrame(c, W, H, slots, 0, getMedia, brand, calm);
          if (rolling || performance.now() >= until || deadRef.current) return resolve();
          window.requestAnimationFrame(warm);
        };
        window.requestAnimationFrame(warm);
      });

      const t0 = performance.now();
      let lastPct = -1;
      await new Promise<void>((resolve) => {
        const frame = () => {
          if (exportAbort.current || deadRef.current) return resolve();
          const t = Math.min(total, performance.now() - t0);
          syncMedia(slots, t, true);
          syncMusic(t, true);
          drawFrame(c, W, H, slots, t, getMedia, brand, calm);
          mirror(canvas);
          headRef.current = t;
          const pct = Math.min(99, Math.round((t / total) * 100));
          if (pct !== lastPct) {
            lastPct = pct;
            setProgress(pct);
            setHeadUi(t);
          }
          if (t >= total) return resolve();
          window.requestAnimationFrame(frame);
        };
        window.requestAnimationFrame(frame);
      });

      // Hold the last frame for a beat before cutting. A short reel can
      // otherwise stop before the encoder has handed over a single chunk, and
      // a person who made a two second clip deserves a file like anyone else.
      await new Promise<void>((resolve) => {
        const until = performance.now() + 700;
        const hold = () => {
          drawFrame(c, W, H, slots, total, getMedia, brand, calm);
          if (performance.now() >= until || deadRef.current) return resolve();
          window.requestAnimationFrame(hold);
        };
        window.requestAnimationFrame(hold);
      });
      try {
        recorder.requestData();
      } catch {
        /* not every browser has it, stop flushes anyway */
      }
      if (recorder.state !== "inactive") recorder.stop();
      pauseAll();
      const blob = await finished;
      if (deadRef.current) return;
      // A recorder that complained but still handed over bytes made a video.
      // Handing it over beats an error message about a file that exists.
      if (!blob || !blob.size) throw new Error(broke ? "recorder failed" : "empty recording");

      const url = URL.createObjectURL(blob);
      outUrlRef.current = url;
      setOutUrl(url);
      // Report the format the recorder actually produced, not the one we asked for.
      const gotMp4 = `${recorder.mimeType || ""} ${usedMime} ${blob.type}`.includes("mp4");
      const ext = gotMp4 ? "mp4" : "webm";
      setOutExt(ext);
      setOutWhy(
        soundless
          ? `${whyFor(ext)} This browser gave us no way to mix audio, so it came out silent.`
          : whyFor(ext)
      );
      setProgress(100);
      setPhase("done");
    } catch {
      pauseAll();
      if (deadRef.current) return;
      setPhase("failed");
      setNotice("Nothing came out of the recorder. A very short reel can do that, so try adding a second or two, or drop the size down, and it usually goes through.");
    }
  };

  /* ---------------------------------------------------------------- the actions */

  const writeForMe = () => {
    const next = (lineIdx + 1) % LINES.length;
    setLineIdx(next);
    const full = LINES[next](topic || "the thing");
    window.clearInterval(typerRef.current);
    if (calm) {
      setScript(full);
      return;
    }
    let i = 0;
    setScript("");
    typerRef.current = window.setInterval(() => {
      i += 2;
      setScript(full.slice(0, i));
      if (i >= full.length) window.clearInterval(typerRef.current);
    }, 24);
  };

  const generate = async () => {
    const line = script.trim() || `why ${topic || "this"} matters`;
    setPhase("gathering");
    setNotice("");
    let built: Clip[] = [];
    try {
      built = await autoProject(line);
    } catch {
      built = [];
    }
    if (deadRef.current) return;
    if (!built.length) {
      setPhase("failed");
      setNotice("Could not put that one together. Try again, or try different words.");
      return;
    }
    setClips(built);
    setSel(built[0].id);
    setEditorOpen(true);
    headRef.current = 0;
    setHeadUi(0);
    await runExport(built);
  };

  const addFlowScenes = async () => {
    setPhase("gathering");
    setNotice("");
    const photos = await gatherPhotos(4);
    if (deadRef.current) return;
    setPhase("idle");
    if (!photos.length) {
      setNotice("No photos came back for that word just now. Upload your own and carry on.");
      return;
    }
    photos.forEach((p) => {
      p.text = { ...defaultOverlay(""), size: 6.6 };
    });
    setClips((prev) => [...prev, ...photos]);
    setSel(photos[0].id);
    setEditorOpen(true);
  };

  const patchClip = (id: string, p: Partial<Clip>) =>
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)));

  const moveClip = (id: string, dir: -1 | 1) =>
    setClips((prev) => {
      const i = prev.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      const [x] = next.splice(i, 1);
      next.splice(j, 0, x);
      return next;
    });

  const reorderTo = (targetId: string) => {
    const from = dragId;
    setDragId(null);
    if (!from || from === targetId) return;
    setClips((prev) => {
      const i = prev.findIndex((c) => c.id === from);
      const j = prev.findIndex((c) => c.id === targetId);
      if (i < 0 || j < 0) return prev;
      const next = prev.slice();
      const [x] = next.splice(i, 1);
      next.splice(j, 0, x);
      return next;
    });
  };

  const duplicateClip = (id: string) => {
    const i = clips.findIndex((c) => c.id === id);
    if (i < 0) return;
    const copy: Clip = { ...clips[i], id: newId(), text: clips[i].text ? { ...clips[i].text! } : null };
    // The copy points at the same decoded media. Nothing is decoded twice, so
    // duplicating a 4K clip costs a row on the timeline and not a byte more.
    const el = mediaRef.current.get(id);
    if (el) mediaRef.current.set(copy.id, el);
    const next = clips.slice();
    next.splice(i + 1, 0, copy);
    setClips(next);
    setSel(copy.id);
  };

  const deleteClip = (id: string) => {
    const i = clips.findIndex((c) => c.id === id);
    if (i < 0) return;
    const gone = clips[i];
    const el = mediaRef.current.get(id);
    // A duplicate shares the same decoded media, so only the last one out
    // turns the lights off. Otherwise deleting a copy would blank its twin.
    const shared = clips.some((c) => c.id !== id && el && mediaRef.current.get(c.id) === el);
    if (!shared) {
      if (typeof HTMLVideoElement !== "undefined" && el instanceof HTMLVideoElement) {
        try {
          el.pause();
          el.removeAttribute("src");
          el.load();
        } catch {
          /* going anyway */
        }
      }
      mediaRef.current.delete(id);
      if (gone.src) {
        URL.revokeObjectURL(gone.src);
        urlsRef.current.delete(gone.src);
      }
    } else {
      mediaRef.current.delete(id);
    }
    const next = clips.filter((c) => c.id !== id);
    setClips(next);
    setSel(next.length ? next[Math.min(i, next.length - 1)].id : null);
  };

  const scrub = (v: number) => {
    setPlaying(false);
    const t = clampNum(v, 0, lay.total);
    headRef.current = t;
    setHeadUi(t);
  };

  const jumpToClip = (i: number) => {
    if (!lay.slots[i]) return;
    setSel(lay.slots[i].clip.id);
    scrub(lay.slots[i].start + 1);
  };

  const busy = phase === "gathering" || phase === "exporting" || phase === "reading";

  /* --------------------------------------------------------------------- view */

  return (
    <div id="make-video" className="mt-6 scroll-mt-28">
      <p className="label mb-3">Now make it move</p>

      <div className="max-w-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              value={script}
              onChange={(e) => setScript(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !busy && (clips.length ? runExport() : generate())}
              placeholder={`A video of why ${topic} matters...`}
              aria-label="Describe the video to generate"
              className="w-full bg-paper-deep/80 text-ink placeholder-ink-mute border border-rule pl-5 pr-32 py-3.5 text-sm font-light outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={writeForMe}
              type="button"
              title="Let the little writer do it"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs border border-rule text-ink-soft px-3 py-1.5 rounded-lg hover:text-ink hover:border-accent transition-colors"
            >
              Write it for me
            </button>
          </div>
          <button
            onClick={() => (clips.length ? runExport() : generate())}
            disabled={busy}
            className="btn-primary shine !px-5 !py-3 text-sm disabled:opacity-60"
          >
            {phase === "gathering"
              ? "Gathering..."
              : phase === "reading"
                ? "Reading files..."
                : phase === "exporting"
                  ? `Filming ${progress}%`
                  : clips.length
                    ? "Export the video"
                    : "Generate the video"}
          </button>
        </div>

        {clips.length > 0 && selected && script.trim().length > 0 && (
          <button
            type="button"
            onClick={() => patchClip(selected.id, { text: { ...(selected.text ?? defaultOverlay("")), text: script.trim() } })}
            className="btn-ghost !px-4 !py-2.5 !min-h-[44px] text-xs mt-3"
          >
            Put those words on clip {selIndex + 1}
          </button>
        )}
      </div>

      {/* Bring your own footage. This is the part that never touches a server. */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`mt-4 max-w-xl rounded-[18px] border border-dashed p-4 sm:p-5 transition-colors ${
          dragOver ? "border-accent bg-accent/10" : "border-white/25"
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon name="box" size={22} color="#5B8CFF" />
          <div className="min-w-0">
            <p className="text-sm text-ink">Drop your own clips and photos in here</p>
            <p className="text-xs text-ink-mute mt-1">
              Video, photos, or a music track. Everything is read straight off your device and drawn on
              this page. Nothing is uploaded, nothing is stored, nothing leaves the phone.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <label className="btn-ghost !px-4 !py-2.5 !min-h-[44px] text-xs cursor-pointer">
                Choose files
                <input
                  type="file"
                  accept="video/*,image/*,audio/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {clips.length > 0 && (
                <button
                  type="button"
                  onClick={addFlowScenes}
                  disabled={busy}
                  className="btn-ghost !px-4 !py-2.5 !min-h-[44px] text-xs disabled:opacity-60"
                >
                  Add flow scenes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {notice && <p className="text-sm text-ink-soft font-light mt-4 max-w-xl">{notice}</p>}

      {caps.checked && !canExport && (
        <p className="text-sm text-ink-soft font-light mt-4 max-w-xl">
          This browser cannot record video, so there is no export here. You can still build the whole
          reel and watch it back. Open the same page in Chrome, Edge or Safari to save the file.
        </p>
      )}

      {editorOpen && clips.length > 0 && (
        <div className="mt-6 max-w-5xl">
          {/* Shape */}
          <div className="panel p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="ruler" size={22} color="#5B8CFF" />
              <span className="label">What shape is it</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormatId(f.id)}
                  aria-pressed={formatId === f.id}
                  className={`min-h-[44px] px-4 text-sm rounded-[11px] border transition-colors ${
                    formatId === f.id
                      ? "border-accent text-ink bg-accent/15"
                      : "border-white/22 text-ink-soft hover:text-ink hover:border-accent"
                  }`}
                >
                  {f.label}
                  <span className="block text-[10px] text-ink-mute">{f.note}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormatId("custom")}
                aria-pressed={formatId === "custom"}
                className={`min-h-[44px] px-4 text-sm rounded-[11px] border transition-colors ${
                  formatId === "custom"
                    ? "border-accent text-ink bg-accent/15"
                    : "border-white/22 text-ink-soft hover:text-ink hover:border-accent"
                }`}
              >
                Custom
                <span className="block text-[10px] text-ink-mute">Your numbers</span>
              </button>
            </div>
            {formatId === "custom" && (
              <div className="flex flex-wrap items-end gap-3 mt-4">
                <div>
                  <label htmlFor="reel-w" className="block text-xs text-ink-soft mb-1">
                    Width
                  </label>
                  <input
                    id="reel-w"
                    type="number"
                    inputMode="numeric"
                    min={240}
                    max={2160}
                    value={customW}
                    onChange={(e) => setCustomW(e.target.value)}
                    className="w-28 bg-paper-deep/80 text-ink border border-rule px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <span className="text-ink-mute pb-3">x</span>
                <div>
                  <label htmlFor="reel-h" className="block text-xs text-ink-soft mb-1">
                    Height
                  </label>
                  <input
                    id="reel-h"
                    type="number"
                    inputMode="numeric"
                    min={240}
                    max={2160}
                    value={customH}
                    onChange={(e) => setCustomH(e.target.value)}
                    className="w-28 bg-paper-deep/80 text-ink border border-rule px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-ink-mute mt-3">
              Making {proj.w} by {proj.h}. Change it any time, the preview and the file both follow.
            </p>
          </div>

          {/* The picture */}
          <div className="panel p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="clapper" size={22} color="#5B8CFF" />
              <span className="label">The timeline</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div
                className="mx-auto md:mx-0 shrink-0 rounded-[11px] overflow-hidden border border-white/15 bg-paper"
                style={{ width: "min(100%, 260px)" }}
              >
                <canvas
                  ref={previewRef}
                  className="block w-full h-auto"
                  style={{ aspectRatio: `${proj.w} / ${proj.h}` }}
                  aria-label="Reel preview"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!playing && headRef.current >= lay.total - 20) scrub(0);
                      setPlaying((p) => !p);
                    }}
                    className="btn-primary !px-5 !py-2.5 !min-h-[44px] text-sm"
                  >
                    {playing ? "Pause" : "Play"}
                  </button>
                  <span className="text-xs text-ink-soft tabular-nums">
                    {fmtTime(headUi)} / {fmtTime(lay.total)}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.round(lay.total))}
                  step={10}
                  value={Math.round(clampNum(headUi, 0, lay.total))}
                  aria-label="Scrub the playhead"
                  onChange={(e) => scrub(parseInt(e.target.value, 10))}
                  className="w-full h-11 mt-2 accent-[#5B8CFF] bg-transparent"
                />

                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {clips.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      draggable
                      onDragStart={() => setDragId(c.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        reorderTo(c.id);
                      }}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => jumpToClip(i)}
                      aria-label={`Clip ${i + 1}, ${c.name}, ${fmtSecs(clipMs(c))}`}
                      aria-pressed={sel === c.id}
                      className={`shrink-0 w-[96px] rounded-[11px] border overflow-hidden text-left transition-colors ${
                        sel === c.id ? "border-accent" : "border-white/22 hover:border-accent"
                      } ${activeIdx === i ? "ring-1 ring-accent-pale/70" : ""}`}
                    >
                      {c.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.thumb} alt="" className="w-full h-[62px] object-cover" />
                      ) : (
                        <span
                          className="flex h-[62px] items-center justify-center text-[9px] uppercase tracking-label text-accent-pale px-1 text-center"
                          style={{ background: "linear-gradient(150deg,#1E3A8A,#0C1424)" }}
                        >
                          {c.kind === "card" ? "Card" : "Clip"}
                        </span>
                      )}
                      <span className="flex items-center justify-between px-1.5 py-1 text-[10px] text-ink-soft">
                        <span>{i + 1}</span>
                        <span className="tabular-nums">{fmtSecs(clipMs(c))}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-ink-mute">
                  {clips.length} {clips.length === 1 ? "clip" : "clips"}, {fmtSecs(lay.total)} in total. Tap one to
                  edit it. Drag to reorder on a desktop, or use Earlier and Later below.
                </p>
              </div>
            </div>
          </div>

          {selected && selIndex >= 0 && (
            <ReelClipInspector
              clip={selected}
              index={selIndex}
              count={clips.length}
              onPatch={(p) => patchClip(selected.id, p)}
              onMove={(d) => moveClip(selected.id, d)}
              onDuplicate={() => duplicateClip(selected.id)}
              onDelete={() => deleteClip(selected.id)}
            />
          )}

          {/* Sound */}
          <div className="panel p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="wave" size={22} color="#5B8CFF" />
              <span className="label">Sound</span>
            </div>
            {music ? (
              <div>
                <p className="text-sm text-ink truncate">{music.name}</p>
                <audio ref={musicRef} src={music.url} controls className="w-full mt-3" preload="auto" />
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-ink-soft mb-1">
                    <span>Volume</span>
                    <span className="text-ink">{Math.round(musicVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={musicVol}
                    aria-label="Track volume"
                    onChange={(e) => setMusicVol(parseFloat(e.target.value))}
                    className="w-full h-11 accent-[#5B8CFF] bg-transparent"
                  />
                </div>
                <button type="button" onClick={dropMusic} className="btn-ghost !px-4 !py-2 !min-h-[44px] text-xs mt-2">
                  Take the track off
                </button>
                <p className="text-xs text-ink-mute mt-3">
                  The track runs from the top of the reel and gets mixed into the file. Clip sound stays
                  on unless you turn it off on the clip.
                </p>
              </div>
            ) : (
              <div>
                <label className="btn-ghost !px-4 !py-2.5 !min-h-[44px] text-xs cursor-pointer inline-flex">
                  Add a track
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) {
                        setMusicFile(f);
                        setNotice("Track added. It stayed on your device.");
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="text-xs text-ink-mute mt-3">
                  Any music file off your device. It gets mixed into the export, not dropped.
                </p>
              </div>
            )}
          </div>

          {/* Out */}
          <div className="panel p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="download" size={22} color="#5B8CFF" />
              <span className="label">Take it away</span>
            </div>
            <p className="text-sm text-ink-soft font-light">
              {proj.w} by {proj.h}, {fmtSecs(lay.total)}, rendered here on your device.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => runExport()}
                disabled={busy || !canExport}
                className="btn-primary shine !px-5 !py-2.5 !min-h-[44px] text-sm disabled:opacity-60"
              >
                {phase === "exporting" ? `Filming ${progress}%` : "Export the video"}
              </button>
              <button
                type="button"
                onClick={() => setBrand((b) => !b)}
                aria-pressed={brand}
                className={`min-h-[44px] px-4 text-sm rounded-[11px] border transition-colors ${
                  brand
                    ? "border-accent text-ink bg-accent/15"
                    : "border-white/22 text-ink-soft hover:text-ink hover:border-accent"
                }`}
              >
                {brand ? "Flow mark on" : "Flow mark off"}
              </button>
              {phase === "exporting" && (
                <button
                  type="button"
                  onClick={() => {
                    exportAbort.current = true;
                  }}
                  className="btn-ghost !px-4 !py-2.5 !min-h-[44px] text-xs"
                >
                  Stop
                </button>
              )}
            </div>
            <p className="text-xs text-ink-mute mt-3">
              It films in real time, so a {fmtSecs(lay.total)} reel takes about {fmtSecs(lay.total)}. Keep this
              tab in front while it runs.
            </p>
          </div>
        </div>
      )}

      {busy && (
        <div className="mt-4 max-w-5xl h-[3px] rounded-full bg-rule overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${phase === "exporting" ? progress : 12}%`,
              background: "linear-gradient(90deg,#1E3A8A,#5B9BF9,#C6E4F8)",
            }}
          />
        </div>
      )}

      {outUrl && phase !== "exporting" && (
        <div className="mt-5 max-w-5xl">
          <video
            src={outUrl}
            controls
            loop
            playsInline
            className="w-full max-w-[320px] rounded-2xl border border-white/15 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.85)]"
          />
          <p className="text-xs text-ink-mute mt-3 max-w-xl">
            {outWhy}
            {phase !== "done" ? " This is your last export. Change anything and export again to catch it up." : ""}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href={outUrl}
              download={`${safeName(topic)}-reel-${proj.w}x${proj.h}.${outExt}`}
              className="btn-primary !px-5 !py-2.5 !min-h-[44px] text-sm"
            >
              Keep the video
            </a>
            <button type="button" onClick={() => runExport()} className="btn-ghost !px-5 !py-2.5 !min-h-[44px] text-sm">
              Roll another take <span className="arrow">→</span>
            </button>
          </div>

          {/* Only after phase "done", so a half finished or failed render never
              gets an ask. This is the single biggest moment on the site: they
              have a real video file, made from nothing, and the very next
              thought is whether it is good enough to post. The video cannot
              travel in a mailto, so the mail carries the script and the edit,
              which is enough for a useful answer. */}
          {phase === "done" && (
            <AskAboutThis
              id="video-export"
              icon="clapper"
              subject={`Would you post this? ${safeName(topic).replace(/-/g, " ")}`}
              title="Would you post it?"
              note="Send the edit to Denny before it goes out. He cuts these for clients and he will say what he would trim, free, no obligation."
              body={() =>
                askBody({
                  opener: `I just exported a reel in Flow Mode. I cannot attach the file to this, so here is the edit it came from. Say the word and I will send you the video.`,
                  sections: [
                    { label: "What it is about", text: topic.trim() },
                    {
                      label: "The cut",
                      text: `${clips.length} clips, ${fmtSecs(lay.total)}, ${proj.w} by ${proj.h}${music ? `, music: ${music.name}` : ", no music"}`,
                    },
                    { label: "The script", text: script.trim() },
                    {
                      label: "Shot by shot",
                      text: clips
                        .map((c, i) => `${i + 1}. ${c.name}${c.text?.text ? ` / on screen: ${c.text.text}` : ""}`)
                        .join("\n"),
                    },
                  ],
                  unsure: "What I am worried about:",
                })
              }
              className="mt-5"
            />
          )}
        </div>
      )}
    </div>
  );
}
