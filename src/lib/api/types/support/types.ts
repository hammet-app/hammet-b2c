// ============================================================
// SUPPORT & TICKETS DOMAIN TYPES
// ============================================================

export type TicketCategory =
  | "technical"
  | "billing"
  | "account"
  | "courseware"
  | "certification"
  | "general";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface CreateSupportTicket {
  subject: string;
  message: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface SupportTicketResponse {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// POST /callback
export type CallbackForm = {
  schoolName: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  city: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
