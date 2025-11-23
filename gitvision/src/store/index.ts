import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Repository, RepositoryAnalysis, CanvasNode, CanvasEdge } from "@/types";

interface AppState {
  // Repositories
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;

  // Analysis
  analyses: Record<number, RepositoryAnalysis>;
  setAnalysis: (repoId: number, analysis: RepositoryAnalysis) => void;

  // Canvas
  canvasNodes: CanvasNode[];
  canvasEdges: CanvasEdge[];
  setCanvasNodes: (nodes: CanvasNode[]) => void;
  setCanvasEdges: (edges: CanvasEdge[]) => void;
  addCanvasNode: (node: CanvasNode) => void;
  updateCanvasNode: (id: string, data: Partial<CanvasNode>) => void;
  removeCanvasNode: (id: string) => void;

  // Selection
  selectedRepoId: number | null;
  setSelectedRepoId: (id: number | null) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: "canvas" | "dashboard" | "commits" | "docs";
  setActiveView: (view: "canvas" | "dashboard" | "commits" | "docs") => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLanguage: string | null;
  setFilterLanguage: (lang: string | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Repositories
      repositories: [],
      setRepositories: (repos) => set({ repositories: repos }),

      // Analysis
      analyses: {},
      setAnalysis: (repoId, analysis) =>
        set((state) => ({
          analyses: { ...state.analyses, [repoId]: analysis },
        })),

      // Canvas
      canvasNodes: [],
      canvasEdges: [],
      setCanvasNodes: (nodes) => set({ canvasNodes: nodes }),
      setCanvasEdges: (edges) => set({ canvasEdges: edges }),
      addCanvasNode: (node) =>
        set((state) => ({ canvasNodes: [...state.canvasNodes, node] })),
      updateCanvasNode: (id, data) =>
        set((state) => ({
          canvasNodes: state.canvasNodes.map((node) =>
            node.id === id ? { ...node, ...data } : node
          ),
        })),
      removeCanvasNode: (id) =>
        set((state) => ({
          canvasNodes: state.canvasNodes.filter((node) => node.id !== id),
          canvasEdges: state.canvasEdges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        })),

      // Selection
      selectedRepoId: null,
      setSelectedRepoId: (id) => set({ selectedRepoId: id }),

      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      activeView: "dashboard",
      setActiveView: (view) => set({ activeView: view }),

      // Search & Filter
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterLanguage: null,
      setFilterLanguage: (lang) => set({ filterLanguage: lang }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      isAnalyzing: false,
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
    }),
    {
      name: "gitvision-storage",
      partialize: (state) => ({
        canvasNodes: state.canvasNodes,
        canvasEdges: state.canvasEdges,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
