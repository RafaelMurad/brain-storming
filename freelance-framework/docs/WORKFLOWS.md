# Development Workflows

This document describes the workflows and processes for efficient development.

## Table of Contents
- [Project Setup](#project-setup)
- [Daily Development](#daily-development)
- [Git Workflow](#git-workflow)
- [Code Review](#code-review)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Client Communication](#client-communication)

---

## Project Setup

### New Project Checklist

```markdown
## Project Kickoff

### 1. Initial Setup
- [ ] Clone framework template
- [ ] Update package.json (name, description, version)
- [ ] Configure environment variables
- [ ] Set up Git repository
- [ ] Create initial README

### 2. Infrastructure
- [ ] Set up hosting (Vercel/Railway)
- [ ] Configure domain (if applicable)
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (if needed)

### 3. Development Environment
- [ ] Install dependencies
- [ ] Verify build works
- [ ] Set up VS Code workspace
- [ ] Configure debugging

### 4. Documentation
- [ ] Document project structure
- [ ] Set up contribution guidelines
- [ ] Create deployment documentation
```

### Environment Variables

Template for `.env`:

```bash
# .env.example
NODE_ENV=development

# API
API_PORT=3001
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://localhost:5432/myapp

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# External Services
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
FEATURE_NEW_DASHBOARD=true
```

---

## Daily Development

### Morning Routine

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Check for dependency updates**
   ```bash
   npm outdated
   ```

3. **Review open tasks/issues**

4. **Start development servers**
   ```bash
   # Terminal 1: API
   cd api && npm run dev

   # Terminal 2: Web
   cd web && npm run dev

   # Terminal 3: Mobile (if applicable)
   cd mobile && npx expo start
   ```

### Development Commands

```bash
# Run all checks before committing
npm run lint && npm run test && npm run build

# Quick format
npm run format

# Run specific test file
npm run test src/components/Button.test.tsx

# Watch mode for tests
npm run test -- --watch
```

### Hot Reloading Setup

All templates are configured for hot reloading:
- **Vite**: Built-in HMR
- **Next.js**: Fast Refresh
- **Express**: nodemon
- **Expo**: Metro bundler with Fast Refresh

---

## Git Workflow

### Branch Strategy

```
main (production)
├── develop (staging)
│   ├── feature/user-auth
│   ├── feature/dashboard
│   └── bugfix/login-issue
└── hotfix/critical-fix
```

### Feature Development Flow

```bash
# 1. Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Make changes with atomic commits
git add .
git commit -m "feat(auth): add login form validation"

# 3. Keep updated with develop
git fetch origin develop
git rebase origin/develop

# 4. Push and create PR
git push -u origin feature/my-feature
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**

```bash
feat(api): add user registration endpoint

- Implement POST /api/users endpoint
- Add email validation with Zod
- Include password hashing with bcrypt

Closes #123
```

```bash
fix(ui): resolve button hover state on mobile

The :hover pseudo-class was triggering on touch,
causing sticky hover states. Switched to @media (hover: hover)
to only apply hover styles on devices that support it.
```

### Pre-commit Hooks

Using `husky` and `lint-staged`:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.css": ["prettier --write"]
  }
}
```

---

## Code Review

### PR Checklist

```markdown
## Pull Request

### Description
[Describe what this PR does]

### Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Other

### Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed the code
- [ ] Added/updated tests
- [ ] Updated documentation (if needed)
- [ ] No console.logs or debug code
- [ ] Tested on mobile (if UI changes)

### Screenshots (if UI changes)
[Add before/after screenshots]

### Testing Instructions
1. [Step 1]
2. [Step 2]
```

### Review Guidelines

**What to look for:**
1. **Correctness** - Does it work as intended?
2. **Readability** - Is it easy to understand?
3. **Performance** - Any obvious bottlenecks?
4. **Security** - Any vulnerabilities?
5. **Tests** - Adequate coverage?

**Review comments should be:**
- Constructive and specific
- Focus on code, not person
- Suggest solutions, not just problems
- Differentiate nitpicks from blockers

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \        E2E Tests (few)
      /----\       - Critical user flows
     /      \      - Happy path scenarios
    /--------\
   /          \    Integration Tests (some)
  /------------\   - API endpoints
 /              \  - Component interactions
/----------------\
                   Unit Tests (many)
                   - Pure functions
                   - Business logic
                   - Utilities
```

### Unit Tests

```typescript
// utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './formatters';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
});
```

### Component Tests

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### API Tests

```typescript
// routes/users.test.ts
import request from 'supertest';
import { app } from '../app';

describe('POST /api/users', () => {
  it('creates a user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('test@example.com');
  });

  it('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'invalid-email',
        name: 'Test',
        password: 'Password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

---

## Deployment

### Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Feature flags set correctly

## Deployment
- [ ] Create release tag
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor error rates

## Post-Deployment
- [ ] Verify key flows work
- [ ] Check performance metrics
- [ ] Update documentation
- [ ] Notify stakeholders
```

### Staging Environment

Always deploy to staging first:

```bash
# Deploy to staging
git push origin develop

# Verify on staging
# https://staging.myapp.com

# Promote to production
git checkout main
git merge develop
git push origin main
```

### Rollback Plan

```bash
# If issues in production, rollback immediately
git revert HEAD
git push origin main

# Or deploy previous release
git checkout v1.2.3
git push origin main --force
```

---

## Client Communication

### Project Updates

**Weekly Status Email Template:**

```markdown
Subject: [Project Name] Weekly Update - Week of [Date]

Hi [Client],

Here's the weekly update for [Project Name]:

## Completed This Week
- ✅ Implemented user authentication
- ✅ Added dashboard layout
- ✅ Fixed mobile responsive issues

## In Progress
- 🔄 Payment integration (70%)
- 🔄 User settings page (50%)

## Planned for Next Week
- Payment integration completion
- User settings page
- Email notifications

## Blockers/Questions
- Need API credentials for payment provider
- Clarification on notification preferences

## Demo
[Link to staging environment]

Let me know if you have any questions!

Best,
[Your Name]
```

### Issue Reporting Template

```markdown
## Bug Report

**Environment:** Production / Staging
**Browser/Device:** Chrome 120 / iPhone 15

**Steps to Reproduce:**
1. Go to /dashboard
2. Click "New Project"
3. Fill in form
4. Click Submit

**Expected:** Project is created
**Actual:** Error message appears

**Screenshot/Video:** [attachment]

**Priority:** High / Medium / Low
```

### Feature Request Template

```markdown
## Feature Request

**Title:** Add dark mode toggle

**User Story:**
As a user, I want to switch between light and dark mode
so that I can use the app comfortably in different lighting.

**Acceptance Criteria:**
- [ ] Toggle in settings
- [ ] Persists across sessions
- [ ] Applies to all pages
- [ ] Respects system preference by default

**Priority:** Medium
**Estimated Effort:** 4-8 hours
```

---

## Useful Scripts

### `scripts/setup.sh`

```bash
#!/bin/bash

# Setup new project
echo "Setting up project..."

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate keys
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

echo "Setup complete! Run 'npm run dev' to start."
```

### `scripts/deploy.sh`

```bash
#!/bin/bash

# Pre-deployment checks
echo "Running checks..."
npm run lint
npm run test
npm run build

if [ $? -eq 0 ]; then
  echo "All checks passed. Deploying..."
  git push origin main
else
  echo "Checks failed. Fix issues before deploying."
  exit 1
fi
```
