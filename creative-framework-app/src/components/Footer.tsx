'use client';

import { Sparkles, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl">CreativeFlow</span>
            </div>
            <p className="text-white/60 text-sm max-w-sm mb-4">
              Your comprehensive resource for learning creative frameworks, understanding creative flows,
              and boosting your ideation with AI-powered tools.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-400" /> for creative minds
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a href="#frameworks" className="text-white/60 hover:text-white text-sm transition-colors">
                  Creative Frameworks
                </a>
              </li>
              <li>
                <a href="#flows" className="text-white/60 hover:text-white text-sm transition-colors">
                  Creative Flows
                </a>
              </li>
              <li>
                <a href="#patterns" className="text-white/60 hover:text-white text-sm transition-colors">
                  Creativity Patterns
                </a>
              </li>
              <li>
                <a href="#ai-generator" className="text-white/60 hover:text-white text-sm transition-colors">
                  AI Idea Generator
                </a>
              </li>
              <li>
                <a href="#exercises" className="text-white/60 hover:text-white text-sm transition-colors">
                  Practice Exercises
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Learn More</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-white/60 text-sm">Design Thinking by IDEO</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">Lateral Thinking by de Bono</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">Creative Confidence</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">Thinking, Fast and Slow</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">A Whack on the Side of the Head</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} CreativeFlow. Open source and free to use.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Creativity quote */}
        <div className="mt-8 text-center">
          <p className="text-white/30 text-sm italic">
            &quot;Creativity is intelligence having fun.&quot; — Albert Einstein
          </p>
        </div>
      </div>
    </footer>
  );
}
