import { 
    ProfileOnboardingDto,
} from "@/lib/api/types/payment/request/types-dto";
import {
    ProfileOnboarding,
} from "@/lib/api/types/payment/request/types";

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
export function fromProfileOnboarding(model: ProfileOnboarding): ProfileOnboardingDto {
    return {
        learning_mode: model.learningMode,
        interests: model.interests
    }
}