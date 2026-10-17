import { create } from "zustand";

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role: "Learner" | "PRO" | "Mentor" | "Staff";
  status: "online" | "idle" | "offline";
  badge?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: ChatUser;
  content: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
    title?: string;
  };
  reactions: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  replyCount?: number;
}

export interface ChatChannel {
  id: string;
  name: string;
  category: "General" | "Study Tracks" | "Collaboration";
  topic: string;
  unreadCount?: number;
  isPrivate?: boolean;
}

interface ChatState {
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  activeDmUserId: string | null;
  setActiveDmUserId: (id: string | null) => void;
  sendMessage: (channelId: string, content: string, code?: { language: string; code: string; title?: string }) => void;
  addReaction: (messageId: string, emoji: string) => void;
}

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: "announcements",
    name: "announcements",
    category: "General",
    topic: "Official Hammet cohort broadcasts, live guest lectures, and AI releases.",
    unreadCount: 1,
  },
  {
    id: "general-ai",
    name: "general-ai",
    category: "General",
    topic: "Open watercooler discussions on foundation models, research papers, and AI news.",
    unreadCount: 4,
  },
  {
    id: "neural-models",
    name: "neural-models",
    category: "Study Tracks",
    topic: "Deep dive into LoRA fine-tuning, 4-bit quantization, and attention mechanics.",
    unreadCount: 2,
  },
  {
    id: "agentic-swarms",
    name: "agentic-swarms",
    category: "Study Tracks",
    topic: "LangGraph orchestration, MCP protocol tooling, and autonomous multi-agent loops.",
    unreadCount: 0,
  },
  {
    id: "hybrid-rag",
    name: "hybrid-rag",
    category: "Study Tracks",
    topic: "Contextual vector retrieval, Milvus index tuning, and cross-encoder rerankers.",
    unreadCount: 0,
  },
  {
    id: "project-showcase",
    name: "project-showcase",
    category: "Collaboration",
    topic: "Share capstone live demos, GitHub repos, and get peer upvotes.",
    unreadCount: 3,
  },
  {
    id: "peer-code-reviews",
    name: "peer-code-reviews",
    category: "Collaboration",
    topic: "Get peer feedback on project PRs, debugging assistance, and test harnesses.",
    unreadCount: 0,
  },
];

export const MOCK_USERS: Record<string, ChatUser> = {
  alex: {
    id: "user_alex",
    name: "Alex Chen",
    role: "PRO",
    status: "online",
    badge: "Neural Architect",
  },
  elena: {
    id: "user_elena",
    name: "Dr. Elena Rostova",
    role: "Mentor",
    status: "online",
    badge: "AI Research Fellow",
  },
  marcus: {
    id: "user_marcus",
    name: "Marcus Vance",
    role: "PRO",
    status: "online",
    badge: "Agentic Swarm Lead",
  },
  sarah: {
    id: "user_sarah",
    name: "Sarah Lin",
    role: "Learner",
    status: "idle",
    badge: "RAG Specialist",
  },
  david: {
    id: "user_david",
    name: "David K.",
    role: "Learner",
    status: "offline",
    badge: "LLM Safety",
  },
};

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "general-ai": [
    {
      id: "msg-1",
      channelId: "general-ai",
      sender: MOCK_USERS.elena,
      content:
        "Welcome to the AI builders hub! This week we are hosting an open architecture review on MoE routing efficiency. Drop your capstone questions here.",
      timestamp: "Today at 9:15 AM",
      reactions: [
        { emoji: "🔥", count: 18, users: ["alex", "marcus"] },
        { emoji: "🧠", count: 12, users: ["sarah"] },
      ],
      replyCount: 5,
    },
    {
      id: "msg-2",
      channelId: "general-ai",
      sender: MOCK_USERS.alex,
      content:
        "Just finished validating the 4-bit LoRA adapter on Llama 3 8B. Loss dropped to 0.74 on our domain split without catastrophic forgetting. Here is the unsloth training block:",
      timestamp: "Today at 10:42 AM",
      codeSnippet: {
        language: "python",
        title: "train_lora_unsloth.py",
        code: `from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/llama-3-8b-bnb-4bit",
    max_seq_length=2048,
    load_in_4bit=True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
)`,
      },
      reactions: [
        { emoji: "🚀", count: 14, users: ["marcus", "elena"] },
        { emoji: "👏", count: 8, users: ["sarah"] },
      ],
      replyCount: 3,
    },
    {
      id: "msg-3",
      channelId: "general-ai",
      sender: MOCK_USERS.marcus,
      content:
        "Super clean setup @Alex Chen! Are you pairing that with a persistent LangGraph checkpoint for state recovery? We found SQLiteSaver handles concurrent agent state rollbacks seamlessly.",
      timestamp: "Today at 11:05 AM",
      reactions: [{ emoji: "⚡", count: 7, users: ["alex"] }],
    },
  ],
  "agentic-swarms": [
    {
      id: "msg-a1",
      channelId: "agentic-swarms",
      sender: MOCK_USERS.marcus,
      content:
        "For anyone building the Capstone #4 (Autonomous Support Swarm), remember to enforce strict Pydantic schemas on tool arguments to avoid LLM hallucinations during external API calls.",
      timestamp: "Yesterday at 4:30 PM",
      codeSnippet: {
        language: "python",
        title: "mcp_tool_schema.py",
        code: `from pydantic import BaseModel, Field

class DatabaseQueryInput(BaseModel):
    query: str = Field(description="SQL read-only select statement")
    limit: int = Field(default=50, ge=1, le=500)
    timeout_ms: int = Field(default=2000)`,
      },
      reactions: [
        { emoji: "🛡️", count: 11, users: ["alex"] },
        { emoji: "🔥", count: 9, users: ["sarah"] },
      ],
    },
  ],
  "project-showcase": [
    {
      id: "msg-p1",
      channelId: "project-showcase",
      sender: MOCK_USERS.sarah,
      content:
        "🚀 Live Capstone Demo: Just deployed my Multi-Modal Hybrid RAG pipeline using Milvus and BGE cross-encoder reranker. Getting 98.4% recall on technical PDF manuals! Feedback welcome: https://github.com/sarahlin/hybrid-milvus-rag",
      timestamp: "Today at 1:12 PM",
      reactions: [
        { emoji: "🎉", count: 22, users: ["alex", "elena", "marcus"] },
        { emoji: "⭐", count: 16, users: ["alex"] },
      ],
    },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  activeChannelId: "general-ai",
  setActiveChannelId: (id: string) => set({ activeChannelId: id, activeDmUserId: null }),
  channels: INITIAL_CHANNELS,
  messages: INITIAL_MESSAGES,
  activeDmUserId: null,
  setActiveDmUserId: (id: string | null) => set({ activeDmUserId: id }),

  sendMessage: (channelId: string, content: string, codeSnippet) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      sender: MOCK_USERS.alex,
      content,
      timestamp: "Just now",
      codeSnippet,
      reactions: [],
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), newMessage],
      },
    }));
  },

  addReaction: (messageId: string, emoji: string) => {
    const channelId = get().activeChannelId;
    const channelMsgs = get().messages[channelId] || [];

    const updatedMsgs = channelMsgs.map((msg) => {
      if (msg.id !== messageId) return msg;

      const existingReactionIndex = msg.reactions.findIndex((r) => r.emoji === emoji);
      if (existingReactionIndex >= 0) {
        const reactions = [...msg.reactions];
        reactions[existingReactionIndex] = {
          ...reactions[existingReactionIndex],
          count: reactions[existingReactionIndex].count + 1,
        };
        return { ...msg, reactions };
      } else {
        return {
          ...msg,
          reactions: [...msg.reactions, { emoji, count: 1, users: ["user_alex"] }],
        };
      }
    });

    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: updatedMsgs,
      },
    }));
  },
}));

