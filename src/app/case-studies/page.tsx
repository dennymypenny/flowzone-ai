import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies | FlowZone AI",
  description:
    "Real results from real clients. See how FlowZone AI has helped businesses and individuals through consulting, dashboards, automation, and custom websites.",
};

const cases = [
  {
    id: "dashboard-retail",
    tag: "Business Consulting + KPI Dashboard",
    icon: "📊",
    client: "Verde Supply Co.",
    industry: "Retail & E-Commerce",
    location: "Austin, TX",
    timeline: "3 weeks",
    challenge:
      "Verde Supply Co. was running a 7-figure product business with zero visibility into what was actually driving revenue. Their data lived in three disconnected tools — Shopify, QuickBooks, and a manual Google Sheet updated every Friday afternoon. Leadership couldn\'t answer basic questions like which SKU had the best margin or which ad channel drove repeat buyers.",
    solution:
      "We kicked off with a two-hour consulting session to map their KPIs and decision flows. From there, we designed and built a live executive dashboard pulling from Shopify and QuickBooks via Zapier, surfacing margin by product line, customer LTV by acquisition channel, and a rolling 90-day revenue trend — all in one view, updated daily.",
    results: [
      { label: "Hours saved per week", value: "8 hrs" },
      { label: "Revenue visibility", value: "Real-time" },
      { label: "ROI on ad spend", value: "+34%" },
      { label: "Delivery time", value: "3 weeks" },
    ],
    quote:
      "I used to wait until Monday to know how the weekend went. Now I check the dashboard from my phone before coffee.",
    quoteName: "Marcus T., Founder",
    tools: ["Shopify", "QuickBooks", "Zapier", "Google Looker Studio"],
  },
  {
    id: "automation-agency",
    tag: "Workflow Automation",
    icon: "⚡",
    client: "Pinnacle Media Group",
    industry: "Marketing Agency",
    location: "Remote",
    timeline: "2 weeks",
    challenge:
      "A 6-person creative agency was spending 12+ hours per week on manual client onboarding: chasing intake forms, creating Notion workspaces by hand, sending welcome emails, and scheduling kickoff calls one-by-one. Every new client felt like starting from scratch.",
    solution:
      "We automated their entire onboarding pipeline end-to-end. When a client signs a contract via DocuSign, the system automatically: sends a branded intake form, creates their Notion client workspace from a template, notifies the account lead in Slack, adds the kickoff call to Calendly, and sends a personalized welcome email — all within minutes.",
    results: [
      { label: "Hours saved per client", value: "4 hrs" },
      { label: "Onboarding time", value: "Minutes vs. days" },
      { label: "Client satisfaction score", value: "9.4 / 10" },
      { label: "Error rate", value: "~0%" },
    ],
    quote:
      "We onboarded three clients in one day last week and didn\'t break a sweat. That was impossible before.",
    quoteName: "Jasmine R., Agency Director",
    tools: ["Zapier", "Notion", "Calendly", "DocuSign", "Gmail"],
  },
  {
    id: "portfolio-designer",
    tag: "Portfolio & Resume Site",
    icon: "🎨",
    client: "Sofia Navarro",
    industry: "UX / Product Design",
    location: "New York, NY",
    timeline: "1 week",
    challenge:
      "Sofia had 5 years of strong UX work but her portfolio was a cluttered PDF she was embarrassed to send. She was applying for senior roles at top companies and needed something that showed not just her work, but her process and personality — fast.",
    solution:
      "We built Sofia a clean, responsive portfolio site featuring a case study layout with before/after flows, a resume page with filterable skills, and a contact form wired to her inbox. The design led with her strongest project and included a short about-me video embed. Live in 7 days.",
    results: [
      { label: "Job interviews booked", value: "4 in 2 weeks" },
      { label: "Recruiter response rate", value: "+60%" },
      { label: "Time to launch", value: "7 days" },
      { label: "Offer received", value: "Yes — 145K role" },
    ],
    quote:
      "I finally feel confident sharing my portfolio link. I got two recruiter DMs the first week it was live.",
    quoteName: "Sofia N., Senior UX Designer",
    tools: ["Next.js", "Tailwind CSS", "Vercel", "Notion", "Resend"],
  },
  {
    id: "website-hvac",
    tag: "Business Website & Landing Page",
    icon: "🌐",
    client: "Regal Home Solutions",
    industry: "Home Services",
    location: "Phoenix, AZ",
    timeline: "10 days",
    challenge:
      "Regal was a well-established HVAC and plumbing company with strong word-of-mouth but a website that hadn\'t been touched since 2017. They were losing leads to competitors who showed up better on Google. Their site wasn\'t mobile-friendly, had no clear call-to-action, and no way to book appointments online.",
    solution:
      "We redesigned their site from scratch: a modern homepage with a hero section, trust signals (BBB badge, reviews), and a sticky CTA. We added a service area map, a streamlined booking form, and wired everything to their existing scheduling software. SEO metadata and page speed optimizations were included.",
    results: [
      { label: "Monthly leads", value: "+80%" },
      { label: "Bounce rate", value: "-42%" },
      { label: "Google ranking", value: "Page 1 (local)" },
      { label: "Mobile score", value: "96 / 100" },
    ],
    quote:
      "We went from losing bids because our website looked sketchy to being the obvious choice. Worth every penny.",
    quoteName: "Derek M., Owner",
    tools: ["Next.js", "Tailwind CSS", "Vercel", "Google Search Console", "Resend"],
  },
];

export default function CaseStudies() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6 text-center">
        <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
          ✦ Client Results
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Real Work. Real Results.
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          From KPI dashboards to portfolio sites, here is a look at what we have
          built — and the outcomes clients actually saw.
        </p>
      </section>

      {/* Case Studies */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {cases.map((c) => (
          <div key={c.id} className="grid md:grid-cols-5 gap-10 items-start">
            {/* Left: details */}
            <div className="md:col-span-3 space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <span>{c.icon}</span>
                <span>{c.tag}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{c.client}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {c.industry} · {c.location} · {c.timeline}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">The Challenge</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{c.challenge}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">What We Built</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{c.solution}</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4 italic text-gray-700 text-sm">
                &ldquo;{c.quote}&rdquo;
                <p className="mt-1 not-italic font-semibold text-gray-800 text-xs">
                  — {c.quoteName}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {c.tools.map((t) => (
                  <span
                    key={t}
                    className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: results */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Results
              </h3>
              {c.results.map((r) => (
                <div key={r.label}>
                  <div className="text-2xl font-bold text-blue-700">{r.value}</div>
                  <div className="text-xs text-gray-500">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">Want results like these?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Every project starts with a free consultation. Tell us what you need —
          we will tell you exactly how we can help.
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
