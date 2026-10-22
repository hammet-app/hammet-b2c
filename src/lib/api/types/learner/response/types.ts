export interface AISchoolEntitlement {
  id: string;
  name: string;
  description: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
}

export interface CourseEntitlement {
  id: string;
  title: string;
  slug: string;
  description: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
  position: number;
  aiSchoolId: string;
}

export interface EntitlementResponse {
  schools: AISchoolEntitlement[] | null;
  courses: CourseEntitlement[] | null;
}

// ============================================================
// AI SCHOOL COURSES
// ============================================================

// GET /api/v1/learner/courses/{course_id}

export type PublishedModule = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
  description: string;
  position: number;
  masterclass: string | null;
};

export type PublishedCourse = {
  id: string;
  title: string;
  slug: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
  description: string;
  aiSchoolId: string;
  position: number;
  price: number;
  modules: PublishedModule[];
};
