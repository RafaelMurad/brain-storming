# CollabCanvas

**Real-time Collaborative Whiteboard** - Draw, create, and collaborate with your team in real-time.

![CollabCanvas](https://via.placeholder.com/800x400?text=CollabCanvas+Whiteboard)

## Features

- **Real-time Collaboration** - See other users' cursors and drawings instantly
- **Multiple Drawing Tools** - Pen, shapes, arrows, text, and eraser
- **Color Palette** - Rich color selection with adjustable stroke width
- **Room System** - Create or join rooms with shareable IDs
- **User Presence** - See who's in the room with avatar indicators
- **Export** - Download your canvas as PNG
- **Undo Support** - Revert changes across all collaborators

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Real-time**: WebSocket (ws library)
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas API
- **Icons**: Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Start development (runs Next.js + WebSocket server)
npm run dev
```

- Frontend: [http://localhost:4002](http://localhost:4002)
- WebSocket: ws://localhost:4003

## Project Structure

```
src/
├── app/
│   ├── globals.css         # Tailwind + custom styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main canvas page
├── components/
│   ├── canvas.tsx          # Drawing canvas with tools
│   ├── toolbar.tsx         # Tool selection bar
│   └── room-dialog.tsx     # Room create/join UI
├── lib/
│   ├── store.ts            # Zustand state management
│   └── utils.ts            # Utility functions
└── server/
    └── websocket.ts        # WebSocket server for real-time sync
```

## Architecture Highlights

### WebSocket Protocol

```typescript
// Join a room
{ type: "join", roomId: string, username: string }

// Cursor movement (throttled)
{ type: "cursor-move", position: { x, y } }

// Drawing events
{ type: "draw-start", shapeId, shapeType, points, color, strokeWidth }
{ type: "draw-update", shapeId, points }
{ type: "shape-delete", shapeId }
```

### Supported Shapes

- **Path** - Freehand drawing with smooth curves
- **Rectangle** - Rectangles with optional fill
- **Circle** - Circles with radius from center
- **Line** - Straight lines between two points
- **Arrow** - Lines with arrow heads
- **Text** - Text labels on canvas

## Environment Variables

```env
NEXT_PUBLIC_WS_URL=ws://localhost:4003
```

## Roadmap

- [ ] Persistent storage (save/load canvases)
- [ ] Image insertion
- [ ] Layer system
- [ ] Zoom and pan
- [ ] Shape selection and resize
- [ ] Collaborative text editing

## License

MIT
