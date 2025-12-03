export interface Lesson {
  id: string;
  number: number;
  title: string;
  description: string;
  path: string;
}

export const lessons: Lesson[] = [
  {
    id: '01-framer-basics',
    number: 1,
    title: 'Framer Motion Basics',
    description: 'Learn fundamental motion.div animations with the animate prop',
    path: '/lesson/01-framer-basics',
  },
  {
    id: '02-framer-variants',
    number: 2,
    title: 'Variants',
    description: 'Master reusable animation states and orchestration',
    path: '/lesson/02-framer-variants',
  },
  {
    id: '03-framer-gestures',
    number: 3,
    title: 'Gestures',
    description: 'Build interactive experiences with hover, tap, and drag',
    path: '/lesson/03-framer-gestures',
  },
  {
    id: '04-framer-scroll',
    number: 4,
    title: 'Scroll Hooks',
    description: 'Create scroll-based animations with useScroll and useTransform',
    path: '/lesson/04-framer-scroll',
  },
  {
    id: '05-framer-transforms',
    number: 5,
    title: 'Advanced Transforms',
    description: 'Chain transforms and work with motion values',
    path: '/lesson/05-framer-transforms',
  },
  {
    id: '06-gsap-basics',
    number: 6,
    title: 'GSAP Basics',
    description: 'Get started with GSAP tweens and easing functions',
    path: '/lesson/06-gsap-basics',
  },
  {
    id: '07-gsap-timelines',
    number: 7,
    title: 'GSAP Timelines',
    description: 'Create complex sequenced animations',
    path: '/lesson/07-gsap-timelines',
  },
  {
    id: '08-gsap-scrolltrigger',
    number: 8,
    title: 'ScrollTrigger',
    description: 'Build scroll-linked GSAP animations',
    path: '/lesson/08-gsap-scrolltrigger',
  },
  {
    id: '09-advanced-effects',
    number: 9,
    title: 'Advanced Effects',
    description: 'Combine Framer Motion and GSAP for complex effects',
    path: '/lesson/09-advanced-effects',
  },
];
