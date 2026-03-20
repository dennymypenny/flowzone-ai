import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowZone AI | Automate Your Business in 48 Hours",
  description:
    "We build custom automations that eliminate manual work, reduce errors, and scale your operations. Free AI audit — delivered in 24 hours.",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            ´ Done-For-You AIWorkflow Systems
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Your Business Runs on <span className="text-indigo-600">Repetitive Work.</span>
            <br />We Automate All of It.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We design, build, and deploy custom AI automations for your business delivered in 7 days or less. You focus on growth; we handle the grind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/intake" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors text-lg">
              Get Your Free AI Audit
            </Link>
            <Link href="/intake" className="text-gray-700 font-semibold px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors text-lg">
              See What You Can Automate
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">Delivered in 7 days or less</span>
            <span className="flex items-center gap-1.5">No long-term contracts</span>
            <span className="flex items-center gap-1.5">100% done-for-you</span>
          </div>
        </div>
      </section>
    </>
  );
}
