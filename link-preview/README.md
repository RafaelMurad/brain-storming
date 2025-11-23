# LinkPreview

**URL Metadata Extraction API** - Generate rich link previews like Slack, Discord, and Twitter.

## Features
- **OpenGraph & Twitter Cards** - Extract all meta tags
- **Auto-Caching** - 24-hour cache for performance
- **Batch Requests** - Preview up to 10 URLs at once
- **Favicon Detection** - Auto-detect site favicons

## Quick Start
```bash
npm install && npm run db:push && npm run dev
```
Server runs on `http://localhost:3011`

## Usage

```bash
# Get link preview
curl "http://localhost:3011/api/v1/preview?url=https://github.com" \
  -H "X-API-Key: YOUR_KEY"

# Response
{
  "success": true,
  "data": {
    "url": "https://github.com",
    "title": "GitHub: Let's build from here",
    "description": "GitHub is where over 100 million developers...",
    "image": "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
    "favicon": "https://github.com/favicon.ico",
    "siteName": "GitHub",
    "type": "website",
    "domain": "github.com",
    "cached": false
  }
}

# Batch preview
curl -X POST http://localhost:3011/api/v1/preview/batch \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"urls": ["https://github.com", "https://twitter.com"]}'
```

## SDK Example
```javascript
async function getLinkPreview(url) {
  const res = await fetch(`/api/v1/preview?url=${encodeURIComponent(url)}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  return res.json();
}
```

## License
MIT
