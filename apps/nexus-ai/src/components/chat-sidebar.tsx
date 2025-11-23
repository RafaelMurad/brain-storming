"use client";

import { useState } from "react";
import { useChatStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { MessageSquare, Plus, Settings, Trash2, Sparkles } from "lucide-react";

export function ChatSidebar() {
  const { conversations, currentConversationId, setCurrentConversation, addConversation, model, setModel } = useChatStore();
  const [showSettings, setShowSettings] = useState(false);

  const createNewChat = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model }),
    });
    const { conversation } = await res.json();
    addConversation({ ...conversation, messages: [] });
    setCurrentConversation(conversation.id);
  };

  return (
    <div className="w-64 bg-secondary/50 border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="font-bold text-lg">NexusAI</h1>
        </div>
        <button
          onClick={createNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => setCurrentConversation(conv.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg transition-colors group",
              currentConversationId === conv.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm">{conv.title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {formatDate(new Date(conv.updatedAt))}
            </p>
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        {showSettings && (
          <div className="mt-3 space-y-2">
            <label className="text-xs text-muted-foreground">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md"
            >
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
