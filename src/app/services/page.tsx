import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore FlowZone AI's full range of done-for-you automation services — from lead intake to invoice workflows.",
};

const services = [
  {
    icon: "🎯",
    category: "Sales",
    title: "Lead Intake & Qualification",
    description: "Stop losing leads to slow follow-up. We build automations that capture incoming leads from any source, score them with AI, send personalized responses within seconds, and push everything into your CRM — without you touching a single button.",
    outcomes: ["Instant lead response (< 60 seconds)", "Auto-CRM entry & tagging", "Slack/email notifications for hot leads", "AI-personalized outreach emails"],
    tools: ["HubSpot", "Salesforce", "Airtable", "Typeform", "Calendly"],
  },
  {
    icon: "📅",
    category: "Operations",
    title: "Appointment Booking & Reminders",
    description: "End the back-and-forth scheduling chaos. We automate your entire booking flow — from calendar link to confirmation email to reminder sequence — so clients show up prepared and no-shows drop dramatically.",
    outcomes: ["Automated booking confirmations", "Multi-step reminder sequences", "Reschedule/cancel handling", "Post-call follow-up automation"],
    tools: ["Calendly", "Google Calendar", "Acuity", "Zoom", "Gmail"],
  },
  {
    icon: "🤖",
    category: "Support",
    title: "Customer Support Triage",
    description: "Handle more support volume without more headcount. Our AI triage systems read incoming support tickets, classify them by urgency and type, auto-route to the right person or team, and send instant acknowledgement to the customer.",
    outcomes: ["Auto-ticket classification & routing", "Instant customer acknowledgements", "Escalation triggers for urgent issues", "Resolution tracking & reporting"],
    tools: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Linear"],
  },
  {
    icon: "📊",
    category: "Reporting",
    title: "Automated Reporting & Dashboards",
    description: "Get your weekly numbers without lifting a finger. We build automated reporting pipelines that pull data from all your tools, compile it into clean summaries, and deliver them to your inbox or Slack every Monday morning.",
    outcomes: ["Weekly KPI summaries on autopilot", "Multi-source data aggregation", "Custom Slack/email digests", "Real-time dashboard updates"],
    tools: ["Google Sheets", "Notion", "Airtable", "Slack", "Looker"],
  },
  {
    icon: "💳",
    category: "Finance",
    title: "Invoice & Payment Workflows",
    description: "Get paid faster with zero manual effort. We automate your entire invoicing cycle — from generating invoices when a project milestone hits, to sending payment reminders, to updating your books when payment lands.",
    outcomes: ["Auto-invoice generation on triggers", "Automated payment reminder sequences", "Late payment escalation flows", "Accounting software sync"],
    tools: ["Stripe", "QuickBooks", "Xero", "PayPal", "Notion"],
  },
  {
    icon: "✍️",
    category: "Marketing",
    title: "Content Repurposing Automation",
    description: "Publish once, distribute everywhere. We build systems that take your core content — a podcast, blog post, or video — and automatically generate social posts, email newsletters, and short-form clips for every platform.",
    outcomes: ["Blog → social posts (automated)", "Podcast → clips + show notes", "YouTube → email digest", "Consistent multi-channel publishing"],
    tools: ["Notion", "Buffer", "Beehiiv", "Zapier", "Make"],
  },
  {
    icon: "📧",
    category: "Email",
    title: "Email Sequence & Nurture Automation",
    description: "Build relationships while you sleep. We design and automate full email nurture sequences that trigger based on user behavior — clicks, sign-ups, purchases — so every lead gets the right message at the right time.",
    outcomes: ["Behavior-triggered email flows", "Segmentation & personalization", "A/B testing automation", "Unsubscribe & list hygiene handling"],
    tools: ["Mailchimp", "Klaviyo", "ActiveCampaign", "Beehiiv", "HubSpot"],
  },
  {
    icon: "🔗",
    category: "Integrations",
    title: "Custom API & Tool Integrations",
    description: "Got a tool that doesn't play nice with others? We build custom integrations between any platforms using APIs, webhooks, and middleware — so your entire stack finally works as one connected system.",
    outcomes: ["Any-to-any tool connection", "Real-time data sync", "Webhook processing & routing", "Custom middleware development"],
    tools: ["Zapier", "Make", "n8n", "REST APIs", "Webhooks"],
  },
];
export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">What We Build</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            AI Automations for Every Part of Your Business
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            We specialize in high-impact, done-for-you automations across sales, ops, support, finance, and marketing.
          </p>
          <Link href="/intake" className="inline-block bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors">
            Get Your Free AI Audit →
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {services.map((s, i) => (
            <div key={s.title} className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className="md:w-1/2">
                <div className="text-4xl mb-4">{s.icon}</div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{s.category}</p>
                <h2 className="text-3xl font-black text-gray-900 mb-4">{s.title}</h2>
                <p className="text-gray-500 leading-relaxed text-lg">{s.description}</p>
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">What You Get</p>
                  <ul className="space-y-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5 shrink-0">✓</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Tools We Use</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tools.map((t) => (
                      <span key={t} className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Something Else card */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-200 p-10 text-center">
            <div className="text-5xl mb-4">🤔</div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Custom Work</p>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Something Else Entirely?</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto mb-8">
              We do a lot more than what's listed here. If you have a workflow, problem, or idea that doesn't fit neatly into a category — we want to hear it. Seriously, just tell us what you're dealing with.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/intake"
                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Tell Us What You Need →
              </Link>
              <Link
                href="/#chat"
                className="text-gray-700 font-semibold px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
              >
                Chat With Our AI First →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Don't See Exactly What You Need?</h2>
          <p className="text-indigo-200 text-lg mb-8">We build custom automations for any workflow. Tell us what you're dealing with and we'll design a solution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake" className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Get Your Free AI Audit →
            </Link>
            <Link href="/intake" className="text-white border border-indigo-400 font-semibold px-8 py-4 rounded-xl hover:border-white transition-colors">
              Submit Your Workflow →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
