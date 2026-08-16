import { NextRequest, NextResponse } from "next/server";

/**
 * Same-origin image pass-through for the video maker.
 *
 * The reel renders photographs onto a canvas and records the canvas as a
 * real video file. Browsers refuse to record a canvas that has touched a
 * cross-origin image, so the openly licensed photos come through here and
 * arrive same-origin.
 *
 * Locked to the reference service's hosts. This is a pass-through for one
 * feature, not an open proxy.
 */

const ALLOWED_HOSTS = new Set([
  "api.openverse.org",
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "images.pexels.com",
]);

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src") || "";
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ ok: false, error: "bad url" }, { status: 400 });
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    return NextResponse.json({ ok: false, error: "host not allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { "user-agent": "FlowZone/1.0 (+https://flowzone.dev)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok || !res.body) {
      return NextResponse.json({ ok: false, error: `upstream ${res.status}` }, { status: 502 });
    }
    const type = res.headers.get("content-type") || "image/jpeg";
    if (!type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "not an image" }, { status: 400 });
    }
    return new NextResponse(res.body, {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "fetch failed" }, { status: 502 });
  }
}
