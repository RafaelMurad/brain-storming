"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitBranch,
  Star,
  Code2,
  Activity,
  FolderGit2,
  Lock,
  Globe,
  AlertTriangle,
} from "lucide-react";
import type { Repository, RepositoryAnalysis } from "@/types";

interface StatsOverviewProps {
  repositories: Repository[];
  analyses: Record<number, RepositoryAnalysis>;
}

export function StatsOverview({ repositories, analyses }: StatsOverviewProps) {
  const totalStars = repositories.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repositories.reduce((acc, r) => acc + r.forks_count, 0);
  const totalIssues = repositories.reduce((acc, r) => acc + r.open_issues_count, 0);

  const publicRepos = repositories.filter((r) => !r.private).length;
  const privateRepos = repositories.filter((r) => r.private).length;

  const languages = new Set(repositories.map((r) => r.language).filter(Boolean));
  const frameworks = new Set(
    Object.values(analyses)
      .map((a) => a.framework)
      .filter(Boolean)
  );

  const avgHealthScore =
    Object.values(analyses).length > 0
      ? Math.round(
          Object.values(analyses).reduce((acc, a) => acc + a.healthScore, 0) /
            Object.values(analyses).length
        )
      : 0;

  const stats = [
    {
      title: "Total Repositories",
      value: repositories.length,
      icon: FolderGit2,
      description: `${publicRepos} public, ${privateRepos} private`,
      color: "text-blue-500",
    },
    {
      title: "Total Stars",
      value: totalStars,
      icon: Star,
      description: "Across all repositories",
      color: "text-yellow-500",
    },
    {
      title: "Languages",
      value: languages.size,
      icon: Code2,
      description: Array.from(languages).slice(0, 3).join(", "),
      color: "text-purple-500",
    },
    {
      title: "Frameworks",
      value: frameworks.size,
      icon: GitBranch,
      description: Array.from(frameworks).slice(0, 3).join(", "),
      color: "text-green-500",
    },
    {
      title: "Avg Health Score",
      value: `${avgHealthScore}%`,
      icon: Activity,
      description: "Based on CI, tests, docs",
      color: avgHealthScore >= 70 ? "text-green-500" : avgHealthScore >= 40 ? "text-yellow-500" : "text-red-500",
    },
    {
      title: "Open Issues",
      value: totalIssues,
      icon: AlertTriangle,
      description: "Across all repositories",
      color: totalIssues > 50 ? "text-red-500" : "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground truncate">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
