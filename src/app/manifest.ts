import type { MetadataRoute } from "next";

// Home-screen identity. The artwork is the same three-dot mark used as the
// @flowzonedev avatar on X, so the saved app, the tab and the profile match.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlowZone",
    short_name: "FlowZone",
    description: "Brand, site and the system that runs it.",
    start_url: "/",
    display: "standalone",
    background_color: "#080D18",
    theme_color: "#080D18",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
