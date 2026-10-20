import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in-progress" | "pending" | "resolved" | "closed";
export type TicketCategory =
  | "technical"
  | "billing"
  | "account"
  | "courseware"
  | "certification"
  | "general";

export const HAMMET_SUPPORT_EMAIL = "support@hammetedu.com";

export interface TicketAgent {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  type: "image" | "code" | "log" | "document";
  url?: string;
}

export interface TicketComment {
  id: string;
  author: {
    name: string;
    role: "user" | "agent" | "system";
    title?: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  attachments?: TicketAttachment[];
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgent: TicketAgent;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  environment?: {
    os: string;
    browser: string;
    version: string;
    route: string;
  };
  satisfactionRating?: number;
  slaTarget: string;
}

interface TicketStoreState {
  tickets: SupportTicket[];
  selectedTicketId: string | null;
  filterStatus: string;
  filterCategory: string;
  filterPriority: string;
  searchQuery: string;
  isCreateModalOpen: boolean;

  // Actions
  setSelectedTicketId: (id: string | null) => void;
  setFilterStatus: (status: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterPriority: (priority: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;

  createTicket: (data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    attachments?: TicketAttachment[];
  }) => string;

  addComment: (
    ticketId: string,
    content: string,
    attachments?: TicketAttachment[]
  ) => void;

  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  setSatisfactionRating: (ticketId: string, rating: number) => void;
  resetToDefaults: () => void;
}

export const HAMMET_SUPPORT_DESK: TicketAgent = {
  id: "hammet_support_desk",
  name: "Hammet Email Support",
  role: "Direct Help Desk",
  department: "Support & Operations",
  email: HAMMET_SUPPORT_EMAIL,
  isOnline: true,
};

export const SUPPORT_AGENTS: Record<TicketCategory, TicketAgent> = {
  courseware: HAMMET_SUPPORT_DESK,
  billing: HAMMET_SUPPORT_DESK,
  account: HAMMET_SUPPORT_DESK,
  certification: HAMMET_SUPPORT_DESK,
  technical: HAMMET_SUPPORT_DESK,
  general: HAMMET_SUPPORT_DESK,
};

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "HMT-SUP-1012",
    title: "Hammet Support & Direct Help Desk",
    description:
      "Welcome to Hammet Support! We handle all learner questions, courseware inquiries, and account assistance directly through our dedicated team email at support@hammetedu.com. Submit a ticket here anytime and our staff will reply directly to your email address.",
    category: "general",
    priority: "low",
    status: "open",
    assignedAgent: HAMMET_SUPPORT_DESK,
    createdAt: "2026-10-20T08:00:00Z",
    updatedAt: "2026-10-20T08:00:00Z",
    slaTarget: "Within 24 Hours",
    attachments: [],
    comments: [
      {
        id: "c-welcome-1",
        author: {
          name: "Hammet Support Team",
          role: "system",
          title: "Official Support Channel",
        },
        content:
          "All submitted tickets are forwarded directly to support@hammetedu.com. Our team responds promptly to your registered email address.",
        timestamp: "2026-10-20T08:00:00Z",
      },
    ],
  },
];

export const useTicketStore = create<TicketStoreState>()(
  persist(
    (set, get) => ({
      tickets: INITIAL_TICKETS,
      selectedTicketId: "HMT-SUP-1012",
      filterStatus: "all",
      filterCategory: "all",
      filterPriority: "all",
      searchQuery: "",
      isCreateModalOpen: false,

      setSelectedTicketId: (id) => set({ selectedTicketId: id }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

      createTicket: ({ title, description, category, priority, attachments = [] }) => {
        const ticketId = `HMT-SUP-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date().toISOString();

        const slaMap: Record<TicketPriority, string> = {
          critical: "2-4 Hours (Urgent)",
          high: "4-12 Hours (High Priority)",
          medium: "Within 24 Hours",
          low: "Within 48 Hours",
        };

        const newTicket: SupportTicket = {
          id: ticketId,
          title,
          description,
          category,
          priority,
          status: "open",
          assignedAgent: HAMMET_SUPPORT_DESK,
          createdAt: now,
          updatedAt: now,
          slaTarget: slaMap[priority] || "Within 24 Hours",
          attachments,
          comments: [
            {
              id: `c-${Date.now()}`,
              author: {
                name: "Learner Inquiry",
                role: "user",
                title: "Sent via Email",
              },
              content: description,
              timestamp: now,
              attachments: attachments.length > 0 ? attachments : undefined,
            },
          ],
          environment: {
            os: typeof window !== "undefined" ? window.navigator.platform : "Windows x86_64",
            browser: typeof window !== "undefined" ? window.navigator.userAgent.split(" ")[0] : "Chrome",
            version: "Hammet Platform v2.4",
            route: typeof window !== "undefined" ? window.location.pathname : "/learner/support",
          },
        };

        set((state) => ({
          tickets: [newTicket, ...state.tickets],
          selectedTicketId: ticketId,
        }));

        return ticketId;
      },

      addComment: (ticketId, content, attachments = []) => {
        const now = new Date().toISOString();
        const commentId = `c-${Date.now()}`;

        const newComment: TicketComment = {
          id: commentId,
          author: {
            name: "Learner Follow-up",
            role: "user",
            title: "Follow-up Note",
          },
          content,
          timestamp: now,
          attachments: attachments.length > 0 ? attachments : undefined,
        };

        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  updatedAt: now,
                  comments: [...t.comments, newComment],
                }
              : t
          ),
        }));
      },

      updateTicketStatus: (ticketId, status) => {
        const now = new Date().toISOString();
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status,
                  updatedAt: now,
                  resolvedAt: status === "resolved" || status === "closed" ? now : t.resolvedAt,
                }
              : t
          ),
        }));
      },

      setSatisfactionRating: (ticketId, rating) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  satisfactionRating: rating,
                }
              : t
          ),
        }));
      },

      resetToDefaults: () => {
        set({
          tickets: INITIAL_TICKETS,
          selectedTicketId: "HMT-SUP-1012",
          filterStatus: "all",
          filterCategory: "all",
          filterPriority: "all",
          searchQuery: "",
          isCreateModalOpen: false,
        });
      },
    }),
    {
      name: "hammet-support-tickets-v3",
    }
  )
);
