import { NextRequest, NextResponse } from "next/server";
import { pipeline, pulseReady, dayKey, hourLA, KEEP_SECONDS, type Cmd } from "@/lib/pulse-store";

/**
 * Where the Pulse tracker reports. Three kinds of event:
 *   view   a page was shown
 *   leave  a page was left, with the visible time and how far it was scrolled
 *   click  a link or button was pressed
 * Only totals per day are kept. Bots and anything malformed are dropped, and
 * the answer is always a fast 204 so a visitor never waits on analytics.
 */

export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|quora|pinterest|vercel|curl|wget|python|axios|node-fetch/i;
const done = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });

const str = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\x00-\x1f]/g, " ")
    .trim()
    .slice(0, max);
const num = (v: unknown, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
};

function cleanPath(v: unknown) {
  const p = str(v, 200).split("?")[0].split("#")[0];
  return p.startsWith("/") ? p : "/";
}

function refHost(v: unknown) {
  const raw = str(v, 300);
  if (!raw) return "Direct";
  try {
    const h = new URL(raw).hostname.replace(/^www\./, "").replace(/^(l|lm|m)\./, "");
    if (!h || h.endsWith("flowzone.dev")) return "";
    if (h === "t.co") return "x.com";
    return h;
  } catch {
    return "Direct";
  }
}

export async function POST(req: NextRequest) {
  if (!pulseReady()) return done();
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return done();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse((await req.text()).slice(0, 4000));
  } catch {
    return done();
  }

  const day = dayKey();
  const k = (name: string) => `a:${name}:${day}`;
  const path = cleanPath(body.p);
  const country = str(req.headers.get("x-vercel-ip-country"), 4).toUpperCase();
  const cmds: Cmd[] = [];
  const touched = new Set<string>();
  const inc = (name: string, field: string, by = 1) => {
    if (!field) return;
    cmds.push(["HINCRBY", k(name), field.slice(0, 120), by]);
    touched.add(k(name));
  };

  const t = body.t;
  if (t === "view") {
    inc("d", "views");
    inc("p", path);
    inc("h", String(hourLA()));
    const who = str(body.v, 40) || str(body.s, 40);
    if (who) {
      cmds.push(["PFADD", k("uv"), who]);
      touched.add(k("uv"));
    }
    const nth = num(body.n, 10000);
    const ref = refHost(body.r);
    if (nth === 2) inc("d", "engaged");
    if (nth === 1) {
      inc("d", "sessions");
      inc("e", path);
      if (ref) inc("r", ref);
      const utm = str(body.utm, 60).toLowerCase();
      if (utm) inc("u", utm);
      const w = num(body.w, 10000);
      inc("dev", w && w < 768 ? "Phone" : w && w < 1100 ? "Tablet" : "Desktop");
      inc("geo", country || "Unknown");
      inc("d", body.vt === "new" ? "new" : body.vt === "returning" ? "returning" : "anon");
    }
    cmds.push(
      [
        "LPUSH",
        "a:feed",
        JSON.stringify({ at: Date.now(), p: path, r: nth === 1 ? ref : "", c: country, w: num(body.w, 10000), n: nth }),
      ],
      ["LTRIM", "a:feed", 0, 99]
    );
  } else if (t === "leave") {
    const ms = num(body.ms, 30 * 60_000);
    if (ms < 500) return done();
    inc("d", "time_ms", ms);
    inc("d", "time_n");
    inc("pt", path, ms);
    inc("pn", path);
    inc("ps", path, num(body.sd, 100));
  } else if (t === "consent") {
    inc("d", "anon", -1);
    inc("d", "new");
  } else if (t === "click") {
    const label = str(body.l, 80);
    if (!label) return done();
    inc("d", "clicks");
    inc("c", `${label} | ${path}`);
  } else {
    return done();
  }

  touched.forEach((key) => cmds.push(["EXPIRE", key, KEEP_SECONDS]));
  try {
    await pipeline(cmds);
  } catch (e) {
    console.error("[FlowZone Pulse] write failed:", e);
  }
  return done();
}
