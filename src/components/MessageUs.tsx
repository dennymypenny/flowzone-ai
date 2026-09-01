import Link from "next/link";

/**
 * The primary way in. One action, one label, everywhere.
 *
 * This used to be a prefilled mailto. Every primary CTA now opens the ticket
 * at /intake instead: four questions, no call, and the number arrives before
 * anything starts. The mailto survives only as a secondary path (SITE.mailto).
 */

export default function MessageUs({
  className = "btn-primary",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <Link href="/intake" className={className}>
      {label || "Start a ticket"} <span className="arrow">→</span>
    </Link>
  );
}

/** The one line that sits under every primary CTA. Identical wording, always. */
export function TicketNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[12px] text-ink-mute mt-4 ${className}`}>
      Four questions. No call. You see your number before anything starts.
    </p>
  );
}
