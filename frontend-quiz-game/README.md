# Frontend Quiz Game 🎯

A gamified quiz platform to test and improve your frontend development knowledge. Features AI-generated questions from official documentation, daily streaks, levels, achievements, and global leaderboards.

## Features

- **AI-Generated Questions**: Questions sourced from official documentation of React, TypeScript, CSS, Next.js, Vue, and more
- **Gamification**:
  - 🔥 Daily Streaks with XP bonuses
  - ⭐ Level System (earn XP, level up)
  - 🏆 Achievements (common, rare, epic, legendary)
  - 📊 Global Leaderboard
- **Multiple Categories**: React, TypeScript, JavaScript, CSS, Next.js, Vue, Testing, Performance, Accessibility
- **Difficulty Levels**: Beginner, Intermediate, Advanced, Expert
- **Real-time Scoring**: Time-based bonus points
- **Cross-Platform**: Web and Mobile apps

## Architecture

```
frontend-quiz-game/
├── api/                 # Express.js Backend
│   ├── src/
│   │   ├── data/        # Pre-generated questions
│   │   ├── services/    # Game logic, user management
│   │   └── index.ts     # Express server
│   └── package.json
├── web/                 # React Web App
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── store/       # Zustand state
│   │   └── services/    # API client
│   └── package.json
├── mobile/              # React Native App (Expo)
│   ├── app/             # Expo Router screens
│   ├── components/      # Mobile components
│   ├── store/           # Zustand state
│   └── package.json
└── shared/              # Shared types
```

## Tech Stack

### Backend (API)
- Express.js
- TypeScript
- OpenAI (for question generation)
- In-memory storage (use database for production)

### Web App
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (state management)
- React Router

### Mobile App
- React Native
- Expo SDK 50
- Expo Router v3
- React Native Reanimated
- NativeWind (Tailwind)
- Zustand

## Quick Start

### 1. Start the API Server

```bash
cd api
npm install
npm run dev
# Server runs on http://localhost:3005
```

### 2. Start the Web App

```bash
cd web
npm install
npm run dev
# App runs on http://localhost:3006
```

### 3. Start the Mobile App

```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go app
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login/Register user |
| `/api/users/:id` | GET | Get user profile |
| `/api/categories` | GET | List quiz categories |
| `/api/game/start` | POST | Start new quiz session |
| `/api/game/answer` | POST | Submit answer |
| `/api/game/complete` | POST | Complete quiz and get results |
| `/api/leaderboard` | GET | Get global leaderboard |

## Game Mechanics

### XP System
- Correct answers earn base points based on difficulty
- Time bonus: Faster answers = more points
- Streak multiplier: +10% per streak day (max 200%)

### Difficulty Points
- Beginner: 10 points
- Intermediate: 20 points
- Advanced: 35 points
- Expert: 50 points

### Achievements
- **First Steps**: Complete your first quiz
- **On Fire**: 3-day streak
- **Perfectionist**: 100% on a quiz
- **Century**: Answer 100 questions
- **React Master**: 50 correct React answers
- And many more!

## Screenshots

### Web App
- Home page with category selection
- Quiz interface with timer
- Results with achievements
- Global leaderboard

### Mobile App
- Native iOS/Android experience
- Haptic feedback
- Smooth animations
- Dark theme optimized

## Customization

### Adding Questions

Edit `api/src/data/questions.ts`:

```typescript
{
  id: 'custom-001',
  category: 'react',
  difficulty: 'intermediate',
  question: 'Your question here?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 1, // Index of correct answer
  explanation: 'Explanation of the correct answer',
  source: 'Documentation reference',
  points: 20,
  timeLimit: 45,
}
```

### Adding Categories

1. Add category to types in `shared/types.ts`
2. Add icon in `CATEGORY_ICONS` constant
3. Add questions for the category

## Production Deployment

### API
- Use a proper database (PostgreSQL, MongoDB)
- Add JWT authentication
- Rate limiting
- Redis for sessions/caching

### Web
- `npm run build` for production build
- Deploy to Vercel, Netlify, or similar

### Mobile
- `expo build` for production builds
- Deploy to App Store / Play Store

## License

MIT License

---

Built with ❤️ for the frontend developer community
