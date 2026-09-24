import LandingPage, { landingMetadata } from "@/components/Landing";
import { getLanding } from "@/lib/landing";

const l = getLanding("graphic-design");
export const metadata = landingMetadata(l);

export default function Page() {
  return <LandingPage l={l} />;
}
