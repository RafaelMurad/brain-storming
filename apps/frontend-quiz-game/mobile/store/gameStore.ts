import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, GameSession, GameResult, Category, Difficulty, AnswerResult } from '../types';
import * as api from '../services/api';

interface GameState {
  user: User | null;
  isAuthenticated: boolean;
  session: GameSession | null;
  currentQuestion: number;
  answers: AnswerResult[];
  timeRemaining: number;
  isAnswering: boolean;
  lastAnswer: AnswerResult | null;
  gameResult: GameResult | null;
  isLoading: boolean;
  error: string | null;

  login: (username: string, email: string) => Promise<boolean>;
  logout: () => void;
  startGame: (category: Category | 'mixed', difficulty: Difficulty, questionCount?: number) => Promise<void>;
  submitAnswer: (selectedAnswer: number, timeSpent: number) => Promise<void>;
  nextQuestion: () => void;
  completeGame: () => Promise<void>;
  resetGame: () => void;
  setTimeRemaining: (time: number) => void;
  clearError: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      session: null,
      currentQuestion: 0,
      answers: [],
      timeRemaining: 0,
      isAnswering: false,
      lastAnswer: null,
      gameResult: null,
      isLoading: false,
      error: null,

      login: async (username, email) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await api.login(username, email);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          session: null,
          gameResult: null,
          answers: [],
        });
      },

      startGame: async (category, difficulty, questionCount = 10) => {
        const { user } = get();
        if (!user) {
          set({ error: 'Please log in first' });
          return;
        }

        set({ isLoading: true, error: null, gameResult: null, answers: [] });
        try {
          const session = await api.startGame(user.id, category, difficulty, questionCount);
          set({
            session,
            currentQuestion: 0,
            timeRemaining: session.questions[0]?.timeLimit || 30,
            isLoading: false,
            lastAnswer: null,
          });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      submitAnswer: async (selectedAnswer, timeSpent) => {
        const { session, currentQuestion } = get();
        if (!session || get().isAnswering) return;

        const question = session.questions[currentQuestion];
        if (!question) return;

        set({ isAnswering: true });
        try {
          const result = await api.submitAnswer(session.id, question.id, selectedAnswer, timeSpent);

          const answerResult: AnswerResult = {
            questionId: question.id,
            selectedAnswer,
            isCorrect: result.isCorrect,
            correctAnswer: result.correctAnswer,
            explanation: result.explanation,
            source: result.source,
            timeSpent,
            pointsEarned: result.pointsEarned,
          };

          set((state) => ({
            answers: [...state.answers, answerResult],
            lastAnswer: answerResult,
            isAnswering: false,
            session: state.session ? { ...state.session, score: result.currentScore } : null,
          }));
        } catch (err) {
          set({ error: (err as Error).message, isAnswering: false });
        }
      },

      nextQuestion: () => {
        const { session, currentQuestion } = get();
        if (!session) return;

        const nextIndex = currentQuestion + 1;
        if (nextIndex < session.questions.length) {
          set({
            currentQuestion: nextIndex,
            timeRemaining: session.questions[nextIndex].timeLimit,
            lastAnswer: null,
          });
        }
      },

      completeGame: async () => {
        const { session, user } = get();
        if (!session || !user) return;

        set({ isLoading: true });
        try {
          const result = await api.completeGame(session.id, user.id);
          const updatedUser = await api.getUser(user.id);
          set({
            gameResult: result,
            user: updatedUser,
            isLoading: false,
          });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      resetGame: () => {
        set({
          session: null,
          currentQuestion: 0,
          answers: [],
          timeRemaining: 0,
          lastAnswer: null,
          gameResult: null,
        });
      },

      setTimeRemaining: (time) => set({ timeRemaining: time }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'quiz-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
