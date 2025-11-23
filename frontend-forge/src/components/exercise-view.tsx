"use client";

import { useState } from "react";
import { useForgeStore } from "@/lib/store";
import { cn, DIFFICULTY_LABELS, getDifficultyColor, formatTime } from "@/lib/utils";
import {
  ArrowLeft,
  Github,
  Clock,
  Trophy,
  CheckCircle,
  Circle,
  Lightbulb,
  ExternalLink,
  Terminal,
  Copy,
  Check,
} from "lucide-react";

export function ExerciseView() {
  const { selectedExercise, selectExercise, setView, updateExerciseStatus, addXP } = useForgeStore();
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  if (!selectedExercise) return null;

  const handleBack = () => {
    selectExercise(null);
    setView("home");
  };

  const handleCreateRepo = async () => {
    // Simulate repo creation
    const repoUrl = `https://github.com/username/${selectedExercise.title.toLowerCase().replace(/\s+/g, "-")}`;
    updateExerciseStatus(selectedExercise.id, "in_progress", repoUrl);
  };

  const handleComplete = () => {
    updateExerciseStatus(selectedExercise.id, "completed");
    addXP(selectedExercise.xpReward);
  };

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cloneCommand = selectedExercise.repoUrl
    ? `git clone ${selectedExercise.repoUrl}.git`
    : "# Repo not created yet";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to exercises
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{selectedExercise.technology.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getDifficultyColor(selectedExercise.difficulty)}20`,
                      color: getDifficultyColor(selectedExercise.difficulty),
                    }}
                  >
                    {DIFFICULTY_LABELS[selectedExercise.difficulty - 1]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedExercise.technology.name}
                  </span>
                </div>
                <h1 className="text-2xl font-bold">{selectedExercise.title}</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                  {selectedExercise.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold">{selectedExercise.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(selectedExercise.estimatedTime)}</span>
                </div>
              </div>

              {selectedExercise.status === "completed" ? (
                <div className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Completed
                </div>
              ) : selectedExercise.repoUrl ? (
                <a
                  href={selectedExercise.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-github"
                >
                  <Github className="w-4 h-4" />
                  Open in GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button onClick={handleCreateRepo} className="btn btn-github">
                  <Github className="w-4 h-4" />
                  Create GitHub Repo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Main content */}
          <div className="col-span-2 space-y-8">
            {/* Quick start */}
            {selectedExercise.repoUrl && (
              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5" />
                  Quick Start
                </h2>
                <div className="bg-background rounded-lg p-4 font-mono text-sm flex items-center justify-between">
                  <code>{cloneCommand}</code>
                  <button
                    onClick={() => copyCommand(cloneCommand)}
                    className="p-2 hover:bg-accent rounded"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Clone the repo and open it in your favorite IDE to get started.
                </p>
              </div>
            )}

            {/* Learning Objectives */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <h2 className="font-semibold mb-4">Learning Objectives</h2>
              <ul className="space-y-3">
                {selectedExercise.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <h2 className="font-semibold mb-4">Instructions</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans">
                  {selectedExercise.instructions}
                </pre>
              </div>
            </div>

            {/* Starter Code */}
            {selectedExercise.starterCode && (
              <div className="p-6 bg-card rounded-xl border border-border">
                <h2 className="font-semibold mb-4">Starter Code</h2>
                <div className="space-y-4">
                  {Object.entries(selectedExercise.starterCode).map(([file, code]) => (
                    <div key={file} className="code-block">
                      <div className="px-4 py-2 bg-accent/50 text-sm font-mono border-b border-border">
                        {file}
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                {["Set up project", "Implement features", "Style UI", "Test & deploy"].map(
                  (step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {selectedExercise.status === "completed" || i === 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          selectedExercise.status === "completed" && "text-muted-foreground line-through"
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  )
                )}
              </div>

              {selectedExercise.status !== "completed" && (
                <button onClick={handleComplete} className="w-full btn btn-primary mt-6">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Complete
                </button>
              )}
            </div>

            {/* Hints */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Hints
                </h3>
                <span className="text-sm text-muted-foreground">
                  {revealedHints.length}/{selectedExercise.hints.length}
                </span>
              </button>

              {showHints && (
                <div className="mt-4 space-y-3">
                  {selectedExercise.hints.map((hint, i) => (
                    <div key={i}>
                      {revealedHints.includes(i) ? (
                        <p className="text-sm p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          {hint}
                        </p>
                      ) : (
                        <button
                          onClick={() => revealHint(i)}
                          className="w-full text-sm p-3 bg-secondary rounded-lg hover:bg-accent transition-colors text-left"
                        >
                          Click to reveal hint {i + 1}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary rounded-lg text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
