import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function calculateLevel(xp: number): number {
  // Simple level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return currentLevel * currentLevel * 100;
}

export function xpProgress(xp: number): number {
  const level = calculateLevel(xp);
  const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
  const xpNeededForNext = xpForNextLevel(level) - xpForCurrentLevel;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  return (xpInCurrentLevel / xpNeededForNext) * 100;
}

export const TECHNOLOGIES = [
  {
    id: "react",
    name: "React",
    slug: "react",
    description: "Build interactive UIs with components",
    icon: "⚛️",
    color: "#61dafb",
    category: "framework",
    difficulty: 2,
  },
  {
    id: "nextjs",
    name: "Next.js",
    slug: "nextjs",
    description: "Full-stack React framework",
    icon: "▲",
    color: "#ffffff",
    category: "framework",
    difficulty: 3,
  },
  {
    id: "vue",
    name: "Vue.js",
    slug: "vue",
    description: "Progressive JavaScript framework",
    icon: "💚",
    color: "#4fc08d",
    category: "framework",
    difficulty: 2,
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    description: "Type-safe JavaScript development",
    icon: "📘",
    color: "#3178c6",
    category: "language",
    difficulty: 2,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    slug: "tailwind",
    description: "Utility-first CSS framework",
    icon: "🎨",
    color: "#38bdf8",
    category: "library",
    difficulty: 1,
  },
  {
    id: "svelte",
    name: "Svelte",
    slug: "svelte",
    description: "Compile-time reactive framework",
    icon: "🔥",
    color: "#ff3e00",
    category: "framework",
    difficulty: 2,
  },
  {
    id: "astro",
    name: "Astro",
    slug: "astro",
    description: "Content-focused web framework",
    icon: "🚀",
    color: "#ff5d01",
    category: "framework",
    difficulty: 2,
  },
  {
    id: "remix",
    name: "Remix",
    slug: "remix",
    description: "Full-stack web framework",
    icon: "💿",
    color: "#ffffff",
    category: "framework",
    difficulty: 3,
  },
];

export const DIFFICULTY_LABELS = ["Beginner", "Easy", "Medium", "Hard", "Expert"];

export function getDifficultyColor(difficulty: number): string {
  const colors = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];
  return colors[difficulty - 1] || colors[2];
}
