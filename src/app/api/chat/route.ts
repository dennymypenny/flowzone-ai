import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the FlowZone AI assistant. FlowZone AI is a done-for-you automation agency.

Services:
- Lead intake & CRM automation
- Appointment booking & reminders
- Customer support triage
- Automated reporting & KPI dashboards
- Invoice & payment workflows
- Content repurposing automation
- Email nurture sequences
- Custom API integrations
- Website & portfolio development

All work is done via email. Delivery in 7 days or less. No calls required.

Help visitors identify which service fits their problem and guide them to /intake for a free audit.
Never mention pricing. Keep replies to 2-3 sentences. Be direct and helpful.`;

// Keyword-based fallback when Groq is unavailable
function keywordFallback(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("dashboard") || msg.includes("kpi") || msg.includes("report") || msg.includes("metric")) {
    return "We build automated KPI dashboards that pull live data from all your tools and deliver weekly reports to your inbox — no manual work needed. Sounds like a great fit! Tell us more at /intake and we'll send you a free custom plan.";
  }
  if (msg.includes("lead") || msg.includes("crm") || msg.includes("sales") || msg.includes("follow") || msg.includes("prospect")) {
    return "We automate lead capture, scoring, and CRM entry so hot leads get a response in under 60 seconds — even while you sleep. Head to /intake and we'll map out exactly how this would work for your business.";
  }
  if (msg.includes("automat") || msg.includes("workflow") || msg.includes("manual") || msg.includes("repetiti")) {
    return "That's exactly what we do — we map your manual workflows and automate them end-to-end so your team can focus on real work. Drop us your details at /intake and we'll put together a free automation plan for you.";
  }
  if (msg.includes("email") || msg.includes("nurture") || msg.includes("sequence") || msg.includes("newsletter")) {
    return "We design and automate full email nurture sequences triggered by user behavior — so every lead gets the right message at the right time. Get your free plan at /intake.";
  }
  if (msg.includes("support") || msg.includes("ticket") || msg.includes("customer service") || msg.includes("helpdesk")) {
    return "We build AI triage systems that auto-classify support tickets, route them to the right person, and send instant customer acknowledgements. Learn more at /intake.";
  }
  if (msg.includes("invoice") || msg.includes("payment") || msg.includes("billing") || msg.includes("finance")) {
    return "We automate your entire invoicing cycle — from generating invoices on project milestones to chasing late payments automatically. Start with a free audit at /intake.";
  }
  if (msg.includes("website") || msg.includes("portfolio") || msg.includes("site") || msg.includes("web")) {
    return "We build fast, conversion-focused business sites and portfolios — delivered in 7 days or less, no bloated page builders. Tell us about your project at /intake.";
  }
  if (msg.includes("content") || msg.includes("social") || msg.includes("post") || msg.includes("blog") || msg.includes("video")) {
    return "We build systems that take your core content and automatically repurpose it across social, email, and more — so you publish once and distribute everywhere. Set it up at /intake.";
  }
  if (msg.includes("booking") || msg.includes("appointment") || msg.includes("schedul") || msg.includes("calendar")) {
    return "We automate your entire booking flow — confirmations, reminders, reschedules — so no-shows drop and clients always show up prepared. Get started at /intake.";
  }
  if (msg.includes("integrat") || msg.includes("api") || msg.includes("connect") || msg.includes("zapier") || msg.includes("make")) {
    return "We build custom integrations between any platforms — APIs, webhooks, middleware — so your entire stack works as one connected system. Tell us what you need at /intake.";
  }
  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much") || msg.includes("pricing")) {
    return "Pricing depends on the complexity of your workflow — we'll give you a custom quote after reviewing your project. Start with a free AI audit at /intake, no commitment required.";
  }
  if (msg.includes("how") || msg.includes("work") || msg.includes("process")) {
    return "Simple: you fill out our intake form, we review your workflow, and within 24 hours we send you a free custom automation plan. Everything moves via email — no calls required. Start at /intake.";
  }
  return "We can automate almost any business workflow — from lead intake to invoicing to reporting. Tell us what you're dealing with at /intake and we'll send you a free custom plan within 24 hours.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content ?? "";

    // Try Groq if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            max_tokens: 250,
            messages: [
              { role: "system", content: SYSTEM },
              ...messages,
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return NextResponse.json({ text });
        }
      } catch {
        // Fall through to keyword fallback
      }
    }

    // Keyword fallback — always works
    const text = keywordFallback(lastMessage);
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[FlowZone Chat] Error:", error);
    return NextResponse.json({
      text: "We can automate almost any business workflow. Tell us what you need at /intake and we'll send you a free plan within 24 hours.",
    });
  }
}
