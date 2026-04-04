/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 400:"#22d3ee", 500:"#06b6d4", 600:"#0891b2" },
      },
      fontFamily: { mono: ["Fira Code","monospace"] },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from:{ opacity:"0", transform:"translateY(30px)" }, to:{ opacity:"1", transform:"translateY(0)" } },
        shimmer: { "0%":{ backgroundPosition:"200% 0" }, "100%":{ backgroundPosition:"-200% 0" } },
      },
    },
  },
  plugins: [],
};
