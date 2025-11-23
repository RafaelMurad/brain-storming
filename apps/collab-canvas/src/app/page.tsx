"use client";

import { useState, useEffect, useCallback } from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";
import { RoomDialog } from "@/components/room-dialog";
import { useCanvasStore } from "@/lib/store";
import { Copy, Check, Link2 } from "lucide-react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4003";

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    roomId,
    setRoomId,
    setConnection,
    disconnect,
    setUsers,
    addUser,
    removeUser,
    updateUserCursor,
    setShapes,
    addShape,
    updateShape,
    removeShape,
    clearShapes,
    ws,
    clientId,
  } = useCanvasStore();

  const handleJoin = useCallback((newRoomId: string, username: string) => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      websocket.send(JSON.stringify({
        type: "join",
        roomId: newRoomId,
        username,
      }));
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "init":
          setConnection(websocket, message.clientId, message.color);
          setShapes(message.shapes || []);
          setUsers(message.users || []);
          setRoomId(newRoomId);
          setJoined(true);
          break;

        case "user-joined":
          addUser(message.user);
          break;

        case "user-left":
          removeUser(message.userId);
          break;

        case "cursor-update":
          updateUserCursor(message.userId, message.position);
          break;

        case "shape-added":
          addShape(message.shape);
          break;

        case "shape-updated":
          updateShape(message.shapeId, message.updates);
          break;

        case "shape-deleted":
          removeShape(message.shapeId);
          break;

        case "canvas-cleared":
          clearShapes();
          break;

        case "canvas-restored":
          setShapes(message.shapes);
          break;
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket");
      disconnect();
      setJoined(false);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [
    setConnection,
    setRoomId,
    setShapes,
    setUsers,
    addUser,
    removeUser,
    updateUserCursor,
    addShape,
    updateShape,
    removeShape,
    clearShapes,
    disconnect,
  ]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const handleClear = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "clear-canvas" }));
    }
    clearShapes();
  };

  const handleUndo = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "undo" }));
    }
  };

  const handleExport = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `canvas-${roomId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!joined) {
    return <RoomDialog onJoin={handleJoin} />;
  }

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Room info */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-secondary/95 backdrop-blur-sm rounded-lg px-3 py-2 z-50">
        <Link2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono">{roomId}</span>
        <button
          onClick={copyRoomId}
          className="p-1 hover:bg-accent rounded transition-colors"
          title="Copy room ID"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      <Toolbar
        onClear={handleClear}
        onUndo={handleUndo}
        onExport={handleExport}
      />

      <Canvas />
    </div>
  );
}
