# API Template

Express.js API with TypeScript, Zod validation, and service-based architecture.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:3001

## Project Structure

```
src/
├── index.ts              # Entry point
├── routes/               # Route definitions
│   ├── index.ts          # Route aggregator
│   └── users.ts          # User routes
├── services/             # Business logic
│   └── userService.ts    # User service
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Error handling
│   ├── notFoundHandler.ts# 404 handler
│   └── validate.ts       # Request validation
└── types/                # TypeScript types
    └── index.ts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1` | API info |
| GET | `/api/v1/users` | List all users |
| GET | `/api/v1/users/:id` | Get user by ID |
| POST | `/api/v1/users` | Create user |
| DELETE | `/api/v1/users/:id` | Delete user |

## Adding New Routes

1. Create route file in `src/routes/`
2. Define validation schemas with Zod
3. Create service in `src/services/`
4. Mount route in `src/routes/index.ts`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing key | - |

## Production Notes

- Replace in-memory storage with database (PostgreSQL recommended)
- Add authentication middleware
- Set up rate limiting
- Configure CORS for production domains
- Add request logging to external service
