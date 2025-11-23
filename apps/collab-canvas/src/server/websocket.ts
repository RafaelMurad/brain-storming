import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

const PORT = 4003;

interface Client {
  id: string;
  ws: WebSocket;
  roomId: string;
  username: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

interface Room {
  id: string;
  name: string;
  clients: Map<string, Client>;
  shapes: Shape[];
  history: Shape[][];
}

interface Shape {
  id: string;
  type: "path" | "rect" | "circle" | "text" | "arrow" | "line";
  points?: { x: number; y: number }[];
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

const rooms = new Map<string, Room>();
const clients = new Map<string, Client>();

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function broadcast(roomId: string, message: object, excludeClientId?: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = JSON.stringify(message);
  room.clients.forEach((client) => {
    if (client.id !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

function sendToClient(clientId: string, message: object) {
  const client = clients.get(clientId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket) => {
  const clientId = uuidv4();
  let currentClient: Client | null = null;

  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case "join": {
          const { roomId, username } = message;

          // Create room if doesn't exist
          if (!rooms.has(roomId)) {
            rooms.set(roomId, {
              id: roomId,
              name: `Room ${roomId.slice(0, 6)}`,
              clients: new Map(),
              shapes: [],
              history: [],
            });
          }

          const room = rooms.get(roomId)!;
          const color = getRandomColor();

          currentClient = {
            id: clientId,
            ws,
            roomId,
            username: username || `User ${clientId.slice(0, 4)}`,
            color,
            cursor: null,
          };

          room.clients.set(clientId, currentClient);
          clients.set(clientId, currentClient);

          // Send current state to new client
          sendToClient(clientId, {
            type: "init",
            clientId,
            color,
            shapes: room.shapes,
            users: Array.from(room.clients.values()).map((c) => ({
              id: c.id,
              username: c.username,
              color: c.color,
              cursor: c.cursor,
            })),
          });

          // Notify others
          broadcast(roomId, {
            type: "user-joined",
            user: {
              id: clientId,
              username: currentClient.username,
              color,
            },
          }, clientId);

          console.log(`User ${currentClient.username} joined room ${roomId}`);
          break;
        }

        case "cursor-move": {
          if (!currentClient) return;
          currentClient.cursor = message.position;

          broadcast(currentClient.roomId, {
            type: "cursor-update",
            userId: clientId,
            position: message.position,
          }, clientId);
          break;
        }

        case "draw-start": {
          if (!currentClient) return;
          const room = rooms.get(currentClient.roomId);
          if (!room) return;

          const shape: Shape = {
            id: message.shapeId,
            type: message.shapeType,
            points: message.points || [],
            x: message.x,
            y: message.y,
            width: message.width,
            height: message.height,
            radius: message.radius,
            text: message.text,
            color: message.color,
            strokeWidth: message.strokeWidth,
            fill: message.fill,
            userId: clientId,
            createdAt: Date.now(),
          };

          room.shapes.push(shape);

          broadcast(currentClient.roomId, {
            type: "shape-added",
            shape,
          }, clientId);
          break;
        }

        case "draw-update": {
          if (!currentClient) return;
          const room = rooms.get(currentClient.roomId);
          if (!room) return;

          const shapeIndex = room.shapes.findIndex((s) => s.id === message.shapeId);
          if (shapeIndex !== -1) {
            if (message.points) {
              room.shapes[shapeIndex].points = message.points;
            }
            if (message.width !== undefined) {
              room.shapes[shapeIndex].width = message.width;
            }
            if (message.height !== undefined) {
              room.shapes[shapeIndex].height = message.height;
            }

            broadcast(currentClient.roomId, {
              type: "shape-updated",
              shapeId: message.shapeId,
              updates: {
                points: message.points,
                width: message.width,
                height: message.height,
              },
            }, clientId);
          }
          break;
        }

        case "shape-delete": {
          if (!currentClient) return;
          const room = rooms.get(currentClient.roomId);
          if (!room) return;

          room.shapes = room.shapes.filter((s) => s.id !== message.shapeId);

          broadcast(currentClient.roomId, {
            type: "shape-deleted",
            shapeId: message.shapeId,
          }, clientId);
          break;
        }

        case "clear-canvas": {
          if (!currentClient) return;
          const room = rooms.get(currentClient.roomId);
          if (!room) return;

          room.history.push([...room.shapes]);
          room.shapes = [];

          broadcast(currentClient.roomId, {
            type: "canvas-cleared",
            userId: clientId,
          });
          break;
        }

        case "undo": {
          if (!currentClient) return;
          const room = rooms.get(currentClient.roomId);
          if (!room || room.history.length === 0) return;

          room.shapes = room.history.pop() || [];

          broadcast(currentClient.roomId, {
            type: "canvas-restored",
            shapes: room.shapes,
          });
          break;
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    if (currentClient) {
      const room = rooms.get(currentClient.roomId);
      if (room) {
        room.clients.delete(clientId);

        broadcast(currentClient.roomId, {
          type: "user-left",
          userId: clientId,
        });

        // Clean up empty rooms
        if (room.clients.size === 0) {
          rooms.delete(currentClient.roomId);
        }
      }

      clients.delete(clientId);
      console.log(`User ${currentClient.username} disconnected`);
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
