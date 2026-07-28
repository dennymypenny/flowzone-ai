import Link from "next/link";
import ChatWidget from "@/app/components/ChatWidget";

export const metadata = {
  title: "FlowZone AI | Creative and Business Studio",
  description: "FlowZone AI is a creative and business studio. We turn ideas into brands, sites and systems that make money. Designed, built and delivered in days.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-24 pb-0 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 px-4 py-2 rounded-full text-sm font-black mb-6 uppercase tracking-widest">
            ✦ Creative and Business Studio · Brands · Sites · Systems
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight tracking-tight">
            You Bring the Idea. <br />
            <span className="text-sky-400">We Build the Whole Thing.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            FlowZone AI is a creative and business studio. We turn ideas into brands, sites and systems that actually make money. AI gives us the speed, humans give it the taste. Delivered in days, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/intake" className="bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30">
              Start Your Project
            </Link>
            <Link href="/case-studies" className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg hover:border-sky-400 hover:text-sky-400 transition-all">
              See Our Work
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-16 relative z-10">
          <ChatWidget />
        </div>
      </section>

      <section className="py-10 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "1:1", label: "Direct Founder Access", color: "text-violet-400", border: "border-violet-500/30" },
            { num: "7 Days", label: "Guaranteed Delivery", color: "text-sky-400", border: "border-sky-500/30" },
            { num: "100%", label: "Done-For-You", color: "text-emerald-400", border: "border-emerald-500/30" },
            { num: "$0", label: "Retainers Required", color: "text-orange-400", border: "border-orange-500/30" },
          ].map((s) => (
            <div key={s.label} className={`border ${s.border} bg-white/5 rounded-2xl py-6 px-4`}>
              <div className={`text-3xl font-black ${s.color} mb-1`}>{s.num}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">OUR SERVICES</p>
            <h2 className="text-4xl font-black text-gray-900">Everything We Build</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">From full storefronts to the systems that run them. If your idea needs it, we build it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📊", title: "Consulting + Dashboards", desc: "Custom KPI dashboards and business consulting to drive real decisions.", href: "/services" },
              { icon: "⚡", title: "Business Systems", desc: "Lead follow-up, invoicing, reporting that runs itself. Set it up once and it works while you sleep.", href: "/services" },
              { icon: "🎨", title: "Portfolio and Resume Sites", desc: "Stand-out personal sites and AI-polished resumes for individuals.", href: "/services" },
              { icon: "🌐", title: "Brands and Storefronts", desc: "Full brand sites and online stores, clean, fast and built to sell.", href: "/services" },
              { icon: "🤔", title: "Something Else?", desc: "We do a lot more than what is listed here. If you need it built, we can probably build it — just tell us what you have in mind.", href: "/intake" },
            ].map((s) => (
              <Link key={s.title} href={s.href} className="block bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 hover:shadow-md transition-all group">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="text-blue-600 font-black hover:underline">View all services</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Ready to build something?</h2>
          <p className="text-slate-300 text-lg mb-8">Tell us what you need — we will follow up by email with exactly how we can help. No calls required.</p>
          <Link href="/intake" className="bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-400 transition-colors inline-block shadow-lg shadow-blue-500/30">
            Send Us Your Project Details
          </Link>
        </div>
      </section>
    </main>
  );
}
