import { NextResponse, type NextRequest } from "next/server";

/**
 * A door with a limit on it.
 *
 * Every API route on this site was wide open. `/api/chat` forwarded a
 * caller-supplied message array straight to a model with our key on it, which
 * is a free public model proxy paid for by us. `/api/moodboard` and
 * `/api/clips` burn a photo quota. `/api/contact` and `/api/subscribe` mail a
 * real inbox as fast as anybody can POST. None of that needed a clever
 * attacker, just a bored one with a loop.
 *
 * This is deliberately small. No dependency, no external store, no signup.
 * It counts requests per address in memory, in a sliding window, and returns
 * 429 with a Retry-After when somebody goes past a sane number.
 *
 * The honest limitation: serverless runs many instances, and each one keeps
 * its own count, so a determined attacker spread across instances gets more
 * than the number below. That is fine. This is not a security boundary, it
 * is a cost ceiling and a spam brake, and it turns "unbounded" into
 * "bounded by however many instances are warm". If the bill ever justifies
 * it, swap the Map for a shared store and nothing else here changes.
 */

type Rule = { limit: number; windowMs: number };

/** Tighter where a request costs money or lands in a human's inbox. */
const RULES: Array<[string, Rule]> = [
  // Every call spends model tokens on our account.
  ["/api/chat", { limit: 15, windowMs: 10 * 60_000 }],
  // These reach Denny directly. Nobody legitimate sends six in ten minutes.
  ["/api/contact", { limit: 5, windowMs: 10 * 60_000 }],
  ["/api/subscribe", { limit: 5, windowMs: 10 * 60_000 }],
  // Looser than contact: a founder testing the form, or a visitor who trips
  // validation a few times, must not hit a wall. Still a brake on a loop.
  ["/api/intake", { limit: 15, windowMs: 10 * 60_000 }],
  // Photo and footage quota. A real session makes a handful of these.
  ["/api/moodboard", { limit: 60, windowMs: 10 * 60_000 }],
  ["/api/clips", { limit: 60, windowMs: 10 * 60_000 }],
  // Cheap, but still ours to pay for.
  ["/api/plan-edit", { limit: 60, windowMs: 10 * 60_000 }],
  ["/api/imageproxy", { limit: 300, windowMs: 10 * 60_000 }],
];

const hits = new Map<string, number[]>();

/**
 * Keep the map from growing forever on a long-lived instance. Called on every
 * request, does almost nothing almost every time.
 */
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  const cutoff = now - 15 * 60_000;
  Array.from(hits.keys()).forEach((key) => {
    const live = (hits.get(key) || []).filter((t: number) => t > cutoff);
    if (live.length) hits.set(key, live);
    else hits.delete(key);
  });
}

/** Behind a proxy the socket address is the proxy, so trust the header first. */
function caller(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const found = RULES.find(([prefix]) => path.startsWith(prefix));
  if (!found) return NextResponse.next();

  const [prefix, rule] = found;
  const now = Date.now();
  sweep(now);

  const key = `${prefix}:${caller(req)}`;
  const times = (hits.get(key) || []).filter((t) => now > t && now - t < rule.windowMs);

  if (times.length >= rule.limit) {
    const oldest = times[0];
    const retryAfter = Math.max(1, Math.ceil((rule.windowMs - (now - oldest)) / 1000));
    return NextResponse.json(
      {
        ok: false,
        error:
          "That is a lot of requests in a short time. Give it a few minutes and try again, or email us and we will just do it for you.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store",
          "X-RateLimit-Limit": String(rule.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  times.push(now);
  hits.set(key, times);

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(rule.limit));
  res.headers.set("X-RateLimit-Remaining", String(rule.limit - times.length));
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
