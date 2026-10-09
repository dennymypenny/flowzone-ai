import Image from "next/image";
import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * Real client replies from lib/testimonials.ts, shown the way they arrived:
 * as a text thread, beside the work they were replying to. Renders NOTHING
 * while that list is empty. Empty array = section absent. No skeleton.
 */

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section data-flow className="relative px-6 py-20 md:py-28 overflow-hidden">
      <div className="glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative max-w-6xl mx-auto">
        <p className="label mb-4">In their words</p>
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={`${t.name}-${t.business}`}
            className={`grid md:grid-cols-12 gap-10 md:gap-12 items-center ${i > 0 ? "mt-20" : ""}`}
          >
            <div className="md:col-span-5">
              {i === 0 && (
                <h2 className="display text-4xl md:text-5xl text-ink mb-10">
                  Sent the first look.
                  <br />
                  <span className="text-[#5B9BF9]">Got this back.</span>
                </h2>
              )}
              <figcaption className="flex items-center gap-3 mb-4">
                <span
                  aria-hidden
                  className="grid place-items-center w-11 h-11 rounded-full border border-rule bg-raised text-sm font-semibold text-ink"
                >
                  {t.initials}
                </span>
                <span className="text-ink font-semibold">{t.name}</span>
                <span className="text-ink-mute font-light">
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                      {t.business}
                    </a>
                  ) : (
                    t.business
                  )}
                </span>
                {t.time && <span className="ml-auto text-xs text-ink-mute tracking-wide">{t.time}</span>}
              </figcaption>
              <blockquote className="flex flex-col items-start gap-3">
                {t.messages.map((m, j) => (
                  <p
                    key={j}
                    className={`text-xl md:text-2xl leading-snug px-5 py-3 rounded-[22px] border ${
                      j === t.messages.length - 1 ? "rounded-bl-md" : ""
                    } ${j % 2 === 1 ? "ml-6 md:ml-10" : j > 0 ? "ml-3 md:ml-4" : ""} ${
                      j === t.hot
                        ? "bg-[#5B8CFF] border-[#7FA5FF] text-white shadow-[0_14px_40px_rgba(91,140,255,0.35)]"
                        : "bg-[#1C2A48] border-[#2A3B63] text-ink"
                    }`}
                  >
                    {m}
                  </p>
                ))}
              </blockquote>
            </div>
            {t.image && (
              <div className="md:col-span-7">
                <div className="relative rounded-[20px] overflow-hidden border border-[#2F4170] shadow-[0_30px_70px_rgba(0,0,0,0.5)] bg-[#E9ECF1]">
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-[#4C7BE8] z-10" aria-hidden />
                  <Image
                    src={t.image.src}
                    alt={t.image.alt}
                    width={t.image.width}
                    height={t.image.height}
                    sizes="(min-width: 768px) 640px, 100vw"
                    className="block w-full h-auto"
                  />
                </div>
                <p className="mt-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-label text-ink-mute">
                  <span className="rounded-[11px] border border-rule bg-raised px-3 py-1.5 text-[#C6E4F8]">Client work</span>
                  What we sent {t.name}
                </p>
              </div>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
