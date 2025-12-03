# Lesson 02: Variants

## Concept

Variants are named animation states that make your code cleaner and enable powerful orchestration. Instead of defining animations inline, you create a reusable object. The real magic happens with parent-child relationships - when a parent animates to a variant state, all children automatically animate to their matching variant.

## Key APIs

- **`variants` prop**: Object containing named animation states
- **Parent-child orchestration**: Children inherit variant state from parents
- **`staggerChildren`**: Delay between each child's animation start
- **`delayChildren`**: Delay before first child starts
- **`when`**: Control whether children animate before or after parent

## What You'll Build

A staggered list animation where items appear one after another:
- A container fades in first
- List items animate in sequence with a stagger effect
- Each item fades in and slides up
- Classic pattern for menu animations

## Implementation Guide

### Step 1: Define container variants

Create an object with named states (we'll use "hidden" and "visible"):

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 0.1s delay between each child
      delayChildren: 0.2,    // Wait 0.2s before first child
    }
  }
};
```

### Step 2: Define item variants

Items will automatically receive the variant state from their parent:

```tsx
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};
```

### Step 3: Apply to parent

The parent controls which state is active:

```tsx
<motion.ul
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
```

### Step 4: Apply to children

Children just need the variants - they inherit the state from parent:

```tsx
<motion.li variants={itemVariants}>
  Item content
</motion.li>
```

## Orchestration Options

In the container's transition:

- **`staggerChildren: 0.1`**: Each child starts 0.1s after the previous
- **`delayChildren: 0.2`**: Wait 0.2s before any children animate
- **`staggerDirection: 1`**: Animate forwards (use -1 for reverse)
- **`when: "beforeChildren"`**: Parent finishes before children start
- **`when: "afterChildren"`**: Children finish before parent starts

## Tips

- Variant names can be anything - "hidden"/"visible", "closed"/"open", etc.
- Children automatically inherit parent variant state - no need to manually trigger
- Stagger is perfect for lists, grids, and menus
- Start with `staggerChildren: 0.1` - it's a good default
- You can nest variants multiple levels deep
- Each variant can have its own transition settings

## Common Patterns

**Menu animation**:
```tsx
staggerChildren: 0.05  // Quick succession
```

**Hero section elements**:
```tsx
staggerChildren: 0.15  // More dramatic
delayChildren: 0.3     // Wait for page load
```

**Grid items**:
```tsx
staggerChildren: 0.08  // Smooth wave effect
```

## Success Criteria

When you're done:
- The container should fade in
- List items should appear one after another
- Each item should slide in from the left and fade in
- The stagger effect should feel smooth and polished
- Refreshing the page should replay the animation

## Further Reading

- [Framer Motion Variants Docs](https://www.framer.com/motion/animation/#variants)
- [Orchestration Examples](https://www.framer.com/motion/animation/#orchestration)
