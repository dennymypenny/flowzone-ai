"use client";

/**
 * One tiny client-side cart, shared by every page through localStorage plus a
 * window event. No server, no accounts: checkout files a ticket with the
 * items in it, and payment happens after a human replies.
 */

export type { CartItem } from "@/lib/catalog";
export {
  GRAPHICS,
  QUICK_JOBS,
  SMALL_JOBS,
  BUILDS,
  CATALOG,
  money,
} from "@/lib/catalog";

import type { CartItem } from "@/lib/catalog";

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
