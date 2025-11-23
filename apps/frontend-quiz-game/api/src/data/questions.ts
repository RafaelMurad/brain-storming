import { Question, Category, Difficulty } from '../types';

// Pre-generated questions based on official documentation
// In production, these would be generated/refreshed by AI from latest docs

export const questions: Question[] = [
  // React Questions
  {
    id: 'react-001',
    category: 'react',
    difficulty: 'beginner',
    question: 'What hook should you use to perform side effects in a React functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1,
    explanation: 'useEffect is designed for side effects like data fetching, subscriptions, or DOM manipulation. It runs after render and can optionally clean up.',
    source: 'React Documentation - useEffect',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'react-002',
    category: 'react',
    difficulty: 'intermediate',
    question: 'What is the correct way to update state based on the previous state?',
    code: `// Which is correct?
const [count, setCount] = useState(0);

// A
setCount(count + 1);

// B
setCount(prev => prev + 1);`,
    options: [
      'Option A - Direct value',
      'Option B - Functional update',
      'Both are equivalent',
      'Neither is correct',
    ],
    correctAnswer: 1,
    explanation: 'Functional updates (Option B) are the correct approach when the new state depends on the previous state. This ensures you always work with the latest state value, especially important in async scenarios.',
    source: 'React Documentation - useState',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'react-003',
    category: 'react',
    difficulty: 'advanced',
    question: 'What does React.memo() do and when should you use it?',
    options: [
      'Memoizes expensive calculations inside a component',
      'Prevents re-renders when props haven\'t changed',
      'Caches API responses',
      'Creates a ref to a DOM element',
    ],
    correctAnswer: 1,
    explanation: 'React.memo() is a higher-order component that memoizes the rendered output and skips re-rendering if props are shallowly equal. Use it for components that render often with the same props.',
    source: 'React Documentation - memo',
    points: 35,
    timeLimit: 45,
  },
  {
    id: 'react-004',
    category: 'react',
    difficulty: 'expert',
    question: 'In React 18, what is the purpose of useTransition?',
    options: [
      'Animating component transitions',
      'Marking state updates as non-urgent to keep UI responsive',
      'Transitioning between routes',
      'Managing async data loading states',
    ],
    correctAnswer: 1,
    explanation: 'useTransition lets you mark state updates as transitions, which are non-urgent updates. React can interrupt them to handle more urgent updates, keeping the UI responsive during expensive re-renders.',
    source: 'React 18 Documentation - useTransition',
    points: 50,
    timeLimit: 60,
  },

  // TypeScript Questions
  {
    id: 'ts-001',
    category: 'typescript',
    difficulty: 'beginner',
    question: 'What is the difference between `interface` and `type` in TypeScript?',
    options: [
      'They are completely identical',
      'Interfaces can be extended/merged, types are more flexible for unions',
      'Types are only for primitives',
      'Interfaces are deprecated',
    ],
    correctAnswer: 1,
    explanation: 'While similar, interfaces support declaration merging and extension with `extends`. Types are more flexible for unions, intersections, and mapped types. Both can describe object shapes.',
    source: 'TypeScript Documentation - Interfaces vs Types',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'ts-002',
    category: 'typescript',
    difficulty: 'intermediate',
    question: 'What does the `infer` keyword do in TypeScript?',
    code: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;`,
    options: [
      'Declares a new type variable',
      'Infers a type within a conditional type',
      'Creates an interface from a class',
      'Imports types from another module',
    ],
    correctAnswer: 1,
    explanation: 'The `infer` keyword is used within conditional types to infer (extract) a type from another type. In this example, it extracts the return type R from a function type.',
    source: 'TypeScript Documentation - Conditional Types',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'ts-003',
    category: 'typescript',
    difficulty: 'advanced',
    question: 'What is a discriminated union in TypeScript?',
    code: `type Result =
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };`,
    options: [
      'A union that discriminates against certain types',
      'A union with a common property used to narrow types',
      'A union that only accepts primitive types',
      'A deprecated TypeScript feature',
    ],
    correctAnswer: 1,
    explanation: 'A discriminated union uses a common property (discriminant) to differentiate between union members. TypeScript can narrow the type based on checking this property.',
    source: 'TypeScript Documentation - Narrowing',
    points: 35,
    timeLimit: 45,
  },
  {
    id: 'ts-004',
    category: 'typescript',
    difficulty: 'expert',
    question: 'What does `satisfies` operator do in TypeScript 4.9+?',
    code: `const config = {
  api: 'https://api.example.com',
  timeout: 5000,
} satisfies Config;`,
    options: [
      'Validates a value matches a type while preserving literal types',
      'Converts a value to a specific type',
      'Creates a type guard',
      'Asserts a value is not null',
    ],
    correctAnswer: 0,
    explanation: 'The `satisfies` operator validates that a value conforms to a type while preserving the most specific (literal) type of the value. Unlike type annotation, it keeps "https://api.example.com" instead of widening to string.',
    source: 'TypeScript 4.9 Documentation - satisfies',
    points: 50,
    timeLimit: 60,
  },

  // CSS Questions
  {
    id: 'css-001',
    category: 'css',
    difficulty: 'beginner',
    question: 'What is the difference between `margin` and `padding`?',
    options: [
      'Margin is inside the border, padding is outside',
      'Padding is inside the border, margin is outside',
      'They are the same thing',
      'Margin only works horizontally',
    ],
    correctAnswer: 1,
    explanation: 'Padding is the space between the content and the border (inside). Margin is the space outside the border, creating distance from other elements.',
    source: 'MDN - CSS Box Model',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'css-002',
    category: 'css',
    difficulty: 'intermediate',
    question: 'What does `display: grid` with `place-items: center` do?',
    options: [
      'Creates a flex container with centered items',
      'Creates a grid with items centered both horizontally and vertically',
      'Places items at the center of the page',
      'Creates a centered grid track',
    ],
    correctAnswer: 1,
    explanation: 'place-items: center is a shorthand for align-items: center and justify-items: center in Grid, centering items both horizontally and vertically within their grid cells.',
    source: 'MDN - CSS Grid Layout',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'css-003',
    category: 'css',
    difficulty: 'advanced',
    question: 'What is the CSS `:has()` selector used for?',
    code: `/* Example */
article:has(img) { }`,
    options: [
      'Selects elements that contain a specific attribute',
      'Selects a parent element based on its children',
      'Selects elements that have a specific class',
      'Checks if an element has content',
    ],
    correctAnswer: 1,
    explanation: 'The :has() relational pseudo-class selects elements based on their descendants. It\'s often called the "parent selector" because it can style a parent based on what children it contains.',
    source: 'MDN - :has() pseudo-class',
    points: 35,
    timeLimit: 45,
  },
  {
    id: 'css-004',
    category: 'css',
    difficulty: 'expert',
    question: 'What does `container-type: inline-size` enable in CSS?',
    options: [
      'Responsive images based on container',
      'Container queries based on inline (width) dimension',
      'Automatic container sizing',
      'Inline flexbox behavior',
    ],
    correctAnswer: 1,
    explanation: 'container-type: inline-size establishes a containment context, enabling @container queries that respond to the container\'s inline size (width in horizontal writing modes) rather than the viewport.',
    source: 'MDN - CSS Container Queries',
    points: 50,
    timeLimit: 60,
  },

  // JavaScript Questions
  {
    id: 'js-001',
    category: 'javascript',
    difficulty: 'beginner',
    question: 'What is the difference between `let` and `const`?',
    options: [
      'let is for functions, const is for variables',
      'const cannot be reassigned, let can be',
      'let is older syntax, const is newer',
      'There is no difference',
    ],
    correctAnswer: 1,
    explanation: 'const creates a binding that cannot be reassigned (though objects/arrays it references can still be mutated). let allows reassignment. Both are block-scoped.',
    source: 'MDN - const, let',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'js-002',
    category: 'javascript',
    difficulty: 'intermediate',
    question: 'What does the nullish coalescing operator (??) do?',
    code: `const value = null ?? 'default';`,
    options: [
      'Returns right side if left is falsy',
      'Returns right side only if left is null or undefined',
      'Throws an error if left is null',
      'Converts null to undefined',
    ],
    correctAnswer: 1,
    explanation: 'The ?? operator returns its right-hand operand only when the left is null or undefined (nullish). Unlike ||, it doesn\'t trigger for other falsy values like 0 or "".',
    source: 'MDN - Nullish coalescing operator',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'js-003',
    category: 'javascript',
    difficulty: 'advanced',
    question: 'What is the output of this code?',
    code: `const arr = [1, 2, 3];
const result = arr.flatMap(x => [x, x * 2]);
console.log(result);`,
    options: [
      '[[1, 2], [2, 4], [3, 6]]',
      '[1, 2, 2, 4, 3, 6]',
      '[1, 2, 3, 2, 4, 6]',
      'Error: flatMap is not a function',
    ],
    correctAnswer: 1,
    explanation: 'flatMap() first maps each element using the function, then flattens the result by one level. It\'s equivalent to map().flat(1), so [[1,2], [2,4], [3,6]] becomes [1, 2, 2, 4, 3, 6].',
    source: 'MDN - Array.prototype.flatMap()',
    points: 35,
    timeLimit: 60,
  },
  {
    id: 'js-004',
    category: 'javascript',
    difficulty: 'expert',
    question: 'What does `Object.groupBy()` do in ES2024?',
    code: `const items = [
  { type: 'fruit', name: 'apple' },
  { type: 'vegetable', name: 'carrot' },
  { type: 'fruit', name: 'banana' },
];
Object.groupBy(items, item => item.type);`,
    options: [
      'Sorts objects by a property',
      'Groups array items into an object by callback return value',
      'Merges objects with the same key',
      'Creates a Map grouped by type',
    ],
    correctAnswer: 1,
    explanation: 'Object.groupBy() groups iterable elements by the string returned from the callback, returning an object where keys are group names and values are arrays of items in each group.',
    source: 'MDN - Object.groupBy()',
    points: 50,
    timeLimit: 60,
  },

  // Next.js Questions
  {
    id: 'nextjs-001',
    category: 'nextjs',
    difficulty: 'beginner',
    question: 'In Next.js App Router, what does a `page.tsx` file represent?',
    options: [
      'A reusable component',
      'A route that is publicly accessible',
      'A server action',
      'A middleware function',
    ],
    correctAnswer: 1,
    explanation: 'In the App Router, page.tsx files define the unique UI for a route segment. A page.tsx in app/about/ creates the /about route.',
    source: 'Next.js Documentation - Pages',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'nextjs-002',
    category: 'nextjs',
    difficulty: 'intermediate',
    question: 'What is the difference between Server and Client Components in Next.js 13+?',
    options: [
      'Server Components run on the server, Client Components only in the browser',
      'Server Components can\'t use hooks, Client Components can',
      'Both of the above are true',
      'There is no difference in App Router',
    ],
    correctAnswer: 2,
    explanation: 'Server Components render on the server and can\'t use hooks or browser APIs. Client Components (marked with "use client") run in the browser and support interactivity. Both statements are correct.',
    source: 'Next.js Documentation - Server and Client Components',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'nextjs-003',
    category: 'nextjs',
    difficulty: 'advanced',
    question: 'What does `generateStaticParams` do in Next.js App Router?',
    options: [
      'Generates query parameters for API routes',
      'Pre-renders dynamic routes at build time',
      'Creates static assets',
      'Validates route parameters',
    ],
    correctAnswer: 1,
    explanation: 'generateStaticParams is used with dynamic route segments to statically generate routes at build time. It returns an array of params objects that define which paths to pre-render.',
    source: 'Next.js Documentation - generateStaticParams',
    points: 35,
    timeLimit: 45,
  },
  {
    id: 'nextjs-004',
    category: 'nextjs',
    difficulty: 'expert',
    question: 'How do Server Actions work in Next.js 14?',
    code: `'use server'
async function submitForm(formData: FormData) {
  // ...
}`,
    options: [
      'They create API endpoints automatically',
      'They are async functions that run on the server, callable from client',
      'They replace getServerSideProps',
      'They are client-side form handlers',
    ],
    correctAnswer: 1,
    explanation: 'Server Actions are async functions marked with "use server" that execute on the server. They can be called directly from Client Components, enabling forms and mutations without manual API routes.',
    source: 'Next.js Documentation - Server Actions',
    points: 50,
    timeLimit: 60,
  },

  // Vue Questions
  {
    id: 'vue-001',
    category: 'vue',
    difficulty: 'beginner',
    question: 'In Vue 3 Composition API, what is `ref()` used for?',
    options: [
      'Creating a reference to a DOM element',
      'Creating a reactive reference that can hold any value',
      'Referencing another component',
      'Creating a computed property',
    ],
    correctAnswer: 1,
    explanation: 'ref() creates a reactive reference that can hold any value type. Access the value with .value in JavaScript, but templates auto-unwrap it.',
    source: 'Vue.js Documentation - Reactivity: ref()',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'vue-002',
    category: 'vue',
    difficulty: 'intermediate',
    question: 'What is the difference between `ref` and `reactive` in Vue 3?',
    options: [
      'ref is for primitives, reactive is for objects only',
      'reactive is deprecated in Vue 3',
      'ref wraps values and needs .value, reactive makes objects deeply reactive',
      'They are identical',
    ],
    correctAnswer: 2,
    explanation: 'ref() wraps any value and requires .value access. reactive() only works with objects and makes them deeply reactive without needing .value. ref is more flexible, reactive has cleaner syntax for objects.',
    source: 'Vue.js Documentation - Reactivity Fundamentals',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'vue-003',
    category: 'vue',
    difficulty: 'advanced',
    question: 'What does `defineModel()` do in Vue 3.4+?',
    options: [
      'Defines a data model for forms',
      'Creates a two-way binding prop macro for components',
      'Generates TypeScript models',
      'Defines reactive state',
    ],
    correctAnswer: 1,
    explanation: 'defineModel() is a compiler macro that simplifies v-model implementation in components. It declares a prop and corresponding emit in one line, returning a ref that syncs with the parent.',
    source: 'Vue 3.4 Documentation - defineModel',
    points: 35,
    timeLimit: 45,
  },

  // Testing Questions
  {
    id: 'testing-001',
    category: 'testing',
    difficulty: 'beginner',
    question: 'What is the purpose of `describe` and `it` in testing frameworks?',
    options: [
      'describe groups tests, it defines individual test cases',
      'describe runs tests, it skips tests',
      'They are interchangeable',
      'describe is for unit tests, it is for integration tests',
    ],
    correctAnswer: 0,
    explanation: 'describe() creates a test suite (group of related tests), while it() (or test()) defines individual test cases. This creates readable, organized test structures.',
    source: 'Jest Documentation - Organizing Tests',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'testing-002',
    category: 'testing',
    difficulty: 'intermediate',
    question: 'What does `toMatchSnapshot()` do in Jest?',
    options: [
      'Compares two objects for equality',
      'Saves and compares output against a stored snapshot',
      'Takes a screenshot of the component',
      'Matches regex patterns',
    ],
    correctAnswer: 1,
    explanation: 'toMatchSnapshot() serializes a value, saves it to a file on first run, then compares against that saved snapshot on subsequent runs. Useful for detecting unexpected UI changes.',
    source: 'Jest Documentation - Snapshot Testing',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'testing-003',
    category: 'testing',
    difficulty: 'advanced',
    question: 'What is the Testing Library philosophy summed up as?',
    options: [
      '"Test implementation details"',
      '"The more your tests resemble how software is used, the more confidence they give"',
      '"Mock everything"',
      '"100% code coverage"',
    ],
    correctAnswer: 1,
    explanation: 'Testing Library promotes testing from the user\'s perspective, avoiding implementation details. Tests should interact with components like users do, selecting by role, text, or label.',
    source: 'Testing Library Documentation - Guiding Principles',
    points: 35,
    timeLimit: 45,
  },

  // Performance Questions
  {
    id: 'perf-001',
    category: 'performance',
    difficulty: 'beginner',
    question: 'What is Largest Contentful Paint (LCP)?',
    options: [
      'Time to first byte',
      'Time until the largest content element is visible',
      'Time until all content loads',
      'Time until JavaScript executes',
    ],
    correctAnswer: 1,
    explanation: 'LCP measures when the largest content element (image, video, or text block) becomes visible in the viewport. Good LCP is under 2.5 seconds.',
    source: 'web.dev - Largest Contentful Paint',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'perf-002',
    category: 'performance',
    difficulty: 'intermediate',
    question: 'What is code splitting and why is it useful?',
    options: [
      'Splitting code into multiple files for organization',
      'Loading code on demand to reduce initial bundle size',
      'Separating CSS from JavaScript',
      'Dividing tests into separate files',
    ],
    correctAnswer: 1,
    explanation: 'Code splitting breaks your bundle into smaller chunks loaded on demand. This reduces initial load time by only sending code needed for the current view. React.lazy() and dynamic imports enable this.',
    source: 'web.dev - Code Splitting',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'perf-003',
    category: 'performance',
    difficulty: 'advanced',
    question: 'What does `Interaction to Next Paint (INP)` measure?',
    options: [
      'Time between page loads',
      'Responsiveness to user interactions throughout page lifecycle',
      'Time to render the next frame',
      'Network latency',
    ],
    correctAnswer: 1,
    explanation: 'INP measures overall page responsiveness by observing all interactions and reporting a value near the worst latency. Good INP is under 200ms. It replaced FID as a Core Web Vital in 2024.',
    source: 'web.dev - Interaction to Next Paint',
    points: 35,
    timeLimit: 45,
  },

  // Accessibility Questions
  {
    id: 'a11y-001',
    category: 'accessibility',
    difficulty: 'beginner',
    question: 'What is the purpose of `alt` text on images?',
    options: [
      'SEO optimization only',
      'Describes the image for screen readers and when images fail to load',
      'Styling purposes',
      'Adding tooltips',
    ],
    correctAnswer: 1,
    explanation: 'Alt text provides a text alternative for images, essential for screen reader users to understand image content. It also displays when images fail to load.',
    source: 'MDN - Alternative text',
    points: 10,
    timeLimit: 30,
  },
  {
    id: 'a11y-002',
    category: 'accessibility',
    difficulty: 'intermediate',
    question: 'What is the correct ARIA role for a clickable div that acts as a button?',
    code: `<div ??? onClick={handleClick}>Click me</div>`,
    options: [
      'role="link"',
      'role="button"',
      'role="clickable"',
      'aria-role="button"',
    ],
    correctAnswer: 1,
    explanation: 'role="button" tells assistive technology the div behaves as a button. You should also add tabindex="0" for keyboard focus and handle Enter/Space key events.',
    source: 'MDN - ARIA: button role',
    points: 20,
    timeLimit: 45,
  },
  {
    id: 'a11y-003',
    category: 'accessibility',
    difficulty: 'advanced',
    question: 'What is a "focus trap" and when should you use it?',
    options: [
      'A bug where focus gets stuck',
      'Keeping focus within a component like a modal dialog',
      'Preventing focus on disabled elements',
      'A CSS technique for focus styles',
    ],
    correctAnswer: 1,
    explanation: 'A focus trap keeps keyboard focus within a component (like a modal), cycling through focusable elements and preventing focus from leaving. Essential for accessible dialogs and popovers.',
    source: 'WAI-ARIA Practices - Modal Dialog',
    points: 35,
    timeLimit: 45,
  },
];

export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return questions.filter(q => q.difficulty === difficulty);
}

export function getRandomQuestions(count: number, category?: Category, difficulty?: Difficulty): Question[] {
  let pool = [...questions];

  if (category) {
    pool = pool.filter(q => q.category === category);
  }

  if (difficulty) {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Shuffle and take count
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
