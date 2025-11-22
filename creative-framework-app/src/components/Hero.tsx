'use client';

import { Lightbulb, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-500/10 blur-3xl animate-float" style={{ animationDelay: '-6s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/80">AI-Powered Creative Learning</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
          Unlock Your
          <span className="gradient-text block">Creative Potential</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
          Master proven creative frameworks, understand creative flows, discover powerful patterns,
          and use AI to generate breakthrough ideas. Your journey to enhanced creativity starts here.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => scrollToSection('frameworks')}
            className="btn-primary inline-flex items-center gap-2 justify-center"
          >
            Explore Frameworks
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollToSection('ai-generator')}
            className="btn-secondary inline-flex items-center gap-2 justify-center"
          >
            <Zap className="w-5 h-5 text-cyan-400" />
            Try AI Generator
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">10+ Frameworks</h3>
            <p className="text-white/60 text-sm">Design Thinking, SCAMPER, Six Hats, Mind Mapping, and more proven methodologies.</p>
          </div>

          <div className="glass-card glass-card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Creative Flows</h3>
            <p className="text-white/60 text-sm">Understand divergent-convergent thinking, flow states, and the four stages of creativity.</p>
          </div>

          <div className="glass-card glass-card-hover p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Ideas</h3>
            <p className="text-white/60 text-sm">Use AI prompts to expand ideas, reframe problems, and generate creative solutions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
