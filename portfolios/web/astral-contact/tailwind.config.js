/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alien: {
          glow: '#39ff14',
          'glow-dim': '#2bcc10',
          purple: '#9d4edd',
          'purple-light': '#c77dff',
          'purple-dark': '#7b2cbf',
          teal: '#2ec4b6',
          'teal-light': '#4dd9cc',
          'teal-dark': '#1a9a8f',
          void: '#0a0a12',
          'void-light': '#12121f',
          'void-lighter': '#1a1a2e',
          nebula: '#16213e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'signal-wave': 'signalWave 1.5s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'beacon': 'beacon 2s ease-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'particle-rise': 'particleRise 4s ease-out infinite',
        'orbit': 'orbit 8s linear infinite',
        'ufo-hover': 'ufoHover 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14',
            opacity: '1',
          },
          '50%': {
            boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14',
            opacity: '0.8',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        signalWave: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        beacon: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        particleRise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        ufoHover: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
      },
      boxShadow: {
        'glow': '0 0 10px #39ff14, 0 0 20px #39ff14',
        'glow-lg': '0 0 20px #39ff14, 0 0 40px #39ff14, 0 0 60px #39ff14',
        'glow-purple': '0 0 10px #9d4edd, 0 0 20px #9d4edd',
        'glow-teal': '0 0 10px #2ec4b6, 0 0 20px #2ec4b6',
        'inner-glow': 'inset 0 0 20px rgba(57, 255, 20, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'crop-circle': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' stroke='%2339ff14' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3Ccircle cx='30' cy='30' r='10' stroke='%2339ff14' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3C/svg%3E\")",
        'star-field': "radial-gradient(2px 2px at 20px 30px, #39ff14, transparent), radial-gradient(2px 2px at 40px 70px, #9d4edd, transparent), radial-gradient(1px 1px at 90px 40px, #2ec4b6, transparent), radial-gradient(2px 2px at 130px 80px, #39ff14, transparent), radial-gradient(1px 1px at 160px 20px, #9d4edd, transparent)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
