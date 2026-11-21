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

export type LearnerSupportTicketDto = {
  id: string;
  subject: string;
  category: "technical" | "billing" | "account" | "courseware" | "certification" | "general";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "pending" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
};

export type LearnerSupportTicketsResponseDto = {
  tickets: LearnerSupportTicketDto[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
};

export type LearnerSupportTicketMessageDto = {
  id: string;
  sender_role: string;
  content: string;
  attachments: string[] | null;
  created_at: string;
};

export type LearnerSupportTicketMessagesPageDto = {
  messages: LearnerSupportTicketMessageDto[];
  has_more: boolean;
  next_cursor: string | null;
};

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
// GET /api/v1/learner/courses/{course_id}/exam

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
  duration_minutes: number;
  attempt_limit: number;
  questions: QuizQuestionResponseDto[];
};

// POST /api/v1/learner/quizzes/{quiz_id}/attempts
export type QuizAttemptResponseDto = {
  id: string;
  quiz_id: string;
  attempt_number: number;
  score: number;
  answers: Record<string, string>;
  started_at: string;
  ends_at: string;
  submitted_at: string | null;
};

// PUT /api/v1/learner/quiz-attempts/{attempt_id}/answers/{question_id}
export type SaveQuizAnswerDto = {
  option_id: string;
};

// POST /api/v1/learner/projects/{project_id}/submissions
export type ProjectSubmissionCreateDto = {
  link: string;
};

export type ProjectSubmissionResponseDto = {
  id: string;
  project_id: string;
  learner_id: string;
  content: string;
  status: string;
  feedback: string | null;
  submitted_at: string;
  marked_at: string | null;
};


