"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  readCart,
  removeFromCart,
  clearCart,
  cartTotal,
  money,
  type CartItem,
} from "@/app/components/cart";

/** The nav cart: a count badge, and a slide-over with the items. */
export default function CartWidget() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("fz-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fz-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (items.length === 0 && !open) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative p-2 text-ink hover:text-accent transition-colors"
        aria-label={`Cart, ${items.length} item${items.length === 1 ? "" : "s"}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.4 12.2a2 2 0 002 1.6h7.9a2 2 0 002-1.6L21 7H6" />
          <circle cx="9.5" cy="20" r="1.4" />
          <circle cx="17.5" cy="20" r="1.4" />
        </svg>
        {items.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold inline-flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Portaled to body: the nav's backdrop-filter creates a containing
          block, which would clip a fixed overlay to the bar's height. */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-paper border-l border-rule p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display text-2xl">Your small jobs</p>
              <button
                type="button"
                className="p-2 text-ink-soft hover:text-ink"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-ink-soft font-light">
                Nothing in here yet. Add a small job from any page.
              </p>
            ) : (
              <>
                <ul className="space-y-4 mb-6">
                  {items.map((i, idx) => (
                    <li key={`${i.id}-${idx}`} className="flex items-start justify-between gap-3 border-b border-rule pb-4">
                      <div>
                        <p className="text-sm text-ink font-light leading-snug">{i.name}</p>
                        <p className="text-sm text-ink-soft mt-1">{money(i.price)}</p>
                      </div>
                      <button
                        type="button"
                        className="text-ink-mute hover:text-ink text-sm p-1"
                        onClick={() => removeFromCart(idx)}
                        aria-label={`Remove ${i.name}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline justify-between mb-6">
                  <p className="label">Total</p>
                  <p className="font-display text-3xl">{money(cartTotal(items))}</p>
                </div>
                <Link
                  href="/intake?cart=1"
                  className="btn-primary w-full justify-center text-center"
                  onClick={() => setOpen(false)}
                >
                  Send as a ticket <span className="arrow">→</span>
                </Link>
                <p className="text-xs text-ink-mute font-light leading-relaxed mt-4">
                  No payment now. The ticket lands with a person, you get a reply
                  and a start date, then you pay.
                </p>
                <button
                  type="button"
                  className="text-xs text-ink-mute hover:text-ink mt-4 self-start"
                  onClick={() => clearCart()}
                >
                  Clear the cart
                </button>
              </>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
