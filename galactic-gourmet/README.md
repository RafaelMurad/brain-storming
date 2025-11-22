# GalacticGourmet Portfolio

A stunning space + culinary fusion themed developer portfolio built with SolidJS, TypeScript, and Tailwind CSS.

## Theme

GalacticGourmet combines the elegance of fine dining with the wonder of the cosmos. Skills are presented as menu items, projects as signature recipes, and the contact form as a reservation system.

### Color Palette

- **Gold** (`#d4af37`) - Primary accent, represents luxury and excellence
- **Burgundy** (`#722f37`) - Secondary accent, represents warmth and passion
- **Space Black** (`#0a0a12`) - Background, represents the cosmic void
- **Cream** (`#fef9e7`) - Text, represents elegance and readability

## Features

- Floating food emoji animations with orbit effects
- Restaurant menu-style skills presentation
- Recipe card format for projects
- Reservation-themed contact form
- Star decorations and constellation patterns
- Responsive design for all devices
- Smooth scroll navigation
- Interactive hover effects with gold accents

## Tech Stack

- **Framework**: SolidJS
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Fonts**: Playfair Display (serif), Montserrat (sans-serif)

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
galactic-gourmet/
├── public/
│   └── favicon.svg          # Star + chef hat logo
├── src/
│   ├── components/
│   │   ├── Header.tsx       # Navigation with star logo
│   │   ├── Hero.tsx         # Floating foods & orbit animation
│   │   ├── Section.tsx      # Reusable section wrapper
│   │   ├── About.tsx        # "The Chef" section
│   │   ├── Skills.tsx       # "The Menu" - skills as dishes
│   │   ├── Projects.tsx     # "Signature Recipes" section
│   │   ├── Contact.tsx      # "Reservations" contact form
│   │   ├── Footer.tsx       # Site footer
│   │   └── Button.tsx       # Reusable button component
│   ├── styles/
│   │   └── index.css        # Global styles & Tailwind
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── postcss.config.js
```

## Sections

### The Chef (About)
Personal introduction with culinary philosophy cards highlighting approach to development.

### The Menu (Skills)
Technical skills organized as restaurant menu categories:
- **Appetizers**: Frontend technologies
- **Main Course**: Backend technologies
- **Sides**: DevOps & tools
- **Desserts**: Testing, UI/UX, Agile

### Signature Recipes (Projects)
Projects presented as recipe cards with:
- Cooking time (development duration)
- Difficulty rating
- Servings (user reach)
- Ingredients (tech stack)

### Reservations (Contact)
Contact form styled as restaurant reservation with:
- Project size selection
- Timeline picker
- Special requests textarea

## Customization

### Adding New Skills
Edit `src/components/Skills.tsx` and add items to the appropriate menu category.

### Adding New Projects
Edit `src/components/Projects.tsx` and add new project objects to the `projects` array.

### Changing Colors
Update the color values in `tailwind.config.js` under `theme.extend.colors`.

## License

MIT License - Feel free to use this template for your own portfolio!

---

*"Crafting stellar digital experiences with the precision of a master chef"*
