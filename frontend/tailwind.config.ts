import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        bgPrimary: "var(--color-background-primary)",
        bgSecondary: "var(--color-background-secondary)",
        accentPrimary: "var(--color-accent-primary)",
        accentSecondary: "var(--color-accent-secondary)",
        borderPrimary: "var(--color-border-primary)",
        borderSecondary: "var(--color-border-secondary)",
      },
      backgroundImage: {
        "hero-pattern": "url('/images/dot-grid.webp')",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
