# Nordic Minimal Mobile

A React Native portfolio app with clean Scandinavian design, built with Expo.

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Router**: Expo Router v3
- **Styling**: NativeWind (Tailwind for React Native)
- **Animations**: React Native Reanimated
- **Language**: TypeScript

## Features

- ✨ Clean, minimal aesthetic
- 📐 Scandinavian design principles
- 🎨 Muted color palette (snow, frost, charcoal)
- 📊 Subtle animated skill bars
- 📱 Light theme optimized
- 🧩 Reusable components

## Project Structure

```
nordic-minimal-mobile/
├── app/
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Home screen
├── components/
│   ├── Divider.tsx      # Section dividers
│   ├── MinimalButton.tsx    # Clean button styles
│   ├── ProjectCard.tsx  # Project display
│   ├── Section.tsx      # Section wrapper
│   ├── SkillBar.tsx     # Animated progress
│   └── ValueCard.tsx    # Value/principle card
├── constants/
│   └── theme.ts         # Colors, data
├── assets/              # App icons and splash
├── app.json             # Expo config
├── package.json
└── tsconfig.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Components

### MinimalButton
```tsx
<MinimalButton title="View Work" onPress={() => {}} />
<MinimalButton title="About" onPress={() => {}} variant="secondary" />
<MinimalButton title="Learn more" onPress={() => {}} variant="text" />
```

### Section
```tsx
<Section subtitle="Philosophy" title="Design Principles" centered>
  {/* Content */}
</Section>
```

### ValueCard
```tsx
<ValueCard
  title="Simplicity"
  description="Less is more."
  icon="○"
/>
```

### Divider
```tsx
<Divider />
<Divider withSymbol />
```

## Design Philosophy

This app follows Nordic design principles:
- **Simplicity**: Every element serves a purpose
- **Quality**: Attention to detail in typography and spacing
- **Sustainability**: Clean code, maintainable structure

## Customization

Edit `constants/theme.ts` to change:
- Color palette (nordic.snow, nordic.charcoal, etc.)
- Projects data
- Skills data
- Values/principles

## License

MIT License
