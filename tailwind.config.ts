import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F4EEE4",
        beige: "#D6C1A8",
        taupe: "#A58B73",
        mocha: "#6F5541",
        brown: "#3F3027",
        border: "#DED2C3",
        sage: "#687061",
        ink: "#241C17"
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(63, 48, 39, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
