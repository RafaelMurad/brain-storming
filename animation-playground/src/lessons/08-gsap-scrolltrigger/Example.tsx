import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Lesson 08 - ScrollTrigger: Complete Example
 *
 * ScrollTrigger links GSAP animations to scroll position.
 * Key features:
 * - Pin elements during scroll
 * - Scrub animations (link progress to scroll)
 * - Trigger at specific scroll positions
 * - Precise start/end control
 *
 * This example creates a pinned section with scroll-driven animation.
 */

export default function Example() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    // Create a timeline for the content animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,              // Element that triggers
        pin: true,                     // Pin this section
        start: "top top",              // Start when section top hits viewport top
        end: "+=1000",                 // Continue for 1000px of scrolling
        scrub: 1,                      // Smooth 1-second catch-up
        // markers: true,              // Uncomment to see debug markers
      }
    });

    // Add animations to the timeline
    // Progress is linked to scroll position via scrub
    tl.to(content, {
      scale: 1.5,
      rotation: 360,
      duration: 1,
    })
    .to(content, {
      opacity: 0,
      y: -100,
      duration: 0.5,
    });

    return () => {
      // Important: Kill ScrollTriggers on cleanup
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="relative">
      {/* Spacer before pinned section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg to-dark-surface">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Scroll Down
          </h2>
          <p className="text-dark-text-secondary">
            The next section will pin and animate
          </p>
        </div>
      </div>

      {/* Pinned section with scroll-driven animation */}
      <div
        ref={sectionRef}
        className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900"
      >
        <div ref={contentRef} className="text-center">
          <div className="text-8xl mb-6">🚀</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Pinned Section
          </h2>
          <p className="text-white/80 text-lg">
            Keep scrolling to see me scale, rotate, and fade out
          </p>
        </div>
      </div>

      {/* Spacer after pinned section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Animation Complete
          </h2>
          <p className="text-dark-text-secondary max-w-md">
            Notice how the animation was linked to your scroll position.
            This is the power of ScrollTrigger's scrub feature.
          </p>
        </div>
      </div>

      {/* Info panel */}
      <div className="fixed bottom-4 right-4 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-xs">
        <p className="font-semibold mb-2">Scroll effects:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Section pins when it reaches top</li>
          <li>Content scales and rotates as you scroll</li>
          <li>Then fades out and moves up</li>
          <li>Unpins after 1000px of scrolling</li>
          <li>scrub: 1 makes it feel smooth</li>
        </ul>
      </div>
    </div>
  );
}
