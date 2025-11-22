import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { role, content } = await req.json();

    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        role,
        content,
      },
    });

    // Update conversation timestamp and title if first user message
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: { messages: true },
    });

    if (conversation && conversation.messages.length === 1 && role === "user") {
      await prisma.conversation.update({
        where: { id: params.id },
        data: { title: content.slice(0, 50) + (content.length > 50 ? "..." : "") },
      });
    } else {
      await prisma.conversation.update({
        where: { id: params.id },
        data: { updatedAt: new Date() },
      });
    }

    return Response.json({ message });
  } catch (error) {
    console.error("Error creating message:", error);
    return Response.json({ error: "Failed to create message" }, { status: 500 });
  }
}
