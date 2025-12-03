// TODO: Import motion from framer-motion
// import { motion } from 'framer-motion';

/**
 * Lesson 01 - Framer Motion Basics: Your Exercise
 *
 * Goal: Animate a box that fades in, slides up, and scales up when the component mounts
 *
 * Steps:
 * 1. Import motion from framer-motion (uncomment the import above)
 * 2. Change the <div> below to <motion.div>
 * 3. Add initial prop with opacity: 0, y: 50, scale: 0.8
 * 4. Add animate prop with opacity: 1, y: 0, scale: 1
 * 5. Add transition prop with duration: 0.6, ease: 'easeOut'
 */
export default function Exercise() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {/* TODO: Convert this div to motion.div and add animation props */}
      <div
        // TODO: Add initial prop
        // initial={{ opacity: 0, y: 50, scale: 0.8 }}

        // TODO: Add animate prop
        // animate={{ opacity: 1, y: 0, scale: 1 }}

        // TODO: Add transition prop
        // transition={{ duration: 0.6, ease: 'easeOut' }}

        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-2xl p-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome!
        </h2>
        <p className="text-white/90 text-lg">
          Right now I'm just a static box. Make me come alive with Framer Motion!
        </p>
        <div className="mt-6 text-sm text-white/70 space-y-2">
          <p>Expected behavior:</p>
          <ul className="list-disc list-inside">
            <li>Start invisible and fade in</li>
            <li>Start 50px below and slide up</li>
            <li>Start at 80% size and scale to 100%</li>
            <li>Take 0.6 seconds with easeOut easing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
