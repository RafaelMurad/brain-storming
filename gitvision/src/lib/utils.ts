import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function detectTechStack(languages: Record<string, number>): string[] {
  const stack: string[] = [];
  const total = Object.values(languages).reduce((a, b) => a + b, 0);

  Object.entries(languages).forEach(([lang, bytes]) => {
    const percentage = (bytes / total) * 100;
    if (percentage > 5) {
      stack.push(lang);
    }
  });

  return stack;
}

export function detectFramework(
  packageJson: Record<string, unknown> | null,
  files: string[]
): string | null {
  if (!packageJson) return null;

  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  // Check for common frameworks
  if (deps["next"]) return "Next.js";
  if (deps["@angular/core"]) return "Angular";
  if (deps["vue"]) return "Vue.js";
  if (deps["svelte"]) return "Svelte";
  if (deps["solid-js"]) return "SolidJS";
  if (deps["astro"]) return "Astro";
  if (deps["express"]) return "Express";
  if (deps["fastify"]) return "Fastify";
  if (deps["@nestjs/core"]) return "NestJS";
  if (deps["react"] && !deps["next"]) return "React";

  // Check for file patterns
  if (files.some((f) => f.includes("Cargo.toml"))) return "Rust";
  if (files.some((f) => f.includes("go.mod"))) return "Go";
  if (files.some((f) => f.includes("requirements.txt") || f.includes("pyproject.toml"))) return "Python";

  return null;
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3776ab",
    Rust: "#dea584",
    Go: "#00add8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4f5d95",
    Swift: "#fa7343",
    Kotlin: "#a97bff",
    Dart: "#00b4ab",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SCSS: "#c6538c",
    Shell: "#89e051",
    Dockerfile: "#384d54",
  };

  return colors[language] || "#6b7280";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
