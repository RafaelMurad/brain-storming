# Lesson 06: GSAP Basics

## Concept

GSAP (GreenSock Animation Platform) is the industry-standard animation library. Unlike Framer Motion's declarative approach, GSAP uses imperative animations - you tell it exactly what to animate and when. GSAP excels at complex sequences, precise timing control, and has the most powerful easing functions in the business.

## Key APIs

- **`gsap.to(target, vars)`**: Animate FROM current TO specified values
- **`gsap.from(target, vars)`**: Animate FROM specified values TO current
- **`gsap.fromTo(target, from, to)`**: Specify both start and end
- **`duration`**: Animation length in seconds
- **`ease`**: Easing function (power1, power2, elastic, bounce, etc.)
- **`delay`**: Wait before starting

## What You'll Build

A comparison of GSAP's easing functions:
- Multiple boxes that animate on button click
- Each box uses a different easing function
- Visual demonstration of how easing affects feel
- Learn when to use each ease type

## Implementation Guide

### Step 1: Set up refs

GSAP animates DOM elements, so we need refs:

```tsx
import { useRef } from 'react';
import { gsap } from 'gsap';

const boxRef = useRef<HTMLDivElement>(null);
```

### Step 2: Use gsap.to() for basic animation

Animate TO target values from current state:

```tsx
const animate = () => {
  gsap.to(boxRef.current, {
    x: 200,                    // Move 200px right
    duration: 1,               // Takes 1 second
    ease: 'power2.out',        // Easing function
  });
};
```

### Step 3: Try different methods

**gsap.from()** - Animate FROM values to current:
```tsx
gsap.from(boxRef.current, {
  opacity: 0,                  // Starts invisible
  duration: 1,                 // Ends at current opacity (1)
});
```

**gsap.fromTo()** - Full control:
```tsx
gsap.fromTo(boxRef.current,
  { x: -100, opacity: 0 },     // From values
  { x: 0, opacity: 1, duration: 1 }  // To values
);
```

### Step 4: Explore easing functions

GSAP has incredible easing options:

```tsx
ease: 'none'           // Linear (constant speed)
ease: 'power1.out'     // Gentle deceleration
ease: 'power2.out'     // Stronger deceleration
ease: 'power4.out'     // Very strong deceleration
ease: 'back.out'       // Overshoots then settles
ease: 'elastic.out'    // Bouncy spring effect
ease: 'bounce.out'     // Bounces at the end
```

## Easing Function Guide

**power1-4**: Increasing strength of acceleration/deceleration
- `.in` - Starts slow, ends fast
- `.out` - Starts fast, ends slow (most common)
- `.inOut` - Slow start and end

**back**: Pulls back before moving forward
- Great for playful, energetic UIs
- `.out` overshoots the target then settles

**elastic**: Spring-like bounce
- Very playful, can feel toy-like
- Use sparingly in professional UIs

**bounce**: Bouncing ball physics
- Fun but can feel gimmicky
- Best for game-like interactions

## Common Patterns

**Fade in element**:
```tsx
gsap.from(ref.current, {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power2.out'
});
```

**Button press feedback**:
```tsx
gsap.to(ref.current, {
  scale: 0.95,
  duration: 0.1,
  ease: 'power2.out'
});
```

**Smooth slide**:
```tsx
gsap.to(ref.current, {
  x: 300,
  duration: 1,
  ease: 'power3.inOut'
});
```

## Tips

- GSAP requires refs - can't animate React state directly
- Call GSAP in event handlers (onClick) or useEffect
- `power2.out` is a great default - smooth and natural
- `.out` easings feel best for most UI animations
- `elastic` and `bounce` are fun but use sparingly
- GSAP's coordinate system: +x is right, +y is down
- Always include `duration` - default is 0.5s

## Success Criteria

Your demo should:
- Have multiple boxes with different easing functions
- Animate when you click a button
- Show clear visual difference between easing types
- Reset properly so you can replay
- Help you understand when to use each easing
- Feel smooth and professional

## Further Reading

- [GSAP Documentation](https://greensock.com/docs/)
- [Ease Visualizer](https://greensock.com/ease-visualizer/)
- [GSAP Cheat Sheet](https://greensock.com/cheatsheet/)
