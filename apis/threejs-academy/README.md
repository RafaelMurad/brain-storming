# 🎓 Three.js Academy API

Backend API for the Three.js Academy learning platform. Tracks user progress, achievements, code submissions, and provides authentication.

## 🌟 Features

- **GitHub OAuth Authentication** - Secure login via GitHub
- **Progress Tracking** - Save and sync lesson completion across devices
- **Achievement System** - Unlock achievements as you learn
- **Code Submissions** - Store and retrieve exercise solutions
- **Notes System** - Personal notes for each lesson
- **Rate Limiting** - Protection against abuse

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Navigate to the API directory
cd apis/threejs-academy

# Install dependencies and set up database
npm run setup

# Or manually:
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Configuration

Create a `.env` file (copy from `.env.example`):

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production!)
JWT_SECRET="your-secret-key"

# Server
PORT=3001

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CALLBACK_URL="http://localhost:3001/api/v1/auth/github/callback"

# Frontend URL (for OAuth redirects)
FRONTEND_URL="http://localhost:3000"
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

The server will start at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/github` | Redirect to GitHub OAuth |
| GET | `/api/v1/auth/github/callback` | OAuth callback handler |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/logout` | Logout and invalidate session |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/progress` | Get all user progress |
| POST | `/api/v1/progress` | Update lesson progress |
| GET | `/api/v1/progress/:lessonId` | Get specific lesson progress |

### Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/achievements` | Get all achievements |
| GET | `/api/v1/achievements/user` | Get user's unlocked achievements |

### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/exercises/:lessonId` | Get exercise submissions |
| POST | `/api/v1/exercises` | Submit exercise solution |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notes` | Get all user notes |
| GET | `/api/v1/notes/:lessonId` | Get notes for a lesson |
| POST | `/api/v1/notes` | Create/update note |
| DELETE | `/api/v1/notes/:id` | Delete a note |

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Prisma** - Database ORM
- **SQLite** - Database (dev), PostgreSQL (production)
- **JWT** - Authentication tokens
- **Zod** - Request validation
- **Winston** - Logging
- **Helmet** - Security headers
- **TypeScript** - Type safety

## 📁 Project Structure

```
threejs-academy/
├── prisma/
│   └── schema.prisma    # Database schema
├── src/
│   ├── config/          # Configuration and logger
│   ├── lib/             # Database client
│   ├── middleware/      # Auth, rate limiting
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   └── index.ts         # Entry point
├── .env                 # Environment variables
└── package.json
```

## 🔒 Security

- JWT tokens expire after 30 days
- Passwords are never stored (OAuth only)
- Rate limiting: 100 requests per 15 minutes
- CORS restricted to allowed origins
- Helmet security headers enabled

## 🧪 Database Management

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Create a new migration
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

## 🚢 Deployment

For production:

1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure PostgreSQL instead of SQLite
4. Set proper `CORS_ORIGINS`
5. Use HTTPS for OAuth callback URL

## 📄 License

MIT License

---

**Part of the Three.js Academy Learning Platform** 🎨✨
