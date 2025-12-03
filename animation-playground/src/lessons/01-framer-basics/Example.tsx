import { motion } from 'framer-motion';

/**
 * Lesson 01 - Framer Motion Basics: Complete Example
 *
 * This demonstrates the fundamental pattern for Framer Motion animations:
 * 1. Convert a regular element to a motion element
 * 2. Define the initial state (where animation starts)
 * 3. Define the animate state (where animation ends)
 * 4. Configure the transition (how it animates)
 */
export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        // Initial state: invisible, positioned below, and slightly smaller
        // This is where the animation will start from
        initial={{
          opacity: 0,    // Completely transparent
          y: 50,         // 50px below its final position
          scale: 0.8,    // 80% of its final size
        }}

        // Animate state: visible, in position, and full size
        // Framer Motion will automatically animate from initial to animate
        animate={{
          opacity: 1,    // Fully visible
          y: 0,          // At its natural position
          scale: 1,      // 100% size
        }}

        // Transition: controls the timing and easing
        // duration: how long the animation takes in seconds
        // ease: the acceleration curve - 'easeOut' feels natural for entrances
        transition={{
          duration: 0.6,     // Animation takes 0.6 seconds
          ease: 'easeOut',   // Starts fast, ends slow
        }}

        // Regular CSS classes still work on motion elements
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl p-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome!
        </h2>
        <p className="text-white/90 text-lg">
          This box fades in, slides up, and scales up all at once.
          That's the power of Framer Motion - multiple animations
          with just a few props.
        </p>
      </motion.div>
    </div>
  );
}
