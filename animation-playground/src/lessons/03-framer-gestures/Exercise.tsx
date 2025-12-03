// TODO: Import motion from framer-motion
// import { motion } from 'framer-motion';

/**
 * Lesson 03 - Gestures: Your Exercise
 *
 * Goal: Make an interactive card that responds to hover, tap, and drag
 *
 * Steps:
 * 1. Import motion from framer-motion
 * 2. Convert the <div> to <motion.div>
 * 3. Add whileHover with scale: 1.05, y: -10, and boxShadow
 * 4. Add whileTap with scale: 0.95
 * 5. Add drag prop (set to true)
 * 6. Add dragConstraints for top, left, right, bottom
 * 7. Add dragElastic={0.2}
 * 8. Add whileDrag with opacity: 0.8
 */

export default function Exercise() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {/* TODO: Convert to motion.div and add gesture props */}
      <div
        // TODO: Add whileHover prop
        // whileHover={{
        //   scale: 1.05,
        //   y: -10,
        //   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        // }}

        // TODO: Add whileTap prop
        // whileTap={{ scale: 0.95 }}

        // TODO: Add drag prop
        // drag

        // TODO: Add dragConstraints prop
        // dragConstraints={{
        //   top: -100,
        //   left: -100,
        //   right: 100,
        //   bottom: 100,
        // }}

        // TODO: Add dragElastic prop
        // dragElastic={0.2}

        // TODO: Add whileDrag prop
        // whileDrag={{ opacity: 0.8, cursor: 'grabbing' }}

        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl p-8 cursor-grab select-none"
      >
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Make Me Interactive!</h3>
          <p className="text-white/90 mb-4">
            I'm just a static card right now. Add gestures to bring me to life!
          </p>
          <div className="text-sm text-white/70 space-y-1">
            <p>🖱️ Should lift on hover</p>
            <p>👆 Should shrink on click</p>
            <p>✋ Should be draggable</p>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div className="absolute bottom-4 right-4 text-dark-text-secondary text-sm bg-dark-surface p-4 rounded-lg max-w-xs">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Hover: scale 1.05, move up 10px, add shadow</li>
          <li>Click: scale 0.95</li>
          <li>Draggable with 100px constraints in all directions</li>
          <li>0.2 elastic bounce at boundaries</li>
          <li>0.8 opacity while dragging</li>
        </ul>
      </div>
    </div>
  );
}
