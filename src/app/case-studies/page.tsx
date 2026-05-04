import Link from "next/link";

const cases = [
  {
    slug: "verde-supply",
    tag: "Business Consulting + KPI Dashboard",
    tagBg: "bg-blue-100",
    tagText: "text-blue-700",
    icon: "📊",
    client: "Verde Supply Co.",
    industry: "Retail & E-Commerce",
    location: "Austin, TX",
    challenge:
      "A 7-figure e-commerce brand with zero visibility into what was driving revenue. Data spread across Shopify, QuickBooks, and a manual Google Sheet.",
    solution:
      "Live executive dashboard pulling from Shopify + QuickBooks via Zapier — margin by product, LTV by channel, 90-day revenue trend. Updated daily.",
    results: [
      { label: "Hours saved/week", value: "8 hrs" },
      { label: "Ad ROI", value: "+34%" },
      { label: "Revenue visibility", value: "Real-time" },
    ],
    quote:
      "I used to wait until Monday to know how the weekend went. Now I check the dashboard from my phone before coffee.",
    quoteName: "Marcus T., Founder",
  },
  {
    slug: "pinnacle-media",
    tag: "Workflow Automation",
    tagBg: "bg-purple-100",
    tagText: "text-purple-700",
    icon: "⚡",
    client: "Pinnacle Media Group",
    industry: "Marketing Agency",
    location: "Remote",
    challenge:
      "12+ hours/week lost to manual client onboarding — hand-building Notion workspaces, chasing intake forms, sending welcome emails one by one.",
    solution:
      "DocuSign signature triggers Notion workspace, Slack alert, Calendly link, and welcome email — all within minutes. Zero manual steps.",
    results: [
      { label: "Hours saved/client", value: "4 hrs" },
      { label: "Client satisfaction", value: "9.4 / 10" },
      { label: "Error rate", value: "~0%" },
    ],
    quote:
      "We onboarded three clients in one day last week and didn't break a sweat. That was impossible before.",
    quoteName: "Jasmine R., Agency Director",
  },
  {
    slug: "sofia-navarro",
    tag: "Portfolio & Resume Site",
    tagBg: "bg-pink-100",
    tagText: "text-pink-700",
    icon: "🎨",
    client: "Sofia Navarro",
    industry: "UX / Product Design",
    location: "New York, NY",
    challenge:
      "5 years of strong UX work stuck in a cluttered PDF. Applying for senior roles at top companies and losing out to polished competitors.",
    solution:
      "Clean portfolio with case study layout, filterable resume page, and a contact form wired to her inbox. Launched in 7 days.",
    results: [
      { label: "Interviews booked", value: "4 in 2 wks" },
      { label: "Recruiter response", value: "+60%" },
      { label: "Time to launch", value: "7 days" },
    ],
    quote:
      "I finally feel confident sharing my portfolio link. I got two recruiter DMs the first week it was live.",
    quoteName: "Sofia N., Senior UX Designer",
  },
  {
    slug: "regal-home",
    tag: "Business Website",
    tagBg: "bg-green-100",
    tagText: "text-green-700",
    icon: "🌐",
    client: "Regal Home Solutions",
    industry: "Home Services",
    location: "Phoenix, AZ",
    challenge:
      "HVAC + plumbing company with a 2017-era website. No mobile support, no CTA, no online booking. Losing leads to competitors on Google.",
    solution:
      "Full rebuild: hero, trust signals, service area map, online booking form integrated with their scheduling software. 96/100 mobile score.",
    results: [
      { label: "Monthly leads", value: "+80%" },
      { label: "Bounce rate", value: "-42%" },
      { label: "Google ranking", value: "Page 1" },
    ],
    quote:
      "We went from losing bids because our website looked sketchy to being the obvious choice. Worth every penny.",
    quoteName: "Derek M., Owner",
  },
  {
    slug: "northgate-realty",
    tag: "Business Consulting + KPI Dashboard",
    tagBg: "bg-blue-100",
    tagText: "text-blue-700",
    icon: "📊",
    client: "Northgate Realty Group",
    industry: "Real Estate",
    location: "Denver, CO",
    challenge:
      "12-agent brokerage tracking deals in personal spreadsheets. The managing broker had no view of pipeline health, stalled deals, or close rates.",
    solution:
      "Broker dashboard pulling from Follow Up Boss CRM — pipeline by stage, stalled deal alerts, per-agent performance. Auto-refreshed daily.",
    results: [
      { label: "Stalled deals caught", value: "+3x" },
      { label: "Close rate", value: "+18%" },
      { label: "Reporting saved", value: "6 hrs/wk" },
    ],
    quote:
      "I used to spend Friday afternoons chasing agents for updates. Now I open the dashboard and know everything in 30 seconds.",
    quoteName: "Sandra K., Managing Broker",
  },
  {
    slug: "luxe-medspa",
    tag: "Workflow Automation",
    tagBg: "bg-purple-100",
    tagText: "text-purple-700",
    icon: "⚡",
    client: "Luxe MedSpa",
    industry: "Health & Wellness",
    location: "Scottsdale, AZ",
    challenge:
      "40\u201360 inquiries per week handled manually. 38% received no follow-up within 24 hours. Revenue slipping through the cracks.",
    solution:
      "Automated 5-day lead nurture: instant SMS + email, value email on day 2, last-chance offer on day 5. Self-booking via Calendly.",
    results: [
      { label: "Lead response time", value: "< 2 min" },
      { label: "Consultation bookings", value: "+52%" },
      { label: "New client revenue", value: "+$28K/mo" },
    ],
    quote:
      "Before this, leads would slip through the cracks constantly. Now the system handles it and my team focuses on the people in the room.",
    quoteName: "Dr. Priya M., Owner",
  },
  {
    slug: "james-okafor",
    tag: "Portfolio & Resume Site",
    tagBg: "bg-pink-100",
    tagText: "text-pink-700",
    icon: "🎨",
    client: "James Okafor",
    industry: "Software Engineering",
    location: "Atlanta, GA",
    challenge:
      "Mid-level engineer targeting FAANG staff roles with no personal site. Recruiters kept passing him over for candidates with a stronger online presence.",
    solution:
      "Developer portfolio with 4 featured projects, live demos, GitHub links, and technical write-ups. Dark-mode-first design. Launched in 8 days.",
    results: [
      { label: "Recruiter outreach", value: "+4x" },
      { label: "On-site interviews", value: "3 in 1 mo" },
      { label: "Time to launch", value: "8 days" },
    ],
    quote:
      "I went from being invisible online to getting LinkedIn messages every week. The portfolio changed how people perceived me before I even spoke to them.",
    quoteName: "James O., Staff Engineer",
  },
  {
    slug: "mesa-crossfit",
    tag: "Business Website",
    tagBg: "bg-green-100",
    tagText: "text-green-700",
    icon: "🌐",
    client: "Mesa CrossFit",
    industry: "Fitness & Wellness",
    location: "Mesa, AZ",
    challenge:
      "Growing CrossFit gym with no scheduling integration, no lead capture, and a 2015-era website. Prospective members had to DM on Instagram just to ask about pricing.",
    solution:
      "New site: class schedule widget, free trial lead form, pricing page, coach bios, FAQ. Lead form wired to Mailchimp with 3-email automated welcome sequence.",
    results: [
      { label: "Free trial sign-ups", value: "+120/mo" },
      { label: "New member conversions", value: "34%" },
      { label: "Google visibility", value: "+210%" },
    ],
    quote:
      "People show up to their free trial already knowing our coaches' names. The site does the selling before they ever walk in.",
    quoteName: "Tasha W., Owner",
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  "Business Consulting + KPI Dashboard": { bg: "bg-blue-100", text: "text-blue-700" },
  "Workflow Automation": { bg: "bg-purple-100", text: "text-purple-700" },
  "Portfolio & Resume Site": { bg: "bg-pink-100", text: "text-pink-700" },
  "Business Website": { bg: "bg-green-100", text: "text-green-700" },
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Real Clients. Real Results.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Every engagement starts with a real business problem. Here is how we solved them.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((c) => {
            const tc = tagColors[c.tag] ?? { bg: "bg-gray-100", text: "text-gray-700" };
            return (
              <div
                key={c.slug}
                className="border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-lg transition-shadow"
              >
                {/* Tag */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl">{c.icon}</span>
                  <span
                    className={"text-xs font-semibold px-2 py-0.5 rounded-full " + tc.bg + " " + tc.text}
                  >
                    {c.tag}
                  </span>
                </div>

                {/* Client info */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">{c.client}</h2>
                <p className="text-sm text-gray-500 mb-5">
                  {c.industry} &middot; {c.location}
                </p>

                {/* Challenge / Solution */}
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Challenge
                    </span>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{c.challenge}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      What we built
                    </span>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{c.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {c.results.map((r) => (
                    <div
                      key={r.label}
                      className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center"
                    >
                      <div className="text-lg font-bold text-blue-700">{r.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-blue-200 pl-4 mb-6">
                  <p className="text-sm text-gray-600 italic">&ldquo;{c.quote}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">— {c.quoteName}</p>
                </blockquote>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    href={"/case-studies/" + c.slug}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800 transition"
                  >
                    Read full case study <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to be the next case study?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Send us your project details and we will follow up by email with exactly how we can help.
          No calls required — everything moves through email.
        </p>
        <Link
          href="/intake"
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Send Us Your Project Details
        </Link>
      </section>
    </main>
  );
}
