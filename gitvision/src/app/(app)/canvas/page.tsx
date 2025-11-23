"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import ArchitectureCanvas from "@/components/canvas/architecture-canvas";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/store";

export default function CanvasPage() {
  const { data: session } = useSession();
  const {
    repositories,
    setRepositories,
    analyses,
    setAnalysis,
    isLoading,
    setIsLoading,
    setIsAnalyzing,
  } = useAppStore();

  // Fetch repositories if not already loaded
  useEffect(() => {
    async function fetchRepos() {
      if (!session?.accessToken || repositories.length > 0) return;

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

          // Analyze repos
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
  }, [session?.accessToken, repositories.length, setRepositories, setIsLoading, setAnalysis, setIsAnalyzing]);

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
      <Header title="Architecture Canvas" />
      <div className="flex-1">
        <ArchitectureCanvas repositories={repositories} analyses={analyses} />
      </div>
    </div>
  );
}
