import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  updatedAt: Date;
}

interface ChatStore {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  model: string;

  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  setLoading: (loading: boolean) => void;
  setModel: (model: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  model: "gpt-4o-mini",

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      ),
    })),
  updateMessage: (conversationId, messageId, content) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, content } : m
              ),
            }
          : c
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setModel: (model) => set({ model }),
}));
