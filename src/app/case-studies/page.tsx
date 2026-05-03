"use client";
import { useState } from "react";
import Link from "next/link";

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
      "Verde Supply Co. was running a 7-figure product business with zero visibility into what was actually driving revenue. Their data lived in three disconnected tools — Shopify, QuickBooks, and a manual Google Sheet updated every Friday afternoon. Leadership couldn't answer basic questions like which SKU had the best margin or which ad channel drove repeat buyers.",
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
      "We onboarded three clients in one day last week and didn't break a sweat. That was impossible before.",
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
      "Regal was a well-established HVAC and plumbing company with strong word-of-mouth but a website that hadn't been touched since 2017. They were losing leads to competitors who showed up better on Google. Their site wasn't mobile-friendly, had no clear call-to-action, and no way to book appointments online.",
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

function DashboardExample() {
  const bars = [40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 110];
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-white text-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400">Verde Supply — Executive Dashboard</span>
        <span className="text-green-400">● Live</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-gray-400 mb-1">Revenue (30d)</div>
          <div className="font-bold text-sm">$184,320</div>
          <div className="text-green-400">+12%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-gray-400 mb-1">Best Margin SKU</div>
          <div className="font-bold text-sm">SKU-047</div>
          <div className="text-green-400">68% margin</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-gray-400 mb-1">Repeat Buyers</div>
          <div className="font-bold text-sm">41%</div>
          <div className="text-green-400">+8% MoM</div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-2 mb-2">
        <div className="text-gray-400 mb-2">Revenue by Channel (90-day)</div>
        <div className="flex items-end gap-1 h-12">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-500 rounded-sm opacity-80"
              style={{ height: h + "%" }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-gray-400 mb-1">Top Ad Channels</div>
          <div className="flex gap-1">
            <div className="flex-1 text-center">
              <div className="bg-blue-500 h-1 rounded mb-1" />
              <div className="text-gray-400" style={{ fontSize: "9px" }}>Meta</div>
              <div>48%</div>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-yellow-400 h-1 rounded mb-1" />
              <div className="text-gray-400" style={{ fontSize: "9px" }}>Google</div>
              <div>32%</div>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-green-500 h-1 rounded mb-1" />
              <div className="text-gray-400" style={{ fontSize: "9px" }}>Email</div>
              <div>20%</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="text-gray-400 mb-1">Customer LTV</div>
          <div className="font-bold">$340 avg</div>
          <div className="text-green-400">+$44 vs last quarter</div>
        </div>
      </div>
    </div>
  );
}

function AutomationExample() {
  const steps = [
    { icon: "📝", step: "Contract signed via DocuSign", tag: "Trigger", bg: "bg-purple-100", text: "text-purple-700" },
    { icon: "📋", step: "Branded intake form sent to client", tag: "Action", bg: "bg-blue-100", text: "text-blue-700" },
    { icon: "🗂️", step: "Notion workspace created from template", tag: "Action", bg: "bg-blue-100", text: "text-blue-700" },
    { icon: "💬", step: "Slack alert sent to account lead", tag: "Action", bg: "bg-blue-100", text: "text-blue-700" },
    { icon: "📅", step: "Kickoff call added to Calendly", tag: "Action", bg: "bg-blue-100", text: "text-blue-700" },
    { icon: "✉️", step: "Personalized welcome email delivered", tag: "Done", bg: "bg-green-100", text: "text-green-700" },
  ];
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs">
      <div className="text-gray-500 font-semibold mb-3 uppercase tracking-wide">
        Automation Flow — Client Onboarding
      </div>
      <div className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-6 text-center">{s.icon}</div>
            <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
              {s.step}
            </div>
            <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + s.bg + " " + s.text}>
              {s.tag}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
          <div className="text-green-700 font-bold text-sm">2 min</div>
          <div className="text-gray-500">Avg run time</div>
        </div>
        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-2 text-center">
          <div className="text-green-700 font-bold text-sm">100%</div>
          <div className="text-gray-500">Success rate</div>
        </div>
      </div>
    </div>
  );
}

function PortfolioExample() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-xs shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
        <span className="font-bold text-gray-800">Sofia Navarro</span>
        <div className="flex gap-4 text-gray-500">
          <span>Work</span>
          <span>About</span>
          <span>Resume</span>
          <span className="text-blue-600 font-semibold">Contact</span>
        </div>
      </div>
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="text-gray-400 mb-1">Senior UX Designer · NYC</div>
        <div className="text-gray-900 font-bold text-sm mb-2">
          I design products people actually want to use.
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Figma</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">User Research</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Prototyping</span>
        </div>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-2">
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="text-gray-400">Shopify · Case Study</div>
          <div className="text-gray-800 font-semibold mt-0.5">Redesigning checkout flow</div>
          <div className="text-green-600 mt-1">+22% conversion</div>
        </div>
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
          <div className="text-gray-400">Fintech startup · Case Study</div>
          <div className="text-gray-800 font-semibold mt-0.5">Mobile onboarding overhaul</div>
          <div className="text-green-600 mt-1">-40% drop-off</div>
        </div>
      </div>
    </div>
  );
}

function WebsiteExample() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-xs shadow-sm">
      <div className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between">
        <span className="font-bold">🏠 Regal Home Solutions</span>
        <span className="bg-orange-400 text-white px-3 py-1 rounded-full font-semibold">Book Now</span>
      </div>
      <div className="bg-blue-50 px-4 py-4 border-b border-gray-100">
        <div className="font-bold text-gray-900 text-sm mb-1">
          Phoenix&apos;s Most Trusted HVAC &amp; Plumbing
        </div>
        <div className="text-gray-500 mb-2">
          Same-day service · Licensed &amp; insured · 500+ 5-star reviews
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-400">
            Select a service…
          </div>
          <button className="bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold">
            Get Quote
          </button>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
        <div className="text-center">
          <div className="font-bold text-gray-900">500+</div>
          <div className="text-gray-400">Reviews</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900">⭐ 4.9</div>
          <div className="text-gray-400">Google</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900">BBB</div>
          <div className="text-gray-400">A+ Rated</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900">24/7</div>
          <div className="text-gray-400">Emergency</div>
        </div>
      </div>
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        {["❄️ AC Repair", "🔧 Plumbing", "🔥 Heating"].map((s) => (
          <div
            key={s}
            className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center text-gray-700 font-medium"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

const examples: Record<string, React.ReactNode> = {
  "dashboard-retail": <DashboardExample />,
  "automation-agency": <AutomationExample />,
  "portfolio-designer": <PortfolioExample />,
  "website-hvac": <WebsiteExample />,
};

export default function CaseStudies() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6 text-center">
        <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
          ✦ Client Results
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Real Work. Real Results.</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          From KPI dashboards to portfolio sites, here is a look at what we have built — and the
          outcomes clients actually saw.
        </p>
      </section>

      {/* Case Studies */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {cases.map((c) => (
          <div key={c.id} className="grid md:grid-cols-5 gap-10 items-start">
            {/* Left */}
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
                  <span key={t} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              {/* Expandable example */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === c.id ? null : c.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-sm font-semibold text-gray-700"
                >
                  <span>👁 See the example</span>
                  <span
                    className="transition-transform duration-200 inline-block"
                    style={{ transform: openId === c.id ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                </button>
                {openId === c.id && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {examples[c.id]}
                  </div>
                )}
              </div>
            </div>

            {/* Right: results */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Results</h3>
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
          Every project starts with a free consultation. Tell us what you need — we will tell you
          exactly how we can help.
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
