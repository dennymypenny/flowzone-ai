import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const cases = [
  {
    slug: "verde-supply",
    tag: "Business Consulting + KPI Dashboard",
    icon: "📊",
    client: "Verde Supply Co.",
    industry: "Retail & E-Commerce",
    location: "Austin, TX",
    challenge:
      "Verde Supply Co. was running a 7-figure product business with zero visibility into what was actually driving revenue. Their data lived in three disconnected tools — Shopify, QuickBooks, and a manual Google Sheet updated every Friday afternoon. Leadership couldn't answer basic questions like which SKU had the best margin or which ad channel drove repeat buyers.",
    solution:
      "We kicked off with a two-hour consulting session to map their KPIs and decision flows. From there, we designed and built a live executive dashboard pulling from Shopify and QuickBooks via Zapier, surfacing margin by product line, customer LTV by acquisition channel, and a rolling 90-day revenue trend — all in one view, updated daily.",
    process: [
      { step: "Discovery", detail: "2-hour session mapping KPIs, data sources, and decisions the team makes weekly" },
      { step: "Data audit", detail: "Traced every metric back to its source — Shopify product data, QuickBooks expenses, ad platform exports" },
      { step: "Dashboard design", detail: "Wireframed 3 views: executive summary, product performance, and channel attribution" },
      { step: "Build + integrations", detail: "Connected Shopify and QuickBooks via Zapier to a live Looker Studio dashboard" },
      { step: "Handoff", detail: "Live walkthrough with the founder, trained 2 team leads, documented refresh logic" },
    ],
    results: [
      { label: "Hours saved per week", value: "8 hrs" },
      { label: "Revenue visibility", value: "Real-time" },
      { label: "ROI on ad spend", value: "+34%" },
      { label: "Delivery time", value: "3 weeks" },
    ],
    quote: "I used to wait until Monday to know how the weekend went. Now I check the dashboard from my phone before coffee.",
    quoteName: "Marcus T., Founder",
    tools: ["Shopify", "QuickBooks", "Zapier", "Google Looker Studio"],
  },
  {
    slug: "pinnacle-media",
    tag: "Workflow Automation",
    icon: "⚡",
    client: "Pinnacle Media Group",
    industry: "Marketing Agency",
    location: "Remote",
    challenge:
      "A 6-person creative agency was spending 12+ hours per week on manual client onboarding: chasing intake forms, creating Notion workspaces by hand, sending welcome emails, and scheduling kickoff calls one-by-one. Every new client felt like starting from scratch.",
    solution:
      "We automated their entire onboarding pipeline end-to-end. When a client signs a contract via DocuSign, the system automatically: sends a branded intake form, creates their Notion client workspace from a template, notifies the account lead in Slack, adds the kickoff call to Calendly, and sends a personalized welcome email — all within minutes.",
    process: [
      { step: "Workflow audit", detail: "Mapped every manual step from contract signing to kickoff — found 11 distinct tasks being done by hand" },
      { step: "Tool inventory", detail: "Assessed DocuSign, Notion, Slack, Calendly, and Gmail — all compatible with Zapier" },
      { step: "Automation blueprint", detail: "Designed a trigger-action flow with branching logic for different service types" },
      { step: "Build + test", detail: "Built the Zapier workflow, stress-tested with 5 mock onboardings before going live" },
      { step: "Rollout", detail: "Trained the team, documented the flow, set up error notifications" },
    ],
    results: [
      { label: "Hours saved per client", value: "4 hrs" },
      { label: "Onboarding time", value: "Minutes vs. days" },
      { label: "Client satisfaction score", value: "9.4 / 10" },
      { label: "Error rate", value: "~0%" },
    ],
    quote: "We onboarded three clients in one day last week and didn't break a sweat. That was impossible before.",
    quoteName: "Jasmine R., Agency Director",
    tools: ["Zapier", "Notion", "Calendly", "DocuSign", "Gmail"],
  },
  {
    slug: "sofia-navarro",
    tag: "Portfolio & Resume Site",
    icon: "🎨",
    client: "Sofia Navarro",
    industry: "UX / Product Design",
    location: "New York, NY",
    challenge:
      "Sofia had 5 years of strong UX work but her portfolio was a cluttered PDF she was embarrassed to send. She was applying for senior roles at top companies and needed something that showed not just her work, but her process and personality — fast.",
    solution:
      "We built Sofia a clean, responsive portfolio site featuring a case study layout with before/after flows, a resume page with filterable skills, and a contact form wired to her inbox. The design led with her strongest project and included a short about-me video embed. Live in 7 days.",
    process: [
      { step: "Content strategy", detail: "Reviewed her existing work, identified her 3 strongest projects, and outlined what each case study needed to show" },
      { step: "Design direction", detail: "Chose a minimal editorial style — let the work speak, keep the UI invisible" },
      { step: "Build", detail: "Next.js + Tailwind, deployed on Vercel, custom domain in 30 minutes" },
      { step: "Case study pages", detail: "Each project gets a dedicated page: problem, process, solution, outcome" },
      { step: "Launch", detail: "Connected to her domain, set up the contact form with Resend, final QA on mobile" },
    ],
    results: [
      { label: "Job interviews booked", value: "4 in 2 weeks" },
      { label: "Recruiter response rate", value: "+60%" },
      { label: "Time to launch", value: "7 days" },
      { label: "Offer received", value: "Yes — 145K role" },
    ],
    quote: "I finally feel confident sharing my portfolio link. I got two recruiter DMs the first week it was live.",
    quoteName: "Sofia N., Senior UX Designer",
    tools: ["Next.js", "Tailwind CSS", "Vercel", "Notion", "Resend"],
  },
  {
    slug: "regal-home",
    tag: "Business Website & Landing Page",
    icon: "🌐",
    client: "Regal Home Solutions",
    industry: "Home Services",
    location: "Phoenix, AZ",
    challenge:
      "Regal was a well-established HVAC and plumbing company with strong word-of-mouth but a website that hadn't been touched since 2017. They were losing leads to competitors who showed up better on Google. Their site wasn't mobile-friendly, had no clear call-to-action, and no way to book appointments online.",
    solution:
      "We redesigned their site from scratch: a modern homepage with a hero section, trust signals (BBB badge, reviews), and a sticky CTA. We added a service area map, a streamlined booking form, and wired everything to their existing scheduling software. SEO metadata and page speed optimizations were included.",
    process: [
      { step: "Site audit", detail: "Ran a full technical and content audit — identified 14 SEO issues, missing mobile viewport, and zero conversion elements" },
      { step: "Competitor analysis", detail: "Reviewed 5 local competitors — all had booking forms and Google review widgets. Regal had neither." },
      { step: "Design", detail: "Built a conversion-first homepage: hero with CTA, trust signals, services grid, Google reviews feed" },
      { step: "Build", detail: "Next.js + Tailwind, integrated with their existing scheduling tool via iframe + webhook" },
      { step: "SEO + speed", detail: "Added structured data, optimized images, hit 96/100 on mobile Lighthouse" },
    ],
    results: [
      { label: "Monthly leads", value: "+80%" },
      { label: "Bounce rate", value: "-42%" },
      { label: "Google ranking", value: "Page 1 (local)" },
      { label: "Mobile score", value: "96 / 100" },
    ],
    quote: "We went from losing bids because our website looked sketchy to being the obvious choice. Worth every penny.",
    quoteName: "Derek M., Owner",
    tools: ["Next.js", "Tailwind CSS", "Vercel", "Google Search Console", "Resend"],
  },
  {
    slug: "northgate-realty",
    tag: "Business Consulting + KPI Dashboard",
    icon: "📊",
    client: "Northgate Realty Group",
    industry: "Real Estate",
    location: "Denver, CO",
    challenge:
      "A boutique real estate brokerage with 12 agents had no unified view of pipeline health. Deals were tracked in a mix of personal spreadsheets, and the managing broker had no way to see which agents were active, which deals were stalling, or what their monthly close rate actually was.",
    solution:
      "After a consulting session to understand their workflow, we built a broker dashboard that aggregated deal data from their CRM (Follow Up Boss), displayed pipeline by stage, flagged deals with no activity in 7+ days, and gave each agent a personal view of their own performance. Fully automated — no manual exports needed.",
    process: [
      { step: "Workflow mapping", detail: "Sat with the managing broker and 3 agents to understand how deals actually moved through the pipeline" },
      { step: "CRM audit", detail: "Identified all usable data fields in Follow Up Boss — stages, activity logs, close dates" },
      { step: "Dashboard design", detail: "Designed broker view (team-wide) and agent view (personal) — two separate dashboards" },
      { step: "Integration", detail: "Connected Follow Up Boss to Looker Studio via Zapier, set daily auto-refresh" },
      { step: "Training", detail: "30-minute walkthrough with all 12 agents, left video recordings for new hires" },
    ],
    results: [
      { label: "Stalled deals caught early", value: "+3x" },
      { label: "Close rate improvement", value: "+18%" },
      { label: "Reporting time saved", value: "6 hrs/week" },
      { label: "Agent adoption rate", value: "100%" },
    ],
    quote: "I used to spend Friday afternoons chasing agents for updates. Now I open the dashboard and I know everything in 30 seconds.",
    quoteName: "Sandra K., Managing Broker",
    tools: ["Follow Up Boss", "Zapier", "Google Looker Studio", "Google Sheets"],
  },
  {
    slug: "luxe-medspa",
    tag: "Workflow Automation",
    icon: "⚡",
    client: "Luxe MedSpa",
    industry: "Health & Wellness",
    location: "Scottsdale, AZ",
    challenge:
      "A high-end medical spa was manually following up with every inquiry — someone from the front desk would call, send a text, send an email, and then manually log the outcome. With 40–60 new inquiries per week, follow-up was inconsistent and many leads were going cold within 48 hours.",
    solution:
      "We built a fully automated lead nurture sequence. When a new inquiry came in via their website form, the system immediately sent a personalized SMS + email, triggered a 3-touch follow-up sequence over 5 days, and automatically booked a consultation if the lead clicked a link. If they didn't respond, the lead was flagged for a personal call.",
    process: [
      { step: "Lead audit", detail: "Pulled 3 months of inquiry data — found 38% of leads received no follow-up within 24 hours" },
      { step: "Sequence design", detail: "Built a 5-day nurture: immediate SMS + email, day 2 value email, day 5 last-chance offer" },
      { step: "Booking integration", detail: "Connected Calendly to the sequence so interested leads could self-book without calling" },
      { step: "CRM tagging", detail: "Auto-tagged leads by service interest so the front desk knew exactly what to discuss on the call" },
      { step: "Handoff", detail: "Trained 2 front desk staff, set up a daily digest email showing all active lead statuses" },
    ],
    results: [
      { label: "Lead response time", value: "< 2 min" },
      { label: "Consultation bookings", value: "+52%" },
      { label: "Staff time on follow-up", value: "-70%" },
      { label: "Revenue from new clients", value: "+$28K/mo" },
    ],
    quote: "Before this, leads would slip through the cracks constantly. Now the system handles it and my team focuses on the people in the room.",
    quoteName: "Dr. Priya M., Owner",
    tools: ["Zapier", "Calendly", "Twilio", "ActiveCampaign", "Google Sheets"],
  },
  {
    slug: "james-okafor",
    tag: "Portfolio & Resume Site",
    icon: "🎨",
    client: "James Okafor",
    industry: "Software Engineering",
    location: "Atlanta, GA",
    challenge:
      "James was a mid-level software engineer targeting staff roles at FAANG companies. He had solid experience across 3 companies but no personal site — just a LinkedIn and a generic resume. Recruiters kept passing him over for candidates who had a more polished online presence.",
    solution:
      "We built James a developer portfolio that showcased his 4 strongest projects with live demos, GitHub links, and a technical write-up for each. The site included a timeline of his career, a skills section organized by category, and a dark-mode-first design that felt right for a senior engineering role.",
    process: [
      { step: "Project selection", detail: "Reviewed 9 of his projects — selected 4 that showed range: systems work, a consumer product, an open source contribution, and a side business tool" },
      { step: "Technical writing", detail: "Wrote clear, non-jargon summaries of each project: what problem it solved, the architecture, and the outcome" },
      { step: "Design", detail: "Dark mode, monospace accents, clean layout — familiar to engineers, impressive to non-technical hiring managers" },
      { step: "Build", detail: "Next.js, MDX for blog/writeups, deployed on Vercel with a custom domain" },
      { step: "Launch", detail: "Added to LinkedIn, GitHub profile README, and email signature" },
    ],
    results: [
      { label: "Recruiter outreach", value: "+4x in 3 weeks" },
      { label: "On-site interviews", value: "3 in first month" },
      { label: "Offer received", value: "Yes — Staff Eng role" },
      { label: "Time to launch", value: "8 days" },
    ],
    quote: "I went from being invisible online to getting LinkedIn messages every week. The portfolio changed how people perceived me before I even spoke to them.",
    quoteName: "James O., Staff Engineer",
    tools: ["Next.js", "MDX", "Tailwind CSS", "Vercel", "GitHub"],
  },
  {
    slug: "mesa-crossfit",
    tag: "Business Website & Landing Page",
    icon: "🌐",
    client: "Mesa CrossFit",
    industry: "Fitness & Wellness",
    location: "Mesa, AZ",
    challenge:
      "A growing CrossFit gym was running entirely on word-of-mouth and Instagram. They had a basic website with no scheduling integration, no way to capture leads, and a design that looked like it was built in 2015. New members had to DM on Instagram to ask about pricing — and many gave up before they ever reached someone.",
    solution:
      "We rebuilt their site with a clean, energy-forward design that matched the gym's brand. The new site featured a class schedule widget, a free trial lead capture form, pricing page, coach bios, and an FAQ. We connected the form to their email list and set up an automated welcome sequence for all trial sign-ups.",
    process: [
      { step: "Brand review", detail: "Studied their Instagram — raw, real, community-driven. The site needed to match that energy, not look like a corporate gym" },
      { step: "Content strategy", detail: "Defined 5 key pages: Home, Schedule, Pricing, Coaches, and Free Trial landing page" },
      { step: "Design", detail: "Bold typography, high-contrast dark theme, action photography placeholders, mobile-first layout" },
      { step: "Build + integrations", detail: "Embedded their MindBody schedule widget, connected lead form to Mailchimp, set up 3-email welcome sequence" },
      { step: "SEO", detail: "Optimized for 'CrossFit Mesa' and 'gym near me' — claimed and linked their Google Business profile" },
    ],
    results: [
      { label: "Free trial sign-ups", value: "+120/mo" },
      { label: "New member conversions", value: "34%" },
      { label: "Instagram DMs for info", value: "-80%" },
      { label: "Google search visibility", value: "+210%" },
    ],
    quote: "People show up to their free trial already knowing our coaches' names. The site does the selling before they ever walk in.",
    quoteName: "Tasha W., Owner",
    tools: ["Next.js", "Tailwind CSS", "MindBody", "Mailchimp", "Vercel"],
  },
];

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.client} Case Study | FlowZone AI`,
    description: `How FlowZone AI helped ${c.client} with ${c.tag.toLowerCase()}.`,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/case-studies"
            className="text-blue-300 text-sm hover:text-white transition mb-6 inline-block"
          >
            ← Back to Case Studies
          </Link>
          <div className="flex items-center gap-2 text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
            <span>{c.icon}</span>
            <span>{c.tag}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{c.client}</h1>
          <p className="text-blue-200 text-lg">
            {c.industry} · {c.location}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Challenge + Solution */}
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">The Challenge</h2>
            <p className="text-gray-600 leading-relaxed">{c.challenge}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Built</h2>
            <p className="text-gray-600 leading-relaxed">{c.solution}</p>
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How We Did It</h2>
          <div className="space-y-4">
            {c.process.map((p, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{p.step}</div>
                  <div className="text-gray-600 text-sm mt-0.5">{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">The Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.results.map((r) => (
              <div key={r.label} className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">{r.value}</div>
                <div className="text-xs text-gray-500">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <p className="text-xl text-gray-700 italic mb-4">&ldquo;{c.quote}&rdquo;</p>
          <p className="font-semibold text-gray-900">— {c.quoteName}</p>
        </div>

        {/* Tools */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tools Used</h2>
          <div className="flex flex-wrap gap-2">
            {c.tools.map((t) => (
              <span key={t} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">Want results like these?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Tell us about your project and we&apos;ll follow up by email with exactly how we can help.
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
