"use client";

import { useEffect } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { useChatStore } from "@/lib/store";

export default function Home() {
  const { setConversations } = useChatStore();

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then(({ conversations }) => {
        setConversations(
          conversations.map((c: any) => ({
            ...c,
            updatedAt: new Date(c.updatedAt),
            messages: c.messages.map((m: any) => ({
              ...m,
              createdAt: new Date(m.createdAt),
            })),
          }))
        );
      });
  }, [setConversations]);

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1 flex flex-col">
        <ChatMessages />
        <ChatInput />
      </main>
    </div>
  );
}
