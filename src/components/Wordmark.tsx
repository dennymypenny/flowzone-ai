export default function Wordmark({
  tone = "ink",
  className = "",
}: {
  tone?: "ink" | "paper";
  className?: string;
}) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2.5 ${color} ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect width="18" height="18" rx="4" fill="currentColor" fillOpacity="0.08" />
        <rect x="4" y="4" width="4" height="4" rx="1" fill="#5B8CFF" />
        <rect x="10" y="4" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.45" />
        <rect x="4" y="10" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.45" />
        <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
      </svg>
      <span className="font-display text-[17px] leading-none">FlowZone</span>
    </span>
  );
}
