# Lesson 05: Advanced Transforms

## Concept

MotionValues are reactive references that power Framer Motion's performance. They update without causing React re-renders, making complex animations silky smooth. Combining `useScroll`, `useTransform`, and `useMotionValue` lets you chain transformations and create sophisticated scroll-based effects like sticky headers that shrink.

## Key APIs

- **`useMotionValue(initialValue)`**: Creates a reactive value
- **`useTransform(value, inputRange, outputRange)`**: Maps values
- **`scrollY`**: Pixel-based scroll position
- **`scrollYProgress`**: Progress-based (0-1)
- **Chain transforms**: Pass MotionValue into another useTransform

## What You'll Build

A sticky header that:
- Stays at the top as you scroll
- Shrinks in height when you scroll down
- Fades the background as you scroll
- Changes text size smoothly

This is the classic "sticky header shrink" pattern used by many modern websites.

## Implementation Guide

### Step 1: Get scroll values

```tsx
const { scrollY } = useScroll();
// scrollY is actual pixels scrolled (0, 100, 500, etc.)
```

### Step 2: Transform scroll to height

Map scroll distance to header height:

```tsx
const headerHeight = useTransform(
  scrollY,              // Input value
  [0, 100],             // Input range (scroll 0-100px)
  [80, 50]              // Output range (80px -> 50px)
);
```

### Step 3: Transform scroll to opacity

```tsx
const backgroundOpacity = useTransform(
  scrollY,
  [0, 100],
  [0, 1]                // Start transparent, become solid
);
```

### Step 4: Apply to style

```tsx
<motion.header
  style={{
    height: headerHeight,
    backgroundColor: useTransform(
      backgroundOpacity,
      (opacity) => `rgba(0, 0, 0, ${opacity})`
    )
  }}
/>
```

## Chaining Transforms

You can pass one MotionValue into another transform:

```tsx
const scrollYProgress = useScroll().scrollYProgress;
const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
const scale = useTransform(rotate, [0, 180], [1, 2]);
// scale depends on rotate, which depends on scroll
```

## Transform with Functions

Transform to complex values:

```tsx
const backgroundColor = useTransform(
  scrollYProgress,
  [0, 0.5, 1],
  ["#ff0000", "#00ff00", "#0000ff"]
);

const rounded = useTransform(
  scrollY,
  (value) => Math.round(value / 10) * 10
);
```

## Common Patterns

**Sticky header shrink**:
```tsx
const height = useTransform(scrollY, [0, 100], [80, 50]);
const fontSize = useTransform(scrollY, [0, 100], [24, 18]);
```

**Parallax layers**:
```tsx
const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
```

**Fade on scroll**:
```tsx
const opacity = useTransform(scrollY, [0, 200], [1, 0]);
```

## Tips

- Use `scrollY` for pixel-based triggers (first 100px of scroll)
- Use `scrollYProgress` for percentage-based (entire page)
- MotionValues don't cause re-renders - super performant
- Multiple transforms can share the same source value
- Clamp values to prevent weird edge cases
- Test your scroll ranges - mobile viewports are smaller

## Success Criteria

Your sticky header should:
- Stay fixed at the top of the viewport
- Shrink from 80px to 50px as you scroll down
- Background fades from transparent to solid
- Text size reduces smoothly
- Feel buttery smooth with no jank
- Work whether scrolling fast or slow

## Further Reading

- [MotionValue Documentation](https://www.framer.com/motion/motionvalue/)
- [useTransform Documentation](https://www.framer.com/motion/use-transform/)
- [Scroll-linked Animations](https://www.framer.com/motion/scroll-animations/)
