import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();

  // TODO: Verify Stripe webhook signature
  // const sig = req.headers.get("stripe-signature");
  // const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[FlowZone Stripe] Event received:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as {
        customer_details?: { email?: string; name?: string };
        amount_total?: number;
        id?: string;
      };
      const email = session.customer_details?.email;
      const name = session.customer_details?.name;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      console.log(`[FlowZone Stripe] Payment completed: ${name} (${email}) — $${amount}`);

      // TODO: Update lead status in Supabase to "paid"
      // await supabase.from("leads").update({ status: "paid", stripe_payment_id: session.id })
      //   .eq("email", email);

      // TODO: Send onboarding email via Resend
      // await resend.emails.send({
      //   from: "FlowZone AI <noreply@flowzone.dev>",
      //   to: email,
      //   subject: "Your AI Scan & Diagnosis Has Started",
      //   html: `<p>Hi ${name},</p><p>We received your payment. Our team is starting your AI Scan now and will deliver your roadmap within 48 hours.</p><p>Questions? Reply to this email or reach us at flowzoneautomation@gmail.com</p>`,
      // });

      // TODO: Notify internal team
      // await resend.emails.send({
      //   from: "FlowZone AI <noreply@flowzone.dev>",
      //   to: "flowzoneautomation@gmail.com",
      //   subject: `New AI Scan Payment: ${name} — $${amount}`,
      //   html: `<p>New paid client: ${name} (${email}). Stripe session: ${session.id}. Start the 48-hour clock.</p>`,
      // });

      break;
    }

    case "payment_intent.payment_failed": {
      console.log("[FlowZone Stripe] Payment failed:", event.data.object);
      break;
    }

    default:
      console.log("[FlowZone Stripe] Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
