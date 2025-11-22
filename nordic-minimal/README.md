# Nordic Minimal

A clean, Scandinavian-inspired portfolio template built with Astro, TypeScript, and Tailwind CSS. This design emphasizes simplicity, whitespace, and purposeful interactions.

## Design Philosophy

Nordic Minimal follows core Scandinavian design principles:

- **Simplicity** - Every element serves a purpose
- **Function** - Beautiful solutions that work seamlessly
- **Craft** - Attention to detail at every level
- **Balance** - Harmony between aesthetics and performance

## Features

- Clean, minimal design with lots of whitespace
- Smooth scroll animations with Intersection Observer
- Responsive grid layouts (12-column system)
- Sticky section headers for better navigation
- Animated skill bars
- Clean contact form with validation
- Mobile-friendly navigation
- Subtle hover effects and transitions
- Geometric decorative elements

## Tech Stack

- **Framework**: [Astro](https://astro.build) v4
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v3
- **Language**: TypeScript
- **Fonts**: Inter, Space Grotesk, JetBrains Mono

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Off White | `#fafafa` | Background |
| Black | `#0a0a0a` | Primary text |
| Accent Blue | `#0066ff` | Interactive elements |
| Gray scale | `#f8f9fa` - `#202124` | Secondary elements |

## Project Structure

```
nordic-minimal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── About.astro
│   │   ├── Button.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── Projects.astro
│   │   ├── Section.astro
│   │   └── Skills.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd nordic-minimal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally before deploying |

## Customization

### Colors

Edit `tailwind.config.mjs` to modify the color palette:

```js
colors: {
  nordic: {
    white: '#fafafa',    // Background
    black: '#0a0a0a',    // Text
    accent: {
      DEFAULT: '#0066ff', // Primary accent
    },
  },
}
```

### Typography

The template uses three font families:

- **Inter** - Body text
- **Space Grotesk** - Headings and display text
- **JetBrains Mono** - Code and numbers

Modify in `tailwind.config.mjs` under `fontFamily`.

### Content

Update content directly in the component files:

- `Hero.astro` - Main headline and stats
- `About.astro` - Philosophy cards and intro
- `Projects.astro` - Project data array
- `Skills.astro` - Skill categories and levels
- `Contact.astro` - Contact form and info

## Sections

1. **Header** - Fixed navigation with mobile menu
2. **Hero** - Large headline with geometric shapes
3. **About** - Philosophy cards and introduction
4. **Projects** - Featured work with hover effects
5. **Skills** - Categorized skills with progress bars
6. **Contact** - Form and alternative contact methods
7. **Footer** - Social links and navigation

## Animations

The template includes subtle animations:

- Fade in on scroll (Intersection Observer)
- Staggered list animations
- Skill bar fill animations
- Hover lift effects
- Line drawing effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for personal or commercial projects.

---

Designed with Scandinavian simplicity.
