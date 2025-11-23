"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ExternalLink, Loader2, Book } from "lucide-react";
import type { Repository } from "@/types";

interface DocsViewerProps {
  repository: Repository;
  accessToken: string;
}

export function DocsViewer({ repository, accessToken }: DocsViewerProps) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadme() {
      setLoading(true);
      setError(null);

      try {
        const [owner, repo] = repository.full_name.split("/");
        const response = await fetch(
          `/api/github/repos/${owner}/${repo}/readme`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setReadme(null);
            return;
          }
          throw new Error("Failed to fetch README");
        }

        const data = await response.json();
        setReadme(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load README");
      } finally {
        setLoading(false);
      }
    }

    fetchReadme();
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

  if (!readme) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Book className="h-12 w-12 mb-4 opacity-50" />
          <p>No README found for this repository</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README.md
          </CardTitle>
          <a
            href={`${repository.html_url}#readme`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: readme }}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
