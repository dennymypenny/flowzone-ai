/**
 * FlowZone mark: three connected dots, no container and no background.
 * Colors taken from Denny's brand artwork: deep navy, brand blue, ice blue,
 * joined by pale connectors, with a soft glow.
 */
export const MARK = {
  deep: "#1E3A8A",
  mid: "#5B9BF9",
  pale: "#C6E4F8",
  link: "#DDEEFB",
} as const;

export default function Wordmark({
  showName = true,
  className = "",
  size = 18,
  tone = "light",
}: {
  showName?: boolean;
  className?: string;
  size?: number;
  /** "light" for the white nav, "dark" for dark surfaces */
  tone?: "light" | "dark";
}) {
  const w = (size * 58) / 18;
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${
        tone === "light" ? "text-[#0B1322]" : "text-ink"
      } ${className}`}
    >
      <svg
        width={w}
        height={size}
        viewBox="0 0 58 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="fzGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#fzGlow)">
          <line x1="10.5" y1="9" x2="23.5" y2="9" stroke={MARK.link} strokeWidth="1.2" />
          <line x1="34.5" y1="9" x2="46.5" y2="9" stroke={MARK.link} strokeWidth="1.2" />
          <circle className="pulse-1" cx="6" cy="9" r="5.6" fill={MARK.deep} style={{ transformOrigin: "6px 9px" }} />
          <circle className="pulse-2" cx="29" cy="9" r="5.6" fill={MARK.mid} style={{ transformOrigin: "29px 9px" }} />
          <circle className="pulse-3" cx="52" cy="9" r="5.6" fill={MARK.pale} style={{ transformOrigin: "52px 9px" }} />
        </g>
      </svg>
      {showName && (
        <span className="font-display text-[19px] leading-none">
          FlowZone <span className="text-accent">AI</span>
        </span>
      )}
    </span>
  );
}
