import {
    RegisterHammetAdminRequest,
    HammetAdmin,
    HammetAdminsResponse,
    EditHammetAdminRequest,
} from "@/lib/api/types/hammet/types";
import {
    RegisterHammetAdminRequestDto,
    HammetAdminDto,
    HammetAdminsResponseDto,
    EditHammetAdminRequestDto,
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

export function toHammetAdmin(dto: HammetAdminDto): HammetAdmin {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        role: dto.role,
        scope: dto.scope,
        access: dto.access,
        status: dto.status,
        createdAt: dto.created_at,
    }
}

export function toHammetAdminsResponse(dto: HammetAdminsResponseDto): HammetAdminsResponse {
    return {
        admins: dto.admins.map(toHammetAdmin),
        pagination: toPagination(dto.pagination),
    }
}

// The backend rejects unknown fields, so only the fields that are set are sent.
export function fromEditHammetAdminRequest(model: EditHammetAdminRequest): EditHammetAdminRequestDto {
    const dto: EditHammetAdminRequestDto = {}
    if (model.scope !== undefined) dto.scope = model.scope
    if (model.access !== undefined) dto.access = model.access
    return dto
}
