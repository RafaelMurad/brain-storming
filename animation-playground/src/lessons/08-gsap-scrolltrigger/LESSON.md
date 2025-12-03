# Lesson 08: ScrollTrigger

## Concept

ScrollTrigger is GSAP's plugin for scroll-based animations. It's incredibly powerful - you can pin elements, scrub animations based on scroll position, trigger animations on scroll, and create complex scroll-driven experiences. Unlike Framer Motion's hooks, ScrollTrigger gives you precise control over start/end positions, markers for debugging, and seamless integration with GSAP timelines.

## Key APIs

- **`ScrollTrigger.create(vars)`**: Create a scroll trigger
- **`trigger`**: Element that triggers the animation
- **`start`**: When to start ("top bottom", "center center", etc.)
- **`end`**: When to end
- **`scrub`**: Link animation progress to scroll (true or number)
- **`pin`**: Pin element during scroll
- **`markers`**: Show debug markers

## What You'll Build

A pinned section that:
- Pins in place while you scroll
- Content animates based on scroll position
- Uses scrub for smooth scroll-linked animation
- Shows the classic "scroll-jacking" effect

## Implementation Guide

### Step 1: Import and register

```tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Step 2: Basic scroll trigger

Trigger animation when element enters viewport:

```tsx
gsap.from(element, {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: element,
    start: "top 80%",        // When top of element hits 80% down viewport
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});
```

### Step 3: Scrub animation

Link animation progress to scroll position:

```tsx
gsap.to(element, {
  x: 400,
  scrollTrigger: {
    trigger: element,
    start: "top top",
    end: "bottom top",
    scrub: true,             // Animation progress = scroll progress
  }
});
```

### Step 4: Pin element

Keep element fixed during scroll:

```tsx
ScrollTrigger.create({
  trigger: section,
  pin: true,
  start: "top top",
  end: "+=500",              // Pin for 500px of scrolling
});
```

## Start/End Position Syntax

Format: `"[trigger position] [scroller position]"`

**Common patterns**:
- `"top bottom"` - Trigger top hits viewport bottom
- `"top top"` - Trigger top hits viewport top
- `"center center"` - Trigger center hits viewport center
- `"bottom top"` - Trigger bottom hits viewport top

**With offsets**:
- `"top 80%"` - Trigger top hits 80% down viewport
- `"top top+=100"` - 100px after trigger top hits viewport top
- `"+=500"` - 500px relative to start

## toggleActions

Controls what happens at different scroll points:

```tsx
toggleActions: "onEnter onLeave onEnterBack onLeaveBack"
```

Values: `play`, `pause`, `resume`, `reset`, `restart`, `complete`, `reverse`, `none`

**Common patterns**:
```tsx
"play none none reverse"    // Play in, reverse out
"play reset play reset"     // Always replay
"play complete none reset"  // Play in, snap to end
```

## Scrub Options

- `scrub: true` - Instant link to scroll (can feel snappy)
- `scrub: 1` - 1 second smooth catch-up (feels polished)
- `scrub: 0.5` - 0.5 second catch-up (snappier)

## Tips

- Always `gsap.registerPlugin(ScrollTrigger)` first
- Use `markers: true` during development to debug positions
- `scrub: 1` feels better than `scrub: true` for most cases
- Remember to kill ScrollTriggers in cleanup
- Start/end positions are super important - use markers to dial them in
- Pin works best with full-height sections
- Combine ScrollTrigger with timelines for complex sequences

## Common Patterns

**Fade in on scroll**:
```tsx
scrollTrigger: {
  trigger: element,
  start: "top 80%",
  toggleActions: "play none none reverse"
}
```

**Pinned section**:
```tsx
scrollTrigger: {
  trigger: section,
  pin: true,
  start: "top top",
  end: "+=1000",
  scrub: 1
}
```

**Horizontal scroll**:
```tsx
gsap.to(container, {
  x: -scrollWidth,
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    end: () => "+=" + scrollWidth
  }
});
```

## Success Criteria

Your implementation should:
- Pin a section while scrolling
- Animate content based on scroll position
- Use scrub for smooth scroll-linked animation
- Feel polished and intentional
- Unpin after animation completes
- Clean up properly on unmount

## Further Reading

- [ScrollTrigger Documentation](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [ScrollTrigger Demos](https://greensock.com/st-demos/)
- [Start/End Positioning](https://greensock.com/docs/v3/Plugins/ScrollTrigger/start)
