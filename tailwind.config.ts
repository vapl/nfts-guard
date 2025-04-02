import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        "background-dark": "rgb(var(--background-dark) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        "text-dark": "rgb(var(--text-dark) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-dark": "rgb(var(--card-dark) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-dark": "rgb(var(--secondary-dark) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-dark": "rgb(var(--accent-dark) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-dark": "rgb(var(--success-dark) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        "warning-dark": "rgb(var(--warning-dark) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-dark": "rgb(var(--danger-dark) / <alpha-value>)",
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        ".btn": {
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          borderRadius: theme("borderRadius.lg"),
          fontWeight: theme("fontWeight.medium"),
          transition: "background-color 0.3s, color 0.3s",
        },
        ".btn-primary": {
          backgroundColor: "rgb(var(--primary))",
          color: "white",
          "&:hover": {
            backgroundColor: "rgb(var(--primary) / 0.9)",
          },
        },
        ".btn-secondary": {
          backgroundColor: "rgb(var(--secondary))",
          color: "white",
          "&:hover": {
            backgroundColor: "rgb(var(--secondary) / 0.9)",
          },
        },
        ".btn-outline": {
          backgroundColor: "transparent",
          border: `1px solid rgb(var(--primary))`,
          color: "rgb(var(--primary))",
          "&:hover": {
            backgroundColor: "rgb(var(--primary) / 0.1)",
          },
          ".btn-gradient": {
            padding: `${theme("spacing.4")} ${theme("spacing.8")}`,
            fontSize: theme("fontSize.lg"),
            fontWeight: theme("fontWeight.semibold"),
            borderRadius: theme("borderRadius.lg"),
            color: theme("colors.white"),
            backgroundImage: `linear-gradient(to right, ${theme(
              "colors.purple.600"
            )}, ${theme("colors.indigo.500")})`,
            boxShadow: theme("boxShadow.lg"),
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: "0.8",
            },
          },
        },
      });
    },
  ],
};

export default config;
