# Design Patterns

This document describes the design patterns we use across projects.

## Table of Contents
- [Component Patterns](#component-patterns)
- [State Patterns](#state-patterns)
- [Data Fetching Patterns](#data-fetching-patterns)
- [Animation Patterns](#animation-patterns)
- [Validation Patterns](#validation-patterns)
- [Error Handling Patterns](#error-handling-patterns)

---

## Component Patterns

### Compound Components

Use compound components for complex, related UI elements:

```typescript
// components/ui/Tabs.tsx
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;

  return (
    <button
      className={cn('tab', activeTab === value && 'active')}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext)!;

  if (activeTab !== value) return null;
  return <div className="tab-panel">{children}</div>;
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile">Profile content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Render Props

For components that need to share logic with custom rendering:

```typescript
// components/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string;
  children: (props: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// Usage
<DataFetcher<User[]> url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={data!} />;
  }}
</DataFetcher>
```

### Higher-Order Components (HOC)

For cross-cutting concerns like authentication:

```typescript
// hoc/withAuth.tsx
function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) return <Spinner />;
    if (!user) return null;

    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

---

## State Patterns

### Zustand Store with Slices

For larger applications, split the store into slices:

```typescript
// store/slices/userSlice.ts
export interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
});

// store/slices/uiSlice.ts
export interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  theme: 'dark',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});

// store/index.ts
type AppState = UserSlice & UISlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createUISlice(...a),
    }),
    { name: 'app-store' }
  )
);
```

### Optimistic Updates

Update UI immediately, rollback on error:

```typescript
function useOptimisticUpdate<T>(
  mutationFn: (data: T) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error, rollbackData: T) => void;
  }
) {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (newData: T, currentData: T) => {
    setIsPending(true);

    try {
      const result = await mutationFn(newData);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      options.onError?.(error as Error, currentData);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

// Usage
const { mutate, isPending } = useOptimisticUpdate(updateUser, {
  onError: (error, rollbackData) => {
    setUser(rollbackData); // Rollback to previous state
    toast.error('Failed to update');
  },
});

// Optimistic update
const previousUser = user;
setUser(newUserData); // Update immediately
mutate(newUserData, previousUser);
```

---

## Data Fetching Patterns

### API Client with Type Safety

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await response.json();

    if (!response.ok || !json.success) {
      throw new ApiError(
        json.error?.message || 'Request failed',
        response.status,
        json.error?.code
      );
    }

    return json.data;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE);
```

### Custom Hooks for Data Fetching

```typescript
// hooks/useUsers.ts
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    api.get<User[]>('/users')
      .then((data) => {
        if (mounted) setUsers(data);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return api.get<User[]>('/users').then(setUsers);
  }, []);

  return { users, loading, error, refetch };
}
```

---

## Animation Patterns

### Scroll-Triggered Animations

```typescript
// hooks/useScrollAnimation.ts
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Usage with Framer Motion
function AnimatedSection({ children }: { children: ReactNode }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### Staggered Children Animation

```typescript
// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Usage
<motion.ul
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### React Native Animations

```typescript
// Using Reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

function AnimatedCard() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Content */}
      </Animated.View>
    </Pressable>
  );
}
```

---

## Validation Patterns

### Zod Schemas with Refinements

```typescript
// schemas/user.ts
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number');

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Form validation hook
function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is T => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  return { errors, validate, clearErrors: () => setErrors({}) };
}
```

---

## Error Handling Patterns

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Default fallback
function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>{error?.message}</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  );
}
```

### Result Type Pattern

```typescript
// types/result.ts
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: new Error(response.statusText) };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Consuming
const result = await safeFetch<User>('/api/user');

if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.message);
}
```
