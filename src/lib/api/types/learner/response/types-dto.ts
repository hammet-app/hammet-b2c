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

export type CourseModuleResourceDto = {
  id: string;
  title: string;
  resource_type: string;
  url: string;
  position: number;
};

export type CourseModuleProjectDto = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  position: number;
};

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
  resources?: CourseModuleResourceDto[];
  projects?: CourseModuleProjectDto[];
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

// ============================================================
// LEARNER MODULE QUIZ
// ============================================================

// GET /api/v1/learner/modules/{module_id}/quiz

export type QuizOptionResponseDto = {
  id: string;
  question_id: string;
  text: string;
  position: number;
};

export type QuizQuestionResponseDto = {
  id: string;
  quiz_id: string;
  question: string;
  position: number;
  options: QuizOptionResponseDto[];
};

export type LearnerQuizResponseDto = {
  id: string;
  title: string;
  description: string;
  is_exam: boolean;
  questions: QuizQuestionResponseDto[];
};

