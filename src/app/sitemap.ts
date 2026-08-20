import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Every indexable route, most important first.
 *
 * lastModified is hardcoded on purpose. It used to be new Date(), which told
 * every crawler that all twelve pages changed on every deploy. That is a lie,
 * and once a crawler catches you lying it stops trusting the field. There is
 * no git access at build time, so the honest move is to type the date by hand.
 * Change a page, change its date here in the same commit.
 *
 * /ai-news and /thank-you are missing on purpose. They are noindex. /scan
 * rejoined the map 2026-08-18 when it became the live site scanner.
 */
type Route = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: string;
};

const ROUTES: Route[] = [
  { path: "", priority: 1.0, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/start", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-20" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/book", priority: 0.85, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/how-we-work", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/scan", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-18" },
  { path: "/try", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-20" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-17" },
  { path: "/intake", priority: 0.4, changeFrequency: "yearly", lastModified: "2026-08-17" },
  // Legal pages carry their own effective dates in the copy. Keep these two
  // matched to what the page actually says.
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-03-22" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2025-03-01" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
