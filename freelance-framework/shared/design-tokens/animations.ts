/**
 * Design Tokens - Animations
 *
 * Consistent animation values for web (Framer Motion) and mobile (Reanimated).
 */

// Durations (in milliseconds)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Easing functions
export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Custom easings
  spring: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
  smooth: [0.25, 0.1, 0.25, 1],
} as const;

// Spring configs (for Framer Motion / Reanimated)
export const springConfig = {
  // Gentle - for subtle movements
  gentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  // Wobbly - for playful animations
  wobbly: {
    damping: 10,
    stiffness: 200,
    mass: 1,
  },
  // Stiff - for snappy movements
  stiff: {
    damping: 30,
    stiffness: 400,
    mass: 1,
  },
  // Slow - for elegant transitions
  slow: {
    damping: 25,
    stiffness: 50,
    mass: 2,
  },
  // Default - balanced
  default: {
    damping: 25,
    stiffness: 150,
    mass: 1,
  },
} as const;

// Framer Motion variants
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal / 1000 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut },
  },
  slideInLeft: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut },
  },
  slideInRight: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', ...springConfig.default },
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
} as const;

// CSS keyframes (for Tailwind)
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideDown: {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
} as const;
