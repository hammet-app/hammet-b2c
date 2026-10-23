import {
  CourseEntitlement,
  AISchoolEntitlement,
  EntitlementResponse,
  PublishedCourse,
  PublishedModule,
  CourseModuleResource,
  CourseModuleProject,
} from "@/lib/api/types/learner/response/types";

import {
  PublishedCourseDto,
  PublishedModuleDto,
  CourseEntitlementDto,
  AISchoolEntitlementDto,
  EntitlementResponseDto,
  CourseModuleResourceDto,
  CourseModuleProjectDto,
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

export function toCourseModuleResource(
  dto: CourseModuleResourceDto,
): CourseModuleResource {
  return {
    id: dto.id,
    title: dto.title,
    resourceType: dto.resource_type,
    url: dto.url,
    position: dto.position,
  };
}

export function toCourseModuleProject(
  dto: CourseModuleProjectDto,
): CourseModuleProject {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    instructions: dto.instructions,
    position: dto.position,
  };
}

export function toPublishedModule(dto: PublishedModuleDto): PublishedModule {
  return {
    id: dto.id,
    courseId: dto.course_id,
    title: dto.title,
    slug: dto.slug,
    isEntitled: dto.is_entitled,
    isEnrolled: dto.is_enrolled,
    hasFinished: dto.has_finished,
    description: dto.description,
    position: dto.position,
    masterclass: dto.masterclass,
    resources: dto.resources ? dto.resources.map(toCourseModuleResource) : [],
    projects: dto.projects ? dto.projects.map(toCourseModuleProject) : [],
  };
}

export function toPublishedCourse(dto: PublishedCourseDto): PublishedCourse {
  return {
    id: dto.id,
    aiSchoolId: dto.ai_school_id,
    title: dto.title,
    slug: dto.slug,
    isEntitled: dto.is_entitled,
    isEnrolled: dto.is_enrolled,
    hasFinished: dto.has_finished,
    description: dto.description,
    position: dto.position,
    price: dto.price,
    modules: dto.modules ? dto.modules.map(toPublishedModule) : [],
  };
}
