import { NextRequest, NextResponse } from "next/server";
import { runScan, ScanError } from "@/lib/scan-engine";

/**
 * POST { url } -> a full ScanReport.
 *
 * The heavy lifting and every opinion lives in lib/scan-engine. This route
 * only guards the door: JSON in, a best-effort rate limit so one visitor
 * cannot turn the studio into a free scanning service for their whole list,
 * and errors that stay blunt but never leak internals.
 *
 * The limiter is in-memory, so on serverless it resets whenever the instance
 * does. That is fine. It exists to stop casual hammering, not a determined
 * attacker, and it costs nothing.
 */

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // crude memory cap, resets everyone
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Five scans a minute is the limit. Give it a moment." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const url = String((body as Record<string, unknown>).url ?? "");

  try {
    const report = await runScan(url);
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    if (e instanceof ScanError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: e.status });
    }
    console.error("[FlowZone Scan] unexpected:", e);
    return NextResponse.json(
      { ok: false, error: "The scan hit something unexpected. Try again, or send us the link and we will run it by hand." },
      { status: 500 }
    );
  }
}
