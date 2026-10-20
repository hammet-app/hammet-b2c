import {
    AiSchool,
    AiSchoolCourse,
    AiSchoolCoursesResponse,
    AiSchoolsResponse,
    CreateAiCourseRequest,
    CreateAiCourseResponse,
    CreateAiSchoolRequest,
    CreateAiSchoolResponse,
    HammetAiSchoolCoursesResponse,
} from "@/lib/api/types/ai-schools/types";
import {
    AiSchoolCourseDto,
    AiSchoolCoursesResponseDto,
    AiSchoolDto,
    AiSchoolsResponseDto,
    CreateAiCourseRequestDto,
    CreateAiCourseResponseDto,
    CreateAiSchoolRequestDto,
    CreateAiSchoolResponseDto,
    HammetAiSchoolCoursesResponseDto,
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
        published: dto.published,
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

export function toHammetAiSchoolCoursesResponse(dto: HammetAiSchoolCoursesResponseDto): HammetAiSchoolCoursesResponse {
    return {
        aiSchool: toAiSchool(dto.ai_school),
        courses: dto.courses.map(toAiSchoolCourse),
    };
}

export function fromCreateAiSchoolRequest(req: CreateAiSchoolRequest): CreateAiSchoolRequestDto {
    return {
        name: req.name,
        description: req.description,
        price: req.price,
        published: req.published,
    };
}

export function toCreateAiSchoolResponse(dto: CreateAiSchoolResponseDto): CreateAiSchoolResponse {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        published: dto.published,
    };
}

export const fromUpdateAiSchoolRequest = fromCreateAiSchoolRequest;

export const toUpdateAiSchoolResponse = toCreateAiSchoolResponse;

export function fromCreateAiCourseRequest(req: CreateAiCourseRequest): CreateAiCourseRequestDto {
    return {
        title: req.title,
        description: req.description,
        position: req.position,
        ai_school_id: req.aiSchoolId,
        price: req.price,
        published: req.published,
    };
}

export function toCreateAiCourseResponse(dto: CreateAiCourseResponseDto): CreateAiCourseResponse {
    return {
        id: dto.id,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        position: dto.position,
        aiSchoolId: dto.ai_school_id,
        price: dto.price,
        published: dto.published,
    };
}
