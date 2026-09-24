import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/* AI answer engines are welcomed by name. ChatGPT, Claude, Perplexity,
   Gemini and Copilot all decide whether to cite a site partly on whether
   their crawler is allowed in, and "*" is not always read as a yes by
   their policies. Listing them costs nothing. */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /thank-you and /ai-news send noindex from their own metadata, so
        // they have to stay crawlable for that tag to be read.
        // What is left is what should never be fetched at all.
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: AI_BOTS,
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
