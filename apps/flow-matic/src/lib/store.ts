import { create } from "zustand";
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "reactflow";

export interface WorkflowNode extends Node {
  data: {
    label: string;
    type: "trigger" | "action" | "condition" | "transform" | "output";
    icon: string;
    config: Record<string, unknown>;
    description?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  variables: Record<string, unknown>;
  isActive: boolean;
  lastRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "completed" | "failed";
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  logs: { timestamp: Date; level: string; message: string; nodeId?: string }[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

interface FlowState {
  // Workflows
  workflows: Workflow[];
  currentWorkflowId: string | null;

  // Editor state
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Execution
  executions: Execution[];
  isRunning: boolean;

  // UI
  sidebarOpen: boolean;
  configPanelOpen: boolean;

  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  setCurrentWorkflow: (id: string | null) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;

  setExecutions: (executions: Execution[]) => void;
  addExecution: (execution: Execution) => void;
  updateExecution: (id: string, updates: Partial<Execution>) => void;
  setRunning: (running: boolean) => void;

  setSidebarOpen: (open: boolean) => void;
  setConfigPanelOpen: (open: boolean) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  // Initial state
  workflows: [],
  currentWorkflowId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  executions: [],
  isRunning: false,
  sidebarOpen: true,
  configPanelOpen: false,

  // Workflow actions
  setWorkflows: (workflows) => set({ workflows }),

  setCurrentWorkflow: (id) => {
    const workflow = get().workflows.find((w) => w.id === id);
    set({
      currentWorkflowId: id,
      nodes: workflow?.nodes || [],
      edges: workflow?.edges || [],
      selectedNodeId: null,
    });
  },

  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [...state.workflows, workflow] })),

  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date() } : w
      ),
    })),

  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflowId: state.currentWorkflowId === id ? null : state.currentWorkflowId,
    })),

  // Node/Edge actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, animated: true }, state.edges),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeConfig: (nodeId, config) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, config } } : n
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId, configPanelOpen: !!nodeId }),

  // Execution actions
  setExecutions: (executions) => set({ executions }),

  addExecution: (execution) =>
    set((state) => ({ executions: [execution, ...state.executions] })),

  updateExecution: (id, updates) =>
    set((state) => ({
      executions: state.executions.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  setRunning: (running) => set({ isRunning: running }),

  // UI actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setConfigPanelOpen: (open) => set({ configPanelOpen: open }),
}));
