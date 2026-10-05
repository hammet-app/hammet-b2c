import {
    AiSchool,
    AiSchoolCourse,
    AiSchoolCoursesResponse,
    AiSchoolsResponse,
} from "@/lib/api/types/ai-schools/types";
import {
    AiSchoolCourseDto,
    AiSchoolCoursesResponseDto,
    AiSchoolDto,
    AiSchoolsResponseDto,
} from "@/lib/api/types/ai-schools/types-dto";
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

export function toAiSchool(dto: AiSchoolDto): AiSchool {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
    };
}

export function toAiSchoolsResponse(dto: AiSchoolsResponseDto): AiSchoolsResponse {
    return {
        aiSchools: dto.ai_schools.map(toAiSchool),
        pagination: toPagination(dto.pagination),
    };
}

export function toAiSchoolCourse(dto: AiSchoolCourseDto): AiSchoolCourse {
    return {
        id: dto.id,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        aiSchoolId: dto.ai_school_id,
        price: dto.price,
    };
}

export function toAiSchoolCoursesResponse(dto: AiSchoolCoursesResponseDto): AiSchoolCoursesResponse {
    return {
        courses: dto.courses.map(toAiSchoolCourse),
    };
}
