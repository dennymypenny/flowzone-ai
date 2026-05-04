import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | FlowZone AI",
  description: "Transparent pricing for every automation service FlowZone AI offers.",
};

const services = [
  { icon: "🎯", name: "Lead Intake & CRM Automation", desc: "Capture, score, and route leads automatically into your CRM with instant follow-up.", from: "997" },
  { icon: "📅", name: "Appointment Booking & Reminders", desc: "Automated confirmations, reminders, and reschedule handling end-to-end.", from: "797" },
  { icon: "🤖", name: "Customer Support Triage", desc: "AI classifies, routes, and acknowledges support tickets without human input.", from: "1,197" },
  { icon: "📊", name: "Automated Reporting & Dashboards", desc: "Weekly KPI reports delivered to your inbox — pulled from every tool you use.", from: "1,297" },
  { icon: "💳", name: "Invoice & Payment Workflows", desc: "Auto-generate invoices, chase late payments, and sync your books automatically.", from: "897" },
  { icon: "✍️", name: "Content Repurposing Automation", desc: "Turn one piece of content into posts, clips, and newsletters across every platform.", from: "897" },
  { icon: "📧", name: "Email Sequence & Nurture", desc: "Behavior-triggered email flows that send the right message to the right person.", from: "797" },
  { icon: "🔗", name: "Custom API & Tool Integrations", desc: "Connect any two platforms together with real-time data sync and webhooks.", from: "1,097" },
  { icon: "🌐", name: "Website or Portfolio Development", desc: "Fast, mobile-first business sites and portfolios delivered in 7 days.", from: "497" },
  { icon: "🤔", name: "Something Else — Custom Project", desc: "Have a unique workflow or idea? We'll scope it and build exactly what you need.", from: "497" },
];

export default function Pricing() {
  return (
    <>
      <section className="bg-white pt-20 pb-16 px-6 border-b border-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Transparent Pricing</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Every Service. Every Price.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            No retainers, no surprises. Each project is scoped and quoted upfront. Start with a free audit and we'll tell you exactly what it takes.
          </p>
          <Link href="/intake" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
            Get a Free Custom Quote →
          </Link>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl border border-blue-100 p-6 hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon}</span>
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{s.name}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-400 uppercase font-bold tracking-wide">Starting at</span>
                    <div className="text-2xl font-black text-blue-600">${s.from}</div>
                  </div>
                  <Link href="/intake" className="text-sm bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                    Get Quote →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded-3xl p-10 text-center border border-blue-100">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Need Multiple Services?</h2>
            <p className="text-gray-500 text-lg mb-6 max-w-xl mx-auto">
              Bundle automations for a custom rate. Most clients save 20–30% when combining two or more services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/intake" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
                Get a Bundle Quote →
              </Link>
              <Link href="mailto:flowzoneautomation@gmail.com" className="text-blue-600 font-semibold px-8 py-4 rounded-xl border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                Email Us Directly →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Take our free AI audit — we'll review your workflow and tell you exactly what to automate first and what it will cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
              Start Free AI Audit →
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