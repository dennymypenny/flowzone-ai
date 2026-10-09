import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
  alternates: { canonical: "/paid" },
};

export default function PaidLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
