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

// PATCH /api/v1/hammet/ai-schools/{ai_school_id}  (route unconfirmed)
export type UpdateAiSchoolRequestDto = CreateAiSchoolRequestDto;

export type UpdateAiSchoolResponseDto = CreateAiSchoolResponseDto;

// CREATE AI COURSE
// ============================================================

// POST /api/v1/hammet/create/ai_course
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
};
