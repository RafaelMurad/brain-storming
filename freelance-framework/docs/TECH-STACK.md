# Technology Stack

This document explains our technology choices and the rationale behind them.

## Table of Contents
- [Overview](#overview)
- [Backend](#backend)
- [Frontend Web](#frontend-web)
- [Mobile](#mobile)
- [Styling](#styling)
- [State Management](#state-management)
- [Development Tools](#development-tools)

---

## Overview

Our stack is optimized for:
- **Developer Experience** - Fast feedback, great tooling
- **Type Safety** - Catch errors at compile time
- **Performance** - Optimized for speed and efficiency
- **Code Sharing** - Maximize reuse across platforms
- **Scalability** - Grow with the project needs

```
┌─────────────────────────────────────────────────────────────┐
│                     Technology Stack                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend Web     │  React 18, Next.js 14, Vite             │
│  Mobile           │  React Native, Expo SDK 50              │
│  Backend          │  Express.js, TypeScript                 │
│  Styling          │  Tailwind CSS, NativeWind               │
│  State            │  Zustand, React Query                   │
│  Validation       │  Zod                                     │
│  Animation        │  Framer Motion, Reanimated              │
│  Database         │  PostgreSQL, Redis                      │
│  Deployment       │  Vercel, Railway, EAS                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend

### Express.js + TypeScript

**Why Express.js?**
- Minimal, flexible, unopinionated
- Huge ecosystem of middleware
- Easy to understand and maintain
- Perfect for APIs of any size

**Why not Fastify/Hono/etc?**
- Express has better ecosystem maturity
- More resources and community support
- Performance difference negligible for most projects
- Team familiarity matters more than micro-benchmarks

### Project Setup

```bash
# Initialize
mkdir api && cd api
npm init -y
npm i express cors dotenv zod
npm i -D typescript @types/express @types/node ts-node nodemon

# tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Key Libraries

| Library | Purpose | Why |
|---------|---------|-----|
| **zod** | Validation | Type-safe, great DX, runtime + compile |
| **cors** | CORS handling | Standard, simple configuration |
| **helmet** | Security | Easy security headers |
| **morgan** | Logging | Request logging for debugging |
| **dotenv** | Config | Environment variables |

### Database Choices

**PostgreSQL** for:
- Complex queries and relationships
- ACID compliance needed
- Full-text search
- JSON storage with typing

**Redis** for:
- Session storage
- Caching
- Rate limiting
- Real-time features

**SQLite** for:
- Local development
- Small projects
- Embedded applications

---

## Frontend Web

### React 18

**Why React?**
- Component model is intuitive
- Huge ecosystem and community
- Easy to hire developers
- Great tooling (DevTools, testing)

**Key Features We Use:**
- Hooks for state and effects
- Server Components (Next.js)
- Suspense for loading states
- Concurrent rendering

### Next.js 14 vs Vite

**Use Next.js when:**
- SEO is important
- Need server-side rendering
- Building full-stack applications
- Complex routing requirements
- Need image optimization

**Use Vite when:**
- Building SPAs
- Dashboard/admin panels
- Internal tools
- Faster development iteration
- Simpler deployment needs

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Next.js 14 Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
};

export default nextConfig;
```

---

## Mobile

### React Native + Expo

**Why React Native?**
- Share code with web (logic, types, patterns)
- Native performance
- Strong ecosystem
- One team, multiple platforms

**Why Expo?**
- Faster development setup
- OTA updates
- EAS Build for CI/CD
- Rich SDK (camera, notifications, etc.)
- Expo Router for file-based navigation

### Expo SDK 50 Setup

```bash
# Create new project
npx create-expo-app@latest my-app --template tabs

# Key dependencies
npx expo install expo-router react-native-safe-area-context
npx expo install zustand @react-native-async-storage/async-storage
npx expo install nativewind tailwindcss
npx expo install react-native-reanimated
```

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx       # Root layout
├── index.tsx         # Home (/)
├── (tabs)/           # Tab group
│   ├── _layout.tsx   # Tab navigation
│   ├── home.tsx      # /home
│   └── profile.tsx   # /profile
├── settings/
│   ├── index.tsx     # /settings
│   └── [id].tsx      # /settings/123
└── +not-found.tsx    # 404 page
```

### When to Eject

Consider ejecting or using development builds when:
- Need custom native modules
- Require specific native SDK integration
- Performance-critical features
- Need to modify native code directly

---

## Styling

### Tailwind CSS

**Why Tailwind?**
- Utility-first = faster development
- Consistent design tokens
- No context switching
- Great responsive design support
- Smaller CSS bundles (purged)

**Configuration:**

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### NativeWind (React Native)

Same Tailwind classes in React Native:

```typescript
// Works in React Native with NativeWind
<View className="flex-1 bg-white p-4">
  <Text className="text-xl font-bold text-gray-900">
    Hello World
  </Text>
</View>
```

### CSS Variables for Theming

```css
/* globals.css */
:root {
  --color-primary: 14 165 233;
  --color-background: 255 255 255;
  --color-text: 15 23 42;
}

.dark {
  --color-primary: 56 189 248;
  --color-background: 15 23 42;
  --color-text: 248 250 252;
}
```

---

## State Management

### Zustand

**Why Zustand over Redux/MobX?**
- Minimal boilerplate
- No providers needed
- TypeScript-first
- Tiny bundle size (1KB)
- Simple mental model

**Basic Store:**

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

**With Persistence:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
    }
  )
);
```

### React Query (TanStack Query)

For server state:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.get('/users'),
});

// Mutate data
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (newUser) => api.post('/users', newUser),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

---

## Development Tools

### Essential Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Primary editor |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |

### VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "usernamehw.errorlens"
  ]
}
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Deployment

### Web (Vercel)

Best for Next.js projects:

```bash
# Deploy
npx vercel

# Environment variables
npx vercel env add
```

### API (Railway)

Best for Node.js APIs:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Mobile (EAS)

```bash
# Build for stores
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android

# OTA updates
eas update --branch production
```

---

## Version Requirements

| Technology | Minimum | Recommended |
|------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| TypeScript | 5.0 | 5.3+ |
| React | 18.2 | 18.2+ |
| Next.js | 14.0 | 14.1+ |
| Expo SDK | 50 | 50+ |
