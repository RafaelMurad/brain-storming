'use client';

import { useState } from 'react';
import {
  Lightbulb, Sparkles, Brain, Shuffle, Workflow,
  BookOpen, Wand2, Target, ChevronRight, Menu, X
} from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FrameworksSection from '@/components/FrameworksSection';
import FlowsSection from '@/components/FlowsSection';
import PatternsSection from '@/components/PatternsSection';
import AIIdeaGenerator from '@/components/AIIdeaGenerator';
import ExercisesSection from '@/components/ExercisesSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <main className="min-h-screen">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="pt-20">
        <Hero setActiveSection={setActiveSection} />

        <section id="frameworks" className="py-20">
          <FrameworksSection />
        </section>

        <section id="flows" className="py-20 bg-black/20">
          <FlowsSection />
        </section>

        <section id="patterns" className="py-20">
          <PatternsSection />
        </section>

        <section id="ai-generator" className="py-20 bg-black/20">
          <AIIdeaGenerator />
        </section>

        <section id="exercises" className="py-20">
          <ExercisesSection />
        </section>

        <Footer />
      </div>
    </main>
  );
}
