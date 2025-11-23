/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
