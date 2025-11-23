"use client";

import { useState } from "react";
import { usePromptStore, Prompt } from "@/lib/store";
import { StarRating, DetailedRating } from "./star-rating";
import { cn, formatDate, formatLatency, formatNumber, MODELS, generateId } from "@/lib/utils";
import {
  X,
  Play,
  Edit,
  Copy,
  Trash2,
  Heart,
  Clock,
  Zap,
  DollarSign,
  History,
  MessageSquare,
  ChevronDown,
  Save,
} from "lucide-react";

interface PromptDetailProps {
  prompt: Prompt;
  onClose: () => void;
}

export function PromptDetail({ prompt, onClose }: PromptDetailProps) {
  const { updatePrompt, toggleFavorite, addRating, setShowRatingModal } = usePromptStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(prompt.content);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingCriteria, setRatingCriteria] = useState({
    clarity: 0,
    effectiveness: 0,
    versatility: 0,
    efficiency: 0,
  });
  const [feedback, setFeedback] = useState("");

  const handleSave = () => {
    updatePrompt(prompt.id, { content: editedContent, version: prompt.version + 1 });
    setIsEditing(false);
  };

  const handleRatingSubmit = () => {
    const avgRating = Object.values(ratingCriteria).reduce((a, b) => a + b, 0) / 4;

    addRating({
      id: generateId(),
      promptId: prompt.id,
      rating: avgRating,
      feedback: feedback || undefined,
      criteria: ratingCriteria,
      createdAt: new Date(),
    });

    // Update prompt's rating
    const newRating = (prompt.rating * prompt.totalRuns + avgRating) / (prompt.totalRuns + 1);
    updatePrompt(prompt.id, { rating: newRating });

    setShowRatingForm(false);
    setRatingCriteria({ clarity: 0, effectiveness: 0, versatility: 0, efficiency: 0 });
    setFeedback("");
  };

  const categoryColors: Record<string, string> = {
    general: "bg-indigo-500/10 text-indigo-400",
    coding: "bg-green-500/10 text-green-400",
    writing: "bg-yellow-500/10 text-yellow-400",
    analysis: "bg-blue-500/10 text-blue-400",
    creative: "bg-pink-500/10 text-pink-400",
    business: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="w-[600px] bg-card border-l border-border overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("tag", categoryColors[prompt.category])}>
                  {prompt.category}
                </span>
                <span className="tag">{prompt.model}</span>
                <span className="tag">v{prompt.version}</span>
              </div>
              <h2 className="text-xl font-bold truncate">{prompt.title}</h2>
              {prompt.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {prompt.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(prompt.id)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    prompt.isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <StarRating rating={prompt.rating} size="sm" showValue />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Play className="w-4 h-4" />
              <span>{formatNumber(prompt.totalRuns)} runs</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatLatency(prompt.avgLatency)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Prompt Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Prompt Content</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-ghost btn-sm"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="w-full font-mono text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn btn-primary btn-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <pre className="prompt-content text-sm whitespace-pre-wrap">
                  {prompt.content}
                </pre>
              </div>
            )}
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div>
            <h3 className="font-semibold mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-2xl font-bold">{prompt.successRate}%</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Avg Latency</span>
                </div>
                <p className="text-2xl font-bold">{formatLatency(prompt.avgLatency)}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Avg Tokens</span>
                </div>
                <p className="text-2xl font-bold">{prompt.avgTokens}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <History className="w-4 h-4" />
                  <span className="text-sm font-medium">Version</span>
                </div>
                <p className="text-2xl font-bold">v{prompt.version}</p>
              </div>
            </div>
          </div>

          {/* Rate This Prompt */}
          <div>
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="w-full flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="font-medium">Rate This Prompt</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform",
                  showRatingForm && "rotate-180"
                )}
              />
            </button>

            {showRatingForm && (
              <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-border space-y-4">
                <DetailedRating
                  criteria={ratingCriteria}
                  onChange={(key, value) =>
                    setRatingCriteria((prev) => ({ ...prev, [key]: value }))
                  }
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Feedback (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts on this prompt..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleRatingSubmit}
                  disabled={Object.values(ratingCriteria).every((v) => v === 0)}
                  className="w-full btn btn-primary"
                >
                  Submit Rating
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button className="flex-1 btn btn-primary">
              <Play className="w-4 h-4" />
              Run Prompt
            </button>
            <button className="btn btn-secondary">
              <Copy className="w-4 h-4" />
            </button>
            <button className="btn btn-danger">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground pt-4 border-t border-border">
            <p>Created: {formatDate(prompt.createdAt)}</p>
            <p>Last updated: {formatDate(prompt.updatedAt)}</p>
            <p className="font-mono mt-1">ID: {prompt.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
