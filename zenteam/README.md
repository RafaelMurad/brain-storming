# ZenTeam

**AI-Powered Team Culture & Burnout Prevention Platform**

Monitor team wellness, predict burnout risk, and suggest activities to improve team culture. Built for remote-first teams.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

## Features

- **Daily Check-ins**: Quick mood, energy, workload, and stress tracking
- **Wellness Scoring**: Rolling 0-100 wellness score per team member
- **Burnout Prediction**: AI-powered early warning system
- **Activity Suggestions**: Context-aware team activity recommendations
- **Team Insights**: Aggregate analytics and trends
- **Anonymous Feedback**: Safe space for honest communication

## Quick Start

```bash
cd zenteam

# Install dependencies
npm install

# Setup database
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init

# Seed demo data
npx tsx src/scripts/seed.ts

# Start server
npm run dev
```

API runs at `http://localhost:3003`

### One-Command Setup

```bash
npm run setup && npx tsx src/scripts/seed.ts && npm run dev
```

## API Usage

### Submit a Check-in

```bash
curl -X POST http://localhost:3003/api/v1/checkins \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "YOUR_WORKSPACE_ID",
    "memberId": "YOUR_MEMBER_ID",
    "mood": 4,
    "energy": 3,
    "workload": 3,
    "stress": 2,
    "note": "Productive day, got a lot done!"
  }'
```

### Check-in Scale (1-5)

| Metric | 1 | 2 | 3 | 4 | 5 |
|--------|---|---|---|---|---|
| Mood | Very low | Low | Neutral | Good | Great |
| Energy | Exhausted | Tired | Okay | Energized | Peak |
| Workload | Too light | Light | Balanced | Heavy | Overwhelmed |
| Stress | None | Minimal | Moderate | High | Extreme |

### Get Team Insights

```bash
curl "http://localhost:3003/api/v1/activities/insights/YOUR_WORKSPACE_ID"
```

### Get Activity Suggestions

```bash
curl "http://localhost:3003/api/v1/activities/suggestions/YOUR_WORKSPACE_ID"
```

### Get At-Risk Members

```bash
curl "http://localhost:3003/api/v1/members/YOUR_WORKSPACE_ID/at-risk"
```

## API Endpoints

### Check-ins

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/checkins` | Submit check-in |
| GET | `/api/v1/checkins/member/:id` | Get member history |
| GET | `/api/v1/checkins/stats/:workspaceId` | Get workspace stats |
| GET | `/api/v1/checkins/missing/:workspaceId` | Get missing check-ins |

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/members` | Add member |
| GET | `/api/v1/members/:workspaceId` | List members |
| GET | `/api/v1/members/:workspaceId/at-risk` | At-risk members |
| GET | `/api/v1/members/:workspaceId/wellness` | Wellness distribution |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/activities/suggestions/:id` | Get suggestions |
| GET | `/api/v1/activities/insights/:id` | Get team insights |
| POST | `/api/v1/activities` | Schedule activity |
| GET | `/api/v1/activities/:workspaceId` | List activities |

## Wellness Score

The wellness score (0-100) is calculated from check-in data:

| Score | Status | Action |
|-------|--------|--------|
| 80-100 | Excellent | Keep it up! |
| 60-79 | Good | On track |
| 40-59 | Moderate | Monitor closely |
| 25-39 | Warning | Check-in needed |
| 0-24 | Critical | Immediate attention |

### Score Calculation

```
mood (30%) + energy (25%) + inverted_workload (25%) + inverted_stress (20%)
```

## Activity Types

ZenTeam suggests activities based on team wellness:

- **Icebreakers**: Team bonding for low engagement
- **Wellness Breaks**: Meditation, stretching for high stress
- **Celebrations**: Recognition for low morale
- **Team Lunches**: Social connection opportunities

## Slack Integration

Coming soon! ZenTeam can integrate with Slack for:

- Daily check-in reminders
- DM-based private check-ins
- Channel announcements for team activities
- Manager alerts for at-risk team members

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (3003) |
| `DATABASE_URL` | Database connection | No |
| `SLACK_BOT_TOKEN` | Slack bot token | No |
| `OPENAI_API_KEY` | OpenAI for sentiment | No |
| `BURNOUT_WARNING_THRESHOLD` | Warning level | No (40) |
| `BURNOUT_CRITICAL_THRESHOLD` | Critical level | No (25) |

## Privacy & Security

- Check-ins can be anonymous
- Individual scores are private to managers
- Aggregate data only shown publicly
- No message content stored without consent
- GDPR-compliant data handling

## Development

```bash
npm run dev        # Development server
npm test           # Run tests
npm run lint       # Lint code
npm run db:studio  # Database GUI
```

## License

MIT License

---

Built with care for team wellbeing.
