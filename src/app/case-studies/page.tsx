import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real results from real clients. See how FlowZone AI has helped businesses automate workflows, save time, and grow revenue.",
};

const cases = [
  {
    slug: "verde-supply",
    client: "Verde Supply Co.",
    tag: "E-Commerce Automation",
    industry: "Retail & E-Commerce",
    location: "Austin, TX",
    metric: "4.8x ROI in 90 days",
    stat: "$62K",
    statLabel: "revenue recovered",
    excerpt: "A sustainable outdoor gear retailer was losing thousands every month to abandoned carts and unanswered customer questions. We automated recovery, support, and review collection.",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "🌿",
  },
  {
    slug: "pinnacle-media",
    client: "Pinnacle Media Group",
    tag: "Reporting Automation",
    industry: "Marketing Agency",
    location: "New York, NY",
    metric: "12 hrs/week saved",
    stat: "47",
    statLabel: "reports automated",
    excerpt: "A boutique digital marketing agency was spending every Sunday night manually pulling data from 6 platforms. We built an automated reporting engine that runs itself.",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    icon: "📊",
  },
  {
    slug: "sofia-navarro",
    client: "Sofia Navarro Design",
    tag: "Lead & Invoice Automation",
    industry: "Design Consultancy",
    location: "Miami, FL",
    metric: "3x leads responded to",
    stat: "$42K",
    statLabel: "added revenue in Q1",
    excerpt: "A freelance UX designer was losing leads and spending half her day on admin. We automated intake, proposals, follow-up sequences, and invoicing end to end.",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    icon: "🎨",
  },
  {
    slug: "regal-home",
    client: "Regal Home Services",
    tag: "Booking & Reviews",
    industry: "Home Services",
    location: "Phoenix, AZ",
    metric: "41% cancellation reduction",
    stat: "220",
    statLabel: "5-star reviews generated",
    excerpt: "A residential cleaning company was running entirely on phone calls and sticky notes. We built automated booking, SMS reminders, and a review collection engine.",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: "🏠",
  },
  {
    slug: "northgate-realty",
    client: "Northgate Realty Group",
    tag: "CRM & Lead Nurture",
    industry: "Real Estate",
    location: "Denver, CO",
    metric: "3x lead-to-appointment rate",
    stat: "$2.4M",
    statLabel: "additional Q1 closings",
    excerpt: "An independent brokerage was receiving 200+ leads per month with no follow-up system. We built the CRM automation and nurture sequences that turned leads into clients.",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    icon: "🏡",
  },
  {
    slug: "luxe-medspa",
    client: "Luxe MedSpa",
    tag: "Appointment Automation",
    industry: "Health & Wellness",
    location: "Los Angeles, CA",
    metric: "63% no-show reduction",
    stat: "$8,400",
    statLabel: "recovered per month",
    excerpt: "A high-end med spa was losing $8K every month to no-shows and had no system to bring clients back for follow-up treatments. We fixed both.",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    icon: "💆",
  },
  {
    slug: "james-okafor",
    client: "Okafor Consulting",
    tag: "Admin & Invoice Automation",
    industry: "Software Consulting",
    location: "Chicago, IL",
    metric: "2x project capacity",
    stat: "15 hrs",
    statLabel: "saved on admin monthly",
    excerpt: "A senior software consultant was billing $250/hour but spending 15 hours every month on $0/hour admin work. We automated his entire back office.",
    color: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-700",
    icon: "💻",
  },
  {
    slug: "mesa-crossfit",
    client: "Mesa CrossFit",
    tag: "Member Retention",
    industry: "Fitness & Wellness",
    location: "Mesa, AZ",
    metric: "31% churn reduction",
    stat: "89",
    statLabel: "members reactivated",
    excerpt: "An independent CrossFit gym was hemorrhaging members with no retention system in place. We built onboarding sequences, attendance check-ins, and a reactivation campaign.",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    icon: "🏋️",
  },
];

export default function CaseStudies() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Client Results</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Real Businesses.<br />Measurable Results.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Every case study below is a real workflow we built, a real problem we solved, and a real business that grew because of it. No fluff. Just outcomes.
          </p>
        </div>
      </section>

      {/* Aggregate stats bar */}
      <section className="bg-blue-600 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "4.2x", label: "Average Client ROI" },
            { value: "7 days", label: "Average Delivery Time" },
            { value: "94%", label: "Client Retention Rate" },
            { value: "200+", label: "Hours Saved Per Client / Year" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-white">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case study cards */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {cases.map((c) => (
            <Link key={c.slug} href={`/case-studies/${c.slug}`} className="group block">
              <div className={`border-2 ${c.color} rounded-2xl p-8 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col`}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${c.badge} mb-3`}>
                      {c.industry}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.icon}</span>
                      <p className="font-black text-gray-900 text-xl">{c.client}</p>
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">{c.location}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-3xl font-black text-blue-600">{c.stat}</p>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-[100px] leading-tight">{c.statLabel}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">{c.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Key result</span>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{c.metric}</p>
                  </div>
                  <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">
                    Read Case Study →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Your Business Could Be Next</h2>
          <p className="text-gray-500 text-lg mb-8">
            Every client above started with one conversation. Tell us what you want automated and we will build it in 7 days or less.
          </p>
          <Link href="/intake" className="inline-block bg-blue-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Start Your Project →
          </Link>
        </div>
      </section>
    </>
  );
}
