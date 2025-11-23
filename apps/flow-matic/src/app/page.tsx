"use client";

import { WorkflowSidebar } from "@/components/workflow-sidebar";
import { FlowEditor } from "@/components/flow-editor";
import { ConfigPanel } from "@/components/config-panel";
import { useFlowStore } from "@/lib/store";

export default function Home() {
  const { configPanelOpen } = useFlowStore();

  return (
    <div className="flex h-screen bg-background">
      <WorkflowSidebar />
      <FlowEditor />
      {configPanelOpen && <ConfigPanel />}
    </div>
  );
}
