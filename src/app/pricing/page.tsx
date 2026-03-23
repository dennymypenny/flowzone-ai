export default function PricingPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-b from-blue-950 to-blue-900 text-white text-center py-24 px-6">
        <div className="inline-flex items-center gap-2 bg-blue-800 text-sky-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
          48-Hour Delivery Guarantee
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight max-w-3xl mx-auto">
          Stop Losing Money<br />to Manual Work
        </h1>
        <p className="text-blue-200 text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          We build AI automations for your business — custom-built, fully working, live in 48 hours. Pay once. Own it forever.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-300">
          <span>✓ No monthly fees</span>
          <span>✓ No subscriptions</span>
          <span>✓ No technical skills needed</span>
          <span>✓ Full refund if not delivered in 48 hrs</span>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <div className="bg-sky-50 border-y border-sky-100 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center text-sm text-gray-600">
          <div><span className="block text-2xl font-black text-blue-700">120+</span>Businesses Automated</div>
          <div><span className="block text-2xl font-black text-blue-700">48 hrs</span>Average Delivery</div>
          <div><span className="block text-2xl font-black text-blue-700">$0</span>Monthly Fees</div>
          <div><span className="block text-2xl font-black text-blue-700">100%</span>Money-Back Guarantee</div>
        </div>
      </div>

      {/* PLANS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Choose Your Plan</h2>
          <p className="text-gray-500 text-lg">One-time payment. No retainers. No surprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

          {/* STARTER */}
          <div className="border border-gray-200 rounded-3xl p-8 flex flex-col bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Starter</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">$997</span>
              <span className="text-gray-400 mb-2 text-sm">one-time</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Perfect for businesses ready to automate their first time-drain.</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
              {["1 fully custom automation workflow","Built & live within 48 hours","30-day support & bug fixes","You own 100% of the workflow","Onboarding walkthrough call","Works with your existing tools"].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/intake" className="block text-center bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition">
              Start Automating →
            </a>
          </div>

          {/* GROWTH - HIGHLIGHTED */}
          <div className="relative bg-blue-700 rounded-3xl p-8 flex flex-col text-white shadow-2xl md:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-400 text-white text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap">
              🔥 Most Popular
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Growth</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black">$2,497</span>
              <span className="text-blue-300 mb-2 text-sm">one-time</span>
            </div>
            <p className="text-blue-200 text-sm mb-6 leading-relaxed">For businesses serious about saving 10+ hours a week across multiple workflows.</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-blue-100">
              {["3 fully custom automation workflows","All 3 delivered within 48 hours","60-day support & bug fixes","You own 100% of all workflows","Priority onboarding strategy call","Deep integration with your tools","Monthly automation check-in call"].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-sky-300 font-bold mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/intake" className="block text-center bg-white text-blue-700 py-4 rounded-2xl font-bold text-sm hover:bg-sky-50 transition">
              Get All 3 Workflows →
            </a>
          </div>

          {/* SCALE */}
          <div className="border border-gray-200 rounded-3xl p-8 flex flex-col bg-white">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Scale</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">Custom</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">For fast-growing teams that need an automation partner in their corner.</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
              {["Unlimited automations, ongoing","Dedicated automation engineer","Continuous support & new builds","Full ownership of all systems","Weekly strategy & review calls","Custom dashboards & reporting","CRM, billing, scheduling & more"].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/intake" className="block text-center bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition">
              Let&apos;s Talk →
            </a>
          </div>

        </div>
      </section>

      {/* WHAT YOU'RE ACTUALLY SAVING */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">What&apos;s This Actually Worth to You?</h2>
          <p className="text-gray-500 mb-12 text-lg">Most business owners waste 15–25 hours per week on tasks we can automate. Here&apos;s what that costs you:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { label: "If you value your time at $50/hr", weekly: "750/week", annual: "$39,000/year", lost: "lost to manual tasks" },
              { label: "If you value your time at $100/hr", weekly: "$1,500/week", annual: "$78,000/year", lost: "lost to manual tasks" },
              { label: "If you value your time at $200/hr", weekly: "$3,000/week", annual: "$156,000/year", lost: "lost to manual tasks" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-3">{item.label}</p>
                <p className="text-3xl font-black text-red-500 mb-1">{item.weekly}</p>
                <p className="text-sm text-gray-400">{item.annual} {item.lost}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-gray-500 text-sm">A $997 automation that saves you 10 hrs/week pays for itself in <strong className="text-gray-900">less than 2 weeks.</strong></p>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-blue-700 text-white rounded-3xl p-12">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-3xl font-black mb-4">The 48-Hour Guarantee</h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-6">
            If your automation isn&apos;t built and live within 48 hours of your kickoff call, you get a <strong className="text-white">full refund — no questions asked.</strong> We&apos;ve never had to pay one out.
          </p>
          <a href="/intake" className="inline-block bg-white text-blue-700 font-black px-10 py-4 rounded-2xl text-lg hover:bg-sky-50 transition">
            Claim Your Free AI Audit →
          </a>
          <p className="text-blue-300 text-xs mt-4">No commitment. We&apos;ll show you exactly what to automate first.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "We were spending 3 hours a day on follow-ups. Now it&apos;s fully automated. Best $997 I&apos;ve ever spent.", name: "Marcus T.", role: "Real Estate Agency Owner" },
              { quote: "I was skeptical but they delivered in 36 hours. My invoicing used to take half my Friday. Now it just... happens.", name: "Priya S.", role: "Freelance Consultant" },
              { quote: "We went from 5 manual steps to 1 click. The ROI in the first month was easily 10x.", name: "Jason R.", role: "E-Commerce Store Owner" },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Common Questions</h2>
        <div className="space-y-6">
          {[
            { q: "What can you actually automate?", a: "Lead follow-up, invoicing, appointment reminders, client onboarding, reporting, data entry, CRM updates, email sequences, review requests — if you&apos;re doing it manually and repeatedly, we can automate it." },
            { q: "How does the 48-hour thing actually work?", a: "You book a 30-min kickoff call, we get the details we need, and our team starts building immediately. Most clients get their automation live within 24–36 hours. The clock starts at kickoff." },
            { q: "Do I need to give you access to my accounts?", a: "Usually yes — we&apos;ll need view/edit access to the tools we&apos;re connecting. We walk you through exactly what to share during the kickoff call. Everything stays secure and we only touch what&apos;s needed." },
            { q: "What if I need changes after delivery?", a: "Every plan includes a support window (30 or 60 days) where we fix bugs and make adjustments at no charge. Bigger scope changes are quoted separately." },
            { q: "Is there really no monthly fee?", a: "None from us. You own the automation. There may be small costs from third-party tools like Zapier or Make (usually $10–30/mo), but we&apos;ll tell you exactly what those are upfront." },
          ].map(faq => (
            <div key={faq.q} className="border-b border-gray-100 pb-6">
              <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-blue-950 text-white text-center py-20 px-6">
        <h2 className="text-4xl font-black mb-4">Ready to Get Your Time Back?</h2>
        <p className="text-blue-300 text-lg mb-8 max-w-xl mx-auto">Start with a free AI audit. We&apos;ll map out exactly what to automate first — zero pressure, zero commitment.</p>
        <a href="/intake" className="inline-block bg-sky-500 hover:bg-sky-400 text-white font-black px-12 py-5 rounded-2xl text-lg transition">
          Get My Free AI Audit →
        </a>
        <p className="text-blue-400 text-sm mt-4">Takes 2 minutes. No credit card needed.</p>
      </section>

    </main>
  );
}
