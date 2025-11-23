'use client';

import { useState } from 'react';
import {
  Target, Timer, Brain, Shuffle, Lightbulb, RefreshCw,
  Play, Pause, RotateCcw, CheckCircle, ArrowRight, Zap
} from 'lucide-react';
import { getRandomWord, getRandomTip, randomWords } from '@/data/ai-prompts';

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: any;
  instructions: string[];
  color: string;
}

const exercises: Exercise[] = [
  {
    id: 'random-connection',
    name: 'Random Word Connection',
    description: 'Connect a random word to your challenge to spark unexpected ideas.',
    duration: '5-10 min',
    difficulty: 'Beginner',
    icon: Shuffle,
    instructions: [
      'Think of a challenge or problem you want to solve',
      'Generate a random word using the button below',
      'List 5 characteristics or associations of the random word',
      'Force connections between each characteristic and your challenge',
      'Develop the most interesting connection into a concrete idea'
    ],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'assumption-reversal',
    name: 'Assumption Reversal',
    description: 'Challenge your assumptions by reversing them to find new possibilities.',
    duration: '10-15 min',
    difficulty: 'Intermediate',
    icon: RefreshCw,
    instructions: [
      'Write down your challenge or the thing you want to improve',
      'List all assumptions you make about this challenge',
      'Pick one assumption and write its opposite',
      'Explore: What would be possible if the opposite were true?',
      'Generate 3 ideas inspired by this reversed assumption'
    ],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'worst-idea',
    name: 'Worst Idea Brainstorm',
    description: 'Generate intentionally bad ideas to unlock creative thinking.',
    duration: '10 min',
    difficulty: 'Beginner',
    icon: Zap,
    instructions: [
      'State your challenge clearly',
      'Generate 10 deliberately terrible, impractical ideas',
      'Make them as ridiculous as possible',
      'Review each bad idea and ask: What makes this bad?',
      'Reverse the bad elements to discover good ideas hidden within'
    ],
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'constraint-challenge',
    name: 'Constraint Challenge',
    description: 'Use artificial constraints to force creative solutions.',
    duration: '15 min',
    difficulty: 'Intermediate',
    icon: Target,
    instructions: [
      'Define your challenge or goal',
      'Apply a severe constraint: only $10, only 1 hour, only 1 tool',
      'Generate solutions that work within the constraint',
      'Try a different constraint and generate new solutions',
      'Compare solutions: what principles emerge across constraints?'
    ],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'analogy-hunt',
    name: 'Analogy Hunt',
    description: 'Find analogies in nature, history, or other fields to inspire solutions.',
    duration: '15-20 min',
    difficulty: 'Advanced',
    icon: Brain,
    instructions: [
      'Describe your challenge in abstract terms (e.g., "moving things efficiently")',
      'Ask: How does nature solve this problem?',
      'Ask: What historical solution addressed a similar challenge?',
      'Ask: What other industry faces a parallel challenge?',
      'Extract principles from each analogy and apply to your challenge'
    ],
    color: 'from-green-500 to-emerald-500'
  }
];

export default function ExercisesSection() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [randomWord, setRandomWord] = useState(getRandomWord());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userNotes, setUserNotes] = useState('');

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  // Timer effect
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepIndex)
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const currentExercise = exercises.find(e => e.id === activeExercise);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-300">Interactive Exercises</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          Practice Your Creativity
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Creativity is a muscle that grows with practice. Try these exercises to strengthen your creative thinking abilities.
        </p>
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <button
              key={exercise.id}
              onClick={() => {
                setActiveExercise(exercise.id);
                setCompletedSteps([]);
                resetTimer();
              }}
              className={`glass-card glass-card-hover p-6 text-left transition-all duration-300 ${
                activeExercise === exercise.id ? 'ring-2 ring-green-500/50' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
              <p className="text-white/60 text-sm mb-4">{exercise.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-white/50">
                  <Timer className="w-3 h-3" />
                  {exercise.duration}
                </span>
                <span className={`px-2 py-0.5 rounded-full ${
                  exercise.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active exercise panel */}
      {currentExercise && (
        <div className="glass-card p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Instructions */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentExercise.color} flex items-center justify-center`}>
                  <currentExercise.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentExercise.name}</h3>
                  <p className="text-white/60 text-sm">{currentExercise.description}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-mono font-bold">{formatTime(timer)}</div>
                <div className="flex gap-2">
                  {!isTimerRunning ? (
                    <button
                      onClick={startTimer}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-white/50 ml-auto">Target: {currentExercise.duration}</span>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="font-semibold mb-3">Instructions</h4>
                {currentExercise.instructions.map((instruction, index) => (
                  <button
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-start gap-3 ${
                      completedSteps.includes(index)
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completedSteps.includes(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={completedSteps.includes(index) ? 'text-white/70 line-through' : ''}>
                      {instruction}
                    </span>
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 p-4 rounded-xl bg-white/5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white/80">{completedSteps.length}/{currentExercise.instructions.length} steps</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${(completedSteps.length / currentExercise.instructions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Tools and Notes */}
            <div className="lg:w-96">
              {/* Random word tool (for relevant exercises) */}
              {(currentExercise.id === 'random-connection' || currentExercise.id === 'analogy-hunt') && (
                <div className="glass-card p-4 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-pink-400" />
                    Random Word Generator
                  </h4>
                  <div className="text-center py-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl mb-3">
                    <span className="text-3xl font-bold gradient-text">{randomWord}</span>
                  </div>
                  <button
                    onClick={() => setRandomWord(getRandomWord())}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Random Word
                  </button>
                </div>
              )}

              {/* Notes area */}
              <div className="glass-card p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Your Ideas & Notes
                </h4>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Capture your ideas here as you work through the exercise..."
                  className="input-field h-64 resize-none"
                />
                <p className="text-xs text-white/40 mt-2">
                  Tip: Write freely without judgment. You can refine later.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick creativity boosters */}
      <div className="mt-12 glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Creativity Boosters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-medium mb-2">30-Second Association</h4>
            <p className="text-sm text-white/60 mb-3">List as many associations as you can in 30 seconds for any word.</p>
            <div className="text-center py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg">
              <span className="font-bold text-cyan-300">{randomWords[Math.floor(Math.random() * randomWords.length)]}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-medium mb-2">Alternative Uses</h4>
            <p className="text-sm text-white/60 mb-3">Think of 10 unusual uses for a common object.</p>
            <div className="text-center py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
              <span className="font-bold text-purple-300">Paper Clip</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <h4 className="font-medium mb-2">What If?</h4>
            <p className="text-sm text-white/60 mb-3">Explore impossible scenarios to spark creative thinking.</p>
            <div className="text-center py-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg">
              <span className="font-bold text-orange-300">What if gravity reversed?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
