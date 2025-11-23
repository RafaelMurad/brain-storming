"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import RepositoryNode from "./repository-node";
import GroupNode from "./group-node";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus,
  Download,
  Search,
  Layers,
} from "lucide-react";
import { useAppStore } from "@/store";
import type { Repository, RepositoryAnalysis } from "@/types";
import { getLanguageColor } from "@/lib/utils";

const nodeTypes = {
  repository: RepositoryNode,
  group: GroupNode,
};

interface ArchitectureCanvasProps {
  repositories: Repository[];
  analyses: Record<number, RepositoryAnalysis>;
}

export default function ArchitectureCanvas({
  repositories,
  analyses,
}: ArchitectureCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { setSelectedRepoId, searchQuery, setSearchQuery } = useAppStore();

  // Generate initial nodes from repositories
  const initialNodes = useMemo(() => {
    const groupedByFramework: Record<string, Repository[]> = {};
    const ungrouped: Repository[] = [];

    repositories.forEach((repo) => {
      const analysis = analyses[repo.id];
      const framework = analysis?.framework;

      if (framework) {
        if (!groupedByFramework[framework]) {
          groupedByFramework[framework] = [];
        }
        groupedByFramework[framework].push(repo);
      } else {
        ungrouped.push(repo);
      }
    });

    const nodes: Node[] = [];
    let xOffset = 0;
    const CARD_WIDTH = 300;
    const CARD_HEIGHT = 220;
    const GROUP_PADDING = 40;
    const GROUP_GAP = 60;

    // Create groups and their repository nodes
    Object.entries(groupedByFramework).forEach(([framework, repos], groupIndex) => {
      const cols = Math.ceil(Math.sqrt(repos.length));
      const rows = Math.ceil(repos.length / cols);
      const groupWidth = cols * (CARD_WIDTH + 20) + GROUP_PADDING * 2;
      const groupHeight = rows * (CARD_HEIGHT + 20) + GROUP_PADDING * 2 + 40;

      // Add group node
      nodes.push({
        id: `group-${framework}`,
        type: "group",
        position: { x: xOffset, y: 0 },
        data: {
          label: framework,
          color: getLanguageColor(framework),
        },
        style: { width: groupWidth, height: groupHeight },
        draggable: true,
      });

      // Add repository nodes inside group
      repos.forEach((repo, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        nodes.push({
          id: `repo-${repo.id}`,
          type: "repository",
          position: {
            x: xOffset + GROUP_PADDING + col * (CARD_WIDTH + 20),
            y: GROUP_PADDING + 40 + row * (CARD_HEIGHT + 20),
          },
          data: {
            label: repo.name,
            repository: repo,
            analysis: analyses[repo.id],
          },
          parentId: `group-${framework}`,
          extent: "parent",
        });
      });

      xOffset += groupWidth + GROUP_GAP;
    });

    // Add ungrouped repositories
    if (ungrouped.length > 0) {
      const cols = Math.ceil(Math.sqrt(ungrouped.length));

      ungrouped.forEach((repo, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        nodes.push({
          id: `repo-${repo.id}`,
          type: "repository",
          position: {
            x: xOffset + col * (CARD_WIDTH + 20),
            y: row * (CARD_HEIGHT + 20),
          },
          data: {
            label: repo.name,
            repository: repo,
            analysis: analyses[repo.id],
          },
        });
      });
    }

    return nodes;
  }, [repositories, analyses]);

  // Generate edges based on shared dependencies or similar tech stacks
  const initialEdges = useMemo(() => {
    const edges: Edge[] = [];
    const repoNodes = initialNodes.filter((n) => n.type === "repository");

    for (let i = 0; i < repoNodes.length; i++) {
      for (let j = i + 1; j < repoNodes.length; j++) {
        const repo1 = repoNodes[i].data.repository as Repository;
        const repo2 = repoNodes[j].data.repository as Repository;
        const analysis1 = analyses[repo1.id];
        const analysis2 = analyses[repo2.id];

        if (analysis1 && analysis2) {
          // Check for shared framework
          if (analysis1.framework && analysis1.framework === analysis2.framework) {
            edges.push({
              id: `edge-${repo1.id}-${repo2.id}`,
              source: `repo-${repo1.id}`,
              target: `repo-${repo2.id}`,
              type: "smoothstep",
              animated: false,
              style: { stroke: "#6366f1", strokeWidth: 1, opacity: 0.3 },
              markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
            });
          }
        }
      }
    }

    return edges;
  }, [initialNodes, analyses]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "repository" && node.data.repository) {
        setSelectedRepoId((node.data.repository as Repository).id);
      }
    },
    [setSelectedRepoId]
  );

  const autoLayout = useCallback(() => {
    const CARD_WIDTH = 300;
    const CARD_HEIGHT = 220;
    const GAP = 30;
    const cols = Math.ceil(Math.sqrt(nodes.length));

    const newNodes = nodes.map((node, index) => {
      if (node.type === "group") return node;

      const col = index % cols;
      const row = Math.floor(index / cols);

      return {
        ...node,
        position: {
          x: col * (CARD_WIDTH + GAP),
          y: row * (CARD_HEIGHT + GAP),
        },
      };
    });

    setNodes(newNodes);
  }, [nodes, setNodes]);

  const addGroup = useCallback(() => {
    const newGroup: Node = {
      id: `group-${Date.now()}`,
      type: "group",
      position: { x: 100, y: 100 },
      data: { label: "New Group", color: "#6366f1" },
      style: { width: 400, height: 300 },
    };
    setNodes((nds) => [...nds, newGroup]);
  }, [setNodes]);

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;
    return nodes.filter((node) => {
      if (node.type === "group") return true;
      const repo = node.data.repository as Repository | undefined;
      if (!repo) return true;
      return (
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [nodes, searchQuery]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "group") return node.data.color as string || "#6366f1";
            return "#e2e8f0";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* Top Panel - Search and Actions */}
        <Panel position="top-left" className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-background"
            />
          </div>
        </Panel>

        <Panel position="top-right" className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addGroup}>
            <Plus className="h-4 w-4 mr-1" />
            Add Group
          </Button>
          <Button variant="outline" size="sm" onClick={autoLayout}>
            <LayoutGrid className="h-4 w-4 mr-1" />
            Auto Layout
          </Button>
        </Panel>

        {/* Bottom Panel - Stats */}
        <Panel
          position="bottom-left"
          className="bg-background/80 backdrop-blur-sm rounded-lg border px-4 py-2"
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{repositories.length}</span>
              <span className="text-muted-foreground">repos</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-muted-foreground">
              Drag to connect • Scroll to zoom
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
