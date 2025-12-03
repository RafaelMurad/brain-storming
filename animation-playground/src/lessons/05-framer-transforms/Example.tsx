import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Lesson 05 - Advanced Transforms: Complete Example
 *
 * This demonstrates chaining useTransform to create complex scroll effects.
 * We'll build a sticky header that shrinks as you scroll.
 *
 * Key concepts:
 * - useScroll gives us scrollY (pixels) and scrollYProgress (0-1)
 * - useTransform maps one value range to another
 * - Multiple transforms can use the same source value
 * - Style accepts MotionValues directly - no useState needed
 */

export default function Example() {
  // Get scroll position in pixels
  const { scrollY } = useScroll();

  // Transform scroll position to header height
  // [0, 100] = scroll range (first 100px of scrolling)
  // [80, 50] = height range (from 80px to 50px)
  const headerHeight = useTransform(
    scrollY,
    [0, 100],      // Input: scroll 0 to 100 pixels
    [80, 50]       // Output: height 80px to 50px
  );

  // Transform scroll to background opacity
  const backgroundOpacity = useTransform(
    scrollY,
    [0, 100],
    [0.5, 1]       // From semi-transparent to solid
  );

  // Transform scroll to text size
  const fontSize = useTransform(
    scrollY,
    [0, 100],
    [24, 18]       // From 24px to 18px
  );

  // Create dynamic background color using opacity
  const backgroundColor = useTransform(
    backgroundOpacity,
    (opacity) => `rgba(10, 10, 10, ${opacity})`
  );

  return (
    <div className="relative">
      {/* Sticky Header - shrinks on scroll */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 border-b border-dark-border"
        style={{
          height: headerHeight,              // Animated height
          backgroundColor,                    // Animated background
        }}
      >
        <motion.h1
          className="font-bold text-white"
          style={{
            fontSize,                          // Animated font size
          }}
        >
          Scroll Down
        </motion.h1>
        <div className="ml-auto text-sm text-dark-text-secondary">
          Watch me shrink!
        </div>
      </motion.header>

      {/* Spacer to push content down */}
      <div className="h-20" />

      {/* Content to enable scrolling */}
      <div className="space-y-6 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Section {i + 1}
            </h3>
            <p className="text-white/80">
              Scroll to see the header transform. Notice how the height, background opacity,
              and text size all change smoothly together. This is possible because MotionValues
              don't trigger React re-renders - they update directly in the animation loop.
            </p>
          </div>
        ))}
      </div>

      {/* Helper indicator */}
      <div className="fixed bottom-4 right-4 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-xs">
        <p className="font-semibold mb-2">Scroll Effects:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Header height: 80px → 50px</li>
          <li>Background: semi-transparent → solid</li>
          <li>Font size: 24px → 18px</li>
          <li>All changes happen in first 100px of scroll</li>
        </ul>
      </div>
    </div>
  );
}
