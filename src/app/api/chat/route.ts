import { NextRequest, NextResponse } from "next/server";

const SYSTEM = `You are the FlowZone AI assistant. FlowZone AI is a done-for-you automation agency that builds custom AI workflows for businesses.

Services we offer:
- Lead intake & CRM automation
- Appointment booking & reminder flows
- Customer support triage systems
- Automated reporting & KPI dashboards
- Invoice & payment workflows
- Content repurposing automation
- Email nurture sequences
- Custom API integrations
- Website & portfolio development
- Any custom business automation

How we work: Everything is handled via email. No calls required. We deliver in 7 days or less.

Your job: Help visitors understand how FlowZone can solve their specific business problems. Ask what they're struggling with, identify automation opportunities, and guide them toward submitting the intake form at /intake.

Never mention pricing. Keep responses concise (2-4 sentences max). Be helpful, direct, and solution-focused. If someone is ready to move forward, direct them to /intake.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        messages: [
          { role: "system", content: SYSTEM },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[FlowZone Chat] Groq error:", err);
      return NextResponse.json({
        text: "I'm having trouble connecting right now. Please try again or email us at flowzoneautomation@gmail.com.",
      });
    }

    const data = await response.json();
    const text =
      data.choices?.[0]?.message?.content ??
      "I'm not sure how to help with that. Try emailing us directly at flowzoneautomation@gmail.com.";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[FlowZone Chat] Error:", error);
    return NextResponse.json({
      text: "Something went wrong. Please email us at flowzoneautomation@gmail.com.",
    });
  }
}
