/**
 * FlowZone mark: three connected dots, no container and no background.
 * Sits directly on whatever surface it is placed on.
 */
export default function Wordmark({
  showName = true,
  className = "",
  size = 18,
}: {
  showName?: boolean;
  className?: string;
  size?: number;
}) {
  const w = (size * 58) / 18;
  return (
    <span className={`inline-flex items-center gap-2.5 text-ink ${className}`}>
      <svg
        width={w}
        height={size}
        viewBox="0 0 58 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <line x1="10" y1="9" x2="24" y2="9" stroke="#5B8CFF" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="34" y1="9" x2="48" y2="9" stroke="#5B8CFF" strokeOpacity="0.35" strokeWidth="1.5" />
        <circle cx="6" cy="9" r="5.5" fill="#5B8CFF" />
        <circle cx="29" cy="9" r="5.5" fill="#8FB2FF" />
        <circle cx="52" cy="9" r="5.5" fill="#D6E2FF" />
      </svg>
      {showName && (
        <span className="font-display text-[17px] leading-none">FlowZone</span>
      )}
    </span>
  );
}
