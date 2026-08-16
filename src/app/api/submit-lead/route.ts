import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, business, systems, automations, otherDetails } = body;
    const selected = systems ?? automations;

    const systemsList = Array.isArray(selected)
      ? selected.join(", ")
      : "None selected";

    await resend.emails.send({
      from: "FlowZone AI <onboarding@resend.dev>",
      to: SITE.leadInbox,
      subject: `New project: ${name} — ${business}`,
      html: `<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#1E3A8A">New project enquiry</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> <a href="mailto:${email}">${email}</a></p><p><b>Business:</b> ${business}</p><p><b>Wants built:</b> ${systemsList}</p>${otherDetails ? `<p><b>Details:</b> ${otherDetails}</p>` : ""}<hr/><p style="color:#888;font-size:12px">Submitted via flowzone.dev/intake</p></div>`,
    });

    await resend.emails.send({
      from: "FlowZone AI <onboarding@resend.dev>",
      to: email,
      subject: "Got it. Reading it now.",
      html: `<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#0B1322">Got it, ${name}.</h2><p style="color:#4A5568;line-height:1.6">A person is reading this, not a queue. You will get back which of the three parts you actually need for <b>${business}</b>, what it costs, and a date.</p><div style="background:#F4F6FA;padding:20px;margin:24px 0;border-left:3px solid #5B8CFF"><p style="font-weight:600;color:#0B1322;margin:0 0 10px">What comes back</p><p style="color:#4A5568;margin:4px 0">Which build fits, and why</p><p style="color:#4A5568;margin:4px 0">A flat price, agreed before anything starts</p><p style="color:#4A5568;margin:4px 0">A date, and it is the one we work to</p></div><p style="color:#888;font-size:13px">FlowZone · You imagine it. We get it moving.</p></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FlowZone] Email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
