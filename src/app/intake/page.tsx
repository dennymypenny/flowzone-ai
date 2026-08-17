"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SITE } from "@/lib/site";
import Icon from "@/components/Icon";

const services = [
  "Starter — $600",
  "Growth — $2,497",
  "Scale — custom quote",
  "Not sure yet",
];

const venmoAmounts: Record<string, number> = {
  "Starter — $600": 600,
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
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const loading = state === "sending";

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // The lead in their own mail app, ready to send. This is what saves the
  // project when our email is down, so it carries every answer they typed.
  const fallbackMailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `New project for FlowZone — ${form.service || "not sure yet"}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nName: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.business}\nPackage: ${
      form.service
    }\n\nWhat I want built:\n${form.description}\n\nThanks,\n${form.name}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // The success screen shows a payment link, so it only ever runs when the
      // server says the details really landed. No body, no promise.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || "That did not send.");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "That did not send.");
    }
  };

  if (state === "done") {
    const amount = venmoAmounts[form.service];
    const note = encodeURIComponent(`FlowZone – ${form.service}`);
    const venmoUrl = `https://venmo.com/u/flowzoneautomation?txn=pay&amount=${amount}&note=${note}`;
    return (
      <div className="min-h-screen bg-paper-deep flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-paper rounded-xl border border-rule p-10 text-center">
          <div className="flex justify-center mb-4">
            <Icon name="sparkle" size={32} color="#5B8CFF" />
          </div>
          <h2 className="text-2xl font-display font-normal text-ink mb-3">You&apos;re all set!</h2>
          {amount ? (
            <>
              <p className="text-ink-mute mb-8 leading-relaxed">
                We got your project details. Lock in your spot below and we will start on it right away.
              </p>
              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-accent text-white font-medium py-4 rounded-xl hover:bg-accent-deep transition-colors text-lg mb-4"
              >
                Pay with Venmo →
              </a>
              <p className="text-xs text-ink-mute">
                You&apos;ll receive a confirmation email within 24 hours of payment.
              </p>
            </>
          ) : (
            <>
              <p className="text-ink-mute mb-6 leading-relaxed">
                We got your project details. Since this one needs a custom scope, we will read it properly and come
                back with a flat quote and a delivery date.
              </p>
              <p className="text-sm text-ink-mute mb-8">
                Expect an email within 24 hours. Nothing to pay until you have the quote.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="block w-full bg-accent text-white font-medium py-4 rounded-xl hover:bg-accent-deep transition-colors text-lg"
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
    <div className="min-h-screen bg-paper-deep py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Get Started</p>
          <h1 className="text-4xl font-display font-normal text-ink mb-3">Start Your Project</h1>
          <p className="text-ink-mute">Tell us what you want built. You get a scope, a price and a date back, usually the same day.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper rounded-xl border border-rule p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Business Name</label>
            <input
              type="text"
              required
              value={form.business}
              onChange={(e) => set("business", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              placeholder="Acme Co."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Package</label>
            <select
              required
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-paper"
            >
              <option value="">Select a package...</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Tell us about the idea</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none"
              placeholder="Describe what you want built and any tools you already use..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-medium py-4 rounded-xl hover:bg-accent-deep transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Project →"}
          </button>

          {state === "error" && (
            <div className="surface border border-rule rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="chat" size={20} color="#5B8CFF" />
                <p className="label">That did not send</p>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed mb-2">{error}</p>
              <p className="text-sm text-ink-mute leading-relaxed mb-4">
                Nothing you typed is lost. Press submit again, or open the email below. It is already
                filled in with your answers and it goes straight to Denny.
              </p>
              <a href={fallbackMailto} className="btn-primary shine">
                Email it to us <span className="arrow">→</span>
              </a>
              <p className="text-xs text-ink-mute mt-3">Or write to {SITE.email}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper-deep" />}>
      <IntakeForm />
    </Suspense>
  );
}
