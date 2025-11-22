"use client";

import { useCanvasStore, Tool } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Pencil,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  Eraser,
  MousePointer,
  Trash2,
  Undo2,
  Download,
  Users,
} from "lucide-react";

const COLORS = [
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const STROKE_WIDTHS = [2, 4, 6, 8, 12];

const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: "select", icon: <MousePointer className="w-5 h-5" />, label: "Select" },
  { id: "pen", icon: <Pencil className="w-5 h-5" />, label: "Pen" },
  { id: "rect", icon: <Square className="w-5 h-5" />, label: "Rectangle" },
  { id: "circle", icon: <Circle className="w-5 h-5" />, label: "Circle" },
  { id: "line", icon: <Minus className="w-5 h-5" />, label: "Line" },
  { id: "arrow", icon: <ArrowRight className="w-5 h-5" />, label: "Arrow" },
  { id: "text", icon: <Type className="w-5 h-5" />, label: "Text" },
  { id: "eraser", icon: <Eraser className="w-5 h-5" />, label: "Eraser" },
];

interface ToolbarProps {
  onClear: () => void;
  onUndo: () => void;
  onExport: () => void;
}

export function Toolbar({ onClear, onUndo, onExport }: ToolbarProps) {
  const {
    currentTool,
    setCurrentTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    users,
    clientId,
  } = useCanvasStore();

  const otherUsers = users.filter((u) => u.id !== clientId);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-secondary/95 backdrop-blur-sm rounded-xl p-2 shadow-xl border border-border z-50">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id)}
            className={cn(
              "tool-button",
              currentTool === tool.id && "active"
            )}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Colors */}
      <div className="flex items-center gap-1">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setStrokeColor(color)}
            className={cn(
              "color-swatch",
              strokeColor === color && "active"
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Stroke Width */}
      <div className="flex items-center gap-1">
        {STROKE_WIDTHS.map((width) => (
          <button
            key={width}
            onClick={() => setStrokeWidth(width)}
            className={cn(
              "tool-button",
              strokeWidth === width && "active"
            )}
            title={`${width}px`}
          >
            <div
              className="rounded-full bg-current"
              style={{ width: width + 4, height: width + 4 }}
            />
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button onClick={onUndo} className="tool-button" title="Undo">
          <Undo2 className="w-5 h-5" />
        </button>
        <button onClick={onClear} className="tool-button" title="Clear Canvas">
          <Trash2 className="w-5 h-5" />
        </button>
        <button onClick={onExport} className="tool-button" title="Export">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Users indicator */}
      {otherUsers.length > 0 && (
        <>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2 px-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {otherUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="w-6 h-6 rounded-full border-2 border-secondary flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: user.color }}
                  title={user.username}
                >
                  {user.username[0].toUpperCase()}
                </div>
              ))}
              {otherUsers.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-secondary flex items-center justify-center text-xs">
                  +{otherUsers.length - 5}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
