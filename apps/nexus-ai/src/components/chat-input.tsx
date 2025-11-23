"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { Send, Paperclip, Mic } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentConversationId, conversations, addMessage, updateMessage, setLoading, isLoading, model } = useChatStore();

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || !currentConversationId || isLoading) return;

    const userMessage = { id: uuidv4(), role: "user" as const, content: input.trim(), createdAt: new Date() };
    addMessage(currentConversationId, userMessage);
    setInput("");
    setLoading(true);

    // Save user message to DB
    await fetch(`/api/conversations/${currentConversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content: userMessage.content }),
    });

    // Prepare messages for API
    const messages = [...(currentConversation?.messages || []), userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Create assistant message placeholder
    const assistantMessageId = uuidv4();
    addMessage(currentConversationId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, model }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const { content } = JSON.parse(data);
                if (content) {
                  fullContent += content;
                  updateMessage(currentConversationId, assistantMessageId, fullContent);
                }
              } catch {}
            }
          }
        }
      }

      // Save assistant message to DB
      await fetch(`/api/conversations/${currentConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "assistant", content: fullContent }),
      });
    } catch (error) {
      console.error("Error:", error);
      updateMessage(currentConversationId, assistantMessageId, "Sorry, an error occurred. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentConversationId) return null;

  return (
    <div className="border-t border-border p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-secondary rounded-2xl p-2">
          <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none py-2 px-2 max-h-[200px]"
          />
          <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Using {model} • Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
