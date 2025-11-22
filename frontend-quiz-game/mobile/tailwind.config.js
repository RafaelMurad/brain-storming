/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        quiz: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          success: '#22c55e',
          error: '#ef4444',
          dark: '#0f172a',
          darker: '#020617',
          card: '#1e293b',
          border: '#334155',
        },
      },
    },
  },
  plugins: [],
};
