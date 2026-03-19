import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real automation results from real clients. See how FlowZone AI has saved businesses 10+ hours a week with done-for-you workflow automations.",
};

const cases = [
  {
    client: "SaaS Startup",
    industry: "B2B Software",
    challenge:
      "The team was manually adding every inbound lead to HubSpot, sending a personalized intro email, and posting to Slack — taking 2–3 hours a day.",
    solution:
      "Built a fully automated lead intake system: form submission → AI lead scoring → HubSpot record creation → personalized email → Slack notification. Zero manual steps.",
    results: [
      { label: "Hours saved/week", value: "15 hrs" },
      { label: "Lead response time", value: "< 30 sec" },
      { label: "Leads processed", value: "1,200+" },
      { label: "ROI in 90 days", value: "~18x" },
    ],
    tools: ["HubSpot", "Typeform", "Slack", "OpenAI", "Make"],
    quote:
      "We went from manually following up on 50 leads a week to having it fully automated. We booked 3 new clients in the first week alone.",
    quoteName: "Sarah K.",
    quoteRole: "Founder",
    emoji: "🎯",
  },
  {
    client: "E-Commerce Brand",
    industry: "Direct-to-Consumer",
    challenge:
      "Weekly reporting took the ops team 8+ hours — pulling data from Shopify, Google Ads, and Meta into a spreadsheet, then writing a summary for the CEO.",
    solution:
      "Built an automated weekly report pipeline: data pulled from all platforms every Monday → AI-generated summary → formatted PDF report → delivered to the CEO's inbox at 8 AM.",
    results: [
      { label: "Hours saved/month", value: "32 hrs" },
      { label: "Report accuracy", value: "100%" },
      { label: "Delivery time", value: "Auto 8AM" },
      { label: "Payback period", value: "< 3 weeks" },
    ],
    tools: ["Shopify", "Google Ads", "Meta", "OpenAI", "Airtable", "Resend"],
    quote:
      "The reporting workflow alone saves us 8 hours a month. The team delivers fast and the quality is exceptional.",
    quoteName: "Marcus T.",
    quoteRole: "COO",
    emoji: "📊",
  },
  {
    client: "Consultant & Coach",
    industry: "Professional Services",
    challenge:
      "Booking discovery calls was a nightmare — back-and-forth emails, missed follow-ups, and no-shows with no automated reminders.",
    solution:
      "Built a complete booking automation: intake form → AI qualification → Calendly auto-booking → email + SMS confirmation → reminder sequence → post-call follow-up email.",
    results: [
      { label: "Booking rate", value: "+40%" },
      { label: "No-shows", value: "-70%" },
      { label: "Hours saved/week", value: "8 hrs" },
      { label: "Setup time", value: "5 days" },
    ],
    tools: ["Calendly", "Typeform", "Twilio", "Gmail", "Make"],
    quote:
      "I was skeptical about AI automations, but they built exactly what I described. My booking rate went up 40% in two weeks.",
    quoteName: "Priya M.",
    quoteRole: "Consultant & Coach",
    emoji: "📅",
  },
];

export default function CaseStudies() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">Proof</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Real Results. Real Clients.</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Every automation we build is custom, fully tested, and handed off to you live. Here's what that looks like in practice.
          </p>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-20">
          {cases.map((c, i) => (
            <div key={c.client} className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
              {/* Left: Details */}
              <div className={i % 2 === 1 ? "md:col-start-2" : ""}>
                <div className="text-4xl mb-4">{c.emoji}</div>
                <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2">{c.industry}</p>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{c.client}</h2>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">The Challenge</h3>
                  <p className="text-gray-600 leading-relaxed">{c.challenge}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What We Built</h3>
                  <p className="text-gray-600 leading-relaxed">{c.solution}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {c.tools.map((t) => (
                      <span key={t} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Results + Quote */}
              <div className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                <div className="bg-gray-950 rounded-2xl p-8 mb-6">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">Results</p>
                  <div className="grid grid-cols-2 gap-6">
                    {c.results.map((r) => (
                      <div key={r.label}>
                        <p className="text-3xl font-black text-white">{r.value}</p>
                        <p className="text-gray-400 text-sm mt-1">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
                  <p className="text-gray-700 leading-relaxed mb-4 italic">"{{c.quote}}"</p>
                  <p className="font-bold text-gray-900 text-sm">{{c.quoteName}}</p>
                  <p className="text-gray-400 text-xs">{{c.quoteRole}}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Want Results Like These?</h2>
          <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
            Tell us what's eating your time. We'll send you a free custom automation plan in 24 hours.
          </p>
          <Link
            href="/intake"
            className="inline-block bg-white text-indigo-600 font-black px-10 py-5 rounded-xl hover:bg-indigo-50 transition-colors text-lg"
          >
            Get Your Free AI Audit →
          </Link>
          <p className="text-indigo-300 text-sm mt-4">No commitment · Delivered in 24 hours</p>
        </div>
      </section>
    </>
  );
}
