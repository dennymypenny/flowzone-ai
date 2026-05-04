import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the FlowZone AI assistant. FlowZone AI builds custom automations, websites, dashboards, and AI workflows for any business.

Keep every reply to 1-2 short sentences. Always end by pointing to /intake or our email flowzoneautomation@gmail.com. We can do anything — if unsure, say we'll figure it out together. Never mention pricing.`;

function keywordFallback(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("dashboard") || m.includes("kpi") || m.includes("report"))
    return "We build live KPI dashboards that update automatically from all your tools. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("lead") || m.includes("crm") || m.includes("sales") || m.includes("follow"))
    return "We automate lead capture and CRM entry so every lead gets a response in under 60 seconds. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("automat") || m.includes("workflow") || m.includes("manual"))
    return "We map and automate any manual workflow end-to-end, delivered in 7 days or less. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("email") || m.includes("nurture") || m.includes("sequence"))
    return "We build behavior-triggered email sequences that send the right message at the right time. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("support") || m.includes("ticket") || m.includes("helpdesk"))
    return "We build AI triage systems that auto-route support tickets and send instant customer replies. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("invoice") || m.includes("payment") || m.includes("billing"))
    return "We automate invoicing, payment reminders, and bookkeeping sync so you get paid faster. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("website") || m.includes("portfolio") || m.includes("site"))
    return "We build fast, conversion-focused websites and portfolios delivered in 7 days. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("content") || m.includes("social") || m.includes("blog"))
    return "We automate content repurposing across social, email, and video — publish once, distribute everywhere. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("booking") || m.includes("appointment") || m.includes("schedul"))
    return "We automate your full booking flow — confirmations, reminders, and reschedules. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("integrat") || m.includes("api") || m.includes("connect") || m.includes("zapier"))
    return "We connect any tools together using APIs and webhooks — no matter the platform. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("price") || m.includes("cost") || m.includes("how much"))
    return "Pricing depends on your project scope — we'll give you a custom quote after a free audit. Start at /intake or email flowzoneautomation@gmail.com.";
  return "We can build or automate almost anything for your business. Tell us what you need at /intake or email flowzoneautomation@gmail.com.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content ?? "";

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
            max_tokens: 120,
            messages: [{ role: "system", content: SYSTEM }, ...messages],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return NextResponse.json({ text });
        }
      } catch { /* fall through */ }
    }

    return NextResponse.json({ text: keywordFallback(lastMessage) });
  } catch {
    return NextResponse.json({ text: "We can help with that! Email us at flowzoneautomation@gmail.com or visit /intake." });
  }
}
