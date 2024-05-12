import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-nav": "#141718",
        "black-header": "#121212",
        "gray-border": "#E8ECEF",
        "gray-text": "#807E7E",
        "gray-deep": "#6C7275",
      },
      boxShadow: {
        custom: "0px 8px 16px -8px #0F0F0F1F",
        card: "0px 5px 20px -9px rgba(66, 68, 90, 0.15)",
      },
    },
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
      "4xl": "2200px",
    },
  },
  plugins: [],
};
export default config;
