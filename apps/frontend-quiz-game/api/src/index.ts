import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import {
  getOrCreateUser,
  getUserById,
  startGameSession,
  getSession,
  submitAnswer,
  completeGame,
  getLeaderboard,
  getCategories,
} from './services/gameService';
import { Category, Difficulty } from './types';

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email required' });
  }

  const user = getOrCreateUser(username, email);
  res.json({ user, token: uuidv4() }); // Simplified token for demo
});

app.get('/api/users/:userId', (req, res) => {
  const user = getUserById(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Game routes
app.get('/api/categories', (req, res) => {
  res.json(getCategories());
});

app.post('/api/game/start', (req, res) => {
  const { userId, category, difficulty, questionCount } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const session = startGameSession(
    userId,
    category || 'mixed',
    difficulty || 'intermediate',
    questionCount || 10
  );

  // Don't send correct answers to client
  const clientSession = {
    ...session,
    questions: session.questions.map(q => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      code: q.code,
      options: q.options,
      points: q.points,
      timeLimit: q.timeLimit,
    })),
  };

  res.json(clientSession);
});

app.get('/api/game/session/:sessionId', (req, res) => {
  const session = getSession(req.params.sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // Don't send correct answers
  const clientSession = {
    ...session,
    questions: session.questions.map(q => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      code: q.code,
      options: q.options,
      points: q.points,
      timeLimit: q.timeLimit,
    })),
  };

  res.json(clientSession);
});

app.post('/api/game/answer', (req, res) => {
  const { sessionId, questionId, selectedAnswer, timeSpent } = req.body;

  if (!sessionId || !questionId || selectedAnswer === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = submitAnswer(sessionId, questionId, selectedAnswer, timeSpent || 0);

  if (!result) {
    return res.status(400).json({ error: 'Invalid session or question' });
  }

  // Get the question to include explanation
  const session = getSession(sessionId);
  const question = session?.questions.find(q => q.id === questionId);

  res.json({
    ...result.answer,
    correctAnswer: question?.correctAnswer,
    explanation: question?.explanation,
    source: question?.source,
    sessionComplete: result.session.isComplete,
    currentScore: result.session.score,
  });
});

app.post('/api/game/complete', (req, res) => {
  const { sessionId, userId } = req.body;

  if (!sessionId || !userId) {
    return res.status(400).json({ error: 'Session ID and User ID required' });
  }

  const result = completeGame(sessionId, userId);

  if (!result) {
    return res.status(400).json({ error: 'Could not complete game' });
  }

  res.json(result);
});

// Leaderboard routes
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(getLeaderboard(limit));
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🎮 Frontend Quiz API running on http://localhost:${PORT}`);
  console.log(`📚 Categories: ${getCategories().map(c => c.name).join(', ')}`);
});
