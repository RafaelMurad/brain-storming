import { Link } from 'react-router-dom';
import { Flame, Trophy, User as UserIcon, LogOut } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { XP_PER_LEVEL } from '../types';

export default function Header() {
  const { user, isAuthenticated, logout } = useGameStore();

  return (
    <header className="bg-quiz-card/50 backdrop-blur-lg border-b border-quiz-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <span className="text-xl font-bold">Frontend Quiz</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/play" className="text-gray-400 hover:text-white transition-colors">
              Play
            </Link>
            <Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
          </nav>

          {/* User section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-2 bg-quiz-dark px-3 py-2 rounded-lg">
                <Flame className={`w-5 h-5 ${user.streak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
                <span className="font-semibold">{user.streak}</span>
              </div>

              {/* Level & XP */}
              <div className="hidden sm:flex items-center gap-2 bg-quiz-dark px-3 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-quiz-accent" />
                <span className="font-semibold">Lv. {user.level}</span>
                <div className="w-20 h-2 bg-quiz-darker rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-quiz-primary to-quiz-secondary"
                    style={{ width: `${(user.xp / XP_PER_LEVEL) * 100}%` }}
                  />
                </div>
              </div>

              {/* User menu */}
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-quiz-primary"
                />
              </Link>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
