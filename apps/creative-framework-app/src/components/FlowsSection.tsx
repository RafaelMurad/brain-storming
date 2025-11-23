'use client';

import { useState } from 'react';
import { GitMerge, Workflow, Sunrise, Zap, Clock, Brain, ChevronRight } from 'lucide-react';
import { creativeFlows } from '@/data/flows';

const iconMap: Record<string, any> = {
  GitMerge, Workflow, Sunrise, Zap
};

export default function FlowsSection() {
  const [activeFlow, setActiveFlow] = useState(creativeFlows[0].id);
  const currentFlow = creativeFlows.find(f => f.id === activeFlow) || creativeFlows[0];
  const Icon = iconMap[currentFlow.icon] || Workflow;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
          <Workflow className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300">Creative Flows</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          Understand Creative Processes
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Learn how creativity flows through different phases and how to harness each stage for maximum creative output.
        </p>
      </div>

      {/* Flow tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {creativeFlows.map((flow) => {
          const FlowIcon = iconMap[flow.icon] || Workflow;
          return (
            <button
              key={flow.id}
              onClick={() => setActiveFlow(flow.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFlow === flow.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <FlowIcon className="w-4 h-4" />
              {flow.name}
            </button>
          );
        })}
      </div>

      {/* Active flow display */}
      <div className="glass-card p-8">
        {/* Flow header */}
        <div className="flex items-start gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentFlow.color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{currentFlow.name}</h3>
            <p className="text-white/60">{currentFlow.description}</p>
          </div>
        </div>

        {/* Phases */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Phases
          </h4>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-green-500 hidden md:block" />

            <div className="space-y-6">
              {currentFlow.phases.map((phase, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Phase number */}
                  <div className="hidden md:flex w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 items-center justify-center text-lg font-bold flex-shrink-0 z-10">
                    {index + 1}
                  </div>

                  {/* Phase content */}
                  <div className="flex-1 bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="md:hidden step-indicator text-sm">{index + 1}</span>
                      <h5 className="text-xl font-semibold">{phase.name}</h5>
                      <span className="badge text-xs ml-auto">{phase.duration}</span>
                    </div>
                    <p className="text-white/70 mb-4">{phase.description}</p>

                    {/* Mindset */}
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Brain className="w-4 h-4 text-pink-400" />
                      <span className="text-pink-300">Mindset:</span>
                      <span className="text-white/60">{phase.mindset}</span>
                    </div>

                    {/* Activities */}
                    <div>
                      <span className="text-sm text-white/50 block mb-2">Key Activities:</span>
                      <div className="flex flex-wrap gap-2">
                        {phase.activities.map((activity, actIndex) => (
                          <span key={actIndex} className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-sm flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-6 border border-white/5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Pro Tips
          </h4>
          <ul className="space-y-2">
            {currentFlow.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-white/70">
                <span className="text-yellow-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
