/**
 * What can be paid for on the site with a card, straight away. Oct 9 2026.
 *
 * Only fixed prices. A build is quoted after a conversation, so builds get a
 * payment link from /studio/pay instead of a button. The browser only ever
 * sends ids; the price charged is always the one in this file, read on the
 * server, so nobody can edit a price in devtools and pay $1.
 */

import { SMALL_JOBS, MOTION, PACKAGES, CARE, money } from "@/lib/catalog";

export type Payable = { id: string; name: string; cents: number; monthly?: boolean };

export const PAYABLES: Payable[] = [
  ...SMALL_JOBS.map((j) => ({ id: j.id, name: j.name, cents: j.price })),
  { id: "graphic", name: "One graphic", cents: SMALL_JOBS[0].price },
  { id: "videoad", name: "Video ad", cents: MOTION.videoAd },
  { id: "logoanim", name: "Logo animation", cents: MOTION.logoAnimation },
  { id: "adpack", name: `${PACKAGES.ads.name}: ${PACKAGES.ads.what}`, cents: PACKAGES.ads.price },
  { id: "graphicsplan", name: `${PACKAGES.graphics.name}: ${PACKAGES.graphics.what}`, cents: PACKAGES.graphics.monthly, monthly: true },
  { id: "care", name: `${CARE.name}, month to month`, cents: CARE.monthly, monthly: true },
];

export const payable = (id: string) => PAYABLES.find((p) => p.id === id);

/** /intake pick labels that can be paid for on the spot, mapped to an id above. */
export const PICK_TO_PAYABLE: Record<string, string> = {
  "Social graphics": "socialpack",
  "Flyers and print": "flyer",
  "Ad for social": "adcreative",
  "Story ad": "adcreative",
  "Video ad": "videoad",
  "Promo reel": "reel",
  "Logo animation": "logoanim",
  "Landing page": "page",
  "Fix or speed up": "fix",
  "Website care (monthly)": "care",
  "Forms that send": "form",
  [`Ad package: ${PACKAGES.ads.what}`]: "adpack",
  [`Monthly graphics: ${PACKAGES.graphics.what}`]: "graphicsplan",
};

export const payLabel = (p: Payable) => `${money(p.cents)}${p.monthly ? "/mo" : ""}`;
