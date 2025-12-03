import { useRef } from 'react';
import { motion, useScroll, useInView } from 'framer-motion';

/**
 * Lesson 04 - Scroll Hooks: Complete Example
 *
 * Two powerful patterns:
 * 1. useScroll - Tracks scroll progress (scroll progress bar)
 * 2. useInView - Detects when elements become visible (fade-in-on-scroll)
 *
 * These hooks return MotionValues that can be used directly in style prop.
 */

// Component that fades in when scrolled into view
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);

  // useInView returns true when element is in viewport
  // once: true means it stays true after first trigger
  const isInView = useInView(ref, {
    once: true,      // Only animate in once, don't animate out
    amount: 0.3,     // Trigger when 30% of element is visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      // Conditionally animate based on whether element is in view
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay,                    // Stagger effect
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Example() {
  // useScroll returns scroll progress as MotionValue
  // scrollYProgress goes from 0 (top of page) to 1 (bottom of page)
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative">
      {/* Scroll Progress Bar - Fixed at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-blue-600 z-50"
        style={{
          // scaleX grows from 0 to 1 as you scroll
          scaleX: scrollYProgress,
          // transformOrigin controls which edge scales from
          transformOrigin: 'left',
        }}
      />

      {/* Scrollable Content */}
      <div className="space-y-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark-text mb-2">
            Scroll Down to See Effects
          </h2>
          <p className="text-dark-text-secondary">
            Watch the progress bar at the top and the fade-in boxes
          </p>
        </div>

        {/* Multiple sections that fade in on scroll */}
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
                  This section faded in when you scrolled to it!
                </p>
              </div>
            </div>
          </FadeInSection>
        ))}

        <div className="text-center pt-8 text-dark-text-secondary">
          <p className="text-sm">
            Notice how the sections only animate in once,
            and the progress bar shows your scroll position
          </p>
        </div>
      </div>
    </div>
  );
}
