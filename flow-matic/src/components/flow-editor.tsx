"use client";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { useFlowStore } from "@/lib/store";
import { CustomNode } from "./custom-node";
import { NodePalette } from "./node-palette";
import { Play, Save, Undo, Redo, ZoomIn, ZoomOut, Maximize } from "lucide-react";

const nodeTypes = {
  custom: CustomNode,
};

export function FlowEditor() {
  const {
    nodes,
    edges,
    currentWorkflowId,
    workflows,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    updateWorkflow,
    isRunning,
    setRunning,
  } = useFlowStore();

  const currentWorkflow = workflows.find((w) => w.id === currentWorkflowId);

  const handleSave = useCallback(() => {
    if (currentWorkflowId) {
      updateWorkflow(currentWorkflowId, { nodes, edges });
    }
  }, [currentWorkflowId, nodes, edges, updateWorkflow]);

  const handleRun = useCallback(() => {
    setRunning(true);
    // Simulate workflow execution
    setTimeout(() => {
      setRunning(false);
      if (currentWorkflowId) {
        updateWorkflow(currentWorkflowId, { lastRun: new Date() });
      }
    }, 2000);
  }, [currentWorkflowId, setRunning, updateWorkflow]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  if (!currentWorkflowId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No workflow selected</h2>
          <p className="text-muted-foreground">
            Create a new workflow or select one from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Node Palette */}
      <div className="w-64 border-r border-border bg-secondary/30">
        <div className="p-3 border-b border-border">
          <h3 className="font-medium text-sm">Add Nodes</h3>
        </div>
        <NodePalette />
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "hsl(262, 83%, 58%)" },
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const colors: Record<string, string> = {
                trigger: "#22c55e",
                action: "#3b82f6",
                condition: "#eab308",
                transform: "#a855f7",
                output: "#ef4444",
              };
              return colors[node.data?.type] || "#6b7280";
            }}
          />

          {/* Top toolbar */}
          <Panel position="top-right" className="flex items-center gap-2">
            <div className="bg-secondary/95 backdrop-blur-sm rounded-lg p-1 flex items-center gap-1 border border-border">
              <button
                onClick={handleSave}
                className="p-2 hover:bg-accent rounded transition-colors"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-border" />
              <button
                onClick={handleRun}
                disabled={isRunning || nodes.length === 0}
                className="p-2 hover:bg-accent rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Run workflow"
              >
                <Play
                  className={`w-4 h-4 ${isRunning ? "animate-pulse text-green-500" : ""}`}
                />
              </button>
            </div>
          </Panel>

          {/* Workflow name */}
          <Panel position="top-left">
            <div className="bg-secondary/95 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
              <input
                type="text"
                value={currentWorkflow?.name || ""}
                onChange={(e) =>
                  updateWorkflow(currentWorkflowId, { name: e.target.value })
                }
                className="bg-transparent font-medium focus:outline-none"
              />
            </div>
          </Panel>
        </ReactFlow>

        {/* Running indicator */}
        {isRunning && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Running workflow...
          </div>
        )}
      </div>
    </div>
  );
}
