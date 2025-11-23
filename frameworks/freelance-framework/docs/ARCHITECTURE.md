# Architecture Guide

This document outlines the architectural patterns and decisions used across all projects.

## Table of Contents
- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Mobile Architecture](#mobile-architecture)
- [State Management](#state-management)
- [API Design](#api-design)

---

## System Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Web App    │  │ Mobile App  │  │  Admin Panel    │  │
│  │  (React)    │  │ (Expo)      │  │  (Next.js)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Express.js API                      │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │    │
│  │  │ Routes  │→ │ Services│→ │ Data Access     │  │    │
│  │  └─────────┘  └─────────┘  └─────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │    Redis     │  │  S3 Storage  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Dependency Injection** - Services are injected, making testing easier
3. **Interface-First** - Define contracts before implementations
4. **Fail Fast** - Validate early, handle errors gracefully

---

## Backend Architecture

### Directory Structure

```
src/
├── index.ts              # Entry point, server setup
├── routes/               # Route definitions
│   ├── index.ts          # Route aggregator
│   ├── users.ts          # User routes
│   └── projects.ts       # Project routes
├── services/             # Business logic
│   ├── userService.ts    # User operations
│   └── projectService.ts # Project operations
├── middleware/           # Express middleware
│   ├── auth.ts           # Authentication
│   ├── validate.ts       # Request validation
│   └── errorHandler.ts   # Error handling
├── data/                 # Data access layer
│   ├── repositories/     # Database queries
│   └── cache/            # Caching logic
├── types/                # TypeScript types
│   ├── api.ts            # API request/response types
│   └── models.ts         # Domain models
├── utils/                # Utility functions
│   └── helpers.ts
└── config/               # Configuration
    └── index.ts
```

### Service Pattern

Services encapsulate business logic and are the only layer that can:
- Access the database
- Call external APIs
- Perform complex calculations

```typescript
// services/gameService.ts
export class GameService {
  async createSession(userId: string): Promise<GameSession> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const session = {
      id: generateId(),
      userId,
      startedAt: new Date(),
      questions: await this.generateQuestions(),
    };

    return this.sessionRepository.create(session);
  }
}
```

### Error Handling

All errors extend a base `AppError` class:

```typescript
// middleware/errorHandler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

---

## Frontend Architecture

### Directory Structure (React)

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── [feature]/        # Feature pages
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── sections/         # Page sections
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── store/                # State management
│   └── appStore.ts       # Zustand store
├── lib/                  # Libraries and utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript types
│   └── index.ts
└── styles/               # Global styles
    └── globals.css
```

### Component Pattern

Components follow a consistent structure:

```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          variants[variant],
          sizes[size],
          loading && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## Mobile Architecture

### Directory Structure (Expo)

```
app/                      # Expo Router pages
├── _layout.tsx           # Root layout with providers
├── index.tsx             # Home screen
├── (tabs)/               # Tab navigation
│   ├── _layout.tsx
│   ├── home.tsx
│   └── profile.tsx
└── [feature]/            # Feature screens
components/               # React Native components
├── ui/                   # Reusable UI
└── features/             # Feature-specific
hooks/                    # Custom hooks
store/                    # Zustand stores
lib/                      # Utilities
types/                    # TypeScript types
```

### Navigation Pattern

Using Expo Router for file-based navigation:

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Providers>
    </GestureHandlerRootView>
  );
}
```

---

## State Management

### Zustand Store Pattern

```typescript
// store/appStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  reset: () => void;
}

const initialState = {
  user: null,
  theme: 'dark' as const,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      reset: () => set(initialState),
    }),
    {
      name: 'app-storage',
      // For React Native:
      storage: createJSONStorage(() => AsyncStorage),
      // For Web:
      // storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);
```

### When to Use What

| State Type | Solution |
|------------|----------|
| UI State (forms, modals) | React useState |
| Shared App State | Zustand |
| Server State | React Query / SWR |
| URL State | Router params |

---

## API Design

### RESTful Endpoints

```
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create user
GET    /api/v1/users/:id      # Get user
PATCH  /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user

# Nested resources
GET    /api/v1/users/:id/projects
POST   /api/v1/users/:id/projects

# Actions
POST   /api/v1/sessions/:id/submit    # Custom action
```

### Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}

// Paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Request Validation with Zod

```typescript
// routes/users.ts
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

router.post('/users', async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
```

---

## Scaling Considerations

### Horizontal Scaling
- Stateless API servers behind load balancer
- Session storage in Redis
- Database read replicas

### Caching Strategy
- API response caching with Redis
- CDN for static assets
- Client-side caching with React Query

### Performance Optimization
- Database query optimization
- Lazy loading / code splitting
- Image optimization
- Compression (gzip/brotli)
