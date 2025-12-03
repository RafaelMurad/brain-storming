import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Lesson 07 - GSAP Timelines: Complete Example
 *
 * Timelines let you sequence animations without calculating delays.
 * Key benefits:
 * - Chain animations with method chaining
 * - Use stagger for automatic delays on multiple elements
 * - Control the entire sequence (play, pause, reverse, restart)
 * - Position animations relative to each other
 *
 * This example creates a word-by-word text reveal.
 */

export default function Example() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const text = "Animation makes the web come alive";
  const words = text.split(' ');

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a timeline with default settings that apply to all animations
    const tl = gsap.timeline({
      paused: true,                  // Don't auto-play
      defaults: {
        duration: 0.6,               // All animations default to 0.6s
        ease: 'power2.out',          // All use power2.out easing
      }
    });

    // Add animations to the timeline
    // Each .from() call adds to the sequence
    tl.from('.word', {
      opacity: 0,
      y: 30,
      stagger: 0.15,                 // 0.15s delay between each word
    })
    .from('.subtitle', {             // Starts after words complete
      opacity: 0,
      y: 20,
    }, "-=0.3")                      // Actually starts 0.3s before words end
    .from('.button', {
      opacity: 0,
      scale: 0.8,
    }, "-=0.2");                     // Starts 0.2s before subtitle ends

    timelineRef.current = tl;

    // Play on mount
    tl.play();

    return () => {
      tl.kill();                     // Cleanup
    };
  }, []);

  const replay = () => {
    if (timelineRef.current) {
      timelineRef.current.restart(); // Restart from beginning
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Title - split into individual word spans */}
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
          Watch the words appear one by one
        </p>
      </div>

      {/* Button */}
      <button
        onClick={replay}
        className="button px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        Replay Animation
      </button>

      {/* Info panel */}
      <div className="mt-8 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-md">
        <p className="font-semibold mb-2">Timeline sequence:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Words fade in and slide up with 0.15s stagger</li>
          <li>Subtitle starts 0.3s before words finish</li>
          <li>Button starts 0.2s before subtitle finishes</li>
          <li>Everything uses power2.out easing</li>
        </ol>
      </div>
    </div>
  );
}
