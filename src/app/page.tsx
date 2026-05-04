import Link from "next/link";
import ChatWidget from "@/app/components/ChatWidget";

export const metadata = {
  title: "FlowZone AI | Consult. Build. Deliver.",
  description:
    "We consult with businesses and individuals, then build exactly what they need — dashboards, automations, portfolio sites, and more.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-white pt-20 pb-0 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-black mb-6 uppercase tracking-widest">
            ✦ Consulting · Dashboards · Sites · Automation
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
            We Consult. We Build. <br />
            <span className="text-sky-600">We Deliver.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-8 leading-relaxed">
            We work with businesses and individuals to build exactly what they need — dashboards,
            automations, portfolio sites, and more. Delivered fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/intake"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Start Your Project
            </Link>
            <Link
              href="/case-studies"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-black text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              See Our Work
            </Link>
          </div>
        </div>

        {/* Wide rectangular chat — max-w-4xl, self-contained height */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <ChatWidget />
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "50+", label: "PROJECTS BUILT" },
            { num: "7 Days", label: "AVERAGE DELIVERY" },
            { num: "100%", label: "DONE-FOR-YOU" },
            { num: "5.0 ★", label: "CLIENT RATING" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-gray-900 mb-1">{s.num}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">
              OUR SERVICES
            </p>
            <h2 className="text-4xl font-black text-gray-900">Everything We Build</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From KPI dashboards to portfolio sites — we cover all the bases.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Consulting + Dashboards",
                desc: "Custom KPI dashboards and business consulting to drive real decisions.",
                href: "/services",
              },
              {
                icon: "⚡",
                title: "Workflow Automation",
                desc: "Automate lead follow-up, invoicing, reporting — set it and forget it.",
                href: "/services",
              },
              {
                icon: "🎨",
                title: "Portfolio and Resume Sites",
                desc: "Stand-out personal sites and AI-polished resumes for individuals.",
                href: "/services",
              },
              {
                icon: "🌐",
                title: "Business Websites",
                desc: "Clean, fast, conversion-focused sites and landing pages.",
                href: "/services",
              },
              {
                icon: "🤔",
                title: "Something Else?",
                desc: "We do a lot more than what is listed here. If you need it built, we can probably build it — just tell us what you have in mind.",
                href: "/intake",
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="block bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="text-blue-600 font-black hover:underline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to build something?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Tell us what you need — we will follow up by email with exactly how we can help. No
            calls required.
          </p>
          <Link
            href="/intake"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Send Us Your Project Details
          </Link>
        </div>
      </section>
    </main>
  );
}
