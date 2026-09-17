/**
 * Pulse storage: our own visit counts, kept in Upstash Redis.
 *
 * Vercel Analytics stays on for the basics, but it cannot tell us time on page
 * or which buttons get pressed, and it has no API to feed Denny's dashboard.
 * So the site counts a few things itself and keeps only totals per day.
 * No IP addresses and no personal details are stored.
 *
 * Connect a free Upstash Redis database from the Vercel Marketplace and it
 * adds KV_REST_API_URL and KV_REST_API_TOKEN for you. Without them every call
 * here quietly does nothing, so the site never breaks over analytics.
 */

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const pulseReady = () => Boolean(URL_ && TOKEN);

export type Cmd = (string | number)[];

export async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  if (!pulseReady() || !cmds.length) return [];
  const res = await fetch(`${URL_.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`pulse store ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => r.result);
}

/** The day in Los Angeles, so "today" on the dashboard matches Denny's day. */
export function dayKey(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function hourLA(d = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hourCycle: "h23" }).format(d)
  );
}

/** Every per-day hash the tracker writes, and what it holds. */
export const DAY_HASHES = {
  d: "totals: views, sessions, engaged, clicks, time_ms, time_n, new, returning, anon",
  p: "views by page",
  e: "entry pages",
  pt: "visible ms by page",
  pn: "timed views by page",
  ps: "scroll depth sum by page",
  r: "referrers (session starts)",
  u: "utm sources",
  c: "clicks by label",
  dev: "device",
  geo: "country",
  h: "views by hour",
} as const;

export const KEEP_SECONDS = 400 * 24 * 60 * 60;
