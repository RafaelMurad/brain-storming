// TODO: Import necessary dependencies
// import { useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// TODO: Register the plugin
// gsap.registerPlugin(ScrollTrigger);

/**
 * Lesson 08 - ScrollTrigger: Your Exercise
 *
 * Goal: Create a pinned section with scroll-driven animation
 *
 * Steps:
 * 1. Import useRef, useEffect, gsap, and ScrollTrigger
 * 2. Register ScrollTrigger plugin
 * 3. Create refs for section and content
 * 4. In useEffect, create timeline with scrollTrigger config
 * 5. Add animations to timeline
 * 6. Clean up ScrollTriggers on unmount
 */

export default function Exercise() {
  // TODO: Create refs
  // const sectionRef = useRef<HTMLDivElement>(null);
  // const contentRef = useRef<HTMLDivElement>(null);

  // TODO: Create ScrollTrigger animation
  // useEffect(() => {
  //   if (!sectionRef.current || !contentRef.current) return;
  //
  //   const section = sectionRef.current;
  //   const content = contentRef.current;
  //
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: section,
  //       pin: true,
  //       start: "top top",
  //       end: "+=1000",
  //       scrub: 1,
  //     }
  //   });
  //
  //   tl.to(content, {
  //     scale: 1.5,
  //     rotation: 360,
  //     duration: 1,
  //   })
  //   .to(content, {
  //     opacity: 0,
  //     y: -100,
  //     duration: 0.5,
  //   });
  //
  //   return () => {
  //     ScrollTrigger.getAll().forEach(st => st.kill());
  //   };
  // }, []);

  return (
    <div className="relative">
      {/* Spacer before */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg to-dark-surface">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Scroll Down
          </h2>
          <p className="text-dark-text-secondary">
            Implement ScrollTrigger to pin and animate the next section
          </p>
        </div>
      </div>

      {/* TODO: Add ref to pinned section */}
      <div
        // ref={sectionRef}
        className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900"
      >
        {/* TODO: Add ref to content */}
        <div /* ref={contentRef} */ className="text-center">
          <div className="text-8xl mb-6">🚀</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Pinned Section
          </h2>
          <p className="text-white/80 text-lg">
            Implement the animation to see me transform!
          </p>
        </div>
      </div>

      {/* Spacer after */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Animation Complete
          </h2>
          <p className="text-dark-text-secondary max-w-md">
            If implemented correctly, the section should have pinned and animated based on scroll.
          </p>
        </div>
      </div>

      {/* Info panel */}
      <div className="fixed bottom-4 right-4 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-xs">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Section pins when reaching top</li>
          <li>Content scales to 1.5x and rotates 360°</li>
          <li>Then fades out and moves up</li>
          <li>Unpins after 1000px</li>
          <li>scrub: 1 for smooth animation</li>
        </ul>
      </div>
    </div>
  );
}
