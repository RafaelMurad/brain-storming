// TODO: Import necessary dependencies
// import { useRef, useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { gsap } from 'gsap';

/**
 * Lesson 09 - Advanced Effects: Your Exercise
 *
 * Goal: Combine GSAP and Framer Motion for a flickering text effect
 *
 * Steps:
 * 1. Import useRef, useEffect, useState, motion, and gsap
 * 2. Create refs and state for flicker control
 * 3. In useEffect, create GSAP timeline with random flickers
 * 4. Use Framer Motion's animate prop for color transitions
 * 5. Implement toggle function to start/stop effect
 * 6. Clean up GSAP timeline on unmount
 */

export default function Exercise() {
  // TODO: Create refs and state
  // const textRef = useRef<HTMLHeadingElement>(null);
  // const [isFlickering, setIsFlickering] = useState(true);
  // const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // TODO: Create GSAP flicker effect
  // useEffect(() => {
  //   if (!textRef.current || !isFlickering) return;
  //
  //   const tl = gsap.timeline({ repeat: -1 });
  //
  //   for (let i = 0; i < 30; i++) {
  //     const shouldFlicker = Math.random() > 0.7;
  //     tl.to(textRef.current, {
  //       opacity: shouldFlicker ? 0.3 : 1,
  //       duration: 0.05 + Math.random() * 0.1,
  //       ease: 'none',
  //     });
  //   }
  //
  //   tl.to(textRef.current, { opacity: 0, duration: 0.05 })
  //     .to(textRef.current, { opacity: 1, duration: 0.05 });
  //
  //   timelineRef.current = tl;
  //
  //   return () => {
  //     tl.kill();
  //   };
  // }, [isFlickering]);

  // TODO: Implement toggle function
  // const toggleFlicker = () => {
  //   if (isFlickering && timelineRef.current) {
  //     timelineRef.current.kill();
  //     if (textRef.current) {
  //       gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
  //     }
  //   }
  //   setIsFlickering(!isFlickering);
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-black p-8">
      {/* TODO: Convert to motion.h1 and add animations */}
      <h1
        // TODO: Add ref={textRef}
        className="text-6xl font-bold mb-8 select-none"
        style={{
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
        }}
        // TODO: Add Framer Motion color animation
        // animate={{
        //   color: ['#ff0000', '#ff3300', '#ff6600', '#ff3300', '#ff0000'],
        // }}
        // transition={{
        //   duration: 3,
        //   repeat: Infinity,
        //   ease: 'easeInOut',
        // }}
      >
        STRANGER THINGS
      </h1>

      <button
        // TODO: Add onClick={toggleFlicker}
        className="px-6 py-3 bg-dark-surface hover:bg-dark-border text-dark-text rounded-lg font-semibold border border-dark-border transition-colors"
      >
        {/* TODO: Show correct text based on isFlickering state */}
        Toggle Flicker
      </button>

      <div className="mt-8 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-md">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Text should flicker rapidly and randomly (GSAP)</li>
          <li>Color should shift smoothly red → orange → red (Framer Motion)</li>
          <li>Click button to start/stop flicker effect</li>
          <li>Both animations run simultaneously</li>
          <li>Looks like a broken neon sign</li>
        </ul>
      </div>

      <div className="mt-4 text-center text-dark-text-secondary text-xs max-w-md">
        <p>
          <strong>Why combine?</strong> This exercise shows the power of using both libraries.
          GSAP handles the rapid, unpredictable flickers with precise timing,
          while Framer Motion provides smooth, React-integrated color transitions.
        </p>
      </div>
    </div>
  );
}
