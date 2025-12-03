import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

/**
 * Lesson 09 - Advanced Effects: Complete Example
 *
 * This combines Framer Motion and GSAP to create a "Stranger Things"
 * style flickering neon text effect.
 *
 * - GSAP: Handles rapid, random opacity flickers
 * - Framer Motion: Handles smooth color transitions
 *
 * Each library does what it's best at, creating an effect
 * that would be harder to achieve with either alone.
 */

export default function Example() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isFlickering, setIsFlickering] = useState(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!textRef.current || !isFlickering) return;

    // GSAP timeline for rapid random flickers
    const tl = gsap.timeline({ repeat: -1 });

    // Create a sequence of random flickers
    // Each flicker has random opacity and duration
    for (let i = 0; i < 30; i++) {
      const shouldFlicker = Math.random() > 0.7; // 30% chance to flicker

      tl.to(textRef.current, {
        opacity: shouldFlicker ? 0.3 : 1,
        duration: 0.05 + Math.random() * 0.1,
        ease: 'none',
      });
    }

    // Add occasional complete blackout
    tl.to(textRef.current, {
      opacity: 0,
      duration: 0.05,
    })
    .to(textRef.current, {
      opacity: 1,
      duration: 0.05,
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [isFlickering]);

  const toggleFlicker = () => {
    if (isFlickering && timelineRef.current) {
      timelineRef.current.kill();
      // Reset to full opacity
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
      }
    }
    setIsFlickering(!isFlickering);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-black p-8">
      {/* Text with combined effects */}
      <motion.h1
        ref={textRef}
        className="text-6xl font-bold mb-8 select-none"
        style={{
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
        }}
        // Framer Motion: Smooth color animation
        animate={{
          color: ['#ff0000', '#ff3300', '#ff6600', '#ff3300', '#ff0000'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        STRANGER THINGS
      </motion.h1>

      {/* Control button */}
      <button
        onClick={toggleFlicker}
        className="px-6 py-3 bg-dark-surface hover:bg-dark-border text-dark-text rounded-lg font-semibold border border-dark-border transition-colors"
      >
        {isFlickering ? 'Stop Flicker' : 'Start Flicker'}
      </button>

      {/* Info */}
      <div className="mt-8 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-md">
        <p className="font-semibold mb-2">This effect combines:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><strong>GSAP:</strong> Rapid random opacity flickers (perfect for unpredictable timing)</li>
          <li><strong>Framer Motion:</strong> Smooth color transitions (perfect for declarative animations)</li>
          <li>Both animate the same element simultaneously</li>
          <li>Each library handles what it does best</li>
        </ul>
      </div>

      <div className="mt-4 text-center text-dark-text-secondary text-xs max-w-md">
        <p>
          <strong>Why combine?</strong> GSAP excels at precise, rapid timing (flickers),
          while Framer Motion is cleaner for smooth, React-integrated animations (colors).
          Together, they create effects neither could achieve as elegantly alone.
        </p>
      </div>
    </div>
  );
}
