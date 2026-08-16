"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Type what the video should say. Get a video.
 *
 * A real one: a vertical reel rendered live in the visitor's browser from
 * real photographs of their thing, with their words as title cards, in the
 * studio's colours, then handed over as a file they keep. Canvas paints the
 * frames, MediaRecorder records the canvas. No render farm, no key, no
 * cost, works offline once the photos are in.
 *
 * This is the whole studio pitch in miniature: arrive with a sentence,
 * leave with the running thing.
 */

type Shot = { id: string; thumb: string };

const W = 720;
const H = 1280;
const SCENE_MS = 3000;
const CARD_MS = 2200;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function wrap(c: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (c.measureText(t).width > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = t;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

/**
 * The little writer. Type nothing, press the wand, get a line worth
 * filming. Runs on templates and the visitor's own topic, so it is
 * instant, free, and different every press.
 */
const LINES = [
  (t: string) => `why ${t} deserves more credit than it gets`,
  (t: string) => `the feeling of walking into a place that takes ${t} seriously`,
  (t: string) => `what makes people fall in love with ${t}`,
  (t: string) => `${t}, done properly, changes someone's whole day`,
  (t: string) => `nobody needed ${t} until they saw it done right`,
  (t: string) => `the difference between ${t} and great ${t}`,
  (t: string) => `this is your sign to finally start the ${t} thing`,
  (t: string) => `${t} is not a product, it is a mood`,
];

export default function VideoSpark({ topic }: { topic: string }) {
  const [prompt, setPrompt] = useState("");
  const [lineIdx, setLineIdx] = useState(-1);
  const typerRef = useRef<number | undefined>(undefined);
  const [phase, setPhase] = useState<"idle" | "loading" | "rendering" | "done" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [ext, setExt] = useState("webm");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abort = useRef(false);

  useEffect(() => {
    return () => {
      abort.current = true;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** The wand: pick the next line, type it in like a tiny ghostwriter. */
  const writeForMe = () => {
    const next = (lineIdx + 1) % LINES.length;
    setLineIdx(next);
    const full = LINES[next](topic || "the thing");
    window.clearInterval(typerRef.current);
    let i = 0;
    setPrompt("");
    typerRef.current = window.setInterval(() => {
      i += 2;
      setPrompt(full.slice(0, i));
      if (i >= full.length) window.clearInterval(typerRef.current);
    }, 24);
  };

  const supported =
    typeof window !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    "captureStream" in HTMLCanvasElement.prototype &&
    typeof MediaRecorder !== "undefined";

  const make = async () => {
    const line = prompt.trim() || `why ${topic} matters`;
    setPhase("loading");
    setProgress(0);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl("");
    }

    try {
      // 1. The visitor's own photos first, then real photographs of the thing.
      let sources: string[] = [];
      try {
        const ups = JSON.parse(window.localStorage.getItem("flowzone.uploads.v1") || "[]");
        if (Array.isArray(ups)) sources = ups.slice(0, 4);
      } catch {
        /* ignore */
      }
      if (sources.length < 4) {
        try {
          const res = await fetch(`/api/moodboard?q=${encodeURIComponent(topic)}`);
          const data = await res.json();
          const shots: Shot[] = (data.ok ? data.shots : []).slice(0, 4 - sources.length);
          sources = sources.concat(
            shots.map((s) => `/api/imageproxy?src=${encodeURIComponent(s.thumb)}`)
          );
        } catch {
          /* their own photos may be enough */
        }
      }
      if (!sources.length) throw new Error("no shots");

      const imgs: HTMLImageElement[] = [];
      await Promise.all(
        sources.map(
          (u) =>
            new Promise<void>((resolve) => {
              const im = new Image();
              im.onload = () => {
                imgs.push(im);
                resolve();
              };
              im.onerror = () => resolve();
              im.src = u;
            })
        )
      );
      if (!imgs.length) throw new Error("no images loaded");

      // 2. The script: their words become the cards.
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("no canvas");
      canvas.width = W;
      canvas.height = H;
      const c = canvas.getContext("2d");
      if (!c) throw new Error("no context");

      const scenes: Array<{ kind: "card" | "photo"; text: string; img?: HTMLImageElement; ms: number }> = [
        { kind: "card", text: topic.toUpperCase(), ms: CARD_MS },
        ...imgs.map((im, i) => ({
          kind: "photo" as const,
          img: im,
          text: i === 0 ? line : i === 1 ? "real thing. real feeling." : i === 2 ? "you imagine it" : "we get it moving",
          ms: SCENE_MS,
        })),
        { kind: "card", text: "made in flow mode · flowzone.dev", ms: CARD_MS },
      ];
      const total = scenes.reduce((n, s) => n + s.ms, 0);

      // 3. Record the canvas as an actual file. Browsers disagree about
      // formats, so try progressively simpler options until one takes.
      const stream = canvas.captureStream(30);
      const attempts: MediaRecorderOptions[] = [
        { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 5_000_000 },
        { mimeType: "video/webm", videoBitsPerSecond: 5_000_000 },
        { mimeType: "video/mp4" },
        {},
      ];
      let rec: MediaRecorder | null = null;
      for (const opt of attempts) {
        try {
          rec = new MediaRecorder(stream, opt);
          break;
        } catch {
          /* try the next shape */
        }
      }
      if (!rec) throw new Error("recorder unavailable");
      const outType = rec.mimeType || "video/webm";
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const finished = new Promise<Blob>((resolve) => {
        rec!.onstop = () => resolve(new Blob(chunks, { type: outType.split(";")[0] }));
      });

      setPhase("rendering");
      try {
        rec.start(250);
      } catch {
        rec.start();
      }
      const t0 = performance.now();

      await new Promise<void>((resolve) => {
        const frame = (now: number) => {
          const t = now - t0;
          if (abort.current) return resolve();
          if (t >= total) return resolve();
          setProgress(Math.min(99, Math.round((t / total) * 100)));

          // Which scene are we in
          let acc = 0;
          let sc = scenes[scenes.length - 1];
          let local = 1;
          for (const s of scenes) {
            if (t < acc + s.ms) {
              sc = s;
              local = (t - acc) / s.ms;
              break;
            }
            acc += s.ms;
          }

          // Paint
          c.fillStyle = "#0C1424";
          c.fillRect(0, 0, W, H);

          if (sc.kind === "photo" && sc.img) {
            const im = sc.img;
            const zoom = 1.08 + ease(local) * 0.12;
            const iw = im.width;
            const ih = im.height;
            const scale = Math.max(W / iw, H / ih) * zoom;
            const dw = iw * scale;
            const dh = ih * scale;
            const dx = (W - dw) / 2 + Math.sin(local * Math.PI) * 14;
            const dy = (H - dh) / 2 - ease(local) * 26;
            c.drawImage(im, dx, dy, dw, dh);
            // navy wash top and bottom so the words always read
            const g = c.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, "rgba(12,20,36,0.55)");
            g.addColorStop(0.35, "rgba(12,20,36,0)");
            g.addColorStop(0.68, "rgba(12,20,36,0)");
            g.addColorStop(1, "rgba(12,20,36,0.82)");
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
          } else {
            // brand card: aurora glow
            const g1 = c.createRadialGradient(W * 0.2, -100, 60, W * 0.2, -100, 900);
            g1.addColorStop(0, "rgba(91,155,249,0.5)");
            g1.addColorStop(1, "rgba(12,20,36,0)");
            c.fillStyle = g1;
            c.fillRect(0, 0, W, H);
            const g2 = c.createRadialGradient(W * 0.9, H + 80, 60, W * 0.9, H + 80, 800);
            g2.addColorStop(0, "rgba(30,58,138,0.6)");
            g2.addColorStop(1, "rgba(12,20,36,0)");
            c.fillStyle = g2;
            c.fillRect(0, 0, W, H);
          }

          // three dots, always
          const dotY = 108;
          const cx = W / 2;
          const r = 9;
          const cols = ["#1E3A8A", "#5B9BF9", "#C6E4F8"];
          c.strokeStyle = "rgba(221,238,251,0.7)";
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(cx - 36 + r, dotY);
          c.lineTo(cx + 36 - r, dotY);
          c.stroke();
          cols.forEach((col, i) => {
            const pulse = 1 + 0.18 * Math.max(0, Math.sin((t / 600) * Math.PI - i * 0.9));
            c.fillStyle = col;
            c.beginPath();
            c.arc(cx - 36 + i * 36, dotY, r * pulse, 0, Math.PI * 2);
            c.fill();
          });

          // words
          const appear = ease(Math.min(1, local * 2.2));
          c.globalAlpha = appear;
          c.fillStyle = "#F1F3F7";
          c.textAlign = "center";
          const big = sc.kind === "card";
          c.font = `600 ${big ? 64 : 52}px Poppins, system-ui, sans-serif`;
          const lines = wrap(c, sc.text, W - 130);
          const lh = big ? 78 : 64;
          const baseY = big ? H / 2 - ((lines.length - 1) * lh) / 2 : H - 210 - (lines.length - 1) * lh;
          lines.forEach((ln, i) => {
            c.fillText(ln, W / 2, baseY + i * lh + (1 - appear) * 28);
          });
          c.globalAlpha = 1;

          window.requestAnimationFrame(frame);
        };
        window.requestAnimationFrame(frame);
      });

      rec.stop();
      const blob = await finished;
      if (abort.current) return;
      setExt(blob.type.includes("mp4") ? "mp4" : "webm");
      setVideoUrl(URL.createObjectURL(blob));
      setProgress(100);
      setPhase("done");
    } catch {
      setPhase("failed");
    }
  };

  if (!supported) return null;

  return (
    <div className="mt-6 max-w-xl">
      <p className="label mb-3">Now make it move</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && phase !== "rendering" && phase !== "loading" && make()}
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
          onClick={make}
          disabled={phase === "rendering" || phase === "loading"}
          className="btn-primary shine !px-5 !py-3 text-sm disabled:opacity-60"
        >
          {phase === "loading" ? "Gathering..." : phase === "rendering" ? `Filming ${progress}%` : "Generate the video"}
        </button>
      </div>

      {(phase === "rendering" || phase === "loading") && (
        <div className="mt-4 h-[3px] rounded-full bg-rule overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#1E3A8A,#5B9BF9,#C6E4F8)" }}
          />
        </div>
      )}
      {phase === "failed" && (
        <p className="text-sm text-ink-soft font-light mt-4">
          Could not pull photos for that just now. Try again, or try different words.
        </p>
      )}

      {/* The working surface. Visible while filming so the generation IS the show. */}
      <canvas
        ref={canvasRef}
        className={`mt-5 w-full max-w-[300px] rounded-2xl border border-white/15 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.85)] ${
          phase === "rendering" ? "block" : "hidden"
        }`}
      />

      {phase === "done" && videoUrl && (
        <div className="mt-5">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[300px] rounded-2xl border border-white/15 shadow-[0_40px_80px_-28px_rgba(0,0,0,0.85)]"
          />
          <div className="flex gap-3 mt-4">
            <a
              href={videoUrl}
              download={`${topic.replace(/\s+/g, "-")}-reel.${ext}`}
              className="btn-primary !px-5 !py-2.5 text-sm"
            >
              Keep the video
            </a>
            <button onClick={make} className="btn-ghost !px-5 !py-2.5 text-sm">
              Roll another take <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
