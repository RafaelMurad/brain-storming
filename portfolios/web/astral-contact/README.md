# AstralContact

An alien/extraterrestrial themed portfolio built with SolidJS, TypeScript, and Tailwind CSS.

## Features

- **UFO-style navigation** with animated toggle
- **Signal badge** with dynamic strength indicator
- **Hologram display** in the About section
- **Signal frequency bars** for skills visualization
- **Cosmic project cards** with status indicators
- **Beacon contact form** with animated rings
- **Floating particles** and star field backgrounds
- **Crop circle patterns** as section decorations
- **Green glow effects** throughout the design

## Tech Stack

- **SolidJS** - Reactive UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tooling

## Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Alien Glow | `#39ff14` | Primary accent, highlights |
| Purple | `#9d4edd` | Secondary accent |
| Teal | `#2ec4b6` | Tertiary accent |
| Void Black | `#0a0a12` | Background |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

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

## Project Structure

```
astral-contact/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Navigation with UFO toggle
│   │   ├── Hero.tsx        # Hero with signal badge, UFO animation
│   │   ├── Section.tsx     # Reusable section with crop circles
│   │   ├── About.tsx       # Transmission section with hologram
│   │   ├── Skills.tsx      # Signal frequencies with bars
│   │   ├── Projects.tsx    # Artifacts with cosmic cards
│   │   ├── Contact.tsx     # Contact form with beacon
│   │   ├── Footer.tsx      # Footer with system status
│   │   └── Button.tsx      # Reusable button component
│   ├── styles/
│   │   └── index.css       # Global styles with Tailwind
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── postcss.config.js
```

## Components

### Header
Navigation bar with UFO-style logo and mobile menu toggle with pulsing ring animation.

### Hero
Landing section featuring:
- Animated UFO with tractor beam
- Signal strength indicator
- Typewriter greeting effect
- Coordinate display

### About
Transmission log section with:
- Rotating hologram display
- Animated scan line effect
- Terminal-style data cards
- Stat cards with glow effects

### Skills
Signal frequencies display with:
- Spectrum analyzer visualization
- Category filter tabs
- Animated skill bars
- Frequency labels

### Projects
Artifacts gallery featuring:
- Status filter (Active/Archived/Classified)
- Cosmic project cards
- Pattern visualizations
- Technology tags

### Contact
Beacon transmission form with:
- Terminal-style form design
- Input validation with alien-themed errors
- Beacon pulse animation
- Social media links

### Footer
System status display with:
- Live timestamp
- Status indicators
- Scroll to top button

## Customization

### Colors
Edit `tailwind.config.js` to modify the alien theme colors:

```js
colors: {
  alien: {
    glow: '#39ff14',
    purple: '#9d4edd',
    teal: '#2ec4b6',
    void: '#0a0a12',
  }
}
```

### Animations
Custom animations are defined in `tailwind.config.js`:
- `pulse-glow` - Glowing pulse effect
- `float` - Floating motion
- `signal-wave` - Expanding signal rings
- `beacon` - Beacon pulse
- `ufo-hover` - UFO hovering motion

## License

MIT License - Feel free to use this template for your own portfolio!

---

*Transmitting from another world...*
