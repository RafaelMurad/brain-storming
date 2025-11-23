# Rafael's Freelance Framework

A comprehensive framework for bootstrapping new applications, projects, and creative ideas. This framework captures all architectural decisions, technical patterns, and best practices developed through real-world project experience.

## Quick Start

```bash
# Bootstrap a new API project
cp -r templates/api my-new-api
cd my-new-api && npm install

# Bootstrap a new React web app
cp -r templates/web-react my-new-web
cd my-new-web && npm install

# Bootstrap a new Next.js app
cp -r templates/web-nextjs my-new-nextjs
cd my-new-nextjs && npm install

# Bootstrap a new Mobile app
cp -r templates/mobile-expo my-new-mobile
cd my-new-mobile && npm install
```

## Framework Structure

```
freelance-framework/
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System architecture patterns
│   ├── CONVENTIONS.md       # Coding conventions & standards
│   ├── PATTERNS.md          # Design patterns we use
│   ├── TECH-STACK.md        # Technology choices & rationale
│   └── WORKFLOWS.md         # Development workflows
├── templates/               # Project templates
│   ├── api/                 # Express.js API template
│   ├── web-react/           # React + Vite template
│   ├── web-nextjs/          # Next.js 14 template
│   └── mobile-expo/         # React Native + Expo template
├── shared/                  # Shared code & assets
│   ├── hooks/               # Reusable React hooks
│   ├── utils/               # Utility functions
│   ├── design-tokens/       # Design system tokens
│   └── types/               # Shared TypeScript types
└── scripts/                 # Automation scripts
```

## Core Principles

### 1. Type Safety First
All projects use TypeScript with strict configuration. Runtime validation with Zod for API boundaries.

### 2. Component-Based Architecture
Modular, reusable components following consistent patterns across web and mobile.

### 3. Design System Driven
Shared design tokens ensure visual consistency across all platforms.

### 4. Developer Experience
Fast feedback loops, hot reloading, clear error messages, and comprehensive documentation.

### 5. Performance by Default
Optimized configurations, lazy loading, code splitting, and efficient state management.

## Tech Stack Overview

| Layer | Technology | Why |
|-------|------------|-----|
| **Backend** | Express.js + TypeScript | Simple, flexible, great ecosystem |
| **Web** | React 18 / Next.js 14 | Component model, SSR, industry standard |
| **Mobile** | React Native + Expo | Code sharing, native performance |
| **Styling** | Tailwind CSS / NativeWind | Utility-first, consistent across platforms |
| **State** | Zustand | Simple, performant, TypeScript-friendly |
| **Validation** | Zod | Runtime type safety, great DX |
| **Animation** | Framer Motion / Reanimated | Declarative, powerful |

## Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - System design patterns and decisions
- **[Conventions](./docs/CONVENTIONS.md)** - Coding standards and naming conventions
- **[Patterns](./docs/PATTERNS.md)** - Common design patterns we use
- **[Tech Stack](./docs/TECH-STACK.md)** - Technology choices and rationale
- **[Workflows](./docs/WORKFLOWS.md)** - Development and deployment workflows

## Project Templates

### API Template
Express.js backend with TypeScript, Zod validation, service-based architecture, and OpenAPI documentation.

### Web React Template
React 18 with Vite, Tailwind CSS, Zustand state management, and React Query for server state.

### Web Next.js Template
Next.js 14 with App Router, Server Components, Framer Motion animations, and modern patterns.

### Mobile Expo Template
React Native with Expo SDK 50, Expo Router v3, NativeWind styling, and Zustand state management.

## Shared Resources

### Design Tokens
Consistent colors, typography, spacing, and animation values across all platforms.

### Utility Functions
Common helpers for dates, formatting, validation, and more.

### Custom Hooks
Reusable React hooks for common patterns like local storage, debouncing, and media queries.

### TypeScript Types
Shared type definitions for consistent interfaces across projects.

## License

MIT - Free for personal and commercial use.

---

**Built with experience from real projects. Designed for rapid, quality development.**
