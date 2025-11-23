import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  // State
  user: User | null;
  theme: 'light' | 'dark';
  onboarded: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setOnboarded: (onboarded: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  theme: 'dark' as const,
  onboarded: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setOnboarded: (onboarded) => set({ onboarded }),
      reset: () => set(initialState),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        onboarded: state.onboarded,
      }),
    }
  )
);
