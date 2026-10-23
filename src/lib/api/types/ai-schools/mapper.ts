import {
  AddAiQuizRequest,
  AiModule,
  AiQuiz,
  AiResource,
  AiSchool,
  AiSchoolCourse,
  AiSchoolCoursesResponse,
  AiSchoolsResponse,
  CreateAiCourseRequest,
  CreateAiCourseResponse,
  CreateAiModuleRequest,
  CreateAiResourceRequest,
  CreateAiSchoolRequest,
  CreateAiSchoolResponse,
  HammetAiSchoolCoursesResponse,
  UpdateAiCourseRequest,
  UpdateAiCourseResponse,
  UpdateAiModuleRequest,
  UpdateAiSchoolRequest,
  UpdateAiSchoolResponse,
} from "@/lib/api/types/ai-schools/types";
import {
  AddAiQuizRequestDto,
  AiModuleDto,
  AiQuizDto,
  AiResourceDto,
  AiSchoolCourseDto,
  AiSchoolCoursesResponseDto,
  AiSchoolDto,
  AiSchoolsResponseDto,
  CreateAiCourseRequestDto,
  CreateAiCourseResponseDto,
  CreateAiModuleRequestDto,
  CreateAiResourceRequestDto,
  CreateAiSchoolRequestDto,
  CreateAiSchoolResponseDto,
  HammetAiSchoolCoursesResponseDto,
  UpdateAiCourseRequestDto,
  UpdateAiCourseResponseDto,
  UpdateAiModuleRequestDto,
  UpdateAiSchoolRequestDto,
  UpdateAiSchoolResponseDto,
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
    isEnrolled: dto.is_enrolled,
    isEntitled: dto.is_entitled,
    hasFinished: dto.has_finished,
  };
}

export function toAiSchoolsResponse(
  dto: AiSchoolsResponseDto,
): AiSchoolsResponse {
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
    position: dto.position,
    price: dto.price,
    isEnrolled: dto.is_enrolled,
    isEntitled: dto.is_entitled,
    hasFinished: dto.has_finished,
  };
}

export function toAiSchoolCoursesResponse(
  dto: AiSchoolCoursesResponseDto,
): AiSchoolCoursesResponse {
  return {
    courses: dto.courses.map(toAiSchoolCourse),
  };
}

export function toHammetAiSchoolCoursesResponse(
  dto: HammetAiSchoolCoursesResponseDto,
): HammetAiSchoolCoursesResponse {
  return {
    aiSchool: toAiSchool(dto.ai_school),
    courses: dto.courses.map(toAiSchoolCourse),
  };
}

export function fromCreateAiSchoolRequest(
  req: CreateAiSchoolRequest,
): CreateAiSchoolRequestDto {
  return {
    name: req.name,
    description: req.description,
    price: req.price,
    published: req.published,
  };
}

export function toCreateAiSchoolResponse(
  dto: CreateAiSchoolResponseDto,
): CreateAiSchoolResponse {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    published: dto.published,
  };
}

export function fromUpdateAiSchoolRequest(
  id: string,
  req: UpdateAiSchoolRequest,
): UpdateAiSchoolRequestDto {
  return {
    id,
    name: req.name,
    description: req.description,
    price: req.price,
    published: req.published,
    courses: req.courses?.map(fromCreateAiCourseRequest),
  };
}

export function toUpdateAiSchoolResponse(
  dto: UpdateAiSchoolResponseDto,
): UpdateAiSchoolResponse {
  return {
    aiSchool: toCreateAiSchoolResponse(dto.ai_school),
    courses: (dto.courses ?? []).map(toCreateAiCourseResponse),
  };
}

export function fromCreateAiCourseRequest(
  req: CreateAiCourseRequest,
): CreateAiCourseRequestDto {
  return {
    title: req.title,
    description: req.description,
    position: req.position,
    ai_school_id: req.aiSchoolId,
    price: req.price,
    published: req.published,
  };
}

export function toCreateAiCourseResponse(
  dto: CreateAiCourseResponseDto,
): CreateAiCourseResponse {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    position: dto.position,
    aiSchoolId: dto.ai_school_id,
    price: dto.price,
    published: dto.published,
    modules: dto.modules ? dto.modules.map(toAiModule) : null,
  };
}

export function fromUpdateAiCourseRequest(
  id: string,
  req: UpdateAiCourseRequest,
): UpdateAiCourseRequestDto {
  return {
    id,
    title: req.title,
    description: req.description,
    position: req.position,
    price: req.price,
    published: req.published,
    modules: req.modules?.map(fromCreateAiModuleRequest),
  };
}

export function toUpdateAiCourseResponse(
  dto: UpdateAiCourseResponseDto,
): UpdateAiCourseResponse {
  return {
    course: toCreateAiCourseResponse(dto.course),
    modules: (dto.modules ?? []).map(toAiModule),
  };
}

export function fromCreateAiModuleRequest(
  req: CreateAiModuleRequest,
): CreateAiModuleRequestDto {
  return {
    title: req.title,
    description: req.description,
    course_id: req.courseId,
    position: req.position,
    masterclass: req.masterclass,
  };
}

export function toAiModule(dto: AiModuleDto): AiModule {
  return {
    id: dto.id,
    courseId: dto.course_id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    position: dto.position,
    masterclass: dto.masterclass,
    resources: (dto.resources ?? []).map(toAiResource),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function fromUpdateAiModuleRequest(
  id: string,
  req: UpdateAiModuleRequest,
): UpdateAiModuleRequestDto {
  return {
    id,
    title: req.title,
    description: req.description,
    position: req.position,
    masterclass: req.masterclass,
    resources: req.resources?.map(fromCreateAiResourceRequest),
  };
}

export function fromCreateAiResourceRequest(
  req: CreateAiResourceRequest,
): CreateAiResourceRequestDto {
  return {
    title: req.title,
    resource_type: req.resourceType,
    module_id: req.moduleId,
    url: req.url,
    position: req.position,
  };
}

export function toAiResource(dto: AiResourceDto): AiResource {
  return {
    title: dto.title,
    resourceType: dto.resource_type,
    url: dto.url,
    position: dto.position,
  };
}

export function fromAddAiQuizRequest(
  req: AddAiQuizRequest,
): AddAiQuizRequestDto {
  return {
    title: req.title,
    description: req.description,
    position: req.position,
    passing_score: req.passingScore,
    is_exam: req.isExam,
    questions: req.questions.map((question) => ({
      question: question.question,
      position: question.position,
      options: question.options.map((option) => ({
        text: option.text,
        position: option.position,
        is_correct: option.isCorrect,
      })),
    })),
  };
}

export function toAiQuiz(dto: AiQuizDto): AiQuiz {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    isExam: dto.is_exam,
    questions: dto.questions.map((question) => ({
      id: question.id,
      quizId: question.quiz_id,
      question: question.question,
      position: question.position,
      options: question.options.map((option) => ({
        id: option.id,
        questionId: option.question_id,
        text: option.text,
        position: option.position,
      })),
    })),
  };
}
