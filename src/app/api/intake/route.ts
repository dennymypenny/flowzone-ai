import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { studioEmail, receiptEmail, ticketId } from "@/lib/intakeEmails";

/**
 * The intake form.
 *
 * This one takes money. Somebody fills it in, we message them about details and payment,
 * so the only honest thing this route can return is whether the details really
 * landed in the inbox. A 200 here is a promise. If the send fails, or the key
 * is missing, it says so with a non-200 and the page keeps the lead alive with
 * a mailto instead of a checkmark over nothing.
 *
 * Same house rules as /api/contact: escape everything that lands in HTML,
 * guard the key, never hand an internal error back to the visitor.
 */

const FROM = process.env.RESEND_FROM || "FlowZone Intake <onboarding@resend.dev>";

// Caps so a paste bomb or a bot cannot turn one submission into a huge email.
const LIMITS = {
  name: 120,
  email: 200,
  business: 160,
  service: 80,
  description: 6000,
};

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = body as Record<string, unknown>;

  const name = clean(raw.name, LIMITS.name);
  const email = clean(raw.email, LIMITS.email);
  const business = clean(raw.business, LIMITS.business);
  const service = clean(raw.service, LIMITS.service);
  const description = clean(raw.description, LIMITS.description);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Check the email address." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: "Add your name so we know who to reply to." }, { status: 400 });
  }
  if (!business) {
    return NextResponse.json({ ok: false, error: "Add the business name." }, { status: 400 });
  }
  if (!service) {
    return NextResponse.json({ ok: false, error: "Pick a package." }, { status: 400 });
  }
  if (description.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Tell us a little more about the idea, even one sentence." },
      { status: 400 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Logged loudly with the whole lead, because this is the failure that used
    // to take somebody's $600 and drop their project on the floor.
    console.error("[FlowZone Intake] LEAD LOST, no RESEND_API_KEY:", email, service, description);
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Send it to us directly and we will pick it up." },
      { status: 502 }
    );
  }

  const ticket = { name, email, business, service, description };
  const id = ticketId();
  const studio = studioEmail(ticket, id);
  const receipt = receiptEmail(ticket, id);

  try {
    // A hung upstream would leave somebody watching a spinner, so it gets a leash.
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: SITE.leadInbox,
        reply_to: email,
        subject: studio.subject,
        html: studio.html,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[FlowZone Intake] LEAD LOST:", res.status, detail, "|", email, "|", description);
      return NextResponse.json(
        { ok: false, error: "We could not reach the studio. Send it to us directly and we will pick it up." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[FlowZone Intake] LEAD LOST:", e, "|", email, "|", description);
    return NextResponse.json(
      { ok: false, error: "We could not reach the studio. Send it to us directly and we will pick it up." },
      { status: 502 }
    );
  }

  // Their receipt. Never allowed to fail the request, the lead is already in.
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: email,
        reply_to: SITE.leadInbox,
        subject: receipt.subject,
        html: receipt.html,
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error("[FlowZone Intake] receipt failed, lead still captured:", e);
  }

  return NextResponse.json({ ok: true });
}
