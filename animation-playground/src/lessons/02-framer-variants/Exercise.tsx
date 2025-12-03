// TODO: Import motion from framer-motion
// import { motion } from 'framer-motion';

/**
 * Lesson 02 - Variants: Your Exercise
 *
 * Goal: Create a staggered menu animation using variants
 *
 * Steps:
 * 1. Import motion from framer-motion
 * 2. Create containerVariants with hidden and visible states
 * 3. Create itemVariants with hidden and visible states
 * 4. Apply containerVariants to the <ul>
 * 5. Apply itemVariants to each <li>
 */

// TODO: Create container variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2,
//     },
//   },
// };

// TODO: Create item variants
// const itemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.4,
//       ease: 'easeOut',
//     },
//   },
// };

const menuItems = [
  { icon: '🏠', label: 'Home', color: 'from-blue-500 to-blue-600' },
  { icon: '🎨', label: 'Projects', color: 'from-purple-500 to-purple-600' },
  { icon: '📝', label: 'Blog', color: 'from-green-500 to-green-600' },
  { icon: '📧', label: 'Contact', color: 'from-red-500 to-red-600' },
];

export default function Exercise() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {/* TODO: Convert to motion.ul and add variants */}
      <ul
        // TODO: Add variants={containerVariants}
        // TODO: Add initial="hidden"
        // TODO: Add animate="visible"
        className="space-y-3 w-64"
      >
        {menuItems.map((item, index) => (
          // TODO: Convert to motion.li and add variants
          <li
            key={index}
            // TODO: Add variants={itemVariants}
            className={`bg-gradient-to-r ${item.color} rounded-lg p-4 shadow-lg`}
          >
            <div className="flex items-center gap-3 text-white">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-lg">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-4 right-4 text-sm text-dark-text-secondary max-w-xs bg-dark-surface p-4 rounded">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Container fades in first</li>
          <li>Items appear one after another</li>
          <li>Each item slides in from left (-20px)</li>
          <li>0.1s stagger between items</li>
        </ul>
      </div>
    </div>
  );
}
