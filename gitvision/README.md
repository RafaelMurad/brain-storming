# GitVision

A unified dashboard to visualize, manage, and understand all your GitHub repositories in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-12-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Visual Canvas** - Interactive node-based visualization like Figma
- **Smart Analysis** - Auto-detect tech stacks, frameworks, and health scores
- **Unified Dashboard** - All repositories with stats and quick actions
- **One-Click Deploy** - Deploy to Vercel, Netlify, Railway, Render
- **Commit Timeline** - Aggregated commits across all repos
- **Documentation Hub** - Browse README files in one place

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your GitHub OAuth credentials

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** You need to create a GitHub OAuth App first. See [Setup Guide](docs/SETUP.md).

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org) | React framework |
| [React Flow](https://reactflow.dev) | Canvas visualization |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Radix UI](https://radix-ui.com) | UI components |
| [NextAuth.js](https://next-auth.js.org) | Authentication |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [Octokit](https://github.com/octokit/octokit.js) | GitHub API |

## Documentation

| Document | Description |
|----------|-------------|
| [Setup Guide](docs/SETUP.md) | Installation and configuration |
| [Usage Manual](docs/USAGE.md) | How to use each feature |
| [Architecture](docs/ARCHITECTURE.md) | How the app is built |
| [Technologies](docs/TECHNOLOGIES.md) | Deep dive into each technology |
| [API Reference](docs/API.md) | API endpoints and types |
| [Customization](docs/CUSTOMIZATION.md) | How to customize and extend |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |

## Project Structure

```
gitvision/
├── src/
│   ├── app/           # Next.js pages and API routes
│   ├── components/    # React components
│   ├── lib/           # Utilities and GitHub functions
│   ├── store/         # Zustand state management
│   └── types/         # TypeScript definitions
├── docs/              # Documentation
└── package.json
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript check
```

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test: `npm run lint && npm run typecheck`
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with Next.js, React Flow, and the GitHub API.
