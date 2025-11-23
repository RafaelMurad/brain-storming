"use client";

import { usePromptStore } from "@/lib/store";
import { cn, CATEGORIES } from "@/lib/utils";
import {
  Sparkles,
  Search,
  Plus,
  Grid,
  List,
  Star,
  Clock,
  TrendingUp,
  SortAsc,
  BarChart2,
  Settings,
  Folder,
  Code,
  Pencil,
  Briefcase,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Folder,
  Code,
  Pencil,
  BarChart2,
  Sparkles,
  Briefcase,
};

export function Sidebar() {
  const {
    prompts,
    view,
    setView,
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    setShowCreateModal,
    setShowAnalyticsModal,
  } = usePromptStore();

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: prompts.filter((p) => p.category === cat.id).length,
  }));

  const favoriteCount = prompts.filter((p) => p.isFavorite).length;

  return (
    <div className="w-72 border-r border-border bg-card/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">PromptLab</h1>
            <p className="text-xs text-muted-foreground">AI Prompt Analytics</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-lg"
          />
        </div>
      </div>

      {/* New Prompt Button */}
      <div className="p-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full btn btn-primary justify-center"
        >
          <Plus className="w-5 h-5" />
          New Prompt
        </button>
      </div>

      {/* View & Sort */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <div className="flex items-center bg-secondary rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-1.5 rounded",
              view === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-1.5 rounded",
              view === "list" ? "bg-accent text-foreground" : "text-muted-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="flex-1 bg-secondary border-0 text-sm"
        >
          <option value="recent">Recent</option>
          <option value="rating">Top Rated</option>
          <option value="runs">Most Used</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Categories
        </p>

        <div className="space-y-1">
          <button
            onClick={() => setFilterCategory(null)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
              !filterCategory ? "bg-primary/10 text-primary" : "hover:bg-accent"
            )}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              All Prompts
            </span>
            <span className="text-xs text-muted-foreground">{prompts.length}</span>
          </button>

          <button
            onClick={() => setFilterCategory("favorites")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
              filterCategory === "favorites" ? "bg-primary/10 text-primary" : "hover:bg-accent"
            )}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Favorites
            </span>
            <span className="text-xs text-muted-foreground">{favoriteCount}</span>
          </button>

          <div className="py-2">
            <div className="border-t border-border" />
          </div>

          {categoryCounts.map((category) => {
            const Icon = iconMap[category.icon] || Folder;
            return (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  filterCategory === category.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: category.color }} />
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => setShowAnalyticsModal(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
        >
          <BarChart2 className="w-4 h-4" />
          Analytics Dashboard
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors text-muted-foreground">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
