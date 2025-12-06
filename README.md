# 🧠 Brain-Storming: Project Ideas Incubator

A consolidated collection of **37 project ideas** organized by category. Each project is a self-contained idea ready to be spun off into its own repository when you're ready to develop it.

---

## 🚀 Graduated Projects

Ideas that grew up and left the nest! These projects have been developed and moved to their own repositories.

| Project | Description | Repository | Status |
|---------|-------------|------------|--------|
| **ShaderForge** | Interactive 3D graphics learning platform for Three.js and WebGL | [github.com/RafaelMurad/shaderforge](https://github.com/RafaelMurad/shaderforge) | ✅ Live |

*Originally: `apps/webgl-learning` + `apis/threejs-academy`*

---

## Repository Structure

```
brain-storming/
├── apis/              # 14 Backend API services
├── apps/              # 14 Full-stack applications
├── portfolios/
│   ├── web/           # 5 Portfolio websites
│   └── mobile/        # 3 React Native portfolio apps
└── frameworks/        # 1 Reusable framework
```

---

## APIs (14 projects)

Backend services with REST APIs, databases, and authentication.

| Project | Description | Tech Stack |
|---------|-------------|------------|
| [ai-gateway](./apis/ai-gateway/) | AI model proxy with usage tracking | Express, Prisma |
| [analytics-hub](./apis/analytics-hub/) | Event tracking & metrics API | Express, Prisma |
| [celebratekit](./apis/celebratekit/) | Embeddable celebration/confetti API | Express, Prisma |
| [feature-flow](./apis/feature-flow/) | Feature flag management service | Express, Prisma |
| [form-forge](./apis/form-forge/) | Form builder & submission API | Express, Prisma |
| [image-kit](./apis/image-kit/) | Image processing & optimization API | Express, Prisma |
| [link-preview](./apis/link-preview/) | URL metadata extraction API | Express, Prisma |
| [notify-flow](./apis/notify-flow/) | Multi-channel notification service | Express, Prisma |
| [pulsewatch](./apis/pulsewatch/) | Social listening & lead generation | Express, Prisma |
| [realtime-hub](./apis/realtime-hub/) | WebSocket pub/sub service | Express, Prisma |
| [short-link](./apis/short-link/) | URL shortener with analytics | Express, Prisma |
| [snapforge](./apis/snapforge/) | Screenshot & PDF generation API | Express, Prisma |
| [voice-api](./apis/voice-api/) | Speech-to-text transcription API | Express, Prisma |
| [zenteam](./apis/zenteam/) | Team wellness & burnout prevention | Express, Prisma |

---

## Apps (14 projects)

Full-stack applications with UI, some with web + mobile versions.

| Project | Description | Tech Stack |
|---------|-------------|------------|
| [collab-canvas](./apps/collab-canvas/) | Real-time collaborative whiteboard | Next.js, WebSocket |
| [creative-framework-app](./apps/creative-framework-app/) | Creativity methods & AI ideation | Next.js |
| [flow-matic](./apps/flow-matic/) | Visual workflow automation builder | Next.js, React Flow |
| [frontend-forge](./apps/frontend-forge/) | Frontend coding exercise generator | Next.js |
| [frontend-quiz-game](./apps/frontend-quiz-game/) | Gamified frontend dev quiz | Next.js + React Native |
| [gitvision](./apps/gitvision/) | GitHub repo visualization dashboard | Next.js, React Flow |
| [habit-stack](./apps/habit-stack/) | Habit tracking with streaks | Next.js + React Native |
| [invoice-flow](./apps/invoice-flow/) | Invoice & expense management | Next.js + React Native |
| [link-bio](./apps/link-bio/) | Link-in-bio builder for creators | Next.js + React Native |
| [meal-plan-ai](./apps/meal-plan-ai/) | AI-powered meal planning | Next.js + React Native |
| [nexus-ai](./apps/nexus-ai/) | AI chat interface | Next.js |
| [prompt-lab](./apps/prompt-lab/) | Prompt testing & versioning | Next.js |
| [split-pay](./apps/split-pay/) | QR-based restaurant bill splitting | Next.js + React Native |
| [ux-portfolio-platform](./apps/ux-portfolio-platform/) | UX/UI designer portfolio builder | Next.js |

---

## Portfolios (8 projects)

### Web Portfolios (5 projects)

Futuristic portfolio website templates with unique themes.

| Project | Theme | Framework |
|---------|-------|-----------|
| [astral-contact](./portfolios/web/astral-contact/) | Alien/UFO | SolidJS |
| [cosmic-void](./portfolios/web/cosmic-void/) | Deep Space | Astro |
| [galactic-gourmet](./portfolios/web/galactic-gourmet/) | Space + Food | SolidJS |
| [neon-grid](./portfolios/web/neon-grid/) | Cyberpunk | SolidJS |
| [nordic-minimal](./portfolios/web/nordic-minimal/) | Scandinavian | Astro |

### Mobile Portfolios (3 projects)

React Native/Expo versions of the web portfolios.

| Project | Based On |
|---------|----------|
| [cosmic-void-mobile](./portfolios/mobile/cosmic-void-mobile/) | cosmic-void |
| [neon-grid-mobile](./portfolios/mobile/neon-grid-mobile/) | neon-grid |
| [nordic-minimal-mobile](./portfolios/mobile/nordic-minimal-mobile/) | nordic-minimal |

---

## Frameworks (1 project)

| Project | Description |
|---------|-------------|
| [freelance-framework](./frameworks/freelance-framework/) | Framework for bootstrapping new apps with best practices |

---

## How to Use This Repo

### Exploring Ideas
Browse the folders above to see all available project ideas. Each project has its own README with details.

### Starting Development
When ready to develop a project:

```bash
# 1. Copy the project to a new location
cp -r apis/snapforge ~/projects/snapforge

# 2. Initialize a new git repo
cd ~/projects/snapforge
rm -rf .git
git init

# 3. Create a GitHub repo and push
gh repo create snapforge --public --source=. --push

# 4. Start developing!
npm install
npm run dev
```

### AI-Assisted Development
Check out my [dev-playbook](https://github.com/RafaelMurad/dev-playbook) for workflows and guides on AI-assisted development, including collaboration frameworks and prompt templates.

### Tech Stack Overview

**APIs:** Node.js, Express, TypeScript, Prisma (SQLite/PostgreSQL), Zod

**Apps:** Next.js, React, TypeScript, Tailwind CSS, Prisma

**Portfolios Web:** Astro or SolidJS, TypeScript, Tailwind CSS

**Portfolios Mobile:** React Native, Expo, TypeScript

---

## Project Count Summary

| Category | Count |
|----------|-------|
| APIs | 14 |
| Apps | 14 |
| Web Portfolios | 5 |
| Mobile Portfolios | 3 |
| Frameworks | 1 |
| **Total** | **37** |

---

## License

MIT License - All projects are open source.
