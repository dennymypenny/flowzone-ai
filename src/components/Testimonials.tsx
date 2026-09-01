import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * Renders real client words from lib/testimonials.ts, and renders NOTHING
 * while that list is empty. Empty array = section absent. No skeleton.
 */

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section data-flow className="band-light px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-medium uppercase tracking-label text-[#3D6FE8] mb-10">
          In their words
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure
              key={`${t.name}-${t.business}`}
              className="rounded-2xl border border-[#DCE5F2] bg-white p-7 md:p-8"
            >
              <blockquote className="font-display text-2xl leading-snug text-[#0B1322]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-[#49566E] font-light">
                {t.name} ·{" "}
                {t.url ? (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2B57C4] hover:underline"
                  >
                    {t.business}
                  </a>
                ) : (
                  t.business
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
