"use client";
import { useState } from "react";
import { addToCart } from "@/app/components/cart";
import { money, CATALOG } from "@/lib/catalog";

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
  const item = CATALOG.find((i) => i.id === id);
  const [added, setAdded] = useState(false);
  if (!item) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        // Usable inside a Link without navigating.
        e.preventDefault();
        e.stopPropagation();
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
      {added ? "Added ✓" : showPrice ? `${item.from ? "+ Add · from " : "+ Add · "}${money(item.price)}` : "+ Add"}
    </button>
  );
}
