import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /thank-you, /scan and /ai-news are deliberately not listed here.
        // Disallow blocks crawling, not indexing, and a page Google cannot
        // crawl is a page whose noindex Google never reads. Those three now
        // send noindex from their own metadata, so they have to stay
        // crawlable for that tag to do its job.
        // What is left is what should never be fetched at all.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
