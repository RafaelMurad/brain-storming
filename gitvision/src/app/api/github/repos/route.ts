import { NextRequest, NextResponse } from "next/server";
import { createOctokit, fetchUserRepositories } from "@/lib/github";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const octokit = createOctokit(token);
    const repos = await fetchUserRepositories(octokit);

    return NextResponse.json(repos);
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
