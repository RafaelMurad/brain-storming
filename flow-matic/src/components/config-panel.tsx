"use client";

import { useFlowStore } from "@/lib/store";
import { getTemplateByType } from "@/lib/node-templates";
import { X } from "lucide-react";

export function ConfigPanel() {
  const { nodes, selectedNodeId, setSelectedNode, updateNodeConfig, setConfigPanelOpen } =
    useFlowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  // Find template to get schema
  const nodeType = selectedNode.data.label.toLowerCase().replace(/\s+/g, "-");
  const templates = [
    "webhook", "schedule", "manual", "http-request", "send-email", "database",
    "slack", "if-else", "switch", "transform-data", "filter", "code", "response", "log"
  ];

  let template = templates
    .map((t) => getTemplateByType(t))
    .find((t) => t?.label === selectedNode.data.label);

  const handleClose = () => {
    setSelectedNode(null);
    setConfigPanelOpen(false);
  };

  const handleConfigChange = (field: string, value: unknown) => {
    updateNodeConfig(selectedNodeId!, {
      ...selectedNode.data.config,
      [field]: value,
    });
  };

  return (
    <div className="w-80 border-l border-border bg-secondary/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-medium">{selectedNode.data.label}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {selectedNode.data.type} node
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-accent rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Config form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {template?.configSchema.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={(selectedNode.data.config[field.name] as string) || ""}
                onChange={(e) => handleConfigChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(selectedNode.data.config[field.name] as number) || ""}
                onChange={(e) => handleConfigChange(field.name, Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={(selectedNode.data.config[field.name] as string) || ""}
                onChange={(e) => handleConfigChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            )}

            {field.type === "select" && (
              <select
                value={(selectedNode.data.config[field.name] as string) || ""}
                onChange={(e) => handleConfigChange(field.name, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "boolean" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(selectedNode.data.config[field.name] as boolean) || false}
                  onChange={(e) => handleConfigChange(field.name, e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Enabled</span>
              </label>
            )}

            {field.type === "json" && (
              <textarea
                value={JSON.stringify(selectedNode.data.config[field.name] || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleConfigChange(field.name, JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={6}
                className="w-full px-3 py-2 text-sm font-mono bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            )}
          </div>
        ))}

        {(!template || template.configSchema.fields.length === 0) && (
          <p className="text-sm text-muted-foreground">
            No configuration options for this node.
          </p>
        )}
      </div>

      {/* Node ID */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          ID: {selectedNode.id}
        </p>
      </div>
    </div>
  );
}
