import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Services | FlowZone AI",
    description: "Done-for-you AI workflow systems for service businesses. Lead automation, invoicing, reporting, client onboarding and more — delivered in 7 days.",
};

const services = [
  {
        icon: "⚡",
        title: "Lead Follow-Up Automation",
        description: "Every new lead gets a personalized reply in under 60 seconds — 24/7. We connect your contact forms, DMs, and ad leads into one system that responds, qualifies, and routes automatically.",
        results: ["47 avg leads handled/week", "Response time: 1.8 seconds", "30–50% more booked calls"],
        price: "From $1,200",
  },
  {
        icon: "🧾",
        title: "Invoice & Billing Automation",
        description: "Mark a job complete and your invoice goes out automatically — pre-filled with client details, project scope, and payment link. Follow-ups send themselves if unpaid.",
        results: ["Zero manual invoicing", "Avg payment 2 days faster", "Integrated with QuickBooks, Stripe"],
        price: "From $900",
  },
  {
        icon: "📊",
        title: "Automated Weekly Reports",
        description: "Pull data from your CRM, analytics, ads, and accounting tools. Every Monday at 9am, a formatted performance report lands in your inbox — no compiling, no copy-paste.",
        results: ["5+ data sources in 4 seconds", "Custom KPI dashboards", "Client-ready or internal format"],
        price: "From $800",
  },
  {
        icon: "🚀",
        title: "Client Onboarding System",
        description: "When a proposal is accepted, your entire onboarding sequence fires automatically: welcome email, contract, intake form, project portal access, and kickoff call link — in minutes.",
        results: ["Save 60–90 min per new client", "DocuSign + Calendly integrated", "Professional first impression"],
        price: "From $1,100",
  },
  {
        icon: "⭐",
        title: "Review & Referral Automation",
        description: "3 days after project delivery, a personalized review request goes out automatically. Happy clients leave reviews. Great clients get a referral prompt. All hands-free.",
        results: ["4–8x more Google reviews", "Automated referral tracking", "Boosts local SEO rankings"],
        price: "From $600",
  },
  {
        icon: "🔁",
        title: "Full Workflow Audit + Build",
        description: "We map every repetitive process in your business, identify the highest-ROI automations, and build them all in one sprint. Most clients recover 10+ hours per week.",
        results: ["Custom automation roadmap", "7-day delivery", "Full handoff + training"],
        price: "From $3,500",
  },
  {
        icon: "🌐",
        title: "Custom Website Build",
        description: "We design and build fast, conversion-focused websites and landing pages from scratch — no templates. Whether you need a full business site, a sales page, or a client portal, we build it clean and deploy it fast.",
        results: ["Live in 7 days or less", "Mobile-first, fully responsive", "SEO-optimized structure"],
        price: "From $1,500",
  },
  {
        icon: "📈",
        title: "Interactive Business Dashboards",
        description: "Stop guessing what's working. We build live dashboards that pull data from your CRM, ad platforms, and finance tools into one clear view — updated automatically so you always know your numbers.",
        results: ["Real-time KPI visibility", "Multi-source data in one view", "Custom metrics & filters"],
        price: "From $1,200",
  },
  {
        icon: "📰",
        title: "Newsletter Build & Automation",
        description: "We set up your full newsletter operation — platform setup, design, and automated send sequences. You write or we help, and the system handles scheduling, segmentation, and delivery every time.",
        results: ["Full platform setup included", "Automated send sequences", "Subscriber growth tracking"],
        price: "From $800",
  },
  ];

const process = [
  { step: "01", title: "Free AI Audit", desc: "We review your current workflows and identify exactly where you're losing time and money. Delivered in 24 hours." },
  { step: "02", title: "Custom Roadmap", desc: "You get a prioritized automation plan with ROI estimates for each workflow — before we build a single thing." },
  { step: "03", title: "We Build It", desc: "Our team builds, tests, and deploys your automations. Most projects go live within 7 days." },
  { step: "04", title: "Handoff + Support", desc: "Full walkthrough, documentation, and 30 days of support so everything keeps running smoothly." },
  ];

export default function Services() {
    return (
          <>
            {/* Hero */}
                <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
                        <div className="max-w-3xl mx-auto text-center">
                                  <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-4">What We Build</p>
                                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                              Done-For-You<br />
                                              <span className="text-sky-500">AI Workflow Systems</span>
                                  </h1>
                                  <p className="text-xl text-gray-500 leading-relaxed mb-8">
                                              We design, build, and deploy custom automations for your business — delivered in 7 days or less. You focus on growth; we handle the grind.
                                  </p>
                                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                              <Link href="/intake" className="bg-sky-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-sky-700 transition-colors">
                                                            Get Free AI Audit &rarr;
                                              </Link>
                                              <Link href="/case-studies" className="border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-xl hover:border-sky-300 hover:text-sky-600 transition-colors">
                                                            See Case Studies
                                              </Link>
                                  </div>
                        </div>
                </section>
          
            {/* Services Grid */}
                <section className="py-20 px-6 bg-white">
                        <div className="max-w-5xl mx-auto">
                                  <div className="text-center mb-14">
                                              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Services</p>
                                              <h2 className="text-4xl font-black text-gray-900">Everything We Build</h2>
                                  </div>
                                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map((s, i) => (
                          <div key={i} className="border border-gray-100 rounded-2xl p-7 hover:border-sky-200 hover:shadow-lg transition-all group">
                                          <div className="text-3xl mb-4">{s.icon}</div>
                                          <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                                          <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.description}</p>
                                          <ul className="space-y-1.5 mb-5">
                                            {s.results.map((r, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                                      <span className="text-sky-500 font-bold">&#10003;</span> {r}
                                                </li>
                                              ))}
                                          </ul>
                                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <span className="text-sky-600 font-black text-sm">{s.price}</span>
                                                            <Link href="/intake" className="text-xs font-bold text-gray-400 hover:text-sky-600 transition-colors group-hover:text-sky-600">
                                                                                Get started &rarr;
                                                            </Link>
                                          </div>
                          </div>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* Process */}
                <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto">
                                  <div className="text-center mb-14">
                                              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
                                              <h2 className="text-4xl font-black text-gray-900">From Audit to Automation in 7 Days</h2>
                                  </div>
                                  <div className="grid md:grid-cols-4 gap-6">
                                    {process.map((p, i) => (
                          <div key={i} className="text-center">
                                          <div className="w-12 h-12 bg-sky-600 text-white text-lg font-black rounded-xl flex items-center justify-center mx-auto mb-4">
                                            {p.step}
                                          </div>
                                          <h3 className="font-black text-gray-900 mb-2">{p.title}</h3>
                                          <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                          </div>
                        ))}
                                  </div>
                        </div>
                </section>
          
            {/* Pricing note */}
                <section className="py-14 px-6 bg-white border-t border-gray-100">
                        <div className="max-w-3xl mx-auto text-center">
                                  <h2 className="text-2xl font-black text-gray-900 mb-3">Transparent Pricing. No Retainers.</h2>
                                  <p className="text-gray-500 mb-2">Every project is scoped and priced upfront — no surprises, no monthly fees unless you want ongoing support.</p>
                                  <p className="text-gray-400 text-sm mb-8">Most projects pay for themselves within 30 days through time savings and recovered revenue.</p>
                                  <Link href="/intake" className="inline-block bg-sky-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-sky-700 transition-colors text-lg">
                                              Get Your Free Automation Audit &rarr;
                                  </Link>
                        </div>
                </section>
          </>
        );
}
