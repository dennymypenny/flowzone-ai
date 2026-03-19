import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json();
    const timestamp = new Date().toISOString();
    const entry = {
      ...lead,
      id: Date.now(),
      created_at: timestamp,
      status: "new",
    };

    console.log("[FlowZone] New lead received:", {
      email: entry.email,
      name: entry.name,
      budget: entry.budget,
      timeline: entry.timeline,
    });

    // TODO: POST to Supabase leads table
    // const { data, error } = await supabase.from("leads").insert([entry]);
    // Required env vars: SUPABASE_URL, SUPABASE_ANON_KEY
    // Table schema: id, created_at, name, email, company, website, needs, revenue,
    //   biggestPain, manualTask, timeSpent, tools, budget, timeline, extras,
    //   status (enum: new/contacted/paid/completed), stripe_payment_id

    // TODO: Trigger new lead email notification via Resend
    // const { data } = await resend.emails.send({
    //   from: "FlowZone AI <noreply@flowzone.dev>",
    //   to: "flowzoneautomation@gmail.com",
    //   subject: `New Lead: ${entry.name} — ${entry.budget}`,
    //   html: `<p>New lead from ${entry.name} (${entry.email})</p><pre>${JSON.stringify(entry, null, 2)}</pre>`,
    // });

    // TODO: Trigger welcome email to lead via Resend
    // const { data } = await resend.emails.send({
    //   from: "FlowZone AI <noreply@flowzone.dev>",
    //   to: entry.email,
    //   subject: "Your Free AI Audit is Being Prepared",
    //   html: `<p>Hi ${entry.name},</p><p>We received your request and will send your custom automation plan within 24 hours.</p>`,
    // });

    return NextResponse.json({
      success: true,
      message: "Lead received. We'll be in touch within 24 hours.",
    });
  } catch (error) {
    console.error("[FlowZone] Error saving lead:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save lead" },
      { status: 500 }
    );
  }
}
