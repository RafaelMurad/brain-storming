import { NextRequest, NextResponse } from "next/server";
import { createOctokit } from "@/lib/github";

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

    const response = await octokit.repos.getReadme({
      owner,
      repo,
      mediaType: { format: "html" },
    });

    return NextResponse.json({ content: response.data as unknown as string });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return NextResponse.json({ error: "README not found" }, { status: 404 });
    }
    console.error("Failed to fetch README:", error);
    return NextResponse.json(
      { error: "Failed to fetch README" },
      { status: 500 }
    );
  }
}
