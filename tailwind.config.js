/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Product Sans", "sans-serif"],
      },
    },
    // screens: {
    //   ssm: "475px",
    //   sm: "640px",
    //   md: "880px",
    //   lg: "1024px",
    //   xl: "1280px",
    //   "2xl": "1405px",
    // },

    // colors: {
    //   "brand-blue": "#007ace",
    //   "brand-light": "#f0f9ff",
    //   "brand-dark": "#0369a1",
    //   gray: {
    //     100: "#0F172A",
    //     200: "#F1F5F9",
    //     300: "#E2E8F0",
    //     400: "#CBD5E1",
    //     500: "#94A3B8",
    //     600: "#64748B",
    //     700: "#475569",
    //     800: "#334155",
    //     900: "#1E293B",
    //   },
    //   black: "#000000",
    //   white: "#ffffff",

    //   slate: {
    //     100: "#f1f5f9",
    //     200: "#e2e8f0",
    //     300: "#cbd5e1",
    //     400: "#94a3b8",
    //     500: "64748b",
    //     600: "#475569",
    //     700: " #334155",
    //     800: "#1e293b",
    //     900: "#0f172a",
    //   },
    //   sky: {
    //     300: "#7dd3fc",
    //     400: "#38bdf8",
    //     500: "#0ea5e9",
    //     600: "#0284c7",
    //     700: "#0369a1",
    //   },
    //   indigo: {
    //     200: "#c7d2fe",
    //     500: "#6366f1",
    //   },
    //   fuchsia: { 200: "#f5d0fe", 600: "#d946ef", 800: "#86198f" },
    //   green: { 500: "#22c55e", 600: "#16a34a", 700: "#15803d" },
    //   red: {
    //     200: "#fecaca",
    //     500: "#ef4444",
    //     700: "#b91c1c",
    //   },
    //   orange: {
    //     500: "#f97316",
    //   },
    //   danger: "#FF0000",
    //   yellow: "#FCAB10",
    //   warning: "#1eab308",
    // },

    // spacing: {
    //   72: "18rem",
    //   84: "21rem",
    //   96: "24rem",
    // },
    // boxShadow: {
    //   strong:
    //     "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    // },
    // animation: {
    //   "fade-in": "fadeIn 0.5s ease-out forwards",
    // },
    // keyframes: {
    //   fadeIn: {
    //     "0%": { opacity: 0 },
    //     "100%": { opacity: 1 },
    //   },
    // },
  },
  plugins: [],
};
