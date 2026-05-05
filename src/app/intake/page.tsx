"use client";
import { useState } from "react";

const SERVICES: { label: string; price: string; amount: string }[] = [
  { label: "Lead Intake & CRM Automation", price: "$997", amount: "997" },
  { label: "Appointment Booking & Reminders", price: "$797", amount: "797" },
  { label: "Customer Support Triage", price: "$1,197", amount: "1197" },
  { label: "Automated Reporting & Dashboards", price: "$1,297", amount: "1297" },
  { label: "Invoice & Payment Workflows", price: "$897", amount: "897" },
  { label: "Content Repurposing Automation", price: "$897", amount: "897" },
  { label: "Email Nurture Sequences", price: "$797", amount: "797" },
  { label: "Custom API & Tool Integrations", price: "$1,097", amount: "1097" },
  { label: "Website or Portfolio", price: "$497", amount: "497" },
  { label: "Something Else — I'll Explain Below", price: "$497+", amount: "497" },
];

export default function IntakePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    service: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const selectedService = SERVICES.find((s) => s.label === form.service);

  const venmoNote = encodeURIComponent(`FlowZone AI - ${form.service}`);
  const venmoURL = selectedService
    ? `https://venmo.com/u/flowzoneautomation?txn=pay&amount=${selectedService.amount}&note=${venmoNote}`
    : "https://venmo.com/u/flowzoneautomation";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at flowzoneautomation@gmail.com.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6 py-20">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-blue-900 mb-2">Almost there!</h1>
          <p className="text-gray-500 text-base mb-8">
            We received your project details. Complete your payment below and we&apos;ll get started right away.
          </p>

          {/* Payment box */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Your Order</p>
            <p className="text-lg font-bold text-gray-900 mb-1">{form.service}</p>
            <p className="text-4xl font-black text-blue-600 mb-6">{selectedService?.price ?? "Custom"}</p>
            <a
              href={venmoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Pay with Venmo →
            </a>
            <p className="text-xs text-gray-400 mt-3">Opens Venmo with amount pre-filled</p>
          </div>

          <div className="text-left bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="text-sm font-bold text-gray-700 mb-3">What happens next</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">1.</span> Complete payment on Venmo</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">2.</span> We confirm and review your project details</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">3.</span> Your automation is delivered in 7 days or less</li>
            </ul>
          </div>

          <p className="text-sm text-gray-400">Questions? <a href="mailto:flowzoneautomation@gmail.com" className="text-blue-600 hover:underline">flowzoneautomation@gmail.com</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-16 px-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Get Started</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Tell Us What You Need</h1>
          <p className="text-gray-500 text-lg">Fill this out and we&apos;ll get your automation started right away.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name <span className="text-blue-500">*</span></label>
              <input
                required
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-blue-500">*</span></label>
              <input
                required
                type="email"
                placeholder="jane@company.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
            <input
              type="text"
              placeholder="Acme Inc."
              value={form.business}
              onChange={(e) => set("business", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">What do you need? <span className="text-blue-500">*</span></label>
            <select
              required
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-400 transition-colors bg-white"
            >
              <option value="">Select a service...</option>
              {SERVICES.map((s) => (
                <option key={s.label} value={s.label}>{s.label} — {s.price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tell us more <span className="text-blue-500">*</span></label>
            <textarea
              required
              rows={4}
              placeholder="Describe what you're dealing with, what tools you use, and what outcome you're looking for..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          {selectedService && (
            <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">{selectedService.label}</p>
              <p className="text-lg font-black text-blue-600">{selectedService.price}</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Sending..." : "Continue to Payment →"}
          </button>

          <p className="text-xs text-center text-gray-400">We reply within 24 hours · No calls required · Delivered in 7 days or less</p>
        </form>
      </div>
    </div>
  );
}
