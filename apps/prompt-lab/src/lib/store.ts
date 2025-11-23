import { create } from "zustand";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: string;
  tags: string[];
  model: string;
  rating: number;
  totalRuns: number;
  successRate: number;
  avgLatency: number;
  avgTokens: number;
  isFavorite: boolean;
  isPublic: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptExecution {
  id: string;
  promptId: string;
  input?: Record<string, unknown>;
  output: string;
  model: string;
  latency: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  success: boolean;
  error?: string;
  createdAt: Date;
}

export interface PromptRating {
  id: string;
  promptId: string;
  rating: number;
  feedback?: string;
  criteria: {
    clarity: number;
    effectiveness: number;
    versatility: number;
    efficiency: number;
  };
  createdAt: Date;
}

export interface Analytics {
  totalPrompts: number;
  totalExecutions: number;
  avgRating: number;
  avgSuccessRate: number;
  totalCost: number;
  executionsByDay: { date: string; count: number; cost: number }[];
  topCategories: { category: string; count: number }[];
  modelUsage: { model: string; count: number }[];
}

interface PromptLabState {
  // Data
  prompts: Prompt[];
  executions: PromptExecution[];
  ratings: PromptRating[];
  analytics: Analytics | null;

  // UI state
  selectedPromptId: string | null;
  view: "grid" | "list";
  sortBy: "rating" | "recent" | "runs" | "name";
  filterCategory: string | null;
  searchQuery: string;
  isLoading: boolean;

  // Modal state
  showCreateModal: boolean;
  showRatingModal: boolean;
  showAnalyticsModal: boolean;

  // Actions
  setPrompts: (prompts: Prompt[]) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  setSelectedPrompt: (id: string | null) => void;
  toggleFavorite: (id: string) => void;

  setExecutions: (executions: PromptExecution[]) => void;
  addExecution: (execution: PromptExecution) => void;

  setRatings: (ratings: PromptRating[]) => void;
  addRating: (rating: PromptRating) => void;

  setAnalytics: (analytics: Analytics) => void;

  // UI actions
  setView: (view: "grid" | "list") => void;
  setSortBy: (sortBy: "rating" | "recent" | "runs" | "name") => void;
  setFilterCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;

  setShowCreateModal: (show: boolean) => void;
  setShowRatingModal: (show: boolean) => void;
  setShowAnalyticsModal: (show: boolean) => void;
}

export const usePromptStore = create<PromptLabState>((set) => ({
  // Initial data
  prompts: [],
  executions: [],
  ratings: [],
  analytics: null,

  // Initial UI state
  selectedPromptId: null,
  view: "grid",
  sortBy: "recent",
  filterCategory: null,
  searchQuery: "",
  isLoading: false,

  // Modal state
  showCreateModal: false,
  showRatingModal: false,
  showAnalyticsModal: false,

  // Data actions
  setPrompts: (prompts) => set({ prompts }),

  addPrompt: (prompt) =>
    set((state) => ({ prompts: [prompt, ...state.prompts] })),

  updatePrompt: (id, updates) =>
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),

  deletePrompt: (id) =>
    set((state) => ({
      prompts: state.prompts.filter((p) => p.id !== id),
      selectedPromptId: state.selectedPromptId === id ? null : state.selectedPromptId,
    })),

  setSelectedPrompt: (id) => set({ selectedPromptId: id }),

  toggleFavorite: (id) =>
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    })),

  setExecutions: (executions) => set({ executions }),

  addExecution: (execution) =>
    set((state) => ({ executions: [execution, ...state.executions] })),

  setRatings: (ratings) => set({ ratings }),

  addRating: (rating) =>
    set((state) => ({ ratings: [rating, ...state.ratings] })),

  setAnalytics: (analytics) => set({ analytics }),

  // UI actions
  setView: (view) => set({ view }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),

  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowRatingModal: (show) => set({ showRatingModal: show }),
  setShowAnalyticsModal: (show) => set({ showAnalyticsModal: show }),
}));
