"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitCommit, ExternalLink, Loader2 } from "lucide-react";
import { formatRelativeTime, truncate } from "@/lib/utils";
import type { Commit, Repository } from "@/types";

interface CommitTimelineProps {
  repository: Repository;
  accessToken: string;
}

export function CommitTimeline({ repository, accessToken }: CommitTimelineProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommits() {
      setLoading(true);
      setError(null);

      try {
        const [owner, repo] = repository.full_name.split("/");
        const response = await fetch(
          `/api/github/repos/${owner}/${repo}/commits`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch commits");

        const data = await response.json();
        setCommits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load commits");
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, [repository, accessToken]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64 text-destructive">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Recent Commits
          </CardTitle>
          <Badge variant="secondary">{commits.length} commits</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {commits.map((commit, index) => (
                <div key={commit.sha} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                  <div className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {truncate(commit.message.split("\n")[0], 60)}
                        </p>
                        {commit.message.includes("\n") && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {commit.message.split("\n").slice(1).join(" ").trim()}
                          </p>
                        )}
                      </div>
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={commit.author.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {commit.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {commit.author.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(commit.author.date)}
                      </span>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                        {commit.sha.substring(0, 7)}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
