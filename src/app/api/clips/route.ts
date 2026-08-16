import { NextRequest, NextResponse } from "next/server";

/**
 * Ambient footage for Flow Mode.
 *
 * When a Pexels key is configured, this returns a short real video clip
 * for whatever the visitor typed, and Flow Mode plays it full screen
 * behind the page: type bread, be surrounded by bread. Without the key
 * it politely returns nothing and the page stays still.
 *
 * Pexels only. No scraping: platforms that forbid reuse are not sources.
 */

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 120);
  const key = process.env.PEXELS_API_KEY;
  if (!q) return NextResponse.json({ ok: false, error: "no query" }, { status: 400 });
  if (!key) return NextResponse.json({ ok: false, error: "no video source configured" });

  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape`,
      {
        headers: { Authorization: key, accept: "application/json" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) throw new Error(`pexels videos ${res.status}`);
    const data = await res.json();
    const clips = (data.videos || [])
      .map((v: any) => {
        const files = (v.video_files || [])
          .filter((f: any) => f.file_type === "video/mp4" && f.width && f.width <= 1400)
          .sort((a: any, b: any) => b.width - a.width);
        return files[0]
          ? {
              id: String(v.id),
              url: String(files[0].link),
              width: files[0].width,
              height: files[0].height,
              creator: String(v.user?.name || "Pexels").slice(0, 60),
            }
          : null;
      })
      .filter(Boolean)
      .slice(0, 4);

    if (!clips.length) return NextResponse.json({ ok: false, error: "no clips" });
    return NextResponse.json({ ok: true, q, clips });
  } catch (e) {
    console.error("[FlowZone] clips failed:", e);
    return NextResponse.json({ ok: false, error: "clip service unavailable" });
  }
}
