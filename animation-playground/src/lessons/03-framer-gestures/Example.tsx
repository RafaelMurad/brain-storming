import { motion } from 'framer-motion';

/**
 * Lesson 03 - Gestures: Complete Example
 *
 * Gestures make elements interactive with minimal code:
 * - whileHover: Plays while mouse is over element
 * - whileTap: Plays while element is pressed
 * - drag: Makes element draggable
 * - dragConstraints: Limits where it can be dragged
 *
 * No event handlers needed - Framer Motion handles everything!
 */

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        // whileHover: Plays while hovering over the element
        whileHover={{
          scale: 1.05,        // Grow by 5%
          y: -10,             // Lift up 10px
          // Note: boxShadow requires camelCase in React
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}

        // whileTap: Plays while clicking/pressing the element
        // Shrinking slightly gives tactile feedback like a real button
        whileTap={{
          scale: 0.95,        // Shrink by 5%
        }}

        // drag: Enable dragging
        // Can be: true (both axes), "x" (horizontal only), or "y" (vertical only)
        drag

        // dragConstraints: Limits how far the element can be dragged
        // Values are in pixels from the element's initial position
        dragConstraints={{
          top: -100,          // Can't go more than 100px up
          left: -100,         // Can't go more than 100px left
          right: 100,         // Can't go more than 100px right
          bottom: 100,        // Can't go more than 100px down
        }}

        // dragElastic: How bouncy it feels when hitting constraints
        // 0 = rigid (stops hard), 1 = super bouncy
        // 0.2 is a nice middle ground
        dragElastic={0.2}

        // whileDrag: Animation that plays while dragging
        // Changing opacity is a common pattern to show it's being moved
        whileDrag={{
          opacity: 0.8,
          cursor: 'grabbing',
        }}

        // Regular CSS classes still work
        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl p-8 cursor-grab select-none"
      >
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Interactive Card</h3>
          <p className="text-white/90 mb-4">
            Hover, click, and drag me around!
          </p>
          <div className="text-sm text-white/70 space-y-1">
            <p>🖱️ Hover to lift</p>
            <p>👆 Click to shrink</p>
            <p>✋ Drag to move</p>
          </div>
        </div>
      </motion.div>

      {/* Helper text */}
      <div className="absolute bottom-4 right-4 text-dark-text-secondary text-sm bg-dark-surface p-4 rounded-lg max-w-xs">
        <p className="font-semibold mb-2">Try these interactions:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Hover: Card lifts and glows</li>
          <li>Click: Card shrinks slightly</li>
          <li>Drag: Card follows your cursor</li>
          <li>Try dragging past the boundaries - it bounces back!</li>
        </ul>
      </div>
    </div>
  );
}
