# API Reference

Complete reference for all GitVision API endpoints.

## Authentication

### NextAuth Endpoints

These are handled automatically by NextAuth.js:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin` | GET | Redirect to OAuth provider |
| `/api/auth/callback/github` | GET | OAuth callback handler |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/signout` | POST | Sign out user |
| `/api/auth/csrf` | GET | Get CSRF token |

---

## GitHub API Routes

All GitHub API routes require authentication via the `Authorization` header:

```
Authorization: Bearer <github_access_token>
```

### GET /api/github/repos

Fetch all repositories for the authenticated user.

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/github/repos
```

**Response:**
```json
[
  {
    "id": 123456789,
    "name": "my-awesome-repo",
    "full_name": "username/my-awesome-repo",
    "description": "A description of the repository",
    "html_url": "https://github.com/username/my-awesome-repo",
    "clone_url": "https://github.com/username/my-awesome-repo.git",
    "private": false,
    "fork": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-11-23T15:45:00Z",
    "pushed_at": "2024-11-23T14:30:00Z",
    "size": 1024,
    "stargazers_count": 42,
    "watchers_count": 42,
    "forks_count": 12,
    "open_issues_count": 3,
    "language": "TypeScript",
    "default_branch": "main",
    "topics": ["react", "typescript", "nextjs"],
    "visibility": "public",
    "archived": false
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - GitHub API error

---

### GET /api/github/repos/:owner/:repo/commits

Fetch recent commits for a specific repository.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `owner` | string | Repository owner username |
| `repo` | string | Repository name |

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/github/repos/username/my-repo/commits
```

**Response:**
```json
[
  {
    "sha": "abc123def456789012345678901234567890abcd",
    "message": "Fix authentication bug\n\nThis commit fixes the login flow issue where users were being redirected incorrectly.",
    "author": {
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2024-11-23T14:30:00Z",
      "avatar_url": "https://avatars.githubusercontent.com/u/12345?v=4"
    },
    "url": "https://github.com/username/my-repo/commit/abc123def456"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Repository not found
- `500 Internal Server Error` - GitHub API error

---

### GET /api/github/repos/:owner/:repo/readme

Fetch and render the repository's README as HTML.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `owner` | string | Repository owner username |
| `repo` | string | Repository name |

**Request:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/github/repos/username/my-repo/readme
```

**Response:**
```json
{
  "content": "<h1>Project Title</h1>\n<p>This is the project description...</p>\n<h2>Installation</h2>\n<pre><code>npm install</code></pre>"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - README not found
- `500 Internal Server Error` - GitHub API error

---

### POST /api/github/analyze/:repoId

Analyze a repository's tech stack, architecture, and health.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `repoId` | number | Repository ID |

**Request Body:**
```json
{
  "repo": {
    "id": 123456789,
    "name": "my-repo",
    "full_name": "username/my-repo",
    "description": "Repository description",
    "language": "TypeScript",
    "stargazers_count": 42,
    "forks_count": 12,
    "open_issues_count": 3,
    "pushed_at": "2024-11-23T14:30:00Z",
    "topics": ["react", "typescript"]
  }
}
```

**Response:**
```json
{
  "id": 123456789,
  "name": "my-repo",
  "techStack": ["TypeScript", "JavaScript", "CSS", "HTML"],
  "framework": "Next.js",
  "architecture": [
    {
      "type": "webapp",
      "confidence": 0.85,
      "indicators": ["Has pages/components structure"]
    },
    {
      "type": "api",
      "confidence": 0.7,
      "indicators": ["Has API/routes directory"]
    }
  ],
  "dependencies": [
    {
      "name": "next",
      "version": "^14.0.0",
      "type": "production"
    },
    {
      "name": "react",
      "version": "^18.2.0",
      "type": "production"
    },
    {
      "name": "typescript",
      "version": "^5.0.0",
      "type": "development"
    }
  ],
  "hasCI": true,
  "hasDocs": true,
  "hasTests": true,
  "healthScore": 85,
  "lastActivity": "2024-11-23T14:30:00Z"
}
```

**Architecture Types:**
| Type | Description |
|------|-------------|
| `monolith` | Traditional single application |
| `monorepo` | Multiple packages in one repo |
| `microservice` | Part of microservices architecture |
| `library` | Reusable package/library |
| `cli` | Command-line tool |
| `api` | Backend API service |
| `webapp` | Frontend web application |
| `mobile` | Mobile application |

**Health Score Factors:**
| Factor | Points |
|--------|--------|
| Has CI/CD | +20 |
| Has tests | +20 |
| Has documentation | +15 |
| Recent activity (30 days) | +15 |
| Has description | +10 |
| Has topics | +5 |
| Star count | +1-10 |
| Low issue count (<10) | +5 |

---

## TypeScript Types

### Repository
```typescript
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  topics: string[];
  visibility: string;
  archived: boolean;
}
```

### RepositoryAnalysis
```typescript
interface RepositoryAnalysis {
  id: number;
  name: string;
  techStack: string[];
  framework: string | null;
  architecture: ArchitecturePattern[];
  dependencies: Dependency[];
  hasCI: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  healthScore: number;
  lastActivity: string;
}
```

### Commit
```typescript
interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar_url?: string;
  };
  url: string;
}
```

---

## Error Handling

All API routes return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## Rate Limiting

GitVision uses the GitHub API, which has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Search API**: 30 requests per minute

The app handles rate limiting gracefully by:
1. Caching responses where possible
2. Batching requests
3. Showing user-friendly error messages
