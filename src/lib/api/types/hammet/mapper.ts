import { 
    RegisterHammetAdminRequest,
} from "@/lib/api/types/hammet/types";
import { 
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
