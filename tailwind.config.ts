import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        bg: { DEFAULT: "#0A0A0A", subtle: "#121212", muted: "#1A1A1A", elevated: "#222222" },
        border: { DEFAULT: "#27272A", strong: "#3F3F46" },
        text: { DEFAULT: "#FAFAFA", muted: "#A1A1AA", subtle: "#71717A" },
        brand: { 50: "#EEF2FF", 100: "#E0E7FF", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA" },
        accent: { amber: "#F59E0B", emerald: "#10B981", rose: "#EF4444", sky: "#0EA5E9" },
      },
      borderRadius: { sm: "6px", md: "10px", lg: "14px" },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- tailwindcss-animate ships no types; CJS require keeps `pnpm typecheck` green
  plugins: [require("tailwindcss-animate")],
};

export default config;
