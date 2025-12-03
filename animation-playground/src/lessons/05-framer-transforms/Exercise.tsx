// TODO: Import necessary hooks
// import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Lesson 05 - Advanced Transforms: Your Exercise
 *
 * Goal: Create a sticky header that shrinks as you scroll
 *
 * Steps:
 * 1. Import motion, useScroll, and useTransform
 * 2. Get scrollY from useScroll
 * 3. Create headerHeight transform (scrollY [0,100] -> [80,50])
 * 4. Create backgroundOpacity transform (scrollY [0,100] -> [0.5,1])
 * 5. Create fontSize transform (scrollY [0,100] -> [24,18])
 * 6. Create backgroundColor using backgroundOpacity
 * 7. Apply transforms to header and title styles
 */

export default function Exercise() {
  // TODO: Get scrollY from useScroll
  // const { scrollY } = useScroll();

  // TODO: Transform scrollY to header height
  // const headerHeight = useTransform(scrollY, [0, 100], [80, 50]);

  // TODO: Transform scrollY to background opacity
  // const backgroundOpacity = useTransform(scrollY, [0, 100], [0.5, 1]);

  // TODO: Transform scrollY to font size
  // const fontSize = useTransform(scrollY, [0, 100], [24, 18]);

  // TODO: Create backgroundColor from opacity
  // const backgroundColor = useTransform(
  //   backgroundOpacity,
  //   (opacity) => `rgba(10, 10, 10, ${opacity})`
  // );

  return (
    <div className="relative">
      {/* TODO: Convert to motion.header and add style with transforms */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 border-b border-dark-border"
        // TODO: Add style prop
        // style={{
        //   height: headerHeight,
        //   backgroundColor,
        // }}
      >
        {/* TODO: Convert to motion.h1 and add fontSize transform */}
        <h1
          className="font-bold text-white"
          // TODO: Add style prop
          // style={{ fontSize }}
        >
          Scroll Down
        </h1>
        <div className="ml-auto text-sm text-dark-text-secondary">
          Watch me shrink!
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20" />

      {/* Content */}
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
              Scroll to see the header transform. The height, background opacity,
              and text size should all change smoothly together in the first 100px of scrolling.
            </p>
          </div>
        ))}
      </div>

      {/* Helper */}
      <div className="fixed bottom-4 right-4 bg-dark-surface p-4 rounded-lg text-sm text-dark-text-secondary max-w-xs">
        <p className="font-semibold mb-2">Expected behavior:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Header stays fixed at top</li>
          <li>Height shrinks from 80px to 50px</li>
          <li>Background goes from 0.5 to 1 opacity</li>
          <li>Text size goes from 24px to 18px</li>
          <li>All changes in first 100px of scroll</li>
        </ul>
      </div>
    </div>
  );
}
