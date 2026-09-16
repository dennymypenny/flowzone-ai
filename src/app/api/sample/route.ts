import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { addToList } from "@/lib/contacts";

/**
 * The free sample.
 *
 * One free graphic, no card, no call. The pop up sends the request here and it
 * lands in the lead inbox like a ticket does. Same house rules as /api/intake:
 * escape everything, cap every field, and a 200 only means the email really went.
 */

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const FROM = process.env.RESEND_FROM || "FlowZone Samples <onboarding@resend.dev>";

const KINDS: Record<string, string> = {
  post: "Social post",
  flyer: "Flyer",
  logo: "Logo idea",
  thumbnail: "Thumbnail or banner",
  other: "Something else",
};

const LIMITS = { name: 120, email: 200, kind: 20, brand: 200, idea: 3000 };
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

async function send(key: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // A hidden field people never see. Bots fill it, so pretend it worked.
  if (clean(raw.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(raw.name, LIMITS.name);
  const email = clean(raw.email, LIMITS.email);
  const kind = KINDS[clean(raw.kind, LIMITS.kind)] || KINDS.other;
  const brand = clean(raw.brand, LIMITS.brand);
  const idea = clean(raw.idea, LIMITS.idea);
  const joinList = raw.list !== false;

  if (!name) {
    return NextResponse.json({ ok: false, error: "Add your name so we know who it is for." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Check the email address. That is where your sample goes." }, { status: 400 });
  }
  if (idea.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Tell us a little more about the graphic, even one sentence." },
      { status: 400 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[FlowZone Sample] LEAD LOST, no RESEND_API_KEY:", email, kind, idea);
    return NextResponse.json(
      { ok: false, error: `That did not send. Email ${SITE.email} and we will make it anyway.` },
      { status: 502 }
    );
  }

  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 12px;background:#F4F6FA;font-weight:600;width:140px">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #E2E8F0">${v}</td></tr>`;

  try {
    const res = await send(key, {
      from: FROM,
      to: SITE.leadInbox,
      reply_to: email,
      subject: `Free sample request from ${name}: ${kind}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#34D399;margin:0 0 6px">Free sample</p>
        <h2 style="margin:0 0 18px;font-size:24px;color:#0B1322">${esc(name)}</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          ${row("Email", esc(email))}
          ${row("Graphic", esc(kind))}
          ${brand ? row("Brand or link", esc(brand)) : ""}
          ${row("Email list", joinList ? "Joined" : "No")}
        </table>
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #34D399;margin:20px 0">${esc(idea)}</pre>
        <p style="color:#888;font-size:12px">Reply straight to them at <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      </div>`,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[FlowZone Sample] LEAD LOST:", res.status, detail, "|", email, "|", idea);
      return NextResponse.json(
        { ok: false, error: `That did not send. Email ${SITE.email} and we will make it anyway.` },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[FlowZone Sample] LEAD LOST:", e, "|", email, "|", idea);
    return NextResponse.json(
      { ok: false, error: `That did not send. Email ${SITE.email} and we will make it anyway.` },
      { status: 502 }
    );
  }

  if (joinList) await addToList({ email, name, source: "free-sample" });

  // Their receipt. Never allowed to fail the request.
  try {
    await send(key, {
      from: FROM,
      to: email,
      reply_to: SITE.leadInbox,
      subject: "Your free sample is in the queue",
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <h2 style="margin:0 0 12px;font-size:24px;color:#0B1322">Got it. We are on your ${esc(kind.toLowerCase())}.</h2>
        <p style="color:#4A5568;line-height:1.6">A person reads every request. Your graphic comes back to this email, usually within two days. It is yours to keep and use, no strings.</p>
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #5B8CFF;margin:20px 0">${esc(idea)}</pre>
        <p style="color:#888;font-size:13px;margin-top:24px">FlowZone · flowzone.dev<br/>You imagine it. We get it moving.</p>
      </div>`,
    });
  } catch (e) {
    console.error("[FlowZone Sample] receipt failed, lead still captured:", e);
  }

  return NextResponse.json({ ok: true });
}
