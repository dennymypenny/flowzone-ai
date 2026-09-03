import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { Resend } from "resend";

/**
 * Saving a work session by email.
 *
 * Two things happen: the studio gets the address so there is a list, and the
 * visitor gets their own brief back so the save is real rather than a promise.
 *
 * Important: the Resend SDK does not throw when the API rejects a send. It
 * returns { data, error }. An earlier version awaited the call inside a try
 * block and reported success, which meant a rejected send looked identical to
 * a delivered one and leads disappeared silently. Every send here is checked
 * for that error object, and the studio notification failing is a real 502 so
 * the visitor sees the truth and the client can fall back to a mailto.
 */

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Any verified domain wins. The sandbox sender only ever reaches the address
// that owns the Resend account, which is the usual reason nothing arrives.
const FROM = process.env.RESEND_FROM || "FlowZone <onboarding@resend.dev>";

// Caps so a paste bomb or a bot cannot turn one save into a huge email.
const LIMITS = { email: 200, brief: 8000, name: 120, path: 200, build: 60, source: 60 };
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const email = clean(raw.email, LIMITS.email);
  const brief = clean(raw.brief, LIMITS.brief);
  const name = clean(raw.name, LIMITS.name);
  const path = clean(raw.path, LIMITS.path);
  const build = clean(raw.build, LIMITS.build);
  const source = clean(raw.source, LIMITS.source);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[FlowZone] LEAD LOST, no RESEND_API_KEY set:", email, source);
    return NextResponse.json(
      { ok: false, reason: "Email is not configured on the server yet." },
      { status: 502 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const hasBrief = brief.length > 0;
  const briefHtml = hasBrief
    ? `<pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #5B8CFF;margin:20px 0">${esc(
        brief
      )}</pre>`
    : "";

  // The one that matters. Denny's list lives in his inbox.
  let studioError: string | null = null;
  let studioId: string | null = null;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: SITE.leadInbox,
      reply_to: email,
      subject: hasBrief
        ? `Session saved: ${name ? esc(name) : email}${build ? ` — ${esc(build)}` : ""}`
        : `New email captured: ${email}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5B8CFF;margin:0 0 6px">${
          hasBrief ? "Work session saved" : "Email captured"
        }</p>
        <h2 style="margin:0 0 18px;font-size:24px;color:#0B1322">${esc(email)}</h2>
        ${name ? `<p style="margin:4px 0"><b>Project:</b> ${esc(name)}</p>` : ""}
        ${path ? `<p style="margin:4px 0"><b>Path:</b> ${esc(path)}</p>` : ""}
        ${build ? `<p style="margin:4px 0"><b>Suggested build:</b> ${esc(build)}</p>` : ""}
        <p style="margin:4px 0"><b>From:</b> ${esc(source || "site")}</p>
        ${briefHtml}
        <p style="color:#888;font-size:12px;margin-top:24px">Reply straight to them at
          <a href="mailto:${esc(email)}">${esc(email)}</a></p>
      </div>`,
    });
    if (error) studioError = `${error.name || "send failed"}: ${error.message || ""}`.trim();
    studioId = data?.id ?? null;
  } catch (e) {
    studioError = e instanceof Error ? e.message : "send threw";
  }

  if (studioError) {
    // Loud, and in a form that is greppable in the Vercel logs, so a lead that
    // could not be mailed is at least recoverable from there.
    console.error("[FlowZone] LEAD LOST:", studioError, "|", email, "|", source, "|", brief);
    return NextResponse.json({ ok: false, reason: studioError }, { status: 502 });
  }

  console.log("[FlowZone] lead delivered:", studioId, "|", email, "|", source);

  // Their copy. Nice to have, never load-bearing, and never allowed to turn a
  // captured lead into an error the visitor sees.
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      reply_to: SITE.leadInbox,
      subject: hasBrief ? "Your brief, saved" : "Saved. Talk soon.",
      html: `<div style="font-family:system-ui,sans-serif;max-width:640px">
        <h2 style="margin:0 0 12px;font-size:24px;color:#0B1322">${
          hasBrief ? "Here is your brief." : "You are on the list."
        }</h2>
        <p style="color:#4A5568;line-height:1.6">${
          hasBrief
            ? "It is yours. Take it anywhere, brief anyone with it. If you want us to build it, just reply to this email and you will get back a scope, a price and a date."
            : "Nothing much will land in your inbox. When something worth reading exists, you will get it."
        }</p>
        ${briefHtml}
        <p style="color:#888;font-size:13px;margin-top:28px">FlowZone · flowzone.dev<br/>
        You imagine it. We get it moving.</p>
      </div>`,
    });
    if (error) console.error("[FlowZone] visitor copy rejected, lead still captured:", error);
  } catch (e) {
    console.error("[FlowZone] visitor copy threw, lead still captured:", e);
  }

  return NextResponse.json({ ok: true });
}
