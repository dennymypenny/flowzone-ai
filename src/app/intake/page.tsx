"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { readCart, clearCart, cartTotal, money } from "@/app/components/cart";
import { SITE } from "@/lib/site";
import Icon from "@/components/Icon";

/**
 * The intake is a ticket with four options: the four builds. The visitor picks
 * the build, tells us the idea, submits. Same API, same fallback mailto, same
 * honest success screen. Legacy ?service= links from /pricing still preselect.
 */

type Build = {
  key: string;
  emoji: string;
  c: string;
  name: string;
  one: string;
  from: string;
  amount?: number;
};

const builds: Build[] = [
  {
    key: "identity",
    emoji: "\u{1F3A8}",
    c: "#4C7BE8",
    name: "The Identity Build",
    one: "Your logo, colors and words. A brand people remember.",
    from: "From $500",
    amount: 500,
  },
  {
    key: "site",
    emoji: "\u{1F310}",
    c: "#5B9BF9",
    name: "The Site Build",
    one: "A website that looks legit and turns visitors into customers.",
    from: "From $500",
    amount: 500,
  },
  {
    key: "full",
    emoji: "\u{1F680}",
    c: "#5B8CFF",
    name: "The Full Build",
    one: "Brand, site and system, wired together.",
    from: "From $1,500",
    amount: 1500,
  },
  {
    key: "storefront",
    emoji: "\u{1F6D2}",
    c: "#F0845F",
    name: "The Storefront Build",
    one: "An online store. Cart, checkout, money in your account.",
    from: "From $2,500",
    amount: 2500,
  },
  {
    key: "engine",
    emoji: "\u{2699}\u{FE0F}",
    c: "#34D399",
    name: "The Engine Build",
    one: "Follow-ups, booking and invoicing that run themselves.",
    from: "From $500",
    amount: 500,
  },
  {
    key: "small",
    emoji: "\u{2702}\u{FE0F}",
    c: "#FBBF24",
    name: "A Small Job",
    one: "A reel, a logo, a design, a page, a form, a fix. From $49.99.",
    from: "From $49.99",
  },
];

const NOT_SURE = "Not sure yet";

/* The opener question. It pops up before the form for anyone who arrives
   cold, requires an answer, and uses it to pick the build. The visitor
   lands on a ticket that is already half filled in, which is the close. */
const OPENERS = [
  {
    said: "People don\u2019t get what we do.",
    build: "The Identity Build",
    c: "#4C7BE8",
    line: "That is a brand problem, not a you problem. The Identity Build fixes the first impression once, and everything after it compounds.",
  },
  {
    said: "Our website is embarrassing. Or missing.",
    build: "The Site Build",
    c: "#5B9BF9",
    line: "People check the link before they trust you. The Site Build is one page that answers the question and asks for the next step.",
  },
  {
    said: "People buy through our DMs.",
    build: "The Storefront Build",
    c: "#F0845F",
    line: "You are the checkout, and that is the bottleneck. The Storefront Build gives your buyers cart, checkout and a receipt while you sleep.",
  },
  {
    said: "I do everything by hand.",
    build: "The Engine Build",
    c: "#34D399",
    line: "The busywork is the growth cap. The Engine Build wires follow-ups, booking and invoicing to run on their own.",
  },
  {
    said: "I want the whole thing.",
    build: "The Full Build",
    c: "#5B8CFF",
    line: "Brand, site and system in one pass, so it launches coherent instead of stitched together.",
  },
  {
    said: "None of these. I just have an idea.",
    build: NOT_SURE,
    c: "#5B8CFF",
    line: "Then you are the easy case. Describe the idea below and we will tell you which build it is and what it costs, before you pay anything.",
  },
];

/** Legacy pricing-page links: /intake?service=Starter|Growth|Scale|Not sure. */
const legacyMap: Record<string, string> = {
  starter: "The Site Build",
  growth: "The Storefront Build",
  scale: NOT_SURE,
  "not sure": NOT_SURE,
};

function IntakeForm() {
  const searchParams = useSearchParams();
  const rawBuild = (searchParams.get("build") || "").trim().toLowerCase();
  const rawService = (searchParams.get("service") || "").trim().toLowerCase();

  const fromBuild = builds.find(
    (b) => b.key === rawBuild || b.name.toLowerCase() === rawBuild
  )?.name;
  const fromLegacy = rawService
    ? legacyMap[
        Object.keys(legacyMap).find((k) => rawService.startsWith(k)) ?? ""
      ]
    : undefined;
  const preselected = fromBuild ?? fromLegacy ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    service: preselected,
    description: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  // A 400 means the form is not filled in right, which is nothing like the
  // send failing. Same red box for both used to tell somebody their details
  // vanished when all they did was write four words in the description.
  const [fixable, setFixable] = useState(false);
  // The opener pops up only for cold arrivals. A preselected build or a
  // cart handoff already answered the question somewhere else.
  const [asked, setAsked] = useState(
    Boolean(preselected) || searchParams.get("cart") === "1"
  );
  const [opener, setOpener] = useState<(typeof OPENERS)[number] | null>(null);
  const [error, setError] = useState("");
  const loading = state === "sending";

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Arriving from the cart: preselect A Small Job and write the items into
  // the description, once, without clobbering anything the visitor typed.
  const cameFromCart = searchParams.get("cart") === "1";
  useEffect(() => {
    if (!cameFromCart) return;
    const items = readCart();
    if (items.length === 0) return;
    const lines = items
      .map((i) => `- ${i.name} — ${i.from ? "from " : ""}${money(i.price)}`)
      .join("\n");
    const approx = items.some((i) => i.from) ? "from " : "";
    const summary = `From my cart:\n${lines}\nTotal: ${approx}${money(cartTotal(items))}`;
    // If a build is in the cart, that build is the ticket. Small jobs alone
    // land under A Small Job.
    const buildInCart = [...items]
      .sort((a, b) => b.price - a.price)
      .map((i) => builds.find((x) => x.key === i.id)?.name)
      .find(Boolean);
    setForm((f) => ({
      ...f,
      service: f.service || buildInCart || "A Small Job",
      description: f.description ? f.description : summary,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameFromCart]);

  // The lead in their own mail app, ready to send. This is what saves the
  // project when our email is down, so it carries every answer they typed.
  const fallbackMailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `New project for FlowZone — ${form.service || "not sure yet"}`
  )}&body=${encodeURIComponent(
    `Hi FlowZone,\n\nName: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.business}\nBuild: ${
      form.service
    }\n\nWhat I want built:\n${form.description}\n\nThanks,\n${form.name}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service) {
      setState("error");
      setFixable(true);
      setError("Pick one of the four builds, or choose not sure yet.");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // The success screen only ever runs when the server says the details
      // really landed. No body, no promise.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        // 400 is the form, anything else is us.
        setFixable(res.status === 400);
        throw new Error(data?.error || "Could not reach the studio.");
      }
      setState("done");
      if (cameFromCart) clearCart();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not reach the studio.");
    }
  };

  if (state === "done") {
    return (
      <div className="min-h-screen bg-paper-deep flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-paper rounded-xl border border-rule p-10 text-center">
          <div className="flex justify-center mb-4">
            <Icon name="sparkle" size={32} color="#5B8CFF" />
          </div>
          <h2 className="text-2xl font-display font-normal text-ink mb-3">Ticket received.</h2>
          <p className="text-ink-mute mb-6 leading-relaxed">
            We will message you about the details and payment.
          </p>
          <p className="text-ink-mute leading-relaxed">
            Thank you for believing in us and yourself.
          </p>
          <p className="text-xs text-ink-mute mt-8">
            Need us sooner?{" "}
            <a href={`mailto:${SITE.email}`} className="text-accent hover:underline">
              {SITE.email}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-deep py-20 px-6">
      <div className="max-w-xl mx-auto">

        {!asked && (
          <div
            className="fixed inset-0 z-50 bg-[#060B1F]/85 backdrop-blur-sm flex items-center justify-center px-6"
            role="dialog"
            aria-modal="true"
            aria-label="One question before the ticket"
          >
            <div className="max-w-md w-full bg-paper rounded-xl border border-rule p-8">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
                One question first
              </p>
              <h2 className="text-2xl font-display font-normal text-ink mb-2">
                Which one have you said out loud?
              </h2>
              <p className="text-sm text-ink-mute leading-relaxed mb-5">
                Pick the one that sounds like you. It picks the right build and
                leaves you four answers from a price.
              </p>
              <div className="space-y-2">
                {OPENERS.map((o) => (
                  <button
                    key={o.said}
                    type="button"
                    onClick={() => {
                      setOpener(o);
                      setAsked(true);
                      set("service", o.build);
                    }}
                    className="w-full text-left rounded-lg border border-rule bg-paper-deep px-4 py-3 text-sm text-ink hover:border-ink-mute transition-colors"
                  >
                    &ldquo;{o.said}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="text-center mb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Get Started</p>
          <h1 className="text-4xl font-display font-normal text-ink mb-3">Start Your Project</h1>
          <p className="text-ink-mute">
            Pick the build, tell us the idea. You get a scope, a price and a date back, usually the same day.
          </p>
        </div>

        {opener && (
          <div className="bg-paper rounded-xl border border-rule p-5 mb-6">
            <p className="text-xs text-ink-mute mb-1.5">
              You said &ldquo;{opener.said}&rdquo;
            </p>
            <p className="text-sm text-ink-soft leading-relaxed">{opener.line}</p>
            <p className="text-xs mt-2.5 font-medium" style={{ color: opener.c }}>
              {opener.build === NOT_SURE
                ? "We will name the build for you. Just describe the idea."
                : `${opener.build} is already picked below. Four answers and you get a price.`}
            </p>
          </div>
        )}

                <form onSubmit={handleSubmit} className="bg-paper rounded-xl border border-rule p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Which build is this for?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Pick a build">
              {builds.map((b) => {
                const on = form.service === b.name;
                return (
                  <button
                    key={b.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("service", b.name)}
                    className={`text-left rounded-lg border px-4 py-3.5 transition-colors bg-paper-deep ${
                      on ? "border-transparent" : "border-rule hover:border-ink-mute"
                    }`}
                    style={on ? { boxShadow: `inset 0 0 0 2px ${b.c}` } : undefined}
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-xl leading-none mt-0.5">{b.emoji}</span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{b.name}</span>
                        <span className="block text-xs text-ink-mute mt-1 leading-relaxed">{b.one}</span>
                        <span className="block text-xs mt-1.5 font-medium" style={{ color: b.c }}>
                          {b.from}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => set("service", NOT_SURE)}
              className={`mt-3 text-xs transition-colors ${
                form.service === NOT_SURE
                  ? "text-ink underline underline-offset-4"
                  : "text-ink-mute hover:text-ink"
              }`}
            >
              Not sure which one? Pick this and just describe the idea. We will tell you which build it is.
            </button>
          </div>

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
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">
              Business Name{" "}
              <span className="font-normal text-ink-mute">or your own, if the brand is you</span>
            </label>
            <input
              type="text"
              required
              value={form.business}
              onChange={(e) => set("business", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              placeholder="Acme Co. or Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-soft mb-1.5">Tell us about the idea</label>
            <textarea
              required
              minLength={10}
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-paper-deep text-ink placeholder-ink-mute border border-rule rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none"
              placeholder="Describe what you want built and any tools you already use..."
            />
            <p className="text-xs text-ink-mute mt-1.5">One sentence is enough. A few words is not.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-medium py-4 rounded-xl hover:bg-accent-deep transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Project →"}
          </button>

          {state === "error" && fixable && (
            <div className="surface border border-rule rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="chat" size={20} color="#5B8CFF" />
                <p className="label">One more thing</p>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{error}</p>
              <p className="text-sm text-ink-mute leading-relaxed mt-2">
                Everything you typed is still here. Fix that one and press submit again.
              </p>
            </div>
          )}

          {state === "error" && !fixable && (
            <div className="surface border border-rule rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="chat" size={20} color="#5B8CFF" />
                <p className="label">Let&apos;s get this to Denny</p>
              </div>
              <p className="text-sm text-ink-mute leading-relaxed mb-4">
                Everything you typed is still here. Press submit again, or open the email below. It
                is already filled in with your answers and it goes straight to Denny.
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
