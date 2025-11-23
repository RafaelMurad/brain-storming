"use client";

import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
import { PromptCard } from "@/components/prompt-card";
import { CreatePromptModal } from "@/components/create-prompt-modal";
import { PromptDetail } from "@/components/prompt-detail";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { usePromptStore, Prompt } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { Inbox } from "lucide-react";

// Sample data for demo
const samplePrompts: Prompt[] = [
  {
    id: generateId(),
    title: "Code Review Assistant",
    content: "You are an expert code reviewer. Analyze the following code and provide:\n1. Potential bugs or issues\n2. Performance improvements\n3. Code style suggestions\n4. Security concerns\n\nCode:\n{{code}}\n\nLanguage: {{language}}",
    description: "Comprehensive code review with best practices",
    category: "coding",
    tags: ["code-review", "best-practices", "security"],
    model: "gpt-4",
    rating: 4.8,
    totalRuns: 156,
    successRate: 98,
    avgLatency: 2340,
    avgTokens: 450,
    isFavorite: true,
    isPublic: false,
    version: 3,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: generateId(),
    title: "Blog Post Generator",
    content: "Write a comprehensive blog post about {{topic}}.\n\nRequirements:\n- Length: {{wordCount}} words\n- Tone: {{tone}}\n- Include: introduction, main points, conclusion\n- Add SEO-friendly headings\n- Include a call-to-action",
    description: "Generate SEO-optimized blog content",
    category: "writing",
    tags: ["blog", "seo", "content"],
    model: "gpt-4-turbo",
    rating: 4.5,
    totalRuns: 89,
    successRate: 95,
    avgLatency: 3200,
    avgTokens: 890,
    isFavorite: false,
    isPublic: true,
    version: 2,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: generateId(),
    title: "Data Analysis Report",
    content: "Analyze the following dataset and provide insights:\n\nData: {{data}}\n\nGenerate:\n1. Summary statistics\n2. Key trends and patterns\n3. Anomalies or outliers\n4. Actionable recommendations\n5. Visualization suggestions",
    description: "Transform raw data into actionable insights",
    category: "analysis",
    tags: ["data", "analytics", "insights"],
    model: "gpt-4",
    rating: 4.6,
    totalRuns: 67,
    successRate: 92,
    avgLatency: 2800,
    avgTokens: 620,
    isFavorite: true,
    isPublic: false,
    version: 1,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: generateId(),
    title: "Creative Story Generator",
    content: "Write a {{genre}} short story with the following elements:\n\nSetting: {{setting}}\nMain character: {{character}}\nConflict: {{conflict}}\n\nRequirements:\n- Engaging opening hook\n- Vivid descriptions\n- Unexpected twist\n- Satisfying resolution",
    description: "Generate engaging creative fiction",
    category: "creative",
    tags: ["fiction", "storytelling", "creative-writing"],
    model: "claude-3-opus",
    rating: 4.3,
    totalRuns: 45,
    successRate: 100,
    avgLatency: 4100,
    avgTokens: 1200,
    isFavorite: false,
    isPublic: true,
    version: 1,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: generateId(),
    title: "Business Email Writer",
    content: "Write a professional email for the following scenario:\n\nPurpose: {{purpose}}\nRecipient: {{recipient}}\nTone: {{tone}}\nKey points: {{keyPoints}}\n\nEnsure the email is:\n- Clear and concise\n- Professional\n- Action-oriented\n- Properly formatted",
    description: "Craft professional business communications",
    category: "business",
    tags: ["email", "communication", "professional"],
    model: "gpt-3.5-turbo",
    rating: 4.1,
    totalRuns: 203,
    successRate: 97,
    avgLatency: 890,
    avgTokens: 280,
    isFavorite: false,
    isPublic: false,
    version: 4,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-08"),
  },
];

export default function Home() {
  const {
    prompts,
    setPrompts,
    selectedPromptId,
    setSelectedPrompt,
    view,
    sortBy,
    filterCategory,
    searchQuery,
    showCreateModal,
    showAnalyticsModal,
    toggleFavorite,
    deletePrompt,
    addPrompt,
  } = usePromptStore();

  // Load sample data on mount
  useEffect(() => {
    if (prompts.length === 0) {
      setPrompts(samplePrompts);
    }
  }, [prompts.length, setPrompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = [...prompts];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterCategory === "favorites") {
      filtered = filtered.filter((p) => p.isFavorite);
    } else if (filterCategory) {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }

    // Apply sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "runs":
        filtered.sort((a, b) => b.totalRuns - a.totalRuns);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        filtered.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }

    return filtered;
  }, [prompts, searchQuery, filterCategory, sortBy]);

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

  const handleDuplicate = (prompt: Prompt) => {
    const duplicated: Prompt = {
      ...prompt,
      id: generateId(),
      title: `${prompt.title} (Copy)`,
      rating: 0,
      totalRuns: 0,
      isFavorite: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addPrompt(duplicated);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {filterCategory === "favorites"
                  ? "Favorite Prompts"
                  : filterCategory
                  ? `${filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)} Prompts`
                  : "All Prompts"}
              </h1>
              <p className="text-muted-foreground">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Prompt grid/list */}
        <div className="p-6">
          {filteredPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Inbox className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery
                  ? `No prompts match "${searchQuery}". Try a different search.`
                  : "Create your first prompt to get started."}
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  view="grid"
                  isSelected={selectedPromptId === prompt.id}
                  onSelect={() => setSelectedPrompt(prompt.id)}
                  onFavorite={() => toggleFavorite(prompt.id)}
                  onDelete={() => deletePrompt(prompt.id)}
                  onDuplicate={() => handleDuplicate(prompt)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  view="list"
                  isSelected={selectedPromptId === prompt.id}
                  onSelect={() => setSelectedPrompt(prompt.id)}
                  onFavorite={() => toggleFavorite(prompt.id)}
                  onDelete={() => deletePrompt(prompt.id)}
                  onDuplicate={() => handleDuplicate(prompt)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showCreateModal && <CreatePromptModal />}
      {showAnalyticsModal && <AnalyticsDashboard />}
      {selectedPrompt && (
        <PromptDetail
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}
