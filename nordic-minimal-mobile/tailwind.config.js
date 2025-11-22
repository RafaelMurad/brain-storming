/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          snow: '#fafafa',
          frost: '#f5f5f5',
          stone: '#e5e5e5',
          fog: '#a3a3a3',
          charcoal: '#404040',
          night: '#171717',
          pine: '#2d5a3d',
          ocean: '#3b82c4',
          berry: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
