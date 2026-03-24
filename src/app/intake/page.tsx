"use client";
import { useState } from "react";

export default function Intake() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", business: "" });
  const [selected, setSelected] = useState<string[]>([]);
  const [other, setOther] = useState("");

  const automations = [
    { id: "leads", label: "Lead Follow-Up", icon: "📬" },
    { id: "invoicing", label: "Invoicing & Billing", icon: "🧾" },
    { id: "appointments", label: "Appointment Reminders", icon: "📅" },
    { id: "onboarding", label: "Client Onboarding", icon: "🤝" },
    { id: "reviews", label: "Review Requests", icon: "⭐" },
    { id: "reporting", label: "Reporting & Analytics", icon: "📊" },
    { id: "dataentry", label: "Data Entry / Sync", icon: "🔄" },
    { id: "other", label: "Something Else", icon: "💡" },
  ];

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
          try {
                await fetch("/api/submit-lead", {
                        method: "POST",
                                headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                                  name: form.name,
                                                            email: form.email,
                                                                      business: form.business,
                                                                                automations: selected,
                                                                                          otherDetails: other,
                                                                                                  }),
                                                                                                        });
                                                                                                            } catch (err) {
                                                                                                                  console.error("Submission error:", err);
                                                                                                                      }
                                                                                                                          setSubmitted(true);
                                                                                                                            };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-20">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">You&apos;re in!</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            We&apos;ll review what you shared and reach out within a few hours with your custom automation plan.
          </p>
          <div className="bg-blue-50 rounded-2xl p-6 text-left">
            <p className="text-sm font-semibold text-blue-700 mb-1">What happens next:</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>✓ We map out your automations</li>
              <li>✓ You get a same-day response</li>
              <li>✓ Live in 48 hours after kickoff</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sky-600 font-semibold text-sm tracking-widest uppercase mb-3">Free AI Audit</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-3">
            {step === 1 ? "Let’s get started" : "What do you want to automate?"}
          </h1>
          <p className="text-gray-400 text-base">
            {step === 1
              ? "Two quick steps. No commitment."
              : "Pick everything that eats your time right now."}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center mb-10">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {n}
              </div>
              {n < 2 && <div className={`h-px w-10 ${step > n ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your name</label>
              <input
                type="text"
                required
                placeholder="Maria Gonzalez"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                placeholder="maria@business.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business name</label>
              <input
                type="text"
                required
                placeholder="AlphaPro Pest Control"
                value={form.business}
                onChange={(e) => setForm({ ...form, business: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base transition mt-2"
            >
              Next →
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {automations.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition font-medium text-sm ${
                    selected.includes(a.id)
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>

            {selected.includes("other") && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tell us more</label>
                <textarea
                  placeholder="Describe what you want to automate..."
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-4 rounded-xl text-base hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={selected.length === 0}
                className="flex-2 flex-grow bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition"
              >
                Get My Free Audit →
              </button>
            </div>
            <p className="text-center text-xs text-gray-400">No commitment. We&apos;ll reply within a few hours.</p>
          </form>
        )}

      </div>
    </main>
  );
}
