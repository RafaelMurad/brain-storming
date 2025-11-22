import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Trophy, Flame, Users, Code, Brain } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const features = [
  {
    icon: Brain,
    title: 'AI-Generated Questions',
    description: 'Questions sourced from official documentation and updated regularly',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    description: 'Build your streak for bonus XP and unlock special achievements',
  },
  {
    icon: Trophy,
    title: 'Level System',
    description: 'Earn XP, level up, and climb the global leaderboard',
  },
  {
    icon: Users,
    title: 'Leaderboards',
    description: 'Compete with developers worldwide and showcase your skills',
  },
];

const categories = [
  { name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
  { name: 'TypeScript', icon: '🔷', color: 'from-blue-500 to-indigo-500' },
  { name: 'CSS', icon: '🎨', color: 'from-pink-500 to-purple-500' },
  { name: 'JavaScript', icon: '🟨', color: 'from-yellow-500 to-orange-500' },
  { name: 'Next.js', icon: '▲', color: 'from-gray-500 to-gray-700' },
  { name: 'Vue', icon: '💚', color: 'from-green-500 to-emerald-500' },
];

export default function Home() {
  const { isAuthenticated } = useGameStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-quiz-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-quiz-primary/10 border border-quiz-primary/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-quiz-primary" />
              <span className="text-sm text-quiz-primary">Level up your frontend skills</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Frontend
              <span className="block bg-gradient-to-r from-quiz-primary via-quiz-secondary to-quiz-accent bg-clip-text text-transparent">
                One Quiz at a Time
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Challenge yourself with AI-generated questions from React, TypeScript, CSS, and more.
              Build streaks, earn achievements, and compete globally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? '/play' : '/login'}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Code className="w-5 h-5" />
                Start Playing
              </Link>
              <Link
                to="/leaderboard"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                View Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Choose Your Challenge</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-hover text-center group"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}
                >
                  {cat.icon}
                </div>
                <p className="font-medium">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-quiz-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Why Frontend Quiz?</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            More than just questions - it's a complete learning experience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="w-12 h-12 bg-quiz-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-quiz-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="card bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10 border-quiz-primary/30 text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of developers improving their frontend knowledge every day
            </p>
            <Link
              to={isAuthenticated ? '/play' : '/login'}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Your First Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
