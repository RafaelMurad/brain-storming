# NexusAI

**AI Chat Platform** - Multi-model AI chat with streaming responses, conversation memory, and beautiful UI.

![NexusAI](https://via.placeholder.com/800x400?text=NexusAI+Chat+Interface)

## Features

- **Multi-Model Support** - GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Streaming Responses** - Real-time token streaming with Server-Sent Events
- **Conversation Memory** - Full chat history persistence with SQLite/Prisma
- **Syntax Highlighting** - Beautiful code blocks with copy functionality
- **Markdown Rendering** - Full markdown support in responses
- **Dark Mode** - Sleek dark interface with custom styling
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui patterns
- **State**: Zustand
- **Database**: Prisma + SQLite
- **AI**: OpenAI API with streaming
- **Components**: Radix UI primitives

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Add your OpenAI API key
cp .env.example .env.local
# Edit .env.local with your OPENAI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:4001](http://localhost:4001)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming chat endpoint
│   │   └── conversations/         # CRUD for conversations
│   ├── globals.css                # Tailwind + custom styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main chat page
├── components/
│   ├── chat-sidebar.tsx           # Conversation list
│   ├── chat-messages.tsx          # Message display with markdown
│   └── chat-input.tsx             # Input with streaming
└── lib/
    ├── db.ts                      # Prisma client
    ├── store.ts                   # Zustand store
    └── utils.ts                   # Utility functions
```

## Architecture Highlights

### Streaming Implementation
```typescript
// Server-Sent Events streaming
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
    }
    controller.close();
  },
});
```

### State Management
```typescript
// Zustand store for chat state
const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  // ... actions
}));
```

## Roadmap

- [ ] RAG with document upload
- [ ] Vector embeddings search
- [ ] Multi-modal (images)
- [ ] Voice input/output
- [ ] Prompt templates
- [ ] Export conversations

## License

MIT
