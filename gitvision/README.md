# GitVision - GitHub Repository Intelligence Dashboard

A unified dashboard to visualize, manage, and understand all your GitHub projects. Features an interactive canvas, smart analysis, one-click deployments, and a documentation hub.

## Features

### Visual Architecture Canvas
- Interactive node-based visualization of repositories
- Drag, connect, and organize projects like Figma
- Auto-grouping by framework/technology
- Smart edge connections based on shared dependencies
- Mini-map and zoom controls

### Smart Repository Analysis
- Auto-detect tech stacks and frameworks
- Identify architecture patterns (monolith, monorepo, API, webapp, etc.)
- Health scoring based on CI/CD, tests, and documentation
- Dependency analysis

### Unified Dashboard
- All repositories in one place
- Grid and list view options
- Filter by language, search by name
- Quick actions for each repository

### One-Click Deployments
- Deploy to Vercel, Netlify, Railway, or Render
- Single-click deployment triggers
- Deployment status tracking

### Commit Timeline
- Unified commit history across all repos
- Search and filter commits
- Visual timeline grouped by date
- Direct links to GitHub

### Documentation Hub
- Browse README files from all repositories
- Side-by-side documentation viewer
- Search across all projects

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Canvas**: React Flow (xyflow)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **GitHub API**: Octokit

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub OAuth App (for authentication)

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: GitVision
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Note your Client ID and Client Secret

### 2. Configure Environment Variables

```bash
cd gitvision
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key  # Generate with: openssl rand -base64 32
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gitvision/
├── src/
│   ├── app/
│   │   ├── (app)/           # Protected app routes
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── canvas/      # Visual canvas
│   │   │   ├── commits/     # Commits timeline
│   │   │   └── docs/        # Documentation hub
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth routes
│   │   │   └── github/      # GitHub API routes
│   │   ├── layout.tsx
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── canvas/          # React Flow components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── github.ts        # GitHub API functions
│   │   └── utils.ts         # Utility functions
│   ├── store/               # Zustand store
│   └── types/               # TypeScript types
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Usage

### Dashboard View

The dashboard shows all your GitHub repositories with:
- Health scores and analysis
- Quick stats (stars, forks, issues)
- Filter by language
- Search functionality
- Quick actions (view commits, docs, deploy)

### Canvas View

The visual canvas allows you to:
- See all repos organized by framework
- Drag nodes to reposition
- Add custom groups
- Auto-layout functionality
- Create connections between repos

### Commits View

Browse all commits across repositories:
- Unified timeline
- Filter by repository
- Search commit messages
- Quick links to GitHub

### Docs View

Browse documentation from all repositories:
- Select any repo to view README
- Search across all projects
- Direct links to GitHub

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js handlers |
| `/api/github/repos` | GET | Fetch user's repositories |
| `/api/github/repos/[owner]/[repo]/commits` | GET | Fetch repository commits |
| `/api/github/repos/[owner]/[repo]/readme` | GET | Fetch repository README |
| `/api/github/analyze/[repoId]` | POST | Analyze repository |

## Customization

### Theme

The app supports light and dark themes via `next-themes`. Toggle using the sun/moon icon in the header.

### Canvas Nodes

Customize repository node appearance in:
- `src/components/canvas/repository-node.tsx`

### Health Score Calculation

Modify health score factors in:
- `src/lib/github.ts` - `calculateHealthScore()` function

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

---

Built with Next.js, React Flow, and the GitHub API.
