"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Star,
  GitFork,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { cn, formatRelativeTime, getLanguageColor } from "@/lib/utils";
import type { Repository, RepositoryAnalysis } from "@/types";

interface RepositoryNodeData {
  label: string;
  repository?: Repository;
  analysis?: RepositoryAnalysis;
  color?: string;
}

function RepositoryNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as RepositoryNodeData;
  const { repository: repo, analysis } = nodeData;

  if (!repo) {
    return (
      <Card className="w-48 p-4">
        <p className="text-sm text-muted-foreground">No data</p>
      </Card>
    );
  }

  const healthColor =
    analysis?.healthScore && analysis.healthScore >= 70
      ? "text-green-500"
      : analysis?.healthScore && analysis.healthScore >= 40
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <Card
        className={cn(
          "w-72 transition-all duration-200 cursor-pointer",
          selected && "ring-2 ring-primary shadow-lg",
          "hover:shadow-md"
        )}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{repo.name}</h3>
                {repo.private && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Private
                  </Badge>
                )}
              </div>
              {repo.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Tech Stack */}
          {analysis?.techStack && analysis.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {analysis.techStack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-xs px-1.5 py-0"
                  style={{ borderColor: getLanguageColor(tech) }}
                >
                  <span
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: getLanguageColor(tech) }}
                  />
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {/* Framework Badge */}
          {analysis?.framework && (
            <Badge className="mb-3 text-xs">{analysis.framework}</Badge>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span>{repo.forks_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{repo.open_issues_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{repo.default_branch}</span>
            </div>
          </div>

          {/* Health Indicators */}
          {analysis && (
            <div className="flex items-center gap-2 text-xs">
              {analysis.hasCI && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>CI</span>
                </div>
              )}
              {analysis.hasTests && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Tests</span>
                </div>
              )}
              {analysis.hasDocs && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Docs</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(repo.pushed_at)}</span>
            </div>
            {analysis?.healthScore !== undefined && (
              <div className={cn("text-xs font-medium", healthColor)}>
                {analysis.healthScore}% health
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </>
  );
}

export default memo(RepositoryNode);
