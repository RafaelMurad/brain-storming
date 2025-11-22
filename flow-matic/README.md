# FlowMatic

**Visual Workflow Automation Builder** - Create powerful automation workflows with an intuitive drag-and-drop editor.

![FlowMatic](https://via.placeholder.com/800x400?text=FlowMatic+Workflow+Editor)

## Features

- **Visual Editor** - Drag-and-drop node-based workflow builder
- **Multiple Node Types** - Triggers, actions, conditions, transforms, outputs
- **Real-time Preview** - See your workflow connections instantly
- **Node Configuration** - Detailed settings for each node type
- **Workflow Management** - Create, duplicate, activate/deactivate workflows
- **Execution Engine** - Run workflows with visual feedback
- **Mini Map** - Navigate large workflows easily

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Flow Editor**: React Flow
- **State**: Zustand
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:4004](http://localhost:4004)

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Tailwind + React Flow styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main editor page
├── components/
│   ├── custom-node.tsx          # Custom React Flow node
│   ├── node-palette.tsx         # Draggable node list
│   ├── config-panel.tsx         # Node configuration panel
│   ├── workflow-sidebar.tsx     # Workflow list sidebar
│   └── flow-editor.tsx          # Main flow canvas
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── store.ts                 # Zustand state management
│   ├── utils.ts                 # Utility functions
│   └── node-templates.ts        # Node type definitions
└── prisma/
    └── schema.prisma            # Database schema
```

## Node Types

### Triggers
- **Webhook** - HTTP endpoint trigger
- **Schedule** - Cron-based scheduling
- **Manual** - Start workflow manually

### Actions
- **HTTP Request** - Make API calls
- **Send Email** - Email notifications
- **Database** - Query databases
- **Slack** - Send Slack messages

### Logic
- **If/Else** - Conditional branching
- **Switch** - Multi-way branching

### Transform
- **Transform** - Data mapping
- **Filter** - Filter arrays
- **Code** - Custom JavaScript

### Output
- **Response** - Return data
- **Log** - Debug logging

## Architecture Highlights

### State Management
```typescript
// Zustand store with React Flow integration
const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onConnect: (connection) =>
    set({ edges: addEdge(connection, get().edges) }),
}));
```

### Custom Nodes
```tsx
// Type-aware custom nodes with configuration
<Handle type="target" position={Position.Left} />
<div className={cn("node-card", typeColors[data.type])}>
  <Icon className="w-5 h-5" />
  <span>{data.label}</span>
</div>
<Handle type="source" position={Position.Right} />
```

## Roadmap

- [ ] Workflow execution engine
- [ ] Version history
- [ ] Templates library
- [ ] Team collaboration
- [ ] API integrations (Zapier-like)
- [ ] Testing/debugging tools

## License

MIT
