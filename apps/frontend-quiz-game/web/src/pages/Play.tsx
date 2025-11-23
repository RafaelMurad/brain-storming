import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play as PlayIcon, Settings, ChevronRight, Loader2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import QuestionCard from '../components/QuestionCard';
import GameResult from '../components/GameResult';
import type { Category, Difficulty } from '../types';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from '../types';

const categories: { id: Category | 'mixed'; name: string; icon: string }[] = [
  { id: 'mixed', name: 'Mixed', icon: '🎲' },
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'vue', name: 'Vue', icon: '💚' },
  { id: 'testing', name: 'Testing', icon: '🧪' },
  { id: 'performance', name: 'Performance', icon: '⚡' },
  { id: 'accessibility', name: 'Accessibility', icon: '♿' },
];

const difficulties: { id: Difficulty; name: string; description: string }[] = [
  { id: 'beginner', name: 'Beginner', description: 'Basic concepts' },
  { id: 'intermediate', name: 'Intermediate', description: 'Common patterns' },
  { id: 'advanced', name: 'Advanced', description: 'Deep knowledge' },
  { id: 'expert', name: 'Expert', description: 'Master level' },
];

export default function Play() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    session,
    currentQuestion,
    answers,
    timeRemaining,
    lastAnswer,
    gameResult,
    isLoading,
    isAnswering,
    startGame,
    submitAnswer,
    nextQuestion,
    completeGame,
    resetGame,
    setTimeRemaining,
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'mixed'>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState(10);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Timer logic
  useEffect(() => {
    if (!session || session.isComplete || lastAnswer) return;

    const timer = setInterval(() => {
      setTimeRemaining(Math.max(0, timeRemaining - 1));
    }, 1000);

    // Auto-submit when time runs out
    if (timeRemaining === 0 && !lastAnswer && !isAnswering) {
      // Submit with wrong answer (index -1)
      handleAnswer(-1, session.questions[currentQuestion].timeLimit);
    }

    return () => clearInterval(timer);
  }, [session, timeRemaining, lastAnswer, isAnswering, currentQuestion]);

  const handleStartGame = async () => {
    await startGame(selectedCategory, selectedDifficulty, questionCount);
  };

  const handleAnswer = async (selected: number, timeSpent: number) => {
    await submitAnswer(selected, timeSpent);
  };

  const handleNext = () => {
    if (currentQuestion >= (session?.questions.length || 0) - 1) {
      completeGame();
    } else {
      nextQuestion();
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  // Show result screen
  if (gameResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GameResult result={gameResult} answers={answers} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  // Show game screen
  if (session && !session.isComplete) {
    const question = session.questions[currentQuestion];

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>Score: {session.score}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + (lastAnswer ? 1 : 0)) / session.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={question}
          questionNumber={currentQuestion + 1}
          totalQuestions={session.questions.length}
          timeRemaining={timeRemaining}
          onAnswer={handleAnswer}
          lastAnswer={lastAnswer}
          isAnswering={isAnswering}
        />

        {/* Next button */}
        {lastAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mt-6"
          >
            <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              {currentQuestion >= session.questions.length - 1 ? 'See Results' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // Show setup screen
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Start a Quiz</h1>
            <p className="text-gray-400">Choose your category and difficulty</p>
          </div>

          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-quiz-primary" />
              Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`card-hover text-center py-4 ${
                    selectedCategory === cat.id
                      ? 'border-quiz-primary bg-quiz-primary/10'
                      : ''
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Difficulty</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`card-hover text-center py-4 ${
                    selectedDifficulty === diff.id
                      ? 'border-quiz-primary bg-quiz-primary/10'
                      : ''
                  }`}
                >
                  <span className={`font-semibold ${DIFFICULTY_COLORS[diff.id]}`}>
                    {diff.name}
                  </span>
                  <span className="text-xs text-gray-500 block">{diff.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            <div className="flex gap-3">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`card-hover flex-1 py-3 text-center ${
                    questionCount === count
                      ? 'border-quiz-primary bg-quiz-primary/10'
                      : ''
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading Quiz...
              </>
            ) : (
              <>
                <PlayIcon className="w-6 h-6" />
                Start Quiz
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
