"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RepositoryCard } from "@/components/dashboard/repository-card";
import { CommitTimeline } from "@/components/dashboard/commit-timeline";
import { DocsViewer } from "@/components/dashboard/docs-viewer";
import { DeployDialog } from "@/components/dashboard/deploy-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, LayoutGrid, List, Filter, X } from "lucide-react";
import { useAppStore } from "@/store";
import type { Repository, RepositoryAnalysis } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    repositories,
    setRepositories,
    analyses,
    setAnalysis,
    searchQuery,
    filterLanguage,
    setFilterLanguage,
    selectedRepoId,
    setSelectedRepoId,
    isLoading,
    setIsLoading,
    isAnalyzing,
    setIsAnalyzing,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch repositories
  useEffect(() => {
    async function fetchRepos() {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/github/repos", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRepositories(data);

          // Start analyzing repos in background
          setIsAnalyzing(true);
          for (const repo of data.slice(0, 20)) {
            try {
              const analysisResponse = await fetch(
                `/api/github/analyze/${repo.id}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ repo }),
                }
              );

              if (analysisResponse.ok) {
                const analysis = await analysisResponse.json();
                setAnalysis(repo.id, analysis);
              }
            } catch (e) {
              console.error(`Failed to analyze ${repo.name}:`, e);
            }
          }
          setIsAnalyzing(false);
        }
      } catch (error) {
        console.error("Failed to fetch repos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepos();
  }, [session?.accessToken, setRepositories, setIsLoading, setAnalysis, setIsAnalyzing]);

  // Filter and search repositories
  const filteredRepos = useMemo(() => {
    return repositories.filter((repo) => {
      const matchesSearch =
        !searchQuery ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage =
        !filterLanguage || repo.language === filterLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [repositories, searchQuery, filterLanguage]);

  // Get unique languages for filter
  const languages = useMemo(() => {
    const langs = new Set(repositories.map((r) => r.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [repositories]);

  const selectedRepo = repositories.find((r) => r.id === selectedRepoId);

  const handleRefresh = () => {
    setRepositories([]);
    // Re-trigger fetch by clearing and setting session
    window.location.reload();
  };

  if (isLoading && repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your repositories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Dashboard"
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="flex-1 overflow-hidden p-6">
        <div className="space-y-6 h-full flex flex-col">
          {/* Stats Overview */}
          <StatsOverview repositories={repositories} analyses={analyses} />

          {/* Main Content */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Repository List */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredRepos.length} repositories
                  </span>
                  {isAnalyzing && (
                    <Badge variant="secondary" className="animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Analyzing...
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Filter */}
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="text-sm bg-transparent border rounded px-2 py-1"
                      value={filterLanguage || ""}
                      onChange={(e) =>
                        setFilterLanguage(e.target.value || null)
                      }
                    >
                      <option value="">All Languages</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang || ""}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    {filterLanguage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setFilterLanguage(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Repository Grid/List */}
              <ScrollArea className="flex-1">
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                      : "space-y-3"
                  }
                >
                  {filteredRepos.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      analysis={analyses[repo.id]}
                      onSelect={() => {
                        setSelectedRepoId(repo.id);
                        setActiveTab("commits");
                      }}
                      onViewCommits={() => {
                        setSelectedRepoId(repo.id);
                        setActiveTab("commits");
                      }}
                      onViewDocs={() => {
                        setSelectedRepoId(repo.id);
                        setActiveTab("docs");
                      }}
                      onDeploy={() => {
                        setSelectedRepoId(repo.id);
                        setShowDeployDialog(true);
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Detail Panel */}
            {selectedRepo && (
              <div className="w-96 shrink-0 border-l pl-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{selectedRepo.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRepoId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="commits" className="flex-1">
                      Commits
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="flex-1">
                      Docs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="commits" className="mt-4">
                    <CommitTimeline
                      repository={selectedRepo}
                      accessToken={session?.accessToken || ""}
                    />
                  </TabsContent>

                  <TabsContent value="docs" className="mt-4">
                    <DocsViewer
                      repository={selectedRepo}
                      accessToken={session?.accessToken || ""}
                    />
                  </TabsContent>
                </Tabs>

                {/* Deploy Dialog */}
                {showDeployDialog && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <DeployDialog
                      repository={selectedRepo}
                      onClose={() => setShowDeployDialog(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
