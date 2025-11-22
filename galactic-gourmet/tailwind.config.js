/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#e6c65c',
          dark: '#b8942d',
        },
        burgundy: {
          DEFAULT: '#722f37',
          light: '#8f3b45',
          dark: '#5a252c',
        },
        space: {
          DEFAULT: '#0a0a12',
          light: '#14141f',
          lighter: '#1e1e2d',
        },
        cream: {
          DEFAULT: '#fef9e7',
          dark: '#f5edd4',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 25s linear reverse infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'stars': "radial-gradient(2px 2px at 20px 30px, #d4af37, transparent), radial-gradient(2px 2px at 40px 70px, #fef9e7, transparent), radial-gradient(1px 1px at 90px 40px, #d4af37, transparent), radial-gradient(2px 2px at 160px 120px, #fef9e7, transparent), radial-gradient(1px 1px at 230px 80px, #d4af37, transparent)",
      },
    },
  },
  plugins: [],
}
