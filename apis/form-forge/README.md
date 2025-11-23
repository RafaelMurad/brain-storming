# FormForge

**Dynamic Form Builder API** - Create forms, collect submissions, with validation and webhooks.

## Features
- **Dynamic Forms** - Define forms with JSON field schemas
- **Validation** - Built-in validation for all field types
- **Webhooks** - Send submissions to your backend
- **Email Notifications** - Get notified on new submissions
- **CSV Export** - Export submissions as CSV
- **Spam Protection** - Mark submissions as spam

## Quick Start
```bash
npm install && npm run db:push && npm run dev
```
Server runs on `http://localhost:3014`

## Usage

### Create Form
```bash
curl -X POST http://localhost:3014/api/v1/forms \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "contact",
    "name": "Contact Form",
    "fields": [
      {"name": "name", "type": "text", "label": "Name", "required": true},
      {"name": "email", "type": "email", "label": "Email", "required": true},
      {"name": "message", "type": "textarea", "label": "Message", "required": true, "maxLength": 1000},
      {"name": "plan", "type": "select", "label": "Plan", "options": ["free", "pro", "enterprise"]}
    ],
    "webhookUrl": "https://your-app.com/webhook",
    "successMessage": "Thanks for contacting us!"
  }'
```

### Submit Form (Public)
```bash
curl -X POST http://localhost:3014/api/v1/submit/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!",
    "plan": "pro"
  }'
```

### Get Submissions
```bash
curl http://localhost:3014/api/v1/forms/contact/submissions \
  -H "X-API-Key: YOUR_KEY"
```

### Export to CSV
```bash
curl http://localhost:3014/api/v1/forms/contact/export \
  -H "X-API-Key: YOUR_KEY" > submissions.csv
```

## Field Types
| Type | Validation |
|------|------------|
| `text` | minLength, maxLength, pattern |
| `email` | Email format |
| `number` | min, max |
| `url` | Valid URL |
| `phone` | Phone format |
| `textarea` | maxLength |
| `select` | Must be in options |
| `checkbox` | Boolean |
| `radio` | Must be in options |
| `date` | Valid date |

## Frontend Integration
```html
<form action="http://localhost:3014/api/v1/submit/contact" method="POST">
  <input name="name" required>
  <input name="email" type="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## License
MIT
