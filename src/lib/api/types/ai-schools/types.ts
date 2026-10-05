import { Pagination } from "../support";

// ============================================================
// AI SCHOOLS
// ============================================================

// GET /api/v1/learner/ai-schools
export type AiSchool = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type AiSchoolsResponse = {
  aiSchools: AiSchool[];
  pagination: Pagination;
};

// ============================================================
// AI SCHOOL COURSES
// ============================================================

// GET /api/v1/learner/ai-schools/{ai_school_id}/courses
export type AiSchoolCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  aiSchoolId: string;
  price: number;
};

export type AiSchoolCoursesResponse = {
  courses: AiSchoolCourse[];
};

// ============================================================
// CREATE AI SCHOOL
// ============================================================

// POST /api/v1/hammet/create/ai_school
export type CreateAiSchoolRequest = {
  name: string;
  description: string;
  price: number;
  published: boolean;
};
