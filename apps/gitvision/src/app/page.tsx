"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderGit2,
  Map,
  GitCommit,
  Rocket,
  FileText,
  Github,
  ArrowRight,
  Star,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Visual Architecture Canvas",
    description:
      "Interactive node-based visualization of your repositories. Drag, connect, and organize projects like Figma.",
  },
  {
    icon: GitCommit,
    title: "Unified Commit Timeline",
    description:
      "See all commits across repositories in one place. Track activity and stay updated.",
  },
  {
    icon: Rocket,
    title: "One-Click Deployments",
    description:
      "Deploy to Vercel, Netlify, Railway, and more with a single click.",
  },
  {
    icon: FileText,
    title: "Documentation Hub",
    description:
      "View README files and documentation from all your projects without switching tabs.",
  },
  {
    icon: Zap,
    title: "Smart Analysis",
    description:
      "Auto-detect tech stacks, frameworks, and architecture patterns across all repositories.",
  },
  {
    icon: Shield,
    title: "Health Scoring",
    description:
      "Get insights on CI/CD, tests, and documentation coverage for each project.",
  },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <FolderGit2 className="h-16 w-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FolderGit2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">GitVision</h1>
          </div>

          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Your GitHub Repositories,{" "}
            <span className="text-primary">Visualized</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            A unified dashboard to visualize, manage, and understand all your
            GitHub projects. Interactive canvas, smart analysis, and one-click
            deployments.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => signIn("github")}>
              <Github className="h-5 w-5 mr-2" />
              Connect with GitHub
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="h-4 w-4 mr-2" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4">
            See all your projects at a glance
          </h3>
          <p className="text-muted-foreground mb-8">
            Group by framework, visualize dependencies, and understand your
            codebase architecture.
          </p>

          <div className="relative rounded-xl border bg-card overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="p-8 grid grid-cols-3 gap-4 canvas-grid min-h-[400px]">
              {/* Mock nodes */}
              {[
                { name: "Next.js App", framework: "Next.js", x: 0, y: 0 },
                { name: "API Server", framework: "Express", x: 1, y: 0 },
                { name: "Mobile App", framework: "React Native", x: 2, y: 0 },
                { name: "Portfolio", framework: "Astro", x: 0, y: 1 },
                { name: "CLI Tool", framework: "Node.js", x: 1, y: 1 },
                { name: "Design System", framework: "React", x: 2, y: 1 },
              ].map((node, i) => (
                <Card
                  key={node.name}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="font-medium">{node.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {node.framework}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to visualize your repos?
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect your GitHub account and start managing all your projects
                from one beautiful dashboard.
              </p>
              <Button size="lg" onClick={() => signIn("github")}>
                <Github className="h-5 w-5 mr-2" />
                Get Started for Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Built with Next.js, React Flow, and the GitHub API</p>
        </div>
      </footer>
    </div>
  );
}
