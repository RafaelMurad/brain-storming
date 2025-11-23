'use client';

import { useState } from 'react';
import {
  Merge, Repeat, RefreshCw, Lock, Recycle, Shuffle,
  Sparkles, AlertTriangle, ArrowRight
} from 'lucide-react';
import { creativePatterns } from '@/data/flows';

const iconMap: Record<string, any> = {
  Merge, Repeat, RefreshCw, Lock, Recycle, Shuffle, Sparkles, AlertTriangle
};

export default function PatternsSection() {
  const [activePattern, setActivePattern] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
          <Shuffle className="w-4 h-4 text-pink-400" />
          <span className="text-sm text-pink-300">Creative Patterns</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          Recognize Creativity Patterns
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Discover the underlying patterns that drive creative breakthroughs. Once you recognize them, you can apply them deliberately.
        </p>
      </div>

      {/* Patterns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {creativePatterns.map((pattern) => {
          const Icon = iconMap[pattern.icon] || Sparkles;
          const isActive = activePattern === pattern.id;

          return (
            <div
              key={pattern.id}
              className={`glass-card glass-card-hover p-6 cursor-pointer transition-all duration-300 ${
                isActive ? 'ring-2 ring-pink-500/50' : ''
              }`}
              onClick={() => setActivePattern(isActive ? null : pattern.id)}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{pattern.name}</h3>
              <p className="text-white/60 text-sm mb-4">{pattern.description}</p>

              {isActive && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2">
                  {/* How to use */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-pink-300 mb-2">How to Use:</h4>
                    <ul className="space-y-1">
                      {pattern.howToUse.slice(0, 3).map((tip, index) => (
                        <li key={index} className="text-xs text-white/50 flex items-start gap-1">
                          <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-300 mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {pattern.examples.map((example, index) => (
                        <li key={index} className="text-xs text-white/50 flex items-start gap-1">
                          <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-cyan-400" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-white/40 flex items-center gap-1">
                {isActive ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern connections visualization */}
      <div className="mt-12 glass-card p-8">
        <h3 className="text-xl font-semibold mb-6 text-center">How Patterns Connect</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {creativePatterns.map((pattern, index) => {
            const Icon = iconMap[pattern.icon] || Sparkles;
            return (
              <div key={pattern.id} className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center border-2 border-pink-500/30 group-hover:border-pink-500/60 transition-colors">
                  <Icon className="w-7 h-7 text-pink-400" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {pattern.name}
                </div>
                {index < creativePatterns.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-white/20" />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-white/50 text-sm mt-12">
          These patterns often work together. Combination uses Analogy to find things to combine.
          Constraint drives Inversion thinking. Serendipity leads to Exaptation.
        </p>
      </div>
    </div>
  );
}
