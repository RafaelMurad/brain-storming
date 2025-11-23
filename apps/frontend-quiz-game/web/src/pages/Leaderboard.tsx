import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Target, Crown, Loader2 } from 'lucide-react';
import * as api from '../services/api';
import type { LeaderboardEntry } from '../types';
import { useGameStore } from '../store/gameStore';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGameStore();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard(20);
      setEntries(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-quiz-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top frontend developers worldwide</p>
        </div>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {entries.slice(0, 3).map((entry, index) => {
            const order = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
            const actualEntry = entries[order[index]];
            if (!actualEntry) return null;

            const isFirst = order[index] === 0;

            return (
              <motion.div
                key={actualEntry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card text-center ${isFirst ? 'scale-110 z-10' : ''} ${
                  actualEntry.userId === user?.id ? 'ring-2 ring-quiz-primary' : ''
                }`}
              >
                <div className="relative inline-block mb-3">
                  <img
                    src={actualEntry.avatar}
                    alt={actualEntry.username}
                    className={`rounded-full mx-auto ${isFirst ? 'w-20 h-20' : 'w-16 h-16'}`}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${
                      actualEntry.rank === 1
                        ? 'bg-yellow-500'
                        : actualEntry.rank === 2
                        ? 'bg-gray-400'
                        : 'bg-amber-600'
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{actualEntry.rank}</span>
                  </div>
                </div>
                <p className="font-semibold truncate">{actualEntry.username}</p>
                <p className="text-sm text-gray-400">Level {actualEntry.level}</p>
                <p className="text-quiz-primary font-bold mt-2">{actualEntry.totalXp.toLocaleString()} XP</p>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <div className="card divide-y divide-quiz-border">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 ${getRankBg(entry.rank)} ${
                entry.userId === user?.id ? 'bg-quiz-primary/10' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>

              {/* Avatar */}
              <img
                src={entry.avatar}
                alt={entry.username}
                className="w-12 h-12 rounded-full"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{entry.username}</p>
                  {entry.userId === user?.id && (
                    <span className="badge-primary text-xs">You</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">Level {entry.level}</p>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span>{entry.streak}</span>
                </div>
                <div className="flex items-center gap-1 text-quiz-success">
                  <Target className="w-4 h-4" />
                  <span>{entry.accuracy.toFixed(0)}%</span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-bold text-quiz-primary">{entry.totalXp.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </motion.div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Be the first!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
