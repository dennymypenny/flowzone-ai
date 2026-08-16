import { NextRequest, NextResponse } from "next/server";

/**
 * Real references, pulled live from the open web.
 *
 * The playground can generate a mark and a palette on its own, but it cannot
 * invent taste, and staring at generated shapes does not give anybody ideas.
 * What gives people ideas is seeing real things other people made. So this
 * fetches actual photographs for whatever words they type.
 *
 * Two keyless sources, tried in order. Openverse indexes openly licensed
 * work across Flickr, museums and the like. When it is slow or down, which
 * happens, Wikimedia Commons answers instead. A reference tool that quietly
 * costs money per click is a tool that gets switched off later, so both
 * sources are free, and a tool that silently shows nothing is a tool people
 * think is broken, so there are two of them.
 *
 * Attribution comes back with every image and is shown on hover, because
 * using someone's work without crediting them is exactly the behaviour this
 * studio argues against everywhere else on the site.
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

const UA = { accept: "application/json", "user-agent": "FlowZone/1.0 (+https://flowzone.dev)" };

async function fromOpenverse(q: string, kind: "photo" | "gif"): Promise<Shot[]> {
  const params: Record<string, string> = {
    q,
    page_size: "12",
    license_type: "commercial,modification",
    mature: "false",
  };
  if (kind === "gif") params.extension = "gif";
  const url = "https://api.openverse.org/v1/images/?" + new URLSearchParams(params).toString();
  const res = await fetch(url, {
    headers: UA,
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`openverse ${res.status}`);
  const data = await res.json();
  return (data.results || [])
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
}

async function fromCommons(q: string): Promise<Shot[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${q}`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "800",
    format: "json",
    origin: "*",
  });
  const res = await fetch("https://commons.wikimedia.org/w/api.php?" + params.toString(), {
    headers: UA,
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {}) as any[];
  return pages
    .filter((p) => p?.imageinfo?.[0]?.thumburl)
    .slice(0, 12)
    .map((p) => {
      const info = p.imageinfo[0];
      const meta = info.extmetadata || {};
      return {
        id: `commons-${p.pageid}`,
        url: String(info.url || info.thumburl),
        thumb: String(info.thumburl),
        title: String(p.title || "Untitled").replace(/^File:/, "").slice(0, 90),
        creator: String(meta.Artist?.value || "Wikimedia Commons")
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 60),
        license: String(meta.LicenseShortName?.value || "See source").slice(0, 40),
        source: String(info.descriptionurl || ""),
      };
    });
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 120);
  const kind = req.nextUrl.searchParams.get("kind") === "gif" ? "gif" : "photo";
  if (!q) {
    return NextResponse.json({ ok: false, error: "no query" }, { status: 400 });
  }

  let shots: Shot[] = [];
  try {
    shots = await fromOpenverse(q, kind);
  } catch (e) {
    console.error("[FlowZone] openverse failed:", e);
  }
  if (!shots.length && kind === "photo") {
    try {
      shots = await fromCommons(q);
    } catch (e) {
      console.error("[FlowZone] commons failed:", e);
    }
  }

  if (!shots.length) {
    return NextResponse.json(
      { ok: false, error: "Could not reach the reference services just now." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, q, kind, count: shots.length, shots });
}
