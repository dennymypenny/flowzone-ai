import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";

const E = SITE.email;

const SYSTEM = `You are the studio assistant for FlowZone AI, a small creative studio.

FlowZone builds three things and only three things: Brand (identity, logo, palette, type, voice), Site (a marketing site or a full storefront, custom designed) and System (the thing that keeps running after launch: lead intake, booking, invoicing, reporting). Everything we do fits under one of those three. When a visitor describes a project, your main job is to tell them which of the three parts they need and why.

The studio's one line is: "${SITE.line}" A model does the fast part. A person decides what is good. Speed is real (most builds ship inside a week) but it is a supporting detail, never the lead. Do not open with speed.

Real shipped work: cardsrg.com, a collector trading card storefront we built end to end. The studio is early and takes a small number of projects at a time. Never invent clients, testimonials, ratings or stats. If asked how many clients we have had, say we are early and point to cardsrg.com.

Keep every reply to 1 or 2 short sentences. End by pointing to /intake or ${E}. Send pricing questions to /pricing: three flat packages, Starter at $997, Growth at $2,497 and Scale as a custom quote.

Voice rules, follow strictly. Never use the words "automate", "automated" or "automation" to describe what we do, even when the visitor uses them. Say we build systems, or that something runs itself, or that it is hands free. Never use em dashes. Never use an Oxford comma. Do not gush, do not use exclamation marks and do not call anything "amazing".`;

function keywordFallback(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("price") || m.includes("cost") || m.includes("how much") || m.includes("budget"))
    return `Three flat packages, Starter at $997, Growth at $2,497 and Scale as a custom quote. See what each includes at /pricing or email ${E}.`;

  if (m.includes("template") || m.includes("generic") || m.includes("looks bad") || m.includes("ugly"))
    return `That is usually a Brand problem showing up on the Site. We build the identity first, then design the site against it. Start at /intake or email ${E}.`;

  if (m.includes("brand") || m.includes("logo") || m.includes("identity") || m.includes("rebrand"))
    return `Brand is part one: logo, palette, type, voice and the rules for using them, so everything after it has something to be built from. Start at /intake or email ${E}.`;

  if (m.includes("store") || m.includes("shop") || m.includes("ecommerce") || m.includes("product") || m.includes("checkout"))
    return `Storefronts are our favorite kind of project, cardsrg.com is one we built end to end. Tell us the catalog at /intake or email ${E}.`;

  if (m.includes("website") || m.includes("site") || m.includes("landing") || m.includes("portfolio"))
    return `Site is part two, custom designed against your brand rather than a theme, and live on your own domain. Start at /intake or email ${E}.`;

  if (m.includes("lead") || m.includes("crm") || m.includes("follow") || m.includes("intake"))
    return `That is a System, part three. Lead intake that captures, sorts and answers every enquiry without you touching it. Start at /intake or email ${E}.`;

  if (m.includes("booking") || m.includes("appointment") || m.includes("schedul") || m.includes("calendar"))
    return `Booking, confirmations and reminders is a System build, wired into your site so the calendar runs itself. Start at /intake or email ${E}.`;

  if (m.includes("invoice") || m.includes("payment") || m.includes("billing"))
    return `Invoicing, reminders and books that stay in sync is a System build, so you get paid without chasing. Start at /intake or email ${E}.`;

  if (m.includes("dashboard") || m.includes("kpi") || m.includes("report") || m.includes("analytics"))
    return `Reporting is a System build, pulling from the tools you already run so the numbers stay current on their own. Start at /intake or email ${E}.`;

  if (m.includes("automat") || m.includes("workflow") || m.includes("manual") || m.includes("integrat") || m.includes("api"))
    return `Tell us the manual work eating your week and we build the System that runs it, connected to the tools you already have. Start at /intake or email ${E}.`;

  if (m.includes("work") || m.includes("portfolio") || m.includes("client") || m.includes("example"))
    return `We are early and we say so. The work page has cardsrg.com, a storefront we built end to end, and everything on it is live. See /work or email ${E}.`;

  return `We build three things: the brand, the site and the system that runs it. Tell us what you are launching at /intake or email ${E}.`;
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
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
      } catch {
        /* fall through */
      }
    }

    return NextResponse.json({ text: keywordFallback(lastMessage) });
  } catch {
    return NextResponse.json({
      text: `We can probably help. Email us at ${E} or start at /intake.`,
    });
  }
}
