# Mobile Expo Template

React Native application with Expo SDK 50, Expo Router, and NativeWind.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

Press `i` for iOS, `a` for Android, or `w` for web.

## Project Structure

```
├── app/                  # Expo Router pages
│   ├── _layout.tsx      # Root layout
│   ├── (tabs)/          # Tab navigation
│   │   ├── _layout.tsx  # Tab layout
│   │   ├── index.tsx    # Home screen
│   │   ├── profile.tsx  # Profile screen
│   │   └── settings.tsx # Settings screen
│   └── modal.tsx        # Modal screen
├── components/          # React Native components
│   ├── Button.tsx
│   └── Card.tsx
├── store/               # Zustand store
│   └── appStore.ts
├── lib/                 # Utilities
│   └── utils.ts
└── assets/              # Images and fonts
```

## Available Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Start Android
- `npm run ios` - Start iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Features

- **Expo SDK 50** - Latest Expo features
- **Expo Router v3** - File-based navigation
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management with AsyncStorage
- **Reanimated** - Smooth animations
- **TypeScript** - Full type safety

## Adding New Screens

1. Create file in `app/` directory
2. File name becomes the route (e.g., `profile.tsx` → `/profile`)
3. For tabs, add to `app/(tabs)/`

## State Management

```typescript
import { useAppStore } from '@/store/appStore';

function Component() {
  const { user, setUser, theme, setTheme } = useAppStore();
  // State persists to AsyncStorage
}
```

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

## Environment Variables

Create `.env` for environment variables:

```
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Access in code: `process.env.EXPO_PUBLIC_API_URL`
