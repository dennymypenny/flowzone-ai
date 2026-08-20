"use client";
import { useState } from "react";
import { addToCart, money, SMALL_JOBS } from "@/app/components/cart";

/** A small "+ Add" control for one small job, by id from SMALL_JOBS. */
export default function AddToCart({
  id,
  showPrice = true,
  className = "",
}: {
  id: string;
  showPrice?: boolean;
  className?: string;
}) {
  const item = SMALL_JOBS.find((i) => i.id === id);
  const [added, setAdded] = useState(false);
  if (!item) return null;

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(item);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border transition-colors ${
        added
          ? "text-white bg-[#0F6B4F] border-[#0F6B4F]"
          : "text-accent border-current/30 hover:border-current"
      } ${className}`}
      aria-label={`Add ${item.name} to cart, ${money(item.price)}`}
    >
      {added ? "Added ✓" : showPrice ? `+ Add · ${money(item.price)}` : "+ Add"}
    </button>
  );
}
