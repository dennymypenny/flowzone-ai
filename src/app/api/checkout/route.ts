import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeReady, siteOrigin, StripeError } from "@/lib/stripe";
import { payable } from "@/lib/payables";

/**
 * Card checkout for the fixed-price items. Oct 9 2026.
 *
 * POST { items: ["flyer", "reel", ...], email?, ticket?, back? }
 *   -> { ok, url } to a Stripe-hosted Checkout page.
 * GET ?session_id=cs_...
 *   -> what was paid, for the /paid page.
 *
 * Only ids come in. Prices come from payables.ts. Anything monthly turns the
 * session into a subscription; one-off items ride along on the first invoice.
 * Without STRIPE_SECRET_KEY it answers 503 with a fallback to the ticket, so
 * a button never dead-ends.
 */

export const dynamic = "force-dynamic";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const ids = Array.isArray(body.items) ? body.items.map((x) => String(x)).slice(0, 20) : [];
  const picked = ids.map(payable).filter(Boolean) as NonNullable<ReturnType<typeof payable>>[];
  if (picked.length === 0) {
    return NextResponse.json({ ok: false, error: "Nothing to pay for." }, { status: 400 });
  }
  if (!stripeReady()) {
    console.error("[FlowZone Checkout] STRIPE_SECRET_KEY missing, sent buyer to a ticket:", ids.join(","));
    return NextResponse.json(
      { ok: false, error: "Card payments are switching on. Send it as a ticket and we will send a pay link.", fallback: "/intake?cart=1" },
      { status: 503 }
    );
  }

  // Same id twice is a quantity, not two lines.
  const counts = new Map<string, number>();
  picked.forEach((p) => counts.set(p.id, (counts.get(p.id) || 0) + 1));
  const lines = Array.from(counts.entries()).map(([id, qty]) => {
    const p = payable(id)!;
    return {
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: p.cents,
        product_data: { name: p.name },
        ...(p.monthly ? { recurring: { interval: "month" } } : {}),
      },
    };
  });
  const monthly = picked.some((p) => p.monthly);
  const origin = siteOrigin(req.url);
  const back = clean(body.back, 200);
  const cancelPath = back.startsWith("/") && !back.startsWith("//") ? back : "/services";
  const email = clean(body.email, 200);
  const ticket = clean(body.ticket, 20);

  try {
    const session = await stripe<{ url: string; id: string }>("POST", "checkout/sessions", {
      mode: monthly ? "subscription" : "payment",
      line_items: lines,
      success_url: `${origin}/paid?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      ...(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? { customer_email: email } : {}),
      ...(monthly ? {} : { customer_creation: "always", invoice_creation: { enabled: true } }),
      metadata: { source: "site", items: Array.from(counts.keys()).join(","), ticket },
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    const msg = e instanceof StripeError ? e.message : String(e);
    console.error("[FlowZone Checkout] Stripe refused:", msg, "|", ids.join(","));
    return NextResponse.json(
      // `reason` is Stripe's short error code (e.g. account_invalid), safe to show and handy to debug.
      { ok: false, error: "Checkout did not open. Send it as a ticket and we will send a pay link.", fallback: "/intake?cart=1", reason: e instanceof StripeError ? e.code : "network" },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!stripeReady()) return NextResponse.json({ ok: false }, { status: 503 });
  try {
    const s = await stripe<{
      status: string;
      payment_status: string;
      amount_total: number | null;
      mode: string;
      customer_details?: { name?: string | null; email?: string | null } | null;
      metadata?: Record<string, string>;
    }>("GET", `checkout/sessions/${id}`, { expand: ["line_items"] });
    const items = ((s as unknown as { line_items?: { data?: { description?: string; quantity?: number }[] } }).line_items?.data || []).map(
      (l) => `${l.quantity && l.quantity > 1 ? `${l.quantity} x ` : ""}${l.description || ""}`
    );
    return NextResponse.json({
      ok: true,
      paid: s.payment_status === "paid" || s.payment_status === "no_payment_required",
      amount: s.amount_total ?? 0,
      monthly: s.mode === "subscription",
      name: s.customer_details?.name || "",
      email: s.customer_details?.email || "",
      items,
      what: s.metadata?.what || "",
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
