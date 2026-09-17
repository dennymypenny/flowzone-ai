import { NextRequest, NextResponse } from "next/server";
import { pipeline, pulseReady, dayKey, DAY_HASHES } from "@/lib/pulse-store";

/**
 * The numbers behind Denny's dashboard. Private: needs STATS_KEY, sent as
 * `Authorization: Bearer <key>` or `?key=`. Returns each day's totals plus
 * every table summed over the range (?days=1..90, default 30).
 */

export const dynamic = "force-dynamic";

const toObj = (v: unknown): Record<string, number> => {
  const out: Record<string, number> = {};
  if (Array.isArray(v)) for (let i = 0; i + 1 < v.length; i += 2) out[String(v[i])] = Number(v[i + 1]) || 0;
  return out;
};

export async function GET(req: NextRequest) {
  const want = process.env.STATS_KEY;
  const given =
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "") || req.nextUrl.searchParams.get("key") || "";
  if (!want) return NextResponse.json({ ok: false, error: "STATS_KEY is not set in Vercel" }, { status: 503 });
  if (given !== want) return NextResponse.json({ ok: false, error: "not allowed" }, { status: 401 });
  if (!pulseReady()) return NextResponse.json({ ok: false, error: "No Upstash database connected" }, { status: 503 });

  const days = Math.min(90, Math.max(1, Number(req.nextUrl.searchParams.get("days")) || 30));
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) dates.push(dayKey(new Date(Date.now() - i * 86_400_000)));
  const uniq = Array.from(new Set(dates));
  const names = Object.keys(DAY_HASHES);
  const per = names.length + 1;

  const cmds: (string | number)[][] = [];
  uniq.forEach((d) => {
    names.forEach((n) => cmds.push(["HGETALL", `a:${n}:${d}`]));
    cmds.push(["PFCOUNT", `a:uv:${d}`]);
  });
  cmds.push(["PFCOUNT", ...uniq.map((d) => `a:uv:${d}`)]);
  cmds.push(["LRANGE", "a:feed", 0, 49]);

  let res: unknown[];
  try {
    res = await pipeline(cmds);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 502 });
  }

  const totals: Record<string, Record<string, number>> = {};
  names.forEach((n) => (totals[n] = {}));
  const series = uniq.map((d, i) => {
    const base = i * per;
    const byName: Record<string, Record<string, number>> = {};
    names.forEach((n, j) => {
      byName[n] = toObj(res[base + j]);
      Object.entries(byName[n]).forEach(([f, v]) => (totals[n][f] = (totals[n][f] || 0) + v));
    });
    const t = byName.d;
    return {
      date: d,
      views: t.views || 0,
      visitors: Number(res[base + names.length]) || 0,
      sessions: t.sessions || 0,
      engaged: t.engaged || 0,
      clicks: t.clicks || 0,
      time_ms: t.time_ms || 0,
      time_n: t.time_n || 0,
      new: t.new || 0,
      returning: t.returning || 0,
      anon: t.anon || 0,
    };
  });

  const feed = ((res[uniq.length * per + 1] as string[]) || [])
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const pages = Object.keys(totals.p).map((p) => ({
    path: p,
    views: totals.p[p],
    entries: totals.e[p] || 0,
    avg_ms: totals.pn[p] ? Math.round((totals.pt[p] || 0) / totals.pn[p]) : 0,
    avg_scroll: totals.pn[p] ? Math.round((totals.ps[p] || 0) / totals.pn[p]) : 0,
  }));

  return NextResponse.json(
    {
      ok: true,
      generated_at: new Date().toISOString(),
      range: { from: uniq[0], to: uniq[uniq.length - 1], days: uniq.length },
      unique_visitors: Number(res[uniq.length * per]) || 0,
      totals: totals.d,
      series,
      pages: pages.sort((a, b) => b.views - a.views),
      referrers: totals.r,
      utm: totals.u,
      clicks: totals.c,
      devices: totals.dev,
      countries: totals.geo,
      hours: totals.h,
      feed,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
