import { NextRequest, NextResponse } from "next/server";

/**
 * Real references, pulled live from the open web.
 *
 * The playground can generate a mark and a palette on its own, but it cannot
 * invent taste, and staring at generated shapes does not give anybody ideas.
 * What gives people ideas is seeing real things other people made. So this
 * fetches actual photographs for whatever words they type.
 *
 * Openverse indexes openly licensed work across Flickr, museums and the like.
 * It needs no key, which matters: a reference tool that quietly costs money per
 * click is a tool that gets switched off later.
 *
 * Attribution comes back with every image and is shown, because using someone's
 * work without crediting them is exactly the behaviour this studio argues
 * against everywhere else on the site.
 */

export const revalidate = 3600;

type Shot = {
  id: string;
  url: string;
  thumb: string;
  title: string;
  creator: string;
  license: string;
  source: string;
};

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 120);
  if (!q) {
    return NextResponse.json({ ok: false, error: "no query" }, { status: 400 });
  }

  const url =
    "https://api.openverse.org/v1/images/?" +
    new URLSearchParams({
      q,
      page_size: "12",
      license_type: "commercial,modification",
      mature: "false",
    }).toString();

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "FlowZone/1.0 (+https://flowzone.dev)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `reference service returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const shots: Shot[] = (data.results || [])
      .filter((r: any) => r && (r.thumbnail || r.url))
      .slice(0, 12)
      .map((r: any) => ({
        id: String(r.id),
        url: String(r.url || r.thumbnail),
        thumb: String(r.thumbnail || r.url),
        title: String(r.title || "Untitled").slice(0, 90),
        creator: String(r.creator || "Unknown").slice(0, 60),
        license: `${String(r.license || "").toUpperCase()} ${String(r.license_version || "")}`.trim(),
        source: String(r.foreign_landing_url || r.source || ""),
      }));

    return NextResponse.json({ ok: true, q, count: shots.length, shots });
  } catch (e) {
    console.error("[FlowZone] moodboard failed:", e);
    return NextResponse.json(
      { ok: false, error: "Could not reach the reference service just now." },
      { status: 502 }
    );
  }
}
