export interface AISchoolEntitlementDto {
  id: string;
  name: string;
  description: string;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
  price: number;
}

export interface CourseEntitlementDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
  position: number;
  ai_school_id: string;
  price: number;
}

export interface EntitlementResponseDto {
  schools: AISchoolEntitlementDto[] | null;
  courses: CourseEntitlementDto[] | null;
}

// ============================================================
// AI SCHOOL COURSES
// ============================================================

// GET /api/v1/learner/courses/{course_id}

export type PublishedModuleDto = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
  position: number;
  masterclass: string | null;
};

export type PublishedCourseDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  is_entitled: boolean;
  is_enrolled: boolean;
  has_finished: boolean;
  position: number;
  ai_school_id: string;
  price: number;
  modules: PublishedModuleDto[];
};
