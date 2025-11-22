import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

const DEFAULT_USER_ID = "demo-user";

// Ensure demo user exists
async function ensureUser() {
  return prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    create: { id: DEFAULT_USER_ID, email: "demo@example.com", name: "Demo User" },
    update: {},
  });
}

export async function GET() {
  try {
    await ensureUser();
    const conversations = await prisma.conversation.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { updatedAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    return Response.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureUser();
    const { title, model } = await req.json();
    const conversation = await prisma.conversation.create({
      data: { userId: DEFAULT_USER_ID, title: title || "New Chat", model: model || "gpt-4o-mini" },
      include: { messages: true },
    });
    return Response.json({ conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }
}
