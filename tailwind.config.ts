import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#38bdf8",
          foreground: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
