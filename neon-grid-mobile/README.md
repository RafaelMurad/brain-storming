# NeonGrid Mobile

A React Native portfolio app with a cyberpunk/neon aesthetic, built with Expo.

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Router**: Expo Router v3
- **Styling**: NativeWind (Tailwind for React Native)
- **Animations**: React Native Reanimated
- **Language**: TypeScript

## Features

- 🔮 Animated grid background with pulse effect
- ⚡ Glitch text effects
- 💜 Cyberpunk color theme (magenta, cyan, purple)
- 🖥️ Animated terminal component
- 📊 Animated skill progress bars
- 🌃 Dark mode optimized

## Project Structure

```
neon-grid-mobile/
├── app/
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Home screen
├── components/
│   ├── GridBackground.tsx   # Animated grid lines
│   ├── GlitchText.tsx       # Glitch text effect
│   ├── NeonButton.tsx       # Neon gradient button
│   ├── ProjectCard.tsx      # Project display card
│   ├── Section.tsx          # Section wrapper
│   ├── SkillBar.tsx         # Animated skill bar
│   └── Terminal.tsx         # Terminal animation
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

### NeonButton
```tsx
<NeonButton title="Initialize" onPress={() => {}} />
<NeonButton title="Scan" onPress={() => {}} variant="outline" />
```

### Section
```tsx
<Section title="Projects" code="PRJ_002">
  {/* Content */}
</Section>
```

### GlitchText
```tsx
<GlitchText text="NEON" style={{ fontSize: 72 }} />
```

### Terminal
```tsx
<Terminal lines={['loading...', 'system ready.']} />
```

### SkillBar
```tsx
<SkillBar name="TypeScript" level={95} category="LANG" />
```

## Customization

Edit `constants/theme.ts` to change:
- Color palette (neon.magenta, neon.cyan, etc.)
- Projects data
- Skills data
- Stats data

## License

MIT License
