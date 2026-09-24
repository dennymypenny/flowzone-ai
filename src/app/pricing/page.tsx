import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import PlanPicker from "./PlanPicker";
import { PLANS } from "@/lib/plans";

/**
 * Pricing, rebuilt Sep 23 2026 to be short on a phone: a two-line header and
 * one panel. Tap a plan, see what it includes, press one button. The old page
 * was three stacked cards, a row of + Add buttons and two more sections of
 * copy; everything that mattered from it lives in the panel now.
 */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flat prices for brand, site and the system that runs it. One payment, no retainer required, and a date agreed before you pay.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | FlowZone",
    description:
      "Flat prices for brand, site and the system that runs it. One payment, no retainer required, and a date agreed before you pay.",
    url: `${SITE.url}/pricing`,
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
  },
};

export default function Pricing() {
  return (
    <section className="px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <p className="label mb-3">Pricing</p>
          <h1 className="display text-4xl sm:text-6xl leading-[1.02]">Flat prices. Pick one.</h1>
          <p className="text-ink-soft mt-3 leading-relaxed">
            Paid once, agreed before we start. If a cheaper plan fits, we tell you.
          </p>
        </div>
        <PlanPicker plans={PLANS} start="full" />
      </div>
    </section>
  );
}
