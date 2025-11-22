import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3009;

// Store connections in memory
const connections = new Map<string, { ws: WebSocket; projectId: string; userId: string; rooms: Set<string> }>();
const rooms = new Map<string, Set<string>>(); // roomId -> Set<socketId>
const presence = new Map<string, { status: string; lastSeen: Date }>();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Generate API key
function generateApiKey(): string {
  return `rh_${crypto.randomBytes(32).toString('hex')}`;
}

// REST API Endpoints
app.post('/api/v1/projects', async (req, res) => {
  try {
    const { name } = req.body;
    const project = await prisma.project.create({ data: { name } });
    const apiKey = await prisma.apiKey.create({
      data: { projectId: project.id, name: 'Default Key', key: generateApiKey() }
    });
    res.status(201).json({ success: true, data: { project, apiKey: { id: apiKey.id, key: apiKey.key } } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to create project' } });
  }
});

app.post('/api/v1/rooms', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
    if (!key) return res.status(401).json({ success: false, error: { message: 'Invalid API key' } });

    const { name, type = 'public', maxMembers = 100 } = req.body;
    const room = await prisma.room.create({
      data: { projectId: key.projectId, name, type, maxMembers }
    });
    rooms.set(room.id, new Set());
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to create room' } });
  }
});

app.get('/api/v1/rooms', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
    if (!key) return res.status(401).json({ success: false, error: { message: 'Invalid API key' } });

    const roomList = await prisma.room.findMany({ where: { projectId: key.projectId } });
    const withStats = roomList.map(r => ({
      ...r,
      activeConnections: rooms.get(r.id)?.size || 0
    }));
    res.json({ success: true, data: withStats });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to list rooms' } });
  }
});

app.get('/api/v1/presence', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
    if (!key) return res.status(401).json({ success: false, error: { message: 'Invalid API key' } });

    const presenceList = await prisma.presenceState.findMany({ where: { projectId: key.projectId } });
    res.json({ success: true, data: presenceList });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to get presence' } });
  }
});

app.get('/api/v1/stats', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
    if (!key) return res.status(401).json({ success: false, error: { message: 'Invalid API key' } });

    const projectConnections = Array.from(connections.values()).filter(c => c.projectId === key.projectId);
    res.json({
      success: true,
      data: {
        totalConnections: projectConnections.length,
        totalRooms: rooms.size,
        onlineUsers: projectConnections.map(c => c.userId).filter((v, i, a) => a.indexOf(v) === i).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to get stats' } });
  }
});

app.get('/api/v1', (req, res) => {
  res.json({
    service: 'RealtimeHub',
    version: '1.0.0',
    description: 'WebSocket Real-time Communication API',
    websocket: `ws://localhost:${PORT}`,
    endpoints: {
      'POST /api/v1/projects': 'Create project',
      'POST /api/v1/rooms': 'Create room',
      'GET /api/v1/rooms': 'List rooms',
      'GET /api/v1/presence': 'Get online users',
      'GET /api/v1/stats': 'Get connection stats'
    },
    wsEvents: {
      client: ['join', 'leave', 'message', 'presence', 'subscribe', 'unsubscribe'],
      server: ['joined', 'left', 'message', 'presence', 'error', 'subscribed']
    }
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', connections: connections.size }));

// WebSocket handling
wss.on('connection', async (ws, req) => {
  const socketId = uuidv4();
  const url = new URL(req.url || '', `http://localhost:${PORT}`);
  const apiKey = url.searchParams.get('apiKey');
  const userId = url.searchParams.get('userId') || `anon_${socketId.slice(0, 8)}`;

  if (!apiKey) {
    ws.send(JSON.stringify({ type: 'error', message: 'API key required' }));
    ws.close();
    return;
  }

  const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!key || !key.isActive) {
    ws.send(JSON.stringify({ type: 'error', message: 'Invalid API key' }));
    ws.close();
    return;
  }

  connections.set(socketId, { ws, projectId: key.projectId, userId, rooms: new Set() });

  // Update presence
  await prisma.presenceState.upsert({
    where: { projectId_userId: { projectId: key.projectId, userId } },
    create: { projectId: key.projectId, userId, status: 'online' },
    update: { status: 'online', lastSeenAt: new Date() }
  });

  ws.send(JSON.stringify({ type: 'connected', socketId, userId }));

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const conn = connections.get(socketId);
      if (!conn) return;

      switch (msg.type) {
        case 'join': {
          const room = await prisma.room.findUnique({
            where: { projectId_name: { projectId: conn.projectId, name: msg.room } }
          });
          if (!room) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            return;
          }
          if (!rooms.has(room.id)) rooms.set(room.id, new Set());
          rooms.get(room.id)!.add(socketId);
          conn.rooms.add(room.id);
          ws.send(JSON.stringify({ type: 'joined', room: msg.room, roomId: room.id }));
          broadcast(room.id, { type: 'user_joined', userId: conn.userId, room: msg.room }, socketId);
          break;
        }
        case 'leave': {
          const room = await prisma.room.findUnique({
            where: { projectId_name: { projectId: conn.projectId, name: msg.room } }
          });
          if (room && rooms.has(room.id)) {
            rooms.get(room.id)!.delete(socketId);
            conn.rooms.delete(room.id);
            broadcast(room.id, { type: 'user_left', userId: conn.userId, room: msg.room }, socketId);
          }
          break;
        }
        case 'message': {
          const room = await prisma.room.findUnique({
            where: { projectId_name: { projectId: conn.projectId, name: msg.room } }
          });
          if (room && conn.rooms.has(room.id)) {
            const message = await prisma.message.create({
              data: { roomId: room.id, userId: conn.userId, content: msg.content, metadata: JSON.stringify(msg.metadata || {}) }
            });
            broadcast(room.id, { type: 'message', id: message.id, room: msg.room, userId: conn.userId, content: msg.content, timestamp: message.createdAt });
          }
          break;
        }
        case 'presence': {
          await prisma.presenceState.upsert({
            where: { projectId_userId: { projectId: conn.projectId, userId: conn.userId } },
            create: { projectId: conn.projectId, userId: conn.userId, status: msg.status },
            update: { status: msg.status, customStatus: msg.customStatus, lastSeenAt: new Date() }
          });
          broadcastToProject(conn.projectId, { type: 'presence', userId: conn.userId, status: msg.status });
          break;
        }
        case 'typing': {
          const room = await prisma.room.findUnique({
            where: { projectId_name: { projectId: conn.projectId, name: msg.room } }
          });
          if (room) broadcast(room.id, { type: 'typing', userId: conn.userId, room: msg.room, isTyping: msg.isTyping }, socketId);
          break;
        }
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', async () => {
    const conn = connections.get(socketId);
    if (conn) {
      conn.rooms.forEach(roomId => {
        rooms.get(roomId)?.delete(socketId);
        broadcast(roomId, { type: 'user_left', userId: conn.userId });
      });
      await prisma.presenceState.update({
        where: { projectId_userId: { projectId: conn.projectId, userId: conn.userId } },
        data: { status: 'offline', lastSeenAt: new Date() }
      }).catch(() => {});
      broadcastToProject(conn.projectId, { type: 'presence', userId: conn.userId, status: 'offline' });
    }
    connections.delete(socketId);
  });
});

function broadcast(roomId: string, message: any, excludeSocket?: string) {
  const roomSockets = rooms.get(roomId);
  if (!roomSockets) return;
  const data = JSON.stringify(message);
  roomSockets.forEach(socketId => {
    if (socketId !== excludeSocket) {
      connections.get(socketId)?.ws.send(data);
    }
  });
}

function broadcastToProject(projectId: string, message: any) {
  const data = JSON.stringify(message);
  connections.forEach((conn) => {
    if (conn.projectId === projectId) conn.ws.send(data);
  });
}

server.listen(PORT, () => console.log(`RealtimeHub running on port ${PORT}`));
