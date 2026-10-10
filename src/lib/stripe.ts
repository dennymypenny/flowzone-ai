/**
 * Stripe, without the SDK. Oct 9 2026.
 *
 * Three calls is all the site makes (create a Checkout Session, read one back,
 * create a Payment Link), so a 40 line form-encoder beats a dependency.
 * Everything here runs on the server only: STRIPE_SECRET_KEY never reaches a
 * browser, and prices never come from one either (see payables.ts).
 */

import crypto from "crypto";

export const stripeReady = () => !!process.env.STRIPE_SECRET_KEY;

type Val = string | number | boolean | null | undefined | Val[] | { [k: string]: Val };

/** Stripe wants nested form fields: line_items[0][price_data][currency]=usd */
export function formEncode(obj: Record<string, Val>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item !== null && typeof item === "object") out.push(...formEncode(item as Record<string, Val>, `${key}[${i}]`));
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === "object") {
      out.push(...formEncode(v as Record<string, Val>, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out;
}

export class StripeError extends Error {
  constructor(message: string, public status: number, public code = "") {
    super(message);
  }
}

export async function stripe<T = Record<string, unknown>>(
  method: "GET" | "POST",
  path: string,
  params: Record<string, Val> = {}
): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeError("STRIPE_SECRET_KEY is not set", 503);
  const qs = formEncode(params).join("&");
  const url = `${process.env.STRIPE_API_BASE || "https://api.stripe.com"}/v1/${path}${method === "GET" && qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: method === "POST" ? qs : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (data as { error?: { message?: string; code?: string; type?: string } })?.error;
    const msg = err?.message || `Stripe said ${res.status}`;
    throw new StripeError(msg, res.status, err?.code || err?.type || String(res.status));
  }
  return data as T;
}

/**
 * Checks the Stripe-Signature header on a webhook: t=<time>,v1=<hmac>.
 * HMAC-SHA256 of "<t>.<raw body>" with the endpoint secret, five minute window.
 */
export function verifyWebhook(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    })
  ) as Record<string, string>;
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const want = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  const given = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  return given.some((g) => g.length === want.length && crypto.timingSafeEqual(Buffer.from(g), Buffer.from(want)));
}

/** The address the site lives at, for Stripe's success and cancel URLs. */
export function siteOrigin(reqUrl: string) {
  try {
    const u = new URL(reqUrl);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return u.origin;
  } catch {
    /* fall through */
  }
  return "https://www.flowzone.dev";
}
