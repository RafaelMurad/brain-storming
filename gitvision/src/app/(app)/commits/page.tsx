"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  GitCommit,
  ExternalLink,
  Loader2,
  Search,
  Calendar,
  Filter,
} from "lucide-react";
import { formatRelativeTime, formatDate, truncate } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Commit, Repository } from "@/types";

interface RepoCommit extends Commit {
  repoName: string;
  repoFullName: string;
}

export default function CommitsPage() {
  const { data: session } = useSession();
  const { repositories, setRepositories, setIsLoading } = useAppStore();
  const [commits, setCommits] = useState<RepoCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  // Fetch repos if needed
  useEffect(() => {
    async function fetchRepos() {
      if (!session?.accessToken || repositories.length > 0) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/github/repos", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRepositories(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchRepos();
  }, [session?.accessToken, repositories.length, setRepositories, setIsLoading]);

  // Fetch commits from all repos
  useEffect(() => {
    async function fetchCommits() {
      if (!session?.accessToken || repositories.length === 0) return;

      setLoading(true);
      const allCommits: RepoCommit[] = [];

      // Fetch commits from top 10 most recently updated repos
      const recentRepos = [...repositories]
        .sort(
          (a, b) =>
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        )
        .slice(0, 10);

      for (const repo of recentRepos) {
        try {
          const [owner, repoName] = repo.full_name.split("/");
          const response = await fetch(
            `/api/github/repos/${owner}/${repoName}/commits`,
            {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }
          );

          if (response.ok) {
            const data: Commit[] = await response.json();
            allCommits.push(
              ...data.map((c) => ({
                ...c,
                repoName: repo.name,
                repoFullName: repo.full_name,
              }))
            );
          }
        } catch (e) {
          console.error(`Failed to fetch commits for ${repo.name}:`, e);
        }
      }

      // Sort by date
      allCommits.sort(
        (a, b) =>
          new Date(b.author.date).getTime() - new Date(a.author.date).getTime()
      );

      setCommits(allCommits);
      setLoading(false);
    }

    fetchCommits();
  }, [session?.accessToken, repositories]);

  // Filter commits
  const filteredCommits = commits.filter((commit) => {
    const matchesSearch =
      !searchQuery ||
      commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.repoName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRepo = !selectedRepo || commit.repoFullName === selectedRepo;

    return matchesSearch && matchesRepo;
  });

  // Group commits by date
  const groupedCommits = filteredCommits.reduce(
    (groups, commit) => {
      const date = formatDate(commit.author.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(commit);
      return groups;
    },
    {} as Record<string, RepoCommit[]>
  );

  const repoOptions = Array.from(new Set(commits.map((c) => c.repoFullName)));

  return (
    <div className="flex flex-col h-screen">
      <Header title="Commits Timeline" />

      <div className="flex-1 overflow-hidden p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="text-sm bg-background border rounded px-3 py-2"
              value={selectedRepo || ""}
              onChange={(e) => setSelectedRepo(e.target.value || null)}
            >
              <option value="">All Repositories</option>
              {repoOptions.map((repo) => (
                <option key={repo} value={repo}>
                  {repo}
                </option>
              ))}
            </select>
          </div>

          <Badge variant="secondary">
            {filteredCommits.length} commits
          </Badge>
        </div>

        {/* Commits Timeline */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-8 pr-4">
              {Object.entries(groupedCommits).map(([date, dateCommits]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background py-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{date}</h3>
                    <Badge variant="outline">{dateCommits.length}</Badge>
                  </div>

                  <div className="relative pl-8">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

                    <div className="space-y-4">
                      {dateCommits.map((commit) => (
                        <div key={commit.sha} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {commit.repoName}
                                    </Badge>
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                      {commit.sha.substring(0, 7)}
                                    </code>
                                  </div>

                                  <p className="font-medium mb-2">
                                    {truncate(commit.message.split("\n")[0], 80)}
                                  </p>

                                  {commit.message.includes("\n") && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                      {commit.message.split("\n").slice(1).join(" ").trim()}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-5 w-5">
                                        <AvatarImage src={commit.author.avatar_url} />
                                        <AvatarFallback className="text-xs">
                                          {commit.author.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-muted-foreground">
                                        {commit.author.name}
                                      </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatRelativeTime(commit.author.date)}
                                    </span>
                                  </div>
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
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
