"use client";
import { useEffect, useRef, useState } from "react";

/**
 * The meme maker.
 *
 * Half the reason a small business needs a brand is that it has to post things,
 * and posting is where most of them stall. So the toolkit that makes the logo
 * also makes the thing they will actually publish this week.
 *
 * Canvas only. The image can come from the reference search or straight off
 * their machine, nothing is uploaded anywhere, and the export is a real PNG.
 */

export default function MemeMaker({
  src,
  brandColor,
}: {
  src: string | null;
  brandColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [top, setTop] = useState("WHEN THE BRIEF SAYS");
  const [bottom, setBottom] = useState("MAKE IT POP");
  const [local, setLocal] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const image = local || src;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    // Needed so the canvas stays exportable when the picture is remote.
    img.crossOrigin = "anonymous";
    setError("");
    setReady(false);

    img.onload = () => {
      const W = 900;
      const scale = W / img.width;
      const H = Math.round(img.height * scale);
      canvas.width = W;
      canvas.height = H;
      ctx.drawImage(img, 0, 0, W, H);

      const draw = (text: string, atTop: boolean) => {
        if (!text.trim()) return;
        const size = Math.max(30, Math.round(W / 12));
        ctx.font = `700 ${size}px Poppins, Impact, sans-serif`;
        ctx.textAlign = "center";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(6, size / 7);
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#FFF";

        // Wrap by hand, because a meme with one line running off the edge is
        // the single most common way these come out broken.
        const words = text.toUpperCase().split(/\s+/);
        const lines: string[] = [];
        let cur = "";
        words.forEach((w) => {
          const test = cur ? `${cur} ${w}` : w;
          if (ctx.measureText(test).width > W - 60 && cur) {
            lines.push(cur);
            cur = w;
          } else cur = test;
        });
        if (cur) lines.push(cur);

        lines.forEach((ln, i) => {
          const y = atTop
            ? 24 + size + i * (size + 6)
            : H - 26 - (lines.length - 1 - i) * (size + 6);
          ctx.strokeText(ln, W / 2, y);
          ctx.fillText(ln, W / 2, y);
        });
      };

      draw(top, true);
      draw(bottom, false);

      // A quiet brand bar, so the thing they post is still theirs.
      ctx.fillStyle = brandColor;
      ctx.fillRect(0, H - 8, W, 8);
      setReady(true);
    };

    img.onerror = () => {
      setError("That image would not load for editing. Try another, or upload one.");
      setReady(false);
    };

    img.src = image;
  }, [image, top, bottom, brandColor]);

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    try {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "flowzone-meme.png";
      a.click();
    } catch {
      setError("That image is protected, so it cannot be exported. Upload one instead.");
    }
  };

  return (
    <div>
      {!image && (
        <p className="text-sm text-ink-soft font-light leading-relaxed mb-4">
          Pick any picture from the references above, or upload one, and it lands here
          ready to caption.
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <label className="text-xs border border-rule text-ink-soft px-3.5 py-2 hover:text-ink hover:bg-raised transition-colors cursor-pointer">
          Upload a picture
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setLocal(URL.createObjectURL(f));
            }}
          />
        </label>
        {local && (
          <button
            onClick={() => setLocal(null)}
            className="text-xs border border-rule text-ink-mute px-3.5 py-2 hover:text-ink-soft transition-colors"
          >
            Use the selected reference instead
          </button>
        )}
      </div>

      {image && (
        <>
          <div className="grid sm:grid-cols-2 gap-2 mb-4">
            <input
              value={top}
              onChange={(e) => setTop(e.target.value)}
              placeholder="Top line"
              className="bg-paper-deep text-ink placeholder-ink-mute border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors"
            />
            <input
              value={bottom}
              onChange={(e) => setBottom(e.target.value)}
              placeholder="Bottom line"
              className="bg-paper-deep text-ink placeholder-ink-mute border border-rule px-3.5 py-2.5 text-sm font-light outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="border border-rule overflow-hidden mb-3">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          {error && <p className="text-[12px] text-[#FBBF24] mb-3">{error}</p>}

          <button onClick={save} disabled={!ready} className="btn-primary !px-4 !py-2.5 text-xs disabled:opacity-50">
            Download PNG <span className="arrow">→</span>
          </button>
        </>
      )}
    </div>
  );
}
