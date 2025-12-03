# Lesson 01: Framer Motion Basics

## Concept

Framer Motion makes animation simple with the `motion` component. By converting any HTML element to a `motion` element, you can animate it using the `animate` prop. The library automatically handles all the complex animation logic for you.

## Key APIs

- **`motion.div`**: Animated version of a div (works for any HTML element)
- **`animate` prop**: Object defining the target state of your animation
- **`initial` prop**: Object defining the starting state
- **`transition` prop**: Object controlling animation timing and easing

## What You'll Build

A simple box that animates in when the component mounts:
- Fades in from transparent to visible
- Slides up from below
- Scales up from smaller to full size

This is the classic "fade in + slide up" pattern you see everywhere on the web.

## Implementation Guide

### Step 1: Import motion

```tsx
import { motion } from 'framer-motion';
```

### Step 2: Convert div to motion.div

Change your regular `<div>` to `<motion.div>`. This gives it animation superpowers.

### Step 3: Define initial state

The `initial` prop sets where the animation starts from:

```tsx
initial={{
  opacity: 0,      // Invisible
  y: 50,           // 50px below final position
  scale: 0.8       // 80% of final size
}}
```

### Step 4: Define animate state

The `animate` prop sets where the animation ends:

```tsx
animate={{
  opacity: 1,      // Fully visible
  y: 0,            // At original position
  scale: 1         // Full size
}}
```

### Step 5: Configure transition

Control how the animation feels:

```tsx
transition={{
  duration: 0.6,           // Animation takes 0.6 seconds
  ease: 'easeOut'          // Smooth deceleration
}}
```

## Common Easing Functions

- `linear`: Constant speed (robotic)
- `easeIn`: Slow start, fast end
- `easeOut`: Fast start, slow end (most natural for entrances)
- `easeInOut`: Slow start and end, fast middle
- `[0.25, 0.1, 0.25, 1]`: Custom cubic-bezier curve

## Tips

- Always animate **transform** properties (`x`, `y`, `scale`, `rotate`) when possible - they're GPU-accelerated and silky smooth
- Use `opacity` for fade effects - also hardware accelerated
- Avoid animating `width`, `height`, or `margin` - they cause layout recalculations and can be janky
- `y: 50` moves DOWN 50px (positive is down, negative is up)
- Start with `duration: 0.6` and `ease: 'easeOut'` - works for most cases

## Success Criteria

When you're done, you should see:
- A box that's invisible when the page loads
- It fades in smoothly
- It slides up from below as it fades in
- It grows from 80% to 100% size
- The whole animation feels smooth and polished

## Further Reading

- [Framer Motion Animation Docs](https://www.framer.com/motion/animation/)
- [Transform Properties](https://www.framer.com/motion/component/#transform)
