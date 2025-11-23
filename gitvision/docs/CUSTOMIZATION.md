# Customization Guide

How to customize and extend GitVision.

## Theme Customization

### CSS Variables

Edit `src/app/globals.css` to modify the color scheme:

```css
:root {
  /* Primary brand color */
  --primary: 221.2 83.2% 53.3%;        /* HSL values */
  --primary-foreground: 210 40% 98%;

  /* Background colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Card colors */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Muted colors */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Border and input */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* Border radius */
  --radius: 0.5rem;
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  /* ... other dark mode values */
}
```

### Color Examples

**Blue theme (default):**
```css
--primary: 221.2 83.2% 53.3%;  /* Blue */
```

**Green theme:**
```css
--primary: 142.1 76.2% 36.3%;  /* Green */
```

**Purple theme:**
```css
--primary: 262.1 83.3% 57.8%;  /* Purple */
```

**Orange theme:**
```css
--primary: 24.6 95% 53.1%;     /* Orange */
```

---

## Canvas Customization

### Repository Node Appearance

Edit `src/components/canvas/repository-node.tsx`:

#### Change Card Size
```tsx
<Card className={cn(
  "w-72",  // Change width (w-64, w-80, w-96)
  // ...
)}>
```

#### Add New Data Fields
```tsx
{/* Add after existing badges */}
{repo.license && (
  <Badge variant="outline" className="text-xs">
    {repo.license.name}
  </Badge>
)}

{/* Show fork indicator */}
{repo.fork && (
  <Badge variant="secondary" className="text-xs">
    Fork
  </Badge>
)}
```

#### Change Health Score Colors
```tsx
const healthColor =
  analysis?.healthScore >= 80
    ? "text-green-500"    // Excellent
    : analysis?.healthScore >= 60
      ? "text-blue-500"   // Good
      : analysis?.healthScore >= 40
        ? "text-yellow-500" // Warning
        : "text-red-500";   // Critical
```

### Group Node Appearance

Edit `src/components/canvas/group-node.tsx`:

```tsx
// Change default color
const { label, color = "#10b981" } = nodeData;  // Green instead of indigo

// Change border style
<div className={cn(
  "h-full w-full rounded-xl border-4 border-solid p-6",  // Thicker, solid border
  // ...
)}>
```

### Canvas Background

Edit `src/components/canvas/architecture-canvas.tsx`:

```tsx
<Background
  variant={BackgroundVariant.Lines}  // Lines instead of dots
  gap={30}                            // Larger gap
  size={2}                            // Thicker lines
  color="#e2e8f0"                     // Custom color
/>
```

---

## Health Score Customization

### Modify Scoring Factors

Edit `src/lib/github.ts` - `calculateHealthScore()`:

```tsx
function calculateHealthScore(factors: {
  hasCI: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  hasDescription: boolean;
  hasTopics: boolean;
  recentActivity: boolean;
  starCount: number;
  issueCount: number;
  // Add new factors
  hasLicense: boolean;
  hasContributing: boolean;
  hasCOC: boolean;
}): number {
  let score = 0;

  // Core factors (60 points max)
  if (factors.hasCI) score += 15;
  if (factors.hasTests) score += 15;
  if (factors.hasDocs) score += 15;
  if (factors.recentActivity) score += 15;

  // Metadata factors (25 points max)
  if (factors.hasDescription) score += 10;
  if (factors.hasTopics) score += 5;
  if (factors.hasLicense) score += 5;
  if (factors.hasContributing) score += 3;
  if (factors.hasCOC) score += 2;

  // Engagement factors (15 points max)
  score += Math.min(factors.starCount, 10);
  if (factors.issueCount < 10) score += 5;

  return Math.min(score, 100);
}
```

### Add New Detection Logic

```tsx
// In analyzeRepository function
const hasLicense = rootFiles.some(f =>
  f.toLowerCase().includes('license')
);

const hasContributing = rootFiles.some(f =>
  f.toLowerCase().includes('contributing')
);

const hasCOC = rootFiles.some(f =>
  f.toLowerCase().includes('code_of_conduct')
);
```

---

## Deployment Providers

### Add New Provider

Edit `src/components/dashboard/deploy-dialog.tsx`:

```tsx
const DEPLOY_PROVIDERS = [
  // Existing providers...

  // Add Fly.io
  {
    id: "fly",
    name: "Fly.io",
    icon: "🪰",
    color: "bg-purple-600 text-white",
    url: "https://fly.io/launch",
  },

  // Add Heroku
  {
    id: "heroku",
    name: "Heroku",
    icon: "🟣",
    color: "bg-violet-600 text-white",
    url: "https://dashboard.heroku.com/new",
  },

  // Add AWS Amplify
  {
    id: "amplify",
    name: "AWS Amplify",
    icon: "📦",
    color: "bg-orange-500 text-white",
    url: "https://console.aws.amazon.com/amplify/home#/deploy",
  },
];
```

---

## Dashboard Customization

### Add New Stats Card

Edit `src/components/dashboard/stats-overview.tsx`:

```tsx
const stats = [
  // Existing stats...

  // Add archived repos count
  {
    title: "Archived Repos",
    value: repositories.filter(r => r.archived).length,
    icon: Archive,
    description: "No longer active",
    color: "text-gray-500",
  },

  // Add private repos percentage
  {
    title: "Private Repos",
    value: `${Math.round((privateRepos / repositories.length) * 100)}%`,
    icon: Lock,
    description: `${privateRepos} of ${repositories.length}`,
    color: "text-amber-500",
  },
];
```

### Add Repository Card Actions

Edit `src/components/dashboard/repository-card.tsx`:

```tsx
{/* Add new quick action */}
<Button
  variant="ghost"
  size="sm"
  className="flex-1"
  onClick={(e) => {
    e.stopPropagation();
    window.open(`${repo.html_url}/issues/new`, "_blank");
  }}
>
  <Plus className="h-4 w-4 mr-1" />
  Issue
</Button>
```

---

## Adding New Pages

### Create a New Route

1. Create the page file:
```tsx
// src/app/(app)/settings/page.tsx
"use client";

import { Header } from "@/components/layout/header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Settings" />
      <div className="flex-1 p-6">
        {/* Your content */}
      </div>
    </div>
  );
}
```

2. Add to sidebar navigation in `src/components/layout/sidebar.tsx`:
```tsx
const navigation = [
  // Existing items...
  { name: "Settings", href: "/settings", icon: Settings },
];
```

---

## Adding New API Routes

### Create a New Endpoint

```tsx
// src/app/api/github/starred/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOctokit } from "@/lib/github";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const octokit = createOctokit(token);
    const { data } = await octokit.activity.listReposStarredByAuthenticatedUser({
      per_page: 100,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch starred repos" },
      { status: 500 }
    );
  }
}
```

---

## State Management Extensions

### Add New Store Slices

Edit `src/store/index.ts`:

```tsx
interface AppState {
  // Existing state...

  // Add new state
  favorites: number[];
  addFavorite: (repoId: number) => void;
  removeFavorite: (repoId: number) => void;

  // Add settings
  settings: {
    gridView: boolean;
    showArchived: boolean;
    sortBy: "updated" | "stars" | "name";
  };
  updateSettings: (settings: Partial<AppState["settings"]>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Existing...

      favorites: [],
      addFavorite: (repoId) =>
        set((state) => ({
          favorites: [...state.favorites, repoId],
        })),
      removeFavorite: (repoId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== repoId),
        })),

      settings: {
        gridView: true,
        showArchived: false,
        sortBy: "updated",
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "gitvision-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        settings: state.settings,
        // ... other persisted state
      }),
    }
  )
);
```

---

## Framework Detection Extensions

### Add New Framework Detection

Edit `src/lib/github.ts` - `detectFramework()`:

```tsx
function detectFramework(
  packageJson: Record<string, unknown> | null,
  files: string[]
): string | null {
  if (!packageJson) {
    // Check non-JS frameworks
    if (files.includes("Cargo.toml")) return "Rust";
    if (files.includes("go.mod")) return "Go";
    if (files.includes("pubspec.yaml")) return "Flutter";  // Add Flutter
    if (files.includes("Package.swift")) return "Swift";   // Add Swift
    return null;
  }

  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  // Existing checks...

  // Add new frameworks
  if (deps["@remix-run/node"]) return "Remix";
  if (deps["gatsby"]) return "Gatsby";
  if (deps["@tanstack/react-query"]) return "TanStack";
  if (deps["trpc"]) return "tRPC";

  return null;
}
```
