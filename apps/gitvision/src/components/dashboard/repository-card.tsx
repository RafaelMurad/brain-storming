"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Clock,
  Rocket,
  FileText,
  GitCommit,
  MoreHorizontal,
} from "lucide-react";
import { formatRelativeTime, getLanguageColor, cn } from "@/lib/utils";
import type { Repository, RepositoryAnalysis } from "@/types";

interface RepositoryCardProps {
  repository: Repository;
  analysis?: RepositoryAnalysis;
  onSelect: () => void;
  onViewCommits: () => void;
  onViewDocs: () => void;
  onDeploy: () => void;
}

export function RepositoryCard({
  repository: repo,
  analysis,
  onSelect,
  onViewCommits,
  onViewDocs,
  onDeploy,
}: RepositoryCardProps) {
  const healthColor =
    analysis?.healthScore && analysis.healthScore >= 70
      ? "bg-green-500"
      : analysis?.healthScore && analysis.healthScore >= 40
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
      style={{
        borderLeftColor: repo.language
          ? getLanguageColor(repo.language)
          : "#e2e8f0",
      }}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base truncate">{repo.name}</CardTitle>
              {repo.private && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
              {repo.archived && (
                <Badge variant="outline" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>
            {repo.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Framework and Language */}
        <div className="flex flex-wrap gap-2">
          {analysis?.framework && (
            <Badge className="text-xs">{analysis.framework}</Badge>
          )}
          {repo.language && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{ borderColor: getLanguageColor(repo.language) }}
            >
              <span
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </Badge>
          )}
          {repo.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{repo.forks_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{repo.open_issues_count}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="h-4 w-4" />
            <span>{formatRelativeTime(repo.pushed_at)}</span>
          </div>
        </div>

        {/* Health Score */}
        {analysis && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", healthColor)}
                style={{ width: `${analysis.healthScore}%` }}
              />
            </div>
            <span className="text-sm font-medium">{analysis.healthScore}%</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewCommits();
            }}
          >
            <GitCommit className="h-4 w-4 mr-1" />
            Commits
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDocs();
            }}
          >
            <FileText className="h-4 w-4 mr-1" />
            Docs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onDeploy();
            }}
          >
            <Rocket className="h-4 w-4 mr-1" />
            Deploy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
