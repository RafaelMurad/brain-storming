# UX Portfolio Platform

A professional, interactive portfolio platform for UX researchers and UX/UI designers. Built with Next.js 14, featuring stunning animations, case study templates, and modern design patterns.

## Features

### Interactive Design
- **Custom Cursor** - Animated cursor that responds to hoverable elements
- **Smooth Scroll Animations** - Elements animate as they enter the viewport
- **Parallax Effects** - Subtle depth effects on scroll
- **Page Transitions** - Smooth transitions between pages
- **Micro-interactions** - Hover effects, button animations, and more

### Case Study Features
- **Process Timeline** - Visual representation of design process phases
- **Metrics Display** - Animated counters showing project impact
- **Image Gallery** - Masonry grid with lightbox viewer
- **Testimonials** - Client quotes with avatars
- **Next Project CTA** - Easy navigation between projects

### Professional Pages
- **Home** - Hero section, featured work, services, and CTA
- **Work** - Filterable project grid with categories
- **Case Study** - Detailed project pages with rich content
- **About** - Bio, experience, skills, and services
- **Contact** - Interactive form with validation

### Modern Tech Stack
- **Next.js 14** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Production-ready animations
- **Responsive Design** - Mobile-first approach

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3007](http://localhost:3007)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── work/
│   │   ├── page.tsx       # Work listing
│   │   └── [slug]/        # Dynamic case study pages
│   ├── about/page.tsx     # About page
│   └── contact/page.tsx   # Contact page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Navigation.tsx
│   │   └── CustomCursor.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── FeaturedWork.tsx
│   │   ├── Services.tsx
│   │   └── CTA.tsx
│   └── case-study/        # Case study components
│       ├── ProcessTimeline.tsx
│       ├── MetricsGrid.tsx
│       └── ImageGallery.tsx
├── data/
│   └── portfolio.ts       # Portfolio content
├── hooks/
│   └── useScrollAnimation.ts
├── lib/
│   └── utils.ts           # Utility functions
└── styles/
    └── globals.css        # Global styles
```

## Customization

### Edit Portfolio Content
Modify `src/data/portfolio.ts`:
- Profile information (name, bio, avatar)
- Case studies (title, images, metrics, process)
- Services list
- Social links

### Change Theme Colors
Edit `tailwind.config.js`:
```js
colors: {
  ux: {
    primary: '#6366f1',   // Main accent color
    secondary: '#a855f7', // Secondary accent
    accent: '#06b6d4',    // Tertiary accent
    // ... other colors
  }
}
```

### Add New Case Studies
1. Add entry to `caseStudies` array in `src/data/portfolio.ts`
2. Include: slug, title, images, process steps, metrics
3. Page is auto-generated at `/work/[slug]`

## Design Highlights

### Typography
- Display font for headings
- Body font for content
- Monospace for code/labels

### Animations
- Scroll-triggered reveals
- Staggered children animations
- Hover state transitions
- Page transitions

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Focus indicators

## Performance

- Server-side rendering
- Image optimization via Next.js
- Code splitting
- Lazy loading

## Deployment

### Vercel (Recommended)
```bash
npx vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## Inspiration

This platform follows modern UX portfolio best practices:
- Story-driven case studies
- Process visualization
- Quantifiable results
- Clean, distraction-free design
- Mobile-first responsive layout

## License

MIT License

---

Built for UX designers who want to showcase their work professionally.
