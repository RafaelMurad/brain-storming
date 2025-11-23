import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

export function calculateSuccessRate(success: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
}

export function getPerformanceLevel(rate: number): "success" | "warning" | "error" {
  if (rate >= 90) return "success";
  if (rate >= 70) return "warning";
  return "error";
}

export function getRatingColor(rating: number): string {
  if (rating >= 4) return "text-green-400";
  if (rating >= 3) return "text-yellow-400";
  if (rating >= 2) return "text-orange-400";
  return "text-red-400";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const CATEGORIES = [
  { id: "general", name: "General", color: "#6366f1", icon: "Folder" },
  { id: "coding", name: "Coding", color: "#22c55e", icon: "Code" },
  { id: "writing", name: "Writing", color: "#f59e0b", icon: "Pencil" },
  { id: "analysis", name: "Analysis", color: "#3b82f6", icon: "BarChart2" },
  { id: "creative", name: "Creative", color: "#ec4899", icon: "Sparkles" },
  { id: "business", name: "Business", color: "#8b5cf6", icon: "Briefcase" },
];

export const MODELS = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
];
