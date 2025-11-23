"use client";

import { useState } from "react";
import { nodeTemplates, getTemplatesByCategory, NodeTemplate } from "@/lib/node-templates";
import { useFlowStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  Webhook,
  Clock,
  Play,
  Globe,
  Mail,
  Database,
  MessageSquare,
  GitBranch,
  GitMerge,
  Shuffle,
  Filter,
  Code,
  Send,
  FileText,
  ChevronDown,
  Search,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Webhook,
  Clock,
  Play,
  Globe,
  Mail,
  Database,
  MessageSquare,
  GitBranch,
  GitMerge,
  Shuffle,
  Filter,
  Code,
  Send,
  FileText,
};

const categoryIcons: Record<string, string> = {
  Triggers: "text-green-500",
  Actions: "text-blue-500",
  Logic: "text-yellow-500",
  Transform: "text-purple-500",
  Output: "text-red-500",
};

export function NodePalette() {
  const { addNode, nodes } = useFlowStore();
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Triggers", "Actions"]);

  const templatesByCategory = getTemplatesByCategory();

  const filteredTemplates = search
    ? nodeTemplates.filter(
        (t) =>
          t.label.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddNode = (template: NodeTemplate) => {
    const newNode = {
      id: uuidv4(),
      type: "custom",
      position: {
        x: 250 + Math.random() * 100,
        y: 100 + nodes.length * 100,
      },
      data: {
        label: template.label,
        type: template.nodeType,
        icon: template.icon,
        config: { ...template.defaultConfig },
        description: template.description,
      },
    };

    addNode(newNode);
  };

  const renderTemplate = (template: NodeTemplate) => {
    const Icon = iconMap[template.icon] || Play;

    return (
      <button
        key={template.type}
        onClick={() => handleAddNode(template)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
      >
        <div
          className={cn(
            "p-1.5 rounded",
            categoryIcons[template.category] || "text-gray-500",
            "bg-current/10"
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{template.label}</p>
          <p className="text-xs text-muted-foreground truncate">
            {template.description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTemplates ? (
          // Search results
          <div className="space-y-1">
            {filteredTemplates.map(renderTemplate)}
            {filteredTemplates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No nodes found
              </p>
            )}
          </div>
        ) : (
          // Categories
          Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
              >
                <span className={categoryIcons[category]}>{category}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expandedCategories.includes(category) && "rotate-180"
                  )}
                />
              </button>
              {expandedCategories.includes(category) && (
                <div className="mt-1 ml-2 space-y-1">
                  {templates.map(renderTemplate)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
