// ============================================================
// SUPPORT & TICKETS API CONTRACT DTOs (FastAPI Backend)
// ============================================================

export type TicketCategoryDto =
  | "technical"
  | "billing"
  | "account"
  | "courseware"
  | "certification"
  | "general";

export type TicketPriorityDto = "low" | "medium" | "high" | "critical";

export interface CreateSupportTicketDto {
  subject: string;
  message: string;
  category: TicketCategoryDto;
  priority?: TicketPriorityDto;
  attachments?: string[] | null;
}

export interface SupportTicketResponseDto {
  id: string;
  subject: string;
  message: string;
  category: TicketCategoryDto;
  priority: TicketPriorityDto;
  status: string;
  created_at: string;
  updated_at: string;
  attachments?: string[] | null;
}

export type SupportTicketUploadResponseDto = {
  signed_url: string;
  signedUrl: string;
  token: string;
  path: string;
  public_url: string;
  content_type: string;
};

// POST /callback
export type CallbackFormDto = {
  school_name: string;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  city: string;
};

export type PaginationDto = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};
