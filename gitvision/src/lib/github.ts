import { Octokit } from "@octokit/rest";
import type { Repository, RepositoryAnalysis, Commit, ArchitecturePattern } from "@/types";

export function createOctokit(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken });
}

export async function fetchUserRepositories(octokit: Octokit): Promise<Repository[]> {
  const repos: Repository[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.repos.listForAuthenticatedUser({
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc",
    });

    repos.push(...(response.data as Repository[]));

    if (response.data.length < perPage) break;
    page++;
  }

  return repos;
}

export async function fetchRepositoryCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  limit = 30
): Promise<Commit[]> {
  try {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: limit,
    });

    return response.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || "Unknown",
        email: commit.commit.author?.email || "",
        date: commit.commit.author?.date || new Date().toISOString(),
        avatar_url: commit.author?.avatar_url,
      },
      url: commit.html_url,
    }));
  } catch {
    return [];
  }
}

export async function fetchRepositoryLanguages(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  try {
    const response = await octokit.repos.listLanguages({ owner, repo });
    return response.data;
  } catch {
    return {};
  }
}

export async function fetchRepositoryContents(
  octokit: Octokit,
  owner: string,
  repo: string,
  path = ""
): Promise<string[]> {
  try {
    const response = await octokit.repos.getContent({ owner, repo, path });
    if (Array.isArray(response.data)) {
      return response.data.map((item) => item.path);
    }
    return [response.data.path];
  } catch {
    return [];
  }
}

export async function fetchFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({ owner, repo, path });
    if ("content" in response.data && response.data.content) {
      return Buffer.from(response.data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

export async function analyzeRepository(
  octokit: Octokit,
  repo: Repository
): Promise<RepositoryAnalysis> {
  const [owner, repoName] = repo.full_name.split("/");

  // Fetch data in parallel
  const [languages, rootFiles, packageJsonContent] = await Promise.all([
    fetchRepositoryLanguages(octokit, owner, repoName),
    fetchRepositoryContents(octokit, owner, repoName),
    fetchFileContent(octokit, owner, repoName, "package.json"),
  ]);

  const packageJson = packageJsonContent ? JSON.parse(packageJsonContent) : null;

  // Detect tech stack
  const techStack = Object.entries(languages)
    .filter(([, bytes]) => bytes > 1000)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);

  // Detect framework
  const framework = detectFramework(packageJson, rootFiles);

  // Detect architecture patterns
  const architecture = detectArchitecture(rootFiles, packageJson);

  // Extract dependencies
  const dependencies = extractDependencies(packageJson);

  // Check for CI/CD, docs, tests
  const hasCI = rootFiles.some(
    (f) =>
      f.includes(".github/workflows") ||
      f === ".gitlab-ci.yml" ||
      f === "Jenkinsfile" ||
      f === ".circleci"
  );
  const hasDocs = rootFiles.some(
    (f) =>
      f.toLowerCase().includes("readme") ||
      f.toLowerCase() === "docs" ||
      f.toLowerCase().includes("documentation")
  );
  const hasTests = rootFiles.some(
    (f) =>
      f === "tests" ||
      f === "__tests__" ||
      f === "test" ||
      f.includes(".test.") ||
      f.includes(".spec.")
  ) || (packageJson?.scripts?.test && packageJson.scripts.test !== 'echo "Error: no test specified" && exit 1');

  // Calculate health score
  const healthScore = calculateHealthScore({
    hasCI,
    hasDocs,
    hasTests,
    hasDescription: !!repo.description,
    hasTopics: repo.topics.length > 0,
    recentActivity: isRecentlyActive(repo.pushed_at),
    starCount: repo.stargazers_count,
    issueCount: repo.open_issues_count,
  });

  return {
    id: repo.id,
    name: repo.name,
    techStack,
    framework,
    architecture,
    dependencies,
    hasCI,
    hasDocs,
    hasTests,
    healthScore,
    lastActivity: repo.pushed_at,
  };
}

function detectFramework(
  packageJson: Record<string, unknown> | null,
  files: string[]
): string | null {
  if (!packageJson) {
    // Check for non-JS frameworks
    if (files.includes("Cargo.toml")) return "Rust";
    if (files.includes("go.mod")) return "Go";
    if (files.includes("requirements.txt") || files.includes("pyproject.toml")) return "Python";
    if (files.includes("Gemfile")) return "Ruby";
    if (files.includes("build.gradle") || files.includes("pom.xml")) return "Java";
    return null;
  }

  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  if (deps["next"]) return "Next.js";
  if (deps["@angular/core"]) return "Angular";
  if (deps["vue"]) return "Vue.js";
  if (deps["nuxt"]) return "Nuxt";
  if (deps["svelte"]) return "Svelte";
  if (deps["solid-js"]) return "SolidJS";
  if (deps["astro"]) return "Astro";
  if (deps["@nestjs/core"]) return "NestJS";
  if (deps["express"]) return "Express";
  if (deps["fastify"]) return "Fastify";
  if (deps["hono"]) return "Hono";
  if (deps["react-native"]) return "React Native";
  if (deps["expo"]) return "Expo";
  if (deps["electron"]) return "Electron";
  if (deps["react"] && !deps["next"]) return "React";

  return null;
}

function detectArchitecture(
  files: string[],
  packageJson: Record<string, unknown> | null
): ArchitecturePattern[] {
  const patterns: ArchitecturePattern[] = [];

  // Check for monorepo
  if (
    files.includes("pnpm-workspace.yaml") ||
    files.includes("lerna.json") ||
    files.includes("nx.json") ||
    (packageJson?.workspaces)
  ) {
    patterns.push({
      type: "monorepo",
      confidence: 0.9,
      indicators: ["Has workspace configuration"],
    });
  }

  // Check for API
  if (
    files.some((f) => f.includes("api") || f.includes("routes") || f.includes("endpoints"))
  ) {
    patterns.push({
      type: "api",
      confidence: 0.7,
      indicators: ["Has API/routes directory"],
    });
  }

  // Check for webapp
  if (
    files.some((f) => f.includes("pages") || f.includes("app") || f.includes("components"))
  ) {
    patterns.push({
      type: "webapp",
      confidence: 0.7,
      indicators: ["Has pages/components structure"],
    });
  }

  // Check for library
  if (
    files.includes("rollup.config.js") ||
    files.includes("tsup.config.ts") ||
    (packageJson?.main && packageJson?.module)
  ) {
    patterns.push({
      type: "library",
      confidence: 0.8,
      indicators: ["Has library build configuration"],
    });
  }

  // Check for CLI
  if (packageJson?.bin) {
    patterns.push({
      type: "cli",
      confidence: 0.9,
      indicators: ["Has bin field in package.json"],
    });
  }

  // Default to monolith if no patterns detected
  if (patterns.length === 0) {
    patterns.push({
      type: "monolith",
      confidence: 0.5,
      indicators: ["Standard project structure"],
    });
  }

  return patterns;
}

function extractDependencies(
  packageJson: Record<string, unknown> | null
): { name: string; version: string; type: "production" | "development" }[] {
  if (!packageJson) return [];

  const deps: { name: string; version: string; type: "production" | "development" }[] = [];

  const prodDeps = (packageJson.dependencies || {}) as Record<string, string>;
  const devDeps = (packageJson.devDependencies || {}) as Record<string, string>;

  Object.entries(prodDeps).forEach(([name, version]) => {
    deps.push({ name, version, type: "production" });
  });

  Object.entries(devDeps).forEach(([name, version]) => {
    deps.push({ name, version, type: "development" });
  });

  return deps;
}

function isRecentlyActive(pushedAt: string): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(pushedAt) > thirtyDaysAgo;
}

function calculateHealthScore(factors: {
  hasCI: boolean;
  hasDocs: boolean;
  hasTests: boolean;
  hasDescription: boolean;
  hasTopics: boolean;
  recentActivity: boolean;
  starCount: number;
  issueCount: number;
}): number {
  let score = 0;

  if (factors.hasCI) score += 20;
  if (factors.hasDocs) score += 15;
  if (factors.hasTests) score += 20;
  if (factors.hasDescription) score += 10;
  if (factors.hasTopics) score += 5;
  if (factors.recentActivity) score += 15;
  if (factors.starCount > 0) score += Math.min(factors.starCount, 10);
  if (factors.issueCount < 10) score += 5;

  return Math.min(score, 100);
}
