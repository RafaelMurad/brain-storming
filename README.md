# Brain-Storming: Portfolio Projects Collection

A collection of 4 production-ready MVP projects built with modern TypeScript, and 5 futuristic portfolio websites, all following Scandinavian design principles (minimal, functional, clean).

## Projects Overview

| Project | Description | Port | Monetization |
|---------|-------------|------|--------------|
| [SnapForge](./snapforge/) | Screenshot & PDF API | 3001 | Usage-based SaaS |
| [PulseWatch](./pulsewatch/) | Social Listening & Lead Gen | 3002 | Subscription SaaS |
| [ZenTeam](./zenteam/) | Burnout Prevention Platform | 3003 | Per-seat SaaS |
| [CelebrateKit](./celebratekit/) | Embeddable Celebration API | 3004 | Freemium API |

## Quick Start

Each project can be started independently:

```bash
# Navigate to any project
cd snapforge  # or pulsewatch, zenteam, celebratekit

# One-command setup
npm run setup && npx tsx src/scripts/seed.ts && npm run dev
```

## Tech Stack (All Projects)

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite (via Prisma) - PostgreSQL ready
- **Validation**: Zod
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## Shared Patterns

All projects follow these industry-standard patterns:

### Architecture
- Service layer pattern (routes → services → database)
- Centralized error handling
- Structured logging (Winston)
- Request validation (Zod schemas)

### Security
- Rate limiting
- API key authentication
- CORS configuration
- Helmet security headers

### Developer Experience
- TypeScript for type safety
- Consistent code style (Prettier + ESLint)
- Comprehensive tests
- Hot reload development
- Database GUI (Prisma Studio)

### Feature Flags
Each project includes a feature flag system for:
- Gradual feature rollouts
- A/B testing capability
- Quick feature toggles

## Project Details

### 1. SnapForge - Screenshot & PDF API

Capture screenshots and generate PDFs from any URL programmatically.

**Key Features:**
- PNG, JPEG, PDF formats
- Custom viewports (up to 1920x1080)
- Full page capture
- Element selector targeting
- Delay capture for dynamic content

**Use Cases:**
- Link preview generation
- Website monitoring
- Report automation
- Social card generation

[View SnapForge Documentation →](./snapforge/README.md)

---

### 2. PulseWatch - Social Listening & Lead Generation

Monitor Reddit, Twitter, and Hacker News for potential customers and leads.

**Key Features:**
- Multi-platform monitoring
- AI-powered lead scoring (0-100)
- Sentiment analysis
- Keyword tracking
- Real-time alerts

**Use Cases:**
- Finding potential customers
- Competitor monitoring
- Market research
- Community engagement

[View PulseWatch Documentation →](./pulsewatch/README.md)

---

### 3. ZenTeam - Burnout Prevention Platform

Help remote teams stay healthy with wellness tracking and burnout prediction.

**Key Features:**
- Daily check-ins (mood, energy, workload, stress)
- Wellness scoring (0-100)
- Burnout prediction & alerts
- Team activity suggestions
- Anonymous feedback

**Use Cases:**
- Remote team management
- HR wellness programs
- Team culture building
- Employee retention

[View ZenTeam Documentation →](./zenteam/README.md)

---

### 4. CelebrateKit - Embeddable Celebration API

Add confetti, achievements, and gamification to any web app.

**Key Features:**
- Instant celebrations (confetti, fireworks, stars, hearts)
- Achievement system
- Leaderboards
- Lightweight vanilla JS widget
- Zero dependencies

**Use Cases:**
- User engagement
- Gamification
- Achievement unlocks
- Purchase celebrations

[View CelebrateKit Documentation →](./celebratekit/README.md)

---

## Integration Example

These projects can work together! Here's how CelebrateKit integrates with the others:

```javascript
// SnapForge + CelebrateKit
async function captureScreenshot(url) {
  const result = await snapforge.capture(url);
  CelebrateKit.confetti();
  return result;
}

// PulseWatch + CelebrateKit
if (mention.leadScore >= 80) {
  CelebrateKit.stars();
  await CelebrateKit.unlockAchievement('hot_lead_found');
}

// ZenTeam + CelebrateKit
if (teamWellness.trend === 'improving') {
  CelebrateKit.hearts();
}
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Running All Projects

```bash
# Terminal 1 - SnapForge
cd snapforge && npm run dev

# Terminal 2 - PulseWatch
cd pulsewatch && npm run dev

# Terminal 3 - ZenTeam
cd zenteam && npm run dev

# Terminal 4 - CelebrateKit
cd celebratekit && npm run dev
```

### Running Tests

```bash
# Run tests for a specific project
cd snapforge && npm test

# Run with coverage
npm test -- --coverage
```

### Database Management

```bash
# Open database GUI
npm run db:studio

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

## Documentation

Each project includes:
- `README.md` - Quick start and API reference
- `docs/LEARNINGS.md` - Technical decisions and patterns (SnapForge)
- `docs/MARKETING.md` - Go-to-market strategy (SnapForge)
- `.env.example` - Environment configuration

## License

MIT License - All projects are open source.

---

## About This Collection

These projects were built as portfolio pieces demonstrating:

1. **Full-Stack Development**: Backend APIs with TypeScript/Node.js
2. **Database Design**: Relational schemas with Prisma ORM
3. **API Design**: RESTful APIs with proper versioning
4. **Security**: Authentication, rate limiting, validation
5. **Testing**: Unit tests with Jest
6. **DevOps Ready**: Health checks, graceful shutdown, logging
7. **Documentation**: Comprehensive READMEs and API docs

Each project is designed to be:
- Production-ready out of the box
- Easy to deploy and scale
- Simple to extend with new features
- Monetizable as a SaaS product

---

## Portfolio Websites

5 futuristic portfolio website templates built with modern frameworks:

| Portfolio | Theme | Framework | Description |
|-----------|-------|-----------|-------------|
| [Cosmic Void](./cosmic-void/) | Deep Space | Astro | Parallax stars, floating planets, nebula effects |
| [NeonGrid](./neon-grid/) | Cyberpunk | SolidJS | Neon colors, scanlines, glitch effects, terminal UI |
| [AstralContact](./astral-contact/) | Alien | SolidJS | UFO animations, crop circles, signal frequencies |
| [Nordic Minimal](./nordic-minimal/) | Scandinavian | Astro | Clean lines, whitespace, subtle animations |
| [Galactic Gourmet](./galactic-gourmet/) | Space + Food | SolidJS | Culinary meets cosmos, menu-style skills |

### Tech Stack (Portfolios)

- **Frameworks**: Astro v4, SolidJS v1.8
- **Build Tool**: Vite v5
- **Styling**: Tailwind CSS v3.4
- **Language**: TypeScript
- **Fonts**: Google Fonts

### Quick Start (Portfolios)

```bash
# Navigate to any portfolio
cd cosmic-void  # or neon-grid, astral-contact, nordic-minimal, galactic-gourmet

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Portfolio Features

All portfolio websites include:
- **Reusable Components**: Modular, typed component architecture
- **TypeScript**: Full type safety with interfaces
- **Tailwind CSS**: Utility-first styling with custom themes
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS and JS-powered effects
- **Easter Eggs**: Hidden surprises (try Konami code or secret keywords!)
- **Fast Performance**: Astro's partial hydration, SolidJS's fine-grained reactivity

### Component Examples

```tsx
// SolidJS Button Component
<Button variant="primary" href="#projects">View Work</Button>

// Astro Section Component
<Section id="about" title="About" subtitle="Learn more">
  <Content />
</Section>
```

---

Built with ❤️ for the developer community.
