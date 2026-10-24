import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#142b2a",
        forest: "#193b37",
        sage: "#e9eee8",
        gold: "#c8a46b",
        paper: "#f7f7f3",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(20, 43, 42, .08)",
      },
    },
  },
  plugins: [],
};

export default config;
