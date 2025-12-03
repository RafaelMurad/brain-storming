import { motion } from 'framer-motion';

/**
 * Lesson 02 - Variants: Complete Example
 *
 * Variants provide two key benefits:
 * 1. Cleaner, more reusable animation code
 * 2. Automatic parent-child orchestration with stagger effects
 *
 * The pattern:
 * - Parent defines the overall animation state ("hidden" or "visible")
 * - Children automatically inherit and animate to the same state
 * - staggerChildren creates the sequential effect
 */

// Container variants - controls the parent and orchestrates children
const containerVariants = {
  // "hidden" is the initial state - we can name this anything
  hidden: {
    opacity: 0,
  },
  // "visible" is the animated state
  visible: {
    opacity: 1,
    transition: {
      // staggerChildren: delay in seconds between each child animation
      staggerChildren: 0.1,
      // delayChildren: wait before starting first child
      delayChildren: 0.2,
    },
  },
};

// Item variants - defines how each child should animate
// The key names (hidden, visible) must match the parent's variant names
const itemVariants = {
  hidden: {
    opacity: 0,
    x: -20, // Start 20px to the left
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

const menuItems = [
  { icon: '🏠', label: 'Home', color: 'from-blue-500 to-blue-600' },
  { icon: '🎨', label: 'Projects', color: 'from-purple-500 to-purple-600' },
  { icon: '📝', label: 'Blog', color: 'from-green-500 to-green-600' },
  { icon: '📧', label: 'Contact', color: 'from-red-500 to-red-600' },
];

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {/* Parent container - controls the overall animation state */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"    // Start in "hidden" state
        animate="visible"   // Animate to "visible" state
        className="space-y-3 w-64"
      >
        {menuItems.map((item, index) => (
          // Each child automatically inherits the variant state from parent
          // We only need to pass variants - no initial or animate props needed!
          <motion.li
            key={index}
            variants={itemVariants}  // This is all you need on children
            className={`bg-gradient-to-r ${item.color} rounded-lg p-4 shadow-lg`}
          >
            <div className="flex items-center gap-3 text-white">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-lg">{item.label}</span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
