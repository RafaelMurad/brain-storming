import { useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Lesson 06 - GSAP Basics: Complete Example
 *
 * GSAP's imperative approach differs from Framer Motion:
 * - Use refs to target DOM elements
 * - Call gsap.to/from/fromTo in event handlers
 * - Precise control over timing and easing
 *
 * This example demonstrates different easing functions side-by-side.
 */

const easingDemos = [
  { name: 'power1.out', color: 'bg-blue-500', description: 'Gentle & smooth' },
  { name: 'power2.out', color: 'bg-purple-500', description: 'Standard decel' },
  { name: 'power4.out', color: 'bg-green-500', description: 'Strong decel' },
  { name: 'back.out', color: 'bg-yellow-500', description: 'Overshoots' },
  { name: 'elastic.out', color: 'bg-red-500', description: 'Bouncy spring' },
  { name: 'bounce.out', color: 'bg-pink-500', description: 'Bouncing ball' },
];

export default function Example() {
  // Create refs for each box
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animate all boxes with their respective easing
  const animateAll = () => {
    boxRefs.current.forEach((box, index) => {
      if (box) {
        // gsap.to() animates FROM current state TO these values
        gsap.to(box, {
          x: 300,                           // Move 300px to the right
          duration: 1.5,                    // Takes 1.5 seconds
          ease: easingDemos[index].name,    // Different easing for each
        });
      }
    });
  };

  // Reset all boxes to starting position
  const resetAll = () => {
    boxRefs.current.forEach((box) => {
      if (box) {
        gsap.to(box, {
          x: 0,                             // Back to start
          duration: 0.5,                    // Quick reset
          ease: 'power2.inOut',
        });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-dark-text mb-4">
          GSAP Easing Comparison
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={animateAll}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Animate
          </button>
          <button
            onClick={resetAll}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border text-dark-text rounded-lg font-semibold border border-dark-border transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {easingDemos.map((demo, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-4 h-16">
              {/* The animated box */}
              <div
                ref={(el) => {
                  boxRefs.current[index] = el;
                }}
                className={`${demo.color} w-16 h-16 rounded-lg shadow-xl flex items-center justify-center text-white font-bold`}
              >
                {index + 1}
              </div>

              {/* Label */}
              <div className="text-dark-text">
                <div className="font-semibold">{demo.name}</div>
                <div className="text-sm text-dark-text-secondary">
                  {demo.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary">
        <p className="font-semibold mb-2">Notice the differences:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><strong>power1-4:</strong> Increasing deceleration strength</li>
          <li><strong>back.out:</strong> Overshoots the target (goes past 300px, settles back)</li>
          <li><strong>elastic.out:</strong> Spring-like bounce at the end</li>
          <li><strong>bounce.out:</strong> Bounces like a ball hitting the ground</li>
        </ul>
      </div>
    </div>
  );
}
