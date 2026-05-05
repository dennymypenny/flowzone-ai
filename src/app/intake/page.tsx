"use client";
import { useState } from "react";

const SERVICES = [
  "Lead Intake & CRM Automation",
  "Appointment Booking & Reminders",
  "Customer Support Triage",
  "Automated Reporting & Dashboards",
  "Invoice & Payment Workflows",
  "Content Repurposing Automation",
  "Email Nurture Sequences",
  "Custom API & Tool Integrations",
  "Website or Portfolio",
  "Something Else — I'll Explain Below",
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
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-black text-blue-900 mb-3">We got it!</h1>
          <p className="text-gray-500 text-lg mb-6">
            Thanks <span className="font-semibold text-gray-700">{form.name}</span> — we&apos;ll review your request and get back to you within 24 hours.
          </p>
          <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-left">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">What happens next</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">→</span> We review your project details</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">→</span> We send you a custom proposal via email</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">→</span> We start building — delivered in 7 days or less</li>
            </ul>
          </div>
          <p className="text-sm text-gray-400">Questions? Email <a href="mailto:flowzoneautomation@gmail.com" className="text-blue-600 hover:underline">flowzoneautomation@gmail.com</a></p>
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
          <p className="text-gray-500 text-lg">Fill this out and we&apos;ll send you a custom proposal within 24 hours.</p>
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
                <option key={s} value={s}>{s}</option>
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-base"
          >
            {loading ? "Sending..." : "Submit My Project →"}
          </button>

          <p className="text-xs text-center text-gray-400">We reply within 24 hours · No calls required · Delivered in 7 days or less</p>
        </form>
      </div>
    </div>
  );
}
