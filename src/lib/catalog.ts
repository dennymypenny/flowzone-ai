/**
 * The price list, in a plain module on purpose.
 *
 * This used to live in components/cart.ts, which is "use client". A Server
 * Component that imports data from a client module gets a client reference
 * proxy back, not the array, and the build dies with "Attempted to call map()
 * from the server". Server pages import from here; cart.ts re-exports it so
 * every existing client import keeps working.
 */

export type CartItem = {
  id: string;
  name: string;
  price: number;
  /** True when the price is a starting point that gets quoted flat. */
  from?: boolean;
};

/**
 * Simple graphics, all one price. The rule we tell people is that if it is a
 * single graphic we can make it, so this list is examples rather than limits.
 */
export const GRAPHICS: CartItem[] = [
  { id: "flyer", name: "Flyer, post or cover", price: 4999 },
  { id: "logo", name: "Logo-only refresh", price: 4999 },
  { id: "socialpack", name: "Social post pack, three graphics", price: 4999 },
  { id: "adcreative", name: "Story or ad creative", price: 4999 },
  { id: "channelart", name: "Channel art, banner and avatar", price: 4999 },
  { id: "thumbnails", name: "Video thumbnail set", price: 4999 },
  { id: "onepager", name: "One-pager or sell sheet", price: 4999 },
  { id: "deck", name: "Presentation deck", price: 4999 },
  { id: "emailheader", name: "Email header or newsletter template", price: 4999 },
];

/** The jobs that are not graphics: things that get built or fixed. */
export const QUICK_JOBS: CartItem[] = [
  { id: "form", name: "Booking or contact form, wired to your email", price: 4999 },
  { id: "fix", name: "Speed and mobile fix pass", price: 4999 },
  { id: "reel", name: "Promo reel, cut for sound-off feeds", price: 7499 },
  { id: "page", name: "One new page or landing page", price: 9999 },
];

/** The one price list. Every surface renders from this. Cents, not floats. */
export const SMALL_JOBS: CartItem[] = [...GRAPHICS, ...QUICK_JOBS];

/** The four builds plus the bundle, addable like anything else. */
export const BUILDS: CartItem[] = [
  { id: "identity", name: "The Identity Build", price: 50000, from: true },
  { id: "site", name: "The Site Build", price: 50000, from: true },
  { id: "engine", name: "The Engine Build", price: 50000, from: true },
  { id: "full", name: "The Full Build", price: 150000 },
  { id: "storefront", name: "The Storefront Build", price: 250000, from: true },
];

export const CATALOG: CartItem[] = [...SMALL_JOBS, ...BUILDS];

export const money = (cents: number) =>
  Number.isInteger(cents / 100)
    ? `$${(cents / 100).toLocaleString("en-US")}`
    : `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
