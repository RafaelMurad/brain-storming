# Architecture & Concepts

Understanding how GitVision is built.

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│  Next.js App (React)                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components  │  │   Store     │         │
│  │  (Routes)   │◄─┤   (UI)      │◄─┤  (Zustand)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth      │  │   GitHub    │  │  Analysis   │         │
│  │  (NextAuth) │  │   (Octokit) │  │  (Custom)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    External Services                         │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │   GitHub    │  │  OAuth      │                          │
│  │   API       │  │  Provider   │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Login"
    ↓
Redirect to GitHub OAuth
    ↓
User authorizes app
    ↓
GitHub redirects to callback URL
    ↓
NextAuth creates JWT token
    ↓
Token stored in cookie
    ↓
Session available in app
```

### 2. Repository Fetch Flow

```
Dashboard mounts
    ↓
Check session for access token
    ↓
Call /api/github/repos
    ↓
Octokit fetches from GitHub API
    ↓
Response returned to client
    ↓
Store in Zustand
    ↓
UI re-renders with data
```

### 3. Analysis Flow

```
Repository data received
    ↓
Call /api/github/analyze/:id
    ↓
Fetch languages from GitHub
    ↓
Fetch package.json contents
    ↓
Detect framework
    ↓
Detect architecture patterns
    ↓
Calculate health score
    ↓
Return analysis object
    ↓
Store in Zustand analyses map
```

---

## Key Concepts

### 1. Server Components vs Client Components

Next.js 14 uses React Server Components by default. Understanding when to use each:

**Server Components** (default):
- Run on the server only
- Can directly access databases, file system
- Cannot use hooks (`useState`, `useEffect`)
- Cannot use browser APIs

```tsx
// Server Component - src/app/(app)/layout.tsx
export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  return <div>{children}</div>;
}
```

**Client Components** (with `"use client"`):
- Run in the browser
- Can use React hooks
- Can handle user interactions
- Required for interactivity

```tsx
// Client Component - src/app/(app)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [repos, setRepos] = useState([]);
  // ...
}
```

### 2. Route Groups

The `(app)` folder is a **route group** - it organizes routes without affecting the URL:

```
src/app/
├── (app)/              # Route group (not in URL)
│   ├── dashboard/      # → /dashboard
│   ├── canvas/         # → /canvas
│   ├── commits/        # → /commits
│   ├── docs/           # → /docs
│   └── layout.tsx      # Shared layout with auth check
├── page.tsx            # → / (landing page)
└── layout.tsx          # Root layout
```

**Benefits:**
- Share layouts between routes
- Organize code logically
- Apply middleware to groups

### 3. API Routes

Next.js API routes handle backend logic in the same project:

```
src/app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts        # → /api/auth/* (catch-all)
└── github/
    ├── repos/
    │   └── route.ts        # → /api/github/repos
    └── analyze/
        └── [repoId]/
            └── route.ts    # → /api/github/analyze/:repoId
```

**Route handler example:**
```tsx
// src/app/api/github/repos/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  // ... fetch and return data
  return NextResponse.json(data);
}
```

### 4. State Management with Zustand

Zustand provides simple, scalable state management:

**Store definition:**
```tsx
// src/store/index.ts
import { create } from "zustand";

interface AppState {
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;
  selectedRepoId: number | null;
  setSelectedRepoId: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  repositories: [],
  setRepositories: (repos) => set({ repositories: repos }),
  selectedRepoId: null,
  setSelectedRepoId: (id) => set({ selectedRepoId: id }),
}));
```

**Usage in components:**
```tsx
function Dashboard() {
  const { repositories, setRepositories } = useAppStore();

  useEffect(() => {
    fetchRepos().then(setRepositories);
  }, []);

  return <div>{repositories.map(...)}</div>;
}
```

### 5. React Flow Canvas

React Flow renders the interactive node graph:

```tsx
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";

<ReactFlow
  nodes={nodes}              // Array of node objects
  edges={edges}              // Array of edge objects
  onNodesChange={handler}    // Handle node drag/select
  onEdgesChange={handler}    // Handle edge changes
  onConnect={handler}        // Handle new connections
  nodeTypes={customNodes}    // Custom node components
>
  <Background variant="dots" />
  <Controls />
  <MiniMap />
</ReactFlow>
```

**Node structure:**
```tsx
const node = {
  id: "repo-123",
  type: "repository",        // Maps to nodeTypes
  position: { x: 100, y: 200 },
  data: {
    label: "my-repo",
    repository: { /* repo data */ },
    analysis: { /* analysis data */ },
  },
};
```

**Edge structure:**
```tsx
const edge = {
  id: "edge-1-2",
  source: "repo-1",          // Source node id
  target: "repo-2",          // Target node id
  type: "smoothstep",        // Edge style
  animated: true,            // Animate the edge
};
```

---

## Project Structure

```
gitvision/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (app)/            # Protected routes
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   │
│   ├── components/
│   │   ├── canvas/           # React Flow components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # Reusable UI components
│   │   └── providers.tsx     # React context providers
│   │
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── github.ts         # GitHub API functions
│   │   └── utils.ts          # Helper functions
│   │
│   ├── store/
│   │   └── index.ts          # Zustand store
│   │
│   └── types/
│       └── index.ts          # TypeScript definitions
│
├── docs/                     # Documentation
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## Security Considerations

### Token Handling
- GitHub access tokens are stored in JWT (httpOnly cookie)
- Tokens are never exposed to client-side JavaScript
- API routes validate tokens on each request

### OAuth Scopes
The app requests these GitHub scopes:
- `read:user` - Read user profile
- `user:email` - Read user email
- `repo` - Access repositories (public and private)

### Environment Variables
- Never commit `.env.local` to version control
- Use different OAuth apps for development/production
- Rotate `NEXTAUTH_SECRET` periodically
