export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  topics: string[];
  visibility: string;
  archived: boolean;
}

export interface RepositoryAnalysis {
  id: number;
  name: string;
  techStack: string[];
  framework: string | null;
  architecture: ArchitecturePattern[];
  dependencies: Dependency[];
  hasCI: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  healthScore: number;
  lastActivity: string;
}

export interface ArchitecturePattern {
  type: "monolith" | "microservice" | "monorepo" | "library" | "cli" | "api" | "webapp" | "mobile";
  confidence: number;
  indicators: string[];
}

export interface Dependency {
  name: string;
  version: string;
  type: "production" | "development";
}

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar_url?: string;
  };
  url: string;
}

export interface Deployment {
  id: string;
  provider: "vercel" | "netlify" | "railway" | "render" | "fly" | "unknown";
  status: "success" | "building" | "error" | "pending";
  url: string;
  createdAt: string;
  branch: string;
}

export interface CanvasNode {
  id: string;
  type: "repository" | "group" | "connection" | "note";
  position: { x: number; y: number };
  data: {
    label: string;
    repository?: Repository;
    analysis?: RepositoryAnalysis;
    color?: string;
    notes?: string;
  };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: "dependency" | "similar" | "custom";
  label?: string;
  animated?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  accessToken: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  public_repos: number;
  total_private_repos: number;
}
