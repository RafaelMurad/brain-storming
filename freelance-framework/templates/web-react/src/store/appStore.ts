import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  // State
  user: User | null;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  theme: 'system' as const,
  sidebarOpen: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setTheme: (theme) => {
        // Update document class for Tailwind dark mode
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }

        set({ theme });
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      reset: () => set(initialState),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
      }),
    }
  )
);
