# FrontendForge

**AI-Powered Frontend Learning Platform** - Master modern frontend technologies through personalized exercises and real GitHub projects.

![FrontendForge](https://via.placeholder.com/800x400?text=FrontendForge+Learning+Platform)

## Features

- **AI Exercise Generator** - Tell us what you want to learn, get custom exercises
- **GitHub Integration** - Create real repos for every exercise
- **8+ Technologies** - React, Next.js, Vue, Svelte, TypeScript, Tailwind, and more
- **Learning Paths** - Structured progression from beginner to expert
- **XP & Leveling** - Gamified learning with rewards and streaks
- **IDE Compatible** - Clone repos and work in your favorite editor

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js with GitHub OAuth
- **AI**: OpenAI API for exercise generation
- **GitHub**: Octokit for repo management
- **State**: Zustand
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Configure environment variables
cp .env.example .env.local
# Add your GitHub OAuth and OpenAI API keys

# Start development server
npm run dev
```

Open [http://localhost:4006](http://localhost:4006)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── exercises/     # Exercise CRUD
│   │   └── github/        # Repo creation
│   ├── globals.css        # Custom styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── header.tsx         # Navigation with XP bar
│   ├── tech-grid.tsx      # Technology cards
│   ├── exercise-generator.tsx  # AI generation UI
│   └── exercise-view.tsx  # Exercise detail page
├── lib/
│   ├── db.ts              # Prisma client
│   ├── store.ts           # Zustand state
│   └── utils.ts           # Helpers & tech data
└── prisma/
    └── schema.prisma      # Database schema
```

## Supported Technologies

| Technology | Difficulty | Description |
|------------|------------|-------------|
| React | Intermediate | Build interactive UIs |
| Next.js | Advanced | Full-stack React framework |
| Vue.js | Intermediate | Progressive framework |
| Svelte | Intermediate | Compile-time reactive |
| TypeScript | Intermediate | Type-safe JavaScript |
| Tailwind CSS | Beginner | Utility-first CSS |
| Astro | Intermediate | Content-focused sites |
| Remix | Advanced | Full-stack web framework |

## How It Works

1. **Choose Technology** - Select what you want to learn
2. **Generate Exercise** - Describe what you want to build
3. **Create Repo** - AI creates a GitHub repository
4. **Clone & Code** - Work locally in your IDE
5. **Complete & Earn XP** - Mark complete and level up

## Database Schema

- **User** - Learners with XP, level, streaks
- **Technology** - Supported frameworks/libraries
- **Exercise** - Learning challenges
- **LearningPath** - Structured courses
- **UserExercise** - Progress tracking

## Environment Variables

```env
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:4006
NEXTAUTH_SECRET=your_secret
```

## Roadmap

- [ ] Code editor integration
- [ ] Automated code review
- [ ] Community challenges
- [ ] Team learning
- [ ] Certificate generation
- [ ] More technologies

## License

MIT
