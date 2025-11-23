# GitVision - GitHub Repository Intelligence Dashboard

A unified dashboard to visualize, manage, and understand all your GitHub projects. Features an interactive canvas like Figma, smart repository analysis, one-click deployments, commit timelines, and a documentation hub.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-12-purple)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Detailed Setup Guide](#detailed-setup-guide)
- [Usage Manual](#usage-manual)
- [Architecture & Concepts](#architecture--concepts)
- [Technology Deep Dive](#technology-deep-dive)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)

---

## Features

### 1. Visual Architecture Canvas
- **Interactive node-based visualization** of all your repositories
- **Drag-and-drop** interface similar to Figma or Miro
- **Auto-grouping** by framework/technology (Next.js, React, Express, etc.)
- **Smart edge connections** showing relationships between repos
- **Mini-map** for navigation in large canvases
- **Zoom controls** and pan functionality
- **Custom groups** - create your own organizational containers

### 2. Smart Repository Analysis
- **Auto-detect tech stacks** - Languages, frameworks, and libraries
- **Architecture pattern detection** - Monolith, monorepo, API, webapp, library, CLI
- **Health scoring** (0-100%) based on:
  - CI/CD configuration presence
  - Test setup detection
  - Documentation quality
  - Recent activity
  - Issue count
- **Dependency analysis** from package.json

### 3. Unified Dashboard
- **All repositories** in one centralized view
- **Grid and list** view options
- **Filter by language** (TypeScript, JavaScript, Python, etc.)
- **Search** by name or description
- **Quick stats** - Total repos, stars, languages, frameworks
- **Repository cards** with health indicators

### 4. One-Click Deployments
- Deploy to **Vercel**, **Netlify**, **Railway**, or **Render**
- Single-click deployment triggers
- Opens deployment platform with your repo pre-selected

### 5. Commit Timeline
- **Unified commit history** across all repositories
- **Visual timeline** grouped by date
- **Search and filter** commits
- **Author avatars** and commit details
- **Direct links** to GitHub

### 6. Documentation Hub
- Browse **README files** from all repositories
- **Side-by-side** documentation viewer
- **Search** across all projects
- **Rendered markdown** with syntax highlighting

---

## Screenshots

### Landing Page
The landing page showcases features and provides GitHub OAuth login.

### Dashboard View
The main dashboard displays all repositories with health scores, tech stacks, and quick actions.

### Canvas View
The interactive canvas visualizes repositories as draggable nodes, grouped by framework.

### Commits Timeline
A unified view of commits across all repositories, searchable and filterable.

### Documentation Hub
Browse and read README files from any repository without leaving the app.

---

## Quick Start

```bash
# 1. Navigate to the project
cd gitvision

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local with your GitHub OAuth credentials (see setup guide below)

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

---

## Detailed Setup Guide

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | 2.x | Version control |
| GitHub Account | - | OAuth authentication |

### Step 1: Create a GitHub OAuth Application

GitHub OAuth is required for users to authenticate and access their repositories.

1. **Navigate to GitHub Developer Settings**
   - Go to: https://github.com/settings/developers
   - Or: GitHub → Settings → Developer settings → OAuth Apps

2. **Click "New OAuth App"**

3. **Fill in the application details:**

   | Field | Value | Description |
   |-------|-------|-------------|
   | Application name | `GitVision` | Display name shown to users |
   | Homepage URL | `http://localhost:3000` | Your app's homepage |
   | Application description | `GitHub Repository Intelligence Dashboard` | Optional description |
   | Authorization callback URL | `http://localhost:3000/api/auth/callback/github` | **Critical!** Must be exact |

4. **Click "Register application"**

5. **Copy your credentials:**
   - **Client ID**: Displayed on the app page (e.g., `Iv1.a1b2c3d4e5f6g7h8`)
   - **Client Secret**: Click "Generate a new client secret" and copy immediately

   > ⚠️ **Important**: The client secret is only shown once! Save it securely.

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your values:**
   ```env
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # GitHub OAuth App Credentials
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   # Option 1: Using OpenSSL
   openssl rand -base64 32

   # Option 2: Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Next.js 14 and React 18
- React Flow for canvas visualization
- Radix UI components
- Tailwind CSS for styling
- NextAuth.js for authentication
- Octokit for GitHub API
- Zustand for state management

### Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### Step 5: First Login

1. Open http://localhost:3000
2. Click "Connect with GitHub"
3. Authorize the application on GitHub
4. You'll be redirected to the dashboard with your repositories

---

## Usage Manual

### Navigation

The app has four main views accessible from the sidebar:

| Icon | Page | Path | Description |
|------|------|------|-------------|
| 📊 | Dashboard | `/dashboard` | Overview of all repositories |
| 🗺️ | Canvas | `/canvas` | Visual architecture map |
| 📝 | Commits | `/commits` | Unified commit timeline |
| 📄 | Docs | `/docs` | Documentation browser |

### Dashboard View

#### Overview Stats
At the top, you'll see aggregate statistics:
- **Total Repositories**: Count of all repos (public + private)
- **Total Stars**: Combined stars across all repos
- **Languages**: Number of unique programming languages
- **Frameworks**: Detected frameworks (Next.js, React, etc.)
- **Avg Health Score**: Average health across analyzed repos
- **Open Issues**: Total open issues

#### Repository Cards
Each repository is displayed as a card showing:

```
┌─────────────────────────────────────┐
│ repo-name                    [🔗]   │
│ Description of the repository...    │
├─────────────────────────────────────┤
│ [Next.js] [TypeScript]              │
│ ⭐ 42  🍴 12  ⚠️ 3  🕐 2h ago       │
│ ████████████░░░░░░░░ 75%            │
├─────────────────────────────────────┤
│ [Commits] [Docs] [Deploy]           │
└─────────────────────────────────────┘
```

- **Framework badge**: Detected framework
- **Language badges**: Primary languages with color indicators
- **Stats row**: Stars, forks, issues, last activity
- **Health bar**: Visual health score (green/yellow/red)
- **Quick actions**: View commits, docs, or trigger deployment

#### Filtering and Search
- **Search box**: Filter by repository name or description
- **Language filter**: Dropdown to filter by programming language
- **View toggle**: Switch between grid and list views

#### Detail Panel
Click any repository to open the detail panel:
- **Commits tab**: Recent commits for that repository
- **Docs tab**: README file rendered as HTML

### Canvas View

The canvas provides a visual map of your repositories.

#### Canvas Controls

| Control | Action |
|---------|--------|
| Scroll | Zoom in/out |
| Drag (background) | Pan the canvas |
| Drag (node) | Move repository node |
| Click (node) | Select repository |
| Ctrl + Click | Multi-select |

#### Toolbar Actions

- **Add Group**: Create a custom container to organize repos
- **Auto Layout**: Automatically arrange nodes in a grid
- **Search**: Filter visible nodes by name

#### Node Types

1. **Repository Nodes**: Individual repositories showing:
   - Name and description
   - Tech stack badges
   - Stats (stars, forks, issues)
   - Health indicators
   - External link to GitHub

2. **Group Nodes**: Containers that can hold multiple repos
   - Auto-generated by framework (Next.js group, React group, etc.)
   - Custom groups can be created and resized

#### Connections (Edges)
Lines between nodes indicate relationships:
- **Same framework**: Repos sharing the same framework
- **Shared dependencies**: Repos with common packages

### Commits View

A unified timeline of commits across all repositories.

#### Timeline Structure
```
📅 November 23, 2024 (5)
├── repo-a: Fix authentication bug
│   👤 John Doe • 2h ago • abc1234
├── repo-b: Add new feature
│   👤 Jane Smith • 4h ago • def5678
└── ...

📅 November 22, 2024 (12)
├── ...
```

#### Filtering
- **Search**: Find commits by message or author
- **Repository filter**: Show commits from specific repo only
- **Commit count**: Badge showing total commits displayed

### Docs View

Browse documentation from all your repositories.

#### Interface
```
┌──────────────┬─────────────────────────────┐
│ Repository   │ README.md                   │
│ List         │                             │
│              │ [Rendered markdown content] │
│ [repo-a]     │                             │
│ [repo-b] ◄── │ # Project Title             │
│ [repo-c]     │ Description here...         │
│              │                             │
└──────────────┴─────────────────────────────┘
```

- **Left panel**: Searchable list of repositories
- **Right panel**: README content rendered as HTML
- **External link**: Open README on GitHub

### Theme Toggle

Click the sun/moon icon in the header to switch between:
- **Light mode**: White background, dark text
- **Dark mode**: Dark background, light text

The theme persists across sessions.

---

## Architecture & Concepts

### Application Architecture

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

### Data Flow

1. **Authentication Flow**:
   ```
   User → Click Login → GitHub OAuth → Callback → JWT Token → Session
   ```

2. **Repository Fetch Flow**:
   ```
   Dashboard Mount → API Call → Octokit → GitHub API → Response → Zustand Store → UI Update
   ```

3. **Analysis Flow**:
   ```
   Repo Data → Analyze API → Fetch Languages → Fetch Package.json → Calculate Score → Store
   ```

### Key Concepts

#### 1. Server Components vs Client Components

Next.js 14 uses React Server Components by default:

```tsx
// Server Component (default) - runs on server
// src/app/(app)/layout.tsx
export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);
  // ...
}

// Client Component - runs in browser
// src/app/(app)/dashboard/page.tsx
"use client";
export default function DashboardPage() {
  const [data, setData] = useState([]);
  // ...
}
```

#### 2. Route Groups

The `(app)` folder is a route group - it doesn't affect the URL:
```
src/app/
├── (app)/           # Route group - protected routes
│   ├── dashboard/   # → /dashboard
│   ├── canvas/      # → /canvas
│   └── layout.tsx   # Shared layout with auth check
└── page.tsx         # → / (landing page)
```

#### 3. API Routes

Next.js API routes handle backend logic:
```
src/app/api/
├── auth/[...nextauth]/route.ts  # → /api/auth/*
└── github/
    ├── repos/route.ts           # → /api/github/repos
    └── analyze/[repoId]/route.ts # → /api/github/analyze/:id
```

#### 4. State Management with Zustand

Zustand provides simple, scalable state management:

```tsx
// Store definition
const useAppStore = create((set) => ({
  repositories: [],
  setRepositories: (repos) => set({ repositories: repos }),
}));

// Usage in components
function Dashboard() {
  const { repositories, setRepositories } = useAppStore();
  // ...
}
```

#### 5. React Flow Canvas

React Flow renders the interactive node graph:

```tsx
<ReactFlow
  nodes={nodes}           // Array of node objects
  edges={edges}           // Array of edge objects
  onNodesChange={...}     // Handle node updates
  nodeTypes={nodeTypes}   // Custom node components
>
  <Background />
  <Controls />
  <MiniMap />
</ReactFlow>
```

---

## Technology Deep Dive

### Next.js 14 (App Router)

**What it is**: A React framework for production-grade applications.

**Key features used**:
- **App Router**: File-based routing with layouts
- **Server Components**: Reduced client-side JavaScript
- **API Routes**: Backend endpoints in the same project
- **Image Optimization**: Automatic image handling

**Learn more**: https://nextjs.org/docs

### React Flow (@xyflow/react)

**What it is**: A library for building node-based interfaces.

**Key features used**:
- **Nodes**: Draggable elements representing repositories
- **Edges**: Lines connecting related nodes
- **Controls**: Zoom, fit view, interactive controls
- **MiniMap**: Overview navigation

**Learn more**: https://reactflow.dev/docs

### Tailwind CSS

**What it is**: A utility-first CSS framework.

**Key features used**:
- **Utility classes**: `flex`, `p-4`, `text-sm`, etc.
- **Dark mode**: `dark:` prefix for theme support
- **Custom configuration**: Extended colors, fonts
- **Animations**: `tailwindcss-animate` plugin

**Learn more**: https://tailwindcss.com/docs

### Radix UI

**What it is**: Unstyled, accessible UI component primitives.

**Components used**:
- `@radix-ui/react-avatar`: User avatars
- `@radix-ui/react-tabs`: Tab interfaces
- `@radix-ui/react-tooltip`: Hover tooltips
- `@radix-ui/react-scroll-area`: Custom scrollbars

**Learn more**: https://www.radix-ui.com/docs

### shadcn/ui Pattern

**What it is**: A component pattern (not a library) for building UIs.

**How it works**:
1. Components are copied into your project (not installed)
2. Full control over styling and behavior
3. Built on Radix UI + Tailwind CSS

**Our components**: `Button`, `Card`, `Badge`, `Input`, `Tabs`, etc.

### NextAuth.js

**What it is**: Authentication library for Next.js.

**Key features used**:
- **GitHub Provider**: OAuth with GitHub
- **JWT Strategy**: Stateless session tokens
- **Callbacks**: Custom token/session handling

**Configuration** (`src/lib/auth.ts`):
```tsx
export const authOptions: NextAuthOptions = {
  providers: [GitHubProvider({...})],
  callbacks: {
    async jwt({ token, account }) {...},
    async session({ session, token }) {...},
  },
};
```

**Learn more**: https://next-auth.js.org/

### Octokit

**What it is**: Official GitHub SDK for JavaScript.

**Key features used**:
- `repos.listForAuthenticatedUser()`: Fetch user's repos
- `repos.listCommits()`: Fetch commit history
- `repos.getReadme()`: Fetch README content
- `repos.listLanguages()`: Fetch language stats

**Learn more**: https://github.com/octokit/octokit.js

### Zustand

**What it is**: Lightweight state management for React.

**Why we chose it**:
- Simple API (no boilerplate)
- TypeScript support
- Persist middleware for localStorage
- Works with React 18

**Learn more**: https://github.com/pmndrs/zustand

### TypeScript

**What it is**: Typed superset of JavaScript.

**Key features used**:
- **Interfaces**: Type definitions for data structures
- **Generics**: Reusable type patterns
- **Module augmentation**: Extending NextAuth types

---

## Project Structure

```
gitvision/
├── .env.example              # Environment template
├── .env.local                # Your local environment (git-ignored)
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS (for Tailwind)
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
│
└── src/
    ├── app/                  # Next.js App Router
    │   ├── globals.css       # Global styles + CSS variables
    │   ├── layout.tsx        # Root layout (providers)
    │   ├── page.tsx          # Landing page (/)
    │   │
    │   ├── (app)/            # Protected routes group
    │   │   ├── layout.tsx    # Auth check + sidebar
    │   │   ├── dashboard/
    │   │   │   └── page.tsx  # Dashboard view
    │   │   ├── canvas/
    │   │   │   └── page.tsx  # Canvas view
    │   │   ├── commits/
    │   │   │   └── page.tsx  # Commits timeline
    │   │   └── docs/
    │   │       └── page.tsx  # Documentation hub
    │   │
    │   └── api/              # API routes
    │       ├── auth/
    │       │   └── [...nextauth]/
    │       │       └── route.ts  # NextAuth handlers
    │       └── github/
    │           ├── repos/
    │           │   └── route.ts  # GET /api/github/repos
    │           │   └── [owner]/
    │           │       └── [repo]/
    │           │           ├── commits/
    │           │           │   └── route.ts  # GET commits
    │           │           └── readme/
    │           │               └── route.ts  # GET readme
    │           └── analyze/
    │               └── [repoId]/
    │                   └── route.ts  # POST analyze
    │
    ├── components/
    │   ├── canvas/           # React Flow components
    │   │   ├── architecture-canvas.tsx  # Main canvas
    │   │   ├── repository-node.tsx      # Repo node
    │   │   └── group-node.tsx           # Group node
    │   │
    │   ├── dashboard/        # Dashboard components
    │   │   ├── repository-card.tsx   # Repo card
    │   │   ├── stats-overview.tsx    # Stats section
    │   │   ├── commit-timeline.tsx   # Commit list
    │   │   ├── docs-viewer.tsx       # README viewer
    │   │   └── deploy-dialog.tsx     # Deploy modal
    │   │
    │   ├── layout/           # Layout components
    │   │   ├── sidebar.tsx   # Navigation sidebar
    │   │   └── header.tsx    # Page header
    │   │
    │   ├── ui/               # Reusable UI (shadcn pattern)
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── tabs.tsx
    │   │   └── tooltip.tsx
    │   │
    │   └── providers.tsx     # React context providers
    │
    ├── lib/                  # Utility libraries
    │   ├── auth.ts           # NextAuth configuration
    │   ├── github.ts         # GitHub API functions
    │   └── utils.ts          # Helper functions
    │
    ├── store/                # State management
    │   └── index.ts          # Zustand store
    │
    └── types/                # TypeScript definitions
        └── index.ts          # Shared types
```

---

## API Reference

### Authentication

#### NextAuth Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin` | GET | Initiate OAuth flow |
| `/api/auth/callback/github` | GET | OAuth callback handler |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/signout` | POST | Sign out user |

### GitHub API

#### GET /api/github/repos

Fetch all repositories for the authenticated user.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
[
  {
    "id": 123456,
    "name": "my-repo",
    "full_name": "username/my-repo",
    "description": "A cool project",
    "html_url": "https://github.com/username/my-repo",
    "language": "TypeScript",
    "stargazers_count": 42,
    "forks_count": 12,
    "open_issues_count": 3,
    "pushed_at": "2024-11-23T10:00:00Z",
    "topics": ["react", "typescript"],
    "private": false
  }
]
```

#### GET /api/github/repos/:owner/:repo/commits

Fetch commits for a specific repository.

**Response**:
```json
[
  {
    "sha": "abc123def456",
    "message": "Fix authentication bug\n\nDetailed description...",
    "author": {
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2024-11-23T10:00:00Z",
      "avatar_url": "https://avatars.githubusercontent.com/..."
    },
    "url": "https://github.com/username/repo/commit/abc123"
  }
]
```

#### GET /api/github/repos/:owner/:repo/readme

Fetch and render README as HTML.

**Response**:
```json
{
  "content": "<h1>Project Title</h1><p>Description...</p>"
}
```

#### POST /api/github/analyze/:repoId

Analyze a repository's tech stack and health.

**Request Body**:
```json
{
  "repo": { /* repository object */ }
}
```

**Response**:
```json
{
  "id": 123456,
  "name": "my-repo",
  "techStack": ["TypeScript", "JavaScript", "CSS"],
  "framework": "Next.js",
  "architecture": [
    {
      "type": "webapp",
      "confidence": 0.8,
      "indicators": ["Has pages/components structure"]
    }
  ],
  "dependencies": [
    { "name": "react", "version": "^18.2.0", "type": "production" }
  ],
  "hasCI": true,
  "hasDocs": true,
  "hasTests": true,
  "healthScore": 85,
  "lastActivity": "2024-11-23T10:00:00Z"
}
```

---

## Customization Guide

### Adding New Themes

Edit `src/app/globals.css` to modify CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* HSL values */
  --background: 0 0% 100%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

### Customizing Repository Nodes

Edit `src/components/canvas/repository-node.tsx`:

```tsx
// Add new fields to display
{repo.custom_field && (
  <Badge>{repo.custom_field}</Badge>
)}

// Change colors
const healthColor = analysis?.healthScore >= 70
  ? "text-green-500"    // Good
  : analysis?.healthScore >= 40
    ? "text-yellow-500" // Warning
    : "text-red-500";   // Critical
```

### Modifying Health Score

Edit `src/lib/github.ts` - `calculateHealthScore()`:

```tsx
function calculateHealthScore(factors) {
  let score = 0;

  // Adjust weights as needed
  if (factors.hasCI) score += 20;      // CI/CD presence
  if (factors.hasDocs) score += 15;    // Documentation
  if (factors.hasTests) score += 20;   // Test setup
  if (factors.hasDescription) score += 10;
  if (factors.hasTopics) score += 5;
  if (factors.recentActivity) score += 15;

  // Add your own factors
  if (factors.hasLicense) score += 5;
  if (factors.hasContributing) score += 5;

  return Math.min(score, 100);
}
```

### Adding New Deployment Providers

Edit `src/components/dashboard/deploy-dialog.tsx`:

```tsx
const DEPLOY_PROVIDERS = [
  // Existing providers...
  {
    id: "fly",
    name: "Fly.io",
    icon: "🪰",
    color: "bg-purple-500 text-white",
    url: "https://fly.io/launch",
  },
];
```

---

## Troubleshooting

### Common Issues

#### "Failed to fetch repositories"

**Cause**: Invalid or expired access token.

**Solution**:
1. Sign out and sign in again
2. Check GitHub OAuth app is configured correctly
3. Verify `repo` scope is included in authorization

#### "NEXTAUTH_SECRET is not set"

**Cause**: Missing environment variable.

**Solution**:
```bash
# Generate a secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=your-generated-secret
```

#### OAuth callback error

**Cause**: Mismatched callback URL.

**Solution**: Ensure your GitHub OAuth app has exactly:
```
http://localhost:3000/api/auth/callback/github
```

#### Canvas not rendering

**Cause**: React Flow requires specific container dimensions.

**Solution**: Ensure parent container has explicit height:
```tsx
<div className="h-screen">
  <ReactFlow ... />
</div>
```

#### Hydration errors

**Cause**: Server/client markup mismatch.

**Solution**: Add `"use client"` directive to components using:
- `useState`, `useEffect`
- Browser APIs
- Event handlers

---

## Learning Resources

### Official Documentation

| Technology | Documentation |
|------------|---------------|
| Next.js | https://nextjs.org/docs |
| React | https://react.dev |
| TypeScript | https://www.typescriptlang.org/docs |
| Tailwind CSS | https://tailwindcss.com/docs |
| React Flow | https://reactflow.dev/docs |
| Radix UI | https://www.radix-ui.com/docs |
| NextAuth.js | https://next-auth.js.org/getting-started |
| Zustand | https://docs.pmnd.rs/zustand |
| Octokit | https://octokit.github.io/rest.js |

### Tutorials

- **Next.js App Router**: https://nextjs.org/learn
- **React Flow Tutorial**: https://reactflow.dev/learn
- **Tailwind CSS Basics**: https://tailwindcss.com/docs/utility-first
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook

### Videos

- **Next.js 14 Full Course**: Search "Next.js 14 tutorial" on YouTube
- **React Flow Guide**: https://www.youtube.com/watch?v=aUBWE41a900
- **Zustand State Management**: Search "Zustand tutorial"

---

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `typecheck` | `npm run typecheck` | Run TypeScript check |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint && npm run typecheck`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [React Flow](https://reactflow.dev/) - Node-based UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with Next.js, React Flow, and the GitHub API.
