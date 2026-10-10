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

/**
 * The shareable product pages at /buy/<id> (Oct 9 2026): what each fixed-price
 * service is, what is in it, and how long it takes. Also sent to Stripe as the
 * product description so checkout reads the same. No em dashes, no Oxford commas.
 */
export type Detail = {
  group: "Graphics" | "Web" | "Video" | "Plans";
  blurb: string;
  includes: string[];
  time: string;
};

const GRAPHIC_INCLUDES = ["Designed by a person, in your colors and fonts", "Two rounds of changes", "Print and web ready files"];

export const DETAILS: Record<string, Detail> = {
  flyer: { group: "Graphics", blurb: "One flyer, post or cover that stops people mid scroll.", includes: ["Sized for print, Instagram, Facebook or a cover photo", ...GRAPHIC_INCLUDES], time: "2 to 3 days" },
  logo: { group: "Graphics", blurb: "Your existing logo, cleaned up and exported for every place it goes.", includes: ["Horizontal, stacked and icon versions", "Light, dark and one color versions", "SVG, PNG and PDF files", "Two rounds of changes"], time: "2 to 3 days" },
  socialpack: { group: "Graphics", blurb: "Three matching social posts so your feed looks like a brand.", includes: ["Three posts in one consistent style", "Sized for Instagram, Facebook or LinkedIn", ...GRAPHIC_INCLUDES.slice(1)], time: "3 days" },
  adcreative: { group: "Graphics", blurb: "A story or feed ad built to get the tap.", includes: ["One ad creative, story or feed size", "Headline and call to action written with you", ...GRAPHIC_INCLUDES.slice(1)], time: "2 to 3 days" },
  channelart: { group: "Graphics", blurb: "Banner and profile picture that match, for any channel.", includes: ["Banner sized for YouTube, X, LinkedIn or Twitch", "Matching avatar", ...GRAPHIC_INCLUDES.slice(1)], time: "2 to 3 days" },
  thumbnails: { group: "Graphics", blurb: "A thumbnail set that gets the click.", includes: ["Three thumbnails in one style", "A reusable template you can edit later", ...GRAPHIC_INCLUDES.slice(1)], time: "3 days" },
  onepager: { group: "Graphics", blurb: "One page that explains what you sell and why it is worth it.", includes: ["One-pager or sell sheet layout", "Your copy tightened up for you", ...GRAPHIC_INCLUDES.slice(1)], time: "3 to 4 days" },
  deck: { group: "Graphics", blurb: "Your slides, redesigned so the room actually listens.", includes: ["Up to 12 slides designed", "A master template for future slides", "Google Slides, Keynote or PowerPoint file", "Two rounds of changes"], time: "4 to 5 days" },
  emailheader: { group: "Graphics", blurb: "An email header or newsletter template people recognize in the inbox.", includes: ["Header graphic plus a reusable layout", "Works in Gmail, Outlook and phones", ...GRAPHIC_INCLUDES.slice(1)], time: "2 to 3 days" },
  form: { group: "Web", blurb: "A booking or contact form that lands straight in your email.", includes: ["Form built on your site or a hosted page", "Sends to your inbox with every answer", "Spam protection", "Tested on phone and desktop"], time: "2 days" },
  fix: { group: "Web", blurb: "Your site, faster and fixed on phones.", includes: ["Speed check before and after", "Mobile layout fixes", "Broken links and images fixed", "A short report of what changed"], time: "2 to 3 days" },
  reel: { group: "Video", blurb: "A short promo reel cut for feeds where nobody has sound on.", includes: ["Up to 30 seconds, vertical or square", "Captions and motion text", "Music licensed for social", "Two rounds of changes"], time: "3 to 4 days" },
  page: { group: "Web", blurb: "One new page or landing page, designed and live on your domain.", includes: ["Custom designed page, not a template", "Copy written with you", "Fast on phones, form wired in", "Two rounds of changes"], time: "5 to 7 days" },
  videoad: { group: "Video", blurb: "A video ad made to sell, ready for Instagram, TikTok or Facebook.", includes: ["15 to 30 second vertical ad", "Hook, captions and call to action", "Two rounds of changes"], time: "3 to 4 days" },
  logoanim: { group: "Video", blurb: "Your logo, brought to life for intros, reels and your site.", includes: ["3 to 5 second animation", "MP4 plus a transparent version", "Sized for social and video intros"], time: "3 to 5 days" },
  adpack: { group: "Plans", blurb: "A ready set of ads: three static ads and one video ad that match.", includes: ["Three static ads in one style", "One video ad", "Sized for the platforms you run ads on", "Two rounds of changes"], time: "5 to 7 days" },
  graphicsplan: { group: "Plans", blurb: "Eight fresh graphics every month, so your feed never goes quiet.", includes: ["8 graphics a month, posts, stories or flyers", "Planned with you at the start of each month", "Cancel anytime"], time: "Starts within 3 days" },
  care: { group: "Plans", blurb: "Your website kept fast, safe and up to date, month to month.", includes: ["Updates and small edits each month", "Uptime and speed checks", "Fixes when something breaks", "Cancel anytime"], time: "Starts right away" },
};

/** The order the /buy list shows them in. "graphic" is a checkout alias, not a page. */
export const SHOP: string[] = [
  "flyer", "socialpack", "adcreative", "logo", "channelart", "thumbnails", "onepager", "deck", "emailheader",
  "reel", "videoad", "logoanim",
  "page", "form", "fix",
  "adpack", "graphicsplan", "care",
];

/** Short public name for a page (the catalog names are written for the cart). */
export const SHOP_NAME: Record<string, string> = {
  flyer: "Flyer, post or cover",
  socialpack: "Social post pack",
  adcreative: "Story or feed ad",
  logo: "Logo file pack",
  channelart: "Channel art",
  thumbnails: "Thumbnail set",
  onepager: "One-pager or sell sheet",
  deck: "Presentation deck",
  emailheader: "Email header or newsletter",
  reel: "Promo reel",
  videoad: "Video ad",
  logoanim: "Logo animation",
  page: "Landing page",
  form: "Booking or contact form",
  fix: "Speed and mobile fix",
  adpack: "Ad package",
  graphicsplan: "Monthly graphics",
  care: "Website care",
};
