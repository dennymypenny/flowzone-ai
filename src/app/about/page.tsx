import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about FlowZone AI — the creative and business studio that turns ideas into brands, sites and systems.",
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">About Us</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
            Great Ideas Deserve<br />More Than a Template.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            FlowZone AI is a creative and business studio built on a simple belief: every good idea deserves a real brand, a real site and real systems behind it. AI gives us the speed. A human in the loop gives it the taste, the judgment and the finish.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">The Story</h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>
                Most great ideas die between the napkin and the launch. The brand never gets made, the site never goes live and the day-to-day busywork eats whatever energy was left.
              </p>
              <p>
                The problem isn't a lack of tools. The problem is that turning an idea into a working business takes design, copy, code and systems all at once, and most people don't have a team for that.
              </p>
              <p>
                That's where we come in. We handle everything: the brand, the site, the storefront and the systems behind it — designed, built, tested and live in days.
              </p>
              <p>
                You bring the idea. We build the whole thing. You run the business.
              </p>
            </div>
          </div>
          <div className="bg-indigo-600 rounded-3xl p-10 text-white">
            <p className="text-5xl font-black mb-2">500+</p>
            <p className="text-indigo-200 mb-8">Builds delivered</p>
            <p className="text-5xl font-black mb-2">10,000+</p>
            <p className="text-indigo-200 mb-8">Hours saved for clients</p>
            <p className="text-5xl font-black mb-2">7 days</p>
            <p className="text-indigo-200">Average delivery time</p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Speed Without Shortcuts",
                body: "7 days is our standard, not our ceiling. We move fast because we've shipped builds like yours dozens of times — but we never ship something untested.",
              },
              {
                icon: "🎯",
                title: "Outcomes, Not Outputs",
                body: "We don't just build what you ask for. We ask what problem you're trying to solve and make sure the build actually solves it — even if that means pushing back on the original brief.",
              },
              {
                icon: "🔓",
                title: "You Own Everything",
                body: "Everything we build belongs to you. No lock in, no proprietary platforms. You get the full system, documentation, and credentials — use it however you want.",
              },
              {
                icon: "🤝",
                title: "True Done-For-You",
                body: "We don't send you a Zapier template and call it a day. We set it up, test it, deploy it, and walk you through it. Done-for-you means we handle everything.",
              },
              {
                icon: "📈",
                title: "Built to Scale",
                body: "The systems we build are designed to handle 10x your current volume without breaking. We architect for growth, not just for today.",
              },
              {
                icon: "💬",
                title: "Honest Communication",
                body: "If something isn't worth building, we'll tell you. If there's a better approach than what you asked for, we'll suggest it. You'll always know exactly what's happening.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-2xl p-7">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">How We Work</h2>
          <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">We're not an agency with 50 people and a project management system you have to learn. We're a lean, focused team that moves fast.</p>
          <div className="grid md:grid-cols-4 gap-6 text-left">
            {[
              { step: "1", title: "Discovery Call", body: "30 minutes to understand your business, your current workflow pain, and what success looks like." },
              { step: "2", title: "Build Plan", body: "We map out the full build — brand, pages, systems, tools, logic. You approve before we build anything." },
              { step: "3", title: "Build & Test", body: "We build it, test every edge case, and document everything. No surprises on delivery." },
              { step: "4", title: "Handoff", body: "Live walkthrough, full documentation, and support to make sure you're fully up and running." },
            ].map((s) => (
              <div key={s.step} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <p className="text-3xl font-black text-indigo-400 mb-3">0{s.step}</p>
                <p className="font-bold text-white mb-2">{s.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Let's Work Together</h2>
          <p className="text-indigo-200 text-lg mb-8">Book a free 20-minute call. No pressure, no pitch — just an honest conversation about what we can build for you.</p>
          <Link href="/intake" className="inline-block bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors text-lg">
            Get Your Free AI Audit →
          </Link>
        </div>
      </section>
    </>
  );
}
