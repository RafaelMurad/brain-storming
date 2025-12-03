# Animation Playground

A comprehensive, hands-on learning environment for mastering **Framer Motion** and **GSAP** - the two most powerful animation libraries for modern web development.

## What Is This?

This is an interactive tutorial playground where you learn by doing. Each lesson presents animation concepts on the left with a working example and exercise playground on the right. No setup required - just open a lesson and start coding.

## Features

- **9 Progressive Lessons** - From basics to advanced techniques
- **Split-Screen Learning** - Theory on left, practice on right
- **Show Solution** - Toggle between your exercise and working example
- **Progress Tracking** - Mark lessons complete and track your journey
- **Hot Reload** - See your changes instantly
- **Arrow Key Navigation** - Quick lesson switching
- **Dark Theme** - Easy on the eyes for long learning sessions

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) and start with Lesson 01.

## Lesson Overview

### Framer Motion (Lessons 1-5)

**Lesson 01: Framer Motion Basics**
- Core concepts: `motion.div`, `animate`, `initial`, `transition`
- Build: Fade in + slide up animation
- Learn: The fundamental pattern for Framer Motion

**Lesson 02: Variants**
- Core concepts: Reusable animation states, parent-child orchestration
- Build: Staggered menu animation
- Learn: Clean, maintainable animation code

**Lesson 03: Gestures**
- Core concepts: `whileHover`, `whileTap`, `drag`
- Build: Interactive draggable card
- Learn: Make UI elements respond to user interaction

**Lesson 04: Scroll Hooks**
- Core concepts: `useScroll`, `useTransform`, `useInView`
- Build: Scroll progress bar and fade-in-on-scroll
- Learn: Create scroll-based animations

**Lesson 05: Advanced Transforms**
- Core concepts: MotionValues, chaining transforms
- Build: Sticky header that shrinks on scroll
- Learn: Complex scroll-linked effects

### GSAP (Lessons 6-8)

**Lesson 06: GSAP Basics**
- Core concepts: `gsap.to()`, `gsap.from()`, easing functions
- Build: Easing comparison demo
- Learn: GSAP's imperative animation approach

**Lesson 07: GSAP Timelines**
- Core concepts: Sequencing, stagger, position parameter
- Build: Word-by-word text reveal
- Learn: Create complex animation sequences

**Lesson 08: ScrollTrigger**
- Core concepts: `pin`, `scrub`, scroll-linked animations
- Build: Pinned section with scroll-driven animation
- Learn: Advanced scroll effects with GSAP

### Combined Power (Lesson 9)

**Lesson 09: Advanced Effects**
- Core concepts: Combining Framer Motion + GSAP
- Build: "Stranger Things" flickering neon text
- Learn: When and how to use both libraries together

## How to Use This Playground

### First-Time Learners

1. **Start at Lesson 01** - Lessons build on each other
2. **Read the left panel** - Understand the concept first
3. **Work in Exercise view** - Implement based on instructions
4. **Get stuck? Toggle Solution** - See the working code
5. **Mark complete** - Track your progress on home page

### Jump-Around Learners

- Each lesson is self-contained
- Use home page to jump to specific topics
- Reference LESSON.md files for quick API lookups

### Learning Tips

- **Type the code yourself** - Don't copy/paste the solution
- **Experiment** - Change values and see what happens
- **Read the comments** - Example files explain the WHY
- **Use the docs** - Links provided in each lesson
- **Build something** - Apply lessons to a real project

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast dev server
- **Framer Motion** - React animation library
- **GSAP** - Professional animation platform
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Markdown** - Lesson content rendering

## Project Structure

```
animation-playground/
├── src/
│   ├── lessons/
│   │   ├── 01-framer-basics/
│   │   │   ├── LESSON.md         # Tutorial content
│   │   │   ├── Example.tsx       # Working solution
│   │   │   └── Exercise.tsx      # Your workspace
│   │   ├── 02-framer-variants/
│   │   └── ... (9 lessons total)
│   ├── components/
│   │   ├── LessonLayout.tsx      # Split-screen layout
│   │   ├── Home.tsx              # Lesson list
│   │   └── MarkdownRenderer.tsx  # Renders lesson content
│   ├── types/
│   │   └── lesson.ts             # Lesson metadata
│   ├── App.tsx                   # Router setup
│   └── main.tsx
├── package.json
└── README.md
```

## Keyboard Shortcuts

- **← Left Arrow** - Previous lesson
- **→ Right Arrow** - Next lesson

## Tips for Success

### Framer Motion

- Animate transform properties (`x`, `y`, `scale`, `rotate`) for best performance
- Use variants for complex animations with multiple elements
- `useInView` with `once: true` is perfect for scroll reveals
- MotionValues don't cause re-renders - great for performance

### GSAP

- `gsap.to()` is your most-used method
- Always include `duration` - default is 0.5s
- `power2.out` is a great default easing
- Use timelines for sequences instead of calculating delays
- Don't forget to `kill()` timelines in cleanup

### Both

- GSAP excels at precise timing and complex sequences
- Framer Motion is cleaner for React state-driven animations
- They work great together - don't be afraid to combine them
- Always clean up animations in `useEffect` return

## Troubleshooting

**Animations not playing?**
- Check browser console for errors
- Ensure refs are attached correctly
- Verify imports are correct

**TypeScript errors?**
- Ref types might need explicit typing
- Use `HTMLDivElement` or `HTMLElement` for DOM refs
- Check the Example files for correct types

**Performance issues?**
- Too many simultaneous animations?
- Use transform properties instead of top/left
- Check if you're creating too many ScrollTriggers

## Going Further

After completing these lessons:

1. **Build a portfolio** - Apply animations to showcase your work
2. **Experiment with SVG** - Both libraries support SVG animations
3. **Try 3D** - Combine with Three.js for 3D effects
4. **Read the docs** - Deep dive into advanced features
5. **Study real websites** - Analyze how pros use animations

## Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- [Examples](https://www.framer.com/motion/examples/)
- [API Reference](https://www.framer.com/motion/component/)

### GSAP
- [Official Docs](https://greensock.com/docs/)
- [Ease Visualizer](https://greensock.com/ease-visualizer/)
- [Demos](https://greensock.com/showcase/)
- [Cheat Sheet](https://greensock.com/cheatsheet/)

### General
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Animation Principles](https://www.youtube.com/watch?v=uDqjIdI4bF4)

## Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request.

## License

MIT

---

**Happy animating!** Remember: Great animation is invisible - it should enhance the experience, not distract from it.
