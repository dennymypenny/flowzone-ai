import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { Resend } from "resend";

/**
 * The contact form.
 *
 * A mailto is fine until somebody is on a phone with no mail app configured, or
 * on a work machine that opens Outlook to an account they do not use. Then the
 * only route to the studio quietly breaks. So this actually sends the message.
 *
 * Same rule as the rest of the site: the Resend SDK returns errors instead of
 * throwing, so every send is checked and a failure is a real failure the
 * visitor can see and act on, never a checkmark over nothing.
 */

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const FROM = process.env.RESEND_FROM || "FlowZone <onboarding@resend.dev>";

const REASONS: Record<string, string> = {
  work: "Interested in working together",
  quote: "Wants a price and a date",
  question: "Has a question first",
  collab: "Collaboration or partnership",
  other: "Something else",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, email, reason, message, budget } = body as Record<string, string>;

  if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Check the email address." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json(
      { ok: false, error: "Tell us a little more, even one sentence." },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[FlowZone] CONTACT LOST, no RESEND_API_KEY:", email, message);
    return NextResponse.json(
      { ok: false, error: "Email is not configured yet. Please text us instead." },
      { status: 502 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const label = REASONS[reason] || REASONS.other;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: SITE.leadInbox,
      reply_to: email,
      subject: `${label}: ${name ? esc(name) : email}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B8CFF;margin:0 0 6px">${esc(label)}</p>
        <h2 style="margin:0 0 18px;font-size:24px;color:#0B1322">${esc(name || email)}</h2>
        <p style="margin:4px 0"><b>Email:</b> ${esc(email)}</p>
        ${budget ? `<p style="margin:4px 0"><b>Budget:</b> ${esc(budget)}</p>` : ""}
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #5B8CFF;margin:20px 0">${esc(message)}</pre>
        <p style="color:#888;font-size:12px">Reply straight to them at <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      </div>`,
    });
    if (error) {
      console.error("[FlowZone] CONTACT LOST:", error, "|", email, "|", message);
      return NextResponse.json(
        { ok: false, error: "We could not reach the studio. Please text us instead." },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[FlowZone] CONTACT LOST:", e, "|", email, "|", message);
    return NextResponse.json(
      { ok: false, error: "We could not reach the studio. Please text us instead." },
      { status: 502 }
    );
  }

  // Their receipt. Never allowed to fail the request.
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      reply_to: SITE.leadInbox,
      subject: "We got it",
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <h2 style="margin:0 0 12px;font-size:24px;color:#0B1322">Got it. A person is reading this.</h2>
        <p style="color:#4A5568;line-height:1.6">You will get a reply with which parts you actually need, what it costs and a date. If a cheaper build fits, we will say so.</p>
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #5B8CFF;margin:20px 0">${esc(message)}</pre>
        <p style="color:#888;font-size:13px;margin-top:24px">FlowZone · flowzone.dev<br/>You imagine it. We get it moving.</p>
      </div>`,
    });
  } catch (e) {
    console.error("[FlowZone] contact receipt failed, lead still captured:", e);
  }

  return NextResponse.json({ ok: true });
}
