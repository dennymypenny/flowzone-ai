import { QUICK_JOBS, CARE, money } from "@/lib/catalog";
import type { Plan } from "@/app/pricing/PlanPicker";

/** The pricing plans, shared by /pricing and the homepage's phone view. */
const PAGE = QUICK_JOBS.find((j) => j.id === "page")!;

export const PLANS: Plan[] = [
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

