import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogIn, Loader2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { login, isLoading, error, clearError } = useGameStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !email.trim()) return;

    await login(username.trim(), email.trim());

    // Check if login was successful
    const { isAuthenticated } = useGameStore.getState();
    if (isAuthenticated) {
      navigate('/play');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Frontend Quiz</h1>
          <p className="text-gray-400">Enter your details to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input pl-11"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input pl-11"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-quiz-error/10 border border-quiz-error/30 rounded-lg p-3 text-quiz-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !email.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Start Playing
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your progress will be saved automatically
        </p>
      </motion.div>
    </div>
  );
}
