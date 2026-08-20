/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old case-studies pages were illustrative, not real client work.
      // Removed 2026-07-28; send the indexed URLs to the process page instead of 404ing.
      { source: "/case-studies", destination: "/how-we-work", permanent: true },
      { source: "/case-studies/:slug", destination: "/how-we-work", permanent: true },
      // The scan moved onto the Try It page 2026-08-20. One playground, one page.
      { source: "/scan", destination: "/try#scan", permanent: true },
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
