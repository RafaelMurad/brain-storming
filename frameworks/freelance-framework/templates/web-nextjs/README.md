# Next.js Web Template

Modern Next.js 14 application with App Router, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── globals.css      # Global styles
│   ├── about/page.tsx   # About page
│   ├── contact/page.tsx # Contact page
│   └── not-found.tsx    # 404 page
├── components/          # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ContactForm.tsx
└── lib/                 # Utilities
    └── utils.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Features

- **Next.js 14** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **SEO Optimized** - Metadata API for SEO
- **Responsive** - Mobile-first design

## Adding New Pages

1. Create folder in `src/app/`
2. Add `page.tsx` with your component
3. Optionally add `layout.tsx` for nested layouts

## Environment Variables

Create `.env.local` for local development:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel
```
