import type { Metadata } from "next";

/**
 * The intake page is a client component, and a client component cannot export
 * metadata. Without this file it would inherit whatever the root layout says
 * and canonicalise to the homepage, which is the exact bug we just fixed
 * everywhere else. A layout is the cheapest way to give it its own head.
 */
export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell us what you are building and which part you want first. You see the number before anything starts.",
  alternates: { canonical: "/intake" },
  openGraph: {
    siteName: "FlowZone",
    type: "website",
    locale: "en_US",
    title: "Start a project with FlowZone",
    description:
      "Tell us what you are building and which part you want first. You see the number before anything starts.",
    url: "https://flowzone.dev/intake",
  },
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
