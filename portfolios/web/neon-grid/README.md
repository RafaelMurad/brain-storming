# NeonGrid Portfolio

A cyberpunk-themed portfolio built with **SolidJS**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: [SolidJS](https://www.solidjs.com/) v1.8
- **Build Tool**: [Vite](https://vitejs.dev/) v5.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4
- **Language**: TypeScript

## Features

- ⚡ **Reactive UI** - SolidJS fine-grained reactivity
- 🎨 **Cyberpunk Theme** - Neon colors, scanlines, glitch effects
- 🖥️ **Terminal UI** - Command-line styled about section
- 🌐 **Grid Background** - Animated perspective grid
- 📱 **Responsive** - Mobile-first design
- 🔧 **Reusable Components** - Modular architecture

## Project Structure

```
neon-grid/
├── src/
│   ├── components/
│   │   ├── About.tsx         # About section with terminal
│   │   ├── Button.tsx        # Cyber-styled button
│   │   ├── Contact.tsx       # Contact form section
│   │   ├── Footer.tsx        # Site footer
│   │   ├── GridBackground.tsx # Animated grid + glitch
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Hero.tsx          # Hero section
│   │   ├── HoloDisplay.tsx   # Holographic visual
│   │   ├── ProjectCard.tsx   # Project showcase card
│   │   ├── Projects.tsx      # Projects section
│   │   ├── Scanlines.tsx     # CRT scanline overlay
│   │   ├── Section.tsx       # Reusable section wrapper
│   │   ├── Skills.tsx        # Skills with progress bars
│   │   └── Terminal.tsx      # Terminal component
│   ├── styles/
│   │   └── index.css         # Global styles + Tailwind
│   ├── App.tsx               # Main app component
│   └── index.tsx             # Entry point
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Quick Start

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

## Components

### Button
Cyber-styled button with variants:
```tsx
<Button href="#projects" variant="primary">VIEW PROJECTS</Button>
<Button variant="secondary">CONNECT</Button>
```

### Section
Reusable section wrapper:
```tsx
<Section id="about" tag="<PROFILE>" title="ABOUT_ME">
  {/* Content */}
</Section>
```

### ProjectCard
Showcase projects:
```tsx
<ProjectCard
  id="PRJ_001"
  title="PROJECT_NAME"
  description="Description"
  tags={['React', 'Node.js']}
  status="DEPLOYED"
  visual="cyber"
/>
```

## Customization

### Colors
Edit `tailwind.config.js`:
```js
colors: {
  neon: {
    cyan: '#00fff9',
    magenta: '#ff00ff',
    yellow: '#ffff00',
  },
}
```

### Effects
- **Scanlines**: Adjust opacity in `index.css`
- **Grid**: Modify background-size in `.grid-bg`
- **Glitch**: Customize keyframes in `index.css`

## Why SolidJS?

- **Performance**: No virtual DOM, direct DOM updates
- **Reactive**: Fine-grained reactivity without re-renders
- **Small Bundle**: Minimal runtime overhead
- **Familiar**: JSX syntax similar to React

## License

MIT License - Free for personal and commercial use.
