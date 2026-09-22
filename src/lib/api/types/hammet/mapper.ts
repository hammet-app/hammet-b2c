import { 
    AdminDetails,
    DeactivateSchoolResponse,
    Dispute,
    DisputeReviewPayload,
    Disputes,
    RegisterHammetAdminRequest,
} from "@/lib/api/types/hammet/types";
import { 
    AdminDetailsDto,
    DeactivateSchoolResponseDto,
    DisputeDto,
    DisputeReviewPayloadDto,
    DisputesDto,
    RegisterHammetAdminRequestDto,
} from "@/lib/api/types/hammet/types-dto";
import { toPagination } from "../support";

/**
 * Naming convention:
 *
 * fromXxx(...)
 * Converts frontend/domain models into backend DTOs
 * (camelCase -> snake_case, app shape -> API shape)
 *
 * toXxx(...)
 * Converts backend DTOs into frontend/domain models
 * (snake_case -> camelCase, API shape -> app shape)
 */

export function fromRegisterHammetAdminRequest(model: RegisterHammetAdminRequest): RegisterHammetAdminRequestDto {
    return {
        full_name: model.fullName,
        email: model.email,
        username: model.username,
        scope: model.scope,
        access: model.access
    }
}

function toAdminDetails(dto: AdminDetailsDto): AdminDetails {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        role: dto.role,
        status: dto.status,
        lastLogin: dto.last_login
    }
}

export function toDeactivateSchoolResponse(dto: DeactivateSchoolResponseDto): DeactivateSchoolResponse {
    return {
        schoolId: dto.school_id,
        tier: dto.tier,
        message: dto.message
    }
}


export function fromDisputeReviewPayload(model: DisputeReviewPayload): DisputeReviewPayloadDto {
    return {
        id: model.id,
        review_note: model.reviewNote
    }
}

export function toDispute(dto: DisputeDto): Dispute {
    return {
        id: dto.id,
        studentId: dto.student_id,
        moduleTitle: dto.module_title,
        originalResponse: dto.original_response,
        aiStatus: dto.ai_status,
        aiScore: dto.ai_score,
        studentReview: dto.student_review,
        studentDisputeNote: dto.student_dispute_note,
        disputedAt: dto.disputed_at,
        reviewedBy: dto.reviewed_by,
        reviewed: dto.reviewed,
        reviewNote: dto.review_note
    }
}

export function toDisputes(dto: DisputesDto): Disputes {
    return {
        disputes: dto.disputes.map(toDispute),
        pagination: toPagination(dto.pagination)
    }
}
