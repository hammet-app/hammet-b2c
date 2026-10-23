import { PaginationDto } from "../support";

// ============================================================
// AI SCHOOLS
// ============================================================

// GET /api/v1/learner/ai-schools
export type AiSchoolDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
};

export type AiSchoolsResponseDto = {
  ai_schools: AiSchoolDto[];
  pagination: PaginationDto;
};

// ============================================================
// AI SCHOOL COURSES
// ============================================================

// GET /api/v1/learner/ai-schools/{ai_school_id}/courses
export type AiSchoolCourseDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  ai_school_id: string;
  position: number;
  price: number;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
};

export type AiSchoolCoursesResponseDto = {
  courses: AiSchoolCourseDto[];
};

// GET /api/v1/hammet/ai-schools/{ai_school_id}/courses
export type HammetAiSchoolCoursesResponseDto = {
  ai_school: AiSchoolDto;
  courses: AiSchoolCourseDto[];
};

// ============================================================
// CREATE AI SCHOOL
// ============================================================

// POST /api/v1/hammet/create/ai_school
export type CreateAiSchoolRequestDto = {
  name: string;
  description: string;
  price: number;
  published: boolean;
};

export type CreateAiSchoolResponseDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  published?: boolean;
};

// ============================================================
// UPDATE AI SCHOOL
// ============================================================

// PATCH /api/v1/hammet/edit/ai-school/{ai_school_id}
export type UpdateAiSchoolRequestDto = Partial<CreateAiSchoolRequestDto> & {
  id: string;
  courses?: CreateAiCourseRequestDto[];
};

export type UpdateAiSchoolResponseDto = {
  ai_school: CreateAiSchoolResponseDto;
  courses: CreateAiCourseResponseDto[] | null;
};

// ============================================================
// CREATE AI COURSE
// ============================================================

// Sent through PATCH /api/v1/hammet/edit/ai-school/{ai_school_id} as courses[]
export type CreateAiCourseRequestDto = {
  title: string;
  description: string;
  position: number;
  ai_school_id: string;
  price: number;
  published: boolean;
};

export type CreateAiCourseResponseDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  ai_school_id: string;
  price: number;
  published: boolean;
  modules: AiModuleDto[] | null;
};

// ============================================================
// UPDATE AI COURSE
// ============================================================

// PATCH /api/v1/hammet/edit/ai-courses/{course_id}
export type UpdateAiCourseRequestDto = Partial<
  Pick<
    CreateAiCourseRequestDto,
    "title" | "description" | "position" | "price" | "published"
  >
> & {
  id: string;
  modules?: CreateAiModuleRequestDto[];
};

export type UpdateAiCourseResponseDto = {
  course: CreateAiCourseResponseDto;
  modules: AiModuleDto[] | null;
};

// ============================================================
// AI MODULES
// ============================================================

export type CreateAiModuleRequestDto = {
  title: string;
  description: string;
  course_id: string;
  position: number;
  masterclass?: string;
};

export type AiModuleDto = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  masterclass: string | null;
  resources: AiResourceDto[] | null;
  created_at: string;
  updated_at: string | null;
};

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}
export type UpdateAiModuleRequestDto = Partial<
  Pick<
    CreateAiModuleRequestDto,
    "title" | "description" | "position" | "masterclass"
  >
> & {
  id: string;
  resources?: CreateAiResourceRequestDto[];
};

// ============================================================
// AI RESOURCES
// ============================================================

export type CreateAiResourceRequestDto = {
  title: string;
  resource_type: "document" | "article" | "link" | "video";
  module_id: string;
  url: string;
  position: number;
};

export type AiResourceDto = {
  title: string;
  resource_type: string;
  url: string;
  position: number;
};

// ============================================================
// AI QUIZZES
// ============================================================

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}/quiz/add
export type AddAiQuizRequestDto = {
  title: string;
  description: string;
  position: number;
  passing_score: number;
  is_exam: boolean;
  questions: {
    question: string;
    position: number;
    options: { text: string; position: number; is_correct: boolean }[];
  }[];
};

export type AiQuizDto = {
  id: string;
  title: string;
  description: string;
  is_exam: boolean;
  questions: {
    id: string;
    quiz_id: string;
    question: string;
    position: number;
    options: {
      id: string;
      question_id: string;
      text: string;
      position: number;
    }[];
  }[];
};
