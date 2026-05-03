import Link from "next/link";

const services = [
  {
    icon: "📊",
    title: "Business Consulting + KPI Dashboards",
    desc: "We sit down with you, map out your operations, and build real-time dashboards so you always know what's working — and what's not. Data that actually helps you make decisions.",
    bullets: [
      "Custom KPI and analytics dashboards",
      "Workflow analysis and consulting sessions",
      "Decision-ready reports and visualizations",
    ],
    price: "From $1,500",
    cta: "/intake",
  },
  {
    icon: "⚡",
    title: "Workflow Automation",
    desc: "We automate the repetitive work eating your time — lead follow-up, invoicing, reporting, and more. Set it up once, run it forever.",
    bullets: [
      "Lead capture and auto-reply systems",
      "Invoice and billing automation",
      "Automated reporting and data sync",
    ],
    price: "From $900",
    cta: "/intake",
  },
  {
    icon: "🎨",
    title: "Portfolio & Resume Sites",
    desc: "Stand out from the crowd. We build sharp personal websites and AI-polished resumes for job seekers, freelancers, and creatives who want to make a real impression.",
    bullets: [
      "Custom personal portfolio websites",
      "AI-enhanced resume writing and design",
      "LinkedIn and personal brand optimization",
    ],
    price: "From $500",
    cta: "/intake",
  },
  {
    icon: "🌐",
    title: "Business Websites & Landing Pages",
    desc: "Your website should work as hard as you do. We design and build clean, fast, conversion-focused sites and landing pages that represent your brand and drive action.",
    bullets: [
      "Full business websites and landing pages",
      "Mobile-ready and SEO-optimized",
      "Integrated contact forms and CTAs",
    ],
    price: "From $800",
    cta: "/intake",
  },
];

const steps = [
  {
    num: "01",
    title: "Free Consultation",
    desc: "We learn about your business, your goals, and your current setup. No pressure — just a real conversation about what would help most.",
  },
  {
    num: "02",
    title: "Custom Proposal",
    desc: "You get a clear proposal with scope, timeline, and pricing — before we start anything. No surprises.",
  },
  {
    num: "03",
    title: "We Build It",
    desc: "Our team designs, builds, and delivers your dashboard, site, or automation. Most projects go live within 7 days.",
  },
  {
    num: "04",
    title: "Handoff + Support",
    desc: "Full walkthrough, documentation, and 30 days of support so everything runs smoothly after launch.",
  },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4">
            WHAT WE DO
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Built for Businesses.
            <br />
            <span className="text-blue-600">Built for People.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We consult, design, and build — dashboards, automations, portfolios, and business sites. Whatever you need to grow, we deliver it fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/intake"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors"
            >
              Get Free Consultation →
            </Link>
            <Link
              href="/case-studies"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">
              OUR SERVICES
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              Everything We Build
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2 mb-6">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-blue-600 font-black mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-black text-lg">{s.price}</span>
                  <Link
                    href={s.cta}
                    className="text-sm font-black text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Get started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">
              HOW IT WORKS
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              From First Call to Final Delivery
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">
                  {step.num.replace("0", "")}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Not sure what you need?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Book a free consultation and we will figure it out together. No commitment, no pressure — just clarity on what would actually move the needle for you.
          </p>
          <Link
            href="/intake"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Book Free Consultation →
          </Link>
        </div>
      </section>
    </main>
  );
}
