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

export const SUPPORT_AGENTS: Record<TicketCategory, TicketAgent> = {
  courseware: {
    id: "agent_sj",
    name: "Sarah Jenkins",
    role: "Student Support Specialist",
    department: "Learner Support Team",
    email: "s.jenkins@hammet.ai",
    isOnline: true,
  },
  billing: {
    id: "agent_dk",
    name: "David Kim",
    role: "Billing Support",
    department: "Finance Operations",
    email: "d.kim@hammet.ai",
    isOnline: true,
  },
  account: {
    id: "agent_dr",
    name: "Devon Reed",
    role: "Account Support",
    department: "User Operations",
    email: "d.reed@hammet.ai",
    isOnline: false,
  },
  certification: {
    id: "agent_er",
    name: "Elena Rostova",
    role: "Certificates & Credentials",
    department: "Academic Office",
    email: "e.rostova@hammet.ai",
    isOnline: true,
  },
  technical: {
    id: "agent_ar",
    name: "Alex Rivera",
    role: "Technical Support",
    department: "Platform Engineering",
    email: "a.rivera@hammet.ai",
    isOnline: true,
  },
  general: {
    id: "agent_kb",
    name: "Kendra Bailey",
    role: "Student Advisor",
    department: "Support Desk",
    email: "k.bailey@hammet.ai",
    isOnline: true,
  },
};

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "HMT-1024",
    title: "Can't access Module 3 quiz",
    description:
      "Every time I complete video lecture 3.4 and click 'Start Quiz', the page shows a blank white screen with the error 'Session expired'. I need to finish this quiz to unlock the next module.",
    category: "courseware",
    priority: "high",
    status: "in-progress",
    assignedAgent: SUPPORT_AGENTS.courseware,
    createdAt: "2026-10-17T09:30:00Z",
    updatedAt: "2026-10-17T10:15:00Z",
    slaTarget: "4 Hours",
    attachments: [
      {
        id: "att-1",
        name: "quiz_blank_error.png",
        size: "380 KB",
        type: "image",
      },
    ],
    comments: [
      {
        id: "c-1",
        author: {
          name: "Godswill Chibueze",
          role: "user",
          title: "Learner",
        },
        content:
          "Attached a screenshot of the blank quiz error. I have tried refreshing and clearing my browser cache but the quiz still doesn't load.",
        timestamp: "2026-10-17T09:30:00Z",
        attachments: [
          {
            id: "att-1",
            name: "quiz_blank_error.png",
            size: "380 KB",
            type: "image",
          },
        ],
      },
      {
        id: "c-2",
        author: {
          name: "Sarah Jenkins",
          role: "agent",
          title: "Student Support Specialist",
          avatar: "SJ",
        },
        content:
          "Hi Godswill, thanks for reporting this! Our technical team identified a session token mismatch on the Module 3 quiz service and pushed a fix. Could you please refresh your browser and click 'Start Quiz' again to confirm it loads?",
        timestamp: "2026-10-17T10:15:00Z",
      },
    ],
  },
  {
    id: "HMT-1018",
    title: "Need invoice receipt for Pro subscription",
    description:
      "I upgraded to Hammet Pro this month and need an official PDF receipt with the transaction details to submit for university reimbursement.",
    category: "billing",
    priority: "low",
    status: "resolved",
    assignedAgent: SUPPORT_AGENTS.billing,
    createdAt: "2026-10-16T14:00:00Z",
    updatedAt: "2026-10-16T15:20:00Z",
    resolvedAt: "2026-10-16T15:20:00Z",
    slaTarget: "24 Hours",
    satisfactionRating: 5,
    attachments: [
      {
        id: "att-2",
        name: "Invoice_INV-2026-0481.pdf",
        size: "185 KB",
        type: "document",
      },
    ],
    comments: [
      {
        id: "c-3",
        author: {
          name: "David Kim",
          role: "agent",
          title: "Billing Support",
          avatar: "DK",
        },
        content:
          "Hello Godswill, I have attached your official PDF invoice (INV-2026-0481). You can also view and download past payment receipts anytime under Settings > Billing.",
        timestamp: "2026-10-16T15:20:00Z",
        attachments: [
          {
            id: "att-2",
            name: "Invoice_INV-2026-0481.pdf",
            size: "185 KB",
            type: "document",
          },
        ],
      },
    ],
  },
  {
    id: "HMT-1009",
    title: "Typo in my certificate name",
    description:
      "My completed AI Foundations certificate displays my name as 'Godswill C.' but I need my full name 'Godswill Chibueze' on the verified certificate.",
    category: "certification",
    priority: "medium",
    status: "resolved",
    assignedAgent: SUPPORT_AGENTS.certification,
    createdAt: "2026-10-15T11:00:00Z",
    updatedAt: "2026-10-15T12:30:00Z",
    resolvedAt: "2026-10-15T12:30:00Z",
    slaTarget: "24 Hours",
    satisfactionRating: 5,
    attachments: [],
    comments: [
      {
        id: "c-4",
        author: {
          name: "Elena Rostova",
          role: "agent",
          title: "Certificates & Credentials",
          avatar: "ER",
        },
        content:
          "Hi Godswill, we have updated your full legal name across our certificate registry. Your updated AI Foundations certificate is now live and available in your Passport tab.",
        timestamp: "2026-10-15T12:30:00Z",
      },
    ],
  },
  {
    id: "HMT-1002",
    title: "Unable to upload final project video",
    description:
      "When uploading my capstone project walkthrough video (a 45MB MP4 file), the progress bar stops at 95% and displays 'Upload failed. Network timeout'.",
    category: "technical",
    priority: "high",
    status: "open",
    assignedAgent: SUPPORT_AGENTS.technical,
    createdAt: "2026-10-17T11:45:00Z",
    updatedAt: "2026-10-17T11:45:00Z",
    slaTarget: "4 Hours",
    attachments: [
      {
        id: "att-3",
        name: "upload_timeout_screen.png",
        size: "520 KB",
        type: "image",
      },
    ],
    comments: [
      {
        id: "c-5",
        author: {
          name: "Godswill Chibueze",
          role: "user",
          title: "Learner",
        },
        content:
          "I have tested my Wi-Fi speed and tried uploading from Chrome and Firefox, but both time out at 95%.",
        timestamp: "2026-10-17T11:45:00Z",
        attachments: [
          {
            id: "att-3",
            name: "upload_timeout_screen.png",
            size: "520 KB",
            type: "image",
          },
        ],
      },
    ],
  },
  {
    id: "HMT-0994",
    title: "Update my account email address",
    description:
      "I will be graduating next month and would like to change my primary account email from my student email to my personal email address.",
    category: "account",
    priority: "low",
    status: "closed",
    assignedAgent: SUPPORT_AGENTS.account,
    createdAt: "2026-10-12T08:00:00Z",
    updatedAt: "2026-10-12T10:00:00Z",
    resolvedAt: "2026-10-12T10:00:00Z",
    slaTarget: "48 Hours",
    satisfactionRating: 5,
    attachments: [],
    comments: [
      {
        id: "c-6",
        author: {
          name: "Devon Reed",
          role: "agent",
          title: "Account Support",
          avatar: "DR",
        },
        content:
          "We sent a security verification link to your new email. Once verified, your primary login will automatically update.",
        timestamp: "2026-10-12T10:00:00Z",
      },
    ],
  },
];

export const useTicketStore = create<TicketStoreState>()(
  persist(
    (set, get) => ({
      tickets: INITIAL_TICKETS,
      selectedTicketId: "HMT-1024",
      filterStatus: "all",
      filterCategory: "all",
      filterPriority: "all",
      searchQuery: "",
      isCreateModalOpen: false,

      setSelectedTicketId: (id) => set({ selectedTicketId: id }),
      setFilterStatus: (filterStatus) => set({ filterStatus }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setIsCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),

      createTicket: ({ title, description, category, priority, attachments = [] }) => {
        const idNumber = Math.floor(1000 + Math.random() * 9000);
        const ticketId = `HMT-${idNumber}`;
        const now = new Date().toISOString();
        const agent = SUPPORT_AGENTS[category] || SUPPORT_AGENTS.general;

        const slaMap: Record<TicketPriority, string> = {
          critical: "1 Hour (Critical SLA Response)",
          high: "4 Hours (High Priority Tier)",
          medium: "24 Hours (Standard Tier)",
          low: "48 Hours (Standard Tier)",
        };

        const newTicket: SupportTicket = {
          id: ticketId,
          title,
          description,
          category,
          priority,
          status: "open",
          assignedAgent: agent,
          createdAt: now,
          updatedAt: now,
          slaTarget: slaMap[priority],
          attachments,
          comments: [
            {
              id: `c-${Date.now()}`,
              author: {
                name: "Godswill Chibueze",
                role: "user",
                title: "Pro Learner",
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

        // Simulate agent auto-acknowledgment after 2.5 seconds
        setTimeout(() => {
          const autoReply: TicketComment = {
            id: `c-${Date.now()}`,
            author: {
              name: agent.name,
              role: "agent",
              title: agent.role,
              avatar: agent.name.split(" ").map((n) => n[0]).join(""),
            },
            content: `Hello Godswill, I'm ${agent.name} from ${agent.department}. We have received your ticket regarding "${title}" and are reviewing it now.`,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            tickets: state.tickets.map((t) =>
              t.id === ticketId
                ? {
                    ...t,
                    status: "in-progress" as TicketStatus,
                    updatedAt: new Date().toISOString(),
                    comments: [...t.comments, autoReply],
                  }
                : t
            ),
          }));
        }, 2500);

        return ticketId;
      },

      addComment: (ticketId, content, attachments = []) => {
        const now = new Date().toISOString();
        const commentId = `c-${Date.now()}`;

        const newComment: TicketComment = {
          id: commentId,
          author: {
            name: "Godswill Chibueze",
            role: "user",
            title: "Pro Learner",
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
                  resolvedAt: status === "resolved" ? now : t.resolvedAt,
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
          selectedTicketId: "HMT-1024",
          filterStatus: "all",
          filterCategory: "all",
          filterPriority: "all",
          searchQuery: "",
          isCreateModalOpen: false,
        });
      },
    }),
    {
      name: "hammet-support-tickets-v2",
    }
  )
);

