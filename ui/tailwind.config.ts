import type { Config } from "tailwindcss";
import { theme } from "./app/styles/theme";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: theme.colors,
      borderRadius: theme.borderRadius,
      animation: {
        default: theme.animation.default,
      },
    },
  },
  plugins: [],
};

export default config;
