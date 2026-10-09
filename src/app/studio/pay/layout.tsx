import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay links",
  robots: { index: false, follow: false },
};

export default function StudioPayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
