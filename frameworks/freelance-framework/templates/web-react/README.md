# React Web Template

Modern React application with Vite, TypeScript, Tailwind CSS, and Zustand.

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
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Layout.tsx       # Main layout
│   └── Navigation.tsx   # Navigation component
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── NotFoundPage.tsx
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── store/               # Zustand store
│   └── appStore.ts
├── lib/                 # Utilities
│   └── utils.ts
├── styles/              # Global styles
│   └── globals.css
├── App.tsx              # App component with routes
└── main.tsx             # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm test` - Run tests

## Features

- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Simple state management
- **React Router** - Client-side routing

## Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navigation.tsx`

## State Management

Using Zustand for global state:

```typescript
import { useAppStore } from '@/store/appStore';

function Component() {
  const { user, setUser } = useAppStore();
  // ...
}
```

## Styling

Using Tailwind CSS with custom theme in `tailwind.config.js`.
Global styles and components in `src/styles/globals.css`.

## Environment Variables

Create `.env.local` for local development:

```
VITE_API_URL=http://localhost:3001
```
