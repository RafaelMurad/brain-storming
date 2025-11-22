# CelebrateKit

**Embeddable Celebration & Gamification API**

Add confetti, achievements, leaderboards, and joy to any web application with a simple script tag.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

## Features

- **Instant Celebrations**: Confetti, fireworks, stars, hearts, coins
- **Achievements System**: Define and unlock achievements
- **Leaderboards**: Track user progress and rankings
- **Customizable**: Colors, particle count, animations
- **Zero Dependencies**: Lightweight vanilla JS widget
- **Easy Integration**: One script tag to add to any site

## Quick Start

### 1. Start the API

```bash
cd celebratekit

npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npx tsx src/scripts/seed.ts
npm run dev
```

### 2. Add to Your Website

```html
<script src="http://localhost:3004/widget/celebratekit.js"></script>
<script>
  // Initialize with your app ID
  CelebrateKit.init({
    appId: 'your-app-id',
    userId: 'current-user-id' // Optional
  });

  // Trigger celebrations!
  CelebrateKit.confetti();
</script>
```

## Widget API

### Initialization

```javascript
CelebrateKit.init({
  appId: 'your-app-id',     // Required for logging/achievements
  userId: 'user-123',        // Optional: enables user features
  apiBase: 'http://localhost:3004' // Optional: custom API URL
});
```

### Quick Celebrations

```javascript
// Classic confetti
CelebrateKit.confetti();

// Fireworks explosion
CelebrateKit.fireworks();

// Golden stars
CelebrateKit.stars();

// Love hearts
CelebrateKit.hearts();

// Gold coins
CelebrateKit.coins();
```

### Custom Celebrations

```javascript
CelebrateKit.confetti({
  particleCount: 200,
  duration: 5000,
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  origin: { x: 0.5, y: 0.3 },
  spread: 100
});
```

### Presets via API

```javascript
// Use server-defined presets
await CelebrateKit.celebrate('success');
await CelebrateKit.celebrate('achievement');
await CelebrateKit.celebrate('epic');
```

### Achievements

```javascript
// Unlock an achievement
const result = await CelebrateKit.unlockAchievement('first_purchase');

// Get user's achievements
const achievements = await CelebrateKit.getAchievements();
```

### Leaderboard & Progress

```javascript
// Add points
await CelebrateKit.addPoints(100);

// Get leaderboard
const leaderboard = await CelebrateKit.getLeaderboard(10);

// Get user stats
const stats = await CelebrateKit.getUserStats();
```

## REST API

### Celebrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/celebrate` | Trigger celebration |
| GET | `/api/v1/celebrate/presets` | Get available presets |
| GET | `/api/v1/celebrate/stats/:appId` | Get celebration stats |

### Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/achievements` | Create achievement |
| GET | `/api/v1/achievements/:appId` | List achievements |
| POST | `/api/v1/achievements/unlock` | Unlock for user |
| GET | `/api/v1/achievements/:appId/user/:userId` | User's achievements |

### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/leaderboard/:appId` | Get leaderboard |
| GET | `/api/v1/leaderboard/:appId/user/:userId` | Get user rank |
| POST | `/api/v1/leaderboard/progress` | Update progress |

## Celebration Presets

| Preset | Type | Best For |
|--------|------|----------|
| `default` | Confetti | General celebrations |
| `success` | Green confetti | Completed tasks |
| `achievement` | Stars | Unlocking achievements |
| `love` | Hearts | Social features |
| `fireworks` | Fireworks | Major milestones |
| `coins` | Coins | Purchases/rewards |
| `epic` | Epic confetti | Rare achievements |

## Achievement Rarities

| Rarity | Points | Celebration |
|--------|--------|-------------|
| Common | 10 | Success confetti |
| Rare | 25 | Achievement stars |
| Epic | 50 | Epic confetti |
| Legendary | 100 | Fireworks |

## Integration Examples

### React

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.CelebrateKit?.init({ appId: 'your-app-id' });
  }, []);

  const handlePurchase = () => {
    // Complete purchase...
    window.CelebrateKit?.coins();
    window.CelebrateKit?.unlockAchievement('first_purchase');
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

### Integration with Other Projects

CelebrateKit works great with our other projects:

**SnapForge** (Screenshot API):
```javascript
// Celebrate when screenshot is captured
async function captureScreenshot(url) {
  const result = await snapforge.capture(url);
  CelebrateKit.confetti();
  return result;
}
```

**PulseWatch** (Social Listening):
```javascript
// Celebrate high-value leads
if (mention.leadScore >= 80) {
  CelebrateKit.stars();
  CelebrateKit.unlockAchievement('hot_lead');
}
```

**ZenTeam** (Burnout Prevention):
```javascript
// Celebrate wellness improvements
if (wellnessScore > previousScore) {
  CelebrateKit.hearts();
}
```

## Development

```bash
npm run dev       # Start server
npm test          # Run tests
npm run lint      # Lint code
npm run db:studio # Database GUI
```

## Project Structure

```
celebratekit/
├── src/
│   ├── config/        # Configuration
│   ├── lib/           # Database
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── scripts/       # CLI scripts
├── public/
│   └── celebratekit.js # Embeddable widget
└── prisma/
    └── schema.prisma
```

## License

MIT License

---

Built to bring joy to your users! 🎉
