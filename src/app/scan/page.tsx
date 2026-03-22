import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Scan & Diagnosis — $97 | FlowZone AI",
  description: "Get a complete audit of your business workflows, 3 automation opportunities ranked by ROI, and a prioritized roadmap — delivered in 48 hours.",
};

const deliverables = [
  {
    icon: "Audit",
    title: "Full Workflow Audit",
    desc: "We map every manual task, tool, and handoff in your business to find what's costing you the most time.",
  },
  {
    icon: "Top 3",
    title: "3 Automation Opportunities",
    desc: "Ranked by ROI — we identify the three highest-impact workflows to automate first.",
  },
  {
    icon: "Roadmap",
    title: "Prioritized Action Plan",
    desc: "A clear, step-by-step roadmap so you know exactly what to build, in what order, and why.",
  },
  {
    icon: "48hr",
    title: "Delivered in 48 Hours",
    desc: "No long calls, no waiting weeks. You get your full diagnosis delivered to your inbox within 48 hours.",
  },
];

export default function ScanPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
            One-Time Offer
          </div>
          <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
            AI Scan &amp; Diagnosis
          </h1>
          <p className="text-xl text-gray-500 mb-4 leading-relaxed">
            We audit your business, identify your top 3 automation opportunities ranked by ROI,
            and deliver a prioritized roadmap — all in 48 hours.
          </p>
          <div className="text-4xl font-black text-sky-600 mb-8">$97</div>
          <Link
            href="/intake"
            className="inline-block bg-sky-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-sky-700 transition-colors text-lg"
          >
            Get My AI Scan
          </Link>
          <p className="text-sm text-gray-400 mt-4">One-time payment. No subscription. Delivered in 48 hours.</p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {deliverables.map((item) => (
              <div key={item.title} className="border border-gray-100 rounded-2xl p-6">
                <div className="inline-block bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-sky-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to see what you can automate?</h2>
          <p className="text-sky-200 mb-8">Get your full AI Scan delivered in 48 hours for just $97.</p>
          <Link
            href="/intake"
            className="inline-block bg-white text-sky-600 font-bold px-10 py-4 rounded-xl hover:bg-sky-50 transition-colors text-lg"
          >
            Get My AI Scan — $97
          </Link>
        </div>
      </section>
    </div>
  );
}
