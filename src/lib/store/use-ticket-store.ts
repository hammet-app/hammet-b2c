import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus =
  | "open"
  | "in-progress"
  | "pending"
  | "resolved"
  | "closed";
export type TicketCategory =
  | "technical"
  | "billing"
  | "account"
  | "courseware"
  | "certification"
  | "general";

export const HAMMET_SUPPORT_EMAIL = "support@hammetedu.com";

/**
 * Mirrors the backend `SupportTicketResponse` schema exactly.
 *
 * Contract: POST /api/v1/learner/tickets
 * The backend only supports creating a ticket — there is no list, detail,
 * comment, or status-update endpoint. This model therefore contains only the
 * fields the backend actually returns.
 */
export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

interface TicketStoreState {
  /**
   * A browser-local cache of tickets created by this learner. It is populated
   * only from successful backend responses, never from seeded demo data.
   */
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

  /** Cache a ticket that the backend has already created successfully. */
  addTicket: (ticket: SupportTicket) => void;
  resetToDefaults: () => void;
}

const DEFAULT_FILTERS = {
  filterStatus: "all",
  filterCategory: "all",
  filterPriority: "all",
  searchQuery: "",
  isCreateModalOpen: false,
} as const;

export const useTicketStore = create<TicketStoreState>()(
  persist(
    (set) => ({
      tickets: [],
      selectedTicketId: null,
      ...DEFAULT_FILTERS,

      setSelectedTicketId: (id) => set({ selectedTicketId: id }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

      addTicket: (ticket) => {
        set((state) => ({
          tickets: [
            ticket,
            ...state.tickets.filter((existing) => existing.id !== ticket.id),
          ],
          selectedTicketId: ticket.id,
        }));
      },

      resetToDefaults: () => {
        set({
          tickets: [],
          selectedTicketId: null,
          ...DEFAULT_FILTERS,
        });
      },
    }),
    {
      name: "hammet-support-tickets-v4",
      version: 2,
      // Only cache the tickets the backend created. Transient UI state such as
      // the open modal or active filters must not survive a reload.
      partialize: (state) => ({ tickets: state.tickets }),
      // Migrate from v1 (which stored full state including UI) to v2 (tickets only)
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 || version === 1) {
          // v1 stored full state with UI fields; extract only tickets array
          const oldState = persistedState as {
            state?: { tickets?: SupportTicket[] };
            tickets?: SupportTicket[];
          };
          const tickets = oldState?.state?.tickets ?? oldState?.tickets ?? [];
          return { tickets, ...DEFAULT_FILTERS, selectedTicketId: null };
        }
        return persistedState as {
          tickets: SupportTicket[];
          selectedTicketId: string | null;
          filterStatus: string;
          filterCategory: string;
          filterPriority: string;
          searchQuery: string;
          isCreateModalOpen: boolean;
        };
      },
    }
  )
);
