import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lessons } from '../types/lesson';
import { motion } from 'framer-motion';

export function Home() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('completedLessons');
    if (stored) {
      setCompletedLessons(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggleCompletion = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
    localStorage.setItem('completedLessons', JSON.stringify([...newCompleted]));
  };

  const completionPercentage = Math.round((completedLessons.size / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-dark-text mb-2">
              Animation Playground
            </h1>
            <p className="text-dark-text-secondary text-lg">
              Master Framer Motion & GSAP through hands-on exercises
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-text-secondary">
                Your Progress
              </span>
              <span className="text-sm font-medium text-dark-text">
                {completedLessons.size} / {lessons.length} completed
              </span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Lesson Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="bg-dark-surface rounded-lg border border-dark-border overflow-hidden hover:border-blue-600 transition-colors group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center text-dark-text font-bold group-hover:bg-blue-600 transition-colors">
                          {lesson.number}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark-text">
                            {lesson.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCompletion(lesson.id);
                        }}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-600 border-green-600'
                            : 'border-dark-border hover:border-green-600'
                        }`}
                        aria-label="Mark as complete"
                      >
                        {isCompleted && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-dark-text-secondary text-sm mb-4">
                      {lesson.description}
                    </p>
                    <Link
                      to={lesson.path}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Start Lesson
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Getting Started */}
        <motion.div
          className="mt-12 bg-dark-surface rounded-lg border border-dark-border p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-dark-text mb-4">
            Getting Started
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-dark-text-secondary">
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">
                How It Works
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• Each lesson has a guide on the left and interactive playground on the right</li>
                <li>• Start with the Exercise view and implement the animations yourself</li>
                <li>• Toggle to Solution view to see the complete working code</li>
                <li>• Use arrow keys (← →) to navigate between lessons</li>
                <li>• Mark lessons complete to track your progress</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-2">
                Learning Path
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Lessons 1-5:</strong> Master Framer Motion fundamentals</li>
                <li>• <strong>Lessons 6-8:</strong> Learn GSAP animation techniques</li>
                <li>• <strong>Lesson 9:</strong> Combine both libraries for advanced effects</li>
                <li>• Lessons build on each other, but you can jump around</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
