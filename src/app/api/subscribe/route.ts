import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Saving a work session by email.
 *
 * Two things happen: the studio gets the address so there is a list, and the
 * visitor gets their own brief back so the save is real rather than a promise.
 *
 * The notification to the studio is what must succeed. The copy to the visitor
 * is attempted but never allowed to fail the request, because sending to an
 * arbitrary address needs a verified sending domain and that may not be set up
 * yet. A visitor should never see an error for something that worked.
 */

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(req: NextRequest) {
  try {
    const { email, brief, name, path, build, source } = await req.json();

    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
    }

    const hasBrief = typeof brief === "string" && brief.trim().length > 0;
    const briefHtml = hasBrief
      ? `<pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;color:#333;background:#F4F6FA;padding:20px;border-left:3px solid #5B8CFF;margin:20px 0">${esc(
          brief
        )}</pre>`
      : "";

    // The one that matters. Denny's list lives in his inbox.
    await resend.emails.send({
      from: "FlowZone <onboarding@resend.dev>",
      to: SITE.leadInbox,
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

    // Their copy. Nice to have, never load-bearing.
    try {
      await resend.emails.send({
        from: "FlowZone <onboarding@resend.dev>",
        to: email,
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
    } catch (e) {
      console.error("[FlowZone] visitor copy failed, lead still captured:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[FlowZone] subscribe error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
