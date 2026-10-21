import {
  CourseEntitlement,
  AISchoolEntitlement,
  EntitlementResponse,
} from "@/lib/api/types/learner/response/types";

import {
  CourseEntitlementDto,
  AISchoolEntitlementDto,
  EntitlementResponseDto,
} from "@/lib/api/types/learner/response/types-dto";

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

function toCourseEntitlement(dto: CourseEntitlementDto): CourseEntitlement {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    isEntitled: dto.is_entitled,
    isEnrolled: dto.is_enrolled,
    hasFinished: dto.has_finished,
    position: dto.position,
    aiSchoolId: dto.ai_school_id,
  };
}

function toAISchoolEntitlement(
  dto: AISchoolEntitlementDto,
): AISchoolEntitlement {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    isEntitled: dto.is_entitled,
    isEnrolled: dto.is_enrolled,
    hasFinished: dto.has_finished,
  };
}

export function toEntitlementResponse(
  dto: EntitlementResponseDto,
): EntitlementResponse {
  return {
    schools: dto.schools ? dto.schools.map(toAISchoolEntitlement) : null,
    courses: dto.courses ? dto.courses.map(toCourseEntitlement) : null,
  };
}
