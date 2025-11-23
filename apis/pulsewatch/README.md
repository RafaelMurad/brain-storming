# PulseWatch

**AI-Powered Social Listening & Lead Generation Platform**

Monitor Reddit, Twitter, and Hacker News for keywords relevant to your business. Find potential customers and leads automatically with AI-powered scoring.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

## Features

- **Multi-Platform Monitoring**: Reddit, Twitter, Hacker News
- **Keyword Tracking**: Monitor up to 20 keywords per monitor
- **AI Lead Scoring**: Automatically score leads 0-100
- **Sentiment Analysis**: Understand context and intent
- **Real-time Alerts**: Webhooks, email, Slack notifications
- **Dashboard Analytics**: Track mentions, leads, and trends

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Reddit API credentials
- (Optional) OpenAI API key for AI features

### Installation

```bash
cd pulsewatch

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Seed demo data
npx tsx src/scripts/seed.ts

# Start development server
npm run dev
```

The API runs at `http://localhost:3002`

### One-Command Setup

```bash
npm run setup && npx tsx src/scripts/seed.ts && npm run dev
```

## API Usage

### Authentication

Include your API key in requests:

```bash
Authorization: Bearer pw_your_api_key
# or
X-API-Key: pw_your_api_key
```

### Create a Monitor

```bash
curl -X POST http://localhost:3002/api/v1/monitors \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screenshot API Leads",
    "keywords": ["screenshot API", "webpage capture", "url to image"],
    "subreddits": ["webdev", "programming", "saas"],
    "minScore": 50
  }'
```

### Get Mentions

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:3002/api/v1/mentions?minScore=50&sortBy=leadScore"
```

### Get Top Leads

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:3002/api/v1/mentions/leads?limit=10"
```

### Trigger Manual Scan

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:3002/api/v1/monitors/{id}/scan"
```

## API Endpoints

### Monitors

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/monitors` | Create monitor |
| GET | `/api/v1/monitors` | List monitors |
| GET | `/api/v1/monitors/:id` | Get monitor |
| PATCH | `/api/v1/monitors/:id` | Update monitor |
| DELETE | `/api/v1/monitors/:id` | Delete monitor |
| POST | `/api/v1/monitors/:id/scan` | Run manual scan |

### Mentions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/mentions` | List mentions |
| GET | `/api/v1/mentions/:id` | Get mention |
| GET | `/api/v1/mentions/stats` | Get statistics |
| GET | `/api/v1/mentions/leads` | Get top leads |
| POST | `/api/v1/mentions/:id/read` | Mark as read |
| POST | `/api/v1/mentions/:id/flag` | Flag mention |
| DELETE | `/api/v1/mentions/:id` | Archive mention |

## Lead Scoring

PulseWatch uses AI to score each mention from 0-100:

| Score | Classification | Action |
|-------|---------------|--------|
| 80-100 | Hot Lead | Reach out immediately |
| 60-79 | Warm Lead | Engage within 24h |
| 40-59 | Potential | Monitor and nurture |
| 0-39 | Low Priority | Optional follow-up |

### Scoring Factors

- **Buying Intent**: "looking for", "need", "recommend"
- **Urgency**: "asap", "urgent", "deadline"
- **Competitor Frustration**: Negative sentiment about competitors
- **Engagement**: High upvotes/comments indicate interest
- **Relevant Subreddit**: Industry-specific communities

## Demo Mode

PulseWatch works without API credentials using demo data. To enable full functionality:

1. **Reddit API**: Get credentials at https://www.reddit.com/prefs/apps
2. **OpenAI API**: Get key at https://platform.openai.com for AI scoring

Without credentials, you'll see simulated data demonstrating all features.

## Development

```bash
# Run API server
npm run dev

# Run background worker (for scheduled scans)
npm run dev:worker

# Run tests
npm test

# Lint and format
npm run lint && npm run format

# Database GUI
npm run db:studio
```

## Project Structure

```
pulsewatch/
├── src/
│   ├── config/       # Configuration
│   ├── lib/          # Database, utilities
│   ├── middleware/   # Auth, validation
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── scripts/      # CLI scripts
├── prisma/
│   └── schema.prisma
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (3002) |
| `DATABASE_URL` | SQLite/PostgreSQL URL | No |
| `REDDIT_CLIENT_ID` | Reddit app ID | No |
| `REDDIT_CLIENT_SECRET` | Reddit app secret | No |
| `OPENAI_API_KEY` | OpenAI API key | No |

See `.env.example` for all options.

## License

MIT License

---

Built for finding your next customers.
