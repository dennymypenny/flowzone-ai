/**
 * Flowy, FlowZone's little helper.
 *
 * A blue half-disc that peeks in from the right edge of the screen, eyes
 * stacked because the face is turned sideways to look at you, and two small
 * hands holding the edge. The same drawing works
 * at 22px in the chat header and at 96px on the edge of the page, so the
 * character is one file and one shape everywhere it shows up.
 */
export default function Flowy({
  size = 96,
  className = "",
  animate = true,
}: {
  /** Height in px. Width follows the drawing. */
  size?: number;
  className?: string;
  /** Bob and blink. Off for tiny sizes where the motion would just flicker. */
  animate?: boolean;
}) {
  const w = (size * 72) / 136;
  return (
    <span
      className={`inline-block shrink-0 ${animate ? "flowy-bob" : ""} ${className}`}
      style={{ width: w, height: size }}
      aria-hidden
    >
      <svg width={w} height={size} viewBox="0 0 72 136" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* The body. Left half of a disc whose centre sits on the edge. */}
        <path d="M72 10 A58 58 0 0 0 72 126 Z" fill="#4C7BE8" />
        <path d="M72 10 A58 58 0 0 0 72 126 Z" fill="url(#flowy-shade)" />
        <defs>
          <linearGradient id="flowy-shade" x1="14" y1="10" x2="72" y2="126" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7FA6FF" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#4C7BE8" stopOpacity="0" />
            <stop offset="1" stopColor="#1E3A8A" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Eyes, stacked. Each one blinks from its own centre. */}
        <g className={animate ? "flowy-blink" : undefined} style={{ transformOrigin: "51px 50px" }}>
          <rect x="36" y="40" width="30" height="20" rx="10" fill="#FFFFFF" />
          <circle cx="52" cy="50" r="5.6" fill="#0B1322" />
          <circle cx="54" cy="48" r="1.6" fill="#FFFFFF" />
        </g>
        <g className={animate ? "flowy-blink" : undefined} style={{ transformOrigin: "51px 86px" }}>
          <rect x="36" y="76" width="30" height="20" rx="10" fill="#FFFFFF" />
          <circle cx="52" cy="86" r="5.6" fill="#0B1322" />
          <circle cx="54" cy="84" r="1.6" fill="#FFFFFF" />
        </g>
        {/* Brows, the curved strokes beside each eye. */}
        <path d="M69 38 q6 12 0 24" stroke="#0B1322" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M69 74 q6 12 0 24" stroke="#0B1322" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* The cheek line between the eyes. */}
        <path d="M31 60 q-5 8 0 16" stroke="#0B1322" strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* Hands holding the edge, top and bottom. */}
        <g fill="#0B1322">
          <circle cx="58" cy="12" r="8.5" />
          <circle cx="50" cy="8" r="4.6" />
          <circle cx="53" cy="2.5" r="4.2" />
          <circle cx="61" cy="2.5" r="4.2" />
          <circle cx="58" cy="124" r="8.5" />
          <circle cx="50" cy="128" r="4.6" />
          <circle cx="53" cy="133.5" r="4.2" />
          <circle cx="61" cy="133.5" r="4.2" />
        </g>
      </svg>
    </span>
  );
}
