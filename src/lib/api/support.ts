import { apiClient, ApiError } from "@/lib/api/api-client";
import {
  CreateSupportTicket,
  SupportTicketResponse,
  SupportTicketResponseDto,
  fromCreateSupportTicket,
  toSupportTicketResponse,
  CallbackForm,
  fromCallbackForm,
} from "@/lib/api/types/support";

export type {
  TicketCategory,
  TicketPriority,
  CreateSupportTicket,
  SupportTicketResponse,
} from "@/lib/api/types/support";

// Backward compatibility alias for DTO
export type CreateSupportTicketDto = CreateSupportTicket;
export type SupportTicketDto = SupportTicketResponse;

export interface SupportApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const supportApi = {
  /**
   * Submit a new support ticket to the backend.
   * Official FastAPI Backend Endpoint: POST /api/v1/learner/tickets
   * Validated strictly against CreateSupportTicket schema: { subject, message, category, priority }
   * Dispatches automated email notification to support@hammetedu.com and records ticket.
   */
  createTicket: async (
    payload: CreateSupportTicket,
    token?: string | null
  ): Promise<SupportApiResponse<SupportTicketResponse>> => {
    try {
      const dtoPayload = fromCreateSupportTicket(payload);
      const response = await apiClient.post<SupportTicketResponseDto>(
        "/learner/tickets",
        dtoPayload,
        token,
        { skipSessionExpired: true }
      );

      return {
        success: true,
        data: toSupportTicketResponse(response),
      };
    } catch (err: unknown) {
      let msg =
        err instanceof Error
          ? err.message
          : "Failed to submit ticket to support desk. Please try again.";

      if (err instanceof ApiError) {
        if (err.status === 401) {
          msg = "Your session has expired. Please sign in again and resubmit your ticket.";
        } else if (err.status === 403) {
          msg = "This account is not allowed to create support tickets.";
        } else if (err.status === 422) {
          msg =
            "Some ticket details are invalid. Check the subject, message, category, and priority.";
        }
      }

      return {
        success: false,
        error: msg,
      };
    }
  },
};

// Legacy callback export for backwards compatibility
export async function sendCallback(body: CallbackForm): Promise<boolean> {
  return apiClient.post("/callback", fromCallbackForm(body));
}
