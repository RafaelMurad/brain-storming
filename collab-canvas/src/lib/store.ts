import { create } from "zustand";

export type Tool = "select" | "pen" | "rect" | "circle" | "line" | "arrow" | "text" | "eraser";

export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  id: string;
  type: "path" | "rect" | "circle" | "text" | "arrow" | "line";
  points?: Point[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  fill?: string;
  userId: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string;
  color: string;
  cursor: Point | null;
}

interface CanvasState {
  // Connection
  clientId: string | null;
  roomId: string | null;
  ws: WebSocket | null;
  connected: boolean;

  // Users
  users: User[];
  myColor: string;

  // Canvas
  shapes: Shape[];
  selectedShapeId: string | null;

  // Tools
  currentTool: Tool;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string | null;

  // Drawing state
  isDrawing: boolean;
  currentShape: Shape | null;

  // Actions
  setConnection: (ws: WebSocket, clientId: string, color: string) => void;
  setRoomId: (roomId: string) => void;
  disconnect: () => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUserCursor: (userId: string, position: Point | null) => void;
  setShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
  updateShape: (shapeId: string, updates: Partial<Shape>) => void;
  removeShape: (shapeId: string) => void;
  clearShapes: () => void;
  setSelectedShape: (shapeId: string | null) => void;
  setCurrentTool: (tool: Tool) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setFillColor: (color: string | null) => void;
  setDrawing: (isDrawing: boolean) => void;
  setCurrentShape: (shape: Shape | null) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // Connection
  clientId: null,
  roomId: null,
  ws: null,
  connected: false,

  // Users
  users: [],
  myColor: "#3b82f6",

  // Canvas
  shapes: [],
  selectedShapeId: null,

  // Tools
  currentTool: "pen",
  strokeColor: "#ffffff",
  strokeWidth: 3,
  fillColor: null,

  // Drawing state
  isDrawing: false,
  currentShape: null,

  // Actions
  setConnection: (ws, clientId, color) =>
    set({ ws, clientId, myColor: color, connected: true }),

  setRoomId: (roomId) => set({ roomId }),

  disconnect: () =>
    set({
      ws: null,
      clientId: null,
      connected: false,
      users: [],
      shapes: [],
    }),

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  updateUserCursor: (userId, position) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, cursor: position } : u
      ),
    })),

  setShapes: (shapes) => set({ shapes }),

  addShape: (shape) =>
    set((state) => ({ shapes: [...state.shapes, shape] })),

  updateShape: (shapeId, updates) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === shapeId ? { ...s, ...updates } : s
      ),
    })),

  removeShape: (shapeId) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== shapeId),
    })),

  clearShapes: () => set({ shapes: [] }),

  setSelectedShape: (shapeId) => set({ selectedShapeId: shapeId }),

  setCurrentTool: (tool) => set({ currentTool: tool }),

  setStrokeColor: (color) => set({ strokeColor: color }),

  setStrokeWidth: (width) => set({ strokeWidth: width }),

  setFillColor: (color) => set({ fillColor: color }),

  setDrawing: (isDrawing) => set({ isDrawing }),

  setCurrentShape: (shape) => set({ currentShape: shape }),
}));
