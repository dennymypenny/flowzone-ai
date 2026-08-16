import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-paper-deep border-t border-rule">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <Wordmark />
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
              <li><Link href="/intake" className="text-sm text-ink-soft hover:text-ink transition-colors">Start a project</Link></li>
              <li><Link href="/blog" className="text-sm text-ink-soft hover:text-ink transition-colors">Writing</Link></li>
              <li><Link href="/ai-news" className="text-sm text-ink-soft hover:text-ink transition-colors">AI News</Link></li>
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
          </div>
        </div>

        <div className="border-t border-rule pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-mute">© 2026 FlowZone AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-ink-mute hover:text-ink transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-ink-mute hover:text-ink transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
