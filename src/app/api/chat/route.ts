import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the FlowZone AI assistant. FlowZone is a fast, done-for-you digital agency that builds exactly what clients need.

FlowZone builds:
- Live KPI dashboards and business consulting (Shopify, QuickBooks, CRMs, Google Sheets — connected and visualized)
- Workflow automations (Zapier, Make, n8n, Notion, Slack, Airtable, DocuSign, email sequences)
- Portfolio and resume sites (designers, engineers, creatives, consultants — live in 7-8 days)
- Business websites (local service businesses, agencies, landing pages — mobile-first, SEO-optimized)
- And more — FlowZone takes on a wide range of digital work beyond what is listed

How to respond:
- Be warm, direct, and specific. No filler words.
- Keep replies to 2-3 sentences max.
- Never mention pricing.
- All client communication happens through email — no calls ever.
- After 1-2 exchanges understanding what they need, suggest they visit /intake to start their project.
- If they seem ready, end with: Ready to get started? [Start your project →](/intake)`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await response.json();
    const text =
      data.content?.[0]?.text ??
      "I am having trouble right now. Head to /intake to tell us about your project.";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({
      text: "Something went wrong. Please visit /intake to get started.",
    });
  }
}
