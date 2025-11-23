# Technology Deep Dive

Detailed explanation of each technology used in GitVision.

## Overview

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| Next.js 14 | React framework | [nextjs.org/docs](https://nextjs.org/docs) |
| React 18 | UI library | [react.dev](https://react.dev) |
| TypeScript | Type safety | [typescriptlang.org](https://www.typescriptlang.org/docs) |
| React Flow | Canvas visualization | [reactflow.dev](https://reactflow.dev) |
| Tailwind CSS | Styling | [tailwindcss.com](https://tailwindcss.com/docs) |
| Radix UI | Accessible components | [radix-ui.com](https://www.radix-ui.com) |
| NextAuth.js | Authentication | [next-auth.js.org](https://next-auth.js.org) |
| Zustand | State management | [zustand](https://github.com/pmndrs/zustand) |
| Octokit | GitHub API client | [octokit.github.io](https://octokit.github.io/rest.js) |

---

## Next.js 14

### What It Is
A React framework for building full-stack web applications with server-side rendering, static generation, and API routes.

### Key Features We Use

**App Router**
File-based routing using the `app/` directory:
```
app/
├── page.tsx          → /
├── dashboard/
│   └── page.tsx      → /dashboard
└── api/
    └── route.ts      → /api
```

**Server Components**
Components that render on the server, reducing client JavaScript:
```tsx
// This runs on the server
export default async function Page() {
  const data = await fetchData(); // Direct DB/API access
  return <div>{data}</div>;
}
```

**API Routes**
Backend endpoints in the same project:
```tsx
// app/api/data/route.ts
export async function GET() {
  return Response.json({ message: "Hello" });
}
```

### Why We Chose It
- Excellent developer experience
- Built-in optimizations (images, fonts, scripts)
- Seamless full-stack development
- Great TypeScript support

---

## React Flow (@xyflow/react)

### What It Is
A library for building node-based editors, diagrams, and interactive graphs.

### Key Features We Use

**Nodes and Edges**
```tsx
const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
];
const edges = [
  { id: 'e1-2', source: '1', target: '2' },
];
```

**Custom Nodes**
```tsx
function CustomNode({ data }) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

**Built-in Components**
- `<Background />` - Grid/dots background
- `<Controls />` - Zoom/fit controls
- `<MiniMap />` - Overview navigation

### Why We Chose It
- Production-ready and performant
- Highly customizable nodes
- Built-in interactions (drag, zoom, pan)
- Active community and documentation

---

## Tailwind CSS

### What It Is
A utility-first CSS framework for rapidly building custom designs.

### Key Features We Use

**Utility Classes**
```tsx
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <span className="text-sm font-medium text-gray-900">Title</span>
</div>
```

**Dark Mode**
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

**Custom Configuration**
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
      },
    },
  },
};
```

### Why We Chose It
- Rapid prototyping
- Consistent design system
- Small production bundle (purges unused CSS)
- Excellent IDE support

---

## Radix UI

### What It Is
Unstyled, accessible UI component primitives.

### Components We Use

| Component | Purpose |
|-----------|---------|
| `Avatar` | User profile images |
| `Tabs` | Tab interfaces |
| `Tooltip` | Hover information |
| `ScrollArea` | Custom scrollbars |
| `Dialog` | Modal dialogs |

### Example Usage
```tsx
import * as Tabs from "@radix-ui/react-tabs";

<Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs.Root>
```

### Why We Chose It
- Fully accessible (WAI-ARIA compliant)
- Unstyled = complete design control
- Composable and flexible
- Works great with Tailwind

---

## shadcn/ui Pattern

### What It Is
Not a component library, but a collection of reusable components you copy into your project.

### How It Works
1. Components live in `src/components/ui/`
2. Built on Radix UI + Tailwind CSS
3. Full control over code and styling

### Our Components
```
components/ui/
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── input.tsx
├── scroll-area.tsx
├── tabs.tsx
└── tooltip.tsx
```

### Example
```tsx
// components/ui/button.tsx
const Button = ({ variant = "default", size = "default", ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      {...props}
    />
  );
};
```

---

## NextAuth.js

### What It Is
Authentication library for Next.js with support for OAuth, credentials, and more.

### Configuration
```tsx
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
```

### Usage
```tsx
// Client-side
import { useSession, signIn, signOut } from "next-auth/react";

function Component() {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>;
  }
  return <button onClick={() => signIn("github")}>Sign in</button>;
}

// Server-side
import { getServerSession } from "next-auth";

async function ServerComponent() {
  const session = await getServerSession(authOptions);
  // ...
}
```

---

## Zustand

### What It Is
A small, fast state management library for React.

### Store Definition
```tsx
// src/store/index.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      repositories: [],
      setRepositories: (repos) => set({ repositories: repos }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "gitvision-storage" }
  )
);
```

### Usage in Components
```tsx
function Component() {
  const { repositories, isLoading, setRepositories } = useAppStore();

  useEffect(() => {
    setIsLoading(true);
    fetchRepos().then(setRepositories).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner />;
  return <RepoList repos={repositories} />;
}
```

### Why We Chose It
- Minimal boilerplate
- No providers needed
- Built-in persist middleware
- TypeScript support
- React 18 compatible

---

## Octokit

### What It Is
The official GitHub SDK for JavaScript/TypeScript.

### Initialization
```tsx
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: accessToken });
```

### Methods We Use

```tsx
// Fetch user's repositories
const repos = await octokit.repos.listForAuthenticatedUser({
  per_page: 100,
  sort: "updated",
});

// Fetch commits
const commits = await octokit.repos.listCommits({
  owner: "username",
  repo: "repo-name",
  per_page: 30,
});

// Fetch README
const readme = await octokit.repos.getReadme({
  owner: "username",
  repo: "repo-name",
  mediaType: { format: "html" },
});

// Fetch languages
const languages = await octokit.repos.listLanguages({
  owner: "username",
  repo: "repo-name",
});
```

---

## TypeScript

### What It Is
A typed superset of JavaScript that compiles to plain JavaScript.

### Key Features We Use

**Interfaces**
```tsx
interface Repository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}
```

**Type Inference**
```tsx
const [repos, setRepos] = useState<Repository[]>([]);
// TypeScript infers types from usage
```

**Module Augmentation**
```tsx
// Extending NextAuth types
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
```

### Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Learning Resources

### Official Documentation
- [Next.js Learn](https://nextjs.org/learn)
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)
- [React Flow Guide](https://reactflow.dev/learn)

### Video Tutorials
- Search "Next.js 14 App Router tutorial" on YouTube
- Search "React Flow tutorial" on YouTube
- Search "Zustand React state management" on YouTube

### Practice Projects
After understanding GitVision, try building:
1. A Kanban board with React Flow
2. A dashboard with NextAuth
3. A form with Radix UI components
