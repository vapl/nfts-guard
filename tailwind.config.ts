/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  darkMode: "class", // Nodrošina tumšo režīmu
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Pievienots src ceļš
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Pievienots src ceļš
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        primary: "#8B5CF6",
        secondary: "#F59E0B",
        background: {
          DEFAULT: "#0a0a20",
          light: "#ffffff",
          dark: "#0a0a20",
        },
        text: {
          DEFAULT: "#E5E7EB",
          light: "#374151",
          dark: "#ffffff",
        },
        accent: {
          purple: "#9333EA",
          orange: "#F97316",
          blue: "#3B82F6",
        },
        gradientStart: "#0a0a20",
        gradientMid: "#1c1c3a",
        gradientEnd: "#3b3b6b",
      },
    },
  },
  plugins: [],
};
