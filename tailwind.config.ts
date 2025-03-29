import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: {
          light: "#ffffff", // Gaišā tēma
          dark: "#0a0a20", // Tumšā tēma
        },
        text: {
          light: "#1a1a1a", // Gaišā tēma (tumši pelēks teksts)
          dark: "#E5E7EB", // Tumšā tēma (gaiši pelēks teksts)
        },
        primary: {
          light: "#7C3AED", // Gaišā tēma (nedaudz gaišāka violeta)
          dark: "#8B5CF6", // Tumšā tēma
        },
        secondary: {
          light: "#D97706", // Gaišā tēma (nedaudz tumšāka oranža)
          dark: "#F59E0B", // Tumšā tēma
        },
        card: {
          light: "#f5f5f5", // Gaišā tēma (gaiši pelēka kartīte)
          dark: "#1c1c3c", // Tumšā tēma (tumši zila kartīte)
        },
        accent: {
          light: "#e0e7ff", // Gaišā tēma (gaiši violets akcents)
          dark: "#2a2a5a", // Tumšā tēma (tumši violets akcents)
        },
      },
    },
  },
  plugins: [scrollbar],
};

export default config;
