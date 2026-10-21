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
