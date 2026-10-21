import { apiClient } from "@/lib/api/api-client";
import { CallbackForm } from "@/lib/api/types/support/types";

// ── Official Support Ticket API Contract ─────────────────────────────────────

export type TicketCategory =
  | "technical"
  | "billing"
  | "account"
  | "courseware"
  | "certification"
  | "general";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface CreateSupportTicketDto {
  subject: string;
  message: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface SupportTicketDto {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupportApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const supportApi = {
  /**
   * Submit a new support ticket to the backend.
   * Endpoint: POST /api/v1/learner/support/tickets
   * The backend persists the ticket and dispatches an email to support@hammetedu.com.
   */
  createTicket: async (
    payload: CreateSupportTicketDto,
    token?: string | null
  ): Promise<SupportApiResponse<SupportTicketDto>> => {
    try {
      const response = await apiClient.post<SupportTicketDto>(
        "/learner/support/tickets",
        {
          subject: payload.subject.trim(),
          message: payload.message.trim(),
          category: payload.category,
          priority: payload.priority || "medium",
        },
        token,
        { skipSessionExpired: true }
      );

      return {
        success: true,
        data: response,
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit ticket to support desk. Please try again.";
      return {
        success: false,
        error: msg,
      };
    }
  },
};

// Legacy callback export for backwards compatibility
export async function sendCallback(body: CallbackForm): Promise<boolean> {
  return apiClient.post("/callback", body);
}