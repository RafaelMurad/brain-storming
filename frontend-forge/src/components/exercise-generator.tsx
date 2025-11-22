"use client";

import { useState } from "react";
import { useForgeStore, Exercise } from "@/lib/store";
import { cn, TECHNOLOGIES, DIFFICULTY_LABELS, generateId, getDifficultyColor } from "@/lib/utils";
import { Sparkles, Loader2, Github, Clock, Trophy, ArrowRight, RefreshCw } from "lucide-react";

export function ExerciseGenerator() {
  const { isGenerating, setGenerating, generatedExercise, setGeneratedExercise, selectExercise } = useForgeStore();

  const [prompt, setPrompt] = useState("");
  const [selectedTech, setSelectedTech] = useState("react");
  const [difficulty, setDifficulty] = useState(2);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const tech = TECHNOLOGIES.find((t) => t.id === selectedTech)!;

    const mockExercise: Exercise = {
      id: generateId(),
      title: `Build a ${prompt}`,
      description: `Learn ${tech.name} by building a real-world ${prompt.toLowerCase()}. This hands-on exercise will teach you key concepts while creating something practical.`,
      objectives: [
        `Set up a new ${tech.name} project`,
        `Implement core functionality for ${prompt.toLowerCase()}`,
        "Apply best practices and patterns",
        "Style with modern CSS techniques",
        "Deploy and share your project",
      ],
      instructions: `# ${prompt} Exercise\n\n## Overview\nIn this exercise, you'll build a ${prompt.toLowerCase()} using ${tech.name}.\n\n## Requirements\n- Create a responsive UI\n- Implement state management\n- Add user interactions\n- Write clean, maintainable code\n\n## Steps\n1. Initialize the project\n2. Set up the component structure\n3. Implement the main features\n4. Style your application\n5. Test and refine`,
      starterCode: {
        "src/App.tsx": `// TODO: Implement your ${prompt.toLowerCase()}\nimport React from 'react';\n\nexport default function App() {\n  return (\n    <div>\n      <h1>${prompt}</h1>\n    </div>\n  );\n}`,
        "src/styles.css": `/* Add your styles here */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}`,
      },
      solution: null,
      hints: [
        "Start with the basic structure",
        "Break down the UI into components",
        "Use state for dynamic data",
        "Don't forget accessibility",
      ],
      difficulty,
      estimatedTime: difficulty * 20 + 10,
      xpReward: difficulty * 50 + 50,
      tags: [tech.slug, prompt.toLowerCase().split(" ")[0], "ai-generated"],
      technology: tech,
      status: "not_started",
    };

    setGeneratedExercise(mockExercise);
    setGenerating(false);
  };

  const handleStartExercise = () => {
    if (generatedExercise) {
      selectExercise(generatedExercise);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Exercise Generator</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Tell us what you want to learn, and our AI will create a custom exercise with a GitHub repo for you to practice.
        </p>
      </div>

      {/* Generator Form */}
      <div className="gradient-border p-6 mb-8">
        <div className="space-y-6">
          {/* Prompt input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What do you want to build?
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Todo app with drag and drop, Weather dashboard, E-commerce cart..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Technology selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Technology</label>
            <div className="grid grid-cols-4 gap-2">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-center",
                    selectedTech === tech.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <p className="text-xs mt-1 font-medium">{tech.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty: {DIFFICULTY_LABELS[difficulty - 1]}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    difficulty === level
                      ? "text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  style={{
                    backgroundColor:
                      difficulty === level ? getDifficultyColor(level) : undefined,
                  }}
                >
                  {DIFFICULTY_LABELS[level - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full btn btn-primary py-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Exercise...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Exercise
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Exercise Preview */}
      {generatedExercise && (
        <div className="gradient-border p-6 animate-fade-in">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">{generatedExercise.technology.icon}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{generatedExercise.title}</h2>
              <p className="text-muted-foreground mt-1">
                {generatedExercise.description}
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="btn btn-ghost"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-secondary/50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-2xl font-bold">{generatedExercise.estimatedTime}m</p>
              <p className="text-sm text-muted-foreground">Estimated time</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{generatedExercise.xpReward} XP</p>
              <p className="text-sm text-muted-foreground">Reward</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: `${getDifficultyColor(generatedExercise.difficulty)}20`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full mb-2"
                style={{ backgroundColor: getDifficultyColor(generatedExercise.difficulty) }}
              />
              <p className="text-2xl font-bold">
                {DIFFICULTY_LABELS[generatedExercise.difficulty - 1]}
              </p>
              <p className="text-sm text-muted-foreground">Difficulty</p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Learning Objectives</h3>
            <ul className="space-y-2">
              {generatedExercise.objectives.map((obj, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleStartExercise} className="flex-1 btn btn-primary py-3">
              <Github className="w-5 h-5" />
              Create GitHub Repo & Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
