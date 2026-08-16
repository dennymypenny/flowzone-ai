/**
 * The professional icon set. Minimal stroke glyphs, drawn to match the
 * mark's geometry: thin lines, round caps, one colour at a time via
 * currentColor or an explicit color prop. These replaced the emoji layer
 * across the site: same friendliness, grown-up clothes.
 */

const PATHS: Record<string, React.ReactNode> = {
  box: (
    <>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  hands: (
    <>
      <path d="M7 11V6a2 2 0 014 0v5M11 11V4a2 2 0 014 0v7" />
      <path d="M5 12c0 5 3 9 7 9s7-4 7-9v-2a2 2 0 00-4 0" />
      <path d="M5 12V9a2 2 0 014 0" />
    </>
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  banknote: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M5.5 9.5h.01M18.5 14.5h.01" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l3 3M14 9l2 2" />
    </>
  ),
  pencil: (
    <>
      <path d="M17 3l4 4L8 20l-5 1 1-5L17 3z" />
      <path d="M14 6l4 4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  hammer: (
    <>
      <path d="M14 4l6 6-2 2-6-6 2-2z" />
      <path d="M12 6L3 15l3 3 9-9" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 15c5-4 7-8 7-12-4 0-8 2-12 7l5 5z" />
      <path d="M7 10l-4 2 3 1 1 3 2-4M9 18c-1 2-4 3-4 3s1-3 3-4" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </>
  ),
  handshake: (
    <>
      <path d="M2 8l4-3 6 2 6-2 4 3-3 8-4 3-6-1-4-3-3-7z" />
      <path d="M12 7l-4 4 2 2 3-2 3 3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2-.6-1.2 0-2.5 1.5-2.5H17a4 4 0 004-4c0-5-4-9.5-9-9.5z" />
      <circle cx="7.5" cy="11" r="1" />
      <circle cx="10.5" cy="7" r="1" />
      <circle cx="15" cy="7.5" r="1" />
    </>
  ),
  clapper: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M3 9l2-5 16 3-1 2M8.5 4.9L7 9M13.5 5.8L12 9M18.5 6.7L17 9" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  puzzle: (
    <>
      <path d="M9 4a2 2 0 114 0h4v4a2 2 0 110 4v4h-4a2 2 0 11-4 0H5v-4a2 2 0 100-4V4h4z" />
    </>
  ),
  disk: (
    <>
      <path d="M5 3h11l3 3v15H5V3z" />
      <path d="M8 3v5h7V3M8 14h8v7H8v-7z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
  wave: <path d="M2 14c2-5 4-5 6 0s4 5 6 0 4-5 6 0" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
    </>
  ),
  bread: (
    <>
      <path d="M4 10a4 4 0 014-4h8a4 4 0 012 7.5V19H6v-5.5A4 4 0 014 10z" />
      <path d="M10 9c-1 2-1 4 0 6M14 9c1 2 1 4 0 6" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path d="M8.2 8.5L20 19M8.2 15.5L20 5" />
    </>
  ),
  shoe: (
    <>
      <path d="M2 16c0-2 1-6 2-8l4 2 2-2c4 2 8 4 12 5v3H2z" />
      <path d="M10 10l1.5 1.5M12.5 9l1.5 1.5" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M7 8v8M17 8v8M4 10v4M20 10v4M7 12h10" />
    </>
  ),
  truck: (
    <>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-3" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="10" r="2.4" />
      <path d="M12 7.6a3 3 0 10-3 3M9 10.6a3 3 0 103 3M15 10.6a3 3 0 10-3-3M12 13.6a3 3 0 103-3" />
      <path d="M12 14v7M12 21c0-2-2-3-4-3M12 21c0-2 2-3 4-3" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 3-3 5-3 9a5 5 0 0010 0c0-2-1-4-2.5-5.5C16 8.5 15 10 13.5 10c.5-2 0-5-1.5-7z" />
    </>
  ),
  heart: <path d="M12 20s-8-5-8-10a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 5-8 10-8 10z" />,
  balloon: (
    <>
      <path d="M12 3a6 6 0 016 6c0 4-3 7-6 7s-6-3-6-7a6 6 0 016-6z" />
      <path d="M12 16l-1 2h2l-1 3" />
    </>
  ),
  moon: <path d="M20 14A8.5 8.5 0 1110 4a7 7 0 0010 10z" />,
  gem: (
    <>
      <path d="M6 4h12l4 6-10 10L2 10l4-6z" />
      <path d="M2 10h20M9 4l3 6 3-6M12 10v10" />
    </>
  ),
  droplet: <path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z" />,
  house: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10M10 20v-6h4v6" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="8" r="1.8" />
      <circle cx="12" cy="6" r="1.8" />
      <circle cx="17" cy="8" r="1.8" />
      <path d="M12 11c3 0 6 2.5 6 5a3 3 0 01-3 3c-1.2 0-2-.5-3-.5s-1.8.5-3 .5a3 3 0 01-3-3c0-2.5 3-5 6-5z" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9V6h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z" />
      <path d="M14 6v10" strokeDasharray="2 2.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15z" />
      <path d="M5 19c3-6 7-9 11-11" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 01-8 0V4z" />
      <path d="M8 5H4c0 3 1.5 5 4 5M16 5h4c0 3-1.5 5-4 5M12 13v4M8 21h8M10 17h4v4h-4v-4z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="9" width="19" height="6" rx="1" transform="rotate(-20 12 12)" />
      <path d="M8 13.5l1-2.8M12 12l1-2.8M16 10.5l1-2.8" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4V5z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  color = "currentColor",
  className = "",
}: {
  name: keyof typeof PATHS | string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const glyph = PATHS[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {glyph}
    </svg>
  );
}
