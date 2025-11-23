# ShortLink

**URL Shortener with Analytics** - Create short links and track clicks with detailed analytics.

## Features
- **Custom Short Codes** - Create branded short URLs
- **Click Analytics** - Track clicks by device, browser, country
- **Link Expiration** - Set expiry dates or click limits
- **Password Protection** - Secure links with passwords
- **Tags** - Organize links with tags

## Quick Start
```bash
npm install && npm run db:push && npm run dev
```
Server runs on `http://localhost:3012`

## Usage

```bash
# Create short link
curl -X POST http://localhost:3012/api/v1/links \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very/long/url",
    "customCode": "my-link",
    "title": "Example Link",
    "tags": ["marketing", "campaign"]
  }'

# Response: { "shortUrl": "http://localhost:3012/my-link" }

# Get analytics
curl http://localhost:3012/api/v1/links/my-link/analytics \
  -H "X-API-Key: YOUR_KEY"
```

## Analytics Response
```json
{
  "totalClicks": 1250,
  "byDevice": [
    { "device": "mobile", "clicks": 750 },
    { "device": "desktop", "clicks": 500 }
  ],
  "byBrowser": [
    { "browser": "Chrome", "clicks": 800 },
    { "browser": "Safari", "clicks": 450 }
  ],
  "byCountry": [
    { "country": "US", "clicks": 600 },
    { "country": "UK", "clicks": 350 }
  ]
}
```

## License
MIT
