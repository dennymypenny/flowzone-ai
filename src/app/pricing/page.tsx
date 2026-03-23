export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$997",
      description: "Perfect for small businesses ready to automate their first workflow.",
      features: [
        "1 custom automation workflow",
        "Delivered in 48 hours",
        "30-day support & bug fixes",
        "Full ownership of your workflow",
        "Onboarding call included",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Growth",
      price: "$2,497",
      description: "For businesses that want to automate multiple processes at once.",
      features: [
        "3 custom automation workflows",
        "Delivered in 48 hours",
        "60-day support & bug fixes",
        "Full ownership of all workflows",
        "Priority onboarding call",
        "Integration with your existing tools",
        "Monthly check-in call",
      ],
      cta: "Most Popular",
      highlight: true,
    },
    {
      name: "Scale",
      price: "Custom",
      description: "For growing teams that need full-stack automation across the business.",
      features: [
        "Unlimited automation workflows",
        "Dedicated automation engineer",
        "Ongoing support & iterations",
        "Full ownership of all workflows",
        "Weekly strategy calls",
        "Custom dashboard & reporting",
        "CRM, billing & scheduling integrations",
      ],
      cta: "Talk to Us",
      highlight: false,
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-sky-600 font-semibold tracking-widest text-sm uppercase mb-4">Pricing</p>
        <h1 className="text-5xl font-black text-gray-900 mb-5 leading-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
          No retainers. No hidden fees. You pay once, we build it, you own it — live in 48 hours or your money back.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 flex flex-col ${
                plan.highlight
                  ? "bg-blue-700 border-blue-700 text-white shadow-2xl scale-105"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-400 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? "text-sky-300" : "text-sky-600"}`}>
                  {plan.name}
                </p>
                <p className="text-5xl font-black mb-3">{plan.price}</p>
                <p className={`text-sm leading-relaxed ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-3 text-sm ${plan.highlight ? "text-blue-100" : "text-gray-600"}`}>
                    <span className={`mt-0.5 text-lg leading-none ${plan.highlight ? "text-sky-300" : "text-sky-500"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/intake"
                className={`block text-center py-4 rounded-2xl font-bold text-sm transition ${
                  plan.highlight
                    ? "bg-white text-blue-700 hover:bg-sky-50"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {plan.name === "Scale" ? "Talk to Us →" : "Get Started →"}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-50 rounded-3xl p-10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-3">48-Hour Delivery Guarantee</h2>
          <p className="text-gray-500 leading-relaxed">
            Every FlowZone AI project is delivered within 48 hours of kickoff — or you get a full refund, no questions asked. We&apos;re that confident in our process.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6 text-left">
            {[
              {
                q: "What counts as one workflow?",
                a: "A workflow is a single automated process — for example, an automated lead follow-up sequence, an invoicing system, or an appointment reminder chain. If you need multiple connected automations, the Growth or Scale plan is the right fit.",
              },
              {
                q: "What tools do you integrate with?",
                a: "We work with any tools your business already uses — including GoHighLevel, HubSpot, Zapier, Make, Notion, QuickBooks, Calendly, Google Workspace, and more. If you use it, we can automate it.",
              },
              {
                q: "Do I need any technical knowledge?",
                a: "None at all. You tell us what you want to automate, we build it, and we walk you through how it works. No coding, no complexity.",
              },
              {
                q: "What happens after delivery?",
                a: "Every plan includes a support window for bug fixes and adjustments. For ongoing automation and new workflows, ask about our Scale plan.",
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Yes. If we don't deliver your working automation within 48 hours of kickoff, you get a full refund. No hassle, no fine print.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
