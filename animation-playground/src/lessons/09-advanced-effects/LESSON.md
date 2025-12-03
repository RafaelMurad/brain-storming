# Lesson 09: Advanced Effects

## Concept

You've learned Framer Motion and GSAP separately - now it's time to combine them. Each library has strengths: Framer Motion excels at React-integrated animations and gestures, while GSAP dominates complex sequencing and precise timing. By using both together, you can create sophisticated effects that would be difficult with either alone.

## What You'll Build

A "Stranger Things" style glitch effect:
- Text that flickers randomly like a broken neon sign
- Uses GSAP for rapid, unpredictable opacity changes
- Uses Framer Motion for smooth color shifts
- Combines random timing with smooth animations
- Shows how to orchestrate multiple animation systems

## Combining Libraries: When and Why

**Use Framer Motion when:**
- Animating React components and state
- Interactive gestures (hover, tap, drag)
- Scroll-based effects with hooks
- Declarative animations triggered by state changes

**Use GSAP when:**
- Complex multi-step sequences
- Precise timing control
- Rapid, repetitive animations (like flickers)
- When you need timeline control (play, pause, reverse)
- Maximum performance for heavy animations

**Use both when:**
- You need GSAP's sequencing with React's reactivity
- Combining rapid effects (GSAP) with smooth transitions (Framer)
- Building complex UI with rich interactions

## Implementation Guide

### Step 1: Set up random flicker with GSAP

```tsx
import { gsap } from 'gsap';

const flicker = () => {
  const tl = gsap.timeline({ repeat: -1 });  // Infinite loop

  // Create random opacity flickers
  for (let i = 0; i < 20; i++) {
    tl.to(element, {
      opacity: Math.random() > 0.5 ? 0.3 : 1,
      duration: Math.random() * 0.1,
    });
  }
};
```

### Step 2: Add Framer Motion for smooth color shift

```tsx
import { motion } from 'framer-motion';

<motion.div
  animate={{
    color: ['#ff0000', '#ff6600', '#ff0000'],  // Red to orange and back
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
```

### Step 3: Combine both effects

```tsx
<motion.h1
  ref={textRef}
  animate={{ color: ['#ff0000', '#ff6600', '#ff0000'] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Flickering Text
</motion.h1>

useEffect(() => {
  // GSAP controls opacity flicker
  const tl = gsap.timeline({ repeat: -1 });
  // ... flicker code
}, []);
```

## Advanced Patterns

**Staggered glitch effect**:
```tsx
const letters = text.split('');
letters.forEach((letter, i) => {
  gsap.to(letterRefs[i], {
    y: () => Math.random() * 20 - 10,
    repeat: -1,
    yoyo: true,
    duration: 0.1 + Math.random() * 0.2,
  });
});
```

**Combining with scroll**:
```tsx
const { scrollYProgress } = useScroll();

useEffect(() => {
  gsap.to(element, {
    rotationX: 360,
    scrollTrigger: {
      scrub: 1,
    }
  });
}, []);
```

## Managing Both Libraries

**Cleanup pattern**:
```tsx
useEffect(() => {
  const tl = gsap.timeline();
  // ... GSAP animations

  return () => {
    tl.kill();                           // Kill GSAP
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

**Sharing refs**:
```tsx
const ref = useRef(null);

// Both can use the same ref
<motion.div ref={ref} whileHover={{ scale: 1.1 }}>

useEffect(() => {
  gsap.to(ref.current, { rotation: 360 });
}, []);
```

## Tips

- GSAP and Framer Motion play nicely together - they don't conflict
- Use separate refs if animations might interfere
- GSAP has better performance for rapid, repetitive animations
- Framer Motion is cleaner for React state-driven animations
- Both can animate the same element simultaneously
- Remember to clean up BOTH libraries in useEffect return
- Test performance - complex combinations can be heavy

## Success Criteria

Your glitch effect should:
- Flicker rapidly and randomly (GSAP)
- Shift colors smoothly (Framer Motion)
- Look unstable and "broken" like a neon sign
- Run infinitely without performance issues
- Demonstrate clear benefit of combining libraries
- Be controllable (start/stop)

## Further Exploration

Once you've mastered this:
- Try morphing SVG paths (GSAP + Framer Motion)
- Create cursor-following effects
- Build scroll-jacking with pinned sections
- Experiment with Canvas animations
- Combine with Three.js for 3D effects

## Further Reading

- [Combining Libraries](https://greensock.com/react/)
- [Advanced GSAP Techniques](https://greensock.com/docs/v3/AdvancedGuide)
- [Framer Motion Advanced](https://www.framer.com/motion/guide-advanced/)
