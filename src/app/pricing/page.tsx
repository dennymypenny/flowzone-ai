import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | FlowZone AI",
  description:
    "Transparent pricing for consulting, dashboards, automation, portfolio sites, and business websites. Every project starts with a free consultation.",
};

const plans = [
  {
    icon: "📊",
    title: "Business Consulting + KPI Dashboard",
    price: "From $1,500",
    description:
      "We dig into your operations, identify your key metrics, and build you a live dashboard so you always know what's driving your business.",
    includes: [
      "Strategy + KPI mapping session",
      "Custom executive dashboard (real-time data)",
      "Integration with your existing tools (Shopify, QuickBooks, etc.)",
      "Channel and revenue performance views",
      "1 round of revisions + 30-day support",
    ],
    best: false,
    cta: "Get started",
  },
  {
    icon: "⚡",
    title: "Workflow Automation",
    price: "From $900",
    description:
      "Stop doing manually what a computer can do for you. We map your repetitive workflows and automate them end-to-end.",
    includes: [
      "Workflow audit + automation blueprint",
      "End-to-end automation build (Zapier, Make, or custom)",
      "Integration with your existing apps",
      "Testing + error handling",
      "Handoff documentation + 30-day support",
    ],
    best: true,
    cta: "Get started",
  },
  {
    icon: "🎨",
    title: "Portfolio & Resume Site",
    price: "From $500",
    description:
      "A clean, fast, professional site that makes recruiters and clients take you seriously.",
    includes: [
      "Custom design tailored to your field",
      "Portfolio / case study pages",
      "Resume or skills page",
      "Contact form wired to your inbox",
      "Mobile-optimized + deployed on Vercel",
    ],
    best: false,
    cta: "Get started",
  },
  {
    icon: "🌐",
    title: "Business Website & Landing Page",
    price: "From $800",
    description:
      "A modern, conversion-focused website that shows up on Google and turns visitors into leads — not just a pretty page.",
    includes: [
      "Homepage + up to 5 pages",
      "SEO metadata + page speed optimization",
      "Lead capture form or booking integration",
      "Mobile-first responsive design",
      "Deployed + connected to your domain",
    ],
    best: false,
    cta: "Get started",
  },
];

const faqs = [
  {
    q: "Do you offer payment plans?",
    a: "Yes — we typically split projects 50% upfront and 50% on delivery. For larger projects we can discuss a milestone-based structure.",
  },
  {
    q: "What if I need something custom?",
    a: "Most projects have custom elements. During your free consultation we'll scope exactly what you need and give you a firm quote before any work starts.",
  },
  {
    q: "Do you work with individuals or just businesses?",
    a: "Both. Freelancers, job seekers, consultants, small business owners, and growing companies are all clients we work with regularly.",
  },
  {
    q: "What happens after the project is done?",
    a: "Every project includes at least 30 days of post-launch support. We also offer ongoing retainers for clients who want continuous improvements.",
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6 text-center">
        <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
          ✦ Transparent Pricing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Know What You&apos;re Getting Before You Pay
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
          No surprise invoices. No scope creep. Every project starts with a free consultation and a
          firm quote.
        </p>
        <Link
          href="/intake"
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Book Your Free Consultation
        </Link>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={
                "relative border rounded-2xl p-8 flex flex-col " +
                (plan.best
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-gray-200")
              }
            >
              {plan.best && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-2xl">{plan.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{plan.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700">{plan.price}</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-2 mb-8 flex-1">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/intake"
                className={
                  "text-center font-semibold px-6 py-3 rounded-lg transition " +
                  (plan.best
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200")
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Need something that spans multiple services? We offer bundled packages — ask us during your consultation.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-gray-100 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to get a real quote?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Tell us what you need. We will scope it, price it fairly, and deliver it.
        </p>
        <Link
          href="/intake"
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Start Your Free Consultation
        </Link>
      </section>
    </main>
  );
}
