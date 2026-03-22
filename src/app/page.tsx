import Link from "next/link";
import DemoAnimation from "@/components/DemoAnimation";
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
      <section className="bg-white pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            ✦ Done-For-You AI Workflow Systems
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Your Business Runs on <span className="text-sky-600">Repetitive Work.</span>
            <br />We Automate All of It.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We design, build, and deploy custom AI automations for your business delivered in 7 days or less. You focus on growth; we handle the grind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/intake" className="bg-sky-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-sky-700 transition-colors text-lg">
              Get Your Free AI Audit
            </Link>
            <Link href="/intake" className="text-gray-700 font-semibold px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors text-lg">
              See What You Can Automate
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-400">★★★★★</span> 5.0 rated by clients
            </span>
            <span className="flex items-center gap-1.5">✓ 50+ automations shipped</span>
            <span className="flex items-center gap-1.5">✓ Delivered in 7 days or less</span>
            <span className="flex items-center gap-1.5">✓ No long-term contracts</span>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-sky-50 border-y border-sky-100 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-sky-600">50+</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Automations Built</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-sky-200"></div>
          <div>
            <div className="text-3xl font-black text-sky-600">7 Days</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Average Delivery</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-sky-200"></div>
          <div>
            <div className="text-3xl font-black text-sky-600">100%</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Done-For-You</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-sky-200"></div>
          <div>
            <div className="text-3xl font-black text-sky-600">5.0 ★</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Client Rating</div>
          </div>
        </div>
      </section>

      {/* Video examples */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              Real Results
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              See Automations in Action
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Watch real workflows we have built for clients — saving hours of manual work every single day.
            </p>
          </div>
          <DemoAnimation />
          <div className="text-center mt-10">
            <Link href="/case-studies" className="text-sky-600 font-semibold hover:underline text-lg">
              View All Case Studies →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sky-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase border border-sky-200">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              From Audit to Automation in 7 Days
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We handle everything. You just answer a few questions and watch your workflow transform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 bg-sky-600 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-5">1</div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Free AI Audit</h3>
              <p className="text-gray-500">Fill out a short form and we map out every repetitive task in your business that can be automated.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 bg-sky-600 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-5">2</div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">We Build It</h3>
              <p className="text-gray-500">Our team designs and builds your custom automation system — fully tested and ready to run in your existing tools.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 bg-sky-600 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-5">3</div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">You Save Hours</h3>
              <p className="text-gray-500">Go live in 7 days or less. Watch the manual work disappear and your team focus on what actually moves the needle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What we automate */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What We Automate
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              If your team does it manually more than once a week, we can automate it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">📩</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Lead Follow-Up</h3>
              <p className="text-gray-500 text-sm">Auto-respond to new leads via email, SMS, or DMs within seconds of sign-up.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">🧾</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Invoicing &amp; Billing</h3>
              <p className="text-gray-500 text-sm">Generate, send, and track invoices automatically. Get paid faster with zero manual work.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Appointment Scheduling</h3>
              <p className="text-gray-500 text-sm">Sync calendars, send reminders, and handle rescheduling — all on autopilot.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Reporting &amp; Analytics</h3>
              <p className="text-gray-500 text-sm">Pull data from any tool and deliver clean weekly summaries direct to your inbox.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Client Onboarding</h3>
              <p className="text-gray-500 text-sm">Send welcome sequences, collect documents, and set up new clients in minutes.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 hover:bg-sky-50 transition-colors border border-gray-100">
              <div className="text-3xl mb-3">🔁</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Data Entry &amp; Sync</h3>
              <p className="text-gray-500 text-sm">Eliminate copy-paste between your CRM, spreadsheets, and other platforms forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sky-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase border border-sky-200">
              Client Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
              <p className="text-gray-700 mb-5 leading-relaxed">&ldquo;FlowZone saved us 15 hours a week on lead follow-up alone. ROI in the first month.&rdquo;</p>
              <div>
                <div className="font-bold text-gray-900">Marcus T.</div>
                <div className="text-gray-400 text-sm">Agency Owner</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
              <p className="text-gray-700 mb-5 leading-relaxed">&ldquo;I was skeptical but they delivered in 5 days. Our invoicing is now fully hands-off.&rdquo;</p>
              <div>
                <div className="font-bold text-gray-900">Sarah K.</div>
                <div className="text-gray-400 text-sm">E-commerce Founder</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
              <p className="text-gray-700 mb-5 leading-relaxed">&ldquo;The onboarding automation they built feels like magic. Clients love it and I save hours.&rdquo;</p>
              <div>
                <div className="font-bold text-gray-900">James R.</div>
                <div className="text-gray-400 text-sm">Consultant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sky-600 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
            Ready to Get Hours Back?
          </h2>
          <p className="text-sky-100 text-xl mb-10 max-w-xl mx-auto">
            Start with a free AI audit. We will map out exactly what to automate and show you the ROI before you spend a dollar.
          </p>
          <Link href="/intake" className="bg-white text-sky-600 font-black px-10 py-5 rounded-xl hover:bg-sky-50 transition-colors text-xl inline-block">
            Get Your Free AI Audit →
          </Link>
          <p className="text-sky-200 text-sm mt-5">No commitment. Delivered in 24 hours. 100% free.</p>
        </div>
      </section>
    </>
  );
}
