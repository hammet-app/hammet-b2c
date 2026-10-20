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
  published?: boolean;
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

// GET /api/v1/hammet/ai-schools/{ai_school_id}/courses
export type HammetAiSchoolCoursesResponse = {
  aiSchool: AiSchool;
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

export type CreateAiSchoolResponse = {
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
export type UpdateAiSchoolRequest = CreateAiSchoolRequest;

export type UpdateAiSchoolResponse = CreateAiSchoolResponse;

// CREATE AI COURSE
// ============================================================

// POST /api/v1/hammet/create/ai_course
export type CreateAiCourseRequest = {
  title: string;
  description: string;
  position: number;
  aiSchoolId: string;
  price: number;
  published: boolean;
};

export type CreateAiCourseResponse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  aiSchoolId: string;
  price: number;
  published: boolean;
};
