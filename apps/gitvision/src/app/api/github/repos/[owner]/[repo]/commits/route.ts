import { NextRequest, NextResponse } from "next/server";
import { createOctokit, fetchRepositoryCommits } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { owner, repo } = await params;
    const octokit = createOctokit(token);
    const commits = await fetchRepositoryCommits(octokit, owner, repo);

    return NextResponse.json(commits);
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
