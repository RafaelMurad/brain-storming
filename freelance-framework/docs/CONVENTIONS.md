# Coding Conventions

This document defines the coding standards and naming conventions used across all projects.

## Table of Contents
- [General Principles](#general-principles)
- [TypeScript Conventions](#typescript-conventions)
- [React Conventions](#react-conventions)
- [File Naming](#file-naming)
- [Code Style](#code-style)
- [Comments & Documentation](#comments--documentation)

---

## General Principles

### 1. Clarity Over Cleverness
Write code that's easy to understand. Avoid clever one-liners that sacrifice readability.

```typescript
// ❌ Clever but hard to read
const result = arr.reduce((a, c) => (c.active ? { ...a, [c.id]: c } : a), {});

// ✅ Clear and readable
const result: Record<string, Item> = {};
for (const item of arr) {
  if (item.active) {
    result[item.id] = item;
  }
}
```

### 2. Explicit Over Implicit
Be explicit about types, return values, and intentions.

```typescript
// ❌ Implicit
function process(data) {
  return data?.items?.map(x => x.value);
}

// ✅ Explicit
function processItems(data: ApiResponse | null): number[] {
  if (!data?.items) {
    return [];
  }
  return data.items.map((item) => item.value);
}
```

### 3. Single Responsibility
Each function, component, and module should do one thing well.

### 4. DRY (Don't Repeat Yourself)
Extract common logic, but don't over-abstract. Rule of three: abstract after seeing the same code three times.

---

## TypeScript Conventions

### Type Definitions

```typescript
// Use interfaces for objects that can be extended
interface User {
  id: string;
  email: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use types for unions, intersections, and primitives
type Status = 'pending' | 'active' | 'completed';
type ID = string | number;
type UserWithStatus = User & { status: Status };

// Use enums sparingly, prefer const objects
const Status = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

type StatusType = typeof Status[keyof typeof Status];
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |
| Functions | camelCase | `getUserById`, `formatDate` |
| Types/Interfaces | PascalCase | `User`, `ApiResponse` |
| Components | PascalCase | `UserCard`, `NavigationMenu` |
| Files (components) | PascalCase | `UserCard.tsx` |
| Files (utilities) | camelCase | `formatters.ts` |
| Hooks | use + PascalCase | `useLocalStorage` |

### Function Signatures

```typescript
// Always type parameters and return values
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Use arrow functions for callbacks
const activeUsers = users.filter((user) => user.isActive);

// Use function declarations for top-level functions
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### Async Functions

```typescript
// Always handle errors
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
}

// Use try-catch at the boundary
async function handleUserFetch(id: string): Promise<User | null> {
  try {
    return await fetchUser(id);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
```

---

## React Conventions

### Component Structure

```typescript
// 1. Imports (external, then internal)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

// 2. Types
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

// 3. Component
export function UserCard({ user, onEdit, className }: UserCardProps) {
  // 3a. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Derived values
  const fullName = `${user.firstName} ${user.lastName}`;

  // 3c. Effects
  useEffect(() => {
    // Effect logic
  }, [user.id]);

  // 3d. Event handlers
  const handleEdit = () => {
    onEdit?.(user);
  };

  // 3e. Render
  return (
    <div className={cn('card', className)}>
      <h3>{fullName}</h3>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  );
}
```

### Props Pattern

```typescript
// Use destructuring with defaults
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  // ...
}

// Spread remaining props to root element
<button {...props} className={className}>
  {children}
</button>
```

### Conditional Rendering

```typescript
// Use early returns for simple conditions
if (!user) {
  return <EmptyState />;
}

// Use ternary for inline conditionals
return (
  <div>
    {isLoading ? <Spinner /> : <Content />}
  </div>
);

// Use && for simple presence checks
return (
  <div>
    {error && <ErrorMessage error={error} />}
  </div>
);
```

### Event Handlers

```typescript
// Name with 'handle' prefix
const handleClick = () => { ... };
const handleSubmit = (e: FormEvent) => { ... };
const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { ... };

// Props use 'on' prefix
interface Props {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  onChange?: (value: string) => void;
}
```

---

## File Naming

### Directory Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # PascalCase for components
│   │   ├── Button.test.tsx     # Tests alongside
│   │   └── index.ts            # Barrel exports
│   └── features/
│       └── UserProfile/
│           ├── UserProfile.tsx
│           ├── UserProfile.test.tsx
│           └── index.ts
├── hooks/
│   └── useLocalStorage.ts      # camelCase for hooks
├── lib/
│   ├── utils.ts                # camelCase for utilities
│   └── api.ts
├── types/
│   └── index.ts                # Central type definitions
└── styles/
    └── globals.css
```

### Import Order

```typescript
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { motion } from 'framer-motion';
import { z } from 'zod';

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// 4. Internal relative imports
import { UserAvatar } from './UserAvatar';
import type { User } from './types';

// 5. Styles
import './styles.css';
```

---

## Code Style

### Formatting (Prettier)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Linting (ESLint)

Key rules:
- `no-unused-vars`: error
- `prefer-const`: error
- `no-console`: warn (allow in development)
- `@typescript-eslint/explicit-function-return-type`: off (except for exported functions)
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn

### String Formatting

```typescript
// Use template literals for interpolation
const message = `Hello, ${user.name}!`;

// Use single quotes for simple strings
const status = 'active';

// Use template literals for multi-line
const query = `
  SELECT *
  FROM users
  WHERE status = 'active'
`;
```

---

## Comments & Documentation

### When to Comment

```typescript
// ✅ Explain WHY, not WHAT
// Using setTimeout to debounce rapid user input and avoid
// excessive API calls during typing
const debouncedSearch = useMemo(() => {
  return debounce(searchUsers, 300);
}, []);

// ✅ Document complex algorithms
// Fisher-Yates shuffle for unbiased random ordering
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ✅ Mark TODOs with context
// TODO(rafael): Implement pagination when user count exceeds 1000
// See: https://github.com/project/issues/123

// ❌ Don't state the obvious
// Increment counter by 1
counter++;
```

### JSDoc for Public APIs

```typescript
/**
 * Formats a number as currency.
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, 'EUR') // '€1,234.56'
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

---

## Git Conventions

### Commit Messages

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, semicolons)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add OAuth2 login with Google
fix(api): handle null response in user fetch
docs(readme): update installation instructions
refactor(hooks): extract useDebounce from useSearch
```

### Branch Naming

```
feature/user-authentication
bugfix/login-redirect-loop
hotfix/critical-security-patch
chore/update-dependencies
```
