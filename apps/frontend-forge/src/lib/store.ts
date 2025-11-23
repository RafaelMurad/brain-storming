import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  githubId: string | null;
  level: number;
  xp: number;
  streak: number;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  difficulty: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  instructions: string;
  starterCode: Record<string, string> | null;
  solution: Record<string, string> | null;
  hints: string[];
  difficulty: number;
  estimatedTime: number;
  xpReward: number;
  tags: string[];
  technology: Technology;
  status?: "not_started" | "in_progress" | "completed";
  repoUrl?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedHours: number;
  difficulty: number;
  technology: Technology;
  steps: {
    order: number;
    title: string;
    description: string;
    exercise: Exercise;
  }[];
  progress?: number;
  currentStep?: number;
}

interface ForgeState {
  // User
  user: User | null;
  isAuthenticated: boolean;

  // Data
  technologies: Technology[];
  exercises: Exercise[];
  learningPaths: LearningPath[];
  selectedTechnology: Technology | null;
  selectedExercise: Exercise | null;

  // UI
  view: "home" | "explore" | "paths" | "exercise" | "generate";
  isGenerating: boolean;
  generatedExercise: Exercise | null;

  // Actions
  setUser: (user: User | null) => void;
  setTechnologies: (technologies: Technology[]) => void;
  setExercises: (exercises: Exercise[]) => void;
  setLearningPaths: (paths: LearningPath[]) => void;
  selectTechnology: (tech: Technology | null) => void;
  selectExercise: (exercise: Exercise | null) => void;
  setView: (view: ForgeState["view"]) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedExercise: (exercise: Exercise | null) => void;
  addXP: (amount: number) => void;
  updateExerciseStatus: (exerciseId: string, status: Exercise["status"], repoUrl?: string) => void;
}

export const useForgeStore = create<ForgeState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  technologies: [],
  exercises: [],
  learningPaths: [],
  selectedTechnology: null,
  selectedExercise: null,
  view: "home",
  isGenerating: false,
  generatedExercise: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTechnologies: (technologies) => set({ technologies }),

  setExercises: (exercises) => set({ exercises }),

  setLearningPaths: (learningPaths) => set({ learningPaths }),

  selectTechnology: (tech) => set({ selectedTechnology: tech }),

  selectExercise: (exercise) => set({ selectedExercise: exercise, view: exercise ? "exercise" : "home" }),

  setView: (view) => set({ view }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGeneratedExercise: (exercise) => set({ generatedExercise: exercise }),

  addXP: (amount) =>
    set((state) => ({
      user: state.user ? { ...state.user, xp: state.user.xp + amount } : null,
    })),

  updateExerciseStatus: (exerciseId, status, repoUrl) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === exerciseId ? { ...e, status, repoUrl } : e
      ),
    })),
}));
