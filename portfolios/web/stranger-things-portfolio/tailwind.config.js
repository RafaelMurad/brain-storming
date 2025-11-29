/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stranger Things color palette
        st: {
          red: '#FF0000',          // Primary signature red
          'dark-red': '#1A0000',   // Deep red background
          'neon-pink': '#FF006E',  // Accent pink
          'neon-cyan': '#00F0FF',  // Accent cyan
          'deep-black': '#0A0A0A', // Main background
          'gray-dark': '#333333',
          'gray-mid': '#666666',
          'gray-light': '#999999',
          'accent-purple': '#B300FF',
        },
      },
      fontFamily: {
        'benguiat': ['Courier New', 'Courier', 'monospace'], // Fallback until we add custom fonts
        'mono': ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        'retro': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0.8' },
          '43%': { opacity: '1' },
          '45.99%': { opacity: '1' },
          '46%': { opacity: '0.6' },
          '46.5%': { opacity: '1' },
        },
        glow: {
          '0%': {
            textShadow: '0 0 10px #FF0000, 0 0 20px #FF0000, 0 0 30px #FF0000',
          },
          '100%': {
            textShadow: '0 0 20px #FF0000, 0 0 30px #FF0000, 0 0 40px #FF0000, 0 0 50px #FF0000',
          },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
