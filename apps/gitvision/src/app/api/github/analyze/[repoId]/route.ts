import { NextRequest, NextResponse } from "next/server";
import { createOctokit, analyzeRepository } from "@/lib/github";
import type { Repository } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ repoId: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { repo } = (await request.json()) as { repo: Repository };

    if (!repo) {
      return NextResponse.json(
        { error: "Repository data required" },
        { status: 400 }
      );
    }

    const octokit = createOctokit(token);
    const analysis = await analyzeRepository(octokit, repo);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Failed to analyze repository:", error);
    return NextResponse.json(
      { error: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
