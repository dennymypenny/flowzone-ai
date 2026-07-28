import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | FlowZone AI",
  description: "Full brand sites and storefronts, plus done-for-you systems across sales, ops, support, finance and marketing.",
};

const services = [
  {
    icon: "🛍️",
    category: "Creative",
    title: "Brand Sites & Storefronts",
    description: "Your idea deserves more than a template. We design and build full brand sites and online stores that look premium and convert, like CardsRG, a collector storefront we took from idea to live shop.",
    outcomes: ["Full site or storefront designed and built", "Copy, layout and product pages done for you", "Stripe checkout and payments wired up", "Live in days, not months"],
    tools: ["Next.js", "Vercel", "Stripe", "Shopify", "Figma"],
  },
  {
    icon: "🎯",
    category: "Sales",
    title: "Lead Intake & Qualification",
    description: "Stop losing leads to slow follow-up. We build a system that captures leads from any source, scores them with AI, sends personalized responses within seconds, and files everything into your CRM for you.",
    outcomes: ["Instant lead response (< 60 seconds)", "Auto-CRM entry & tagging", "Slack/email notifications for hot leads", "AI-personalized outreach emails"],
    tools: ["HubSpot", "Salesforce", "Airtable", "Typeform", "Calendly"],
  },
  {
    icon: "📅",
    category: "Operations",
    title: "Appointment Booking & Reminders",
    description: "We build your entire booking flow, from calendar link to confirmation email to reminder sequence, so clients show up prepared and no-shows drop dramatically.",
    outcomes: ["Hands-free booking confirmations", "Multi-step reminder sequences", "Reschedule/cancel handling", "Post-call follow-up built in"],
    tools: ["Calendly", "Google Calendar", "Acuity", "Zoom", "Gmail"],
  },
  {
    icon: "🤖",
    category: "Support",
    title: "Customer Support Triage",
    description: "Our AI triage systems read incoming tickets, classify them by urgency, auto-route to the right person, and send instant acknowledgements — without extra headcount.",
    outcomes: ["Auto-ticket classification & routing", "Instant customer acknowledgements", "Escalation triggers for urgent issues", "Resolution tracking & reporting"],
    tools: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Linear"],
  },
  {
    icon: "📊",
    category: "Reporting",
    title: "Reporting & Dashboard Systems",
    description: "We build reporting systems that pull data from all your tools, compile it into clean summaries, and deliver them to your inbox or Slack every week — zero manual work.",
    outcomes: ["Weekly KPI summaries on autopilot", "Multi-source data aggregation", "Custom Slack/email digests", "Real-time dashboard updates"],
    tools: ["Google Sheets", "Notion", "Airtable", "Slack", "Looker"],
  },
  {
    icon: "💳",
    category: "Finance",
    title: "Invoice & Payment Workflows",
    description: "We build your invoicing cycle end to end, from generating invoices when a milestone hits, to sending payment reminders, to syncing your books when payment lands.",
    outcomes: ["Invoices generated on triggers", "Payment reminder sequences", "Late payment escalation flows", "Accounting software sync"],
    tools: ["Stripe", "QuickBooks", "Xero", "PayPal", "Notion"],
  },
  {
    icon: "✍️",
    category: "Marketing",
    title: "Content Repurposing Systems",
    description: "We build systems that take your core content — a podcast, blog post, or video — and turn it into social posts, email newsletters, and short-form clips for every platform without you lifting a finger.",
    outcomes: ["Blog → social posts (hands-free)", "Podcast → clips + show notes", "YouTube → email digest", "Consistent multi-channel publishing"],
    tools: ["Notion", "Buffer", "Beehiiv", "Zapier", "Make"],
  },
  {
    icon: "📧",
    category: "Email",
    title: "Email Nurture Systems",
    description: "We design full email nurture systems triggered by user behavior — clicks, sign-ups, purchases — so every lead gets the right message at the right time.",
    outcomes: ["Behavior-triggered email flows", "Segmentation & personalization", "A/B testing built in", "Unsubscribe & list hygiene handling"],
    tools: ["Mailchimp", "Klaviyo", "ActiveCampaign", "Beehiiv", "HubSpot"],
  },
  {
    icon: "🔗",
    category: "Integrations",
    title: "Custom API & Tool Integrations",
    description: "We build custom integrations between any platforms using APIs, webhooks, and middleware — so your entire stack works as one connected system.",
    outcomes: ["Any-to-any tool connection", "Real-time data sync", "Webhook processing & routing", "Custom middleware development"],
    tools: ["Zapier", "Make", "n8n", "REST APIs", "Webhooks"],
  },
];

export default function Services() {
  return (
    <>
      <section className="bg-white pt-20 pb-16 px-6 border-b border-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">What We Build</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Brands, Sites and Systems for Every Part of Your Business
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            We are a creative and business studio. We build the brand that gets you noticed and the systems that keep it running. AI gives us speed, humans give it taste.
          </p>
          <Link href="/intake" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
            Get Your Free AI Audit →
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {services.map((s, i) => (
            <div key={s.title} className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className="md:w-1/2">
                <div className="text-4xl mb-4">{s.icon}</div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{s.category}</p>
                <h2 className="text-3xl font-black text-gray-900 mb-4">{s.title}</h2>
                <p className="text-gray-500 leading-relaxed text-lg">{s.description}</p>
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4">What You Get</p>
                  <ul className="space-y-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-0.5 shrink-0">✓</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Tools We Use</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tools.map((t) => (
                      <span key={t} className="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-dashed border-blue-200 p-10 text-center">
            <div className="text-5xl mb-4">🤔</div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Custom Work</p>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Something Else Entirely?</h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto mb-8">
              We do a lot more than what's listed here. Tell us what you're dealing with — we'll figure it out together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/intake" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
                Tell Us What You Need →
              </Link>
              <Link href="mailto:flowzoneautomation@gmail.com" className="text-blue-600 font-semibold px-8 py-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-colors">
                Email Us Directly →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Build?</h2>
          <p className="text-blue-100 text-lg mb-8">Tell us what you're dealing with and we'll design a custom solution — free audit, no commitment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Get Your Free AI Audit →
            </Link>
            <Link href="mailto:flowzoneautomation@gmail.com" className="text-white border border-blue-400 font-semibold px-8 py-4 rounded-xl hover:border-white transition-colors">
              flowzoneautomation@gmail.com
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}