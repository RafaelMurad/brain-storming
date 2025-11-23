/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00fff9',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          pink: '#ff2a6d',
          blue: '#05d9e8',
          purple: '#d300c5',
        },
        cyber: {
          dark: '#0a0a0f',
          darker: '#050508',
          card: 'rgba(15, 15, 25, 0.8)',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 2s infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'holo-spin': 'holo-spin 10s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 249, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 249, 0.6)' },
        },
        'holo-spin': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
