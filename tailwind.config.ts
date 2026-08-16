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
        // Poppins, matching the type Denny uses in Canva
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
        mono: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark canvas
        paper: "#080D18",
        "paper-deep": "#0B1322",
        raised: "#101A2C",
        rule: "#1D2942",
        // Type
        ink: "#F1F3F7",
        "ink-soft": "#9AA7BE",
        "ink-mute": "#647089",
        // Brand blue, light end of the family
        accent: "#5B8CFF",
        "accent-deep": "#3D6FE8",
        "accent-light": "#A8C4FF",
        "accent-pale": "#C6E4F8",
        "brand-navy": "#1E3A8A",
        // Signal colours. Each one always means the same thing:
        // speed = amber, price = violet, ownership = emerald, effort = teal
        speed: "#FBBF24",
        price: "#A78BFA",
        own: "#34D399",
        effort: "#2DD4BF",
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
