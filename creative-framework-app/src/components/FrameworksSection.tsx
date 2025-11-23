'use client';

import { useState } from 'react';
import {
  Lightbulb, Puzzle, Brain, GitBranch, Shuffle, Cog,
  HelpCircle, Sparkles, Film, Dice5, ChevronDown, ChevronUp,
  CheckCircle2, Target, Wrench
} from 'lucide-react';
import { frameworks, categories } from '@/data/frameworks';

const iconMap: Record<string, any> = {
  Lightbulb, Puzzle, Brain, GitBranch, Shuffle, Cog,
  HelpCircle, Sparkles, Film, Dice5
};

export default function FrameworksSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);

  const filteredFrameworks = selectedCategory === 'all'
    ? frameworks
    : frameworks.filter(f => f.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Creative Frameworks</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          Master Proven Creativity Methods
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Learn the most effective frameworks used by designers, innovators, and creative professionals worldwide.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Frameworks grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFrameworks.map((framework) => {
          const Icon = iconMap[framework.icon] || Lightbulb;
          const isExpanded = expandedFramework === framework.id;

          return (
            <div
              key={framework.id}
              className="glass-card overflow-hidden"
            >
              {/* Card header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedFramework(isExpanded ? null : framework.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${framework.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge text-xs">{framework.category}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{framework.name}</h3>
                    <p className="text-white/60 text-sm">{framework.shortDescription}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/10 pt-6 animate-in slide-in-from-top-2 duration-300">
                  {/* Description */}
                  <p className="text-white/70 mb-6">{framework.description}</p>
                  <p className="text-white/50 text-sm mb-6 italic">Origin: {framework.origin}</p>

                  {/* Steps */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      Steps
                    </h4>
                    <div className="space-y-4">
                      {framework.steps.map((step, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="step-indicator">{index + 1}</span>
                            <h5 className="font-medium">{step.name}</h5>
                          </div>
                          <p className="text-white/60 text-sm mb-3 ml-13">{step.description}</p>
                          <div className="ml-13 space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="flex items-start gap-2 text-sm text-white/50">
                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.benefits.map((benefit, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best for */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.bestFor.map((use, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-orange-400" />
                      Recommended Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {framework.tools.map((tool, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
