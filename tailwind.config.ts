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
        // Dark canvas
        paper: "#0A0B0E",
        "paper-deep": "#0F1116",
        raised: "#14171E",
        rule: "#22262E",
        // Type
        ink: "#F1F3F7",
        "ink-soft": "#9BA3B0",
        "ink-mute": "#646C79",
        // Brand blue, light end of the family
        accent: "#5B8CFF",
        "accent-deep": "#3D6FE8",
        "accent-light": "#A8C4FF",
        "accent-pale": "#D6E2FF",
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
        glowbtn: "0 8px 30px -10px rgba(91,140,255,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
