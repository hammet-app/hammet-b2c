import { 
    ProfileOnboardingDto,
    StudentProfileDto, 

} from "@/lib/api/types/learner/types-dto";
import {
    ProfileOnboarding,
    StudentProfile, 
} from "@/lib/api/types/learner/types";

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

export function toStudentProfile(dto: StudentProfileDto): StudentProfile {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        classLevel: dto.class_level,
        classArm: dto.class_arm,
        schoolId: dto.school_id,
        schoolName: dto.school_name,
        roles: dto.roles,
        status: dto.status,
        googleId: dto.google_id,
        hasPinSet: dto.has_pin_set,
        createdAt: dto.created_at
    }
}

