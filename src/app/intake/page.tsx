"use client";
import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export default function Intake() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", website: "",
    needs: "", monthlyRevenue: "",
    biggestPain: "", manualTask: "", timeSpent: "", tools: "",
    budget: "", timeline: "", extras: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Post to our internal API
    fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(console.error);
    // Also post to formsubmit.co as backup delivery
    try {
      await fetch("https://formsubmit.co/ajax/flowzoneautomation@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          _subject: "New AI Audit Request — FlowZone",
          _captcha: "false",
          _template: "table",
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
        <div className="max-w-xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Your AI Audit is Being Prepared!</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            We'll review your answers and send your custom automation plan to {""}
            <span className="text-indigo-600 font-semibold">{form.email}</span> within{" "}
            <strong className="text-gray-900">24 hours</strong>.
          </p>

          {/* Upsell card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-left mb-8 shadow-xl">
            <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider mb-3">⚡ Want Faster Results?</div>
            <h2 className="text-2xl font-black text-white mb-3">AI Scan & Diagnosis — $97</h2>
            <p className="text-indigo-100 leading-relaxed mb-6">
              Skip the wait. We'll audit your entire workflow, identify your top 3 automation opportunities,
              and deliver a full prioritized roadmap with ROI estimates — in <strong>48 hours</strong>.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Complete workflow audit",
                "3 automation opportunities ranked by ROI",
                "Tool recommendations + integration plan",
                "48-hour delivery guarantee",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-indigo-100 text-sm">
                  <span className="text-yellow-300">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link
              href="/scan"
              className="block w-full bg-white text-indigo-700 font-black py-4 rounded-xl text-center hover:bg-indigo-50 transition-colors text-lg"
            >
              Get the AI Scan for $97 →
            </Link>
            <p className="text-indigo-300 text-xs text-center mt-3">30-day money-back guarantee</p>
          </div>

          <p className="text-gray-400 text-sm">
            Prefer to talk through it?{" "}
            <Link href="/book" className="text-indigo-600 hover:underline font-semibold">
              Book a free 20-min call →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-white pt-20 pb-10 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4">Free AI Audit</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Tell Us About Your Business</h1>
          <p className="text-gray-500 leading-relaxed">
            Answer a few questions and we'll send you a free, custom automation plan within 24 hours — no sales pitch, no pressure.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">

          {/* Progress */}
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>{s}</div>
                <div className={`h-1 flex-1 rounded-full ${s < 3 ? (step > s ? "bg-indigo-600" : "bg-gray-200") : "hidden"}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-10 -mt-6">
            <span>Your Business</span>
            <span className="ml-4">Your Challenge</span>
            <span>Budget & Goals</span>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">

            {/* Step 1 */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-black text-gray-900">About You & Your Business</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name *</label>
                    <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
                    <input value={form.company} onChange={(e) => set("company", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      placeholder="Acme Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
                    <input value={form.website} onChange={(e) => set("website", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                      placeholder="https://yoursite.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What do you need automated? *</label>
                  <textarea required value={form.needs} onChange={(e) => set("needs", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                    placeholder="e.g. I want to automate my lead intake, follow-up emails, and reporting..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Revenue (optional)</label>
                  <select value={form.monthlyRevenue} onChange={(e) => set("monthlyRevenue", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-white">
                    <option value="">Prefer not to say</option>
                    <option>Under $5k/mo</option>
                    <option>$5k–$20k/mo</option>
                    <option>$20k–$100k/mo</option>
                    <option>$100k+/mo</option>
                  </select>
                </div>
                <button type="button" onClick={() => setStep(2)}
                  disabled={!form.name || !form.email || !form.needs}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-black text-gray-900">Your Biggest Challenge</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What's your biggest operational pain right now? *</label>
                  <textarea required value={form.biggestPain} onChange={(e) => set("biggestPain", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                    placeholder="e.g. We spend 3 hours every Monday manually pulling reports from 4 different tools..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe the specific manual task you want automated *</label>
                  <textarea required value={form.manualTask} onChange={(e) => set("manualTask", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                    placeholder="e.g. When a lead submits our Typeform, I manually add them to HubSpot, send an email, and post in Slack..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">How many hours/week does this take? *</label>
                  <select required value={form.timeSpent} onChange={(e) => set("timeSpent", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-white">
                    <option value="">Select...</option>
                    <option>Less than 1 hour</option>
                    <option>1–3 hours</option>
                    <option>3–6 hours</option>
                    <option>6–10 hours</option>
                    <option>10+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What tools are involved? (CRM, email, Slack, etc.)</label>
                  <input value={form.tools} onChange={(e) => set("tools", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                    placeholder="e.g. HubSpot, Gmail, Slack, Airtable, Typeform" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-4 rounded-xl hover:border-gray-400 transition-colors">
                    ← Back
                  </button>
                  <button type="button" onClick={() => setStep(3)}
                    disabled={!form.biggestPain || !form.manualTask || !form.timeSpent}
                    className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-black text-gray-900">Budget & Timeline</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">What's your budget for this automation? *</label>
                  <select required value={form.budget} onChange={(e) => set("budget", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-white">
                    <option value="">Select...</option>
                    <option>Under $500</option>
                    <option>$500–$1,000</option>
                    <option>$1,000–$2,500</option>
                    <option>$2,500–$5,000</option>
                    <option>$5,000+</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">How soon do you want this live? *</label>
                  <select required value={form.timeline} onChange={(e) => set("timeline", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors bg-white">
                    <option value="">Select...</option>
                    <option>ASAP — this week</option>
                    <option>Within 2 weeks</option>
                    <option>This month</option>
                    <option>Next quarter</option>
                    <option>Just exploring for now</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Anything else we should know?</label>
                  <textarea value={form.extras} onChange={(e) => set("extras", e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                    placeholder="Previous automation attempts, special requirements, team structure, anything relevant..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-4 rounded-xl hover:border-gray-400 transition-colors">
                    ← Back
                  </button>
                  <button type="submit"
                    disabled={!form.budget || !form.timeline || submitting}
                    className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? "Sending..." : "Get My Free AI Audit →"}
                  </button>
                </div>
              </>
            )}
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">Your info is kept private. We'll never spam you or share your data.</p>
        </div>
      </section>
    </>
  );
}
