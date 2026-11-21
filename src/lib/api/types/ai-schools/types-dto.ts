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
  published?: boolean;
};

export type HammetAiSchoolDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  published: boolean;
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
  published?: boolean;
};

export type HammetAiSchoolCourseDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  ai_school_id: string;
  position: number;
  price: number;
  published: boolean;
};

export type AiSchoolCoursesResponseDto = {
  courses: AiSchoolCourseDto[];
};

// GET /api/v1/hammet/ai-schools/{ai_school_id}/courses
export type HammetAiSchoolCoursesResponseDto = {
  ai_school: HammetAiSchoolDto;
  courses: HammetAiSchoolCourseDto[];
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

// PATCH /api/v1/hammet/edit/ai-school/{ai_school_id}
export type UpdateAiSchoolRequestDto = Partial<CreateAiSchoolRequestDto> & {
  id: string;
  courses?: CreateAiCourseRequestDto[];
};

export type UpdateAiSchoolResponseDto = {
  ai_school: CreateAiSchoolResponseDto;
  courses: CreateAiCourseResponseDto[] | null;
};

// ============================================================
// CREATE AI COURSE
// ============================================================

// Sent through PATCH /api/v1/hammet/edit/ai-school/{ai_school_id} as courses[]
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
  modules: AiModuleDto[] | null;
};

// ============================================================
// UPDATE AI COURSE
// ============================================================

// PATCH /api/v1/hammet/edit/ai-courses/{course_id}
export type UpdateAiCourseRequestDto = Partial<
  Pick<
    CreateAiCourseRequestDto,
    "title" | "description" | "position" | "price" | "published"
  >
> & {
  id: string;
  modules?: CreateAiModuleRequestDto[];
};

export type UpdateAiCourseResponseDto = {
  course: CreateAiCourseResponseDto;
  modules: AiModuleDto[] | null;
};

// ============================================================
// AI MODULES
// ============================================================

export type CreateAiModuleRequestDto = {
  title: string;
  description: string;
  course_id: string;
  position: number;
  masterclass?: string;
};

export type AiModuleDto = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  position: number;
  masterclass: string | null;
  resources: AiResourceDto[] | null;
  projects?: AiProjectDto[] | null;
  quizzes?: string[] | null;
  created_at: string;
  updated_at: string | null;
};

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}
export type UpdateAiModuleRequestDto = Partial<
  Pick<
    CreateAiModuleRequestDto,
    "title" | "description" | "position" | "masterclass"
  >
> & {
  id: string;
  resources?: CreateAiResourceRequestDto[];
  projects?: CreateAiProjectRequestDto[];
};

// ============================================================
// AI RESOURCES
// ============================================================

export type CreateAiResourceRequestDto = {
  title: string;
  resource_type: "document" | "article" | "link" | "video";
  module_id: string;
  url: string;
  position: number;
};

export type AiResourceDto = {
  id?: string;
  module_id?: string;
  title: string;
  resource_type: string;
  url: string;
  position: number;
};

export type CreateAiProjectRequestDto = {
  title: string;
  module_id: string;
  description: string;
  instructions: string;
  position: number;
};

export type AiProjectDto = {
  id: string;
  module_id?: string;
  title: string;
  description: string;
  instructions: string;
  position: number;
};

export type UpdateAiResourceRequestDto = Partial<
  Pick<CreateAiResourceRequestDto, "title" | "resource_type" | "url" | "position">
>;

export type UpdateAiProjectRequestDto = Partial<
  Pick<CreateAiProjectRequestDto, "title" | "description" | "instructions" | "position">
>;

export type HammetAiModuleContentDto = Omit<AiModuleDto, "quizzes"> & {
  resources: AiResourceDto[];
  projects: AiProjectDto[];
  quizzes: AiQuizDto[];
};

// ============================================================
// AI QUIZZES
// ============================================================

// PATCH /api/v1/hammet/edit/ai-modules/{module_id}/quiz/add
export type AddAiQuizRequestDto = {
  title: string;
  description: string;
  position: number;
  passing_score: number;
  is_exam: boolean;
  questions: {
    question: string;
    position: number;
    options: { text: string; position: number; is_correct: boolean }[];
  }[];
};

export type EditAiQuizRequestDto = Omit<AddAiQuizRequestDto, "questions"> & {
  questions: ({
    id?: string;
    question: string;
    position: number;
    options: ({
      id?: string;
      text: string;
      position: number;
      is_correct: boolean;
    })[];
  })[];
};

export type AiQuizDto = {
  id: string;
  title: string;
  description: string;
  position: number;
  passing_score: number;
  is_exam: boolean;
  questions: {
    id: string;
    quiz_id: string;
    question: string;
    position: number;
    options: {
      id: string;
      question_id: string;
      text: string;
      position: number;
      is_correct: boolean;
    }[];
  }[];
};
