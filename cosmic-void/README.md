# Cosmic Void Portfolio

A deep space/cosmos themed portfolio built with **Astro**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v4.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.x
- **Language**: TypeScript
- **Fonts**: Orbitron (display), Inter (body)

## Features

- 🌟 **Parallax Star Field** - Three-layer star system with depth
- 🪐 **Animated Planet** - CSS-only planet with orbital rings
- 🌠 **Shooting Stars** - Random shooting star animations
- 🎨 **Cosmic Theme** - Purple, cyan, and pink color palette
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Zero JS by Default** - Astro's partial hydration
- 🔧 **Reusable Components** - Modular architecture

## Project Structure

```
cosmic-void/
├── src/
│   ├── components/
│   │   ├── Button.astro       # Reusable button component
│   │   ├── ContactForm.astro  # Contact form with validation
│   │   ├── Footer.astro       # Site footer
│   │   ├── Header.astro       # Navigation header
│   │   ├── Hero.astro         # Hero section
│   │   ├── NavLink.astro      # Navigation link
│   │   ├── Planet.astro       # Animated planet visual
│   │   ├── ProjectCard.astro  # Project showcase card
│   │   ├── Section.astro      # Reusable section wrapper
│   │   ├── SkillCard.astro    # Skill progress card
│   │   └── StarField.astro    # Parallax star background
│   ├── layouts/
│   │   └── Layout.astro       # Base page layout
│   ├── pages/
│   │   └── index.astro        # Home page
│   └── styles/
│       └── global.css         # Global styles & Tailwind
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
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

## Customization

### Colors
Edit `tailwind.config.mjs` to change the cosmic color palette:

```js
colors: {
  cosmic: {
    void: '#0a0a1a',    // Background
    purple: '#9d4edd',  // Accent
    cyan: '#00d4ff',    // Primary
    pink: '#ff6b9d',    // Secondary
  },
}
```

### Components
All components are in `src/components/` and can be easily customized:

- **Button** - Primary/secondary variants
- **ProjectCard** - Add your own projects
- **SkillCard** - Update skill levels
- **StarField** - Adjust star density

### Content
Edit `src/pages/index.astro` to update:
- Projects array
- Skills array
- About section cards
- Personal information

## Components

### StarField
Parallax star background with shooting stars:
```astro
<StarField />
```

### Hero
Hero section with animated content:
```astro
<Hero
  title="Your Title"
  subtitle="Subtitle"
  description="Description text"
/>
```

### Section
Reusable section wrapper:
```astro
<Section id="about" title="About" subtitle="Optional subtitle">
  <!-- Content -->
</Section>
```

### ProjectCard
Showcase your projects:
```astro
<ProjectCard
  title="Project Name"
  description="Project description"
  tags={['React', 'Node.js']}
/>
```

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1s
- **Zero client-side JS** by default (only what's needed)

## License

MIT License - Free for personal and commercial use.
