# NotifyFlow

**Unified Multi-Channel Notification API** - Send emails, webhooks, SMS, and push notifications through a single API with templates and scheduling.

## Features

- **Multi-Channel Delivery** - Email, Webhooks, SMS, Push notifications
- **Template Engine** - Handlebars-powered templates with variables
- **Batch Sending** - Send up to 1000 notifications in one request
- **Scheduling** - Schedule notifications for future delivery
- **Delivery Tracking** - Track sent, delivered, opened, clicked, failed
- **Auto-Retry** - Automatic retry with exponential backoff
- **Priority Queue** - High-priority notifications delivered first
- **Webhook Callbacks** - Get notified of delivery events

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Server runs on `http://localhost:3006`

## API Usage

### 1. Create a Project

```bash
curl -X POST http://localhost:3006/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My App"}'
```

### 2. Create a Template

```bash
curl -X POST http://localhost:3006/api/v1/templates \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "welcome_email",
    "subject": "Welcome to {{appName}}, {{userName}}!",
    "body": "<h1>Hello {{userName}}!</h1><p>Welcome to {{appName}}. Get started by visiting your <a href=\"{{dashboardUrl}}\">dashboard</a>.</p>",
    "variables": [
      {"name": "userName", "type": "string", "required": true},
      {"name": "appName", "type": "string", "default": "Our App"},
      {"name": "dashboardUrl", "type": "string", "required": true}
    ]
  }'
```

### 3. Send Notifications

```bash
# Using template
curl -X POST http://localhost:3006/api/v1/notifications/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.com",
    "templateName": "welcome_email",
    "data": {
      "userName": "John",
      "appName": "MyApp",
      "dashboardUrl": "https://myapp.com/dashboard"
    }
  }'

# Direct send (no template)
curl -X POST http://localhost:3006/api/v1/notifications/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.com",
    "subject": "Your order has shipped!",
    "body": "<p>Your order #12345 is on its way.</p>"
  }'

# Webhook notification
curl -X POST http://localhost:3006/api/v1/notifications/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "https://your-webhook.com/endpoint",
    "recipientType": "webhook",
    "body": "Order completed",
    "data": {"orderId": "12345", "amount": 99.99}
  }'

# Scheduled notification
curl -X POST http://localhost:3006/api/v1/notifications/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.com",
    "subject": "Reminder: Your trial ends tomorrow",
    "body": "<p>Your free trial expires in 24 hours.</p>",
    "scheduledFor": "2024-12-01T09:00:00Z"
  }'
```

### 4. Check Delivery Status

```bash
curl http://localhost:3006/api/v1/notifications/NOTIFICATION_ID \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get delivery stats
curl http://localhost:3006/api/v1/notifications/stats/overview?days=7 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Integration Example

```javascript
// Node.js SDK wrapper
class NotifyFlow {
  constructor(apiKey, baseUrl = 'http://localhost:3006') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async send(notification) {
    const response = await fetch(`${this.baseUrl}/api/v1/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(notification),
    });
    return response.json();
  }

  async sendEmail(to, subject, body, data = {}) {
    return this.send({
      recipient: to,
      recipientType: 'email',
      subject,
      body,
      data,
    });
  }

  async sendWithTemplate(to, templateName, data) {
    return this.send({
      recipient: to,
      templateName,
      data,
    });
  }

  async sendWebhook(url, payload) {
    return this.send({
      recipient: url,
      recipientType: 'webhook',
      data: payload,
    });
  }
}

// Usage
const notify = new NotifyFlow('your_api_key');

await notify.sendEmail(
  'user@example.com',
  'Welcome!',
  '<h1>Hello!</h1>'
);

await notify.sendWithTemplate('user@example.com', 'welcome_email', {
  userName: 'John',
  dashboardUrl: 'https://app.com/dashboard'
});
```

## Template Syntax

Templates use [Handlebars](https://handlebarsjs.com/) syntax:

```handlebars
<!-- Variables -->
Hello {{userName}}!

<!-- Conditionals -->
{{#if isPremium}}
  Thanks for being a premium member!
{{else}}
  Upgrade to premium for more features.
{{/if}}

<!-- Loops -->
{{#each items}}
  <li>{{this.name}} - ${{this.price}}</li>
{{/each}}

<!-- Helpers -->
{{formatDate createdAt}}
{{uppercase status}}
```

## Notification Schema

| Field | Type | Description |
|-------|------|-------------|
| `recipient` | string | Email, phone, webhook URL, or device token |
| `recipientType` | string | "email", "webhook", "sms", "push" |
| `templateName` | string | Template to use (optional) |
| `subject` | string | Subject line (email) |
| `body` | string | Notification content |
| `data` | object | Template variables |
| `metadata` | object | Custom metadata |
| `tags` | array | Tags for filtering |
| `scheduledFor` | ISO string | Future delivery time |
| `priority` | number | 1 (highest) to 10 (lowest) |

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Prisma (PostgreSQL-ready)
- **Templates**: Handlebars
- **Email**: Nodemailer (SMTP)
- **Validation**: Zod

## License

MIT
