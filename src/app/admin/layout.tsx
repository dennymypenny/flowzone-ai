import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — FlowZone AI",
  description: "FlowZone AI admin dashboard",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
