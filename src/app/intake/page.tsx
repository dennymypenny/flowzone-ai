"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const services = [
  "Starter — $997",
  "Growth — $2,497",
  "Scale — custom quote",
  "Not sure yet",
];

const venmoAmounts: Record<string, number> = {
  "Starter — $997": 997,
  "Growth — $2,497": 2497,
};

function IntakeForm() {
  const searchParams = useSearchParams();
  const rawService = searchParams.get("service") || "";
  // Pricing page links through as "Starter" / "Growth" / "Scale"; match those to the full option labels.
  const key = rawService.trim().toLowerCase();
  const preselected = key
    ? services.find((s) => s.toLowerCase().startsWith(key)) ?? ""
    : "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    service: preselected,
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    const amount = venmoAmounts[form.service];
    const note = encodeURIComponent(`FlowZone AI – ${form.service}`);
    const venmoUrl = `https://venmo.com/u/flowzoneautomation?txn=pay&amount=${amount}&note=${note}`;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">You&apos;re all set!</h2>
          {amount ? (
            <>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We got your project details. Lock in your spot below and we will start on it right away.
              </p>
              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mb-4"
              >
                Pay with Venmo →
              </a>
              <p className="text-xs text-gray-400">
                You&apos;ll receive a confirmation email within 24 hours of payment.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-6 leading-relaxed">
                We got your project details. Since this one needs a custom scope, we will read it properly and come
                back with a flat quote and a delivery date.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Expect an email within 24 hours. Nothing to pay until you have the quote.
              </p>
              <a
                href="mailto:flowzoneautomation@gmail.com"
                className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg"
              >
                Email Us Directly →
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Get Started</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Start Your Project</h1>
          <p className="text-gray-500">Tell us what you want built. Most projects are delivered in 7 days or less.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
            <input
              type="text"
              required
              value={form.business}
              onChange={(e) => set("business", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Co."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Package</label>
            <select
              required
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a package...</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tell us about the idea</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe what you want built and any tools you already use..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Project →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <IntakeForm />
    </Suspense>
  );
}
