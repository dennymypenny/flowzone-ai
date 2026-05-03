"use client";
import { useState } from "react";
import Link from "next/link";

const services = [
  { id: "consulting", icon: "📊", label: "Business Consulting + KPI Dashboard", desc: "Map my operations and build a real-time dashboard" },
  { id: "automation", icon: "⚡", label: "Workflow Automation", desc: "Automate lead follow-up, invoicing, or reporting" },
  { id: "portfolio", icon: "🎨", label: "Portfolio or Resume Site", desc: "Build my personal website or polish my resume" },
  { id: "website", icon: "🌐", label: "Business Website or Landing Page", desc: "Design and build a site for my business" },
];

export default function Intake() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", business: "", type: "business",
    service: "", goal: "", timeline: "", budget: "",
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (_) {}
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">You are all set!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Thanks, {form.name}! We will review your info and reach out within 24 hours to schedule your free consultation.
          </p>
          <Link href="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-blue-700 transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-3">FREE CONSULTATION</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Let us get started</h1>
          <p className="text-gray-500">Two quick steps. No commitment.</p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
            <div className={`h-1 w-16 rounded ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-gray-900 mb-6">About you</h2>

              {/* Business or Individual toggle */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">I am a...</label>
                <div className="flex gap-3">
                  {["business", "individual"].map(t => (
                    <button
                      key={t}
                      onClick={() => update("type", t)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-black text-sm capitalize transition-colors ${form.type === t ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                      {t === "business" ? "🏢 Business" : "👤 Individual"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="First and last name"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {form.type === "business" ? "Business name" : "Your role or profession"}
                </label>
                <input
                  type="text"
                  value={form.business}
                  onChange={e => update("business", e.target.value)}
                  placeholder={form.type === "business" ? "Acme Corp" : "e.g. Graphic Designer, Software Engineer"}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.business}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-gray-900 mb-6">What do you need?</h2>

              {/* Service selection */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3">Select a service</label>
                <div className="space-y-3">
                  {services.map(s => (
                    <button
                      key={s.id}
                      onClick={() => update("service", s.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${form.service === s.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <div className={`font-black text-sm ${form.service === s.id ? "text-blue-600" : "text-gray-900"}`}>{s.label}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">What is your main goal?</label>
                <textarea
                  value={form.goal}
                  onChange={e => update("goal", e.target.value)}
                  placeholder="Tell us what you are trying to achieve or what problem you need solved..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                />
              </div>

              {/* Timeline + Budget row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Timeline</label>
                  <select
                    value={form.timeline}
                    onChange={e => update("timeline", e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option>ASAP</option>
                    <option>Within 2 weeks</option>
                    <option>Within a month</option>
                    <option>Just exploring</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Budget range</label>
                  <select
                    value={form.budget}
                    onChange={e => update("budget", e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option>Under $500</option>
                    <option>$500 - $1,000</option>
                    <option>$1,000 - $2,500</option>
                    <option>$2,500+</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 font-black text-gray-600 hover:border-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.service || !form.goal}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          No spam. No commitment. We will reach out within 24 hours.
        </p>
      </div>
    </main>
  );
}
