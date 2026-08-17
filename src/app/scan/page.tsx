import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Scan and Diagnosis",
  description: "A workflow audit, your top three system opportunities ranked by ROI and a prioritized roadmap, delivered in 48 hours.",
  alternates: { canonical: "/scan" },
  // This sells the automation era offer the studio retired, and nothing links
  // to it. Kept live so old links do not 404, kept out of the index so it
  // stops competing with /pricing.
  robots: { index: false, follow: false },
  // Set in full because metadata merging is shallow. A page that declares
  // openGraph replaces the layout block outright, so anything omitted is gone.
  openGraph: {
    title: "AI Scan and Diagnosis | FlowZone",
    description: "A workflow audit, your top three system opportunities ranked by ROI and a prioritized roadmap, delivered in 48 hours.",
    url: "/scan",
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

const deliverables = [
  {
    icon: "Audit",
    title: "Full Workflow Audit",
    desc: "We map every manual task, tool, and handoff in your business to find what's costing you the most time.",
  },
  {
    icon: "Top 3",
    title: "3 Systems Opportunities",
    desc: "Ranked by ROI. We identify the three highest-impact systems to build first.",
  },
  {
    icon: "Roadmap",
    title: "Prioritized Action Plan",
    desc: "A clear, step-by-step roadmap so you know exactly what to build, in what order, and why.",
  },
  {
    icon: "48hr",
    title: "Delivered in 48 Hours",
    desc: "No long calls, no waiting weeks. You get your full diagnosis delivered to your inbox within 48 hours.",
  },
];

export default function ScanPage() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-paper-deep text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
            One-Time Offer
          </div>
          <h1 className="text-5xl font-display font-normal text-ink leading-tight mb-6">
            AI Scan &amp; Diagnosis
          </h1>
          <p className="text-xl text-ink-mute mb-4 leading-relaxed">
            We audit your business, identify your top 3 system opportunities ranked by ROI,
            and deliver a prioritized roadmap, all in 48 hours.
          </p>
          <div className="text-4xl font-display font-normal text-accent mb-8">$97</div>
          <Link
            href="/intake"
            className="inline-block bg-accent text-white font-bold px-10 py-4 rounded-xl hover:bg-accent-deep transition-colors text-lg"
          >
            Get My AI Scan
          </Link>
          <p className="text-sm text-ink-mute mt-4">One-time payment. No subscription. Delivered in 48 hours.</p>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-normal text-ink text-center mb-12">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {deliverables.map((item) => (
              <div key={item.title} className="rounded-2xl border border-rule rounded-xl p-6">
                <div className="inline-block bg-paper-deep text-accent text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-ink-mute text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-accent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-display font-normal text-white mb-4">Ready to see what we&apos;d build for you?</h2>
          <p className="text-paper/60 mb-8">Get your full AI Scan delivered in 48 hours for just $97.</p>
          <Link
            href="/intake"
            className="inline-block bg-paper text-accent font-bold px-10 py-4 rounded-xl hover:bg-paper-deep transition-colors text-lg"
          >
            Get My AI Scan, $97
          </Link>
        </div>
      </section>
    </div>
  );
}
