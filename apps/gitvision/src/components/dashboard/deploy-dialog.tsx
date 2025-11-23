"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Globe,
  Server,
} from "lucide-react";
import type { Repository } from "@/types";

interface DeployDialogProps {
  repository: Repository;
  onClose: () => void;
}

const DEPLOY_PROVIDERS = [
  {
    id: "vercel",
    name: "Vercel",
    icon: "▲",
    color: "bg-black text-white",
    url: "https://vercel.com/new/import",
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: "◆",
    color: "bg-[#00ad9f] text-white",
    url: "https://app.netlify.com/start",
  },
  {
    id: "railway",
    name: "Railway",
    icon: "🚂",
    color: "bg-[#0b0d0e] text-white",
    url: "https://railway.app/new",
  },
  {
    id: "render",
    name: "Render",
    icon: "◯",
    color: "bg-[#46e3b7] text-black",
    url: "https://dashboard.render.com/select-repo",
  },
];

export function DeployDialog({ repository, onClose }: DeployDialogProps) {
  const [deploying, setDeploying] = useState<string | null>(null);

  const handleDeploy = (provider: (typeof DEPLOY_PROVIDERS)[0]) => {
    setDeploying(provider.id);

    // Open the deployment URL with the repository
    const url = new URL(provider.url);
    url.searchParams.set("s", repository.html_url);

    window.open(url.toString(), "_blank");

    setTimeout(() => {
      setDeploying(null);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deploy {repository.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Choose a platform to deploy your repository:
        </p>

        <div className="grid grid-cols-2 gap-3">
          {DEPLOY_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary"
              onClick={() => handleDeploy(provider)}
              disabled={deploying !== null}
            >
              {deploying === provider.id ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <span className="text-2xl">{provider.icon}</span>
              )}
              <span className="font-medium">{provider.name}</span>
            </Button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            You&apos;ll be redirected to the platform to complete deployment
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
