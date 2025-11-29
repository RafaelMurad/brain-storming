# Stranger Things Portfolio

[![Deploy to GitHub Pages](https://github.com/RafaelMurad/brain-storming/actions/workflows/deploy-stranger-things.yml/badge.svg)](https://github.com/RafaelMurad/brain-storming/actions/workflows/deploy-stranger-things.yml)

A retro 80s/Stranger Things-inspired portfolio website built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

> *"Building tomorrow's web with yesterday's aesthetic"*

**🌐 Live Demo:** https://rafaelmurad.github.io/brain-storming/

## ✨ Features

### Stranger Things Aesthetic
- 🔴 **Signature Neon Red Glow** - Iconic red text with multiple shadow layers
- 📺 **CRT Effects** - Scanlines, vignette, and grain overlays
- ✨ **Flicker Animation** - Random flicker effects for authenticity
- 💫 **Letter-by-Letter Reveal** - Animated text reveal on page load
- 🌟 **Glow Pulse** - Breathing glow effect on interactive elements

### Technical Features
- ⚡ **React 18** - Modern React with hooks
- 🎨 **Tailwind CSS** - Utility-first styling with custom theme
- 📱 **Fully Responsive** - Mobile-first design
- 🎯 **TypeScript** - Type-safe development
- 🚀 **Vite** - Lightning-fast build tool
- ♿ **Accessible** - Semantic HTML and ARIA labels

## 🎨 Color Palette

```
Primary Red:     #FF0000  (Signature ST red)
Neon Pink:       #FF006E  (Accent highlights)
Neon Cyan:       #00F0FF  (Tech highlights)
Deep Black:      #0A0A0A  (Main background)
Dark Red:        #1A0000  (Secondary background)
Gray Tones:      #333, #666, #999
Accent Purple:   #B300FF  (Optional accents)
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will run at `http://localhost:5173/`

## 📁 Project Structure

```
stranger-things-portfolio/
├── src/
│   ├── components/
│   │   ├── About.tsx         # About section with terminal styling
│   │   ├── Contact.tsx       # Contact section with CTA
│   │   ├── Experience.tsx    # Experience timeline
│   │   ├── Hero.tsx          # Hero with neon title effect
│   │   ├── Noise.tsx         # Grain/noise overlay
│   │   ├── Projects.tsx      # Project showcase cards
│   │   ├── Scanlines.tsx     # CRT scanline effect
│   │   ├── Skills.tsx        # Skills with progress bars
│   │   └── Vignette.tsx      # Vignette overlay
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles + Tailwind
│   └── main.tsx              # Entry point
├── public/
├── index.html
├── tailwind.config.js        # Tailwind + ST color palette
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Sections

### 1. Hero Section
- Animated neon red title with letter-by-letter reveal
- Random flicker effect for authenticity
- Smooth scroll indicator
- CTA buttons with glow effects

### 2. About Section
- Terminal-style layout
- Monospace font for retro feel
- Blinking cursor animation
- Neon border effects

### 3. Experience Section
- Timeline/card layout
- Company and role highlights
- Tech stack tags
- Hover effects on borders

### 4. Projects Section
- Grid layout for project cards
- Project ID tags (PRJ_001, etc.)
- Status indicators (ACTIVE/DEPLOYED)
- Tech stack badges
- Hover glow effects

### 5. Skills Section
- Categorized skill groups
- Animated progress bars with red glow
- Percentage indicators
- Responsive grid layout

### 6. Contact Section
- Clear CTA for contract work
- Email and social links
- Neon button effects
- Footer with copyright

## 🎨 Customization

### Update Personal Information

Edit the following files with your information:

**Hero Section** (`src/components/Hero.tsx`):
```tsx
const name = "YOUR NAME";
const subtitle = "Frontend Engineer | TypeScript Specialist";
```

**Contact Section** (`src/components/Contact.tsx`):
```tsx
href="mailto:your.email@example.com"
href="https://linkedin.com/in/yourprofile"
href="https://github.com/yourusername"
```

**About Section** (`src/components/About.tsx`):
- Update the about text with your story
- Customize the terminal-style content

**Experience Section** (`src/components/Experience.tsx`):
- Add/edit your work experience
- Update company names, roles, and highlights

**Projects Section** (`src/components/Projects.tsx`):
- Add your actual projects
- Include real links and descriptions

**Skills Section** (`src/components/Skills.tsx`):
- Update skill categories and percentages
- Add/remove skills as needed

### Customize Colors

Edit `tailwind.config.js`:
```js
colors: {
  st: {
    red: '#FF0000',          // Change primary color
    'neon-pink': '#FF006E',  // Change accent
    // ... other colors
  },
}
```

### Adjust Effects

**Scanlines Intensity** (`src/index.css`):
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),  /* Adjust opacity */
    ...
  );
}
```

**Flicker Speed** (`src/components/Hero.tsx`):
```tsx
}, 3000 + Math.random() * 2000); // Adjust interval
```

**Glow Intensity** (`src/index.css`):
```css
.neon-red {
  text-shadow:
    0 0 5px #FF0000,
    0 0 10px #FF0000,  /* Adjust blur radius */
    ...
}
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- **Mobile**: < 768px (reduced glow effects)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (full effects)

Mobile optimizations:
- Reduced text shadow intensity
- Simplified animations
- Touch-friendly buttons
- Optimized scanline overlay

## 🎓 Inspiration & Resources

This project was inspired by:
- [Stranger Things Official Website](https://www.netflix.com/title/80057281)
- [Make It Stranger](https://makeitstranger.com/)
- CSS Tricks retro CRT effects
- 80s design principles and neon aesthetics

## 🚀 Deployment

### Netlify
```bash
npm run build
# Drag the `dist` folder to Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy `dist` folder to gh-pages branch
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google Fonts** - JetBrains Mono, Press Start 2P

## 📝 TODO

- [ ] Add custom Benguiat font (Stranger Things logo font)
- [ ] Implement audio controls (optional ST soundtrack)
- [ ] Add Easter eggs (Konami code, hidden messages)
- [ ] Create blog section styled as Hawkins Post
- [ ] Add WebGL particle effects (optional)
- [ ] Implement dark/light mode (Normal/Upside Down)
- [ ] Add testimonials section
- [ ] Create case study pages for projects
- [ ] Multi-language support (EN/PT)
- [ ] Add loading sequence animation

## 🎯 Performance

The portfolio is optimized for performance:
- Minimal bundle size
- CSS-only effects (no heavy JS libraries)
- Optimized fonts and images
- Smooth 60fps animations
- Lighthouse score target: > 90

## 📄 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

---

**Built with React, TypeScript, and a touch of the Upside Down** ⚡

*May your portfolio be stranger than things!* 🔦✨
