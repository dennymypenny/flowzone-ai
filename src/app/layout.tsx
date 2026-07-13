import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "FlowZone AI | Creative and Business Studio",
    template: "%s | FlowZone AI",
  },
  description:
    "FlowZone AI is a creative and business studio. We turn ideas into brands, sites and systems that make money. Free audit and custom build plan delivered in 24 hours.",
  metadataBase: new URL("https://flowzone.dev"),
  openGraph: {
    siteName: "FlowZone AI",
    type: "website",
    title: "FlowZone AI — Creative and Business Studio",
    description:
      "We turn ideas into brands, sites and systems that make money. Designed, built and delivered in days, not months.",
  },
    twitter: {
        card: "summary_large_image",
            title: "FlowZone AI — Creative and Business Studio",
                description: "We turn ideas into brands, sites and systems that make money. Designed, built and delivered in days, not months.",
                  },
  keywords: [
    "creative studio",
    "business studio",
    "business systems",
    "done-for-you systems",
    "website design and build",
    "brand launch",
    "ecommerce storefront",
    "AI systems",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
