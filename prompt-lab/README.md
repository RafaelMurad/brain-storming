# PromptLab

**AI Prompt Analysis Platform** - Manage, analyze, and rate your AI prompts for optimal performance.

![PromptLab](https://via.placeholder.com/800x400?text=PromptLab+Dashboard)

## Features

- **Prompt Library** - Organize prompts with categories, tags, and search
- **5-Star Rating System** - Rate prompts on clarity, effectiveness, versatility, and efficiency
- **Performance Analytics** - Track success rates, latency, token usage, and costs
- **Interactive Dashboard** - Visualize usage trends and top performers
- **Version Control** - Track prompt iterations and changes
- **Grid/List Views** - Multiple viewing options for your library
- **Favorites** - Quick access to your best prompts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State**: Zustand
- **Database**: Prisma + SQLite
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:4005](http://localhost:4005)

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Custom styles + Tailwind
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard
├── components/
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── prompt-card.tsx          # Prompt display card
│   ├── prompt-detail.tsx        # Detailed prompt view
│   ├── star-rating.tsx          # Interactive rating component
│   ├── analytics-dashboard.tsx  # Charts and metrics
│   └── create-prompt-modal.tsx  # New prompt form
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── store.ts                 # Zustand state
│   └── utils.ts                 # Helpers and constants
└── prisma/
    └── schema.prisma            # Database schema
```

## Features Breakdown

### Rating System
```typescript
// Detailed criteria rating
interface RatingCriteria {
  clarity: number;       // How clear and understandable
  effectiveness: number; // How well it achieves results
  versatility: number;   // Adaptable to scenarios
  efficiency: number;    // Token efficiency
}
```

### Performance Metrics
- Success rate (%)
- Average latency (ms)
- Token consumption
- Cost tracking
- Execution history

### Categories
- General
- Coding
- Writing
- Analysis
- Creative
- Business

## API Routes

```
GET    /api/prompts          # List all prompts
POST   /api/prompts          # Create prompt
GET    /api/prompts/:id      # Get single prompt
PATCH  /api/prompts/:id      # Update prompt
DELETE /api/prompts/:id      # Delete prompt
POST   /api/prompts/:id/run  # Execute prompt
POST   /api/prompts/:id/rate # Rate prompt
GET    /api/analytics        # Get analytics data
```

## Database Schema

- **Prompt** - Main prompt storage with metadata
- **PromptExecution** - Execution history and metrics
- **PromptVersion** - Version history
- **PromptRating** - User ratings with criteria
- **Category** - Custom categories
- **Settings** - App configuration

## Roadmap

- [ ] AI-powered prompt optimization suggestions
- [ ] A/B testing between prompt versions
- [ ] Team collaboration and sharing
- [ ] Export/import prompts
- [ ] Integration with OpenAI/Anthropic APIs
- [ ] Prompt templates marketplace

## License

MIT
