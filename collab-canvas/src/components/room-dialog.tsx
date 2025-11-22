"use client";

import { useState } from "react";
import { generateRoomId } from "@/lib/utils";
import { Sparkles, Users, ArrowRight } from "lucide-react";

interface RoomDialogProps {
  onJoin: (roomId: string, username: string) => void;
}

export function RoomDialog({ onJoin }: RoomDialogProps) {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoomId = mode === "create" ? generateRoomId() : roomId;
    const finalUsername = username.trim() || `User${Math.floor(Math.random() * 1000)}`;
    onJoin(finalRoomId, finalUsername);
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">CollabCanvas</h1>
          <p className="text-muted-foreground mt-2">
            Real-time collaborative whiteboard
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-6">
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "create"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setMode("join")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "join"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Join Room
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Room ID (for joining) */}
          {mode === "join" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                required
                className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {mode === "create" ? (
              <>
                <Sparkles className="w-5 h-5" />
                Create New Room
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Join Room
              </>
            )}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Share the room ID with others to collaborate in real-time
        </p>
      </div>
    </div>
  );
}
