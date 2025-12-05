/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        st: {
          'dark-red': '#1A0000',
          'deep-black': '#0A0A0A',
          'gray-dark': '#333333',
          'gray-mid': '#666666',
          'gray-light': '#999999',
          'accent-purple': '#B300FF',
          red: '#FF0000',
          'red-primary': '#E30613',
          'red-muted': '#B3121D',
          'red-subtle': '#5A0A10',
          'red-glow': 'rgba(255, 0, 0, 0.45)',
          'cyan-data': '#00D4FF',
          'neon-pink': '#FF006E',
          'neon-cyan': '#00F0FF',
          'green-terminal': '#66FF66',
          'yellow-classified': '#FFD166',
          'blue-void': '#1F2040',
        },
        'bg-primary': '#08080C',
        'bg-void': '#030304',
        'bg-elevated': '#141418',
        'bg-terminal': '#051F0B',
        'text-primary': '#F5F5F5',
        'text-secondary': '#D6D6D6',
        'text-tertiary': '#A0A0A0',
        'text-dim': '#6E6E6E',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        benguiat: ['Courier New', 'Courier', 'monospace'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        retro: ['"Press Start 2P"', 'cursive'],
      },
      // Typography Scale - Consistent sizing system
      fontSize: {
        'display': ['5rem', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '700' }],
        'display-sm': ['3.5rem', { lineHeight: '1.15', letterSpacing: '0.02em', fontWeight: '700' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '700' }],
        'heading-2': ['1.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '700' }],
        'heading-3': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      // Spacing Scale - Consistent spacing tokens
      spacing: {
        'section': '5rem',      // Section padding (py-section = py-20)
        'section-sm': '3rem',   // Smaller section padding
        'container': '4rem',    // Container max-width padding
        'card': '2rem',         // Card internal padding
        'card-sm': '1.5rem',    // Small card padding
      },
      // Box Shadow - Neon glow tokens
      boxShadow: {
        'neon-red-sm': '0 0 5px #FF0000',
        'neon-red': '0 0 10px #FF0000',
        'neon-red-md': '0 0 10px #FF0000, 0 0 20px #FF0000',
        'neon-red-lg': '0 0 10px #FF0000, 0 0 20px #FF0000, 0 0 30px #FF0000, inset 0 0 10px #FF0000',
        'neon-red-xl': '0 0 20px #FF0000, 0 0 30px #FF0000, 0 0 40px #FF0000, 0 0 50px #FF0000, inset 0 0 20px #FF0000',
        'neon-cyan-sm': '0 0 5px #00F0FF',
        'neon-cyan': '0 0 10px #00F0FF',
        'neon-cyan-md': '0 0 10px #00F0FF, 0 0 20px #00F0FF',
        'neon-pink-sm': '0 0 5px #FF006E',
        'neon-pink': '0 0 10px #FF006E',
        'neon-pink-md': '0 0 10px #FF006E, 0 0 20px #FF006E',
        hud: '0 0 20px rgba(255, 0, 0, 0.35), 0 0 35px rgba(0, 240, 255, 0.2)',
        'hud-strong': '0 0 25px rgba(255, 0, 0, 0.5), 0 0 45px rgba(0, 240, 255, 0.35), 0 0 65px rgba(255, 0, 110, 0.3)',
        'glow-red-subtle': '0 0 12px rgba(227, 6, 19, 0.3)',
        'glow-red': '0 0 18px rgba(255, 0, 0, 0.45), 0 0 35px rgba(255, 0, 0, 0.35)',
        'glow-red-strong': '0 0 25px rgba(255, 30, 30, 0.55), 0 0 55px rgba(255, 30, 30, 0.45), inset 0 0 25px rgba(255, 0, 0, 0.35)',
        'glow-green-subtle': '0 0 12px rgba(102, 255, 102, 0.3)',
        'glow-green': '0 0 18px rgba(102, 255, 102, 0.45), 0 0 35px rgba(102, 255, 102, 0.35)',
        'glow-cyan': '0 0 18px rgba(0, 240, 255, 0.45), 0 0 40px rgba(0, 240, 255, 0.35)',
        card: '0 10px 30px rgba(5, 5, 15, 0.65), inset 0 0 25px rgba(255, 0, 0, 0.2)',
        'card-xl': '0 25px 80px rgba(5, 5, 15, 0.8), inset 0 0 35px rgba(255, 0, 0, 0.25), inset 0 0 45px rgba(0, 240, 255, 0.2)',
      },
      // Max Width - Consistent container widths
      maxWidth: {
        'content': '64rem',     // 1024px - main content width
        'content-sm': '48rem',  // 768px - narrower content
        'content-xs': '36rem',  // 576px - very narrow (text-heavy)
      },
      animation: {
        flicker: 'flicker 3s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        scanline: 'scanline 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 6s linear infinite',
        'pulse-ring': 'pulse-ring 4s ease-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'thread-drift': 'thread-drift 5s linear infinite',
        'glitch-pulse': 'glitch-pulse 2s steps(8) infinite',
        'reality-ripple': 'reality-ripple 6s ease-in-out infinite',
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
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.6' },
          '70%': { transform: 'scale(1.1)', opacity: '0.15' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'float-slow': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'thread-drift': {
          '0%': { strokeDashoffset: '120' },
          '100%': { strokeDashoffset: '0' },
        },
        'glitch-pulse': {
          '0%': { opacity: '1' },
          '15%': { opacity: '0.3' },
          '30%': { opacity: '0.9' },
          '45%': { opacity: '0.2' },
          '60%': { opacity: '0.8' },
          '75%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        'reality-ripple': {
          '0%': { transform: 'scale(0.95)', opacity: '0.4' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'scale(1.15)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
