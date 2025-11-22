import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Target, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GameResult as GameResultType, AnswerResult } from '../types';
import confetti from '../utils/confetti';
import { useEffect } from 'react';

interface GameResultProps {
  result: GameResultType;
  answers: AnswerResult[];
  onPlayAgain: () => void;
}

export default function GameResult({ result, answers, onPlayAgain }: GameResultProps) {
  const isPerfect = result.accuracy === 100;
  const isGreat = result.accuracy >= 80;

  useEffect(() => {
    if (isPerfect || result.levelUp) {
      confetti();
    }
  }, [isPerfect, result.levelUp]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center mb-8"
      >
        <div
          className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isPerfect
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
              : isGreat
              ? 'bg-gradient-to-br from-quiz-primary to-quiz-secondary'
              : 'bg-quiz-card'
          }`}
        >
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isPerfect ? 'Perfect Score!' : isGreat ? 'Great Job!' : 'Quiz Complete!'}
        </h1>
        <p className="text-gray-400">
          You answered {result.correctAnswers} out of {result.totalQuestions} correctly
        </p>
      </motion.div>

      {/* Level Up Banner */}
      {result.levelUp && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-quiz-primary/20 to-quiz-secondary/20 border-quiz-primary mb-6"
        >
          <div className="flex items-center justify-center gap-4">
            <Star className="w-8 h-8 text-quiz-accent animate-pulse" />
            <div className="text-center">
              <p className="text-quiz-accent font-bold">LEVEL UP!</p>
              <p className="text-2xl font-bold">Level {result.newLevel}</p>
            </div>
            <Star className="w-8 h-8 text-quiz-accent animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <Target className="w-8 h-8 text-quiz-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{result.accuracy.toFixed(0)}%</p>
          <p className="text-sm text-gray-400">Accuracy</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <Trophy className="w-8 h-8 text-quiz-accent mx-auto mb-2" />
          <p className="text-2xl font-bold">{result.totalScore}</p>
          <p className="text-sm text-gray-400">Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <Star className="w-8 h-8 text-quiz-success mx-auto mb-2" />
          <p className="text-2xl font-bold">+{result.xpEarned}</p>
          <p className="text-sm text-gray-400">XP Earned</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{result.newStreak}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </motion.div>
      </div>

      {/* Streak Bonus */}
      {result.streakBonus > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card bg-orange-500/10 border-orange-500/30 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <span>Streak Bonus</span>
            </div>
            <span className="text-orange-500 font-bold">+{result.streakBonus} XP</span>
          </div>
        </motion.div>
      )}

      {/* New Achievements */}
      {result.newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-quiz-accent" />
            New Achievements Unlocked!
          </h3>
          <div className="space-y-3">
            {result.newAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`card flex items-center gap-4 ${
                  achievement.rarity === 'legendary'
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                    : achievement.rarity === 'epic'
                    ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30'
                    : achievement.rarity === 'rare'
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                    : ''
                }`}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div>
                  <p className="font-semibold">{achievement.name}</p>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                <span
                  className={`ml-auto badge ${
                    achievement.rarity === 'legendary'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : achievement.rarity === 'epic'
                      ? 'bg-purple-500/20 text-purple-500'
                      : achievement.rarity === 'rare'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {achievement.rarity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Time Stats */}
      <div className="card mb-8">
        <div className="flex items-center gap-3 text-gray-400">
          <Clock className="w-5 h-5" />
          <span>
            Total time: {Math.floor(result.timeSpent / 60)}m {Math.round(result.timeSpent % 60)}s
          </span>
          <span className="text-quiz-border">|</span>
          <span>
            Avg: {(result.timeSpent / result.totalQuestions).toFixed(1)}s per question
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={onPlayAgain} className="btn-primary flex-1">
          Play Again
        </button>
        <Link to="/leaderboard" className="btn-secondary flex-1 text-center">
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
