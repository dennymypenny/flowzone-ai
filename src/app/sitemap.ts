import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Every public route, most important first.
const ROUTES: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
  ["", 1.0, "weekly"],
  ["/start", 0.9, "monthly"],
  ["/work", 0.9, "monthly"],
  ["/services", 0.9, "monthly"],
  ["/pricing", 0.9, "monthly"],
  ["/book", 0.85, "monthly"],
  ["/how-we-work", 0.8, "monthly"],
  ["/about", 0.7, "monthly"],
  ["/ai-news", 0.4, "weekly"],
  ["/intake", 0.4, "yearly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
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
  ];
}
