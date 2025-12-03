# Lesson 07: GSAP Timelines

## Concept

GSAP Timelines are powerful sequencing tools that let you chain animations together. Instead of calculating delays manually, timelines let you position animations relative to each other. You can play, pause, reverse, and scrub through the entire sequence like a video - this level of control is GSAP's superpower.

## Key APIs

- **`gsap.timeline(vars)`**: Creates a timeline
- **`.to(target, vars)`**: Add animation to timeline
- **`.from(target, vars)`**: Add from animation
- **`position parameter`**: When the animation starts
  - No parameter: After previous animation
  - `"<"`: Same time as previous
  - `">"`:** After previous completes
  - `"-=0.5"`: 0.5s before previous ends
  - `"+=0.5"`: 0.5s after previous ends
  - `"label"`: At a specific label

## What You'll Build

A text reveal animation that:
- Splits text into individual words
- Animates each word in sequence
- Uses stagger for automatic delays
- Can be replayed smoothly

This is the classic "staggered word reveal" pattern used in hero sections.

## Implementation Guide

### Step 1: Create a timeline

```tsx
import { gsap } from 'gsap';

const tl = gsap.timeline({
  paused: true,              // Don't auto-play
  defaults: {                // Apply to all animations
    duration: 0.6,
    ease: 'power2.out',
  }
});
```

### Step 2: Add animations in sequence

```tsx
tl.from(title.current, {
  opacity: 0,
  y: 30
})
.from(subtitle.current, {    // Automatically starts after previous
  opacity: 0,
  y: 20
})
.from(button.current, {
  opacity: 0,
  scale: 0.8
});
```

### Step 3: Use stagger for multiple elements

```tsx
tl.from('.word', {
  opacity: 0,
  y: 20,
  stagger: 0.1,              // 0.1s delay between each word
});
```

### Step 4: Control timeline playback

```tsx
tl.play();                   // Play forward
tl.reverse();                // Play backward
tl.pause();                  // Pause
tl.restart();                // Start from beginning
tl.progress(0.5);            // Jump to 50%
```

## Position Parameter Patterns

**Sequential (default)**:
```tsx
tl.to(box1, { x: 100 })
  .to(box2, { x: 100 })      // Starts after box1 finishes
  .to(box3, { x: 100 });     // Starts after box2 finishes
```

**Simultaneous**:
```tsx
tl.to(box1, { x: 100 })
  .to(box2, { x: 100 }, "<") // Starts with box1
  .to(box3, { x: 100 }, "<");// Starts with box1
```

**Overlap**:
```tsx
tl.to(box1, { x: 100 })
  .to(box2, { x: 100 }, "-=0.3")  // Starts 0.3s before box1 ends
  .to(box3, { x: 100 }, "-=0.3");
```

**Labeled positions**:
```tsx
tl.to(box1, { x: 100 })
  .addLabel("boxesDone")
  .to(box2, { x: 100 }, "boxesDone")  // Start at label
  .to(box3, { x: 100 }, "boxesDone+=0.5");
```

## Timeline Defaults

Save repetition with defaults:

```tsx
const tl = gsap.timeline({
  defaults: {
    duration: 0.6,
    ease: 'power2.out'
  }
});

// Now all animations inherit these
tl.from(box1, { opacity: 0 })    // duration: 0.6, ease: power2.out
  .from(box2, { opacity: 0 });   // duration: 0.6, ease: power2.out
```

## Tips

- Timelines are reusable - call `.restart()` to replay
- Use `paused: true` to prevent auto-play on creation
- Stagger is your friend for lists and grids
- Position parameter `"<"` is great for simultaneous animations
- Chain methods for cleaner code: `tl.to().to().to()`
- Use labels for complex timelines with branching
- `restart()` is better than `play(0)` - it clears state

## Common Patterns

**Staggered list**:
```tsx
tl.from('.item', {
  opacity: 0,
  x: -20,
  stagger: 0.1
});
```

**Overlapping sequence**:
```tsx
tl.from(title, { opacity: 0 })
  .from(subtitle, { opacity: 0 }, "-=0.3")
  .from(button, { opacity: 0 }, "-=0.3");
```

**Button state sequence**:
```tsx
tl.to(button, { scale: 0.9, duration: 0.1 })
  .to(button, { scale: 1.1, duration: 0.2 })
  .to(button, { scale: 1, duration: 0.1 });
```

## Success Criteria

Your word reveal should:
- Split text into individual words
- Animate words in sequence with stagger
- Feel smooth and polished
- Be replayable with a button
- Complete the whole sequence before allowing replay
- Show the power of timelines vs manual delays

## Further Reading

- [Timeline Documentation](https://greensock.com/docs/v3/GSAP/Timeline)
- [Position Parameter](https://greensock.com/position-parameter/)
- [Staggers](https://greensock.com/docs/v3/Staggers)
