"use client";

import { Prompt } from "@/lib/store";
import { cn, formatDate, truncate, getRatingColor, formatNumber, formatLatency } from "@/lib/utils";
import { StarRating } from "./star-rating";
import {
  Heart,
  MoreVertical,
  Play,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  Zap,
  BarChart2,
} from "lucide-react";
import { useState } from "react";

interface PromptCardProps {
  prompt: Prompt;
  view: "grid" | "list";
  isSelected?: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onRun?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function PromptCard({
  prompt,
  view,
  isSelected,
  onSelect,
  onFavorite,
  onRun,
  onEdit,
  onDelete,
  onDuplicate,
}: PromptCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const categoryColors: Record<string, string> = {
    general: "bg-indigo-500/10 text-indigo-400",
    coding: "bg-green-500/10 text-green-400",
    writing: "bg-yellow-500/10 text-yellow-400",
    analysis: "bg-blue-500/10 text-blue-400",
    creative: "bg-pink-500/10 text-pink-400",
    business: "bg-purple-500/10 text-purple-400",
  };

  if (view === "list") {
    return (
      <div
        onClick={onSelect}
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border border-border bg-card cursor-pointer card-hover",
          isSelected && "ring-2 ring-primary border-primary"
        )}
      >
        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="p-1"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              prompt.isFavorite
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground hover:text-red-500"
            )}
          />
        </button>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold truncate">{prompt.title}</h3>
            <span className={cn("tag", categoryColors[prompt.category])}>
              {prompt.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {truncate(prompt.content, 100)}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <StarRating rating={prompt.rating} size="sm" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Play className="w-4 h-4" />
            <span>{formatNumber(prompt.totalRuns)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatLatency(prompt.avgLatency)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <ContextMenu
              onRun={onRun}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative p-5 rounded-xl border border-border bg-card cursor-pointer card-hover group",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("tag", categoryColors[prompt.category])}>
              {prompt.category}
            </span>
            <span className="tag">{prompt.model}</span>
          </div>
          <h3 className="font-semibold truncate">{prompt.title}</h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="p-1"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              prompt.isFavorite
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground hover:text-red-500"
            )}
          />
        </button>
      </div>

      {/* Content preview */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {prompt.content}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <StarRating rating={prompt.rating} size="sm" showValue />
        <span className="text-xs text-muted-foreground">
          ({prompt.totalRuns} runs)
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Success</p>
          <p className={cn("font-semibold", prompt.successRate >= 90 ? "text-green-400" : "text-yellow-400")}>
            {prompt.successRate}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Latency</p>
          <p className="font-semibold">{formatLatency(prompt.avgLatency)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Tokens</p>
          <p className="font-semibold">{prompt.avgTokens}</p>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-card via-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRun?.();
            }}
            className="btn btn-primary btn-sm"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="btn btn-secondary btn-sm"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date */}
      <p className="absolute top-3 right-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {formatDate(prompt.updatedAt)}
      </p>
    </div>
  );
}

function ContextMenu({
  onRun,
  onEdit,
  onDuplicate,
  onDelete,
  onClose,
}: {
  onRun?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-48 bg-secondary border border-border rounded-lg shadow-xl z-50 py-1 animate-scale-in">
        <button
          onClick={() => {
            onRun?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
        >
          <Play className="w-4 h-4" />
          Run Prompt
        </button>
        <button
          onClick={() => {
            onEdit?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => {
            onDuplicate?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
        >
          <Copy className="w-4 h-4" />
          Duplicate
        </button>
        <div className="my-1 border-t border-border" />
        <button
          onClick={() => {
            onDelete?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  );
}
