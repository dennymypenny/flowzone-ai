import { SITE } from "@/lib/site";

/**
 * The primary way in.
 *
 * This used to open a text message, which meant every enquiry landed on one
 * person's phone at whatever hour it arrived. Everything comes to the inbox
 * now, and the mailto arrives with the questions already asked, so nobody has
 * to stare at a blank message wondering what to write.
 */

export function messageHref() {
  return SITE.mailto;
}

export default function MessageUs({
  className = "btn-primary",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a href={messageHref()} className={className}>
      {label || "Start the conversation"} <span className="arrow">→</span>
    </a>
  );
}
