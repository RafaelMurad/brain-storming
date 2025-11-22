import type {
  User,
  GameSession,
  GameResult,
  LeaderboardEntry,
  Category,
  Difficulty,
  AnswerResult,
} from '../types';

// Change this to your API URL
const API_BASE = 'http://localhost:3005/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function login(username: string, email: string): Promise<{ user: User; token: string }> {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, email }),
  });
}

export async function getUser(userId: string): Promise<User> {
  return fetchAPI(`/users/${userId}`);
}

export async function startGame(
  userId: string,
  category: Category | 'mixed',
  difficulty: Difficulty,
  questionCount?: number
): Promise<GameSession> {
  return fetchAPI('/game/start', {
    method: 'POST',
    body: JSON.stringify({ userId, category, difficulty, questionCount }),
  });
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  selectedAnswer: number,
  timeSpent: number
): Promise<AnswerResult & { sessionComplete: boolean; currentScore: number }> {
  return fetchAPI('/game/answer', {
    method: 'POST',
    body: JSON.stringify({ sessionId, questionId, selectedAnswer, timeSpent }),
  });
}

export async function completeGame(sessionId: string, userId: string): Promise<GameResult> {
  return fetchAPI('/game/complete', {
    method: 'POST',
    body: JSON.stringify({ sessionId, userId }),
  });
}

export async function getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> {
  const query = limit ? `?limit=${limit}` : '';
  return fetchAPI(`/leaderboard${query}`);
}
