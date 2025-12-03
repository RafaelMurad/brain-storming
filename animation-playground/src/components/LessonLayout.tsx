import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from './MarkdownRenderer';
import { lessons } from '../types/lesson';

interface LessonLayoutProps {
  lessonId: string;
  lessonContent: string;
  ExampleComponent: React.ComponentType;
  ExerciseComponent: React.ComponentType;
}

export function LessonLayout({
  lessonId,
  lessonContent,
  ExampleComponent,
  ExerciseComponent,
}: LessonLayoutProps) {
  const [showSolution, setShowSolution] = useState(false);
  const navigate = useNavigate();

  const currentLesson = lessons.find((l) => l.id === lessonId);
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  useEffect(() => {
    setShowSolution(false);
  }, [lessonId]);

  const handleReset = () => {
    window.location.reload();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && previousLesson) {
      navigate(previousLesson.path);
    } else if (e.key === 'ArrowRight' && nextLesson) {
      navigate(nextLesson.path);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-dark-text-secondary hover:text-dark-text transition-colors"
              >
                ← Back to Lessons
              </Link>
              <div className="text-sm text-dark-text-secondary">
                Lesson {currentLesson?.number} of {lessons.length}
              </div>
            </div>
            <h1 className="text-xl font-bold text-dark-text">
              {currentLesson?.title}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
              >
                {showSolution ? 'Show Exercise' : 'Show Solution'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-dark-surface hover:bg-dark-border text-dark-text rounded transition-colors text-sm border border-dark-border"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex max-w-[1920px] mx-auto">
        {/* Left: Markdown Lesson */}
        <div className="w-1/2 border-r border-dark-border overflow-y-auto h-[calc(100vh-73px)]">
          <div className="p-8">
            <MarkdownRenderer content={lessonContent} />
          </div>
        </div>

        {/* Right: Interactive Component */}
        <div className="w-1/2 overflow-y-auto h-[calc(100vh-73px)]">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-text mb-2">
                {showSolution ? 'Solution' : 'Your Exercise'}
              </h2>
              <p className="text-dark-text-secondary text-sm">
                {showSolution
                  ? 'This is the complete working solution. Study how it works!'
                  : 'Implement the animation following the instructions on the left.'}
              </p>
            </div>
            <div className="bg-dark-surface rounded-lg p-6 min-h-[400px]">
              {showSolution ? <ExampleComponent /> : <ExerciseComponent />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {previousLesson ? (
                <Link
                  to={previousLesson.path}
                  className="flex items-center gap-2 text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <span>←</span>
                  <div>
                    <div className="text-xs">Previous</div>
                    <div className="text-sm font-medium">{previousLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div className="w-48" />
              )}
            </div>
            <div className="text-center text-dark-text-secondary text-sm">
              Use ← → arrow keys to navigate
            </div>
            <div>
              {nextLesson ? (
                <Link
                  to={nextLesson.path}
                  className="flex items-center gap-2 text-dark-text-secondary hover:text-dark-text transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs">Next</div>
                    <div className="text-sm font-medium">{nextLesson.title}</div>
                  </div>
                  <span>→</span>
                </Link>
              ) : (
                <div className="w-48" />
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
