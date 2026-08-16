import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Free Call",
  description: "Schedule a free 20-minute discovery call with FlowZone AI to get your custom systems plan.",
};

export default function Book() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper pt-20 pb-16 px-6 border-b border-rule">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Free Discovery Call</p>
          <h1 className="text-5xl md:text-6xl font-display font-normal text-ink mb-6">Book Your Free 20-Min Call</h1>
          <p className="text-xl text-ink-mute leading-relaxed">
            Tell us the idea you're sitting on. We'll identify your top systems opportunity and give you a free plan. No pitch, no pressure.
          </p>
        </div>
      </section>

      {/* Booking + what to expect */}
      <section className="py-20 px-6 bg-paper">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">

          {/* Calendly embed placeholder */}
          <div className="md:col-span-3">
            <div className="bg-paper-deep rounded-xl border border-rule overflow-hidden" style={{ minHeight: "580px" }}>
              {/* Replace this div with a real Calendly inline widget */}
              {/* <div className="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style={{minWidth:"320px",height:"700px"}}></div> */}
              {/* <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script> */}
              <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                <div className="text-5xl mb-6">📅</div>
                <h3 className="text-xl font-bold text-ink mb-3">Scheduling Widget</h3>
                <p className="text-ink-mute text-sm leading-relaxed mb-6">
                  To activate live booking, replace this section with your Calendly embed code. Paste your Calendly URL below to get started.
                </p>
                <a
                  href={`mailto:${SITE.email}?subject=Book%20a%20Free%20Call%20-%20FlowZone%20AI&body=Hi%2C%20I%27d%20like%20to%20book%20a%20free%2020-minute%20discovery%20call.`}
                  className="bg-accent text-white font-bold px-8 py-4 rounded-xl hover:bg-accent-deep transition-colors"
                >
                  Book via Email Instead →
                </a>
                <p className="text-xs text-ink-mute mt-4">Or email us directly: {SITE.email}</p>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-normal text-ink mb-6">What to Expect</h2>
              <div className="space-y-5">
                {[
                  { icon: "🎯", title: "We learn about your business", body: "Tell us what you do, who you serve and where your time is disappearing every week." },
                  { icon: "🔍", title: "We identify your #1 opportunity", body: "We'll pinpoint the highest-ROI thing to build for your specific situation, based on time saved, revenue impact and complexity." },
                  { icon: "🗺️", title: "You get a free custom plan", body: "We'll map out exactly what we'd build, how the pieces connect and what the outcome would look like." },
                  { icon: "🤝", title: "Zero pressure", body: "If it's not a good fit, we'll tell you. No hard sell, no follow-up spam. Just an honest conversation." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="text-2xl shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{item.title}</p>
                      <p className="text-ink-mute text-sm mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-paper-deep rounded-xl p-6 border border-rule">
              <p className="text-accent font-bold text-sm mb-3">💡 Come prepared with:</p>
              <ul className="space-y-2 text-sm text-accent">
                <li className="flex items-start gap-2"><span>•</span> The idea or the task eating your time most</li>
                <li className="flex items-start gap-2"><span>•</span> Tools you currently use (CRM, email, etc.)</li>
                <li className="flex items-start gap-2"><span>•</span> Roughly how often you do it per week</li>
              </ul>
            </div>

            <div className="border border-rule rounded-xl p-6">
              <p className="font-bold text-ink text-sm mb-1">Prefer to start async?</p>
              <p className="text-ink-mute text-sm mb-4">Fill out our intake form and we'll put together your system plan within 24 hours.</p>
              <Link href="/intake" className="text-accent font-semibold text-sm hover:text-indigo-800 transition-colors">
                Fill out the intake form →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6 bg-paper-deep border-t border-rule">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ink-mute text-sm mb-8 uppercase tracking-wide font-semibold">What Clients Say About the Call</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Best 20 minutes I've spent on my business this quarter. Left with a clear plan and a clear ROI.", name: "James R.", role: "Agency owner" },
              { quote: "I expected a sales pitch. Instead I got 20 minutes of genuinely useful advice. Hired them on the spot.", name: "Lena C.", role: "E-commerce founder" },
              { quote: "They identified a system I hadn't even thought of that ended up saving us 6 hours a week.", name: "Raj S.", role: "Operations Director" },
            ].map((t) => (
              <div key={t.name} className="bg-paper rounded-xl p-6 border border-rule text-left">
                <div className="flex text-yellow-400 text-sm mb-3">★★★★★</div>
                <p className="text-ink-soft text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <p className="font-semibold text-ink text-sm">{t.name}</p>
                <p className="text-ink-mute text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
