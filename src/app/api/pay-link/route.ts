import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeReady, siteOrigin, StripeError } from "@/lib/stripe";

/**
 * Denny's pay links. Oct 9 2026. Private: needs PAY_KEY as a Bearer token.
 *
 * POST { client, what, amount (dollars), monthly?, email?, ticket? }
 *   -> { ok, url, id }. A Stripe Payment Link for exactly that price, good
 *   for one payment, that lands on flowzone.dev/paid when it goes through.
 * GET  -> the last 30 links with who and what, newest first.
 * PATCH { id, active: false } -> switch a link off.
 *
 * Used by /studio/pay. Payment Links never expire on their own, unlike a
 * Checkout Session (24h), which is why this makes links and not sessions.
 */

export const dynamic = "force-dynamic";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

function allowed(req: NextRequest) {
  const want = process.env.PAY_KEY;
  const given = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!want) return NextResponse.json({ ok: false, error: "PAY_KEY is not set in Vercel yet." }, { status: 503 });
  if (given !== want) return NextResponse.json({ ok: false, error: "Wrong studio key." }, { status: 401 });
  if (!stripeReady()) return NextResponse.json({ ok: false, error: "STRIPE_SECRET_KEY is not set in Vercel yet." }, { status: 503 });
  return null;
}

type Link = { id: string; url: string; active: boolean; metadata?: Record<string, string> };

export async function POST(req: NextRequest) {
  const deny = allowed(req);
  if (deny) return deny;
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const client = clean(b.client, 80);
  const what = clean(b.what, 120);
  const email = clean(b.email, 200);
  const ticket = clean(b.ticket, 20);
  const monthly = b.monthly === true;
  // Which branded card the checkout shows: a build, or the general studio card.
  const kind = ["site", "identity", "full", "storefront", "engine"].includes(String(b.kind)) ? String(b.kind) : "";
  const image = `https://www.flowzone.dev/pay/${kind ? `build-${kind}` : "studio"}.jpg`;
  const cents = Math.round(Number(String(b.amount ?? "").replace(/[$,\s]/g, "")) * 100);
  if (!what) return NextResponse.json({ ok: false, error: "Say what it is for. The client sees it at checkout." }, { status: 400 });
  if (!Number.isFinite(cents) || cents < 100 || cents > 5_000_000) {
    return NextResponse.json({ ok: false, error: "Amount has to be between $1 and $50,000." }, { status: 400 });
  }

  const name = client ? `${what} for ${client}` : what;
  const meta = { client, what, amount: String(cents), monthly: monthly ? "1" : "", email, ticket, source: "studio" };
  try {
    // A real product, so checkout shows the FlowZone card and a description.
    const product = await stripe<{ id: string }>("POST", "products", {
      name: name.slice(0, 250),
      description: `${what}${client ? ` for ${client}` : ""}, designed and built by FlowZone Studio.${ticket ? ` Ticket ${ticket}.` : ""}`.slice(0, 500),
      images: [image],
      metadata: { source: "studio", client, ticket },
    });
    const price = await stripe<{ id: string }>("POST", "prices", {
      currency: "usd",
      unit_amount: cents,
      product: product.id,
      ...(monthly ? { recurring: { interval: "month" } } : {}),
    });
    const base = {
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: { type: "redirect", redirect: { url: `${siteOrigin(req.url)}/paid?session_id={CHECKOUT_SESSION_ID}` } },
      allow_promotion_codes: false,
      custom_text: {
        submit: { message: `Thank you${client ? `, ${client}` : ""}. Once this goes through, Dennis gets started and you will hear from FlowZone the same day.`.slice(0, 1200) },
      },
      metadata: meta,
      ...(monthly ? { subscription_data: { metadata: meta } } : { payment_intent_data: { metadata: meta }, invoice_creation: { enabled: true } }),
    };
    let link: Link;
    try {
      // One payment per link, so a forwarded link cannot be paid twice.
      link = await stripe<Link>("POST", "payment_links", { ...base, restrictions: { completed_sessions: { limit: 1 } } });
    } catch {
      link = await stripe<Link>("POST", "payment_links", base);
    }
    return NextResponse.json({ ok: true, url: link.url, id: link.id });
  } catch (e) {
    const msg = e instanceof StripeError ? e.message : String(e);
    console.error("[FlowZone PayLink]", msg);
    return NextResponse.json({ ok: false, error: `Stripe said: ${msg}` }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  const deny = allowed(req);
  if (deny) return deny;
  try {
    const list = await stripe<{ data: Link[] }>("GET", "payment_links", { limit: 30 });
    const links = list.data
      .filter((l) => l.metadata?.source === "studio")
      .map((l) => ({
        id: l.id,
        url: l.url,
        active: l.active,
        client: l.metadata?.client || "",
        what: l.metadata?.what || "",
        amount: Number(l.metadata?.amount || 0),
        monthly: !!l.metadata?.monthly,
      }));
    return NextResponse.json({ ok: true, links });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Stripe error" }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  const deny = allowed(req);
  if (deny) return deny;
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = clean(b.id, 80);
  if (!/^plink_[A-Za-z0-9]+$/.test(id)) return NextResponse.json({ ok: false, error: "Bad link id." }, { status: 400 });
  try {
    await stripe("POST", `payment_links/${id}`, { active: b.active === true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Stripe error" }, { status: 502 });
  }
}
