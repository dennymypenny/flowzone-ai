import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, business, service, description } = await req.json();

    const html = `
      <h2 style="color:#1e3a8a">New FlowZone AI Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600;width:140px">Name</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${name}</td></tr>
        <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${email}</td></tr>
        <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">Business</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${business || "—"}</td></tr>
        <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600">Service</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${service}</td></tr>
        <tr><td style="padding:8px 12px;background:#f1f5f9;font-weight:600;vertical-align:top">Details</td><td style="padding:8px 12px;white-space:pre-wrap">${description}</td></tr>
      </table>
      <p style="margin-top:20px;font-size:12px;color:#94a3b8">Sent from flowzone.dev intake form</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FlowZone Intake <onboarding@resend.dev>",
        to: "flowzoneautomation@gmail.com",
        reply_to: email,
        subject: `New inquiry from ${name} — ${service}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[FlowZone Intake] Resend error:", err);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[FlowZone Intake] Error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
