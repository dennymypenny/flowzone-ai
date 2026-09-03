/** @type {import('next').NextConfig} */

/**
 * What the browser is allowed to load on every page, and from where.
 *
 * Scripts: our own bundles, the inline bootstrap Next writes into the page
 * (which is why 'unsafe-inline' has to stay until nonces are wired through
 * middleware), and Vercel's analytics loader. Styles and fonts: ours plus
 * Google Fonts. Images and media: ours, data and blob URLs the canvas tools
 * make, and any https image because the moodboard shows openly licensed
 * photos. Nothing may frame this site, nothing may load plugins, and forms
 * only ever submit back here. vercel.live keeps the preview toolbar working
 * on preview deployments and is inert in production.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live",
  "worker-src 'self' blob:",
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Two years, subdomains too, and eligible for the browser preload list.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Belt to the frame-ancestors braces, for browsers that only read this one.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never asks for any of these, so no page on it may either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig = {
  // No reason to announce the framework in every response.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      // The old case-studies pages were illustrative, not real client work.
      // Removed 2026-07-28; send the indexed URLs to the process page instead of 404ing.
      { source: "/case-studies", destination: "/how-we-work", permanent: true },
      { source: "/case-studies/:slug", destination: "/how-we-work", permanent: true },
      // The playground era ended 2026-08-20. Scan, Try It and Flow Mode are
      // retired; their URLs land on the homepage.
      { source: "/scan", destination: "/", permanent: true },
      { source: "/try", destination: "/", permanent: true },
      { source: "/start", destination: "/", permanent: true },
      // The admin page was a mock full of invented leads. Real leads arrive by
      // email, so the route is gone rather than sitting on a live domain whose
      // whole position is that we do not invent things.
      { source: "/admin", destination: "/", permanent: true },
      // The five blog posts were all automation-era and argued against the
      // studio's own positioning on every other page. Removed, with the URLs
      // pointed at what we actually do now.
      { source: "/blog", destination: "/services", permanent: true },
      { source: "/blog/:slug", destination: "/services", permanent: true },
    ];
  },
};
module.exports = nextConfig;
