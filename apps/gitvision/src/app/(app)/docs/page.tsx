"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  ExternalLink,
  Loader2,
  Search,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { Repository } from "@/types";

interface RepoDoc {
  repo: Repository;
  readme: string | null;
  loading: boolean;
}

export default function DocsPage() {
  const { data: session } = useSession();
  const { repositories, setRepositories, setIsLoading } = useAppStore();
  const [docs, setDocs] = useState<RepoDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<RepoDoc | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Initialize docs state
  useEffect(() => {
    if (repositories.length > 0) {
      setDocs(
        repositories.map((repo) => ({
          repo,
          readme: null,
          loading: false,
        }))
      );
      setLoading(false);
    }
  }, [repositories]);

  // Fetch README for selected repo
  const fetchReadme = async (doc: RepoDoc) => {
    if (doc.readme !== null || !session?.accessToken) return;

    setDocs((prev) =>
      prev.map((d) =>
        d.repo.id === doc.repo.id ? { ...d, loading: true } : d
      )
    );

    try {
      const [owner, repoName] = doc.repo.full_name.split("/");
      const response = await fetch(
        `/api/github/repos/${owner}/${repoName}/readme`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      const readme = response.ok ? (await response.json()).content : "";

      setDocs((prev) =>
        prev.map((d) =>
          d.repo.id === doc.repo.id ? { ...d, readme, loading: false } : d
        )
      );

      // Update selected if it's the same
      if (selectedDoc?.repo.id === doc.repo.id) {
        setSelectedDoc((prev) =>
          prev ? { ...prev, readme, loading: false } : null
        );
      }
    } catch {
      setDocs((prev) =>
        prev.map((d) =>
          d.repo.id === doc.repo.id ? { ...d, readme: "", loading: false } : d
        )
      );
    }
  };

  // Filter docs
  const filteredDocs = docs.filter(
    (doc) =>
      !searchQuery ||
      doc.repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDoc = (doc: RepoDoc) => {
    setSelectedDoc(doc);
    fetchReadme(doc);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Documentation Hub" />

      <div className="flex-1 overflow-hidden p-6">
        <div className="flex gap-6 h-full">
          {/* Repository List */}
          <div className="w-80 shrink-0 flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  filteredDocs.map((doc) => (
                    <Card
                      key={doc.repo.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedDoc?.repo.id === doc.repo.id
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                      onClick={() => handleSelectDoc(doc)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {doc.repo.name}
                            </p>
                            {doc.repo.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {doc.repo.description}
                              </p>
                            )}
                            {doc.repo.language && (
                              <Badge
                                variant="secondary"
                                className="mt-1 text-xs"
                              >
                                {doc.repo.language}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Documentation Viewer */}
          <Card className="flex-1 flex flex-col min-w-0">
            {selectedDoc ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg">
                          {selectedDoc.repo.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          README.md
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${selectedDoc.repo.html_url}#readme`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Button>
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                  {selectedDoc.loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : selectedDoc.readme ? (
                    <ScrollArea className="h-full">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none p-6"
                        dangerouslySetInnerHTML={{ __html: selectedDoc.readme }}
                      />
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                      <p>No README found for this repository</p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a repository</p>
                <p className="text-sm">
                  Choose a repository from the list to view its documentation
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
