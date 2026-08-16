import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Static routes, most important first. Blog slugs are appended below.
const ROUTES: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
  ["", 1.0, "weekly"],
  ["/start", 0.9, "monthly"],
  ["/work", 0.9, "monthly"],
  ["/services", 0.9, "monthly"],
  ["/pricing", 0.9, "monthly"],
  ["/how-we-work", 0.8, "monthly"],
  ["/about", 0.7, "monthly"],
  ["/blog", 0.6, "weekly"],
  ["/ai-news", 0.4, "weekly"],
  ["/intake", 0.4, "yearly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
];

const BLOG_SLUGS = [
  "how-to-automate-lead-intake",
  "5-workflows-every-service-business-should-automate",
  "make-vs-zapier-for-business-automation",
  "ai-automation-roi-calculator",
  "airtable-automation-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ROUTES.map(([path, priority, changeFrequency]) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...BLOG_SLUGS.map((slug) => ({
      url: `${SITE.url}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
