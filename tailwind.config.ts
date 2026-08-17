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
        // Figtree. Geometric like Poppins was, but with a tighter, less circular
        // bowl, so it reads as a studio rather than as a template.
        sans: ["Figtree", "system-ui", "sans-serif"],
        display: ["Figtree", "system-ui", "sans-serif"],
        mono: ["Figtree", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark canvas
        paper: "#0C1424",
        "paper-deep": "#101A2E",
        raised: "#172440",
        rule: "#26355A",
        // Type
        ink: "#F1F3F7",
        "ink-soft": "#ABB8CF",
        "ink-mute": "#93A2BC",
        // Brand blue, light end of the family
        accent: "#5B8CFF",
        "accent-deep": "#3D6FE8",
        "accent-light": "#A8C4FF",
        "accent-pale": "#C6E4F8",
        "brand-navy": "#1E3A8A",
        // Signal colours. Each one always means the same thing:
        // speed = amber, price = ember, ownership = emerald, effort = teal.
        // Price used to be a violet. Violet next to this blue is the house
        // style of every site nobody designed, so it is an ember now.
        speed: "#FBBF24",
        price: "#F0845F",
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
