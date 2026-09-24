import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { QUICK_JOBS, CARE, money } from "@/lib/catalog";
import PlanPicker, { type Plan } from "./PlanPicker";

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

const PAGE = QUICK_JOBS.find((j) => j.id === "page")!;

const PLANS: Plan[] = [
  {
    key: "full",
    name: "The Full Build",
    price: "$1,500",
    one: "Brand, site and system, wired together.",
    badge: "Best value",
    includes: [
      "Identity, site and one working system",
      "Copy written for you, end to end",
      "Payments, forms and email wired in",
      "Two rounds of revisions, 60 days of support",
    ],
    href: "/intake?build=full",
    cta: "Start the Full Build",
  },
  {
    key: "one",
    name: "One Build",
    price: "$500",
    one: "Pick one: Identity, Site or Engine.",
    includes: [
      "One build, finished and handed over",
      "Designed for you, never a template",
      "A full round of revisions",
      "30 days of support after launch",
    ],
    href: "/intake",
    cta: "Start one build",
  },
  {
    key: "store",
    name: "The Storefront",
    price: "$2,500",
    unit: "from",
    one: "A real shop, cart to checkout.",
    includes: [
      "Everything in The Full Build",
      "Full storefront with cart and checkout",
      "Your existing tools connected",
      "A flat number agreed before you pay",
    ],
    href: "/intake?build=storefront",
    cta: "Get my flat quote",
  },
  {
    key: "small",
    name: "A small job",
    price: "$49.99",
    unit: "from",
    one: "A graphic, a page, a fix. Already have a brand?",
    includes: [
      "Any single graphic, $49.99",
      "Speed and mobile fix pass, $49.99",
      `Landing page, ${money(PAGE.price)}`,
      `Website care, ${money(CARE.monthly)} a month, optional`,
    ],
    href: "/intake?build=small",
    cta: "Start a small job",
  },
];

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
