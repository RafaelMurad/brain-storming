# SnapForge - Technical Learnings Document

This document captures the key technical decisions, patterns, and learnings from building SnapForge.

## Architecture Overview

### Tech Stack Decision

**Chosen Stack:**
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js (minimal, proven, flexible)
- **Screenshot Engine**: Puppeteer (Chrome DevTools Protocol)
- **Database**: SQLite via Prisma (easy setup, PostgreSQL-ready)
- **Validation**: Zod (runtime type safety)
- **Logging**: Winston (structured, configurable)

**Why These Choices:**

1. **TypeScript over JavaScript**: Type safety catches bugs early, improves IDE support, and serves as documentation. The initial setup cost pays off quickly in maintainability.

2. **Express over Fastify/Koa**: While Fastify is faster, Express has a larger ecosystem, more middleware options, and easier debugging. For this use case, the performance difference is negligible compared to screenshot generation time.

3. **Puppeteer over Playwright**: Puppeteer has better Chrome-specific optimizations and smaller bundle size. Playwright is better for cross-browser testing, but we only need Chrome.

4. **SQLite for MVP**: Zero configuration, file-based, and Prisma makes it trivial to migrate to PostgreSQL later. Perfect for demos and local development.

## Key Design Patterns

### 1. Service Layer Pattern

All business logic lives in service files, keeping routes thin:

```typescript
// routes/screenshot.routes.ts - thin controller
router.post('/', authenticate, async (req, res) => {
  const result = await takeScreenshot(req.apiKey.id, validated);
  res.json({ success: true, data: result });
});

// services/screenshot.service.ts - business logic
export const takeScreenshot = async (apiKeyId: string, options: ScreenshotOptions) => {
  // All the actual work happens here
};
```

**Benefits:**
- Routes are easy to test (mock the service)
- Services are reusable across routes
- Clear separation of concerns

### 2. Feature Flags System

Implemented a hybrid feature flag system:

```typescript
// Environment-based (fast, no DB call)
const flags = featureFlagsSchema.parse(process.env);

// Database-based (dynamic, requires query)
const dbFlags = await prisma.featureFlag.findMany();
```

**Key Learnings:**
- Cache flags in memory with TTL (1 minute)
- Provide sync and async methods for different use cases
- Environment flags are defaults; database flags override

### 3. API Key Authentication

Secure API key handling:

```typescript
// Never store raw keys - hash them
const hashedKey = crypto.createHmac('sha256', secret).update(rawKey).digest('hex');

// Only return raw key once (on creation)
return { key: rawKey }; // Never shown again

// Store and compare hashes
const apiKey = await prisma.apiKey.findUnique({ where: { key: hashedKey } });
```

**Security Considerations:**
- Use HMAC with a secret for hashing (better than plain SHA256)
- Prefix keys for identification (`sf_` for SnapForge)
- Support multiple auth methods (header, query param) for flexibility

### 4. Browser Instance Management

Single browser instance with page pooling:

```typescript
let browserInstance: Browser | null = null;

const getBrowser = async () => {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch(options);
  }
  return browserInstance;
};
```

**Why This Matters:**
- Browser launch is expensive (~1-2 seconds)
- Reusing browser reduces memory footprint
- Pages are lightweight; create/destroy per request
- Handle disconnection gracefully

### 5. Error Handling Strategy

Centralized error handling with custom error classes:

```typescript
export class AppError extends Error {
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  // Handle unexpected errors differently
});
```

**Benefits:**
- Consistent error response format
- Distinguish between operational and programming errors
- Include error codes for client-side handling

## Rate Limiting Strategy

Three-tier rate limiting:

```typescript
// 1. Burst limiter - prevent rapid-fire requests
burstRateLimiter: 10 requests/second

// 2. Standard limiter - general API protection
standardRateLimiter: 100 requests/minute

// 3. Strict limiter - expensive operations
strictRateLimiter: 50 requests/minute (screenshots)
```

**Key Insight**: Rate limits should be per-API-key when authenticated, falling back to IP for anonymous requests.

## Testing Approach

### Unit Tests Focus

Prioritize testing:
1. **Services** - Business logic is most critical
2. **Middleware** - Auth and validation
3. **Utilities** - Feature flags, hashing

### Test Setup Pattern

```typescript
// Isolate test database
process.env.DATABASE_URL = 'file:./test.db';

// Clean up between tests
beforeEach(async () => {
  await prisma.apiKey.deleteMany({});
});

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
```

## Performance Optimizations

### 1. Screenshot Capture

```typescript
// Optimal Puppeteer settings for screenshots
await page.goto(url, {
  waitUntil: 'networkidle2', // Wait for network to be mostly idle
  timeout: 30000,
});

// Disable unnecessary features
const launchOptions = {
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
};
```

### 2. Response Time Tracking

```typescript
// Track processing time for every screenshot
const startTime = Date.now();
// ... capture logic ...
const processingMs = Date.now() - startTime;
```

**Use This Data For:**
- Performance monitoring
- Billing (usage-based pricing)
- Identifying slow URLs

## Scaling Considerations

### Current Limitations

1. **Single Browser Instance**: Works for ~10-20 concurrent requests
2. **Local File Storage**: Need S3/GCS for production
3. **SQLite**: Single-writer limitation

### Production Upgrades

1. **Browser Pool**: Multiple browser instances with job queue
2. **Cloud Storage**: S3 with presigned URLs
3. **PostgreSQL**: Proper concurrent access
4. **Redis**: Rate limiting, caching, job queue

## Common Pitfalls Avoided

### 1. Memory Leaks

```typescript
// Always close pages after use
try {
  // ... use page ...
} finally {
  await page.close(); // Critical!
}
```

### 2. Zombie Processes

```typescript
// Graceful shutdown handler
process.on('SIGTERM', async () => {
  await closeBrowser();
  await disconnectDatabase();
  process.exit(0);
});
```

### 3. Timeout Handling

```typescript
// Don't let requests hang forever
await page.goto(url, { timeout: 30000 });

// Also limit total request time
app.use(timeout('60s'));
```

## What I'd Do Differently

1. **Queue System from Start**: Even for MVP, a simple in-memory queue would handle concurrent requests better.

2. **Metrics from Day 1**: Add Prometheus metrics early - it's easier to add them initially than retrofit later.

3. **OpenAPI Specification**: Generate API docs automatically instead of writing markdown.

## Useful Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [Express Production Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

*Document created as part of the SnapForge project to capture learnings for future reference.*
