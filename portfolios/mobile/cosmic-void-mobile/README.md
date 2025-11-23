# Cosmic Void Mobile

A React Native portfolio app with a deep space/cosmos theme, built with Expo.

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Router**: Expo Router v3
- **Styling**: NativeWind (Tailwind for React Native)
- **Animations**: React Native Reanimated
- **Language**: TypeScript

## Features

- 🌟 Animated star field background
- 🎨 Cosmic color theme (purple, cyan, pink)
- 📱 Smooth animations with Reanimated
- 🧩 Reusable components (Button, Section, ProjectCard, SkillBar)
- 📊 Animated skill progress bars
- 🌙 Dark theme optimized

## Project Structure

```
cosmic-void-mobile/
├── app/
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Home screen
├── components/
│   ├── Button.tsx       # Gradient button
│   ├── ProjectCard.tsx  # Project display card
│   ├── Section.tsx      # Section wrapper
│   ├── SkillBar.tsx     # Animated skill bar
│   └── StarField.tsx    # Animated star background
├── constants/
│   └── theme.ts         # Colors, fonts, data
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

### Button
```tsx
<Button title="View Work" onPress={() => {}} variant="primary" />
<Button title="Contact" onPress={() => {}} variant="secondary" />
```

### Section
```tsx
<Section title="About" subtitle="Learn more about me">
  {/* Content */}
</Section>
```

### ProjectCard
```tsx
<ProjectCard
  title="Project Name"
  description="Project description"
  tags={['React', 'Node.js']}
/>
```

### SkillBar
```tsx
<SkillBar name="TypeScript" level={95} icon="⟨/⟩" />
```

## Customization

Edit `constants/theme.ts` to change:
- Color palette
- Projects data
- Skills data

## License

MIT License
