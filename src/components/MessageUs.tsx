import { SITE } from "@/lib/site";

/**
 * Instant contact. Opens the visitor's Messages app with a text started to us,
 * so it lands as a notification on a phone rather than in an inbox.
 *
 * If no number is set in SITE.phone it silently becomes an email button, so
 * this can ship before the number exists and can never be a dead end.
 */

const TEXT = "Hi FlowZone, I want to get something moving:";

export function messageHref() {
  if (!SITE.phone) return SITE.mailto;
  // The ?&body= form is the one that works on both iOS and Android.
  return `sms:${SITE.phone}?&body=${encodeURIComponent(TEXT + " ")}`;
}

export default function MessageUs({
  className = "btn-primary",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const live = Boolean(SITE.phone);
  return (
    <a href={messageHref()} className={className}>
      {label || (live ? "Start the conversation" : "Start the conversation")}{" "}
      <span className="arrow">→</span>
    </a>
  );
}
