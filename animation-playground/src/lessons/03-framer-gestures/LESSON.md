# Lesson 03: Gestures

## Concept

Framer Motion makes interactive animations dead simple with gesture props. No need to manage event handlers or state - just pass animation objects to props like `whileHover`, `whileTap`, and `drag`. The library handles all the complexity of tracking pointer events and animating smoothly.

## Key APIs

- **`whileHover`**: Animation that plays while hovering
- **`whileTap`**: Animation that plays while pressing/clicking
- **`drag`**: Enable dragging (`true`, `"x"`, or `"y"`)
- **`dragConstraints`**: Limit drag area
- **`dragElastic`**: Bounciness when hitting constraints
- **`whileDrag`**: Animation while dragging

## What You'll Build

An interactive card that:
- Lifts up and glows when you hover
- Shrinks slightly when you click
- Can be dragged around
- Has drag boundaries to prevent going off-screen
- Springs back smoothly

## Implementation Guide

### Step 1: Add hover animation

The `whileHover` prop defines the animation that plays while hovering:

```tsx
whileHover={{
  scale: 1.05,           // Grow 5%
  y: -10,                // Lift up 10px
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
}}
```

### Step 2: Add tap animation

The `whileTap` prop plays while the element is pressed:

```tsx
whileTap={{
  scale: 0.95            // Shrink 5% - gives tactile feedback
}}
```

### Step 3: Enable dragging

Simple! Just add the `drag` prop:

```tsx
drag                     // Enables dragging in both directions
// drag="x"              // Only horizontal
// drag="y"              // Only vertical
```

### Step 4: Add drag constraints

Prevent dragging too far:

```tsx
dragConstraints={{
  top: -100,
  left: -100,
  right: 100,
  bottom: 100
}}
```

### Step 5: Configure drag feel

Make it bouncy and fun:

```tsx
dragElastic={0.2}        // How bouncy (0-1, higher = bouncier)
dragTransition={{
  bounceStiffness: 600,  // How springy
  bounceDamping: 20      // How quickly it settles
}}
```

## Gesture Combinations

You can combine gestures for rich interactions:

```tsx
<motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  drag
  whileDrag={{ opacity: 0.7 }}
/>
```

## Transition Options

Override transition for specific gestures:

```tsx
whileHover={{ scale: 1.2 }}
transition={{
  type: "spring",
  stiffness: 300,
  damping: 20
}}
```

## Tips

- **Hover**: Subtle lifts (5-10%) feel polished, not exaggerated
- **Tap**: Shrink slightly (95%) for tactile feedback
- **Drag**: Always set constraints to prevent elements leaving viewport
- **dragElastic**: 0.2 is a good default - bouncy but not sloppy
- Combine gestures for richer interactions
- Use `cursor: 'grab'` CSS for draggable elements
- `whileDrag` is great for showing an element is being moved

## Common Patterns

**Button feedback**:
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

**Card lift on hover**:
```tsx
whileHover={{ y: -8, boxShadow: "..." }}
```

**Draggable with opacity change**:
```tsx
drag
whileDrag={{ opacity: 0.5, cursor: 'grabbing' }}
```

**Constrained slider**:
```tsx
drag="x"
dragConstraints={{ left: 0, right: 300 }}
```

## Success Criteria

Your card should:
- Lift up and glow when hovering
- Shrink slightly when clicking
- Be draggable with the mouse
- Stay within defined boundaries
- Feel smooth and responsive
- Spring back naturally when released

## Further Reading

- [Gestures Documentation](https://www.framer.com/motion/gestures/)
- [Drag Documentation](https://www.framer.com/motion/gestures/#drag)
