import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a Free Call",
  description: "Schedule a free 20-minute discovery call with FlowZone AI to get your custom automation plan.",
};

export default function Book() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">Free Discovery Call</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Book Your Free 20-Min Call</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Tell us what you're working on. We'll identify your top automation opportunity and give you a free plan — no pitch, no pressure.
          </p>
        </div>
      </section>

      {/* Booking + what to expect */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">

          {/* Calendly embed placeholder */}
          <div className="md:col-span-3">
            <div className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden" style={{ minHeight: "580px" }}>
              {/* Replace this div with a real Calendly inline widget */}
              {/* <div className="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style={{minWidth:"320px",height:"700px"}}></div> */}
              {/* <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script> */}
              <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                <div className="text-5xl mb-6">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Scheduling Widget</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  To activate live booking, replace this section with your Calendly embed code. Paste your Calendly URL below to get started.
                </p>
                <a
                  href="mailto:flowzoneautomation@gmail.com?subject=Book%20a%20Free%20Call%20-%20FlowZone%20AI&body=Hi%2C%20I%27d%20like%20to%20book%20a%20free%2020-minute%20discovery%20call."
                  className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Book via Email Instead →
                </a>
                <p className="text-xs text-gray-400 mt-4">Or email us directly: flowzoneautomation@gmail.com</p>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">What to Expect</h2>
              <div className="space-y-5">
                {[
                  { icon: "🎯", title: "We learn about your business", body: "Tell us what you do, how big your team is, and where you're spending the most manual time." },
                  { icon: "🔍", title: "We identify your #1 opportunity", body: "We'll pinpoint the highest-ROI automation for your specific situation — based on time saved, revenue impact, and complexity." },
                  { icon: "🗺️", title: "You get a free custom plan", body: "We'll map out exactly what we'd build, what tools we'd connect, and what the outcome would look like." },
                  { icon: "🤝", title: "Zero pressure", body: "If it's not a good fit, we'll tell you. No hard sell, no follow-up spam. Just an honest conversation." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="text-2xl shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-indigo-700 font-bold text-sm mb-3">💡 Come prepared with:</p>
              <ul className="space-y-2 text-sm text-indigo-600">
                <li className="flex items-start gap-2"><span>•</span> The task(s) eating your time most</li>
                <li className="flex items-start gap-2"><span>•</span> Tools you currently use (CRM, email, etc.)</li>
                <li className="flex items-start gap-2"><span>•</span> Roughly how often you do it per week</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-gray-900 text-sm mb-1">Prefer to start async?</p>
              <p className="text-gray-400 text-sm mb-4">Fill out our intake form and we'll put together your automation plan within 24 hours.</p>
              <Link href="/intake" className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
                Fill out the intake form →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-8 uppercase tracking-wide font-semibold">What Clients Say About the Call</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Best 20 minutes I've spent on my business this quarter. Left with a clear plan and a clear ROI.", name: "James R.", role: "Agency owner" },
              { quote: "I expected a sales pitch. Instead I got 20 minutes of genuinely useful advice. Hired them on the spot.", name: "Lena C.", role: "E-commerce founder" },
              { quote: "They identified an automation I hadn't even thought of that ended up saving us 6 hours a week.", name: "Raj S.", role: "Operations Director" },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
                <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
