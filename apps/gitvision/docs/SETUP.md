# Setup Guide

Complete instructions for setting up GitVision locally.

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | 2.x | Version control |
| GitHub Account | - | OAuth authentication |

## Step 1: Create a GitHub OAuth Application

GitHub OAuth is required for users to authenticate and access their repositories.

### 1.1 Navigate to GitHub Developer Settings
- Go to: https://github.com/settings/developers
- Or: GitHub → Settings → Developer settings → OAuth Apps

### 1.2 Click "New OAuth App"

### 1.3 Fill in the application details

| Field | Value | Description |
|-------|-------|-------------|
| Application name | `GitVision` | Display name shown to users |
| Homepage URL | `http://localhost:3000` | Your app's homepage |
| Application description | `GitHub Repository Intelligence Dashboard` | Optional description |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` | **Critical!** Must be exact |

### 1.4 Click "Register application"

### 1.5 Copy your credentials
- **Client ID**: Displayed on the app page (e.g., `Iv1.a1b2c3d4e5f6g7h8`)
- **Client Secret**: Click "Generate a new client secret" and copy immediately

> **Important**: The client secret is only shown once! Save it securely.

## Step 2: Configure Environment Variables

### 2.1 Copy the example environment file
```bash
cp .env.example .env.local
```

### 2.2 Edit `.env.local` with your values
```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2.3 Generate NEXTAUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14 and React 18
- React Flow for canvas visualization
- Radix UI components
- Tailwind CSS for styling
- NextAuth.js for authentication
- Octokit for GitHub API
- Zustand for state management

## Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## Step 5: First Login

1. Open http://localhost:3000
2. Click "Connect with GitHub"
3. Authorize the application on GitHub
4. You'll be redirected to the dashboard with your repositories

## Production Deployment

### Environment Variables for Production

When deploying, update these values:

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-new-secret>
GITHUB_CLIENT_ID=<your-production-client-id>
GITHUB_CLIENT_SECRET=<your-production-client-secret>
```

### Update GitHub OAuth App

Update your GitHub OAuth app callback URL to:
```
https://your-domain.com/api/auth/callback/github
```

### Build for Production

```bash
npm run build
npm run start
```

## Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `typecheck` | `npm run typecheck` | Run TypeScript check |
