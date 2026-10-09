import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/stripe";
import { SITE } from "@/lib/site";
import { payable } from "@/lib/payables";

/**
 * Stripe tells us when money lands. Oct 9 2026.
 *
 * Point a Stripe webhook at https://www.flowzone.dev/api/stripe-webhook with
 * the event checkout.session.completed, and put its signing secret in Vercel
 * as STRIPE_WEBHOOK_SECRET. Each paid checkout (site button or studio pay
 * link) then emails heyflowzone@gmail.com: who, how much, for what.
 *
 * Optional. Stripe's own dashboard and its payment emails work without it.
 */

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const usd = (c: number) => `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: c % 100 ? 2 : 0 })}`;

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();
  if (!secret) return NextResponse.json({ ok: false, error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 503 });
  if (!verifyWebhook(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const event = JSON.parse(raw) as { type: string; data: { object: Record<string, any> } };
  if (event.type !== "checkout.session.completed") return NextResponse.json({ ok: true });

  const s = event.data.object;
  const who = s.customer_details?.name || "Someone";
  const email = s.customer_details?.email || "";
  const amount = Number(s.amount_total || 0);
  const meta = (s.metadata || {}) as Record<string, string>;
  const itemNames = (meta.items || "").split(",").map((id) => payable(id)?.name).filter(Boolean).join(", ");
  const what = meta.what || itemNames || "an order";
  const monthly = s.mode === "subscription";
  const subject = `Paid: ${usd(amount)}${monthly ? "/mo" : ""} from ${who} for ${what}`.slice(0, 180);

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[FlowZone Pay] paid, but no RESEND_API_KEY to tell Denny:", subject, email);
    return NextResponse.json({ ok: true });
  }
  const from = (process.env.RESEND_FROM || "FlowZone <onboarding@resend.dev>").match(/<([^>]+)>/)?.[1] || "onboarding@resend.dev";
  const rows = [
    ["Amount", `${usd(amount)}${monthly ? " a month" : ""}`],
    ["Who", who],
    ["Email", email],
    ["For", what],
    ["Ticket", meta.ticket || ""],
    ["From", meta.source === "studio" ? "Your pay link" : "A Pay now button on the site"],
  ].filter(([, v]) => v);
  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px">
    <p style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#0F6B4F;margin:0 0 8px">Payment received</p>
    <p style="font-size:28px;font-weight:600;margin:0 0 18px;color:#0C1424">${esc(usd(amount))}${monthly ? "/mo" : ""} from ${esc(who)}</p>
    <table style="font-size:15px;border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 18px 4px 0;color:#64748B">${esc(k)}</td><td style="padding:4px 0;color:#0C1424">${esc(v)}</td></tr>`)
      .join("")}</table>
    <p style="font-size:13px;color:#64748B;margin-top:20px">Full details in the Stripe dashboard.</p></div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `FlowZone Payments <${from}>`, to: SITE.leadInbox, reply_to: email || undefined, subject, html }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error("[FlowZone Pay] could not email Denny:", e, subject);
  }
  return NextResponse.json({ ok: true });
}
