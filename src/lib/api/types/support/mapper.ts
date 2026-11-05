import {
  CallbackFormDto,
  CreateSupportTicketDto,
  SupportTicketResponseDto,
  PaginationDto,
} from "./types-dto";
import {
  CallbackForm,
  CreateSupportTicket,
  SupportTicketResponse,
  Pagination,
} from "./types";

export function toSupportTicketResponse(
  dto: SupportTicketResponseDto
): SupportTicketResponse {
  return {
    id: dto.id,
    subject: dto.subject,
    message: dto.message,
    category: dto.category,
    priority: dto.priority,
    status: dto.status,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function fromCreateSupportTicket(
  domain: CreateSupportTicket
): CreateSupportTicketDto {
  return {
    subject: domain.subject.trim(),
    message: domain.message.trim(),
    category: domain.category,
    priority: domain.priority || "medium",
  };
}

export function fromCallbackForm(domain: CallbackForm): CallbackFormDto {
  return {
    school_name: domain.schoolName,
    full_name: domain.fullName,
    email: domain.email,
    role: domain.role,
    phone: domain.phone,
    city: domain.city,
  };
}

export function toCallbackForm(dto: CallbackFormDto): CallbackForm {
  return {
    schoolName: dto.school_name,
    fullName: dto.full_name,
    email: dto.email,
    role: dto.role,
    phone: dto.phone,
    city: dto.city,
  };
}

export function toPagination(model: PaginationDto): Pagination {
  return {
    page: model.page,
    pageSize: model.page_size,
    total: model.total,
    totalPages: model.total_pages,
  };
}
