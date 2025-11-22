"use client";

import { useState } from "react";
import { useFlowStore } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  Workflow,
  Plus,
  MoreVertical,
  Trash2,
  Copy,
  Play,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export function WorkflowSidebar() {
  const {
    workflows,
    currentWorkflowId,
    setCurrentWorkflow,
    addWorkflow,
    deleteWorkflow,
    updateWorkflow,
    setNodes,
    setEdges,
  } = useFlowStore();

  const [contextMenu, setContextMenu] = useState<string | null>(null);

  const createNewWorkflow = () => {
    const newWorkflow = {
      id: uuidv4(),
      name: `Workflow ${workflows.length + 1}`,
      description: "",
      nodes: [],
      edges: [],
      variables: {},
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addWorkflow(newWorkflow);
    setCurrentWorkflow(newWorkflow.id);
    setNodes([]);
    setEdges([]);
  };

  const handleDuplicate = (workflow: typeof workflows[0]) => {
    const duplicated = {
      ...workflow,
      id: uuidv4(),
      name: `${workflow.name} (Copy)`,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addWorkflow(duplicated);
    setContextMenu(null);
  };

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
    setContextMenu(null);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    updateWorkflow(id, { isActive: !isActive });
  };

  return (
    <div className="w-64 border-r border-border bg-secondary/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Workflow className="w-5 h-5 text-primary" />
            Workflows
          </h2>
          <button
            onClick={createNewWorkflow}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
            title="New workflow"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Workflow list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {workflows.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Workflow className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No workflows yet</p>
            <button
              onClick={createNewWorkflow}
              className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create First Workflow
            </button>
          </div>
        ) : (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={cn(
                "relative group rounded-lg transition-colors",
                currentWorkflowId === workflow.id
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              )}
            >
              <button
                onClick={() => setCurrentWorkflow(workflow.id)}
                className="w-full text-left p-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      workflow.isActive ? "bg-green-500" : "bg-muted-foreground"
                    )}
                  />
                  <span className="font-medium text-sm truncate flex-1">
                    {workflow.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  {workflow.lastRun ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(new Date(workflow.lastRun))}</span>
                    </>
                  ) : (
                    <span>Never run</span>
                  )}
                </div>
              </button>

              {/* Context menu trigger */}
              <button
                onClick={() => setContextMenu(contextMenu === workflow.id ? null : workflow.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-background/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Context menu */}
              {contextMenu === workflow.id && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => toggleActive(workflow.id, workflow.isActive)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {workflow.isActive ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDuplicate(workflow)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
