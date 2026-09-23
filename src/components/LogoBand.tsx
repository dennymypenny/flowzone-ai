import Link from "next/link";
import Image from "next/image";

/*
 * The moving band of client logos. White marks cut from each client's own
 * logo, on navy. Used on /about, the homepage work section and /work.
 * Honesty rule: only brands with real work on /work. CardsRG is the
 * studio's own store and the caption says so.
 */
const LOGOS = [
  { src: "/assets/logos/logo-shutters-depot.png", alt: "Shutters Depot", w: 704, h: 120, show: 30 },
  { src: "/assets/logos/logo-abc-capital.png", alt: "ABC Capital Group", w: 265, h: 120, show: 40 },
  { src: "/assets/logos/logo-slipfolio.png", alt: "SlipFolio", w: 401, h: 120, show: 34 },
  { src: "/assets/logos/logo-nextplayu.png", alt: "NextPlayU", w: 1055, h: 120, show: 26 },
  { src: "/assets/logos/logo-mahj-coffee.png", alt: "Mahj & Coffee", w: 131, h: 120, show: 58 },
  { src: "/assets/logos/logo-cardsrg.png", alt: "CardsRG", w: 118, h: 120, show: 58 },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="fz-logorow" aria-hidden={hidden ? "true" : undefined}>
      {LOGOS.map((l) => (
        <Image
          key={l.alt}
          src={l.src}
          alt={hidden ? "" : l.alt}
          width={l.w}
          height={l.h}
          className="fz-logo mx-7 md:mx-11"
          style={{ height: l.show, width: "auto" }}
        />
      ))}
    </div>
  );
}

export default function LogoBand({ workLink = true }: { workLink?: boolean }) {
  return (
    <section aria-label="Brands FlowZone has built for" className="border-y border-rule bg-paper-deep py-10">
      <p className="label text-center mb-8 px-6">Brands we have built for</p>
      <div className="fz-logoband overflow-hidden">
        <div className="fz-logotrack">
          <Row />
          <Row hidden />
        </div>
      </div>
      <p className="text-center text-xs text-ink-mute mt-8 px-6">
        Client work, plus CardsRG, the studio&apos;s own store.
        {workLink && (
          <>
            {" "}
            <Link href="/work" className="underline underline-offset-4 hover:text-ink">
              See every piece
            </Link>
          </>
        )}
      </p>
    </section>
  );
}
