import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the FlowZone AI assistant. FlowZone AI is a creative and business studio that turns ideas into brands, sites, storefronts, dashboards and the systems that run them.

Keep every reply to 1-2 short sentences. Always end by pointing to /intake or our email flowzoneautomation@gmail.com. If you are unsure whether we can build something, say we'll figure it out together. We sell three flat packages, Starter at $997, Growth at $2,497 and Scale as a custom quote, so send pricing questions to /pricing.

Brand voice rules, follow these strictly. Never use the words "automate", "automated" or "automation" to describe what we do, even when the visitor uses those words themselves. Say we build systems, or that something runs itself, or that it is hands-free. Never use em dashes. Never use an Oxford comma.`;

function keywordFallback(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("dashboard") || m.includes("kpi") || m.includes("report"))
    return "We build live KPI dashboards that pull from every tool you already run, so the numbers stay current without you touching them. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("lead") || m.includes("crm") || m.includes("sales") || m.includes("follow"))
    return "We build lead intake that captures, sorts and answers every new lead in under 60 seconds, hands-free. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("automat") || m.includes("workflow") || m.includes("manual"))
    return "Tell us the manual work eating your week and we build a system that runs it for you, start to finish. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("email") || m.includes("nurture") || m.includes("sequence"))
    return "We build email flows that send the right message at the right moment once someone acts. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("support") || m.includes("ticket") || m.includes("helpdesk"))
    return "We build AI triage that routes support tickets and sends instant customer replies, with you reviewing anything that matters. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("invoice") || m.includes("payment") || m.includes("billing"))
    return "We build invoicing, payment reminders and bookkeeping sync into one system so you get paid faster. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("website") || m.includes("portfolio") || m.includes("site"))
    return "We design and build fast sites, storefronts and portfolios that look like you and convert. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("content") || m.includes("social") || m.includes("blog"))
    return "We build content pipelines across social, email and video, so you publish once and it lands everywhere. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("booking") || m.includes("appointment") || m.includes("schedul"))
    return "We build the whole booking flow, confirmations and reminders and reschedules, so your calendar runs itself. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("integrat") || m.includes("api") || m.includes("connect") || m.includes("zapier"))
    return "We wire your tools together with APIs and webhooks, whatever platforms you are on. Start at /intake or email flowzoneautomation@gmail.com.";
  if (m.includes("price") || m.includes("cost") || m.includes("how much"))
    return "Three flat packages, Starter at $997, Growth at $2,497 and Scale as a custom quote. See what each one includes at /pricing or email flowzoneautomation@gmail.com.";
  return "You bring the idea, we build the whole thing, brand and site and the systems that run it. Tell us what you need at /intake or email flowzoneautomation@gmail.com.";
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
    return NextResponse.json({ text: "We can build that. Email us at flowzoneautomation@gmail.com or visit /intake." });
  }
}
