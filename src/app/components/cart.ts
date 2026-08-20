"use client";

/**
 * One tiny client-side cart, shared by every page through localStorage plus a
 * window event. No server, no accounts: checkout files a ticket with the
 * items in it, and payment happens after a human replies.
 */

export type CartItem = { id: string; name: string; price: number };

/** The one price list. Every surface renders from this. Cents, not floats. */
export const SMALL_JOBS: CartItem[] = [
  { id: "flyer", name: "One-off design — flyer, post or cover", price: 4999 },
  { id: "form", name: "Booking or contact form, wired to your email", price: 4999 },
  { id: "logo", name: "Logo-only refresh", price: 4999 },
  { id: "fix", name: "Speed and mobile fix pass", price: 4999 },
  { id: "reel", name: "Promo reel, cut for sound-off feeds", price: 7499 },
  { id: "page", name: "One new page or landing page", price: 9999 },
];

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const KEY = "fz-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode: the cart just lives for the page view */
  }
  window.dispatchEvent(new CustomEvent("fz-cart"));
}

export function addToCart(item: CartItem) {
  write([...readCart(), item]);
}

export function removeFromCart(index: number) {
  const items = readCart();
  items.splice(index, 1);
  write(items);
}

export function clearCart() {
  write([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price, 0);
}
