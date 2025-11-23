# RealtimeHub

**WebSocket Real-time Communication API** - Rooms, presence tracking, and pub/sub messaging for building chat, collaboration, and live features.

## Features

- **Room-based Messaging** - Create public/private rooms for group communication
- **Presence Tracking** - Real-time online/away/busy status for users
- **Typing Indicators** - Show when users are typing
- **Message Persistence** - Store and retrieve message history
- **Broadcast & Unicast** - Send to rooms or specific users
- **Connection Stats** - Monitor active connections

## Quick Start

```bash
npm install && npm run db:push && npm run dev
```

Server runs on `http://localhost:3009` (REST) and `ws://localhost:3009` (WebSocket)

## Usage

### Create Project
```bash
curl -X POST http://localhost:3009/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Chat App"}'
```

### Create Room
```bash
curl -X POST http://localhost:3009/api/v1/rooms \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "general", "type": "public"}'
```

### Connect via WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3009?apiKey=YOUR_KEY&userId=user123');

ws.onopen = () => {
  // Join room
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log(msg); // { type: 'message', userId: '...', content: '...' }
};

// Send message
ws.send(JSON.stringify({ type: 'message', room: 'general', content: 'Hello!' }));

// Update presence
ws.send(JSON.stringify({ type: 'presence', status: 'away' }));

// Typing indicator
ws.send(JSON.stringify({ type: 'typing', room: 'general', isTyping: true }));
```

## WebSocket Events

| Client → Server | Description |
|-----------------|-------------|
| `join` | Join a room |
| `leave` | Leave a room |
| `message` | Send message to room |
| `presence` | Update presence status |
| `typing` | Send typing indicator |

| Server → Client | Description |
|-----------------|-------------|
| `connected` | Connection established |
| `joined` | Successfully joined room |
| `message` | New message in room |
| `user_joined` | User joined room |
| `user_left` | User left room |
| `presence` | User presence changed |
| `typing` | User typing status |

## License
MIT
