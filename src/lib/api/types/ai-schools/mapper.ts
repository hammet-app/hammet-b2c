import {
  AddAiQuizRequest,
  AiModule,
  AiProject,
  AiQuiz,
  AiResource,
  AiSchool,
  AiSchoolCourse,
  AiSchoolCoursesResponse,
  AiSchoolsResponse,
  CreateAiCourseRequest,
  CreateAiCourseResponse,
  CreateAiModuleRequest,
  CreateAiProjectRequest,
  CreateAiResourceRequest,
  CreateAiSchoolRequest,
  CreateAiSchoolResponse,
  HammetAiSchoolCoursesResponse,
  UpdateAiCourseRequest,
  UpdateAiCourseResponse,
  UpdateAiModuleRequest,
  UpdateAiProjectRequest,
  UpdateAiResourceRequest,
  UpdateAiQuizRequest,
  HammetAiModuleContent,
  UpdateAiSchoolRequest,
  UpdateAiSchoolResponse,
} from "@/lib/api/types/ai-schools/types";
import {
  AddAiQuizRequestDto,
  AiModuleDto,
  AiProjectDto,
  AiQuizDto,
  AiResourceDto,
  AiSchoolCourseDto,
  AiSchoolCoursesResponseDto,
  AiSchoolDto,
  HammetAiSchoolDto,
  HammetAiSchoolCourseDto,
  AiSchoolsResponseDto,
  CreateAiCourseRequestDto,
  CreateAiCourseResponseDto,
  CreateAiModuleRequestDto,
  CreateAiProjectRequestDto,
  CreateAiResourceRequestDto,
  CreateAiSchoolRequestDto,
  CreateAiSchoolResponseDto,
  HammetAiSchoolCoursesResponseDto,
  UpdateAiCourseRequestDto,
  UpdateAiCourseResponseDto,
  UpdateAiModuleRequestDto,
  UpdateAiProjectRequestDto,
  UpdateAiResourceRequestDto,
  EditAiQuizRequestDto,
  HammetAiModuleContentDto,
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
    published: dto.published,
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
    published: dto.published,
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
    aiSchool: toHammetAiSchool(dto.ai_school),
    courses: dto.courses.map(toHammetAiSchoolCourse),
  };
}

function toHammetAiSchool(dto: HammetAiSchoolDto): AiSchool {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    published: dto.published,
    isEnrolled: false,
    isEntitled: false,
    hasFinished: false,
  };
}

function toHammetAiSchoolCourse(dto: HammetAiSchoolCourseDto): AiSchoolCourse {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    aiSchoolId: dto.ai_school_id,
    position: dto.position,
    price: dto.price,
    published: dto.published,
    isEnrolled: false,
    isEntitled: false,
    hasFinished: false,
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
    projects: (dto.projects ?? []).map(toAiProject),
    quizzes: dto.quizzes ?? [],
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
    projects: req.projects?.map(fromCreateAiProjectRequest),
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
    id: dto.id,
    moduleId: dto.module_id,
    title: dto.title,
    resourceType: dto.resource_type,
    url: dto.url,
    position: dto.position,
  };
}

export function fromCreateAiProjectRequest(
  req: CreateAiProjectRequest,
): CreateAiProjectRequestDto {
  return {
    title: req.title,
    module_id: req.moduleId,
    description: req.description,
    instructions: req.instructions,
    position: req.position,
  };
}

export function toAiProject(dto: AiProjectDto): AiProject {
  return {
    id: dto.id,
    moduleId: dto.module_id,
    title: dto.title,
    description: dto.description,
    instructions: dto.instructions,
    position: dto.position,
  };
}

export function toHammetAiModuleContent(
  dto: HammetAiModuleContentDto,
): HammetAiModuleContent {
  const { quizzes, ...moduleDto } = dto;
  return {
    ...toAiModule({ ...moduleDto, quizzes: [] }),
    resources: dto.resources.map(toAiResource),
    projects: dto.projects.map(toAiProject),
    quizzes: quizzes.map(toAiQuiz),
  };
}

export function fromUpdateAiResourceRequest(
  req: UpdateAiResourceRequest,
): UpdateAiResourceRequestDto {
  return {
    title: req.title,
    resource_type: req.resourceType,
    url: req.url,
    position: req.position,
  };
}

export function fromUpdateAiProjectRequest(
  req: UpdateAiProjectRequest,
): UpdateAiProjectRequestDto {
  return {
    title: req.title,
    description: req.description,
    instructions: req.instructions,
    position: req.position,
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
    duration_minutes: req.durationMinutes,
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
    position: dto.position,
    passingScore: dto.passing_score,
    isExam: dto.is_exam,
    durationMinutes: dto.duration_minutes,
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
          isCorrect: option.is_correct,
      })),
    })),
  };
}

export function fromUpdateAiQuizRequest(req: UpdateAiQuizRequest): EditAiQuizRequestDto {
  return {
    title: req.title,
    description: req.description,
    position: req.position,
    passing_score: req.passingScore,
    is_exam: req.isExam,
    duration_minutes: req.durationMinutes,
    questions: req.questions.map((question) => ({
      question: question.question,
      position: question.position,
      id: question.id,
      options: question.options.map((option) => ({
        text: option.text,
        position: option.position,
        is_correct: option.isCorrect,
        id: option.id,
      })),
    })),
  };
}
