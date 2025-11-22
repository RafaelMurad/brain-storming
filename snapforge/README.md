# SnapForge

**Professional Screenshot & PDF API Service**

A production-ready API service for capturing screenshots and generating PDFs from any URL. Built with TypeScript, Express, and Puppeteer.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

## Features

- **Multiple Formats**: PNG, JPEG, and PDF export
- **Custom Viewports**: Any resolution up to 1920x1080
- **Full Page Capture**: Capture entire scrollable pages
- **Element Selectors**: Target specific DOM elements
- **Delay Capture**: Wait for animations or lazy-loaded content
- **Rate Limiting**: Built-in protection with customizable limits
- **Feature Flags**: Gradual rollout of new features
- **API Key Management**: Secure authentication with permissions

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone and navigate to the project
cd snapforge

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Seed with demo data
npx tsx src/scripts/seed.ts

# Start development server
npm run dev
```

The API will be available at `http://localhost:3001`

### One-Command Setup

```bash
npm run setup && npx tsx src/scripts/seed.ts && npm run dev
```

## API Usage

### Authentication

All API requests require an API key. Include it via:

```bash
# Header (recommended)
Authorization: Bearer sf_your_api_key

# Or X-API-Key header
X-API-Key: sf_your_api_key

# Or query parameter
?api_key=sf_your_api_key
```

### Take a Screenshot

```bash
curl -X POST http://localhost:3001/api/v1/screenshot \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "format": "png",
    "width": 1280,
    "height": 720,
    "fullPage": false
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "url": "https://example.com",
    "format": "png",
    "width": 1280,
    "height": 720,
    "fileSize": 234567,
    "processingMs": 1234,
    "downloadUrl": "http://localhost:3001/api/v1/screenshot/uuid-here/download"
  }
}
```

### Screenshot Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | required | URL to capture |
| `format` | string | `png` | Output format: `png`, `jpeg`, `pdf` |
| `width` | number | `1280` | Viewport width (100-1920) |
| `height` | number | `720` | Viewport height (100-1080) |
| `fullPage` | boolean | `false` | Capture full scrollable page |
| `delay` | number | `0` | Wait time in ms (0-10000) |
| `selector` | string | - | CSS selector for element capture |
| `quality` | number | - | JPEG quality (1-100) |

### Download Screenshot

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3001/api/v1/screenshot/{id}/download \
  --output screenshot.png
```

### List Screenshots

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:3001/api/v1/screenshots?limit=10&offset=0"
```

## API Endpoints

### Screenshots

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/screenshot` | Create screenshot |
| GET | `/api/v1/screenshot/:id` | Get screenshot metadata |
| GET | `/api/v1/screenshot/:id/download` | Download screenshot file |
| GET | `/api/v1/screenshots` | List screenshots |
| DELETE | `/api/v1/screenshot/:id` | Delete screenshot |

### API Keys

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/keys` | Create API key (admin) |
| GET | `/api/v1/keys` | List API keys (admin) |
| GET | `/api/v1/keys/:id` | Get API key details |
| PATCH | `/api/v1/keys/:id` | Update API key |
| POST | `/api/v1/keys/:id/revoke` | Revoke API key |
| DELETE | `/api/v1/keys/:id` | Delete API key |
| GET | `/api/v1/keys/me/usage` | Get usage stats |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Basic health check |
| GET | `/health/detailed` | Detailed health with feature flags |
| GET | `/health/ready` | Kubernetes readiness probe |
| GET | `/health/live` | Kubernetes liveness probe |

## Feature Flags

Configure features via environment variables or database:

| Flag | Default | Description |
|------|---------|-------------|
| `FEATURE_PDF_EXPORT` | `true` | Enable PDF generation |
| `FEATURE_FULL_PAGE_CAPTURE` | `true` | Enable full page screenshots |
| `FEATURE_CUSTOM_VIEWPORT` | `true` | Enable custom dimensions |
| `FEATURE_DELAY_CAPTURE` | `true` | Enable delay option |
| `FEATURE_ELEMENT_SELECTOR` | `true` | Enable CSS selector targeting |
| `FEATURE_WEBHOOK_CALLBACK` | `false` | Enable webhook notifications |

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Project Structure

```
snapforge/
├── src/
│   ├── __tests__/        # Test files
│   ├── config/           # Configuration and logger
│   ├── lib/              # Database and utilities
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── scripts/          # CLI scripts
│   └── index.ts          # Application entry
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static files
└── screenshots/          # Screenshot storage
```

## Environment Variables

See `.env.example` for all configuration options.

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- apiKey.service.test.ts

# Watch mode
npm run test:watch
```

## Production Deployment

```bash
# Build
npm run build

# Start production server
NODE_ENV=production npm start
```

### Docker

```dockerfile
FROM node:18-slim

RUN apt-get update && apt-get install -y \
  chromium \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

## License

MIT License - see LICENSE file for details.

---

Built with care for the developer community.
