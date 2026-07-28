/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old case-studies pages were illustrative, not real client work.
      // Removed 2026-07-28; send the indexed URLs to the process page instead of 404ing.
      { source: "/case-studies", destination: "/how-we-work", permanent: true },
      { source: "/case-studies/:slug", destination: "/how-we-work", permanent: true },
    ];
  },
};
module.exports = nextConfig;
