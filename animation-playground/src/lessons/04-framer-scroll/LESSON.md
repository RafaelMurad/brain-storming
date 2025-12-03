# Lesson 04: Scroll Hooks

## Concept

Framer Motion's scroll hooks let you create animations that respond to scroll position. `useScroll` tracks scroll progress, `useTransform` maps that progress to animation values, and `useInView` detects when elements enter the viewport. These hooks unlock parallax effects, scroll progress indicators, and fade-in-on-scroll patterns.

## Key APIs

- **`useScroll()`**: Returns scroll progress as MotionValue (0 to 1)
- **`useTransform(value, input, output)`**: Maps one range to another
- **`useInView(ref, options)`**: Returns true when element is visible
- **`style={{ x: motionValue }}`**: Use MotionValues directly in style

## What You'll Build

Two scroll-based effects:
1. A fade-in-on-scroll component (appears when you scroll to it)
2. A scroll progress indicator (fills as you scroll down the page)

## Implementation Guide

### Part 1: Fade In On Scroll

#### Step 1: Set up useInView

```tsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ref = useRef(null);
const isInView = useInView(ref, { once: true });
```

Options:
- `once: true` - Only trigger once (stays visible after)
- `amount: 0.5` - Trigger when 50% visible

#### Step 2: Use isInView to control animation

```tsx
<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
  transition={{ duration: 0.6 }}
>
```

### Part 2: Scroll Progress Indicator

#### Step 1: Get scroll progress

```tsx
import { useScroll } from 'framer-motion';

const { scrollYProgress } = useScroll();
// scrollYProgress is a MotionValue from 0 (top) to 1 (bottom)
```

#### Step 2: Use scaleX to visualize progress

```tsx
<motion.div
  style={{
    scaleX: scrollYProgress,    // Grows from 0 to 100%
    transformOrigin: 'left'      // Scale from left edge
  }}
  className="h-2 bg-blue-600"
/>
```

### Advanced: useTransform

Map scroll progress to different values:

```tsx
const { scrollYProgress } = useScroll();
const opacity = useTransform(
  scrollYProgress,
  [0, 0.5, 1],           // Input range (scroll progress)
  [1, 0.5, 0]            // Output range (opacity values)
);

<motion.div style={{ opacity }} />
```

## Common useTransform Patterns

**Parallax effect**:
```tsx
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
// Moves up as you scroll down
```

**Zoom on scroll**:
```tsx
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
```

**Rotate on scroll**:
```tsx
const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
```

## useInView Options

```tsx
useInView(ref, {
  once: true,           // Only trigger once
  amount: 0.5,          // Trigger at 50% visibility
  margin: "0px 0px -100px 0px"  // Trigger 100px before visible
})
```

## Tips

- `useInView` with `once: true` is perfect for fade-in effects
- `scrollYProgress` is always 0-1, regardless of page height
- Use `transformOrigin` with `scaleX` to control direction
- MotionValues are reactive - no need for useState or useEffect
- `useTransform` can map to any values: colors, sizes, positions
- For element-specific scroll, pass a ref to useScroll

## Success Criteria

Your implementation should have:
- A scroll progress bar at the top that fills as you scroll
- Content boxes that fade in when scrolled into view
- Smooth, performant animations (no jank)
- Progress bar scales from left to right
- Fade-in only happens once per element

## Further Reading

- [useScroll Documentation](https://www.framer.com/motion/use-scroll/)
- [useTransform Documentation](https://www.framer.com/motion/use-transform/)
- [useInView Documentation](https://www.framer.com/motion/use-in-view/)
