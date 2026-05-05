import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for FlowZone AI automations. No retainers. No fluff. Just results.",
};

const services = [
  { icon: "🎯", name: "Lead Intake & CRM Automation", price: "$997", desc: "Capture, score, and route leads automatically. Instant follow-up, CRM synced, hot leads flagged in Slack." },
  { icon: "📅", name: "Appointment Booking & Reminders", price: "$797", desc: "Full booking flow with confirmations, reminders, and post-call follow-ups. No more no-shows." },
  { icon: "🤖", name: "Customer Support Triage", price: "$1,197", desc: "AI reads, classifies, and routes every ticket. Instant customer acknowledgements and escalation triggers." },
  { icon: "📊", name: "Automated Reporting & Dashboards", price: "$1,297", desc: "Weekly KPI reports delivered to your inbox or Slack — automatically. No manual data pulling." },
  { icon: "💳", name: "Invoice & Payment Workflows", price: "$897", desc: "Auto-generate invoices, send reminders, sync with your accounting software when payment lands." },
  { icon: "✍️", name: "Content Repurposing Automation", price: "$897", desc: "Turn one piece of content into social posts, newsletters, and clips across every platform." },
  { icon: "📧", name: "Email Nurture Sequences", price: "$797", desc: "Behavior-triggered email flows that send the right message at the right time, on autopilot." },
  { icon: "🔗", name: "Custom API & Tool Integrations", price: "$1,097", desc: "Connect any two tools that don't talk to each other. Webhooks, middleware, real-time sync." },
  { icon: "🌐", name: "Website or Portfolio", price: "$497", desc: "Clean, fast, professional site built and deployed. Perfect for agencies, freelancers, and small businesses." },
  { icon: "🤔", name: "Custom Workflow", price: "$497+", desc: "Have something unique in mind? Tell us what you need and we'll build it." },
];

export default function Pricing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Simple, Flat-Rate Pricing</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            No retainers. No hourly rates. No surprises. Pay once, get your automation built and delivered in 7 days or less.
          </p>
          <Link href="/intake" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
            Start My Project →
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.name} className="bg-blue-50 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">{s.name}</h2>
                </div>
                <span className="text-xl font-black text-blue-600 shrink-0">{s.price}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <Link
                href={`/intake?service=${encodeURIComponent(s.name)}`}
                className="mt-auto inline-block text-center bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start This Project →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bundle callout */}
      <section className="py-12 px-6 bg-blue-50">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-blue-100 p-10 text-center shadow-sm">
          <div className="text-4xl mb-4">💼</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Need more than one?</h2>
          <p className="text-gray-500 mb-6">Bundle 2 or more automations and we&apos;ll work out a custom package price. Tell us what you need and we&apos;ll send a combined proposal.</p>
          <Link href="/intake" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
            Get a Bundle Quote →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Not sure which one you need?</h2>
          <p className="text-blue-200 text-lg mb-8">Tell us what you&apos;re dealing with and we&apos;ll recommend the right solution — no commitment required.</p>
          <Link href="/intake" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors inline-block">
            Talk to Us First →
          </Link>
        </div>
      </section>
    </>
  );
}
