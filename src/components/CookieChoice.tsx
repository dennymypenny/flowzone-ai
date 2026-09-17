"use client";

/** Reopens the cookie notice so a visitor can change their answer. */
export default function CookieChoice() {
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = "fz_consent=; Max-Age=0; Path=/";
        window.dispatchEvent(new Event("fz:cookies"));
      }}
      className="mt-4 rounded-full border border-white/[0.14] hover:border-white/30 text-ink text-[14px] font-semibold px-5 py-2.5 transition-colors"
    >
      Change my cookie choice
    </button>
  );
}
