"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, NodeResizer } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface GroupNodeData {
  label: string;
  color?: string;
}

function GroupNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as GroupNodeData;
  const { label, color = "#6366f1" } = nodeData;

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="border-primary"
        handleClassName="h-3 w-3 bg-primary border-2 border-background"
      />
      <div
        className={cn(
          "h-full w-full rounded-lg border-2 border-dashed p-4 transition-colors",
          selected ? "border-primary bg-primary/5" : "border-muted bg-muted/20"
        )}
        style={{ borderColor: selected ? undefined : color + "40" }}
      >
        <div
          className="text-sm font-medium px-2 py-1 rounded-md inline-block"
          style={{ backgroundColor: color + "20", color }}
        >
          {label}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-muted" />
      <Handle type="source" position={Position.Bottom} className="!bg-muted" />
    </>
  );
}

export default memo(GroupNode);
