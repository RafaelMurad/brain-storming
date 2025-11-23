# Creative Framework App

A comprehensive web application for learning creative frameworks, understanding creative flows, discovering creativity patterns, and boosting ideation with AI-powered tools.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [Components Reference](#components-reference)
- [Styling System](#styling-system)
- [Adding New Content](#adding-new-content)
- [State Management](#state-management)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Overview

### Purpose
This app serves as an educational platform for anyone wanting to enhance their creative thinking abilities. It provides:

1. **Learning Resources**: Detailed explanations of proven creativity methodologies
2. **Interactive Tools**: Hands-on exercises to practice creative thinking
3. **AI Integration**: Prompt templates that users can copy and use with AI assistants (ChatGPT, Claude, etc.)

### Target Users
- Designers and UX professionals
- Product managers and innovators
- Entrepreneurs and startup founders
- Students learning about creativity
- Anyone wanting to boost their creative thinking

### Core Features
| Feature | Description | Location |
|---------|-------------|----------|
| Frameworks Library | 10+ creativity methodologies with steps, tips, and use cases | `/src/data/frameworks.ts` |
| Creative Flows | 4 creative process models with phases and activities | `/src/data/flows.ts` |
| Creativity Patterns | 8 patterns that drive creative breakthroughs | `/src/data/flows.ts` |
| AI Idea Generator | 10 customizable prompt templates | `/src/data/ai-prompts.ts` |
| Interactive Exercises | 5 guided creativity exercises with timer | `/src/components/ExercisesSection.tsx` |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Lucide React | 0.294.x | Icon library |
| Framer Motion | 10.x | Animations (configured, not heavily used yet) |

### Key Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.294.0",
  "framer-motion": "^10.16.0"
}
```

---

## Project Architecture

### Application Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         page.tsx (Main)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Header - Navigation with section links                      ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Hero - Landing section with CTAs                            ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ FrameworksSection - Displays all creativity frameworks      ││
│  │   └── Uses: frameworks.ts data                              ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ FlowsSection - Displays creative flow processes             ││
│  │   └── Uses: flows.ts (creativeFlows)                        ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ PatternsSection - Displays creativity patterns              ││
│  │   └── Uses: flows.ts (creativePatterns)                     ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ AIIdeaGenerator - AI prompt template builder                ││
│  │   └── Uses: ai-prompts.ts                                   ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ ExercisesSection - Interactive creativity exercises         ││
│  │   └── Uses: ai-prompts.ts (randomWords, tips)               ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Footer - Links and credits                                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
```
Data Files (src/data/)          Components (src/components/)
─────────────────────          ──────────────────────────────
frameworks.ts ─────────────────► FrameworksSection.tsx
    └── Framework[]                  └── Renders framework cards
    └── categories[]                     with expandable details

flows.ts ──────────────────────► FlowsSection.tsx
    └── CreativeFlow[]               └── Tab-based flow viewer
    └── CreativePattern[] ─────► PatternsSection.tsx
                                     └── Pattern grid with details

ai-prompts.ts ─────────────────► AIIdeaGenerator.tsx
    └── AIPromptTemplate[]           └── Template selector + generator
    └── randomWords[] ─────────► ExercisesSection.tsx
    └── creativityTips[]             └── Exercise tools + random generators
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
```bash
# Navigate to app directory
cd creative-framework-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Available Scripts
| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start dev server on port 3000 |
| build | `npm run build` | Create production build |
| start | `npm start` | Run production server |
| lint | `npm run lint` | Run ESLint |

---

## Project Structure

```
creative-framework-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css           # Global styles + Tailwind + custom classes
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── page.tsx              # Main page component (single-page app)
│   │
│   ├── components/               # React components
│   │   ├── Header.tsx            # Navigation header (sticky)
│   │   ├── Hero.tsx              # Landing hero section
│   │   ├── FrameworksSection.tsx # Frameworks display + filtering
│   │   ├── FlowsSection.tsx      # Creative flows with tabs
│   │   ├── PatternsSection.tsx   # Patterns grid
│   │   ├── AIIdeaGenerator.tsx   # AI prompt builder
│   │   ├── ExercisesSection.tsx  # Interactive exercises
│   │   └── Footer.tsx            # Footer with links
│   │
│   ├── data/                     # Static data/content
│   │   ├── frameworks.ts         # Framework definitions
│   │   ├── flows.ts              # Flows + patterns definitions
│   │   └── ai-prompts.ts         # AI templates + utilities
│   │
│   └── hooks/                    # Custom React hooks (empty, for future)
│       └── (placeholder)
│
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── next.config.js                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
└── README.md                     # This file
```

---

## Data Models

### Framework (`src/data/frameworks.ts`)

```typescript
interface Framework {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Display name
  category: string;              // Category for filtering
  shortDescription: string;      // One-line description
  description: string;           // Full description paragraph
  origin: string;                // Historical origin/creator
  steps: {
    name: string;                // Step name
    description: string;         // What this step involves
    tips: string[];              // 3-4 practical tips
  }[];
  benefits: string[];            // List of benefits
  bestFor: string[];             // Best use cases
  examples: string[];            // Real-world examples
  tools: string[];               // Recommended tools
  icon: string;                  // Lucide icon name
  color: string;                 // Tailwind gradient classes
}

// Available categories:
// - 'Human-Centered'
// - 'Ideation'
// - 'Decision Making'
// - 'Visual Thinking'
// - 'Problem Solving'
// - 'Systematic Innovation'
// - 'Root Cause Analysis'
```

### Creative Flow (`src/data/flows.ts`)

```typescript
interface CreativeFlow {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Full description
  phases: {
    name: string;                // Phase name
    description: string;         // Phase description
    activities: string[];        // Key activities in this phase
    mindset: string;             // Required mindset
    duration: string;            // Typical duration
  }[];
  tips: string[];                // Pro tips for this flow
  icon: string;                  // Lucide icon name
  color: string;                 // Tailwind gradient classes
}
```

### Creative Pattern (`src/data/flows.ts`)

```typescript
interface CreativePattern {
  id: string;                    // Unique identifier
  name: string;                  // Pattern name
  description: string;           // What this pattern is
  howToUse: string[];            // Steps to apply it
  examples: string[];            // Real-world examples
  relatedPatterns: string[];     // IDs of related patterns
  icon: string;                  // Lucide icon name
}
```

### AI Prompt Template (`src/data/ai-prompts.ts`)

```typescript
interface AIPromptTemplate {
  id: string;                    // Unique identifier
  name: string;                  // Template name
  description: string;           // What it does
  category: string;              // Category (Ideation, Framework, etc.)
  prompt: string;                // The prompt with {{variables}}
  variables: string[];           // List of variable names
  examples: string[];            // Example inputs
  icon: string;                  // Lucide icon name
}

// Utility exports:
// - randomWords: string[]       // 48 random words for exercises
// - creativityTips: string[]    // 15 creativity tips
// - getRandomWord(): string     // Returns random word
// - getRandomTip(): string      // Returns random tip
```

---

## Components Reference

### Header.tsx
**Purpose**: Sticky navigation header with mobile menu support

**Props**:
```typescript
interface HeaderProps {
  activeSection: string;         // Current active section ID
  setActiveSection: (section: string) => void;
}
```

**Features**:
- Smooth scroll to sections on click
- Mobile hamburger menu
- Active section highlighting

---

### Hero.tsx
**Purpose**: Landing section with app introduction and CTAs

**Props**:
```typescript
interface HeroProps {
  setActiveSection: (section: string) => void;
}
```

**Features**:
- Animated floating background elements
- Feature cards preview
- CTA buttons to frameworks and AI generator

---

### FrameworksSection.tsx
**Purpose**: Display and filter creativity frameworks

**State**:
```typescript
const [selectedCategory, setSelectedCategory] = useState('all');
const [expandedFramework, setExpandedFramework] = useState<string | null>(null);
```

**Features**:
- Category filtering (tabs)
- Expandable framework cards
- Shows steps, tips, benefits, best uses, tools

---

### FlowsSection.tsx
**Purpose**: Display creative flow processes in tabbed interface

**State**:
```typescript
const [activeFlow, setActiveFlow] = useState(creativeFlows[0].id);
```

**Features**:
- Tab selection for different flows
- Phase timeline with visual indicators
- Mindset and activity display

---

### PatternsSection.tsx
**Purpose**: Display creativity patterns in a grid

**State**:
```typescript
const [activePattern, setActivePattern] = useState<string | null>(null);
```

**Features**:
- Click to expand pattern details
- How-to-use instructions
- Examples for each pattern

---

### AIIdeaGenerator.tsx
**Purpose**: Build customized AI prompts from templates

**State**:
```typescript
const [selectedTemplate, setSelectedTemplate] = useState(aiPromptTemplates[0]);
const [inputs, setInputs] = useState<Record<string, string>>({});
const [generatedPrompt, setGeneratedPrompt] = useState('');
const [copied, setCopied] = useState(false);
const [dailyTip, setDailyTip] = useState(getRandomTip());
const [randomWord, setRandomWord] = useState(getRandomWord());
```

**Features**:
- Template selection sidebar
- Dynamic input fields based on template variables
- Prompt generation with variable substitution
- Copy to clipboard functionality
- Random creativity tip display

---

### ExercisesSection.tsx
**Purpose**: Interactive creativity exercises with timer

**State**:
```typescript
const [activeExercise, setActiveExercise] = useState<string | null>(null);
const [randomWord, setRandomWord] = useState(getRandomWord());
const [timer, setTimer] = useState(0);
const [isTimerRunning, setIsTimerRunning] = useState(false);
const [completedSteps, setCompletedSteps] = useState<number[]>([]);
const [userNotes, setUserNotes] = useState('');
```

**Features**:
- 5 built-in exercises with instructions
- Timer with start/pause/reset
- Step completion tracking
- Notes textarea for capturing ideas
- Random word generator for relevant exercises

---

### Footer.tsx
**Purpose**: Footer with navigation and credits

**Features**:
- Quick navigation links
- Recommended reading list
- Social media links (placeholder)

---

## Styling System

### Design Tokens (Tailwind Config)

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50-900: // Purple shades
  },
  accent: {
    50-900: // Cyan shades
  }
}

// Custom animations:
// - 'gradient': Background gradient animation
// - 'float': Floating up/down motion
// - 'pulse-slow': Slow pulse effect
// - 'sparkle': Scale/opacity sparkle
```

### Custom CSS Classes (`globals.css`)

| Class | Purpose |
|-------|---------|
| `.glass-card` | Glassmorphism card with blur |
| `.glass-card-hover` | Adds hover lift effect |
| `.gradient-text` | Purple-to-cyan gradient text |
| `.btn-primary` | Primary button (gradient purple) |
| `.btn-secondary` | Secondary button (transparent) |
| `.input-field` | Form input styling |
| `.step-indicator` | Numbered step circle |
| `.badge` | Small tag/badge |
| `.skeleton` | Loading skeleton animation |

### Color Scheme
- **Background**: Dark gradient (#0a0a14 to #141428)
- **Primary**: Purple (#d946ef)
- **Accent**: Cyan (#06b6d4)
- **Text**: White with opacity variations
- **Cards**: White with 5-10% opacity + backdrop blur

---

## Adding New Content

### Adding a New Framework

1. Open `src/data/frameworks.ts`
2. Add new object to `frameworks` array:

```typescript
{
  id: 'your-framework-id',
  name: 'Framework Name',
  category: 'Ideation', // Use existing category or add new
  shortDescription: 'Brief one-liner',
  description: 'Full paragraph description...',
  origin: 'Who created it and when',
  steps: [
    {
      name: 'Step 1',
      description: 'What to do',
      tips: ['Tip 1', 'Tip 2', 'Tip 3']
    },
    // ... more steps
  ],
  benefits: ['Benefit 1', 'Benefit 2'],
  bestFor: ['Use case 1', 'Use case 2'],
  examples: ['Real example 1', 'Real example 2'],
  tools: ['Tool 1', 'Tool 2'],
  icon: 'LucideIconName', // Must be in iconMap
  color: 'from-color-500 to-color-500'
}
```

3. If using new icon, add to `iconMap` in `FrameworksSection.tsx`:
```typescript
const iconMap: Record<string, any> = {
  // ... existing icons
  YourIcon: YourIcon,
};
```

4. If adding new category, update `categories` array in `frameworks.ts`

### Adding a New AI Prompt Template

1. Open `src/data/ai-prompts.ts`
2. Add to `aiPromptTemplates` array:

```typescript
{
  id: 'template-id',
  name: 'Template Name',
  description: 'What this template does',
  category: 'Ideation', // or Framework, Problem Solving, etc.
  prompt: `Your prompt text here with {{variable}} placeholders.

The {{variable}} will be replaced with user input.`,
  variables: ['variable'], // Must match {{}} in prompt
  examples: [
    'Example input 1',
    'Variable: value | OtherVar: value2', // For multiple variables
  ],
  icon: 'IconName'
}
```

3. Add icon to `iconMap` in `AIIdeaGenerator.tsx` if needed

### Adding a New Exercise

1. Open `src/components/ExercisesSection.tsx`
2. Add to `exercises` array:

```typescript
{
  id: 'exercise-id',
  name: 'Exercise Name',
  description: 'What this exercise does',
  duration: '10-15 min',
  difficulty: 'Beginner', // or 'Intermediate' or 'Advanced'
  icon: IconComponent, // Imported Lucide icon
  instructions: [
    'Step 1 instruction',
    'Step 2 instruction',
    // ... more steps
  ],
  color: 'from-color-500 to-color-500'
}
```

---

## State Management

This app uses **local component state** with React's `useState` hook. There's no global state management library.

### State Locations

| State | Location | Purpose |
|-------|----------|---------|
| Active section | `page.tsx` | Track current section for nav highlighting |
| Selected category | `FrameworksSection.tsx` | Filter frameworks |
| Expanded framework | `FrameworksSection.tsx` | Show/hide framework details |
| Active flow | `FlowsSection.tsx` | Selected flow tab |
| Active pattern | `PatternsSection.tsx` | Expanded pattern card |
| Selected template | `AIIdeaGenerator.tsx` | Current AI template |
| Form inputs | `AIIdeaGenerator.tsx` | User inputs for template |
| Generated prompt | `AIIdeaGenerator.tsx` | Final generated prompt |
| Active exercise | `ExercisesSection.tsx` | Selected exercise |
| Timer state | `ExercisesSection.tsx` | Exercise timer |
| Completed steps | `ExercisesSection.tsx` | Exercise progress |
| User notes | `ExercisesSection.tsx` | Exercise notes |

### Future State Considerations
For future features like user accounts or progress saving, consider:
- **Zustand** for simple global state
- **React Context** for theme/user preferences
- **localStorage** for persisting exercise progress

---

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Use functional components with hooks
- Keep components under 300 lines (split if needed)
- Use descriptive variable names

### Component Structure
```typescript
'use client'; // For client components

import { useState } from 'react';
import { Icon } from 'lucide-react';
import { dataType } from '@/data/dataFile';

interface ComponentProps {
  // Props interface
}

export default function ComponentName({ props }: ComponentProps) {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Helper functions
  const helperFunction = () => { };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions
- **Files**: PascalCase for components (`MyComponent.tsx`)
- **Files**: kebab-case for data (`my-data.ts`)
- **Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **CSS classes**: kebab-case or Tailwind utilities

### Git Commit Style
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Formatting changes
refactor: Code refactoring
```

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
# Add to next.config.js: output: 'export'
npm run build
# Deploy 'out' folder to any static host
```

---

## Roadmap

### Planned Features
- [ ] User accounts with progress tracking
- [ ] Save favorite frameworks
- [ ] Custom exercise creation
- [ ] Dark/light theme toggle
- [ ] Export exercises as PDF
- [ ] Share generated prompts
- [ ] Framework comparison tool
- [ ] Spaced repetition for learning
- [ ] Community-submitted frameworks
- [ ] API integration for live AI responses

### Known Limitations
- No backend/database - all data is static
- Timer in exercises doesn't persist on page refresh
- No user authentication
- AI prompts must be manually copied to external AI tools

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Areas for Contribution
- Add new creativity frameworks
- Improve AI prompt templates
- Add more interactive exercises
- Enhance accessibility
- Add unit tests
- Improve mobile responsiveness

---

## License

Open source - free to use and modify.

---

## Support

For issues or questions, please open a GitHub issue.

---

Built with creativity for creative minds.
