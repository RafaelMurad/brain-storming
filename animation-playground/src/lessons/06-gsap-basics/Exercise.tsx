// TODO: Import necessary dependencies
// import { useRef } from 'react';
// import { gsap } from 'gsap';

/**
 * Lesson 06 - GSAP Basics: Your Exercise
 *
 * Goal: Create an easing comparison demo with GSAP
 *
 * Steps:
 * 1. Import useRef from React and gsap from 'gsap'
 * 2. Create a ref array for the boxes
 * 3. Implement animateAll function using gsap.to()
 * 4. Implement resetAll function
 * 5. Connect refs to the boxes
 * 6. Wire up the buttons
 */

const easingDemos = [
  { name: 'power1.out', color: 'bg-blue-500', description: 'Gentle & smooth' },
  { name: 'power2.out', color: 'bg-purple-500', description: 'Standard decel' },
  { name: 'power4.out', color: 'bg-green-500', description: 'Strong decel' },
  { name: 'back.out', color: 'bg-yellow-500', description: 'Overshoots' },
  { name: 'elastic.out', color: 'bg-red-500', description: 'Bouncy spring' },
  { name: 'bounce.out', color: 'bg-pink-500', description: 'Bouncing ball' },
];

export default function Exercise() {
  // TODO: Create refs array for boxes
  // const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  // TODO: Implement animate function
  // const animateAll = () => {
  //   boxRefs.current.forEach((box, index) => {
  //     if (box) {
  //       gsap.to(box, {
  //         x: 300,
  //         duration: 1.5,
  //         ease: easingDemos[index].name,
  //       });
  //     }
  //   });
  // };

  // TODO: Implement reset function
  // const resetAll = () => {
  //   boxRefs.current.forEach((box) => {
  //     if (box) {
  //       gsap.to(box, {
  //         x: 0,
  //         duration: 0.5,
  //         ease: 'power2.inOut',
  //       });
  //     }
  //   });
  // };

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-dark-text mb-4">
          GSAP Easing Comparison
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            // TODO: Add onClick={animateAll}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Animate
          </button>
          <button
            // TODO: Add onClick={resetAll}
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
              {/* TODO: Add ref to connect to boxRefs array */}
              <div
                // TODO: Add ref={(el) => { boxRefs.current[index] = el; }}
                className={`${demo.color} w-16 h-16 rounded-lg shadow-xl flex items-center justify-center text-white font-bold`}
              >
                {index + 1}
              </div>

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
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Click "Animate" - boxes move 300px right with different easings</li>
          <li>Click "Reset" - boxes return to start</li>
          <li>Each box should move with its labeled easing function</li>
          <li>Duration: 1.5s for animate, 0.5s for reset</li>
        </ul>
      </div>
    </div>
  );
}
