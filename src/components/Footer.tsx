import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { SITE } from "@/lib/site";
import { LANDING_NAV } from "@/lib/landing";
import FooterVideo from "@/components/FooterVideo";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-paper-deep">
      <div className="fz-footer-edge relative z-10" aria-hidden />
      <FooterVideo />
      <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <Wordmark tone="dark" />
            <p className="font-display text-3xl md:text-4xl leading-[1.08] text-ink mt-7 max-w-sm">
              {SITE.line}
            </p>
            <p className="text-sm text-ink-soft mt-5 max-w-xs leading-relaxed font-light">
              {SITE.descriptor}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-5">Studio</p>
            <ul className="space-y-3">
              <li><Link href="/work" className="text-sm text-ink-soft hover:text-ink transition-colors">Work</Link></li>
              <li><Link href="/services" className="text-sm text-ink-soft hover:text-ink transition-colors">What We Build</Link></li>
              <li><Link href="/how-we-work" className="text-sm text-ink-soft hover:text-ink transition-colors">How We Work</Link></li>
              <li><Link href="/about" className="text-sm text-ink-soft hover:text-ink transition-colors">About</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-5">Start</p>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-sm text-ink-soft hover:text-ink transition-colors">Pricing</Link></li>
              <li><Link href="/intake" className="text-sm text-ink-soft hover:text-ink transition-colors">Start a Ticket</Link></li>
              <li><Link href="/landing-page" className="text-sm text-ink-soft hover:text-ink transition-colors">Landing Page $99.99</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="label mb-5">Get in touch</p>
            <a
              href={`mailto:${SITE.email}`}
              className="font-display text-xl text-ink hover:text-accent transition-colors break-all"
            >
              {SITE.email}
            </a>
            <p className="text-sm text-ink-soft mt-4 leading-relaxed font-light">
              One person reads it. You get a real answer, usually the same day.
            </p>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-ink-soft hover:text-accent transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        {/* Search landing pages. Plain links on every page so crawlers and
            answer engines find them from anywhere on the site. */}
        <nav aria-label="Services" className="border-t border-rule py-6 flex flex-wrap gap-x-6 gap-y-2">
          {Object.entries(LANDING_NAV).map(([slug, name]) => (
            <Link key={slug} href={`/${slug}`} className="text-xs text-ink-mute hover:text-ink transition-colors">
              {name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-rule pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-mute">© 2026 FlowZone. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-ink-mute hover:text-ink transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-ink-mute hover:text-ink transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
