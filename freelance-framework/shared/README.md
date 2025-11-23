# Shared Resources

Reusable code and assets that can be copied into any project.

## Contents

### Design Tokens (`design-tokens/`)
Consistent design values across all platforms:
- **colors.ts** - Color palette, themes, and CSS variables
- **typography.ts** - Font families, sizes, and text styles
- **spacing.ts** - Spacing scale and layout values
- **animations.ts** - Durations, easings, and motion variants

### Hooks (`hooks/`)
Reusable React hooks for web and mobile:
- **useDebounce** - Debounce a value
- **useLocalStorage** - Sync state with localStorage
- **useMediaQuery** - Respond to media queries
- **useOnClickOutside** - Detect clicks outside an element

### Utils (`utils/`)
Common utility functions:
- **formatters.ts** - Currency, date, number formatting
- **helpers.ts** - General helpers (cn, debounce, etc.)

### Types (`types/`)
Shared TypeScript types:
- **api.ts** - API request/response types
- **common.ts** - Common entity and utility types

## Usage

Copy the files you need into your project:

```bash
# Copy all design tokens
cp -r shared/design-tokens/ my-project/src/

# Copy specific hooks
cp shared/hooks/useDebounce.ts my-project/src/hooks/

# Copy all utils
cp -r shared/utils/ my-project/src/lib/
```

## Why Copy Instead of Package?

1. **Flexibility** - Modify for project needs
2. **No dependencies** - No version conflicts
3. **Full control** - Easy to customize
4. **Smaller bundles** - Only include what you use
