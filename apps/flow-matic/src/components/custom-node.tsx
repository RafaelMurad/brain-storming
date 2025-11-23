"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { useFlowStore, WorkflowNode } from "@/lib/store";
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
  Trash2,
  Settings,
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

const typeColors: Record<string, string> = {
  trigger: "border-green-500 bg-green-500/10",
  action: "border-blue-500 bg-blue-500/10",
  condition: "border-yellow-500 bg-yellow-500/10",
  transform: "border-purple-500 bg-purple-500/10",
  output: "border-red-500 bg-red-500/10",
};

const typeIconColors: Record<string, string> = {
  trigger: "text-green-500 bg-green-500/20",
  action: "text-blue-500 bg-blue-500/20",
  condition: "text-yellow-500 bg-yellow-500/20",
  transform: "text-purple-500 bg-purple-500/20",
  output: "text-red-500 bg-red-500/20",
};

function CustomNodeComponent({ id, data, selected }: NodeProps<WorkflowNode["data"]>) {
  const { setSelectedNode, deleteNode } = useFlowStore();
  const Icon = iconMap[data.icon] || Play;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(id);
  };

  return (
    <div
      className={cn(
        "relative min-w-[200px] rounded-lg border-2 bg-secondary transition-all",
        typeColors[data.type],
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {/* Input Handle */}
      {data.type !== "trigger" && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-primary"
        />
      )}

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", typeIconColors[data.type])}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{data.label}</h3>
            {data.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Config preview */}
        {Object.keys(data.config).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground space-y-1">
              {Object.entries(data.config).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="font-mono">{key}:</span>
                  <span className="truncate">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleSettings}
          className="p-1 hover:bg-accent rounded"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-red-500/20 text-red-500 rounded"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Output Handle */}
      {data.type !== "output" && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-primary"
        />
      )}

      {/* Condition has two outputs */}
      {data.type === "condition" && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: "30%" }}
            className="!bg-green-500"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: "70%" }}
            className="!bg-red-500"
          />
        </>
      )}
    </div>
  );
}

export const CustomNode = memo(CustomNodeComponent);
