// TODO: Import necessary hooks from framer-motion and React
// import { useRef } from 'react';
// import { motion, useScroll, useInView } from 'framer-motion';

/**
 * Lesson 04 - Scroll Hooks: Your Exercise
 *
 * Goal: Create scroll-based animations
 * 1. A scroll progress bar that fills as you scroll
 * 2. Sections that fade in when scrolled into view
 *
 * Steps:
 * 1. Import useRef from React and motion, useScroll, useInView from framer-motion
 * 2. In FadeInSection: use useRef and useInView to detect visibility
 * 3. In FadeInSection: animate based on isInView state
 * 4. In main component: use useScroll to get scrollYProgress
 * 5. Apply scaleX: scrollYProgress to the progress bar
 */

// TODO: Implement FadeInSection component
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  // Suppress unused warning - delay will be used in the transition
  void delay;

  // TODO: Create a ref
  // const ref = useRef(null);

  // TODO: Use useInView hook
  // const isInView = useInView(ref, {
  //   once: true,
  //   amount: 0.3,
  // });

  return (
    // TODO: Convert to motion.div and add ref
    <div
      // TODO: Add ref={ref}
      // TODO: Add initial={{ opacity: 0, y: 50 }}
      // TODO: Add animate based on isInView
      // animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      // TODO: Add transition with delay
      // transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </div>
  );
}

export default function Exercise() {
  // TODO: Get scrollYProgress from useScroll
  // const { scrollYProgress } = useScroll();

  return (
    <div className="relative">
      {/* TODO: Convert to motion.div and connect to scroll progress */}
      <div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-600 z-50"
        // TODO: Add style prop with scaleX and transformOrigin
        // style={{
        //   scaleX: scrollYProgress,
        //   transformOrigin: 'left',
        // }}
      />

      {/* Scrollable Content */}
      <div className="space-y-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-2">
            Scroll Down to See Effects
          </h2>
          <p className="text-dark-text-secondary">
            Watch the progress bar and the fade-in boxes (once you implement them!)
          </p>
        </div>

        {/* Multiple sections */}
        {[
          { emoji: '🎯', title: 'First Section', color: 'from-blue-500 to-blue-600' },
          { emoji: '🎨', title: 'Second Section', color: 'from-purple-500 to-purple-600' },
          { emoji: '🚀', title: 'Third Section', color: 'from-green-500 to-green-600' },
          { emoji: '⭐', title: 'Fourth Section', color: 'from-yellow-500 to-yellow-600' },
          { emoji: '🎪', title: 'Fifth Section', color: 'from-red-500 to-red-600' },
        ].map((section, index) => (
          <FadeInSection key={index} delay={0.1 * index}>
            <div className={`bg-gradient-to-r ${section.color} rounded-lg p-8 shadow-xl`}>
              <div className="text-center text-white">
                <div className="text-5xl mb-4">{section.emoji}</div>
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <p className="text-white/80 mt-2">
                  This should fade in when you scroll to it!
                </p>
              </div>
            </div>
          </FadeInSection>
        ))}

        <div className="text-center pt-8 text-dark-text-secondary text-sm">
          <p className="font-semibold mb-2">Expected behavior:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Progress bar at top fills as you scroll down</li>
            <li>Each section fades in when scrolled into view</li>
            <li>Sections only animate in once (don't fade out)</li>
            <li>Slight stagger delay between sections</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
