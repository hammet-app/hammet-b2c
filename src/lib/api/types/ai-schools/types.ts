import { Pagination } from "../support";

// ============================================================
// AI SCHOOLS
// ============================================================

// GET /api/v1/learner/ai-schools
export type AiSchool = {
  id: string;
  name: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
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
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
  description: string;
  aiSchoolId: string;
  position: number;
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

// PATCH /api/v1/hammet/edit/ai-school/{ai_school_id}
// Every field is optional; courses listed here are created under the school.
export type UpdateAiSchoolRequest = Partial<CreateAiSchoolRequest> & {
  courses?: CreateAiCourseRequest[];
};

// courses only holds the courses created by this request.
export type UpdateAiSchoolResponse = {
  aiSchool: CreateAiSchoolResponse;
  courses: CreateAiCourseResponse[];
};

// ============================================================
// CREATE AI COURSE
// ============================================================

// Sent through PATCH /api/v1/hammet/edit/ai-school/{ai_school_id} as courses[]
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
  modules: AiModule[] | null;
};

// ============================================================
// UPDATE AI COURSE
// ============================================================

// PATCH /api/v1/hammet/edit/ai-courses/{course_id}
// Every field is optional; modules listed here are created under the course.
export type UpdateAiCourseRequest = Partial<
  Pick<
    CreateAiCourseRequest,
    "title" | "description" | "position" | "price" | "published"
  >
> & {
  modules?: CreateAiModuleRequest[];
};

// modules only holds the modules created by this request.
export type UpdateAiCourseResponse = {
  course: CreateAiCourseResponse;
  modules: AiModule[];
};

// ============================================================
// AI MODULES
// ============================================================

// Sent through PATCH /api/v1/hammet/edit/ai-courses/{course_id} as modules[]
export type CreateAiModuleRequest = {
  title: string;
  description: string;
  courseId: string;
  position: number;
  masterclass?: string;
};

export type AiModule = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  masterclass: string | null;
  resources: AiResource[];
  createdAt: string;
  updatedAt: string | null;
};

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}
// Every field is optional; resources listed here are added to the module.
export type UpdateAiModuleRequest = Partial<
  Pick<
    CreateAiModuleRequest,
    "title" | "description" | "position" | "masterclass"
  >
> & {
  resources?: CreateAiResourceRequest[];
};

// ============================================================
// AI RESOURCES
// ============================================================

export type AiResourceType = "document" | "article" | "link" | "video";

export type CreateAiResourceRequest = {
  title: string;
  resourceType: AiResourceType;
  moduleId: string;
  url: string;
  position: number;
};

export type AiResource = {
  title: string;
  resourceType: string;
  url: string;
  position: number;
};

// ============================================================
// AI QUIZZES
// ============================================================

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}/quiz/add
// The backend requires exactly 4 options per question.
export type AddAiQuizRequest = {
  title: string;
  description: string;
  position: number;
  passingScore: number;
  isExam: boolean;
  questions: {
    question: string;
    position: number;
    options: { text: string; position: number; isCorrect: boolean }[];
  }[];
};

// The response leaves out position, passing_score and is_correct.
export type AiQuiz = {
  id: string;
  title: string;
  description: string;
  isExam: boolean;
  questions: {
    id: string;
    quizId: string;
    question: string;
    position: number;
    options: {
      id: string;
      questionId: string;
      text: string;
      position: number;
    }[];
  }[];
};
