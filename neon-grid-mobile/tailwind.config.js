/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          black: '#0a0a0f',
          dark: '#12121a',
          magenta: '#ff00ff',
          cyan: '#00ffff',
          pink: '#ff1493',
          blue: '#0066ff',
          purple: '#9d4edd',
          green: '#00ff88',
        },
      },
    },
  },
  plugins: [],
};
