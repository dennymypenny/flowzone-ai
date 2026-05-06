import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Flat-rate AI automations for small businesses. Delivered in 7 days or less.",
};

const services = [
  {
    name: "Lead Intake & CRM Automation",
    desc: "Capture leads from your site, auto-respond, and pipe everything into your CRM — zero manual data entry.",
    price: "$997",
    slug: "Lead Intake & CRM Automation",
  },
  {
    name: "Appointment Booking & Reminders",
    desc: "Automated booking flows, confirmation texts, and reminder sequences that cut no-shows significantly.",
    price: "$797",
    slug: "Appointment Booking & Reminders",
  },
  {
    name: "AI Chatbot Agent",
    desc: "A custom AI assistant on your site that answers questions, qualifies leads, and routes inquiries 24/7.",
    price: "$897",
    slug: "AI Chatbot Agent",
  },
  {
    name: "Customer Support Triage",
    desc: "AI that reads incoming support requests, classifies them, and routes or responds automatically.",
    price: "$1,197",
    slug: "Customer Support Triage",
  },
  {
    name: "Automated Reporting & Dashboards",
    desc: "Live dashboards and scheduled email reports that pull from your tools so you always know your numbers.",
    price: "$1,297",
    slug: "Automated Reporting & Dashboards",
  },
  {
    name: "Invoice & Payment Workflows",
    desc: "Auto-generate invoices, send payment reminders, and reconcile payments without lifting a finger.",
    price: "$897",
    slug: "Invoice & Payment Workflows",
  },
  {
    name: "Content Repurposing Automation",
    desc: "Turn one piece of content into a week of posts, emails, and short-form clips — automatically.",
    price: "$897",
    slug: "Content Repurposing Automation",
  },
  {
    name: "Email Nurture Sequences",
    desc: "Multi-step email flows that warm leads, re-engage past clients, and drive bookings on autopilot.",
    price: "$797",
    slug: "Email Nurture Sequences",
  },
  {
    name: "Custom API & Tool Integrations",
    desc: "Connect any two tools that don't talk to each other. If it has an API or webhook, we can wire it up.",
    price: "$1,097",
    slug: "Custom API & Tool Integrations",
  },
  {
    name: "Website or Portfolio",
    desc: "A clean, fast, conversion-focused website built in Next.js and deployed to Vercel — ready in days.",
    price: "$497",
    slug: "Website or Portfolio",
  },
  {
    name: "Something Else",
    desc: "Have a workflow problem that doesn't fit a category? Tell us what you need and we'll scope it out.",
    price: "$497+",
    slug: "Something Else",
  },
];

export default function Pricing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Simple, Flat-Rate Pricing</h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-6">
            Pick what you need. One-time payment, delivered in 7 days or less. No retainers, no surprises.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 inline-block">
            <p className="text-blue-700 font-semibold text-sm">
              💡 Most clients see 10x ROI within 90 days — saved time, fewer errors, and more revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.name} className="border border-gray-200 rounded-2xl p-7 flex flex-col hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex-1">
                <p className="font-black text-gray-900 text-lg mb-2">{s.name}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-2xl font-black text-blue-600">{s.price}</span>
                <Link
                  href={`/intake?service=${encodeURIComponent(s.slug)}`}
                  className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Start This Project →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Every Project Includes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🚀", title: "7-Day Delivery", body: "Most automations ship in 3–7 business days. You get a working, tested product — not a rough draft." },
              { icon: "📖", title: "Full Documentation", body: "Every build comes with clear docs explaining what it does, how to use it, and how to request changes." },
              { icon: "🤝", title: "Post-Launch Support", body: "30 days of support after delivery. Something breaks? We fix it free, no questions asked." },
              { icon: "🔒", title: "Secure & Reliable", body: "Industry-standard security on every integration. Your data and your clients' data are always protected." },
              { icon: "⚙️", title: "Tool Agnostic", body: "We work with 200+ tools. If it has an API or webhook, we can build with it." },
              { icon: "🔧", title: "Revision Included", body: "One full round of revisions is included in every project. We get it right." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-bold text-gray-900 mb-2">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Fill out the intake form and describe your workflow. We'll recommend the right automation and get it built fast.
          </p>
          <Link
            href="/intake"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            Start Your Project →
          </Link>
        </div>
      </section>
    </>
  );
}
