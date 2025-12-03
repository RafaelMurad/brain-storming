// TODO: Import necessary dependencies
// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';

/**
 * Lesson 07 - GSAP Timelines: Your Exercise
 *
 * Goal: Create a word reveal animation using a GSAP timeline
 *
 * Steps:
 * 1. Import useRef, useEffect from React and gsap from 'gsap'
 * 2. Create refs for container and timeline
 * 3. In useEffect, create a timeline with defaults
 * 4. Add .from() animation for words with stagger
 * 5. Add .from() for subtitle with position parameter
 * 6. Add .from() for button
 * 7. Play the timeline
 * 8. Implement replay function
 */

export default function Exercise() {
  // TODO: Create refs
  // const containerRef = useRef<HTMLDivElement>(null);
  // const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const text = "Animation makes the web come alive";
  const words = text.split(' ');

  // TODO: Create timeline in useEffect
  // useEffect(() => {
  //   if (!containerRef.current) return;
  //
  //   const tl = gsap.timeline({
  //     paused: true,
  //     defaults: {
  //       duration: 0.6,
  //       ease: 'power2.out',
  //     }
  //   });
  //
  //   tl.from('.word', {
  //     opacity: 0,
  //     y: 30,
  //     stagger: 0.15,
  //   })
  //   .from('.subtitle', {
  //     opacity: 0,
  //     y: 20,
  //   }, "-=0.3")
  //   .from('.button', {
  //     opacity: 0,
  //     scale: 0.8,
  //   }, "-=0.2");
  //
  //   timelineRef.current = tl;
  //   tl.play();
  //
  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  // TODO: Implement replay function
  // const replay = () => {
  //   if (timelineRef.current) {
  //     timelineRef.current.restart();
  //   }
  // };

  return (
    // TODO: Add ref to container
    <div /* ref={containerRef} */ className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-dark-text mb-2">
          {words.map((word, index) => (
            <span
              key={index}
              className="word inline-block mr-3"
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="subtitle text-lg text-dark-text-secondary">
          Implement the timeline to see the reveal!
        </p>
      </div>

      <button
        // TODO: Add onClick={replay}
        className="button px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        Replay Animation
      </button>

      <div className="mt-8 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-md">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Words reveal one by one with 0.15s stagger</li>
          <li>Subtitle starts 0.3s before words finish</li>
          <li>Button starts 0.2s before subtitle finishes</li>
          <li>Everything fades in and moves up</li>
          <li>Replay button restarts the sequence</li>
        </ul>
      </div>
    </div>
  );
}
