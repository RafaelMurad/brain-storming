# Analytics Hub

**Real-time Analytics & Metrics API** - Track events, build dashboards, generate insights across all your applications.

## Features

- **Event Tracking** - Track any event with custom properties
- **Batch Ingestion** - Send up to 1000 events in a single request
- **Real-time Metrics** - Live dashboard with active users and events per minute
- **Timeseries Data** - Historical data with hourly/daily granularity
- **Dimension Breakdowns** - Analyze by device, browser, OS, country, source
- **Top Events** - See your most frequent events at a glance
- **Multi-project Support** - One API, multiple applications
- **API Key Management** - Granular permissions and rate limits

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Server runs on `http://localhost:3005`

## API Usage

### 1. Create a Project

```bash
curl -X POST http://localhost:3005/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My App", "domain": "myapp.com"}'
```

Response includes your API key - save it!

### 2. Track Events

```bash
# Single event
curl -X POST http://localhost:3005/api/v1/events/track \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "page_view",
    "userId": "user_123",
    "properties": {"page": "/dashboard", "referrer": "google"}
  }'

# Batch events
curl -X POST http://localhost:3005/api/v1/events/track/batch \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {"name": "button_click", "properties": {"button": "signup"}},
      {"name": "form_submit", "properties": {"form": "contact"}}
    ]
  }'
```

### 3. Query Metrics

```bash
# Dashboard overview
curl http://localhost:3005/api/v1/metrics/dashboard?period=7d \
  -H "Authorization: Bearer YOUR_API_KEY"

# Real-time stats
curl http://localhost:3005/api/v1/metrics/realtime \
  -H "Authorization: Bearer YOUR_API_KEY"

# Device breakdown
curl http://localhost:3005/api/v1/metrics/breakdown/device?period=30d \
  -H "Authorization: Bearer YOUR_API_KEY"

# Timeseries
curl "http://localhost:3005/api/v1/metrics/timeseries?period=7d&interval=day" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Integration Example

```javascript
// Browser SDK snippet
const analytics = {
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:3005/api/v1',

  track(event, properties = {}) {
    fetch(`${this.endpoint}/events/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        name: event,
        properties,
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
      }),
    });
  },

  getUserId() {
    return localStorage.getItem('user_id');
  },

  getSessionId() {
    let sid = sessionStorage.getItem('session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem('session_id', sid);
    }
    return sid;
  },
};

// Usage
analytics.track('page_view', { page: window.location.pathname });
analytics.track('button_click', { button: 'signup' });
```

## Event Schema

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Event name (required) |
| `category` | string | Event category (default: "general") |
| `userId` | string | User identifier |
| `sessionId` | string | Session identifier |
| `properties` | object | Custom properties |
| `value` | number | Numeric value (e.g., purchase amount) |
| `source` | string | Traffic source |
| `timestamp` | ISO string | Event timestamp (default: now) |

## Permissions

| Permission | Description |
|------------|-------------|
| `read` | Query events and metrics |
| `write` | Track events |
| `admin` | Manage API keys |

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma (PostgreSQL-ready)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## License

MIT
