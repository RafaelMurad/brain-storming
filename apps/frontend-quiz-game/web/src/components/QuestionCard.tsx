import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Question, AnswerResult } from '../types';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (selectedAnswer: number, timeSpent: number) => void;
  lastAnswer: AnswerResult | null;
  isAnswering: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  onAnswer,
  lastAnswer,
  isAnswering,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  const hasAnswered = lastAnswer !== null;
  const timePercentage = (timeRemaining / question.timeLimit) * 100;
  const isTimeLow = timeRemaining <= 10;

  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleSelect = (index: number) => {
    if (hasAnswered || isAnswering) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasAnswered || isAnswering) return;
    const timeSpent = (Date.now() - startTime) / 1000;
    onAnswer(selectedOption, timeSpent);
  };

  const getOptionClass = (index: number) => {
    const baseClass =
      'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3';

    if (hasAnswered) {
      if (index === lastAnswer.correctAnswer) {
        return `${baseClass} border-quiz-success bg-quiz-success/10`;
      }
      if (index === selectedOption && !lastAnswer.isCorrect) {
        return `${baseClass} border-quiz-error bg-quiz-error/10`;
      }
      return `${baseClass} border-quiz-border bg-quiz-dark/50 opacity-50`;
    }

    if (selectedOption === index) {
      return `${baseClass} border-quiz-primary bg-quiz-primary/10`;
    }

    return `${baseClass} border-quiz-border bg-quiz-dark hover:border-quiz-primary/50 hover:bg-quiz-card cursor-pointer`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{CATEGORY_ICONS[question.category]}</span>
          <div>
            <p className="text-sm text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className={`text-sm font-medium capitalize ${DIFFICULTY_COLORS[question.difficulty]}`}>
              {question.difficulty}
            </p>
          </div>
        </div>

        {/* Timer */}
        {!hasAnswered && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isTimeLow ? 'bg-quiz-error/20 text-quiz-error' : 'bg-quiz-dark'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold text-lg">{timeRemaining}s</span>
          </div>
        )}
      </div>

      {/* Timer bar */}
      {!hasAnswered && (
        <div className="h-1 bg-quiz-dark rounded-full mb-6 overflow-hidden">
          <motion.div
            className={`h-full ${isTimeLow ? 'bg-quiz-error' : 'bg-quiz-primary'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Question */}
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

      {/* Code block */}
      {question.code && (
        <pre className="code-block mb-6 text-sm overflow-x-auto">
          <code>{question.code}</code>
        </pre>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={hasAnswered || isAnswering}
            className={getOptionClass(index)}
            whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                hasAnswered && index === lastAnswer.correctAnswer
                  ? 'bg-quiz-success text-white'
                  : hasAnswered && index === selectedOption && !lastAnswer.isCorrect
                  ? 'bg-quiz-error text-white'
                  : selectedOption === index
                  ? 'bg-quiz-primary text-white'
                  : 'bg-quiz-dark'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option}</span>
            {hasAnswered && index === lastAnswer.correctAnswer && (
              <CheckCircle className="w-6 h-6 text-quiz-success" />
            )}
            {hasAnswered && index === selectedOption && !lastAnswer.isCorrect && (
              <XCircle className="w-6 h-6 text-quiz-error" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Submit button or feedback */}
      <AnimatePresence mode="wait">
        {!hasAnswered ? (
          <motion.button
            key="submit"
            onClick={handleSubmit}
            disabled={selectedOption === null || isAnswering}
            className="btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnswering ? 'Checking...' : 'Submit Answer'}
          </motion.button>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              lastAnswer.isCorrect ? 'bg-quiz-success/10 border border-quiz-success/30' : 'bg-quiz-error/10 border border-quiz-error/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {lastAnswer.isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-quiz-success" />
                  <span className="font-semibold text-quiz-success">
                    Correct! +{lastAnswer.pointsEarned} points
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-quiz-error" />
                  <span className="font-semibold text-quiz-error">Incorrect</span>
                </>
              )}
            </div>
            <p className="text-gray-300 text-sm">{lastAnswer.explanation}</p>
            <p className="text-gray-500 text-xs mt-2">Source: {lastAnswer.source}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {question.points} points available
      </div>
    </motion.div>
  );
}
