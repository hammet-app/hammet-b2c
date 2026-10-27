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

export type CourseModuleResource = {
  id: string;
  title: string;
  resourceType: string;
  url: string;
  position: number;
};

export type CourseModuleProject = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  position: number;
};

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
  resources: CourseModuleResource[];
  projects: CourseModuleProject[];
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

// ============================================================
// LEARNER MODULE QUIZ
// ============================================================

// GET /api/v1/learner/modules/{module_id}/quiz

export type QuizOption = {
  id: string;
  questionId: string;
  text: string;
  position: number;
};

export type QuizQuestion = {
  id: string;
  quizId: string;
  question: string;
  position: number;
  options: QuizOption[];
};

export type LearnerQuiz = {
  id: string;
  title: string;
  description: string;
  isExam: boolean;
  questions: QuizQuestion[];
};

// POST /api/v1/learner/quizzes/{quiz_id}/attempts
export type QuizAttempt = {
  id: string;
  quizId: string;
  attemptNumber: number;
  score: number;
  answers: Record<string, string>;
  startedAt: string;
  submittedAt: string | null;
};

// PUT /api/v1/learner/quiz-attempts/{attempt_id}/answers/{question_id}
export type SaveQuizAnswer = {
  optionId: string;
};

// POST /api/v1/learner/projects/{project_id}/submissions
export type ProjectSubmissionCreate = {
  link: string;
};

export type ProjectSubmission = {
  id: string;
  projectId: string;
  learnerId: string;
  content: string;
  status: string;
  feedback: string | null;
  submittedAt: string;
  markedAt: string | null;
};


