import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        // Canvas
        paper: "#0A0B0E",
        "paper-deep": "#0F1116",
        raised: "#14171E",
        // Type and inverted bands
        ink: "#F1F3F7",
        "ink-soft": "#9BA3B0",
        "ink-mute": "#646C79",
        rule: "#22262E",
        // Brand blue
        accent: "#5B8CFF",
        "accent-deep": "#3D6FE8",
        "accent-dim": "#1B2540",
      },
      letterSpacing: {
        label: "0.16em",
      },
      maxWidth: {
        reading: "62ch",
      },
      boxShadow: {
        panel:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 30px 70px -24px rgba(0,0,0,0.85)",
        glowbtn: "0 8px 30px -8px rgba(91,140,255,0.55)",
      },
    },
  },
  plugins: [],
};
export default config;
