import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, business, automations, otherDetails } = body;

    const automationList = Array.isArray(automations)
      ? automations.join(", ")
      : "None selected";

    await resend.emails.send({
      from: "FlowZone AI <onboarding@resend.dev>",
      to: "flowzoneautomation@gmail.com",
      subject: `New Audit Request: ${name} — ${business}`,
      html: `<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#1E3A8A">New Free AI Audit Request</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> <a href="mailto:${email}">${email}</a></p><p><b>Business:</b> ${business}</p><p><b>Wants to automate:</b> ${automationList}</p>${otherDetails ? `<p><b>Details:</b> ${otherDetails}</p>` : ""}<hr/><p style="color:#888;font-size:12px">Submitted via flowzone.dev/intake</p></div>`,
    });

    await resend.emails.send({
      from: "FlowZone AI <onboarding@resend.dev>",
      to: email,
      subject: "Your Free AI Audit is Being Prepared",
      html: `<div style="font-family:sans-serif;max-width:600px"><h2 style="color:#1E3A8A">You're in, ${name}!</h2><p>Thanks for reaching out. We're reviewing your automation needs for <b>${business}</b> and will send your custom plan within a few hours.</p><div style="background:#EFF6FF;border-radius:12px;padding:20px;margin:24px 0"><p style="font-weight:bold;color:#1E3A8A;margin:0 0 8px">What happens next:</p><p style="color:#3B82F6;margin:4px 0">✓ We map out your automations</p><p style="color:#3B82F6;margin:4px 0">✓ You get a same-day response</p><p style="color:#3B82F6;margin:4px 0">✓ Live in 48 hours after kickoff</p></div><p style="color:#888;font-size:13px">— The FlowZone AI Team</p></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FlowZone] Email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
