/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          void: '#0a0a1a',
          dark: '#0f0f2a',
          purple: '#9d4edd',
          cyan: '#00d4ff',
          pink: '#ff6b9d',
          blue: '#4361ee',
        },
      },
    },
  },
  plugins: [],
};
