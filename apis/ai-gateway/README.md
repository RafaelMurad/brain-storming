# AI Gateway

**Smart AI Provider Proxy** - Unified API for multiple AI providers with caching, cost tracking, and budget controls.

## Features

- **Multi-Provider Support** - OpenAI, Anthropic (Claude) through single API
- **Response Caching** - Cache identical requests to save costs
- **Cost Tracking** - Real-time cost tracking per request
- **Budget Controls** - Set daily/monthly spending limits
- **Usage Analytics** - Detailed usage stats and cost breakdown
- **Rate Limiting** - Per-key rate limits
- **Model Pricing** - Automatic cost calculation for all models

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Set your API keys
cp .env.example .env
# Edit .env with your OpenAI/Anthropic keys

# Start development server
npm run dev
```

Server runs on `http://localhost:3007`

## API Usage

### 1. Create a Project

```bash
curl -X POST http://localhost:3007/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "openaiKey": "sk-your-openai-key"
  }'
```

### 2. Chat Completion

```bash
curl -X POST http://localhost:3007/api/v1/completions/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "cache": true
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "chatcmpl-xxx",
    "model": "gpt-4o-mini",
    "choices": [{
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      }
    }],
    "usage": {
      "promptTokens": 25,
      "completionTokens": 8,
      "totalTokens": 33
    },
    "cost": 0.000012,
    "cached": false,
    "latencyMs": 450
  }
}
```

### 3. Create Embeddings

```bash
curl -X POST http://localhost:3007/api/v1/completions/embeddings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "Hello, world!",
    "cache": true
  }'
```

### 4. Check Usage & Costs

```bash
# Usage statistics
curl http://localhost:3007/api/v1/usage/stats?days=30 \
  -H "Authorization: Bearer YOUR_API_KEY"

# Cost breakdown
curl http://localhost:3007/api/v1/usage/costs \
  -H "Authorization: Bearer YOUR_API_KEY"

# Budget status
curl http://localhost:3007/api/v1/usage/budget \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Integration Example

```javascript
// Simple AI Gateway client
class AIGateway {
  constructor(apiKey, baseUrl = 'http://localhost:3007') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/v1/completions/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages,
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens,
        cache: options.cache !== false,
      }),
    });
    const data = await response.json();
    return data.data;
  }

  async embed(input, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/v1/completions/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'text-embedding-3-small',
        input,
        cache: options.cache !== false,
      }),
    });
    const data = await response.json();
    return data.data;
  }
}

// Usage
const ai = new AIGateway('your_api_key');

const result = await ai.chat([
  { role: 'user', content: 'Explain quantum computing in simple terms' }
]);
console.log(result.choices[0].message.content);
console.log(`Cost: $${result.cost}, Cached: ${result.cached}`);
```

## Chat Completion Options

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model to use (default: gpt-4o-mini) |
| `messages` | array | Conversation messages |
| `temperature` | number | Randomness (0-2, default: 0.7) |
| `maxTokens` | number | Max output tokens |
| `cache` | boolean | Enable caching (default: true) |
| `cacheTtl` | number | Cache TTL in seconds (60-86400) |
| `metadata` | object | Custom metadata |

## Supported Models

| Model | Provider | Input $/1K | Output $/1K | Context |
|-------|----------|-----------|-------------|---------|
| gpt-4o | OpenAI | $0.005 | $0.015 | 128K |
| gpt-4o-mini | OpenAI | $0.00015 | $0.0006 | 128K |
| gpt-4-turbo | OpenAI | $0.01 | $0.03 | 128K |
| gpt-3.5-turbo | OpenAI | $0.0005 | $0.0015 | 16K |
| claude-3.5-sonnet | Anthropic | $0.003 | $0.015 | 200K |
| claude-3-opus | Anthropic | $0.015 | $0.075 | 200K |
| claude-3-haiku | Anthropic | $0.00025 | $0.00125 | 200K |

## Budget Controls

Set spending limits per API key:

```bash
curl -X POST http://localhost:3007/api/v1/projects/api-keys \
  -H "Authorization: Bearer ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limited Key",
    "dailyBudget": 5.00,
    "monthlyBudget": 50.00
  }'
```

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma (PostgreSQL-ready)
- **AI SDK**: OpenAI Node.js SDK
- **Validation**: Zod

## License

MIT
