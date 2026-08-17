import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You are in",
  description: "We received your request and will send your free systems plan within 24 hours.",
};

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-paper-deep rounded-full flex items-center justify-center mb-8">
        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-display font-normal text-ink mb-4">
        You&apos;re In.
      </h1>
      <p className="text-xl text-ink-mute max-w-md mb-10">
        We received your request. Your free custom systems plan will land in your inbox within <span className="text-accent font-semibold">24 hours</span>.
      </p>

      {/* What happens next */}
      <div className="bg-paper-deep rounded-xl p-8 max-w-md w-full text-left mb-10">
        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">What happens next</p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
            <p className="text-ink-soft text-sm">We review your submission and map out your system opportunities.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
            <p className="text-ink-soft text-sm">You receive a free custom plan showing exactly what we&apos;d build and the ROI.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
            <p className="text-ink-soft text-sm">If it looks good, we get to work. First system live in 48 hours.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="text-sm text-ink-mute hover:text-accent transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  );
}
