# FeatureFlow

**Feature Flags & A/B Testing API** - Control feature rollouts and run experiments like LaunchDarkly.

## Features
- **Feature Flags** - Toggle features on/off with targeting rules
- **Percentage Rollouts** - Gradually release features to users
- **Targeting Rules** - Target by user attributes (plan, country, etc.)
- **A/B Testing** - Run experiments with multiple variants
- **Conversion Tracking** - Track experiment metrics

## Quick Start
```bash
npm install && npm run db:push && npm run dev
```
Server runs on `http://localhost:3010`

## Usage

### Create Flag
```bash
curl -X POST http://localhost:3010/api/v1/flags \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"key": "dark_mode", "name": "Dark Mode", "type": "boolean"}'

# Enable with 50% rollout
curl -X PATCH http://localhost:3010/api/v1/flags/dark_mode \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"enabled": true, "rolloutPercentage": 50}'
```

### Evaluate Flag
```bash
curl -X POST http://localhost:3010/api/v1/evaluate \
  -H "X-API-Key: YOUR_KEY" \
  -d '{"flagKey": "dark_mode", "userId": "user123"}'
```

### SDK Integration
```javascript
const flags = await fetch('/api/v1/evaluate/all', {
  method: 'POST',
  headers: { 'X-API-Key': API_KEY },
  body: JSON.stringify({ userId: currentUser.id, context: { plan: 'pro' } })
}).then(r => r.json());

if (flags.data.dark_mode) {
  enableDarkMode();
}
```

### A/B Testing
```javascript
// Get variant assignment
const { variant } = await assignExperiment('pricing_test', userId);

// Track conversion
await trackConversion('pricing_test', userId, 'purchase', 99.99);
```

## License
MIT
